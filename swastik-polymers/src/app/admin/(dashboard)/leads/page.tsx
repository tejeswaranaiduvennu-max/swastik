import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { LeadsFilters } from "@/components/admin/LeadsFilters";
import type { Lead } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function LeadsPage({
  searchParams
}: {
  searchParams: {
    q?: string;
    status?: string;
    type?: string;
    product?: string;
    minqty?: string;
    sort?: string;
  };
}) {
  const { supabase } = await requireAdmin();

  let q = supabase.from("leads").select("*");
  if (searchParams.status) q = q.eq("status", searchParams.status);
  if (searchParams.type) q = q.eq("inquiry_type", searchParams.type);
  if (searchParams.product) q = q.contains("products", [searchParams.product]);
  if (searchParams.minqty) q = q.gte("quantity", Number(searchParams.minqty));
  if (searchParams.q) {
    const term = searchParams.q.replace(/[%,]/g, "");
    q = q.or(`full_name.ilike.%${term}%,phone.ilike.%${term}%,business_name.ilike.%${term}%`);
  }
  q = q.order("created_at", { ascending: searchParams.sort === "oldest" });

  const { data, error } = await q;
  const leads = (data ?? []) as Lead[];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-brand-brown">Leads</h1>
          <p className="text-sm text-brand-charcoal/60">
            {leads.length} {leads.length === 1 ? "inquiry" : "inquiries"} found.
          </p>
        </div>
        <Link href="/admin/exports" className="btn-outline px-4 py-2 text-sm">
          Export Leads
        </Link>
      </div>

      <div className="mt-6 rounded-2xl border border-brand-beige bg-white p-4 shadow-card">
        <LeadsFilters />
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Could not load leads: {error.message}. Have you run the database migrations?
        </div>
      )}

      <div className="mt-5 rounded-2xl border border-brand-beige bg-white shadow-card">
        {leads.length === 0 ? (
          <div className="px-5 py-16 text-center text-sm text-brand-charcoal/50">
            No leads match these filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
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
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-beige">
                {leads.map((l) => (
                  <tr key={l.id} className="hover:bg-brand-beige/20">
                    <td className="px-5 py-3 font-medium text-brand-charcoal">{l.full_name}</td>
                    <td className="px-5 py-3 text-brand-charcoal/70">{l.business_name || "—"}</td>
                    <td className="px-5 py-3 text-brand-charcoal/70">{l.phone}</td>
                    <td className="px-5 py-3 text-brand-charcoal/70">
                      {(l.products || []).slice(0, 2).join(", ")}
                      {(l.products || []).length > 2 ? ` +${l.products.length - 2}` : ""}
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
