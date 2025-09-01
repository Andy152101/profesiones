import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../api/axios"; // donde guardaste la instancia
function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { signup, isAuthenticated, errors: RegisterErrors } = useAuth();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await instance.get("/companies"); // Asegúrate de que sea admin
        console.log("Empresas recibidas:", res.data);
        setCompanies(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.log(
          "Error cargando empresas:",
          error.response?.data || error.message
        );
        setCompanies([]);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    if (isAuthenticated) navigate("/register");
  }, [isAuthenticated]);

  const onSubmit = handleSubmit(async (values) => {
    console.log("Valores enviados:", values); // Verifica si 'role' está presente
    await signup(values);
    if (isAuthenticated) {
      navigate("/VerRegister");
    }
  });
  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center">
      <div className="bg-blueSena max-w-md w-full p-10 rounded-md min-h-[50vh]">
        {RegisterErrors.map((error, i) => (
          <div className="bg-red-500 p-2 text-white" key={i}>
            {error}
          </div>
        ))}

        <form onSubmit={onSubmit}>
          <h2>Nombre del Usuario</h2>
          <input
            type="text"
            {...register("username", { required: true })}
            className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
            placeholder="Nombre"
            autoComplete="username"
          />
          {errors.username && (
            <p className="text-red-500">Username is requered</p>
          )}
          <h2>Correo electronico</h2>
          <input
            type="email"
            {...register("email", { required: true })}
            className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
            placeholder="Correo"
            autoComplete="username"
          />

          {errors.email && <p className="text-red-500">email is requered</p>}
          <h2>Contraseña</h2>
          <input
            type="password"
            {...register("password", { required: true })}
            className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
            placeholder="Contraseña"
            autoComplete="current-password"
          />
          {errors.password && (
            <p className="text-red-500">password is requered</p>
          )}

          <label htmlFor="role">Rol</label>
          <select
            id="role"
            {...register("role", { required: true })}
            className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
          >
            <option value="">Seleccione un rol</option>
            <option value="admin">Administrador</option>
            <option value="empleado">Empleado</option>
            <option value="consultorEmpresa">Consultor</option>
          </select>
          {errors.role && <p className="text-red-500">El rol es requerido</p>}

          {["consultorEmpresa", "empleado"].includes(watch("role")) && (
            <>
              <label htmlFor="companyRef">Empresa</label>
              <select
                id="companyRef"
                {...register("companyRef", { required: true })}
                className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
              >
                <option value="">Seleccione una empresa</option>
                {(Array.isArray(companies) ? companies : []).map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
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
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
