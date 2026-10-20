import type { Metadata, Viewport } from "next";
import { Inter, Saira } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { JsonLd } from "@/components/brand/JsonLd";
import { seo, siteUrl } from "@/content/seo";
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
  metadataBase: new URL(siteUrl),
  title: {
    default: seo.title,
    template: `%s · ${site.name}`,
  },
  description: seo.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: site.name,
    title: seo.title,
    description: seo.description,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  // La imagen de Open Graph/Twitter viene de opengraph-image.jpg y twitter-image.jpg.
  formatDetection: { telephone: false, email: false, address: false },
};

// Grafito oficial: color de la barra del navegador en móviles.
export const viewport: Viewport = {
  themeColor: "#2f3740",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-CO" className={`${display.variable} ${sans.variable}`}>
      {/* Extensiones del navegador (p. ej. ColorZilla) añaden atributos al
          body antes de que cargue React; se ignora solo esa diferencia. */}
      <body suppressHydrationWarning>
        <JsonLd />
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
