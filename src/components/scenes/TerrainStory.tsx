"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef, useState } from "react";
import { homeCopy } from "@/content/site";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import dia from "@/assets/parcelacion/terrazas-dia.jpg";
import noche from "@/assets/parcelacion/terrazas-noche.jpg";
import casas from "@/assets/parcelacion/terrazas-casas-noche.jpg";
import styles from "./TerrainStory.module.css";

// Las tres tomas comparten el mismo encuadre de cámara, por eso pueden
// superponerse sin saltos.
const frames: { src: StaticImageData; alt: string }[] = [
  { src: dia, alt: "Render de la parcelación de día: lotes en terrazas sobre una ladera con pinos y una vía curva de acceso." },
  { src: noche, alt: "El mismo encuadre de noche, con la vía interna y los lotes iluminados." },
  { src: casas, alt: "El mismo encuadre de noche con casas construidas sobre cada terraza." },
];

export function TerrainStory() {
  const { story } = homeCopy;
  const root = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);

  // Sin JS o con movimiento reducido, la sección se ve como tres paneles
  // apilados. Con movimiento, se activa la versión superpuesta y fija.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const section = root.current!;
        section.dataset.scrolly = "";
        ScrollTrigger.refresh();

        const panels = gsap.utils.toArray<HTMLElement>(`.${styles.panel}`, section);
        const [, night, homes] = panels;
        const q = gsap.utils.selector(section);

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            onUpdate: (self) => setStep(self.progress < 0.38 ? 0 : self.progress < 0.72 ? 1 : 2),
          },
        });

        // Lento alejamiento de cámara durante toda la escena.
        tl.fromTo(q(`.${styles.image}`), { scale: 1.12 }, { scale: 1, duration: 1 }, 0);
        tl.fromTo(q(`.${styles.progressFill}`), { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);

        // Cae la noche: barrido de arriba hacia abajo.
        tl.fromTo(
          night,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.3, ease: "power1.inOut" },
          0.12,
        );

        // Aparecen las casas sobre el mismo encuadre.
        tl.fromTo(homes, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.22, ease: "power1.inOut" }, 0.56);

        // Cada texto entra cuando su toma queda a la vista.
        panels.forEach((panel, i) => {
          const caption = panel.querySelector(`.${styles.caption}`);
          if (!caption || i === 0) return;
          const at = i === 1 ? 0.36 : 0.74;
          tl.fromTo(caption, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.08, ease: "power2.out" }, at);
        });

        return () => {
          delete section.dataset.scrolly;
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.story} aria-labelledby="story-title">
      <div className={styles.stage}>
        <h2 id="story-title" className={styles.eyebrow}>
          {story.eyebrow}
        </h2>

        <div className={styles.frames}>
          {frames.map((frame, i) => {
            const s = story.steps[i];
            return (
              <figure key={s.label} className={styles.panel}>
                <Image
                  src={frame.src}
                  alt={frame.alt}
                  fill
                  sizes="100vw"
                  placeholder="blur"
                  className={styles.image}
                />
                <div className={styles.shade} aria-hidden="true" />
                <figcaption className={styles.caption}>
                  <span className={styles.stepLabel}>
                    {String(i + 1).padStart(2, "0")} — {s.label}
                  </span>
                  <span className={styles.stepTitle}>{s.title}</span>
                  <span className={styles.stepText}>{s.text}</span>
                </figcaption>
              </figure>
            );
          })}
        </div>
        <div className="grain" aria-hidden="true" />

        <div className={styles.hud} aria-hidden="true">
          <ol className={styles.steps}>
            {story.steps.map((s, i) => (
              <li key={s.label} data-active={step === i || undefined}>
                {String(i + 1).padStart(2, "0")} <span className={styles.stepName}>{s.label}</span>
              </li>
            ))}
          </ol>
          <span className={styles.progress}>
            <span className={styles.progressFill} />
          </span>
        </div>

        <span className={`tag ${styles.tag}`}>Imagen ilustrativa · render del proyecto</span>
      </div>
    </section>
  );
}
