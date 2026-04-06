/**
 * Rutas de medios bajo `public/` → URL en el sitio = `/Videos/...`, `/Audio/...`
 * (Next.js sirve `public/` en la raíz; NO incluyas el segmento "public" en la URL).
 *
 * Despliegue (Vercel):
 * - Los archivos deben estar en el repositorio Git (commit + push). Si no subes
 *   `public/Videos` y `public/Audio`, en producción habrá 404.
 * - Linux (Vercel) distingue mayúsculas: la carpeta debe ser exactamente `Videos`,
 *   no `videos`; los nombres de archivo deben coincidir carácter a carácter.
 * - Tras cambiar nombres en disco, actualiza `v(...)` y `scripts/verify-public-assets.mjs`.
 */
const base = "/Videos";

function v(file) {
  return `${base}/${encodeURIComponent(file)}`;
}

export const salaMedia = {
  origen: v("1 El Origen.jpeg"),
  foroTollan: v("2 Fprp Tollan.jpeg"),
  tunnel: v("Tunnel.jpeg"),
  salaVr: v("SalaVR.mp4"),
};
