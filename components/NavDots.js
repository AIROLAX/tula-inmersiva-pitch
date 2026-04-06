"use client";

import { useEffect, useState } from "react";
import { scrollToSectionId } from "@/lib/scroll";

const NAV = [
  { id: "hero", label: "Inicio", section: 0 },
  { id: "sala-1", label: "Sala I · El Origen", section: 1 },
  { id: "sala-2", label: "Sala II · Foro Tollan", section: 2 },
  { id: "sala-3", label: "Sala III · Guerreros", section: 3 },
  { id: "sala-4", label: "Sala IV · Túnel / Sendero", section: 4 },
  { id: "sala-5", label: "Sala V · Visión Umvral", section: 5 },
  { id: "blueprint", label: "Blueprint Técnico", section: 6 },
];

export default function NavDots() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const els = document.querySelectorAll("[data-nav-section]");
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const v = e.target.getAttribute("data-nav-section");
            if (v != null) setActive(parseInt(v, 10));
          }
        });
      },
      { threshold: 0.4, rootMargin: "-10% 0px -10% 0px" }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <nav id="nav-dots" aria-label="Secciones">
      {NAV.map((n) => (
        <button
          key={n.id}
          type="button"
          className={`dot${active === n.section ? " active" : ""}`}
          data-label={n.label}
          aria-label={n.label}
          aria-current={active === n.section ? "true" : undefined}
          onClick={() => scrollToSectionId(n.id)}
        />
      ))}
    </nav>
  );
}
