import { useTests } from "../context/TestsContext";
import { useAuth } from "../context/AuthContext"; // 👈 aquí traemos el rol
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function TestsIndex({ tests }) {
  const { deleteTests } = useTests();
  const { isAdmin, isConsultant, isEmployee } = useAuth(); // 👈 helpers que revisan rol

  return (
    <div className="bg-blueSena max-w-full w-full p-6 rounded-md overflow-auto mb-6">
      <header>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="p-2">Fecha</th>
              <th className="p-2">Documento</th>
              <th className="p-2">Nombres</th>
              <th className="p-2">Empresa</th>
              <th className="p-2">Mano Dominante</th>
              <th className="p-2">Tiempo de Colocación 1</th>
              <th className="p-2">Tiempo de Colocación 2</th>
              <th className="p-2">Total de Colocación</th>
              <th className="p-2">Escala de Colocación</th>
              <th className="p-2">Tiempo de Rotación 1</th>
              <th className="p-2">Tiempo de Rotación 2</th>
              <th className="p-2">Total de Rotación</th>
              <th className="p-2">Escala de Rotación</th>
              <th className="p-2">Tiempo de Desplazamiento 1</th>
              <th className="p-2">Tiempo de Desplazamiento 2</th>
              <th className="p-2">Total de Desplazamiento</th>
              <th className="p-2">Escala de Desplazamiento</th>
              <th className="p-2">Puque Mano Dominante</th>
              <th className="p-2">Escala Mano Dominante</th>
              <th className="p-2">Puque Mano No Dominante</th>
              <th className="p-2">Escala Mano No Dominante</th>
              <th className="p-2">Puque Ambas Manos</th>
              <th className="p-2">Escala Ambas Manos</th>
              <th className="p-2">Puque Ensamblar</th>
              <th className="p-2">Escala Ensamblar</th>
              <th className="p-2">Con distractor </th>
              <th className="p-2">Escala con distractor</th>
              <th className="p-2">Reacción 1</th>
              <th className="p-2">Escala Reacción 1 </th>
              <th className="p-2">Reacción 2</th>
              <th className="p-2">Escala Reacción 2</th>
              <th className="p-2">Tiempo de estrella</th>
              <th className="p-2">Escala Estrella</th>
              <th className="p-2">Errores Estrella</th>
              <th className="p-2">Escala Errores Estrella</th>
              <th className="p-2">Wire Game tiempo</th>
              <th className="p-2">Wire Game errores</th>
              <th className="p-2">Escala Wire Game</th>
              <th className="p-2">Agudesa Visual Snellen</th>
              <th className="p-2">Escala Agudesa Visual Snellen</th>
              <th className="p-2">Dedos </th>
              <th className="p-2">Escala de Dedos</th>
              <th className="p-2">% De Vision Normal</th>
              <th className="p-2">% De Portanopia</th>
              <th className="p-2">% De Deuteranopia</th>
              <th className="p-2">% Total De Daltonismo</th>
              <th className="p-2">Tren</th>
              <th className="p-2">Escala de Tren</th>
              <th className="p-2">Memoria del Mar</th>
              <th className="p-2">Escala Memoria del Mar</th>
              <th className="p-2">Aves</th>
              <th className="p-2">Escala Aves</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-slate-300">
              <td className="p-2 border-t border-gray-600">{tests.date}</td>
              <td className="p-2 border-t border-gray-600">
                {tests.docnumber}
              </td>
              <td className="p-2 border-t border-gray-600">{tests.names}</td>
              <td className="p-2 border-t border-gray-600">
                {tests.company
                  ? `${tests.company.name} - ${
                      tests.company.headquarters || ""
                    }`
                  : "Sin empresa"}
              </td>

              <td className="p-2 border-t border-gray-600">
                {tests.dominanthand}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.mineplacementtime1}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.mineplacementtime2}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.mineplacementtotal}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.mineplacementscale}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.minerotationtime1}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.minerotationtime2}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.minerotationtotal}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.minerotationscale}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.minedisplacementtime1}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.minedisplacementtime2}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.minedisplacementtotal}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.minedisplacementscale}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.mineobservations}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.purdedominanthand}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.purdedominanthandscale}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.purdenodominanthand}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.purdenodominanthandscale}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.purdebothhands}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.purdebothhandsscale}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.purdeassemble}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.purdeassemblescale}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.purdeobservations}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.activityjtest}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.activityjtestscale}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.activityjtestobservations}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.reaction1}
              </td>
              <td className="p-2 border-t border-gray-600">{tests.startime}</td>
              <td className="p-2 border-t border-gray-600">
                {tests.starTimeOne}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.startoucherrors}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.starTouchErrorsOne}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.wireGameTime}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.wireGameError}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.wireGameLevel}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.visualAcuity}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.visualAcuityLevel}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.reaction1scale}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.reaction2}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.reaction2scale}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.reactionobservations}
              </td>
              <td className="p-2 border-t border-gray-600">{tests.fingers}</td>
              <td className="p-2 border-t border-gray-600">
                {tests.fingersscale}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.fingersobservations}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.ishinormalvision}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.ishideuteranopia}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.ishiportanopia}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.ishidaltonism}
              </td>
              <td className="p-2 border-t border-gray-600">
                {tests.ishiobservations}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-end mt-4 gap-2">
          {/* 🔴 Solo Admin ve todos */}
          {isAdmin() && (
            <>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "¿Estás seguro de que deseas eliminar este registro?"
                    )
                  ) {
                    deleteTests(tests._id);
                  }
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Eliminar
              </button>
              <Link
                to={`/tests/${tests._id}`}
                className="bg-claroSena text-white px-4 py-2 rounded-md"
              >
                Editar
              </Link>
              <Link
                to={`/tests/${tests._id}/detailEmpresa`}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Empresa
              </Link>
              <Link
                to={`/tests/${tests._id}/detailEmpleado`}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md"
              >
                Empleado
              </Link>
            </>
          )}

          {/* 🔵 ConsultorEmpresa solo ve Empresa */}
          {isConsultant() && (
            <Link
              to={`/tests/${tests._id}/detailEmpresa`}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Empresa
            </Link>
          )}

          {/* 🟢 Empleado solo ve Empleado */}
          {isEmployee() && (
            <Link
              to={`/tests/${tests._id}/detailEmpleado`}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md"
            >
              Empleado
            </Link>
          )}
        </div>
      </header>
    </div>
  );
}

