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

1. **Upload** — Take or select a furniture photo (2:3 aspect ratio).
2. **Fabric** — Pick one of 6 preset swatches in `public/swatches` or upload a custom reference image.
3. **Generating** — AI creates a new cover visualization.
4. **Result** — Before/after slider, download, or try again.

## Local Storage (development)

- Preset swatches: `public/swatches`
- Original uploads: `public/uploads`
- Generated images: `public/generated`

No external database or storage is used locally.

## Deploying to Vercel

**Important:** The app writes uploads and generated images to `public/uploads` and `public/generated`. On Vercel (and any serverless environment), the filesystem is **ephemeral**—writes succeed during a request, but files are **not persisted** across requests or deployments. Users will see broken image URLs after generation.

To deploy to production, you need external storage, for example:

- **Vercel Blob** — `@vercel/blob` for simple file storage, good fit for Vercel
- **Cloudinary** — Image hosting with transformations
- **Supabase Storage** — If you already use Supabase
- **AWS S3** — For more control

You would replace the `file-storage.ts` logic with calls to your chosen storage service and return public URLs instead of local paths.
