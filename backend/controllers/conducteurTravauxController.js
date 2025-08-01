const { db } = require('../config/firebase');
const jwt = require('jsonwebtoken');

// Gestion des devis
exports.createDevis = async (req, res) => {
  try {
    const { description, montant, date } = req.body;
    const createurId = req.user?.uid;
    if (!createurId) return res.status(400).json({ success: false, message: "ID du créateur manquant." });
    const devisRef = await db.collection('devis').add({ description, montant, date, createurId });
    res.json({ success: true, id: devisRef.id });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getDevis = async (req, res) => {
  try {
    const snapshot = await db.collection('devis').get();
    const devis = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ devis });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Rapports de stocks
exports.getStockReport = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const snapshot = await db.collection('stock').get();
    const report = snapshot.docs.map(doc => ({
      id: doc.id,
      quantite: doc.data().quantite,
      seuil: doc.data().seuil,
      date: today
    }));
    res.json({ success: true, report });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Gestion des équipes
exports.getEquipes = async (req, res) => {
  try {
    const snapshot = await db.collection('equipes').get();
    const equipes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ equipes });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Définition chef de chantier
exports.defineChefChantier = async (req, res) => {
  try {
    const { ouvrierId } = req.body;
    const createurId = req.user?.uid;
    if (!createurId) return res.status(400).json({ success: false, message: "ID du créateur manquant." });
    await db.collection('chefs_chantier').doc(ouvrierId).set({ ouvrierId, createurId, date: new Date() });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

