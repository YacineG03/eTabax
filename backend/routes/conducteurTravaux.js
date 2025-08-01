const express = require('express');
const router = express.Router();
const conducteurTravauxController = require('../controllers/conducteurTravauxController');

// Gestion des devis
router.post('/devis', conducteurTravauxController.createDevis);
router.get('/devis', conducteurTravauxController.getDevis);

// Rapports de stocks
router.get('/rapports/stocks', conducteurTravauxController.getStockReport);

// Gestion des équipes
router.get('/equipes', conducteurTravauxController.getEquipes);

// Définition chef de chantier
router.post('/chef-chantier', conducteurTravauxController.defineChefChantier);


module.exports = router;