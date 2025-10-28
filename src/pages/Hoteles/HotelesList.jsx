import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaPencilAlt, FaTrash } from "react-icons/fa";
import { getHoteles, deleteHotel } from "../../services/hotelesService";

const HotelesList = () => {
  const [hoteles, setHoteles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadHoteles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHoteles();

      if (!Array.isArray(data)) {
        throw new Error("Formato de datos incorrecto");
      }

      setHoteles(data);

    } catch (err) {
      console.error("Error al cargar hoteles:", err);
      setError(err.message || "Fallo al cargar la lista de hoteles.");
      setHoteles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHoteles();
  }, []);

  const handleDelete = async (hotelId, hotelNombre) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${hotelNombre}"?`)) return;
    
    try {
      await deleteHotel(hotelId);
      alert(`Hotel "${hotelNombre}" eliminado con éxito.`);
      loadHoteles();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <div className="text-center py-10">Cargando hoteles...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Hoteles</h1>
          <Link
            to="/gestion/hoteles/crear"
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FaPlus size={16} />
            <span>Agregar Hotel</span>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          {hoteles.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No hay hoteles registrados.
            </div>
          ) : (
            hoteles.map((hotel) => (
              <div
                key={hotel.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-500 text-2xl">🏨</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {hotel.nombre}
                    </h3>
                    <p className="text-gray-600 text-sm truncate">
                      {hotel.direccion}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <Link
                    to={`/gestion/hoteles/editar/${hotel.id}`}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                  >
                    <FaPencilAlt size={12} />
                    <span>Editar</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(hotel.id, hotel.nombre)}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                  >
                    <FaTrash size={12} />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelesList;