import { createFileRoute } from "@tanstack/react-router";
import { Cursor } from "@/components/Cursor";
import { Nav } from "@/components/Nav";
import { FloatingDock } from "@/components/FloatingDock";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Metrics } from "@/components/Metrics";
import { Work } from "@/components/Work";
import { Reviews } from "@/components/Reviews";
import { Packages } from "@/components/Packages";
import { Contact } from "@/components/Contact";
import { BrandFooter } from "@/components/BrandFooter";

const TITLE = "Katalyst Digital — Bespoke IT, Commerce & Brand Engineering";
const DESCRIPTION =
  "Katalyst Digital is a hybrid IT and digital studio engineering bespoke systems, e-commerce growth, and modern brand experiences for ambitious teams.";
const OG_IMAGE = "/og-image.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "keywords", content: "digital agency, IT solutions, e-commerce, web development, brand, marketing, Katalyst Digital" },
      { name: "author", content: "Katalyst Digital" },
      { name: "theme-color", content: "#000000" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:site_name", content: "Katalyst Digital" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Katalyst Digital",
          description: DESCRIPTION,
          url: "/",
          logo: OG_IMAGE,
          sameAs: [
            "https://instagram.com/katalystdigital.co",
            "https://linkedin.com/company/katalystdigital",
          ],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Services />
        <Metrics />
        <Work />
        <Reviews />
        <Packages />
        <Contact />
      </main>
      <BrandFooter />
      <FloatingDock />
    </div>
  );
}
