import { LanguageCode } from '../types';

export function speakPhrase(text: string, langCode: LanguageCode = 'en') {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  window.speechSynthesis.cancel(); // Stop any ongoing speech

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set appropriate BCP-47 language tag
  switch (langCode) {
    case 'uz':
      utterance.lang = 'uz-UZ';
      break;
    case 'en':
      utterance.lang = 'en-US';
      break;
    case 'ru':
      utterance.lang = 'ru-RU';
      break;
    case 'ko':
      utterance.lang = 'ko-KR';
      break;
    default:
      utterance.lang = 'en-US';
  }

  utterance.rate = 0.9; // Slightly slower for language learners
  utterance.pitch = 1.0;

  window.speechSynthesis.speak(utterance);
}

export function createSpeechRecognizer(
  langCode: LanguageCode = 'en',
  onResult: (text: string) => void,
  onError?: (err: any) => void
) {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) {
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;

  switch (langCode) {
    case 'uz':
      recognition.lang = 'uz-UZ';
      break;
    case 'en':
      recognition.lang = 'en-US';
      break;
    case 'ru':
      recognition.lang = 'ru-RU';
      break;
    case 'ko':
      recognition.lang = 'ko-KR';
      break;
    default:
      recognition.lang = 'en-US';
  }

  recognition.onresult = (event: any) => {
    if (event.results && event.results[0] && event.results[0][0]) {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    }
  };

  recognition.onerror = (event: any) => {
    if (onError) onError(event);
  };

  return recognition;
}
