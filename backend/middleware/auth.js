const jwt = require('jsonwebtoken');
const { auth } = require('../config/firebase');

// Middleware pour vérifier le token JWT
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token d\'accès requis' 
      });
    }

    // Vérifier le token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token invalide' 
    });
  }
};

// Middleware pour vérifier le token Firebase
const verifyFirebaseToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Token reçu:', token);
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token d\'authentification requis' });
    }

    try {
      console.log('Tentative de vérification Firebase...');
      const decodedToken = await auth.verifyIdToken(token);
      req.user = decodedToken;
      console.log('Token Firebase valide:', decodedToken.uid);
      next();
    } catch (firebaseError) {
      console.log('Erreur Firebase, essai JWT:', firebaseError.message);
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log('Token JWT valide:', decoded);
        next();
      } catch (jwtError) {
        console.log('Erreur JWT:', jwtError.message);
        return res.status(401).json({ success: false, message: 'Token invalide' });
      }
    }
  } catch (error) {
    console.log('Erreur générale:', error.message);
    return res.status(401).json({ success: false, message: 'Token invalide' });
  }
};

module.exports = {
  verifyToken,
  verifyFirebaseToken
}; 