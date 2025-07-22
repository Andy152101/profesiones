import { createContext, useContext, useState, useCallback  } from "react";
import {getTestsRequest, createTestsRequest, deleteTestsRequest, updateTestsRequest, getTestRequest } from "../api/test.js";


const TestsContext = createContext();

export const useTests = () => {
  const context = useContext(TestsContext);
  if (!context) throw new Error("usePeople must be used within a TaskProvider");
  return context;
};


export function TestsProvider({ children }){
  const [tests, setTests] = useState([]);

  const getTests = useCallback(async () => {
    try {
      const res = await getTestsRequest();
      console.log("Fetched tests:", res.data);  // Debugging line
      setTests(res.data);
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
  }, []); // Use useCallback to memoize the function

  const getTest = async (id) => {
    try {
      const response = await getTestRequest(id);
      return response.data;
    } catch (error) {
      console.error('Error fetching test:', error);
    }
  };

  const createTests = async (newTest) => {
    try {
      const res = await createTestsRequest(newTest);
      setTests([...tests, res.data]);
      return res.data;
    } catch (error) {
      console.error('Error creating test:', error);
    }
  };
  const deleteTests = async (id) => {
    try {
      const res = await deleteTestsRequest(id);
      if (res.status === 200) setTests(tests.filter((tests) => tests._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const updateTest = async (id, updatedTest) => {
    try {
      const res = await updateTestsRequest({ _id: id, ...updatedTest });
      setTests(tests.map((tests) => (tests._id === id ? res.data : tests)));
      return res.data;
    } catch (error) {
      console.error('Error updating test:', error);
    }
  };

  return (
    <TestsContext.Provider
      value={{
        tests,
        createTests,
        getTests,
        getTest,
        deleteTests,
        updateTest,
      }}
    >
      {children}
    </TestsContext.Provider>
  );
}

export default TestsContext