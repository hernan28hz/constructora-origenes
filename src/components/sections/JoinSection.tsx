"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { homeCopy } from "@/content/site";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useReveal } from "@/lib/useReveal";
import lateralNoche from "@/assets/parcelacion/lateral-noche.jpg";
import styles from "./JoinSection.module.css";

// Sección 5: invitación a colaborar con la venta de los lotes. Es solo la
// presentación: no hay formulario, condiciones ni sistema de afiliación hasta
// que la empresa los defina.
export function JoinSection() {
  const { trabaja } = homeCopy;
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  // La imagen se desplaza un poco más despacio que la página.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          `.${styles.bgMedia}`,
          { yPercent: -6, scale: 1.12 },
          {
            yPercent: 6,
            scale: 1.12,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
        ScrollTrigger.refresh();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="trabaja" className={styles.join} aria-labelledby="trabaja-title">
      <div className={styles.bg}>
        <div className={styles.bgMedia}>
          <Image
            src={lateralNoche}
            alt=""
            fill
            sizes="100vw"
            placeholder="blur"
            className={styles.image}
          />
        </div>
      </div>
      <div className={styles.shade} aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <div className={styles.inner}>
        <div className={`${styles.card} glass`} data-reveal>
          <p className={styles.kicker}>{trabaja.kicker}</p>
          <h2 id="trabaja-title" className={styles.title}>
            {trabaja.title}
          </h2>
          <p className={styles.text}>{trabaja.text}</p>
          <p className={styles.pending}>{trabaja.pending}</p>
          <Link href={trabaja.cta.href} className="btn btn-primary">
            {trabaja.cta.label}
          </Link>
        </div>
      </div>

      <span className={`tag ${styles.tag}`}>{trabaja.tag}</span>
    </section>
  );
}
