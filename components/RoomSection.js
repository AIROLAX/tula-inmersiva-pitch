"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import PanoramaPreview from "./PanoramaPreview";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.08 },
  },
};

const easeScroll = [0.16, 1, 0.3, 1];

function itemVariants(alt) {
  const x = alt ? -52 : 52;
  return {
    hidden: { opacity: 0, x, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: { duration: 0.72, ease: easeScroll },
    },
  };
}

const specsContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.11, delayChildren: 0 },
  },
};

const specRowVariants = {
  hidden: { opacity: 0, x: -14, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: easeScroll },
  },
};

export default function RoomSection({
  id,
  dataSection,
  alt = false,
  imageSrc,
  /** Si se define, el panel usa vídeo en bucle (p. ej. Sala VR) en lugar de imagen */
  videoSrc,
  /** Misma textura que el modal 360: mini visor esférico en la parte baja del panel */
  panoramaPreviewPath,
  imageAlt = "",
  numberRoman,
  tag,
  title,
  titleLine2,
  body,
  specs,
  exploreIcon = "360",
  exploreLabel,
  onExplore,
}) {
  const sectionRef = useRef(null);
  const [imgError, setImgError] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], [alt ? 40 : -40, alt ? -40 : 40]);
  const imgYspring = useSpring(imgY, { stiffness: 90, damping: 28 });

  const iv = itemVariants(alt);

  return (
    <section
      ref={sectionRef}
      className={`section room-section${alt ? " alt" : ""}`}
      id={id}
      data-nav-section={dataSection}
    >
      <motion.div
        className="room-art"
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: easeScroll }}
      >
        <motion.div
          className="room-art-img-wrap"
          style={{ y: imgYspring }}
        >
          {videoSrc && !videoError ? (
            <video
              src={videoSrc}
              aria-label={imageAlt}
              autoPlay
              muted
              loop
              playsInline
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={() => setVideoError(true)}
            />
          ) : !imgError && imageSrc ? (
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized
              style={{ objectFit: "cover" }}
              priority={false}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="room-art-fallback" aria-hidden />
          )}
        </motion.div>
        {panoramaPreviewPath && !videoSrc && (
          <div className="room-360-preview">
            <span className="room-360-preview-label">Preview 360° · giro automático</span>
            <PanoramaPreview imagePath={panoramaPreviewPath} />
          </div>
        )}
        <div className="room-art-overlay">
          <button type="button" className="explore-btn" onClick={onExplore}>
            {exploreIcon === "360" && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" />
                <line x1="12" y1="2" x2="12" y2="5" />
                <line x1="12" y1="19" x2="12" y2="22" />
                <line x1="2" y1="12" x2="5" y2="12" />
                <line x1="19" y1="12" x2="22" y2="12" />
              </svg>
            )}
            {exploreIcon === "render" && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            )}
            {exploreIcon === "vr" && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
            {exploreIcon === "tunnel" && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" />
                <line x1="12" y1="2" x2="12" y2="5" />
                <line x1="12" y1="19" x2="12" y2="22" />
                <line x1="2" y1="12" x2="5" y2="12" />
                <line x1="19" y1="12" x2="22" y2="12" />
              </svg>
            )}
            {exploreLabel}
          </button>
        </div>
      </motion.div>

      <motion.div
        className="room-info"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.22,
          margin: "-10% 0px -6% 0px",
        }}
      >
        <motion.div className="room-number" variants={iv}>
          {numberRoman}
        </motion.div>
        <motion.p className="room-tag" variants={iv}>
          {tag}
        </motion.p>
        <motion.h2 className="room-title" variants={iv}>
          {title}
          {titleLine2 && <span>{titleLine2}</span>}
        </motion.h2>
        <motion.p className="room-text" variants={iv}>
          {body}
        </motion.p>
        <motion.div className="room-specs" variants={specsContainer}>
          {specs.map((line) => (
            <motion.div key={line} className="spec-row" variants={specRowVariants}>
              <span className="spec-dot" />
              {line}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
