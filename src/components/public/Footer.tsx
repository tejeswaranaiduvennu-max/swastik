import Image from "next/image";
import { business, telLink, mapsLink } from "@/config/business";
import { waLink } from "@/lib/whatsapp";
import { productCategories } from "@/config/business";

const nav = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#products", label: "Products" },
  { href: "#bulk-orders", label: "Bulk Orders" },
  { href: "#contact", label: "Contact" }
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-brand-espresso text-white">
      <div className="container-x relative grid gap-10 pt-16 pb-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image src="/logo-light.svg" alt="Swastik Polymers" width={190} height={43} />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">
            {business.description}
          </p>
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-[13px] font-semibold uppercase tracking-wide text-white hover:brightness-95"
          >
            Chat on WhatsApp
          </a>
        </div>

        <div>
          <h4 className="text-[12px] font-bold uppercase tracking-[0.2em] text-brand-accent">Quick Links</h4>
          <ul className="mt-5 space-y-3 text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="text-white/60 transition hover:text-white">{n.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[12px] font-bold uppercase tracking-[0.2em] text-brand-accent">Categories</h4>
          <ul className="mt-5 space-y-3 text-sm">
            {productCategories.map((c) => (
              <li key={c}>
                <a href="#products" className="text-white/60 transition hover:text-white">{c}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[12px] font-bold uppercase tracking-[0.2em] text-brand-accent">Contact</h4>
          <ul className="mt-5 space-y-3 text-sm text-white/60">
            <li><a href={telLink} className="hover:text-white">{business.phone}</a></li>
            <li>
              {business.address.line1}, {business.address.line2}, {business.address.city}, {business.address.state}.
            </li>
            <li>
              <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="hover:text-white">View on Google Maps &rarr;</a>
            </li>
            <li className="pt-1"><span className="text-white/40">GSTIN:</span> {business.gstin}</li>
          </ul>
        </div>
      </div>

      {/* giant ghost wordmark */}
      <div className="container-x">
        <p aria-hidden className="heading-xl select-none whitespace-nowrap text-[18vw] leading-[0.8] text-white/[0.05] sm:text-[15vw]">
          Swastik
        </p>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/45 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {business.name}. All rights reserved.</p>
          <p>Proprietor: {business.proprietor}</p>
        </div>
      </div>
    </footer>
  );
}
