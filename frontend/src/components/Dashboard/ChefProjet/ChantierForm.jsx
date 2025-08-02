// import React, { useState, useEffect } from 'react';
// import { FaTimes, FaSearch, FaMapMarkerAlt, FaCheck } from 'react-icons/fa';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import { toast } from 'react-toastify';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import { getClients, createChantier } from '../../../api/chefProjet';

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
//   onClose 
// }) => {
//   const [clients, setClients] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedClient, setSelectedClient] = useState(null);
//   const [isClientModalOpen, setIsClientModalOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const clientsPerPage = 5;

//   // Charger les clients depuis Firebase avec filtre rôle "client"
//   useEffect(() => {
//     const fetchClients = async () => {
//       try {
//         const data = await getClients();
//         if (data.success) {
//           setClients(data.users.filter(client => client.role === 'client') || []);
//         } else {
//           throw new Error(data.message || 'Réponse invalide du serveur');
//         }
//       } catch (error) {
//         console.error('Erreur lors du chargement des clients:', error);
//         toast.error(`Erreur lors du chargement des clients: ${error.message}`);
//       }
//     };
//     fetchClients();
//   }, []);

//   // Mettre à jour le formulaire uniquement si le client sélectionné change et si les champs ne sont pas déjà mis à jour
//   useEffect(() => {
//     if (selectedClient && (!form.proprietaireEmail || !form.proprietaireTelephone)) {
//       if (selectedClient.email) {
//         setForm(prevForm => ({ ...prevForm, proprietaireEmail: selectedClient.email, proprietaireTelephone: '' }));
//       } else if (selectedClient.telephone) {
//         setForm(prevForm => ({ ...prevForm, proprietaireTelephone: selectedClient.telephone, proprietaireEmail: '' }));
//       }
//     }
//   }, [selectedClient, setForm, form.proprietaireEmail, form.proprietaireTelephone]);

//   // Mettre à jour la recherche en temps réel
//   const handleClientSelect = (client) => {
//     setSelectedClient(client);
//     setIsClientModalOpen(false); // Ferme le modal après sélection
//   };

//   const filteredClients = clients.filter(client => 
//     (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
//     (client.telephone && client.telephone.includes(searchTerm))
//   );

//   // Pagination
//   const indexOfLastClient = currentPage * clientsPerPage;
//   const indexOfFirstClient = indexOfLastClient - clientsPerPage;
//   const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);
//   const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.nom || (!form.proprietaireEmail && !form.proprietaireTelephone)) {
//       toast.error('Veuillez remplir le nom du chantier et sélectionner un client.');
//       return;
//     }

//     try {
//       // Débogage des données envoyées
//       console.log('Données envoyées à createChantier:', {
//         nom: form.nom,
//         proprietaireEmailOrTel: form.proprietaireEmail || form.proprietaireTelephone,
//         localisation: useMap ? {
//           latitude: selectedLocation[0],
//           longitude: selectedLocation[1]
//         } : { address: address || 'Adresse non spécifiée' }
//       });

//       const chantierData = {
//         nom: form.nom,
//         proprietaireEmailOrTel: form.proprietaireEmail || form.proprietaireTelephone,
//         geolocalisation: useMap
//           ? {
//               latitude: selectedLocation[0],
//               longitude: selectedLocation[1]
//             }
//           : {
//               address: address || 'Adresse non spécifiée'
//             }
//       };

//       await createChantier(chantierData);
//       toast.success('Chantier créé avec succès !');
//       onClose();
//     } catch (error) {
//       console.error('Erreur lors de la création du chantier:', error);
//       toast.error(`Erreur lors de la création du chantier: ${error.message}`);
//     }
//   };

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
//                 <label>Client</label>
//                 <div className="client-search-section">
//                   <button 
//                     type="button" 
//                     className="client-search-btn"
//                     onClick={() => setIsClientModalOpen(true)}
//                   >
//                     <FaSearch /> Rechercher un client
//                   </button>
//                   {selectedClient && (
//                     <div className="selected-client">
//                       <span>{selectedClient.prenom} {selectedClient.nom} ({selectedClient.email || selectedClient.telephone})</span>
//                       <button 
//                         className="clear-client-btn"
//                         onClick={() => {
//                           setSelectedClient(null);
//                           setForm({ ...form, proprietaireEmail: '', proprietaireTelephone: '' });
//                         }}
//                       >
//                         <FaTimes />
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
              
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
              
