"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { IconCheck } from "@/components/ui/icons";
import { validateInquiry } from "@/lib/validation";
import {
  customerTypes,
  inquiryTypes,
  preferredContactMethods,
  productInterestOptions,
  MIN_ORDER_QUANTITY
} from "@/config/business";

type Status = "idle" | "submitting" | "success" | "error";

const emptyForm = {
  full_name: "",
  business_name: "",
  phone: "",
  whatsapp: "",
  email: "",
  customer_type: "",
  inquiry_type: "",
  quantity: "",
  requirements: "",
  preferred_contact: "WhatsApp",
  company_website: "" // honeypot
};

export function InquiryForm({ moq }: { moq: number }) {
  const [form, setForm] = useState({ ...emptyForm });
  const [products, setProducts] = useState<string[]>([]);
  const [sameWhatsApp, setSameWhatsApp] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string>("");
  const submittedOnce = useRef(false);

  // Prefill from product card "Enquire Now"
  useEffect(() => {
    function onPrefill(e: Event) {
      const name = (e as CustomEvent).detail?.productName as string;
      if (!name) return;
      setProducts((prev) => (prev.includes(name) ? prev : [...prev, name]));
      setForm((f) => ({
        ...f,
        inquiry_type: f.inquiry_type || "Product Inquiry"
      }));
      if (status === "success") resetAfterSuccess();
    }
    window.addEventListener("swastik:prefill-product", onPrefill);
    return () => window.removeEventListener("swastik:prefill-product", onPrefill);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  }

  function toggleProduct(name: string) {
    setProducts((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
    if (errors.products) setErrors((e) => ({ ...e, products: "" }));
  }

  useEffect(() => {
    if (sameWhatsApp) setForm((f) => ({ ...f, whatsapp: f.phone }));
  }, [sameWhatsApp, form.phone]);

  function resetAfterSuccess() {
    setStatus("idle");
    submittedOnce.current = false;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting" || status === "success") return;

    const payload = {
      ...form,
      quantity: form.quantity === "" ? undefined : Number(form.quantity),
      products
    };
    const result = validateInquiry(payload as any);
    if (!result.ok) {
      // Hide honeypot error from the UI
      const { company_website, ...visible } = result.errors;
      setErrors(visible);
      const first = Object.keys(visible)[0];
      if (first) {
        document
          .getElementById(`field-${first}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    if (submittedOnce.current) return;
    submittedOnce.current = true;
    setStatus("submitting");
    setServerError("");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.clean)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        submittedOnce.current = false;
        setStatus("error");
        setServerError(
          data?.error ||
            "We could not submit your inquiry right now. Please try WhatsApp or call us."
        );
        return;
      }
      setStatus("success");
      setForm({ ...emptyForm });
      setProducts([]);
      setSameWhatsApp(false);
    } catch {
      submittedOnce.current = false;
      setStatus("error");
      setServerError(
        "Network error. Please check your connection or reach us on WhatsApp."
      );
    }
  }

  if (status === "success") {
    return (
      <section id="inquiry" className="section bg-brand-beige/40">
        <div className="container-x">
          <Reveal className="mx-auto max-w-xl">
            <div className="card p-10 text-center">
              <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gold/15 text-brand-gold">
                <IconCheck width={34} height={34} />
              </span>
              <h2 className="mt-6 font-display text-2xl font-bold text-brand-brown">
                Inquiry Received — Thank You!
              </h2>
              <p className="mt-3 text-brand-charcoal/70">
                Your inquiry has been submitted to Swastik Polymers. Our team
                will get in touch with you shortly through your preferred
                contact method.
              </p>
              <button
                type="button"
                onClick={resetAfterSuccess}
                className="btn-outline mt-7"
              >
                Submit Another Inquiry
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section id="inquiry" className="section bg-brand-beige/40">
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">Inquiry</span>
          <h2 className="heading mt-3">Tell Us What You&apos;re Looking For.</h2>
          <p className="mt-4 text-brand-charcoal/70">
            Share your requirement and our team will respond with product
            details and bulk supply information.
          </p>
        </div>

        <Reveal className="mx-auto mt-10 max-w-3xl">
          <form
            onSubmit={onSubmit}
            noValidate
            className="card space-y-6 p-6 sm:p-8"
          >
            {/* Honeypot */}
            <input
              type="text"
              name="company_website"
              tabIndex={-1}
              autoComplete="off"
              value={form.company_website}
              onChange={(e) => set("company_website", e.target.value)}
              className="hidden"
              aria-hidden
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <div id="field-full_name">
                <label className="field-label" htmlFor="full_name">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="full_name"
                  className="field-input"
                  value={form.full_name}
                  onChange={(e) => set("full_name", e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  aria-invalid={!!errors.full_name}
                />
                {errors.full_name && (
                  <p className="field-error">{errors.full_name}</p>
                )}
              </div>

              <div id="field-business_name">
                <label className="field-label" htmlFor="business_name">
                  Business / Shop Name
                </label>
                <input
                  id="business_name"
                  className="field-input"
                  value={form.business_name}
                  onChange={(e) => set("business_name", e.target.value)}
                  placeholder="Optional"
                />
              </div>

              <div id="field-phone">
                <label className="field-label" htmlFor="phone">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  className="field-input"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="10-digit mobile number"
                  inputMode="tel"
                  autoComplete="tel"
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && <p className="field-error">{errors.phone}</p>}
              </div>

              <div id="field-whatsapp">
                <label className="field-label" htmlFor="whatsapp">
                  WhatsApp Number
                </label>
                <input
                  id="whatsapp"
                  className="field-input"
                  value={form.whatsapp}
                  onChange={(e) => set("whatsapp", e.target.value)}
                  placeholder="Optional"
                  inputMode="tel"
                  disabled={sameWhatsApp}
                />
                <label className="mt-2 inline-flex items-center gap-2 text-xs text-brand-charcoal/70">
                  <input
                    type="checkbox"
                    checked={sameWhatsApp}
                    onChange={(e) => setSameWhatsApp(e.target.checked)}
                    className="h-4 w-4 rounded border-brand-beige text-brand-brown focus:ring-brand-gold"
                  />
                  Same as mobile number
                </label>
              </div>

              <div id="field-email">
                <label className="field-label" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="field-input"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="Optional"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                />
                {errors.email && <p className="field-error">{errors.email}</p>}
              </div>

              <div id="field-customer_type">
                <label className="field-label" htmlFor="customer_type">
                  Customer Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="customer_type"
                  className="field-input"
                  value={form.customer_type}
                  onChange={(e) => set("customer_type", e.target.value)}
                  aria-invalid={!!errors.customer_type}
                >
                  <option value="">Select customer type</option>
                  {customerTypes.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.customer_type && (
                  <p className="field-error">{errors.customer_type}</p>
                )}
              </div>

              <div id="field-inquiry_type">
                <label className="field-label" htmlFor="inquiry_type">
                  Inquiry Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="inquiry_type"
                  className="field-input"
                  value={form.inquiry_type}
                  onChange={(e) => set("inquiry_type", e.target.value)}
                  aria-invalid={!!errors.inquiry_type}
                >
                  <option value="">Select inquiry type</option>
                  {inquiryTypes.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.inquiry_type && (
                  <p className="field-error">{errors.inquiry_type}</p>
                )}
              </div>

              <div id="field-quantity">
                <label className="field-label" htmlFor="quantity">
                  Required Quantity (pieces){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="quantity"
                  type="number"
                  min={MIN_ORDER_QUANTITY}
                  className="field-input"
                  value={form.quantity}
                  onChange={(e) => set("quantity", e.target.value)}
                  placeholder={`Minimum ${moq}`}
                  inputMode="numeric"
                  aria-invalid={!!errors.quantity}
                />
                {errors.quantity ? (
                  <p className="field-error">{errors.quantity}</p>
                ) : (
                  <p className="mt-1 text-xs text-brand-charcoal/50">
                    Minimum order quantity is {moq} pieces.
                  </p>
                )}
              </div>
            </div>

            {/* Products multi-select */}
            <div id="field-products">
              <label className="field-label">
                Product Interested In <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {productInterestOptions.map((p) => {
                  const checked = products.includes(p);
                  return (
                    <label
                      key={p}
                      className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition ${
                        checked
                          ? "border-brand-brown bg-brand-brown/5 text-brand-brown"
                          : "border-brand-beige bg-white text-brand-charcoal/70 hover:border-brand-brown/30"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleProduct(p)}
                        className="h-4 w-4 rounded border-brand-beige text-brand-brown focus:ring-brand-gold"
                      />
                      <span>{p}</span>
                    </label>
                  );
                })}
              </div>
              {errors.products && (
                <p className="field-error">{errors.products}</p>
              )}
            </div>

            <div id="field-requirements">
              <label className="field-label" htmlFor="requirements">
                Additional Requirements
              </label>
              <textarea
                id="requirements"
                rows={4}
                className="field-input resize-y"
                value={form.requirements}
                onChange={(e) => set("requirements", e.target.value)}
                placeholder="Sizes, specifications, delivery location, or anything else (optional)"
              />
            </div>

            <div id="field-preferred_contact">
              <label className="field-label">Preferred Contact Method</label>
              <div className="flex flex-wrap gap-2">
                {preferredContactMethods.map((m) => (
                  <label
                    key={m}
                    className={`cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                      form.preferred_contact === m
                        ? "border-brand-brown bg-brand-brown text-brand-white"
                        : "border-brand-beige bg-white text-brand-charcoal/70 hover:border-brand-brown/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="preferred_contact"
                      value={m}
                      checked={form.preferred_contact === m}
                      onChange={(e) => set("preferred_contact", e.target.value)}
                      className="sr-only"
                    />
                    {m}
                  </label>
                ))}
              </div>
            </div>

            {status === "error" && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="btn-primary w-full py-3.5 text-base"
            >
              {status === "submitting" ? "Sending…" : "Send Inquiry"}
            </button>
            <p className="text-center text-xs text-brand-charcoal/50">
              By submitting, you agree to be contacted by Swastik Polymers
              regarding your inquiry.
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
