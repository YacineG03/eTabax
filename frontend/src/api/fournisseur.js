import api from './config';

// Configuration des endpoints fournisseur
const FOURNISSEUR_API = {
  // Produits
  PRODUCTS: '/api/fournisseur/products',
  PRODUCT: (id) => `/api/fournisseur/products/${id}`,
  
  // Commandes
  ORDERS: '/api/fournisseur/orders',
  ORDER_STATUS: (id) => `/api/fournisseur/orders/${id}/status`,
  
  // Statistiques
  STATS: '/api/fournisseur/stats'
};

/**
 * API Fournisseur - Gestion des produits
 */

// Récupérer tous les produits du fournisseur
export const getFournisseurProducts = async () => {
  try {
    const response = await api.get(FOURNISSEUR_API.PRODUCTS);
    return response.data;
  } catch (error) {
    console.error('Erreur récupération produits fournisseur:', error);
    throw error;
  }
};

// Récupérer un produit spécifique
export const getFournisseurProduct = async (productId) => {
  try {
    const response = await api.get(FOURNISSEUR_API.PRODUCT(productId));
    return response.data;
  } catch (error) {
    console.error('Erreur récupération produit fournisseur:', error);
    throw error;
  }
};

// Créer un nouveau produit
export const createFournisseurProduct = async (productData) => {
  try {
    const response = await api.post(FOURNISSEUR_API.PRODUCTS, productData);
    return response.data;
  } catch (error) {
    console.error('Erreur création produit fournisseur:', error);
    throw error;
  }
};

// Mettre à jour un produit
export const updateFournisseurProduct = async (productId, productData) => {
  try {
    const response = await api.put(FOURNISSEUR_API.PRODUCT(productId), productData);
    return response.data;
  } catch (error) {
    console.error('Erreur mise à jour produit fournisseur:', error);
    throw error;
  }
};

// Supprimer un produit
export const deleteFournisseurProduct = async (productId) => {
  try {
    const response = await api.delete(FOURNISSEUR_API.PRODUCT(productId));
    return response.data;
  } catch (error) {
    console.error('Erreur suppression produit fournisseur:', error);
    throw error;
  }
};

/**
 * API Fournisseur - Gestion des commandes
 */

// Récupérer toutes les commandes du fournisseur
export const getFournisseurOrders = async () => {
  try {
    const response = await api.get(FOURNISSEUR_API.ORDERS);
    return response.data;
  } catch (error) {
    console.error('Erreur récupération commandes fournisseur:', error);
    throw error;
  }
};

// Mettre à jour le statut d'une commande
export const updateFournisseurOrderStatus = async (orderId, status) => {
  try {
    const response = await api.put(FOURNISSEUR_API.ORDER_STATUS(orderId), {
      statut: status
    });
    return response.data;
  } catch (error) {
    console.error('Erreur mise à jour statut commande fournisseur:', error);
    throw error;
  }
};

/**
 * API Fournisseur - Statistiques
 */

// Récupérer les statistiques du fournisseur
export const getFournisseurStats = async () => {
  try {
    const response = await api.get(FOURNISSEUR_API.STATS);
    return response.data;
  } catch (error) {
    console.error('Erreur récupération statistiques fournisseur:', error);
    throw error;
  }
};

/**
 * Utilitaires pour les produits
 */

// Catégories de produits disponibles
export const PRODUCT_CATEGORIES = [
  { value: 'ciment', label: 'Ciment' },
  { value: 'outils', label: 'Outils' },
  { value: 'equipements-securite', label: 'Équipements de Sécurité' },
  { value: 'materiaux-construction', label: 'Matériaux de Construction' },
  { value: 'machines', label: 'Machines' },
  { value: 'autres', label: 'Autres' }
];

// Statuts de produits disponibles
export const PRODUCT_STATUS = [
  { value: 'actif', label: 'Actif' },
  { value: 'inactif', label: 'Inactif' },
  { value: 'rupture', label: 'Rupture de Stock' }
];

// Statuts de commandes disponibles
export const ORDER_STATUS = [
  { value: 'en-attente', label: 'En Attente' },
  { value: 'confirmee', label: 'Confirmée' },
  { value: 'en-preparation', label: 'En Préparation' },
  { value: 'expediee', label: 'Expédiée' },
  { value: 'livree', label: 'Livrée' },
  { value: 'annulee', label: 'Annulée' }
];

// Fonction pour formater le prix
export const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF'
  }).format(price);
};

// Fonction pour obtenir le label d'une catégorie
export const getCategoryLabel = (categoryValue) => {
  const category = PRODUCT_CATEGORIES.find(cat => cat.value === categoryValue);
  return category ? category.label : categoryValue;
};

// Fonction pour obtenir le label d'un statut de produit
export const getProductStatusLabel = (statusValue) => {
  const status = PRODUCT_STATUS.find(st => st.value === statusValue);
  return status ? status.label : statusValue;
};

// Fonction pour obtenir le label d'un statut de commande
export const getOrderStatusLabel = (statusValue) => {
  const status = ORDER_STATUS.find(st => st.value === statusValue);
  return status ? status.label : statusValue;
}; 