import React, { useEffect, useState } from 'react';
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
  const [page, setPage] = useState('login');

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
      setPage('login');
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
    return layoutWithToast(<DashboardFournisseur user={user} />);
  }

  return layoutWithToast(<div>Bienvenue sur le Dashboard</div>);
}

export default App;
