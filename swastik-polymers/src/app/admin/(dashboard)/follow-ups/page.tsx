import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { StatusBadge } from "@/components/admin/StatusBadge";
import type { Lead } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function FollowUpsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("leads")
    .select("*")
    .not("follow_up_date", "is", null)
    .order("follow_up_date", { ascending: true });

  const leads = (data ?? []) as Lead[];
  const today = new Date().toISOString().slice(0, 10);
  const done = (l: Lead) => l.status === "Converted" || l.status === "Rejected";

  const buckets = {
    overdue: leads.filter((l) => l.follow_up_date! < today && !done(l)),
    today: leads.filter((l) => l.follow_up_date === today && !done(l)),
    upcoming: leads.filter((l) => l.follow_up_date! > today && !done(l)),
    completed: leads.filter((l) => done(l))
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-brown">Follow-ups</h1>
      <p className="text-sm text-brand-charcoal/60">
        Stay on top of scheduled follow-ups so no potential customer is missed.
      </p>

      <div className="mt-6 space-y-6">
        <Group title="Overdue" tone="red" leads={buckets.overdue} emptyText="No overdue follow-ups. Great!" />
        <Group title="Today" tone="gold" leads={buckets.today} emptyText="Nothing due today." />
        <Group title="Upcoming" tone="blue" leads={buckets.upcoming} emptyText="No upcoming follow-ups scheduled." />
        <Group title="Completed" tone="green" leads={buckets.completed} emptyText="No completed follow-ups yet." />
      </div>
    </div>
  );
}

function Group({
  title,
  tone,
  leads,
  emptyText
}: {
  title: string;
  tone: "red" | "gold" | "blue" | "green";
  leads: Lead[];
  emptyText: string;
}) {
  const bar: Record<string, string> = {
    red: "bg-red-500",
    gold: "bg-brand-gold",
    blue: "bg-blue-500",
    green: "bg-green-500"
  };
  return (
    <section className="rounded-2xl border border-brand-beige bg-white shadow-card">
      <div className="flex items-center gap-2 border-b border-brand-beige px-5 py-3">
        <span className={`h-2.5 w-2.5 rounded-full ${bar[tone]}`} />
        <h2 className="font-semibold text-brand-brown">{title}</h2>
        <span className="ml-1 rounded-full bg-brand-beige px-2 py-0.5 text-xs font-medium text-brand-charcoal/60">
          {leads.length}
        </span>
      </div>
      {leads.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-brand-charcoal/45">{emptyText}</p>
      ) : (
        <ul className="divide-y divide-brand-beige">
          {leads.map((l) => (
            <li key={l.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
              <div>
                <p className="font-medium text-brand-charcoal">{l.full_name}</p>
                <p className="text-xs text-brand-charcoal/55">
                  {l.business_name || l.customer_type} · {l.phone}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-brand-charcoal/50">Follow-up</p>
                  <p className="text-sm font-medium text-brand-brown">
                    {new Date(l.follow_up_date!).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <StatusBadge status={l.status} />
                <Link href={`/admin/leads/${l.id}`} className="text-sm font-medium text-brand-gold hover:underline">
                  Open
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
