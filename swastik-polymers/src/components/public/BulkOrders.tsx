"use client";

import { motion, useReducedMotion } from "framer-motion";
import { IconArrow } from "@/components/ui/icons";
import { waLink } from "@/lib/whatsapp";

export function BulkOrders({ moq }: { moq: number }) {
  const reduce = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section id="bulk-orders" className="relative overflow-hidden bg-brand-ink py-24 text-white sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-brand-accent/20 blur-[120px]"
      />
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <span className="eyebrow">Wholesale Supply</span>
          <h2 className="heading mt-3 text-white">
            Looking for <span className="text-brand-accent">bulk</span> PVC products?
          </h2>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-white/65 sm:text-[19px]">
            Partner with Swastik Polymers for dependable bulk supply of PVC
            electrical products and accessories. We welcome inquiries from
            retailers, wholesalers, distributors and contractors.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#inquiry" className="btn-gold">
              Submit Bulk Inquiry <IconArrow width={17} height={17} />
            </a>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn border border-white/25 bg-transparent text-white hover:border-white"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>

        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="relative text-center"
        >
          <p className="text-[12px] font-bold uppercase tracking-[0.3em] text-brand-accent">
            Minimum Order Quantity
          </p>
          <p className="heading-xl mt-2 text-[34vw] leading-[0.8] text-white sm:text-[22vw] lg:text-[16vw]">
            {moq}
          </p>
          <p className="font-display text-2xl font-black uppercase tracking-tight text-white/80">
            Pieces
          </p>
        </motion.div>
      </div>
    </section>
  );
}
