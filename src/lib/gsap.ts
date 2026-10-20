"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// En móviles, la barra del navegador que aparece y desaparece cambia la altura
// de la ventana: no hay que recalcular todas las escenas por eso.
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, useGSAP };

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
