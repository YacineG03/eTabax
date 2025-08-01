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
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token Firebase requis' 
      });
    }

    // Vérifier le token Firebase
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token Firebase invalide' 
    });
  }
};

module.exports = {
  verifyToken,
  verifyFirebaseToken
}; 