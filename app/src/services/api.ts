import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.gobarber.gabrielgianelli.dev',
});

export default api;
