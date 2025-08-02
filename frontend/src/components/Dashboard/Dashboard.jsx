import React from 'react';
import DashboardChefProjet from './ChefProjet/DashboardChefProjet';
import DashboardConducteurTravaux from './ConducteurTravaux/DashboardConducteurTravaux';
import DashboardChefChantier from './ChefChantier/DashboardChefChantier';
import DashboardChefEquipe from './ChefEquipe/DashboardChefEquipe';
import DashboardFournisseur from './Fournisseur/DashboardFournisseur';

const Dashboard = ({ user }) => {
  switch (user?.role) {
    case 'chef-projet':
      return <DashboardChefProjet user={user} />;
    case 'conducteur-travaux':
      return <DashboardConducteurTravaux user={user} />;
    case 'chef-chantier':
      return <DashboardChefChantier user={user} />;
    case 'chef-equipe':
      return <DashboardChefEquipe user={user} />;
    case 'fournisseur':
      return <DashboardFournisseur user={user} />;
    default:
      return <div>Bienvenue sur le Dashboard</div>;
  }
};

export default Dashboard;