"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Panorama 360°: esfera invertida con textura equirectangular desde /public.
 * @param {{ imagePath: string; containerRef: React.RefObject<HTMLElement | null> }} props
 */
export default function Three360Viewer({ imagePath, containerRef }) {
  const meshRef = useRef(null);

  useEffect(() => {
    const wrap = containerRef?.current;
    if (!wrap || !imagePath) return;

    let disposed = false;
    const canvas = document.createElement("canvas");
    /* prepend: los botones del modal quedan encima del canvas */
    wrap.prepend(canvas);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 1);
    if ("outputColorSpace" in renderer) {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    }
    /* Evita aspect NaN/∞ si el modal aún no midió layout (pantalla negra) */
    const W0 = Math.max(1, wrap.clientWidth);
    const H0 = Math.max(1, wrap.clientHeight);
    renderer.setSize(W0, H0);
    renderer.setPixelRatio(Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2));

    const scene = new THREE.Scene();
    /* FOV amplio = sensación de “estar dentro” del mundo (como A-Frame / visor 360) */
    const camera = new THREE.PerspectiveCamera(88, W0 / H0, 0.1, 100);
    camera.position.set(0, 0, 0);

    const geo = new THREE.SphereGeometry(50, 64, 32);
    /* Esfera “invertida”: ver la textura desde dentro. Usar FrontSide, NO BackSide junto con scale(-1). */
    geo.scale(-1, 1, 1);

    const isVideoPath = /\.(mp4|webm|ogg|mov)$/i.test(imagePath);
    const loader = new THREE.TextureLoader();
    const maxAniso =
      typeof renderer.capabilities.getMaxAnisotropy === "function"
        ? renderer.capabilities.getMaxAnisotropy()
        : 8;
    let htmlVideo = null;

    const applyFallback = () => {
      if (disposed) return;
      const mat = new THREE.MeshBasicMaterial({
        color: 0x1a0a28,
        side: THREE.FrontSide,
      });
      const mesh = new THREE.Mesh(geo, mat);
      meshRef.current = mesh;
      scene.add(mesh);
    };

    if (isVideoPath) {
      htmlVideo = document.createElement("video");
      htmlVideo.src = imagePath;
      htmlVideo.crossOrigin = "anonymous";
      htmlVideo.loop = true;
      htmlVideo.muted = true;
      htmlVideo.playsInline = true;
      htmlVideo.setAttribute("playsinline", "true");
      htmlVideo.setAttribute("webkit-playsinline", "true");
      htmlVideo.preload = "auto";

      const onLoaded = () => {
        if (disposed || !htmlVideo) return;
        const tex = new THREE.VideoTexture(htmlVideo);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
        const mat = new THREE.MeshBasicMaterial({
          map: tex,
          side: THREE.FrontSide,
        });
        const mesh = new THREE.Mesh(geo, mat);
        meshRef.current = mesh;
        scene.add(mesh);
        htmlVideo.play().catch(() => {});
      };

      htmlVideo.addEventListener("loadeddata", onLoaded, { once: true });
      htmlVideo.addEventListener("error", applyFallback, { once: true });
      htmlVideo.load();
    } else {
      loader.load(
        imagePath,
        (tex) => {
          if (disposed) {
            tex.dispose();
            return;
          }
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.anisotropy = Math.min(16, maxAniso);
          tex.generateMipmaps = true;
          const mat = new THREE.MeshBasicMaterial({
            map: tex,
            side: THREE.FrontSide,
          });
          const mesh = new THREE.Mesh(geo, mat);
          meshRef.current = mesh;
          scene.add(mesh);
        },
        undefined,
        applyFallback
      );
    }

    let lon = 0;
    let lat = 0;
    let isDrag = false;
    let startX = 0;
    let startY = 0;
    let startLon = 0;
    let startLat = 0;
    let autoRot = true;
    let autoTimer;

    function updateCamera() {
      const phi = THREE.MathUtils.degToRad(
        90 - Math.max(-85, Math.min(85, lat))
      );
      const theta = THREE.MathUtils.degToRad(lon);
      camera.lookAt(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta)
      );
    }

    const onDown = (e) => {
      isDrag = true;
      autoRot = false;
      const cx = "touches" in e ? e.touches[0].clientX : e.clientX;
      const cy = "touches" in e ? e.touches[0].clientY : e.clientY;
      startX = cx;
      startY = cy;
      startLon = lon;
      startLat = lat;
      clearTimeout(autoTimer);
    };
    const onUp = () => {
      if (!isDrag) return;
      isDrag = false;
      autoTimer = setTimeout(() => {
        autoRot = true;
      }, 1800);
    };
    const onMove = (e) => {
      if (!isDrag) return;
      const cx = "touches" in e ? e.touches[0].clientX : e.clientX;
      const cy = "touches" in e ? e.touches[0].clientY : e.clientY;
      const mul = "touches" in e ? 0.22 : 0.18;
      lon = startLon - (cx - startX) * mul;
      lat = startLat + (cy - startY) * (mul * 0.72);
    };
    const onWheel = (e) => {
      camera.fov = Math.max(30, Math.min(100, camera.fov + e.deltaY * 0.05));
      camera.updateProjectionMatrix();
    };

    wrap.addEventListener("mousedown", onDown);
    wrap.addEventListener("mouseup", onUp);
    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("touchstart", onDown, { passive: true });
    wrap.addEventListener("touchend", onUp);
    wrap.addEventListener("touchmove", onMove, { passive: true });
    wrap.addEventListener("wheel", onWheel, { passive: true });
    /* Suelta el arrastre aunque el cursor salga del canvas (evita “se queda enganchado”) */
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp, { passive: true });

    let active = true;
    let raf = 0;
    function loop() {
      if (!active) return;
      raf = requestAnimationFrame(loop);
      if (autoRot) lon += 0.045;
      updateCamera();
      renderer.render(scene, camera);
    }
    loop();

    function handleResize() {
      const w = Math.max(1, wrap.clientWidth);
      const h = Math.max(1, wrap.clientHeight);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", handleResize);
    const ro = new ResizeObserver(() => handleResize());
    ro.observe(wrap);

    return () => {
      disposed = true;
      active = false;
      cancelAnimationFrame(raf);
      clearTimeout(autoTimer);
      ro.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
      wrap.removeEventListener("mousedown", onDown);
      wrap.removeEventListener("mouseup", onUp);
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("touchstart", onDown);
      wrap.removeEventListener("touchend", onUp);
      wrap.removeEventListener("touchmove", onMove);
      wrap.removeEventListener("wheel", onWheel);

      const mesh = meshRef.current;
      meshRef.current = null;
      if (mesh) {
        mesh.geometry?.dispose();
        const m = mesh.material;
        if (m.map) m.map.dispose();
        m.dispose();
        scene.remove(mesh);
      } else {
        geo.dispose();
      }
      if (htmlVideo) {
        htmlVideo.pause();
        htmlVideo.src = "";
        htmlVideo.load();
        htmlVideo = null;
      }
      renderer.dispose();
      canvas.remove();
    };
  }, [imagePath, containerRef]);

  return null;
}
