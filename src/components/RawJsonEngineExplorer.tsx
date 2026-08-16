import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Download, 
  Play, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  SlidersHorizontal,
  FileJson,
  Layers,
  Cpu
} from 'lucide-react';
import { LessonSection, UserProfile } from '../types';
import { OFFICIAL_SECTIONS, COUNTRY_LANGUAGES, PROFESSION_OPTIONS } from '../data/curriculum';
import { CustomDropdown } from './CustomDropdown';
import { useI18n } from '../utils/i18n';

interface RawJsonEngineExplorerProps {
  targetLanguage: string;
  userProfile: UserProfile;
  initialSection?: LessonSection;
  onTestSectionInLab: (section: LessonSection) => void;
}

export const RawJsonEngineExplorer: React.FC<RawJsonEngineExplorerProps> = ({
  targetLanguage,
  userProfile,
  initialSection,
  onTestSectionInLab,
}) => {
  const { t } = useI18n();
  const [selectedSectionId, setSelectedSectionId] = useState<number>(
    initialSection ? initialSection.section_id : 1
  );
  const [customTopic, setCustomTopic] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [generatedJson, setGeneratedJson] = useState<LessonSection & { _engineUsed?: string }>(
    initialSection || OFFICIAL_SECTIONS[0]
  );

  const curProf = PROFESSION_OPTIONS.find((p) => p.id === userProfile.profession) || PROFESSION_OPTIONS[0];

  const handleSelectPreset = (secId: number) => {
    setSelectedSectionId(secId);
    const sec = OFFICIAL_SECTIONS.find((s) => s.section_id === secId);
    if (sec) {
      setGeneratedJson(sec);
    }
  };

  const handleGenerateAiJson = async () => {
    setIsGenerating(true);
    try {
      const activePreset = OFFICIAL_SECTIONS.find((s) => s.section_id === selectedSectionId);
      const res = await fetch('/api/raw-json-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section_id: selectedSectionId,
          title: activePreset?.title || "Maxsus Mavzu",
          category: activePreset?.category || "Kasbiy",
          difficulty: activePreset?.difficulty || "O'rta",
          target_language: targetLanguage,
          profession: userProfile.profession,
          proficiency_level: userProfile.level,
          custom_prompt: customTopic.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data && data.section_id) {
        setGeneratedJson(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(generatedJson, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(generatedJson, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `tiltop-section-${generatedJson.section_id || 1}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const scenarioOptions = OFFICIAL_SECTIONS.map((sec) => ({
    value: String(sec.section_id),
    label: `#${sec.section_id}. ${sec.title}`,
    sublabel: sec.category,
    badge: sec.difficulty,
  }));

  return (
    <div id="raw-json-engine-explorer" className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/20 text-accent-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Code2 className="w-4 h-4 text-accent-400" />
            <span>{t('json.title', 'TilTop Raw JSON Engine')}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Standartlashtirilgan Raw JSON Ssenariylar Generatori
          </h2>

          <p className="text-xs sm:text-sm text-ink-subtle leading-relaxed">
            Talab qilingan 20 ta ssenariy va har qanday maxsus til/mavzu bo'yicha toza, 100% sxemaga mos keluvchi JSON formatdagi dars kontentini yarating va sinovdan o'tkazing.
          </p>

          <div className="flex items-center gap-3 pt-2 text-xs font-mono text-ink-subtle flex-wrap">
            <span className="bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
              Til: <strong className="text-accent-400">{targetLanguage}</strong>
            </span>
            <span className="bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
              Kasb: <strong className="text-accent-400">{curProf.titleUz}</strong>
            </span>
            <span className="bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>Dvigatel: {generatedJson._engineUsed ? generatedJson._engineUsed.toUpperCase() : "GEMINI / MISTRAL / OPENAI"}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Control Panel (NO native <select> elements) */}
      <div className="bg-surface rounded-xl border border-line p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Custom Dropdown Section Picker */}
          <div>
            <CustomDropdown
              id="raw-json-section-custom-dropdown"
              label="1. Ssenariy tanlang (1 - 20)"
              options={scenarioOptions}
              value={String(selectedSectionId)}
              onChange={(val) => handleSelectPreset(Number(val))}
              className="w-full"
              buttonClassName="bg-surface-muted border-line-strong"
            />
          </div>

          {/* Custom Prompt Input */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider mb-1.5">
              2. Maxsus Mavzu / Qo'shimcha Talab (Ixtiyoriy)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder={t('json.topic_placeholder', "Masalan: IT Developer uchun kod ko'rib chiqish...")}
                className="flex-1 px-4 py-2.5 rounded-lg bg-surface-muted border border-line-strong text-xs sm:text-sm text-ink focus:outline-none focus:border-accent-500"
              />
              <button
                type="button"
                onClick={handleGenerateAiJson}
                disabled={isGenerating}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-600 hover:bg-accent-500 text-white text-xs sm:text-sm font-bold transition-all disabled:opacity-50 cursor-pointer flex-shrink-0"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{t('json.generating', 'Yaratilmoqda...')}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{t('json.generate', 'AI orqali JSON yaratish')}</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* JSON Viewer & Action Buttons */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
        
        <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileJson className="w-5 h-5 text-accent-400" />
            <span className="text-xs font-mono font-bold text-slate-200">
              Raw JSON Chiqishi (No Markdown, Strict Schema)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-accent-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Nusxalandi!" : "Nusxa Olish"}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t('json.download', 'Yuklab olish (.json)')}</span>
            </button>

            <button
              type="button"
              onClick={() => onTestSectionInLab(generatedJson)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-accent-600 hover:bg-accent-500 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{t('json.test_in_lab', 'Labda sinash')}</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <pre className="p-6 text-xs sm:text-sm font-mono text-accent-400 overflow-x-auto max-h-[500px] leading-relaxed select-all">
          {JSON.stringify(generatedJson, null, 2)}
        </pre>

      </div>

    </div>
  );
};
