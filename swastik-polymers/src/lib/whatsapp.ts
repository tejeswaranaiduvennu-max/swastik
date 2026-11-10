import { business } from "@/config/business";

const GENERIC_MESSAGE =
  "Hello Swastik Polymers, I am interested in your PVC electrical products. Please share your product details and wholesale information.";

export function waLink(message?: string, phone: string = business.whatsapp): string {
  const text = encodeURIComponent(message ?? GENERIC_MESSAGE);
  return `https://wa.me/${phone}?text=${text}`;
}

export function productWaLink(productName: string): string {
  const msg = `Hello Swastik Polymers, I am interested in ${productName}. Please share the details and bulk pricing.`;
  return waLink(msg);
}

/** Message the admin uses to reach a customer, pre-filled with their details. */
export function adminWaLink(opts: {
  customerPhone: string;
  customerName: string;
  products?: string[] | null;
}): string {
  const products =
    opts.products && opts.products.length
      ? ` regarding ${opts.products.join(", ")}`
      : "";
  const msg = `Hello ${opts.customerName}, this is Swastik Polymers following up on your inquiry${products}. How can we help you?`;
  const phone = normalizePhone(opts.customerPhone);
  return waLink(msg, phone);
}

/** Strip non-digits and ensure a 91 country prefix for Indian numbers. */
export function normalizePhone(raw: string): string {
  let digits = (raw || "").replace(/\D/g, "");
  if (digits.length === 10) digits = "91" + digits;
  if (digits.startsWith("0") && digits.length === 11) digits = "91" + digits.slice(1);
  return digits;
}
