"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { parcelaciones } from "@/content/parcelaciones";
import { homeCopy } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { setPinnedScene } from "@/lib/pinnedScene";
import { useVideoQuality } from "@/lib/useMediaPreferences";
import poster from "@/assets/parcelacion/frontal-dia.jpg";
import terrazasDia from "@/assets/parcelacion/terrazas-dia.jpg";
import terrazasNoche from "@/assets/parcelacion/terrazas-noche.jpg";
import terrazasCasas from "@/assets/parcelacion/terrazas-casas-noche.jpg";
import styles from "./LotesSection.module.css";

const VIDEO_SRC = "/media/recorrido-frontal-dia.mp4";

const DESKTOP = "(min-width: 900px) and (prefers-reduced-motion: no-preference)";
const MOBILE = "(max-width: 899.98px) and (prefers-reduced-motion: no-preference)";

// Las tres vistas comparten el mismo encuadre de cámara, por eso se pueden
// superponer como capas alineadas sin saltos.
const layerSources: { src: StaticImageData; alt: string }[] = [
  {
    src: terrazasDia,
    alt: "Render de la parcelación de día: lotes en terrazas sobre una ladera con pinos y una vía curva de acceso.",
  },
  { src: terrazasNoche, alt: "El mismo encuadre de noche, con la vía interna y los lotes iluminados." },
  { src: terrazasCasas, alt: "El mismo encuadre de noche con casas construidas sobre cada terraza." },
];

