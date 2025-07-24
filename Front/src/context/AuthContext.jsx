import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { registerRequest, loginRequest, verifiTokenRequet, getRegistersRequest, getRegisterRequest, updateRegistersRequest, deleteRegistersRequest } from '../api/auth';
import Cookies from 'js-cookie';

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
            const res = await registerRequest(user); // Asegúrate de que 'user' incluya 'role'
            console.log(res.data); // Verifica la respuesta
            setUser(res.data);
            setIsAuthenticated(true);
        } catch (error) {
            setErrors(error.response?.data || ['Error al registrarse.']);
        }
    };

    // Función para iniciar sesión
    const signin = async (user) => {
        try {
            const res = await loginRequest(user);
            console.log(res.data);
            setUser(res.data); // Asegúrate de que res.data incluya el rol
            setIsAuthenticated(true);
        } catch (error) {
            console.log("Error al iniciar sesion ", error)
            setErrors([error.response?.data.message ?? 'Error al iniciar sesión.']);
        }
    };

    // Función para cerrar sesión
    const logout = () => {
        Cookies.remove("token");
        setIsAuthenticated(false);
        setUser(null);
    };

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
            setErrors([error.response.data.message]);
        }
    }, []);

    const getRegister = async (id) => {
        try {
            const res = await getRegisterRequest(id);
            setSelectedRegister(res.data); // Asegúrate de que esto no dispare re-renderizaciones inesperadas
        } catch (error) {
            setErrors([error.response.data.message]); // Asegúrate de manejar errores correctamente
            setSelectedRegister(null); // Opcional: limpiar el registro seleccionado si hay un error
        }
    };

    const updateRegister = async (id, updatedData) => {
        try {
            const res = await updateRegistersRequest(id, updatedData);
            setSelectedRegister(res.data);
        } catch (error) {
            setErrors([error.response.data.message]);
        }
    };

    const deleteRegister = async (id) => {
        try {
            await deleteRegistersRequest(id);
            setRegisters(registers.filter(register => register._id !== id));
        } catch (error) {
            setErrors([error.response.data.message]);
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
                    setUser(res.data); // Asegúrate de que res.data incluya el rol
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

    return (
        <AuthContext.Provider
            value={{
                signup,
                signin,
                logout,
                getRegisters,
                getRegister,
                updateRegister,
                deleteRegister,
                loading,
                user,
                isAuthenticated,
                errors,
                registers,
                selectedRegister,
                userRole: user?.role // Proporcionar el rol del usuario
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
