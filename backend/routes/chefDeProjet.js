const express = require('express');
const router = express.Router();
const chefDeProjetController = require('../controllers/chefDeProjetController');
const { verifyFirebaseToken } = require('../middleware/auth');

// Middleware d'authentification pour toutes les routes
console.log('Chargement des routes chef-projet...');
router.use(verifyFirebaseToken);



// Gestion des chantiers (CRUD)
router.post('/chantiers', chefDeProjetController.createChantier);
router.get('/chantiers', chefDeProjetController.getChantiers);
router.get('/chantiers/:id', chefDeProjetController.getChantier);
router.put('/chantiers/:id', chefDeProjetController.updateChantier);
router.delete('/chantiers/:id', chefDeProjetController.deleteChantier);
router.get('/clients', chefDeProjetController.getClients);
router.get('/clients/:id', chefDeProjetController.getClientById);


// Anciennes fonctionnalités liées à un chantier spécifique
router.post('/chantiers/:chantierId/conducteur-travaux', chefDeProjetController.defineConducteurTravaux);
router.get('/chantiers/:chantierId/personnel', chefDeProjetController.getPersonnel);
router.get('/chantiers/:chantierId/rapports', chefDeProjetController.getReport);
router.get('/chantiers/:chantierId/avancement-global', chefDeProjetController.getGlobalAdvancement);
router.post('/chantiers/:chantierId/planification', chefDeProjetController.createPlanification);

// Nouvelles fonctionnalités
router.put('/profil', chefDeProjetController.updateProfil); // Gestion du profil
router.post('/magasin/commande', chefDeProjetController.createCommande); // Passer une commande (magasin)
router.put('/magasin/commande/:id/validate', chefDeProjetController.validateCommande); // Validation par le client

module.exports = router;    