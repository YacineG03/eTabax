import React, { useState } from 'react';
import Sidebar from '../../Layout/Sidebar';
import MonEspace from './MonEspace';
import TachesJournalieres from './TachesJournalieres';
import PointageOuvriers from './PointageOuvriers';
import CamerasZone from './CamerasZone';
import SecuriteEPI from './SecuriteEPI';
import StockCommandes from './StockCommandes';
import MeteoPlanning from './MeteoPlanning';
import Notifications from './Notifications';
import BriefingSecurite from './BriefingSecurite';

const COMPONENTS = {
  'mon-espace': MonEspace,
  'taches': TachesJournalieres,
  'pointage': PointageOuvriers,
  'cameras-zone': CamerasZone,
  'securite': SecuriteEPI,
  'stock-commandes': StockCommandes,
  'meteo': MeteoPlanning,
  'notifications': Notifications,
  'briefing': BriefingSecurite,
};

export default function DashboardChefChantier({ user }) {
  const [currentPage, setCurrentPage] = useState('mon-espace');
  const CurrentComponent = COMPONENTS[currentPage] || MonEspace;

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar user={user} currentPage={currentPage} onNavigate={setCurrentPage} />
      <div style={{ flex: 1, padding: 32 }}>
        <CurrentComponent />
      </div>
    </div>
  );
}