import React from 'react';
import { Sparkles, Key, Image as ImageIcon, Sliders, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';

export default function Navbar({ onOpenSettings, apiKey, serverStatus }) {
  const isKeyConfigured = Boolean(apiKey || serverStatus?.hasEnvKey);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 shadow-lg shadow-purple-500/25">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                VisionAI Studio
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                Imagen 3
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Generator Gambar AI Beresolusi Tinggi
            </p>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Key status indicator */}
          <button
            onClick={onOpenSettings}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              isKeyConfigured
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50 hover:bg-emerald-900/40'
                : 'bg-amber-950/40 text-amber-300 border-amber-800/50 hover:bg-amber-900/40'
            }`}
            title={isKeyConfigured ? 'API Key Google Gemini Terhubung' : 'API Key belum disetel (Mode Demo Aktif)'}
          >
            {isKeyConfigured ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Google Imagen 3 Aktif</span>
                <span className="sm:hidden">Aktif</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="hidden sm:inline">Mode Demo (Klik untuk Set API Key)</span>
                <span className="sm:hidden">Demo</span>
              </>
            )}
          </button>

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors"
            aria-label="Pengaturan API Key"
            title="Pengaturan API Key"
          >
            <Key className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
