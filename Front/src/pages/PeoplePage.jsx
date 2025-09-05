import { useEffect, useState } from "react";
import { usePeoples } from "../context/PeopleContext";
import { useAuth } from "../context/AuthContext"; // importamos el contexto de auth
import PeopleIndex from "../components/PeopleIndex";
import { Link } from "react-router-dom";
import exportToExcel from "../pages/Excel y Graficos/peopleGrafico";

function PeoplePage() {
  const { getPeoples, peoples, getPeople } = usePeoples();
  const { user } = useAuth(); //  obtenemos el usuario logueado

  const [searchDocNumber, setSearchDocNumber] = useState("");
  const [filteredPeoples, setFilteredPeoples] = useState([]);

  useEffect(() => {
    getPeoples();
  }, [getPeoples]);

  useEffect(() => {
    setFilteredPeoples(peoples);
  }, [peoples]);

  const handleSearch = async () => {
    if (searchDocNumber.trim() === "") {
      setFilteredPeoples(peoples);
    } else {
      const filtered = peoples.filter(
        (people) => people.docnumber === searchDocNumber
      );
      if (filtered.length > 0) {
        const person = await getPeople(filtered[0]._id);
        setFilteredPeoples([person]);
      } else {
        setFilteredPeoples([]);
      }
    }
  };

  const handleInputChange = (e) => {
    setSearchDocNumber(e.target.value);
    if (e.target.value.trim() === "") {
      setFilteredPeoples(peoples);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        {/* 👇 Solo admin puede ver esto (alineado a la izquierda) */}
        {user?.role === "admin" && (
          <div className="flex gap-2">
            <Link
              to="/add-people2"
              className="px-4 py-2 bg-blueSena text-white rounded-md"
            >
              Crear usuarios
            </Link>
            <button
              onClick={() => exportToExcel(peoples)}
              className="px-4 py-2 bg-ester text-white rounded-md"
            >
              Descargar Excel
            </button>
          </div>
        )}

        {/* 🔎 Buscador a la derecha */}
        <div className="flex items-center gap-2 ml-auto">
          <input
            type="text"
            value={searchDocNumber}
            onChange={handleInputChange}
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

      {filteredPeoples.length === 0 ? (
        <h1 className="text-black">No people found</h1>
      ) : (
        <div>
          {filteredPeoples.map((people) => (
            <PeopleIndex people={people} key={people._id} />
          ))}
        </div>
      )}
    </div>
  );
}

export default PeoplePage;
