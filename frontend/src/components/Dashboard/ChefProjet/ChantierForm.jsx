// import React, { useState, useEffect } from 'react';
// import { FaTimes, FaSearch, FaMapMarkerAlt, FaUser, FaEye } from 'react-icons/fa';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import { toast } from 'react-toastify';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// // Correction pour les icônes Leaflet
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//   iconUrl: require('leaflet/dist/images/marker-icon.png'),
//   shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
// });

// const ChantierForm = ({ 
//   form, 
//   setForm, 
//   selectedLocation, 
//   setSelectedLocation,  
//   address, 
//   setAddress, 
//   useMap, 
//   setUseMap, 
//   onSubmit, 
//   onClose 
// }) => {
//   const [clients, setClients] = useState([]);
//   const [showClientSearch, setShowClientSearch] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedClient, setSelectedClient] = useState(null);
//   const handleMapClick = React.useCallback((e) => {
//     const newLocation = [e.latlng.lat, e.latlng.lng];
//     setSelectedLocation(newLocation);
//     setAddress(`Lat: ${newLocation[0].toFixed(6)}, Lng: ${newLocation[1].toFixed(6)}`);
//   }, [setSelectedLocation, setAddress]);

//   const handleSubmit = React.useCallback((e) => {
//     e.preventDefault();
//     onSubmit();
//   }, [onSubmit]);

//   // Charger les clients depuis Firebase
//   useEffect(() => {
//     const fetchClients = async () => {
//       try {
//         const response = await fetch('/api/chef-projet/clients?role=client', {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('firebaseToken') || localStorage.getItem('authToken') || localStorage.getItem('token')}`
//           }
//         });
//         if (response.ok) {
//           const data = await response.json();
//           setClients(data.users || []);
//         }
//       } catch (error) {
//         console.error('Erreur lors du chargement des clients:', error);
//       }
//     };
//     fetchClients();
//   }, []);

//   const handleClientSearch = () => {
//     setShowClientSearch(true);
//   };

//   const handleClientSelect = (client) => {
//     setSelectedClient(client);
//     if (form.proprietaireType === 'email') {
//       setForm({ ...form, proprietaireEmail: client.email });
//     } else {
//       setForm({ ...form, proprietaireTelephone: client.telephone });
//     }
//     setShowClientSearch(false);
//     setSearchTerm('');
//   };

//   const filteredClients = clients.filter(client => 
//     client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     client.telephone?.includes(searchTerm) ||
//     client.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     client.prenom?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="nouveau-chantier-overlay">
//       <div className="nouveau-chantier-container">
//         <div className="nouveau-chantier-header">
//           <h2>NOUVEAU PROJET</h2>
//           <button className="close-btn" onClick={onClose}>
//             <FaTimes />
//           </button>
//         </div>
        
//         <div className="nouveau-chantier-content">
//           <div className="form-section">
//             <form onSubmit={handleSubmit} className="chantier-form">
//               <div className="form-group">
//                 <label>Nom du Chantier *</label>
//                 <input 
//                   type="text" 
//                   value={form.nom} 
//                   onChange={(e) => setForm({ ...form, nom: e.target.value })} 
//                   placeholder="Ex: SOTRAC DISTRIBUTION"
//                   required 
//                 />
//               </div>
              
//               <div className="form-group">
//                 <label>Type de Contact Propriétaire</label>
//                 <div className="contact-type-selector">
//                   <label className="radio-label">
//                     <input 
//                       type="radio" 
//                       name="contactType" 
//                       value="email"
//                       checked={form.proprietaireType === 'email'}
//                       onChange={(e) => setForm({ ...form, proprietaireType: e.target.value })}
//                     />
//                     Email
//                   </label>
//                   <label className="radio-label">
//                     <input 
//                       type="radio" 
//                       name="contactType" 
//                       value="telephone"
//                       checked={form.proprietaireType === 'telephone'}
//                       onChange={(e) => setForm({ ...form, proprietaireType: e.target.value })}
//                     />
//                     Téléphone
//                   </label>
//                 </div>
//               </div>
              
//                              <div className="form-group">
//                  <label>Rechercher un Client</label>
//                  <div className="client-search-section">
//                    <button 
//                      type="button" 
//                      className="client-search-btn"
//                      onClick={handleClientSearch}
//                    >
//                      <FaUser /> Rechercher un client existant
//                    </button>
//                    {selectedClient && (
//                      <div className="selected-client">
//                        <span>✅ Client sélectionné: {selectedClient.prenom} {selectedClient.nom}</span>
//                        <button 
//                          type="button" 
//                          className="clear-client-btn"
//                          onClick={() => {
//                            setSelectedClient(null);
//                            setForm({ ...form, proprietaireEmail: '', proprietaireTelephone: '' });
//                          }}
//                        >
//                          ✕
//                        </button>
//                      </div>
//                    )}
//                  </div>
//                </div>

