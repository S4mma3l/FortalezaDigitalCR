"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Componente para el resultado del análisis de IA
function AnalysisResult({ text }) {
  // Aplicar estilos prose definidos en globals.css
  return (
    <div className="p-4 mt-6 bg-gray-100 rounded-lg shadow-inner prose prose-sm md:prose-base max-w-none"> {/* Fondo gris claro interno */}
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
    </div>
  );
}

export default function HerramientasPage() {
  // --- Estados para el Analizador de Phishing ---
  const [text, setText] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [errorAI, setErrorAI] = useState("");
  const [analysis, setAnalysis] = useState("");

  // --- Estados para el Limpiador de Metadatos ---
  const [file, setFile] = useState(null);
  const [loadingClean, setLoadingClean] = useState(false);
  const [errorClean, setErrorClean] = useState("");

  // --- Manejador para el Analizador de Phishing ---
  const handleSubmitAI = async (e) => {
    e.preventDefault();
    setLoadingAI(true);
    setErrorAI("");
    setAnalysis("");
    const formData = new FormData();
    formData.append("texto_usuario", text);
    try {
      // Usar variable de entorno o fallback para la URL de la API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/herramientas/analizar-phishing`, { method: "POST", body: formData });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: `Error ${response.status}` })); // Catch non-json errors too
        throw new Error(errData.error || `Error del servidor (${response.status})`);
      }
      const data = await response.json();
      setAnalysis(data.analisis_ia);
    } catch (err) {
      console.error("Error en el análisis:", err);
      setErrorAI(err.message);
    } finally {
      setLoadingAI(false);
    }
  };

  // --- Manejador para el Limpiador de Metadatos ---
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) { // Añadir chequeo de e.target.files
      setFile(e.target.files[0]);
      setErrorClean("");
    } else {
      setFile(null); // Limpiar si no se selecciona archivo
    }
  };

  const handleSubmitClean = async (e) => {
    e.preventDefault();
    if (!file) { setErrorClean("Por favor, selecciona un archivo de imagen."); return; }
    setLoadingClean(true);
    setErrorClean("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      // Usar variable de entorno o fallback para la URL de la API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/herramientas/limpiar-metadatos`, { method: "POST", body: formData });

      // Manejar errores JSON y no JSON
      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: `Error del servidor (${response.status})` }));
        throw new Error(errData.error || `No se pudo procesar la imagen (${response.status})`);
       }

      // Procesar archivo descargado
      const blob = await response.blob();
      const disposition = response.headers.get('content-disposition');
      let downloadFilename = `limpio_${file.name.replace(/\.[^/.]+$/, "")}.jpg`; // Fallback sensible
      if (disposition && disposition.indexOf('attachment') !== -1) {
          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = filenameRegex.exec(disposition);
          if (matches != null && matches[1]) {
            downloadFilename = matches[1].replace(/['"]/g, '');
          }
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = 'none'; // Ocultar el enlace
      a.href = url;
      a.download = downloadFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a); // Limpiar DOM
      URL.revokeObjectURL(url); // Liberar memoria

      setFile(null); // Resetear estado del archivo
      // Resetear el valor del input file
      if (e.target instanceof HTMLFormElement) {
         const fileInput = e.target.querySelector('input[type="file"]');
         if(fileInput instanceof HTMLInputElement) fileInput.value = '';
      }

    } catch (err) {
      console.error("Error limpiando metadatos:", err);
      setErrorClean(err.message);
    } finally {
      setLoadingClean(false);
    }
  };


  return (
    // Aplicar .page-container y espacio entre secciones
    <div className="page-container space-y-12">
      <h1>Herramientas de Seguridad</h1>

      {/* --- Analizador de Phishing --- */}
      <section>
        {/* Título usa font-heading (definido en globals.css) */}
        <h2 className="pb-2 mb-4 text-2xl border-b border-gray-200"> {/* Tamaño ajustado */}
          Analizador de Phishing con IA
        </h2>
        <p className="mb-6 text-gray-700 max-w-prose"> {/* Párrafo con ancho limitado */}
          ¿Recibiste un correo o SMS sospechoso? Pégalo aquí. Nuestra IA
          (Gemini) lo analizará en busca de señales de alerta.
        </p>
        <form onSubmit={handleSubmitAI}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm h-60 form-input mb-4"
            placeholder="Pega el texto sospechoso aquí..."
            disabled={loadingAI}
            aria-label="Texto sospechoso a analizar"
          />
          <button
            type="submit"
            className="btn-primary" // Usar clase global
            disabled={loadingAI || !text}
          >
            {loadingAI ? "Analizando..." : "Analizar Texto"}
          </button>
        </form>
        {/* Resultado y Errores con estilo mejorado */}
        {errorAI && <div role="alert" className="mt-6 p-4 text-sm text-red-800 bg-red-100 border border-red-300 rounded-md shadow-sm"><strong>Error:</strong> {errorAI}</div>}
        {analysis && (
            <div className="mt-8"> {/* Más espacio antes del resultado */}
                <h3 className="text-lg font-semibold text-gray-900 font-heading mb-2">Resultado del Análisis:</h3>
                <AnalysisResult text={analysis} />
            </div>
        )}
      </section>

      {/* Separador visual */}
      <hr className="my-12"/>

      {/* --- Limpiador de Metadatos --- */}
      <section>
        <h2 className="pb-2 mb-4 text-2xl border-b border-gray-200"> {/* Tamaño ajustado */}
          Limpiador de Metadatos (EXIF)
        </h2>
         <p className="mb-3 text-gray-700 max-w-prose">
          (Sección 5 de la guía) Sube una fotografía (JPG, PNG, WEBP, HEIC) para eliminar metadatos ocultos. Los archivos HEIC se convertirán a JPEG.
        </p>
        <p className="mb-6 text-sm text-gray-500 italic max-w-prose">
          Privacidad: Las fotografías cargadas **no se almacenan**. Solo se procesan temporalmente para eliminar los metadatos y se te entregan directamente para su descarga.
        </p>
        <form onSubmit={handleSubmitClean} className="space-y-4">
          {/* Input file con estilo mejorado */}
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">Selecciona una imagen:</label>
          <input
            id="file-upload"
            type="file"
            accept="image/jpeg, image/png, image/webp, image/heic, image/heif"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-brand file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-blue-light file:text-blue-brand hover:file:bg-blue-200 transition duration-150 ease-in-out" // Estilo completo
            disabled={loadingClean}
          />
          <button
            type="submit"
            className="btn-primary" // Usar clase global
            disabled={loadingClean || !file}
          >
            {loadingClean ? "Procesando..." : "Limpiar y Descargar"}
          </button>
        </form>
        {/* Error con estilo mejorado */}
        {errorClean && <div role="alert" className="mt-6 p-4 text-sm text-red-800 bg-red-100 border border-red-300 rounded-md shadow-sm"><strong>Error:</strong> {errorClean}</div>}
      </section>
    </div>
  );
}