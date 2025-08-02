import React from 'react';
import './DashboardFournisseur.css';
import Sidebar from '../../Layout/Sidebar';

// Exemple de données fictives
const stats = {
  produitsVendus: 124,
  commandes: 37,
  categories: [
    { nom: 'Matériaux', valeur: 60, couleur: '#FFB347' },
    { nom: 'Outils', valeur: 40, couleur: '#77DD77' },
    { nom: 'Équipements', valeur: 24, couleur: '#AEC6CF' },
  ],
};

const DashboardFournisseur = ({ user }) => (
  <div className="dashboard-role" style={{ display: 'flex' }}>
    <Sidebar user={user} />
    <div style={{ flex: 1, padding: '32px', background: '#faf9fb', minHeight: '100vh' }}>
      <h2 style={{ marginBottom: 24 }}>Dashboard du Fournisseur</h2>
      <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
        <div className="dashboard-card">
          <div className="dashboard-card-title">Produits vendus (semaine)</div>
          <div className="dashboard-card-value">{stats.produitsVendus}</div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-title">Commandes reçues</div>
          <div className="dashboard-card-value">{stats.commandes}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 24 }}>
        <div className="dashboard-graph">
          <div className="dashboard-card-title">Répartition des ventes par catégorie</div>
          {/* Remplace ce bloc par un vrai graphique si tu utilises Chart.js ou Recharts */}
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {stats.categories.map(cat => (
              <li key={cat.nom} style={{ margin: '8px 0', display: 'flex', alignItems: 'center' }}>
                <span style={{
                  display: 'inline-block',
                  width: 16,
                  height: 16,
                  background: cat.couleur,
                  borderRadius: '50%',
                  marginRight: 8,
                }} />
                {cat.nom} : {cat.valeur}
              </li>
            ))}
          </ul>
        </div>
        {/* Tu peux ajouter ici d'autres widgets pertinents */}
      </div>
    </div>
  </div>
);

export default DashboardFournisseur;