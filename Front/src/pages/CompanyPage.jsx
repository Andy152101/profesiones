import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import instance from "../api/axios";

function CompaniesPage() {
  const { companies, getAllCompanies, getCompanyStats, deleteCompany, token } =
    useAuth();

  const [loading, setLoading] = useState(false);
  const [showCreateCompanyForm, setShowCreateCompanyForm] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: "",
    description: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([getAllCompanies(), getCompanyStats()]);
    } catch (error) {
      console.error("Error cargando empresas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompany = async (companyRef) => {
    if (window.confirm("¿Está seguro de que desea eliminar esta empresa?")) {
      try {
        await deleteCompany(companyRef);
        await loadData();
      } catch (error) {
        console.error("Error eliminando empresa:", error);
      }
    }
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    try {
      await instance.post("/companies", newCompany, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowCreateCompanyForm(false);
      setNewCompany({
        name: "",
        description: "",
        contactEmail: "",
        contactPhone: "",
        address: "",
      });
      await loadData();
    } catch (error) {
      console.error("Error creando empresa:", error);
    }
  };

  if (loading) {
    return <p className="text-center text-text-senaGrisMedio">Cargando...</p>;
  }

  return (
    <div className="bg-senaGrisClaro shadow overflow-hidden sm:rounded-md p-4 font-sena">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg leading-6 font-bold text-text-senaGrisOscuro">
          Empresas
        </h3>
        <button
          onClick={() => setShowCreateCompanyForm(!showCreateCompanyForm)}
          className="bg-senaVerde hover:bg-senaVerde/90 text-senaBlanco px-4 py-2 rounded-md text-sm font-medium"
        >
          {showCreateCompanyForm ? "Cancelar" : "Crear Empresa"}
        </button>
      </div>

      {showCreateCompanyForm ? (
        // 👉 FORMULARIO CREAR EMPRESA
        <form onSubmit={handleCreateCompany} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre"
            required
            value={newCompany.name}
            onChange={(e) =>
              setNewCompany({ ...newCompany, name: e.target.value })
            }
            className="border border-text-senaGrisMedio p-2 w-full rounded"
          />
          <input
            type="email"
            placeholder="Email de contacto"
            required
            value={newCompany.contactEmail}
            onChange={(e) =>
              setNewCompany({ ...newCompany, contactEmail: e.target.value })
            }
            className="border border-text-senaGrisMedio p-2 w-full rounded"
          />
          <input
            type="text"
            placeholder="Teléfono"
            value={newCompany.contactPhone}
            onChange={(e) =>
              setNewCompany({ ...newCompany, contactPhone: e.target.value })
            }
            className="border border-text-senaGrisMedio p-2 w-full rounded"
          />
          <input
            type="text"
            placeholder="Dirección"
            value={newCompany.address}
            onChange={(e) =>
              setNewCompany({ ...newCompany, address: e.target.value })
            }
            className="border border-text-senaGrisMedio p-2 w-full rounded"
          />
          <textarea
            placeholder="Descripción"
            value={newCompany.description}
            onChange={(e) =>
              setNewCompany({ ...newCompany, description: e.target.value })
            }
            className="border border-text-senaGrisMedio p-2 w-full rounded"
          />
          <button
            type="submit"
            className="bg-senaVerde hover:bg-senaVerde/90 text-senaBlanco px-4 py-2 rounded-md text-sm font-medium"
          >
            Guardar Empresa
          </button>
        </form>
      ) : companies?.length === 0 ? (
        <p className="text-center text-text-senaGrisMedio">
          No hay empresas registradas
        </p>
      ) : (
        // 👉 TABLA DE EMPRESAS
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-senaGrisClaro border">
            <thead className="bg-senaGrisClaro">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-text-senaGrisOscuro uppercase">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-text-senaGrisOscuro uppercase">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-text-senaGrisOscuro uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-text-senaGrisOscuro uppercase">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-text-senaGrisOscuro uppercase">
                  Empleados
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-text-senaGrisOscuro uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-senaGrisClaro">
              {companies.map((company) => (
                <tr key={company._id}>
                  <td className="px-6 py-4">{company.name}</td>
                  <td className="px-6 py-4">{company.description}</td>
                  <td className="px-6 py-4">{company.contactEmail}</td>
                  <td className="px-6 py-4">
                    <span className="font-mono bg-senaGrisClaro px-2 py-1 rounded">
                      {company.companyAccessCode}
                    </span>
                  </td>
                  <td className="px-6 py-4">{company.employeeCount || 0}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteCompany(company._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CompaniesPage;
