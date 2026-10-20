// Modelo de contenido. `null` significa dato pendiente de verificación:
// la interfaz lo muestra como "Pendiente" en lugar de inventarlo.

export type Disponibilidad = "disponible" | "reservado" | "vendido";

export interface Lote {
  codigo: string;
  areaM2: number | null;
  disponibilidad: Disponibilidad;
  // Solo se publica si la empresa lo autoriza.
  precio: number | null;
}

export interface Parcelacion {
  slug: string;
  nombre: string | null;
  ubicacion: string | null;
  areaTotalM2: number | null;
  servicios: string[];
  accesos: string | null;
  lotes: Lote[];
  // true cuando las imágenes son renders y no fotografías reales.
  imagenesIlustrativas: boolean;
}

export interface ObraEjecutada {
  slug: string;
  nombre: string;
  ubicacion: string | null;
  tipoObra: string | null;
  descripcion: string | null;
  fechaEjecucion: string | null;
  longitudM: number | null;
  // Fotografías del antes, durante y después recibidas de la empresa.
  materialDisponible: boolean;
}