//                {form.proprietaireType === 'email' ? (
//                  <div className="form-group">
//                    <label>Email Propriétaire</label>
//                    <input 
//                      type="email" 
//                      value={form.proprietaireEmail} 
//                      onChange={(e) => setForm({ ...form, proprietaireEmail: e.target.value })} 
//                      placeholder="proprietaire@email.com"
//                      readOnly={selectedClient}
//                    />
//                  </div>
//                ) : (
//                  <div className="form-group">
//                    <label>Téléphone Propriétaire</label>
//                    <input 
//                      type="tel" 
//                      value={form.proprietaireTelephone} 
//                      onChange={(e) => setForm({ ...form, proprietaireTelephone: e.target.value })} 
//                      placeholder="+221 77 123 45 67"
//                      readOnly={selectedClient}
//                    />
//                  </div>
//                )}
              
//               <div className="form-group">
//                 <label>Localisation du Chantier</label>
//                 <div className="location-type-selector">
//                   <label className="radio-label">
//                     <input 
//                       type="radio" 
//                       name="locationType" 
//                       value="map"
//                       checked={useMap}
//                       onChange={() => setUseMap(true)}
//                     />
//                     Utiliser la carte
//                   </label>
//                   <label className="radio-label">
//                     <input 
//                       type="radio" 
//                       name="locationType" 
//                       value="manual"
//                       checked={!useMap}
//                       onChange={() => setUseMap(false)}
//                     />
//                     Saisie manuelle
//                   </label>
//                 </div>
//               </div>
              
//               {useMap ? (
//                 <div className="form-group">
//                   <label>Emplacement sélectionné</label>
//                   <input 
//                     type="text" 
//                     value={address || `Lat: ${selectedLocation[0].toFixed(6)}, Lng: ${selectedLocation[1].toFixed(6)}`}
//                     readOnly
//                     placeholder="Cliquez sur la carte pour sélectionner l'emplacement"
//                     className="location-display"
//                   />
//                 </div>
//               ) : (
//                 <div className="manual-location-section">
//                   <label>📍 Adresse du chantier</label>
//                   <input 
//                     type="text" 
//                     value={address}
//                     onChange={(e) => setAddress(e.target.value)}
//                     placeholder="Ex: Rue 10, Dakar, Sénégal"
//                   />
//                   <div className="info-text">
//                     💡 Saisissez l'adresse complète du chantier pour faciliter la localisation
//                   </div>
//                 </div>
//               )}
              
//                              <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
//                  <button type="submit" className="create-btn">
//                    🚀 Créer le Chantier
//                  </button>
//                </div>
//             </form>
//           </div>
          
//           {useMap ? (
//             <div className="map-section">
//               <div className="map-header">
//                 <div className="search-container">
//                   <FaSearch className="search-icon" />
//                   <input 
//                     type="text" 
//                     placeholder="Rechercher un lieu (ex: Dakar, Sénégal)" 
//                     className="search-input"
//                     onKeyPress={(e) => {
//                       if (e.key === 'Enter') {
//                         toast.info('Fonctionnalité de recherche en cours de développement');
//                       }
//                     }}
//                   />
//                 </div>
//                 <div className="map-info">
//                   <p><strong>Instructions :</strong></p>
//                   <ul>
//                     <li>Cliquez sur la carte pour sélectionner l'emplacement du chantier</li>
//                     <li>Le marqueur jaune indique l'emplacement sélectionné</li>
//                     <li>Vous pouvez zoomer/dézoomer avec les boutons + et -</li>
//                   </ul>
//                 </div>
//               </div>
              
//               <div className="map-container">
//                 <MapContainer 
//                   center={selectedLocation} 
//                   zoom={13} 
//                   style={{ height: '400px', width: '100%' }}
//                   onClick={handleMapClick}
//                   key={`map-${selectedLocation[0]}-${selectedLocation[1]}`}
//                 >
//                   <TileLayer
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                   />
//                   <Marker position={selectedLocation}>
//                     <Popup>
//                       <div>
//                         <FaMapMarkerAlt style={{ color: '#f5b942' }} />
//                         <strong>Emplacement du Chantier</strong>
//                         <br />
//                         Latitude: {selectedLocation[0].toFixed(6)}
//                         <br />
//                         Longitude: {selectedLocation[1].toFixed(6)}
//                       </div>
//                     </Popup>
//                   </Marker>
//                 </MapContainer>
//               </div>
//             </div>
//           ) : (
//             <div className="manual-location-info">
//               <div className="manual-location-section">
//                 <label>🗺️ Mode Saisie Manuelle</label>
//                 <div className="info-text">
//                   <p>✅ Vous avez choisi la saisie manuelle de l'adresse</p>
//                   <p>📝 L'adresse saisie sera utilisée pour localiser le chantier</p>
//                   <p>💡 Vous pouvez toujours revenir à la carte en changeant l'option ci-dessus</p>
//                 </div>
//               </div>
//             </div>
//                      )}
//          </div>
//        </div>

