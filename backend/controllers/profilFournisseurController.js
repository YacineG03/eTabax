const { db } = require("../config/firebase");
const { validationResult } = require("express-validator");

// Voir son profil
exports.getProfil = async (req, res) => {
  try {
    const userDoc = await db.collection("users").doc(req.user.uid).get();
    if (!userDoc.exists) {
      return res
        .status(404)
        .json({ success: false, message: "Profil non trouvé" });
    }
    res.json({ success: true, data: userDoc.data() });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
  }
};

// Modifier son profil
exports.updateProfil = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    await db.collection("users").doc(req.user.uid).update(req.body);
    res.json({ success: true, message: "Profil mis à jour" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
  }
};
