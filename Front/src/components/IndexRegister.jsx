import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function IndexRegister({ registerData }) {
  const { deleteRegister } = useAuth();

  return (
    <div className="bg-blueSena max-w-full w-full p-6 rounded-md overflow-auto mb-6">
      <header>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="p-2 text-left">Nombre de Usuario</th>
              <th className="p-2 text-left">Correo Electrónico</th>
              <th className="p-2 text-left">Fecha de Registro</th>
              <th className="p-2 text-left">Empresa</th>
              <th className="p-2 text-left">Rol</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-slate-300 lg:table-row">
              <td className="p-2 border-t border-gray-600">
                {registerData.username}
              </td>
              <td className="p-2 border-t border-gray-600">
                {registerData.email}
              </td>
              <td className="p-2 border-t border-gray-600">
                {new Date(registerData.createdAt).toLocaleDateString()}
              </td>
              {/* Empresa */}
              <td className="p-2 border-t border-gray-600">
                {registerData.companyRef
                  ? `${registerData.companyRef.name} - ${registerData.companyRef.headquarters}`
                  : "-"}
              </td>
              {/* Rol */}
              <td className="p-2 border-t border-gray-600">
                {registerData.role}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={() => {
              if (
                window.confirm(
                  "¿Estás seguro de que deseas eliminar este registro?"
                )
              ) {
                deleteRegister(registerData._id);
              }
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-sm transition"
          >
            Eliminar
          </button>

          <Link
            to={`/registers/${registerData._id}`}
            className="bg-claroSena hover:bg-sky-600 text-white px-4 py-2 rounded-md shadow-sm transition"
          >
            Editar
          </Link>
        </div>
      </header>
    </div>
  );
}

// Validación de props
IndexRegister.propTypes = {
  registerData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    companyRef: PropTypes.shape({
      name: PropTypes.string,
      headquarters: PropTypes.string,
    }),
  }).isRequired,
};

export default IndexRegister;
