"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const GOLD = new THREE.Color(0xc9a84c);
const AMBER = new THREE.Color(0xf0d060);
const CREAM = new THREE.Color(0xe8d5b0);

function rand(min, max) {
  return min + Math.random() * (max - min);
}

/** Vector normalizado aleatorio (dirección en la esfera celeste) */
function randomUnitVector() {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  return [
    Math.sin(phi) * Math.cos(theta),
    Math.sin(phi) * Math.sin(theta),
    Math.cos(phi),
  ];
}

function normalize3(x, y, z) {
  const l = Math.hypot(x, y, z) || 1;
  return [x / l, y / l, z / l];
}

function scale(v, s) {
  return [v[0] * s, v[1] * s, v[2] * s];
}

function add(a, b) {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

/** Estrella maya: tonos oro / ámbar / crema (no blanco puro) */
function mayaStarColor(bright) {
  if (bright) {
    const t = Math.random();
    const c = new THREE.Color().lerpColors(AMBER, GOLD, t * 0.6);
    c.lerp(CREAM, 0.15 + Math.random() * 0.2);
    return [c.r, c.g, c.b];
  }
  const r = rand(0.72, 0.92);
  const g = rand(0.62, 0.84);
  const b = rand(0.55, 0.78);
  return [r, g, b];
}

/**
 * Un solo cúmulo compacto (menos “nubes” de estrellas), con más trazos:
 * anillo cerrado + cuerdas internas.
 */
function clusterPleiades(center, radius, rSphere) {
  const stars = [];
  const edges = [];
  const n = 5 + Math.floor(Math.random() * 2);
  for (let i = 0; i < n; i++) {
    const j = [
      (Math.random() - 0.5) * radius * 2,
      (Math.random() - 0.5) * radius * 2,
      (Math.random() - 0.5) * radius * 2,
    ];
    const p = normalize3(...add(center, j));
    stars.push(scale(p, rSphere));
  }
  for (let i = 0; i < n; i++) {
    edges.push([i, (i + 1) % n]);
  }
  for (let i = 0; i < n; i++) {
    if (n >= 5 && Math.random() > 0.25) {
      edges.push([i, (i + 2) % n]);
    }
  }
  return { stars, edges };
}

/** Estrellas en fila (cinturón); `count` controla cuántos trazos (count−1). */
function beltLine(center, axis, spacing, rSphere, count = 3) {
  const ax = normalize3(...axis);
  const stars = [];
  const half = (count - 1) / 2;
  for (let i = 0; i < count; i++) {
    const off = (i - half) * spacing * 3;
    const p = normalize3(...add(center, scale(ax, off)));
    stars.push(scale(p, rSphere));
  }
  const edges = [];
  for (let i = 0; i < count - 1; i++) edges.push([i, i + 1]);
  return { stars, edges };
}

/** Cuadrilátero / casa del cielo (patrón de rueda calendárica) */
function quadrilateral(center, rSphere) {
  const u = randomUnitVector();
  const v = normalize3(
    u[1] * 0.4 - u[2] * 0.6,
    u[2] * 0.5 - u[0] * 0.3,
    u[0] * 0.7 - u[1] * 0.2
  );
  const w = 0.14;
  const pts = [
    add(center, scale(u, w)),
    add(center, scale(v, w)),
    add(center, scale(u, -w)),
    add(center, scale(v, -w)),
  ];
  const stars = pts.map((p) => scale(normalize3(...p), rSphere));
  return {
    stars,
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [0, 2],
      [1, 3],
    ],
  };
}

/** Serpiente / Camino de Xibalbá: cadena zigzag */
function serpentChain(center, rSphere, segments) {
  const perp = randomUnitVector();
  const along = normalize3(...cross3(center, perp));
  const stars = [];
  const edges = [];
  let acc = [...center];
  for (let i = 0; i < segments; i++) {
    const zig = (i % 2 === 0 ? 1 : -1) * 0.06;
    acc = add(acc, scale(along, 0.11));
    acc = add(acc, scale(perp, zig));
    stars.push(scale(normalize3(...acc), rSphere));
    if (i > 0) edges.push([i - 1, i]);
    if (i >= 2 && Math.random() > 0.55) edges.push([i - 2, i]);
  }
  return { stars, edges };
}

