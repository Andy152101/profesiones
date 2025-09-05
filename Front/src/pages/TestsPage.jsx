import { useEffect, useState } from "react";
import { useTests } from "../context/TestsContext";
import { useAuth } from "../context/AuthContext";
import TestsIndex from "../components/TestsIndex";
import { Link } from "react-router-dom";
import exportToExcel from "../pages/Excel y Graficos/TestsGrafico";

function TestsPage() {
  const { user } = useAuth(); // 👈 verificación de rol

  const { getTests, tests, getTest } = useTests();
  const [searchDocNumber, setSearchDocNumber] = useState("");
  const [filteredTests, setFilteredTests] = useState([]);

  useEffect(() => {
    getTests();
  }, [getTests]);

  useEffect(() => {
    setFilteredTests(tests);
  }, [tests]);

  const handleSearch = async () => {
    if (searchDocNumber.trim() === "") {
      setFilteredTests(tests); // Muestra todos los tests si no hay búsqueda
    } else {
      const filtered = tests.filter(
        (test) => test.docnumber === searchDocNumber
      );
      if (filtered.length > 0) {
        const test = await getTest(filtered[0]._id);
        setFilteredTests([test]);
      } else {
        setFilteredTests([]);
      }
    }
  };

  const handleChange = (e) => {
    setSearchDocNumber(e.target.value);
    if (e.target.value.trim() === "") {
      setFilteredTests(tests); // Muestra todos los tests cuando el campo de búsqueda está vacío
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        {/* Solo admin puede ver esto */}
        {user?.role === "admin" && (
          <div className="flex gap-2">
            <Link
              to="/add-tests"
              className="px-4 py-2 bg-blueSena text-white rounded-md"
            >
              Crear Tests
            </Link>
            <button
              onClick={() => exportToExcel(tests)}
              className="px-4 py-2 bg-ester text-white rounded-md"
            >
              Descargar Excel
            </button>
          </div>
        )}

        {/* El buscador lo ven todos */}
        <div className="flex items-center gap-2 ml-auto">
          <input
            type="text"
            value={searchDocNumber}
            onChange={handleChange}
            placeholder="Buscar por número de documento"
            className="px-4 py-2 border border-gray-300 rounded-md text-black"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-greenSena text-white rounded-md"
          >
            Buscar
          </button>
        </div>
      </div>

      {filteredTests.length === 0 ? (
        <h1 className="text-black">No tests</h1>
      ) : (
        <div>
          {filteredTests.map((test) => (
            <TestsIndex tests={test} key={test._id} />
          ))}
        </div>
      )}
    </div>
  );
}

export default TestsPage;
