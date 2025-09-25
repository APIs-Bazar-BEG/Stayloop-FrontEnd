import React from "react";
import { Link } from "react-router-dom";

const Header = ({ user, onLogout }) => {
  return (
    <header className="flex justify-between items-center px-10 py-4 bg-white shadow-md">
      {/* Logo e items izquierda */}
      <div className="flex items-center gap-6">
        <Link to="/" className="text-2xl font-bold text-green-600">
          StayLoop
        </Link>
        {user && (
          <>
            <Link to="/hoteles" className="text-gray-700 hover:text-green-600">
              Hoteles
            </Link>
            <Link to="/perfil" className="text-gray-700 hover:text-green-600">
              Mi perfil
            </Link>
          </>
        )}
      </div>

      {/* Derecha */}
      <div className="flex items-center gap-6">
        {user ? (
          <>
            <img
              src={user.imagenUrl}
              alt="Perfil"
              className="w-10 h-10 rounded-full object-cover"
            />
            <button
              onClick={onLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-green-600">
              Iniciar sesión
            </Link>
            <Link to="/register" className="text-gray-700 hover:text-green-600">
              Registrarse
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
