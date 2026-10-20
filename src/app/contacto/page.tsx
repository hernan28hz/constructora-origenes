import { pageMetadata } from "@/content/seo";
import type { Metadata } from "next";
import { PendingPage, SpecSheet } from "@/components/sections/PendingPage";
import { site } from "@/content/site";

export const metadata: Metadata = pageMetadata("/contacto");

export default function Page() {
  const { contact } = site;
  return (
    <PendingPage
      kicker="Contacto"
      title="Hablemos de tu próximo terreno"
      lead="Solicita información sobre lotes, consulta proyectos o comunícate con el equipo."
      phase="Fase 4"
      planned={["Formulario de contacto comercial", "Botón directo a WhatsApp", "Mapa de la oficina"]}
    >
      <SpecSheet
        title="Canales"
        rows={[
          ["WhatsApp", contact.whatsapp],
          ["Teléfono", contact.phone],
          ["Correo", contact.email],
          ["Oficina", contact.address],
        ]}
      />
    </PendingPage>
  );
}
