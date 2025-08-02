import { apiClient } from './config';

// Gestion des chantiers
export const getChantiers = async () => {
  try {
    const response = await apiClient.get('/chef-projet/chantiers');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des chantiers');
  }
};

export const getChantier = async (id) => {
  try {
    const response = await apiClient.get(`/chef-projet/chantiers/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du chantier');
  }
};

export const createChantier = async (chantierData) => {
  try {
    const response = await apiClient.post('/chef-projet/chantiers', chantierData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la création du chantier');
  }
};

export const updateChantier = async (id, chantierData) => {
  try {
    const response = await apiClient.put(`/chef-projet/chantiers/${id}`, chantierData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la modification du chantier');
  }
};

export const deleteChantier = async (id) => {
  try {
    const response = await apiClient.delete(`/chef-projet/chantiers/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du chantier');
  }
};

// Gestion du profil
export const updateProfil = async (profilData) => {
  try {
    const response = await apiClient.put('/chef-projet/profil', profilData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du profil');
  }
};

// Gestion des commandes
export const createCommande = async (commandeData) => {
  try {
    const response = await apiClient.post('/chef-projet/magasin/commande', commandeData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la création de la commande');
  }
};

export const validateCommande = async (commandeId) => {
  try {
    const response = await apiClient.put(`/chef-projet/magasin/commande/${commandeId}/validate`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la validation de la commande');
  }
};

// Fonctionnalités liées aux chantiers spécifiques
export const defineConducteurTravaux = async (chantierId, conducteurData) => {
  try {
    const response = await apiClient.post(`/chef-projet/chantiers/${chantierId}/conducteur-travaux`, conducteurData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la définition du conducteur de travaux');
  }
};

export const getPersonnel = async (chantierId) => {
  try {
    const response = await apiClient.get(`/chef-projet/chantiers/${chantierId}/personnel`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du personnel');
  }
};

export const getReport = async (chantierId) => {
  try {
    const response = await apiClient.get(`/chef-projet/chantiers/${chantierId}/rapports`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des rapports');
  }
};

export const getGlobalAdvancement = async (chantierId) => {
  try {
    const response = await apiClient.get(`/chef-projet/chantiers/${chantierId}/avancement-global`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération de l\'avancement');
  }
};

export const createPlanification = async (chantierId, planificationData) => {
  try {
    const response = await apiClient.post(`/chef-projet/chantiers/${chantierId}/planification`, planificationData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la création de la planification');
  }
}; 

export const getClients = async () => {
  try {
    const response = await apiClient.get('/chef-projet/clients?role=client');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des clients');
  }
};

export const searchClientById = async (id) => {
  try {
    const response = await apiClient.get('/chef-projet/clients', {
      params: { search: id, role: 'client' }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la recherche du client');
  }
};

export const getClientById = async (id) => {
  try {
    const response = await apiClient.get(`/chef-projet/clients/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du client');
  }
};