"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { homeCopy } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { setPinnedScene } from "@/lib/pinnedScene";
import { useVideoQuality } from "@/lib/useMediaPreferences";
import panorama from "@/assets/obra/hero-panorama.jpg";
import vaciado from "@/assets/obra/obra-vaciado.jpg";
import cenital from "@/assets/obra/obra-cenital.jpg";
import viaTerminada from "@/assets/obra/via-terminada.jpg";
import lateralDia from "@/assets/parcelacion/lateral-dia.jpg";
import styles from "./ObrasScene.module.css";

// VID_Hero1 completo (34 s), recodificado para la web. Se reproduce una vez,
// cuando la sección llega a pantalla, y queda en la panorámica final, que
// también es la imagen de respaldo.
const VIDEO_SRC = {
  hd: "/media/hero-obra-1080.mp4",
  sd: "/media/hero-obra-720.mp4",
};

// Fotogramas del mismo video para cada capítulo.
const chapterImages: StaticImageData[] = [vaciado, cenital, panorama];
// Lotes: render ilustrativo. Obras: foto real con dron. Trabaja: fotograma real.
const exploreImages: StaticImageData[] = [lateralDia, viaTerminada, vaciado];

const DESKTOP = "(min-width: 900px) and (prefers-reduced-motion: no-preference)";
const MOBILE = "(max-width: 899.98px) and (prefers-reduced-motion: no-preference)";

