// This page runs on the server (Server Component)
// --- CORREGIR IMPORTACIÓN ---
import { createBuildClient } from "@/utils/supabase/build-client";
// --- FIN CORRECCIÓN ---
import Link from "next/link";

export default async function GuiaPage() {
  // --- CORREGIR LLAMADA ---
  const supabase = createBuildClient();
  // --- FIN CORRECCIÓN ---

  const { data: sections, error } = await supabase
    .from("guide_sections")
    .select("title, slug")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching guide sections:", error);
  }

  return (
    <div className="page-container">
      <h1 className="mb-6">Guía Definitiva de Seguridad</h1>
      <p className="mb-8 text-lg text-gray-700 max-w-prose">
        Navega por las secciones de nuestra guía completa para fortalecer
        tu conocimiento y protegerte de las amenazas digitales más comunes
        en Costa Rica.
      </p>

      {error && (
        <p className="text-red-500">
          Error al cargar las secciones de la guía. Intenta recargar la página.
        </p>
      )}

      {sections && sections.length > 0 ? (
        <ul className="space-y-4">
          {sections.map((section) => (
            <li key={section.slug}>
              <Link
                href={`/guia/${section.slug}`}
                className="block p-4 font-semibold text-gray-800 transition-all duration-200 bg-gray-100 rounded-lg hover:bg-blue-light hover:text-primary hover:shadow-md"
              >
                {section.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        !error && <p className="text-gray-500 italic">No hay secciones disponibles en este momento.</p>
      )}
    </div>
  );
}