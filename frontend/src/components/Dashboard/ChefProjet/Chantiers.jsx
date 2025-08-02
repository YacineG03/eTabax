import React, { useEffect, useState, useCallback } from 'react';
import { getChantiers, createChantier, updateChantier, deleteChantier, getClients, getClientById } from '../../../api/chefProjet';
import './Chantiers.css';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaSpinner, FaEye, FaTimes } from 'react-icons/fa';
import ChantierForm from './ChantierForm';
import apiClient from '../../../api/config';

export default function Chantiers({ user }) {
  const [chantiers, setChantiers] = useState([]);
  const [clients, setClients] = useState(new Map());
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
    proprietaireType: 'email'
  });
  const [showClientModal, setShowClientModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [chantiersData, clientsData] = await Promise.all([getChantiers(), getClients()]);
      const clientMap = new Map(clientsData.users.map(client => [client.id, client]));
      setClients(clientMap);

      const normalizedChantiers = (chantiersData.chantiers || []).map(chantier => ({
        ...chantier,
        geolocalisation: typeof chantier.geolocalisation === 'string'
          ? { address: chantier.geolocalisation }
          : (chantier.geolocalisation || { address: 'Non spécifié' }),
        proprietaireNom: clientMap.get(chantier.proprietaireId)?.prenom + ' ' + clientMap.get(chantier.proprietaireId)?.nom || 'Non défini'
      }));
      setChantiers(normalizedChantiers);
    } catch (e) {
      toast.error('Erreur lors du chargement des données ❌');
      setChantiers([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async () => {
    try {
      const geolocalisation = { address: address || 'Adresse non spécifiée' };
      const proprietaireEmailOrTel = form.proprietaireType === 'email' ? form.proprietaireEmail : form.proprietaireTelephone;
      const payload = {
        nom: form.nom,
        geolocalisation,
        proprietaireEmailOrTel
      };
      if (form.id) {
        await updateChantier(form.id, payload);
        toast.success('Chantier modifié avec succès ✏️');
        setShowEditForm(false);
      } else {
        await createChantier(payload);
        toast.success('Chantier ajouté avec succès ✅');
        setShowCreateForm(false);
      }
      setForm({ id: null, nom: '', proprietaireEmail: '', proprietaireTelephone: '', proprietaireType: 'email' });
      setAddress('');
      setUseMap(true);
      fetchData();
    } catch (err) {
      console.error('Erreur lors de la soumission:', err);
      toast.error('Erreur lors de la soumission ❌: ' + err.message);
    }
  };

  const handleEdit = (chantier) => {
    const client = clients.get(chantier.proprietaireId);
    const proprietaireEmailOrTel = client ? (client.email || client.telephone || chantier.proprietaireEmailOrTel || '') : chantier.proprietaireEmailOrTel || '';
    setForm({
      id: chantier.id,
      nom: chantier.nom || '',
      proprietaireEmail: proprietaireEmailOrTel,
      proprietaireTelephone: proprietaireEmailOrTel,
      proprietaireType: proprietaireEmailOrTel.includes('@') ? 'email' : 'telephone'
    });
    setAddress(chantier.geolocalisation?.address || '');
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
    setAddress(`Lat: ${newLocation[0].toFixed(6)}, Lng: ${newLocation[1].toFixed(6)}`);
  }, []);

  const handleFormSubmit = useCallback(() => {
    handleSubmit();
  }, [form, selectedLocation, useMap, address]);

  const handleFormClose = useCallback(() => {
    setShowCreateForm(false);
  }, []);

  const handleViewProprietaire = useCallback(async (proprietaireId) => {
    try {
      const response = await getClientById(proprietaireId);
      console.log('🔍 Client récupéré:', response);

      const client = response?.client;
      if (client) {
        setSelectedClient(client);
        setShowClientModal(true);
      } else {
        toast.error('Client non trouvé dans la base de données');
      }
    } catch (error) {
      console.error('Erreur dans handleViewProprietaire:', error);
      toast.error('Erreur lors de la consultation du propriétaire: ' + error.message);
    }
  }, []);

  const EditChantierForm = () => (
    <div className="edit-modal-overlay">
      <div className="edit-modal">
        <div className="edit-modal-header">
          <h3>Modifier un chantier</h3>
          <button className="close-btn" onClick={() => setShowEditForm(false)}>
            <FaTimes />
          </button>
        </div>
        <div className="edit-modal-content">
          <form className="chantier-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div className="form-group">
              <label>Nom</label>
              <input placeholder="Nom" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Adresse</label>
              <input placeholder="Adresse" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Email ou téléphone du client</label>
              <input
                placeholder="Email ou téléphone"
                value={form.proprietaireEmail}
                disabled
                readOnly
              />
            </div>
            <button type="submit" className="create-btn">Modifier</button>
            <button type="button" className="modal-close-btn" onClick={() => setShowEditForm(false)}>Annuler</button>
          </form>
        </div>
      </div>
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
                <td>{chantier.nom || 'Non défini'}</td>
                <td>{chantier.geolocalisation?.address || 'Non spécifié'}</td>
                <td>
                  {chantier.proprietaireNom}
                  {chantier.proprietaireId && (
                    <button 
                      className="icon-btn view-proprietaire-btn" 
                      onClick={() => handleViewProprietaire(chantier.proprietaireId)}
                      title="Consulter le propriétaire"
                    >
                      <FaEye />
                    </button>
                  )}
                </td>
                <td>
                  <button className="icon-btn" onClick={() => handleEdit(chantier)}><FaEdit /></button>
                  <button className="icon-btn" onClick={() => handleDelete(chantier.id)}><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showClientModal && selectedClient && (
        <div className="client-modal-overlay">
          <div className="client-modal">
            <div className="client-modal-header">
              <h3>Informations du Client</h3>
              <button className="close-btn" onClick={() => setShowClientModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="client-modal-content">
              <p><strong>Nom :</strong> {selectedClient.prenom} {selectedClient.nom}</p>
              <p><strong>Email :</strong> {selectedClient.email || 'Non renseigné'}</p>
              <p><strong>Téléphone :</strong> {selectedClient.telephone || 'Non renseigné'}</p>
              <p><strong>Adresse :</strong> {selectedClient.adresse || 'Non renseignée'}</p>
              <p><strong>Rôle :</strong> {selectedClient.role}</p>
            </div>
            <button className="modal-close-btn" onClick={() => setShowClientModal(false)}>
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}