TestsIndex.propTypes = {
  tests: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    date: PropTypes.string,
    docnumber: PropTypes.string,
    names: PropTypes.string,
    company: PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
      headquarters: PropTypes.string,
    }),
    dominanthand: PropTypes.string,
    mineplacementtime1: PropTypes.number,
    mineplacementtime2: PropTypes.number,
    mineplacementtotal: PropTypes.number,
    mineplacementscale: PropTypes.string,
    minerotationtime1: PropTypes.number,
    minerotationtime2: PropTypes.number,
    minerotationtotal: PropTypes.number,
    minerotationscale: PropTypes.string,
    minedisplacementtime1: PropTypes.number,
    minedisplacementtime2: PropTypes.number,
    minedisplacementtotal: PropTypes.number,
    minedisplacementscale: PropTypes.string,
    mineobservations: PropTypes.string,
    purdedominanthand: PropTypes.number,
    purdedominanthandscale: PropTypes.string,
    purdenodominanthand: PropTypes.number,
    purdenodominanthandscale: PropTypes.string,
    purdebothhands: PropTypes.number,
    purdebothhandsscale: PropTypes.string,
    purdeassemble: PropTypes.number,
    purdeassemblescale: PropTypes.string,
    purdeobservations: PropTypes.string,
    activityjtest: PropTypes.number,
    activityjtestscale: PropTypes.string,
    activityjtestobservations: PropTypes.string,
    reaction1: PropTypes.number,
    reaction1scale: PropTypes.string,
    reaction2: PropTypes.number,
    reaction2scale: PropTypes.string,
    reactionobservations: PropTypes.string,
    startime: PropTypes.number,
    starTimeOne: PropTypes.string,
    startoucherrors: PropTypes.number,
    starTouchErrorsOne: PropTypes.string,
    wireGameTime: PropTypes.number,
    wireGameError: PropTypes.number,
    wireGameLevel: PropTypes.string,
    visualAcuity: PropTypes.string,
    visualAcuityLevel: PropTypes.string,
    fingers: PropTypes.number,
    fingersscale: PropTypes.string,
    fingersobservations: PropTypes.string,
    ishinormalvision: PropTypes.number,
    ishideuteranopia: PropTypes.number,
    ishiportanopia: PropTypes.number,
    ishidaltonism: PropTypes.number,
    ishiobservations: PropTypes.string,
  }).isRequired,
};
export default TestsIndex;