//        {/* Modal de recherche de clients */}
//        {showClientSearch && (
//          <div className="client-search-overlay">
//            <div className="client-search-modal">
//              <div className="client-search-header">
//                <h3>🔍 Rechercher un Client</h3>
//                <button 
//                  className="close-btn" 
//                  onClick={() => setShowClientSearch(false)}
//                >
//                  <FaTimes />
//                </button>
//              </div>
             
//              <div className="client-search-content">
//                <div className="search-input-container">
//                  <FaSearch className="search-icon" />
//                  <input
//                    type="text"
//                    placeholder="Rechercher par nom, prénom, email ou téléphone..."
//                    value={searchTerm}
//                    onChange={(e) => setSearchTerm(e.target.value)}
//                    className="client-search-input"
//                  />
//                </div>
               
//                <div className="clients-list">
//                  {filteredClients.length > 0 ? (
//                    filteredClients.map((client) => (
//                      <div 
//                        key={client.id} 
//                        className="client-item"
//                        onClick={() => handleClientSelect(client)}
//                      >
//                        <div className="client-info">
//                          <strong>{client.prenom} {client.nom}</strong>
//                          <span>{client.email}</span>
//                          <span>{client.telephone}</span>
//                        </div>
//                        <FaEye className="view-icon" />
//                      </div>
//                    ))
//                  ) : (
//                    <div className="no-clients">
//                      {searchTerm ? 'Aucun client trouvé' : 'Aucun client disponible'}
//                    </div>
//                  )}
//                </div>
//              </div>
//            </div>
//          </div>
//        )}
//      </div>
//    );
//  };

// export default React.memo(ChantierForm); 
import React, { useState, useEffect } from 'react';
import { FaTimes, FaSearch, FaMapMarkerAlt, FaUser, FaEye } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { toast } from 'react-toastify';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Correction pour les icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const ChantierForm = ({ 
  form, 
  setForm, 
  selectedLocation, 
  setSelectedLocation, 
  address, 
  setAddress, 
  useMap, 
  setUseMap, 
  onSubmit, 
  onClose 
}) => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);

  // Charger les clients depuis Firebase avec filtre rôle "client"
