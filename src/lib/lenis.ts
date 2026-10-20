import type Lenis from "lenis";

// Instancia única de Lenis, para que otros componentes (p. ej. el menú
// móvil) puedan detener y reanudar el desplazamiento suave.
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}
