"use client";

import { useRouter, useSearchParams } from "next/navigation";

const ranges = [
  { key: "day", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "all", label: "All Time" }
];

export function RecentFilter({ current }: { current: string }) {
  const router = useRouter();
  const params = useSearchParams();

  function pick(key: string) {
    const p = new URLSearchParams(params.toString());
    if (key === "all") p.delete("range");
    else p.set("range", key);
    router.push(`/admin?${p.toString()}`);
  }

  return (
    <div className="inline-flex flex-wrap gap-1 rounded-xl border border-brand-beige bg-white p-1">
      {ranges.map((r) => (
        <button
          key={r.key}
          type="button"
          onClick={() => pick(r.key)}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition ${
            current === r.key
              ? "bg-brand-brown text-brand-white"
              : "text-brand-charcoal/60 hover:bg-brand-beige"
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
