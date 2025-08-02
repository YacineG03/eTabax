import React, { useState, useEffect } from "react";
import { FaChartLine, FaBoxes, FaMoneyBillWave, FaTruck, FaUsers, FaCalendarAlt } from "react-icons/fa";
import "./StatistiquesFournisseur.css";

const StatistiquesFournisseur = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("month");

  useEffect(() => {
    loadStats();
  }, [period]);

  const loadStats = async () => {
    try {
      setLoading(true);
      // Simulation de données pour l'instant
      // TODO: Remplacer par l'appel API réel
      const mockStats = {
        chiffreAffaires: 1250000,
        commandesTotal: 45,
        produitsVendus: 320,
        clientsActifs: 12,
        evolution: {
          janvier: 850000,
          février: 920000,
          mars: 1100000,
          avril: 1250000
        },
        topProduits: [
          { nom: "Ciment Portland 50kg", ventes: 150, chiffre: 750000 },
          { nom: "Parpaings creux", ventes: 2000, chiffre: 300000 },
          { nom: "Béton BPE", ventes: 15, chiffre: 525000 },
          { nom: "Briques alvéolaires", ventes: 5000, chiffre: 250000 }
        ],
        commandesParStatut: {
          "en_attente": 8,
          "validée": 15,
          "en_préparation": 5,
          "expédiée": 12,
          "livrée": 5
        }
      };
      setStats(mockStats);
    } catch (error) {
      console.error("Erreur chargement stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat("fr-FR").format(number);
  };

  if (loading) {
    return (
      <div className="stats-container">
        <h2>Statistiques</h2>
        <div className="loading">Chargement des statistiques...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="stats-container">
        <h2>Statistiques</h2>
        <div className="no-stats">Aucune donnée disponible</div>
      </div>
    );
  }

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h2>Statistiques & Historique</h2>
        <div className="period-selector">
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            className="period-select"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
        </div>
      </div>

      {/* Cartes de statistiques principales */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">
            <FaMoneyBillWave />
          </div>
          <div className="stat-content">
            <h3>Chiffre d'affaires</h3>
            <p className="stat-value">{formatPrice(stats.chiffreAffaires)}</p>
            <p className="stat-change positive">+12.5% vs mois dernier</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaBoxes />
          </div>
          <div className="stat-content">
            <h3>Commandes totales</h3>
            <p className="stat-value">{formatNumber(stats.commandesTotal)}</p>
            <p className="stat-change positive">+8.2% vs mois dernier</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaTruck />
          </div>
          <div className="stat-content">
            <h3>Produits vendus</h3>
            <p className="stat-value">{formatNumber(stats.produitsVendus)}</p>
            <p className="stat-change positive">+15.3% vs mois dernier</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>Clients actifs</h3>
            <p className="stat-value">{formatNumber(stats.clientsActifs)}</p>
            <p className="stat-change positive">+2 nouveaux clients</p>
          </div>
        </div>
      </div>

      {/* Graphiques et tableaux */}
      <div className="stats-details">
        <div className="stats-section">
          <h3>Évolution du chiffre d'affaires</h3>
          <div className="evolution-chart">
            {Object.entries(stats.evolution).map(([month, value]) => (
              <div key={month} className="chart-bar">
                <div 
                  className="bar-fill" 
                  style={{ 
                    height: `${(value / Math.max(...Object.values(stats.evolution))) * 100}%` 
                  }}
                ></div>
                <span className="bar-label">{month}</span>
                <span className="bar-value">{formatPrice(value)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="stats-section">
          <h3>Top produits vendus</h3>
          <div className="top-products">
            {stats.topProduits.map((produit, index) => (
              <div key={index} className="product-item">
                <div className="product-rank">#{index + 1}</div>
                <div className="product-info">
                  <h4>{produit.nom}</h4>
                  <p>{formatNumber(produit.ventes)} unités vendues</p>
                </div>
                <div className="product-revenue">
                  {formatPrice(produit.chiffre)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="stats-section">
          <h3>Répartition des commandes par statut</h3>
          <div className="orders-status">
            {Object.entries(stats.commandesParStatut).map(([status, count]) => (
              <div key={status} className="status-item">
                <div className="status-info">
                  <span className="status-name">{getStatusLabel(status)}</span>
                  <span className="status-count">{count} commandes</span>
                </div>
                <div className="status-bar">
                  <div 
                    className="status-fill"
                    style={{ 
                      width: `${(count / Object.values(stats.commandesParStatut).reduce((a, b) => a + b, 0)) * 100}%`,
                      backgroundColor: getStatusColor(status)
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="stats-actions">
        <button className="action-btn">
          <FaCalendarAlt />
          Exporter rapport
        </button>
        <button className="action-btn">
          <FaChartLine />
          Voir détails
        </button>
      </div>
    </div>
  );
};

const getStatusLabel = (status) => {
  const labels = {
    "en_attente": "En attente",
    "validée": "Validée",
    "en_préparation": "En préparation",
    "expédiée": "Expédiée",
    "livrée": "Livrée"
  };
  return labels[status] || status;
};

const getStatusColor = (status) => {
  const colors = {
    "en_attente": "#f39c12",
    "validée": "#27ae60",
    "en_préparation": "#3498db",
    "expédiée": "#9b59b6",
    "livrée": "#27ae60"
  };
  return colors[status] || "#95a5a6";
};

export default StatistiquesFournisseur; 