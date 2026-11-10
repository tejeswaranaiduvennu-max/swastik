import { createServerSupabase } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";
import {
  business as fallbackBusiness,
  products as fallbackProducts,
  productCategories,
  type Product,
  type ProductCategory
} from "@/config/business";

export interface SiteData {
  hero: { heading: string; description: string };
  moq: number;
  products: Product[];
  categories: ProductCategory[];
  source: "supabase" | "config";
}

/**
 * Loads live settings + active products from Supabase when configured and the
 * tables exist. Falls back to the static config otherwise so the site always
 * renders. Public reads are allowed by RLS (anon select on active products).
 */
export async function getSiteData(): Promise<SiteData> {
  const fallback: SiteData = {
    hero: fallbackBusiness.hero,
    moq: fallbackBusiness.minOrderQuantity,
    products: fallbackProducts,
    categories: productCategories,
    source: "config"
  };

  if (!supabaseConfigured()) return fallback;

  try {
    const supabase = createServerSupabase();
    const [settingsRes, productsRes] = await Promise.all([
      supabase.from("business_settings").select("*").limit(1).maybeSingle(),
      supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("is_featured", { ascending: false })
        .order("name", { ascending: true })
    ]);

    const settings = settingsRes.data;
    const rows = productsRes.data;

    if (productsRes.error || !rows || rows.length === 0) return fallback;

    const products: Product[] = rows.map((r: any) => ({
      slug: r.slug,
      name: r.name,
      description: r.description,
      category: r.category,
      image: r.image_url || "/products/pvc-conduit-pipes.jpg",
      sizes: r.sizes || undefined,
      featured: r.is_featured
    }));

    const categories = Array.from(
      new Set(products.map((p) => p.category))
    ) as ProductCategory[];

    return {
      hero: settings
        ? { heading: settings.hero_heading, description: settings.business_description }
        : fallback.hero,
      moq: settings?.minimum_order_quantity ?? fallback.moq,
      products,
      categories: categories.length ? categories : productCategories,
      source: "supabase"
    };
  } catch {
    return fallback;
  }
}
