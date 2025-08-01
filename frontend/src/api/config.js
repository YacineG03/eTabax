// Configuration de l'API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Headers par défaut
const getDefaultHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };

  // Ajouter le token d'authentification s'il existe
  // Essayer tous les types de tokens possibles
  const firebaseToken = localStorage.getItem('firebaseToken');
  const authToken = localStorage.getItem('authToken');
  const token = localStorage.getItem('token'); // Token standard utilisé par Login.jsx
  const finalToken = firebaseToken || authToken || token;
  
  if (finalToken) {
    headers['Authorization'] = `Bearer ${finalToken}`;
  }

  return headers;
};

// Fonction utilitaire pour les appels API
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: getDefaultHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    // Gérer les erreurs HTTP
    if (!response.ok) {
      throw new Error(data.message || `Erreur ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
};

// Méthodes HTTP
const api = {
  get: (endpoint) => apiCall(endpoint, { method: 'GET' }),
  
  post: (endpoint, body) => apiCall(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  
  put: (endpoint, body) => apiCall(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  }),
  
  delete: (endpoint) => apiCall(endpoint, { method: 'DELETE' }),
};

// Client API compatible avec axios pour les nouveaux composants
const apiClient = {
  get: async (endpoint) => {
    const response = await apiCall(endpoint, { method: 'GET' });
    return { data: response };
  },
  
  post: async (endpoint, body) => {
    const response = await apiCall(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return { data: response };
  },
  
  put: async (endpoint, body) => {
    const response = await apiCall(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    return { data: response };
  },
  
  delete: async (endpoint) => {
    const response = await apiCall(endpoint, { method: 'DELETE' });
    return { data: response };
  },
};

export default api;
export { apiClient }; 