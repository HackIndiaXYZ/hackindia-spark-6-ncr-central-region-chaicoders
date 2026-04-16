/**
 * Supabase server-side admin client (uses service role key — server only).
 * This bypasses RLS for data pipeline operations.
 */
import { createClient } from "@supabase/supabase-js";

let _adminClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseAdmin() {
  if (_adminClient) return _adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  // Service role key — bypasses RLS. NEVER expose to client.
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // fallback to anon if service key not set

  _adminClient = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
  return _adminClient;
}
