import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const teamService = {
  getAll: () => api.get('/teams'),
  getById: (id) => api.get(`/teams/${id}`),
  getStats: (id) => api.get(`/teams/${id}/stats`),
};

export const playerService = {
  getAll: () => api.get('/players'),
  getById: (id) => api.get(`/players/${id}`),
  getStats: (id) => api.get(`/players/${id}/stats`),
};

export const matchService = {
  getAll: () => api.get('/matches'),
  getById: (id) => api.get(`/matches/${id}`),
  getUpcoming: () => api.get('/matches/upcoming'),
  getPredictions: (matchId) => api.get(`/matches/${matchId}/predictions`),
};

export default api; 