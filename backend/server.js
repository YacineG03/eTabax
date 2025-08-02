const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import des routes
const authRoutes = require("./routes/auth");
const fournisseurRoutes = require("./routes/fournisseur");

const app = express();
const chantierRoutes = require("./routes/chefChantier");
const conducteurTravauxRoutes = require("./routes/conducteurTravaux");
const chefDeProjetRoutes = require("./routes/chefDeProjet");

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://yourdomain.com"]
        : ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);

// Route de test
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "E-TABAX Backend is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Routes spécifiques
app.use("/api/chantier", chantierRoutes);
app.use("/api/conducteur-travaux", conducteurTravauxRoutes);
app.use("/api/chef-projet", chefDeProjetRoutes);
app.use("/api/fournisseur/profil", require("./routes/profilFournisseur"));
app.use("/api/fournisseur", fournisseurRoutes);

// Route 404
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route non trouvée",
  });
});

// Middleware de gestion d'erreurs
app.use((error, req, res, next) => {
  console.error("Erreur serveur:", error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Erreur interne du serveur",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
});

// Exporte uniquement l'application pour les tests
module.exports = app;

// Démarrage conditionnel du serveur
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Serveur E-TABAX démarré sur le port ${PORT}`);
    console.log(`📊 Environnement: ${process.env.NODE_ENV || "development"}`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
    console.log(`📝 API Health: http://localhost:${PORT}/api/health`);
  });
}

// Gestion des erreurs non capturées
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
