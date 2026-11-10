"use client";

import { motion, useReducedMotion } from "framer-motion";
import { IconTruck, IconBox, IconLayers, IconChat } from "@/components/ui/icons";

const features = [
  { no: "01", icon: IconBox, title: "Manufacturer & Supplier", body: "We manufacture PVC electrical pipes and fittings in-house and supply them directly." },
  { no: "02", icon: IconTruck, title: "Bulk Order Support", body: "Wholesale inquiries welcomed, starting from a minimum of 100 pieces." },
  { no: "03", icon: IconLayers, title: "Full Product Range", body: "Pipes, fittings, cable management, boxes and garden pipes in one catalog." },
  { no: "04", icon: IconChat, title: "Direct Communication", body: "Talk to the business directly for product details and bulk pricing." }
];

export function WhyChoose() {
  const reduce = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section className="bg-brand-cream py-24 sm:py-28">
      <div className="container-x">
        <div className="max-w-3xl">
          <span className="eyebrow">Why Swastik Polymers</span>
          <h2 className="heading mt-3">
            Built on <span className="text-brand-accent">reliability</span>, supplied at scale
          </h2>
        </div>

        <div className="mt-14 divide-y divide-brand-border border-y border-brand-border">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.no}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.06, ease }}
                className="group grid grid-cols-[auto_1fr] items-center gap-6 py-7 transition-colors hover:bg-white sm:grid-cols-[80px_56px_1fr_auto] sm:gap-8 sm:px-4"
              >
                <span className="font-display text-2xl font-black text-brand-accent sm:text-3xl">
                  {f.no}
                </span>
                <span className="hidden h-14 w-14 items-center justify-center rounded-full bg-brand-ink text-brand-accent sm:inline-flex">
                  <Icon width={24} height={24} />
                </span>
                <div className="col-span-1">
                  <h3 className="font-display text-xl font-extrabold uppercase tracking-tight text-brand-ink sm:text-2xl">
                    {f.title}
                  </h3>
                  <p className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-brand-muted">
                    {f.body}
                  </p>
                </div>
                <span className="hidden text-brand-border transition-colors group-hover:text-brand-accent sm:block">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
