"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const AUTO_MS = 6500;

export default function RoomImageCarousel({ images, alt = "" }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef(null);

  const n = images.length;
  const go = useCallback(
    (dir) => {
      if (n <= 1) return;
      setIndex((i) => (i + dir + n) % n);
    },
    [n]
  );

  useEffect(() => {
    if (n <= 1 || paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % n), AUTO_MS);
    return () => clearInterval(t);
  }, [n, paused]);

  const onTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (start == null) return;
    const end = e.changedTouches[0].clientX;
    const d = end - start;
    if (Math.abs(d) > 48) go(d < 0 ? 1 : -1);
  };

  if (!images?.length) return null;
  const isVideo = (src) => /\.(mp4|webm|ogg|mov)$/i.test(src || "");
  const current = images[index];

  return (
    <div
      className="room-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-roledescription="carrusel"
      aria-label={alt || "Galería de imágenes"}
    >
      <div className="room-carousel-viewport">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            className="room-carousel-slide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {isVideo(current) ? (
              <video
                src={current}
                aria-label={n > 1 ? `${alt} · ${index + 1} de ${n}` : alt}
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
              />
            ) : (
              <Image
                src={current}
                alt={n > 1 ? `${alt} · ${index + 1} de ${n}` : alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
                style={{ objectFit: "cover" }}
                priority={index === 0}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {n > 1 && (
        <>
          <button
            type="button"
            className="room-carousel-btn room-carousel-btn--prev"
            onClick={() => go(-1)}
            aria-label="Imagen anterior"
          >
            ‹
          </button>
          <button
            type="button"
            className="room-carousel-btn room-carousel-btn--next"
            onClick={() => go(1)}
            aria-label="Imagen siguiente"
          >
            ›
          </button>
          <div
            className="room-carousel-dots"
            role="tablist"
            aria-label="Seleccionar elemento"
          >
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                className={`room-carousel-dot${i === index ? " active" : ""}`}
                onClick={() => setIndex(i)}
                aria-label={`Elemento ${i + 1} de ${n}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
