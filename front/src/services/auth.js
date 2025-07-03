import API from './api';

// Appel à l’API de login
export const loginUser = async (email, password) => {
  const response = await API.post('/users/login', {
    email,
    password,
  });
  return response.data;
};