import React from 'react';
import './DashboardConducteurTravaux.css';
import Sidebar from '../../Layout/Sidebar';

const DashboardConducteurTravaux = ({ user }) => (
  <div className="dashboard-role" style={{ display: 'flex' }}>
    <Sidebar user={user} />
    <div style={{ flex: 1, padding: '32px' }}>
      <h2>Dashboard Conducteur de travaux</h2>
      {/* Ajoute ici le contenu spécifique */}
    </div>
  </div>
);

export default DashboardConducteurTravaux;