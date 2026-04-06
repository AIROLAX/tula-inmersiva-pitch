/** Archivos en `public/Videos/` (el nombre del archivo debe coincidir con el disco). */
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
