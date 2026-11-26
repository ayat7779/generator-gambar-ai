import React from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  Calendar,
  Layers,
  Sparkles,
  Maximize2,
  Trash2,
} from 'lucide-react';

export default function ImageModal({
  image,
  onClose,
  onDownload,
  onCopyPrompt,
  copiedPromptId,
  onUsePrompt,
  onDelete,
}) {
  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold">
              {image.engine || 'Imagen 3'}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Rasio {image.aspectRatio}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onDownload(image)}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Unduh Gambar"
            >
              <Download className="w-4 h-4" />
            </button>
            {onDelete && (
              <button
                onClick={() => {
                  onDelete(image.id);
                  onClose();
                }}
                className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                title="Hapus dari Galeri"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 flex flex-col md:flex-row gap-6 items-center md:items-start justify-center">
          {/* Main Image */}
          <div className="w-full md:w-3/5 flex items-center justify-center bg-slate-950/60 rounded-xl overflow-hidden border border-slate-800 p-2">
            <img
              src={image.dataUrl}
              alt={image.prompt}
              className="max-h-[65vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Details & actions */}
          <div className="w-full md:w-2/5 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Prompt Asli
                </label>
                <p className="text-sm text-slate-100 bg-slate-950/70 p-3 rounded-xl border border-slate-800 leading-relaxed max-h-36 overflow-y-auto">
                  {image.prompt}
                </p>
              </div>

              {image.finalPrompt && image.finalPrompt !== image.prompt && (
                <div>
                  <label className="text-xs font-semibold text-purple-400 uppercase tracking-wider block mb-1">
                    Prompt yang Disempurnakan
                  </label>
                  <p className="text-xs text-slate-300 bg-slate-950/70 p-3 rounded-xl border border-purple-900/30 leading-relaxed max-h-36 overflow-y-auto">
                    {image.finalPrompt}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Gaya (Style)</span>
                  <span className="font-medium text-slate-200 capitalize">
                    {image.style || 'None'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Waktu Dibuat</span>
                  <span className="font-medium text-slate-200">
                    {image.createdAt ? new Date(image.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Baru saja'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => onCopyPrompt(image)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {copiedPromptId === image.id ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Prompt Berhasil Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin Teks Prompt</span>
                  </>
                )}
              </button>

              {onUsePrompt && (
                <button
                  onClick={() => {
                    onUsePrompt(image);
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Gunakan Prompt Ini Lagi</span>
                </button>
              )}

              <button
                onClick={() => onDownload(image)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Gambar Penuh</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
