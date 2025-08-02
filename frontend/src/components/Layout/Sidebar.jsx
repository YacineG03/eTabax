import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { 
  FaHome, 
  FaMap, 
  FaChartBar, 
  FaCalendarAlt, 
  FaBoxes, 
  FaExclamationTriangle,
  FaBrain,
  FaFileAlt,
  FaCog,
  FaUsers,
  FaVideo,
  FaShieldAlt,
  FaCloudSun,
  FaBell,
  FaBook,
  FaClipboardList,
  FaTruck,
  FaComments,
  FaChartLine,
  FaUserCog
} from 'react-icons/fa';

const Sidebar = ({ user, currentPage, onNavigate }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  // Configuration des menus par rôle
  const menuConfig = {
    'chef-projet': [
      { id: 'Profil', label: 'Profil', icon: FaHome, path: 'Profil' },
      { id: 'dashboard', label: 'Dashboard général', icon: FaHome, path: 'dashboard' },
      { id: 'carte', label: 'Carte chantier', icon: FaMap, path: 'carte' },
      { id: 'indicateurs', label: 'Indicateurs & Graphiques', icon: FaChartBar, path: 'indicateurs' },
      { id: 'planning', label: 'Planning global', icon: FaCalendarAlt, path: 'planning' },
      { id: 'approvisionnement', label: 'Approvisionnement & Stocks', icon: FaBoxes, path: 'approvisionnement' },
      { id: 'alertes', label: 'Alertes critiques', icon: FaExclamationTriangle, path: 'alertes' },
      { id: 'suggestions', label: 'Suggestions IA', icon: FaBrain, path: 'suggestions' },
      { id: 'rapports', label: 'Rapports & Export', icon: FaFileAlt, path: 'rapports' },
      { id: 'parametres', label: 'Paramètres projet', icon: FaCog, path: 'parametres' }
    ],
    'client': [
      { id: 'vue-chantier', label: 'Vue chantier', icon: FaHome, path: 'vue-chantier' },
      { id: 'zones', label: 'Zones & Activités', icon: FaMap, path: 'zones' },
      { id: 'planning-equipes', label: 'Planning équipes', icon: FaCalendarAlt, path: 'planning-equipes' },
      { id: 'commandes', label: 'Commandes & Stock', icon: FaBoxes, path: 'commandes' },
      { id: 'alertes-incidents', label: 'Alertes & Incidents', icon: FaExclamationTriangle, path: 'alertes-incidents' },
      { id: 'communication', label: 'Communication', icon: FaComments, path: 'communication' },
      { id: 'profil', label: 'profil', icon: FaCog, path: 'profil' }
    ],
    // 'chef-chantier': [
    //   { id: 'mon-espace', label: 'Mon espace', icon: FaHome, path: 'mon-espace' },
    //   { id: 'taches', label: 'Tâches journalières', icon: FaClipboardList, path: 'taches' },
    //   { id: 'pointage', label: 'Pointage ouvriers', icon: FaUsers, path: 'pointage' },
    //   { id: 'cameras-zone', label: 'Caméras (zone)', icon: FaVideo, path: 'cameras-zone' },
    //   { id: 'securite', label: 'Sécurité & EPI', icon: FaShieldAlt, path: 'securite' },
    //   { id: 'stock-commandes', label: 'Stock & Commandes rapides', icon: FaBoxes, path: 'stock-commandes' },
    //   { id: 'meteo', label: 'Météo & Planning', icon: FaCloudSun, path: 'meteo' },
    //   { id: 'notifications', label: 'Notifications', icon: FaBell, path: 'notifications' },
    //   { id: 'briefing', label: 'Briefing sécurité', icon: FaBook, path: 'briefing' }
    // ],
    // 'chef-equipe': [
    //   { id: 'tableau-bord', label: 'Tableau de bord', icon: FaHome, path: 'tableau-bord' },
    //   { id: 'taches-avancement', label: 'Tâches & Avancement', icon: FaClipboardList, path: 'taches-avancement' },
    //   { id: 'equipe-presences', label: 'Équipe & Présences', icon: FaUsers, path: 'equipe-presences' },
    //   { id: 'securite-zone', label: 'Sécurité (zone)', icon: FaShieldAlt, path: 'securite-zone' },
    //   { id: 'materiaux', label: 'Matériaux affectés', icon: FaBoxes, path: 'materiaux' },
    //   { id: 'anomalies', label: 'Anomalies / Retards', icon: FaExclamationTriangle, path: 'anomalies' },
    //   { id: 'sensibilisation', label: 'Sensibilisation sécurité', icon: FaBook, path: 'sensibilisation' }
    // ],
    'fournisseur': [
      { id: 'mon-espace-fournisseur', label: 'Mon espace fournisseur', icon: FaUserCog, path: 'dashboard-fournisseur' },
      { id: 'mes-commandes', label: 'Mes commandes', icon: FaHome, path: 'mes-commandes' },
      { id: 'magasin', label: 'matériaux / Services', icon: FaBoxes, path: 'magasin' },
      { id: 'bons-commande', label: 'Bons de commande', icon: FaFileAlt, path: 'bons-commande' },
      { id: 'profil', label: 'profil', icon: FaUsers, path: 'profil' },
    ]
  };

  // Obtenir le menu selon le rôle de l'utilisateur
  const getUserMenu = () => {
    const role = user?.role || 'chef-chantier'; // Par défaut
    return menuConfig[role] || menuConfig['chef-chantier'];
  };

  const handleMenuClick = (path) => {
    if (onNavigate) {
      onNavigate(path); // Appelle le parent pour changer le composant affiché
    } else {
      navigate(`/${path}`); // Navigation classique si pas de onNavigate
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const menuItems = getUserMenu();

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Header du sidebar */}
      <div className="sidebar-header">
        <div className="logo-section">
          <img src={require('../../assets/logo.png')} alt="E-TABAX" className="logo logo-large" />
          {!isCollapsed }
        </div>
        <button 
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Informations utilisateur */}
      <div className="user-info">
        <div className="user-avatar">
          <FaUsers />
        </div>
        {!isCollapsed && (
          <div className="user-details">
            <div className="user-name">{user?.prenom} {user?.nom}</div>
            <div className="user-role">{getRoleLabel(user?.role)}</div>
          </div>
        )}
      </div>

      {/* Menu de navigation */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.id} className="nav-item">
                <button
                  className={`nav-link ${currentPage === item.path ? 'active' : ''}`}
                  onClick={() => handleMenuClick(item.path)}
                >
                  <IconComponent className="nav-icon" />
                  {!isCollapsed && <span className="nav-label">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer du sidebar */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <FaUserCog />
          {!isCollapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </div>
  );
};

// Fonction pour obtenir le label du rôle
const getRoleLabel = (role) => {
  const roleLabels = {
    'chef-projet': 'Chef de Projet',
    'client': 'Client',
    'fournisseur': 'Fournisseur'
  };
  return roleLabels[role] || 'Utilisateur';
};

export default Sidebar;