const express = require('express');
const router = express.Router();
const chefDeProjetController = require('../controllers/chefDeProjetController');

// Définition conducteur de travaux
router.post('/conducteur-travaux', chefDeProjetController.defineConducteurTravaux);

// Consultation personnel
router.get('/personnel', chefDeProjetController.getPersonnel);

// Rapports
router.get('/rapports', chefDeProjetController.getReport);

// Suivi avancement global
router.get('/avancement-global', chefDeProjetController.getGlobalAdvancement);

// Planification
router.post('/planification', chefDeProjetController.createPlanification);

// Authentification
router.post('/login', chefDeProjetController.login);

module.exports = router;