// Sección 3: venta de lotes. Con movimiento queda fijada y los planos se
// superponen con el scroll; en móvil y sin movimiento se apilan.
export function LotesSection() {
  const { lotes, story } = homeCopy;
  const parcelacion = parcelaciones[0];
  const root = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const quality = useVideoQuality();
  const [armed, setArmed] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [layer, setLayer] = useState(0);

  // Solo se publica lo que esté confirmado.
  const specs: [string, string][] = [];
  if (parcelacion.ubicacion) specs.push(["Ubicación", parcelacion.ubicacion]);
  if (parcelacion.areaTotalM2)
    specs.push(["Área total", `${parcelacion.areaTotalM2.toLocaleString("es-CO")} m²`]);
  if (parcelacion.lotes.length > 0) specs.push(["Lotes", String(parcelacion.lotes.length)]);
  if (parcelacion.accesos) specs.push(["Accesos", parcelacion.accesos]);
  if (parcelacion.servicios.length > 0) specs.push(["Servicios", parcelacion.servicios.join(", ")]);

  // El video (1,8 MB) solo se descarga cuando la sección está cerca.
  useEffect(() => {
    const el = root.current;
    if (!quality || !el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArmed(true);
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [quality]);

  useEffect(() => {
    const video = videoRef.current;
    const stage = stageRef.current;
    if (!armed || !video || !stage) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.2 },
    );
    io.observe(stage);
    return () => io.disconnect();
  }, [armed]);

  useGSAP(
    () => {
      const section = root.current!;
      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();

      // Escritorio: escena fijada y planos que se superponen con el scroll.
      mm.add(DESKTOP, () => {
        section.dataset.scrolly = "";
        ScrollTrigger.refresh();

        const layers = gsap.utils.toArray<HTMLElement>(`.${styles.layer}`, section);
        const [, second, third] = layers;

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            onToggle: (self) => setPinnedScene("lotes", self.isActive),
            onUpdate: (self) => setLayer(self.progress < 0.38 ? 0 : self.progress < 0.7 ? 1 : 2),
          },
        });
        setPinnedScene("lotes", tl.scrollTrigger!.isActive);

        tl.fromTo(q(`.${styles.bgMedia}`), { scale: 1 }, { scale: 1.08, duration: 1 }, 0);

        // 1. Entra el marco con el primer plano (el terreno).
        tl.fromTo(
          q(`.${styles.plano}`),
          { autoAlpha: 0, y: 48 },
          { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.14 },
          0.06,
        );

        // 2. El segundo plano cae sobre el primero, de arriba hacia abajo.
        tl.fromTo(
          second,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "power1.inOut", duration: 0.2 },
          0.34,
        );

        // 3. El tercero hace lo mismo.
        tl.fromTo(
          third,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "power1.inOut", duration: 0.2 },
          0.64,
        );

        tl.fromTo(q(`.${styles.progressFill}`), { scaleX: 0 }, { scaleX: 1, duration: 0.9 }, 0.06);

        return () => {
          delete section.dataset.scrolly;
          setPinnedScene("lotes", false);
        };
      });

      // Móvil: planos apilados que entran al verse.
      mm.add(MOBILE, () => {
        const items = gsap.utils.toArray<HTMLElement>(`.${styles.layer}`, section);
        gsap.set(items, { autoAlpha: 0, y: 36 });
        ScrollTrigger.batch(items, {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.12,
              overwrite: true,
            }),
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="lotes" className={styles.lotes} aria-labelledby="lotes-title">
      <div className={styles.sticky}>
        <div ref={stageRef} className={styles.stage}>
          <div className={styles.bg}>
            <div className={styles.bgMedia}>
              <Image
                src={poster}
                alt=""
                fill
                sizes="100vw"
                placeholder="blur"
                className={styles.poster}
              />
              {quality && armed && (
                <video
                  ref={videoRef}
                  className={styles.video}
                  data-ready={videoReady || undefined}
                  src={VIDEO_SRC}
                  muted
                  loop
                  playsInline
                  preload="auto"
                  aria-hidden="true"
                  onPlaying={() => setVideoReady(true)}
                />
              )}
            </div>
          </div>
          <div className={styles.shade} aria-hidden="true" />
          <div className="grain" aria-hidden="true" />

          <div className={styles.layout}>
            <div className={styles.text}>
              <p className={styles.kicker}>{lotes.kicker}</p>
              <h2 id="lotes-title" className={styles.title}>
                {lotes.title}
              </h2>
              <p className={styles.lead}>{lotes.lead}</p>

              {specs.length > 0 ? (
                <dl className={styles.specs}>
                  {specs.map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className={`${styles.pending} glass`}>{lotes.pending}</p>
              )}

              <div className={styles.actions}>
                <Link href={lotes.primaryCta.href} className="btn btn-primary">
                  {lotes.primaryCta.label}
                </Link>
                <Link href={lotes.secondaryCta.href} className="btn btn-ghost glass">
                  {lotes.secondaryCta.label}
                </Link>
              </div>
            </div>

            <div className={`${styles.plano} glass`} role="group" aria-label={lotes.planosLabel}>
              <div className={styles.frame}>
                {layerSources.map((l, i) => (
                  <figure key={story.steps[i].label} className={styles.layer}>
                    <div className={styles.shot}>
                      <Image
                        src={l.src}
                        alt={l.alt}
                        fill
                        sizes="(max-width: 900px) 100vw, 50vw"
                        placeholder="blur"
                        className={styles.image}
                      />
                    </div>
                    <figcaption className={styles.cap}>
                      <span className={styles.capIndex}>{String(i + 1).padStart(2, "0")}</span>
                      <span className={styles.capTitle}>{story.steps[i].label}</span>
                      <span className={styles.capText}>{story.steps[i].text}</span>
                    </figcaption>
                  </figure>
                ))}
                <span className={`tag ${styles.tag}`}>{lotes.tag}</span>
              </div>

              <div className={styles.steps} aria-hidden="true">
                <ol>
                  {story.steps.map((s, i) => (
                    <li key={s.label} data-active={layer === i || undefined} data-past={layer > i || undefined}>
                      {String(i + 1).padStart(2, "0")} <span>{s.label}</span>
                    </li>
                  ))}
                </ol>
                <span className={styles.progress}>
                  <span className={styles.progressFill} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
