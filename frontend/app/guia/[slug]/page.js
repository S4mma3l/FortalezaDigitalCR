// app/guia/[slug]/page.js
import { createClient as createServerClient } from "@/utils/supabase/server"; // Renamed import for clarity
import { createBuildClient } from "@/utils/supabase/build-client"; // <-- Import Build Client
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { notFound } from 'next/navigation';
import GuideSidebar from '@/components/GuideSidebar';

// --- FUNCIONES DE OBTENCIÓN DE DATOS ---

// Función para obtener todos los slugs y títulos ordenados (para Sidebar, Nav)
// USES SERVER CLIENT (runs within request scope)
async function getAllSectionsMetadata() {
    const supabase = createServerClient(); // Regular server client
    const { data: allSections, error: allError } = await supabase
        .from("guide_sections")
        .select("title, slug, order_index")
        .order("order_index", { ascending: true });
    if(allError) {
        console.error("Error fetching all sections metadata:", allError);
        return [];
    }
    return allSections;
}

// Función para obtener el contenido de UNA sección específica por slug
// USES SERVER CLIENT (runs within request scope)
async function getCurrentSectionContent(slugParam) {
  const supabase = createServerClient(); // Regular server client
  const { data: currentSectionData, error: currentError } = await supabase
    .from("guide_sections")
    .select("title, content")
    .eq("slug", slugParam)
    .single();

  if (currentError || !currentSectionData) {
     console.error("Error fetching current section content for slug:", slugParam, currentError);
     return null;
  }
  return currentSectionData;
}

// --- FIN FUNCIONES ---

// --- generateStaticParams: USES BUILD CLIENT ---
export async function generateStaticParams() {
  // Use the build-specific client that DOES NOT call cookies()
  const supabaseBuild = createBuildClient();
  console.log("Generating static params using build client...");

  const { data: sections, error } = await supabaseBuild // <-- Use build client
    .from("guide_sections")
    .select('slug');

  if (error || !sections) {
    console.error("Error fetching slugs for generateStaticParams:", error);
    return [];
  }

  const params = sections.map((section) => ({
    slug: section.slug,
  }));
  console.log("Params generated:", params.length);
  return params;
}
// --- FIN generateStaticParams ---


// --- Componente principal de la página ---
// USES SERVER CLIENT (runs within request scope)
export default async function GuiaSectionPage({ params }) {
  const slug = params.slug;

  // Fetch data needed for the page using the standard server client
  const allSections = await getAllSectionsMetadata();
  const currentSectionContent = await getCurrentSectionContent(slug);

  if (!currentSectionContent) {
    notFound();
  }

  // Find prev/next using the metadata fetched
  const currentIndex = allSections.findIndex(sec => sec.slug === slug);
  const prevSection = currentIndex > 0 ? allSections[currentIndex - 1] : null;
  const nextSection = currentIndex < allSections.length - 1 ? allSections[currentIndex + 1] : null;

  const currentSection = {
      ...currentSectionContent,
      slug: slug
  };

  return (
    // ... (JSX sin cambios, sigue usando currentSection, allSections, prevSection, nextSection) ...
     <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
      <GuideSidebar sections={allSections} currentSlug={slug} />
      <div className="flex-1 min-w-0">
        <div className="page-container">
          <Link
            href="/guia"
            className="inline-block mb-4 text-sm text-primary hover:text-primary-dark hover:underline"
          >
            &larr; Volver al índice
          </Link>
          <h1 className="mb-6 font-bold text-gray-900 font-heading">
            {currentSection.title}
          </h1>
          <article className="prose prose-sm md:prose-base lg:prose-lg max-w-prose">
            {currentSection.content && (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {currentSection.content}
              </ReactMarkdown>
            )}
          </article>
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
// USES SERVER CLIENT (runs within request scope during generation)
export async function generateMetadata({ params }) {
  const slug = params.slug;
  const sectionContent = await getCurrentSectionContent(slug); // Uses standard server client

  if (!sectionContent) {
    return { title: "Sección no encontrada" };
  }
  return {
    title: `${sectionContent.title} | Fortaleza Digital CR`,
  };
}