"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { mainNav, site } from "@/content/site";
import { getLenis } from "@/lib/lenis";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar el menú al navegar a otra página.
  if (menuOpen && openedAt !== pathname) {
    setMenuOpen(false);
  }

  // Ocultar al bajar, mostrar al subir; fondo sólido fuera del hero.
  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setSolid(y > 40);
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 160);
        lastY = y;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Menú abierto: bloquear scroll, aislar el resto de la página y Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const outside = document.querySelectorAll<HTMLElement>("main, footer");
    const toggle = toggleRef.current;
    outside.forEach((el) => (el.inert = true));
    document.documentElement.style.overflow = "hidden";
    getLenis()?.stop();
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      outside.forEach((el) => (el.inert = false));
      document.documentElement.style.overflow = "";
      getLenis()?.start();
      document.removeEventListener("keydown", onKey);
      toggle?.focus();
    };
  }, [menuOpen]);

  const openMenu = () => {
    setOpenedAt(pathname);
    setMenuOpen((open) => !open);
  };

  return (
    <header
      className={styles.header}
      data-solid={solid || menuOpen || undefined}
      data-hidden={(hidden && !menuOpen) || undefined}
      data-menu={menuOpen || undefined}
    >
      <div className={styles.bar}>
        <Link
          href="/"
          className={styles.brand}
          aria-label={`${site.name} · ${site.descriptor}, inicio`}
        >
          <Logo on="dark" alt="" eager className={styles.logo} />
        </Link>

        <nav className={styles.desktopNav} aria-label="Principal">
          <ul className="glass">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className={`${styles.toggle} glass`}
          aria-expanded={menuOpen}
          aria-controls="menu-movil"
          onClick={openMenu}
        >
          <span className={styles.toggleLabel}>{menuOpen ? "Cerrar" : "Menú"}</span>
          <span className={styles.toggleIcon} aria-hidden="true" />
        </button>
      </div>

      <div
        id="menu-movil"
        ref={menuRef}
        className={styles.mobileMenu}
        data-open={menuOpen || undefined}
        hidden={!menuOpen}
      >
        <nav aria-label="Principal móvil">
          <ol>
            {mainNav.map((item, i) => (
              <li key={item.href} style={{ "--i": i } as React.CSSProperties}>
                <span className={styles.index} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </header>
  );
}
