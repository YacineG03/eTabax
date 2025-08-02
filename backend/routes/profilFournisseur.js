const express = require("express");
const { body } = require("express-validator");
const { verifyToken } = require("../middleware/auth");
const {
  getProfil,
  updateProfil,
} = require("../controllers/profilFournisseurController");

const router = express.Router();

// Voir son profil
router.get("/", verifyToken, getProfil);

// Modifier son profil
router.put(
  "/",
  verifyToken,
  [
    body("nom").optional().isString().isLength({ min: 2 }),
    body("prenom").optional().isString().isLength({ min: 2 }),
    body("email").optional().isEmail(),
    body("telephone").optional().isString(),
    body("societe").optional().isString(),
    body("adresse").optional().isString(),
    body("localisation").optional().isString(),
    body("imageProfil")
      .optional()
      .isURL()
      .withMessage("L'URL de l'image de profil doit être valide"),
    // Ajoute d'autres validations si besoin
  ],
  updateProfil
);

module.exports = router;
