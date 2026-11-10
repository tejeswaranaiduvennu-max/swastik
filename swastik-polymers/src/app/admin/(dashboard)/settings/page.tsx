import { requireAdmin } from "@/lib/admin/auth";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { business } from "@/config/business";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("business_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  const initial = data ?? {
    business_name: business.name,
    proprietor_name: business.proprietor,
    phone: business.phone,
    whatsapp: business.whatsapp,
    email: business.email,
    address: business.address.full,
    gstin: business.gstin,
    minimum_order_quantity: business.minOrderQuantity,
    hero_heading: business.hero.heading,
    business_description: business.description,
    logo_url: null
  };

  return <SettingsForm initial={initial as any} />;
}
