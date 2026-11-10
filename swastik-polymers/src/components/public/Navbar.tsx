"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { IconMenu, IconClose } from "@/components/ui/icons";

const links = [
  { href: "#about", label: "About" },
  { href: "#products", label: "Products" },
  { href: "#bulk-orders", label: "Bulk Orders" },
  { href: "#contact", label: "Contact" }
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const dark = scrolled; // solid dark bar once scrolled

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        dark ? "bg-brand-ink/95 shadow-lift backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="container-x flex h-[68px] items-center justify-between">
        <a href="#home" className="flex items-center" aria-label="Swastik Polymers home">
          <Image
            src={dark ? "/logo-light.svg" : "/logo.svg"}
            alt="Swastik Polymers"
            width={168}
            height={38}
            priority
          />
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className={`nav-link ${dark ? "text-white" : "text-brand-ink"}`}>
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#inquiry" className="btn-gold px-5 py-2.5 text-[12px]">
              Get a Quote
            </a>
          </li>
        </ul>

        <button
          type="button"
          className={`inline-flex h-11 w-11 items-center justify-center rounded-full md:hidden ${
            dark ? "text-white" : "text-brand-ink"
          }`}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <IconClose /> : <IconMenu />}
        </button>
      </nav>

      <div className={`md:hidden ${open ? "block" : "hidden"} border-t border-white/10 bg-brand-ink`}>
        <ul className="container-x flex flex-col gap-1 py-4">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-3 text-base font-semibold uppercase tracking-wide text-white hover:bg-white/10"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li className="mt-2 px-1">
            <a href="#inquiry" onClick={() => setOpen(false)} className="btn-gold w-full">
              Get a Quote
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
