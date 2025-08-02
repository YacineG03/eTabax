const express = require('express');
const router = express.Router();
const chefChantierController = require('../controllers/chefChantierController');

// Ouvriers CRUD (uniquement pour le chef de chantier)
router.get('/ouvriers', chefChantierController.getOuvriers);
router.post('/ouvriers', chefChantierController.createOuvrier);
router.put('/ouvriers/:id', chefChantierController.updateOuvrier);
router.delete('/ouvriers/:id', chefChantierController.deleteOuvrier);

// Pointage
router.post('/pointage', chefChantierController.pointeOuvrier);
router.get('/pointage', chefChantierController.getPointages);
router.put('/pointage/:id', chefChantierController.updatePointage);

// Meteo API
router.get('/meteo', chefChantierController.getMeteo);

// Stats dashboard
router.get('/stats', chefChantierController.getStats);

// Gestion du stock (avec vérification de seuil)
router.get('/stock', chefChantierController.getStock);
router.put('/stock/:id', chefChantierController.updateStock);
router.get('/stock/alertes', chefChantierController.getStockAlertes);

// Gestion des tâches
router.post('/taches', chefChantierController.createTache);
router.put('/taches/:id/avancement', chefChantierController.saisirAvancementTache);

// Affectation des équipes
router.post('/equipes', chefChantierController.affecterEquipe);

// Gestion des alertes de sécurité
router.post('/alertes', chefChantierController.createAlerte);
router.get('/alertes', chefChantierController.getAlertes);

// Rapport journalier
router.get('/rapport/journalier', chefChantierController.getDailyReport);
router.post('/rapport/journalier/send', chefChantierController.sendDailyReport);

module.exports = router;