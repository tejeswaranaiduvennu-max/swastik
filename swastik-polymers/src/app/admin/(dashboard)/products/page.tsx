import { requireAdmin } from "@/lib/admin/auth";
import { ProductsManager } from "@/components/admin/ProductsManager";
import type { ProductRow } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("category", { ascending: true })
    .order("name", { ascending: true });
  return <ProductsManager products={(data ?? []) as ProductRow[]} />;
}
