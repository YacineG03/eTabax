import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaMapMarkerAlt, FaSave, FaEdit } from "react-icons/fa";
import ProfileImageUpload from "./ProfileImageUpload";
import "./ProfilFournisseur.css";

const ProfilFournisseur = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    societe: "",
    adresse: "",
    localisation: "",
    imageProfil: ""
  });
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      
      // Appel API pour charger le profil
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/fournisseur/profil", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const profileData = data.data;
          setProfile(profileData);
          setFormData(profileData);
          setProfileImage(profileData.imageProfil || null);
        } else {
          // Fallback sur les données utilisateur si pas de profil spécifique
          const fallbackProfile = {
            nom: user?.nom || "",
            prenom: user?.prenom || "",
            email: user?.email || "",
            telephone: user?.telephone || "",
            societe: user?.societe || "",
            adresse: user?.adresse || "",
            localisation: user?.localisation || "",
            imageProfil: user?.imageProfil || ""
          };
          setProfile(fallbackProfile);
          setFormData(fallbackProfile);
          setProfileImage(fallbackProfile.imageProfil || null);
        }
      } else {
        throw new Error("Erreur lors du chargement du profil");
      }
    } catch (error) {
      console.error("Erreur chargement profil:", error);
      toast.error("Erreur lors du chargement du profil");
      
      // Fallback sur des données mockées en cas d'erreur
      const mockProfile = {
        nom: user?.nom || "Dupont",
        prenom: user?.prenom || "Jean",
        email: user?.email || "jean.dupont@example.com",
        telephone: "+221 77 123 45 67",
        societe: "Matériaux Plus Sarl",
        adresse: "123 Avenue Léopold Sédar Senghor",
        localisation: "Dakar, Sénégal",
        imageProfil: "https://via.placeholder.com/150"
      };
      setProfile(mockProfile);
      setFormData(mockProfile);
      setProfileImage(mockProfile.imageProfil);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Préparer les données à envoyer
      const updateData = {
        ...formData,
        imageProfil: profileImage?.preview || profileImage || formData.imageProfil
      };

      // Appel API pour mettre à jour le profil
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/fournisseur/profil", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success("Profil mis à jour avec succès");
          setProfile(updateData);
          setIsEditing(false);
        } else {
          throw new Error(data.message || "Erreur lors de la mise à jour");
        }
      } else {
        throw new Error("Erreur lors de la mise à jour du profil");
      }
    } catch (error) {
      console.error("Erreur mise à jour profil:", error);
      toast.error("Erreur lors de la mise à jour du profil");
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setProfileImage(profile.imageProfil || null);
    setIsEditing(false);
  };

  const handleImageChange = (imageData) => {
    setProfileImage(imageData);
  };

  if (loading) {
    return (
      <div className="profil-container">
        <h2>Mon Profil</h2>
        <div className="loading">Chargement du profil...</div>
      </div>
    );
  }

  return (
    <div className="profil-container">
      <div className="profil-header">
        <h2>Mon Profil Fournisseur</h2>
        <button 
          className={`btn-edit ${isEditing ? 'btn-cancel' : ''}`}
          onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
        >
          {isEditing ? 'Annuler' : 'Modifier le profil'}
        </button>
      </div>

      <div className="profil-content">
        <div className="profil-image-section">
          <ProfileImageUpload
            currentImage={isEditing ? profileImage : profile.imageProfil}
            onImageChange={isEditing ? handleImageChange : undefined}
          />
        </div>

        <div className="profil-details">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="profil-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="prenom">
                    <FaUser /> Prénom
                  </label>
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="nom">
                    <FaUser /> Nom
                  </label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">
                    <FaEnvelope /> Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="telephone">
                    <FaPhone /> Téléphone
                  </label>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="societe">
                  <FaBuilding /> Société
                </label>
                <input
                  type="text"
                  id="societe"
                  name="societe"
                  value={formData.societe}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="adresse">
                  <FaMapMarkerAlt /> Adresse
                </label>
                <textarea
                  id="adresse"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="localisation">
                  <FaMapMarkerAlt /> Localisation
                </label>
                <input
                  type="text"
                  id="localisation"
                  name="localisation"
                  value={formData.localisation}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-save">
                  <FaSave /> Sauvegarder les modifications
                </button>
                <button type="button" className="btn-cancel" onClick={handleCancel}>
                  Annuler les modifications
                </button>
              </div>
            </form>
          ) : (
            <div className="profil-info">
              <div className="info-section">
                <h3>Informations personnelles</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Prénom:</span>
                    <span className="info-value">{profile.prenom}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Nom:</span>
                    <span className="info-value">{profile.nom}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{profile.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Téléphone:</span>
                    <span className="info-value">{profile.telephone}</span>
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h3>Informations professionnelles</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Société:</span>
                    <span className="info-value">{profile.societe}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Adresse:</span>
                    <span className="info-value">{profile.adresse}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Localisation:</span>
                    <span className="info-value">{profile.localisation}</span>
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h3>Statistiques du compte</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-number">15</span>
                    <span className="stat-label">Produits actifs</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">45</span>
                    <span className="stat-label">Commandes reçues</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">12</span>
                    <span className="stat-label">Clients satisfaits</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilFournisseur; 