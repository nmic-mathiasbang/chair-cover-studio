# Chair Cover Studio

Local-first Next.js app that lets users upload furniture photos, apply a new fabric using Gemini image generation, and download the result.

## Setup

1. Copy `.env.local.example` to `.env.local`.
2. Add your Google API key:

```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

3. Install dependencies and start dev server:

```bash
npm install
npm run dev
```

## App Flow

1. Upload/take a furniture photo from phone or desktop.
2. Pick one of 6 preset swatches in `public/fabrics` or upload custom reference image.
3. Generate updated cover image via `/api/generate`.
4. Download generated image from the result panel.

## Local Storage

- Preset swatches: `public/fabrics`
- Original uploads: `public/uploads`
- Generated images: `public/generated`

No external database or storage is used.
