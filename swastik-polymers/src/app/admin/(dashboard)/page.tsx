import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { RecentFilter } from "@/components/admin/RecentFilter";
import type { Lead } from "@/lib/types";

export const dynamic = "force-dynamic";

function startOf(range: string): string | null {
  const now = new Date();
  if (range === "day") now.setHours(0, 0, 0, 0);
  else if (range === "week") now.setDate(now.getDate() - 7);
  else if (range === "month") now.setMonth(now.getMonth() - 1);
  else return null;
  return now.toISOString();
}

export default async function OverviewPage({
  searchParams
}: {
  searchParams: { range?: string };
}) {
  const { supabase, email } = await requireAdmin();
  const range = searchParams.range || "all";
  const since = startOf(range);

  let q = supabase.from("leads").select("*").order("created_at", { ascending: false });
  if (since) q = q.gte("created_at", since);
  const { data: leadsData } = await q;
  const leads = (leadsData ?? []) as Lead[];

  const { count: productCount } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true });

  const todayStr = new Date().toISOString().slice(0, 10);
  const kpis = [
    { label: "Total Inquiries", value: leads.length, tone: "brown" },
    { label: "New Inquiries", value: leads.filter((l) => l.status === "New").length, tone: "blue" },
    { label: "Contacted", value: leads.filter((l) => l.status === "Contacted").length, tone: "amber" },
    { label: "Converted Leads", value: leads.filter((l) => l.status === "Converted").length, tone: "green" },
    {
      label: "Pending Follow-ups",
      value: leads.filter((l) => l.follow_up_date && l.follow_up_date <= todayStr && l.status !== "Converted" && l.status !== "Rejected").length,
      tone: "purple"
    },
    { label: "Total Products", value: productCount ?? 0, tone: "gold" }
  ];

  const toneCls: Record<string, string> = {
    brown: "from-brand-brown to-brand-chocolate text-brand-white",
    blue: "bg-white text-blue-700",
    amber: "bg-white text-amber-700",
    green: "bg-white text-green-700",
    purple: "bg-white text-purple-700",
    gold: "bg-gold-gradient text-brand-chocolate"
  };

  const recent = leads.slice(0, 10);

  return (
    <div>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-brand-brown">Dashboard Overview</h1>
        <p className="text-sm text-brand-charcoal/60">
          Welcome back, {email}. Here is your latest inquiry activity.
        </p>
      </div>

      <div className="mt-6"><RecentFilter current={range} /></div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map((k) => (
          <div
            key={k.label}
            className={`rounded-2xl border border-brand-beige p-5 shadow-card ${
              k.tone === "brown" || k.tone === "gold"
                ? `bg-gradient-to-br ${toneCls[k.tone]}`
                : toneCls[k.tone]
            }`}
          >
            <p className="text-3xl font-bold">{k.value}</p>
            <p className={`mt-1 text-xs font-medium ${k.tone === "brown" || k.tone === "gold" ? "opacity-90" : "text-brand-charcoal/60"}`}>
              {k.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-brand-beige bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-brand-beige px-5 py-4">
          <h2 className="font-semibold text-brand-brown">Recent Inquiries</h2>
          <Link href="/admin/leads" className="text-sm font-medium text-brand-gold hover:underline">
            View all →
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="px-5 py-16 text-center text-sm text-brand-charcoal/50">
            No inquiries yet. New website inquiries will appear here automatically.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-brand-beige/40 text-xs uppercase tracking-wide text-brand-charcoal/60">
                <tr>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Business</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Products</th>
                  <th className="px-5 py-3">Qty</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-beige">
                {recent.map((l) => (
                  <tr key={l.id} className="hover:bg-brand-beige/20">
                    <td className="px-5 py-3 font-medium text-brand-charcoal">{l.full_name}</td>
                    <td className="px-5 py-3 text-brand-charcoal/70">{l.business_name || "—"}</td>
                    <td className="px-5 py-3 text-brand-charcoal/70">{l.phone}</td>
                    <td className="px-5 py-3 text-brand-charcoal/70">
                      {(l.products || []).slice(0, 2).join(", ")}
                      {(l.products || []).length > 2 ? "…" : ""}
                    </td>
                    <td className="px-5 py-3 text-brand-charcoal/70">{l.quantity}</td>
                    <td className="px-5 py-3 text-brand-charcoal/70">{l.inquiry_type}</td>
                    <td className="px-5 py-3 text-brand-charcoal/60">
                      {new Date(l.created_at).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-5 py-3"><StatusBadge status={l.status} /></td>
                    <td className="px-5 py-3">
                      <Link href={`/admin/leads/${l.id}`} className="font-medium text-brand-gold hover:underline">
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
