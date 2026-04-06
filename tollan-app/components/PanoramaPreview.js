"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Solo preview: rotación automática, sin arrastre (el modal es para explorar con el ratón).
 * Sensación “dentro del mundo” con FOV amplio.
 */
export default function PanoramaPreview({ imagePath }) {
  const wrapRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || !imagePath) return;

    let disposed = false;
    const canvas = document.createElement("canvas");
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    wrap.appendChild(canvas);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "low-power",
    });
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(82, 1, 0.1, 100);

    const geo = new THREE.SphereGeometry(50, 56, 28);
    geo.scale(-1, 1, 1);

    let mesh = null;
    const loader = new THREE.TextureLoader();
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
        tex.generateMipmaps = true;
        const mat = new THREE.MeshBasicMaterial({
          map: tex,
          side: THREE.BackSide,
        });
        mesh = new THREE.Mesh(geo, mat);
        scene.add(mesh);
      },
      undefined,
      () => {
        if (disposed) return;
        const mat = new THREE.MeshBasicMaterial({
          color: 0x1a0a2e,
          side: THREE.BackSide,
        });
        mesh = new THREE.Mesh(geo, mat);
        scene.add(mesh);
      }
    );

    let lon = 0;
    const lat = 0;

    function updateCamera() {
      const phi = THREE.MathUtils.degToRad(90 - lat);
      const theta = THREE.MathUtils.degToRad(lon);
      camera.lookAt(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta)
      );
    }

    let active = true;
    let raf = 0;
    let visible = true;

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.05, rootMargin: "40px" }
    );
    io.observe(wrap);

    function resize() {
      const w = wrap.clientWidth || 1;
      const h = wrap.clientHeight || 1;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    const ro = new ResizeObserver(() => resize());
    ro.observe(wrap);
    resize();

    function loop() {
      raf = requestAnimationFrame(loop);
      if (!visible || !active) return;
      lon += 0.032;
      updateCamera();
      renderer.render(scene, camera);
    }
    loop();

    return () => {
      disposed = true;
      active = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();

      if (mesh) {
        mesh.geometry?.dispose();
        const m = mesh.material;
        if (m.map) m.map.dispose();
        m.dispose();
        scene.remove(mesh);
      } else {
        geo.dispose();
      }
      renderer.dispose();
      canvas.remove();
    };
  }, [imagePath]);

  return (
    <div
      ref={wrapRef}
      className="panorama-preview-inner"
      style={{
        width: "100%",
        height: "100%",
        minHeight: 132,
        cursor: "default",
      }}
    />
  );
}
