import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { mainNav, site } from "@/content/site";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  const { contact } = site;
  const channels = [
    { label: "WhatsApp", value: contact.whatsapp },
    { label: "Teléfono", value: contact.phone },
    { label: "Correo", value: contact.email },
    { label: "Oficina", value: contact.address },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div>
          <Logo on="dark" className={styles.logo} />
          <p className={styles.tagline}>{site.tagline}</p>
        </div>

        <nav aria-label="Pie de página">
          <ul className={styles.list}>
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/politica-de-datos">Política de datos</Link>
            </li>
          </ul>
        </nav>

        <dl className={styles.contact}>
          {channels.map((c) => (
            <div key={c.label}>
              <dt>{c.label}</dt>
              <dd>{c.value ?? <span className="pending">Pendiente</span>}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className={styles.legal}>
        Las imágenes de los proyectos en venta son renders ilustrativos y no
        constituyen una representación exacta del producto final.
      </p>
    </footer>
  );
}
