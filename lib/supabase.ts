import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Lazy-initialized so the build doesn't fail when env vars aren't set yet
let _client: SupabaseClient | null = null;

/** Server-side Supabase client with service role key (bypasses RLS for uploads). */
export function getSupabase(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error(
        "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.",
      );
    }
    _client = createClient(url, key);
  }
  return _client;
}
