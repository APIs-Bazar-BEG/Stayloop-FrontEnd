import React from "react";
import { Link } from "react-router-dom";
import { getFullImageUrl } from "../services/stayloopService";

const Navbar = ({ user, onLogout }) => {
  const userImageUrl =
    user && user.imageUrl ? getFullImageUrl(user.imageUrl) : null;

  return (
    <nav className="bg-white shadow-lg p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-bold text-blue-600">
            <Link to="/">StayLoop</Link>
          </div>
          {user && (
            <>
              <Link to="/hoteles" className="text-gray-600 hover:text-blue-600">
                Hoteles
              </Link>
                <Link to="/zonas" className="text-gray-600 hover:text-blue-600">
                Zonas
              </Link>
              <Link to="/perfil" className="text-gray-600 hover:text-blue-600">
                Mi Perfil
              </Link>
            </>
          )}
        </div>
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
              <span className="text-gray-700">{user.nombre}</span>
              <button
                onClick={onLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600">
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
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
