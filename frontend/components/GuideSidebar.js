// components/GuideSidebar.js
"use client"; // Necesitamos 'use client' si usamos hooks como usePathname en el futuro,
              // pero por ahora, solo recibe props. Es seguro marcarlo así.

import Link from 'next/link';

export default function GuideSidebar({ sections = [], currentSlug }) {
  if (!sections || sections.length === 0) {
    return null; // No mostrar nada si no hay secciones
  }

  return (
    // 'sticky top-24' hace que se quede fijo al hacer scroll
    // 'hidden lg:block' lo oculta en pantallas pequeñas y lo muestra en grandes
    <aside className="w-full lg:w-64 lg:pr-8 hidden lg:block sticky top-24 self-start">
      <nav>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Secciones de la Guía
        </h3>
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.slug}>
              <Link
                href={`/guia/${section.slug}`}
                // Aplica estilos diferentes si es el enlace actual
                className={`block px-3 py-2 rounded-md text-sm transition-colors duration-150 ${
                  currentSlug === section.slug
                    ? 'bg-blue-100 text-blue-700 font-semibold' // Estilo activo
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' // Estilo inactivo
                }`}
              >
                {section.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}