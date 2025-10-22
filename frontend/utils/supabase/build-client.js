// utils/supabase/build-client.js
// A minimal client for use ONLY during build time (e.g., generateStaticParams)
// It DOES NOT use cookies() and relies only on public env variables.
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// --- Ensure the exported function name is createBuildClient ---
export function createBuildClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Build Error: Missing Supabase URL or Anon Key for build client.");
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false }
  });
}