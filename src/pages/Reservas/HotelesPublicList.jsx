import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getHoteles } from "../../services/HotelesService";
// ⭐ Importar el servicio de imágenes
import { getImagesByHotelId, getImageUrl } from "../../services/ImageService";

const HotelesPublicList = () => {
  const [hoteles, setHoteles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // ⭐ Nuevo estado: Mapa para almacenar la URL de portada de cada hotel
  const [hotelImages, setHotelImages] = useState({}); // 1. Cargar Hoteles y sus Portadas

  useEffect(() => {
    const loadHotelesAndImages = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Obtener la lista de hoteles
        const data = await getHoteles();
        if (Array.isArray(data)) {
          setHoteles(data); // 2. Obtener la primera imagen de cada hotel de forma concurrente

          const imagePromises = data.map(async (hotel) => {
            // Obtener la lista de IDs de imágenes para este hotel
            const images = await getImagesByHotelId(hotel.id);
            let imageUrl = "/placeholder_hotel.jpg"; // Fallback URL por defecto
            if (images.length > 0) {
              // Usar el ID de la primera imagen para obtener su URL real
              imageUrl = getImageUrl(images[0].id);
            }
            return {
              hotelId: hotel.id,
              url: imageUrl,
            };
          }); // Esperar a que todas las promesas de imagen se resuelvan

          const results = await Promise.all(imagePromises); // Crear el mapa { id: url }
          const imagesMap = results.reduce((acc, result) => {
            acc[result.hotelId] = result.url;
            return acc;
          }, {});

          setHotelImages(imagesMap);
        } else {
          console.error("Respuesta de API inesperada. No es un array:", data);
          setHoteles([]);
          setError(
            "Fallo al cargar la lista de hoteles: Formato de datos incorrecto."
          );
        }
      } catch (err) {
        console.error("Error al cargar hoteles:", err);
        setError("Fallo al cargar la lista de hoteles.");
        setHoteles([]);
      } finally {
        setLoading(false);
      }
    };
    loadHotelesAndImages();
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
                  <img
                    className="w-full h-48 object-cover"
                    src={hotelImages[item.id] || "/placeholder_hotel.jpg"}
                    alt={`Portada del hotel ${item.nombre}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder_hotel.jpg";
                    }}
                  />
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