export function ObrasScene() {
  const hero = homeCopy.obras;
  const root = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const quality = useVideoQuality();
  const [armed, setArmed] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [chapter, setChapter] = useState(0);

  // El video pesa 11 MB: no se descarga hasta que la sección está cerca.
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

  // Se reproduce desde el principio cuando la escena queda a la vista y se
  // pausa al salir. Si ya terminó, se queda en la panorámica final.
  useEffect(() => {
    const video = videoRef.current;
    const stage = stageRef.current;
    if (!armed || !video || !stage) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !video.ended) video.play().catch(() => {});
        else if (!entry.isIntersecting) video.pause();
      },
      { threshold: 0.6 },
    );
    io.observe(stage);
    return () => io.disconnect();
  }, [armed]);

  const onTimeUpdate = () => {
    const t = videoRef.current?.currentTime ?? 0;
    let current = 0;
    hero.chapters.forEach((c, i) => {
      if (t >= c.at) current = i;
    });
    setChapter(current);
  };

  const goToChapter = (i: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = hero.chapters[i].at;
    video.play().catch(() => {});
    setChapter(i);
  };

  // Sin JS o con movimiento reducido, el hero es una pantalla fija y la
  // frase aparece debajo. Con movimiento, la escena queda fijada mientras se
  // recorre: la cámara se acerca, el titular y los paneles se retiran hacia
  // los bordes, aparece la frase y la toma se funde con el fondo.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: DESKTOP, mobile: MOBILE }, (context) => {
        const desktop = Boolean(context.conditions?.desktop);
        const section = root.current!;
        const q = gsap.utils.selector(section);

        section.dataset.scrolly = desktop ? "full" : "lite";
        ScrollTrigger.refresh();

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
            onToggle: (self) => setPinnedScene("obras", self.isActive),
          },
        });
        setPinnedScene("obras", tl.scrollTrigger!.isActive);

        // Acercamiento de cámara continuo durante toda la escena.
        tl.fromTo(
          q(`.${styles.media}`),
          { scale: 1, yPercent: 0 },
          { scale: desktop ? 1.15 : 1.08, yPercent: desktop ? -2 : -1, duration: 1 },
          0,
        );

        // El titular sube; los paneles salen hacia sus bordes.
        tl.to(q(`.${styles.heading}`), { y: "-10vh", autoAlpha: 0, duration: 0.3 }, 0.02);
        tl.to(q(`.${styles.actions}`), { y: "-6vh", autoAlpha: 0, duration: 0.26 }, 0.02);
        tl.to(q(`.${styles.info}`), { x: "-4vw", autoAlpha: 0, duration: 0.26 }, 0.04);
        tl.to(q(`.${styles.explore}`), { x: "4vw", autoAlpha: 0, duration: 0.26 }, 0.04);
        tl.to(q(`.${styles.chapters}, .${styles.scrollCue}`), { y: "3vh", autoAlpha: 0, duration: 0.2 }, 0.02);

        // La toma se oscurece y entra la frase de la marca.
        tl.to(q(`.${styles.dim}`), { autoAlpha: 1, duration: 0.25 }, 0.22);
        tl.fromTo(
          q(`.${styles.statement}`),
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, duration: 0.22, ease: "power2.out" },
          0.34,
        );
        tl.fromTo(q(`.${styles.rule}`), { scaleX: 0 }, { scaleX: 1, duration: 0.22, ease: "power2.out" }, 0.4);

        // Cierre: la toma se funde casi por completo con el fondo; al soltarse
        // la escena, la frase sube como el resto de la página.
        tl.to(q(`.${styles.veil}`), { autoAlpha: 0.88, duration: 0.3 }, 0.7);
        tl.to(q(".grain"), { autoAlpha: 0, duration: 0.2 }, 0.72);

        return () => {
          delete section.dataset.scrolly;
          setPinnedScene("obras", false);
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="obras" className={styles.hero} aria-labelledby="obras-title">
      <div className={styles.sticky}>
        <div ref={stageRef} className={styles.stage}>
          <div className={styles.media}>
            <Image
              src={panorama}
              alt=""
              fill
              sizes="100vw"
              placeholder="blur"
              loading="eager"
              fetchPriority="high"
              className={styles.poster}
            />
            {quality && armed && (
              <video
                ref={videoRef}
                className={styles.video}
                data-ready={videoReady || undefined}
                src={VIDEO_SRC[quality]}
                muted
                playsInline
                preload="auto"
                aria-hidden="true"
                onPlaying={() => setVideoReady(true)}
                onTimeUpdate={onTimeUpdate}
              />
            )}
          </div>
          <div className={styles.shade} aria-hidden="true" />
          <div className={styles.dim} aria-hidden="true" />
          <div className={styles.veil} aria-hidden="true" />
          <div className="grain" aria-hidden="true" />

          <div className={styles.layout}>
            <div className={styles.heading}>
              <p className={styles.eyebrow}>{hero.eyebrow}</p>
              <h2 id="obras-title" className={styles.title}>
                {hero.titleLines.map((line, i) => (
                  <span key={line} className={styles.line}>
                    <span style={{ "--i": i } as React.CSSProperties}>{line}</span>
                  </span>
                ))}
              </h2>
            </div>

            <div className={styles.actions}>
              <Link href={hero.primaryCta.href} className="btn btn-primary">
                {hero.primaryCta.label}
              </Link>
              <Link href={hero.secondaryCta.href} className="btn btn-ghost glass">
                {hero.secondaryCta.label}
              </Link>
            </div>

            <article className={`${styles.info} glass`}>
              <p className={styles.kicker}>{hero.media.kicker}</p>
              <h2 className={styles.infoTitle}>{hero.media.title}</h2>
              <p className={styles.infoText}>{hero.media.text}</p>
              <Link href={hero.media.link.href} className={styles.infoLink}>
                {hero.media.link.label} <span aria-hidden="true">→</span>
              </Link>
            </article>

            {quality && (
              <div className={styles.chapters} role="group" aria-label="Momentos del video">
                {hero.chapters.map((c, i) => (
                  <button
                    key={c.label}
                    type="button"
                    className={styles.chapter}
                    aria-pressed={chapter === i}
                    onClick={() => goToChapter(i)}
                  >
                    <span className={styles.chapterThumb}>
                      <Image src={chapterImages[i]} alt="" fill sizes="56px" />
                    </span>
                    <span className={styles.chapterLabel}>{c.label}</span>
                  </button>
                ))}
              </div>
            )}

            <nav className={`${styles.explore} glass`} aria-labelledby="explora-hero">
              <h2 id="explora-hero" className={styles.exploreTitle}>
                {hero.explore.title}
              </h2>
              <ul>
                {hero.explore.links.map((l, i) => (
                  <li key={l.href}>
                    <Link href={l.href} className={styles.exploreLink}>
                      <span className={styles.exploreThumb}>
                        <Image src={exploreImages[i]} alt="" fill sizes="160px" placeholder="blur" />
                        <span className={styles.exploreNote}>{l.note}</span>
                      </span>
                      <span className={styles.exploreLabel}>{l.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <span className={styles.scrollCue} aria-hidden="true">
            <span className={styles.cueLine} />
            Desliza
          </span>
        </div>

        <div className={styles.statement}>
          <p className={styles.statementEyebrow}>{hero.statement.eyebrow}</p>
          <span className={styles.rule} aria-hidden="true" />
          <p className={styles.statementText}>{hero.statement.text}</p>
        </div>
      </div>
    </section>
  );
}
