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

The app uses **Vercel Blob** for persistent image storage when `BLOB_READ_WRITE_TOKEN` is set. Without it (local dev), images are written to `public/uploads` and `public/generated`.

**Setup for Vercel:**

1. Create a Blob store: Vercel Dashboard → your project → Storage → Create Database → Blob. **Private** and **Public** stores are both supported.
2. The `BLOB_READ_WRITE_TOKEN` env var is added automatically. Ensure it’s applied to **Production**, **Preview**, and **Build**.
3. For local dev: `vercel env pull`.
4. Deploy. Uploads and generated images persist in Blob; private blobs are streamed via `/api/blob`.

If you see `ENOENT: no such file or directory, mkdir '...public/uploads'`, the token is not reaching the runtime. Re-check that `BLOB_READ_WRITE_TOKEN` is set for all environments and redeploy.

If you see `Cannot use public access on a private store`, the app now uses `access: "private"` and serves blobs through `/api/blob`.
