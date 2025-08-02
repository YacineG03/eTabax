const { db } = require('../config/firebase');
const jwt = require('jsonwebtoken');

// Gestion des chantiers (CRUD)
exports.createChantier = async (req, res) => {
  try {
    const { nom, geolocalisation, proprietaireEmailOrTel } = req.body;
    const createurId = req.user?.uid;
    if (!createurId || !nom || !geolocalisation || !proprietaireEmailOrTel) {
      return res.status(400).json({ success: false, message: "Données manquantes (nom, géolocalisation ou propriétaire)." });
    }

    // Vérifier si le propriétaire existe et a le rôle "client"
    let proprietaireId = null;
    const usersSnapshot = await db.collection('users').where('email', '==', proprietaireEmailOrTel).get();
    if (usersSnapshot.empty) {
      const telSnapshot = await db.collection('users').where('telephone', '==', proprietaireEmailOrTel).get();
      if (telSnapshot.empty) {
        return res.status(404).json({ success: false, message: "Propriétaire non trouvé dans la base de données." });
      }
      proprietaireId = telSnapshot.docs[0].id;
      const userData = telSnapshot.docs[0].data();
      if (userData.role !== 'client') {
        return res.status(400).json({ success: false, message: "Le propriétaire doit être un client." });
      }
    } else {
      proprietaireId = usersSnapshot.docs[0].id;
      const userData = usersSnapshot.docs[0].data();
      if (userData.role !== 'client') {
        return res.status(400).json({ success: false, message: "Le propriétaire doit être un client." });
      }
    }

    const chantierRef = await db.collection('chantiers').add({
      nom,
      geolocalisation,
      proprietaireId,
      createurId,
      dateCreation: new Date(),
      statut: 'actif'
    });
    res.json({ success: true, id: chantierRef.id });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getChantiers = async (req, res) => {
  try {
    const createurId = req.user?.uid;
    if (!createurId) return res.status(400).json({ success: false, message: "ID du créateur manquant." });

    const snapshot = await db.collection('chantiers').where('createurId', '==', createurId).get();
    const chantiers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, chantiers });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getChantier = async (req, res) => {
  try {
    const { id } = req.params;
    const createurId = req.user?.uid;
    if (!createurId || !id) return res.status(400).json({ success: false, message: "ID manquant." });

    const chantierDoc = await db.collection('chantiers').doc(id).get();
    if (!chantierDoc.exists) return res.status(404).json({ success: false, message: "Chantier non trouvé." });
    const chantier = chantierDoc.data();
    if (chantier.createurId !== createurId) return res.status(403).json({ success: false, message: "Accès non autorisé." });

    res.json({ success: true, chantier });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.updateChantier = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, geolocalisation, proprietaireEmailOrTel } = req.body;
    const createurId = req.user?.uid;
    if (!createurId || !id) return res.status(400).json({ success: false, message: "ID manquant." });

    const chantierDoc = await db.collection('chantiers').doc(id).get();
    if (!chantierDoc.exists) return res.status(404).json({ success: false, message: "Chantier non trouvé." });
    if (chantierDoc.data().createurId !== createurId) return res.status(403).json({ success: false, message: "Accès non autorisé." });

    let proprietaireId = chantierDoc.data().proprietaireId;
    if (proprietaireEmailOrTel) {
      const usersSnapshot = await db.collection('users').where('email', '==', proprietaireEmailOrTel).get();
      if (usersSnapshot.empty) {
        const telSnapshot = await db.collection('users').where('telephone', '==', proprietaireEmailOrTel).get();
        if (telSnapshot.empty) {
          return res.status(404).json({ success: false, message: "Nouveau propriétaire non trouvé." });
        }
        proprietaireId = telSnapshot.docs[0].id;
        const userData = telSnapshot.docs[0].data();
        if (userData.role !== 'client') {
          return res.status(400).json({ success: false, message: "Le propriétaire doit être un client." });
        }
      } else {
        proprietaireId = usersSnapshot.docs[0].id;
        const userData = usersSnapshot.docs[0].data();
        if (userData.role !== 'client') {
          return res.status(400).json({ success: false, message: "Le propriétaire doit être un client." });
        }
      }
    }

    await db.collection('chantiers').doc(id).update({
      nom,
      geolocalisation,
      proprietaireId,
      updatedAt: new Date()
    });
    res.json({ success: true, message: "Chantier mis à jour avec succès" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.deleteChantier = async (req, res) => {
  try {
    const { id } = req.params;
    const createurId = req.user?.uid;
    if (!createurId || !id) return res.status(400).json({ success: false, message: "ID manquant." });

    const chantierDoc = await db.collection('chantiers').doc(id).get();
    if (!chantierDoc.exists) return res.status(404).json({ success: false, message: "Chantier non trouvé." });
    if (chantierDoc.data().createurId !== createurId) return res.status(403).json({ success: false, message: "Accès non autorisé." });

    await db.collection('chantiers').doc(id).delete();
    res.json({ success: true, message: "Chantier supprimé avec succès" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Anciennes fonctionnalités liées à un chantier spécifique
exports.defineConducteurTravaux = async (req, res) => {
  try {
    const { chantierId, ouvrierId } = req.body;
    const createurId = req.user?.uid;
    if (!createurId || !chantierId) return res.status(400).json({ success: false, message: "ID du créateur ou du chantier manquant." });

    const chantierDoc = await db.collection('chantiers').doc(chantierId).get();
    if (!chantierDoc.exists || chantierDoc.data().createurId !== createurId) {
      return res.status(403).json({ success: false, message: "Accès non autorisé au chantier." });
    }

    await db.collection('conducteurs_travaux').doc(`${chantierId}_${ouvrierId}`).set({
      ouvrierId,
      chantierId,
      createurId,
      date: new Date()
    });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getPersonnel = async (req, res) => {
  try {
    const { chantierId } = req.params;
    const createurId = req.user?.uid;
    if (!createurId || !chantierId) return res.status(400).json({ success: false, message: "ID du créateur ou du chantier manquant." });

    const chantierDoc = await db.collection('chantiers').doc(chantierId).get();
    if (!chantierDoc.exists || chantierDoc.data().createurId !== createurId) {
      return res.status(403).json({ success: false, message: "Accès non autorisé au chantier." });
    }

    const snapshot = await db.collection('ouvriers').where('chantierId', '==', chantierId).get();
    const personnel = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, personnel });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getReport = async (req, res) => {
  try {
    const { chantierId } = req.params;
    const createurId = req.user?.uid;
    if (!createurId || !chantierId) return res.status(400).json({ success: false, message: "ID du créateur ou du chantier manquant." });

    const chantierDoc = await db.collection('chantiers').doc(chantierId).get();
    if (!chantierDoc.exists || chantierDoc.data().createurId !== createurId) {
      return res.status(403).json({ success: false, message: "Accès non autorisé au chantier." });
    }

    const today = new Date().toISOString().split('T')[0];
    const [ouvriers, taches] = await Promise.all([
      db.collection('ouvriers').where('chantierId', '==', chantierId).get(),
      db.collection('taches').where('chantierId', '==', chantierId).get()
    ]);
    const report = {
      date: today,
      chantierId,
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

exports.getGlobalAdvancement = async (req, res) => {
  try {
    const { chantierId } = req.params;
    const createurId = req.user?.uid;
    if (!createurId || !chantierId) return res.status(400).json({ success: false, message: "ID du créateur ou du chantier manquant." });

    const chantierDoc = await db.collection('chantiers').doc(chantierId).get();
    if (!chantierDoc.exists || chantierDoc.data().createurId !== createurId) {
      return res.status(403).json({ success: false, message: "Accès non autorisé au chantier." });
    }

    const snapshot = await db.collection('taches').where('chantierId', '==', chantierId).get();
    const totalTaches = snapshot.size;
    const avancees = snapshot.docs.filter(doc => doc.data().avancement === 'Terminé').length;
    const avancement = totalTaches > 0 ? (avancees / totalTaches) * 100 : 0;
    res.json({ success: true, avancement: `${avancement.toFixed(2)}%`, totalTaches, avancees });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.createPlanification = async (req, res) => {
  try {
    const { chantierId, description, dateDebut, dateFin } = req.body;
    const createurId = req.user?.uid;
    if (!createurId || !chantierId) return res.status(400).json({ success: false, message: "ID du créateur ou du chantier manquant." });

    const chantierDoc = await db.collection('chantiers').doc(chantierId).get();
    if (!chantierDoc.exists || chantierDoc.data().createurId !== createurId) {
      return res.status(403).json({ success: false, message: "Accès non autorisé au chantier." });
    }

    const planRef = await db.collection('planifications').add({
      description,
      dateDebut,
      dateFin,
      chantierId,
      createurId
    });
    res.json({ success: true, id: planRef.id });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Nouvelles fonctionnalités
exports.updateProfil = async (req, res) => {
  try {
    const { uid } = req.user;
    const { nom, prenom, telephone, adresse, email, cv, clientsAides, anneesExperience } = req.body;
    if (!uid) return res.status(400).json({ success: false, message: "ID de l'utilisateur manquant." });

    await db.collection('users').doc(uid).update({
      nom,
      prenom,
      telephone,
      adresse,
      email,
      cv: cv || '', // Résumé ou lien vers un CV
      clientsAides: clientsAides || 0, // Nombre de clients aidés, par défaut 0
      anneesExperience: anneesExperience || 0, // Nombre d'années d'expérience, par défaut 0
      updatedAt: new Date()
    });
    res.json({ success: true, message: "Profil mis à jour avec succès" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.createCommande = async (req, res) => {
  try {
    const { clientId, produits, total } = req.body; // produits: [{ id, nom, prix, quantite }]
    const createurId = req.user?.uid;
    if (!createurId || !clientId) return res.status(400).json({ success: false, message: "ID du créateur ou du client manquant." });

    const commandeRef = await db.collection('commandes').add({
      createurId,
      clientId,
      produits,
      total,
      statut: 'en attente de validation', // État initial
      dateCreation: new Date(),
      dateValidation: null
    });
    res.json({ success: true, id: commandeRef.id });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.validateCommande = async (req, res) => {
  try {
    const { id } = req.params;
    const clientId = req.user?.uid;
    if (!clientId) return res.status(400).json({ success: false, message: "ID du client manquant." });

    const commandeDoc = await db.collection('commandes').doc(id).get();
    if (!commandeDoc.exists) return res.status(404).json({ success: false, message: "Commande non trouvée." });
    const commande = commandeDoc.data();
    if (commande.clientId !== clientId) return res.status(403).json({ success: false, message: "Accès non autorisé." });
    if (commande.statut !== 'en attente de validation') return res.status(400).json({ success: false, message: "Commande déjà validée ou annulée." });

    await db.collection('commandes').doc(id).update({
      statut: 'validée',
      dateValidation: new Date()
    });
    res.json({ success: true, message: "Commande validée avec succès" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getClients = async (req, res) => {
  try {
    const { role, search } = req.query;
    let query = db.collection('users');
    if (role) {
      query = query.where('role', '==', role);
    }
    const snapshot = await query.get();
    const users = [];
    snapshot.forEach(doc => {
      const userData = doc.data();
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch = 
          userData.email?.toLowerCase().includes(searchLower) ||
          userData.telephone?.includes(search) ||
          userData.nom?.toLowerCase().includes(searchLower) ||
          userData.prenom?.toLowerCase().includes(searchLower);
        if (matchesSearch) {
          users.push({ id: doc.id, ...userData });
        }
      } else {
        users.push({ id: doc.id, ...userData });
      }
    });
    res.json({ success: true, users });
  } catch (error) {
    console.error('Erreur lors de la récupération des clients:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des clients' });
  }
};

exports.getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('users').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "Client non trouvé" });
    }

    const userData = doc.data();
    if (userData.role !== 'client') {
      return res.status(404).json({ success: false, message: "Client non trouvé" });
    }

    res.json({ success: true, client: { id: doc.id, ...userData } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
