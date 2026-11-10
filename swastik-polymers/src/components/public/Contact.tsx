import { Reveal } from "@/components/ui/Reveal";
import { IconPhone, IconPin, IconWhatsApp } from "@/components/ui/icons";
import { business, telLink, mapsLink } from "@/config/business";
import { waLink } from "@/lib/whatsapp";

export function Contact() {
  const addr = business.address;
  return (
    <section id="contact" className="bg-white py-24 sm:py-28">
      <div className="container-x">
        <div className="max-w-3xl">
          <span className="eyebrow">Get In Touch</span>
          <h2 className="heading mt-3">
            Let&rsquo;s talk <span className="text-brand-accent">supply</span>
          </h2>
          <p className="subheading">
            Reach out for product details, bulk pricing and distribution inquiries.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <div className="flex h-full flex-col rounded-2xl bg-brand-ink p-8 text-white sm:p-10">
              <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight">
                {business.name}
              </h3>
              <p className="mt-1 text-sm text-white/55">Proprietor: {business.proprietor}</p>

              <ul className="mt-8 space-y-6">
                <li className="flex gap-4">
                  <span className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brand-accent text-white">
                    <IconPhone width={18} height={18} />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">Phone</p>
                    <a href={telLink} className="text-lg font-semibold hover:text-brand-accent">{business.phone}</a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brand-accent text-white">
                    <IconPin width={18} height={18} />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">Address</p>
                    <p className="text-[15px] leading-relaxed text-white/85">
                      {addr.line1},<br />{addr.line2},<br />{addr.city}, {addr.state}.
                    </p>
                    <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-sm font-semibold text-brand-accent hover:underline">
                      View on Google Maps &rarr;
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brand-accent text-white">
                    <IconPin width={18} height={18} />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">GSTIN</p>
                    <p className="text-lg font-semibold">{business.gstin}</p>
                  </div>
                </li>
              </ul>

              <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row">
                <a href={telLink} className="btn-gold flex-1">
                  <IconPhone width={17} height={17} /> Call Now
                </a>
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn flex-1 bg-[#25D366] text-white hover:brightness-95">
                  <IconWhatsApp width={17} height={17} /> WhatsApp
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="h-full overflow-hidden rounded-2xl ring-1 ring-brand-border">
              <iframe
                title="Swastik Polymers location"
                src="https://maps.google.com/maps?q=Industrial%20Estate%2C%20V.T.%20Agraharam%2C%20Vizianagaram%2C%20Andhra%20Pradesh&t=&z=14&ie=UTF8&iwloc=&output=embed"
                className="h-full min-h-[420px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
