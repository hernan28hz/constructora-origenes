import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // En desarrollo, no mostrar el indicador flotante de Next.js. Los errores
  // de compilación o de ejecución se siguen mostrando.
  devIndicators: false,
  // En desarrollo, no escribir en la terminal cada página que se visita.
  logging: {
    incomingRequests: false,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75],
  },
};

export default nextConfig;
