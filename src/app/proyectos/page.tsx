import type { Metadata } from "next";
import { PendingPage, SpecSheet } from "@/components/sections/PendingPage";
import { obras } from "@/content/obras";

export const metadata: Metadata = { title: "Obras ejecutadas" };

export default function Page() {
  return (
    <PendingPage
      kicker="Portafolio"
      title="Obras ejecutadas"
      lead="Vías pavimentadas y obras de infraestructura realizadas por la empresa."
      phase="Fase 3"
      planned={[
        "Historia visual de cada obra: antes, durante y después",
        "Tomas aéreas y panorámicas",
        "Ficha técnica con datos verificados",
      ]}
    >
      {obras.map((o) => (
        <SpecSheet
          key={o.slug}
          title={o.nombre}
          rows={[
            ["Ubicación", o.ubicacion],
            ["Tipo de obra", o.tipoObra],
            ["Fecha de ejecución", o.fechaEjecucion],
            ["Longitud", o.longitudM && `${o.longitudM.toLocaleString("es-CO")} m`],
            ["Material fotográfico", o.materialDisponible ? "Disponible" : null],
          ]}
        />
      ))}
    </PendingPage>
  );
}
