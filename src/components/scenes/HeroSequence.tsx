"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { heroSequence, homeCopy } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { ImageSequence } from "@/lib/imageSequence";
import { setPinnedScene } from "@/lib/pinnedScene";
import { useVideoQuality } from "@/lib/useMediaPreferences";
import styles from "./HeroSequence.module.css";

// Foto de la casa terminada: es lo primero que se ve y la imagen de respaldo
// cuando no se reproduce la secuencia.
const HOUSE_SRC = "/media/hero/fotoHero1.jpg";
const HOUSE_BLUR =
  "data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAAAQAgCdASoQAAkAA4BaJZACdAEPDqZYK3gAAPulyRjg7j/Zyho7K+MrA2rrOa/RKyn5JsHKF4y/AAAA";

const DESKTOP = "(min-width: 900px) and (prefers-reduced-motion: no-preference)";
const MOBILE = "(max-width: 899.98px) and (prefers-reduced-motion: no-preference)";

const frameName = (n: number) => `frame_${String(n).padStart(4, "0")}.webp`;
const frameUrls = (set: { dir: string; count: number }) =>
  Array.from({ length: set.count }, (_, i) => `${set.dir}/${frameName(i + 1)}`);

// Tres momentos de la secuencia para la versión sin movimiento.
const stillSteps = [1, 42, 83];

