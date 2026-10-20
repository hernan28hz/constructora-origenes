import type { Metadata } from "next";
import { site } from "./site";

// Dirección pública del sitio. Los metadatos, el mapa del sitio y los datos
// estructurados se construyen a partir de ella.
export const siteUrl = "https://constructoraorigenes.com";

// Solo se afirma lo confirmado: constructora e inmobiliaria, obras viales y
// venta de lotes. No se menciona ciudad ni dirección hasta que la empresa las
// confirme (ver `site.contact`).
export const seo = {
  title: `${site.name} | Venta de lotes y obras viales`,
  description:
    "Constructora e Inmobiliaria Orígenes: venta de lotes y terrenos y obras de infraestructura vial. Conoce nuestros proyectos y oportunidades inmobiliarias.",
  ogImageAlt: `${site.name}: casa en una ladera construida paso a paso, de terreno vacío a hogar terminado.`,
} as const;

// `indexable: false` mantiene la página fuera de Google (noindex) y fuera del
// mapa del sitio. Cámbialo a `true` cuando la página tenga contenido real:
// las páginas "en construcción" no deben indexarse.
type PageSeo = { title: string; description: string; indexable: boolean };

export const pages = {
  "/": { title: seo.title, description: seo.description, indexable: true },
  "/nosotros": {
    title: "Nosotros",
    description: "Quiénes somos: la empresa, su forma de trabajo y su propuesta de valor.",
    indexable: false,
  },
  "/lotes": {
    title: "Lotes y terrenos",
    description: "Lotes y terrenos en venta: ubicación, áreas, accesos y disponibilidad de cada proyecto.",
    indexable: false,
  },
  "/proyectos": {
    title: "Obras ejecutadas",
    description: "Obras de infraestructura vial ejecutadas: ubicación, tipo de obra y registro de cada proyecto.",
    indexable: false,
  },
  "/trabaja-con-nosotros": {
    title: "Trabaja con nosotros",
    description: "Colabora con la comercialización de los lotes de Orígenes.",
    indexable: false,
  },
  "/contacto": {
    title: "Contacto",
    description: "Solicita información sobre lotes, consulta proyectos o comunícate con el equipo.",
    indexable: false,
  },
  "/politica-de-datos": {
    title: "Política de tratamiento de datos",
    description: "Política de tratamiento de datos personales de Constructora Orígenes.",
    indexable: false,
  },
} satisfies Record<string, PageSeo>;

export type PagePath = keyof typeof pages;

/** Metadatos de una página: título, descripción, canónica y regla de indexación. */
export function pageMetadata(path: PagePath): Metadata {
  const page: PageSeo = pages[path];
  return {
    title: path === "/" ? { absolute: page.title } : page.title,
    description: page.description,
    alternates: { canonical: path },
    robots: page.indexable ? { index: true, follow: true } : { index: false, follow: true },
    // El openGraph de una página reemplaza al del layout: se repiten los datos comunes.
    openGraph: {
      type: "website",
      locale: "es_CO",
      siteName: site.name,
      title: page.title,
      description: page.description,
      url: path,
    },
  };
}
