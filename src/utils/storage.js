// LocalStorage manager for image generation history
const STORAGE_KEY = 'visionai_history_v1';
const MAX_HISTORY_ITEMS = 20;

export function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Gagal memuat riwayat:', err);
    return [];
  }
}

export function saveToHistory(newImages) {
  try {
    const current = loadHistory();
    // Prepend new images and deduplicate by id
    const combined = [...newImages, ...current];
    const unique = [];
    const seenIds = new Set();

    for (const item of combined) {
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id);
        unique.push(item);
      }
    }

    // Limit to MAX_HISTORY_ITEMS to prevent exceeding localStorage quota
    const trimmed = unique.slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    return trimmed;
  } catch (err) {
    console.warn('Gagal menyimpan ke riwayat (mungkin kuota localStorage penuh):', err);
    try {
      // If full, trim aggressively to 5 items and try once more
      const current = loadHistory().slice(0, 5);
      const reduced = [...newImages, ...current].slice(0, 8);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reduced));
      return reduced;
    } catch {
      return loadHistory();
    }
  }
}

export function deleteHistoryItem(id) {
  try {
    const current = loadHistory();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Gagal menghapus riwayat item:', err);
    return loadHistory();
  }
}

export function clearAllHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  } catch (err) {
    console.warn('Gagal membersihkan riwayat:', err);
    return [];
  }
}
