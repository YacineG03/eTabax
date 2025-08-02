import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaEye, FaTruck, FaCheck, FaTimes, FaClock } from "react-icons/fa";
import "./ListeCommandesFournisseur.css";

const ListeCommandesFournisseur = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadCommandes();
  }, []);

  const loadCommandes = async () => {
    try {
      setLoading(true);
      // Simulation de données pour l'instant
      // TODO: Remplacer par l'appel API réel
      const mockCommandes = [
        {
          id: "CMD001",
          client: "Chef Chantier Yoff",
          chantier: "Résidence Dakar Yoff",
          date: "2024-01-15",
          statut: "en_attente",
          produits: [
            { nom: "Ciment Portland 50kg", quantite: 10, prix: 5000 },
            { nom: "Parpaings creux", quantite: 100, prix: 1500 }
          ],
          total: 65000
        },
        {
          id: "CMD002", 
          client: "Chef Projet Thiès",
          chantier: "Centre commercial Thiès",
          date: "2024-01-14",
          statut: "validée",
          produits: [
            { nom: "Béton BPE", quantite: 5, prix: 35000 }
          ],
          total: 175000
        }
      ];
      setCommandes(mockCommandes);
    } catch (error) {
      console.error("Erreur chargement commandes:", error);
      toast.error("Erreur lors du chargement des commandes");
    } finally {
      setLoading(false);
    }
  };

  const updateCommandeStatus = async (commandeId, newStatus) => {
    try {
      // TODO: Appel API pour mettre à jour le statut
      toast.success(`Statut de la commande ${commandeId} mis à jour`);
      loadCommandes(); // Recharger les données
    } catch (error) {
      console.error("Erreur mise à jour statut:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      "en_attente": "En attente",
      "validée": "Validée",
      "en_préparation": "En préparation", 
      "expédiée": "Expédiée",
      "livrée": "Livrée",
      "annulée": "Annulée"
    };
    return statusLabels[status] || status;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "en_attente":
        return <FaClock className="status-icon pending" />;
      case "validée":
        return <FaCheck className="status-icon validated" />;
      case "en_préparation":
        return <FaClock className="status-icon preparing" />;
      case "expédiée":
        return <FaTruck className="status-icon shipped" />;
      case "livrée":
        return <FaCheck className="status-icon delivered" />;
      case "annulée":
        return <FaTimes className="status-icon cancelled" />;
      default:
        return <FaClock className="status-icon" />;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  if (loading) {
    return (
      <div className="commandes-container">
        <h2>Mes Commandes</h2>
        <div className="loading">Chargement des commandes...</div>
      </div>
    );
  }

  return (
    <div className="commandes-container">
      <div className="commandes-header">
        <h2>Mes Commandes</h2>
        <div className="commandes-filters">
          <select className="filter-select">
            <option value="">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="validée">Validée</option>
            <option value="en_préparation">En préparation</option>
            <option value="expédiée">Expédiée</option>
            <option value="livrée">Livrée</option>
          </select>
        </div>
      </div>

      <div className="commandes-list">
        {commandes.length === 0 ? (
          <div className="no-commandes">
            <p>Aucune commande reçue pour le moment.</p>
          </div>
        ) : (
          commandes.map((commande) => (
            <div key={commande.id} className="commande-card">
              <div className="commande-header">
                <div className="commande-info">
                  <h3>Commande #{commande.id}</h3>
                  <p className="commande-client">{commande.client}</p>
                  <p className="commande-chantier">{commande.chantier}</p>
                  <p className="commande-date">Date: {formatDate(commande.date)}</p>
                </div>
                <div className="commande-status">
                  {getStatusIcon(commande.statut)}
                  <span className="status-label">{getStatusLabel(commande.statut)}</span>
                </div>
              </div>

              <div className="commande-products">
                <h4>Produits commandés:</h4>
                <ul>
                  {commande.produits.map((produit, index) => (
                    <li key={index}>
                      {produit.quantite}x {produit.nom} - {formatPrice(produit.prix)}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="commande-footer">
                <div className="commande-total">
                  <strong>Total: {formatPrice(commande.total)}</strong>
                </div>
                <div className="commande-actions">
                  <button 
                    className="btn-details"
                    onClick={() => {
                      setSelectedCommande(commande);
                      setShowDetails(true);
                    }}
                  >
                    <FaEye /> Détails
                  </button>
                  {commande.statut === "en_attente" && (
                    <button 
                      className="btn-validate"
                      onClick={() => updateCommandeStatus(commande.id, "validée")}
                    >
                      <FaCheck /> Valider
                    </button>
                  )}
                  {commande.statut === "validée" && (
                    <button 
                      className="btn-ship"
                      onClick={() => updateCommandeStatus(commande.id, "expédiée")}
                    >
                      <FaTruck /> Expédier
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal détails commande */}
      {showDetails && selectedCommande && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Détails Commande #{selectedCommande.id}</h3>
              <button className="modal-close" onClick={() => setShowDetails(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4>Informations client</h4>
                <p><strong>Client:</strong> {selectedCommande.client}</p>
                <p><strong>Chantier:</strong> {selectedCommande.chantier}</p>
                <p><strong>Date:</strong> {formatDate(selectedCommande.date)}</p>
                <p><strong>Statut:</strong> {getStatusLabel(selectedCommande.statut)}</p>
              </div>
              
              <div className="detail-section">
                <h4>Produits commandés</h4>
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Produit</th>
                      <th>Quantité</th>
                      <th>Prix unitaire</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCommande.produits.map((produit, index) => (
                      <tr key={index}>
                        <td>{produit.nom}</td>
                        <td>{produit.quantite}</td>
                        <td>{formatPrice(produit.prix)}</td>
                        <td>{formatPrice(produit.quantite * produit.prix)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="detail-section">
                <h4>Total de la commande</h4>
                <p className="total-amount">{formatPrice(selectedCommande.total)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeCommandesFournisseur; 