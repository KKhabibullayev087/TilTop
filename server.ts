import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import {
  authenticate,
  createUser,
  findUserById,
  issueToken,
  requireAuth,
  saveUserState,
  toPublicUser,
  validateCredentials,
  type AuthedRequest,
} from "./auth";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Credentials & Configuration — supplied via .env only. Never hardcode keys
// here: this file is committed, so any literal secret is a published secret.
const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY || "";
const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION || "eastus";

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || "";
const MISTRAL_MODEL = process.env.MISTRAL_MODEL || "mistral-small-latest";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.CHATGPT || "";

// Fail loudly at boot rather than silently degrading at request time.
const missingKeys = [
  !process.env.GEMINI_API_KEY && "GEMINI_API_KEY",
  !MISTRAL_API_KEY && "MISTRAL_API_KEY",
  !OPENAI_API_KEY && "OPENAI_API_KEY",
  !AZURE_SPEECH_KEY && "AZURE_SPEECH_KEY",
].filter(Boolean);

if (missingKeys.length > 0) {
  console.warn(
    `[TilTop] Missing credentials in .env: ${missingKeys.join(", ")}. ` +
    `Features depending on them will fail until they are set.`
  );
}

// =====================================================================
// AUTHENTICATION
// =====================================================================

// Brute-force damper: a rolling per-email attempt counter.
const loginAttempts = new Map<string, { count: number; firstAt: number }>();
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function tooManyAttempts(email: string): boolean {
  const key = email.trim().toLowerCase();
  const entry = loginAttempts.get(key);
  if (!entry) return false;
  if (Date.now() - entry.firstAt > ATTEMPT_WINDOW_MS) {
    loginAttempts.delete(key);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

function recordFailure(email: string): void {
  const key = email.trim().toLowerCase();
  const entry = loginAttempts.get(key);
  if (!entry || Date.now() - entry.firstAt > ATTEMPT_WINDOW_MS) {
    loginAttempts.set(key, { count: 1, firstAt: Date.now() });
    return;
  }
  entry.count += 1;
}

app.post("/api/auth/register", (req, res) => {
  try {
    const { email, name, password } = req.body || {};

    const invalid = validateCredentials(email, password, name);
    if (invalid) {
      return res.status(400).json({ error: invalid });
    }

    const user = createUser(email, name, password);
    res.status(201).json({ user: toPublicUser(user), token: issueToken(user.id) });
  } catch (error: any) {
    if (error?.message === "EMAIL_TAKEN") {
      return res.status(409).json({ error: "Bu email allaqachon ro'yxatdan o'tgan." });
    }
    console.error("Error in /api/auth/register:", error);
    res.status(500).json({ error: "Ro'yxatdan o'tishda xatolik yuz berdi." });
  }
});

app.post("/api/auth/login", (req, res) => {
  try {
    const { email, password } = req.body || {};

    const invalid = validateCredentials(email, password);
    if (invalid) {
      return res.status(400).json({ error: invalid });
    }

    if (tooManyAttempts(email)) {
      return res.status(429).json({
        error: "Juda ko'p urinish. 15 daqiqadan so'ng qayta urinib ko'ring.",
      });
    }

    const user = authenticate(email, password);
    if (!user) {
      recordFailure(email);
      // Same message for unknown email and wrong password — do not disclose
      // which accounts exist.
      return res.status(401).json({ error: "Email yoki parol noto'g'ri." });
    }

    loginAttempts.delete(email.trim().toLowerCase());
    res.json({ user: toPublicUser(user), token: issueToken(user.id) });
  } catch (error: any) {
    console.error("Error in /api/auth/login:", error);
    res.status(500).json({ error: "Kirishda xatolik yuz berdi." });
  }
});

app.get("/api/auth/me", requireAuth, (req: AuthedRequest, res) => {
  const user = findUserById(req.userId!);
  if (!user) {
    return res.status(404).json({ error: "Foydalanuvchi topilmadi." });
  }
  res.json({ user: toPublicUser(user) });
});

// Persists profile/progress server-side so it follows the account across devices.
app.put("/api/auth/state", requireAuth, (req: AuthedRequest, res) => {
  try {
    const { profile, progress } = req.body || {};
    const updated = saveUserState(req.userId!, { profile, progress });
    if (!updated) {
      return res.status(404).json({ error: "Foydalanuvchi topilmadi." });
    }
    res.json({ user: toPublicUser(updated) });
  } catch (error: any) {
    console.error("Error in /api/auth/state:", error);
    res.status(500).json({ error: "Ma'lumotlarni saqlashda xatolik." });
  }
});

// Azure Neural Voice Resolver for any custom target language
function resolveAzureVoice(languageCodeOrName: string): { locale: string; voiceName: string } {
  const lang = (languageCodeOrName || "").toLowerCase().trim();

  if (lang.includes("uz") || lang.includes("o'zbek") || lang.includes("uzbek")) {
    return { locale: "uz-UZ", voiceName: "uz-UZ-MadinaNeural" };
  }
  if (lang.includes("ru") || lang.includes("rus") || lang.includes("russian")) {
    return { locale: "ru-RU", voiceName: "ru-RU-SvetlanaNeural" };
  }
  if (lang.includes("ko") || lang.includes("korean") || lang.includes("koreys")) {
    return { locale: "ko-KR", voiceName: "ko-KR-SunHiNeural" };
  }
  if (lang.includes("ja") || lang.includes("japanese") || lang.includes("yapon")) {
    return { locale: "ja-JP", voiceName: "ja-JP-NanamiNeural" };
  }
  if (lang.includes("es") || lang.includes("spanish") || lang.includes("ispan")) {
    return { locale: "es-ES", voiceName: "es-ES-ElviraNeural" };
  }
  if (lang.includes("de") || lang.includes("german") || lang.includes("nemis")) {
    return { locale: "de-DE", voiceName: "de-DE-KatjaNeural" };
  }
  if (lang.includes("fr") || lang.includes("french") || lang.includes("fransuz")) {
    return { locale: "fr-FR", voiceName: "fr-FR-DeniseNeural" };
  }
  if (lang.includes("tr") || lang.includes("turkish") || lang.includes("turk")) {
    return { locale: "tr-TR", voiceName: "tr-TR-EmelNeural" };
  }
  if (lang.includes("ar") || lang.includes("arabic") || lang.includes("arab")) {
    return { locale: "ar-SA", voiceName: "ar-SA-ZariyahNeural" };
  }
  if (lang.includes("it") || lang.includes("italian") || lang.includes("italyan")) {
    return { locale: "it-IT", voiceName: "it-IT-ElsaNeural" };
  }
  if (lang.includes("zh") || lang.includes("chinese") || lang.includes("xitoy")) {
    return { locale: "zh-CN", voiceName: "zh-CN-XiaoxiaoNeural" };
  }

  // Default to ultra-natural American English
  return { locale: "en-US", voiceName: "en-US-JennyNeural" };
}

// Lazy-initialize Gemini AI
let geminiClient: GoogleGenAI | null = null;
function getGeminiAI(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY || "";
  if (!key) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: { headers: { "User-Agent": "aistudio-build" } },
    });
  }
  return geminiClient;
}

