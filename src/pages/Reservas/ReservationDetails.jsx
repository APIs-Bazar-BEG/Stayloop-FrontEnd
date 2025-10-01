// src/pages/Reservas/ReservationDetails.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getReservationById } from "../../services/ReservationService";
// Asumimos que estos servicios están disponibles para resolver los nombres:
import { getHotelDetail } from "../../services/hotelesService";
import { getRoomTypeById } from "../../services/RoomTypeService";
import { getUserById } from "../../services/UserService";

// Función utilitaria para formatear fecha/hora (simulando Thymeleaf)
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  // Formato dd-MM-yyyy HH:mm
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

const ReservationDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Obtiene el ID de la URL: /reservas/details/:id

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reserva, setReserva] = useState(null);
  const [metadata, setMetadata] = useState({
    nombreUsuario: "Cargando...",
    nombreHotel: "Cargando...",
    nombreTipoHabitacion: "Cargando...",
  });

  // Carga de la reserva y su metadata
  useEffect(() => {
    const fetchReservationData = async () => {
      if (!id) {
        setError("ID de reserva no proporcionado.");
        setLoading(false);
        return;
      }
      try {
        // Paso 1: Obtener la reserva por ID
        const reservationData = await getReservationById(id);
        setReserva(reservationData);

        // Paso 2: Obtener la metadata relacionada para mostrar nombres
        const [user, hotel, roomType] = await Promise.all([
          getUserById(reservationData.idUsuario).catch(() => ({
            nombre: `Usuario #${reservationData.idUsuario} (Error)`,
          })),
          getHotelDetail(reservationData.idHotel).catch(() => ({
            nombre: `Hotel #${reservationData.idHotel} (Error)`,
          })),
          getRoomTypeById(reservationData.idTipoHabitacion).catch(() => ({
            nombre: `Hab. #${reservationData.idTipoHabitacion} (Error)`,
          })),
        ]);

        // Paso 3: Establecer los nombres en la metadata
        setMetadata({
          nombreUsuario: user.nombre || `Usuario #${reservationData.idUsuario}`,
          nombreHotel: hotel.nombre || `Hotel #${reservationData.idHotel}`,
          nombreTipoHabitacion:
            roomType.nombre ||
            `Habitación #${reservationData.idTipoHabitacion}`,
        });
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError(`No se pudo cargar el detalle de la reserva #${id}.`);
        setLoading(false);
      }
    };
    fetchReservationData();
  }, [id]);

  if (loading)
    return (
      <div className="text-center py-10 text-blue-600">
        Cargando detalles de la reserva...
      </div>
    );
  if (error)
    return <div className="text-center py-10 text-red-600">Error: {error}</div>;
  if (!reserva)
    return (
      <div className="text-center py-10 text-gray-700">
        Reserva no encontrada.
      </div>
    );

  return (
    <div className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Detalles de la Reserva
        </h2>

        <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-100">
          <ul className="space-y-4 text-lg">
            <li className="flex justify-between border-b pb-1">
              <strong className="text-gray-600">ID:</strong>
              <span className="font-semibold text-gray-800">{reserva.id}</span>
            </li>
            <li className="flex justify-between border-b pb-1">
              <strong className="text-gray-600">Usuario:</strong>
              <span className="font-semibold text-gray-800">
                {metadata.nombreUsuario}
              </span>
            </li>
            <li className="flex justify-between border-b pb-1">
              <strong className="text-gray-600">Hotel:</strong>
              <span className="font-semibold text-gray-800">
                {metadata.nombreHotel}
              </span>
            </li>
            <li className="flex justify-between border-b pb-1">
              <strong className="text-gray-600">Tipo de habitación:</strong>
              <span className="font-semibold text-gray-800">
                {metadata.nombreTipoHabitacion}
              </span>
            </li>
            <li className="flex justify-between border-b pb-1">
              <strong className="text-gray-600">Fecha realizado:</strong>
              <span className="font-semibold text-gray-800">
                {formatDate(reserva.fechaRealizado)}
              </span>
            </li>
            <li className="flex justify-between border-b pb-1">
              <strong className="text-gray-600">Fecha inicio:</strong>
              <span className="font-semibold text-gray-800">
                {formatDate(reserva.fechaInicio)}
              </span>
            </li>
            <li className="flex justify-between border-b pb-1">
              <strong className="text-gray-600">Fecha fin:</strong>
              <span className="font-semibold text-gray-800">
                {formatDate(reserva.fechaFin)}
              </span>
            </li>
            <li className="flex justify-between pt-2">
              <strong className="text-xl text-gray-700">Total:</strong>
              <span className="text-2xl font-extrabold text-green-600">
                ${(reserva.total || 0).toFixed(2)}
              </span>
            </li>
          </ul>

          <div className="mt-8 flex justify-between gap-4">
            <button
              onClick={() => navigate("/reservas")}
              className="flex-1 bg-gray-400 text-white px-4 py-3 rounded-lg font-bold hover:bg-gray-500 transition-colors shadow"
            >
              Volver
            </button>
            <Link
              to={`/reservas/edit/${reserva.id}`}
              className="flex-1 text-center bg-blue-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow"
            >
              Editar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetails;
