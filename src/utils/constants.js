export const STYLE_PRESETS = [
  { id: 'none', label: 'Default', icon: '🎨', desc: 'Sesuai prompt murni' },
  { id: 'photorealistic', label: 'Fotografi Realistis', icon: '📷', desc: '8k, lensa 85mm, detail kulit & tekstur' },
  { id: 'cinematic', label: 'Sinematik 35mm', icon: '🎬', desc: 'Pencahayaan dramatis, anamorphic flare' },
  { id: 'anime', label: 'Anime Modern', icon: '✨', desc: 'Gaya Makoto Shinkai, warna cerah & detail' },
  { id: 'cyberpunk', label: 'Cyberpunk', icon: '🌆', desc: 'Lampu neon, wet street, hologram futuristik' },
  { id: 'fantasy', label: 'Lukisan Fantasi', icon: '🐉', desc: 'Mitos megah, nuansa magis karya seni' },
  { id: '3d-render', label: 'Animasi 3D', icon: '🧸', desc: 'Gaya Pixar / Disney, render halus' },
  { id: 'watercolor', label: 'Cat Air (Watercolor)', icon: '🖌️', desc: 'Sapuan kuas lembut, tekstur kertas seni' },
  { id: 'minimalist', label: 'Vektor Minimalis', icon: '📐', desc: 'Garis bersih, palet warna elegan' },
  { id: 'oil_painting', label: 'Lukisan Minyak Klasik', icon: '🖼️', desc: 'Gaya era Renaissance, tekstur kanvas' },
];

export const ASPECT_RATIOS = [
  { id: '1:1', label: 'Persegi (1:1)', icon: 'Square', desc: 'Instagram feed, profil' },
  { id: '16:9', label: 'Landscape (16:9)', icon: 'RectangleHorizontal', desc: 'Wallpaper, YouTube, banner' },
  { id: '9:16', label: 'Portrait (9:16)', icon: 'RectangleVertical', desc: 'Story IG, TikTok, wallpaper HP' },
  { id: '4:3', label: 'Standar (4:3)', icon: 'Monitor', desc: 'Layar desktop standar' },
  { id: '3:4', label: 'Foto Klasik (3:4)', icon: 'Image', desc: 'Potret klasik / cetak' },
];

export const EXAMPLE_PROMPTS = [
  {
    title: 'Harimau Cyberpunk',
    prompt: 'A majestic robotic tiger with glowing neon teal circuitry walking through a rainy neon-lit Neo-Tokyo alleyway at midnight',
    style: 'cyberpunk',
    aspectRatio: '16:9',
  },
  {
    title: 'Gadis Anime di Hutan Peri',
    prompt: 'An ethereal anime girl with silver hair surrounded by bioluminescent glowing butterflies in an enchanted ancient forest at twilight',
    style: 'anime',
    aspectRatio: '9:16',
  },
  {
    title: 'Kopi & Buku Vintage',
    prompt: 'Warm aesthetic close-up of a rustic ceramic mug of latte art beside an open vintage book on a wooden windowsill overlooking autumn rain',
    style: 'photorealistic',
    aspectRatio: '1:1',
  },
  {
    title: 'Kastil Melayang Fantasi',
    prompt: 'Magnificent floating island fortress wrapped in waterfalls cascading into clouds, celestial sunset golden hour light, epic fantasy masterpiece',
    style: 'fantasy',
    aspectRatio: '16:9',
  },
  {
    title: 'Astronot Cilik 3D',
    prompt: 'Adorable cute baby astronaut character planting a colorful alien flower on the purple moon surface, Pixar 3D animated style',
    style: '3d-render',
    aspectRatio: '1:1',
  },
];
