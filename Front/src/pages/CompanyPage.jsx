import { useState, useEffect } from "react";
import { useCompanies } from "../context/CompanyContext";
import CompanyCard from "../components/CompanyCard";
import { Link } from "react-router-dom";

function CompaniesPage() {
  const { companies, getAllCompanies, getCompanyStats, deleteCompany } =
    useCompanies();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Carga inicial de datos al montar el componente
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([getAllCompanies(), getCompanyStats()]);
      console.log("Datos de empresas cargados:", companies); // Agrega esta línea
    } catch (error) {
      console.error("Error cargando empresas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompany = async (companyRef) => {
    try {
      await deleteCompany(companyRef);
      // La lista se actualizará automáticamente a través del contexto
      // No es necesario llamar a loadData() aquí
    } catch (error) {
      console.error("Error eliminando empresa:", error);
    }
  };

  if (loading) {
    return <p className="text-center text-text-senaGrisMedio">Cargando...</p>;
  }

  return (
    <div className="bg-senaGrisClaro shadow overflow-hidden sm:rounded-md p-4 font-sena">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/create-company"
          className="px-4 py-2 bg-blueSena text-white rounded-md "
        >
          Crear Empresa
        </Link>
      </div>

      {companies?.length === 0 ? (
        <p className="text-center text-blueSena font-semibold">
          No hay empresas registradas
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {companies.map((company) => (
            <CompanyCard
              key={company._id}
              company={company}
              onDelete={handleDeleteCompany}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CompaniesPage;
