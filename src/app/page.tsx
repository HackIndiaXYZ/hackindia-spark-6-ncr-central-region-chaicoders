import VelorahNavbar from "@/components/landing/VelorahNavbar";
import VelorahHero from "@/components/landing/VelorahHero";
import IntroCards from "@/components/landing/IntroCards";
import ProcessSection from "@/components/landing/ProcessSection";
import CareerPipeline from "@/components/landing/CareerPipeline";
import ProductPreview from "@/components/landing/ProductPreview";
import IntellectMetrics from "@/components/landing/IntellectMetrics";

import IntellectCTA from "@/components/landing/IntellectCTA";
import IntellectFooter from "@/components/landing/IntellectFooter";
import SmoothScroll from "@/components/SmoothScroll";
import PageTransition from "@/components/PageTransition";

export default function Home() {
  return (
    <PageTransition>
      <SmoothScroll>
        <main className="relative min-h-screen bg-background selection:bg-primary/20 selection:text-primary overflow-x-hidden">
          <div className="fixed top-0 left-0 right-0 z-50">
            <VelorahNavbar />
          </div>
          <VelorahHero />
          
          <div className="relative z-10 bg-background">
            <IntroCards />
            <ProcessSection />
            <CareerPipeline />
            <ProductPreview />
            <IntellectMetrics />

            <IntellectCTA />
            <IntellectFooter />
          </div>
        </main>
      </SmoothScroll>
    </PageTransition>
  );
}




