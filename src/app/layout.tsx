import type { Metadata, Viewport } from "next";
import { Inter, Saira } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { site } from "@/content/site";
import "./globals.css";

// Tipografías de la marca: Blender Pro Heavy (logotipo) y Microsoft Sans
// Serif (descriptor) no tienen licencia web disponible. Se usan alternativas
// libres: Saira, de geometría cuadrada y pesos altos, para títulos, e Inter,
// una sans neutra, para el texto.
const display = Saira({
  variable: "--font-display",
  subsets: ["latin"],
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} · ${site.descriptor}`,
    template: `%s · ${site.name}`,
  },
  description:
    "Comercialización de lotes y terrenos, y portafolio de obras de infraestructura vial ejecutadas.",
};

// Grafito oficial: color de la barra del navegador en móviles.
export const viewport: Viewport = {
  themeColor: "#2f3740",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable}`}>
      {/* Extensiones del navegador (p. ej. ColorZilla) añaden atributos al
          body antes de que cargue React; se ignora solo esa diferencia. */}
      <body suppressHydrationWarning>
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        <SmoothScroll />
        <SiteHeader />
        <main id="contenido">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
