"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { homeCopy } from "@/content/site";
import { useReveal } from "@/lib/useReveal";
import via from "@/assets/obra/via-terminada.jpg";
import styles from "./CompanySection.module.css";

// Sección 2: quiénes son y qué hacen. Solo afirma lo confirmado: es una
// constructora e inmobiliaria, con obras viales y venta de lotes.
export function CompanySection() {
  const { empresa } = homeCopy;
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section ref={root} id="empresa" className={styles.company} aria-labelledby="empresa-title">
      <div className={styles.inner}>
        <header className={styles.head}>
          <p className={styles.kicker} data-reveal>
            {empresa.kicker}
          </p>
          <h2 id="empresa-title" className={styles.title} data-reveal>
            {empresa.title}
          </h2>
        </header>

        <div className={styles.grid}>
          <div className={styles.copy}>
            <p className={styles.lead} data-reveal>
              {empresa.lead}
            </p>

            <ul className={styles.pillars}>
              {empresa.pillars.map((pillar, i) => (
                <li key={pillar.label} className={styles.pillar} data-reveal>
                  <span className={styles.index}>{String(i + 1).padStart(2, "0")}</span>
                  <p className={styles.label}>{pillar.label}</p>
                  <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                  <p className={styles.pillarText}>{pillar.text}</p>
                  <Link href={pillar.link.href} className={styles.link}>
                    {pillar.link.label} <span aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <figure className={styles.figure} data-reveal>
            <div className={styles.photo}>
              <Image
                src={via}
                alt="Vista aérea de una vía en concreto recién construida, con demarcación y andenes, entre casas de un barrio."
                fill
                sizes="(max-width: 900px) 100vw, 45vw"
                placeholder="blur"
                className={styles.image}
              />
              <span className={`tag ${styles.tag}`}>{empresa.figure.tag}</span>
            </div>
            <figcaption className={styles.caption}>{empresa.figure.caption}</figcaption>
          </figure>
        </div>

        <div className={styles.proposal} data-reveal>
          <span className={styles.rule} aria-hidden="true" />
          <p className={styles.proposalText}>{empresa.proposal}</p>
          <Link href={empresa.more.href} className="btn btn-ghost glass">
            {empresa.more.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
