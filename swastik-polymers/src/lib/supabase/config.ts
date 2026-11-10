/**
 * Resolves Supabase credentials from env, supporting both the new Supabase
 * key names (PUBLISHABLE / SECRET) and the classic names (ANON / SERVICE_ROLE).
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

/** Server-only secret/service-role key. Read lazily in admin.ts. */
export function getServiceKey(): string {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SECRET_KEY ??
    ""
  );
}

function looksPlaceholder(v: string): boolean {
  return (
    !v ||
    v.includes("PASTE_") ||
    v.includes("YOUR-PROJECT") ||
    v.includes("your-anon") ||
    v.includes("your-")
  );
}

/** True only when both public credentials are present and real. */
export function supabaseConfigured(): boolean {
  return !looksPlaceholder(SUPABASE_URL) && !looksPlaceholder(SUPABASE_ANON_KEY);
}
