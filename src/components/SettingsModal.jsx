import React, { useState } from 'react';
import { X, Key, ExternalLink, ShieldCheck, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, apiKey, onSaveApiKey, serverStatus }) {
  const [keyInput, setKeyInput] = useState(apiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveApiKey(keyInput.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleClear = () => {
    setKeyInput('');
    onSaveApiKey('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Pengaturan Gemini API Key</h2>
              <p className="text-xs text-slate-400">Hubungkan API Google untuk Imagen 3</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
              />
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Key disimpan aman di browser Anda (<span className="text-purple-300">localStorage</span>) dan dikirim ke backend lokal Anda.
            </p>
          </div>

          {/* Server status alert */}
          {serverStatus?.hasEnvKey && (
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 text-xs flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Backend server sudah memiliki <code>GEMINI_API_KEY</code> di file <code>.env</code>. Anda dapat mengosongkan input di atas atau memasukkan key alternatif.
              </span>
            </div>
          )}

          {/* Tutorial step guide */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5 text-xs text-slate-300">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Cara mendapatkan Gemini API Key gratis:
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-400 leading-relaxed">
              <li>
                Kunjungi{' '}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-purple-400 underline hover:text-purple-300 inline-flex items-center gap-0.5 font-medium"
                >
                  Google AI Studio <ExternalLink className="w-3 h-3 inline" />
                </a>
              </li>
              <li>Masuk dengan akun Google Anda</li>
              <li>Klik tombol <strong>"Create API key"</strong></li>
              <li>Salin API Key dan tempelkan pada kolom di atas</li>
            </ol>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-slate-400 hover:text-red-400 transition-colors"
            >
              Hapus Key
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-500/25 transition-all flex items-center gap-1.5"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    Tersimpan!
                  </>
                ) : (
                  'Simpan Pengaturan'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
