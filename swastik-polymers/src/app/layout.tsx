import type { Metadata } from "next";
import { Inter, Archivo } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap"
});

// Variable font with width axis -> lets headings go wide + black (Druk-like).
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-display",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://swastikpolymers.example"),
  title: {
    default:
      "Swastik Polymers | PVC Electrical Pipes, Fittings & Garden Pipes — Manufacturer & Supplier",
    template: "%s | Swastik Polymers"
  },
  description:
    "Swastik Polymers manufactures PVC electrical pipes & fittings and supplies garden pipes in bulk. Serving retailers, distributors and contractors. Minimum order 100 pieces.",
  keywords: [
    "PVC electrical pipes",
    "PVC fittings manufacturer",
    "junction boxes",
    "garden pipes supplier",
    "wholesale PVC",
    "Vizianagaram",
    "electrical wholesaler"
  ],
  openGraph: {
    title: "Swastik Polymers — PVC Electrical Pipes, Fittings & Garden Pipes",
    description:
      "Manufacturer & supplier of PVC electrical products. Bulk orders from 100 pieces.",
    type: "website",
    images: ["/og.svg"]
  },
  icons: { icon: "/favicon.svg" },
  robots: { index: true, follow: true }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${archivo.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
