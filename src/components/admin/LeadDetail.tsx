"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  IconPhone,
  IconWhatsApp,
  IconMail,
  IconCheck,
  IconTrash
} from "@/components/ui/icons";
import { leadStatuses, customerTypes } from "@/config/business";
import { adminWaLink, normalizePhone } from "@/lib/whatsapp";
import {
  updateLeadStatus,
  saveLeadDetails,
  markContacted,
  setFollowUp,
  deleteLead
} from "@/lib/admin/actions";
import type { Lead, LeadActivity } from "@/lib/types";

export function LeadDetail({
  lead,
  activity
}: {
  lead: Lead;
  activity: LeadActivity[];
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [toast, setToast] = useState("");
  const [edit, setEdit] = useState({
    full_name: lead.full_name,
    business_name: lead.business_name ?? "",
    phone: lead.phone,
    whatsapp: lead.whatsapp ?? "",
    email: lead.email ?? "",
    customer_type: lead.customer_type
  });
  const [notes, setNotes] = useState(lead.internal_notes ?? "");
  const [followUp, setFollowUpDate] = useState(lead.follow_up_date ?? "");
  const [status, setStatus] = useState(lead.status);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  const waHref = adminWaLink({
    customerPhone: lead.whatsapp || lead.phone,
    customerName: lead.full_name,
    products: lead.products
  });
  const telHref = `tel:+${normalizePhone(lead.phone)}`;
  const mailHref = lead.email
    ? `mailto:${lead.email}?subject=${encodeURIComponent("Swastik Polymers — your inquiry")}`
    : undefined;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      {toast && (
        <div className="fixed right-5 top-5 z-50 rounded-xl bg-brand-brown px-4 py-2.5 text-sm font-medium text-white shadow-lift">
          {toast}
        </div>
      )}

      {/* Left: customer + inquiry info */}
      <div className="space-y-6">
        <section className="rounded-2xl border border-brand-beige bg-white p-6 shadow-card">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-gold">
            Customer Information
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name">
              <input className="field-input" value={edit.full_name}
                onChange={(e) => setEdit({ ...edit, full_name: e.target.value })} />
            </Field>
            <Field label="Business / Shop Name">
              <input className="field-input" value={edit.business_name}
                onChange={(e) => setEdit({ ...edit, business_name: e.target.value })} />
            </Field>
            <Field label="Mobile Number">
              <input className="field-input" value={edit.phone}
                onChange={(e) => setEdit({ ...edit, phone: e.target.value })} />
            </Field>
            <Field label="WhatsApp Number">
              <input className="field-input" value={edit.whatsapp}
                onChange={(e) => setEdit({ ...edit, whatsapp: e.target.value })} />
            </Field>
            <Field label="Email Address">
              <input className="field-input" value={edit.email}
                onChange={(e) => setEdit({ ...edit, email: e.target.value })} />
            </Field>
            <Field label="Customer Type">
              <select className="field-input" value={edit.customer_type}
                onChange={(e) => setEdit({ ...edit, customer_type: e.target.value })}>
                {customerTypes.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </div>
          <button
            disabled={pending}
            onClick={() =>
              start(async () => {
                const r = await saveLeadDetails(lead.id, {
                  ...edit,
                  business_name: edit.business_name || null,
                  whatsapp: edit.whatsapp || null,
                  email: edit.email || null
                });
                flash(r.ok ? "Customer details saved" : r.error || "Save failed");
                router.refresh();
              })
            }
            className="btn-primary mt-5 px-5 py-2.5 text-sm"
          >
            Save Customer Info
          </button>
        </section>

        <section className="rounded-2xl border border-brand-beige bg-white p-6 shadow-card">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-gold">
            Inquiry Information
          </h2>
          <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            <Row k="Inquiry Type" v={lead.inquiry_type} />
            <Row k="Required Quantity" v={`${lead.quantity} pieces`} />
            <Row k="Preferred Contact" v={lead.preferred_contact} />
            <Row k="Submitted" v={new Date(lead.created_at).toLocaleString("en-IN")} />
          </dl>
          <div className="mt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-brand-charcoal/50">Interested Products</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(lead.products || []).map((p) => (
                <span key={p} className="rounded-lg bg-brand-beige px-2.5 py-1 text-xs font-medium text-brand-brown">{p}</span>
              ))}
            </div>
          </div>
          {lead.requirements && (
            <div className="mt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-brand-charcoal/50">Additional Requirements</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-brand-charcoal/80">{lead.requirements}</p>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-brand-beige bg-white p-6 shadow-card">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-gold">Activity Timeline</h2>
          {activity.length === 0 ? (
            <p className="text-sm text-brand-charcoal/50">No activity recorded yet.</p>
          ) : (
            <ul className="space-y-3">
              {activity.map((a) => (
                <li key={a.id} className="flex gap-3 text-sm">
                  <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-brand-gold" />
                  <div>
                    <p className="text-brand-charcoal/80">{a.description}</p>
                    <p className="text-xs text-brand-charcoal/45">{new Date(a.created_at).toLocaleString("en-IN")}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Right: management */}
      <div className="space-y-6">
        <section className="rounded-2xl border border-brand-beige bg-white p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-gold">Lead Status</h2>
            <StatusBadge status={lead.status} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {leadStatuses.map((s) => (
              <button
                key={s}
                disabled={pending}
                onClick={() =>
                  start(async () => {
                    setStatus(s);
                    const r = await updateLeadStatus(lead.id, s);
                    flash(r.ok ? `Status → ${s}` : r.error || "Failed");
                    router.refresh();
                  })
                }
                className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                  status === s
                    ? "border-brand-brown bg-brand-brown text-white"
                    : "border-brand-beige text-brand-charcoal/70 hover:border-brand-brown/40"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-brand-beige bg-white p-6 shadow-card">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-gold">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-2">
            <a href={telHref} className="btn-primary justify-start px-4 py-2.5 text-sm">
              <IconPhone width={17} height={17} /> Call Customer
            </a>
            <a href={waHref} target="_blank" rel="noopener noreferrer"
              className="btn justify-start bg-[#25D366] px-4 py-2.5 text-sm text-white hover:brightness-95">
              <IconWhatsApp width={17} height={17} /> Open WhatsApp
            </a>
            <a
              href={mailHref}
              className={`btn-outline justify-start px-4 py-2.5 text-sm ${!mailHref ? "pointer-events-none opacity-50" : ""}`}
            >
              <IconMail width={17} height={17} /> Send Email
            </a>
            <button
              disabled={pending}
              onClick={() =>
                start(async () => {
                  const r = await markContacted(lead.id);
                  flash(r.ok ? "Marked as contacted" : r.error || "Failed");
                  router.refresh();
                })
              }
              className="btn-ghost justify-start px-4 py-2.5 text-sm"
            >
              <IconCheck width={17} height={17} /> Mark as Contacted
            </button>
          </div>
          {lead.last_contacted_at && (
            <p className="mt-3 text-xs text-brand-charcoal/50">
              Last contacted: {new Date(lead.last_contacted_at).toLocaleString("en-IN")}
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-brand-beige bg-white p-6 shadow-card">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-gold">Follow-up</h2>
          <input
            type="date"
            className="field-input"
            value={followUp}
            onChange={(e) => setFollowUpDate(e.target.value)}
          />
          <div className="mt-3 flex gap-2">
            <button
              disabled={pending}
              onClick={() =>
                start(async () => {
                  const r = await setFollowUp(lead.id, followUp || null);
                  flash(r.ok ? "Follow-up saved" : r.error || "Failed");
                  router.refresh();
                })
              }
              className="btn-primary flex-1 px-4 py-2.5 text-sm"
            >
              Save Follow-up
            </button>
            {lead.follow_up_date && (
              <button
                disabled={pending}
                onClick={() =>
                  start(async () => {
                    setFollowUpDate("");
                    await setFollowUp(lead.id, null);
                    flash("Follow-up cleared");
                    router.refresh();
                  })
                }
                className="btn-ghost px-4 py-2.5 text-sm"
              >
                Clear
              </button>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-brand-beige bg-white p-6 shadow-card">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-gold">Internal Notes & Remarks</h2>
          <textarea
            rows={5}
            className="field-input resize-y"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Admin-only notes about this lead…"
          />
          <button
            disabled={pending}
            onClick={() =>
              start(async () => {
                const r = await saveLeadDetails(lead.id, { internal_notes: notes || null });
                flash(r.ok ? "Notes saved" : r.error || "Failed");
                router.refresh();
              })
            }
            className="btn-primary mt-3 w-full px-4 py-2.5 text-sm"
          >
            Save Notes
          </button>
        </section>

        <section className="rounded-2xl border border-red-200 bg-red-50/50 p-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-red-600">Danger Zone</h2>
          <button
            disabled={pending}
            onClick={() => {
              if (!confirm(`Delete lead from ${lead.full_name}? This cannot be undone.`)) return;
              start(async () => {
                const r = await deleteLead(lead.id);
                if (r.ok) router.push("/admin/leads");
                else flash(r.error || "Delete failed");
              });
            }}
            className="btn justify-start border border-red-300 bg-white px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
          >
            <IconTrash width={17} height={17} /> Delete Lead
          </button>
        </section>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      {children}
    </label>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-brand-charcoal/50">{k}</dt>
      <dd className="mt-0.5 font-medium text-brand-charcoal/85">{v}</dd>
    </div>
  );
}
