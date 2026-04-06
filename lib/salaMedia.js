/**
 * Rutas de medios bajo `public/` → URL = `/Videos/...` (sin segmento `public`).
 * Mayúsculas y nombres deben coincidir con el disco (Linux/Vercel).
 */
const base = "/Videos";

function v(file) {
  return `${base}/${encodeURIComponent(file)}`;
}

function vIn(folder, file) {
  return `${base}/${encodeURIComponent(folder)}/${encodeURIComponent(file)}`;
}

const ORIGEN_FOLDER = "1 EL ORIGEN";
const FORO_FOLDER = "2 FORO TOLLAN";
const GUERREROS_FOLDER = "3 SALA GUERREROS";
const TUNNEL_FOLDER = "4 TUNNEL";

export const salaMedia = {
  origenSlides: [
    vIn(ORIGEN_FOLDER, "1.jpg"),
    vIn(ORIGEN_FOLDER, "2.jpg"),
    vIn(ORIGEN_FOLDER, "3.PNG"),
    vIn(ORIGEN_FOLDER, "4.PNG"),
  ],
  origen: vIn(ORIGEN_FOLDER, "1.jpg"),

  foroSlides: [vIn(FORO_FOLDER, "1.jpg"), vIn(FORO_FOLDER, "2.jpg")],
  foroTollan: vIn(FORO_FOLDER, "1.jpg"),

  guerrerosSlides: [
    vIn(GUERREROS_FOLDER, "3.jpg"),
    vIn(GUERREROS_FOLDER, "4.PNG"),
  ],
  /** Sala III · preview 360 */
  tunnel: vIn(GUERREROS_FOLDER, "3.jpg"),

  tunnelImmersiveSlides: [
    vIn(TUNNEL_FOLDER, "Gemini_Generated_Image_4gwsi24gwsi24gws.jpg"),
    vIn(TUNNEL_FOLDER, "Gemini_Generated_Image_ux3w3cux3w3cux3w.jpg"),
    vIn(TUNNEL_FOLDER, "Gemini_Generated_Image_vljwyvvljwyvvljw.jpg"),
    vIn(TUNNEL_FOLDER, "Gemini_Generated_Image_y84bfly84bfly84b.jpg"),
  ],
  /** Sala IV · Túnel inmersivo · preview 360 */
  tunnelImmersive: vIn(
    TUNNEL_FOLDER,
    "Gemini_Generated_Image_4gwsi24gwsi24gws.jpg"
  ),

  salaVr: v("SalaVR.mp4"),
};
