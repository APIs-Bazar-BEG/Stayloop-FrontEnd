import React, { useState, useEffect } from "react";
import { getFullImageUrl } from "../../services/stayloopService"; // RUTA CORREGIDA

const Perfil = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserData = localStorage.getItem("user");
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        setUserProfile(userData);
      } catch (error) {
        console.error(
          "Error al parsear los datos de usuario de localStorage:",
          error
        );
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-center mt-20 text-lg">Cargando perfil...</div>;
  }

  if (!userProfile) {
    return (
      <div className="text-center mt-20 text-lg text-red-500">
        Debes iniciar sesión para ver tu perfil.
      </div>
    );
  }

  // Lógica para manejar la imagen
  const userImageUrl = userProfile.imageUrl
    ? getFullImageUrl(userProfile.imageUrl)
    : "https://via.placeholder.com/150/cccccc/ffffff?text=U";

  return (
    <div className="flex justify-center min-h-[calc(100vh-6rem)] py-12 bg-gray-50">
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-1 flex justify-center md:justify-start">
              <div className="w-56 h-56 md:w-48 md:h-48 rounded-lg overflow-hidden shadow-xl ring-2 ring-gray-200">
                <img
                  src={userImageUrl}
                  alt="Foto de Perfil"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Detalles Personales
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={userProfile.nombre}
                  disabled
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 disabled:opacity-90 cursor-default focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={userProfile.email}
                  disabled
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 disabled:opacity-90 cursor-default focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reservas</h2>

            <p className="text-gray-500 text-center py-4 border border-dashed border-gray-300 rounded-lg">
              Aún no tienes reservas.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Perfil;
