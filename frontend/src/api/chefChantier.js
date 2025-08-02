import api from './config';

const chefChantierAPI = {
  // Ouvriers CRUD
  getOuvriers: () => api.get('/chantier/ouvriers'),
  createOuvrier: (data) => api.post('/chantier/ouvriers', data),
  updateOuvrier: (id, data) => api.put(`/chantier/ouvriers/${id}`, data),
  deleteOuvrier: (id) => api.delete(`/chantier/ouvriers/${id}`),

  // Pointage
  pointerOuvrier: (data) => api.post('/chantier/pointage', data),
  getPointages: () => api.get('/chantier/pointage'),
  updatePointage: (id, data) => api.put(`/chantier/pointage/${id}`, data),
  deletePointage: (id) => api.delete(`/chantier/pointage/${id}`),

  // Stats dashboard
  getStats: () => api.get('/chantier/stats'),

  // Météo 
  getMeteo: (ville = 'Dakar') => api.get(`/chantier/meteo?ville=${ville}`)
  
};

export default chefChantierAPI;