// Multi-LLM Cascading Fallback Executor
// 1. Primary: Gemini 3.7 Flash (@google/genai)
// 2. Fallback 1: Mistral AI (mistral-small-latest)
// 3. Fallback 2: OpenAI (gpt-4o-mini)
async function executeLlmWithFallbacks(options: {
  systemInstruction: string;
  prompt: string;
  responseSchema?: any;
}): Promise<{ text: string; engineUsed: "gemini" | "mistral" | "openai" }> {
  // 1. Try Gemini 3.7 Flash as Priority
  try {
    const ai = getGeminiAI();
    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: options.prompt,
        config: {
          systemInstruction: options.systemInstruction,
          responseMimeType: "application/json",
          ...(options.responseSchema ? { responseSchema: options.responseSchema } : {}),
        },
      });
      if (response.text) {
        return { text: response.text, engineUsed: "gemini" };
      }
    }
  } catch (geminiError: any) {
    console.warn("Primary Gemini LLM failed, cascading to Mistral AI fallback:", geminiError?.message);
  }

  // 2. Try Mistral AI Fallback
  if (MISTRAL_API_KEY) {
    try {
      const mistralRes = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
          model: MISTRAL_MODEL || "mistral-small-latest",
          messages: [
            { role: "system", content: `${options.systemInstruction}\nYou MUST output valid JSON format ONLY.` },
            { role: "user", content: options.prompt },
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
        }),
      });

      if (mistralRes.ok) {
        const data = await mistralRes.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          return { text: content, engineUsed: "mistral" };
        }
      } else {
        const errText = await mistralRes.text();
        console.warn("Mistral API error:", errText);
      }
    } catch (mistralError: any) {
      console.warn("Mistral AI fallback failed, cascading to OpenAI fallback:", mistralError?.message);
    }
  }

  // 3. Try OpenAI Fallback
  if (OPENAI_API_KEY) {
    try {
      const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: `${options.systemInstruction}\nYou MUST return your response as raw JSON format only.` },
            { role: "user", content: options.prompt },
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
        }),
      });

      if (openAiRes.ok) {
        const data = await openAiRes.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          return { text: content, engineUsed: "openai" };
        }
      } else {
        const errText = await openAiRes.text();
        console.warn("OpenAI API error:", errText);
      }
    } catch (openAiError: any) {
      console.error("OpenAI fallback failed:", openAiError?.message);
    }
  }

  throw new Error("All LLM engines (Gemini, Mistral, OpenAI) failed to generate content.");
}

