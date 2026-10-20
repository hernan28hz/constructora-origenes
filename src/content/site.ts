// Datos globales del sitio. Todo lo marcado como PROVISIONAL debe
// reemplazarse con información confirmada por la empresa.

export const site = {
  // Nombre y descriptor oficiales, según la Guía de marca Orígenes.
  name: "Constructora Orígenes",
  descriptor: "Constructora e Inmobiliaria",
  // PROVISIONAL: línea descriptiva para metadatos y pie de página.
  tagline: "Lotes, terrenos e infraestructura vial",
  contact: {
    // Pendiente: canales que la empresa decida habilitar.
    whatsapp: null as string | null,
    phone: null as string | null,
    email: null as string | null,
    address: null as string | null,
  },
} as const;

export type NavItem = { href: string; label: string };

export const mainNav: NavItem[] = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/lotes", label: "Lotes" },
  { href: "/proyectos", label: "Obras" },
  { href: "/trabaja-con-nosotros", label: "Trabaja con nosotros" },
  { href: "/contacto", label: "Contacto" },
];

// PROVISIONAL: textos de la portada, pendientes de aprobación. Solo se
// afirma lo que ya es seguro (la empresa es constructora e inmobiliaria,
// hace obras viales y comercializa lotes); no hay cifras, fechas ni historia.
export const homeCopy = {
  // 1. Hero con la secuencia de la casa.
  hero: {
    eyebrow: "Constructora e Inmobiliaria",
    titleLines: ["Constructora", "Orígenes"],
    lead: "Comercializamos terrenos y construimos las vías que los conectan con su desarrollo.",
    primaryCta: { href: "#obras", label: "Explorar proyectos" },
    secondaryCta: { href: "#lotes", label: "Oportunidades inmobiliarias" },
    // `at` es el avance de la secuencia (0 a 1) en el que empieza cada paso.
    // Describen lo que se ve en las imágenes, que son ilustrativas.
    steps: [
      { at: 0, label: "El terreno", text: "Todo proyecto empieza en un terreno." },
      { at: 0.06, label: "Movimiento de tierras", text: "La maquinaria abre paso y prepara la base." },
      { at: 0.27, label: "Estructura", text: "Cimientos, muros y losas toman forma." },
      { at: 0.58, label: "Cerramientos", text: "Los vidrios y la madera cierran la casa." },
      { at: 0.82, label: "Acabados", text: "Los detalles y el paisaje la completan." },
      { at: 0.97, label: "El hogar", text: "Del terreno al hogar." },
    ],
    tag: "Secuencia ilustrativa",
    scrollCue: "Desliza",
    endCue: "Conoce Orígenes",
  },

  // 2. Información de la empresa.
  empresa: {
    kicker: "Quiénes somos",
    title: "Constructora e Inmobiliaria",
    lead: "Orígenes construye obras de infraestructura vial y comercializa lotes y terrenos.",
    pillars: [
      {
        label: "Constructora",
        title: "Infraestructura vial",
        text: "Obras viales ejecutadas y registradas con dron.",
        link: { href: "/proyectos", label: "Ver obras ejecutadas" },
      },
      {
        label: "Inmobiliaria",
        title: "Lotes y terrenos",
        text: "Comercialización de lotes y terrenos.",
        link: { href: "/lotes", label: "Ver lotes" },
      },
    ],
    // Propuesta de valor: texto propuesto, por aprobar por la empresa.
    proposal:
      "Cada proyecto empieza en el terreno. Por eso trabajamos desde el origen: la tierra, la vía que la conecta y el hogar que se construye sobre ella.",
    figure: { tag: "Foto real de obra", caption: "Vía en concreto con demarcación, vista con dron." },
    more: { href: "/nosotros", label: "Conocer más" },
  },

  // 3. Venta de lotes. La ficha técnica sale de `parcelaciones.ts`: solo se
  // muestra lo que esté confirmado.
  lotes: {
    kicker: "Venta",
    title: "Lotes y terrenos",
    lead: "Proyectos disponibles con su ubicación, áreas, accesos y disponibilidad.",
    pending:
      "La ficha técnica y el plano de loteo (ubicación, áreas, servicios y disponibilidad de cada lote) se publicarán cuando estén confirmados.",
    tag: "Render ilustrativo",
    planosLabel: "Planos del proyecto",
    primaryCta: { href: "/contacto?asunto=disponibilidad", label: "Consultar disponibilidad" },
    secondaryCta: { href: "/contacto?asunto=informacion", label: "Solicitar información" },
  },

  // 4. Obras ejecutadas: es la sección que antes vivía en el hero.
  obras: {
    eyebrow: "Portafolio",
    titleLines: ["Obras", "ejecutadas"],
    primaryCta: { href: "/proyectos", label: "Explorar proyectos" },
    secondaryCta: { href: "/lotes", label: "Oportunidades inmobiliarias" },
    // Describe solo lo que se ve en el video, sin atribuirlo a una obra concreta.
    media: {
      kicker: "Video real de obra",
      title: "Pavimentación en concreto",
      text: "Registro con dron de una obra en ejecución: el vaciado del concreto, el avance de la vía y su llegada al barrio.",
      link: { href: "/proyectos", label: "Ver obras" },
    },
    // Momentos del video (segundos) que se pueden elegir desde la sección.
    chapters: [
      { at: 0, label: "Vaciado" },
      { at: 6, label: "Avance de la vía" },
      { at: 25, label: "Panorámica" },
    ],
    explore: {
      title: "Explora Orígenes",
      links: [
        { href: "/lotes", label: "Lotes y terrenos", note: "Render" },
        { href: "/proyectos", label: "Obras ejecutadas", note: "Foto real" },
        { href: "/trabaja-con-nosotros", label: "Trabaja con nosotros", note: "Foto real" },
      ],
    },
    // Frase que aparece al desplazarse sobre el video.
    statement: {
      eyebrow: "Nuestro origen",
      text: "Todo proyecto empieza en el terreno. Por eso construimos desde la base, con obras hechas para durar.",
    },
  },

  // 5. Trabaja con nosotros. Cómo se participa y en qué condiciones aún no
  // está definido: no se publica ninguna condición.
  trabaja: {
    kicker: "Trabaja con nosotros",
    title: "Colabora con la venta de nuestros lotes",
    text: "Este espacio es para personas interesadas en colaborar con la comercialización de los lotes de Orígenes.",
    pending: "Estamos definiendo cómo será la participación. La información se publicará cuando esté confirmada.",
    tag: "Render ilustrativo",
    cta: { href: "/trabaja-con-nosotros", label: "Quiero más información" },
  },

  // Lo usa TerrainStory (ya no se muestra en la portada) y las capas de la
  // sección de lotes.
  story: {
    eyebrow: "Del terreno al hogar",
    steps: [
      {
        label: "El terreno",
        title: "Cada lote, sobre su propia terraza.",
        text: "Terrazas niveladas, vías internas y accesos trazados sobre la ladera.",
      },
      {
        label: "La infraestructura",
        title: "Vías e iluminación que conectan.",
        text: "La red interna integra cada lote al paisaje, de día y de noche.",
      },
      {
        label: "El hogar",
        title: "Así puede verse cuando cada lote tenga su casa.",
        text: "Una visión del proyecto terminado, a partir del mismo punto de vista.",
      },
    ],
  },
} as const;

// Secuencia de imágenes del hero (ver scripts/optimize-sequence.mjs). Los
// fotogramas se numeran desde 1: frame_0001.webp, frame_0002.webp…
export const heroSequence = {
  desktop: { dir: "/media/scrollytelling/timelapse-house/desktop", count: 83, width: 1280 },
  mobile: { dir: "/media/scrollytelling/timelapse-house/mobile", count: 42, width: 854 },
} as const;
