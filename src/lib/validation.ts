import {
  MIN_ORDER_QUANTITY,
  customerTypes,
  inquiryTypes,
  preferredContactMethods,
  productInterestOptions
} from "@/config/business";

export interface InquiryInput {
  full_name: string;
  business_name?: string | null;
  phone: string;
  whatsapp?: string | null;
  email?: string | null;
  customer_type: string;
  inquiry_type: string;
  products: string[];
  quantity: number;
  requirements?: string | null;
  preferred_contact: string;
  // honeypot — must be empty
  company_website?: string;
}

export interface ValidationResult {
  ok: boolean;
  errors: Record<string, string>;
  clean?: InquiryInput;
}

const phoneRe = /^[0-9+\-\s()]{7,20}$/;
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Server-authoritative validation. Also used client-side for instant feedback. */
export function validateInquiry(raw: Partial<InquiryInput>): ValidationResult {
  const errors: Record<string, string> = {};
  const full_name = (raw.full_name || "").trim();
  const phone = (raw.phone || "").trim();
  const customer_type = (raw.customer_type || "").trim();
  const inquiry_type = (raw.inquiry_type || "").trim();
  const preferred_contact = (raw.preferred_contact || "").trim();
  const products = Array.isArray(raw.products) ? raw.products.filter(Boolean) : [];
  const quantity = Number(raw.quantity);

  if (!full_name) errors.full_name = "Full name is required.";
  if (!phone) errors.phone = "Mobile number is required.";
  else if (!phoneRe.test(phone)) errors.phone = "Enter a valid mobile number.";

  if (raw.email && raw.email.trim() && !emailRe.test(raw.email.trim()))
    errors.email = "Enter a valid email address.";

  if (!customer_type) errors.customer_type = "Please select a customer type.";
  else if (!customerTypes.includes(customer_type as any))
    errors.customer_type = "Invalid customer type.";

  if (!inquiry_type) errors.inquiry_type = "Please select an inquiry type.";
  else if (!inquiryTypes.includes(inquiry_type as any))
    errors.inquiry_type = "Invalid inquiry type.";

  if (!preferred_contact)
    errors.preferred_contact = "Please choose a preferred contact method.";
  else if (!preferredContactMethods.includes(preferred_contact as any))
    errors.preferred_contact = "Invalid contact method.";

  if (products.length === 0)
    errors.products = "Select at least one product you are interested in.";
  else if (!products.every((p) => productInterestOptions.includes(p as any)))
    errors.products = "One or more selected products are invalid.";

  if (!raw.quantity && raw.quantity !== 0)
    errors.quantity = "Required quantity is mandatory.";
  else if (Number.isNaN(quantity) || !Number.isFinite(quantity))
    errors.quantity = "Enter a valid quantity.";
  else if (quantity < MIN_ORDER_QUANTITY)
    errors.quantity = `Minimum order quantity is ${MIN_ORDER_QUANTITY} pieces.`;

  // Honeypot: if filled, silently reject as spam
  if (raw.company_website && raw.company_website.trim().length > 0)
    errors.company_website = "spam";

  const ok = Object.keys(errors).length === 0;
  if (!ok) return { ok, errors };

  return {
    ok,
    errors,
    clean: {
      full_name,
      business_name: raw.business_name?.trim() || null,
      phone,
      whatsapp: raw.whatsapp?.trim() || null,
      email: raw.email?.trim() || null,
      customer_type,
      inquiry_type,
      products,
      quantity,
      requirements: raw.requirements?.trim() || null,
      preferred_contact
    }
  };
}
