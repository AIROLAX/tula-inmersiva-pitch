"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import StarfieldBackground from "@/components/StarfieldBackground";
import NavDots from "@/components/NavDots";
import Hero from "@/components/Hero";
import LobbySection from "@/components/LobbySection";
import RoomSection from "@/components/RoomSection";
import Blueprint from "@/components/Blueprint";
import ExploreModal from "@/components/ExploreModal";
import { salaMedia } from "@/lib/salaMedia";

const initialModal = {
  open: false,
  title: "",
  mode: null,
  image360Path: null,
  staticImagePath: null,
  staticAlt: "",
  videoPath: null,
};

export default function Home() {
  const [modal, setModal] = useState(initialModal);

  const closeModal = useCallback(() => setModal(initialModal), []);

  const open360 = useCallback((title, image360Path) => {
    setModal({
      open: true,
      title,
      mode: "360",
      image360Path,
      staticImagePath: null,
      staticAlt: "",
      videoPath: null,
    });
  }, []);

  const openVideo = useCallback((title, videoPath) => {
    setModal({
      open: true,
      title,
      mode: "video",
      image360Path: null,
      staticImagePath: null,
      staticAlt: "",
      videoPath,
    });
  }, []);

  return (
    <>
      <div className="starfield-layer" aria-hidden>
        <StarfieldBackground />
      </div>
      <div className="atmosphere-layer" aria-hidden />

      <div className="site-content">
        <NavDots />

        <Hero heroImageSrc={salaMedia.origen} />
      <LobbySection />

      <RoomSection
        id="sala-1"
        dataSection="1"
        imageSrc={salaMedia.origen}
        panoramaPreviewPath={salaMedia.origen}
        imageAlt="El Origen · vista de sala"
        numberRoman="I"
        tag="Cosmos Estelar · Sala Modular"
        title="El Origen"
        titleLine2="Proyección 360° Immersiva"
        body="La primera sala modular (10 × 10 m) donde la historia tolteca comienza en el cosmos. Proyectores Epson láser ultra-wide EB-PU2216B envuelven al visitante en animaciones estelares generadas de constelaciones nahuas, mapas celestes y la cosmogonía de Quetzalcóatl."
        specs={[
          "4 proyectores Epson láser 16,000 lm — blend seamless",
          "Sistema de audio 5.1 espacial · subwoofer cenital",
          "Animación generativa: constelaciones nahuas en tiempo real",
          "Piso de resina reflectante · efecto espejo estelar",
        ]}
        exploreIcon="360"
        exploreLabel="Explorar panorama 360°"
        onExplore={() =>
          open360("EL ORIGEN · Panorama 360°", salaMedia.origen)
        }
      />

      <RoomSection
        id="sala-2"
        dataSection="2"
        alt
        imageSrc={salaMedia.foroTollan}
        panoramaPreviewPath={salaMedia.foroTollan}
        imageAlt="Foro Tollan"
        numberRoman="II"
        tag="Clímax y Apogeo · Auditorio Multiusos"
        title="Foro Tollan"
        titleLine2="Kinética, Tótems y Vídeo Wall"
        body="El auditorio principal se transforma en Tollan en su apogeo. Tótems narrativos integrados en las columnas existentes proyectan secuencias históricas, mientras sensores Kinect activan contenido interactivo según el movimiento del visitante. Un vídeo wall central de 6 × 3 m ancla la narrativa visual."
        specs={[
          "Vídeo wall 6 × 3 m · 12 pantallas LED Fine Pitch 1.2mm",
          "6 tótems narrativos en columnas (75\" OLED transparente)",
          "Kinect Azure · detección de movimiento en tiempo real",
          "Capacidad: 120 personas · configuración flexible",
        ]}
        exploreIcon="render"
        exploreLabel="Explorar panorama 360°"
        onExplore={() =>
          open360("FORO TOLLAN · Panorama 360°", salaMedia.foroTollan)
        }
      />

      <RoomSection
        id="sala-3"
        dataSection="3"
        imageSrc={salaMedia.tunnel}
        panoramaPreviewPath={salaMedia.tunnel}
        imageAlt="Sendero del tiempo · túnel"
        numberRoman="III"
        tag="La Caída Ritual · Túnel Inmersivo"
        title="Sendero del Tiempo"
        titleLine2="Plumas de Quetzalcóatl · Vista Cenital"
        body="Un túnel de 18 metros donde el visitante desciende a través de la caída ritual de Tollan. El techo integra una vista cenital LiDAR de la ciudad arqueológica; las paredes se cubren de plumas de Quetzalcóatl animadas que se desintegran con el avance. El suelo traslúcido revela capas estratigráficas."
        specs={[
          "Túnel 18 m × 3.5 m · pantallas curvadas de 270°",
          "Vista cenital LiDAR · escaneado real zona arqueológica",
          "Piso LED 2 mm interactivo · presión activada",
          "Aromas procedurales · copal y tierra mojada",
        ]}
        exploreIcon="tunnel"
        exploreLabel="Explorar panorama 360°"
        onExplore={() =>
          open360(
            "SENDERO DEL TIEMPO · Panorama 360°",
            salaMedia.tunnel
          )
        }
      />

      <RoomSection
        id="sala-4"
        dataSection="4"
        alt
        videoSrc={salaMedia.salaVr}
        imageAlt="Experiencia VR · Visión Umvral"
        numberRoman="IV"
        tag="Trascendencia · Retorno al Cosmos"
        title="Visión Umvral"
        titleLine2="Sala VR · Clímax Final"
        body="El umbral de la trascendencia. El visitante equipa un headset VR de 6 DoF y es transportado al cosmos tolteca reconstruido en fotogrametría, flotando sobre Tula Grande en su momento de mayor esplendor. El clímax cierra el ciclo del Héroe: la conexión entre el tiempo y el cosmos."
        specs={[
          "Meta Quest 3 · 6 DoF · 20 estaciones simultáneas",
          "Fotogrametría 4K · zona arqueológica real de Tula",
          "Haptic feedback · suelos vibrotáctiles",
          "Duración: 8 min · narración en 3 idiomas",
        ]}
        exploreIcon="vr"
        exploreLabel="Ver experiencia en vídeo"
        onExplore={() =>
          openVideo("VISIÓN UMVRAL · Sala VR", salaMedia.salaVr)
        }
      />

      <Blueprint />

      <motion.footer
        initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <p>
          <strong>Tollan Inmersivo</strong> · Sala de Interpretación Guadalupe Mastache · Tula,
          Hidalgo · México
        </p>
        <p style={{ marginTop: 8, fontSize: "0.75rem" }}>
          Propuesta de Experiencia Inmersiva 2026 · Confidencial
        </p>
      </motion.footer>

        <ExploreModal
          open={modal.open}
          onClose={closeModal}
          title={modal.title}
          mode={modal.mode}
          image360Path={modal.image360Path}
          staticImagePath={modal.staticImagePath}
          staticAlt={modal.staticAlt}
          videoPath={modal.videoPath}
        />
      </div>
    </>
  );
}
