import Image from "next/image";
import { site } from "@/content/site";
import logoBlanco from "@/assets/brand/logo-blanco.png";
import logoColor from "@/assets/brand/logo-color.png";

// Logotipo oficial (versión única de la Guía de marca). Se usa el archivo
// tal cual, sin recomponerlo: blanco y dorado sobre fondos oscuros, grafito
// y dorado sobre fondos claros.
const variants = {
  dark: logoBlanco,
  light: logoColor,
};

type Props = {
  /** Fondo sobre el que se muestra el logo. */
  on: keyof typeof variants;
  className?: string;
  /** Vacío cuando el elemento que lo contiene ya tiene nombre accesible. */
  alt?: string;
  eager?: boolean;
};

export function Logo({ on, className, alt = `${site.name} · ${site.descriptor}`, eager }: Props) {
  return (
    <Image
      src={variants[on]}
      alt={alt}
      className={className}
      // PNG de colores planos: se sirve el original para no añadir artefactos.
      unoptimized
      loading={eager ? "eager" : undefined}
    />
  );
}
