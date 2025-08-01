const { db } = require('../config/firebase');
const jwt = require('jsonwebtoken');

// Définition conducteur de travaux
exports.defineConducteurTravaux = async (req, res) => {
  try {
    const { ouvrierId } = req.body;
    const createurId = req.user?.uid;
    if (!createurId) return res.status(400).json({ success: false, message: "ID du créateur manquant." });
    await db.collection('conducteurs_travaux').doc(ouvrierId).set({ ouvrierId, createurId, date: new Date() });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Consultation personnel
exports.getPersonnel = async (req, res) => {
  try {
    const snapshot = await db.collection('ouvriers').get();
    const personnel = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ personnel });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Rapports
exports.getReport = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const [ouvriers, taches] = await Promise.all([
      db.collection('ouvriers').get(),
      db.collection('taches').get()
    ]);
    const report = {
      date: today,
      ouvriers: ouvriers.docs.map(doc => ({ id: doc.id, nom: doc.data().nom, prenom: doc.data().prenom })),
      taches: taches.docs.map(doc => ({
        id: doc.id,
        description: doc.data().description,
        statut: doc.data().statut,
        avancement: doc.data().avancement || 'Non défini'
      }))
    };
    res.json({ success: true, report });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Suivi avancement global
exports.getGlobalAdvancement = async (req, res) => {
  try {
    const snapshot = await db.collection('taches').get();
    const totalTaches = snapshot.size;
    const avancees = snapshot.docs.filter(doc => doc.data().avancement === 'Terminé').length;
    const avancement = totalTaches > 0 ? (avancees / totalTaches) * 100 : 0;
    res.json({ success: true, avancement: `${avancement.toFixed(2)}%`, totalTaches, avancees });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Planification
exports.createPlanification = async (req, res) => {
  try {
    const { description, dateDebut, dateFin } = req.body;
    const createurId = req.user?.uid;
    if (!createurId) return res.status(400).json({ success: false, message: "ID du créateur manquant." });
    const planRef = await db.collection('planifications').add({ description, dateDebut, dateFin, createurId });
    res.json({ success: true, id: planRef.id });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Authentification
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await db.collection('users').where('username', '==', username).get();
    if (user.empty || user.docs[0].data().password !== password) {
      return res.status(401).json({ success: false, message: "Identifiants invalides." });
    }
    const token = jwt.sign({ uid: user.docs[0].id, role: 'chef_projet' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, token });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};