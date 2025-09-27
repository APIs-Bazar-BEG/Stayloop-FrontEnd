//Jira
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateZona,getZonaById } from '../../services/zonasService';      // requiere token

// Nombre del componente corregido a UpdateZona
const UpdateZona = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Estado para los datos del formulario (nombre y descripcion)
    const [zonaData, setZonaData] = useState({ 
        nombre: '', 
        descripcion: '' 
    });
    
    // Estados de control de la UI
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    
    // Lista de hoteles asociados (inicializada a vacío)
    const [hoteles, setHoteles] = useState([]); 

    // 1. Efecto para cargar los datos existentes de la zona
    useEffect(() => {
        const fetchZona = async () => {
            try {
                const data = await getZonaById(id);
                
                // Si la zona no existe o es nula, lanzamos un error
                if (!data || !data.nombre) {
                    throw new Error("Zona no encontrada.");
                }

                // Rellenar el estado con los datos cargados
                setZonaData({
                    nombre: data.nombre || '',
                    descripcion: data.descripcion || ''
                });
                
                // Cargar hoteles asociados (si la API los devuelve en 'data.hoteles', sino usa un mock o vacío)
                if (data.hoteles && Array.isArray(data.hoteles)) {
                    setHoteles(data.hoteles); 
                } else {
                    // MOCK DE HOTELES si la propiedad no existe
                    /* setHoteles([
                        { id: 1, nombre: "Hotel Las Estrellas (Mock)" },
                        { id: 2, nombre: "Resort del Sol (Mock)" }
                    ]); */
                    setHoteles([]);
                }
                
                setLoading(false);
            } catch (err) {
                console.error("Error al cargar la zona:", err);
                setError(`No se pudo cargar la zona ${id} para edición.`);
                setLoading(false);
            }
        };
        fetchZona();
    }, [id]);

    // Manejador genérico para cambios en los inputs
    const handleChange = (e) => {
        const { id, value } = e.target;
        setZonaData(prev => ({ ...prev, [id]: value }));
    };

    // Manejador para el envío del formulario de actualización
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setIsSaving(true);

        try {
            // Llamar al servicio de actualización
            await updateZona(id, zonaData);
            setSuccess(true);
            
            // Redirigir a la lista con un mensaje de éxito
            setTimeout(() => {
                navigate('/zonas', { state: { successMessage: `Zona "${zonaData.nombre}" actualizada correctamente.` } });
            }, 1500);

        } catch (err) {
            setIsSaving(false);
            const errorMessage = err?.response?.data?.message || 'Error al actualizar la zona. Verifica los datos.';
            setError(errorMessage);
        }
    };

    if (loading) {
        return <div className="text-center py-10 text-gray-500">Cargando datos de la zona...</div>;
    }
    
    // Si no se pudo cargar la zona (error es true) y loading es false
    if (error && !zonaData.nombre) {
        return <div className="text-center py-10 text-red-500 font-bold">{error}</div>;
    }


    return (
        <div className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-lg">
                {/* Título */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Editar Zona</h2>
                    <p className="mt-4 text-lg leading-6 text-gray-500">
                        Cambia los datos de la zona ID: <span className="font-mono bg-gray-100 p-1 rounded text-sm">{id}</span>
                    </p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white p-8 shadow-xl rounded-2xl">
                    
                    {/* Mensajes de feedback */}
                    {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-xl border border-red-200">{error}</div>}
                    {success && <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-xl border border-green-200">¡Actualización exitosa! Redirigiendo...</div>}

                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900" htmlFor="nombre">Nombre</label>
                        <div className="mt-1">
                            <input
                                id="nombre"
                                type="text"
                                value={zonaData.nombre}
                                onChange={handleChange}
                                placeholder="Ingrese el nombre de la zona"
                                required
                                className="form-input block w-full rounded-xl border-gray-300 bg-gray-50
                                             placeholder:text-gray-500 focus:border-blue-500
                                             focus:ring-blue-500 sm:text-sm py-3 px-4 transition duration-150 ease-in-out"
                            />
                        </div>
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900" htmlFor="descripcion">Descripción</label>
                        <div className="mt-1">
                            <textarea
                                id="descripcion"
                                rows="4"
                                value={zonaData.descripcion}
                                onChange={handleChange}
                                placeholder="Ingrese la descripción"
                                className="form-input block w-full rounded-xl border-gray-300 bg-gray-50
                                             placeholder:text-gray-500 focus:border-blue-500
                                             focus:ring-blue-500 sm:text-sm py-3 px-4 transition duration-150 ease-in-out"
                            />
                        </div>
                    </div>
                    
                    {/* Lista de hoteles asociados */}
                    <div className="pt-2 border-t border-gray-200">
                        <label className="block text-sm font-bold text-gray-900">Hoteles asociados</label>
                        <ul className="mt-2 list-disc list-inside pl-2 text-gray-700 space-y-1 bg-gray-50 p-3 rounded-xl border border-gray-200">
                            {hoteles.length > 0 ? (
                                hoteles.map((hotel, index) => (
                                    <li key={index} className="text-sm">
                                        <span className="font-semibold">{hotel.nombre}</span> (ID: {hotel.id})
                                    </li>
                                ))
                            ) : (
                                <li className="text-sm text-gray-500">No hay hoteles asociados a esta zona.</li>
                            )}
                        </ul>
                        <p className="mt-1 text-xs text-gray-500">
                            (La gestión de hoteles se realiza en su propio módulo.)
                        </p>
                    </div>

                    {/* Botones */}
                    <div className="flex flex-col sm:flex-row-reverse gap-4 pt-4">
                        <button 
                            type="submit"
                            disabled={isSaving}
                            className={`flex w-full justify-center rounded-full border border-transparent
                                        ${isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} py-3 px-4 text-sm font-bold text-white
                                        shadow-lg transition-all duration-300 transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2`}
                        >
                            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                        <button 
                            type="button"
                            onClick={() => navigate('/zonas')}
                            className="flex w-full justify-center rounded-full border border-gray-300
                                        bg-gray-100 text-slate-950 py-3 px-4 text-sm font-bold shadow-md
                                        hover:bg-gray-200 transition-all duration-300 transform hover:scale-[1.01] focus:outline-none
                                        focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateZona;
