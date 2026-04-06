import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");

const REQUIRED = [
  "Videos/1 EL ORIGEN/1.jpg",
  "Videos/1 EL ORIGEN/2.jpg",
  "Videos/1 EL ORIGEN/3.PNG",
  "Videos/1 EL ORIGEN/4.PNG",
  "Videos/1 EL ORIGEN/5.jpg",
  "Videos/2 FORO TOLLAN/1.jpg",
  "Videos/2 FORO TOLLAN/2.jpg",
  "Videos/2 FORO TOLLAN/3.jpg",
  "Videos/3 SALA GUERREROS/3.jpg",
  "Videos/3 SALA GUERREROS/4.PNG",
  "Videos/3 SALA GUERREROS/5.JPG",
  "Videos/3 SALA GUERREROS/VIDEO GUERREROS.mp4",
  "Videos/4 TUNNEL/Gemini_Generated_Image_4gwsi24gwsi24gws.jpg",
  "Videos/4 TUNNEL/Gemini_Generated_Image_ux3w3cux3w3cux3w.jpg",
  "Videos/4 TUNNEL/Gemini_Generated_Image_vljwyvvljwyvvljw.jpg",
  "Videos/4 TUNNEL/Gemini_Generated_Image_y84bfly84bfly84b.jpg",
  "Videos/SalaVR.mp4",
  "Audio/[EFECTO DE SONIDO] MISTICO - mystical sound effect.mp3",
];

const missing = [];
for (const rel of REQUIRED) {
  const abs = path.join(publicDir, ...rel.split("/"));
  if (!fs.existsSync(abs)) missing.push(rel);
}


if (missing.length) {
  console.error("\n[verify-public-assets] Faltan archivos en public/:\n");
  missing.forEach((m) => console.error("  -", m));
  process.exit(1);
}

console.log("[verify-public-assets] OK:", REQUIRED.length, "archivos");