//               <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
//                 <button type="submit" className="create-btn">
//                   🚀 Créer le Chantier
//                 </button>
//               </div>
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
//                   onClick={(e) => {
//                     const newLocation = [e.latlng.lat, e.latlng.lng];
//                     setSelectedLocation(newLocation);
//                     setAddress(`Lat: ${newLocation[0].toFixed(6)}, Lng: ${newLocation[1].toFixed(6)}`);
//                   }}
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
//           )}
//         </div>
//       </div>

//       {/* Modal de recherche de clients */}
//       {isClientModalOpen && (
//         <div className="client-search-overlay">
//           <div className="client-search-modal">
//             <div className="client-search-header">
//               <h3>Rechercher un Client</h3>
//               <button 
//                 className="close-btn" 
//                 onClick={() => setIsClientModalOpen(false)}
//               >
//                 <FaTimes />
//               </button>
//             </div>
//             <div className="client-search-content">
//               <div className="search-input-container">
//                 <FaSearch className="search-icon" />
//                 <input
//                   type="text"
//                   placeholder="Entrez un email ou un téléphone (ex: user@example.com ou +221771234567)"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="client-search-input"
//                 />
//               </div>
//               {currentClients.length > 0 ? (
//                 <div className="clients-list">
//                   {currentClients.map((client) => (
//                     <div 
//                       key={client.id} 
//                       className="client-item"
//                       onClick={() => handleClientSelect(client)}
//                     >
//                       <div className="client-info">
//                         <strong>{client.prenom} {client.nom}</strong>
//                         <span>{client.email || client.telephone}</span>
//                       </div>
//                       <FaCheck className="view-icon" />
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 searchTerm && (
//                   <div className="no-clients">
//                     Aucun client trouvé avec cet email ou ce téléphone
//                   </div>
//                 )
//               )}
//               {totalPages > 1 && (
//                 <div className="pagination">
//                   {Array.from({ length: totalPages }, (_, index) => (
//                     <button
//                       key={index + 1}
//                       className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
//                       onClick={() => handlePageChange(index + 1)}
//                     >
//                       {index + 1}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default React.memo(ChantierForm);
import React, { useState, useEffect } from 'react';
import { FaTimes, FaSearch, FaMapMarkerAlt, FaCheck } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { toast } from 'react-toastify';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getClients, createChantier } from '../../../api/chefProjet';

// Correction pour les icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Fonction pour géocodage inverse via Nominatim
const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    const data = await response.json();
    if (data && data.display_name) {
      return data.display_name;
    }
    return `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`; // Fallback si aucune adresse trouvée
  } catch (error) {
    console.error('Erreur de géocodage inverse:', error);
    return `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`; // Fallback en cas d'erreur
  }
};

