import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function createSupabaseBrowserClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url?.trim() || !key?.trim()) {
    throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }
  return createClient(url, key);
}
