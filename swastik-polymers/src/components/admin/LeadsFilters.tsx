"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { IconSearch } from "@/components/ui/icons";
import { leadStatuses, inquiryTypes, productInterestOptions } from "@/config/business";

export function LeadsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get("q") ?? "");

  useEffect(() => {
    setSearch(params.get("q") ?? "");
  }, [params]);

  function update(key: string, value: string) {
    const p = new URLSearchParams(params.toString());
    if (value) p.set(key, value);
    else p.delete(key);
    router.push(`${pathname}?${p.toString()}`);
  }

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    update("q", search.trim());
  }

  const sel =
    "rounded-xl border border-brand-beige bg-white px-3 py-2 text-sm text-brand-charcoal/80 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/30";

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
      <form onSubmit={onSearch} className="relative flex-1 min-w-[220px]">
        <IconSearch
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand-charcoal/40"
          width={18}
          height={18}
        />
        <input
          className="w-full rounded-xl border border-brand-beige bg-white py-2 pl-10 pr-3 text-sm focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/30"
          placeholder="Search by name or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>

      <select className={sel} value={params.get("status") ?? ""} onChange={(e) => update("status", e.target.value)}>
        <option value="">All Statuses</option>
        {leadStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      <select className={sel} value={params.get("type") ?? ""} onChange={(e) => update("type", e.target.value)}>
        <option value="">All Inquiry Types</option>
        {inquiryTypes.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      <select className={sel} value={params.get("product") ?? ""} onChange={(e) => update("product", e.target.value)}>
        <option value="">All Products</option>
        {productInterestOptions.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      <select className={sel} value={params.get("minqty") ?? ""} onChange={(e) => update("minqty", e.target.value)}>
        <option value="">Any Quantity</option>
        <option value="100">100+</option>
        <option value="500">500+</option>
        <option value="1000">1000+</option>
        <option value="5000">5000+</option>
      </select>

      <select className={sel} value={params.get("sort") ?? "newest"} onChange={(e) => update("sort", e.target.value)}>
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
      </select>
    </div>
  );
}
