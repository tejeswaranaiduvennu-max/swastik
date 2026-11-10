import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Lead } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const supabase = createServerSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile || profile.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const url = new URL(req.url);
  const format = url.searchParams.get("format") === "csv" ? "csv" : "xlsx";
  const scope = url.searchParams.get("scope") || "all";
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const product = url.searchParams.get("product");

  let q = supabase.from("leads").select("*").order("created_at", { ascending: false });
  if (scope === "new") q = q.eq("status", "New");
  else if (scope === "converted") q = q.eq("status", "Converted");
  if (from) q = q.gte("created_at", from);
  if (to) q = q.lte("created_at", to + "T23:59:59");
  if (product) q = q.contains("products", [product]);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const leads = (data ?? []) as Lead[];
  const rows = leads.map((l) => ({
    "Full Name": l.full_name,
    "Business Name": l.business_name ?? "",
    Phone: l.phone,
    WhatsApp: l.whatsapp ?? "",
    Email: l.email ?? "",
    "Customer Type": l.customer_type,
    "Inquiry Type": l.inquiry_type,
    Products: (l.products ?? []).join(", "),
    Quantity: l.quantity,
    "Additional Requirements": l.requirements ?? "",
    "Preferred Contact": l.preferred_contact,
    Status: l.status,
    "Internal Notes": l.internal_notes ?? "",
    "Follow-up Date": l.follow_up_date ?? "",
    "Last Contacted": l.last_contacted_at
      ? new Date(l.last_contacted_at).toLocaleString("en-IN")
      : "",
    "Submitted On": new Date(l.created_at).toLocaleString("en-IN")
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const stamp = new Date().toISOString().slice(0, 10);
  const base = `swastik-leads-${scope}-${stamp}`;

  if (format === "csv") {
    const csv = XLSX.utils.sheet_to_csv(ws);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${base}.csv"`
      }
    });
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Leads");
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  return new NextResponse(buf, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${base}.xlsx"`
    }
  });
}
