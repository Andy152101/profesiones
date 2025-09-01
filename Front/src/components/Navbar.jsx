import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();

  // Define los enlaces disponibles según rol
  const linksByRole = {
    admin: [
      { to: "/VerRegister", label: "Usuarios" },
      { to: "/PowerBi", label: "Gráficos" },
      { to: "/create-company", label: "Empresas" },
      { to: "/people", label: "Registro" },
      { to: "/tests", label: "Pruebas" },
    ],
    empleado: [
      { to: "/people", label: "Registro" },
      { to: "/tests", label: "Pruebas" },
    ],
    consultorEmpresa: [
      { to: "/people", label: "Registro" },
      { to: "/tests", label: "Pruebas" },
    ],
  };

  // Obtiene los enlaces del rol actual, o vacíos si no autenticado
  const roleLinks = isAuthenticated ? linksByRole[user.role] || [] : [];

  return (
    <nav className="bg-ester text-white flex flex-col">
      {/* Menú principal */}
      <div className="flex justify-between items-center py-4 px-6">
        <img
          src="/src/Imagenes/LogoAzul.png"
          alt="LogoAzul"
          className="w-auto max-h-full h-20 md:h-24 object-cover"
        />
        {!isAuthenticated && (
          <ul className="flex gap-x-2 ml-auto">
            <li>
              <Link to="/login" className="px-4 py-1 rounded-sm">
                Login
              </Link>
            </li>
            <li>
              <Link to="/acceso" className="px-4 py-1 rounded-sm">
                Registro
              </Link>
            </li>
          </ul>
        )}
      </div>

      {/* Menú secundario para usuarios autenticados */}
      {isAuthenticated && (
        <div className="flex justify-between items-center py-4 px-10">
          <ul className="flex gap-x-2 flex-grow items-center">
            {roleLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="px-4 py-1 rounded-sm">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="flex gap-x-2 items-center ml-auto">
            <li>Bienvenido {user.username}</li>
            <li>
              <button
                onClick={() => logout()}
                className="p-1 rounded-sm flex items-center justify-center hover:bg-blueSena focus:outline-none"
                aria-label="Salir"
              >
                <FontAwesomeIcon
                  icon={faSignOutAlt}
                  className="h-5 w-5 md:h-6 md:w-6 text-white"
                />
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
