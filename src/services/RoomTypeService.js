// src/services/RoomTypeService.js

// Importamos la instancia de Axios y los helpers de autenticación
import api, { getAuthHeaders } from "./axios";

const ROOMTYPE_ENDPOINT = "/roomtypes";

// --- READ (Funciones de lectura) ---

/**
 * RESTAURADO: Función dummy temporal que tus vistas están usando.
 * NOTA: Esta función es ineficiente o incorrecta si el backend no tiene un endpoint específico por ID.
 */
export const getRoomTypeById = async (id) => {
  console.warn(
    `[RoomTypeService] Usando función de soporte dummy para ID de Tipo de Habitación: ${id}.`
  ); // Devuelve un objeto simulado que tiene las propiedades que tus vistas de reserva pueden necesitar.

  return {
    id: id,
    nombre: `Tipo de Habitación #${id} (PENDIENTE - Revisar API)`,
    costo: 0,
    cantPersonas: 1, // Añade otras propiedades que tus vistas de reserva puedan requerir
  };
};

/**
 * Obtiene todos los tipos de habitación para un hotel específico.
 * GET /roomtypes/getbyhotelid/1
 */
export const getTiposByHotelId = async (hotelId) => {
  try {
    const response = await api.get(
      `${ROOMTYPE_ENDPOINT}/getbyhotelid/${hotelId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error al obtener tipos de habitación para hotel ${hotelId}:`,
      error.response || error
    );
    throw new Error(
      error.response?.data?.message ||
        "No se pudieron obtener los tipos de habitación."
    );
  }
};

// --- CREATE (Nueva función) ---

/**
 * Crea un nuevo tipo de habitación.
 * POST /roomtypes/createtohotel/1
 */
export const createTipoHabitacion = async (hotelId, tipoData) => {
  try {
    const response = await api.post(
      `${ROOMTYPE_ENDPOINT}/createtohotel/${hotelId}`,
      tipoData,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error al crear tipo de habitación:",
      error.response || error
    );
    throw new Error(
      error.response?.data?.message || "Error al crear el tipo de habitación."
    );
  }
};

// --- UPDATE (Nueva función) ---

/**
 * Actualiza un tipo de habitación.
 * PUT /roomtypes/update/1
 */
export const updateTipoHabitacion = async (id, tipoData) => {
  try {
    const response = await api.put(
      `${ROOMTYPE_ENDPOINT}/update/${id}`,
      tipoData,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error al actualizar tipo de habitación ${id}:`,
      error.response || error
    );
    throw new Error(
      error.response?.data?.message ||
        "Error al actualizar el tipo de habitación."
    );
  }
};

// --- DELETE (Nueva función) ---

/**
 * Elimina un tipo de habitación.
 * DELETE /roomtypes/delete/1
 */
export const deleteTipoHabitacion = async (id) => {
  try {
    await api.delete(`${ROOMTYPE_ENDPOINT}/delete/${id}`, {
      headers: getAuthHeaders(),
    });
    return true;
  } catch (error) {
    console.error(
      `Error al eliminar tipo de habitación ${id}:`,
      error.response || error
    );
    throw new Error(
      error.response?.data?.message ||
        "Error al eliminar el tipo de habitación."
    );
  }
};