useEffect(() => {
  const fetchClients = async () => {
    const token = localStorage.getItem('firebaseToken') || localStorage.getItem('authToken') || localStorage.getItem('token');
    console.log('Token utilisé:', token);
    try {
      const response = await fetch('/api/chef-projet/clients?role=client', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur HTTP ${response.status}: ${errorText.substring(0, 100)}...`);
      }
      const data = await response.json();
      if (data.success) {
        setClients(data.users.filter(client => client.role === 'client') || []);
      } else {
        throw new Error(data.message || 'Réponse invalide du serveur');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error);
      toast.error(`Erreur lors du chargement des clients: ${error.message}`);
    }
  };
  fetchClients();
}, []);
  // Mettre à jour le formulaire lorsque un client est sélectionné
  useEffect(() => {
    if (selectedClient) {
      if (selectedClient.email) {
        setForm({ ...form, proprietaireEmail: selectedClient.email, proprietaireTelephone: '' });
      } else if (selectedClient.telephone) {
        setForm({ ...form, proprietaireTelephone: selectedClient.telephone, proprietaireEmail: '' });
      }
    }
  }, [selectedClient, setForm, form]);

  // Mettre à jour la recherche en temps réel
  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setSearchTerm(client.email || client.telephone || '');
  };

  const filteredClients = clients.filter(client => 
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.telephone && client.telephone.includes(searchTerm))
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nom || (!form.proprietaireEmail && !form.proprietaireTelephone)) {
      toast.error('Veuillez remplir le nom du chantier et sélectionner un client.');
      return;
    }
    onSubmit();
  };

  return (
    <div className="nouveau-chantier-overlay">
      <div className="nouveau-chantier-container">
        <div className="nouveau-chantier-header">
          <h2>NOUVEAU PROJET</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="nouveau-chantier-content">
          <div className="form-section">
            <form onSubmit={handleSubmit} className="chantier-form">
              <div className="form-group">
                <label>Nom du Chantier *</label>
                <input 
                  type="text" 
                  value={form.nom} 
                  onChange={(e) => setForm({ ...form, nom: e.target.value })} 
                  placeholder="Ex: SOTRAC DISTRIBUTION"
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Rechercher un Client par Email ou Téléphone</label>
                <div className="search-input-container">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Entrez un email ou un téléphone (ex: user@example.com ou +221771234567)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="client-search-input"
                  />
                </div>
                {filteredClients.length > 0 && (
                  <div className="clients-list">
                    {filteredClients.map((client) => (
                      <div 
                        key={client.id} 
                        className="client-item"
                        onClick={() => handleClientSelect(client)}
                      >
                        <div className="client-info">
                          <strong>{client.prenom} {client.nom}</strong>
                          <span>{client.email || client.telephone}</span>
                        </div>
                        <FaEye className="view-icon" />
                      </div>
                    ))}
                  </div>
                )}
                {searchTerm && filteredClients.length === 0 && (
                  <div className="no-clients">
                    Aucun client trouvé avec cet email ou ce téléphone
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label>Localisation du Chantier</label>
                <div className="location-type-selector">
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="locationType" 
                      value="map"
                      checked={useMap}
                      onChange={() => setUseMap(true)}
                    />
                    Utiliser la carte
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="locationType" 
                      value="manual"
                      checked={!useMap}
                      onChange={() => setUseMap(false)}
                    />
                    Saisie manuelle
                  </label>
                </div>
              </div>
              
              {useMap ? (
                <div className="form-group">
                  <label>Emplacement sélectionné</label>
                  <input 
                    type="text" 
                    value={address || `Lat: ${selectedLocation[0].toFixed(6)}, Lng: ${selectedLocation[1].toFixed(6)}`}
                    readOnly
                    placeholder="Cliquez sur la carte pour sélectionner l'emplacement"
                    className="location-display"
                  />
                </div>
              ) : (
                <div className="manual-location-section">
                  <label>📍 Adresse du chantier</label>
                  <input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ex: Rue 10, Dakar, Sénégal"
                  />
                  <div className="info-text">
                    💡 Saisissez l'adresse complète du chantier pour faciliter la localisation
                  </div>
                </div>
              )}
              
              <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                <button type="submit" className="create-btn">
                  🚀 Créer le Chantier
                </button>
              </div>
            </form>
          </div>
          
          {useMap ? (
            <div className="map-section">
              <div className="map-header">
                <div className="search-container">
                  <FaSearch className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Rechercher un lieu (ex: Dakar, Sénégal)" 
                    className="search-input"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        toast.info('Fonctionnalité de recherche en cours de développement');
                      }
                    }}
                  />
                </div>
                <div className="map-info">
                  <p><strong>Instructions :</strong></p>
                  <ul>
                    <li>Cliquez sur la carte pour sélectionner l'emplacement du chantier</li>
                    <li>Le marqueur jaune indique l'emplacement sélectionné</li>
                    <li>Vous pouvez zoomer/dézoomer avec les boutons + et -</li>
                  </ul>
                </div>
              </div>
              
              <div className="map-container">
                <MapContainer 
                  center={selectedLocation} 
                  zoom={13} 
                  style={{ height: '400px', width: '100%' }}
                  onClick={(e) => {
                    const newLocation = [e.latlng.lat, e.latlng.lng];
                    setSelectedLocation(newLocation);
                    setAddress(`Lat: ${newLocation[0].toFixed(6)}, Lng: ${newLocation[1].toFixed(6)}`);
                  }}
                  key={`map-${selectedLocation[0]}-${selectedLocation[1]}`}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={selectedLocation}>
                    <Popup>
                      <div>
                        <FaMapMarkerAlt style={{ color: '#f5b942' }} />
                        <strong>Emplacement du Chantier</strong>
                        <br />
                        Latitude: {selectedLocation[0].toFixed(6)}
                        <br />
                        Longitude: {selectedLocation[1].toFixed(6)}
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          ) : (
            <div className="manual-location-info">
              <div className="manual-location-section">
                <label>🗺️ Mode Saisie Manuelle</label>
                <div className="info-text">
                  <p>✅ Vous avez choisi la saisie manuelle de l'adresse</p>
                  <p>📝 L'adresse saisie sera utilisée pour localiser le chantier</p>
                  <p>💡 Vous pouvez toujours revenir à la carte en changeant l'option ci-dessus</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ChantierForm);