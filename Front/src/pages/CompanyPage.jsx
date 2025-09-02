import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import CompanyCard from "../components/CompanyCard";
import { Link } from "react-router-dom";

function CompaniesPage() {
  const { companies, getAllCompanies, getCompanyStats, deleteCompany } =
    useAuth();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData(); // carga inicial

    const intervalId = setInterval(() => {
      loadData(); // refresca cada 10s
    }, 10000);

    return () => clearInterval(intervalId); // limpiar intervalo al desmontar
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

  if (loading) {
    return <p className="text-center text-text-senaGrisMedio">Cargando...</p>;
  }
  return (
    <div className="bg-senaGrisClaro shadow overflow-hidden sm:rounded-md p-4 font-sena">
      <div className="flex justify-end gap-4 mb-6">
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
