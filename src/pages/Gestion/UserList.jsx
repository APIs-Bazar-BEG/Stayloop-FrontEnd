// src/pages/Gestion/UserList.jsx

import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAllUsers,
  deleteUser,
  generateReport,
} from "../../services/AdminService";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

// --- CONSTANTES DE DISEÑO Y ROLES (mantener consistentes) ---
const VAR_PRIMARY_COLOR = "bg-blue-600";
const VAR_SECONDARY_COLOR = "bg-gray-100";
const VAR_BORDER_COLOR = "border-gray-300";
const VAR_TEXT_SECONDARY = "text-gray-500";

const ROLES = {
  1: {
    name: "Administrador",
    stringName: "admin",
    color: "bg-red-100 text-red-800",
  },
  2: {
    name: "Cliente",
    stringName: "cliente",
    color: "bg-blue-100 text-blue-800",
  },
  3: {
    name: "Hotel",
    stringName: "hotel",
    color: "bg-green-100 text-green-800",
  },
  0: {
    name: "Sin Rol",
    stringName: "none",
    color: "bg-gray-100 text-gray-800",
  },
};

const getRoleIdByName = (name) => {
  if (name === "Todos los roles") return null;
  const roleEntry = Object.entries(ROLES).find(
    ([, role]) => role.name === name
  );
  return roleEntry ? roleEntry[0] : null;
};

const getRolDisplay = (user) => {
  // Usamos user.idRol para buscar el rol
  const rolId = String(user.idRol || 0);
  const roleData = ROLES[rolId] || ROLES[0];
  const nombreRol = roleData.name;
  const colorClass = roleData.color;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}
    >
      {nombreRol}
    </span>
  );
};

// --------------------------------------------------------

