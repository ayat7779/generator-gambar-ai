import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PromptSection from './components/PromptSection';
import ResultSection from './components/ResultSection';
import GalleryHistory from './components/GalleryHistory';
import SettingsModal from './components/SettingsModal';
import ImageModal from './components/ImageModal';
import {
  loadHistory,
  saveToHistory,
  deleteHistoryItem,
  clearAllHistory,
} from './utils/storage';
import { Sparkles, AlertTriangle } from 'lucide-react';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('none');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [numberOfImages, setNumberOfImages] = useState(1);
  const [engine, setEngine] = useState('auto');

  // API Key & Server State
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [serverStatus, setServerStatus] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [generationError, setGenerationError] = useState(null);

  // Lightbox & History
  const [selectedImageModal, setSelectedImageModal] = useState(null);
  const [history, setHistory] = useState([]);
  const [copiedPromptId, setCopiedPromptId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Initialize status & history on load
  useEffect(() => {
    setHistory(loadHistory());

    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => setServerStatus(data))
      .catch((err) => console.warn('Gagal menghubungi backend:', err));
  }, []);

  const showToast = (msg, duration = 3000) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, duration);
  };

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem('gemini_api_key', key);
      showToast('API Key tersimpan!');
    } else {
      localStorage.removeItem('gemini_api_key');
      showToast('API Key dihapus.');
    }
  };

  const handleEnhance = async () => {
    if (!prompt.trim() || isEnhancing) return;
    setIsEnhancing(true);

    try {
      const res = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': apiKey,
        },
        body: JSON.stringify({
          prompt,
          style: selectedStyle,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyempurnakan prompt');

      if (data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
        showToast('Prompt berhasil ditingkatkan oleh AI!');
      }
    } catch (err) {
      showToast(err.message || 'Gagal meningkatkan prompt');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setGenerationError(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': apiKey,
        },
        body: JSON.stringify({
          prompt,
          aspectRatio,
          numberOfImages,
          style: selectedStyle,
          negativePrompt,
          engine,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menghasilkan gambar');
      }

      if (data.images && data.images.length > 0) {
        setCurrentImages(data.images);
        const updatedHistory = saveToHistory(data.images);
        setHistory(updatedHistory);
        showToast(
          data.provider === 'imagen'
            ? 'Gambar berhasil dibuat dengan Google Imagen 3!'
            : 'Gambar berhasil dibuat (Mode Demo).'
        );
      }
    } catch (err) {
      setGenerationError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (img) => {
    const link = document.createElement('a');
    link.href = img.dataUrl;
    const cleanPrompt = (img.prompt || 'ai-image')
      .slice(0, 30)
      .replace(/[^a-zA-Z0-9]/g, '_');
    link.download = `visionai_${cleanPrompt}_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Mengunduh gambar...');
  };

  const handleCopyPrompt = (img) => {
    const textToCopy = img.finalPrompt || img.prompt;
    navigator.clipboard.writeText(textToCopy);
    setCopiedPromptId(img.id);
    showToast('Teks prompt disalin ke clipboard!');
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const handleUsePrompt = (img) => {
    setPrompt(img.prompt);
    if (img.style) setSelectedStyle(img.style);
    if (img.aspectRatio) setAspectRatio(img.aspectRatio);
    showToast('Prompt dan konfigurasi dimuat kembali!');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistoryItem = (id) => {
    const updated = deleteHistoryItem(id);
    setHistory(updated);
    showToast('Item riwayat dihapus.');
  };

  const handleClearHistory = () => {
    if (window.confirm('Hapus seluruh riwayat gambar yang tersimpan di perangkat ini?')) {
      const cleared = clearAllHistory();
      setHistory(cleared);
      showToast('Semua riwayat dibersihkan.');
    }
  };

  const isKeyConfigured = Boolean(apiKey || serverStatus?.hasEnvKey);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-purple-600 selection:text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-slate-900 border border-purple-500/40 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        onOpenSettings={() => setIsSettingsOpen(true)}
        apiKey={apiKey}
        serverStatus={serverStatus}
      />

      {/* Demo Warning Banner if No API Key is set */}
      {!isKeyConfigured && (
        <div className="bg-amber-950/40 border-b border-amber-800/40 px-4 py-2.5 text-xs text-amber-300">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-center sm:text-left">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Mode Demo Gratis Aktif:</strong> Masukkan <strong>Gemini API Key</strong> Anda untuk beralih ke engine resmi <strong>Google Imagen 3 (imagen-3.0-generate-002)</strong>.
              </span>
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg text-[11px] hover:bg-amber-400 transition-colors shrink-0"
            >
              Masukkan API Key
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Studio Controls (7 cols) */}
          <div className="lg:col-span-7">
            <PromptSection
              prompt={prompt}
              setPrompt={setPrompt}
              selectedStyle={selectedStyle}
              setSelectedStyle={setSelectedStyle}
              aspectRatio={aspectRatio}
              setAspectRatio={setAspectRatio}
              negativePrompt={negativePrompt}
              setNegativePrompt={setNegativePrompt}
              numberOfImages={numberOfImages}
              setNumberOfImages={setNumberOfImages}
              engine={engine}
              setEngine={setEngine}
              isGenerating={isGenerating}
              isEnhancing={isEnhancing}
              onGenerate={handleGenerate}
              onEnhance={handleEnhance}
              isKeyConfigured={isKeyConfigured}
            />
          </div>

          {/* Right Column: Output / Result Canvas (5 cols) */}
          <div className="lg:col-span-5 sticky top-24">
            <ResultSection
              isGenerating={isGenerating}
              currentImages={currentImages}
              onImageClick={(img) => setSelectedImageModal(img)}
              onDownload={handleDownload}
              onCopyPrompt={handleCopyPrompt}
              copiedPromptId={copiedPromptId}
              generationError={generationError}
              onRetry={handleGenerate}
            />
          </div>
        </div>

        {/* Gallery / History */}
        <GalleryHistory
          history={history}
          onImageClick={(img) => setSelectedImageModal(img)}
          onDownload={handleDownload}
          onClearHistory={handleClearHistory}
          onUsePrompt={handleUsePrompt}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>
          VisionAI Studio — Ditenagai oleh Google Imagen 3 & Gemini 2.5 Flash
        </p>
      </footer>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        serverStatus={serverStatus}
      />

      <ImageModal
        image={selectedImageModal}
        onClose={() => setSelectedImageModal(null)}
        onDownload={handleDownload}
        onCopyPrompt={handleCopyPrompt}
        copiedPromptId={copiedPromptId}
        onUsePrompt={handleUsePrompt}
        onDelete={handleDeleteHistoryItem}
      />
    </div>
  );
}
