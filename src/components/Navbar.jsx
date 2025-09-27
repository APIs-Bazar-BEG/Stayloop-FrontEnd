// src/components/Navbar.jsx
// Código unificado: Mantiene la estructura original del lado izquierdo (Hoteles, Mi Perfil)
// e integra la lógica de Admin.

import React from "react";
import { Link } from "react-router-dom";
import { getFullImageUrl } from "../services/stayloopService";

const Navbar = ({ user, onLogout }) => {
  // 1. Definición del Rol Admin (asumiendo idRol: 1)
  const ADMIN_ROLE_ID = 1;
  const isAdmin = user && user.idRol === ADMIN_ROLE_ID;

  // 2. Imagen de Usuario
  const userImageUrl =
    user && user.imageUrl ? getFullImageUrl(user.imageUrl) : null;

  return (
    <nav className="bg-white shadow-lg p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* --- BLOQUE IZQUIERDO: Logo y Enlaces (Hoteles, Perfil, Admin) --- */}
        {/* Nota: Usamos space-x-6 para que se vea con más separación */}
        <div className="flex items-center space-x-6">
          {/* Logo StayLoop */}
          <div className="text-2xl font-bold text-blue-600">
            <Link to="/">StayLoop</Link>
          </div>

          {/* Enlaces Condicionales: Solo si el usuario está logueado */}
          {user && (
            <>
              {/* Hoteles: Mantenemos el enlace Hoteles visible si NO es Admin */}
              {!isAdmin && (
                <Link
                  to="/hoteles"
                  className="text-gray-600 hover:text-blue-600 font-medium"
                >
                  Hoteles
                </Link>
              )}

              {/* Mi Perfil */}
              <Link
                to="/perfil"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Mi Perfil
              </Link>

              {/* Admin: Mostrar SOLO si el usuario es Admin (idRol = 1) */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-gray-600 hover:text-blue-600 font-bold"
                >
                  Admin
                </Link>
              )}
            </>
          )}
        </div>

        {/* --- BLOQUE DERECHO: Perfil, Nombre y Cerrar Sesión --- */}
        {/* space-x-4: Controla la separación entre la foto, el nombre y el botón */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* Foto de Perfil */}
              <img
                src={
                  userImageUrl ||
                  "https://via.placeholder.com/40/cccccc/ffffff?text=U"
                }
                alt="Perfil"
                className="h-10 w-10 rounded-full object-cover"
              />

              {/* Nombre del Usuario (Aseguramos que siempre sea un span) */}
              <span className="text-gray-700 font-medium hidden sm:block">
                {user.nombre}
              </span>

              {/* Botón Cerrar Sesión */}
              <button
                onClick={onLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors font-medium"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              {/* Botones si no hay sesión iniciada */}
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors font-medium"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
