import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Accueil from './components/Accueil';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
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
  const navigate = useNavigate();
  const location = useLocation();

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
      // Redirige vers /dashboard si l'utilisateur est authentifié
      if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register') {
        navigate('/dashboard');
      }
    } else {
      setUser(null);
      setPage('accueil');
      if (location.pathname.startsWith('/dashboard')) {
        navigate('/');
      }
    }
  }, [navigate, location.pathname]);

  const layoutWithToast = (component) => (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {component}
    </>
  );

  // Rendu basé sur l'état page pour les vues non routées
  if (page === 'login') return layoutWithToast(<Login onNavigate={(p) => setPage(p)} />);
  if (page === 'accueil') return layoutWithToast(<Accueil onNavigate={(p) => setPage(p)} />);
  if (page === 'register') return layoutWithToast(<Register onNavigate={(p) => setPage(p)} />);

  // Rendu basé sur les routes pour le dashboard
  return (
    <Routes>
      <Route
        path="/dashboard/*"
        element={
          user ? (
            layoutWithToast(
              (() => {
                const role = user?.role?.toLowerCase().replace(/\s/g, '');
                if (role === 'chef-projet' || role === 'chefdeprojet') return <DashboardChefProjet user={user} />;
                if (role === 'conducteur-travaux' || role === 'conducteurdestravaux') return <DashboardConducteurTravaux user={user} />;
                if (role === 'chef-chantier' || role === 'chefdechantier') return <DashboardChefChantier user={user} />;
                if (role === 'chef-equipe' || role === 'chefdequipe') return <DashboardChefEquipe user={user} />;
                if (role === 'fournisseur') return <DashboardFournisseur user={user} />;
                return <div>Rôle non reconnu</div>;
              })()
            )
          ) : (
            layoutWithToast(<div>Redirection vers login...</div>)
          )
        }
      />
      {/* Route par défaut pour gérer les cas non couverts */}
      <Route path="*" element={layoutWithToast(<Accueil onNavigate={(p) => setPage(p)} />)} />
    </Routes>
  );
}

export default App;