import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function CompanyCard({ company, onDelete }) {
  return (
    <div className="bg-[#003355] rounded-lg shadow-md p-4 mb-6">
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left text-gray-200">
          <thead>
            <tr className="bg-gray-700">
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Codigo</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Teléfono</th>
              <th className="px-4 py-2">Dirección</th>
              <th className="px-4 py-2">descripción</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2">{company.name}</td>
              <td className="px-4 py-2">{company.companyAccessCode}</td>
              <td className="px-4 py-2">{company.contactEmail}</td>
              <td className="px-4 py-2">{company.contactPhone}</td>
              <td className="px-4 py-2">{company.address}</td>
              <td className="px-4 py-2">{company.description}</td>
              <td className="px-4 py-2 flex gap-2">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => onDelete(company._id)}
                >
                  Eliminar
                </button>
                <Link
                  to={`/companies/${company._id}/edit`}
                  className="bg-claroSena text-white px-4 py-2 rounded-md"
                >
                  Editar
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
CompanyCard.propTypes = {
  company: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    companyAccessCode: PropTypes.string,
    contactEmail: PropTypes.string,
    contactPhone: PropTypes.string,
    address: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};
export default CompanyCard;
