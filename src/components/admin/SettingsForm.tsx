"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateSettings } from "@/lib/admin/actions";
import type { BusinessSettings } from "@/lib/types";

type FormState = Omit<BusinessSettings, "id" | "updated_at">;

export function SettingsForm({ initial }: { initial: FormState }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [form, setForm] = useState<FormState>(initial);
  const [toast, setToast] = useState("");

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const r = await updateSettings({
        ...form,
        minimum_order_quantity: Number(form.minimum_order_quantity)
      });
      setToast(r.ok ? "Settings saved — the website is updated." : r.error || "Save failed");
      setTimeout(() => setToast(""), 3000);
      router.refresh();
    });
  }

  return (
    <form onSubmit={save}>
      {toast && (
        <div className="fixed right-5 top-5 z-50 rounded-xl bg-brand-brown px-4 py-2.5 text-sm font-medium text-white shadow-lift">
          {toast}
        </div>
      )}
      <h1 className="text-2xl font-bold text-brand-brown">Website Settings</h1>
      <p className="text-sm text-brand-charcoal/60">
        These values are reflected across the public website.
      </p>

      <div className="mt-6 space-y-6">
        <Card title="Business Details">
          <div className="grid gap-4 sm:grid-cols-2">
            <Text label="Business Name" value={form.business_name} onChange={(v) => set("business_name", v)} />
            <Text label="Proprietor Name" value={form.proprietor_name} onChange={(v) => set("proprietor_name", v)} />
            <Text label="Phone Number" value={form.phone} onChange={(v) => set("phone", v)} />
            <Text label="WhatsApp Number (with 91)" value={form.whatsapp} onChange={(v) => set("whatsapp", v)} />
            <Text label="Email Address" value={form.email ?? ""} onChange={(v) => set("email", v)} />
            <Text label="GSTIN" value={form.gstin} onChange={(v) => set("gstin", v)} />
            <div className="sm:col-span-2">
              <Text label="Business Address" value={form.address} onChange={(v) => set("address", v)} />
            </div>
            <Text label="Minimum Order Quantity" type="number" value={String(form.minimum_order_quantity)} onChange={(v) => set("minimum_order_quantity", Number(v) as any)} />
            <Text label="Business Logo URL" value={form.logo_url ?? ""} onChange={(v) => set("logo_url", v)} />
          </div>
        </Card>

        <Card title="Homepage Content">
          <Text label="Hero Heading" value={form.hero_heading} onChange={(v) => set("hero_heading", v)} />
          <label className="mt-4 block">
            <span className="field-label">Website Description</span>
            <textarea rows={3} className="field-input resize-y" value={form.business_description}
              onChange={(e) => set("business_description", e.target.value)} />
          </label>
        </Card>

        <button type="submit" disabled={pending} className="btn-primary px-6">
          {pending ? "Saving…" : "Save Settings"}
        </button>
      </div>
    </form>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-brand-beige bg-white p-6 shadow-card">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-gold">{title}</h2>
      {children}
    </section>
  );
}

function Text({
  label,
  value,
  onChange,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input type={type} className="field-input" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
