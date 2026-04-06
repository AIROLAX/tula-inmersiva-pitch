"use client";

import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 36, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.72, ease },
  },
};

/** Recorrido en orden: etiqueta → líneas del título → párrafos → pastillas una a una */
const sequence = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.06,
    },
  },
};

const pillsWrapper = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0,
    },
  },
};

const pillItem = {
  hidden: { opacity: 0, scale: 0.92, y: 12, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease },
  },
};

export default function LobbySection() {
  return (
    <section className="section" id="lobby" data-nav-section="0">
      <motion.div
        className="lobby-inner"
        variants={sequence}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.28, margin: "-12% 0px -8% 0px" }}
      >
        <motion.p className="section-tag" variants={fadeUp}>
          Propuesta de Intervención
        </motion.p>

        <motion.h2
          className="lobby-title"
          variants={fadeUp}
          style={{
            background: "linear-gradient(135deg,#fff8e0,#f0d060,#c9a84c,#8b6030)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          <span className="lobby-title-line">Un recorrido entre murales,</span>
          <span className="lobby-title-line">
            piezas arqueológicas y cosmos digital
          </span>
        </motion.h2>

        <motion.p className="lobby-text" variants={fadeUp}>
          La Sala Guadalupe Mastache albergará una intervención de cuatro capas narrativas que fusiona
          escaneados 3D y LiDAR del sitio con animación procedural, proyección 360°, interactividad
          kinética y realidad virtual.
        </motion.p>
        <motion.p className="lobby-text lobby-text-muted" variants={fadeUp}>
          El visitante no observa la historia: la <em>habita</em> — en el orden del viaje del héroe:
          cosmos, apogeo, caída y trascendencia.
        </motion.p>

        <motion.div className="lobby-pills" variants={pillsWrapper}>
          {[
            "Proyección 360°",
            "Kinect / IA Kinética",
            "Tótems Narrativos",
            "Tunnel Inmersivo",
            "VR · 6 DoF",
            "LiDAR & Fotogrametría",
          ].map((p) => (
            <motion.span key={p} className="pill" variants={pillItem}>
              {p}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
