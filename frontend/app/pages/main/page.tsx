import type { Metadata } from "next";

import { AnnouncementBar } from "@/app/components/marketing/announcement-bar";
import { Navbar } from "@/app/components/marketing/navbar";
import { Hero } from "@/app/components/marketing/hero";
import { FloatingSearchBar } from "@/app/components/marketing/floating-search-bar";
import { TrustedBy } from "@/app/components/marketing/trusted-by";
import { TrustGallery } from "@/app/components/marketing/trust-gallery";
import { AiAssistantPreview } from "@/app/components/marketing/ai-assistant-preview";
import { HowItWorks } from "@/app/components/marketing/how-it-works";
import { PopularServices } from "@/app/components/marketing/popular-services";
import { WhyChooseUs } from "@/app/components/marketing/why-choose-us";
import { FeaturedProviders } from "@/app/components/marketing/featured-providers";
import { AiMatchingPreview } from "@/app/components/marketing/ai-matching-preview";
import { QuoteComparisonPreview } from "@/app/components/marketing/quote-comparison-preview";
import { DashboardPreview } from "@/app/components/marketing/dashboard-preview";
import { ForBrands } from "@/app/components/marketing/for-brands";
import { Testimonials } from "@/app/components/marketing/testimonials";
import { Stats } from "@/app/components/marketing/stats";
import { Careers } from "@/app/components/marketing/careers";
import { Faq } from "@/app/components/marketing/faq";
import { Newsletter } from "@/app/components/marketing/newsletter";
import { FinalCta } from "@/app/components/marketing/final-cta";
import { Footer } from "@/app/components/marketing/footer";

export const metadata: Metadata = {
  title: "BestBuild — AI-Powered Construction Marketplace",
  description:
    "Post your home project and get matched with verified, AI-vetted service providers near you — free to post, no obligation.",
};

export default function MainPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <TrustGallery />
        <AiAssistantPreview />
        <HowItWorks />
        <PopularServices />
        <WhyChooseUs />
        <FeaturedProviders />
        <AiMatchingPreview />
        <QuoteComparisonPreview />
        <DashboardPreview />
        <ForBrands />
        <Testimonials />
        <Stats />
        <Careers />
        <Faq />
        <Newsletter />
        <FinalCta />
      </main>
      <Footer />
      <FloatingSearchBar />
    </>
  );
}
