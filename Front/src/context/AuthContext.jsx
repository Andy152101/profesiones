import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import {
  registerRequest,
  loginRequest,
  verifiTokenRequet,
  getRegistersRequest,
  getRegisterRequest,
  updateRegistersRequest,
  deleteRegistersRequest,
  registerEmployeeRequest,
  registerConsultantRequest,
  requestCompanyRegistrationRequest,
  getAllCompaniesRequest,
  getCompanyRequest,
  updateCompanyRequest,
  deleteCompanyRequest,
  getCompanyStatsRequest,
  validateAccessCodeRequest,
} from "../api/auth";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registers, setRegisters] = useState([]);
  const [selectedRegister, setSelectedRegister] = useState(null);

  // Nuevos estados para empresas
  const [companies, setCompanies] = useState([]);
  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyStats, setCompanyStats] = useState(null);
  const signup = async (user) => {
    try {
      let res;
      if (user.role === "consultorEmpresa") {
        res = await registerConsultantRequest(user); // endpoint especial
      } else {
        res = await registerRequest(user); // endpoint general
      }

      // ⚠ No actualizar setUser ni setIsAuthenticated
      return res.data; // devolvemos el usuario creado para cualquier mensaje
    } catch (error) {
      setErrors(error.response?.data || ["Error al registrarse."]);
      throw error;
    }
  };

  // Registro de empleado
  const registerEmployee = async (employeeData) => {
    try {
      const res = await registerEmployeeRequest(employeeData);
      return res.data;
    } catch (error) {
      setErrors([
        error.response?.data?.message || "Error al registrar empleado.",
      ]);
      throw error;
    }
  };
  const validateAccessCode = async (code) => {
    try {
      const res = await validateAccessCodeRequest(code);
      return res.data.valid; // asegúrate que tu backend devuelva esta propiedad
    } catch (error) {
      setErrors([error.response?.data?.message || "Error al validar código."]);
      return false;
    }
  };
  // Registro de consultor (solo admin)
  const registerConsultant = async (consultantData) => {
    try {
      const res = await registerConsultantRequest(consultantData);
      return res.data;
    } catch (error) {
      setErrors([
        error.response?.data?.message || "Error al registrar consultor.",
      ]);
      throw error;
    }
  };

  // Función para iniciar sesión
  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      console.log(res.data);
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.log("Error al iniciar sesion ", error);
      setErrors([error.response?.data.message ?? "Error al iniciar sesión."]);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
    setUser(null);
    setCompanies([]);
    setPendingCompanies([]);
    setSelectedCompany(null);
    setCompanyStats(null);
  };

  // Gestión de empresas
  const requestCompanyRegistration = async (companyData) => {
    try {
      const res = await requestCompanyRegistrationRequest(companyData);
      return res.data;
    } catch (error) {
      if (error.response?.status === 403) {
        setErrors(["No tienes permisos para registrar empresas."]);
      } else {
        setErrors([
          error.response?.data?.message || "Error al registrar la empresa.",
        ]);
      }
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

  const getCompany = async (id) => {
    try {
      const res = await getCompanyRequest(id);
      setSelectedCompany(res.data);
    } catch (error) {
      setErrors([error.response?.data?.message || "Error al obtener empresa."]);
    }
  };

  const updateCompany = async (id, companyData) => {
    try {
      const res = await updateCompanyRequest(id, companyData);
      setSelectedCompany(res.data.company);
      // Actualizar en la lista local
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

  const getRegisters = useCallback(async () => {
    try {
      const res = await getRegistersRequest();
      setRegisters(res.data);
    } catch (error) {
      setErrors([
        error.response?.data?.message || "Error al obtener registros.",
      ]);
    }
  }, []);

  const getRegister = async (id) => {
    try {
      const res = await getRegisterRequest(id);
      setSelectedRegister(res.data);
    } catch (error) {
      setErrors([
        error.response?.data?.message || "Error al obtener registro.",
      ]);
      setSelectedRegister(null);
    }
  };

  const updateRegister = async (id, updatedData) => {
    try {
      const res = await updateRegistersRequest(id, updatedData);
      setSelectedRegister(res); // tu updateRegistersRequest ya devuelve res.data
      return true; // ✅ indica que la actualización fue exitosa
    } catch (error) {
      setErrors([
        error.response?.data?.message || "Error al actualizar registro.",
      ]);
      return false; // ❌ indica que hubo un error
    }
  };

  const deleteRegister = async (id) => {
    try {
      await deleteRegistersRequest(id);
      setRegisters(registers.filter((register) => register._id !== id));
    } catch (error) {
      setErrors([
        error.response?.data?.message || "Error al eliminar registro.",
      ]);
    }
  };

  // Verificación del token en cookies al cargar el contexto
  useEffect(() => {
    const checkLogin = async () => {
      const cookies = Cookies.get();

      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return setUser(null);
      }

      try {
        const res = await verifiTokenRequet(cookies.token);
        if (res.data) {
          setIsAuthenticated(true);
          setUser(res.data);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  // Funciones de utilidad para verificar roles
  const isAdmin = () => user?.role === "admin";
  const isConsultant = () => user?.role === "consultorEmpresa";
  const isEmployee = () => user?.role === "empleado";
  const needsPasswordChange = () => user?.needsPasswordChange === true;

  return (
    <AuthContext.Provider
      value={{
        // Estados básicos
        user,
        isAuthenticated,
        errors,
        loading,
        registers,
        selectedRegister,

        // Estados de empresas
        companies,
        pendingCompanies,
        selectedCompany,
        companyStats,

        // Funciones de autenticación
        signup,
        signin,
        logout,

        // Funciones de registro
        registerEmployee,
        registerConsultant,
        validateAccessCode,

        // Funciones de usuarios
        getRegisters,
        getRegister,
        updateRegister,
        deleteRegister,

        // Funciones de empresas
        requestCompanyRegistration,
        getAllCompanies,
        getCompany,
        updateCompany,
        deleteCompany,
        getCompanyStats,

        // Funciones de utilidad
        isAdmin,
        isConsultant,
        isEmployee,
        needsPasswordChange,
        userRole: user?.role,
        userPermissions: user?.permissions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
