import type { Metadata } from "next";

import { AnnouncementBar } from "@/app/components/marketing/announcement-bar";
import { Navbar } from "@/app/components/marketing/navbar";
import { Footer } from "@/app/components/marketing/footer";
import { CareersHero } from "@/app/components/careers/careers-hero";
import { AboutTeam } from "@/app/components/careers/about-team";
import { WhoWeWant } from "@/app/components/careers/who-we-want";
import { OpenPositions } from "@/app/components/careers/open-positions";
import { HiringProcess } from "@/app/components/careers/hiring-process";
import { CareersFaq } from "@/app/components/careers/careers-faq";
import { CareersCta } from "@/app/components/careers/careers-cta";

export const metadata: Metadata = {
  title: "Careers — Servixa",
  description:
    "Join Servixa and help build the AI-powered construction marketplace. Remote-friendly roles in engineering and DevOps — internships and full-time.",
};

export default function CareersPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        <CareersHero />
        <AboutTeam />
        <WhoWeWant />
        <OpenPositions />
        <HiringProcess />
        <CareersFaq />
        <CareersCta />
      </main>
      <Footer />
    </>
  );
}
