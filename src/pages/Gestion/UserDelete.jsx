// src/pages/Gestion/UserDelete.jsx

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
// Asegúrate de que deleteUser y getUserById están exportadas en AdminService.js
import { getUserById, deleteUser } from "../../services/AdminService";
import { UserCircleIcon } from "@heroicons/react/24/outline";

// --- CONSTANTES DE DISEÑO ---
const VAR_TEXT_PRIMARY = "text-gray-900";
const VAR_TEXT_SECONDARY = "text-gray-500";
const VAR_BG_INPUT = "bg-gray-100";
const VAR_BORDER_COLOR = "border-gray-300";
const VAR_DELETE_COLOR = "bg-red-600";
// -------------------------------------------------------------------

// Mapeo de Roles (Necesario para mostrar el nombre del rol)
const ROLES_MAP = {
  1: "Administrador",
  2: "Cliente",
  3: "Hotel",
  // Asegúrate de que el rol "admin" que se ve en la imagen también tenga su ID aquí si es necesario
};

const UserDelete = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);

  // Lógica para cargar el usuario
  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const userData = await getUserById(id);
      setUser(userData);

      // Si el campo de la imagen existe, cargamos la URL
      if (userData.imgUsuario) {
        setCurrentImageUrl(`/users/imagen/${id}`);
      } else {
        setCurrentImageUrl(null);
      }
    } catch (err) {
      console.error("Error al cargar usuario para eliminar:", err);
      setError(
        err.message || "No se pudo cargar el usuario para la confirmación."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Función de Eliminación
  const handleDelete = async () => {
    if (!user || isDeleting) return;

    // Se usa la función nativa de JS para una confirmación rápida
    const isConfirmed = window.confirm(
      `¿Estás SEGURO de eliminar al usuario ${user.nombre} (${user.email})? Esta acción es irreversible.`
    );

    if (!isConfirmed) return;

    setIsDeleting(true);
    setError(null);

    try {
      await deleteUser(id);
      alert("Usuario eliminado exitosamente.");
      navigate("/gestion/usuarios"); // Redirigir a la lista de usuarios
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      setError(
        "Error al eliminar: " +
          (err.response?.data?.message ||
            err.message ||
            "Por favor, intente de nuevo.")
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // --- Renderizado de Carga/Error ---

  if (loading) {
    return (
      <div className="flex flex-1 justify-center py-10">
        <p className="text-lg">Cargando datos del usuario...</p>
      </div>
    );
  }

  if (error || !user) {
    // Usa el diseño de error que se ve en una de tus imágenes
    return (
      <div className="flex flex-1 justify-center py-10 px-4">
        <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg text-center">
          <p className="text-red-600 font-bold mb-4 text-xl">
            ❌ Error al cargar:
          </p>
          <p className="text-gray-700">{error || "Usuario no encontrado."}</p>
          <Link
            to="/gestion/usuarios"
            className="mt-6 inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Volver a la lista
          </Link>
        </div>
      </div>
    );
  }

  // Obtenemos el nombre del rol usando el idRol que viene del backend
  const rolName = ROLES_MAP[user.idRol] || "Usuario"; // 'Usuario' es un buen default si no se encuentra el ID

  return (
    <div className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        <div className="text-center">
          <h2
            className={`text-3xl font-bold tracking-tight text-red-700 sm:text-4xl`}
          >
            Eliminar Usuario
          </h2>
          <p className={`mt-4 text-lg leading-6 ${VAR_TEXT_SECONDARY}`}>
            Confirma la eliminación del usuario **{user.nombre}**.
          </p>
        </div>

        <div className="mt-8 space-y-6 bg-white p-8 shadow-sm sm:rounded-2xl">
          {error && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
              ❌ {error}
            </div>
          )}

          {/* Campos de Solo Lectura */}
          <div className="space-y-4">
            {/* Nombre */}
            <div>
              <label
                className={`block text-sm font-medium ${VAR_TEXT_PRIMARY}`}
              >
                Nombre
              </label>
              <div className="mt-1">
                <input
                  value={user.nombre}
                  readOnly
                  className={`block w-full rounded-xl border ${VAR_BORDER_COLOR} ${VAR_BG_INPUT} text-sm py-3 px-4 opacity-75`}
                  type="text"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                className={`block text-sm font-medium ${VAR_TEXT_PRIMARY}`}
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  value={user.email}
                  readOnly
                  className={`block w-full rounded-xl border ${VAR_BORDER_COLOR} ${VAR_BG_INPUT} text-sm py-3 px-4 opacity-75`}
                  type="email"
                />
              </div>
            </div>

            {/* Rol */}
            <div>
              <label
                className={`block text-sm font-medium ${VAR_TEXT_PRIMARY}`}
              >
                Rol
              </label>
              <div className="mt-1">
                <input
                  value={rolName}
                  readOnly
                  className={`block w-full rounded-xl border ${VAR_BORDER_COLOR} ${VAR_BG_INPUT} text-sm py-3 px-4 opacity-75`}
                  type="text"
                />
              </div>
            </div>
          </div>

          {/* Mensaje de Advertencia */}
          <div className="pt-4">
            <p className="text-sm font-bold text-red-600 p-3 bg-red-50 rounded-lg border border-red-300 text-center">
              ⚠️ Esta acción es **permanente**.
            </p>
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row-reverse gap-4 pt-4">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className={`flex w-full justify-center rounded-full border border-transparent ${VAR_DELETE_COLOR} py-3 px-4 text-sm font-bold text-white shadow-sm hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50`}
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </button>
            <Link
              to="/gestion/usuarios"
              className={`flex w-full justify-center rounded-full border ${VAR_BORDER_COLOR} bg-gray-100 text-slate-950 py-3 px-4 text-sm font-bold shadow-sm hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              Regresar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDelete;
