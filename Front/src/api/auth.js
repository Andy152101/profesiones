import axios from "./axios";

// Autenticación básica
export const registerRequest = (user) => axios.post(`/register`, user);
export const loginRequest = (user) => axios.post(`/login`, user);
export const verifiTokenRequet = () => axios.get("/verify");

// Nuevos endpoints de registro
export const registerEmployeeRequest = (employeeData) =>
  axios.post(`/register-employee`, employeeData);
export const registerConsultantRequest = (consultantData) => {
  // Validar que companyRef exista
  if (!consultantData.companyRef) {
    throw new Error("companyRef es requerido");
  }

  // Enviar siempre el rol correcto según enum
  return axios.post(`/register-consultant`, {
    ...consultantData,
    role: "consultorEmpresa", // <-- coincide con tu enum
  });
};

// Gestión de usuarios
export const getRegistersRequest = () => axios.get(`/registers`);
export const getRegisterRequest = (id) => axios.get(`/registers/${id}`);
export const updateRegistersRequest = (id, user) =>
  axios
    .put(`/registers/${id}`, user) // no hace falta { withCredentials } aquí, ya lo tiene el instance
    .then((res) => res.data)
    .catch((err) => {
      console.error(
        "Error actualizando usuario:",
        err.response?.data || err.message
      );
      throw err;
    });

export const deleteRegistersRequest = async (id) =>
  axios.delete(`/registers/${id}`);

// Gestión de empresas
export const requestCompanyRegistrationRequest = (companyData) =>
  axios.post(`/companies`, companyData); // coincide con la ruta solo admin
export const getAllCompaniesRequest = () => axios.get(`/companies`);
export const getCompanyRequest = (id) => axios.get(`/companies/${id}`);
export const updateCompanyRequest = (id, companyData) =>
  axios.put(`/companies/${id}`, companyData);
export const deleteCompanyRequest = (id) => axios.delete(`/companies/${id}`);
export const getCompanyStatsRequest = () => axios.get(`/companies/stats`);
export const validateAccessCodeRequest = (code) =>
  axios.post(`/validate-access-code`, { code });
// Agregar esta función a tu archivo api/auth.js
export const getTestsRequest = () => axios.get("/tests");
export const getTestStatsRequest = () => axios.get("/tests/stats");
