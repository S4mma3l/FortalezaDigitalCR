// frontend/app/page.js
import Link from 'next/link';

export default function Home() {
  return (
    // Contenedor principal con sombra más suave
    <div className="page-container text-center shadow-md"> {/* Sombra más suave */}

      {/* Hero Section SIN icono */}
      <h1 className="text-4xl md:text-5xl font-heading font-bold text-brand-blue mb-4">
        Navega Seguro, Costa Rica
      </h1>
      <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-prose mx-auto">
        Fortaleza Digital CR es tu aliado para entender y enfrentar las amenazas digitales. Aprende, protégete y toma el control de tu seguridad en línea con herramientas y guías claras hechas para ti.
      </p>
      {/* [Image placeholder] */}

      {/* Sección Problema/Solución */}
      <div className="my-12 py-10 border-y border-gray-200 bg-gray-50 rounded-lg px-4"> {/* Fondo gris claro y redondeado */}
        <h2 className="text-2xl md:text-3xl font-heading font-semibold text-brand-darkblue mb-4">
          El Fraude Digital Aumenta, ¿Estás Preparado?
        </h2>
        <p className="text-gray-600 mb-8 max-w-prose mx-auto">
          Los ciberataques y estafas en Costa Rica crecen exponencialmente (¡<span className="font-semibold text-red-600">más del 600%</span> desde 2020!). No seas parte de la estadística. Con conocimiento práctico, puedes defenderte eficazmente.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
            <Link href="/guia" className="btn-primary">
            Explora la Guía Ahora
            </Link>
            <Link href="/herramientas" className="btn-secondary">
            Prueba las Herramientas
            </Link>
        </div>
      </div>

      {/* Sección de Características Clave SIN iconos */}
      {/* Tarjetas con fondo blanco y borde/sombra al hacer hover */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 my-12 text-left">
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-xl hover:border-brand-blue transition-all duration-300 transform hover:-translate-y-1"> {/* Animación al hacer hover */}
          {/* <span className="text-4xl mb-3 block text-brand-blue">📖</span> */}
          <h3 className="text-xl font-heading font-semibold text-brand-darkblue mb-2 mt-2"> {/* Margen superior para compensar icono */}
            Guía Interactiva
          </h3>
          <p className="text-sm text-gray-600 max-w-prose">
            Aprende a identificar phishing, crear contraseñas seguras, proteger tu privacidad y más, con explicaciones claras y ejemplos locales.
          </p>
          <Link href="/guia" className="text-brand-blue hover:underline text-sm font-medium mt-4 inline-block">
            Leer la Guía &rarr;
          </Link>
        </div>
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-xl hover:border-brand-blue transition-all duration-300 transform hover:-translate-y-1">
           {/* <span className="text-4xl mb-3 block text-brand-blue">🛠️</span> */}
          <h3 className="text-xl font-heading font-semibold text-brand-darkblue mb-2 mt-2">
            Herramientas Prácticas
          </h3>
          <p className="text-sm text-gray-600 max-w-prose">
            Analiza correos sospechosos con IA, elimina metadatos de tus fotos antes de compartirlas y mantén tu información segura.
          </p>
           <Link href="/herramientas" className="text-brand-blue hover:underline text-sm font-medium mt-4 inline-block">
            Usar Herramientas &rarr;
          </Link>
        </div>
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-xl hover:border-brand-blue transition-all duration-300 transform hover:-translate-y-1">
           {/* <span className="text-4xl mb-3 block text-brand-blue">🏰</span> */}
          <h3 className="text-xl font-heading font-semibold text-brand-darkblue mb-2 mt-2">
            Mi Fortaleza Personal
          </h3>
          <p className="text-sm text-gray-600 max-w-prose">
            Regístrate gratis para seguir tu progreso con nuestro checklist de ciberhigiene y construir paso a paso tu seguridad digital.
          </p>
           <Link href="/login" className="text-brand-blue hover:underline text-sm font-medium mt-4 inline-block">
            Crear Mi Fortaleza &rarr;
          </Link>
        </div>
      </div>

       {/* Call to Action Final */}
       <div className="mt-16 mb-4"> {/* Más margen superior */}
         <p className="text-gray-600 mb-6 max-w-prose mx-auto">
           La seguridad empieza con el conocimiento. ¡Empieza a protegerte hoy mismo!
         </p>
         <Link href="/guia" className="btn-primary text-base px-8 py-3"> {/* Botón más grande */}
            Comenzar a Aprender
         </Link>
       </div>
    </div>
  );
}