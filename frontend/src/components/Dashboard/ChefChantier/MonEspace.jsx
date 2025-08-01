import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const dakar = [14.7167, -17.4677];

export default function MonEspace() {
  const [stats, setStats] = useState({ alertes: 0, taches: 0, presents: 0 });
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Appel API backend pour récupérer les stats
      const res = await fetch('http://localhost:5000/api/chantier/stats');
      const data = await res.json();
      setStats(data.stats);
    } catch (e) {
      setStats({ alertes: 2, taches: 5, presents: 8 }); // fallback mock
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div>
      <h2>Vue d'ensemble du chantier</h2>
      <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
        <div className="stat-card">
          <div>🚨 Alertes</div>
          <div className="stat-number">{stats.alertes}</div>
        </div>
        <div className="stat-card">
          <div>📋 Tâches à faire</div>
          <div className="stat-number">{stats.taches}</div>
        </div>
        <div className="stat-card">
          <div>👷 Ouvriers présents</div>
          <div className="stat-number">{stats.presents}</div>
        </div>
        <button onClick={fetchStats} disabled={loading} style={{ height: 48 }}>
          {loading ? 'Actualisation...' : 'Actualiser données'}
        </button>
      </div>
      <div style={{ height: 300, marginBottom: 24 }}>
        <MapContainer center={dakar} zoom={13} style={{ height: '250px', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={dakar}>
            <Popup>Chantier Dakar</Popup>
          </Marker>
        </MapContainer>
      </div>
      {/* Option : Caméra/image simulée */}
      <div>
        <h4>Caméra chantier (simulation)</h4>
        <img src="/plan.jpg" alt="Caméra chantier" style={{ width: 300, borderRadius: 8 }} />
      </div>
    </div>
  );
}