// Export centralisé de toutes les APIs
import authAPI from './auth';

const api = {
  auth: authAPI,
  // Ajouter d'autres APIs ici au fur et à mesure
  // user: userAPI,
  // products: productsAPI,
  // orders: ordersAPI,
};

export default api; 