const UserList = () => {
  const navigate = useNavigate();

  // --- ESTADOS ---
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para los filtros
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [rolFilter, setRolFilter] = useState("");

  // 🚨 ESTADOS CRÍTICOS PARA PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  // Función principal para obtener datos de la API.
  const fetchUsers = useCallback(
    async (page, name, email, rolName) => {
      setLoading(true);
      setError(null);

      const filterId = getRoleIdByName(rolName);

      const params = {
        page: page,
        size: pageSize,
        ...(name && { nombre: name }),
        ...(email && { email: email }),
        ...(filterId && filterId !== "0" && { idRol: filterId }),
      };

      try {
        const data = await getAllUsers(params);

        const userList =
          data?.content || data?.items || (Array.isArray(data) ? data : []);
        setUsers(userList);

        setTotalPages(data?.totalPages || 1);
        setCurrentPage(data?.number || 0);
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
        setError(err.message || "No se pudo cargar la lista de usuarios.");
        setUsers([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  // Hook: Se ejecuta en la carga inicial y cada vez que cambian los filtros/página.
  useEffect(() => {
    fetchUsers(currentPage, searchName, searchEmail, rolFilter);
  }, [fetchUsers, currentPage, searchName, searchEmail, rolFilter]);

  // Manejador del submit de filtros
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    if (currentPage === 0) {
      fetchUsers(0, searchName, searchEmail, rolFilter);
    }
  };

  // Lógica para generar los números de página que se mostrarán (máx. 5, por ejemplo)
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  // Función para manejar el cambio de página
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 0 && pageNumber < totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Lógica de eliminación (mantenida, usando user._id)
  const handleDelete = async (userId) => {
    if (window.confirm(`¿Estás seguro de eliminar el usuario ID: ${userId}?`)) {
      try {
        await deleteUser(userId);
        fetchUsers(currentPage, searchName, searchEmail, rolFilter);
      } catch (err) {
        setError(err.message || "Error al eliminar el usuario.");
      }
    }
  };

  const roleNames = [
    "Todos los roles",
    ...Object.values(ROLES)
      .map((role) => role.name)
      .filter((name) => name !== "Sin Rol"),
  ];

  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-24 py-8">
      <div className="max-w-7xl mx-auto">
        {/* --- TÍTULO Y BOTONES --- */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-800">
            Gestión de usuarios
          </h1>
          <div className="flex items-center gap-3">
            {/* ➕ Nuevo Usuario */}
            <Link
              to="/gestion/usuarios/crear"
              className={`flex items-center justify-center gap-2 h-10 px-6 ${VAR_PRIMARY_COLOR} text-white text-sm font-bold rounded-full shadow-md hover:bg-green-600 transition-all`}
            >
              <PlusIcon className="h-5 w-5 text-white" />
              <span>Nuevo Usuario</span>
            </Link>

            {/* Botones de Reporte */}
            <button
              onClick={() => generateReport("download")}
              className="text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm"
            >
              Descargar reporte
            </button>
            <button
              onClick={() => generateReport("print")}
              className="text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm"
            >
              Imprimir reporte
            </button>
          </div>
        </div>

        {/* --- FILTRO Y TABLA --- */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          {/* --- FILTRO --- */}
          <form
            onSubmit={handleFilterSubmit}
            className="flex flex-wrap items-center gap-4 mb-4"
          >
            <div className="relative w-full md:w-auto md:flex-1 flex gap-4 m-2">
              <input
                className={`w-full pl-4 pr-4 py-2 h-10 border ${VAR_BORDER_COLOR} rounded-full ${VAR_SECONDARY_COLOR} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                placeholder="Buscar por nombre."
                name="nombre"
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
              <input
                className={`w-full pl-4 pr-4 py-2 h-10 border ${VAR_BORDER_COLOR} rounded-full ${VAR_SECONDARY_COLOR} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                placeholder="Buscar por email."
                name="email"
                type="text"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${VAR_TEXT_SECONDARY}`}>
                Filtrar por:
              </span>
              <div className="relative">
                <select
                  className={`appearance-none h-10 pl-4 pr-8 ${VAR_SECONDARY_COLOR} border ${VAR_BORDER_COLOR} rounded-full text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                  name="idRol"
                  value={rolFilter}
                  onChange={(e) => setRolFilter(e.target.value)}
                >
                  {roleNames.map((name) => (
                    <option
                      key={name}
                      value={name === "Todos los roles" ? "" : name}
                    >
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="rounded-full flex items-center rounded-full bg-white text-slate-900 shadow-sm border border-stone-200 p-2"
              >
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </form>

          {/* --- TABLA --- */}
          <div className="overflow-x-auto @container">
            <table className="w-full text-left">
              <thead>
                <tr className={`border-b border-gray-200`}>
                  <th
                    className={`table-column-name px-4 py-3 text-sm font-semibold uppercase tracking-wider ${VAR_TEXT_SECONDARY}`}
                  >
                    Nombre
                  </th>
                  <th
                    className={`table-column-email px-4 py-3 text-sm font-semibold uppercase tracking-wider ${VAR_TEXT_SECONDARY}`}
                  >
                    Email
                  </th>
                  <th
                    className={`table-column-role px-4 py-3 text-sm font-semibold uppercase tracking-wider ${VAR_TEXT_SECONDARY}`}
                  >
                    Rol
                  </th>
                  <th
                    className={`table-column-actions px-4 py-3 text-sm font-semibold uppercase tracking-wider text-right ${VAR_TEXT_SECONDARY}`}
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      {loading
                        ? "Cargando..."
                        : "No se encontraron usuarios con los filtros aplicados."}
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user._id}
                      className={`border-b border-gray-200 hover:${VAR_SECONDARY_COLOR} transition-colors`}
                    >
                      <td className="table-column-name px-4 py-3 align-middle">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{user.nombre}</span>
                        </div>
                      </td>
                      <td className="table-column-email px-4 py-3 text-gray-500 align-middle">
                        {user.email}
                      </td>
                      <td className="table-column-role px-4 py-3 align-middle">
                        {getRolDisplay(user)}
                      </td>
                      <td className="table-column-actions px-4 py-3 text-right align-middle">
                        <div className="inline-flex rounded-full bg-white shadow-sm border border-stone-200">
                          <Link
                            to={`/gestion/usuarios/editar/${user._id}`}
                            className="group p-2 rounded-l-full hover:bg-yellow-400 transition-colors "
                            title="Editar"
                          >
                            <PencilIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-800" />
                          </Link>
                          <Link
                            to={`/gestion/usuarios/eliminar/${user._id}`}
                            className="group p-2 hover:bg-red-600 transition-colors border-l border-stone-200"
                            title="Eliminar"
                          >
                            <TrashIcon className="h-4 w-4 text-gray-400 group-hover:text-white" />
                          </Link>
                          <Link
                            to={`/gestion/usuarios/detalles/${user._id}`} // 🚨 CORRECCIÓN 4: Usamos user._id
                            className="group p-2 rounded-r-full hover:bg-blue-600 transition-colors border-l border-stone-200"
                            title="Ver Detalle"
                          >
                            <EyeIcon className="h-4 w-4 text-gray-400 group-hover:text-white" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* --- PAGINACIÓN CORREGIDA --- */}
            {totalPages > 1 && (
              <div className="mt-4 flex justify-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50 text-sm font-medium"
                >
                  Anterior
                </button>
                {pageNumbers.map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 border rounded text-sm font-medium transition-colors 
                                            ${
                                              currentPage === pageNum
                                                ? `bg-blue-600 text-white border-blue-600`
                                                : `hover:bg-gray-200 border-gray-300 text-gray-700`
                                            }`}
                  >
                    {pageNum + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50 text-sm font-medium"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>

          <style>
            {`
                            @media (max-width: 640px) {
                                .table-column-email,
                                .table-column-role {
                                    display: none;
                                }
                                .table-column-actions {
                                    text-align: left;
                                    padding-left: 58px;
                                }
                            }
                        `}
          </style>
        </div>
      </div>
    </div>
  );
};

export default UserList;
