import Image from "next/image";
import Link from "next/link";
import { obras } from "@/content/obras";
import lateral from "@/assets/parcelacion/lateral-dia.jpg";
import styles from "./ExploreSplit.module.css";

// Cierre de la portada: los dos caminos del sitio.
export function ExploreSplit() {
  return (
    <section className={styles.split} aria-labelledby="explora-title">
      <h2 id="explora-title" className={styles.heading}>
        Explora
      </h2>

      <Link href="/lotes" className={styles.path}>
        <Image
          src={lateral}
          alt=""
          fill
          sizes="(max-width: 800px) 100vw, 50vw"
          placeholder="blur"
          className={styles.image}
        />
        <span className={styles.shade} aria-hidden="true" />
        <span className={styles.body}>
          <span className={styles.kicker}>01 — Venta</span>
          <span className={styles.title}>Lotes y terrenos</span>
          <span className={styles.text}>
            Ubicación, áreas, accesos y disponibilidad de cada proyecto.
          </span>
          <span className={styles.more} aria-hidden="true">
            Ver lotes →
          </span>
        </span>
        <span className={`tag ${styles.tag}`}>Imagen ilustrativa</span>
      </Link>

      <Link href="/proyectos" className={`${styles.path} ${styles.survey}`}>
        <span className={styles.body}>
          <span className={styles.kicker}>02 — Portafolio</span>
          <span className={styles.title}>Obras ejecutadas</span>
          <span className={styles.text}>
            {obras.map((o) => o.nombre).join(" · ")}
          </span>
          <span className={styles.more} aria-hidden="true">
            Ver obras →
          </span>
        </span>
        <span className={`tag ${styles.tag}`}>Material fotográfico en preparación</span>
      </Link>
    </section>
  );
}
