import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaPencilAlt, FaTrash } from "react-icons/fa";
import { getHoteles, deleteHotel } from "../../services/HotelesService";
import { getImagesByHotelId, getImageUrl } from "../../services/ImageService";

// Definición de colores base (simulando tus variables CSS)
const COLORS = {
  "primary-color": "bg-green-500",
  "secondary-color": "bg-gray-100",
  "text-primary": "text-gray-800",
  "text-secondary": "text-gray-600",
  "border-color": "border-gray-200",
};

const HotelesList = () => {
  const [hoteles, setHoteles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hotelImages, setHotelImages] = useState({});

  // ----------------------------------------------------------------------
  // Carga de Datos
  // ----------------------------------------------------------------------
  const loadHotelesAndImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHoteles();

      if (Array.isArray(data)) {
        setHoteles(data);

        // Cargar la portada (primera imagen) de cada hotel
        const imagePromises = data.map(async (hotel) => {
          const images = await getImagesByHotelId(hotel.id);
          let imageUrl = "/placeholder_hotel.jpg"; // URL por defecto

          // ⭐ Reemplazamos la ruta de Thymeleaf por la URL de la API:
          if (images.length > 0) {
            imageUrl = getImageUrl(images[0].id);
          }

          return { hotelId: hotel.id, url: imageUrl };
        });

        const results = await Promise.all(imagePromises);

        const imagesMap = results.reduce((acc, result) => {
          acc[result.hotelId] = result.url;
          return acc;
        }, {});

        setHotelImages(imagesMap);
      } else {
        setHoteles([]);
        setError("Formato de datos incorrecto o lista vacía.");
      }
    } catch (err) {
      console.error("Error al cargar hoteles:", err);
      setError(err.message || "Fallo al cargar la lista de hoteles.");
      setHoteles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotelesAndImages();
  }, []);

  // ----------------------------------------------------------------------
  // Manejo de Acciones
  // ----------------------------------------------------------------------
  const handleDelete = async (hotelId, hotelNombre) => {
    if (
      window.confirm(
        `¿Estás seguro de que quieres eliminar el hotel "${hotelNombre}"? Esta acción es irreversible.`
      )
    ) {
      try {
        await deleteHotel(hotelId);
        alert(`Hotel "${hotelNombre}" eliminado con éxito.`);
        loadHotelesAndImages(); // Recargar la lista
      } catch (err) {
        console.error("Error al eliminar hotel:", err);
        alert(
          `Error al eliminar el hotel: ${err.message || "Error desconocido"}`
        );
      }
    }
  };

  if (loading) {
    return (
      <p className="text-center text-blue-600 font-medium py-10">
        Cargando hoteles...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 font-medium py-10">{error}</p>
    );
  }

  // ----------------------------------------------------------------------
  // Renderizado del Componente
  // ----------------------------------------------------------------------
  return (
    <div className="flex-1 px-10 sm:px-20 md:px-40 py-8">
      <div className="layout-content-container flex flex-col max-w-5xl mx-auto">
        {/* Botón de Agregar Nuevo Hotel */}
        <div className="mb-6 self-end">
          <Link
            to="/hotel/create" // ⭐ Usa la ruta de creación
            className={`flex items-center justify-center gap-2 h-10 px-5 ${COLORS["primary-color"]} text-white rounded-full text-sm font-bold tracking-wide hover:bg-green-600 transition-colors shadow-lg`}
          >
            <FaPlus size={16} />
            <span className="truncate">Agregar Nuevo Hotel</span>
          </Link>
        </div>

        {/* Contenedor de la Lista */}
        <div
          className={`bg-white rounded-xl border ${COLORS["border-color"]} overflow-hidden shadow-lg`}
        >
          {hoteles.length === 0 ? (
            <p className="p-6 text-center text-gray-500">
              No hay hoteles registrados.
            </p>
          ) : (
            hoteles.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center gap-4 p-4 border-b border-gray-100 last:border-b-0 property-item"
              >
                {/* Información del Hotel */}
                <div className="flex items-center gap-4">
                  <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-16 overflow-hidden">
                    <img
                      src={hotelImages[item.id] || "/placeholder_hotel.jpg"}
                      alt={`Portada de ${item.nombre}`}
                      className="w-full h-full object-cover"
                      // Fallback de imagen en caso de error de carga
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder_hotel.jpg";
                      }}
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    {/* Usando tus colores simulados */}
                    <p
                      className={`${COLORS["text-secondary"]} text-lg font-semibold line-clamp-1`}
                    >
                      {item.nombre}
                    </p>
                    <p
                      className={`${COLORS["text-primary"]} text-sm line-clamp-2`}
                    >
                      {item.direccion}
                    </p>
                  </div>
                </div>

                {/* Controles de Acción (Editar/Eliminar) */}
                <div className="shrink-0 flex gap-2">
                  <Link
                    to={`/hotel/edit/${item.id}`} // ⭐ Usa la ruta de edición
                    className={`flex items-center justify-center rounded-full h-9 px-4 text-white text-sm font-medium ${COLORS["primary-color"]} hover:bg-green-600 transition-colors w-fit`}
                  >
                    <FaPencilAlt size={12} className="mr-2" />
                    <span className="truncate">Editar</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id, item.nombre)}
                    className="flex items-center justify-center rounded-full h-9 px-4 text-white text-sm font-medium bg-red-500 hover:bg-red-600 transition-colors w-fit"
                  >
                    <FaTrash size={12} className="mr-2" />
                    <span className="truncate">Eliminar</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Si necesitas la paginación, la implementaríamos aquí */}
        {/*
                <div className="mt-4 flex justify-center gap-2">
                    <a className="px-3 py-1 border rounded hover:bg-gray-200">1</a>
                    <a className="px-3 py-1 border rounded hover:bg-gray-200">2</a>
                    ...
                </div>
                */}
      </div>
    </div>
  );
};

export default HotelesList;
