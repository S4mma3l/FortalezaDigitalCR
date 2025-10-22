// app/guia/[slug]/page.js
import { createClient } from "@/utils/supabase/server";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { notFound } from 'next/navigation';
import GuideSidebar from '@/components/GuideSidebar';

// --- FUNCIONES DE OBTENCIÓN DE DATOS ---

// Función para obtener todos los slugs y títulos ordenados (para Sidebar, Nav, generateStaticParams)
async function getAllSectionsMetadata() {
    const supabase = createClient();
    const { data: allSections, error: allError } = await supabase
        .from("guide_sections")
        .select("title, slug, order_index") // Seleccionar solo lo necesario
        .order("order_index", { ascending: true });
    if(allError) {
        console.error("Error fetching all sections metadata:", allError);
        return []; // Devolver vacío en caso de error
    }
    return allSections;
}

// Función para obtener el contenido de UNA sección específica por slug
async function getCurrentSectionContent(slugParam) {
  const supabase = createClient();
  const { data: currentSectionData, error: currentError } = await supabase
    .from("guide_sections")
    .select("title, content") // Solo title y content
    .eq("slug", slugParam)
    .single();

  if (currentError || !currentSectionData) {
     console.error("Error fetching current section content for slug:", slugParam, currentError);
     return null; // Devolver null si no se encuentra o hay error
  }
  return currentSectionData;
}

// --- FIN FUNCIONES ---

// --- generateStaticParams: Le dice a Next.js qué slugs existen en build time ---
export async function generateStaticParams() {
  // Obtener todos los slugs para pre-renderizar las páginas
  console.log("Generating static params for guide slugs..."); // Log para depuración
  const sections = await getAllSectionsMetadata(); // Reutilizar la función

  if (!sections || sections.length === 0) {
    console.warn("No sections found for generateStaticParams.");
    return [];
  }

  // Mapear al formato requerido: [{ slug: '...' }, { slug: '...' }]
  const params = sections.map((section) => ({
    slug: section.slug,
  }));
  console.log("Params generated:", params); // Log para depuración
  return params;
}
// --- FIN generateStaticParams ---


// --- Componente principal de la página ---
export default async function GuiaSectionPage({ params }) {
  const slug = params.slug;

  // Obtener todas las secciones para Sidebar y navegación prev/next
  const allSections = await getAllSectionsMetadata();
  // Obtener el contenido de la sección actual
  const currentSectionContent = await getCurrentSectionContent(slug);

  // Si no se encontró el contenido de la sección actual
  if (!currentSectionContent) {
    notFound();
  }

  // Encontrar índice actual y secciones prev/next
  const currentIndex = allSections.findIndex(sec => sec.slug === slug);
  const prevSection = currentIndex > 0 ? allSections[currentIndex - 1] : null;
  const nextSection = currentIndex < allSections.length - 1 ? allSections[currentIndex + 1] : null;

  // Combinar título (de metadata) con contenido
  const currentSection = {
      ...currentSectionContent, // title, content
      slug: slug // Asegurar que el slug esté presente
  };


  return (
    // Contenedor Flex principal
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
      {/* Sidebar recibe allSections (metadata) */}
      <GuideSidebar sections={allSections} currentSlug={slug} />

      {/* Contenido Principal */}
      <div className="flex-1 min-w-0">
        {/* Contenedor blanco con padding */}
        <div className="page-container">
          <Link
            href="/guia"
            className="inline-block mb-4 text-sm text-primary hover:text-primary-dark hover:underline"
          >
            &larr; Volver al índice
          </Link>

          {/* Título principal */}
          <h1 className="mb-6 font-bold text-gray-900 font-heading">
            {currentSection.title}
          </h1>

          {/* Artículo con estilos prose */}
          <article className="prose prose-sm md:prose-base lg:prose-lg max-w-prose">
            {currentSection.content && (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {currentSection.content}
              </ReactMarkdown>
            )}
          </article>

          {/* Botones de Navegación */}
          <div className="flex flex-col sm:flex-row justify-between mt-10 pt-6 border-t border-gray-200 gap-4 text-sm max-w-prose">
            <div className="text-center sm:text-left">
              {prevSection && (
                <Link href={`/guia/${prevSection.slug}`} className="text-primary hover:text-primary-dark hover:underline block">
                  &larr; {prevSection.title}
                </Link>
              )}
            </div>
            <div className="text-center sm:text-right">
              {nextSection && (
                <Link href={`/guia/${nextSection.slug}`} className="text-primary hover:text-primary-dark hover:underline block">
                  {nextSection.title} &rarr;
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- generateMetadata ---
export async function generateMetadata({ params }) {
  const slug = params.slug;
  // Obtener solo el contenido necesario para el título
  const sectionContent = await getCurrentSectionContent(slug);

  if (!sectionContent) {
    return { title: "Sección no encontrada" };
  }
  return {
    title: `${sectionContent.title} | Fortaleza Digital CR`,
  };
}