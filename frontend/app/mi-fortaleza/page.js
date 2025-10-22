"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client"; // CLIENTE NORMAL
import { useRouter } from "next/navigation";

// --- Modal de Confirmación de Eliminación ---
function DeleteConfirmModal({ onConfirm, onCancel }) {
  return (
    // Fondo oscuro semi-transparente
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 animate-fadeIn"> {/* Añadir animación */}
      {/* Contenedor del modal */}
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all scale-100 opacity-100"> {/* Animación de escala */}
        <h2 className="text-xl font-heading font-semibold text-red-700 mb-4">
          Confirmar Eliminación de Cuenta
        </h2>
        <p className="text-gray-700 mb-6 text-sm"> {/* Texto más pequeño */}
          ¿Estás seguro de que deseas eliminar tu cuenta permanentemente? Esta acción **no se puede deshacer**. Se eliminará tu progreso guardado en "Mi Fortaleza".
        </p>
        <div className="flex justify-end space-x-3 mt-8"> {/* Más espacio arriba */}
          {/* Botones usan clases globales btn-* y tamaño ajustado */}
          <button onClick={onCancel} className="btn-secondary !py-2 !px-4 !text-xs">
            Cancelar
          </button>
          <button onClick={onConfirm} className="btn-danger !py-2 !px-4 !text-xs">
            Sí, Eliminar Mi Cuenta
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Componente Principal de Mi Fortaleza ---
export default function MiFortalezaPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Carga inicial de datos
  const [isDeleting, setIsDeleting] = useState(false); // Estado específico para el proceso de eliminación
  const [checklist, setChecklist] = useState({});
  const [userStatus, setUserStatus] = useState(new Map());
  const [message, setMessage] = useState(""); // Mensajes generales (ej. error al guardar checklist)
  const [deleteError, setDeleteError] = useState(""); // Mensajes de error específicos de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Control del modal
  const supabase = createClient();
  const router = useRouter();

  // --- fetchData (Sin cambios) ---
  const fetchData = useCallback(
    async (currentUser) => {
      if (!currentUser) return;
      try {
           const { data: itemsData, error: itemsError } = await supabase.from("checklist_items").select("id, task_description, category");
           if (itemsError) throw itemsError;
           const { data: statusData, error: statusError } = await supabase.from("user_checklist_status").select("item_id, is_complete").eq("user_id", currentUser.id);
           if (statusError) throw statusError;

           const statusMap = new Map(statusData.map((item) => [item.item_id, item.is_complete]));
           const groupedChecklist = itemsData.reduce((acc, item) => {
                const category = item.category || "General";
                if (!acc[category]) acc[category] = [];
                acc[category].push(item);
                return acc;
           }, {});
           setChecklist(groupedChecklist);
           setUserStatus(statusMap);
           setMessage(""); // Limpiar mensajes viejos al cargar datos
      } catch (error) {
           console.error("Error fetching data:", error);
           setMessage("Error al cargar los datos del checklist.");
      }
    },
    [supabase]
  );

  // --- useEffect para verificar usuario y cargar datos (Sin cambios) ---
  useEffect(() => {
    const checkUserAndFetchData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        await fetchData(user);
      } else {
        router.push("/login");
      }
      setLoading(false);
    };
    checkUserAndFetchData();
  }, [supabase, router, fetchData]);


  // --- handleToggle (Sin cambios en lógica principal) ---
  const handleToggle = async (itemId, currentState) => {
    if (!user) return;
    const newState = !currentState;
    const newStatusMap = new Map(userStatus);
    newStatusMap.set(itemId, newState);
    setUserStatus(newStatusMap);
    setMessage("");

    const { error } = await supabase.from("user_checklist_status").upsert(
      { user_id: user.id, item_id: itemId, is_complete: newState },
      { onConflict: "user_id, item_id" }
    );
    if (error) {
      console.error("Error saving progress:", error);
      setMessage("Error al guardar. Intenta de nuevo.");
      newStatusMap.set(itemId, currentState);
      setUserStatus(newStatusMap);
    }
  };


  // --- Lógica para Eliminar Cuenta (con apiUrl definida fuera del try) ---
  const handleDeleteAccount = async () => {
    setDeleteError("");
    setShowDeleteModal(false);
    setIsDeleting(true);

    // --- CORRECCIÓN: Definir apiUrl aquí ---
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    // --- FIN CORRECCIÓN ---

    try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
            throw new Error("No se pudo obtener la sesión actual. Intenta iniciar sesión de nuevo.");
        }
        const token = session.access_token;

        // Construir URL y loggear
        const deleteUrl = `${apiUrl}/api/user/delete`; // Usar apiUrl definida arriba
        console.log("Intentando llamar a DELETE:", deleteUrl);

        const response = await fetch(deleteUrl, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        let result = {};
        try {
            result = await response.json();
        } catch (jsonError) {
            if (!response.ok) {
                 throw new Error(`Error del servidor (${response.status}) al eliminar la cuenta.`);
            }
            console.warn("La respuesta de eliminación no fue JSON:", response.status);
        }

        if (!response.ok) {
            throw new Error(result.detail || `Error (${response.status}) al eliminar la cuenta.`);
        }

        console.log("Cuenta eliminada exitosamente desde el backend:", result.message);
        await supabase.auth.signOut();
        router.replace('/login?message=Cuenta%20eliminada%20exitosamente');

    } catch (error) {
        console.error("Error en handleDeleteAccount:", error);
        // Mensaje específico para NetworkError (ahora puede usar apiUrl)
        if (error instanceof TypeError && (error.message.includes('NetworkError') || error.message.includes('Failed to fetch'))) { // Added 'Failed to fetch' for broader compatibility
             setDeleteError(`Error de red: No se pudo conectar al servidor (${apiUrl}). ¿Está activo y CORS configurado correctamente?`);
        } else {
             setDeleteError(`Error al eliminar cuenta: ${error.message}`);
        }
        setIsDeleting(false);
    }
  };
  // --- FIN Lógica para Eliminar Cuenta ---


  // --- RENDERIZADO ---
  if (loading && !user) {
    return (
      <div className="p-8 text-center bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold">Cargando...</h2>
      </div>
    );
  }
  if (!user && !loading) {
     return null;
  }

  return (
    <>
      <div className="p-8 bg-white rounded-lg shadow-md">
        {/* Bienvenida */}
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-blue-700">Mi Fortaleza Digital</h1>
            <p className="text-sm text-gray-600">
                ¡Hola, <span className="font-semibold">{user?.email}</span>!
            </p>
        </div>

        {message && <p className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">{message}</p>}

        {/* --- Checklist --- */}
        <h2 className="text-xl font-heading mb-4">Checklist de Ciberhigiene</h2>
        {Object.keys(checklist).length > 0 ? (
            <div className="space-y-6">
                {Object.keys(checklist).sort().map((category) => (
                    <div key={category}>
                        <h3 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-3 text-brand-darkblue">{category}</h3>
                        <ul className="space-y-3">
                        {checklist[category].map((item) => {
                            const isComplete = userStatus.get(item.id) || false;
                            return (
                            <li key={item.id} className="flex items-center">
                                <input
                                type="checkbox"
                                id={item.id}
                                checked={isComplete}
                                onChange={() => handleToggle(item.id, isComplete)}
                                className="w-4 h-4 text-brand-blue border-gray-300 rounded focus:ring-brand-blue"
                                />
                                <label
                                htmlFor={item.id}
                                className={`ml-3 text-sm text-gray-700 ${isComplete ? 'line-through text-gray-500' : ''}`}
                                >
                                {item.task_description}
                                </label>
                            </li>
                            );
                        })}
                        </ul>
                    </div>
                ))}
            </div>
        ) : (
             !loading && <p className="text-gray-500 italic">No se pudo cargar el checklist.</p>
        )}


        {/* --- Sección: Eliminar Cuenta --- */}
        <div className="mt-12 pt-6 border-t border-red-300 bg-red-50 p-4 rounded-md">
            <h2 className="text-lg font-semibold text-red-700 font-heading mb-3">Zona de Peligro</h2>
            <p className="text-sm text-gray-700 mb-4">
                Si eliminas tu cuenta, perderás permanentemente tu progreso guardado. Esta acción no se puede deshacer.
            </p>
            {deleteError && <p className="mb-4 text-sm text-red-600 font-medium">{deleteError}</p>}
            <button
                onClick={() => setShowDeleteModal(true)}
                className="btn-danger !text-xs"
                disabled={isDeleting}
            >
                {isDeleting ? 'Eliminando...' : 'Eliminar Mi Cuenta Permanentemente'}
            </button>
        </div>
      </div>

      {/* --- Renderizar Modal de Confirmación --- */}
      {showDeleteModal && (
        <DeleteConfirmModal
            onConfirm={handleDeleteAccount}
            onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
}