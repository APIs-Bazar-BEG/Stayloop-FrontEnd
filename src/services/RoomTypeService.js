// src/services/RoomTypeService.js

// Función dummy temporal que simula la obtención de un tipo de habitación por ID.
export const getRoomTypeById = async (id) => {
  console.warn(
    `[RoomTypeService] Usando función dummy para ID de Tipo de Habitación: ${id}`
  );

  // Devuelve un objeto simulado que tiene la propiedad 'nombre' que tu lista necesita.
  return {
    id: id,
    nombre: `Tipo de Habitación #${id} (PENDIENTE)`,
  };
};
