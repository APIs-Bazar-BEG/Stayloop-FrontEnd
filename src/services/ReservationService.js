// src/services/ReservationService.js

import axios from "axios";
const API_URL = "https://stayloop-api.onrender.com";

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

/**
 * Obtiene la lista de reservas con filtros y paginación.
 * La API es: GET https://stayloop-api.onrender.com/reservations/getall
 * @param {object} params - { idUsuario, idHotel, totalMin, page, size }
 */
export const getAllReservations = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/reservations/getall`, {
      ...getAuthHeaders(),
      params: params,
    });
    // Asumimos que la API devuelve un objeto similar a Page<Reserva> de Spring:
    // { content: [...reservas], totalPages: N, number: current_page, ... }
    return response.data;
  } catch (error) {
    console.error("Error al obtener la lista de reservas:", error);
    throw error;
  }
};

// Necesitarás también funciones para obtener detalles por ID (getHotelDetail, getUserById, getRoomTypeById)
// para resolver los nombres. Asumiré que existen y están importadas en el componente principal.
// src/services/ReservationService.js (Añadir la función de creación)

// ... (imports y getAuthHeaders) ...

/**
 * Crea una nueva reserva.
 */
export const createReservation = async (reservationData) => {
  try {
    const response = await axios.post(
      `${API_URL}/reservations/create`,
      reservationData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error al crear reserva:", error);
    throw error.response?.data?.message || "Fallo en la creación de la reserva";
  }
};

// ... (También necesitarás getHotelDetail, getUserById, getRoomTypeById aquí o en sus respectivos servicios)
// src/services/ReservationService.js (Añadir o actualizar)

// ... (imports y getAuthHeaders) ...

/**
 * Obtiene el detalle de una reserva específica.
 */
export const getReservationById = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/reservations/${id}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error(`Error al obtener reserva #${id}:`, error);
    throw error.response?.data?.message || "Fallo al obtener la reserva";
  }
};

/**
 * Actualiza una reserva existente.
 */
export const updateReservation = async (id, reservationData) => {
  try {
    const response = await axios.post(
      // Aunque usas POST en el testeo, es una operación de PUT/PATCH lógica
      `${API_URL}/reservations/update/${id}`,
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
// ... (Las funciones getAllReservations, createReservation, etc. también deben estar aquí)
// src/services/ReservationService.js (Añadir la función de eliminación)

// ... (imports y getAuthHeaders) ...

/**
 * Elimina una reserva por su ID.
 * La API es: POST https://stayloop-api.onrender.com/reservations/delete/{id}
 */
export const deleteReservation = async (id) => {
  try {
    const response = await axios.post(
      `${API_URL}/reservations/delete/${id}`,
      null, // El cuerpo es nulo si solo se usa el ID en la URL
      getAuthHeaders()
    );
    return response.data; // O simplemente retornar true/success
  } catch (error) {
    console.error(`Error al eliminar reserva #${id}:`, error);
    throw (
      error.response?.data?.message || "Fallo en la eliminación de la reserva"
    );
  }
};

// ... (Las funciones getReservationById, getHotelDetail, etc. deben estar disponibles)
