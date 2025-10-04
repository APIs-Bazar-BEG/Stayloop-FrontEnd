// src/pages/Reservas/HotelDetails.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { getHotelById } from "../../services/HotelesService";
import { getRoomTypeById } from "../../services/RoomTypeService";
import { getZonas } from "../../services/ZonasService";
const MOCK_IMAGES = [
  // Reemplazar con la función de servicio real de imágenes
  { id: 1, url: "...", isExtra: false },
  { id: 2, url: "...", isExtra: false },
  { id: 3, url: "...", isExtra: false },
  { id: 4, url: "...", isExtra: false },
  { id: 5, url: "...", isExtra: false },
  { id: 6, url: "...", isExtra: false },
  { id: 7, url: "...", isExtra: true }, // Extra
  { id: 8, url: "...", isExtra: true }, // Extra
];

const HotelDetails = () => {
  const { id } = useParams(); // Obtiene el ID del hotel de la URL
  const [hotel, setHotel] = useState(null);
  const [habitaciones, setHabitaciones] = useState([]);
  const [imagenes, setImagenes] = useState(MOCK_IMAGES); // Usar MOCK_IMAGES temporalmente
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllImages, setShowAllImages] = useState(false);

  // Asume que necesitas obtener los datos de la cadena de hoteles para la imagen/nombre.
  const getHotelChainData = () => ({
    nombre: "Cadena Ejemplo",
    email: "cadena@test.com",
  });
  const cadena = getHotelChainData();

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // Cargar Hotel, Habitaciones y Zonas en paralelo
        const [hotelData, habitacionesData, zonasData] = await Promise.all([
          getHotelById(id),
          getRoomTypeById(id), // Debe ser una función que obtenga tipos de habitación
          getZonas(),
          // Si tienes un servicio de imágenes, cárgalo aquí
        ]);

        setHotel(hotelData);
        setHabitaciones(habitacionesData);
        setZonas(zonasData);
        // Si la API tiene un endpoint de imágenes, úsalo aquí: setImagenes(imagenesData);
      } catch (err) {
        console.error("Error al cargar detalles del hotel:", err);
        setError("Fallo al cargar los detalles del hotel.");
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [id]);

  if (loading)
    return (
      <div className="text-center py-20">Cargando detalles del hotel...</div>
    );
  if (error)
    return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!hotel)
    return (
      <div className="text-center py-20 text-gray-500">
        Hotel no encontrado.
      </div>
    );

  const hotelZona = hotel ? zonas.find((z) => z.id === hotel.idZona) : null;
  const initialImages = imagenes.slice(0, 6);
  const extraImages = imagenes.slice(6);

  // Placeholders
  const getUsuarioImagenUrl = (email) => `/usuarioControl/imagen/${email}`;
  const getHotelImagenUrl = (id) => `/reservas/imagenesHotel/${id}`;

  return (
    <div className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
      <main className="px-24 py-8 bg-gray-100 min-h-screen">
        <div className="mx-auto max-w-screen-xl">
          {/* Breadcrumbs */}
          <nav className="mb-4 text-sm text-gray-600">
            <ol className="flex items-center space-x-2">
              <li>
                <Link className="hover:text-blue-600" to="/reservas/hoteles">
                  Hoteles
                </Link>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              {hotelZona && (
                <li>
                  <Link
                    className="hover:text-blue-600"
                    to={`/reservas/hoteles?zona=${hotelZona.id}`}
                  >
                    {hotelZona.nombre}
                  </Link>
                </li>
              )}
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li className="font-medium text-gray-800">{hotel.nombre}</li>
            </ol>
          </nav>

          <section className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <img
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-11 border-2 border-transparent"
                    style={{ maxWidth: "44px", maxHeight: "44px" }}
                    alt="test"
                    src={getUsuarioImagenUrl(cadena.email)}
                  />
                  <h2 className="text-4xl font-bold tracking-tight text-gray-800">
                    {hotel.nombre}
                  </h2>
                  <p className="text-xl font-medium text-gray-600 mt-1">
                    {cadena.nombre}
                  </p>
                </div>
              </div>
            </div>

            {/* Galería de Imágenes */}
            <div className="container mx-auto p-4">
              {imagenes.length > 0 && (
                <div
                  id="image-grid"
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                >
                  {initialImages.map((imagen) => (
                    <div
                      key={imagen.id}
                      className="w-full max-w-[512px] h-full max-h-[512px] aspect-square rounded-lg shadow-md overflow-hidden"
                    >
                      <img
                        src={getHotelImagenUrl(imagen.id)}
                        alt="Foto de la galería"
                        className="w-full h-full object-cover rounded-lg shadow-md"
                      />
                    </div>
                  ))}

                  {/* Imágenes Ocultas/Extras */}
                  {extraImages.map((imagen) => (
                    <div
                      key={imagen.id}
                      className={`w-full max-w-[512px] h-full max-h-[512px] aspect-square rounded-lg shadow-md overflow-hidden ${
                        !showAllImages ? "hidden" : ""
                      }`}
                    >
                      <img
                        src={getHotelImagenUrl(imagen.id)}
                        alt="Foto de la galería"
                        className="w-full h-full object-cover rounded-lg shadow-md"
                      />
                    </div>
                  ))}
                </div>
              )}

              {imagenes.length > 6 && (
                <div className="text-center mt-8">
                  <button
                    id="show-more-btn"
                    className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => setShowAllImages(!showAllImages)}
                  >
                    {showAllImages ? "Ver menos fotos" : "Ver más fotos"}
                  </button>
                </div>
              )}
            </div>
          </section>

          <div className="grid grid-cols-12 gap-12">
            {/* Descripción del Hotel */}
            <div className="col-span-12 lg:col-span-8">
              <section className="mb-10 bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold mb-4 border-b pb-3 text-gray-800">
                  Acerca de este Hotel
                </h3>
                <span>{hotel.descripcion}</span>
              </section>
            </div>

            {/* Tipos de Habitación y Reservar */}
            <aside className="col-span-12 lg:col-span-4">
              <div className="sticky top-10 p-6 rounded-2xl shadow-xl border border-gray-200 bg-white">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  Tipos de Habitación
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  {habitaciones.map((habitacion) => (
                    <div
                      key={habitacion.id}
                      className="rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between bg-white"
                    >
                      {/* Detalles */}
                      {/* ... (renderizar nombre, capacidad, precio, cantidad) */}

                      <div className="mb-3">
                        <p className="text-sm font-semibold text-gray-600">
                          Nombre del Tipo de Habitación
                        </p>
                        <p className="text-base text-gray-800 font-medium">
                          {habitacion.nombre}
                        </p>
                      </div>
                      <div className="mb-3">
                        <p className="text-sm font-semibold text-gray-600">
                          Capacidad de Personas
                        </p>
                        <p className="text-base text-gray-800">
                          {habitacion.cantPersonas}
                        </p>
                      </div>
                      <div className="mb-3">
                        <p className="text-sm font-semibold text-gray-600">
                          Precio por Noche ($)
                        </p>
                        <p className="text-base text-gray-800 font-bold">
                          {habitacion.costo}
                        </p>
                      </div>
                      <div className="mb-6">
                        <p className="text-sm font-semibold text-gray-600">
                          Cantidad de Habitaciones
                        </p>
                        <p className="text-base text-gray-800">
                          {habitacion.cantHab}
                        </p>
                      </div>

                      {/* Botón Reservar que lleva al formulario de creación */}
                      <Link
                        to={`/reservas/create?idHotel=${hotel.id}&idTipoHabitacion=${habitacion.id}`}
                        className="mt-auto w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg text-center hover:bg-green-600 transition-colors"
                      >
                        Reservar
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HotelDetails;
