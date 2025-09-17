import axios from './axios'

export const getTestsRequest = () => axios.get(`/tests`);

export const getTestRequest = (id) => axios.get(`/tests/${id}`);

export const createTestsRequest = (tests) => axios.post("/tests", tests);

export const updateTestsRequest = (tests) => axios.put(`/tests/${tests._id}`, tests);

export const deleteTestsRequest =  (id) => axios.delete(`/tests/${id}`);

export const analyzeTestRequest = (id) => axios.get(`/tests/${id}/analyze`);