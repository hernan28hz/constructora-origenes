import type { Metadata } from "next";
import { PendingPage } from "@/components/sections/PendingPage";

export const metadata: Metadata = { title: "Nosotros" };

export default function Page() {
  return (
    <PendingPage
      kicker="Quiénes somos"
      title="Nosotros"
      lead="La historia, la experiencia y la forma de trabajo de la empresa."
      phase="Fase 4"
      planned={[
        "Presentación de la empresa (texto pendiente de la empresa)",
        "Experiencia y capacidades técnicas verificables",
        "Equipo y metodología de trabajo",
      ]}
    />
  );
}
