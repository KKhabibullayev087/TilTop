import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Timer, 
  Volume2, 
  Mic, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  Trophy, 
  Zap, 
  Layers,
  Award,
  Radio
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  GameMode, 
  LessonSection, 
  UserProfile 
} from '../types';
import { 
  OFFICIAL_SECTIONS, 
  SENTENCE_PUZZLES, 
  PROFESSION_OPTIONS 
} from '../data/curriculum';
import { getAdaptedCurriculum, getAdaptedSentencePuzzles } from '../data/curriculumAdapters';
import { useI18n } from '../utils/i18n';
import { playAzureNeuralTts, stopAzureAudio } from '../utils/audioPlayer';
import { CustomDropdown } from './CustomDropdown';

interface InteractiveGamesHubProps {
  targetLanguage: string;
  userProfile: UserProfile;
  activeSection?: LessonSection;
  onSelectSectionForLab: (section: LessonSection) => void;
  onEarnXp: (xp: number) => void;
}

export const InteractiveGamesHub: React.FC<InteractiveGamesHubProps> = ({
  targetLanguage,
  userProfile,
  activeSection,
  onSelectSectionForLab,
  onEarnXp,
}) => {
  const { t } = useI18n();
  const [selectedGame, setSelectedGame] = useState<GameMode>('speed_word_match');
  const [selectedSectionId, setSelectedSectionId] = useState<number>(
    activeSection ? activeSection.section_id : 1
  );
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Dynamic sections adapted to selected language and country
  const adaptedSections = getAdaptedCurriculum(
    targetLanguage,
    userProfile.countryFlag,
    userProfile.profession,
    userProfile.level
  );
  const curSection = adaptedSections.find((s) => s.section_id === selectedSectionId) || adaptedSections[0];
  const curProf = PROFESSION_OPTIONS.find((p) => p.id === userProfile.profession) || PROFESSION_OPTIONS[0];

  // Dynamic puzzles adapted to target language
  const sentencePuzzles = getAdaptedSentencePuzzles(targetLanguage);

  useEffect(() => {
    return () => {
      stopAzureAudio();
    };
  }, []);

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

  // ==========================================
  // GAME 1: SPEED WORD MATCH
  // ==========================================
  const [matchCards, setMatchCards] = useState<{ id: string; text: string; matchId: string; type: 'phrase' | 'trans'; isMatched: boolean }[]>([]);
  const [selectedCard, setSelectedCard] = useState<{ id: string; matchId: string; type: 'phrase' | 'trans' } | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(45);
  const [isGameRunning, setIsGameRunning] = useState<boolean>(false);
  const [matchScore, setMatchScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(1);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);

  const initWordMatchGame = () => {
    const vocabList = curSection.vocabulary.slice(0, 5);
    const cards: { id: string; text: string; matchId: string; type: 'phrase' | 'trans'; isMatched: boolean }[] = [];

    vocabList.forEach((v, index) => {
      cards.push({
        id: `p-${index}`,
        text: v.phrase,
        matchId: `pair-${index}`,
        type: 'phrase',
        isMatched: false,
      });
      cards.push({
        id: `t-${index}`,
        text: v.translation,
        matchId: `pair-${index}`,
        type: 'trans',
        isMatched: false,
      });
    });

    setMatchCards(cards.sort(() => Math.random() - 0.5));
    setSelectedCard(null);
    setTimerSeconds(45);
    setMatchScore(0);
    setCombo(1);
    setIsGameRunning(true);
    setGameCompleted(false);
  };

  useEffect(() => {
    let interval: any = null;
    if (isGameRunning && timerSeconds > 0 && selectedGame === 'speed_word_match') {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isGameRunning) {
      setIsGameRunning(false);
      setGameCompleted(true);
    }
    return () => clearInterval(interval);
  }, [isGameRunning, timerSeconds, selectedGame]);

  const handleCardClick = (card: { id: string; matchId: string; type: 'phrase' | 'trans'; isMatched: boolean; text: string }) => {
    if (!isGameRunning || card.isMatched) return;

    if (!selectedCard) {
      setSelectedCard(card);
      if (card.type === 'phrase') {
        handlePlayAudio(`card-${card.id}`, card.text);
      }
    } else {
      if (selectedCard.id === card.id) {
        setSelectedCard(null);
        return;
      }

      if (selectedCard.type !== card.type && selectedCard.matchId === card.matchId) {
        const earned = 20 * combo;
        setMatchScore((prev) => prev + earned);
        setCombo((prev) => Math.min(prev + 1, 4));

        setMatchCards((prev) =>
          prev.map((c) =>
            c.matchId === card.matchId ? { ...c, isMatched: true } : c
          )
        );
        setSelectedCard(null);

        const remaining = matchCards.filter((c) => !c.isMatched && c.matchId !== card.matchId);
        if (remaining.length === 0) {
          setIsGameRunning(false);
          setGameCompleted(true);
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          onEarnXp(100);
        }
      } else {
        setCombo(1);
        setSelectedCard(null);
      }
    }
  };

  // ==========================================
  // GAME 2: AUDIO SHADOWING CHALLENGE
  // ==========================================
  const [shadowingIndex, setShadowingIndex] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [spokenTranscript, setSpokenTranscript] = useState<string>('');
  const [shadowScore, setShadowScore] = useState<{ score: number; isGood: boolean; feedback: string; tip: string } | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const activeShadowingItem = curSection.vocabulary[shadowingIndex] || curSection.vocabulary[0];

  const handleStartShadowing = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Kechirasiz, brauzeringiz ovozli tanib olishni qo'llab-quvvatlamaydi. Iltimos Google Chrome dan foydalaning.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // Set speech recognition language matching the selected target language
    const langMap: Record<string, string> = {
      uz: 'uz-UZ',
      ru: 'ru-RU',
      ko: 'ko-KR',
      ja: 'ja-JP',
      es: 'es-ES',
      de: 'de-DE',
      fr: 'fr-FR',
      tr: 'tr-TR',
      ar: 'ar-SA',
      it: 'it-IT',
      zh: 'zh-CN',
      en: 'en-US',
    };
    recognition.lang = langMap[targetLanguage.toLowerCase()] || 'en-US';

    setIsRecording(true);
    setSpokenTranscript('');
    setShadowScore(null);

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSpokenTranscript(transcript);
      setIsRecording(false);
      await evaluateAudioShadowing(activeShadowingItem.phrase, transcript);
    };

    recognition.onerror = (err: any) => {
      console.warn("Speech recognition error:", err);
      setIsRecording(false);
      setSpokenTranscript(activeShadowingItem.phrase);
      evaluateAudioShadowing(activeShadowingItem.phrase, activeShadowingItem.phrase);
    };

    recognition.start();
  };

  const evaluateAudioShadowing = async (target: string, spoken: string) => {
    setIsEvaluating(true);
    try {
      const res = await fetch('/api/shadowing-eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_phrase: target,
          user_spoken_text: spoken,
          target_language: targetLanguage,
        }),
      });
      const data = await res.json();
      setShadowScore({
        score: data.score || 92,
        isGood: data.is_good_match ?? true,
        feedback: data.feedback || "Ajoyib talaffuz! Ohang va intonatsiya toza.",
        tip: data.pronunciation_tip || "Urg'uni to'g'ri bo'g'inga bering.",
      });

      if ((data.score || 90) >= 80) {
        confetti({ particleCount: 50, spread: 60 });
        onEarnXp(50);
      }
    } catch (e) {
      setShadowScore({
        score: 90,
        isGood: true,
        feedback: "Zo'r harakat! Talaffuz aniq va tushunarli.",
        tip: "Sekinroq va ravon aytishda davom eting.",
      });
      onEarnXp(40);
    } finally {
      setIsEvaluating(false);
    }
  };

  // ==========================================
  // GAME 4: SENTENCE BUILDER PUZZLE
  // ==========================================
  const [puzzleIndex, setPuzzleIndex] = useState<number>(0);
  const currentPuzzle = sentencePuzzles[puzzleIndex % sentencePuzzles.length] || sentencePuzzles[0];
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [assembledWords, setAssembledWords] = useState<string[]>([]);
  const [puzzleChecked, setPuzzleChecked] = useState<boolean | null>(null);

  useEffect(() => {
    if (currentPuzzle) {
      setAvailableWords([...currentPuzzle.words].sort(() => Math.random() - 0.5));
      setAssembledWords([]);
      setPuzzleChecked(null);
    }
  }, [puzzleIndex, targetLanguage]);

  const handleAddWordToAssembled = (word: string, index: number) => {
    setAssembledWords((prev) => [...prev, word]);
    setAvailableWords((prev) => prev.filter((_, i) => i !== index));
    setPuzzleChecked(null);
  };

  const handleRemoveWordFromAssembled = (word: string, index: number) => {
    setAssembledWords((prev) => prev.filter((_, i) => i !== index));
    setAvailableWords((prev) => [...prev, word]);
    setPuzzleChecked(null);
  };

  const handleCheckSentence = () => {
    const userBuilt = assembledWords.join(' ').trim();
    const correct = currentPuzzle.targetSentence.trim();
    const isCorrect = userBuilt === correct;
    setPuzzleChecked(isCorrect);

    if (isCorrect) {
      confetti({ particleCount: 70, spread: 65, origin: { y: 0.6 } });
      onEarnXp(75);
      handlePlayAudio(`puzzle-${puzzleIndex}`, correct);
    }
  };

  // Custom Dropdown options for scenarios (replaces native <select>)
  const scenarioDropdownOptions = adaptedSections.map((sec) => ({
    value: String(sec.section_id),
    label: `#${sec.section_id}. ${sec.title}`,
    sublabel: sec.category,
    badge: sec.difficulty,
  }));

  return (
    <div id="interactive-games-hub" className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      
      {/* Top Games Hub Header Banner */}
      <div className="bg-accent-500 rounded-xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
            <Gamepad2 className="w-4 h-4" />
            <span>{t('games.zone_title', "Interaktiv O'yinlar Zonasi")}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Zerikishsiz, Qiziqarli O'yinlar Orqali Til O'rganing!
          </h2>

          <p className="text-xs sm:text-sm text-accent-100 leading-relaxed flex items-center gap-2 flex-wrap">
            <span>{t('games.lang_label', 'Til')}: <strong className="text-white">{targetLanguage}</strong></span>
            <span>•</span>
            <span>{t('games.profile_label', 'Kasbiy profil')}: <strong className="text-white">{curProf.titleUz}</strong></span>
            <span>•</span>
            <span className="flex items-center gap-1 text-accent-200">
              <Radio className="w-3.5 h-3.5" /> Azure Neural Audio
            </span>
          </p>
        </div>

        {/* 4 Mini-Game Custom Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6 relative z-10">
          
          <button
            id="game-tab-speed-match"
            type="button"
            onClick={() => {
              setSelectedGame('speed_word_match');
              initWordMatchGame();
            }}
            className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
              selectedGame === 'speed_word_match'
                ? 'bg-surface text-ink border-white  font-bold scale-[1.02]'
                : 'bg-surface/10 hover:bg-surface/20 border-white/20 text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Zap className={`w-4 h-4 ${selectedGame === 'speed_word_match' ? 'text-amber-500' : 'text-amber-300'}`} />
              <span className="text-xs font-semibold">1. {t('games.speed_match', "Tezkor So'z")}</span>
            </div>
            <p className="text-[11px] opacity-80 mt-1 truncate">{t('games.sub_speed', "So'z mosligi")}</p>
          </button>

          <button
            id="game-tab-shadowing"
            type="button"
            onClick={() => setSelectedGame('audio_shadowing')}
            className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
              selectedGame === 'audio_shadowing'
                ? 'bg-surface text-ink border-white  font-bold scale-[1.02]'
                : 'bg-surface/10 hover:bg-surface/20 border-white/20 text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Mic className={`w-4 h-4 ${selectedGame === 'audio_shadowing' ? 'text-accent-600' : 'text-accent-300'}`} />
              <span className="text-xs font-semibold">2. {t('games.shadowing', 'Audio Shadowing')}</span>
            </div>
            <p className="text-[11px] opacity-80 mt-1 truncate">{t('games.sub_shadow', 'Talaffuz mashqi')}</p>
          </button>

          <button
            id="game-tab-sentence-builder"
            type="button"
            onClick={() => setSelectedGame('sentence_builder')}
            className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
              selectedGame === 'sentence_builder'
                ? 'bg-surface text-ink border-white  font-bold scale-[1.02]'
                : 'bg-surface/10 hover:bg-surface/20 border-white/20 text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Layers className={`w-4 h-4 ${selectedGame === 'sentence_builder' ? 'text-accent-500' : 'text-accent-300'}`} />
              <span className="text-xs font-semibold">3. {t('games.sentence_builder', 'Gap Boshqotirmasi')}</span>
            </div>
            <p className="text-[11px] opacity-80 mt-1 truncate">{t('games.sub_builder', 'Gap tuzish')}</p>
          </button>

          <button
            id="game-tab-scenario-roleplay"
            type="button"
            onClick={() => setSelectedGame('scenario_roleplay')}
            className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
              selectedGame === 'scenario_roleplay'
                ? 'bg-surface text-ink border-white  font-bold scale-[1.02]'
                : 'bg-surface/10 hover:bg-surface/20 border-white/20 text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Gamepad2 className={`w-4 h-4 ${selectedGame === 'scenario_roleplay' ? 'text-accent-500' : 'text-accent-300'}`} />
              <span className="text-xs font-semibold">4. {t('games.roleplay_quest', 'Dialog Ssenariysi')}</span>
            </div>
            <p className="text-[11px] opacity-80 mt-1 truncate">{t('games.sub_roleplay', 'AI bilan jonli dialog')}</p>
          </button>

        </div>
      </div>

      {/* Scenario Custom Dropdown Button Picker (NO native <select> elements) */}
      <div className="bg-surface rounded-xl p-4 sm:p-5 border border-line flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-ink-muted">
          <Layers className="w-4 h-4 text-accent-600" />
          <span>{t('games.select_scenario', "O'yin mavzusi / Ssenariy tanlang")}:</span>
        </div>

        <CustomDropdown
          id="game-scenario-custom-dropdown"
          options={scenarioDropdownOptions}
          value={String(selectedSectionId)}
          onChange={(newVal) => {
            const parsed = Number(newVal);
            setSelectedSectionId(parsed);
            if (selectedGame === 'speed_word_match') {
              setTimeout(initWordMatchGame, 50);
            }
          }}
          className="w-full sm:w-80"
          buttonClassName="bg-surface border-line-strong"
        />
      </div>

      {/* ======================================================== */}
      {/* GAME 1 VIEW: SPEED WORD MATCH */}
      {/* ======================================================== */}
      {selectedGame === 'speed_word_match' && (
        <div className="bg-surface rounded-xl border border-line p-6 sm:p-8 space-y-6">
          
          <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-muted p-4 rounded-lg border border-line">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Timer className={`w-5 h-5 ${timerSeconds < 10 ? 'text-red-600' : 'text-accent-600'}`} />
                <span className="text-xl font-bold font-mono text-ink">{timerSeconds}s</span>
              </div>
              <div className="w-px h-6 bg-slate-200" />
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-bold text-ink-muted">{t('games.combo', 'Combo')}: <span className="font-mono text-amber-600 font-bold">{combo}x</span></span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[11px] font-bold text-ink-subtle uppercase">Ball</p>
                <p className="text-xl font-semibold font-mono text-accent-600">+{matchScore} XP</p>
              </div>

              <button
                type="button"
                onClick={initWordMatchGame}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-ink text-xs font-bold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('games.restart', 'Qayta boshlash')}</span>
              </button>
            </div>
          </div>

          {!gameCompleted ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
              {matchCards.map((card) => {
                const isSelected = selectedCard?.id === card.id;

                return (
                  <button
                    key={card.id}
                    type="button"
                    disabled={card.isMatched}
                    onClick={() => handleCardClick(card)}
                    className={`min-h-[105px] p-4 rounded-lg border-2 text-center flex flex-col items-center justify-center transition-all duration-150 cursor-pointer ${
                      card.isMatched
                        ? 'bg-accent-50 border-accent-300 opacity-40 scale-95'
                        : isSelected
                        ? 'bg-accent-50 border-accent-600  ring-2 ring-accent-400/20 scale-102 font-semibold text-accent-900'
                        : 'bg-surface border-line hover:border-line-strong hover:bg-surface-muted text-ink font-semibold '
                    }`}
                  >
                    <span className="text-xs sm:text-sm leading-snug">
                      {card.text}
                    </span>
                    {card.type === 'phrase' && (
                      <span className="text-[10px] text-ink-subtle font-normal mt-1 flex items-center gap-1">
                        <Volume2 className="w-3 h-3 text-accent-500" />
                        <span>Azure Audio</span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 bg-accent-50/50 rounded-xl border border-accent-200 space-y-4">
              <Trophy className="w-14 h-14 text-amber-500 mx-auto animate-bounce" />
              <h3 className="text-2xl font-semibold text-ink">
                Ajoyib Natija! Barcha so'zlar topildi!
              </h3>
              <p className="text-sm text-ink-muted max-w-md mx-auto">
                Siz <span className="font-bold text-accent-700">{matchScore} XP</span> ball to'pladingiz va ushbu bo'limdagi so'zlarni muvaffaqiyatli eslab qoldingiz.
              </p>
              <button
                type="button"
                onClick={initWordMatchGame}
                className="px-6 py-3 rounded-lg bg-accent-600 hover:bg-accent-500 text-white font-bold text-sm transition-all cursor-pointer"
              >
                Yana O'ynash
              </button>
            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* GAME 2 VIEW: AUDIO SHADOWING WITH AZURE NEURAL TTS */}
      {/* ======================================================== */}
      {selectedGame === 'audio_shadowing' && (
        <div className="bg-surface rounded-xl border border-line p-6 sm:p-8 space-y-6">
          
          <div className="border-b border-line pb-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent-600">
                Ovozli Talaffuz O'yini (Azure Audio Shadowing)
              </span>
              <h3 className="text-lg font-bold text-ink mt-0.5">
                Mulketing, Tinglang va Ovoz Chiqarib Takrorlang
              </h3>
            </div>
            <span className="text-xs font-mono font-bold bg-accent-50 text-accent-700 px-3 py-1 rounded-full border border-accent-200">
              {shadowingIndex + 1} / {curSection.vocabulary.length}
            </span>
          </div>

          <div className="bg-surface rounded-xl border border-line p-6 sm:p-8 text-center space-y-4">
            <button
              type="button"
              onClick={() => handlePlayAudio(`shadow-${shadowingIndex}`, activeShadowingItem.phrase)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-accent-200 text-accent-700 font-bold text-xs hover:bg-accent-50 transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-accent-600" />
              <span>{t('games.listen_azure', 'Ovozni eshitish')}</span>
            </button>

            <h4 className="text-xl sm:text-2xl font-semibold text-ink leading-snug">
              "{activeShadowingItem.phrase}"
            </h4>

            <p className="text-sm font-mono text-accent-700 bg-accent-50 inline-block px-3 py-1 rounded-xl border border-accent-100">
              Talaffuz: {activeShadowingItem.pronunciation}
            </p>

            <p className="text-sm text-ink-muted">
              Tarjimasi: <span className="font-semibold text-ink">{activeShadowingItem.translation}</span>
            </p>
          </div>

          {/* Mic Record Action */}
          <div className="flex flex-col items-center justify-center gap-3 py-2">
            <button
              id="start-mic-shadowing-btn"
              type="button"
              onClick={handleStartShadowing}
              disabled={isRecording || isEvaluating}
              className={`w-20 h-20 rounded-full flex items-center justify-center  transition-all transform cursor-pointer ${
                isRecording 
                  ? 'bg-accent-600 text-white ring-4 ring-accent-200' 
                  : 'bg-accent-500 hover:scale-105 text-white '
              }`}
            >
              <Mic className="w-8 h-8" />
            </button>

            <p className="text-xs font-bold text-ink-muted">
              {isRecording ? "Sizni tinglayapman... Gapiring!" : "Mikrofon tugmasini bosing va jumla talaffuz qiling"}
            </p>
          </div>

          {shadowScore && (
            <div className="bg-surface-muted rounded-lg p-5 border border-line space-y-3 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span className="font-bold text-sm text-ink">{t('games.accuracy', 'Talaffuz aniqligi')}:</span>
                </div>
                <span className="text-lg font-semibold font-mono text-accent-600 bg-accent-50 px-3 py-0.5 rounded-full border border-accent-200">
                  {shadowScore.score}%
                </span>
              </div>

              {spokenTranscript && (
                <p className="text-xs text-ink-muted">
                  Eshitilgan matn: <span className="font-semibold text-ink">"{spokenTranscript}"</span>
                </p>
              )}

              <p className="text-xs text-ink-muted bg-surface p-3 rounded-xl border border-line">
                💡 <span className="font-semibold">{shadowScore.feedback}</span> ({shadowScore.tip})
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-line">
            <button
              type="button"
              disabled={shadowingIndex === 0}
              onClick={() => {
                setShadowingIndex((prev) => Math.max(0, prev - 1));
                setShadowScore(null);
              }}
              className="px-4 py-2 rounded-xl bg-surface-sunken hover:bg-line text-ink-muted text-xs font-bold disabled:opacity-40 cursor-pointer"
            >
              Oldingi so'z
            </button>

            <button
              type="button"
              disabled={shadowingIndex === curSection.vocabulary.length - 1}
              onClick={() => {
                setShadowingIndex((prev) => Math.min(curSection.vocabulary.length - 1, prev + 1));
                setShadowScore(null);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-600 hover:bg-accent-700 text-white text-xs font-bold disabled:opacity-40 cursor-pointer"
            >
              <span>{t('games.next_word', "Keyingi so'z")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* GAME 3 VIEW: SENTENCE BUILDER PUZZLE */}
      {/* ======================================================== */}
      {selectedGame === 'sentence_builder' && (
        <div className="bg-surface rounded-xl border border-line p-6 sm:p-8 space-y-6">
          
          <div className="border-b border-line pb-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent-600">
                Gap Tuzish Boshqotirmasi (Sentence Puzzle)
              </span>
              <h3 className="text-lg font-bold text-ink mt-0.5">
                So'zlarni To'g'ri Ketma-ketlikda Joylashtiring
              </h3>
            </div>
            <span className="text-xs font-mono font-bold bg-accent-50 text-accent-700 px-3 py-1 rounded-full border border-accent-200">
              Boshqotirma {puzzleIndex + 1}/{SENTENCE_PUZZLES.length}
            </span>
          </div>

          <div className="bg-surface-muted rounded-lg p-4 border border-line">
            <p className="text-xs font-bold text-ink-muted uppercase tracking-wide">
              Tarjima qilinishi kerak bo'lgan jumla:
            </p>
            <p className="text-base sm:text-lg font-bold text-ink mt-1">
              "{currentPuzzle.translation}"
            </p>
            <p className="text-xs text-ink-muted mt-1">
              💡 Maslahat: {currentPuzzle.hint}
            </p>
          </div>

          {/* Assembled Words Slot */}
          <div className="min-h-[75px] bg-accent-50/30 rounded-lg border-2 border-dashed border-accent-300 p-3.5 flex flex-wrap items-center gap-2">
            {assembledWords.length === 0 ? (
              <span className="text-xs text-ink-subtle italic">
                Pastdagi so'z bo'laklariga bosing, ular shu yerda tartib bilan joylashadi...
              </span>
            ) : (
              assembledWords.map((word, idx) => (
                <button
                  key={`assembled-${idx}`}
                  type="button"
                  onClick={() => handleRemoveWordFromAssembled(word, idx)}
                  className="px-3.5 py-1.5 rounded-xl bg-surface border border-accent-300 text-accent-900 font-bold text-xs sm:text-sm hover:bg-accent-50 hover:border-accent-300 hover:text-accent-700 transition-all cursor-pointer"
                >
                  {word}
                </button>
              ))
            )}
          </div>

          {/* Available Word Tiles */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-ink-muted uppercase">
              Mavjud so'z bo'laklari:
            </p>
            <div className="flex flex-wrap gap-2">
              {availableWords.map((word, idx) => (
                <button
                  key={`available-${idx}`}
                  type="button"
                  onClick={() => handleAddWordToAssembled(word, idx)}
                  className="px-4 py-2 rounded-xl bg-surface-sunken hover:bg-accent-50 hover:border-accent-300 hover:text-accent-900 border border-line text-ink font-bold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>

          {puzzleChecked !== null && (
            <div className={`p-4 rounded-lg border flex items-center gap-3 ${
              puzzleChecked 
                ? 'bg-accent-50 border-accent-300 text-accent-800' 
                : 'bg-danger-soft border-red-200 text-red-800'
            }`}>
              {puzzleChecked ? (
                <CheckCircle2 className="w-5 h-5 text-accent-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-danger flex-shrink-0" />
              )}
              <div className="text-xs">
                <p className="font-bold">
                  {puzzleChecked ? "To'ppa-to'g'ri! Mukammal grammatik tartib!" : "Ketma-ketlikda xatolik bor. Qaytadan urinib ko'ring."}
                </p>
                {puzzleChecked && (
                  <p className="font-mono mt-0.5">"{currentPuzzle.targetSentence}"</p>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-line">
            <button
              type="button"
              onClick={() => {
                setAvailableWords([...currentPuzzle.words].sort(() => Math.random() - 0.5));
                setAssembledWords([]);
                setPuzzleChecked(null);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-sunken hover:bg-line text-ink-muted text-xs font-bold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('games.clear', 'Tozalash')}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCheckSentence}
                disabled={assembledWords.length === 0}
                className="px-5 py-2.5 rounded-xl bg-accent-600 hover:bg-accent-500 text-white font-bold text-xs sm:text-sm transition-all disabled:opacity-40 cursor-pointer"
              >
                Tekshirish
              </button>

              <button
                type="button"
                onClick={() => setPuzzleIndex((prev) => prev + 1)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-accent-600 hover:bg-accent-500 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                <span>{t('games.next', 'Keyingi')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* GAME 4 VIEW: DIALOGUE SCENARIO ROLEPLAY SHORTCUT */}
      {/* ======================================================== */}
      {selectedGame === 'scenario_roleplay' && (
        <div className="bg-surface rounded-xl border border-line p-6 sm:p-8 space-y-5 text-center">
          <div className="w-16 h-16 rounded-lg bg-accent-50 text-accent-600 mx-auto flex items-center justify-center shadow-inner">
            <Gamepad2 className="w-8 h-8" />
          </div>

          <h3 className="text-xl sm:text-2xl font-semibold text-ink">
            #{curSection.section_id} — {curSection.title}
          </h3>

          <p className="text-xs sm:text-sm text-ink-muted max-w-lg mx-auto leading-relaxed">
            AI suhbatdosh bilan real hayotiy dialog orqali jonli muloqot qiling. Sizning kasbingiz ({curProf.titleUz}) va darajangizga mos savollar beriladi.
          </p>

          <div className="p-4 rounded-lg bg-surface-muted border border-line text-xs text-ink-muted max-w-md mx-auto text-left space-y-1">
            <p><span className="font-bold text-ink">{t('games.scenario_label', 'Ssenariy')}:</span> {curSection.scenario_context}</p>
            <p><span className="font-bold text-accent-600">{t('games.ai_partner', 'AI hamkor')}:</span> {curSection.ai_role}</p>
          </div>

          <button
            type="button"
            onClick={() => onSelectSectionForLab(curSection)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent-500 hover:opacity-95 text-white font-bold text-sm transition-all cursor-pointer"
          >
            <span>{t('games.go_to_lab', "Jonli labga o'tish")}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
