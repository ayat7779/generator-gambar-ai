import React from 'react';
import {
  Download,
  Maximize2,
  Copy,
  Check,
  Sparkles,
  Loader2,
  AlertCircle,
  ExternalLink,
  Layers,
  Clock,
} from 'lucide-react';

export default function ResultSection({
  isGenerating,
  currentImages,
  onImageClick,
  onDownload,
  onCopyPrompt,
  copiedPromptId,
  generationError,
  onRetry,
}) {
  return (
    <div className="glass-panel p-5 rounded-2xl shadow-xl h-full flex flex-col">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-400" />
          <h2 className="text-sm font-semibold text-white">Hasil Render AI</h2>
        </div>
        {currentImages && currentImages.length > 0 && (
          <span className="text-xs text-slate-400">
            {currentImages.length} gambar dihasilkan
          </span>
        )}
      </div>

      <div className="flex-1 mt-4 flex flex-col justify-center">
        {/* Error state */}
        {generationError && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-200 text-xs space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-red-300">Gagal Menghasilkan Gambar</p>
                <p className="text-red-300/80 leading-relaxed">{generationError}</p>
              </div>
            </div>
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-3 py-1.5 bg-red-900/60 hover:bg-red-800 text-white rounded-lg text-xs font-medium transition-colors"
              >
                Coba Lagi
              </button>
            )}
          </div>
        )}

        {/* Loading state with step animation */}
        {isGenerating && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-600 animate-spin opacity-80 blur-lg" />
              <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-purple-500/50 flex items-center justify-center absolute">
                <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
              </div>
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h3 className="text-sm font-semibold text-white flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                Merender Imajinasi Anda...
              </h3>
              <p className="text-xs text-slate-400">
                Memproses prompt dengan model Imagen 3 beresolusi tinggi. Biasanya memakan waktu 4-8 detik.
              </p>
            </div>
            {/* Shimmer box */}
            <div className="w-full max-w-md h-52 rounded-xl border border-slate-800 animate-shimmer overflow-hidden mt-4" />
          </div>
        )}

        {/* Empty state when no image has been generated yet */}
        {!isGenerating && (!currentImages || currentImages.length === 0) && !generationError && (
          <div className="py-16 flex flex-col items-center justify-center text-center text-slate-500 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-slate-600" />
            </div>
            <div className="space-y-1 max-w-xs">
              <p className="text-sm font-medium text-slate-300">Belum ada gambar yang dibuat</p>
              <p className="text-xs text-slate-500">
                Tulis deskripsi atau pilih salah satu inspirasi di sebelah kiri, lalu klik "Generate Gambar".
              </p>
            </div>
          </div>
        )}

        {/* Display generated images */}
        {!isGenerating && currentImages && currentImages.length > 0 && (
          <div
            className={`grid gap-4 ${
              currentImages.length === 1
                ? 'grid-cols-1'
                : currentImages.length === 2
                ? 'grid-cols-1 sm:grid-cols-2'
                : 'grid-cols-2'
            }`}
          >
            {currentImages.map((img) => (
              <div
                key={img.id}
                className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl hover:border-purple-500/50 transition-all"
              >
                {/* Image */}
                <div
                  className="relative overflow-hidden cursor-pointer"
                  onClick={() => onImageClick(img)}
                >
                  <img
                    src={img.dataUrl}
                    alt={img.prompt}
                    className="w-full h-auto object-cover max-h-[500px] transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-xs text-slate-200 line-clamp-2">{img.prompt}</p>
                  </div>
                </div>

                {/* Top badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none">
                  <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-semibold text-slate-200 border border-white/10">
                    {img.aspectRatio}
                  </span>
                  {img.style && img.style !== 'none' && (
                    <span className="px-2 py-0.5 rounded-md bg-purple-900/70 backdrop-blur-md text-[10px] font-semibold text-purple-200 border border-purple-500/30 capitalize">
                      {img.style}
                    </span>
                  )}
                </div>

                {/* Bottom action controls */}
                <div className="p-3 bg-slate-900/90 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-slate-400 truncate max-w-[160px] sm:max-w-[200px]">
                    {img.engine || 'Imagen 3'}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onCopyPrompt(img)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Salin Prompt"
                    >
                      {copiedPromptId === img.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => onImageClick(img)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Lihat Ukuran Penuh"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDownload(img)}
                      className="p-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-purple-600/40 bg-purple-600/20 border border-purple-500/30 transition-colors"
                      title="Unduh Gambar (JPEG)"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
