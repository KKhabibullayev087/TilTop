export type LanguageCode = string;

export interface UiLanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isAiGenerated?: boolean;
}

export interface CountryLanguageOption {
  code: string;
  country: string;
  languageName: string;
  nativeName: string;
  flag: string;
  popularPhrase: string;
  popularPhraseUz: string;
  voiceLang: string;
  azureVoiceName?: string;
  culturalGreetingTip?: string;
  isAiGenerated?: boolean;
}

export type UserProfession = 
  | 'student' 
  | 'it_specialist' 
  | 'tourist' 
  | 'businessperson' 
  | 'medical_worker' 
  | 'marketer' 
  | 'engineer' 
  | 'general';

export interface ProfessionOption {
  id: UserProfession;
  title: string;
  titleUz: string;
  icon: string;
  description: string;
  bonusContext: string;
  colorClass: string;
}

export type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface ProficiencyOption {
  id: ProficiencyLevel;
  title: string;
  titleUz: string;
  levelCode: string; // A1-A2, B1-B2, C1-C2
  description: string;
  colorClass: string;
}

export interface VocabularyItem {
  phrase: string;
  translation: string;
  pronunciation: string;
  example?: string;
  professionNote?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
}

export interface LessonSection {
  section_id: number;
  title: string;
  title_en?: string;
  /**
   * True when this section's phrases actually appear in the learner's target
   * language. False means the learner is seeing the untranslated English base
   * content as a fallback, and the UI must say so.
   */
  is_localized?: boolean;
  category: string;
  difficulty: "Boshlang'ich" | "O'rta" | "Yuqori";
  duration: string;
  xp_reward: number;
  scenario_context: string;
  ai_role: string;
  user_role: string;
  icon_name?: string;
  vocabulary: VocabularyItem[];
  dialogue_starter: string;
  mini_quiz: QuizQuestion[];
  translations?: Record<string, {
    title: string;
    dialogue_starter: string;
    vocabulary: VocabularyItem[];
    mini_quiz: QuizQuestion[];
    scenario_context: string;
    ai_role: string;
    user_role: string;
  }>;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user' | 'system';
  text: string;
  translation?: string;
  feedback?: string;
  audioUrl?: string;
  isPlaying?: boolean;
  timestamp: number;
}

export interface UserProfile {
  targetLanguage: string; // Dynamic custom language (e.g. 'en', 'es', 'ja', 'Japanese', etc.)
  targetLanguageName: string; // e.g. 'English', 'Japanese', 'Uzbek'
  countryFlag: string; // e.g. '🇺🇸', '🇯🇵', '🇺🇿'
  profession: UserProfession;
  level: ProficiencyLevel;
  onboardingCompleted: boolean;
}

export interface UserProgress {
  xp: number;
  streak: number;
  completedSections: number[];
  lastActiveDate: string;
  quizScores?: Record<number, number>;
  gamesPlayed?: number;
}

export type GameMode = 
  | 'speed_word_match' 
  | 'audio_shadowing' 
  | 'scenario_roleplay' 
  | 'sentence_builder';

export interface SentencePuzzle {
  id: string;
  targetSentence: string;
  translation: string;
  words: string[];
  hint: string;
}

export interface WordMatchPair {
  id: string;
  phrase: string;
  translation: string;
  pronunciation?: string;
}

export type LlmEngineType = 'gemini' | 'mistral' | 'openai';
