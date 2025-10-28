import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getHoteles } from "../../services/hotelesService";

const HotelesPublicList = () => {
  const [hoteles, setHoteles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHoteles = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getHoteles();
        if (Array.isArray(data)) {
          setHoteles(data);
        } else {
          console.error("Respuesta de API inesperada. No es un array:", data);
          setHoteles([]);
          setError("Fallo al cargar la lista de hoteles: Formato de datos incorrecto.");
        }
      } catch (err) {
        console.error("Error al cargar hoteles:", err);
        setError("Fallo al cargar la lista de hoteles.");
        setHoteles([]);
      } finally {
        setLoading(false);
      }
    };
    loadHoteles();
  }, []);

  return (
    <div className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
      <main className="container mx-auto px-6 py-8 flex-grow max-w-6xl">
        <div className="flex flex-col gap-8">
          <section className="w-full">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">
              Hoteles
            </h2>
            {loading && (
              <p className="text-center text-blue-600 font-medium">
                Cargando hoteles...
              </p>
            )}
            {error && (
              <p className="text-center text-red-500 font-medium">{error}</p>
            )}
            {!loading && hoteles.length === 0 && !error && (
              <p className="text-center text-gray-500">
                No hay hoteles disponibles en este momento.
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center gap-8">
              {hoteles.map((item) => (
                <div
                  key={item.id}
                  className="w-full max-w-xs bg-white rounded-lg shadow-xl overflow-hidden group transform hover:-translate-y-1 transition-transform duration-300"
                >
                  {/* Placeholder de imagen deshabilitado */}
                  <div className="w-full h-48 bg-gray-100 flex flex-col items-center justify-center border-b">
                    <div className="text-4xl mb-2">🏨</div>
                    <p className="text-gray-500 text-sm text-center px-4">
                      Imagen deshabilitada en modo de prueba
                    </p>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-800 truncate">
                      {item.nombre}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2 h-10">
                      {item.direccion}
                    </p>
                    <div className="mt-4 flex justify-end items-center">
                      <Link
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-md"
                        to={`/reservas/detallehotel/${item.id}`}
                      >
                        Ver Detalles
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default HotelesPublicList;