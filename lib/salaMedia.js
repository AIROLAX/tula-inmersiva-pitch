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
const SALA_VR_FOLDER = "5 SALAVR";

export const salaMedia = {
  origenSlides: [
    vIn(ORIGEN_FOLDER, "1.jpg"),
    vIn(ORIGEN_FOLDER, "2.jpg"),
    vIn(ORIGEN_FOLDER, "3.PNG"),
    vIn(ORIGEN_FOLDER, "4.PNG"),
    vIn(ORIGEN_FOLDER, "5.JPG"),
  ],
  origen: vIn(ORIGEN_FOLDER, "1.jpg"),

  foroSlides: [
    vIn(FORO_FOLDER, "1.jpg"),
    vIn(FORO_FOLDER, "2.jpg"),
    vIn(FORO_FOLDER, "3.JPG"),
  ],
  foroTollan: vIn(FORO_FOLDER, "1.jpg"),

  /** Sala III · Guerreros — carpeta `3 SALA GUERREROS` */
  guerrerosSlides: [
    vIn(GUERREROS_FOLDER, "VIDEO GUERREROS.mp4"),
    vIn(GUERREROS_FOLDER, "3.jpg"),
    vIn(GUERREROS_FOLDER, "4.PNG"),
    vIn(GUERREROS_FOLDER, "5.JPG"),
  ],
  guerrerosPreview: vIn(GUERREROS_FOLDER, "3.jpg"),
  guerrerosVideo: vIn(GUERREROS_FOLDER, "VIDEO GUERREROS.mp4"),

  /** Sala IV · Túnel inmersivo / Sendero — carpeta `4 TUNNEL` */
  tunnelImmersiveSlides: [
    vIn(TUNNEL_FOLDER, "Gemini_Generated_Image_4gwsi24gwsi24gws.jpg"),
    vIn(TUNNEL_FOLDER, "Gemini_Generated_Image_ux3w3cux3w3cux3w.jpg"),
    vIn(TUNNEL_FOLDER, "Gemini_Generated_Image_vljwyvvljwyvvljw.jpg"),
    vIn(TUNNEL_FOLDER, "Gemini_Generated_Image_y84bfly84bfly84b.jpg"),
  ],
  tunnelImmersive: vIn(TUNNEL_FOLDER, "Gemini_Generated_Image_4gwsi24gwsi24gws.jpg"),

  /** Sala V · VR — primero imagen, luego video */
  salaVrSlides: [
    vIn(SALA_VR_FOLDER, "SALAVRIMAGEN.jpg"),
    vIn(SALA_VR_FOLDER, "SalaVR.mp4"),
  ],
  salaVrPreview: vIn(SALA_VR_FOLDER, "SALAVRIMAGEN.jpg"),
  salaVr: vIn(SALA_VR_FOLDER, "SalaVR.mp4"),
};
