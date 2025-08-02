// Configuration de l'API
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Headers par défaut
const getDefaultHeaders = () => {
  const headers = {
    "Content-Type": "application/json",
  };

  // Ajouter le token d'authentification s'il existe
  const token =
    localStorage.getItem("token") || localStorage.getItem("authToken");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
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
    console.error("Erreur API:", error);
    throw error;
  }
};

// Méthodes HTTP
const api = {
  get: (endpoint) => apiCall(endpoint, { method: "GET" }),

  post: (endpoint, body) =>
    apiCall(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: (endpoint, body) =>
    apiCall(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: (endpoint) => apiCall(endpoint, { method: "DELETE" }),
};

export default api;
