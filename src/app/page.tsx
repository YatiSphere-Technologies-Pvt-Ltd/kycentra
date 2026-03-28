"use client";

import {
  Navbar,
  Hero,
  Features,
  HowItWorks,
  SocialProof,
  CtaSection,
  Footer,
} from "@/components/landing";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <SocialProof />
        <Features />
        <HowItWorks />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
