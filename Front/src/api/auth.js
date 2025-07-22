import axios from './axios'



export const registerRequest = (user) => axios.post(`/register`, user)
export const getRegistersRequest = () => axios.get(`/registers`);
export const getRegisterRequest = (id) => axios.get(`/register/${id}`);
export const updateRegistersRequest = (id, user) => axios.put(`/registers/${id}`, user);
export const deleteRegistersRequest = async (id) => axios.delete(`/registers/${id}`);
export const loginRequest = user =>axios.post(`/login`, user)

export const verifiTokenRequet = () => axios.get('/verify')