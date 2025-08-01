const { db } = require('../config/firebase');
const axios = require('axios');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Configuration email (à ajuster avec tes credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Configuration WhatsApp (à ajuster avec tes credentials Twilio)
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// CRUD ouvriers
exports.getOuvriers = async (req, res) => {
  try {
    const snapshot = await db.collection('ouvriers').get();
    const ouvriers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ ouvriers });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.createOuvrier = async (req, res) => {
  try {
    const { nom, prenom, sexe, age, telephone, adresse } = req.body;
    if (!nom || !prenom || !sexe || !age || !telephone || !adresse) {
      return res.status(400).json({ success: false, message: "Tous les champs obligatoires doivent être remplis." });
    }
    const snapshot = await db.collection('ouvriers').where('telephone', '==', telephone).get();
    if (!snapshot.empty) {
      return res.status(400).json({ success: false, message: "Numéro déjà utilisé." });
    }
    const docRef = await db.collection('ouvriers').add({ nom, prenom, sexe, age, telephone, adresse });
    res.json({ success: true, id: docRef.id });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.updateOuvrier = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prenom, sexe, age, telephone, adresse } = req.body;
    if (!nom || !prenom || !sexe || !age || !telephone || !adresse) {
      return res.status(400).json({ success: false, message: "Tous les champs obligatoires doivent être remplis." });
    }
    const snapshot = await db.collection('ouvriers').where('telephone', '==', telephone).get();
    if (!snapshot.empty) {
      const exists = snapshot.docs.some(doc => doc.id !== id);
      if (exists) {
        return res.status(400).json({ success: false, message: "Numéro déjà utilisé." });
      }
    }
    await db.collection('ouvriers').doc(id).update({ nom, prenom, sexe, age, telephone, adresse });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.deleteOuvrier = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('ouvriers').doc(id).delete();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Pointage
exports.pointeOuvrier = async (req, res) => {
  try {
    const { ouvrierId, present } = req.body; 
    const date = new Date();
    await db.collection('pointages').add({ ouvrierId, date, present });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getPointages = async (req, res) => {
  try {
    const snapshot = await db.collection('pointages').get();
    const pointages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ pointages });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.updatePointage = async (req, res) => {
  try {
    const { id } = req.params;
    const { present } = req.body;
    await db.collection('pointages').doc(id).update({ present });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Meteo
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

exports.getMeteo = async (req, res) => {
  const ville = req.query.ville || 'Dakar';
  try {
    const currentRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=${WEATHER_API_KEY}&units=metric&lang=fr`
    );
    const forecastRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${ville}&appid=${WEATHER_API_KEY}&units=metric&lang=fr`
    );
    const current = currentRes.data;
    const forecast = forecastRes.data;
    return res.json({
      success: true,
      city: current.name,
      weather: {
        description: current.weather[0].description,
        temperature: current.main.temp,
        humidity: current.main.humidity,
        wind_speed: current.wind.speed,
      },
      forecast: forecast.list.map(f => ({
        dt_txt: f.dt_txt,
        description: f.weather[0].description,
        temperature: f.main.temp,
        humidity: f.main.humidity,
        wind_speed: f.wind.speed,
      })).slice(0, 8)
    });
  } catch (error) {
    console.error('Erreur API météo:', error.response?.data || error.message);
    return res.status(500).json({ success: false, message: 'Erreur récupération météo' });
  }
};

// Stats dashboard
exports.getStats = async (req, res) => {
  try {
    const alertes = await db.collection('alertes').get();
    const taches = await db.collection('taches').get();
    const pointages = await db.collection('pointages').where('present', '==', true).get();
    res.json({
      stats: {
        alertes: alertes.size,
        taches: taches.size,
        presents: pointages.size
      }
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Gestion du stock
exports.getStock = async (req, res) => {
  try {
    const snapshot = await db.collection('stock').get();
    const stock = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ stock });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantite, seuil } = req.body;
    console.log(`Mise à jour de stock ${id} avec quantite=${quantite}, seuil=${seuil}`);
    const stockRef = db.collection('stock').doc(id);
    const doc = await stockRef.get();
    if (!doc.exists) {
      await stockRef.set({ quantite, seuil });
    } else {
      await stockRef.update({ quantite, seuil });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erreur mise à jour stock:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStockAlertes = async (req, res) => {
  try {
    const snapshot = await db.collection('stock').get();
    const alertes = [];
    snapshot.forEach(doc => {
      const { quantite, seuil } = doc.data();
      if (quantite !== undefined && seuil !== undefined && quantite < seuil) {
        alertes.push({
          id: doc.id,
          message: `Stock bas pour ${doc.id}: ${quantite} unités restantes (seuil: ${seuil})`,
          date: new Date()
        });
      }
    });
    if (alertes.length > 0) {
      await db.collection('alertes').add({ type: 'stock', details: alertes, date: new Date() });
    }
    res.json({ alertes });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Gestion des tâches
exports.createTache = async (req, res) => {
  try {
    const { description, statut, ouvrierId } = req.body;
    const createurId = req.user?.uid; // Récupère l'ID du créateur
    if (!createurId) {
      return res.status(400).json({ success: false, message: "ID du créateur manquant." });
    }
    const tacheRef = await db.collection('taches').add({ description, statut, ouvrierId, createurId, dateDebut: new Date() });
    res.json({ success: true, id: tacheRef.id });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.saisirAvancementTache = async (req, res) => {
  try {
    const { id } = req.params;
    const { avancement } = req.body;
    await db.collection('taches').doc(id).update({ avancement, dateFin: new Date() });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Affectation des équipes
exports.affecterEquipe = async (req, res) => {
  try {
    const { ouvrierIds, tacheId, chefEquipeId } = req.body;
    if (!ouvrierIds.includes(chefEquipeId)) {
      return res.status(400).json({ success: false, message: "Le chef d'équipe doit être parmi les ouvriers listés." });
    }
    await db.collection('equipes').add({ ouvrierIds, tacheId, chefEquipeId, date: new Date() });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Gestion des alertes de sécurité
exports.createAlerte = async (req, res) => {
  try {
    const { description, type, ouvrierId } = req.body;
    const alerteRef = await db.collection('alertes').add({ description, type, ouvrierId, date: new Date() });
    res.json({ success: true, id: alerteRef.id });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getAlertes = async (req, res) => {
  try {
    const snapshot = await db.collection('alertes').get();
    const alertes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ alertes });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Rapport journalier
exports.getDailyReport = async (req) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const [ouvriers, pointages, taches, stock] = await Promise.all([
      db.collection('ouvriers').limit(50).get(), // Limite à 50 documents
      db.collection('pointages').where('date', '>=', new Date(today)).limit(50).get(), // Limite à 50
      db.collection('taches').limit(50).get(), // Limite à 50
      db.collection('stock').limit(50).get() // Limite à 50
    ]);

    const ouvrierStatus = {};
    pointages.docs.forEach(doc => {
      ouvrierStatus[doc.data().ouvrierId] = doc.data().present ? 'Présent' : 'Absent';
    });
    ouvriers.docs.forEach(doc => {
      if (!ouvrierStatus[doc.id]) ouvrierStatus[doc.id] = 'Absent';
    });

    const report = {
      date: today,
      ouvriers: ouvriers.docs.map(doc => ({
        id: doc.id,
        nom: doc.data().nom,
        prenom: doc.data().prenom,
        status: ouvrierStatus[doc.id] || 'Absent'
      })),
      taches: taches.docs.map(doc => ({
        id: doc.id,
        description: doc.data().description,
        statut: doc.data().statut,
        avancement: doc.data().avancement || 'Non défini'
      })),
      stock: stock.docs.map(doc => ({
        id: doc.id,
        quantite: doc.data().quantite,
        seuil: doc.data().seuil
      }))
    };

    return { success: true, report };
  } catch (e) {
    throw new Error(e.message);
  }
};

exports.sendDailyReport = async (req, res) => {
  try {
    const { method, recipient } = req.body;
    let message;

    // Génère le rapport
    const reportData = await exports.getDailyReport(req);

    message = `
Rapport Journalier - ${reportData.report.date}
Ouvriers:
${reportData.report.ouvriers.map(o => `${o.nom} ${o.prenom}: ${o.status}`).join('\n')}
Tâches:
${reportData.report.taches.map(t => `${t.description}: ${t.statut} (${t.avancement})`).join('\n')}
Stock:
${reportData.report.stock.map(s => `${s.id}: ${s.quantite} (Seuil: ${s.seuil})`).join('\n')}
    `;

    // Exécute l'envoi selon la méthode
    if (method === 'email') {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: `Rapport Journalier - ${reportData.report.date}`,
        text: message,
      });
    } else if (method === 'whatsapp') {
      await client.messages.create({
        body: message,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${recipient}`,
      });
    } else if (method === 'download') {
      res.setHeader('Content-Disposition', `attachment; filename=rapport_${reportData.report.date}.txt`);
      res.setHeader('Content-Type', 'text/plain');
      return res.send(message); // Retourne ici pour éviter une double réponse
    }

    res.status(200).json({ success: true, message: `Rapport envoyé par ${method}` });
  } catch (e) {
    console.error('Erreur envoi rapport:', e);
    res.status(500).json({ success: false, message: e.message });
  }
};