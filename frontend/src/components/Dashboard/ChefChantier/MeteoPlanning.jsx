import React, { useEffect, useState } from 'react';
import chefChantierAPI from '../../../api/chefChantier';
import './MeteoPlanning.css'; // style à ajouter
import { toast } from 'react-toastify';

export default function MeteoPlanning() {
  const [ville, setVille] = useState('Dakar');
  const [meteo, setMeteo] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchVilleParCoordonnees(latitude, longitude);
      }, () => {
        toast.warn("Impossible d'accéder à la localisation. Ville par défaut : Dakar");
        fetchMeteo('Dakar');
      });
    } else {
      toast.warn("Géolocalisation non supportée. Ville par défaut : Dakar");
      fetchMeteo('Dakar');
    }
  }, []);

  const fetchVilleParCoordonnees = async (lat, lon) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await res.json();
      const villeDetectee = data?.address?.city || data?.address?.town || 'Dakar';
      setVille(villeDetectee);
      fetchMeteo(villeDetectee);
    } catch (err) {
      toast.error("Erreur localisation. Ville par défaut utilisée.");
      fetchMeteo('Dakar');
    }
  };

  const fetchMeteo = async (villeChoisie) => {
  setLoading(true);
  try {
    const res = await chefChantierAPI.getMeteo(villeChoisie);
    console.log("Réponse API météo:", res);

    if (res.success) {
      setMeteo({
        weather: {
          icon: res.weather.icon,
          description: res.weather.description,
        },
        temperature: res.weather.temperature,
        humidity: res.weather.humidity,
        wind_speed: res.weather.wind_speed,
      });

      setForecast(res.forecast.map(f => ({
        date: f.date,
        weather: { icon: f.icon, description: f.description },
        temperature: f.temperature,
        humidity: f.humidity,
        wind_speed: f.wind_speed,
      })) || []);
    } else {
      toast.error("Météo non disponible");
      setMeteo(null);
      setForecast([]);
    }
  } catch (e) {
    toast.error("Erreur lors de la récupération de la météo ❌");
    setMeteo(null);
    setForecast([]);
  }
  setLoading(false);
};


  const handleVilleChange = (e) => setVille(e.target.value);

  const handleVilleSubmit = (e) => {
    e.preventDefault();
    fetchMeteo(ville);
  };

  return (
    <div className="meteo-container">
      <h2>Météo & Planning</h2>

      <form onSubmit={handleVilleSubmit} className="ville-form">
        <input value={ville} onChange={handleVilleChange} placeholder="Entrez une ville" />
        <button type="submit">Rechercher</button>
      </form>

      {loading ? (
        <p>Chargement météo...</p>
      ) : meteo ? (
        <>
          <div className="meteo-box">
            <h3>{ville}</h3>
            <div className="current-weather">
              <img
                src={`https://openweathermap.org/img/wn/${meteo.weather.icon}@2x.png`}
                alt={meteo.weather.description}
                className="weather-icon"
              />
              <p><strong>Condition :</strong> {meteo.weather.description}</p>
              <p><strong>Température :</strong> {meteo.temperature} °C</p>
              <p><strong>Humidité :</strong> {meteo.humidity} %</p>
              <p><strong>Vent :</strong> {meteo.wind_speed} km/h</p>
            </div>
          </div>

          <div className="forecast-container">
            <h4>Prévisions météo à venir</h4>
            {forecast.length === 0 ? (
              <p>Pas de prévisions disponibles.</p>
            ) : (
              <ul>
                {forecast.map((f, i) => (
                  <li key={i} className="forecast-item">
                    <span>{new Date(f.date).toLocaleString()}</span> - 
                    <img
                      src={`https://openweathermap.org/img/wn/${f.weather.icon}@2x.png`}
                      alt={f.weather.description}
                      className="weather-icon-small"
                    />
                    {f.weather.description}, {f.temperature} °C, humidité: {f.humidity} %, vent: {f.wind_speed} km/h
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      ) : (
        <p>Météo non disponible.</p>
      )}

      <div className="planning-container">
        <h3>Planning de la journée</h3>
        <p>Consultez le planning des travaux pour la journée en cours.</p>
        {/* Intégrer composant / liste tâches ici */}
      </div>
    </div>
  );
}