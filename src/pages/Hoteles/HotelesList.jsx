// src/pages/Hoteles/HotelesList.jsx
import React, { useEffect, useState } from 'react';
import { getHoteles, API_URL } from '../../services/stayloopService'; 

const HotelesList = () => {
    const [hoteles, setHoteles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHoteles = async () => {
            try {
                const data = await getHoteles();
                console.log("Datos recibidos de la API:", data);
                setHoteles(data);
                setLoading(false);
            } catch (err) {
                setError('No se pudo cargar la lista de hoteles.');
                setLoading(false);
            }
        };
        fetchHoteles();
    }, []);

    if (loading) {
        return <div className="text-center py-10 text-gray-500">Cargando hoteles...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500 font-bold">{error}</div>;
    }

    if (hoteles.length === 0) {
      return <div className="text-center py-10 text-gray-500">No hay hoteles disponibles.</div>;
    }

    return (
        <div className="flex-1 px-10 sm:px-20 md:px-40 py-8">
            <div className="layout-content-container flex flex-col max-w-5xl mx-auto">
                <div className="mb-6">
                    <a href="/hotel/create"
                       className="flex items-center justify-center gap-2 h-10 px-5 bg-green-500 text-white rounded-full text-sm font-bold tracking-wide hover:bg-green-600 transition-colors">
                        <svg fill="currentColor" height="16" viewBox="0 0 256 256" width="16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
                        </svg>
                        <span className="truncate">Agregar Nuevo Hotel</span>
                    </a>
                </div>
                <div className="bg-white rounded-xl border border-[var(--border-color)] overflow-hidden">
                    {hoteles.map(item => (
                        <div key={item.id} className="property-item">
                            <div className="flex items-center gap-4">
                                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-16">
                                    <img src={`${API_URL}/images/getbyid/${item.id}`} alt={item.nombre} />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <p className="text-[var(--text-secondary)] text-lg font-semibold line-clamp-1">{item.nombre}</p>
                                    <p className="text-[var(--text-primary)] text-sm line-clamp-2">{item.direccion}</p>
                                </div>
                            </div>
                            <div className="shrink-0 flex gap-2">
                                <a href={`/hotel/edit/${item.id}`} className="flex min-w-[84px] max-w-[480px] bg-green-500 cursor-pointer items-center justify-center overflow-hidden rounded-full h-9 px-4 text-white text-sm font-medium hover:bg-green-600 transition-colors w-fit">
                                    <span className="truncate">Editar</span>
                                </a>
                                <a href={`/hotel/delete/${item.id}`} className="flex min-w-[84px] max-w-[480px] bg-red-500 cursor-pointer items-center justify-center overflow-hidden rounded-full h-9 px-4 text-white text-sm font-medium hover:bg-red-600 transition-colors w-fit">
                                    <span className="truncate">Eliminar</span>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HotelesList;
import React, { useEffect, useState } from "react";
import { getHoteles, deleteHotel } from "../../services/hotelesService";
import { Link } from "react-router-dom";

const HotelesList = () => {
  const [hoteles, setHoteles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarHoteles = async () => {
    try {
      setLoading(true);
      const data = await getHoteles();
      setHoteles(data);
    } catch (err) {
      setError(err.message || "Error al cargar hoteles");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este hotel?")) return;
    try {
      await deleteHotel(id);
      setHoteles((prev) => prev.filter((hotel) => hotel.id !== id));
    } catch (err) {
      alert("No se pudo eliminar: " + err.message);
    }
  };

  useEffect(() => {
    cargarHoteles();
  }, []);

  if (loading) return <p className="text-center py-6">Cargando hoteles...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="flex-1 px-10 sm:px-20 md:px-40 py-8">
      <div className="flex flex-col max-w-5xl mx-auto">
        {/* Botón agregar */}
        <div className="mb-6">
          <Link
            to="/hoteles/create"
            className="flex items-center justify-center gap-2 h-10 px-5 bg-green-500 text-white rounded-full text-sm font-bold tracking-wide hover:bg-green-600 transition-colors"
          >
            <svg
              fill="currentColor"
              height="16"
              width="16"
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
            </svg>
            <span>Agregar Nuevo Hotel</span>
          </Link>
        </div>

        {/* Lista de hoteles */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y">
          {hoteles.length === 0 ? (
            <p className="text-center py-4">No hay hoteles disponibles</p>
          ) : (
            hoteles.map((hotel) => (
              <div
                key={hotel.id}
                className="property-item flex items-center justify-between p-4"
              >
                {/* Datos */}
                <div className="flex items-center gap-4">
                  <div className="bg-gray-200 aspect-square rounded-lg size-16 overflow-hidden">
                    <img
                      src={hotel.imagenUrl || "/placeholder.jpg"}
                      alt={hotel.nombre}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-gray-800 text-lg font-semibold">
                      {hotel.nombre}
                    </p>
                    <p className="text-gray-600 text-sm">{hotel.direccion}</p>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-2">
                  <Link
                    to={`/hoteles/edit/${hotel.id}`}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(hotel.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  >
                    Eliminar
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
