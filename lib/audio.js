/**
 * Audio en `public/Audio/` → URL `/Audio/...` (no uses la carpeta `public` en la ruta).
 * Nombre del archivo debe coincidir con el disco y con `scripts/verify-public-assets.mjs`.
 */
const file = "[EFECTO DE SONIDO] MISTICO - mystical sound effect.mp3";

export const immersiveAmbientSrc = `/Audio/${encodeURIComponent(file)}`;
