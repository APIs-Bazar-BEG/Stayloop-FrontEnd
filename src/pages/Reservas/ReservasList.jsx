// src/pages/Reservas/ReservasList.jsx

import React, { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getAllReservations } from "../../services/ReservationService";
// Asume que tienes estos servicios para resolver los nombres de ID a texto
import { getHotelDetail } from "../../services/HotelService";
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

// Caché para nombres de entidades (optimización para evitar recargas excesivas de metadata)
const entityCache = { users: {}, hotels: {}, roomTypes: {} };

/**
 * Obtiene los nombres de las entidades relacionadas de una reserva usando caché.
 */
const enrichReservation = async (reserva) => {
  const { idUsuario, idHotel, idTipoHabitacion } = reserva;

  // Obtener y cachear el nombre del usuario
  if (idUsuario && !entityCache.users[idUsuario]) {
    try {
      const user = await getUserById(idUsuario);
      entityCache.users[idUsuario] = user.nombre || `Usuario #${idUsuario}`;
    } catch {
      entityCache.users[idUsuario] = `Usuario #${idUsuario} (Error)`;
    }
  }

  // Obtener y cachear el nombre del hotel
  if (idHotel && !entityCache.hotels[idHotel]) {
    try {
      const hotel = await getHotelDetail(idHotel);
      entityCache.hotels[idHotel] = hotel.nombre || `Hotel #${idHotel}`;
    } catch {
      entityCache.hotels[idHotel] = `Hotel #${idHotel} (Error)`;
    }
  }

  // Obtener y cachear el nombre del tipo de habitación
  if (idTipoHabitacion && !entityCache.roomTypes[idTipoHabitacion]) {
    try {
      const roomType = await getRoomTypeById(idTipoHabitacion);
      entityCache.roomTypes[idTipoHabitacion] =
        roomType.nombre || `Hab. #${idTipoHabitacion}`;
    } catch {
      entityCache.roomTypes[
        idTipoHabitacion
      ] = `Hab. #${idTipoHabitacion} (Error)`;
    }
  }

  return {
    ...reserva,
    nombreUsuario: entityCache.users[idUsuario] || "N/A",
    nombreHotel: entityCache.hotels[idHotel] || "N/A",
    nombreTipoHabitacion: entityCache.roomTypes[idTipoHabitacion] || "N/A",
  };
};

