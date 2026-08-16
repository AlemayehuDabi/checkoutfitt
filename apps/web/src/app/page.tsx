import type { Metadata } from "next";
import { Features } from "@/components/marketing/features";
import { FinalCta } from "@/components/marketing/final-cta";
import { Footer } from "@/components/marketing/footer";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { NavBar } from "@/components/marketing/nav-bar";
import { Pricing } from "@/components/marketing/pricing";
import { SocialProof } from "@/components/marketing/social-proof";
import { Testimonials } from "@/components/marketing/testimonials";

const TITLE = "CheckoutFitt — Your closet, reimagined";
const DESCRIPTION =
  "An AI stylist that photographs and understands everything you own, then tells you what to wear each morning — matched to the weather, the occasion, and how you actually dress.";

export const metadata: Metadata = {
  // Overrides the root layout's "%s · CheckoutFitt" template: the landing page
  // is the brand's front door and shouldn't read as a sub-page.
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "AI stylist",
    "digital closet",
    "outfit generator",
    "capsule wardrobe",
    "what to wear",
    "wardrobe app",
  ],
  openGraph: {
    type: "website",
    siteName: "CheckoutFitt",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

/**
 * Public marketing page. A server component — no auth, no data fetching, so
 * it prerenders as static HTML. The interactive sections below are their own
 * client components, keeping the page shell out of the client bundle.
 */
export default function LandingPage() {
  return (
    <>
      <NavBar />
      <main>
        <Hero />
        <SocialProof />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
