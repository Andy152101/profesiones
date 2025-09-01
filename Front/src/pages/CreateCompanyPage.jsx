import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import instance from "../api/axios";
import { useForm } from "react-hook-form";

function CompanyPage() {
  const { token } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  // Cargar empresas
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await instance.get("/companies", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("📌 Empresas recibidas del backend:", res.data);
        setCompanies(res.data);
      } catch (err) {
        console.error("❌ Error trayendo empresas:", err);
        console.error(err);
      }
    };
    fetchCompanies();
  }, [token]);

  // Crear empresa
  const onSubmit = async (data) => {
    try {
      const res = await instance.post("/companies", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanies([...companies, res.data.company]);
      setShowForm(false);
      reset();
    } catch (error) {
      alert(error.response?.data?.message || "Error al crear empresa");
    }
  };

  return (
    <div className="p-6">
      {!showForm ? (
        <>
          <h1 className="text-2xl font-bold mb-6 text-center text-blueSena">
            Empresas Registradas
          </h1>

          <div className="overflow-x-auto shadow-lg rounded-md">
            <table className="w-full bg-blueSena rounded-lg border-collapse">
              <thead className="bg-gray-700 text-white text-center rounded-t-lg">
                <tr>
                  <th className="px-4 py-2">Nombre</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Teléfono</th>
                  <th className="px-4 py-2">Dirección</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company, index) => (
                  <tr
                    key={company._id || index}
                    className="text-center bg-blueSena text-white hover:bg-blue-900 transition"
                  >
                    <td className="px-4 py-2 border-b border-white/20">
                      {company.name}
                    </td>
                    <td className="px-4 py-2 border-b border-white/20">
                      {company.contactEmail}
                    </td>
                    <td className="px-4 py-2 border-b border-white/20">
                      {company.contactPhone}
                    </td>
                    <td className="px-4 py-2 border-b border-white/20">
                      {company.address}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowForm(true)}
              className="bg-ester text-white px-6 py-2 rounded-md hover:bg-green-600 transition"
            >
              Registrar Nueva Empresa
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center my-6 px-4">
          <div className="bg-blueSena max-w-2xl w-full p-6 md:p-10 rounded-md shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-white text-center">
              Registrar Nueva Empresa
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input
                {...register("name", { required: true })}
                placeholder="Nombre"
                className="border p-2 w-full rounded text-black"
              />
              <input
                {...register("description")}
                placeholder="Descripción"
                className="border p-2 w-full rounded text-black"
              />
              <input
                {...register("contactEmail", { required: true })}
                placeholder="Email de contacto"
                type="email"
                className="border p-2 w-full rounded text-black"
              />
              <input
                {...register("contactPhone")}
                placeholder="Teléfono de contacto"
                className="border p-2 w-full rounded text-black"
              />
              <input
                {...register("address")}
                placeholder="Dirección"
                className="border p-2 w-full rounded text-black"
              />

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-ester text-white px-6 py-2 rounded-md hover:bg-green-600 transition"
                >
                  Crear Empresa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyPage;
