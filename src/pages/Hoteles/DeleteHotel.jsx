import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getHotelById, deleteHotel } from "../../services/hotelesService";
import { getImagesByHotelId, getImageUrl } from "../../services/ImageService";
import { getTiposByHotelId } from "../../services/RoomTypeService";
import { getZonas } from "../../services/zonasService";

const DeleteHotel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [hotel, setHotel] = useState(null);
  const [zonas, setZonas] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    loadHotelData();
  }, [id]);

  const loadHotelData = async () => {
    try {
      setLoading(true);
      
      const [hotelData, zonasData, roomTypesData, imagesData] = await Promise.all([
        getHotelById(id),
        getZonas(),
        getTiposByHotelId(id),
        getImagesByHotelId(id)
      ]);

      setHotel(hotelData);
      setZonas(zonasData);
      setRoomTypes(roomTypesData);
      
      // Crear URLs completas para las imágenes
      const imagesWithUrls = imagesData.map(img => ({
        ...img,
        url: getImageUrl(img.id)
      }));
      setImages(imagesWithUrls);

    } catch (error) {
      console.error("Error al cargar datos del hotel:", error);
      alert("Error al cargar los datos del hotel");
      navigate("/hoteles");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`¿Estás seguro de eliminar el hotel "${hotel?.nombre}"? Esta acción es irreversible.`)) {
      return;
    }

    setDeleting(true);
    try {
      await deleteHotel(id);
      alert("Hotel eliminado exitosamente!");
      navigate("/hoteles");
    } catch (error) {
      console.error("Error al eliminar hotel:", error);
      alert(`Error al eliminar el hotel: ${error.message}`);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="text-center">Cargando información del hotel...</div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="text-center text-red-500">Hotel no encontrado</div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 items-center">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <header>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-800">
              Eliminar Hotel
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Confirmar eliminación?
            </p>
          </header>

          <div>
            <form className="space-y-12 md:col-span-2">
              {/* Información básica */}
              <section className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold">Información Básica</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium">Nombre del Hotel</label>
                    <input
                      value={hotel.nombre}
                      type="text"
                      className="form-input rounded-xl bg-gray-100"
                      disabled
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium">Dirección</label>
                    <input
                      value={hotel.direccion}
                      type="text"
                      className="form-input rounded-xl bg-gray-100"
                      disabled
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium">Descripción</label>
                    <textarea
                      value={hotel.descripcion}
                      className="form-textarea rounded-xl bg-gray-100"
                      rows="3"
                      disabled
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium">Zona</label>
                    <select
                      value={hotel.idZona}
                      className="form-select rounded-xl bg-gray-100"
                      disabled
                    >
                      <option value="">Seleccione una zona</option>
                      {zonas.map((zona) => (
                        <option key={zona.id} value={zona.id}>
                          {zona.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* Tipos de Habitación */}
              <section className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold">Tipos de Habitación</h3>

                <div className="space-y-8">
                  {roomTypes.map((roomType, index) => (
                    <div
                      key={roomType.id || index}
                      className="relative rounded-lg border border-gray-200 p-4 pt-8"
                    >
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="flex flex-col">
                          <label className="text-sm font-medium">Nombre</label>
                          <input
                            value={roomType.nombre}
                            type="text"
                            className="form-input rounded-xl bg-gray-100"
                            disabled
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-medium">Cantidad de Personas</label>
                          <input
                            value={roomType.cantPersonas}
                            type="number"
                            className="form-input rounded-xl bg-gray-100"
                            disabled
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-medium">Cantidad de Habitaciones</label>
                          <input
                            value={roomType.cantHab}
                            type="number"
                            className="form-input rounded-xl bg-gray-100"
                            disabled
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-medium">Costo</label>
                          <input
                            value={roomType.costo}
                            type="number"
                            step="0.01"
                            className="form-input rounded-xl bg-gray-100"
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Imágenes */}
              <section className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold">Imágenes</h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="relative">
                      <img
                        src={image.url}
                        alt={`Hotel ${hotel.nombre}`}
                        className="h-32 w-32 rounded-xl object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder_hotel.jpg";
                        }}
                      />
                    </div>
                  ))}
                </div>
              </section>

              <div className="flex flex-col sm:flex-row-reverse gap-4 pt-4">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex w-full justify-center rounded-full border border-transparent bg-red-600 py-3 px-4 text-sm font-bold text-white shadow-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  type="button"
                >
                  {deleting ? "Eliminando..." : "Eliminar"}
                </button>
                <Link
                  to="/hoteles"
                  className="flex w-full justify-center rounded-full border border-gray-300 bg-gray-100 text-gray-800 py-3 px-4 text-sm font-bold shadow-sm hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteHotel;