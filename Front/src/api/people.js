import axios from './axios'

export const getPeoplesRequest = () => axios.get(`/people`);

export const getPeopleRequest = (id) => axios.get(`/people/${id}`);

export const createPeopleRequest = async (people) => {
  try {
    const response = await axios.post('/people', people);
    return response.data; // Devuelve los datos de la respuesta
  } catch (error) {
    // Aquí manejamos el error
    if (error.response) {
      return { error: error.response.data.error || 'Error desconocido' };
    } else {
      return { error: 'Error desconocido' };
    }
  }
};

export const updatePeopleRequest = (id, people) => axios.put(`/people/${id}`, people);

export const deletePeopleRequest = (id) => axios.delete(`/people/${id}`);

export const getPeopleByDocNumberRequest = async (id) => axios.get(`/people/search/${id}`);


