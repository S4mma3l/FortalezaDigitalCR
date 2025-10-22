// This page runs on the server (Server Component)
// We don't need cookies import here if createClient handles it internally
import { createClient } from "@/utils/supabase/server"; // Use SERVER client
import Link from "next/link";

export default async function GuiaPage() {
  // Instantiate client directly - it will call cookies() internally
  const supabase = createClient();

  // Fetch data
  const { data: sections, error } = await supabase
    .from("guide_sections")
    .select("title, slug")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching guide sections:", error);
    // Consider adding a user-facing error message or component
  }

  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h1 className="mb-6 text-blue-700">Guía Definitiva de Seguridad</h1>
      <p className="mb-8 text-lg text-gray-700">
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
                className="block p-4 text-lg font-semibold text-gray-800 transition-all duration-200 bg-gray-50 rounded-md hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm"
              >
                {section.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        !error && <p>No hay secciones disponibles en este momento.</p>
      )}
    </div>
  );
}