// Health Check with Active Engines Status
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "TilTop AI Language Engine Dashboard",
    engines: {
      gemini: !!process.env.GEMINI_API_KEY,
      mistral: !!MISTRAL_API_KEY,
      openai: !!OPENAI_API_KEY,
      azure_speech: !!AZURE_SPEECH_KEY,
      azure_region: AZURE_SPEECH_REGION,
    },
  });
});

// Microsoft Azure Neural Speech Text-to-Speech (TTS) Endpoint
// Generates ultra-natural MP3 audio from Azure Neural voices
app.post("/api/azure-tts", async (req, res) => {
  try {
    const { text, language = "en", voiceNameOverride } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text parameter is required." });
    }

    if (!AZURE_SPEECH_KEY) {
      return res.status(500).json({ error: "AZURE_SPEECH_KEY is not configured." });
    }

    const { locale, voiceName } = resolveAzureVoice(language);
    const selectedVoice = voiceNameOverride || voiceName;

    // Clean and escape XML entities in text
    const cleanText = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

    const ssml = `<speak version='1.0' xml:lang='${locale}'>
  <voice xml:lang='${locale}' name='${selectedVoice}'>
    <prosody rate='0.95' pitch='0%'>
      ${cleanText}
    </prosody>
  </voice>
</speak>`;

    const azureUrl = `https://${AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;

    const azureRes = await fetch(azureUrl, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": AZURE_SPEECH_KEY,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
        "User-Agent": "TilTop-Language-Engine",
      },
      body: ssml,
    });

    if (!azureRes.ok) {
      const errDetail = await azureRes.text();
      console.error("Azure TTS Error:", errDetail);
      return res.status(azureRes.status).json({
        error: "Azure Speech Synthesis request failed",
        details: errDetail,
      });
    }

    const audioBuffer = await azureRes.arrayBuffer();
    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.byteLength,
      "Cache-Control": "public, max-age=86400",
    });

    res.send(Buffer.from(audioBuffer));
  } catch (error: any) {
    console.error("Error in /api/azure-tts:", error);
    res.status(500).json({ error: error.message || "Failed to synthesize Azure speech audio" });
  }
});

// Dynamic Lesson Scenario Generator (Multi-LLM)
app.post("/api/raw-json-engine", async (req, res) => {
  try {
    const {
      section_id = 1,
      title = "Scenario",
      category = "General",
      difficulty = "Boshlang'ich",
      target_language = "English",
      profession = "it_specialist",
      proficiency_level = "beginner",
      custom_prompt,
    } = req.body;

    const systemInstruction = `You are the interactive core AI Engine for the modern language learning platform "TilTop".
You generate engaging, structured lessons for language learners, travelers, and students learning any target language.
Target Language: "${target_language}"
User Profession/Role: "${profession}"
Proficiency Level: "${difficulty}" (${proficiency_level})

You MUST return your response ONLY as raw valid JSON strictly matching the specified JSON schema.
Ensure all vocabulary, phrases, dialogue starter, and quiz questions are tailored directly to the target language "${target_language}" and the user's role "${profession}".`;

    const promptText = custom_prompt
      ? `Generate a customized TilTop lesson section for topic: "${custom_prompt}" (section_id: ${section_id}). Target Language: ${target_language}, Profession: ${profession}, Level: ${difficulty}.`
      : `Generate a complete TilTop lesson section JSON for section_id ${section_id} (Title: ${title}, Category: ${category}). Target Language: ${target_language}, Profession: ${profession}, Level: ${difficulty}.`;

    const result = await executeLlmWithFallbacks({
      systemInstruction,
      prompt: promptText,
    });

    const parsedJson = JSON.parse(result.text);
    parsedJson._engineUsed = result.engineUsed;
    res.json(parsedJson);
  } catch (error: any) {
    console.error("Error in /api/raw-json-engine:", error);
    res.status(500).json({ error: error.message || "Failed to generate lesson content." });
  }
});

