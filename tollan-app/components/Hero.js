"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { immersiveAmbientSrc } from "@/lib/audio";

const glyphStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  width: "min(600px, 90vw)",
  height: "min(600px, 90vw)",
  opacity: 0.04,
  pointerEvents: "none",
};

export default function Hero({ heroImageSrc = "/hero-bg.jpg" }) {
  const sectionRef = useRef(null);
  const audioRef = useRef(null);
  const [soundOn, setSoundOn] = useState(false);
  const [imgError, setImgError] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const ySlow = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const yMed = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const yFast = useTransform(scrollYProgress, [0, 1], [0, 280]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const scaleBg = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  const ySlowS = useSpring(ySlow, { stiffness: 100, damping: 30 });
  const yMedS = useSpring(yMed, { stiffness: 100, damping: 30 });
  const yFastS = useSpring(yFast, { stiffness: 100, damping: 30 });

  const toggleSound = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (soundOn) {
      a.pause();
      setSoundOn(false);
    } else {
      a.play().catch(() => {});
      setSoundOn(true);
    }
  }, [soundOn]);

  return (
    <section
      ref={sectionRef}
      className="section"
      id="hero"
      data-nav-section="0"
      style={{
        flexDirection: "column",
        textAlign: "center",
        padding: "40px 20px",
        position: "relative",
      }}
    >
      <audio ref={audioRef} src={immersiveAmbientSrc} loop preload="metadata" />

      {!imgError && (
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            scale: scaleBg,
          }}
        >
          <Image
            src={heroImageSrc}
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", opacity: 0.52 }}
            onError={() => setImgError(true)}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `
                linear-gradient(165deg, rgba(60, 25, 95, 0.45) 0%, transparent 45%),
                linear-gradient(180deg, rgba(5, 0, 8, 0.25) 0%, rgba(5, 0, 8, 0.82) 55%, rgba(5, 0, 8, 0.94) 100%),
                radial-gradient(ellipse 90% 60% at 50% 20%, rgba(201, 168, 76, 0.08) 0%, transparent 55%)
              `,
            }}
          />
        </motion.div>
      )}

      <svg
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          ...glyphStyle,
          animation: "rotateGlyph 120s linear infinite",
        }}
      >
        <circle cx="200" cy="200" r="195" fill="none" stroke="#c9a84c" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="150" fill="none" stroke="#c9a84c" strokeWidth="1" />
        <circle cx="200" cy="200" r="100" fill="none" stroke="#c9a84c" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="50" fill="none" stroke="#c9a84c" strokeWidth="1" />
        <g stroke="#c9a84c" strokeWidth="1" fill="none">
          <line x1="200" y1="5" x2="200" y2="395" />
          <line x1="5" y1="200" x2="395" y2="200" />
          <line x1="60" y1="60" x2="340" y2="340" />
          <line x1="340" y1="60" x2="60" y2="340" />
        </g>
      </svg>

      <div style={{ position: "relative", zIndex: 2, maxWidth: 900, margin: "0 auto" }}>
        <motion.p
          style={{
            y: ySlowS,
            opacity: opacityHero,
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 11,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "var(--gold-l)",
            textShadow:
              "0 0 28px rgba(240,208,96,0.45), 0 0 56px rgba(201,168,76,0.2), 0 1px 2px rgba(0,0,0,0.4)",
          }}
        >
          Sala de Interpretación Guadalupe Mastache · Tula, Hidalgo
        </motion.p>
        <motion.h1
          style={{
            y: yMedS,
            opacity: opacityHero,
            fontFamily: "var(--font-cinzel), serif",
            fontSize: "clamp(2.8rem, 8vw, 7rem)",
            fontWeight: 900,
            lineHeight: 1.05,
            margin: ".5rem 0",
            background:
              "linear-gradient(135deg,#fff8e8 0%,#f0d060 35%,#c9a84c 65%,#8b6030 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter:
              "drop-shadow(0 0 32px rgba(240,208,96,0.28)) drop-shadow(0 4px 24px rgba(0,0,0,0.45))",
          }}
        >
          TOLLAN
          <br />
          INMERSIVO
        </motion.h1>
        <motion.p
          style={{
            y: yMedS,
            opacity: opacityHero,
            fontFamily: "var(--font-cinzel), serif",
            fontSize: "clamp(1rem, 3vw, 1.5rem)",
            color: "rgba(255, 240, 210, 0.96)",
            letterSpacing: 4,
            textShadow:
              "0 0 24px rgba(240,208,96,0.35), 0 2px 8px rgba(0,0,0,0.4)",
          }}
        >
          El Viaje del Héroe Tolteca
        </motion.p>
        <motion.p
          style={{
            y: yFastS,
            opacity: opacityHero,
            maxWidth: 560,
            margin: "2rem auto 0",
            fontSize: "1.15rem",
            lineHeight: 1.7,
            color: "rgba(245, 230, 200, 0.95)",
            textShadow: "0 1px 3px rgba(0,0,0,0.45)",
          }}
        >
          Una experiencia inmersiva en cuatro actos que recorre el cosmos, el apogeo,
          la caída y la trascendencia de la civilización tolteca a través de tecnología
          360°, VR y narrativa kinética.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          style={{ marginTop: "2rem" }}
        >
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={soundOn}
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 11,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: soundOn ? "var(--cosmic)" : "var(--gold)",
              background: soundOn ? "var(--gold)" : "transparent",
              border: "1.5px solid var(--gold)",
              padding: "12px 22px",
              borderRadius: 4,
              cursor: "pointer",
              transition: "background .25s, color .25s",
            }}
          >
            {soundOn ? "Sonido activo" : "Activar Sonido Místico"}
          </button>
        </motion.div>
      </div>

      <motion.div style={{ opacity: opacityHero }} className="hero-scroll">
        <span
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 10,
            letterSpacing: 4,
            color: "var(--gold-l)",
            textTransform: "uppercase",
            textShadow: "0 0 18px rgba(240,208,96,0.4)",
          }}
        >
          Descender
        </span>
        <div className="scroll-line" />
      </motion.div>
    </section>
  );
}
