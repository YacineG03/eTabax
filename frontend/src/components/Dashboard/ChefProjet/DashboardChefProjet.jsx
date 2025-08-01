import React from 'react';
import Sidebar from '../../Layout/Sidebar';
import './DashboardChefProjet.css';

const DashboardChefProjet = ({ user }) => (
  <div className="dashboard-role" style={{ display: 'flex' }}>
    <Sidebar user={user} />
    <div style={{ flex: 1, padding: '32px' }}>
      <h2>Dashboard Chef de Projet</h2>
      {/* Ajoute ici le contenu spécifique */}
    </div>
  </div>
);

export default DashboardChefProjet;