const ReservasList = () => {
  // Para manejar los filtros y paginación desde la URL
  const [searchParams, setSearchParams] = useSearchParams();

  const [reservasData, setReservasData] = useState({
    content: [],
    totalPages: 0,
    number: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado interno para el formulario de filtros (sincronizado con URL)
  const [filterForm, setFilterForm] = useState({
    idUsuario: searchParams.get("idUsuario") || "",
    idHotel: searchParams.get("idHotel") || "",
    totalMin: searchParams.get("totalMin") || "",
  });

  // Lógica para obtener los datos
  const fetchReservations = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const listData = await getAllReservations(params);

      // Enriquecer las reservas (obtener nombres de entidades)
      const enrichedReservas = await Promise.all(
        listData.content.map(enrichReservation)
      );

      setReservasData({
        ...listData,
        content: enrichedReservas,
      });
    } catch (err) {
      console.error(err);
      setError("Error al cargar la lista de reservas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Obtener filtros y página de la URL para la llamada API
    const params = {};
    searchParams.forEach((value, key) => {
      if (value) params[key] = value;
    });

    fetchReservations(params);
  }, [searchParams, fetchReservations]);

  // Manejador del formulario de filtros
  const handleFilterSubmit = (e) => {
    e.preventDefault();

    const newParams = {};
    // Sincronizar el estado del formulario con los parámetros de búsqueda de la URL
    Object.entries(filterForm).forEach(([key, value]) => {
      if (value) newParams[key] = value;
    });

    // Mantener la página actual si los filtros no cambian, o resetear a la página 0 si cambian
    newParams.page = 0;

    setSearchParams(newParams);
  };

  // Manejador para el input de filtros
  const handleFilterChange = (e) => {
    setFilterForm({
      ...filterForm,
      [e.target.name]: e.target.value,
    });
  };

  // Lógica de paginación
  const pageNumbers = [];
  for (let i = 0; i < reservasData.totalPages; i++) {
    pageNumbers.push(i);
  }

  const currentPage = reservasData.number;

  const handlePageChange = (pageNum) => {
    // Mantener los filtros actuales y solo cambiar la página
    const currentFilters = {};
    searchParams.forEach((value, key) => {
      if (value && key !== "page") currentFilters[key] = value;
    });

    setSearchParams({ ...currentFilters, page: pageNum });
  };

  if (loading)
    return (
      <div className="p-10 text-center text-blue-600">
        Cargando lista de reservas...
      </div>
    );
  if (error)
    return <div className="p-10 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Listado de Reservas
          </h2>
          <Link
            to="/reservas/create"
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md"
          >
            + Nueva Reserva
          </Link>
        </div>

        {/* Filtros */}
        <form
          onSubmit={handleFilterSubmit}
          className="mb-6 flex flex-wrap gap-4 bg-white p-4 rounded-xl shadow"
        >
          <input
            type="number"
            name="idUsuario"
            value={filterForm.idUsuario}
            onChange={handleFilterChange}
            placeholder="ID Usuario"
            className="border rounded p-2 flex-grow min-w-[150px]"
          />

          <input
            type="number"
            name="idHotel"
            value={filterForm.idHotel}
            onChange={handleFilterChange}
            placeholder="ID Hotel"
            className="border rounded p-2 flex-grow min-w-[150px]"
          />

          <input
            type="number"
            step="0.01"
            name="totalMin"
            value={filterForm.totalMin}
            onChange={handleFilterChange}
            placeholder="Total mínimo"
            className="border rounded p-2 flex-grow min-w-[150px]"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors font-medium"
          >
            Filtrar
          </button>
        </form>

        {/* Tabla de reservas */}
        <div className="overflow-x-auto bg-white shadow-xl rounded-xl">
          <table className="min-w-full divide-y divide-gray-200 border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 border border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="py-3 px-4 border border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="py-3 px-4 border border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hotel
                </th>
                <th className="py-3 px-4 border border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo Habitación
                </th>
                <th className="py-3 px-4 border border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inicio
                </th>
                <th className="py-3 px-4 border border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fin
                </th>
                <th className="py-3 px-4 border border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="py-3 px-4 border border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservasData.content.map((reserva) => (
                <tr
                  key={reserva.id}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <td className="py-2 px-4 border text-sm font-medium text-gray-900">
                    {reserva.id}
                  </td>
                  <td className="py-2 px-4 border text-sm text-gray-700">
                    {reserva.nombreUsuario}
                  </td>
                  <td className="py-2 px-4 border text-sm text-gray-700">
                    {reserva.nombreHotel}
                  </td>
                  <td className="py-2 px-4 border text-sm text-gray-700">
                    {reserva.nombreTipoHabitacion}
                  </td>
                  <td className="py-2 px-4 border text-sm text-gray-700">
                    {formatDate(reserva.fechaInicio)}
                  </td>
                  <td className="py-2 px-4 border text-sm text-gray-700">
                    {formatDate(reserva.fechaFin)}
                  </td>
                  <td className="py-2 px-4 border text-sm font-bold text-gray-800">
                    ${(reserva.total || 0).toFixed(2)}
                  </td>
                  <td className="py-2 px-4 border flex gap-2">
                    <Link
                      to={`/reservas/details/${reserva.id}`}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                    >
                      Ver
                    </Link>
                    <Link
                      to={`/reservas/delete/${reserva.id}`}
                      className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                    >
                      Eliminar
                    </Link>
                  </td>
                </tr>
              ))}
              {reservasData.content.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="py-4 px-4 text-center text-gray-500"
                  >
                    No se encontraron reservas con los criterios actuales.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {reservasData.totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {pageNumbers.map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-4 py-2 border rounded font-medium transition-colors 
                                    ${
                                      pageNum === currentPage
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-white text-gray-700 hover:bg-gray-100"
                                    }`}
              >
                {pageNum + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservasList;
