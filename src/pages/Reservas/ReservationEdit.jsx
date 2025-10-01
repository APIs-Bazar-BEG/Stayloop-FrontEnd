// src/pages/Reservas/ReservationEdit.jsx

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getReservationById,
  updateReservation,
} from "../../services/ReservationService";
// Asumimos que estos servicios están listos:
import { getHotelDetail } from "../../services/hotelesService";
import { getRoomTypeById } from "../../services/RoomTypeService";
import { getUserById } from "../../services/UserService";

// Función para formatear fechas a YYYY-MM-DDTHH:MM (el formato que requiere el input datetime-local)
const formatToDatetimeLocal = (dateString) => {
  if (!dateString) return "";

  // Si la fecha ya está en formato ISO, usar directamente
  const date = new Date(dateString);
  if (isNaN(date)) return "";

  // Convertir a formato local para el input
  const offset = date.getTimezoneOffset() * 60000;
  const localTime = new Date(date.getTime() - offset)
    .toISOString()
    .slice(0, 16);
  return localTime;
};

const ReservationEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Obtiene el ID de la URL: /reservas/edit/:id

  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState(null);
  const [metadata, setMetadata] = useState({
    usuario: null,
    hotel: null,
    tipoHabitacion: null,
    precioPorNoche: 0,
  });

  // 1. Estado inicial del formulario
  const [form, setForm] = useState({
    id: id,
    idUsuario: "",
    idHotel: "",
    idTipoHabitacion: "",
    fechaRealizado: "",
    fechaInicio: "",
    fechaFin: "",
    total: 0.0,
  });
  const [validationErrors, setValidationErrors] = useState({});

  // 2. Carga inicial de datos (Reserva y Metadata)
  useEffect(() => {
    const fetchReservationData = async () => {
      if (!id) {
        setSubmitError("ID de reserva no proporcionado.");
        setLoading(false);
        return;
      }
      try {
        // Paso 1: Obtener la reserva por ID
        const reservation = await getReservationById(id);

        // Paso 2: Obtener la metadata relacionada
        const [user, hotel, roomType] = await Promise.all([
          getUserById(reservation.idUsuario),
          getHotelDetail(reservation.idHotel),
          getRoomTypeById(reservation.idTipoHabitacion),
        ]);

        // Paso 3: Rellenar el formulario con los datos existentes
        setForm({
          id: id,
          idUsuario: reservation.idUsuario,
          idHotel: reservation.idHotel,
          idTipoHabitacion: reservation.idTipoHabitacion,
          // Formatear las fechas para el input type="datetime-local"
          fechaRealizado: formatToDatetimeLocal(reservation.fechaRealizado),
          fechaInicio: formatToDatetimeLocal(reservation.fechaInicio),
          fechaFin: formatToDatetimeLocal(reservation.fechaFin),
          total: reservation.total || 0.0,
        });

        // Paso 4: Establecer la metadata
        setMetadata({
          usuario: user,
          hotel: hotel,
          tipoHabitacion: roomType,
          precioPorNoche: roomType.costo || 0,
        });
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setSubmitError(`No se pudo cargar la reserva #${id}.`);
        setLoading(false);
      }
    };
    fetchReservationData();
  }, [id]);

  // 3. Cálculo del Total (Función que se ejecuta con el cambio de fechas)
  const calcularTotal = useCallback(() => {
    const { fechaInicio, fechaFin } = form;
    const precio = metadata.precioPorNoche;

    if (fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);

      if (fin > inicio && !isNaN(precio)) {
        const diffTiempo = fin.getTime() - inicio.getTime();
        const diffDias = Math.ceil(diffTiempo / (1000 * 3600 * 24));
        const totalCalculado = diffDias * precio;

        setForm((prev) => ({
          ...prev,
          total: parseFloat(totalCalculado.toFixed(2)),
        }));
        return;
      }
    }
    setForm((prev) => ({ ...prev, total: 0.0 }));
  }, [form.fechaInicio, form.fechaFin, metadata.precioPorNoche]);

  useEffect(() => {
    // Recalcular solo si metadata está cargada y las fechas son válidas.
    if (!loading && metadata.precioPorNoche > 0) {
      calcularTotal();
    }
  }, [calcularTotal, loading, metadata.precioPorNoche]);

  // 4. Manejo de cambios en el formulario
  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    setValidationErrors((prev) => ({ ...prev, [id]: undefined }));
  };

  // 5. Manejo del Submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setValidationErrors({});

    // Validación simple antes de enviar
    if (!form.fechaInicio || !form.fechaFin || form.total <= 0) {
      setValidationErrors({
        fechaInicio: !form.fechaInicio
          ? "La fecha de inicio es requerida."
          : undefined,
        fechaFin: !form.fechaFin ? "La fecha de fin es requerida." : undefined,
        total:
          form.total <= 0
            ? "La fecha de fin debe ser posterior a la de inicio."
            : undefined,
      });
      return;
    }

    try {
      // Eliminar el ID para el cuerpo del POST/PUT, aunque lo pasamos por la URL
      const { id: formId, ...dataToUpdate } = form;

      await updateReservation(formId, dataToUpdate);
      alert(`Reserva #${formId} actualizada con éxito!`);
      navigate(`/reservas`);
    } catch (error) {
      setSubmitError(`Error al actualizar la reserva: ${error}`);
    }
  };

  if (loading)
    return (
      <div className="text-center py-10">Cargando datos de la reserva...</div>
    );
  if (submitError && id)
    return (
      <div className="text-center py-10 text-red-600">Error: {submitError}</div>
    );

  return (
    <div className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 shadow-xl rounded-lg">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Editar Reserva #{form.id}
        </h2>

        {submitError && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
            role="alert"
          >
            <p className="font-bold">Error</p>
            <p>{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <input type="hidden" id="id" value={form.id} />
          <input type="hidden" id="idUsuario" value={form.idUsuario} />
          <input type="hidden" id="idHotel" value={form.idHotel} />
          <input
            type="hidden"
            id="idTipoHabitacion"
            value={form.idTipoHabitacion}
          />
          <input
            type="hidden"
            id="fechaRealizado"
            value={form.fechaRealizado}
          />
          <input type="hidden" id="precio" value={metadata.precioPorNoche} />

          {/* Campos de solo lectura (Metadatos) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Usuario
            </label>
            <span className="mt-1 block w-full border rounded-md p-2 bg-gray-100 text-gray-800">
              {metadata.usuario ? metadata.usuario.nombre : "Cargando..."}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hotel
            </label>
            <span className="mt-1 block w-full border rounded-md p-2 bg-gray-100 text-gray-800">
              {metadata.hotel ? metadata.hotel.nombre : "Cargando..."}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo de habitación
            </label>
            <span className="mt-1 block w-full border rounded-md p-2 bg-gray-100 text-gray-800">
              {metadata.tipoHabitacion
                ? `${
                    metadata.tipoHabitacion.nombre
                  } ($${metadata.precioPorNoche.toFixed(2)}/noche)`
                : "Cargando..."}
            </span>
          </div>

          {/* Fecha realizado (Solo lectura) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha realizado
            </label>
            <input
              type="datetime-local"
              value={form.fechaRealizado}
              disabled
              className="mt-1 block w-full border rounded-md p-2 bg-gray-200 text-gray-800"
            />
          </div>

          {/* Fecha inicio */}
          <div>
            <label
              htmlFor="fechaInicio"
              className="block text-sm font-medium text-gray-700"
            >
              Fecha inicio
            </label>
            <input
              type="datetime-local"
              id="fechaInicio"
              value={form.fechaInicio}
              onChange={handleChange}
              className={`mt-1 block w-full border rounded-md p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                validationErrors.fechaInicio
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {validationErrors.fechaInicio && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.fechaInicio}
              </p>
            )}
          </div>

          {/* Fecha fin */}
          <div>
            <label
              htmlFor="fechaFin"
              className="block text-sm font-medium text-gray-700"
            >
              Fecha fin
            </label>
            <input
              type="datetime-local"
              id="fechaFin"
              value={form.fechaFin}
              onChange={handleChange}
              min={form.fechaInicio || ""}
              className={`mt-1 block w-full border rounded-md p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                validationErrors.fechaFin ? "border-red-500" : "border-gray-300"
              }`}
            />
            {validationErrors.fechaFin && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.fechaFin}
              </p>
            )}
            {validationErrors.total &&
              validationErrors.total !== validationErrors.fechaFin && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.total}
                </p>
              )}
          </div>

          {/* Total (Solo lectura) */}
          <div>
            <label
              htmlFor="total"
              className="block text-sm font-medium text-gray-700"
            >
              Total
            </label>
            <input
              type="number"
              step="0.01"
              id="total"
              value={form.total.toFixed(2)}
              readOnly
              placeholder="Total"
              className="mt-1 block w-full border rounded-md p-2 bg-gray-200 text-gray-800 font-bold"
            />
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row-reverse gap-4 pt-4">
            <button
              type="submit"
              className="flex w-full justify-center rounded-full border border-transparent
                                bg-green-600 py-3 px-4 text-sm font-bold text-white
                                shadow-sm hover:bg-green-700 transition-colors focus:outline-none
                                focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Guardar Cambios
            </button>

            <button
              type="button"
              onClick={() => navigate(`/reservas`)}
              className="flex w-full justify-center rounded-full border border-gray-300
                                bg-gray-100 text-slate-950 py-3 px-4 text-sm font-bold shadow-sm
                                hover:bg-gray-200 transition-colors focus:outline-none"
            >
              Volver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationEdit;
