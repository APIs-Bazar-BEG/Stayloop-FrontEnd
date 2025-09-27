// src/pages/Gestion/UserDetail.jsx

import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getUserById } from "../../services/AdminService";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

// --- Mapeo de Roles LOCAL (Crucial para traducir el idRol numérico) ---
const ROLES = [
  { id: 1, nombre: "Administrador" },
  { id: 2, nombre: "Cliente" },
  { id: 3, nombre: "Hotel" },
];

// --- CONSTANTES DE DISEÑO ---
const VAR_PRIMARY_COLOR = "bg-blue-600";
const VAR_TEXT_PRIMARY = "text-gray-900";
const VAR_TEXT_SECONDARY = "text-gray-500";
const VAR_SECONDARY_BG = "bg-gray-100";
const VAR_SECONDARY_BORDER = "border-gray-200";

// Estilo del Input
const INPUT_CLASSNAME = `form-input block w-full rounded-xl border ${VAR_SECONDARY_BORDER} ${VAR_SECONDARY_BG} text-base font-medium text-gray-800 shadow-inner focus:ring-0 focus:border-transparent py-3 px-4`;

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getRolName = (idRol) => {
    return ROLES.find((rol) => rol.id === idRol)?.nombre || "Rol Desconocido";
  };

  const fetchUserDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (!id) {
      setError("ID de usuario no válido o faltante en la URL.");
      setLoading(false);
      return;
    }

    try {
      const userData = await getUserById(id);
      setUser(userData);
    } catch (err) {
      console.error("Error al cargar el detalle del usuario:", err);
      setError(err.message || "Usuario no encontrado.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUserDetail();
  }, [fetchUserDetail]);

  if (loading) {
    return (
      <div className="flex flex-1 justify-center py-20">
        <p className="text-lg">Cargando detalles del usuario...</p>{" "}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 justify-center py-20 px-4">
        <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg">
          <p className="text-red-600 font-bold mb-4">Error al cargar:</p>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => navigate("/gestion/usuarioControl")}
            className="mt-6 text-blue-600 hover:text-blue-800 flex items-center"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  const rolName = user?.idRol ? getRolName(user.idRol) : "N/A";

  return (
    <div className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md">
        <div className="text-center mb-8">
          <h2
            className={`text-3xl font-bold tracking-tight ${VAR_TEXT_PRIMARY}`}
          >
            Detalle{" "}
          </h2>{" "}
          <p className={`mt-2 text-lg leading-6 ${VAR_TEXT_SECONDARY}`}>
            Acerca de este usuario{" "}
          </p>
        </div>
        <form className="space-y-6 bg-white p-8 shadow-xl rounded-2xl">
          <div>
            <label
              className={`block text-sm font-medium ${VAR_TEXT_PRIMARY}`}
              htmlFor="nombre"
            >
              Nombre{" "}
            </label>
            <div className="mt-1">
              <input
                value={user?.nombre || ""}
                className={INPUT_CLASSNAME}
                id="nombre"
                type="text"
                disabled
              />
            </div>
          </div>
          <div>
            <label
              className={`block text-sm font-medium ${VAR_TEXT_PRIMARY}`}
              htmlFor="email"
            ></label>
            <div className="mt-1">
              <input
                value={user?.email || ""}
                className={INPUT_CLASSNAME}
                id="email"
                type="email"
                disabled
              />
            </div>
          </div>
          <div>
            <label
              className={`block text-sm font-medium ${VAR_TEXT_PRIMARY}`}
              htmlFor="idRol"
            ></label>
            <div className="mt-1">
              <input
                value={rolName}
                className={INPUT_CLASSNAME}
                id="idRol"
                type="text"
                disabled
              />
            </div>
          </div>
          <div className="flex flex-row-reverse gap-4 pt-4 justify-center">
            <Link
              to={`/gestion/usuarioControl/edit/${user?._id || id}`}
              className={`flex w-32 h-12 justify-center items-center rounded-full border border-transparent ${VAR_PRIMARY_COLOR} py-3 px-4 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition-colors`}
            >
              Ir a Editar{" "}
            </Link>
            <Link
              to="/gestion/usuarios"
              className={`flex w-32 h-12 justify-center items-center rounded-full border ${VAR_SECONDARY_BORDER} ${VAR_SECONDARY_BG} py-3 px-4 text-sm font-bold text-slate-950 shadow-md hover:bg-gray-200 transition-colors`}
            >
              Regresar{" "}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserDetail;
