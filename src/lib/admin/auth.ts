import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";

/** Require an authenticated admin in a server component. Redirects otherwise. */
export async function requireAdmin() {
  if (!supabaseConfigured()) redirect("/admin/login?setup=1");
  const supabase = createServerSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, email")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    redirect("/admin/login?denied=1");
  }
  return { user, email: profile.email ?? user.email ?? "", supabase };
}
