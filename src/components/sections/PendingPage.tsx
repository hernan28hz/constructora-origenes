import styles from "./PendingPage.module.css";

type Props = {
  kicker: string;
  title: string;
  lead: string;
  phase: string;
  planned: string[];
  children?: React.ReactNode;
};

// Página interna provisional: muestra qué contendrá la sección y qué
// información falta, sin inventar contenido.
export function PendingPage({ kicker, title, lead, phase, planned, children }: Props) {
  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <p className={styles.kicker}>{kicker}</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.lead}>{lead}</p>
      </header>

      {children}

      <section className={styles.plan} aria-labelledby="plan-title">
        <h2 id="plan-title" className={styles.planTitle}>
          En construcción · {phase}
        </h2>
        <ul>
          {planned.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}

export function SpecSheet({ title, rows }: { title: string; rows: [string, React.ReactNode][] }) {
  return (
    <section className={styles.sheet}>
      <h2 className={styles.sheetTitle}>{title}</h2>
      <dl>
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value ?? <span className="pending">Pendiente</span>}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
