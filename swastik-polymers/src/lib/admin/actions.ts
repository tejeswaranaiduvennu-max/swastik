"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import type { LeadStatus } from "@/config/business";

async function client() {
  return createServerSupabase();
}

async function assertAdmin(supabase: Awaited<ReturnType<typeof client>>) {
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return user;
}

async function logActivity(
  supabase: Awaited<ReturnType<typeof client>>,
  leadId: string,
  type: string,
  description: string,
  userId?: string
) {
  await supabase.from("lead_activity").insert({
    lead_id: leadId,
    activity_type: type,
    description,
    created_by: userId ?? null
  });
}

// ---------- Leads ----------
export async function updateLeadStatus(id: string, status: LeadStatus) {
  const supabase = await client();
  const user = await assertAdmin(supabase);
  const patch: Record<string, any> = { status };
  if (status === "Contacted") patch.last_contacted_at = new Date().toISOString();
  const { error } = await supabase.from("leads").update(patch).eq("id", id);
  if (error) return { ok: false, error: error.message };
  await logActivity(supabase, id, "status_change", `Status changed to ${status}`, user.id);
  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
  return { ok: true };
}

export async function saveLeadDetails(
  id: string,
  payload: {
    full_name?: string;
    business_name?: string | null;
    phone?: string;
    whatsapp?: string | null;
    email?: string | null;
    customer_type?: string;
    internal_notes?: string | null;
    follow_up_date?: string | null;
  }
) {
  const supabase = await client();
  const user = await assertAdmin(supabase);
  const clean = Object.fromEntries(
    Object.entries(payload).filter(([, v]) => v !== undefined)
  );
  const { error } = await supabase.from("leads").update(clean).eq("id", id);
  if (error) return { ok: false, error: error.message };
  await logActivity(supabase, id, "updated", "Lead details updated", user.id);
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath("/admin/leads");
  return { ok: true };
}

export async function markContacted(id: string) {
  const supabase = await client();
  const user = await assertAdmin(supabase);
  const { error } = await supabase
    .from("leads")
    .update({ last_contacted_at: new Date().toISOString(), status: "Contacted" })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  await logActivity(supabase, id, "contacted", "Marked as contacted", user.id);
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath("/admin/leads");
  return { ok: true };
}

export async function setFollowUp(id: string, date: string | null) {
  const supabase = await client();
  const user = await assertAdmin(supabase);
  const { error } = await supabase
    .from("leads")
    .update({ follow_up_date: date })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  await logActivity(
    supabase,
    id,
    "follow_up",
    date ? `Follow-up scheduled for ${date}` : "Follow-up cleared",
    user.id
  );
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath("/admin/follow-ups");
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteLead(id: string) {
  const supabase = await client();
  await assertAdmin(supabase);
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return { ok: true };
}

// ---------- Products ----------
export async function upsertProduct(payload: {
  id?: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  image_url?: string | null;
  sizes?: string | null;
  is_featured: boolean;
  is_active: boolean;
}) {
  const supabase = await client();
  await assertAdmin(supabase);
  const { error } = await supabase
    .from("products")
    .upsert(payload, { onConflict: "slug" });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteProduct(id: string) {
  const supabase = await client();
  await assertAdmin(supabase);
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/");
  return { ok: true };
}

export async function toggleProductActive(id: string, is_active: boolean) {
  const supabase = await client();
  await assertAdmin(supabase);
  const { error } = await supabase
    .from("products")
    .update({ is_active })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/");
  return { ok: true };
}

export async function toggleProductFeatured(id: string, is_featured: boolean) {
  const supabase = await client();
  await assertAdmin(supabase);
  const { error } = await supabase
    .from("products")
    .update({ is_featured })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/");
  return { ok: true };
}

// ---------- Settings ----------
export async function updateSettings(payload: Record<string, any>) {
  const supabase = await client();
  await assertAdmin(supabase);
  const { data: existing } = await supabase
    .from("business_settings")
    .select("id")
    .limit(1)
    .maybeSingle();
  if (existing) {
    const { error } = await supabase
      .from("business_settings")
      .update(payload)
      .eq("id", existing.id);
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await supabase.from("business_settings").insert(payload);
    if (error) return { ok: false, error: error.message };
  }
  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { ok: true };
}
