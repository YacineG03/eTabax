const { auth, db } = require('../config/firebase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Inscription d'un nouvel utilisateur
const register = async (req, res) => {
  try {
    console.log('Reçu pour inscription:', req.body); // Log du corps de la requête

    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Erreurs de validation:', errors.array()); // Log des erreurs de validation
      return res.status(400).json({ success: false, message: 'Données invalides', errors: errors.array() });
    }

    const { nom, prenom, telephone, adresse, email, motDePasse, role } = req.body;

    // Liste des rôles autorisés
    const allowedRoles = ['client', 'fournisseur', 'chef-projet'];
    
    // Vérifier si le rôle est valide
    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Rôle invalide. Les rôles autorisés sont : client, fournisseur, chef-projet' 
      });
    }

    // Conversion automatique du numéro sénégalais en E.164
    let phoneNumber = telephone;
    if (/^7[05678][0-9]{7}$/.test(telephone)) {
      phoneNumber = '+221' + telephone;
    }

    // Vérifier si l'utilisateur existe déjà
    try {
      const existingUser = await auth.getUserByEmail(email);
      return res.status(400).json({ success: false, message: 'Un utilisateur avec cet email existe déjà' });
    } catch (error) {
      // L'utilisateur n'existe pas, on peut continuer
    }

    // Créer l'utilisateur dans Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password: motDePasse,
      displayName: `${prenom} ${nom}`,
      phoneNumber
    });

    // Hasher le mot de passe pour le stockage local
    const hashedPassword = await bcrypt.hash(motDePasse, 12);

    // Sauvegarder les données utilisateur dans Firestore
    await db.collection('users').doc(userRecord.uid).set({
      nom,
      prenom,
      telephone,
      adresse,
      email,
      motDePasse: hashedPassword,
      role: role || 'chef-projet',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Créer un token JWT
    const token = jwt.sign(
      {
        uid: userRecord.uid,
        email: userRecord.email,
        nom,
        prenom,
        role: role || 'chef-projet'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: {
        uid: userRecord.uid,
        email: userRecord.email,
        nom,
        prenom,
        role: role || 'chef-projet',
        token
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de l\'inscription', error: error.message });
  }
};

// Connexion d'un utilisateur
const login = async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const { email, motDePasse } = req.body;

    // Récupérer l'utilisateur depuis Firestore
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();

    if (snapshot.empty) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(motDePasse, userData.motDePasse);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Créer un token JWT
    const token = jwt.sign(
      { 
        uid: userDoc.id, 
        email: userData.email,
        nom: userData.nom,
        prenom: userData.prenom,
        role: userData.role || 'chef-projet'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        uid: userDoc.id,
        email: userData.email,
        nom: userData.nom,
        prenom: userData.prenom,
        role: userData.role || 'chef-projet',
        token
      }
    });

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
};

// Récupérer le profil utilisateur
const getProfile = async (req, res) => {
  try {
    const { uid } = req.user;

    const userDoc = await db.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    const userData = userDoc.data();
    delete userData.motDePasse; // Ne pas renvoyer le mot de passe

    res.json({
      success: true,
      data: userData
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil',
      error: error.message
    });
  }
};

// Déconnexion (optionnel, car JWT côté client)
const logout = async (req, res) => {
  try {
    // En production, vous pourriez ajouter le token à une liste noire
    res.json({
      success: true,
      message: 'Déconnexion réussie'
    });
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la déconnexion',
      error: error.message
    });
  }
};


const socialLogin = async (req, res) => {
  try {
    const { email, nom, prenom, provider, uid } = req.body;
    if (!email || !provider || !uid) {
      return res.status(400).json({
        success: false,
        message: 'Données manquantes pour la connexion sociale'
      });
    }

    // Chercher l'utilisateur dans Firestore
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();

    let userDoc, userData, userId;

    if (snapshot.empty) {
      // Nouvel utilisateur : créer dans Firestore
      const newUserRef = await usersRef.add({
        email,
        nom,
        prenom,
        provider,
        uid,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      userDoc = await newUserRef.get();
      userData = userDoc.data();
      userId = newUserRef.id;
    } else {
      // Utilisateur existant
      userDoc = snapshot.docs[0];
      userData = userDoc.data();
      userId = userDoc.id;
      // Mettre à jour les infos si besoin
      await usersRef.doc(userId).update({
        nom: nom || userData.nom,
        prenom: prenom || userData.prenom,
        provider,
        uid,
        updatedAt: new Date()
      });
    }

    // Générer un JWT
    const token = jwt.sign(
      {
        uid: userId,
        email,
        nom: nom || userData.nom,
        prenom: prenom || userData.prenom,
        provider
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Connexion sociale réussie',
      data: {
        uid: userId,
        email,
        nom: nom || userData.nom,
        prenom: prenom || userData.prenom,
        provider,
        token
      }
    });
  } catch (error) {
    console.error('Erreur socialLogin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion sociale',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  logout,
  socialLogin 
};
