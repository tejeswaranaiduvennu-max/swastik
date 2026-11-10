import type { Metadata } from "next";
import { Sidebar } from "@/components/admin/Sidebar";
import { requireAdmin } from "@/lib/admin/auth";
import "../../globals.css";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false }
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { email } = await requireAdmin();
  return (
    <div className="min-h-screen bg-brand-beige/40 lg:flex">
      <Sidebar email={email} />
      <main className="flex-1 overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {children}
      </main>
    </div>
  );
}
