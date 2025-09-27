// src/pages/Gestion/UserCreate.jsx

import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUser } from "../../services/AdminService";
import { UserCircleIcon } from "@heroicons/react/24/outline"; // Usamos un icono más simple para el diseño

// --- CONSTANTES DE DISEÑO ---
const VAR_PRIMARY_COLOR = "bg-blue-600";
const VAR_BRAND_COLOR = "text-blue-600";
const VAR_TEXT_PRIMARY = "text-gray-900";
const VAR_TEXT_SECONDARY = "text-gray-500";
const VAR_SECONDARY_50 = "bg-gray-50";
const VAR_SECONDARY_100 = "border-gray-200";

// --- Mapeo de Roles Corregido ---
// Los IDs coinciden con los del backend: 1=Admin, 2=Cliente, 3=Hotel
const ROLES = [
  { id: 1, nombre: "Administrador" },
  { id: 2, nombre: "Cliente" },
  { id: 3, nombre: "Hotel" }, // Corregido el nombre a 'Hotel'
];
// ------------------------------

const UserCreate = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    idRol: "", // Inicializado a '' para que "Selecciona Rol" sea el valor por defecto
  });

  const [imgUsuarioFile, setImgUsuarioFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgUsuarioFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setImgUsuarioFile(null);
      setImagePreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validar que se haya seleccionado un rol válido antes de continuar
    if (!formData.idRol || formData.idRol === "") {
      setError("Debe seleccionar un Rol de usuario.");
      setLoading(false);
      return;
    }

    const dataToSend = new FormData();
    dataToSend.append("nombre", formData.nombre);
    dataToSend.append("email", formData.email);
    dataToSend.append("password", formData.password);

    // 🚨 CLAVE: Aseguramos que se envía el ID correcto como STRING
    dataToSend.append("idRol", String(formData.idRol));

    if (imgUsuarioFile) {
      dataToSend.append("imgUsuario", imgUsuarioFile);
    }

    try {
      await createUser(dataToSend);
      setLoading(false);
      navigate("/gestion/usuarios");
    } catch (err) {
      setLoading(false);
      const backendErrorMsg =
        err.response?.data?.message ||
        err.message ||
        "Error desconocido al crear usuario.";
      setError(backendErrorMsg);
    }
  };

  return (
    <div className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        <div className="text-center">
          <h2
            className={`text-3xl font-bold tracking-tight ${VAR_TEXT_PRIMARY} sm:text-4xl`}
          >
            Crear Usuario
          </h2>
          <p className={`mt-4 text-lg leading-6 ${VAR_TEXT_SECONDARY}`}>
            Llena el siguiente formulario para crear un nuevo usuario
          </p>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div
            className="mt-4 p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
            role="alert"
          >
            <p className="font-bold">❌ Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 bg-white p-8 shadow-sm sm:rounded-2xl"
          encType="multipart/form-data"
        >
          {/* Nombre */}
          <div>
            <label
              className={`block text-sm font-medium ${VAR_TEXT_PRIMARY}`}
              htmlFor="nombre"
            >
              Nombre
            </label>
            <div className="mt-1">
              <input
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={`block w-full rounded-xl ${VAR_SECONDARY_100} ${VAR_SECONDARY_50} placeholder:${VAR_TEXT_SECONDARY} focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4`}
                id="nombre"
                placeholder="Ingrese el nombre"
                type="text"
                required
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
                value={formData.email}
                onChange={handleChange}
                className={`block w-full rounded-xl ${VAR_SECONDARY_100} ${VAR_SECONDARY_50} placeholder:${VAR_TEXT_SECONDARY} focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4`}
                id="email"
                placeholder="Ingrese su email"
                type="email"
                required
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label
              className={`block text-sm font-medium ${VAR_TEXT_PRIMARY}`}
              htmlFor="password"
            >
              Contraseña
            </label>
            <div className="mt-1">
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`block w-full rounded-xl ${VAR_SECONDARY_100} ${VAR_SECONDARY_50} placeholder:${VAR_TEXT_SECONDARY} focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4`}
                id="password"
                placeholder="Ingrese una contraseña segura"
                type="password"
                required
              />
            </div>
          </div>

          {/* Foto de Perfil */}
          <div>
            <label
              className={`block text-sm font-medium ${VAR_TEXT_PRIMARY}`}
              htmlFor="imgUsuario"
            >
              Foto de Perfil
            </label>
            <div className="mt-1 flex items-center gap-4">
              <span className="inline-block h-16 w-16 overflow-hidden rounded-full bg-gray-300">
                {imagePreviewUrl ? (
                  <img
                    src={imagePreviewUrl}
                    alt="Vista previa de la imagen"
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
                  <span>Subir Foto</span>
                  <input
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="sr-only"
                    id="imgUsuario"
                    name="imgUsuario"
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
              Rol
            </label>
            <div className="mt-1">
              <select
                name="idRol"
                id="idRol"
                value={formData.idRol}
                onChange={handleChange}
                required
                className={`block w-full rounded-xl ${VAR_SECONDARY_100} ${VAR_SECONDARY_50} ${VAR_TEXT_SECONDARY} focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 appearance-none`}
              >
                {/* Valor inicial, que debe ser vacío o un placeholder que no sea un ID real */}
                <option value="" disabled>
                  Selecciona Rol
                </option>

                {/* Mapeo que usa el ID correcto */}
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
              disabled={loading}
              className={`flex w-full justify-center rounded-full border border-transparent ${VAR_PRIMARY_COLOR} py-3 px-4 text-sm font-bold text-white shadow-sm hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50`}
            >
              {loading ? "Creando..." : "Crear"}
            </button>
            <Link
              to="/gestion/usuarios"
              className="flex w-full justify-center rounded-full border border-gray-200 bg-gray-100 text-slate-950 py-3 px-4 text-sm font-bold shadow-sm hover:bg-red-500 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserCreate;
