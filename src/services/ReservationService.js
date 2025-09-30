// src/services/ReservationService.js

import axios from "axios";

// Creamos la instancia de Axios usando el baseURL: "/"
// Esto permite que el proxy de desarrollo maneje las peticiones durante el desarrollo local.
const api = axios.create({
  baseURL: "/",
});

// --- Helpers para Auth ---
const getToken = () => localStorage.getItem("token");

const getAuthHeaders = () => {
  const token = getToken();

  if (!token) {
    // Es buena práctica devolver un objeto vacío o lanzar un error si no hay token
    return { headers: {} };
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

/**
 * Obtiene la lista de reservas con filtros y paginación.
 * La API es: GET /reservations/getall
 * @param {object} params - { idUsuario, idHotel, totalMin, page, size }
 */
export const getAllReservations = async (params = {}) => {
  try {
    // Usamos la instancia 'api' con la ruta relativa
    const response = await api.get(`/reservations/getall`, {
      headers: getAuthHeaders().headers, // Pasamos solo el objeto headers
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener la lista de reservas:", error);
    // Es vital lanzar el error para que el componente lo pueda atrapar
    throw error;
  }
};

/**
 * Crea una nueva reserva.
 * La API es: POST /reservations/create
 */
export const createReservation = async (reservationData) => {
  try {
    const response = await api.post(
      `/reservations/create`,
      reservationData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error al crear reserva:", error);
    throw error.response?.data?.message || "Fallo en la creación de la reserva";
  }
};

/**
 * Obtiene el detalle de una reserva específica.
 * La API es: GET /reservations/{id}
 */
export const getReservationById = async (id) => {
  try {
    const response = await api.get(`/reservations/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error(`Error al obtener reserva #${id}:`, error);
    throw error.response?.data?.message || "Fallo al obtener la reserva";
  }
};

/**
 * Actualiza una reserva existente.
 * La API es: POST /reservations/update/{id} (o PUT/PATCH)
 */
export const updateReservation = async (id, reservationData) => {
  try {
    const response = await api.post(
      `/reservations/update/${id}`,
      reservationData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar reserva #${id}:`, error);
    throw (
      error.response?.data?.message || "Fallo en la actualización de la reserva"
    );
  }
};

/**
 * Elimina una reserva por su ID.
 * La API es: POST /reservations/delete/{id}
 */
export const deleteReservation = async (id) => {
  try {
    const response = await api.post(
      `/reservations/delete/${id}`,
      null,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar reserva #${id}:`, error);
    throw (
      error.response?.data?.message || "Fallo en la eliminación de la reserva"
    );
  }
};
