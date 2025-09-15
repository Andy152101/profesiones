import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useCompanies } from "../context/CompanyContext";

function CompanyEdit() {
  // Inicialización de hooks
  const { register, handleSubmit, setValue } = useForm();
  const params = useParams();
  const navigate = useNavigate();
  const { getCompany, updateCompany, errors } = useCompanies();
  const [loading, setLoading] = useState(true);

  // useEffect para cargar los datos de la empresa y llenar el formulario
  useEffect(() => {
    async function loadCompany() {
      if (params.id) {
        setLoading(true);
        try {
          // Llama a la función para obtener la empresa.
          // El contexto getCompany ahora devuelve los datos directamente.
          const companyData = await getCompany(params.id);

          // Si se obtienen datos, llena los campos del formulario.
          if (companyData) {
            setValue("name", companyData.name);
            setValue("description", companyData.description);
            setValue("contactEmail", companyData.contactEmail);
            setValue("contactPhone", companyData.contactPhone);
            setValue("address", companyData.address);
            setValue("headquarters", companyData.headquarters);
          }
        } catch (error) {
          console.error("Error al cargar la empresa:", error);
          // Puedes manejar el error aquí si quieres mostrar un mensaje al usuario.
        } finally {
          setLoading(false);
        }
      }
    }
    loadCompany();
  }, [params.id, getCompany, setValue]); // Dependencias para que el efecto se ejecute solo cuando cambien

  // Manejador del envío del formulario
  const onSubmit = handleSubmit(async (data) => {
    try {
      await updateCompany(params.id, data);
      navigate("/companiesPage");
    } catch (error) {
      console.error("Error al actualizar la empresa:", error);
    }
  });

  // Muestra el estado de carga mientras se obtienen los datos
  if (loading) {
    return (
      <p className="text-center text-text-senaGrisMedio">
        Cargando datos de la empresa...
      </p>
    );
  }

  // Renderizado del formulario
  return (
    <div className="bg-blueSena shadow-md rounded-md p-6 font-sena max-w-lg mx-auto my-20">
      <h2 className="text-2xl font-bold mb-4 text-center text-white">
        Editar Empresa
      </h2>
      {errors.length > 0 && (
        <div className="bg-red-500 text-white p-2 rounded mb-4 text-center">
          {errors.map((error, i) => (
            <p key={i}>{error}</p>
          ))}
        </div>
      )}
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block text-white">Nombre</label>
          <input
            type="text"
            {...register("name", { required: true })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blueSena text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block text-white">Sede</label>
          <input
            type="text"
            {...register("headquarters", { required: true })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blueSena text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block text-white">Email</label>
          <input
            type="email"
            {...register("contactEmail", { required: true })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blueSena text-black"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white">Teléfono</label>
          <input
            type="tel"
            {...register("contactPhone")}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blueSena text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block text-white">Dirección</label>
          <input
            type="text"
            {...register("address")}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blueSena text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block text-white">Descripción</label>
          <textarea
            {...register("description")}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blueSena text-black"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 bg-ester text-white py-2 px-4 rounded-md hover:bg-darkBlueSena transition-colors duration-200"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}

export default CompanyEdit;
