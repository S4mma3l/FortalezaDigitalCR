import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers"; // Keep cookies import here for context

export function createClient() { // Function definition doesn't change
  const cookieStore = cookies(); // Call cookies() inside the function scope

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          // Await the cookie value potentially? Let's try direct access first as per docs.
          const cookie = cookieStore.get(name);
          return cookie?.value;
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
             // Ignore errors
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Ignore errors
          }
        },
      },
    }
  );
}