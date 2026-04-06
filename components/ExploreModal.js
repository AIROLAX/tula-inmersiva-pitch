"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Three360Viewer from "./Three360Viewer";
import {
  requestFullscreen,
  exitFullscreen,
  isFullscreen,
  enterVideoFullscreenNative,
} from "@/lib/fullscreen";

export default function ExploreModal({
  open,
  onClose,
  title,
  mode,
  /** Lista de texturas 360 (misma sección); navegable en modal y en pantalla completa */
  image360Paths = null,
  staticImagePath,
  staticAlt = "Vista conceptual",
  videoPath,
}) {
  const canvasWrapRef = useRef(null);
  const videoWrapRef = useRef(null);
  const videoRef = useRef(null);
  const [fsActive, setFsActive] = useState(false);
  const [idx360, setIdx360] = useState(0);

  const paths360 = Array.isArray(image360Paths)
    ? image360Paths.filter(Boolean)
    : [];
  const n360 = paths360.length;
  const current360Path = n360 > 0 ? paths360[Math.min(idx360, n360 - 1)] : null;

  useEffect(() => {
    const sync = () => setFsActive(isFullscreen());
    sync();
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    document.addEventListener("mozfullscreenchange", sync);
    document.addEventListener("MSFullscreenChange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
      document.removeEventListener("mozfullscreenchange", sync);
      document.removeEventListener("MSFullscreenChange", sync);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (open) return;
    if (isFullscreen()) {
      exitFullscreen().catch(() => {});
    }
  }, [open]);

  useEffect(() => {
    if (open) setIdx360(0);
  }, [open, image360Paths]);

  useEffect(() => {
    if (!open || mode !== "360" || n360 <= 1) return;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setIdx360((i) => (i - 1 + n360) % n360);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setIdx360((i) => (i + 1) % n360);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, mode, n360]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape" && !isFullscreen()) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const onBackdrop = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  const toggleFs360 = useCallback(() => {
    const el = canvasWrapRef.current;
    if (!el) return;
    if (isFullscreen()) {
      exitFullscreen().catch(() => {});
    } else {
      requestFullscreen(el)
        .then(() => {
          window.dispatchEvent(new Event("resize"));
        })
        .catch(() => {});
    }
  }, []);

  const toggleFsVideo = useCallback(() => {
    const wrap = videoWrapRef.current;
    const video = videoRef.current;
    if (!wrap) return;
    if (isFullscreen()) {
      exitFullscreen().catch(() => {});
      return;
    }
    const isIos =
      typeof navigator !== "undefined" &&
      /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIos && video && enterVideoFullscreenNative(video)) {
      return;
    }
    requestFullscreen(wrap)
      .then(() => {
        video?.play?.().catch(() => {});
        window.dispatchEvent(new Event("resize"));
      })
      .catch(() => {
        if (video && enterVideoFullscreenNative(video)) return;
        video?.play?.().catch(() => {});
      });
  }, []);

  const is360 = mode === "360" && current360Path;
  const isVideo = mode === "video" && videoPath;

  const go360 = useCallback(
    (dir) => {
      if (n360 <= 1) return;
      setIdx360((i) => (i + dir + n360) % n360);
    },
    [n360]
  );

  const fsBtnStyle = {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 6,
    fontFamily: "var(--font-inter), sans-serif",
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "var(--gold)",
    background: "rgba(5,0,8,0.75)",
    border: "1px solid rgba(201,168,76,0.45)",
    padding: "8px 14px",
    borderRadius: 6,
    cursor: "pointer",
    backdropFilter: "blur(8px)",
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onBackdrop}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            background: "rgba(0,0,0,0.95)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(8px)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            style={{
              width: "100%",
              maxWidth: 1200,
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minHeight: 0,
              padding: "0 24px 24px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 0",
                flexShrink: 0,
              }}
            >
              <span
                id="modal-title"
                style={{
                  fontFamily: "var(--font-cinzel), serif",
                  fontSize: "1.1rem",
                  color: "var(--gold)",
                  letterSpacing: "3px",
                }}
              >
                {title}
              </span>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={onClose}
                style={{
                  background: "transparent",
                  border: "1.5px solid rgba(201,168,76,.4)",
                  color: "var(--gold)",
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>
            <div
              style={{
                width: "100%",
                flex: 1,
                minHeight: 0,
                position: "relative",
                padding: "0 0 12px",
              }}
            >
              {is360 && (
                <div
                  ref={canvasWrapRef}
                  className="explore-fs-target"
                  style={{
                    width: "100%",
                    height: "min(78vh, 680px)",
                    borderRadius: 8,
                    overflow: "hidden",
                    position: "relative",
                    background: "#000",
                    cursor: "grab",
                    boxShadow:
                      "0 0 0 1px rgba(201,168,76,0.2), 0 24px 80px rgba(0,0,0,0.6)",
                  }}
                >
                  {/* El canvas se monta primero; controles encima (z-index) */}
                  <Three360Viewer
                    key={current360Path}
                    imagePath={current360Path}
                    containerRef={canvasWrapRef}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFs360();
                    }}
                    style={{ ...fsBtnStyle, zIndex: 8 }}
                  >
                    {fsActive ? "Salir de pantalla completa" : "Pantalla completa"}
                  </button>
                  {n360 > 1 && (
                    <>
                      <button
                        type="button"
                        className="room-carousel-btn room-carousel-btn--prev explore-modal-360-nav"
                        aria-label="Panorama anterior"
                        onClick={(e) => {
                          e.stopPropagation();
                          go360(-1);
                        }}
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        className="room-carousel-btn room-carousel-btn--next explore-modal-360-nav"
                        aria-label="Panorama siguiente"
                        onClick={(e) => {
                          e.stopPropagation();
                          go360(1);
                        }}
                      >
                        ›
                      </button>
                      <div
                        className="room-carousel-dots explore-modal-360-dots"
                        role="tablist"
                        aria-label="Elegir imagen del panorama"
                      >
                        {paths360.map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            role="tab"
                            aria-selected={i === idx360}
                            className={`room-carousel-dot${i === idx360 ? " active" : ""}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setIdx360(i);
                            }}
                            aria-label={`Imagen ${i + 1} de ${n360}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  <div
                    className="explore-modal-360-hint"
                    style={{
                      position: "absolute",
                      bottom: 16,
                      left: "50%",
                      transform: "translateX(-50%)",
                      maxWidth: "88%",
                      textAlign: "center",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: 10,
                      letterSpacing: 1.5,
                      lineHeight: 1.5,
                      color: "rgba(201,168,76,.7)",
                      pointerEvents: "none",
                      zIndex: 6,
                    }}
                  >
                    Estás dentro del panorama · arrastra para mirar · rueda = zoom
                    {n360 > 1
                      ? " · ‹ › o puntos para otra imagen · ← → en teclado"
                      : ""}
                    {" · "}
                    A-Frame / WebVR, sin gafas
                  </div>
                </div>
              )}
              {isVideo && (
                <div
                  ref={videoWrapRef}
                  className="explore-fs-target explore-fs-target--video"
                  style={{
                    width: "100%",
                    height: "min(72vh, 620px)",
                    borderRadius: 8,
                    overflow: "hidden",
                    position: "relative",
                    background: "#000",
                  }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFsVideo();
                    }}
                    style={fsBtnStyle}
                  >
                    {fsActive ? "Salir de pantalla completa" : "Vídeo pantalla completa"}
                  </button>
                  <video
                    ref={videoRef}
                    key={videoPath}
                    src={videoPath}
                    controls
                    playsInline
                    autoPlay
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              )}
              {!is360 && !isVideo && staticImagePath && (
                <div
                  style={{
                    width: "100%",
                    height: "min(70vh, 600px)",
                    borderRadius: 8,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    background: "#000",
                  }}
                >
                  <Image
                    src={staticImagePath}
                    alt={staticAlt}
                    fill
                    sizes="(max-width: 1200px) 100vw, 1200px"
                    unoptimized
                    style={{ objectFit: "contain" }}
                    priority
                  />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
