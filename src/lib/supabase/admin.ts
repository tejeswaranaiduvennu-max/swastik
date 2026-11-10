import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, getServiceKey } from "./config";

/**
 * Service-role / secret-key client — SERVER ONLY. Bypasses RLS.
 * Used by the public inquiry API route to insert leads and by admin
 * export endpoints. Never import this into a client component.
 */
export function createAdminSupabase() {
  const serviceKey = getServiceKey();
  if (!serviceKey || serviceKey.includes("PASTE_")) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY (secret key) is not set in .env.local"
    );
  }
  return createClient(SUPABASE_URL, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

export function serviceKeyConfigured(): boolean {
  const k = getServiceKey();
  return Boolean(k && !k.includes("PASTE_"));
}
