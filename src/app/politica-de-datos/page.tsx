import { pageMetadata } from "@/content/seo";
import type { Metadata } from "next";
import { PendingPage } from "@/components/sections/PendingPage";

export const metadata: Metadata = pageMetadata("/politica-de-datos");

export default function Page() {
  return (
    <PendingPage
      kicker="Legal"
      title="Política de tratamiento de datos"
      lead="El texto oficial debe proporcionarlo la empresa antes de habilitar cualquier formulario."
      phase="Fase 4"
      planned={["Política de tratamiento de datos personales (Ley 1581 de 2012)"]}
    />
  );
}
