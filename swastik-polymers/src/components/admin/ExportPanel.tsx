"use client";

import { useState } from "react";
import { IconDownload } from "@/components/ui/icons";
import { productInterestOptions } from "@/config/business";

const scopes = [
  { key: "all", label: "All Inquiries" },
  { key: "new", label: "New Inquiries" },
  { key: "converted", label: "Converted Leads" }
];

export function ExportPanel() {
  const [scope, setScope] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [product, setProduct] = useState("");

  function href(format: "xlsx" | "csv") {
    const p = new URLSearchParams({ format, scope });
    if (from) p.set("from", from);
    if (to) p.set("to", to);
    if (product) p.set("product", product);
    return `/admin/api/export?${p.toString()}`;
  }

  const sel =
    "w-full rounded-xl border border-brand-beige bg-white px-3 py-2.5 text-sm focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/30";

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-brand-brown">Export Inquiries</h1>
      <p className="text-sm text-brand-charcoal/60">
        Download leads as Excel or CSV. Filters are optional and can be combined.
      </p>

      <div className="mt-6 space-y-5 rounded-2xl border border-brand-beige bg-white p-6 shadow-card">
        <div>
          <span className="field-label">Which leads?</span>
          <div className="flex flex-wrap gap-2">
            {scopes.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setScope(s.key)}
                className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                  scope === s.key
                    ? "border-brand-brown bg-brand-brown text-white"
                    : "border-brand-beige text-brand-charcoal/70 hover:border-brand-brown/40"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="field-label">From date</span>
            <input type="date" className={sel} value={from} onChange={(e) => setFrom(e.target.value)} />
          </label>
          <label className="block">
            <span className="field-label">To date</span>
            <input type="date" className={sel} value={to} onChange={(e) => setTo(e.target.value)} />
          </label>
        </div>

        <label className="block">
          <span className="field-label">Specific product (optional)</span>
          <select className={sel} value={product} onChange={(e) => setProduct(e.target.value)}>
            <option value="">All products</option>
            {productInterestOptions.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <a href={href("xlsx")} className="btn-primary flex-1">
            <IconDownload width={18} height={18} /> Download Excel (.xlsx)
          </a>
          <a href={href("csv")} className="btn-outline flex-1">
            <IconDownload width={18} height={18} /> Download CSV (.csv)
          </a>
        </div>
      </div>
    </div>
  );
}
