import { usePeoples } from "../context/PeopleContext";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PropTypes from "prop-types";

function PeopleIndex({ people }) {
  const { deletePeople } = usePeoples();
  const { userRole } = useAuth();

  return (
    <div className="bg-blueSena max-w-full w-full p-6 rounded-md overflow-auto mb-6">
      <header>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="p-2">Nombre</th>
              <th className="p-2">Tipo de documento</th>
              <th className="p-2">Número de Documento</th>
              <th className="p-2">Fecha Nacimiento</th>
              <th className="p-2">Género</th>
              <th className="p-2">Número Celular</th>
              <th className="p-2">Correo</th>
              <th className="p-2">Compañía</th>
              <th className="p-2">Tiempo</th>
              <th className="p-2">Nivel Educativo</th>
              <th className="p-2">Fecha Finalización</th>
              <th className="p-2">Mano Dominante</th>
              <th className="p-2">Dirección</th>
              <th className="p-2">Barrio</th>
              <th className="p-2">Municipio</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-slate-300">
              <td className="p-2 border-t border-gray-600">{people.names}</td>
              <td className="p-2 border-t border-gray-600">{people.doctype}</td>
              <td className="p-2 border-t border-gray-600">
                {people.docnumber}
              </td>
              <td className="p-2 border-t border-gray-600">
                {people.birthdate}
              </td>
              <td className="p-2 border-t border-gray-600">{people.sex}</td>
              <td className="p-2 border-t border-gray-600">{people.phone}</td>
              <td className="p-2 border-t border-gray-600">{people.email}</td>
              <td className="p-2 border-t border-gray-600">
                {people.company
                  ? `${people.company.name} - ${
                      people.company.headquarters || "-"
                    }`
                  : "-"}
              </td>
              <td className="p-2 border-t border-gray-600">
                {people.companytime}
              </td>
              <td className="p-2 border-t border-gray-600">
                {people.academiclevel}
              </td>
              <td className="p-2 border-t border-gray-600">
                {people.graduationdate}
              </td>
              <td className="p-2 border-t border-gray-600">
                {people.dominanthand}
              </td>
              <td className="p-2 border-t border-gray-600">{people.address}</td>
              <td className="p-2 border-t border-gray-600">
                {people.neighborhood}
              </td>
              <td className="p-2 border-t border-gray-600">
                {people.municipality}
              </td>
            </tr>
          </tbody>
        </table>
      </header>

      <div className="flex justify-end mt-4 gap-2">
        <Link
          to={`/people/${people._id}`}
          className="bg-claroSena text-white px-4 py-2 rounded-md"
        >
          Editar
        </Link>
        {userRole === "admin" && (
          <button
            onClick={() => {
              if (
                window.confirm(
                  "¿Estás seguro de que deseas eliminar este registro?"
                )
              ) {
                deletePeople(people._id);
              }
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
}

PeopleIndex.propTypes = {
  people: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    names: PropTypes.string.isRequired,
    doctype: PropTypes.string,
    docnumber: PropTypes.string,
    birthdate: PropTypes.string,
    sex: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    company: PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
      headquarters: PropTypes.string,
    }),
    companytime: PropTypes.string,
    academiclevel: PropTypes.string,
    graduationdate: PropTypes.string,
    dominanthand: PropTypes.string,
    address: PropTypes.string,
    neighborhood: PropTypes.string,
    municipality: PropTypes.string,
  }).isRequired,
};

export default PeopleIndex;
