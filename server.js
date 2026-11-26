import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Helper to determine active API key
function getApiKey(req) {
  const customKey = req.headers['x-gemini-api-key'] || req.body?.apiKey;
  return (customKey && customKey.trim()) || process.env.GEMINI_API_KEY || '';
}

// Aspect ratio to pixel dimensions (for fallback / demo engine)
const RATIO_DIMENSIONS = {
  '1:1': { width: 1024, height: 1024 },
  '16:9': { width: 1280, height: 720 },
  '9:16': { width: 720, height: 1280 },
  '4:3': { width: 1024, height: 768 },
  '3:4': { width: 768, height: 1024 },
};

// Style modifiers to enhance prompts visually
const STYLE_PROMPTS = {
  none: '',
  photorealistic: 'hyper-realistic photography, shot on 85mm f/1.4 lens, natural lighting, ultra-detailed skin textures, 8k resolution, award-winning national geographic photo',
  cinematic: 'cinematic still, 35mm film shot, dramatic lighting, volumetric shadows, anamorphic lens flare, moody color grading, panavision, 8k',
  anime: 'modern anime masterpiece aesthetic, Makoto Shinkai style, vibrant lighting, highly detailed line art, vivid saturated colors, anime artstation trending',
  cyberpunk: 'cyberpunk aesthetic, neon-drenched city lighting, holographic glow, reflections on wet asphalt, futuristic tech, synthwave color palette, octane render',
  fantasy: 'epic high fantasy digital painting, mythical atmosphere, intricate ornaments, magical luminescence, Greg Rutkowski & Artgerm inspired, masterpiece',
  '3d-render': 'Pixar and Disney style 3D animation render, Octane render, smooth surface shaders, cute stylized proportions, studio softbox lighting, 4k',
  minimalist: 'minimalist vector illustration, clean lines, elegant flat pastel color palette, modern design, editorial aesthetic',
  watercolor: 'delicate watercolor illustration, soft pigment washes, visible paper grain, gentle bleeding edges, artistic hand-painted feel',
  oil_painting: 'classic Renaissance oil painting, rich impasto textures, chiaroscuro lighting, canvas grain, expressive brushstrokes',
};

// Check system status
app.get('/api/status', (req, res) => {
  const hasEnvKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim());
  res.json({
    status: 'online',
    hasEnvKey,
    defaultModel: 'imagen-3.0-generate-002',
    timestamp: new Date().toISOString(),
  });
});

// Prompt enhancer endpoint
app.post('/api/enhance-prompt', async (req, res) => {
  try {
    const { prompt, style = 'none' } = req.body;
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt tidak boleh kosong' });
    }

    const apiKey = getApiKey(req);

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = `You are an expert AI prompt engineer for image generation models like Google Imagen 3 and Midjourney.
Transform the user's brief concept into an evocative, highly-detailed English visual prompt that yields stunning imagery.
Rules:
1. Describe the subject, environment, lighting, composition, mood, and camera perspective vividly.
2. Keep it concise but descriptive (2-4 sentences, under 80 words).
3. Do not include introductory or concluding words, quotes, or markdown. Output ONLY the raw enhanced prompt.
4. If style is requested (${style}), seamlessly weave that aesthetic into the scene.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Create an optimal image generation prompt based on this user idea: "${prompt}" with desired style "${style}".`,
          config: {
            systemInstruction,
            temperature: 0.7,
            maxOutputTokens: 200,
          },
        });

        const enhanced = response.text ? response.text.trim().replace(/^"|"$/g, '') : null;
        if (enhanced) {
          return res.json({ enhancedPrompt: enhanced });
        }
      } catch (geminiError) {
        console.warn('Gemini prompt enhancement fallback to template:', geminiError.message);
      }
    }

    // Fallback rule-based enhancement if API key not provided or failed
    const styleModifier = STYLE_PROMPTS[style] || '';
    const enhanced = `${prompt.trim()}, masterpiece quality, intricate fine details${styleModifier ? `, ${styleModifier}` : ''}, balanced composition, 8k resolution`;

    res.json({ enhancedPrompt: enhanced });
  } catch (err) {
    console.error('Enhance error:', err);
    res.status(500).json({ error: 'Gagal meningkatkan prompt: ' + err.message });
  }
});

