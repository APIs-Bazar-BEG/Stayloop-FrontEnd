// src/services/ReservationService.js

import axios from "axios";

// Creamos la instancia de Axios usando el baseURL: "/"
const api = axios.create({
  baseURL: "/",
});

// --- Helpers para Auth ---
const getToken = () => localStorage.getItem("token");

const getAuthHeaders = () => {
  const token = getToken();

  if (!token) {
    return { headers: {} };
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export const getAllReservations = async (params = {}) => {
  try {
    const response = await api.get(`/reservations/getall`, {
      headers: getAuthHeaders().headers,
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener la lista de reservas:", error);
    throw error;
  }
};

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

export const getReservationById = async (id) => {
  try {
    const response = await api.get(
      `/reservations/getbyid/${id}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error(`Error al obtener reserva #${id}:`, error);
    throw error.response?.data?.message || "Fallo al obtener la reserva";
  }
};

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

export const deleteReservation = async (id) => {
  try {
    const response = await api.delete(
      `/reservations/delete/${id}`,
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
