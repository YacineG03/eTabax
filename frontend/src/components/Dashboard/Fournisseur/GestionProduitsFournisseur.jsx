import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getFournisseurProducts,
  createFournisseurProduct,
  updateFournisseurProduct,
  deleteFournisseurProduct,
  PRODUCT_CATEGORIES,
  PRODUCT_STATUS,
  formatPrice,
  getCategoryLabel,
  getProductStatusLabel,
} from "../../../api/fournisseur";
import ImageUpload from "./ImageUpload";
import "./GestionProduitsFournisseur.css";

const GestionProduitsFournisseur = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    prix: "",
    categorie: "",
    localisation: "",
    quantite: "",
    imageUrl: "",
    statut: "actif",
  });

  // Charger les produits au montage du composant
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await getFournisseurProducts();
      console.log("Réponse API produits:", response);
      
      // Le backend retourne { success: true, data: products }
      if (response && response.success && response.data) {
        setProducts(response.data);
        console.log("Produits chargés:", response.data.length);
      } else if (Array.isArray(response)) {
        setProducts(response);
        console.log("Produits chargés (array):", response.length);
      } else {
        console.warn("Format de réponse inattendu:", response);
        setProducts([]);
      }
    } catch (error) {
      console.error("Erreur chargement produits:", error);
      toast.error("Erreur lors du chargement des produits");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImagesChange = (images) => {
    setProductImages(images);
  };

  const resetForm = () => {
    setFormData({
      nom: "",
      description: "",
      prix: "",
      categorie: "",
      localisation: "",
      quantite: "",
      imageUrl: "",
      statut: "actif",
      // Nouveaux champs
      type: "",
      specifications: {},
      normes: "",
      utilisation: "",
      avantages: "",
      impactEnvironnemental: "",
      visuels: [],
    });
    setProductImages([]);
    setEditingProduct(null);
    setShowForm(false);
  };

  // Fonction utilitaire pour nettoyer les données avant envoi
  const cleanProductData = (data) => {
    const cleaned = {
      ...data,
      prix: parseFloat(data.prix),
      quantite: parseInt(data.quantite),
      // S'assurer que les champs optionnels sont correctement formatés
      specifications: typeof data.specifications === 'object' ? data.specifications : {},
      visuels: Array.isArray(data.visuels) ? data.visuels : []
    };
    
    // Supprimer imageUrl s'il est vide
    if (!cleaned.imageUrl || cleaned.imageUrl.trim() === '') {
      delete cleaned.imageUrl;
    }
    
    // Traiter les images
    const imageUrls = productImages.map(img => {
      if (img.isExisting) {
        return img.preview; // URL existante
      } else {
        return img.preview; // Base64 pour les nouvelles images
      }
    });
    
    cleaned.visuels = imageUrls;
    
    return cleaned;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingProduct) {
        // Mise à jour
        const dataToSend = cleanProductData(formData);
        console.log("Données envoyées pour modification:", dataToSend);
        const response = await updateFournisseurProduct(
          editingProduct.id,
          dataToSend
        );
        console.log("Réponse mise à jour:", response);
        if (response && response.success) {
          toast.success("Produit mis à jour avec succès");
          loadProducts();
          resetForm();
        } else {
          console.error("Erreurs de validation:", response.errors);
          toast.error(response?.message || "Erreur lors de la mise à jour");
        }
      } else {
        // Création
        const dataToSend = cleanProductData(formData);
        console.log("Données envoyées pour création:", dataToSend);
        const response = await createFournisseurProduct(dataToSend);
        console.log("Réponse création:", response);
        if (response && response.success) {
          toast.success("Produit créé avec succès");
          loadProducts();
          resetForm();
        } else {
          console.error("Erreurs de validation:", response.errors);
          toast.error(response?.message || "Erreur lors de la création");
        }
      }
    } catch (error) {
      console.error("Erreur soumission produit:", error);
      toast.error("Erreur lors de la sauvegarde du produit");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      nom: product.nom,
      description: product.description,
      prix: product.prix.toString(),
      categorie: product.categorie,
      localisation: product.localisation,
      quantite: product.quantite.toString(),
      imageUrl: product.imageUrl || "",
      statut: product.statut,
      // Nouveaux champs
      type: product.type || "",
      specifications: product.specifications || {},
      normes: product.normes || "",
      utilisation: product.utilisation || "",
      avantages: product.avantages || "",
      impactEnvironnemental: product.impactEnvironnemental || "",
      visuels: product.visuels || [],
    });
    
    // Charger les images existantes si disponibles
    if (product.visuels && product.visuels.length > 0) {
      const existingImages = product.visuels.map((url, index) => ({
        id: `existing-${index}`,
        preview: url,
        name: `Image ${index + 1}`,
        isExisting: true,
        file: null // Pas de fichier pour les images existantes
      }));
      setProductImages(existingImages);
    } else {
      setProductImages([]);
    }
    
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        const response = await deleteFournisseurProduct(productId);
        if (response && response.success) {
          toast.success("Produit supprimé avec succès");
          loadProducts();
        } else {
          toast.error(response?.message || "Erreur lors de la suppression");
        }
      } catch (error) {
        console.error("Erreur suppression produit:", error);
        toast.error("Erreur lors de la suppression du produit");
      }
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  if (loading) {
    return (
      <div className="gestion-produits-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Chargement des produits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gestion-produits-container">
      <div className="gestion-produits-header">
        <h2>Gestion des Produits</h2>
        <button className="btn-add-product" onClick={() => setShowForm(true)}>
          + Ajouter un produit
        </button>
      </div>

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <div className="product-form-overlay">
          <div className="product-form-container">
            <h3>
              {editingProduct ? "Modifier le produit" : "Ajouter un produit"}
            </h3>

            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nom">Nom du produit *</label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                    minLength="2"
                    maxLength="100"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="categorie">Catégorie *</label>
                  <select
                    id="categorie"
                    name="categorie"
                    value={formData.categorie}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {PRODUCT_CATEGORIES.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="prix">Prix (XOF) *</label>
                  <input
                    type="number"
                    id="prix"
                    name="prix"
                    value={formData.prix}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="quantite">Quantité disponible *</label>
                  <input
                    type="number"
                    id="quantite"
                    name="quantite"
                    value={formData.quantite}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  minLength="10"
                  maxLength="500"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="localisation">Localisation *</label>
                  <input
                    type="text"
                    id="localisation"
                    name="localisation"
                    value={formData.localisation}
                    onChange={handleInputChange}
                    required
                    minLength="5"
                    maxLength="200"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="statut">Statut</label>
                  <select
                    id="statut"
                    name="statut"
                    value={formData.statut}
                    onChange={handleInputChange}
                  >
                    {PRODUCT_STATUS.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <ImageUpload
                images={productImages}
                onImagesChange={handleImagesChange}
                maxImages={5}
              />

              {/* Nouveaux champs pour les spécifications techniques */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="type">Type de produit</label>
                  <input
                    type="text"
                    id="type"
                    name="type"
                    value={formData.type || ""}
                    onChange={handleInputChange}
                    placeholder="Ex: BPE, Blocs creux, etc."
                    maxLength="50"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="normes">Normes</label>
                  <input
                    type="text"
                    id="normes"
                    name="normes"
                    value={formData.normes || ""}
                    onChange={handleInputChange}
                    placeholder="Ex: NF EN 771-3, ISO 20290"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="specifications">Spécifications techniques (JSON)</label>
                <textarea
                  id="specifications"
                  name="specifications"
                  value={formData.specifications ? JSON.stringify(formData.specifications, null, 2) : "{}"}
                  onChange={(e) => {
                    try {
                      const parsed = e.target.value ? JSON.parse(e.target.value) : {};
                      setFormData(prev => ({ ...prev, specifications: parsed }));
                    } catch (error) {
                      // Garder la valeur brute si JSON invalide
                      setFormData(prev => ({ ...prev, specifications: e.target.value }));
                    }
                  }}
                  placeholder='{"dimensions": "20x20x50cm", "resistance": "4-10 MPa"}'
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="utilisation">Utilisation</label>
                  <input
                    type="text"
                    id="utilisation"
                    name="utilisation"
                    value={formData.utilisation || ""}
                    onChange={handleInputChange}
                    placeholder="Ex: Murs porteurs, cloisons, fondations"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="impactEnvironnemental">Impact environnemental</label>
                  <input
                    type="text"
                    id="impactEnvironnemental"
                    name="impactEnvironnemental"
                    value={formData.impactEnvironnemental || ""}
                    onChange={handleInputChange}
                    placeholder="Ex: Matériaux recyclés, biosourcés"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="avantages">Avantages</label>
                <textarea
                  id="avantages"
                  name="avantages"
                  value={formData.avantages || ""}
                  onChange={handleInputChange}
                  placeholder="Ex: Résistance mécanique, coût abordable, isolation thermique"
                  rows="2"
                />
              </div>



              <div className="form-actions">
                <button type="submit" className="btn-save">
                  {editingProduct ? "Mettre à jour" : "Créer"}
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCancel}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Liste des produits */}
      <div className="products-list">
        {products.length === 0 ? (
          <div className="no-products">
            <p>Aucun produit trouvé.</p>
            <button className="btn-add-first" onClick={() => setShowForm(true)}>
              Ajouter votre premier produit
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  {product.visuels && product.visuels.length > 0 ? (
                    <img src={product.visuels[0]} alt={product.nom} />
                  ) : product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.nom} />
                  ) : (
                    <div className="no-image">
                      <span>📦</span>
                    </div>
                  )}
                  <div className={`product-status ${product.statut}`}>
                    {getProductStatusLabel(product.statut)}
                  </div>
                  {product.visuels && product.visuels.length > 1 && (
                    <div className="image-count-badge">
                      +{product.visuels.length - 1}
                    </div>
                  )}
                </div>

                <div className="product-info">
                  <h4>{product.nom}</h4>
                  <p className="product-category">
                    {getCategoryLabel(product.categorie)}
                  </p>
                  <p className="product-description">
                    {product.description.length > 100
                      ? `${product.description.substring(0, 100)}...`
                      : product.description}
                  </p>
                  <div className="product-details">
                    <span className="product-price">
                      {formatPrice(product.prix)}
                    </span>
                    <span className="product-quantity">
                      Stock: {product.quantite}
                    </span>
                  </div>
                  <p className="product-location">📍 {product.localisation}</p>
                </div>

                <div className="product-actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(product)}
                  >
                    Modifier
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(product.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionProduitsFournisseur;
