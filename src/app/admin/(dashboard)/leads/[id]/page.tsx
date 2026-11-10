import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { LeadDetail } from "@/components/admin/LeadDetail";
import type { Lead, LeadActivity } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({
  params
}: {
  params: { id: string };
}) {
  const { supabase } = await requireAdmin();

  const { data: lead } = await supabase
    .from("leads")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (!lead) notFound();

  const { data: activity } = await supabase
    .from("lead_activity")
    .select("*")
    .eq("lead_id", params.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <Link href="/admin/leads" className="text-sm font-medium text-brand-gold hover:underline">
        ← Back to leads
      </Link>
      <div className="mt-3 mb-6">
        <h1 className="text-2xl font-bold text-brand-brown">{(lead as Lead).full_name}</h1>
        <p className="text-sm text-brand-charcoal/60">
          {(lead as Lead).business_name || "Individual"} · {(lead as Lead).customer_type}
        </p>
      </div>
      <LeadDetail lead={lead as Lead} activity={(activity ?? []) as LeadActivity[]} />
    </div>
  );
}
