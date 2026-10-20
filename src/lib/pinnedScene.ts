// Varias escenas de la portada se fijan mientras se recorren (hero, lotes,
// obras). El encabezado necesita saber si alguna está activa para no
// ocultarse al bajar. Cada escena se registra con su propio id.

const active = new Set<string>();

export function setPinnedScene(id: string, isActive: boolean) {
  if (isActive) active.add(id);
  else active.delete(id);

  const html = document.documentElement;
  if (active.size > 0) html.dataset.pinned = "";
  else delete html.dataset.pinned;
}
