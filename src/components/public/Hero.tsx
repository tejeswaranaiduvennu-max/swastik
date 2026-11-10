"use client";

import { motion, useReducedMotion } from "framer-motion";
import { IconArrow } from "@/components/ui/icons";

export function Hero({
  heading,
  description
}: {
  heading: string;
  description: string;
}) {
  const reduce = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease }
  });

  return (
    <section id="home" className="relative min-h-[100svh] overflow-hidden bg-[#C3D2DE]">
      {/* sky + crane background */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-sky.svg')" }}
      />

      <div className="container-x relative flex min-h-[100svh] flex-col justify-between pb-10 pt-24 sm:pt-28">
        {/* Oversized wordmark, top-right */}
        <motion.h1
          {...rise(0.05)}
          className="heading-xl text-right text-[16vw] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.25)] sm:text-[12vw] lg:text-[9.5vw]"
        >
          Swastik
          <br />
          Polymers
        </motion.h1>

        {/* Middle row: scroll button + orange callout */}
        <div className="grid flex-1 items-center gap-10 py-8 sm:grid-cols-2">
          <motion.div {...rise(0.18)} className="order-2 sm:order-1">
            <a
              href="#products"
              aria-label="Scroll to products"
              className="group inline-flex h-24 w-24 items-center justify-center rounded-full bg-brand-accent text-white shadow-glow transition hover:brightness-110 sm:h-28 sm:w-28"
            >
              <span className="animate-bob">
                <IconArrow className="rotate-90" width={30} height={30} />
              </span>
            </a>
          </motion.div>

          <motion.div {...rise(0.24)} className="order-1 text-left sm:order-2 sm:text-right">
            <p className="font-display text-[20px] font-black uppercase leading-tight tracking-tight text-brand-accent sm:text-[24px]">
              Manufacturer
              <br />& Supplier
            </p>
            <p className="ml-auto mt-3 max-w-sm text-[15px] leading-relaxed text-brand-ink/80 sm:text-[16px]">
              {description}
            </p>
          </motion.div>
        </div>

        {/* Bottom oversized headline */}
        <motion.h2
          {...rise(0.3)}
          className="heading-xl max-w-5xl text-[10vw] text-brand-ink sm:text-[8vw] lg:text-[5.6vw]"
        >
          {heading}
        </motion.h2>
      </div>
    </section>
  );
}