function cross3(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

/** Cruz / árbol del mundo (cuatro direcciones + centro) */
function worldCross(center, rSphere) {
  const u = randomUnitVector();
  const v = normalize3(...cross3(center, u));
  const s = 0.16;
  const stars = [
    scale(normalize3(...add(center, scale(u, s))), rSphere),
    scale(normalize3(...add(center, scale(u, -s))), rSphere),
    scale(normalize3(...add(center, scale(v, s))), rSphere),
    scale(normalize3(...add(center, scale(v, -s))), rSphere),
    scale(normalize3(...center), rSphere * 0.98),
  ];
  return {
    stars,
    edges: [
      [0, 4],
      [1, 4],
      [2, 4],
      [3, 4],
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
    ],
  };
}

/** Gemelos + lucero intermedio: triángulo con tres trazos */
function heroTwins(rSphere) {
  const c = randomUnitVector();
  const sep = normalize3(...cross3(c, randomUnitVector()));
  const a = scale(normalize3(...add(c, scale(sep, 0.12))), rSphere);
  const b = scale(normalize3(...add(c, scale(sep, -0.12))), rSphere);
  const mid = scale(normalize3(...c), rSphere * 0.995);
  return { stars: [a, mid, b], edges: [[0, 1], [1, 2], [2, 0]] };
}

/** Anillo “zodiaco” / rueda calendárica: N puntos en círculo + cuerdas */
function zodiacWheel(center, rSphere, n = 12) {
  const u = normalize3(...cross3(center, randomUnitVector()));
  const v = normalize3(...cross3(center, u));
  const stars = [];
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * Math.PI * 2;
    const p = add(center, add(scale(u, Math.cos(ang) * 0.2), scale(v, Math.sin(ang) * 0.2)));
    stars.push(scale(normalize3(...p), rSphere));
  }
  const edges = [];
  for (let i = 0; i < n; i++) {
    edges.push([i, (i + 1) % n]);
    if (n >= 8) edges.push([i, (i + Math.floor(n / 4)) % n]);
  }
  return { stars, edges };
}

/** Estrella de cinco puntas (pentagrama maya / Venus) */
function pentagramStar(center, rSphere) {
  const u = randomUnitVector();
  const v = normalize3(...cross3(center, u));
  const stars = [];
  for (let k = 0; k < 5; k++) {
    const ang = (k / 5) * Math.PI * 2 - Math.PI / 2;
    const p = add(center, add(scale(u, Math.cos(ang) * 0.16), scale(v, Math.sin(ang) * 0.16)));
    stars.push(scale(normalize3(...p), rSphere));
  }
  const edges = [];
  for (let i = 0; i < 5; i++) edges.push([i, (i + 2) % 5]);
  return { stars, edges };
}

/** Órbita doble: dos anillos entrelazados (8 figuras) */
function doubleOrbit(center, rSphere) {
  const u = randomUnitVector();
  const v = normalize3(...cross3(center, u));
  const stars = [];
  const n = 8;
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * Math.PI * 2;
    stars.push(
      scale(normalize3(...add(center, add(scale(u, Math.cos(ang) * 0.11), scale(v, Math.sin(ang) * 0.11)))), rSphere)
    );
  }
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * Math.PI * 2 + Math.PI / n;
    stars.push(
      scale(normalize3(...add(center, add(scale(u, Math.cos(ang) * 0.07), scale(v, Math.sin(ang) * 0.07)))), rSphere * 0.98)
    );
  }
  const edges = [];
  for (let i = 0; i < n; i++) {
    edges.push([i, (i + 1) % n]);
    edges.push([n + i, n + ((i + 1) % n)]);
    edges.push([i, n + i]);
  }
  return { stars, edges };
}

