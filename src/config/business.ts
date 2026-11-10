/**
 * Swastik Polymers — centralized business configuration.
 * Single source of truth for business info, products, MOQ and contact details.
 * The public website reads from here by default. When the Supabase
 * `business_settings` / `products` tables are populated, the admin dashboard
 * can override these at runtime (see src/lib/settings.ts).
 */

export const MIN_ORDER_QUANTITY = 100;

export const business = {
  name: "Swastik Polymers",
  proprietor: "Chintha Achutch",
  phone: "9866596129",
  // E.164 digits for wa.me links (country code 91 + number)
  whatsapp: "919866596129",
  email: "", // optional — not supplied by owner; set in admin Settings
  gstin: "3EDPFA6603F1ZW",
  address: {
    line1: "8-18-303 Industrial Estate",
    line2: "V.T. Agraharam",
    city: "Vizianagaram",
    state: "Andhra Pradesh",
    full: "8-18-303 Industrial Estate, V.T. Agraharam, Vizianagaram, Andhra Pradesh."
  },
  minOrderQuantity: MIN_ORDER_QUANTITY,
  hero: {
    heading: "Reliable PVC Solutions for Every Electrical Need.",
    description:
      "Manufacturers and suppliers of quality PVC electrical pipes, fittings, and garden pipes. Serving retailers, distributors, and contractors with dependable bulk supply."
  },
  description:
    "Swastik Polymers — Manufacturers of PVC Electrical Pipes & Fittings and Suppliers of Garden Pipes."
} as const;

export const mapsLink =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(
    "Swastik Polymers, Industrial Estate, V.T. Agraharam, Vizianagaram, Andhra Pradesh"
  );

export const telLink = `tel:+91${business.phone}`;

export type ProductCategory =
  | "PVC Electrical Products"
  | "Cable Management Products"
  | "Electrical Boxes and Accessories"
  | "Garden Products";

export interface Product {
  slug: string;
  name: string;
  description: string;
  category: ProductCategory;
  image: string;
  sizes?: string;
  featured?: boolean;
}

