const express = require('express');
const { body } = require('express-validator');
const { register, login, getProfile, logout, socialLogin } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Validation pour l'inscription
const registerValidation = [
  body('nom')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères'),
  body('prenom')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le prénom doit contenir entre 2 et 50 caractères'),
  body('telephone')
    .trim()
    .matches(/^(\+221)?(7[05678])[0-9]{7}$/)
    .withMessage('Numéro de téléphone sénégalais invalide'),
  body('adresse')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('L\'adresse doit contenir entre 5 et 200 caractères'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  body('motDePasse')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
  body('confirmerMotDePasse')
    .custom((value, { req }) => {
      if (value !== req.body.motDePasse) {
        throw new Error('Les mots de passe ne correspondent pas');
      }
      return true;
    })
];

// Validation pour la connexion
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  body('motDePasse')
    .notEmpty()
    .withMessage('Le mot de passe est requis')
];



// Routes
router.post('/register', registerValidation, (req, res, next) => {
  const errors = body('errors');
  if (!errors.isEmpty && errors.array && errors.array().length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg || 'Données invalides',
      errors: errors.array()
    });
  }
  return register(req, res, next);
});
router.post('/login', loginValidation, login);
router.get('/profile', verifyToken, getProfile);
router.post('/social-login', socialLogin);
router.post('/logout', verifyToken, logout);

module.exports = router;