export default function StarfieldBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    const dpr = Math.min(
      typeof window !== "undefined" ? window.devicePixelRatio : 1,
      1.5
    );
    renderer.setPixelRatio(dpr);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 1;

    const R = 9.5;
    const constellations = [];

    constellations.push(clusterPleiades(randomUnitVector(), 0.2, R));
    constellations.push(beltLine(randomUnitVector(), randomUnitVector(), 0.05, R, 5));
    constellations.push(quadrilateral(randomUnitVector(), R));
    constellations.push(serpentChain(randomUnitVector(), R, 9));
    constellations.push(worldCross(randomUnitVector(), R));
    constellations.push(heroTwins(R));
    constellations.push(beltLine(randomUnitVector(), randomUnitVector(), 0.045, R, 4));
    constellations.push(zodiacWheel(randomUnitVector(), R, 12));
    constellations.push(pentagramStar(randomUnitVector(), R));
    constellations.push(doubleOrbit(randomUnitVector(), R));
    constellations.push(clusterPleiades(randomUnitVector(), 0.16, R));
    constellations.push(beltLine(randomUnitVector(), randomUnitVector(), 0.04, R, 6));
    constellations.push(clusterPleiades(randomUnitVector(), 0.14, R));
    constellations.push(serpentChain(randomUnitVector(), R, 7));
    constellations.push(worldCross(randomUnitVector(), R));
    constellations.push(zodiacWheel(randomUnitVector(), R, 10));
    constellations.push(pentagramStar(randomUnitVector(), R));
    constellations.push(doubleOrbit(randomUnitVector(), R));

    let constStarCount = 0;
    constellations.forEach((c) => {
      constStarCount += c.stars.length;
    });

    const bgCount = 2600;
    const totalStars = bgCount + constStarCount;

    const pos = new Float32Array(totalStars * 3);
    const col = new Float32Array(totalStars * 3);
    const sizes = new Float32Array(totalStars);

    let idx = 0;

    for (let i = 0; i < bgCount; i++) {
      const u = randomUnitVector();
      const depth = rand(6, 11);
      pos[idx * 3] = u[0] * depth;
      pos[idx * 3 + 1] = u[1] * depth;
      pos[idx * 3 + 2] = u[2] * depth;
      const [r, g, b] = mayaStarColor(false);
      col[idx * 3] = r;
      col[idx * 3 + 1] = g;
      col[idx * 3 + 2] = b;
      sizes[idx] = rand(0.038, 0.058);
      idx++;
    }

    constellations.forEach((cons) => {
      cons.stars.forEach((p) => {
        pos[idx * 3] = p[0];
        pos[idx * 3 + 1] = p[1];
        pos[idx * 3 + 2] = p[2];
        const [r, g, b] = mayaStarColor(true);
        col[idx * 3] = r;
        col[idx * 3 + 1] = g;
        col[idx * 3 + 2] = b;
        sizes[idx] = rand(0.065, 0.105);
        idx++;
      });
    });

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    starGeo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const starMat = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (380.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          vec2 cxy = 2.0 * gl_PointCoord - 1.0;
          float r = dot(cxy, cxy);
          if (r > 1.0) discard;
          float a = smoothstep(1.0, 0.15, r);
          float core = exp(-r * 3.2);
          gl_FragColor = vec4(vColor * (0.88 + 0.32 * core), a * 0.98);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(starGeo, starMat);
    const celestials = new THREE.Group();
    celestials.add(points);
    scene.add(celestials);

    const linePositions = [];
    let offset = bgCount;
    constellations.forEach((cons) => {
      cons.edges.forEach(([a, b]) => {
        const ia = offset + a;
        const ib = offset + b;
        linePositions.push(
          pos[ia * 3],
          pos[ia * 3 + 1],
          pos[ia * 3 + 2],
          pos[ib * 3],
          pos[ib * 3 + 1],
          pos[ib * 3 + 2]
        );
      });
      offset += cons.stars.length;
    });

    let lineMesh = null;
    if (linePositions.length > 0) {
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(linePositions, 3)
      );
      const lineMat = new THREE.LineBasicMaterial({
        color: GOLD,
        transparent: true,
        opacity: 0.58,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      lineMesh = new THREE.LineSegments(lineGeo, lineMat);
      celestials.add(lineMesh);
    }

    let W = window.innerWidth;
    let H = window.innerHeight;
    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      renderer.setSize(W, H, false);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    let raf = 0;
    function animate() {
      raf = requestAnimationFrame(animate);
      t += 0.00024;
      camera.rotation.x = Math.sin(t * 0.56) * 0.028;
      camera.rotation.y = Math.cos(t * 0.44) * 0.042;
      celestials.rotation.y = t * 0.013;
      celestials.rotation.x = Math.sin(t * 0.3) * 0.008;
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      starGeo.dispose();
      starMat.dispose();
      if (lineMesh) {
        lineMesh.geometry.dispose();
        lineMesh.material.dispose();
      }
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="bg-canvas"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
