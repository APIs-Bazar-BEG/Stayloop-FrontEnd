// src/pages/Reservas/ReservationCreate.jsx

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createReservation } from "../../services/ReservationService";
// Asumimos que tienes estos servicios listos para cargar los detalles por ID:
import { getHotelDetail } from "../../services/hotelesService";
import { getRoomTypeById } from "../../services/RoomTypeService";
import { getUserById } from "../../services/UserService";
// Asume que la ID del usuario logueado está disponible (e.g., de tu AuthContext o localStorage)

// --- MOCK DATA / ASUNCIONES INICIALES ---
// En una app real, estos IDs vendrían de los props, el AuthContext, o la URL.
const MOCK_IDS = {
  // Reemplaza esto con la forma real de obtener los IDs
  idUsuario: "68d730b89af0145fd925b561", // ID del usuario logueado
  idHotel: 1, // ID del hotel seleccionado
  idTipoHabitacion: 1, // ID del tipo de habitación seleccionado
};
// ----------------------------------------

// Función para obtener la hora local en formato datetime-local (YYYY-MM-DDTHH:MM)
const getLocalDatetime = (date = new Date()) => {
  const offset = date.getTimezoneOffset();
  const localTime = new Date(date.getTime() - offset * 60000).toISOString();
  return localTime.slice(0, 16);
};

const ReservationCreate = () => {
  const navigate = useNavigate();
  // const { idHotel, idRoomType } = useParams(); // Usar si vienen de la URL

  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState(null);
  const [metadata, setMetadata] = useState({
    usuario: null,
    hotel: null,
    tipoHabitacion: null,
    precioPorNoche: 0,
  });

  // 1. Inicializar el formulario
  const [form, setForm] = useState({
    idUsuario: MOCK_IDS.idUsuario,
    idHotel: MOCK_IDS.idHotel,
    idTipoHabitacion: MOCK_IDS.idTipoHabitacion,
    fechaRealizado: getLocalDatetime(), // Se inicializa con la hora actual
    fechaInicio: "",
    fechaFin: "",
    total: 0.0,
  });
  const [validationErrors, setValidationErrors] = useState({});

  // 2. Carga inicial de datos (Metadata: Usuario, Hotel, Habitación)
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        // Aquí usamos los IDs mock, pero usarías los IDs reales de tu sistema
        const [user, hotel, roomType] = await Promise.all([
          getUserById(MOCK_IDS.idUsuario),
          getHotelDetail(MOCK_IDS.idHotel),
          getRoomTypeById(MOCK_IDS.idTipoHabitacion),
        ]);

        setMetadata({
          usuario: user,
          hotel: hotel,
          tipoHabitacion: roomType,
          precioPorNoche: roomType.costo || 0,
        });
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar metadata:", err);
        setSubmitError(
          "No se pudo cargar la información esencial (usuario, hotel, habitación)."
        );
        setLoading(false);
      }
    };
    fetchMetadata();
  }, []);

  // 3. Cálculo del Total (Función que se ejecuta con el cambio de fechas)
  const calcularTotal = useCallback(() => {
    const { fechaInicio, fechaFin } = form;
    const precio = metadata.precioPorNoche;

    if (fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);

      if (fin > inicio && !isNaN(precio)) {
        // Calcular la diferencia en días (redondeado hacia arriba)
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
    calcularTotal();
  }, [calcularTotal]);

  // 4. Manejo de cambios en el formulario
  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    // Limpiar errores de validación si el usuario corrige el campo
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
      await createReservation(form);
      alert("Reserva creada con éxito!");
      // Redirigir a la lista de reservas o al detalle de la nueva reserva
      navigate(`/reservas`);
    } catch (error) {
      setSubmitError(`Error al crear la reserva: ${error}`);
    }
  };

  if (loading)
    return (
      <div className="text-center py-10">Cargando datos de la reserva...</div>
    );

  // Preparar texto para fecha realizado (solo visualización)
  const fechaRealizadoTexto = new Date(form.fechaRealizado).toLocaleString(
    "es-ES",
    {
      dateStyle: "short",
      timeStyle: "short",
    }
  );

  const primaryColor = "green"; // Usar un color temático de Tailwind para el botón de 'Crear'

  return (
    <div className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 shadow-xl rounded-lg">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Crear Reserva
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
          {/* Usuario (Solo lectura) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Usuario
            </label>
            <span className="mt-1 block w-full border rounded-md p-2 bg-gray-100 text-gray-800">
              {metadata.usuario ? metadata.usuario.nombre : "No disponible"}
            </span>
            <input
              type="hidden"
              id="idUsuario"
              name="idUsuario"
              value={form.idUsuario}
            />
          </div>

          {/* Hotel (Solo lectura) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hotel
            </label>
            <span className="mt-1 block w-full border rounded-md p-2 bg-gray-100 text-gray-800">
              {metadata.hotel ? metadata.hotel.nombre : "No disponible"}
            </span>
            <input
              type="hidden"
              id="idHotel"
              name="idHotel"
              value={form.idHotel}
            />
          </div>

          {/* Tipo de habitación (Solo lectura) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo de habitación
            </label>
            <span className="mt-1 block w-full border rounded-md p-2 bg-gray-100 text-gray-800">
              {metadata.tipoHabitacion
                ? `${
                    metadata.tipoHabitacion.nombre
                  } ($${metadata.precioPorNoche.toFixed(2)}/noche)`
                : "No disponible"}
            </span>
            <input
              type="hidden"
              id="idTipoHabitacion"
              name="idTipoHabitacion"
              value={form.idTipoHabitacion}
            />
          </div>

          {/* Fecha realizado (Solo lectura) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha realizado
            </label>
            <span className="mt-1 block w-full border rounded-md p-2 bg-gray-100 text-gray-800">
              {fechaRealizadoTexto}
            </span>
            <input
              type="hidden"
              id="fechaRealizado"
              name="fechaRealizado"
              value={form.fechaRealizado}
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
              min={getLocalDatetime()} // Opcional: Impedir fechas pasadas
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
              min={form.fechaInicio || getLocalDatetime()} // Asegurar que sea posterior a la fecha inicio
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
              className={`flex w-full justify-center rounded-full border border-transparent
                                bg-${primaryColor}-600 py-3 px-4 text-sm font-bold text-white
                                shadow-sm hover:bg-${primaryColor}-700 transition-colors focus:outline-none
                                focus:ring-2 focus:ring-${primaryColor}-500 focus:ring-offset-2`}
            >
              Crear
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(`/reservas/detallehotel/${MOCK_IDS.idHotel}`)
              } // Asume ruta de detalle de hotel
              className="flex w-full justify-center rounded-full border border-gray-300
                                bg-gray-100 text-slate-950 py-3 px-4 text-sm font-bold shadow-sm
                                hover:bg-red-500 hover:text-white transition-colors focus:outline-none"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationCreate;
