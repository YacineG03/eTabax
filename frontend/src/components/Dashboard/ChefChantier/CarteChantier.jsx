import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const dakar = [14.7167, -17.4677];

const CarteChantier = () => (
  <div style={{ height: 300, marginBottom: 24 }}>
    <h3>Carte du Chantier</h3>
    <MapContainer center={dakar} zoom={13} style={{ height: '250px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={dakar}>
        <Popup>Chantier Dakar</Popup>
      </Marker>
    </MapContainer>
  </div>
);

export default CarteChantier;