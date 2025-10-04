//Jira
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getZonaById } from "../../services/ZonasService";

// Nombre del componente corregido a ReadZona (Leer)
const ReadZona = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [zona, setZona] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Efecto para cargar los datos de la zona
  useEffect(() => {
    const fetchZona = async () => {
      try {
        const data = await getZonaById(id);
        // Validación adicional en caso de que la zona no exista pero la API no lance un error 404
        if (!data || !data.id) {
          throw new Error("Zona no encontrada o datos incompletos.");
        }
        // Mock de Hoteles si la propiedad no viene
        if (!data.hoteles) {
          data.hoteles = [
            { id: 101, nombre: "Hotel Las Estrellas" },
            { id: 202, nombre: "Resort del Sol" },
          ];
        }
        setZona(data);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar la zona:", err);
        setError(`No se pudo cargar la zona ${id}.`);
        setLoading(false);
      }
    };
    fetchZona();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Cargando detalles de la zona...
      </div>
    );
  }

  // Muestra el error si no se pudo cargar la zona o si es nula
  if (error || !zona) {
    return (
      <div className="text-center py-10 text-red-500 font-bold">
        {error || "No se encontró la zona."}
      </div>
    );
  }

  // Estilo para campos de solo lectura
  const inputStyle = `form-input block w-full rounded-xl border-gray-200 bg-gray-100
                         placeholder:text-gray-400 focus:ring-0 sm:text-sm py-3 px-4 cursor-default font-mono text-gray-700`;

  return (
    <div className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        {/* Título */}
        <div className="text-center">
          <h2
            className={`text-3xl font-extrabold tracking-tight text-indigo-800 sm:text-4xl`}
          >
            Detalle de Zona
          </h2>
          <p className={`mt-2 text-md leading-6 text-gray-500`}>
            Información completa de la zona{" "}
            <span className="font-semibold">{zona.nombre}</span>
          </p>
        </div>

        {/* Contenido Solo Lectura */}
        <div className="mt-8 space-y-6 bg-white p-8 shadow-xl rounded-2xl border border-gray-200">
          {/* ID */}
          <div>
            <label
              className={`block text-sm font-medium text-gray-900`}
              htmlFor="id"
            >
              ID de Zona
            </label>
            <div className="mt-1">
              <input
                id="id"
                type="text"
                value={zona.id || "N/A"}
                className={inputStyle}
                disabled
              />
            </div>
          </div>

          {/* Nombre */}
          <div>
            <label
              className={`block text-sm font-medium text-gray-900`}
              htmlFor="nombre"
            >
              Nombre
            </label>
            <div className="mt-1">
              <input
                id="nombre"
                type="text"
                value={zona.nombre || ""}
                className={inputStyle}
                disabled
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label
              className={`block text-sm font-medium text-gray-900`}
              htmlFor="descripcion"
            >
              Descripción
            </label>
            <div className="mt-1">
              <textarea
                id="descripcion"
                rows="4"
                value={zona.descripcion || "No proporcionada"}
                className={inputStyle}
                disabled
              ></textarea>
            </div>
          </div>

          {/* Hoteles (lista asociada) */}
          <div className="pt-4 border-t border-gray-100">
            <label className={`block text-md font-bold text-indigo-700 mb-2`}>
              Hoteles Asociados
            </label>
            <ul
              className={`list-disc list-inside text-gray-700 space-y-2 bg-indigo-50 p-4 rounded-xl`}
            >
              {zona.hoteles && zona.hoteles.length > 0 ? (
                zona.hoteles.map((hotel) => (
                  // Asumiendo que hay una ruta para el detalle de hoteles
                  <li
                    key={hotel.id}
                    className="text-sm hover:text-indigo-900 transition-colors"
                  >
                    <Link
                      to={`/hoteles/detail/${hotel.id}`}
                      className="font-semibold underline"
                    >
                      {hotel.nombre} (ID: {hotel.id})
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500">
                  No hay hoteles asociados a esta zona.
                </li>
              )}
            </ul>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row-reverse gap-4 pt-4 border-t border-gray-100">
            <Link
              to={`/zonas/edit/${zona.id}`}
              className={`flex w-full justify-center rounded-full border border-transparent bg-indigo-600 hover:bg-indigo-700
                                         py-3 px-4 text-sm font-bold text-white shadow-lg transition-all duration-300 transform hover:scale-[1.01]
                                         focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-offset-2`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path
                  fillRule="evenodd"
                  d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                  clipRule="evenodd"
                />
              </svg>
              Editar Zona
            </Link>
            <button
              type="button"
              onClick={() => navigate("/zonas")}
              className="flex w-full justify-center rounded-full border border-gray-300 bg-gray-100 text-slate-950
                                         py-3 px-4 text-sm font-bold shadow-md hover:bg-gray-200 transition-all duration-300 transform hover:scale-[1.01]
                                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Regresar a Zonas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadZona;