export function HeroSequence() {
  const { hero } = homeCopy;
  const root = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const quality = useVideoQuality();
  const [step, setStep] = useState(0);

  const mode = quality === undefined ? "pending" : quality === null ? "static" : "motion";

  // Con movimiento, la escena queda fijada mientras se recorre:
  //  1. el titular sube y se hace compacto; aparecen el texto y los botones;
  //  2. la casa se disuelve en el terreno vacío (primer fotograma);
  //  3. la secuencia avanza con el scroll hasta la casa terminada;
  //  4. la escena se funde con el color de la sección siguiente.
  // Sin movimiento (o con ahorro de datos) solo se ve la foto de la casa.
  useGSAP(
    () => {
      if (!quality) return;

      const section = root.current!;
      const stage = stageRef.current!;
      const canvas = canvasRef.current!;
      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();

      mm.add({ desktop: DESKTOP, mobile: MOBILE }, (context) => {
        const desktop = Boolean(context.conditions?.desktop);
        section.dataset.scrolly = desktop ? "full" : "lite";
        // El hero acaba de cambiar de altura: las secciones de debajo (lotes,
        // obras…) deben recalcular dónde empiezan y terminan sus escenas.
        ScrollTrigger.refresh();

        const set = quality === "hd" ? heroSequence.desktop : heroSequence.mobile;
        const last = set.count - 1;
        const wanted = Math.ceil(window.innerWidth * Math.min(window.devicePixelRatio || 1, 1.5));
        const sequence = new ImageSequence(canvas, {
          urls: frameUrls(set),
          maxBitmapWidth: wanted < set.width ? wanted : undefined,
          focusX: 0.45,
          // En pantallas verticales se ve más de la imagen horizontal.
          zoom: desktop ? 1 : 0.5,
          concurrency: quality === "hd" ? 4 : 3,
        });
        // Se espera a que la página esté en reposo para no competir con la
        // carga de la foto y las fuentes.
        const loadTimer = window.setTimeout(() => void sequence.load(), 400);

        const proxy = { pos: 0 };
        let currentStep = -1;
        const sync = () => {
          sequence.draw(proxy.pos);
          const progress = proxy.pos / last;
          let next = 0;
          hero.steps.forEach((s, i) => {
            if (progress >= s.at) next = i;
          });
          if (next !== currentStep) {
            currentStep = next;
            setStep(next);
          }
        };

        gsap.set(stage, { "--p": 0 });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            onToggle: (self) => setPinnedScene("hero", self.isActive),
          },
        });
        setPinnedScene("hero", tl.scrollTrigger!.isActive);

        // Cámara: acercamiento lento durante toda la escena.
        tl.fromTo(
          q(`.${styles.media}`),
          { scale: 1 },
          { scale: desktop ? 1.06 : 1.04, transformOrigin: "50% 55%", duration: 1 },
          0,
        );

        // 1. El titular sube y se compacta (lo anima `--p`, ver el CSS).
        tl.to(stage, { "--p": 1, ease: "power2.inOut", duration: 0.1 }, 0);
        tl.to(q(`.${styles.cue}, .${styles.eyebrow}`), { autoAlpha: 0, duration: 0.04 }, 0);
        tl.fromTo(q(`.${styles.intro}`), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 0.07);
        tl.fromTo(q(`.${styles.topShade}`), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06 }, 0.06);
        tl.fromTo(
          q(`.${styles.intro} > *`),
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.06, stagger: 0.025 },
          0.07,
        );

        // 2. De la casa terminada al terreno vacío.
        tl.fromTo(canvas, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.07 }, 0.12);
        tl.to(q(`.${styles.heading}, .${styles.intro}, .${styles.topShade}`), { autoAlpha: 0, duration: 0.06 }, 0.24);

        // 3. La secuencia avanza con el scroll.
        tl.fromTo(proxy, { pos: 0 }, { pos: last, duration: 0.7, onUpdate: sync }, 0.18);
        tl.fromTo(
          q(`.${styles.caption}, .${styles.rail}`),
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.05 },
          0.2,
        );

        // 4. Cierre: la casa queda a la vista y se funde hacia la siguiente sección.
        tl.to(q(`.${styles.bridge}`), { autoAlpha: 1, duration: 0.08 }, 0.92);
        tl.fromTo(
          q(`.${styles.endCue}`),
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.05 },
          0.94,
        );

        return () => {
          window.clearTimeout(loadTimer);
          sequence.destroy();
          delete section.dataset.scrolly;
          setPinnedScene("hero", false);
        };
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [quality], revertOnUpdate: true },
  );

  return (
    <section
      ref={root}
      id="inicio"
      className={styles.hero}
      data-mode={mode}
      aria-labelledby="hero-title"
    >
      <div className={styles.sticky}>
        <div ref={stageRef} className={styles.stage}>
          <div className={styles.media}>
            <Image
              src={HOUSE_SRC}
              alt="Casa de madera, piedra y vidrio en una ladera, con una piscina y las montañas al fondo. Imagen ilustrativa."
              width={1376}
              height={768}
              sizes="100vw"
              placeholder="blur"
              blurDataURL={HOUSE_BLUR}
              loading="eager"
              fetchPriority="high"
              className={styles.poster}
            />
            <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
          </div>
          <div className={styles.shade} aria-hidden="true" />
          <div className={styles.topShade} aria-hidden="true" />
          <div className="grain" aria-hidden="true" />

          <div className={styles.layout}>
            <div className={styles.heading}>
              <p className={styles.eyebrow}>{hero.eyebrow}</p>
              <h1 id="hero-title" className={styles.title}>
                {hero.titleLines.map((line, i) => (
                  <span key={line} className={styles.line}>
                    <span style={{ "--i": i } as React.CSSProperties}>{line}</span>
                  </span>
                ))}
              </h1>
            </div>

            <div className={styles.intro}>
              <p className={styles.lead}>{hero.lead}</p>
              <div className={styles.actions}>
                <a href={hero.primaryCta.href} className="btn btn-primary">
                  {hero.primaryCta.label}
                </a>
                <a href={hero.secondaryCta.href} className="btn btn-ghost glass">
                  {hero.secondaryCta.label}
                </a>
              </div>
            </div>
          </div>

          <div className={styles.caption} aria-hidden="true">
            <p className={styles.captionCount}>
              {String(step + 1).padStart(2, "0")} / {String(hero.steps.length).padStart(2, "0")}
            </p>
            <div key={step} className={styles.captionBody}>
              <p className={styles.captionLabel}>{hero.steps[step].label}</p>
              <p className={styles.captionText}>{hero.steps[step].text}</p>
            </div>
          </div>

          <ol className={styles.rail} aria-hidden="true">
            {hero.steps.map((s, i) => (
              <li key={s.label} data-active={step === i || undefined} data-past={step > i || undefined}>
                <span className={styles.railLabel}>{s.label}</span>
                <span className={styles.railDot} />
              </li>
            ))}
          </ol>

          <div className={styles.bridge} aria-hidden="true" />

          <span className={styles.cue} aria-hidden="true">
            <span className={styles.cueLine} />
            {hero.scrollCue}
          </span>
          <span className={styles.endCue} aria-hidden="true">
            {hero.endCue}
            <span className={styles.cueLine} />
          </span>
          <span className={`tag ${styles.tag}`}>{hero.tag}</span>
        </div>
      </div>

      {mode === "static" && (
        <ol className={styles.stills} aria-label="Del terreno al hogar, imágenes ilustrativas">
          {stillSteps.map((n, i) => (
            <li key={n}>
              <Image
                src={`${heroSequence.desktop.dir}/${frameName(n)}`}
                alt={`${hero.steps[[0, 2, 5][i]].label}: ${hero.steps[[0, 2, 5][i]].text}`}
                width={1280}
                height={720}
                sizes="(max-width: 900px) 100vw, 33vw"
                unoptimized
                loading="lazy"
              />
              <span>{hero.steps[[0, 2, 5][i]].label}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
