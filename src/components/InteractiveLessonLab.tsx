import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Volume2, 
  Send, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Trophy, 
  BookOpen, 
  MessageSquare, 
  Gamepad2, 
  Code2, 
  Bot, 
  User, 
  SlidersHorizontal,
  Lightbulb,
  VolumeX,
  Radio,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  LessonSection, 
  UserProfile, 
  ChatMessage 
} from '../types';
import { 
  PROFESSION_OPTIONS, 
  PROFICIENCY_OPTIONS 
} from '../data/curriculum';
import { playAzureNeuralTts, stopAzureAudio } from '../utils/audioPlayer';
import { useI18n } from '../utils/i18n';

interface InteractiveLessonLabProps {
  section: LessonSection;
  targetLanguage: string;
  userProfile: UserProfile;
  onBack: () => void;
  onCompleteSection: (sectionId: number, earnedXp: number) => void;
  onViewJson: (section: LessonSection) => void;
  onOpenGames: (section: LessonSection) => void;
}

export const InteractiveLessonLab: React.FC<InteractiveLessonLabProps> = ({
  section,
  targetLanguage,
  userProfile,
  onBack,
  onCompleteSection,
  onViewJson,
  onOpenGames,
}) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'vocabulary' | 'dialogue' | 'quiz'>('vocabulary');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const curProf = PROFESSION_OPTIONS.find((p) => p.id === userProfile.profession) || PROFESSION_OPTIONS[0];
  const curLvl = PROFICIENCY_OPTIONS.find((l) => l.id === userProfile.level) || PROFICIENCY_OPTIONS[0];

  // Stop audio when unmounting
  useEffect(() => {
    return () => {
      stopAzureAudio();
    };
  }, []);

  // Explicit Audio Trigger (Azure Neural TTS) - ONLY on user button click!
  const handlePlayAudio = (id: string, text: string) => {
    if (playingAudioId === id) {
      stopAzureAudio();
      setPlayingAudioId(null);
      return;
    }

    setPlayingAudioId(id);
    playAzureNeuralTts(
      text,
      targetLanguage,
      () => setPlayingAudioId(id),
      () => setPlayingAudioId(null),
      () => setPlayingAudioId(null)
    );
  };

  // Dialogue Roleplay State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-starter-1',
      sender: 'ai',
      text: section.dialogue_starter,
      translation: "Assalomu alaykum! Ssenariy bo'yicha muloqotni boshlaymizmi?",
      timestamp: Date.now(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isAiReplying, setIsAiReplying] = useState<boolean>(false);
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([
    "Hello! Glad to meet you.",
    "Could you clarify this in detail?",
  ]);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Re-initialize starter message when section or target language changes
  useEffect(() => {
    setChatMessages([
      {
        id: `msg-starter-${Date.now()}`,
        sender: 'ai',
        text: section.dialogue_starter,
        translation: `${section.title} bo'yicha muloqotni boshlaymizmi?`,
        timestamp: Date.now(),
      },
    ]);
    if (section.vocabulary && section.vocabulary.length > 0) {
      setSuggestedReplies(section.vocabulary.slice(0, 2).map((v) => v.phrase));
    }
    setSelectedAnswers({});
    setQuizSubmitted(false);
  }, [section.section_id, section.dialogue_starter, targetLanguage]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiReplying]);

  const handleSendMessage = async (textToSend?: string) => {
    const message = (textToSend || inputMessage).trim();
    if (!message || isAiReplying) return;

    const userMsgObj: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: message,
      timestamp: Date.now(),
    };

    setChatMessages((prev) => [...prev, userMsgObj]);
    setInputMessage('');
    setIsAiReplying(true);

    try {
      const res = await fetch('/api/roleplay-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario_title: section.title,
          ai_role: section.ai_role,
          user_role: section.user_role,
          scenario_context: section.scenario_context,
          target_language: targetLanguage,
          profession: userProfile.profession,
          proficiency_level: userProfile.level,
          user_message: message,
          history: chatMessages.map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      const data = await res.json();
      const aiMsgObj: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || "Great response! Let's continue the conversation.",
        translation: data.translation || "Ajoyib javob! Suhbatni davom ettiramiz.",
        feedback: data.feedback,
        timestamp: Date.now(),
      };

      // In accordance with Audio Playback Logic Rule 6:
      // DO NOT automatically play audio upon AI generation.
      // Clean formatted text is provided with an explicit "Pronunciation / Listen" button!
      setChatMessages((prev) => [...prev, aiMsgObj]);
      if (data.suggested_replies && Array.isArray(data.suggested_replies)) {
        setSuggestedReplies(data.suggested_replies);
      }
    } catch (err) {
      const fallbackAi: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Thank you! As a ${curProf.titleUz}, this scenario practice is essential.`,
        translation: "Rahmat! Ushbu muloqot mashg'uloti amaliyot uchun juda muhim.",
        feedback: "Gap tuzilishi to'g'ri. Mavzuni davom ettiring!",
        timestamp: Date.now(),
      };
      setChatMessages((prev) => [...prev, fallbackAi]);
    } finally {
      setIsAiReplying(false);
    }
  };

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  const handleSelectAnswer = (qIndex: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
  };

  const handleGradeQuiz = () => {
    let score = 0;
    section.mini_quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct_answer) {
        score += 1;
      }
    });

    setQuizScore(score);
    setQuizSubmitted(true);

    if (score === section.mini_quiz.length) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      onCompleteSection(section.section_id, section.xp_reward);
    }
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  return (
    <div id="interactive-lesson-lab" className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-in fade-in duration-200">
      
      {/* Top Navigation & Scenario Header */}
      <div className="bg-surface rounded-xl border border-line p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-sunken hover:bg-line text-ink-muted text-xs font-bold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('lab.back_to_scenarios', "Ssenariylarga qaytish")}</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-xl bg-accent-50 text-accent-700 border border-accent-200">
                #{section.section_id}
              </span>
              <span className="text-xs font-bold text-ink-muted uppercase">
                {section.category}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-ink leading-tight mt-0.5">
              {section.title}
            </h2>
            {section.is_localized === false && (
              <div className="flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold w-fit">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span>
                  {t('lab.not_localized', "Bu dars hali tanlangan tilga moslashtirilmagan — ingliz tilida ko'rsatilmoqda")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Badges & Actions */}
        <div className="flex items-center gap-2">
          
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-50 border border-accent-100 text-accent-900 text-xs font-bold">
            <SlidersHorizontal className="w-3.5 h-3.5 text-accent-600" />
            <span>{curProf.titleUz} ({curLvl.levelCode})</span>
          </div>

          <button
            onClick={() => onOpenGames(section)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-50 hover:bg-accent-100 border border-accent-200 text-accent-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>{t('lab.games_button', "O'yinlar")}</span>
          </button>

          <button
            onClick={() => onViewJson(section)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-sunken hover:bg-line border border-line text-ink-muted text-xs font-mono font-bold transition-colors cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>

        </div>

      </div>

      {/* Lab Tabs (Lug'at | AI Dialog Rol O'yini | Mini Test) */}
      <div className="flex items-center gap-2 bg-surface-sunken p-1.5 rounded-lg border border-line">
        
        <button
          onClick={() => setActiveTab('vocabulary')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'vocabulary'
              ? 'bg-surface text-ink '
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          <BookOpen className="w-4 h-4 text-accent-600" />
          <span>{t('lab.tab_vocab', "1. Asosiy Lug'at")} ({section.vocabulary.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('dialogue')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'dialogue'
              ? 'bg-surface text-ink '
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-accent-600" />
          <span>{t('lab.tab_dialogue', "2. Jonli Rol O'yini")}</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'quiz'
              ? 'bg-surface text-ink '
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>{t('lab.tab_quiz', "3. Mini Test")} (+{section.xp_reward} XP)</span>
        </button>

      </div>

      {/* ======================================================= */}
      {/* TAB 1: VOCABULARY LIST WITH AZURE NEURAL TTS */}
      {/* ======================================================= */}
      {activeTab === 'vocabulary' && (
        <div className="bg-surface rounded-xl border border-line p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-ink">
                Ushbu ssenariy uchun asosiy iboralar
              </h3>
              <p className="text-xs text-ink-muted mt-0.5">
                Microsoft Azure Neural TTS orqali ultra-tabiiy talaffuzni eshiting.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-accent-700 bg-accent-50 px-3 py-1 rounded-full border border-accent-200 flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-accent-600" />
                <span>Azure Neural Audio</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.vocabulary.map((item, idx) => {
              const audioId = `vocab-${idx}`;
              const isPlaying = playingAudioId === audioId;

              return (
                <div
                  key={audioId}
                  className="p-4 rounded-lg border border-line bg-surface-muted/50 hover:bg-surface hover:border-accent-300 hover: transition-all flex flex-col justify-between gap-3 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-base font-semibold text-ink leading-snug group-hover:text-accent-700 transition-colors">
                        "{item.phrase}"
                      </h4>
                      <p className="text-xs font-mono text-accent-600 mt-1">
                        🗣️ {item.pronunciation}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePlayAudio(audioId, item.phrase)}
                      title={t('lab.listen_hint', 'Talaffuzni eshitish')}
                      className={`p-2.5 rounded-lg border transition-all  flex items-center gap-1.5 text-xs font-bold cursor-pointer ${
                        isPlaying
                          ? 'bg-accent-600 text-white border-accent-600 ring-2 ring-accent-300 '
                          : 'bg-surface border-line group-hover:bg-accent-50 group-hover:border-accent-300 text-ink-muted'
                      }`}
                    >
                      <Volume2 className={`w-4 h-4 ${isPlaying ? 'text-white animate-bounce' : 'text-accent-600'}`} />
                      <span className="hidden sm:inline">{isPlaying ? "Eshitilmoqda" : "Tinglash"}</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-line flex items-center justify-between text-xs text-ink-muted">
                    <span className="font-semibold text-ink-muted">{item.translation}</span>
                    {item.professionNote && (
                      <span className="text-[10px] text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200 font-medium truncate max-w-[160px]">
                        💡 {item.professionNote}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setActiveTab('dialogue')}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-accent-600 hover:bg-accent-500 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              <span>{t('lab.go_roleplay', "Jonli rol o'yiniga o'tish")}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* TAB 2: AI DIALOGUE ROLEPLAY WITH EXPLICIT AZURE TTS TRIGGER */}
      {/* ======================================================= */}
      {activeTab === 'dialogue' && (
        <div className="bg-surface rounded-xl border border-line overflow-hidden flex flex-col min-h-[520px]">
          
          {/* Header Info */}
          <div className="p-4 bg-surface-muted border-b border-line flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-ink-muted">{t('lab.ai_partner', "AI Hamkor")}:</span>
              <span className="font-bold text-accent-700 bg-accent-50 px-2.5 py-0.5 rounded-lg border border-accent-100">
                {section.ai_role}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-ink-muted">{t('lab.your_role', "Sizning rolingiz")}:</span>
              <span className="font-bold text-accent-700 bg-accent-50 px-2.5 py-0.5 rounded-lg border border-accent-100">
                {section.user_role} ({curProf.titleUz})
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[430px]">
            {chatMessages.map((msg) => {
              const isUser = msg.sender === 'user';
              const isPlaying = playingAudioId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-bold  ${
                    isUser ? 'bg-accent-600' : 'bg-accent-600'
                  }`}>
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className={`max-w-[82%] space-y-1.5 ${isUser ? 'text-right' : ''}`}>
                    <div className={`p-4 rounded-lg text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-accent-600 text-white rounded-tr-none'
                        : 'bg-surface-sunken text-ink rounded-tl-none border border-line'
                    }`}>
                      <p className="font-semibold">{msg.text}</p>
                      
                      {msg.translation && (
                        <p className={`text-[11px] mt-1 pt-1 border-t ${
                          isUser ? 'border-accent-500 text-accent-100' : 'border-line text-ink-muted'
                        }`}>
                          {msg.translation}
                        </p>
                      )}
                    </div>

                    {/* Explicit Azure Speech TTS Listen button (User-Triggered ONLY) */}
                    {!isUser && (
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(msg.id, msg.text)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-[11px] font-bold transition-all shadow-2xs cursor-pointer ${
                          isPlaying
                            ? 'bg-accent-600 text-white border-accent-600 '
                            : 'bg-surface hover:bg-accent-50 text-ink-muted border-line hover:border-accent-300'
                        }`}
                      >
                        <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'text-white' : 'text-accent-600'}`} />
                        <span>{isPlaying ? t('lab.pronouncing', "Talaffuz qilinmoqda...") : t('lab.listen_audio', "Talaffuzni Eshitish")}</span>
                      </button>
                    )}

                    {msg.feedback && (
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 text-left flex items-start gap-2">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span>{msg.feedback}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isAiReplying && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-accent-600 flex items-center justify-center text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3.5 rounded-lg bg-surface-sunken border border-line text-xs text-ink-muted flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-500 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-accent-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-accent-500 animate-bounce [animation-delay:0.4s]" />
                  <span>{t('lab.ai_generating', "AI javob tayyorlamoqda...")}</span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Quick Suggestions */}
          {suggestedReplies.length > 0 && (
            <div className="px-4 py-2 bg-surface-muted border-t border-line flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase text-ink-subtle">{t('lab.suggested_replies', "Taklif etilgan javoblar")}:</span>
              {suggestedReplies.map((reply, idx) => (
                <button
                  key={`sug-${idx}`}
                  onClick={() => handleSendMessage(reply)}
                  className="px-3 py-1 rounded-xl bg-surface hover:bg-accent-50 border border-line hover:border-accent-300 text-xs text-ink-muted font-medium transition-all shadow-2xs cursor-pointer"
                >
                  "{reply}"
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <div className="p-4 bg-surface border-t border-line flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t('lab.type_message', "O'rganayotgan tilingizda javob yozing...")}
              className="flex-1 px-4 py-2.5 rounded-lg bg-surface-muted border border-line-strong text-xs sm:text-sm text-ink focus:outline-none focus:border-accent-500"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isAiReplying}
              className="p-2.5 rounded-lg bg-accent-600 hover:bg-accent-500 text-white transition-all disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* ======================================================= */}
      {/* TAB 3: MINI QUIZ (+XP REWARD) */}
      {/* ======================================================= */}
      {activeTab === 'quiz' && (
        <div className="bg-surface rounded-xl border border-line p-6 sm:p-8 space-y-6">
          
          <div className="border-b border-line pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-ink">
                Ssenariy bo'yicha mustahkamlash testi
              </h3>
              <p className="text-xs text-ink-muted mt-0.5">
                Barcha savollarga to'g'ri javob berib +{section.xp_reward} XP ball qo'lga kiriting!
              </p>
            </div>

            <span className="text-xs font-mono font-bold bg-amber-50 text-amber-800 px-3 py-1 rounded-full border border-amber-200">
              +{section.xp_reward} XP
            </span>
          </div>

          <div className="space-y-6">
            {section.mini_quiz.map((q, qIdx) => {
              const selected = selectedAnswers[qIdx];
              return (
                <div key={`q-${qIdx}`} className="space-y-3">
                  <h4 className="text-sm font-bold text-ink">
                    {qIdx + 1}. {q.question}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt, optIdx) => {
                      const isOptionSelected = selected === optIdx;
                      const isCorrect = q.correct_answer === optIdx;

                      let btnClass = "border-line bg-surface hover:bg-surface-muted text-ink-muted";
                      if (quizSubmitted) {
                        if (isCorrect) {
                          btnClass = "border-accent-500 bg-accent-50 text-accent-900 font-bold";
                        } else if (isOptionSelected && !isCorrect) {
                          btnClass = "border-red-300 bg-danger-soft text-red-900";
                        }
                      } else if (isOptionSelected) {
                        btnClass = "border-accent-600 bg-accent-50 text-accent-900 font-bold ";
                      }

                      return (
                        <button
                          key={`opt-${optIdx}`}
                          onClick={() => handleSelectAnswer(qIdx, optIdx)}
                          className={`p-3.5 rounded-lg border-2 text-left text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${btnClass}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-accent-600" />}
                          {quizSubmitted && isOptionSelected && !isCorrect && <XCircle className="w-4 h-4 text-danger" />}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && q.explanation && (
                    <p className="text-xs text-ink-muted bg-surface-muted p-2.5 rounded-xl border border-line">
                      💡 {q.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Result Actions */}
          <div className="pt-4 border-t border-line flex items-center justify-between">
            {quizSubmitted ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-ink">
                  {t('lab.result', "Natija")}: <span className="font-mono text-accent-600 font-semibold">{quizScore} / {section.mini_quiz.length}</span>
                </span>
                <button
                  onClick={resetQuiz}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-sunken hover:bg-line text-ink-muted text-xs font-bold cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t('lab.retake_quiz', "Qayta topshirish")}</span>
                </button>
              </div>
            ) : (
              <div />
            )}

            {!quizSubmitted && (
              <button
                onClick={handleGradeQuiz}
                disabled={Object.keys(selectedAnswers).length !== section.mini_quiz.length}
                className="px-6 py-2.5 rounded-xl bg-accent-600 hover:bg-accent-500 text-white font-bold text-xs sm:text-sm transition-all disabled:opacity-40 cursor-pointer"
              >
                {t('lab.grade_quiz', "Natijani Tekshirish")}
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
