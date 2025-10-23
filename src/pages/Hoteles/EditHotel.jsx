import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getHotelById, updateHotel } from "../../services/hotelesService";
import { getTiposByHotelId, createTipoHabitacion, updateTipoHabitacion, deleteTipoHabitacion } from "../../services/RoomTypeService";
import { getImagesByHotelId, getImageUrl, uploadImage, deleteImage } from "../../services/ImageService";
import { getZonas } from "../../services/zonasService";

const EditHotel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    descripcion: "",
    idZona: "",
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [roomTypes, setRoomTypes] = useState([]);
  const [roomTypesToDelete, setRoomTypesToDelete] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const loadHotelData = async () => {
    try {
      setLoading(true);
      const [hotelData, roomTypesData, imagesData] = await Promise.all([
        getHotelById(id),
        getTiposByHotelId(id),
        getImagesByHotelId(id)
      ]);

      setFormData({
        nombre: hotelData.nombre || "",
        direccion: hotelData.direccion || "",
        descripcion: hotelData.descripcion || "",
        idZona: hotelData.idZona || "",
      });

      setRoomTypes(roomTypesData);
      
      const imagesWithUrls = imagesData.map(img => ({
        ...img,
        url: getImageUrl(img.id)
      }));
      setExistingImages(imagesWithUrls);

    } catch (error) {
      console.error("Error al cargar datos del hotel:", error);
      alert("Error al cargar los datos del hotel");
    } finally {
      setLoading(false);
    }
  };

  const loadZonas = async () => {
    try {
      const zonasData = await getZonas();
      setZonas(zonasData);
    } catch (error) {
      console.error("Error al cargar zonas:", error);
    }
  };

  useEffect(() => {
    loadHotelData();
    loadZonas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoomTypeChange = (index, field, value) => {
    const updatedRoomTypes = [...roomTypes];
    updatedRoomTypes[index][field] = value;
    setRoomTypes(updatedRoomTypes);
  };

  const addRoomType = () => {
    setRoomTypes([
      ...roomTypes,
      {
        nombre: "",
        cantPersonas: "",
        costo: "",
        cantHab: "",
      },
    ]);
  };

  const removeRoomType = (index) => {
    const roomType = roomTypes[index];
    if (roomType.id) {
      setRoomTypesToDelete(prev => [...prev, roomType.id]);
    }
    const updatedRoomTypes = roomTypes.filter((_, i) => i !== index);
    setRoomTypes(updatedRoomTypes);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach((file) => {
      if (!file.type.startsWith("image/")) return;

      setImages((prev) => [...prev, file]);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageId) => {
    setImagesToDelete(prev => [...prev, imageId]);
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.idZona) newErrors.idZona = "La zona es obligatoria";
    if (!formData.direccion.trim()) newErrors.direccion = "La dirección es obligatoria";
    if (!formData.descripcion.trim()) newErrors.descripcion = "La descripción es obligatoria";

    roomTypes.forEach((roomType, index) => {
      if (!roomType.nombre.trim()) newErrors[`roomType_${index}_nombre`] = "El nombre es obligatorio";
      if (!roomType.cantPersonas || roomType.cantPersonas < 1) newErrors[`roomType_${index}_cantPersonas`] = "La capacidad debe ser al menos 1";
      if (!roomType.costo || roomType.costo < 0) newErrors[`roomType_${index}_costo`] = "El costo debe ser mayor a 0";
      if (!roomType.cantHab || roomType.cantHab < 1) newErrors[`roomType_${index}_cantHab`] = "La cantidad debe ser al menos 1";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert("Por favor, corrige los errores en el formulario");
      return;
    }

    setSaving(true);

    try {
      const hotelData = {
        ...formData,
        idZona: parseInt(formData.idZona),
        idUsuario: 1,
      };

      console.log("1. Actualizando hotel...");
      await updateHotel(id, hotelData);
      console.log("2. Hotel actualizado con ID:", id);

      if (roomTypesToDelete.length > 0) {
        console.log("3. Eliminando tipos de habitación:", roomTypesToDelete);
        for (const roomTypeId of roomTypesToDelete) {
          try {
            await deleteTipoHabitacion(roomTypeId);
          } catch (error) {
            console.error("Error eliminando tipo habitación:", error);
          }
        }
      }

      if (roomTypes.length > 0) {
        console.log("4. Actualizando tipos de habitación...");
        for (const roomType of roomTypes) {
          try {
            if (roomType.id) {
              await updateTipoHabitacion(roomType.id, {
                nombre: roomType.nombre,
                cantPersonas: parseInt(roomType.cantPersonas),
                cantHab: parseInt(roomType.cantHab),
                costo: parseFloat(roomType.costo),
              });
            } else {
              await createTipoHabitacion(id, {
                nombre: roomType.nombre,
                cantPersonas: parseInt(roomType.cantPersonas),
                cantHab: parseInt(roomType.cantHab),
                costo: parseFloat(roomType.costo),
              });
            }
          } catch (error) {
            console.error("Error guardando tipo habitación:", error);
          }
        }
      }

      if (imagesToDelete.length > 0) {
        console.log("5. Eliminando imágenes:", imagesToDelete);
        for (const imageId of imagesToDelete) {
          try {
            await deleteImage(imageId);
          } catch (error) {
            console.error("Error eliminando imagen:", error);
          }
        }
      }

      if (images.length > 0) {
        console.log("6. Subiendo nuevas imágenes...");
        for (let i = 0; i < images.length; i++) {
          try {
            console.log(`Subiendo imagen ${i + 1}:`, images[i].name);
            await uploadImage(id, images[i]);
          } catch (error) {
            console.error(`Error subiendo imagen ${i + 1}:`, error);
          }
        }
      }

      alert("Hotel actualizado exitosamente!");
      navigate("/gestion/hoteles");

    } catch (error) {
      console.error("ERROR GENERAL:", error);
      alert(`Error al actualizar el hotel: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-gray-50 items-center">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">Cargando información del hotel...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 items-center">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <header>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-800">
              Editar Hotel
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Actualiza la información del hotel
            </p>
          </header>

          <div>
            <form onSubmit={handleSubmit} className="space-y-12 md:col-span-2">
              <input type="hidden" name="id" value={id} />

              <section className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800">
                  Información Básica
                </h3>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">
                      Nombre del Hotel
                    </label>
                    <input
                      className={`h-12 rounded-xl border bg-white placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500 ${
                        errors.nombre ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="e.g., The Grand Budapest Hotel"
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                    />
                    {errors.nombre && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.nombre}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">Zona</label>
                    <select
                      className={`h-12 rounded-xl border bg-white text-gray-700 focus:border-green-500 focus:ring-green-500 ${
                        errors.idZona ? "border-red-500" : "border-gray-300"
                      }`}
                      name="idZona"
                      value={formData.idZona}
                      onChange={handleInputChange}
                    >
                      <option value="">Seleccione una zona</option>
                      {zonas.map((zona) => (
                        <option key={zona.id} value={zona.id}>
                          {zona.nombre}
                        </option>
                      ))}
                    </select>
                    {errors.idZona && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.idZona}
                      </span>
                    )}
                  </div>
                </div>
              </section>

              <section className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800">Dirección</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="flex flex-col sm:col-span-2">
                    <label className="mb-1 text-sm font-medium">
                      Dirección completa
                    </label>
                    <input
                      className={`h-12 rounded-xl border bg-white placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500 ${
                        errors.direccion ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Dirección aquí..."
                      name="direccion"
                      type="text"
                      value={formData.direccion}
                      onChange={handleInputChange}
                    />
                    {errors.direccion && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.direccion}
                      </span>
                    )}
                  </div>
                </div>
              </section>

              <section className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800">Descripción</h3>
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">
                      Describa su hotel
                    </label>
                    <textarea
                      className={`min-h-32 rounded-xl border bg-white placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500 ${
                        errors.descripcion ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="¿Qué hace a nuestro hotel tan especial?"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                    />
                    {errors.descripcion && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.descripcion}
                      </span>
                    )}
                  </div>
                </div>
              </section>

              <section className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800">
                  Fotos del Hotel
                </h3>

                <div className="flex flex-wrap gap-4">
                  <div className="flex flex-wrap gap-4">
                    {existingImages.map((image) => (
                      <div key={image.id} className="relative h-32 w-32">
                        <img
                          src={image.url}
                          alt={`Hotel ${formData.nombre}`}
                          className="h-full w-full rounded-xl object-cover"
                          onError={(e) => {
                            e.target.src = "/placeholder_hotel.jpg";
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(image.id)}
                          className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white font-bold text-lg hover:bg-red-700"
                        >
                          &times;
                        </button>
                      </div>
                    ))}

                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative h-32 w-32">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="h-full w-full rounded-xl object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white font-bold text-lg hover:bg-red-700"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>

                  <label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-center hover:bg-gray-100">
                    <svg
                      className="h-10 w-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-500">
                      Añadir foto
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      multiple
                    />
                  </label>
                </div>
              </section>

              <section className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800">
                  Tipos de Habitación
                </h3>

                <div className="space-y-8">
                  {roomTypes.map((roomType, index) => (
                    <div
                      key={roomType.id || index}
                      className="relative rounded-lg border border-gray-200 p-4 pt-8"
                    >
                      <button
                        type="button"
                        onClick={() => removeRoomType(index)}
                        className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                      >
                        &times;
                      </button>

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="flex flex-col">
                          <label className="mb-1 text-sm font-medium">
                            Nombre del Tipo de Habitación
                          </label>
                          <input
                            type="text"
                            className={`rounded-xl border bg-white placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500 ${
                              errors[`roomType_${index}_nombre`]
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="Ej: Suite Deluxe"
                            value={roomType.nombre}
                            onChange={(e) =>
                              handleRoomTypeChange(
                                index,
                                "nombre",
                                e.target.value
                              )
                            }
                          />
                          {errors[`roomType_${index}_nombre`] && (
                            <span className="text-red-500 text-sm mt-1">
                              {errors[`roomType_${index}_nombre`]}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col">
                          <label className="mb-1 text-sm font-medium">
                            Capacidad de Personas
                          </label>
                          <input
                            type="number"
                            className={`rounded-xl border bg-white placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500 ${
                              errors[`roomType_${index}_cantPersonas`]
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="Ej: 2"
                            value={roomType.cantPersonas}
                            onChange={(e) =>
                              handleRoomTypeChange(
                                index,
                                "cantPersonas",
                                e.target.value
                              )
                            }
                          />
                          {errors[`roomType_${index}_cantPersonas`] && (
                            <span className="text-red-500 text-sm mt-1">
                              {errors[`roomType_${index}_cantPersonas`]}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col">
                          <label className="mb-1 text-sm font-medium">
                            Precio por Noche ($)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            className={`rounded-xl border bg-white placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500 ${
                              errors[`roomType_${index}_costo`]
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="Ej: 150.00"
                            value={roomType.costo}
                            onChange={(e) =>
                              handleRoomTypeChange(
                                index,
                                "costo",
                                e.target.value
                              )
                            }
                          />
                          {errors[`roomType_${index}_costo`] && (
                            <span className="text-red-500 text-sm mt-1">
                              {errors[`roomType_${index}_costo`]}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col">
                          <label className="mb-1 text-sm font-medium">
                            Cantidad de Habitaciones
                          </label>
                          <input
                            type="number"
                            className={`rounded-xl border bg-white placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500 ${
                              errors[`roomType_${index}_cantHab`]
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="Ej: 10"
                            value={roomType.cantHab}
                            onChange={(e) =>
                              handleRoomTypeChange(
                                index,
                                "cantHab",
                                e.target.value
                              )
                            }
                          />
                          {errors[`roomType_${index}_cantHab`] && (
                            <span className="text-red-500 text-sm mt-1">
                              {errors[`roomType_${index}_cantHab`]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addRoomType}
                  className="mt-4 flex items-center gap-2 rounded-full bg-gray-100 px-5 py-2.5 text-sm font-bold text-gray-800 hover:bg-gray-200"
                >
                  <svg
                    fill="currentColor"
                    height="16"
                    viewBox="0 0 256 256"
                    width="16"
                  >
                    <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
                  </svg>
                  <span>Añadir otro Tipo de Habitación</span>
                </button>
              </section>

              <div className="flex items-center justify-end gap-4 pt-6">
                <Link
                  to="/gestion/hoteles"
                  className="rounded-full bg-gray-100 px-6 py-3 text-base font-bold text-gray-800 hover:bg-red-500 hover:text-white transition-colors"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-green-500 px-6 py-3 text-base font-bold text-white shadow-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditHotel;