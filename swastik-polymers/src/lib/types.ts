import type { LeadStatus } from "@/config/business";

export interface Lead {
  id: string;
  full_name: string;
  business_name: string | null;
  phone: string;
  whatsapp: string | null;
  email: string | null;
  customer_type: string;
  inquiry_type: string;
  products: string[];
  quantity: number;
  requirements: string | null;
  preferred_contact: string;
  status: LeadStatus;
  internal_notes: string | null;
  follow_up_date: string | null;
  last_contacted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  image_url: string | null;
  sizes: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BusinessSettings {
  id: string;
  business_name: string;
  proprietor_name: string;
  phone: string;
  whatsapp: string;
  email: string | null;
  address: string;
  gstin: string;
  minimum_order_quantity: number;
  hero_heading: string;
  business_description: string;
  logo_url: string | null;
  updated_at: string;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  activity_type: string;
  description: string;
  created_at: string;
  created_by: string | null;
}
