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

  const signup = async (user) => {
    try {
      let res;
      if (user.role === "consultorEmpresa") {
        res = await registerConsultantRequest(user);
      } else {
        res = await registerRequest(user);
      }
      return res.data;
    } catch (error) {
      setErrors(error.response?.data || ["Error al registrarse."]);
      throw error;
    }
  };

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
      return res.data.valid;
    } catch (error) {
      setErrors([error.response?.data?.message || "Error al validar código."]);
      return false;
    }
  };

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

  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      setErrors([error.response?.data.message ?? "Error al iniciar sesión."]);
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
    setUser(null);
  };

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
      setSelectedRegister(res);
      return true;
    } catch (error) {
      setErrors([
        error.response?.data?.message || "Error al actualizar registro.",
      ]);
      return false;
    }
  };

  const deleteRegister = async (id) => {
    try {
      await deleteRegistersRequest(id);
      setRegisters(registers.filter((r) => r._id !== id));
    } catch (error) {
      setErrors([
        error.response?.data?.message || "Error al eliminar registro.",
      ]);
    }
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => setErrors([]), 3000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

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
      } catch {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  const isAdmin = () => user?.role === "admin";
  const isConsultant = () => user?.role === "consultorEmpresa";
  const isEmployee = () => user?.role === "empleado";
  const needsPasswordChange = () => user?.needsPasswordChange === true;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        errors,
        loading,
        registers,
        selectedRegister,
        signup,
        signin,
        logout,
        registerEmployee,
        registerConsultant,
        validateAccessCode,
        getRegisters,
        getRegister,
        updateRegister,
        deleteRegister,
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
