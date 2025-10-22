// This page runs on the server (Server Component)
// --- CAMBIO IMPORTACIÓN ---
import { createClient as createBuildClient } from "@/utils/supabase/build-client";
// --- FIN CAMBIO ---

export const metadata = {
  title: "Directorio de Ayuda | Fortaleza Digital CR",
  description: "Contactos de emergencia y denuncia para ciberseguridad en Costa Rica.",
};

export default async function DirectorioAyudaPage() {
  // --- CAMBIO CLIENTE ---
  const supabase = createBuildClient();
  // --- FIN CAMBIO ---

  // Fetch contacts from Supabase, ordered by entity name
  const { data: contacts, error } = await supabase
    .from("emergency_contacts")
    .select("id, entity_name, contact_type, contact_info, schedule")
    .order("entity_name", { ascending: true });

  if (error) {
    console.error("Error fetching emergency contacts:", error);
  }

  return (
    // Aplicar .page-container
    <div className="page-container">
      <h1 className="mb-6">
        Directorio de Ayuda y Denuncias
      </h1>
      <p className="mb-8 text-lg text-gray-700 max-w-prose">
        Contactos clave en Costa Rica para reportar fraudes electrónicos,
        buscar asistencia o realizar denuncias formales.
      </p>

      {error && (
        <p className="text-red-500">
          Error al cargar los contactos. Por favor, intenta recargar la página.
        </p>
      )}

      {contacts && contacts.length > 0 ? (
        <div className="overflow-x-auto shadow rounded-lg border border-gray-200"> {/* Añadir sombra y borde */}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100"> {/* Fondo cabecera más claro */}
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entidad
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo de Contacto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Información
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horario
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50 transition-colors"> {/* Hover en filas */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {contact.entity_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {contact.contact_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {contact.contact_info}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contact.schedule}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !error && <p className="text-gray-500 italic">No hay contactos disponibles en este momento.</p>
      )}
    </div>
  );
}