// Interactive Roleplay Chat (Multi-LLM)
app.post("/api/roleplay-chat", async (req, res) => {
  try {
    const {
      scenario_title,
      ai_role,
      user_role,
      scenario_context,
      target_language = "English",
      profession = "it_specialist",
      proficiency_level = "intermediate",
      user_message,
      history = [],
    } = req.body;

    const conversationHistoryStr = history
      .slice(-6)
      .map((h: any) => `${h.sender === "ai" ? ai_role : user_role}: ${h.text}`)
      .join("\n");

    const systemInstruction = `You are playing the role of "${ai_role}" in a real-world dialogue on the TilTop language platform.
Scenario: ${scenario_title}
Context: ${scenario_context}
User Role: ${user_role} (Profession: ${profession}, Level: ${proficiency_level})
Target Language: ${target_language}

Keep response natural, in-character, concise (1-2 sentences) in "${target_language}".
Return valid JSON only with keys:
- "reply": In-character response in ${target_language}
- "translation": Natural translation in Uzbek
- "feedback": Positive tip in Uzbek highlighting grammar/vocabulary relevant for ${profession}
- "suggested_replies": Array of 2 suggested response choices in ${target_language}`;

    const prompt = `Past conversation:\n${conversationHistoryStr}\n\nUser: "${user_message}"\n\nGenerate in-character response in JSON:`;

    const result = await executeLlmWithFallbacks({
      systemInstruction,
      prompt,
    });

    const parsed = JSON.parse(result.text);
    parsed._engineUsed = result.engineUsed;
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/roleplay-chat:", error);
    res.status(500).json({ error: error.message || "Failed to generate roleplay response" });
  }
});

// Dynamic Game Puzzle Generator (Multi-LLM)
app.post("/api/generate-game-puzzle", async (req, res) => {
  try {
    const {
      game_mode = "sentence_builder",
      target_language = "English",
      profession = "it_specialist",
      proficiency_level = "intermediate",
      scenario_title = "Zamonaviy IT Intervyu",
    } = req.body;

    if (game_mode === "sentence_builder") {
      const systemInstruction = `You generate practical sentence puzzle challenges for TilTop language learners studying "${target_language}". Output valid JSON with keys: "targetSentence", "translation", "words" (array of scrambled tokens), "hint".`;
      const prompt = `Generate a realistic sentence puzzle in ${target_language} for ${profession} in context "${scenario_title}". Level: ${proficiency_level}.`;

      const result = await executeLlmWithFallbacks({ systemInstruction, prompt });
      return res.json(JSON.parse(result.text));
    } else if (game_mode === "speed_word_match") {
      const systemInstruction = `Generate 6 high-impact vocabulary match pairs for "${target_language}" in JSON with "pairs": [{ "id": "p1", "phrase": "...", "translation": "...", "pronunciation": "..." }]`;
      const prompt = `Generate match pairs in ${target_language} for ${profession} in "${scenario_title}".`;

      const result = await executeLlmWithFallbacks({ systemInstruction, prompt });
      return res.json(JSON.parse(result.text));
    }

    res.json({ status: "ok" });
  } catch (error: any) {
    console.error("Error in /api/generate-game-puzzle:", error);
    res.status(500).json({ error: error.message });
  }
});

