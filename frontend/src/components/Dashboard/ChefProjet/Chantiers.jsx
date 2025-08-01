import React, { useEffect, useState, useCallback } from 'react';
import { getChantiers, createChantier, updateChantier, deleteChantier } from '../../../api/chefProjet';
import './Chantiers.css';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaSpinner, FaEye } from 'react-icons/fa';
import ChantierForm from './ChantierForm';

// Les imports Leaflet sont maintenant dans ChantierForm.jsx

export default function Chantiers({ user }) {
  const [chantiers, setChantiers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState([14.7167, -17.4677]); // Dakar par défaut
  const [useMap, setUseMap] = useState(true);
  const [address, setAddress] = useState('');
  const [form, setForm] = useState({
    id: null,
    nom: '',
    proprietaireEmail: '',
    proprietaireTelephone: '',
    proprietaireType: 'email' // 'email' ou 'telephone'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getChantiers();
      setChantiers(data.chantiers || []);
    } catch (e) {
      toast.error('Erreur lors du chargement des chantiers ❌');
      setChantiers([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async () => {
    try {
      if (form.id) {
        await updateChantier(form.id, {
          nom: form.nom,
          geolocalisation: `${selectedLocation[0]}, ${selectedLocation[1]}`,
          proprietaireEmailOrTel: form.proprietaireEmail || form.proprietaireTelephone
        });
        toast.success('Chantier modifié avec succès ✏️');
        setShowEditForm(false);
      } else {
        await createChantier({
          nom: form.nom,
          geolocalisation: useMap ? `${selectedLocation[0]}, ${selectedLocation[1]}` : address,
          proprietaireEmailOrTel: form.proprietaireType === 'email' ? form.proprietaireEmail : form.proprietaireTelephone
        });
        toast.success('Chantier ajouté avec succès ✅');
        setShowCreateForm(false);
      }
      setForm({ id: null, nom: '', proprietaireEmail: '', proprietaireTelephone: '', proprietaireType: 'email' });
      setAddress('');
      setUseMap(true);
      fetchData();
    } catch (err) {
      toast.error('Erreur lors de la soumission ❌');
    }
  };

  const handleEdit = (chantier) => {
    setForm({
      id: chantier.id,
      nom: chantier.nom || '',
      proprietaireEmail: chantier.proprietaireEmailOrTel || '',
      proprietaireTelephone: chantier.proprietaireEmailOrTel || ''
    });
    setShowEditForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce chantier ?')) {
      try {
        await deleteChantier(id);
        toast.success('Chantier supprimé 🗑️');
        fetchData();
      } catch (err) {
        toast.error('Erreur lors de la suppression ❌');
      }
    }
  };

  const handleMapClick = useCallback((e) => {
    const newLocation = [e.latlng.lat, e.latlng.lng];
    setSelectedLocation(newLocation);
    // Ici on pourrait faire un reverse geocoding pour obtenir l'adresse
    setAddress(`Lat: ${newLocation[0].toFixed(6)}, Lng: ${newLocation[1].toFixed(6)}`);
  }, []);

  const handleFormSubmit = useCallback(() => {
    handleSubmit();
  }, [form, selectedLocation, useMap, address]);

  const handleFormClose = useCallback(() => {
    setShowCreateForm(false);
  }, []);

  const handleViewProprietaire = useCallback(async (proprietaireEmailOrTel) => {
    try {
      // Rechercher le client par email ou téléphone
      const response = await fetch(`/api/chef-projet/clients?search=${encodeURIComponent(proprietaireEmailOrTel)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('firebaseToken') || localStorage.getItem('authToken') || localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const client = data.users?.find(user => 
          user.email === proprietaireEmailOrTel || user.telephone === proprietaireEmailOrTel
        );
        
        if (client) {
          // Afficher les informations du client dans un modal
          const clientInfo = `
            👤 Informations du Client:
            
            Nom: ${client.prenom} ${client.nom}
            Email: ${client.email}
            Téléphone: ${client.telephone}
            Adresse: ${client.adresse || 'Non renseignée'}
            Rôle: ${client.role}
          `;
          alert(clientInfo);
        } else {
          toast.error('Client non trouvé dans la base de données');
        }
      } else {
        toast.error('Erreur lors de la recherche du client');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la consultation du propriétaire');
    }
  }, []);

  const EditChantierForm = () => (
    <div className="modal-form">
      <form className="chantier-form" onSubmit={handleSubmit}>
        <input placeholder="Nom" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} required />
        <input placeholder="Email ou téléphone du client" value={form.proprietaireEmail} onChange={(e) => setForm({ ...form, proprietaireEmail: e.target.value })} required />
        <button type="submit">Modifier</button>
        <button type="button" onClick={() => setShowEditForm(false)}>Annuler</button>
      </form>
    </div>
  );

  return (
    <div className="chantiers-container">
      <h3>Gestion des chantiers</h3>

      <div className="header-actions">
        <button className="btn-ajouter" onClick={() => {
          setShowCreateForm(true);
          setForm({ id: null, nom: '', proprietaireEmail: '', proprietaireTelephone: '', proprietaireType: 'email' });
          setAddress('');
          setUseMap(true);
        }}>
          <FaPlus /> Ajouter un chantier
        </button>
      </div>

      {showCreateForm && (
        <ChantierForm
          form={form}
          setForm={setForm}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          address={address}
          setAddress={setAddress}
          useMap={useMap}
          setUseMap={setUseMap}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
        />
      )}
      {showEditForm && <EditChantierForm />}

      {loading ? (
        <div className="loader">
          <FaSpinner className="spin" size={30} />
          Chargement des chantiers...
        </div>
      ) : (
        <table className="chantiers-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Géolocalisation</th>
              <th>Propriétaire</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {chantiers.map((chantier) => (
              <tr key={chantier.id}>
                <td>{chantier.nom}</td>
                <td>{chantier.geolocalisation}</td>
                <td>{chantier.proprietaireEmailOrTel || 'Non défini'}</td>
                <td>
                  <button className="icon-btn" onClick={() => handleEdit(chantier)}><FaEdit /></button>
                  <button className="icon-btn" onClick={() => handleDelete(chantier.id)}><FaTrash /></button>
                   {chantier.proprietaireEmailOrTel && (
                     <button 
                       className="icon-btn view-proprietaire-btn" 
                       onClick={() => handleViewProprietaire(chantier.proprietaireEmailOrTel)}
                       title="Consulter le propriétaire"
                     >
                       <FaEye />
                     </button>
                   )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}