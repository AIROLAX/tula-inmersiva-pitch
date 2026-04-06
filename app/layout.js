import { Cinzel, Inter } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
  weight: ["400", "600", "700", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500"],
});

export const metadata = {
  title: "Tollan Inmersivo · Sala Guadalupe Mastache · Tula",
  description:
    "Experiencia inmersiva en cuatro actos: cosmos, apogeo, caída y trascendencia tolteca.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${cinzel.variable} ${inter.variable}`}>
      <body
        className="site-body"
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
