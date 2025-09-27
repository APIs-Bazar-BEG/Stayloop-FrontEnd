import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getZonas } from '../../services/zonasService'; 


const ZonasList = () => {
  const [zonas, setZonas] = useState([]);
  const [pageNumbers, setPageNumbers] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [nombre, setNombre] = useState(searchParams.get("nombre") || "");
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);

  // Fetch zonas desde API
useEffect(() => {
  const fetchZonas = async () => {
    try {
      const allZonas = await getZonas(); // llama a la API real
      setZonas(allZonas || []); // si tu API devuelve un array
      // Si la API devuelve paginado con totalPages, ajusta pageNumbers
      setPageNumbers(Array.from({ length: Math.ceil(allZonas.length / 10) }, (_, i) => i + 1));
    } catch (err) {
      console.error("Error cargando zonas:", err);
    }
  };

  fetchZonas();
}, [page, nombre]);

  // Manejar búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // reinicia a la primera página
    setSearchParams({ nombre });
  };

  return (
    <div
      className="px-10 lg:px-40 flex flex-1 justify-center py-8"
      style={{
        background:
          "radial-gradient(circle, rgba(247,243,240,0.5) 0%, rgba(255,255,255,1) 60%)",
      }}
    >
      <div className="flex flex-col w-full max-w-5xl">
        {/* Título */}
        <h2 className="text-3xl font-bold tracking-tight mb-6 text-gray-800">
          Gestión de Zonas
        </h2>

        {/* Buscador */}
        <form
          onSubmit={handleSearch}
          className="flex w-full items-center rounded-full bg-white shadow-lg border border-gray-100 h-14 mb-8"
        >
          <div className="pl-6 pr-3 text-gray-500">
            🔍
          </div>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Buscar zona..."
            className="flex-grow w-full h-full text-gray-800 focus:outline-none border-none bg-transparent placeholder:text-gray-400 text-base"
          />
          <button
            type="submit"
            className="bg-green-500 text-white font-bold rounded-full h-10 px-6 mr-2 hover:bg-green-600"
          >
            Buscar
          </button>
        </form>

        {/* Botón crear */}
        <div className="mb-6">
          <Link
            to="/zonas/create"
            className="bg-green-500 text-white rounded-full px-6 py-2 font-bold text-sm hover:bg-green-600"
          >
            + Nueva Zona
          </Link>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Hoteles</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {zonas.length > 0 ? (
                zonas.map((zona) => (
                  <tr key={zona.id}>
                    <td className="px-6 py-4 text-sm text-gray-700">{zona.id}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-800">
                      {zona.nombre}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {zona.descripcion}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {zona.hoteles?.length || 0}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        to={`/zonas/edit/${zona.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium mr-4"
                      >
                        Editar
                      </Link>
                      <Link
                        to={`/zonas/delete/${zona.id}`}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Eliminar
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No se encontraron zonas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {pageNumbers.length > 0 && (
          <div className="flex justify-center mt-6">
            <ul className="inline-flex -space-x-px">
              {pageNumbers.map((num) => (
                <li key={num}>
                  <button
                    onClick={() => setPage(num)}
                    className={`px-4 py-2 border border-gray-300 rounded-lg mx-1 text-sm font-medium transition ${
                      num === page
                        ? "bg-green-500 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {num}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZonasList;
