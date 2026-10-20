import type { Metadata } from "next";
import { PendingPage } from "@/components/sections/PendingPage";

export const metadata: Metadata = { title: "Trabaja con nosotros" };

export default function Page() {
  return (
    <PendingPage
      kicker="Empleo"
      title="Trabaja con nosotros"
      lead="Convocatorias y envío de hojas de vida."
      phase="Fase 4"
      planned={[
        "Descripción de la convocatoria (texto pendiente de la empresa)",
        "Formulario con envío de hoja de vida",
        "Autorización de tratamiento de datos personales (Ley 1581 de 2012)",
      ]}
    />
  );
}
