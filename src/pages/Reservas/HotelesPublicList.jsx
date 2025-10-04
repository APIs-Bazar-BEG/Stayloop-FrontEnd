// src/pages/Reservas/HotelesPublicList.jsx
import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getHoteles } from "../../services/HotelesService";
import { getZonas } from "../../services/ZonasService";

const HotelesPublicList = () => {
  const [hoteles, setHoteles] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Estado del formulario de búsqueda
  const [searchData, setSearchData] = useState({
    nombre: searchParams.get("nombre") || "",
    idZona: searchParams.get("zona") || "",
    page: parseInt(searchParams.get("page")) || 1,
    // Añade 'size' si tu API lo requiere
  });

  // 1. Cargar Zonas (para el filtro)
  useEffect(() => {
    const loadZonas = async () => {
      try {
        const data = await getZonas(); // Asume que devuelve un array de zonas
        setZonas(data);
      } catch (err) {
        console.error("Error al cargar zonas:", err);
        // No detenemos la carga si fallan solo las zonas
      }
    };
    loadZonas();
  }, []);

  // 2. Cargar Hoteles (con filtros)
  useEffect(() => {
    const loadHoteles = async () => {
      setLoading(true);
      setError(null);
      try {
        // Adaptar parámetros para tu API (ej: 'idZona' a 'zona')
        const params = {
          nombre: searchData.nombre,
          zona: searchData.idZona,
          page: searchData.page,
        };

        // Filtramos los parámetros nulos/vacíos
        const filteredParams = Object.fromEntries(
          Object.entries(params).filter(([_, v]) => v)
        );

        // Actualiza la URL para reflejar la búsqueda
        setSearchParams(filteredParams, { replace: true });

        // Llama al servicio de API
        const data = await getHoteles(filteredParams);
        // Asumimos que getHoteles devuelve un objeto { content: [...hoteles], totalPages: N, number: pageIndex }
        setHoteles(data.content || []);
        // Aquí podrías manejar la paginación con totalPages
      } catch (err) {
        console.error("Error al cargar hoteles:", err);
        setError("Fallo al cargar la lista de hoteles.");
        setHoteles([]);
      } finally {
        setLoading(false);
      }
    };
    loadHoteles();
  }, [searchData, setSearchParams]);

  const handleInputChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value,
      page: 1, // Siempre que se cambie un filtro, volvemos a la página 1
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // El useEffect se encargará de recargar los hoteles cuando searchData cambie
  };

  // Placeholder para la imagen de portada
  const getHotelPortadaUrl = (id) => `/hotel/portada/${id}`;

  // Placeholder para la paginación (simulada)
  const pageNumbers = [1, 2, 3, 4, 5]; // Reemplazar con lógica de paginación real (ej: data.totalPages)

  return (
    <div className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
      <main className="container mx-auto px-6 py-8 flex-grow">
        {/* Formulario de Búsqueda */}
        <form
          onSubmit={handleSearchSubmit}
          className="bg-white p-6 rounded-lg shadow-md mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="nombre"
              >
                Nombre
              </label>
              <input
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 bg-gray-100"
                id="nombre"
                name="nombre"
                placeholder="ej. Real Intercontinental"
                type="text"
                value={searchData.nombre}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="zona"
              >
                Zona
              </label>
              <select
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 bg-gray-100"
                id="zona"
                name="idZona"
                value={searchData.idZona}
                onChange={handleInputChange}
              >
                <option value="">Seleccione una zona</option>
                {zonas.map((zona) => (
                  <option key={zona.id} value={zona.id}>
                    {zona.nombre}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="bg-blue-600 text-white w-full rounded-lg h-10 flex items-center justify-center gap-2 text-base font-bold hover:bg-blue-700 transition-colors"
              type="submit"
            >
              {/* SVG de búsqueda */}
              <svg
                fill="currentColor"
                height="20"
                viewBox="0 0 256 256"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
              </svg>
              Buscar
            </button>
          </div>
        </form>

        <div className="flex flex-col lg:flex-row gap-8">
          <section className="w-full">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Ver Hoteles
            </h2>

            {loading && <p className="text-center">Cargando hoteles...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && hoteles.length === 0 && (
              <p className="text-center text-gray-500">
                No se encontraron hoteles con los criterios de búsqueda.
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hoteles.map((item) => (
                <div
                  key={item.id}
                  className="w-[322px] bg-white rounded-lg shadow-md overflow-hidden group transform hover:-translate-y-1 transition-transform duration-300"
                >
                  <img
                    className="w-full h-[192px] object-cover"
                    src={getHotelPortadaUrl(item.id)}
                    alt={`Portada del hotel ${item.nombre}`}
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800">
                      {item.nombre}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.direccion}
                    </p>
                    <div className="mt-4 flex justify-between items-center">
                      {/* Ruta al detalle del hotel */}
                      <Link
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                        to={`/reservas/detallehotel/${item.id}`} // Usamos la ruta definida en Thymeleaf
                      >
                        Ver Hotel
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Paginación */}
        <div className="mt-8 flex justify-center gap-2">
          {pageNumbers.map((pageNum) => (
            <Link
              key={pageNum}
              to={`?nombre=${searchData.nombre}&zona=${searchData.idZona}&page=${pageNum}`}
              className={`px-3 py-1 border rounded transition-colors ${
                searchData.page === pageNum
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() =>
                setSearchData((prev) => ({ ...prev, page: pageNum }))
              }
            >
              {pageNum}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HotelesPublicList;
