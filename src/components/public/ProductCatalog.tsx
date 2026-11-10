"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { IconArrow, IconWhatsApp } from "@/components/ui/icons";
import { productWaLink } from "@/lib/whatsapp";
import type { Product, ProductCategory } from "@/config/business";

const ALL = "All Products";

/** Fires a prefill event the InquiryForm listens for, then scrolls to it. */
function enquire(productName: string) {
  window.dispatchEvent(
    new CustomEvent("swastik:prefill-product", { detail: { productName } })
  );
  const el = document.getElementById("inquiry");
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function ProductCatalog({
  products,
  categories
}: {
  products: Product[];
  categories: ProductCategory[];
}) {
  const [active, setActive] = useState<string>(ALL);
  const tabs = [ALL, ...categories];

  const visible = useMemo(
    () => (active === ALL ? products : products.filter((p) => p.category === active)),
    [active, products]
  );

  return (
    <section id="products" className="section bg-brand-cream">
      <div className="container-x">
        {/* Editorial header */}
        <div className="flex flex-col gap-6 border-b border-brand-ink/15 pb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="eyebrow">Our Catalog</span>
            <h2 className="heading mt-3 text-[clamp(2.4rem,6vw,5rem)] uppercase leading-[0.92] text-brand-ink">
              The full range
            </h2>
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed text-brand-muted md:text-right">
            PVC electrical pipes and fittings, cable management, and garden pipes —
            everything we manufacture and supply, in one place.
          </p>
        </div>

        {/* Category filter */}
        <div className="mt-8 flex flex-wrap gap-2.5">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActive(t)}
              className={`rounded-full px-5 py-2.5 text-[12px] font-semibold uppercase tracking-wide transition ${
                active === t
                  ? "bg-brand-accent text-white shadow-glow"
                  : "bg-white text-brand-muted ring-1 ring-brand-ink/10 hover:text-brand-ink hover:ring-brand-ink/30"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <motion.article
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35 }}
                className="group relative flex flex-col overflow-hidden rounded-[22px] bg-white ring-1 ring-brand-ink/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift hover:ring-brand-accent/40"
              >
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-brand-ink">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.06]"
                  />
                  <span className="absolute left-4 top-4 font-display text-[13px] font-black uppercase tracking-wide text-white/90 drop-shadow">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {p.featured && (
                    <span className="absolute right-4 top-4 rounded-full bg-brand-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-glow">
                      Featured
                    </span>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-ink/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-accent">
                    {p.category}
                  </span>
                  <h3 className="heading mt-2 text-[20px] uppercase leading-[1.04] text-brand-ink">
                    {p.name}
                  </h3>
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-brand-muted">
                    {p.description}
                  </p>
                  {p.sizes && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.sizes.split(/[·|,]/).map((s) => s.trim()).filter(Boolean).map((s) => (
                        <span
                          key={s}
                          className="rounded-md bg-brand-stone px-2 py-1 text-[11px] font-semibold text-brand-ink ring-1 ring-brand-ink/10"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-5 flex flex-1 items-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => enquire(p.name)}
                      className="btn-primary flex-1 px-4 py-3 text-[12px]"
                    >
                      Enquire <IconArrow width={14} height={14} />
                    </button>
                    <a
                      href={productWaLink(p.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`WhatsApp about ${p.name}`}
                      className="inline-flex h-11 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white transition hover:brightness-95"
                    >
                      <IconWhatsApp width={20} height={20} />
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
