import React, { useState } from "react";
import "./DashboardFournisseur.css";
import Sidebar from "../../Layout/Sidebar";
import GestionProduitsFournisseur from "./GestionProduitsFournisseur";

const DashboardFournisseur = ({ user }) => {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderContent = () => {
    switch (currentPage) {
      case "produits":
        return <GestionProduitsFournisseur />;
      case "dashboard":
      default:
        return (
          <div className="dashboard-content">
            <h2>Dashboard du Fournisseur</h2>
            <p>
              Bienvenue {user?.prenom} {user?.nom} !
            </p>
            <p>
              Utilisez le menu latéral pour naviguer entre les différentes
              sections.
            </p>
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
