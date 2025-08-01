// Componente de ruta protegida para React Router
// Solo permite el acceso a rutas hijas si el usuario está autenticado
// Si está cargando, muestra un mensaje de carga
// Si no está autenticado, redirige al login
import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "./context/AuthContext"


function ProtectedRoute() {
    // Extrae el estado de autenticación y carga del contexto
    const { loading, isAuthenticated } = useAuth()
    // Puedes usar este log para depuración
    // console.log(loading, isAuthenticated)

    // Si la autenticación está en proceso, muestra un mensaje de carga
    if (loading) return <h1>loading.....</h1>

    // Si no está autenticado, redirige al login
    if (!loading && !isAuthenticated) return <Navigate to='/login' replace />

    // Si está autenticado, renderiza las rutas hijas
    return <Outlet />;
}

export default ProtectedRoute