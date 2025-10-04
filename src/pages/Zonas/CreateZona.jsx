//Jira
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Asumimos que getZonaById, createZona, y updateZona están disponibles en el servicio.
import {
  createZona,
  updateZona,
  getZonaById,
} from "../../services/ZonasService";

// Definición de la estructura de la Zona
const initialZonaState = {
  nombre: "",
  descripcion: "",
};

const CreateZona = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [zonaForm, setZonaForm] = useState(initialZonaState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Carga de datos para Edición ---
  useEffect(() => {
    // 1. Verificación inicial de sesión para rutas protegidas
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión para acceder a esta página.");
      navigate("/login");
      return;
    }

    // 2. Si estamos en modo edición, cargamos los datos específicos
    if (isEditMode) {
      const fetchZonaData = async () => {
        try {
          setLoading(true);

          // LLAMADA OPTIMIZADA: Usamos el endpoint específico para la zona (getZonaById)
          const zonaToEdit = await getZonaById(id);

          if (zonaToEdit) {
            // Aseguramos que solo guardamos las propiedades que tiene initialZonaState
            const { nombre, descripcion } = zonaToEdit;
            setZonaForm({ nombre, descripcion });
          } else {
            setError("Zona no encontrada o no tienes permisos.");
          }
        } catch (err) {
          // Captura errores del servicio (incluyendo 401/404)
          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Fallo al cargar la zona para editar.";
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      };
      fetchZonaData();
    }
  }, [id, isEditMode, navigate]); // Dependencias: id, isEditMode, y navigate

  // --- Manejo de Inputs (Mantener igual) ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setZonaForm({
      ...zonaForm,
      [name]: value,
    });
  };

  // --- Manejo del Submit (Mantener igual) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validación simple
    if (!zonaForm.nombre.trim()) {
      setError("El nombre de la zona es obligatorio.");
      setLoading(false);
      return;
    }

    try {
      if (isEditMode) {
        // Modo Edición
        await updateZona(id, zonaForm);
        alert(`✅ Zona "${zonaForm.nombre}" actualizada con éxito.`);
      } else {
        // Modo Creación
        await createZona(zonaForm);
        alert(`✅ Zona "${zonaForm.nombre}" creada con éxito.`);
      }

      // Redirigir a la lista de zonas
      navigate("/zonas");
    } catch (err) {
      // El error debe venir del servicio. Lo extraemos.
      // Si el error es 401, aquí se mostrará el "Token inválido" de tu servicio.
      const errorMessage = (
        err.response?.data?.message ||
        err.toString() ||
        "Error desconocido al guardar la zona."
      ).trim();
      setError(errorMessage);
      console.error("Error al guardar/actualizar:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="text-center py-10 text-gray-500">
        Cargando datos de la zona...
      </div>
    );
  }

  // Si hay un error fatal al cargar, no mostrar el formulario
  if (error && isEditMode && !loading) {
    return (
      <div className="text-center py-10 text-red-600 font-bold">
        Error de carga: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8 bg-[var(--background-color)]">
      <div className="w-full max-w-lg">
        {/* Título */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
            {isEditMode ? "Editar Zona" : "Crear Zona"}
          </h2>
          <p className="mt-4 text-lg leading-6 text-[var(--text-secondary)]">
            {isEditMode
              ? `Modifica los detalles de la zona ${zonaForm.nombre}`
              : "Llena el siguiente formulario para crear una nueva zona"}
          </p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 bg-white p-8 shadow-sm sm:rounded-2xl"
        >
          {/* Nombre */}
          <div>
            <label
              className="block text-sm font-medium text-[var(--text-primary)]"
              htmlFor="nombre"
            >
              Nombre
            </label>
            <div className="mt-1">
              <input
                id="nombre"
                name="nombre"
                value={zonaForm.nombre}
                onChange={handleChange}
                placeholder="Ingrese el nombre de la zona"
                type="text"
                required
                className="form-input block w-full rounded-xl border-secondary-100 bg-secondary-50
                                            placeholder:text-[var(--text-secondary)] focus:border-[var(--primary-color)]
                                            focus:ring-[var(--primary-color)] sm:text-sm py-3 px-4"
              />
            </div>
            {error &&
              error.includes("obligatorio") &&
              error.includes("nombre") && (
                <span className="text-red-500 text-sm mt-1 block">
                  El nombre es obligatorio.
                </span>
              )}
          </div>

          {/* Descripción */}
          <div>
            <label
              className="block text-sm font-medium text-[var(--text-primary)]"
              htmlFor="descripcion"
            >
              Descripción
            </label>
            <div className="mt-1">
              <textarea
                id="descripcion"
                name="descripcion"
                value={zonaForm.descripcion || ""}
                onChange={handleChange}
                placeholder="Ingrese una breve descripción"
                rows="4"
                className="form-input block w-full rounded-xl border-secondary-100 bg-secondary-50
                                            placeholder:text-[var(--text-secondary)] focus:border-[var(--primary-color)]
                                            focus:ring-[var(--primary-color)] sm:text-sm py-3 px-4"
              ></textarea>
            </div>
          </div>

          {/* Mensaje de Error General */}
          {error && (
            <div className="text-red-500 font-medium text-sm p-3 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          {/* Botones */}
          <div className="flex flex-col sm:flex-row-reverse gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex w-full justify-center rounded-full border border-transparent 
                                             py-3 px-4 text-sm font-bold text-white shadow-sm transition-colors focus:outline-none 
                                             focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 ${
                                               loading
                                                 ? "bg-gray-400 cursor-not-allowed"
                                                 : "bg-[var(--primary-color)] hover:bg-green-600"
                                             }`}
            >
              {loading
                ? "Guardando..."
                : isEditMode
                ? "Guardar Cambios"
                : "Crear Zona"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/zonas")}
              className="flex w-full justify-center rounded-full border border-secondary-100
                                             bg-gray-100 text-slate-950 py-3 px-4 text-sm font-bold shadow-sm
                                             hover:bg-red-500 hover:text-white transition-colors focus:outline-none
                                             focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateZona;
