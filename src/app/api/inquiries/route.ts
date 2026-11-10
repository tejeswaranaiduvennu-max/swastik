import { NextResponse } from "next/server";
import { validateInquiry } from "@/lib/validation";
import { supabaseConfigured } from "@/lib/supabase/config";
import { createAdminSupabase, serviceKeyConfigured } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// --- simple in-memory rate limiter (per IP, per hour) ---
const WINDOW_MS = 60 * 60 * 1000;
const LIMIT = Number(process.env.INQUIRY_RATE_LIMIT_PER_HOUR ?? 8);
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > LIMIT;
}

// Short-window duplicate guard (same phone + same payload hash)
const recent = new Map<string, number>();
function isDuplicate(key: string): boolean {
  const now = Date.now();
  Array.from(recent.entries()).forEach(([k, t]) => {
    if (now - t > 2 * 60 * 1000) recent.delete(k);
  });
  if (recent.has(key)) return true;
  recent.set(key, now);
  return false;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many inquiries from this network. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Server-authoritative validation (never trust the client)
  const result = validateInquiry(body as any);
  if (!result.ok || !result.clean) {
    if (result.errors.company_website) {
      // Honeypot tripped — pretend success to the bot
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json(
      { error: "Please check your details and try again.", fields: result.errors },
      { status: 422 }
    );
  }

  const clean = result.clean;
  const dupKey = `${clean.phone}:${clean.quantity}:${clean.products.join("|")}`;
  if (isDuplicate(dupKey)) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  if (!supabaseConfigured() || !serviceKeyConfigured()) {
    return NextResponse.json(
      {
        error:
          "Inquiry storage is not configured yet. Please contact us on WhatsApp or by phone.",
        setup: "Set Supabase keys in .env.local and run the migrations."
      },
      { status: 503 }
    );
  }

  try {
    const supabase = createAdminSupabase();
    const { data, error } = await supabase
      .from("leads")
      .insert({
        full_name: clean.full_name,
        business_name: clean.business_name,
        phone: clean.phone,
        whatsapp: clean.whatsapp,
        email: clean.email,
        customer_type: clean.customer_type,
        inquiry_type: clean.inquiry_type,
        products: clean.products,
        quantity: clean.quantity,
        requirements: clean.requirements,
        preferred_contact: clean.preferred_contact,
        status: "New"
      })
      .select("id")
      .single();

    if (error) {
      console.error("Lead insert failed:", error.message);
      return NextResponse.json(
        { error: "We could not save your inquiry. Please try WhatsApp or call us." },
        { status: 500 }
      );
    }

    // Log initial activity (best-effort)
    await supabase.from("lead_activity").insert({
      lead_id: data.id,
      activity_type: "created",
      description: "Inquiry submitted via website."
    });

    return NextResponse.json({ ok: true, id: data.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Unexpected error. Please contact us on WhatsApp." },
      { status: 500 }
    );
  }
}
