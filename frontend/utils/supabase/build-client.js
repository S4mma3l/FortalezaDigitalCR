// utils/supabase/build-client.js
// A minimal client for use ONLY during build time (e.g., generateStaticParams)
// It DOES NOT use cookies() and relies only on public env variables.
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createBuildClient() {
  // Ensure these variables are available during build (e.g., set in GitHub Actions secrets/env)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Build Error: Missing Supabase URL or Anon Key for build client.");
  }

  // Use the standard JS client, not the SSR version
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    // No auth persistence needed for build-time fetching of public data
    auth: { persistSession: false }
  });
}