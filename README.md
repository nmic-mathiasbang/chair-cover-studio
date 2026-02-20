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
4. **Result** — Before/after tabs, download, or try again.

## Local Storage (development)

- Preset swatches: `public/swatches`
- Original uploads: `public/uploads`
- Generated images: `public/generated`

No external database or storage is used locally.

## Deploying to Vercel (with Supabase Storage)

The app uses **Supabase Storage** for persistent image storage when `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set. Without them (local dev), images are written to `public/uploads` and `public/generated`.

**Setup:**

1. Create a Supabase project at [supabase.com](https://supabase.com).
2. In the Supabase dashboard, go to **Storage** and create two **public** buckets:
   - `uploads`
   - `generated`
3. Add these environment variables to your Vercel project (Settings > Environment Variables):
   - `NEXT_PUBLIC_SUPABASE_URL` — your project URL (e.g. `https://abcdef.supabase.co`)
   - `SUPABASE_SERVICE_ROLE_KEY` — from Supabase Settings > API > service_role key
4. Deploy. Uploads and generated images are stored in Supabase and served via direct public URLs.
