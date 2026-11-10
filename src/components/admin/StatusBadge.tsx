import type { LeadStatus } from "@/config/business";

const styles: Record<string, string> = {
  New: "bg-blue-100 text-blue-700",
  Contacted: "bg-amber-100 text-amber-700",
  "Follow-up Required": "bg-purple-100 text-purple-700",
  "Quotation Sent": "bg-cyan-100 text-cyan-700",
  Converted: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-600"
};

export function StatusBadge({ status }: { status: LeadStatus | string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}