// Image generation endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const {
      prompt,
      aspectRatio = '1:1',
      numberOfImages = 1,
      style = 'none',
      negativePrompt = '',
      engine = 'auto',
    } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt gambar wajib diisi' });
    }

    const apiKey = getApiKey(req);
    const count = Math.min(Math.max(parseInt(numberOfImages, 10) || 1, 1), 4);
    const validAspectRatios = ['1:1', '16:9', '9:16', '4:3', '3:4'];
    const selectedRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : '1:1';

    // Build the final prompt with style
    let finalPrompt = prompt.trim();
    if (style && STYLE_PROMPTS[style]) {
      finalPrompt = `${finalPrompt}, ${STYLE_PROMPTS[style]}`;
    }
    if (negativePrompt && negativePrompt.trim()) {
      finalPrompt = `${finalPrompt} (avoid: ${negativePrompt.trim()})`;
    }

    // Case 1: Use Google Imagen 3 if API Key is available and engine is 'imagen' or 'auto'
    if (apiKey && (engine === 'imagen' || engine === 'auto')) {
      try {
        console.log(`[Imagen 3] Generating ${count} image(s) for prompt: "${finalPrompt.substring(0, 60)}..."`);
        const ai = new GoogleGenAI({ apiKey });

        const result = await ai.models.generateImages({
          model: 'imagen-3.0-generate-002',
          prompt: finalPrompt,
          config: {
            numberOfImages: count,
            aspectRatio: selectedRatio,
            outputMimeType: 'image/jpeg',
          },
        });

        const generatedImages = result.generatedImages || [];

        if (generatedImages.length === 0) {
          throw new Error('Tidak ada gambar yang dihasilkan oleh Imagen 3. Coba sesuaikan prompt.');
        }

        const images = generatedImages.map((img, idx) => {
          const base64 = img.image.imageBytes;
          const mimeType = 'image/jpeg';
          return {
            id: `img-${Date.now()}-${idx}`,
            dataUrl: `data:${mimeType};base64,${base64}`,
            base64,
            mimeType,
            prompt,
            finalPrompt,
            aspectRatio: selectedRatio,
            style,
            engine: 'Google Imagen 3 (imagen-3.0-generate-002)',
            createdAt: new Date().toISOString(),
          };
        });

        return res.json({
          success: true,
          provider: 'imagen',
          images,
        });
      } catch (imagenErr) {
        console.error('Imagen 3 API Error:', imagenErr.message);
        
        // If client explicitly requested only Imagen, return the error
        if (engine === 'imagen') {
          return res.status(502).json({
            error: `Gagal memanggil Google Imagen 3: ${imagenErr.message}. Pastikan API Key valid dan model imagen-3.0-generate-002 tersedia di akun Anda.`,
          });
        }

        // If 'auto', we can fall back to the demo engine with notification
        console.warn('Falling back to demo/free generation engine due to Imagen error.');
      }
    }

    // Case 2: Demo / Free Engine (Pollinations AI) - when no API key or explicitly requested
    console.log(`[Demo Engine] Generating image for prompt: "${finalPrompt.substring(0, 60)}..."`);
    const dimensions = RATIO_DIMENSIONS[selectedRatio] || { width: 1024, height: 1024 };
    const images = [];

    for (let i = 0; i < count; i++) {
      const seed = Math.floor(Math.random() * 10000000);
      const encodedPrompt = encodeURIComponent(finalPrompt);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${dimensions.width}&height=${dimensions.height}&seed=${seed}&nologo=true&model=flux`;

      // Fetch the image to deliver it as base64 dataUrl
      const imgFetch = await fetch(imageUrl);
      if (!imgFetch.ok) {
        throw new Error(`Gagal mengambil gambar dari generator gratis (${imgFetch.statusText})`);
      }

      const arrayBuffer = await imgFetch.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      const mimeType = 'image/jpeg';

      images.push({
        id: `img-demo-${Date.now()}-${i}`,
        dataUrl: `data:${mimeType};base64,${base64}`,
        base64,
        mimeType,
        prompt,
        finalPrompt,
        aspectRatio: selectedRatio,
        style,
        engine: apiKey ? 'Demo Engine (Fallback)' : 'Demo Engine (Pollinations / FLUX)',
        isDemo: true,
        createdAt: new Date().toISOString(),
      });
    }

    return res.json({
      success: true,
      provider: 'demo',
      notice: !apiKey ? 'Menggunakan mode demo gratis karena Gemini API Key belum disetel. Masukkan API Key di pengaturan untuk menggunakan Google Imagen 3.' : undefined,
      images,
    });

  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({
      error: error.message || 'Terjadi kesalahan saat memproses gambar',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server API berjalan di http://localhost:${PORT}`);
});
