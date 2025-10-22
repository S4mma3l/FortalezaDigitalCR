import "./globals.css";
import Header from "@/components/Header";
import { Inter, Montserrat } from 'next/font/google';

// Configuración de fuentes (sin cambios)
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat', weight: ['400', '600', '700'], display: 'swap' });

export const metadata = {
  title: "Fortaleza Digital CR - Ciberseguridad en Costa Rica",
  description: "Guía profesional y herramientas de seguridad digital.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="flex flex-col min-h-screen bg-gray-50 font-sans"> {/* Fondo body gray-50 */}
        <Header />
        <main className="flex-grow w-full">
          {/* Contenedor principal */}
          <div className="container max-w-6xl px-4 py-6 mx-auto md:px-6 lg:py-10">
            {children}
          </div>
        </main>
        {/* --- FOOTER ACTUALIZADO --- */}
        {/* Fondo gris claro, borde superior */}
        <footer className="w-full py-8 mt-16 text-center text-sm bg-gray-100 border-t border-gray-200 text-gray-600">
          <div className="container max-w-6xl px-4 mx-auto md:px-6">
            <div className="flex flex-col items-center text-center">
              <p className="mb-3 font-semibold text-gray-800"> {/* Título footer gris oscuro */}
                Fortaleza Digital CR: Un proyecto educativo para la ciberseguridad en Costa Rica.
              </p>
              <p className="mb-3">
                Creado por: <a href="https://www.pentestercr.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">PentesterCR.com</a> {/* Enlace color primario */}
              </p>
              <p className="text-xs text-gray-500 max-w-prose mx-auto mb-4 px-4">
                Privacidad: Si te registras, tus datos (correo) se usan sólo para la funcionalidad del sitio (ej. "Mi Fortaleza"). No serán vendidos, compartidos ni usados para otros fines.
              </p>
              <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} Fortaleza Digital CR.
              </p>
            </div>
          </div>
        </footer>
        {/* --- FIN FOOTER --- */}
      </body>
    </html>
  );
}