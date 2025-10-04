// src/pages/Reservas/ReservationForm.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { createReservation } from "../../services/ReservationService"; // Asumimos esta función existe
import { getHotelById } from "../../services/HotelesService";
import { getRoomTypeById } from "../../services/RoomTypeService"; // Asumimos esta función existe

// MOCK de usuario logueado. En una app real, vendría de un Context/Store.
const MOCK_USER_ID = 5;

const ReservationForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Obtener parámetros de la URL
  const idHotelURL = searchParams.get("idHotel");
  const idTipoHabitacionURL = searchParams.get("idTipoHabitacion");

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [hotelData, setHotelData] = useState(null);
  const [roomTypeData, setRoomTypeData] = useState(null);

  const [reserva, setReserva] = useState({
    idUsuario: MOCK_USER_ID, // Precargar con el ID del usuario logueado
    idHotel: idHotelURL || "",
    idTipoHabitacion: idTipoHabitacionURL || "",
    fechaInicio: "",
    fechaFin: "",
    total: 0,
  });

  // 1. Cargar datos de Hotel y Tipo de Habitación
  useEffect(() => {
    const loadInitialData = async () => {
      if (idHotelURL && idTipoHabitacionURL) {
        try {
          const [hotel, roomType] = await Promise.all([
            getHotelById(idHotelURL),
            getRoomTypeById(idTipoHabitacionURL),
          ]);
          setHotelData(hotel);
          setRoomTypeData(roomType);
        } catch (err) {
          console.error("Error al cargar datos iniciales:", err);
          setFormError(
            "No se pudieron cargar los datos del hotel o habitación."
          );
        }
      }
    };
    loadInitialData();
  }, [idHotelURL, idTipoHabitacionURL]);

  // 2. Manejar cambios en el formulario
  const handleChange = (e) => {
    setReserva({
      ...reserva,
      [e.target.name]: e.target.value,
    });
    // Lógica simple de recalculo de total iría aquí
  };

  // 3. Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    // Validaciones básicas
    if (
      !reserva.fechaInicio ||
      !reserva.fechaFin ||
      !reserva.idHotel ||
      !reserva.idTipoHabitacion
    ) {
      setFormError("Por favor, complete todos los campos requeridos.");
      setLoading(false);
      return;
    }

    try {
      await createReservation(reserva);
      alert("¡Reserva creada con éxito!");
      navigate("/reservas"); // Redirigir al listado de reservas del usuario/admin
    } catch (error) {
      console.error("Error al crear reserva:", error);
      setFormError(
        error.toString() || "Error desconocido al intentar guardar la reserva."
      );
    } finally {
      setLoading(false);
    }
  };

  // Texto a mostrar para el hotel y la habitación
  const hotelDisplay = hotelData
    ? `${hotelData.nombre} (ID: ${reserva.idHotel})`
    : reserva.idHotel;
  const roomDisplay = roomTypeData
    ? `${roomTypeData.nombre} (${roomTypeData.costo} $/noche)`
    : reserva.idTipoHabitacion;

  return (
    <div className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <h2 className="text-center text-2xl font-bold text-green-600">
          Nueva Reserva
        </h2>

        {formError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            {formError}
          </div>
        )}

        <div className="bg-white shadow rounded p-6">
          <form onSubmit={handleSubmit}>
            {/* Campo solo lectura de Usuario */}
            <div className="mb-4">
              <label className="block text-gray-700">
                Usuario ID (Automático)
              </label>
              <input
                type="text"
                value={reserva.idUsuario}
                readOnly
                className="w-full border px-3 py-2 rounded bg-gray-100"
              />
            </div>

            {/* Campo solo lectura de Hotel */}
            <div className="mb-4">
              <label className="block text-gray-700">Hotel</label>
              <input
                type="text"
                value={hotelDisplay}
                readOnly
                className="w-full border px-3 py-2 rounded bg-gray-100 font-semibold"
              />
              {/* Input oculto para el ID real */}
              <input type="hidden" name="idHotel" value={reserva.idHotel} />
            </div>

            {/* Campo solo lectura de Tipo de Habitación */}
            <div className="mb-4">
              <label className="block text-gray-700">Tipo de Habitación</label>
              <input
                type="text"
                value={roomDisplay}
                readOnly
                className="w-full border px-3 py-2 rounded bg-gray-100 font-semibold"
              />
              {/* Input oculto para el ID real */}
              <input
                type="hidden"
                name="idTipoHabitacion"
                value={reserva.idTipoHabitacion}
              />
            </div>

            {/* Fechas */}
            <div className="mb-4">
              <label className="block text-gray-700">Fecha Inicio</label>
              <input
                type="datetime-local"
                name="fechaInicio"
                value={reserva.fechaInicio}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Fecha Fin</label>
              <input
                type="datetime-local"
                name="fechaFin"
                value={reserva.fechaFin}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            {/* Total (Debería ser calculado) */}
            <div className="mb-4">
              <label className="block text-gray-700">Total</label>
              <input
                type="number"
                name="total"
                value={reserva.total}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                readOnly={!reserva.total}
              />
              {!reserva.total && (
                <p className="text-sm text-gray-500 mt-1">
                  El total se calculará al seleccionar las fechas.
                </p>
              )}
            </div>

            <div className="flex justify-between">
              <Link
                to={
                  idHotelURL
                    ? `/reservas/detallehotel/${idHotelURL}`
                    : "/reservas/hoteles"
                }
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-green-400"
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReservationForm;
