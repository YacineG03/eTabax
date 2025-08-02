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
    console.log("Token d'authentification ajouté:", token.substring(0, 20) + "...");
  } else {
    console.log("Aucun token d'authentification trouvé");
  }

  return headers;
};

// Fonction utilitaire pour les appels API
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('API Call - URL:', url);
  console.log('API Call - Options:', options);

  const config = {
    headers: getDefaultHeaders(),
    ...options,
  };

  try {
    console.log('API Call - Config:', config);
    const response = await fetch(url, config);
    console.log('API Call - Response status:', response.status);
    console.log('API Call - Response ok:', response.ok);
    
    const data = await response.json();
    console.log('API Call - Response data:', data);

    // Gérer les erreurs HTTP
    if (!response.ok) {
      console.error('API Call - HTTP Error:', response.status, data);
      if (data.errors && Array.isArray(data.errors)) {
        console.error('API Call - Validation errors:', data.errors);
        console.error('API Call - Validation errors details:', JSON.stringify(data.errors, null, 2));
        console.error('API Call - First error:', data.errors[0]);
      }
      throw new Error(data.message || `Erreur ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Erreur API:", error);
    console.error("Erreur API - URL:", url);
    console.error("Erreur API - Config:", config);
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
