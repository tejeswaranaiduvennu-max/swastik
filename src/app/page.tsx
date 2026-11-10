import { Navbar } from "@/components/public/Navbar";
import { Hero } from "@/components/public/Hero";
import { About } from "@/components/public/About";
import { ProductCatalog } from "@/components/public/ProductCatalog";
import { BulkOrders } from "@/components/public/BulkOrders";
import { WhyChoose } from "@/components/public/WhyChoose";
import { InquiryForm } from "@/components/public/InquiryForm";
import { Contact } from "@/components/public/Contact";
import { Footer } from "@/components/public/Footer";
import { WhatsAppFloat } from "@/components/public/WhatsAppFloat";
import { getSiteData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getSiteData();
  return (
    <>
      <Navbar />
      <main>
        <Hero heading={data.hero.heading} description={data.hero.description} />
        <About />
        <ProductCatalog products={data.products} categories={data.categories} />
        <BulkOrders moq={data.moq} />
        <WhyChoose />
        <InquiryForm moq={data.moq} />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
