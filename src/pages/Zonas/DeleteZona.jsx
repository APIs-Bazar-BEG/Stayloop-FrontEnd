//Jira
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteZona, getZonaById } from "../../services/ZonasService"; // requiere token

// Nombre del componente corregido a DeleteZona
const DeleteZona = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [zona, setZona] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // 1. Cargar la zona al inicio
  useEffect(() => {
    const fetchZona = async () => {
      try {
        const data = await getZonaById(id);
        setZona(data);
        setLoading(false);
      } catch (err) {
        // Es importante manejar el error aquí si la zona no existe o falla la API
        console.error("Error al cargar la zona para eliminación:", err);
        setError(`No se pudo cargar la zona con ID: ${id}.`);
        setLoading(false);
      }
    };
    fetchZona();
  }, [id]);

  // 2. Manejar la eliminación
  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      await deleteZona(id);
      // Redirigir a la lista después de la eliminación exitosa
      navigate("/zonas", {
        state: { successMessage: "Zona eliminada correctamente." },
      });
    } catch (err) {
      setDeleting(false);
      // Asumiendo que el error puede ser una restricción de llave foránea (hoteles asociados)
      const errorMessage =
        err?.response?.data?.message ||
        "Hubo un error al intentar eliminar la zona. Podría tener hoteles asociados.";
      setError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Cargando detalles de la zona...
      </div>
    );
  }

  if (error && !zona) {
    // Muestra el error si no se pudo cargar la zona
    return (
      <div className="text-center py-10 text-red-500 font-bold">{error}</div>
    );
  }

  // Si loading es false y zona es null (por ejemplo, si se eliminó justo antes de cargar), mostramos un mensaje
  if (!zona) {
    return (
      <div className="text-center py-10 text-red-500 font-bold">
        No se encontró la zona para eliminar.
      </div>
    );
  }

  return (
    <div className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        {/* Título */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-red-700 sm:text-4xl">
            Confirmar Eliminación
          </h2>
          <p className="mt-4 text-lg leading-6 text-gray-700">
            Estás a punto de eliminar la siguiente zona. Esta acción es
            irreversible.
          </p>
        </div>

        {/* Contenido de la Zona a Eliminar */}
        <div className="mt-8 space-y-6 bg-white p-8 shadow-lg sm:rounded-2xl border-2 border-red-300">
          <h3 className="text-xl font-bold text-gray-900">
            Zona: {zona?.nombre || "Zona Desconocida"}
          </h3>
          <p className="text-gray-600">
            ID:{" "}
            <span className="font-mono bg-gray-100 p-1 rounded text-sm">
              {id}
            </span>
          </p>
          <p className="text-gray-600">
            Descripción: {zona?.descripcion || "No proporcionada"}
          </p>

          {/* Mensaje de Error (si ocurre en la eliminación) */}
          {error && (
            <div className="p-3 my-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          {/* Botones de Confirmación/Cancelación */}
          <div className="flex flex-col sm:flex-row-reverse gap-4 pt-4">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className={`flex w-full justify-center rounded-full border border-transparent
                                        ${
                                          deleting
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-red-600 hover:bg-red-700"
                                        } py-3 px-4 text-sm font-bold text-white
                                        shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
            >
              {deleting ? "Eliminando..." : "Sí, Eliminar Permanentemente"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/zonas")}
              className="flex w-full justify-center rounded-full border border-gray-300
                                        bg-gray-100 text-slate-950 py-3 px-4 text-sm font-bold shadow-sm
                                        hover:bg-gray-200 transition-colors focus:outline-none
                                        focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Exportación corregida
export default DeleteZona;
