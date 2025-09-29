import React from "react";
import { Link } from "react-router-dom";
import { getFullImageUrl } from "../services/stayloopService";

const Navbar = ({ user, onLogout }) => {
  const ADMIN_ROLE_ID = 1;
  const isAdmin = user && user.idRol === ADMIN_ROLE_ID;

  const userImageUrl =
    user && user.imageUrl ? getFullImageUrl(user.imageUrl) : null;

  return (
    <nav className="bg-white shadow-lg p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Bloque izquierdo: Logo y enlaces */}
        <div className="flex items-center space-x-6">
          <div className="text-2xl font-bold text-blue-600">
            <Link to="/">StayLoop</Link>
          </div>

          {user && (
            <>
              {/* Clientes ven Hoteles */}
              {!isAdmin && (
                <Link
                  to="/hoteles"
                  className="text-gray-600 hover:text-blue-600 font-medium"
                >
                  Hoteles
                </Link>
              )}

              {/* Todos los usuarios ven Mi Perfil */}
              <Link
                to="/perfil"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Mi Perfil
              </Link>

              {/* Admin ve Admin */}
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

        {/* Bloque derecho: Foto y Cerrar Sesión */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <img
                src={
                  userImageUrl ||
                  "https://via.placeholder.com/40/cccccc/ffffff?text=U"
                }
                alt="Perfil"
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="text-gray-700 font-medium hidden sm:block">
                {user.nombre}
              </span>
              <button
                onClick={onLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors font-medium"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
