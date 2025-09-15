import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

function EditRegisterPage() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const {
    updateRegister,
    getRegister,
    selectedRegister,
    isAuthenticated,
    errors: RegisterErrors,
  } = useAuth();

  const navigate = useNavigate();
  const { id } = useParams();
  const [companies, setCompanies] = useState([]);
  const fetchedRegister = useRef(false);
  const role = watch("role");

  // 1️⃣ Cargar registro y empresas en paralelo
  useEffect(() => {
    // Solo se ejecuta una vez para evitar re-fetches innecesarios
    if (isAuthenticated && id && !fetchedRegister.current) {
      fetchedRegister.current = true;
      getRegister(id);
    }

    const fetchCompanies = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/companies?t=${Date.now()}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        setCompanies(data);
      } catch (error) {
        console.error("Error al cargar empresas:", error);
      }
    };
    fetchCompanies();
  }, [id, isAuthenticated, getRegister]);

  // 2️⃣ Setear valores del form solo cuando ambos, el registro y las empresas, estén listos
  useEffect(() => {
    // Se asegura de que selectedRegister y companies no sean null o estén vacíos
    if (selectedRegister && companies.length > 0) {
      setValue("username", selectedRegister.username);
      setValue("email", selectedRegister.email);
      setValue("role", selectedRegister.role);
      const companyId =
        selectedRegister.company?._id || selectedRegister.company?.id;

      // Solo establece el valor si el ID de la empresa existe en la lista de empresas cargadas
      if (companyId && companies.some((c) => (c._id || c.id) === companyId)) {
        setValue("companyRef", companyId);
      }
    }
  }, [selectedRegister, companies, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    if (!values.password) delete values.password;
    if (values.role === "admin") delete values.companyRef;

    const success = await updateRegister(id, values);
    if (success) navigate("/VerRegister");
  });

  if (!selectedRegister || companies.length === 0) {
    return <h1 className="text-black text-center">Cargando...</h1>;
  }

  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center">
      <div className="bg-blueSena max-w-md w-full p-10 rounded-md min-h-[50vh]">
        {RegisterErrors.map((error, i) => (
          <div className="bg-red-500 p-2 text-white" key={i}>
            {error}
          </div>
        ))}

        <form onSubmit={onSubmit}>
          <h2>Editar Nombre del Usuario</h2>
          <input
            type="text"
            {...register("username", { required: true })}
            className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
            placeholder="Nombre"
          />
          {errors.username && (
            <p className="text-red-500">El nombre es requerido</p>
          )}

          <h2>Editar Correo Electrónico</h2>
          <input
            type="email"
            {...register("email", { required: true })}
            className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
            placeholder="Correo"
          />
          {errors.email && (
            <p className="text-red-500">El correo es requerido</p>
          )}

          <h2>Contraseña</h2>
          <input
            type="password"
            {...register("password")}
            className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
            placeholder="Dejar en blanco para mantener la contraseña actual"
          />

          <h2>Rol</h2>
          <select
            {...register("role", { required: true })}
            className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
          >
            <option value="">Seleccione un rol</option>
            <option value="admin">Administrador</option>
            <option value="consultorEmpresa">Consultor</option>
            <option value="empleado">Empleado</option>
          </select>
          {errors.role && <p className="text-red-500">El rol es requerido</p>}

          {role !== "admin" && (
            <>
              <label htmlFor="companyRef">Empresa</label>
              <select
                id="companyRef"
                {...register("companyRef", { required: true })}
                className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
              >
                <option value="">Seleccione una empresa</option>
                {companies.map((c) => (
                  <option key={c._id || c.id} value={c._id || c.id}>
                    {/* Este es el cambio: muestra el nombre y la sede */}
                    {c.name} - {c.headquarters}
                  </option>
                ))}
              </select>
              {errors.companyRef && (
                <p className="text-red-500">La empresa es requerida</p>
              )}
            </>
          )}

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="bg-ester text-white py-2 px-6 rounded-md"
            >
              Actualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditRegisterPage;
