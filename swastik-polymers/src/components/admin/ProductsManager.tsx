"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { IconPlus, IconEdit, IconTrash } from "@/components/ui/icons";
import { productCategories } from "@/config/business";
import {
  upsertProduct,
  deleteProduct,
  toggleProductActive,
  toggleProductFeatured
} from "@/lib/admin/actions";
import type { ProductRow } from "@/lib/types";

const blank = {
  id: undefined as string | undefined,
  slug: "",
  name: "",
  description: "",
  category: productCategories[0] as string,
  image_url: "",
  sizes: "",
  is_featured: false,
  is_active: true
};

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function ProductsManager({ products }: { products: ProductRow[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState<typeof blank | null>(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState("");

  function flash(m: string) {
    setToast(m);
    setTimeout(() => setToast(""), 2500);
  }

  async function onFile(file: File) {
    if (!editing) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `${slugify(editing.slug || editing.name || "product")}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("product-images")
        .upload(path, file, { upsert: true });
      if (error) {
        flash("Upload failed: " + error.message);
      } else {
        const { data } = supabase.storage.from("product-images").getPublicUrl(path);
        setEditing({ ...editing, image_url: data.publicUrl });
        flash("Image uploaded");
      }
    } finally {
      setUploading(false);
    }
  }

  function save() {
    if (!editing) return;
    const payload = {
      ...editing,
      slug: editing.slug || slugify(editing.name),
      image_url: editing.image_url || null,
      sizes: editing.sizes?.trim() || null
    };
    start(async () => {
      const r = await upsertProduct(payload);
      if (r.ok) {
        flash(editing.id ? "Product updated" : "Product added");
        setEditing(null);
        router.refresh();
      } else {
        flash(r.error || "Save failed");
      }
    });
  }

  return (
    <div>
      {toast && (
        <div className="fixed right-5 top-5 z-50 rounded-xl bg-brand-brown px-4 py-2.5 text-sm font-medium text-white shadow-lift">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-brown">Products</h1>
          <p className="text-sm text-brand-charcoal/60">
            {products.length} products. Changes reflect on the public website immediately.
          </p>
        </div>
        <button onClick={() => setEditing({ ...blank })} className="btn-primary px-4 py-2.5 text-sm">
          <IconPlus width={17} height={17} /> Add Product
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div key={p.id} className="overflow-hidden rounded-2xl border border-brand-beige bg-white shadow-card">
            <div className="relative aspect-[4/3] bg-brand-beige/40">
              {p.image_url ? (
                <Image src={p.image_url} alt={p.name} fill className="object-cover" sizes="300px" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-brand-charcoal/40">No image</div>
              )}
              {!p.is_active && (
                <span className="absolute right-2 top-2 rounded-lg bg-brand-charcoal/80 px-2 py-0.5 text-xs text-white">Hidden</span>
              )}
              {p.is_featured && (
                <span className="absolute left-2 top-2 rounded-lg bg-brand-gold px-2 py-0.5 text-xs font-semibold text-brand-chocolate">Featured</span>
              )}
            </div>
            <div className="p-4">
              <p className="text-xs text-brand-gold">{p.category}</p>
              <h3 className="mt-0.5 font-semibold text-brand-brown">{p.name}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-brand-charcoal/60">{p.description}</p>
              {p.sizes && (
                <p className="mt-1.5 inline-block rounded-md bg-brand-beige px-2 py-0.5 text-[11px] font-medium text-brand-brown">{p.sizes}</p>
              )}

              <div className="mt-3 flex flex-wrap gap-3 text-xs">
                <label className="inline-flex items-center gap-1.5 text-brand-charcoal/70">
                  <input type="checkbox" checked={p.is_active}
                    onChange={(e) => start(async () => { await toggleProductActive(p.id, e.target.checked); router.refresh(); })}
                    className="h-4 w-4 rounded text-brand-brown" /> Active
                </label>
                <label className="inline-flex items-center gap-1.5 text-brand-charcoal/70">
                  <input type="checkbox" checked={p.is_featured}
                    onChange={(e) => start(async () => { await toggleProductFeatured(p.id, e.target.checked); router.refresh(); })}
                    className="h-4 w-4 rounded text-brand-brown" /> Featured
                </label>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setEditing({
                    id: p.id, slug: p.slug, name: p.name, description: p.description,
                    category: p.category, image_url: p.image_url ?? "",
                    sizes: p.sizes ?? "",
                    is_featured: p.is_featured, is_active: p.is_active
                  })}
                  className="btn-ghost flex-1 px-3 py-2 text-xs"
                >
                  <IconEdit width={15} height={15} /> Edit
                </button>
                <button
                  onClick={() => {
                    if (!confirm(`Delete "${p.name}"?`)) return;
                    start(async () => { await deleteProduct(p.id); flash("Product deleted"); router.refresh(); });
                  }}
                  className="btn px-3 py-2 text-xs border border-red-200 text-red-600 hover:bg-red-50"
                >
                  <IconTrash width={15} height={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lift" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-brand-brown">
              {editing.id ? "Edit Product" : "Add Product"}
            </h2>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="field-label">Product Name</span>
                <input className="field-input" value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </label>
              <label className="block">
                <span className="field-label">Slug (URL id)</span>
                <input className="field-input" value={editing.slug}
                  placeholder={slugify(editing.name) || "auto-generated"}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
              </label>
              <label className="block">
                <span className="field-label">Description</span>
                <textarea rows={3} className="field-input resize-y" value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </label>
              <label className="block">
                <span className="field-label">Sizes <span className="font-normal text-brand-charcoal/40">(shown as a chip on the card)</span></span>
                <input className="field-input" value={editing.sizes}
                  placeholder="e.g. 16mm · 20mm · 25mm · 32mm"
                  onChange={(e) => setEditing({ ...editing, sizes: e.target.value })} />
              </label>
              <label className="block">
                <span className="field-label">Category</span>
                <select className="field-input" value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                  {productCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="field-label">Image URL</span>
                <input className="field-input" value={editing.image_url}
                  placeholder="/products/example.svg or https://…"
                  onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} />
              </label>
              <label className="block">
                <span className="field-label">Or upload an image</span>
                <input type="file" accept="image/*" disabled={uploading}
                  onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
                  className="block w-full text-sm text-brand-charcoal/70 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-beige file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-brown" />
                {uploading && <span className="text-xs text-brand-charcoal/50">Uploading…</span>}
              </label>
              <div className="flex gap-4">
                <label className="inline-flex items-center gap-2 text-sm text-brand-charcoal/70">
                  <input type="checkbox" checked={editing.is_active}
                    onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                    className="h-4 w-4 rounded text-brand-brown" /> Active on website
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-brand-charcoal/70">
                  <input type="checkbox" checked={editing.is_featured}
                    onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })}
                    className="h-4 w-4 rounded text-brand-brown" /> Featured
                </label>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={save} disabled={pending || !editing.name} className="btn-primary flex-1">
                {pending ? "Saving…" : "Save Product"}
              </button>
              <button onClick={() => setEditing(null)} className="btn-ghost">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
