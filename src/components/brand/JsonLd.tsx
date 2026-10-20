import { seo, siteUrl } from "@/content/seo";
import { site } from "@/content/site";

// Datos estructurados (schema.org) para que Google entienda quién es la
// empresa. Solo incluye datos confirmados: cuando la empresa confirme su
// dirección, teléfono y redes, se agregan aquí (`address`, `telephone`,
// `sameAs`) para reforzar el posicionamiento local.
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: site.name,
        alternateName: "Orígenes",
        description: seo.description,
        url: siteUrl,
        logo: { "@type": "ImageObject", url: `${siteUrl}/icon.png`, width: 512, height: 512 },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: site.name,
        inLanguage: "es",
        publisher: { "@id": `${siteUrl}/#organization` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // `<` se escapa para que ningún texto pueda cerrar la etiqueta.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
