import { pageMetadata } from "@/content/seo";
import type { Metadata } from "next";
import { PendingPage, SpecSheet } from "@/components/sections/PendingPage";
import { parcelaciones } from "@/content/parcelaciones";

export const metadata: Metadata = pageMetadata("/lotes");

export default function Page() {
  return (
    <PendingPage
      kicker="Venta"
      title="Lotes y terrenos"
      lead="Proyectos disponibles con su ubicación, áreas, accesos y disponibilidad."
      phase="Fase 2"
      planned={[
        "Galería y video de cada proyecto",
        "Plano de loteo interactivo con el estado de cada lote",
        "Mapa de ubicación y accesos",
        "Formulario de solicitud de información comercial",
      ]}
    >
      {parcelaciones.map((p) => (
        <SpecSheet
          key={p.slug}
          title={p.nombre ?? "Parcelación en ladera (nombre pendiente)"}
          rows={[
            ["Ubicación", p.ubicacion],
            ["Área total", p.areaTotalM2 && `${p.areaTotalM2.toLocaleString("es-CO")} m²`],
            ["Lotes", p.lotes.length > 0 ? p.lotes.length : null],
            ["Accesos", p.accesos],
            ["Servicios", p.servicios.length > 0 ? p.servicios.join(", ") : null],
            ["Imágenes", p.imagenesIlustrativas ? "Renders ilustrativos" : "Fotografías"],
          ]}
        />
      ))}
    </PendingPage>
  );
}
