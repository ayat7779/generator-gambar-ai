import React, { useState } from 'react';
import {
  History,
  Trash2,
  Maximize2,
  Download,
  Search,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export default function GalleryHistory({
  history,
  onImageClick,
  onDownload,
  onClearHistory,
  onUsePrompt,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter((item) =>
    item.prompt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (history.length === 0) {
    return null;
  }

  return (
    <section className="glass-panel p-5 rounded-2xl shadow-xl mt-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-purple-400" />
          <h2 className="text-base font-bold text-white">
            Riwayat Kreasi ({history.length})
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari dalam riwayat..."
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 w-44"
            />
          </div>

          {/* Clear button */}
          <button
            onClick={onClearHistory}
            className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
            title="Bersihkan Semua Riwayat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredHistory.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all aspect-square cursor-pointer"
            onClick={() => onImageClick(item)}
          >
            <img
              src={item.dataUrl}
              alt={item.prompt}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
              <p className="text-[10px] text-slate-200 line-clamp-3">
                {item.prompt}
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                <span className="text-[9px] text-purple-300 font-mono">
                  {item.aspectRatio}
                </span>

                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onDownload(item)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
                    title="Unduh"
                  >
                    <Download className="w-3 h-3" />
                  </button>
                  {onUsePrompt && (
                    <button
                      onClick={() => onUsePrompt(item)}
                      className="p-1 rounded bg-purple-900/60 hover:bg-purple-800 text-purple-200"
                      title="Gunakan Prompt"
                    >
                      <Sparkles className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
