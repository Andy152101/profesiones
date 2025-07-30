import { createContext, useContext, useState, useCallback } from "react";
import { createPeopleRequest, getPeoplesRequest, deletePeopleRequest, getPeopleByDocNumberRequest, getPeopleRequest, updatePeopleRequest } from "../api/people.js";

const PeopleContext = createContext();

export const usePeoples = () => {
  const context = useContext(PeopleContext);
  if (!context) throw new Error("usePeoples must be used within a PeopleProvider");
  return context;
};

export function PeopleProvider({ children }) {
  const [peoples, setPeoples] = useState([]);
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [error, setError] = useState({});

  const getPeoples = useCallback(async () => {
    try {
      const res = await getPeoplesRequest();
      setPeoples(res.data);
      console.log("Fetched peoples:", res.data); 
    } catch (err) {
      console.error("Error fetching people:", err);
      setError("Error fetching people");
    }
  }, []);

  const getPeople = useCallback(async (id) => {
    try {
      const response = await getPeopleRequest(id);
      return response.data;
    } catch (error) {
      console.error("Error fetching person:", error);
      setError("Error fetching person");
    }
  }, []);

  const createPeoples = useCallback(async (form) => {
    try {
      const result = await createPeopleRequest(form);
      if (result.error) {
        setError({ formError: result.error });
        return false;
      }
      setError({}); // Limpia errores previos en caso de éxito
      return true;
    } catch (error) {
      setError({ formError: "Error desconocido al crear persona." });
      return false;
    }
  }, []);

  const deletePeople = useCallback(async (id) => {
    try {
      const res = await deletePeopleRequest(id);
      if (res.status === 200) setPeoples(peoples.filter((people) => people._id !== id));
    } catch (error) {
      console.error("Error deleting person:", error);
      setError("Error deleting person");
    }
  }, [peoples]); // Dependencia: peoples para filtrar correctamente

  const getPeopleByDocNumber = useCallback(async (docnumber) => {
    try {
      const res = await getPeopleByDocNumberRequest(docnumber);
      if (res.data.length > 0) {
        setFilteredPeople(res.data);
      } else {
        setFilteredPeople([]);
      }
    } catch (error) {
      console.error("Error fetching people by document number:", error);
      setFilteredPeople([]);
    }
  }, []);

  const searchPeople = useCallback((docnumber) => {
    const results = peoples.filter(person => person.docnumber.includes(docnumber));
    setFilteredPeople(results);
  }, [peoples]); // Dependencia: peoples para filtrar correctamente

  const updatePeople = useCallback(async (id, data) => {
    try {
      const response = await updatePeopleRequest(id, data);
      setPeoples((prevPeople) =>
        prevPeople.map((person) => (person._id === id ? response.data : person))
      );
      return true;
    } catch (err) {
      setError({ updateError: "Error updating people" });
      return false;
    }
  }, []);

  return (
    <PeopleContext.Provider
      value={{
        peoples,
        filteredPeople,
        error,
        createPeoples,
        getPeoples,
        getPeople,
        deletePeople,
        updatePeople,
        getPeopleByDocNumber,
        searchPeople,
        setError // Provide a way to clear the error
      }}
    >
      {children}
    </PeopleContext.Provider>
  );
}

export default PeopleContext;
