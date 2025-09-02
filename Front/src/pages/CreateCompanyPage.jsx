import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function CreateCompanyPage() {
  const { requestCompanyRegistration } = useAuth();
  const navigate = useNavigate();

  const [company, setCompany] = useState({
    name: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!company.name || !company.contactEmail) {
      setError("Por favor completa al menos Nombre y Email.");
      setLoading(false);
      return;
    }

    try {
      await requestCompanyRegistration(company);
      navigate("/companiesPage");
    } catch (err) {
      if (err.response?.status === 403) {
        setError("No tienes permisos para registrar empresas.");
      } else {
        setError("Error al registrar la empresa. Intenta de nuevo.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-blueSena w-full max-w-2xl  p-10 rounded-md shadow-lg">
        <h1 className="text-2xl font-bold text-white text-center mb-6">
          Registrar Nueva Empresa
        </h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 mb-4 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 ">
          {/* Campo: Nombre */}
          <div className="w-11/12 mx-auto">
            <label className="block text-sm font-medium text-white mb-2">
              Nombre de la empresa
            </label>
            <input
              type="text"
              name="name"
              placeholder="Nombre de la empresa"
              value={company.name}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-white text-black outline-none placeholder-gray-400"
            />
          </div>

          {/* Campo: Email */}
          <div className="w-11/12 mx-auto">
            <label className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <input
              type="email"
              name="contactEmail"
              placeholder="Correo electrónico"
              value={company.contactEmail}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-white text-black outline-none placeholder-gray-400"
            />
          </div>

          {/* Campo: Teléfono */}
          <div className="w-11/12 mx-auto">
            <label className="block text-sm font-medium text-white mb-2">
              Teléfono
            </label>
            <input
              type="text"
              name="contactPhone"
              placeholder="Teléfono"
              value={company.contactPhone}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-white text-black outline-none placeholder-gray-400"
            />
          </div>

          {/* Campo: Dirección */}
          <div className="w-11/12 mx-auto">
            <label className="block text-sm font-medium text-white mb-2">
              Dirección
            </label>
            <input
              type="text"
              name="address"
              placeholder="Dirección"
              value={company.address}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-white text-black outline-none placeholder-gray-400"
            />
          </div>

          {/* Campo: Descripción */}
          <div className="w-11/12 mx-auto">
            <label className="block text-sm font-medium text-white mb-2">
              Descripción
            </label>
            <input
              type="text"
              name="description"
              placeholder="Descripción"
              value={company.description}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-white text-black outline-none placeholder-gray-400"
            />
          </div>

          {/* Botón */}
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-ester text-white py-2 px-6 rounded-md"
            >
              {loading ? "Registrando..." : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCompanyPage;
