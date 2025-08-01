import React from 'react';
import './DashboardFournisseur.css';
import Sidebar from '../../Layout/Sidebar';

const DashboardFournisseur = ({ user }) => (
  <div className="dashboard-role" style={{ display: 'flex' }}>
    <Sidebar user={user} />
    <div style={{ flex: 1, padding: '32px' }}>
      <h2>Dashboard du Fournisseur</h2>
      {/* Ajoute ici le contenu spécifique */}
    </div>
  </div>
);

export default DashboardFournisseur;