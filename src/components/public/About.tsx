"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export function About() {
  const reduce = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section id="about" className="relative overflow-hidden bg-brand-ink py-24 text-white sm:py-28">
      {/* faint grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "120px 120px"
        }}
      />

      <div className="container-x relative">
        {/* two-column intro */}
        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rotate-45 bg-brand-accent" />
              <span className="font-display text-xl font-extrabold uppercase tracking-tight">
                Who We Are
              </span>
            </div>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/65">
              Swastik Polymers manufactures PVC electrical pipes and fittings and
              supplies garden pipes. We serve retailers, electrical shops,
              distributors and contractors with dependable bulk supply.
            </p>
          </div>

          <div className="sm:text-right">
            <div className="flex items-center gap-2 sm:justify-end">
              <span className="font-display text-xl font-extrabold uppercase tracking-tight">
                What We Do
              </span>
              <span className="h-3 w-3 rotate-45 bg-brand-accent" />
            </div>
            <p className="ml-auto mt-4 max-w-sm text-[15px] leading-relaxed text-white/65">
              A focused range of PVC electrical products built for everyday
              reliability, available at wholesale quantities from a minimum of
              100 pieces, with direct and responsive service.
            </p>
          </div>
        </div>

        {/* giant ghost heading + floating product */}
        <div className="relative mt-16 flex items-center justify-center">
          <motion.h2
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease }}
            className="heading-xl select-none text-center text-[20vw] text-white/10 sm:text-[17vw] lg:text-[14vw]"
          >
            About Us
          </motion.h2>

          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="absolute w-44 overflow-hidden rounded-2xl bg-white shadow-lift ring-1 ring-white/20 sm:w-56 lg:w-64"
          >
            <Image
              src="/products/pvc-junction-boxes.jpg"
              alt="Swastik Polymers PVC product"
              width={320}
              height={280}
              className="h-full w-full object-cover"
            />
          </motion.div>
        </div>

        {/* justified caption */}
        <p className="mt-14 text-justify text-[13px] uppercase leading-relaxed tracking-wide text-white/45 [text-align-last:justify]">
          Swastik Polymers is a manufacturer and supplier of PVC electrical pipes,
          fittings and garden pipes based in Vizianagaram, Andhra Pradesh, serving
          retailers, distributors and contractors with dependable bulk supply,
          consistent quality and direct business communication for every inquiry.
        </p>
      </div>
    </section>
  );
}
