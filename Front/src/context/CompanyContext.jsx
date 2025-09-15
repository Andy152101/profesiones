import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import {
  getAllCompaniesRequest,
  getCompanyRequest,
  updateCompanyRequest,
  deleteCompanyRequest,
  getCompanyStatsRequest,
  createCompanyRequest,
} from "../api/auth"; // Asegúrate de tener estas funciones en tu API
import PropTypes from "prop-types";
import { useAuth } from "./AuthContext";

const CompanyContext = createContext();

export const useCompanies = () => {
  const context = useContext(CompanyContext);
  if (!context)
    throw new Error("useCompanies must be used within a CompanyProvider");
  return context;
};

export const CompanyProvider = ({ children }) => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyStats, setCompanyStats] = useState(null);
  const [errors, setErrors] = useState([]);

  // La variable 'user' no se usa directamente en este contexto, las validaciones
  // se manejan en el backend, por lo que la importación completa del hook es suficiente.
  useAuth();

  // Funciones de empresas
  const createCompany = async (companyData) => {
    try {
      const res = await createCompanyRequest(companyData);
      setCompanies((prev) => [res.data.company, ...prev]);
      return res.data;
    } catch (error) {
      setErrors([
        error.response?.data?.message || "Error al crear la empresa.",
      ]);
      throw error;
    }
  };

  const getAllCompanies = useCallback(async () => {
    try {
      const res = await getAllCompaniesRequest();
      setCompanies(res.data);
    } catch (error) {
      setErrors([
        error.response?.data?.message || "Error al obtener empresas.",
      ]);
    }
  }, []);

  // Función getCompany memoizada con useCallback para evitar bucles de renderizado
  const getCompany = useCallback(async (id) => {
    try {
      const res = await getCompanyRequest(id);
      setSelectedCompany(res.data);
      return res.data;
    } catch (error) {
      setErrors([error.response?.data?.message || "Error al obtener empresa."]);
    }
  }, []);

  const updateCompany = async (id, companyData) => {
    try {
      const res = await updateCompanyRequest(id, companyData);
      setSelectedCompany(res.data.company);
      setCompanies((prev) =>
        prev.map((company) => (company._id === id ? res.data.company : company))
      );
      return res.data;
    } catch (error) {
      setErrors([
        error.response?.data?.message || "Error al actualizar empresa.",
      ]);
      throw error;
    }
  };

  const deleteCompany = async (id) => {
    try {
      await deleteCompanyRequest(id);
      setCompanies((prev) => prev.filter((company) => company._id !== id));
    } catch (error) {
      setErrors([
        error.response?.data?.message || "Error al eliminar empresa.",
      ]);
      throw error;
    }
  };

  const getCompanyStats = useCallback(async () => {
    try {
      const res = await getCompanyStatsRequest();
      setCompanyStats(res.data);
    } catch (error) {
      setErrors([
        error.response?.data?.message || "Error al obtener estadísticas.",
      ]);
    }
  }, []);

  // Manejo de errores: limpiar después de un tiempo
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  return (
    <CompanyContext.Provider
      value={{
        companies,
        selectedCompany,
        companyStats,
        errors,
        createCompany,
        getAllCompanies,
        getCompany,
        updateCompany,
        deleteCompany,
        getCompanyStats,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

// Se agrega la validación de props para 'children'
CompanyProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CompanyContext;
