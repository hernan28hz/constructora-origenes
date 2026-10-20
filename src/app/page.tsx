import { HeroSequence } from "@/components/scenes/HeroSequence";
import { ObrasScene } from "@/components/scenes/ObrasScene";
import { CompanySection } from "@/components/sections/CompanySection";
import { JoinSection } from "@/components/sections/JoinSection";
import { LotesSection } from "@/components/sections/LotesSection";

// Orden de la portada: hero, la empresa, venta de lotes, obras ejecutadas,
// trabaja con nosotros. El pie de página viene del layout.
export default function Home() {
  return (
    <>
      <HeroSequence />
      <CompanySection />
      <LotesSection />
      <ObrasScene />
      <JoinSection />
    </>
  );
}
