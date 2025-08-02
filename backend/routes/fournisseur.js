const express = require("express");
const categories = require("../utils/categories");
const { body } = require("express-validator");
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  updateOrderStatus,
  getStats,
  checkFournisseurRole,
} = require("../controllers/fournisseurController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// ========================================
// VALIDATION DES DONNÉES
// ========================================

// Validation pour la création/modification de produit
const productValidation = [
  body("nom")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Le nom doit contenir entre 2 et 100 caractères"),
  body("type")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Le type doit contenir entre 2 et 50 caractères"),
  body("description")
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage("La description doit contenir entre 10 et 500 caractères"),
  body("prix")
    .isFloat({ min: 0 })
    .withMessage("Le prix doit être un nombre positif"),
  body("categorie").trim().isIn(categories).withMessage("Catégorie invalide"),
  body("specifications")
    .optional()
    .isObject()
    .withMessage("Les spécifications doivent être un objet"),
  body("normes")
    .optional()
    .isString()
    .withMessage("Les normes doivent être une chaîne de caractères"),
  body("utilisation")
    .optional()
    .isString()
    .withMessage("L'utilisation doit être une chaîne de caractères"),
  body("avantages")
    .optional()
    .isString()
    .withMessage("Les avantages doivent être une chaîne de caractères"),
  body("impactEnvironnemental")
    .optional()
    .isString()
    .withMessage("L'impact environnemental doit être une chaîne de caractères"),
  body("visuels")
    .optional()
    .isArray()
    .withMessage("Les visuels doivent être un tableau d'URLs"),
  body("localisation")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("La localisation doit contenir entre 3 et 100 caractères"),
  body("quantite")
    .isInt({ min: 0 })
    .withMessage("La quantité doit être un nombre entier positif"),
  body("imageUrl")
    .optional()
    .isURL()
    .withMessage("L'URL de l'image doit être valide"),
  body("statut")
    .optional()
    .isIn(["actif", "inactif", "en_rupture"])
    .withMessage("Statut invalide"),
];

// Validation pour la mise à jour du statut de commande
const orderStatusValidation = [
  body("statut")
    .isIn(["confirmée", "en_préparation", "expédiée", "livrée", "annulée"])
    .withMessage("Statut de commande invalide"),
];

// ========================================
// ROUTES PRODUITS (CRUD)
// ========================================

// Créer un nouveau produit
router.post(
  "/products",
  verifyToken,
  checkFournisseurRole,
  productValidation,
  createProduct
);

// Récupérer tous les produits du fournisseur
router.get("/products", verifyToken, checkFournisseurRole, getProducts);

// Récupérer un produit spécifique
router.get("/products/:id", verifyToken, checkFournisseurRole, getProduct);

// Mettre à jour un produit
router.put(
  "/products/:id",
  verifyToken,
  checkFournisseurRole,
  productValidation,
  updateProduct
);

// Supprimer un produit
router.delete(
  "/products/:id",
  verifyToken,
  checkFournisseurRole,
  deleteProduct
);

// ========================================
// ROUTES COMMANDES
// ========================================

// Récupérer toutes les commandes du fournisseur
router.get("/orders", verifyToken, checkFournisseurRole, getOrders);

// Mettre à jour le statut d'une commande
router.put(
  "/orders/:id/status",
  verifyToken,
  checkFournisseurRole,
  orderStatusValidation,
  updateOrderStatus
);

// ========================================
// ROUTES STATISTIQUES
// ========================================

// Récupérer les statistiques du fournisseur
router.get("/stats", verifyToken, checkFournisseurRole, getStats);

module.exports = router;
