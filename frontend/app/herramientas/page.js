"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Componente para el resultado del análisis de IA (Estilos Prose ya definidos en globals.css)
function AnalysisResult({ text }) {
  return (
    // Usar prose para formateo, con fondo gris claro y sombra interna
    <div className="p-4 md:p-6 mt-6 bg-gray-100 rounded-lg shadow-inner prose prose-sm md:prose-base max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
    </div>
  );
}

// Componente para mostrar mensajes de error de forma consistente
function ErrorAlert({ message }) {
  if (!message) return null;
  return (
    <div role="alert" className="mt-6 p-4 text-sm text-red-800 bg-red-100 border border-red-300 rounded-md shadow-sm">
      <strong>Error:</strong> {message}
    </div>
  );
}


export default function HerramientasPage() {
  // --- Estados ---
  const [text, setText] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [errorAI, setErrorAI] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [file, setFile] = useState(null);
  const [loadingClean, setLoadingClean] = useState(false);
  const [errorClean, setErrorClean] = useState("");

  // --- Base URL de la API ---
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // --- Manejadores (Lógica sin cambios, solo manejo de URL) ---
  const handleSubmitAI = async (e) => {
    e.preventDefault();
    setLoadingAI(true);
    setErrorAI("");
    setAnalysis("");
    const formData = new FormData();
    formData.append("texto_usuario", text);
    try {
      const endpoint = "/api/herramientas/analizar-phishing";
      const fullUrl = `${apiUrl.replace(/\/$/, '')}${endpoint}`;
      console.log("Calling Phishing API:", fullUrl);

      const response = await fetch(fullUrl, { method: "POST", body: formData });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: `Error ${response.status}` }));
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

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setErrorClean("");
    } else {
      setFile(null);
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
      const endpoint = "/api/herramientas/limpiar-metadatos";
      const fullUrl = `${apiUrl.replace(/\/$/, '')}${endpoint}`;
      console.log("Calling Metadata API:", fullUrl);

      const response = await fetch(fullUrl, { method: "POST", body: formData });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: `Error del servidor (${response.status})` }));
        throw new Error(errData.error || `No se pudo procesar la imagen (${response.status})`);
       }

      const blob = await response.blob();
      const disposition = response.headers.get('content-disposition');
      let downloadFilename = `limpio_${file.name.replace(/\.[^/.]+$/, "")}.jpg`;
      if (disposition && disposition.indexOf('attachment') !== -1) {
          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = filenameRegex.exec(disposition);
          if (matches != null && matches[1]) {
            downloadFilename = matches[1].replace(/['"]/g, '');
          }
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = 'none'; a.href = url; a.download = downloadFilename;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setFile(null);
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

  // --- JSX CON ESTILOS MEJORADOS ---
  return (
    // Contenedor principal de la página con padding y sombra
    <div className="page-container space-y-16"> {/* Más espacio entre secciones */}
      <h1>Herramientas de Seguridad</h1>

      {/* --- Analizador de Phishing --- */}
      <section>
        {/* Título de sección */}
        <h2 className="pb-2 mb-4 text-2xl font-semibold border-b border-gray-200 text-gray-800"> {/* Texto gris más oscuro */}
          Analizador de Phishing con IA
        </h2>
        <p className="mb-6 text-gray-600 max-w-prose"> {/* Texto gris medio */}
          ¿Recibiste un correo o SMS sospechoso? Pégalo aquí. Nuestra IA
          (Gemini) lo analizará en busca de señales de alerta.
        </p>
        <form onSubmit={handleSubmitAI} className="space-y-4"> {/* Espacio entre textarea y botón */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            // Estilo consistente con form-input, altura ajustada
            className="w-full p-3 h-48 form-input resize-y" // H-48 y resize-y
            placeholder="Pega el texto sospechoso aquí..."
            disabled={loadingAI}
            aria-label="Texto sospechoso a analizar"
          />
          <button
            type="submit"
            className="btn-primary" // Usar clase global
            disabled={loadingAI || !text.trim()} // Deshabilitar si está vacío o solo espacios
          >
            {/* Indicador de carga sutil */}
            {loadingAI ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analizando...
              </span>
            ) : "Analizar Texto"}
          </button>
        </form>
        {/* Usar componente ErrorAlert */}
        <ErrorAlert message={errorAI} />
        {analysis && (
            <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 font-heading mb-2">Resultado del Análisis:</h3>
                <AnalysisResult text={analysis} />
            </div>
        )}
      </section>

      {/* Separador visual más prominente */}
      <hr className="my-12 border-gray-300"/>

      {/* --- Limpiador de Metadatos --- */}
      <section>
        <h2 className="pb-2 mb-4 text-2xl font-semibold border-b border-gray-200 text-gray-800">
          Limpiador de Metadatos (EXIF)
        </h2>
         <p className="mb-3 text-gray-600 max-w-prose">
          (Sección 5 de la guía) Sube una fotografía (JPG, PNG, WEBP, HEIC) para eliminar metadatos ocultos. Los archivos HEIC se convertirán a JPEG.
        </p>
        <p className="mb-6 text-sm text-gray-500 italic max-w-prose">
          Privacidad: Las fotografías cargadas **no se almacenan**. Solo se procesan temporalmente para eliminar los metadatos y se te entregan directamente para su descarga.
        </p>
        <form onSubmit={handleSubmitClean} className="space-y-4">
          <div> {/* Envolver input y label */}
              <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">Selecciona una imagen:</label>
              {/* Input file con estilo más integrado */}
              <input
                id="file-upload"
                type="file"
                accept="image/jpeg, image/png, image/webp, image/heic, image/heif"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
                           file:mr-4 file:py-2 file:px-5 file:rounded-l-lg file:border-0
                           file:text-sm file:font-semibold file:bg-primary-light file:text-primary
                           hover:file:bg-blue-100 transition duration-150 ease-in-out" // Estilo completo y mejorado
                disabled={loadingClean}
              />
          </div>
          <button
            type="submit"
            className="btn-primary" // Usar clase global
            disabled={loadingClean || !file}
          >
            {/* Indicador de carga sutil */}
            {loadingClean ? (
                 <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                </span>
            ) : "Limpiar y Descargar"}
          </button>
        </form>
        {/* Usar componente ErrorAlert */}
        <ErrorAlert message={errorClean} />
      </section>
    </div>
  );
}