const ChantierForm = ({ 
  form, 
  setForm, 
  selectedLocation, 
  setSelectedLocation, 
  address, 
  setAddress, 
  useMap, 
  setUseMap, 
  onClose 
}) => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 5;

  // Charger les clients depuis Firebase avec filtre rôle "client"
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getClients();
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

  // Mettre à jour le formulaire uniquement si le client sélectionné change et si les champs ne sont pas déjà mis à jour
  useEffect(() => {
    if (selectedClient && (!form.proprietaireEmail || !form.proprietaireTelephone)) {
      if (selectedClient.email) {
        setForm(prevForm => ({ ...prevForm, proprietaireEmail: selectedClient.email, proprietaireTelephone: '' }));
      } else if (selectedClient.telephone) {
        setForm(prevForm => ({ ...prevForm, proprietaireTelephone: selectedClient.telephone, proprietaireEmail: '' }));
      }
    }
  }, [selectedClient, setForm, form.proprietaireEmail, form.proprietaireTelephone]);

  // Mettre à jour la recherche en temps réel
  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setIsClientModalOpen(false); // Ferme le modal après sélection
  };

  const filteredClients = clients.filter(client => 
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.telephone && client.telephone.includes(searchTerm))
  );

  // Pagination
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nom || (!form.proprietaireEmail && !form.proprietaireTelephone)) {
      toast.error('Veuillez remplir le nom du chantier et sélectionner un client.');
      return;
    }

    try {
      const geolocalisation = { address: address || 'Adresse non spécifiée' };
      console.log('Données envoyées à createChantier:', {
        nom: form.nom,
        proprietaireEmailOrTel: form.proprietaireEmail || form.proprietaireTelephone,
        geolocalisation
      });

      const chantierData = {
        nom: form.nom,
        proprietaireEmailOrTel: form.proprietaireEmail || form.proprietaireTelephone,
        geolocalisation
      };

      await createChantier(chantierData);
      toast.success('Chantier créé avec succès !');
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création du chantier:', error);
      toast.error(`Erreur lors de la création du chantier: ${error.message}`);
    }
  };

  // Mettre à jour l'adresse lors du clic sur la carte
  const handleMapClick = async (e) => {
    const newLocation = [e.latlng.lat, e.latlng.lng];
    setSelectedLocation(newLocation);
    const newAddress = await reverseGeocode(newLocation[0], newLocation[1]);
    setAddress(newAddress);
    toast.success('Emplacement sélectionné avec succès !');
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
                <label>Client</label>
                <div className="client-search-section">
                  <button 
                    type="button" 
                    className="client-search-btn"
                    onClick={() => setIsClientModalOpen(true)}
                  >
                    <FaSearch /> Rechercher un client
                  </button>
                  {selectedClient && (
                    <div className="selected-client">
                      <span>{selectedClient.prenom} {selectedClient.nom} ({selectedClient.email || selectedClient.telephone})</span>
                      <button 
                        className="clear-client-btn"
                        onClick={() => {
                          setSelectedClient(null);
                          setForm({ ...form, proprietaireEmail: '', proprietaireTelephone: '' });
                        }}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  )}
                </div>
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
              
              <div className="form-group">
                <label>Adresse du chantier</label>
                <input 
                  type="text" 
                  value={address || ''}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={useMap ? 'Cliquez sur la carte pour sélectionner une adresse' : 'Ex: Rue 10, Dakar, Sénégal'}
                  readOnly={useMap}
                  className="location-display"
                />
                <div className="info-text">
                  💡 {useMap ? 'Sélectionnez un emplacement sur la carte pour obtenir une adresse.' : 'Saisissez l\'adresse complète du chantier.'}
                </div>
              </div>
              
              <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                <button type="submit" className="create-btn">
                  🚀 Créer le Chantier
                </button>
              </div>
            </form>
          </div>
          
          {useMap && (
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
                  onClick={handleMapClick}
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
                        Adresse: {address || 'Sélectionnez un emplacement'}
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de recherche de clients */}
      {isClientModalOpen && (
        <div className="client-search-overlay">
          <div className="client-search-modal">
            <div className="client-search-header">
              <h3>Rechercher un Client</h3>
              <button 
                className="close-btn" 
                onClick={() => setIsClientModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="client-search-content">
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
              {currentClients.length > 0 ? (
                <div className="clients-list">
                  {currentClients.map((client) => (
                    <div 
                      key={client.id} 
                      className="client-item"
                      onClick={() => handleClientSelect(client)}
                    >
                      <div className="client-info">
                        <strong>{client.prenom} {client.nom}</strong>
                        <span>{client.email || client.telephone}</span>
                      </div>
                      <FaCheck className="view-icon" />
                    </div>
                  ))}
                </div>
              ) : (
                searchTerm && (
                  <div className="no-clients">
                    Aucun client trouvé avec cet email ou ce téléphone
                  </div>
                )
              )}
              {totalPages > 1 && (
                <div className="pagination">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(ChantierForm);