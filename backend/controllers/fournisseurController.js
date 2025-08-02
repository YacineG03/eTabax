const { db } = require("../config/firebase");
const { validationResult } = require("express-validator");

// Middleware pour vérifier que l'utilisateur est un fournisseur
exports.checkFournisseurRole = (req, res, next) => {
  if (req.user.role !== "fournisseur") {
    return res.status(403).json({
      success: false,
      message: "Accès refusé. Rôle fournisseur requis.",
    });
  }
  next();
};

// Créer un produit
exports.createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Données invalides",
        errors: errors.array(),
      });
    }

    const data = {
      nom: req.body.nom,
      type: req.body.type, // nouveau
      description: req.body.description,
      prix: parseFloat(req.body.prix),
      categorie: req.body.categorie,
      specifications: req.body.specifications, // nouveau (objet ou tableau)
      normes: req.body.normes, // nouveau (tableau ou string)
      utilisation: req.body.utilisation, // nouveau
      avantages: req.body.avantages, // nouveau
      impactEnvironnemental: req.body.impactEnvironnemental, // nouveau
      visuels: req.body.visuels || [], // nouveau (tableau d’URLs)
      localisation: req.body.localisation,
      quantite: parseInt(req.body.quantite),
      imageUrl: req.body.imageUrl || "",
      statut: req.body.statut || "actif",
      fournisseurId: req.user.uid,
      fournisseurNom: `${req.user.prenom} ${req.user.nom}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await db.collection("products").add(data);

    res.status(201).json({
      success: true,
      message: "Produit créé avec succès",
      data: { id: docRef.id, ...data },
    });
  } catch (error) {
    console.error("Erreur création produit:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création du produit",
      error: error.message,
    });
  }
};

// Récupérer tous les produits du fournisseur connecté
exports.getProducts = async (req, res) => {
  try {
    const fournisseurId = req.user.uid;
    const snapshot = await db
      .collection("products")
      .where("fournisseurId", "==", fournisseurId)
      .get();

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Trier côté serveur pour éviter l'index composite
    products.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return dateB - dateA;
    });

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Erreur récupération produits:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des produits",
      error: error.message,
    });
  }
};

// Récupérer un produit spécifique
exports.getProduct = async (req, res) => {
  try {
    const doc = await db.collection("products").doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "Produit non trouvé",
      });
    }

    const productData = doc.data();

    // Vérifier que le produit appartient au fournisseur connecté
    if (productData.fournisseurId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé à ce produit",
      });
    }

    res.json({
      success: true,
      data: { id: doc.id, ...productData },
    });
  } catch (error) {
    console.error("Erreur récupération produit:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du produit",
      error: error.message,
    });
  }
};

// Mettre à jour un produit
exports.updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Données invalides",
        errors: errors.array(),
      });
    }

    // Vérifier que le produit existe et appartient au fournisseur
    const productDoc = await db.collection("products").doc(req.params.id).get();
    if (!productDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Produit non trouvé",
      });
    }

    const productData = productDoc.data();
    if (productData.fournisseurId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé à ce produit",
      });
    }

    const updates = {
      nom: req.body.nom,
      type: req.body.type,
      description: req.body.description,
      prix: parseFloat(req.body.prix),
      categorie: req.body.categorie,
      specifications: req.body.specifications,
      normes: req.body.normes,
      utilisation: req.body.utilisation,
      avantages: req.body.avantages,
      impactEnvironnemental: req.body.impactEnvironnemental,
      visuels: req.body.visuels,
      localisation: req.body.localisation,
      quantite: parseInt(req.body.quantite),
      imageUrl: req.body.imageUrl || productData.imageUrl,
      statut: req.body.statut || productData.statut,
      updatedAt: new Date(),
    };

    await db.collection("products").doc(req.params.id).update(updates);

    res.json({
      success: true,
      message: "Produit mis à jour avec succès",
    });
  } catch (error) {
    console.error("Erreur mise à jour produit:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du produit",
      error: error.message,
    });
  }
};

// Supprimer un produit
exports.deleteProduct = async (req, res) => {
  try {
    // Vérifier que le produit existe et appartient au fournisseur
    const productDoc = await db.collection("products").doc(req.params.id).get();
    if (!productDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Produit non trouvé",
      });
    }

    const productData = productDoc.data();
    if (productData.fournisseurId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé à ce produit",
      });
    }

    await db.collection("products").doc(req.params.id).delete();

    res.json({
      success: true,
      message: "Produit supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur suppression produit:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du produit",
      error: error.message,
    });
  }
};

// Récupérer toutes les commandes du fournisseur
exports.getOrders = async (req, res) => {
  try {
    const fournisseurId = req.user.uid;

    // Récupérer les produits du fournisseur
    const productsSnap = await db
      .collection("products")
      .where("fournisseurId", "==", fournisseurId)
      .get();

    const productIds = productsSnap.docs.map((doc) => doc.id);

    if (productIds.length === 0) {
      return res.json({
        success: true,
        data: [],
      });
    }

    // Récupérer les commandes associées à ces produits
    const ordersSnap = await db
      .collection("orders")
      .where("productId", "in", productIds)
      .get();

    const orders = ordersSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Erreur récupération commandes:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des commandes",
      error: error.message,
    });
  }
};

// Mettre à jour le statut d'une commande
exports.updateOrderStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Données invalides",
        errors: errors.array(),
      });
    }

    // Vérifier que la commande existe et appartient au fournisseur
    const orderDoc = await db.collection("orders").doc(req.params.id).get();
    if (!orderDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Commande non trouvée",
      });
    }

    // Vérifier que le produit de la commande appartient au fournisseur
    const orderData = orderDoc.data();
    const productDoc = await db
      .collection("products")
      .doc(orderData.productId)
      .get();
    if (
      !productDoc.exists ||
      productDoc.data().fournisseurId !== req.user.uid
    ) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé à cette commande",
      });
    }

    await db.collection("orders").doc(req.params.id).update({
      statut: req.body.statut,
      updatedAt: new Date(),
    });

    res.json({
      success: true,
      message: "Statut de la commande mis à jour avec succès",
    });
  } catch (error) {
    console.error("Erreur mise à jour statut commande:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du statut",
      error: error.message,
    });
  }
};

// Récupérer les statistiques du fournisseur
exports.getStats = async (req, res) => {
  try {
    const fournisseurId = req.user.uid;

    // Nombre de produits
    const productsSnap = await db
      .collection("products")
      .where("fournisseurId", "==", fournisseurId)
      .get();

    const nbProduits = productsSnap.size;

    // Nombre de commandes
    const productIds = productsSnap.docs.map((doc) => doc.id);
    let nbCommandes = 0;
    let chiffreAffaires = 0;

    if (productIds.length > 0) {
      const ordersSnap = await db
        .collection("orders")
        .where("productId", "in", productIds)
        .get();

      nbCommandes = ordersSnap.size;

      // Calculer le chiffre d'affaires (à adapter selon la structure des commandes)
      ordersSnap.docs.forEach((doc) => {
        const orderData = doc.data();
        if (orderData.montant) {
          chiffreAffaires += orderData.montant;
        }
      });
    }

    res.json({
      success: true,
      data: {
        nbProduits,
        nbCommandes,
        chiffreAffaires,
      },
    });
  } catch (error) {
    console.error("Erreur récupération statistiques:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des statistiques",
      error: error.message,
    });
  }
};
