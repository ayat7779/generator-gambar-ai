# VisionAI Studio — Generator Gambar AI

Aplikasi Generator Gambar AI modern berbasis web yang ditenagai oleh **Google Imagen 3 (`imagen-3.0-generate-002`)** dan **Gemini 2.5 Flash**, dibangun dengan **React**, **Vite**, **Tailwind CSS**, dan **Express.js**.

---

## ✨ Fitur Unggulan

1. **Google Imagen 3 High-Fidelity**:
   - Menghasilkan gambar berkualitas ultra-tinggi dengan detail fotorealistik, pencahayaan sinematik, atau gaya seni pilihan.
2. **AI Magic Prompt Enhancer**:
   - Mengubah prompt sederhana berbahasa Indonesia atau Inggris menjadi prompt visual kaya detail otomatis menggunakan Gemini 2.5 Flash.
3. **Pilihan Aspek Rasio Lengkap**:
   - `1:1` (Persegi - Instagram Feed)
   - `16:9` (Landscape - Wallpaper, Banner, YouTube)
   - `9:16` (Portrait - Instagram Story, TikTok, Wallpaper HP)
   - `4:3` (Standar Desktop)
   - `3:4` (Foto Klasik)
4. **Preset Gaya Artistik**:
   - Fotografi Realistis (85mm lens, 8k)
   - Sinematik 35mm
   - Anime Modern (Makoto Shinkai style)
   - Cyberpunk & Neon
   - Lukisan Fantasi Mitos
   - Animasi 3D (Pixar/Disney style)
   - Cat Air (Watercolor)
   - Lukisan Minyak Klasik
   - Vektor Minimalis
5. **Mode Demo Gratis & Fleksibilitas API Key**:
   - Jika Anda belum memiliki API key, aplikasi tetap dapat digunakan langsung lewat **Mode Demo** (FLUX engine).
   - Pengguna dapat memasukkan Gemini API Key langsung melalui antarmuka web (tersimpan aman di `localStorage`) atau melalui file `.env`.
6. **Galeri & Riwayat Lokal**:
   - Menyimpan hasil kreasi gambar di peramban secara otomatis.
   - Fitur Lightbox Zoom, unduh langsung (format JPEG), dan salin prompt atau gunakan kembali prompt hanya dengan satu klik.

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Prasyarat
- **Node.js** (versi 18 ke atas)

### 2. Konfigurasi API Key (Opsional / Direkomendasikan)
Buat file `.env` di folder utama aplikasi dengan menyalin dari `.env.example`:

```bash
# Windows PowerShell
cp .env.example .env
```

Buka file `.env` dan masukkan API Key Gemini Anda:
```env
GEMINI_API_KEY=AIzaSy...
PORT=3001
```

> **Cara Mendapatkan Gemini API Key Gratis:**
> 1. Kunjungi [Google AI Studio](https://aistudio.google.com/app/apikey).
> 2. Masuk dengan akun Google Anda.
> 3. Klik tombol **"Create API key"**.
> 4. Salin key tersebut ke file `.env` atau masukkan langsung melalui tombol pengaturan (ikon kunci) di pojok kanan atas aplikasi.

### 3. Menjalankan Server & Antarmuka

Cukup jalankan satu perintah berikut:

```bash
npm run dev
```

Aplikasi akan otomatis menjalankan:
- **Backend API**: `http://localhost:3001`
- **Frontend Web**: `http://localhost:5173`

Buka browser Anda di `http://localhost:5173` untuk mulai berkreasi!

---

## ⌨️ Pintasan Keyboard
- **`Ctrl + Enter`** (atau `Cmd + Enter` di Mac): Langsung men-generate gambar dari kolom input prompt.
