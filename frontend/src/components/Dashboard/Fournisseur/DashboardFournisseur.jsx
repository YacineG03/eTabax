import React, { useState } from "react";
import "./DashboardFournisseur.css";
import Sidebar from "../../Layout/Sidebar";
import GestionProduitsFournisseur from "./GestionProduitsFournisseur";
import ListeCommandesFournisseur from "./ListeCommandesFournisseur";
import StatistiquesFournisseur from "./StatistiquesFournisseur";
import ProfilFournisseur from "./ProfilFournisseur";

const DashboardFournisseur = ({ user }) => {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderContent = () => {
    switch (currentPage) {
      case "produits":
        return <GestionProduitsFournisseur />;
      case "mes-commandes":
        return <ListeCommandesFournisseur />;
      case "livraisons":
        return <div className="livraisons-content">
          <h2>Livraisons planifiées</h2>
          <p>Gestion des livraisons en cours de développement...</p>
        </div>;
      case "messages":
        return <div className="messages-content">
          <h2>Messages clients</h2>
          <p>Interface de messagerie en cours de développement...</p>
        </div>;
      case "historique":
        return <StatistiquesFournisseur />;
      case "mon-espace-fournisseur":
        return <ProfilFournisseur user={user} />;
      case "dashboard":
      default:
        return (
          <div className="dashboard-content">
            <h2>Dashboard du Fournisseur</h2>
            <div className="welcome-section">
              <p className="welcome-text">
                Bienvenue <strong>{user?.prenom} {user?.nom}</strong> !
              </p>
              <p className="dashboard-description">
                Gérez vos produits, suivez vos commandes et consultez vos statistiques.
              </p>
            </div>
            
            <div className="dashboard-stats">
              <div className="stat-card">
                <h3>Produits actifs</h3>
                <p className="stat-number">0</p>
              </div>
              <div className="stat-card">
                <h3>Commandes en cours</h3>
                <p className="stat-number">0</p>
              </div>
              <div className="stat-card">
                <h3>Chiffre d'affaires</h3>
                <p className="stat-number">0 FCFA</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-role" style={{ display: "flex" }}>
      <Sidebar
        user={user}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
      <div style={{ flex: 1, padding: "32px" }}>{renderContent()}</div>
    </div>
  );
};

export default DashboardFournisseur;
