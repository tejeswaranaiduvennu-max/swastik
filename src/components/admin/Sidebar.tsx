"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  IconDashboard,
  IconUsers,
  IconPackage,
  IconCalendar,
  IconDownload,
  IconSettings,
  IconLogout,
  IconMenu,
  IconClose
} from "@/components/ui/icons";
import { signOut } from "@/lib/admin/signout";

const items = [
  { href: "/admin", label: "Overview", icon: IconDashboard, exact: true },
  { href: "/admin/leads", label: "Leads", icon: IconUsers },
  { href: "/admin/products", label: "Products", icon: IconPackage },
  { href: "/admin/follow-ups", label: "Follow-ups", icon: IconCalendar },
  { href: "/admin/exports", label: "Exports", icon: IconDownload },
  { href: "/admin/settings", label: "Website Settings", icon: IconSettings }
];

export function Sidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-brand-white/10 bg-brand-chocolate px-4 py-3 lg:hidden">
        <Image src="/logo-light.svg" alt="Swastik Polymers" width={160} height={36} />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-brand-beige"
          aria-label="Toggle menu"
        >
          {open ? <IconClose /> : <IconMenu />}
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-brand-chocolate text-brand-beige transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="hidden items-center gap-2 border-b border-brand-white/10 px-6 py-5 lg:flex">
          <Image src="/logo-light.svg" alt="Swastik Polymers" width={180} height={40} />
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {items.map((it) => {
            const Icon = it.icon;
            const active = isActive(it.href, it.exact);
            return (
              <Link
                key={it.href}
                href={it.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-brand-gold text-brand-chocolate"
                    : "text-brand-beige/75 hover:bg-brand-white/10 hover:text-brand-white"
                }`}
              >
                <Icon width={18} height={18} />
                {it.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-brand-white/10 px-4 py-4">
          <p className="truncate px-1 text-xs text-brand-beige/50">{email}</p>
          <form action={signOut}>
            <button
              type="submit"
              className="mt-2 flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-brand-beige/75 transition hover:bg-brand-white/10 hover:text-brand-white"
            >
              <IconLogout width={18} height={18} /> Logout
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
