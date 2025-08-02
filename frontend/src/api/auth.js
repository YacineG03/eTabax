import api from "./config";

// Service d'authentification
const authAPI = {
  // Inscription d'un nouvel utilisateur
  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);

      // Sauvegarder le token dans localStorage
      if (response.success && response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  // Connexion d'un utilisateur
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);

      // Sauvegarder le token dans localStorage
      if (response.success && response.data && response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data));
      } else if (response.token) {
        // Format alternatif du backend
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("user", JSON.stringify(response));
      }

      return response;
    } catch (error) {
      console.error("Erreur de connexion:", error);
      throw error;
    }
  },

  // Récupérer le profil utilisateur
  getProfile: async () => {
    try {
      const response = await api.get("/fournisseur/profil"); // <-- Correction ici
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Déconnexion
  logout: async () => {
    try {
      const response = await api.post("/auth/logout");

      // Supprimer les données de localStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");

      return response;
    } catch (error) {
      // Même en cas d'erreur, supprimer les données locales
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      throw error;
    }
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");
    return !!(token && user);
  },

  // Récupérer les données utilisateur du localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Mettre à jour les données utilisateur dans localStorage
  updateUserData: (userData) => {
    const currentUser = authAPI.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  },

  // Supprimer le token (pour forcer la déconnexion)
  clearAuth: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },
};

const loginWithSocial = async (data) => {
  try {
    const response = await fetch("/auth/social-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (e) {
    return { success: false, message: "Erreur réseau." };
  }
};

export default authAPI;
