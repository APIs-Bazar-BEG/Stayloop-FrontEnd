// src/pages/Gestion/UserEdit.jsx

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getUserById, updateUser } from "../../services/AdminService";
import { UserCircleIcon } from "@heroicons/react/24/outline";

// --- CONSTANTES DE DISEÑO ---
const VAR_PRIMARY_COLOR = "bg-blue-600";
const VAR_TEXT_PRIMARY = "text-gray-900";
const VAR_TEXT_SECONDARY = "text-gray-500";
const VAR_BG_INPUT = "bg-gray-100";
const VAR_BORDER_COLOR = "border-gray-300";
const VAR_BRAND_COLOR = "text-blue-600";

// --- Mapeo de Roles LOCAL ---
const ROLES = [
  { id: 1, nombre: "Administrador" },
  { id: 2, nombre: "Cliente" },
  { id: 3, nombre: "Hotel" },
];

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Nota: El estado 'password' se sigue cargando y enviando, aunque el campo de input se ha eliminado.
  const [user, setUser] = useState({
    nombre: "",
    email: "",
    idRol: "",
    password: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lógica para cargar el usuario a editar
  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const userData = await getUserById(id);

      const userRoleId = String(userData.idRol || "");

      setUser({
        nombre: userData.nombre || "",
        email: userData.email || "",
        idRol: userRoleId,
        // CLAVE: Cargamos el hash de la contraseña existente para enviarlo
        // en la actualización y evitar que la API pida uno nuevo o lo borre.
        password: userData.password || "",
      });

      if (userData.imgUsuario) {
        setCurrentImageUrl(`/users/imagen/${id}`);
      } else {
        setCurrentImageUrl(null);
      }
    } catch (err) {
      console.error("Error al cargar usuario:", err);
      setError(err.message || "No se pudo cargar el formulario de edición.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Manejo de Cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Manejo de Cambio de Archivo (Foto de Perfil)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setCurrentImageUrl(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      fetchUser();
    }
  };

  // Manejo del Envío del Formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!user.idRol || user.idRol === "") {
      setError("Debe seleccionar un Rol de usuario.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();

    formData.append("id", id);
    formData.append("nombre", user.nombre);
    formData.append("email", user.email);
    formData.append("idRol", String(user.idRol));
    // CLAVE: Enviamos la contraseña que cargamos (el hash anterior).
    formData.append("password", user.password);

    if (imageFile) {
      formData.append("imgUsuario", imageFile);
    }

    try {
      await updateUser(id, formData);
      alert("Usuario actualizado exitosamente!");
      navigate("/gestion/usuarios");
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
      setError(
        "Error al guardar cambios: " +
          (err.response?.data?.message ||
            err.message ||
            "Por favor, intente de nuevo.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Renderizado ---

  if (loading) {
    return (
      <div className="flex flex-1 justify-center py-10">
        <p className="text-lg">Cargando datos del usuario...</p>
      </div>
    );
  }

  // Si hay un error de carga y no hay datos de usuario, mostramos el error y el botón de regreso
  if (error && !user.nombre) {
    // ... (JSX del error)
  }

  return (
    <div className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        <div className="text-center">
          <h2
            className={`text-3xl font-bold tracking-tight ${VAR_TEXT_PRIMARY} sm:text-4xl`}
          >
            Editar Usuario
          </h2>
          <p className={`mt-4 text-lg leading-6 ${VAR_TEXT_SECONDARY}`}>
            Cambia los datos del usuario
          </p>
        </div>

        {error && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            ❌ {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 bg-white p-8 shadow-sm sm:rounded-2xl"
        >
          {/* Nombre */}
          <div>
            <label
              className={`block text-sm font-medium ${VAR_TEXT_PRIMARY}`}
              htmlFor="nombre"
            >
              Nombre Completo
            </label>
            <div className="mt-1">
              <input
                name="nombre"
                value={user.nombre}
                onChange={handleChange}
                className={`block w-full rounded-xl ${VAR_BORDER_COLOR} ${VAR_BG_INPUT} placeholder:${VAR_TEXT_SECONDARY} focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4`}
                id="nombre"
                required
                type="text"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              className={`block text-sm font-medium ${VAR_TEXT_PRIMARY}`}
              htmlFor="email"
            >
              Email
            </label>
            <div className="mt-1">
              <input
                name="email"
                value={user.email}
                onChange={handleChange}
                className={`block w-full rounded-xl ${VAR_BORDER_COLOR} ${VAR_BG_INPUT} placeholder:${VAR_TEXT_SECONDARY} focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4`}
                id="email"
                required
                type="email"
              />
            </div>
          </div>

          {/* El campo de Contraseña HA SIDO ELIMINADO de aquí. */}
          {/* Si necesitas cambiar la contraseña, deberías tener un formulario separado. */}

          {/* Foto de Perfil */}
          <div>
            <label
              className={`block text-sm font-medium ${VAR_TEXT_PRIMARY}`}
              htmlFor="imgUsuario"
            >
              Imagen de Perfil
            </label>
            <div className="mt-1 flex items-center gap-4">
              <span className="inline-block h-16 w-16 overflow-hidden rounded-full bg-gray-300">
                {currentImageUrl ? (
                  <img
                    src={currentImageUrl}
                    alt="Vista previa de la imagen"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder.svg";
                    }}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="h-full w-full text-gray-400" />
                )}
              </span>
              <div className="flex-1">
                <label
                  htmlFor="imgUsuario"
                  className={`group relative cursor-pointer rounded-md border border-dashed border-gray-300 bg-gray-100 px-3 py-2 text-sm font-medium ${VAR_TEXT_SECONDARY} hover:border-blue-600 ${VAR_BRAND_COLOR}`}
                >
                  <span>Subir Imagen</span>
                  <input
                    name="imgUsuario"
                    onChange={handleImageChange}
                    className="sr-only"
                    id="imgUsuario"
                    type="file"
                    accept="image/*"
                  />
                </label>
                <p className={`mt-1 text-xs ${VAR_TEXT_SECONDARY}`}>
                  Tamaño Máximo: 2MiB
                </p>
              </div>
            </div>
          </div>

          {/* Rol */}
          <div>
            <label
              className={`block text-sm font-medium ${VAR_TEXT_PRIMARY}`}
              htmlFor="idRol"
            >
              Rol de Usuario
            </label>
            <div className="mt-1">
              <select
                name="idRol"
                value={user.idRol}
                onChange={handleChange}
                className={`block w-full rounded-xl ${VAR_BORDER_COLOR} ${VAR_BG_INPUT} ${VAR_TEXT_SECONDARY} focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 appearance-none`}
                id="idRol"
                required
              >
                <option value="" disabled>
                  Selecciona Rol
                </option>
                {ROLES.map((rol) => (
                  <option key={rol.id} value={rol.id}>
                    {rol.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row-reverse gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex w-full justify-center rounded-full border border-transparent ${VAR_PRIMARY_COLOR} py-3 px-4 text-sm font-bold text-white shadow-sm hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50`}
            >
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </button>
            <Link
              to="/gestion/usuarios"
              className={`flex w-full justify-center rounded-full border ${VAR_BORDER_COLOR} bg-gray-100 text-slate-950 py-3 px-4 text-sm font-bold shadow-sm hover:bg-red-500 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEdit;