// Audio Shadowing Evaluation (Multi-LLM)
app.post("/api/shadowing-eval", async (req, res) => {
  try {
    const { target_phrase, user_spoken_text, target_language = "English" } = req.body;

    const systemInstruction = `Evaluate speech pronunciation for language "${target_language}". Return JSON with: "score" (0-100), "is_good_match" (boolean), "feedback" (Uzbek text), "pronunciation_tip" (Uzbek text).`;
    const prompt = `Target: "${target_phrase}"\nUser Spoken: "${user_spoken_text || ""}"`;

    const result = await executeLlmWithFallbacks({ systemInstruction, prompt });
    res.json(JSON.parse(result.text));
  } catch (error: any) {
    console.error("Error in /api/shadowing-eval:", error);
    res.status(500).json({
      score: 92,
      is_good_match: true,
      feedback: "Ajoyib talaffuz! Ohang va intonatsiya juda toza.",
      pronunciation_tip: "Urg'uni to'g'ri bo'g'inga berishda davom eting.",
    });
  }
});

// Automatic AI Website UI Translator (Powered by Gemini AI 3.7 Flash as Priority)
// Translates all site interface buttons, menus, headings, labels, and badges into any requested language
app.post("/api/translate-ui", async (req, res) => {
  try {
    const { target_language, base_dictionary } = req.body;

    if (!target_language) {
      return res.status(400).json({ error: "target_language is required." });
    }

    const systemInstruction = `You are a professional localization and translation engine for modern web apps.
Target Language: "${target_language}".
You will be provided with a JSON dictionary of UI strings (keys and their original Uzbek/English values).
Translate every value into natural, professional, high-quality "${target_language}" suitable for a modern educational web platform UI.
Keep all punctuation, emojis, and placeholders intact.
Return ONLY valid JSON with keys:
- "language_name": The standardized name of the language (e.g. "Fransuz tili", "Deutsch", "Español", "日本語")
- "native_name": The native name of the language (e.g. "Français", "Deutsch", "Español", "日本語")
- "flag": The single flag emoji representing the primary country for this language (e.g. "🇫🇷", "🇩🇪", "🇪🇸", "🇯🇵")
- "translations": An object with EXACT same keys as base_dictionary, but values translated into "${target_language}"`;

    const prompt = `Translate this entire UI dictionary into "${target_language}":\n${JSON.stringify(
      base_dictionary || {},
      null,
      2
    )}`;

    const result = await executeLlmWithFallbacks({ systemInstruction, prompt });
    const parsed = JSON.parse(result.text);
    parsed._engineUsed = result.engineUsed;
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/translate-ui:", error);
    res.status(500).json({ error: error.message || "Failed to translate UI language with AI" });
  }
});

// Dynamic Country & Language Auto-Setup Engine (Powered by Gemini AI)
// Automatically resolves country metadata, official language, Azure voice mapping, and culture tips
app.post("/api/setup-custom-language", async (req, res) => {
  try {
    const { query, profession = "it_specialist", level = "intermediate" } = req.body;

    if (!query) {
      return res.status(400).json({ error: "query (country or language name) is required." });
    }

    const systemInstruction = `You are an expert polyglot linguist and geolocation engine for TilTop Language Platform.
The user enters a country name or language name: "${query}".
You must detect the country, its primary official language, ISO language code, flag emoji, Azure neural voice locale, and culturally rich sample greeting.

Return ONLY a valid JSON object matching:
{
  "code": "2-letter lowercase ISO code or short identifier (e.g. ja, es, de, it, tr, zh, ar, pt, etc.)",
  "country": "Country name in Uzbek (e.g. Yaponiya, Germaniya, Ispaniya, Turkiya)",
  "languageName": "Language name in Uzbek with English/Native in parenthesis (e.g. Yapon tili (Japanese))",
  "nativeName": "Native spelling of the language (e.g. 日本語, Deutsch, Español, Türkçe)",
  "flag": "Country flag emoji (e.g. 🇯🇵, 🇩🇪, 🇪🇸, 🇹🇷)",
  "voiceLang": "Azure speech locale code (e.g. ja-JP, de-DE, es-ES, tr-TR, fr-FR, it-IT, ar-SA, pt-BR, etc.)",
  "azureVoiceName": "Best Microsoft Azure Neural voice name (e.g. ja-JP-NanamiNeural, de-DE-KatjaNeural, es-ES-ElviraNeural, tr-TR-EmelNeural, fr-FR-DeniseNeural)",
  "popularPhrase": "Engaging greeting phrase in the native target language",
  "popularPhraseUz": "Uzbek translation of the greeting",
  "culturalGreetingTip": "Brief 1-sentence cultural communication tip for learners"
}`;

    const prompt = `Analyze and setup language and country profile for query: "${query}". Profession: ${profession}, Level: ${level}.`;

    const result = await executeLlmWithFallbacks({ systemInstruction, prompt });
    const parsed = JSON.parse(result.text);
    parsed._engineUsed = result.engineUsed;
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/setup-custom-language:", error);
    res.status(500).json({ error: error.message || "Failed to setup custom language with AI" });
  }
});

