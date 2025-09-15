import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function CompanyCard({ company, onDelete }) {
  const companyId = company._id || company.id;

  // Armamos un array de filas para mapear (ahora solo 1, pero mañana pueden ser más)
  const rows = [
    {
      id: companyId,
      name: company.name,
      companyAccessCode: company.companyAccessCode,
      contactEmail: company.contactEmail,
      contactPhone: company.contactPhone,
      address: company.address,
      headquarters: company.headquarters,
      description: company.description,
    },
  ];

  return (
    <div className="bg-[#003355] rounded-lg shadow-md p-4 mb-6">
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left text-gray-200">
          <thead>
            <tr className="bg-gray-700">
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Código</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Teléfono</th>
              <th className="px-4 py-2">Dirección</th>
              <th className="px-4 py-2">Sede</th>
              <th className="px-4 py-2">Descripción</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-2">{row.name}</td>
                <td className="px-4 py-2">{row.companyAccessCode}</td>
                <td className="px-4 py-2">{row.contactEmail}</td>
                <td className="px-4 py-2">{row.contactPhone}</td>
                <td className="px-4 py-2">{row.address}</td>
                <td className="px-4 py-2">{row.headquarters}</td>
                <td className="px-4 py-2">{row.description}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => onDelete(companyId)}
                  >
                    Eliminar
                  </button>
                  <Link
                    to={`/companies/${companyId}/edit`}
                    className="bg-claroSena text-white px-4 py-2 rounded-md"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

CompanyCard.propTypes = {
  company: PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    companyAccessCode: PropTypes.string,
    contactEmail: PropTypes.string,
    contactPhone: PropTypes.string,
    address: PropTypes.string,
    description: PropTypes.string,
    headquarters: PropTypes.string,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CompanyCard;
