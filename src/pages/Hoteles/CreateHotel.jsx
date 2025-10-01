import React, { useState, useEffect, useCallback } from 'react';
import { createHotel } from './hotelsService'; // Asumimos que maneja FormData o JSON
import { getZonas } from './zonaService'; // Servicio para cargar las zonas

// Estructura del tipo de habitación, refleja tu modelo de backend
const initialRoomType = {
  nombre: '',
  cantPersonas: '',
  costo: '',
  cantHab: '',
};

const initialHotelState = {
  nombre: '',
  direccion: '',
  descripcion: '',
  idZona: -1, // Valor inicial para la selección
  idUsuario: 1, // ID del usuario que crea el hotel (debe venir del contexto de autenticación)
};

function CreateHotel() {
  const [hotelData, setHotelData] = useState(initialHotelState);
  const [roomTypes, setRoomTypes] = useState([initialRoomType]);
  const [images, setImages] = useState([]); // Almacena objetos de archivo
  const [zonas, setZonas] = useState([]); // Almacena la lista de zonas
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiMessage, setApiMessage] = useState(null);

  // 1. Cargar Zonas al inicio
  useEffect(() => {
    const fetchZonas = async () => {
      try {
        const data = await getZonas();
        setZonas(data);
      } catch (err) {
        console.error("Error al cargar zonas:", err);
      }
    };
    fetchZonas();
  }, []);

  // Función de limpieza de URL (para previsualización de imágenes)
  useEffect(() => {
    // Cuando el componente se desmonta o las imágenes cambian, revocamos las URLs creadas.
    return () => images.forEach(file => URL.revokeObjectURL(file.preview));
  }, [images]);


  // 2. Manejo de inputs básicos
  const handleHotelChange = useCallback((e) => {
    const { name, value } = e.target;
    setHotelData(prev => ({
      ...prev,
      [name]: (name === 'idZona' || name === 'idUsuario') ? Number(value) : value,
    }));
  }, []);

  // 3. Manejo de Tipos de Habitación Dinámicos
  const handleRoomTypeChange = (index, e) => {
    const { name, value } = e.target;
    const newRoomTypes = roomTypes.map((room, i) => {
      if (i === index) {
        return {
          ...room,
          // Convertir a número los campos numéricos
          [name]: (name === 'cantPersonas' || name === 'costo' || name === 'cantHab')
            ? Number(value)
            : value,
        };
      }
      return room;
    });
    setRoomTypes(newRoomTypes);
  };

  const addRoomType = () => {
    // Solo añadir si el último tipo de habitación no está vacío
    const lastRoom = roomTypes[roomTypes.length - 1];
    if (Object.values(lastRoom).some(val => val === '' || val === null)) {
        alert("Por favor, rellene los campos del tipo de habitación actual antes de añadir uno nuevo.");
        return;
    }
    setRoomTypes(prev => [...prev, { ...initialRoomType }]);
  };

  const removeRoomType = (index) => {
    setRoomTypes(prev => prev.filter((_, i) => i !== index));
  };

  // 4. Manejo de Archivos (Imágenes)
  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files).map(file => 
      // Creamos un objeto con el archivo y la URL de previsualización
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    );
    setImages(prev => [...prev, ...newFiles]);
    e.target.value = null; 
  };

  const removeImage = (fileToRemove) => {
    setImages(prev => prev.filter(file => file !== fileToRemove));
  };
  
  // 5. Manejo del Submit del Formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setApiMessage(null);

    // --- Validación Básica Frontend ---
    if (hotelData.idZona === -1 || !hotelData.idZona) {
      setError("Debe seleccionar una zona válida.");
      setLoading(false);
      return;
    }
    if (roomTypes.length === 0 || roomTypes.some(r => Object.values(r).some(val => val === '' || val === null))) {
        setError("Debe añadir al menos un tipo de habitación y completar todos sus campos.");
        setLoading(false);
        return;
    }
    // ---------------------------------
    
    // =========================================================================
    // ESTRATEGIA: ENVIAR TODO COMO JSON (Si tu backend Node/Express lo espera)
    // =========================================================================
    
    // NOTA: Esta estrategia NO enviará las imágenes a menos que tengas un
    // endpoint separado para subirlas después. Si quieres subir imágenes,
    // debes usar la estrategia de FormData.

    try {
        const hotelPayload = {
            ...hotelData,
            tiposHabitacion: roomTypes // Envío del array de habitaciones
            // Las imágenes no se envían aquí, solo la metadata JSON
        };
        
        const response = await createHotel(hotelPayload); // Llama al servicio JSON
        
        setApiMessage(`Hotel "${response.nombre}" creado con éxito!`);
        
        // Limpiar el estado después del éxito
        setHotelData(initialHotelState);
        setRoomTypes([initialRoomType]);
        setImages([]); // Limpiamos la previsualización
        
    } catch (err) {
      console.error("Error al crear hotel (JSON):", err);
      // Muestra el error del backend (ej: "El campo 'nombre' es obligatorio.")
      setError(err.message || 'Error desconocido al crear hotel.');
    } finally {
      setLoading(false);
    }
    
    // =========================================================================
    // CÓDIGO OPCIONAL PARA ENVIAR FormData (si tu backend lo soporta)
    // Descomenta y adapta el servicio si quieres incluir las imágenes:
    /*
    const formData = new FormData();
    formData.append('nombre', hotelData.nombre);
    formData.append('direccion', hotelData.direccion);
    formData.append('descripcion', hotelData.descripcion);
    formData.append('idZona', hotelData.idZona);
    formData.append('idUsuario', hotelData.idUsuario);
    
    // Serializar el array anidado a JSON para enviarlo
    formData.append('tiposHabitacion', JSON.stringify(roomTypes));
    
    images.forEach(file => {
      formData.append('images', file); 
    });
    
    try {
        const response = await createHotel(formData); // Llama al servicio FormData
        setApiMessage(`Hotel "${response.nombre}" creado con éxito!`);
        // ... (limpiar estados) ...
    } catch (err) {
        // ... (manejo de error) ...
    } finally {
        // ... (setLoading(false)) ...
    }
    */
    // =========================================================================
  };


  return (
    <div className="flex-grow bg-[var(--background-color)] items-center">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <header>
            <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">Crea un Nuevo Hotel</h1>
            <p className="mt-2 text-lg text-[var(--text-secondary)]">Rellena los campos del formulario</p>
          </header>
          
          {apiMessage && <div className="p-4 bg-green-100 text-green-700 rounded-lg">✅ {apiMessage}</div>}
          {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg">🛑 Error: {error}</div>}

          <form onSubmit={handleSubmit} className="space-y-12 md:col-span-2">
            <input type="hidden" name="authCheck" value="authCreate" />

            {/* SECCIÓN 1: Información Básica */}
            <section className="space-y-6 rounded-2xl border border-[var(--border-color)] bg-white p-6 shadow-sm" id="basic-info">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Información Básica</h3>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <label className="flex flex-col">
                  <span className="mb-1 text-sm font-medium">Nombre del Hotel</span>
                  <input 
                    className="form-input h-12 rounded-xl border-[var(--border-color)] bg-white placeholder:text-[var(--text-secondary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]" 
                    placeholder="e.g., The Grand Budapest Hotel" 
                    type="text" 
                    name="nombre"
                    value={hotelData.nombre}
                    onChange={handleHotelChange}
                    required
                  />
                </label>
                
                <label className="flex flex-col">
                  <span className="mb-1 text-sm font-medium">Zona</span>
                  <select 
                    className="form-select h-12 rounded-xl border-[var(--border-color)] bg-white text-[var(--text-secondary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]" 
                    name="idZona" 
                    value={hotelData.idZona}
                    onChange={handleHotelChange}
                    required
                  >
                    <option value={-1} disabled>Seleccione una zona</option>
                    {zonas.map((zona) => (
                      <option key={zona.id} value={zona.id}>{zona.nombre}</option>
                    ))}
                  </select>
                </label>
              </div>
            </section>

            {/* SECCIÓN 2: Dirección */}
            <section className="space-y-6 rounded-2xl border border-[var(--border-color)] bg-white p-6 shadow-sm" id="location">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Dirección</h3>
              <div className="grid grid-cols-1 gap-6">
                <label className="flex flex-col"><span className="mb-1 text-sm font-medium">Dirección completa</span>
                  <input 
                    className="form-input h-12 rounded-xl border-[var(--border-color)] bg-white placeholder:text-[var(--text-secondary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]" 
                    placeholder="Dirección aquí..." 
                    type="text" 
                    name="direccion"
                    value={hotelData.direccion}
                    onChange={handleHotelChange}
                    required
                  />
                </label>
              </div>
            </section>
            
            {/* SECCIÓN 3: Descripción */}
            <section className="space-y-6 rounded-2xl border border-[var(--border-color)] bg-white p-6 shadow-sm" id="description">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Descripción</h3>
              <div className="space-y-4">
                <label className="flex flex-col"><span className="mb-1 text-sm font-medium">Describa su hotel</span>
                  <textarea 
                    className="form-textarea min-h-32 rounded-xl border-[var(--border-color)] bg-white placeholder:text-[var(--text-secondary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]" 
                    placeholder="¿Qué hace a nuestro hotel tan especial?" 
                    name="descripcion"
                    value={hotelData.descripcion}
                    onChange={handleHotelChange}
                    required
                  />
                </label>
              </div>
            </section>
            
            {/* SECCIÓN 4: Fotos del Hotel */}
            <section className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800">Fotos del Hotel (Nota: Requiere adaptación de tu API para subir archivos)</h3>
              <div id="image-upload-container" className="flex flex-wrap gap-4">
                
                {/* Previsualizaciones */}
                {images.map((file, index) => (
                  <div key={index} className="relative h-32 w-32">
                    <img 
                      src={file.preview} // Usamos la URL de previsualización
                      alt={`Preview ${index}`} 
                      className="h-full w-full rounded-xl object-cover" 
                    />
                    <button 
                      type="button"
                      onClick={() => removeImage(file)}
                      className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white font-bold text-lg hover:bg-red-700" 
                      title="Eliminar foto"
                    >
                      &times;
                    </button>
                  </div>
                ))}
                
                {/* Botón Añadir Foto (Input) */}
                <label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-center hover:bg-gray-100">
                  <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  <span className="text-sm font-medium text-gray-500">Añadir foto</span>
                  <input 
                    type="file" 
                    name="images" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageChange}
                    multiple
                  />
                </label>
              </div>
            </section>

            {/* SECCIÓN 5: Tipos de Habitación Dinámicos */}
            <section className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800">Tipos de Habitación</h3>
              <div id="room-types-container" className="space-y-8">
                
                {roomTypes.map((room, index) => (
                  <div key={index} className="room-type-block relative rounded-lg border border-gray-200 p-4 pt-8">
                    
                    {roomTypes.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => removeRoomType(index)}
                        className="remove-room-type-btn absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200" 
                        title="Eliminar este tipo de habitación"
                      >
                        &times;
                      </button>
                    )}

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <label className="flex flex-col">
                        <span className="mb-1 text-sm font-medium">Nombre del Tipo de Habitación</span>
                        <input type="text" name="nombre" value={room.nombre} onChange={(e) => handleRoomTypeChange(index, e)} className="form-input" placeholder="Ej: Suite Deluxe" required />
                      </label>
                      <label className="flex flex-col">
                        <span className="mb-1 text-sm font-medium">Capacidad de Personas</span>
                        <input type="number" name="cantPersonas" value={room.cantPersonas} onChange={(e) => handleRoomTypeChange(index, e)} className="form-input" placeholder="Ej: 2" required />
                      </label>
                      <label className="flex flex-col">
                        <span className="mb-1 text-sm font-medium">Precio por Noche ($)</span>
                        <input type="number" step="0.01" name="costo" value={room.costo} onChange={(e) => handleRoomTypeChange(index, e)} className="form-input" placeholder="Ej: 150.00" required />
                      </label>
                      <label className="flex flex-col">
                        <span className="mb-1 text-sm font-medium">Cantidad de Habitaciones</span>
                        <input type="number" name="cantHab" value={room.cantHab} onChange={(e) => handleRoomTypeChange(index, e)} className="form-input" placeholder="Ej: 10" required />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              
              <button id="add-room-type-btn" type="button" onClick={addRoomType} className="mt-4 flex items-center gap-2 rounded-full bg-gray-100 px-5 py-2.5 text-sm font-bold text-gray-800 hover:bg-gray-200">
                <svg fill="currentColor" height="16" viewBox="0 0 256 256" width="16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
                </svg>
                <span>Añadir otro Tipo de Habitación</span>
              </button>
            </section>

            {/* Botones de Acción */}
            <div className="flex items-center justify-end gap-4 pt-6">
              <a href="/hoteles" className="rounded-full bg-[var(--secondary-color)] px-6 py-3 text-base font-bold text-[var(--text-primary)] hover:bg-red-500 hover:text-white transition-colors" type="button">Cancelar</a>
              <button 
                className="rounded-full bg-[var(--primary-color)] px-6 py-3 text-base font-bold text-white shadow-lg hover:bg-green-600 transition-colors" 
                type="submit" 
                disabled={loading}
              >
                {loading ? 'Creando...' : 'Create Hotel'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateHotel;