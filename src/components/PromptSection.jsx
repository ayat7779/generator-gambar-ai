import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Square,
  RectangleHorizontal,
  RectangleVertical,
  Monitor,
  Image as ImageIcon,
  Loader2,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { STYLE_PRESETS, ASPECT_RATIOS, EXAMPLE_PROMPTS } from '../utils/constants';

export default function PromptSection({
  prompt,
  setPrompt,
  selectedStyle,
  setSelectedStyle,
  aspectRatio,
  setAspectRatio,
  negativePrompt,
  setNegativePrompt,
  numberOfImages,
  setNumberOfImages,
  engine,
  setEngine,
  isGenerating,
  isEnhancing,
  onGenerate,
  onEnhance,
  isKeyConfigured,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Map icon name to Lucide component
  const getRatioIcon = (iconName) => {
    switch (iconName) {
      case 'Square':
        return <Square className="w-4 h-4" />;
      case 'RectangleHorizontal':
        return <RectangleHorizontal className="w-4 h-4" />;
      case 'RectangleVertical':
        return <RectangleVertical className="w-4 h-4" />;
      case 'Monitor':
        return <Monitor className="w-4 h-4" />;
      default:
        return <ImageIcon className="w-4 h-4" />;
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isGenerating && prompt.trim()) {
        onGenerate();
      }
    }
  };

  const handleApplyExample = (ex) => {
    setPrompt(ex.prompt);
    setSelectedStyle(ex.style);
    setAspectRatio(ex.aspectRatio);
  };

  return (
    <div className="space-y-6">
      {/* Prompt input card */}
      <div className="glass-panel p-5 rounded-2xl relative shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Deskripsi Gambar (Prompt)
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onEnhance}
              disabled={isEnhancing || !prompt.trim() || isGenerating}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-purple-200 border border-purple-500/40 hover:from-purple-600/50 hover:to-pink-600/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              title="Perjelas dan tambahkan detail artistik dengan Gemini AI"
            >
              {isEnhancing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-300" />
                  <span>Meningkatkan...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5 text-pink-300" />
                  <span>Tingkatkan Prompt AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Contoh: Kucing astronot mengenakan pakaian luar angkasa dengan helm kaca reflektif, mengambang di nebula ungu penuh bintang..."
            rows={4}
            className="w-full px-4 py-3 text-sm rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/80 focus:border-transparent transition-all resize-none"
          />
          <div className="absolute right-3 bottom-3 text-[11px] text-slate-500 font-mono">
            {prompt.length} karakter
          </div>
        </div>

        {/* Quick inspiration examples */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-slate-400 flex items-center gap-1 shrink-0 font-medium text-[11px]">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            Inspirasi:
          </span>
          {EXAMPLE_PROMPTS.map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleApplyExample(ex)}
              className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-[11px] transition-colors"
            >
              {ex.title}
            </button>
          ))}
        </div>
      </div>

      {/* Style Presets Grid */}
      <div className="glass-panel p-5 rounded-2xl shadow-xl">
        <label className="block text-sm font-semibold text-white mb-3">
          Gaya Artistik (Style)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {STYLE_PRESETS.map((st) => {
            const isSelected = selectedStyle === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setSelectedStyle(st.id)}
                className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-purple-950/60 border-purple-500 text-white shadow-md shadow-purple-500/20 ring-1 ring-purple-500'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xl group-hover:scale-110 transition-transform">
                    {st.icon}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-semibold leading-snug">{st.label}</div>
                  <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {st.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Aspect Ratio Selection */}
      <div className="glass-panel p-5 rounded-2xl shadow-xl">
        <label className="block text-sm font-semibold text-white mb-3">
          Aspek Rasio Gambar
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {ASPECT_RATIOS.map((ratio) => {
            const isSelected = aspectRatio === ratio.id;
            return (
              <button
                key={ratio.id}
                type="button"
                onClick={() => setAspectRatio(ratio.id)}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  isSelected
                    ? 'bg-purple-950/60 border-purple-500 text-white shadow-md shadow-purple-500/20 ring-1 ring-purple-500'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-800 text-slate-400'}`}>
                  {getRatioIcon(ratio.icon)}
                </div>
                <div className="text-xs font-semibold text-white">{ratio.id}</div>
                <div className="text-[10px] text-slate-400 line-clamp-1">{ratio.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Settings Accordion */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-xl border border-slate-800">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full px-5 py-3.5 flex items-center justify-between text-left text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-purple-400" />
            <span>Pengaturan Lanjutan (Negative Prompt & Mesin AI)</span>
          </div>
          {showAdvanced ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showAdvanced && (
          <div className="p-5 pt-1 space-y-4 border-t border-slate-800/80 bg-slate-950/40">
            {/* Negative Prompt */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Negative Prompt (Elemen yang Dihindari)
              </label>
              <input
                type="text"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="Contoh: blurry, low quality, distorted anatomy, watermark, text"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            {/* Engine Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Mesin AI
                </label>
                <select
                  value={engine}
                  onChange={(e) => setEngine(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700/80 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="auto">Otomatis (Imagen 3 jika ada key, Demo jika kosong)</option>
                  <option value="imagen">Google Imagen 3 (imagen-3.0-generate-002)</option>
                  <option value="demo">Demo Gratis (Pollinations / FLUX Engine)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Jumlah Gambar Sekali Generate
                </label>
                <select
                  value={numberOfImages}
                  onChange={(e) => setNumberOfImages(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700/80 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value={1}>1 Gambar (Tercepat)</option>
                  <option value={2}>2 Gambar</option>
                  <option value={4}>4 Gambar (Variasi Penuh)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Generate Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:via-indigo-500 hover:to-pink-500 text-white font-bold text-base shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
        >
          {/* Button shine sweep */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-white" />
              <span>Membuat Gambar dengan AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-yellow-300 group-hover:rotate-12 transition-transform" />
              <span>Generate Gambar Sekarang</span>
              <span className="hidden sm:inline-block text-xs font-normal text-purple-200/80 bg-purple-900/40 px-2 py-0.5 rounded border border-purple-400/20">
                Ctrl + Enter
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