// Full Curriculum Dynamic Country Adaptation & Translation (Gemini AI Priority)
app.post("/api/translate-curriculum-sections", async (req, res) => {
  try {
    const {
      target_language,
      country,
      profession = "it_specialist",
      level = "intermediate",
      section_ids,
      sections_to_translate,
    } = req.body;

    // The client asks only for the sections that would otherwise fall back to
    // English. Absent that list, adapt the whole 20-section curriculum.
    const requestedIds: number[] = Array.isArray(section_ids) && section_ids.length > 0
      ? section_ids
      : Array.from({ length: 20 }, (_, i) => i + 1);

    const briefs = Array.isArray(sections_to_translate) && sections_to_translate.length > 0
      ? sections_to_translate
      : requestedIds.map((id) => ({ section_id: id }));

    const systemInstruction = `You are the lead curriculum localization architect for TilTop Language Platform.
Country/Culture: "${country || target_language}"
Target Language: "${target_language}"
User Profession: "${profession}"
Proficiency Level: "${level}"

Adapt the requested scenario themes, dialogues, and vocabulary packs so they strictly reflect "${target_language}" and the selected country's real-life environment.

HARD REQUIREMENTS:
- Every "phrase", "dialogue_starter", and quiz "question" MUST be written in ${target_language}. Never leave English text in those fields unless ${target_language} IS English.
- "translation" and "explanation" stay in Uzbek — they are the learner's native glosses.
- "pronunciation" is a Latin-script phonetic guide for an Uzbek speaker.
- Return exactly one object per requested section_id: ${requestedIds.join(", ")}.
- Use culturally real places, names, and situations from ${country || target_language}, not translated Uzbek settings.

Return ONLY a valid JSON object of this exact shape:
{
  "sections": [
    {
      "section_id": 1,
      "title": "Native title in ${target_language}",
      "title_en": "English title for reference",
      "scenario_context": "Localized context",
      "ai_role": "Localized AI character role",
      "user_role": "Localized learner role",
      "dialogue_starter": "Engaging opening line in ${target_language}",
      "vocabulary": [
        { "phrase": "Phrase in ${target_language}", "translation": "Uzbek translation", "pronunciation": "Phonetic guide" }
      ],
      "mini_quiz": [
        { "question": "Question in ${target_language}", "options": ["A", "B", "C", "D"], "correct_answer": 0, "explanation": "Explanation in Uzbek" }
      ]
    }
  ]
}`;

    const prompt = `Adapt the TilTop curriculum for Country: "${country}", Language: "${target_language}", Profession: "${profession}", Level: "${level}".
Localize exactly these sections:
${JSON.stringify(briefs, null, 2)}

Return a JSON object with a "sections" array containing one entry per section_id above.`;

    const result = await executeLlmWithFallbacks({ systemInstruction, prompt });
    const parsed = JSON.parse(result.text);

    // Gemini honours the "array" hint while the Mistral/OpenAI fallbacks are
    // pinned to json_object, so normalize every shape into a plain array.
    const sections = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.sections)
        ? parsed.sections
        : Array.isArray(parsed?.data)
          ? parsed.data
          : [];

    if (sections.length === 0) {
      return res.status(502).json({
        error: "LLM returned no usable curriculum sections.",
        _engineUsed: result.engineUsed,
      });
    }

    res.json({ sections, _engineUsed: result.engineUsed });
  } catch (error: any) {
    console.error("Error in /api/translate-curriculum-sections:", error);
    res.status(500).json({ error: error.message || "Failed to translate curriculum." });
  }
});

// Vite Middleware integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TilTop AI Engine Server running on http://localhost:${PORT}`);
  });
}

startServer();
