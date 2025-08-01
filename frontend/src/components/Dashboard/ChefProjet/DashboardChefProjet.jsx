import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from '../../Layout/Sidebar';
import ProfilChefProjet from './ProfilChefProjet';
import Chantiers from './Chantiers';
import CommandeChefProjet from './CommandeChefProjet';
import './DashboardChefProjet.css';

const DashboardChefProjet = ({ user }) => {
  const location = useLocation();

  return (
    <div className="dashboard-role" style={{ display: 'flex' }}>
      <Sidebar user={user} currentPage={location.pathname.split('/')[2] || 'dashboard'} />
      <div style={{ flex: 1, padding: '32px' }}>
        <Routes>
          <Route path="profil" element={<ProfilChefProjet user={user} />} />
          <Route path="chantiers/*" element={<Chantiers user={user} />} />
          <Route path="magasin/commande" element={<CommandeChefProjet user={user} />} />
          <Route index element={<div>Bienvenue sur le Dashboard Chef de Projet</div>} />
        </Routes>
      </div>
    </div>
  );
};

export default DashboardChefProjet;