"use client";

import { type RefObject } from "react";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

// Entrada suave de los elementos marcados con `data-reveal` dentro de una
// sección, a medida que aparecen en pantalla. Con movimiento reducido no hace
// nada y todo se ve desde el principio.
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", scope.current);
        gsap.set(items, { autoAlpha: 0, y: 36 });
        ScrollTrigger.batch(items, {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              stagger: 0.09,
              overwrite: true,
            }),
        });
      });
      return () => mm.revert();
    },
    { scope },
  );
}
