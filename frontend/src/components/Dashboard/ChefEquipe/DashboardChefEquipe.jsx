import React from 'react';
import './DashboardChefEquipe.css';
import Sidebar from '../../Layout/Sidebar';
const DashboardChefEquipe = ({ user }) => (
  <div className="dashboard-role" style={{ display: 'flex' }}>
    <Sidebar user={user} />
    <div style={{ flex: 1, padding: '32px' }}>
      <h2>Dashboard Chef d' Equipe</h2>
      {/* Ajoute ici le contenu spécifique */}
    </div>
  </div>
);

export default DashboardChefEquipe;