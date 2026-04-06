/**
 * Comprueba que los medios esperados existan en `public/` (rutas sensibles a mayúsculas).
 * Mantén esta lista alineada con `lib/salaMedia.js` y `lib/audio.js`.
 * En Vercel/CI: si falta algún archivo, el build falla (evita desplegar sin assets en Git).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");

const REQUIRED = [
  "Videos/1 El Origen.jpeg",
  "Videos/2 Fprp Tollan.jpeg",
  "Videos/Tunnel.jpeg",
  "Videos/SalaVR.mp4",
  "Audio/[EFECTO DE SONIDO] MISTICO - mystical sound effect.mp3",
];

const missing = [];
for (const rel of REQUIRED) {
  const abs = path.join(publicDir, ...rel.split("/"));
  if (!fs.existsSync(abs)) missing.push(rel);
}

if (missing.length) {
  console.error(
    "\n[verify-public-assets] Faltan archivos en public/:\n"
  );
  missing.forEach((m) => console.error("  -", m));
  console.error(
    "\nAsegúrate de que existan en disco y en Git: git add public && git commit && git push\n" +
      "En Vercel, mayúsculas importan: la carpeta debe llamarse Videos, no videos.\n"
  );
  process.exit(1);
}

console.log("[verify-public-assets] OK:", REQUIRED.length, "archivos");
