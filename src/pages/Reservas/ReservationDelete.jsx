// src/pages/Reservas/ReservationDelete.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getReservationById,
  deleteReservation,
} from "../../services/ReservationService";
// Asumimos que estos servicios están disponibles para resolver los nombres:
import { getHotelDetail } from "../../services/HotelService";
import { getRoomTypeById } from "../../services/RoomTypeService";
import { getUserById } from "../../services/UserService";

// Función utilitaria para formatear fecha/hora
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleString("es-ES", options);
};

const ReservationDelete = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Obtiene el ID de la URL: /reservas/delete/:id

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
        const reservationData = await getReservationById(id);
        setReserva(reservationData);

        // Carga de metadata (nombres)
        const [user, hotel, roomType] = await Promise.all([
          getUserById(reservationData.idUsuario).catch(() => ({
            nombre: `Usuario #${reservationData.idUsuario}`,
          })),
          getHotelDetail(reservationData.idHotel).catch(() => ({
            nombre: `Hotel #${reservationData.idHotel}`,
          })),
          getRoomTypeById(reservationData.idTipoHabitacion).catch(() => ({
            nombre: `Hab. #${reservationData.idTipoHabitacion}`,
          })),
        ]);

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
        setError(`No se pudo cargar la reserva #${id}.`);
        setLoading(false);
      }
    };
    fetchReservationData();
  }, [id]);

  // Manejo de la acción de eliminación
  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await deleteReservation(id);
      alert(`Reserva #${id} eliminada con éxito.`);
      navigate("/reservas"); // Redirigir a la lista de reservas
    } catch (err) {
      setError(`Error al eliminar: ${err}`);
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-10 text-blue-600">
        Cargando detalles para confirmación...
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
        <h2 className="text-center text-3xl font-bold text-red-600">
          Confirmar Eliminación
        </h2>

        <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-100">
          <p className="mb-6 text-lg text-gray-700 font-medium">
            ¿Estás seguro que deseas eliminar la siguiente reserva de forma
            permanente?
          </p>

          <ul className="space-y-3 text-base">
            <li className="flex justify-between border-b border-dashed pb-1">
              <strong className="text-gray-600">ID:</strong>
              <span className="font-semibold text-gray-800">{reserva.id}</span>
            </li>
            <li className="flex justify-between border-b border-dashed pb-1">
              <strong className="text-gray-600">Usuario:</strong>
              <span className="font-semibold text-gray-800">
                {metadata.nombreUsuario}
              </span>
            </li>
            <li className="flex justify-between border-b border-dashed pb-1">
              <strong className="text-gray-600">Hotel:</strong>
              <span className="font-semibold text-gray-800">
                {metadata.nombreHotel}
              </span>
            </li>
            <li className="flex justify-between border-b border-dashed pb-1">
              <strong className="text-gray-600">Tipo de habitación:</strong>
              <span className="font-semibold text-gray-800">
                {metadata.nombreTipoHabitacion}
              </span>
            </li>
            <li className="flex justify-between pt-2">
              <strong className="text-gray-600">Total:</strong>
              <span className="text-xl font-extrabold text-red-500">
                ${(reserva.total || 0).toFixed(2)}
              </span>
            </li>
          </ul>

          <form onSubmit={handleDeleteSubmit} className="mt-8">
            <input type="hidden" name="id" value={reserva.id} />
            <div className="flex justify-between gap-4">
              <button
                type="button"
                onClick={() => navigate("/reservas")}
                className="flex-1 bg-gray-400 text-white px-4 py-3 rounded-lg font-bold hover:bg-gray-500 transition-colors shadow"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors shadow"
              >
                Eliminar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReservationDelete;
