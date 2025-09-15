import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCompanies } from "../context/CompanyContext"; // Importa el contexto correcto

function CreateCompanyPage() {
  const { createCompany, companies } = useCompanies(); // Usa el hook y la función correctos
  const navigate = useNavigate();

  const [company, setCompany] = useState({
    name: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    description: "",
    headquarters: "",
  });

  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    // Validar en tiempo real si la combinación de nombre y sede ya existe
    if (company.name && company.headquarters) {
      const isDuplicate = companies.some(
        (existingCompany) =>
          existingCompany.name.toLowerCase() === company.name.toLowerCase() &&
          existingCompany.headquarters.toLowerCase() ===
            company.headquarters.toLowerCase()
      );
      if (isDuplicate) {
        setValidationError("Ya existe una empresa con este nombre y sede.");
      } else {
        setValidationError("");
      }
    } else {
      setValidationError("");
    }
  }, [company.name, company.headquarters, companies]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Evitar el envío si hay errores de validación
    if (validationError) {
      return;
    }

    // Validar campos obligatorios
    if (!company.name || !company.contactEmail) {
      setError("Por favor completa al menos Nombre y Email.");
      return;
    }

    setLoading(true);

    try {
      await createCompany(company); // Llama a la nueva función del contexto
      navigate("/companiesPage");
    } catch (err) {
      if (err.response?.status === 403) {
        setError("No tienes permisos para registrar empresas.");
      } else {
        // Muestra el error específico del backend si existe, de lo contrario un mensaje genérico
        const errorMessage =
          err.response?.data?.message ||
          "Error al registrar la empresa. Intenta de nuevo.";
        setError(errorMessage);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-blueSena w-full max-w-2xl p-10 rounded-md shadow-lg">
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
          {/* Campo: Sede */}
          <div className="w-11/12 mx-auto">
            <label className="block text-sm font-medium text-white mb-2">
              Sede
            </label>
            <input
              type="text"
              name="headquarters"
              placeholder="Sede de la empresa"
              value={company.headquarters}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-white text-black outline-none placeholder-gray-400"
            />
          </div>

          {/* Mostrar error de validación en tiempo real */}
          {validationError && (
            <div className="w-11/12 mx-auto">
              <div className="bg-red-100 text-red-600 p-2 rounded text-sm">
                {validationError}
              </div>
            </div>
          )}

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
              disabled={loading || validationError}
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
