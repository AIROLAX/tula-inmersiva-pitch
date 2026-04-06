"use client";

import { motion } from "framer-motion";
import { scrollToSectionId } from "@/lib/scroll";

const bpEase = [0.16, 1, 0.3, 1];
const bpHidden = { opacity: 0, y: 48, filter: "blur(10px)" };

const bpHeaderSeq = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.04 },
  },
};

const bpLine = {
  hidden: bpHidden,
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: bpEase },
  },
};

function Region({ children, targetId, label }) {
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={label}
      className="bp-region"
      style={{ cursor: "pointer" }}
      onClick={() => scrollToSectionId(targetId)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          scrollToSectionId(targetId);
        }
      }}
    >
      {children}
    </g>
  );
}

export default function Blueprint() {
  return (
    <section
      className="section"
      id="blueprint"
      data-nav-section="6"
      style={{ flexDirection: "column", padding: "80px 40px" }}
    >
      <div className="blueprint-inner" style={{ maxWidth: 1100, width: "100%", textAlign: "center" }}>
        <motion.div
          variants={bpHeaderSeq}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.32, margin: "-10% 0px" }}
        >
          <motion.p className="section-tag" variants={bpLine}>
            Ingeniería de la Experiencia
          </motion.p>
          <motion.h2
            className="lobby-title"
            variants={bpLine}
            style={{
              background: "linear-gradient(135deg,#fff8e0,#f0d060,#c9a84c,#8b6030)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Blueprint Técnico & Wishlist
          </motion.h2>
          <motion.p className="lobby-text" variants={bpLine}>
            Infraestructura tecnológica, distribución de equipos y requerimientos de instalación para las
            cuatro salas de la experiencia Tollan Inmersivo.
          </motion.p>
        </motion.div>

        <div className="blueprint-grid">
          {[
            {
              icon: "🎥",
              t: "Proyección & Display",
              d: "4× Epson EB-PU2216B láser 16K lm · 6× Totem OLED 75\" transparente · Vídeo Wall LED 6×3m Fine Pitch 1.2mm · 2× Proyector cenital túnel 4K",
              delay: 0.05,
            },
            {
              icon: "🔊",
              t: "Audio Espacial",
              d: "Sistema Dolby Atmos 7.1.4 · Subwoofers bajo piso · Altavoces direccionales cardioides por zona · Silentdisco para sala VR · Integración OSC con control narrativo",
              delay: 0.1,
            },
            {
              icon: "🧠",
              t: "Interactividad & IA",
              d: "Azure Kinect DK · Detección esqueletal 32 pts · Motor de partículas reactivo Unity DOTS · ML para reconocimiento de gestos rituales toltecas",
              delay: 0.15,
            },
            {
              icon: "🥽",
              t: "Realidad Virtual",
              d: "20× Meta Quest 3 · Servidor de streaming VR local (5GHz mesh) · Fotogrametría 4K de Tula Grande · Duración 8 min · Gestión de flota MDM",
              delay: 0.2,
            },
            {
              icon: "⚡",
              t: "Infraestructura",
              d: "UPS central 30 kVA · Climatización de precisión por sala · Rack central 42U con redundancia · Fibra OM4 backbone · Control centralizado Crestron",
              delay: 0.25,
            },
            {
              icon: "🏛️",
              t: "Contenido Cultural",
              d: "Escaneado LiDAR zona arqueológica · 3D fotogrametría Atlantes y Palacio Quemado · Animación procedural códices toltecas · Consultoría INAH",
              delay: 0.3,
            },
          ].map((c) => (
            <motion.div
              key={c.t}
              className="blueprint-card"
              initial={bpHidden}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.68, delay: c.delay, ease: bpEase }}
              viewport={{ once: true, amount: 0.15, margin: "-8% 0px" }}
            >
              <div className="bp-icon">{c.icon}</div>
              <div className="bp-title">{c.t}</div>
              <div className="bp-text">{c.d}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="blueprint-diagram"
          initial={bpHidden}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.12, ease: bpEase }}
          viewport={{ once: true, amount: 0.12, margin: "-6% 0px" }}
        >
          <svg viewBox="0 0 800 420" style={{ width: "100%", maxHeight: 420 }} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="bp-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(201,168,76,0.07)" strokeWidth="1" />
              </pattern>
              <marker id="bp-arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="rgba(201,168,76,0.6)" />
              </marker>
            </defs>
            <rect width="800" height="420" fill="url(#bp-grid)" />

            <text x="400" y="28" textAnchor="middle" fill="#c9a84c" fontFamily="Cinzel,serif" fontSize="13" letterSpacing="3">
              PLANTA DE DISTRIBUCIÓN · TOLLAN INMERSIVO
            </text>
            <line x1="80" y1="36" x2="720" y2="36" stroke="rgba(201,168,76,0.3)" strokeWidth="1" />

            <Region targetId="sala-1" label="Ir a Sala I · El Origen">
              <rect x="60" y="55" width="160" height="140" rx="6" fill="rgba(20,0,40,0.8)" stroke="#c9a84c" strokeWidth="1.5" />
              <text x="140" y="80" textAnchor="middle" fill="#f0d060" fontFamily="Cinzel,serif" fontSize="10" pointerEvents="none">
                SALA I
              </text>
              <text x="140" y="96" textAnchor="middle" fill="#c9a84c" fontFamily="Cinzel,serif" fontSize="9" pointerEvents="none">
                EL ORIGEN
              </text>
            </Region>
            <circle cx="90" cy="115" r="7" fill="none" stroke="#c9a84c" strokeWidth="1.2" pointerEvents="none" />
            <text x="90" y="119" textAnchor="middle" fill="#c9a84c" fontSize="7" pointerEvents="none">
              P
            </text>
            <circle cx="190" cy="115" r="7" fill="none" stroke="#c9a84c" strokeWidth="1.2" pointerEvents="none" />
            <text x="190" y="119" textAnchor="middle" fill="#c9a84c" fontSize="7" pointerEvents="none">
              P
            </text>
            <circle cx="90" cy="165" r="7" fill="none" stroke="#c9a84c" strokeWidth="1.2" pointerEvents="none" />
            <text x="90" y="169" textAnchor="middle" fill="#c9a84c" fontSize="7" pointerEvents="none">
              P
            </text>
            <circle cx="190" cy="165" r="7" fill="none" stroke="#c9a84c" strokeWidth="1.2" pointerEvents="none" />
            <text x="190" y="169" textAnchor="middle" fill="#c9a84c" fontSize="7" pointerEvents="none">
              P
            </text>
            <text x="140" y="182" textAnchor="middle" fill="rgba(201,168,76,0.5)" fontSize="7" pointerEvents="none">
              4× EPSON LÁSER
            </text>

            <Region targetId="sala-2" label="Ir a Sala II · Foro Tollan">
              <rect x="260" y="55" width="280" height="140" rx="6" fill="rgba(30,10,0,0.8)" stroke="#c9a84c" strokeWidth="1.5" />
              <text x="400" y="80" textAnchor="middle" fill="#f0d060" fontFamily="Cinzel,serif" fontSize="10" pointerEvents="none">
                SALA II
              </text>
              <text x="400" y="96" textAnchor="middle" fill="#c9a84c" fontFamily="Cinzel,serif" fontSize="9" pointerEvents="none">
                FORO TOLLAN
              </text>
            </Region>
            <rect x="290" y="108" width="220" height="50" rx="3" fill="none" stroke="#c9a84c" strokeWidth="1.5" strokeDasharray="4,2" pointerEvents="none" />
            <text x="400" y="130" textAnchor="middle" fill="rgba(201,168,76,0.7)" fontSize="8" pointerEvents="none">
              VIDEO WALL 6×3 m
            </text>
            <text x="400" y="144" textAnchor="middle" fill="rgba(201,168,76,0.5)" fontSize="7" pointerEvents="none">
              LED FINE PITCH 1.2mm
            </text>
            <rect x="277" y="164" width="10" height="20" rx="2" fill="rgba(201,168,76,0.3)" stroke="#c9a84c" strokeWidth="1" pointerEvents="none" />
            <rect x="313" y="164" width="10" height="20" rx="2" fill="rgba(201,168,76,0.3)" stroke="#c9a84c" strokeWidth="1" pointerEvents="none" />
            <rect x="477" y="164" width="10" height="20" rx="2" fill="rgba(201,168,76,0.3)" stroke="#c9a84c" strokeWidth="1" pointerEvents="none" />
            <rect x="513" y="164" width="10" height="20" rx="2" fill="rgba(201,168,76,0.3)" stroke="#c9a84c" strokeWidth="1" pointerEvents="none" />
            <text x="400" y="190" textAnchor="middle" fill="rgba(201,168,76,0.5)" fontSize="7" pointerEvents="none">
              TÓTEMS OLED 75&quot; EN COLUMNAS
            </text>

            <Region targetId="sala-3" label="Ir a Sala III · Sendero del Tiempo">
              <rect x="60" y="220" width="480" height="80" rx="6" fill="rgba(0,20,10,0.8)" stroke="#c9a84c" strokeWidth="1.5" />
              <text x="300" y="245" textAnchor="middle" fill="#f0d060" fontFamily="Cinzel,serif" fontSize="10" pointerEvents="none">
                SALA III · SENDERO DEL TIEMPO · TÚNEL INMERSIVO 18 m
              </text>
            </Region>
            <line x1="75" y1="263" x2="525" y2="263" stroke="rgba(201,168,76,0.4)" strokeWidth="2" markerEnd="url(#bp-arrow)" pointerEvents="none" />
            <text x="300" y="285" textAnchor="middle" fill="rgba(201,168,76,0.5)" fontSize="7" pointerEvents="none">
              PANTALLAS CURVADAS 270° · PISO LED INTERACTIVO · VISTA CENITAL LIDAR
            </text>

            <Region targetId="sala-4" label="Ir a Sala IV · Túnel Inmersivo">
              <rect x="60" y="302" width="200" height="20" rx="4" fill="rgba(0,28,18,0.92)" stroke="#c9a84c" strokeWidth="1.2" />
              <text x="160" y="316" textAnchor="middle" fill="#f0d060" fontFamily="Cinzel,serif" fontSize="8" pointerEvents="none">
                SALA IV · TÚNEL INMERSIVO
              </text>
            </Region>

            <Region targetId="sala-5" label="Ir a Sala V · Visión Umvral">
              <rect x="580" y="55" width="160" height="245" rx="6" fill="rgba(15,0,30,0.8)" stroke="#c9a84c" strokeWidth="1.5" />
              <text x="660" y="80" textAnchor="middle" fill="#f0d060" fontFamily="Cinzel,serif" fontSize="10" pointerEvents="none">
                SALA V
              </text>
              <text x="660" y="96" textAnchor="middle" fill="#c9a84c" fontFamily="Cinzel,serif" fontSize="9" pointerEvents="none">
                VISIÓN UMVRAL
              </text>
            </Region>
            <g fill="none" stroke="#c9a84c" strokeWidth="1" pointerEvents="none">
              <ellipse cx="610" cy="140" rx="12" ry="7" />
              <ellipse cx="640" cy="140" rx="12" ry="7" />
              <ellipse cx="670" cy="140" rx="12" ry="7" />
              <ellipse cx="700" cy="140" rx="12" ry="7" />
              <ellipse cx="610" cy="165" rx="12" ry="7" />
              <ellipse cx="640" cy="165" rx="12" ry="7" />
              <ellipse cx="670" cy="165" rx="12" ry="7" />
              <ellipse cx="700" cy="165" rx="12" ry="7" />
              <ellipse cx="610" cy="190" rx="12" ry="7" />
              <ellipse cx="640" cy="190" rx="12" ry="7" />
              <ellipse cx="670" cy="190" rx="12" ry="7" />
              <ellipse cx="700" cy="190" rx="12" ry="7" />
            </g>
            <text x="660" y="220" textAnchor="middle" fill="rgba(201,168,76,0.5)" fontSize="7" pointerEvents="none">
              20× META QUEST 3
            </text>
            <text x="660" y="233" textAnchor="middle" fill="rgba(201,168,76,0.5)" fontSize="7" pointerEvents="none">
              6 DOF · 5GHz MESH
            </text>
            <text x="660" y="280" textAnchor="middle" fill="rgba(201,168,76,0.4)" fontSize="6" pointerEvents="none">
              HAPTIC FLOOR
            </text>

            <rect x="580" y="325" width="160" height="60" rx="4" fill="rgba(5,0,8,.9)" stroke="rgba(201,168,76,0.4)" strokeWidth="1" strokeDasharray="3,2" pointerEvents="none" />
            <text x="660" y="350" textAnchor="middle" fill="rgba(201,168,76,0.7)" fontSize="8" pointerEvents="none">
              RACK CENTRAL 42U
            </text>
            <text x="660" y="365" textAnchor="middle" fill="rgba(201,168,76,0.5)" fontSize="7" pointerEvents="none">
              UPS 30kVA · CRESTRON
            </text>
            <text x="660" y="378" textAnchor="middle" fill="rgba(201,168,76,0.5)" fontSize="7" pointerEvents="none">
              FIBRA OM4 BACKBONE
            </text>

            <Region targetId="lobby" label="Ir a Lobby · Bienvenida">
              <rect x="60" y="325" width="480" height="60" rx="4" fill="rgba(5,0,8,.9)" stroke="rgba(201,168,76,0.3)" strokeWidth="1" />
              <text x="300" y="355" textAnchor="middle" fill="#c9a84c" fontFamily="Cinzel,serif" fontSize="11" pointerEvents="none">
                LOBBY · RECEPCIÓN · MURALES & PIEZAS ARQUEOLÓGICAS
              </text>
              <text x="300" y="373" textAnchor="middle" fill="rgba(201,168,76,0.5)" fontSize="8" pointerEvents="none">
                Iluminación programable · vitrina arqueológica digital · tótem bienvenida
              </text>
            </Region>

            <circle cx="90" cy="404" r="5" fill="none" stroke="#c9a84c" strokeWidth="1" pointerEvents="none" />
            <text x="100" y="408" fill="rgba(201,168,76,0.7)" fontSize="8" pointerEvents="none">
              Proyector
            </text>
            <ellipse cx="165" cy="404" rx="10" ry="5" fill="none" stroke="#c9a84c" strokeWidth="1" pointerEvents="none" />
            <text x="180" y="408" fill="rgba(201,168,76,0.7)" fontSize="8" pointerEvents="none">
              Headset VR
            </text>
            <rect x="250" y="399" width="12" height="8" rx="1" fill="rgba(201,168,76,0.3)" stroke="#c9a84c" strokeWidth="1" pointerEvents="none" />
            <text x="268" y="408" fill="rgba(201,168,76,0.7)" fontSize="8" pointerEvents="none">
              Tótem OLED
            </text>
            <rect x="340" y="399" width="18" height="8" rx="1" fill="none" stroke="#c9a84c" strokeWidth="1" strokeDasharray="3,1" pointerEvents="none" />
            <text x="364" y="408" fill="rgba(201,168,76,0.7)" fontSize="8" pointerEvents="none">
              Infraestructura
            </text>
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
