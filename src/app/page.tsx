import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { WhyExsi } from "@/components/home/WhyExsi";
import { WhatWeDo } from "@/components/home/WhatWeDo";
import { CourseCardsSection } from "@/components/home/CourseCardsSection";
import { Gallery } from "@/components/home/Gallery";
import { Testimonials } from "@/components/home/Testimonials";
import { ContactSection } from "@/components/home/ContactSection";
import { Faq } from "@/components/home/Faq";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <WhyExsi />
      <WhatWeDo />
      <CourseCardsSection />
      <Gallery />
      <Testimonials />
      <ContactSection />
      <Faq />
    </>
  );
}
