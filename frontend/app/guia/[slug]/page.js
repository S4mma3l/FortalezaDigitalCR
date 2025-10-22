// app/guia/[slug]/page.js
import { createClient } from "@/utils/supabase/server";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { notFound } from 'next/navigation';
import GuideSidebar from '@/components/GuideSidebar';

// --- FUNCIONES DE OBTENCIÓN DE DATOS (sin cambios) ---
async function getAllSections() {
    const supabase = createClient();
    const { data: allSections, error: allError } = await supabase
        .from("guide_sections")
        .select("title, slug, order_index")
        .order("order_index", { ascending: true });
    if(allError) {
        console.error("Error fetching all sections:", allError);
        return [];
    }
    return allSections;
}

async function getGuideData(slugParam) {
  const supabase = createClient();
  const allSections = await getAllSections();

  const currentIndex = allSections.findIndex(sec => sec.slug === slugParam);
  if (currentIndex === -1) {
    return { currentSection: null, allSections, prevSection: null, nextSection: null };
  }

  const { data: currentSectionData, error: currentError } = await supabase
    .from("guide_sections")
    .select("title, content")
    .eq("slug", slugParam)
    .single();

  if (currentError || !currentSectionData) {
     console.error("Error fetching current section content:", currentError);
     return { currentSection: null, allSections, prevSection: null, nextSection: null };
  }

  const prevSection = currentIndex > 0 ? allSections[currentIndex - 1] : null;
  const nextSection = currentIndex < allSections.length - 1 ? allSections[currentIndex + 1] : null;

  const currentSection = {
      ...allSections[currentIndex],
      content: currentSectionData.content
  };

  return { currentSection, allSections, prevSection, nextSection };
}
// --- FIN FUNCIONES ---


// Componente principal de la página
export default async function GuiaSectionPage({ params }) {
  const slug = params.slug;
  const { currentSection, allSections, prevSection, nextSection } = await getGuideData(slug);

  if (!currentSection) {
    notFound();
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
      <GuideSidebar sections={allSections} currentSlug={slug} />

      <div className="flex-1 min-w-0">
        <div className="page-container"> {/* Contenedor blanco con padding */}
          <Link
            href="/guia"
            className="inline-block mb-4 text-sm text-primary hover:text-primary-dark hover:underline"
          >
            &larr; Volver al índice
          </Link>

          <h1 className="mb-6 font-bold text-gray-900 font-heading">
            {currentSection.title}
          </h1>

          {/* Aplicar prose con ancho máximo, SIN mx-auto */}
          <article className="prose prose-sm md:prose-base lg:prose-lg max-w-prose">
            {currentSection.content && (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {currentSection.content}
              </ReactMarkdown>
            )}
          </article>

          {/* Botones de Navegación con ancho máximo, SIN mx-auto */}
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

// generateMetadata (sin cambios)
export async function generateMetadata({ params }) {
  const slug = params.slug;
  const { currentSection } = await getGuideData(slug);

  if (!currentSection) {
    return { title: "Sección no encontrada" };
  }
  return {
    title: `${currentSection.title} | Fortaleza Digital CR`,
  };
}