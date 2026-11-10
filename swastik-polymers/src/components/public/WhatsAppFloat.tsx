"use client";

import { IconWhatsApp } from "@/components/ui/icons";
import { waLink } from "@/lib/whatsapp";

export function WhatsAppFloat() {
  return (
    <a
      href={waLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Swastik Polymers on WhatsApp"
      className="group fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-4 text-white shadow-lift transition hover:brightness-95 sm:bottom-7 sm:right-7"
    >
      <IconWhatsApp width={26} height={26} />
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 group-hover:max-w-[140px] group-hover:opacity-100 sm:inline">
        Chat with us
      </span>
    </a>
  );
}
