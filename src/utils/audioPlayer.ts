/**
 * Microsoft Azure Neural Speech Audio Player & TTS Trigger
 * Region: eastus (Ultra-Natural Neural Text-to-Speech)
 */

let activeAudio: HTMLAudioElement | null = null;

export async function playAzureNeuralTts(
  text: string,
  targetLanguage: string,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
): Promise<void> {
  if (!text || !text.trim()) return;

  try {
    // Stop any existing audio
    if (activeAudio) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      activeAudio = null;
    }

    if (onStart) onStart();

    const response = await fetch('/api/azure-tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: text.trim(),
        language: targetLanguage,
      }),
    });

    if (!response.ok) {
      throw new Error(`Azure TTS request failed with status ${response.status}`);
    }

    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);
    activeAudio = audio;

    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      activeAudio = null;
      if (onEnd) onEnd();
    };

    audio.onerror = (e) => {
      URL.revokeObjectURL(audioUrl);
      activeAudio = null;
      console.warn("Audio playback error, falling back to Web Speech API", e);
      fallbackWebSpeech(text, targetLanguage, onEnd);
    };

    await audio.play();
  } catch (error) {
    console.warn("Azure Speech TTS failed, using browser Web Speech fallback:", error);
    fallbackWebSpeech(text, targetLanguage, onEnd);
    if (onError) onError(error);
  }
}

export function stopAzureAudio(): void {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
  }
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

function fallbackWebSpeech(text: string, language: string, onEnd?: () => void): void {
  if (!window.speechSynthesis) {
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  
  const lang = (language || "").toLowerCase();
  if (lang.includes("uz") || lang.includes("uzbek")) utterance.lang = "uz-UZ";
  else if (lang.includes("ru") || lang.includes("russian")) utterance.lang = "ru-RU";
  else if (lang.includes("ko") || lang.includes("korean")) utterance.lang = "ko-KR";
  else if (lang.includes("ja") || lang.includes("japanese")) utterance.lang = "ja-JP";
  else if (lang.includes("es") || lang.includes("spanish")) utterance.lang = "es-ES";
  else if (lang.includes("de") || lang.includes("german")) utterance.lang = "de-DE";
  else if (lang.includes("fr") || lang.includes("french")) utterance.lang = "fr-FR";
  else if (lang.includes("tr") || lang.includes("turkish")) utterance.lang = "tr-TR";
  else if (lang.includes("ar") || lang.includes("arabic")) utterance.lang = "ar-SA";
  else utterance.lang = "en-US";

  utterance.rate = 0.95;
  utterance.onend = () => {
    if (onEnd) onEnd();
  };
  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}
