import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Accueil from './components/Accueil';
import DashboardChefProjet from './components/Dashboard/ChefProjet/DashboardChefProjet';
import DashboardConducteurTravaux from './components/Dashboard/ConducteurTravaux/DashboardConducteurTravaux';
import DashboardChefChantier from './components/Dashboard/ChefChantier/DashboardChefChantier';
import DashboardChefEquipe from './components/Dashboard/ChefEquipe/DashboardChefEquipe';
import DashboardFournisseur from './components/Dashboard/Fournisseur/DashboardFournisseur';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('accueil');

  useEffect(() => {
    const token = localStorage.getItem('token');
    let userData = null;
    try {
      const raw = localStorage.getItem('user');
      if (raw) userData = JSON.parse(raw);
    } catch (e) {
      console.warn('User localStorage parse error:', e);
      userData = null;
    }
    if (token && userData) {
      setUser(userData);
      setPage('dashboard');
    } else {
      setUser(null);
      setPage('accueil');
    }
  }, []);

  const layoutWithToast = (component) => (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {component}
    </>
  );

  if (page === 'login') return layoutWithToast(<Login onNavigate={p => setPage(p)} />);
  if (page === 'register') return layoutWithToast(<Register onNavigate={p => setPage(p)} />);
  if (page === 'accueil') return layoutWithToast(<Accueil onNavigate={p => setPage(p)} />);
  if (!user) return layoutWithToast(<Accueil onNavigate={p => setPage(p)} />);

  

  const role = user?.role?.toLowerCase().replace(/\s/g, '');
  if (role === 'chef-projet' || role === 'chefdeprojet') {
    return layoutWithToast(<DashboardChefProjet user={user} />);
  }
  if (role === 'conducteur-travaux' || role === 'conducteurdestravaux') {
    return layoutWithToast(<DashboardConducteurTravaux user={user} />);
  }
  if (role === 'chef-chantier' || role === 'chefdechantier') {
    return layoutWithToast(<DashboardChefChantier user={user} />);
  }
  if (role === 'chef-equipe' || role === 'chefdequipe') {
    return layoutWithToast(<DashboardChefEquipe user={user} />);
  }
  if (role === 'fournisseur') {
    return layoutWithToast(
      <Router>
        <Routes>
          <Route path="/dashboard-fournisseur" element={<DashboardFournisseur user={user} currentPage="dashboard-fournisseur" />} />
          <Route path="/magasin" element={<Magasin user={user} currentPage="magasin" />} />
          <Route path="/profil" element={<Profil user={user} currentPage="profil" />} />
          <Route path="/mes-commandes" element={<MesCommandes user={user} currentPage="mes-commandes" />} />
          <Route path="/bons-commande" element={<BonsCommande user={user} currentPage="bons-commande" />} />
          <Route path="*" element={<Navigate to="/dashboard-fournisseur" />} />
        </Routes>
      </Router>
    );
  }

  return layoutWithToast(<div>Bienvenue sur le Dashboard</div>);
}

export default App;