/** Initial 12-product catalog. Image paths point to /public/products. */
export const products: Product[] = [
  {
    slug: "pvc-junction-boxes",
    name: "PVC Electrical Junction Box",
    description:
      "Durable flame-retardant PVC junction box for safe, concealed electrical wiring connections.",
    category: "Electrical Boxes and Accessories",
    image: "/products/pvc-junction-boxes.jpg",
    sizes: "100 \u00d7 100 \u00d7 50 mm",
    featured: true
  },
  {
    slug: "pvc-junction-box-square",
    name: "PVC Junction Box (Square)",
    description:
      "Square PVC wiring enclosure with knockouts for secure, tidy terminations.",
    category: "Electrical Boxes and Accessories",
    image: "/products/pvc-junction-box-square.jpg",
    sizes: '2"\u00d72" \u00b7 3"\u00d73" \u00b7 4"\u00d74" \u00b7 6"\u00d76"',
    featured: true
  },
  {
    slug: "pvc-junction-box-round",
    name: "PVC Junction Box (Round)",
    description:
      "Round PVC wiring enclosure for safe, reliable cable junctions.",
    category: "Electrical Boxes and Accessories",
    image: "/products/pvc-junction-box-round.jpg",
    sizes: "\u00d865mm \u00b7 \u00d880mm \u00b7 \u00d8100mm",
    featured: true
  },
  {
    slug: "pvc-junction-box-cover",
    name: "PVC Junction Box Cover",
    description:
      "Durable cover plate for a safe, dust-free junction box finish.",
    category: "Electrical Boxes and Accessories",
    image: "/products/pvc-junction-box-cover.jpg",
    sizes: '2"\u00d72" \u00b7 3"\u00d73" \u00b7 4"\u00d74" \u00b7 6"\u00d76"',
    featured: true
  },
  {
    slug: "pvc-two-way-junction-box",
    name: "PVC Two-Way Junction Box",
    description:
      "Two-way conduit junction box for clean directional wiring runs.",
    category: "Electrical Boxes and Accessories",
    image: "/products/pvc-two-way-junction-box.jpg",
    sizes: "20mm \u00b7 25mm \u00b7 32mm",
    featured: true
  },
  {
    slug: "pvc-three-way-junction-box",
    name: "PVC Three-Way Junction Box",
    description:
      "Three-way conduit junction box for branching wiring layouts.",
    category: "Electrical Boxes and Accessories",
    image: "/products/pvc-three-way-junction-box.jpg",
    sizes: "20mm \u00b7 25mm \u00b7 32mm",
    featured: true
  },
  {
    slug: "pvc-four-way-junction-box",
    name: "PVC Four-Way Junction Box",
    description:
      "Versatile four-way conduit junction box for multi-directional wiring.",
    category: "Electrical Boxes and Accessories",
    image: "/products/pvc-four-way-junction-box.jpg",
    sizes: "20mm \u00b7 25mm \u00b7 32mm",
    featured: true
  },
  {
    slug: "pvc-circular-junction-box",
    name: "PVC Circular Junction Box",
    description:
      "Compact circular PVC junction box for reliable electrical joints.",
    category: "Electrical Boxes and Accessories",
    image: "/products/pvc-circular-junction-box.jpg",
    sizes: "\u00d865mm \u00b7 \u00d875mm \u00b7 \u00d885mm \u00b7 \u00d8100mm",
    featured: true
  },
  {
    slug: "pvc-conduit-pipes",
    name: "PVC Conduit Pipes",
    description:
      "Rigid PVC conduit pipes engineered for reliable electrical cable protection.",
    category: "PVC Electrical Products",
    image: "/products/pvc-conduit-pipes.jpg",
    sizes: "16mm \u00b7 20mm \u00b7 25mm \u00b7 32mm"
  },
  {
    slug: "pvc-bends",
    name: "PVC Elbow Bend",
    description:
      "Smooth-radius PVC elbow bend for clean conduit routing around corners.",
    category: "PVC Electrical Products",
    image: "/products/pvc-bends.jpg",
    sizes: "16mm \u00b7 20mm \u00b7 25mm \u00b7 32mm"
  },
  {
    slug: "pvc-tee-connector",
    name: "PVC Tee Connector",
    description:
      "Reliable tee joint for multi-directional conduit wiring.",
    category: "PVC Electrical Products",
    image: "/products/pvc-tee-connector.jpg",
    sizes: "16mm \u00b7 20mm \u00b7 25mm \u00b7 32mm"
  },
  {
    slug: "pvc-coupler",
    name: "PVC Coupler (Socket)",
    description:
      "Secure, leak-free coupler for joining conduit pipes.",
    category: "PVC Electrical Products",
    image: "/products/pvc-coupler.jpg",
    sizes: "16mm \u00b7 20mm \u00b7 25mm \u00b7 32mm"
  },
  {
    slug: "pvc-end-cap",
    name: "PVC End Cap",
    description:
      "Dust- and moisture-proof end cap for neat pipe termination.",
    category: "PVC Electrical Products",
    image: "/products/pvc-end-cap.jpg",
    sizes: "16mm \u00b7 20mm \u00b7 25mm \u00b7 32mm"
  },
  {
    slug: "pvc-inspection-bend",
    name: "PVC Inspection Bend",
    description:
      "Inspection bend with access cover for easy cable maintenance.",
    category: "PVC Electrical Products",
    image: "/products/pvc-inspection-bend.jpg",
    sizes: "16mm \u00b7 20mm \u00b7 25mm \u00b7 32mm"
  },
  {
    slug: "pvc-inspection-tee",
    name: "PVC Inspection Tee",
    description:
      "Inspection tee with access cover for easy cable pulling and service.",
    category: "PVC Electrical Products",
    image: "/products/pvc-inspection-tee.jpg",
    sizes: "16mm \u00b7 20mm \u00b7 25mm \u00b7 32mm"
  },
  {
    slug: "pvc-ceiling-rose",
    name: "PVC Ceiling Rose",
    description:
      "Neat, heat-resistant ceiling rose for safe light-point wiring.",
    category: "PVC Electrical Products",
    image: "/products/pvc-ceiling-rose.jpg",
    sizes: "\u00d875mm \u00b7 \u00d8100mm \u00b7 \u00d8125mm"
  },
  {
    slug: "pvc-conduit-saddle-clamp",
    name: "PVC Conduit Saddle Clamp",
    description:
      "Strong-grip saddle clamp for neat conduit pipe fixing.",
    category: "Cable Management Products",
    image: "/products/pvc-conduit-saddle-clamp.jpg",
    sizes: "16mm \u00b7 20mm \u00b7 25mm \u00b7 32mm"
  },
  {
    slug: "pvc-spacer-bar-saddle",
    name: "PVC Spacer Bar Saddle",
    description:
      "Sturdy spacer bar saddle for spaced conduit support.",
    category: "Cable Management Products",
    image: "/products/pvc-spacer-bar-saddle.jpg",
    sizes: "16mm \u00b7 20mm \u00b7 25mm \u00b7 32mm"
  }
];

export const productCategories: ProductCategory[] = [
  "PVC Electrical Products",
  "Cable Management Products",
  "Electrical Boxes and Accessories"
];

/** Options reused by both the public form and the admin filters. */
export const customerTypes = [
  "Retailer",
  "Wholesaler",
  "Distributor",
  "Electrical Contractor",
  "Dealer",
  "Other"
] as const;

export const inquiryTypes = [
  "Product Inquiry",
  "Bulk Order Inquiry",
  "Distribution Partnership",
  "Wholesale Supply",
  "General Inquiry"
] as const;

export const productInterestOptions = [
  "PVC Electrical Junction Box",
  "Junction Boxes (Square / Round / Circular)",
  "Multi-Way Junction Boxes (2/3/4-Way)",
  "PVC Conduit Pipes",
  "PVC Elbow Bend",
  "PVC Tee Connector",
  "PVC Coupler / End Cap",
  "Inspection Bend / Tee",
  "PVC Ceiling Rose",
  "Saddle Clamp / Spacer Bar",
  "Multiple Products",
  "Other"
] as const;

export const preferredContactMethods = ["WhatsApp", "Phone Call", "Email"] as const;

export const leadStatuses = [
  "New",
  "Contacted",
  "Follow-up Required",
  "Quotation Sent",
  "Converted",
  "Rejected"
] as const;

export type CustomerType = (typeof customerTypes)[number];
export type InquiryType = (typeof inquiryTypes)[number];
export type PreferredContact = (typeof preferredContactMethods)[number];
export type LeadStatus = (typeof leadStatuses)[number];
