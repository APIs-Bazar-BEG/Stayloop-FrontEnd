import React from "react";

const Perfil = ({ user }) => {
  if (!user) return <p className="p-6">Debes iniciar sesión</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <img
        src={user.imagenUrl}
        alt="Foto de perfil"
        className="w-32 h-32 rounded-full object-cover mx-auto"
      />
      <h2 className="text-2xl font-bold text-center mt-4">{user.username}</h2>
      <p className="text-center text-gray-600">{user.email}</p>
    </div>
  );
};

export default Perfil;
