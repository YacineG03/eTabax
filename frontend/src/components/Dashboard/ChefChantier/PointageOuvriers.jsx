import React, { useEffect, useState } from 'react';
import chefChantierAPI from '../../../api/chefChantier';
import './PointageOuvriers.css';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaUserCheck, FaSpinner, FaToggleOn, FaToggleOff } from 'react-icons/fa';

export default function PointageOuvriers() {
  const [ouvriers, setOuvriers] = useState([]);
  const [pointages, setPointages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nom: '', prenom: '', sexe: '', age: '', telephone: '', adresse: ''
  });
  const [editId, setEditId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pointageToEdit, setPointageToEdit] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const ouvriersRes = await chefChantierAPI.getOuvriers();
      const pointagesRes = await chefChantierAPI.getPointages();
      setOuvriers(ouvriersRes.ouvriers || []);
      setPointages(pointagesRes.pointages || []);
    } catch (e) {
      toast.error("Erreur lors du chargement des données ❌");
      setOuvriers([]);
      setPointages([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await chefChantierAPI.updateOuvrier(editId, form);
        toast.success("Ouvrier modifié avec succès ✏️");
      } else {
        await chefChantierAPI.createOuvrier(form);
        toast.success("Ouvrier ajouté avec succès ✅");
      }
      setForm({ nom: '', prenom: '', sexe: '', age: '', telephone: '', adresse: '' });
      setEditId(null);
      setShowForm(false);
      fetchData();
    } catch (err) {
      toast.error("Erreur lors de la soumission ❌");
    }
  };

  const handleEdit = (ouvrier) => {
    setForm({
      nom: ouvrier.nom || '',
      prenom: ouvrier.prenom || '',
      sexe: ouvrier.sexe || '',
      age: ouvrier.age || '',
      telephone: ouvrier.telephone || '',
      adresse: ouvrier.adresse || ''
    });
    setEditId(ouvrier.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await chefChantierAPI.deleteOuvrier(id);
      toast.success("Ouvrier supprimé 🗑️");
      fetchData();
    } catch (err) {
      toast.error("Erreur lors de la suppression ❌");
    }
  };

  const handlePointer = async (ouvrierId, present) => {
    try {
      await chefChantierAPI.pointerOuvrier({ ouvrierId, present });
      toast.success(`Ouvrier marqué comme ${present ? 'présent' : 'absent'} 👷`);
      fetchData();
    } catch (err) {
      toast.error("Erreur de pointage ❌");
    }
  };

  const timestampToDate = (timestamp) => {
    if (!timestamp) return null;
    if (typeof timestamp.toDate === 'function') return timestamp.toDate();
    if (timestamp._seconds !== undefined) {
      return new Date(timestamp._seconds * 1000 + Math.floor(timestamp._nanoseconds / 1000000));
    }
    return null;
  };

  const getPointageDuJour = (ouvrierId) => {
    const today = new Date().toISOString().slice(0, 10);
    return pointages.find((p) => {
        const pointageDate = timestampToDate(p.date);
        if (!pointageDate) return false;
        const pointageDay = pointageDate.toISOString().slice(0, 10);
        return p.ouvrierId === ouvrierId && pointageDay === today;
    });
 };


  const handleTogglePointage = async (pointage) => {
    try {
      await chefChantierAPI.updatePointage(pointage.id, { present: !pointage.present });
      toast.success(`Pointage mis à jour : ${!pointage.present ? 'Présent' : 'Absent'}`);
      fetchData();
    } catch (err) {
      toast.error("Erreur lors de la mise à jour du pointage ❌");
    }
  };

  return (
    <div className="pointage-container">
      <h3>Gestion des ouvriers</h3>

      <div className="header-actions">
        <button className="btn-ajouter" onClick={() => {
          setShowForm(true);
          setEditId(null);
          setForm({ nom: '', prenom: '', sexe: '', age: '', telephone: '', adresse: '' });
        }}>
          + Ajouter un ouvrier
        </button>
      </div>

      {showForm && (
        <div className="modal-form">
          <form className="ouvrier-form" onSubmit={handleSubmit}>
            <input placeholder="Nom" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required />
            <input placeholder="Prénom" value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} required />
            <select value={form.sexe} onChange={e => setForm({ ...form, sexe: e.target.value })} required>
              <option value="">Sexe</option>
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
            </select>
            <input type="number" placeholder="Âge" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} required min="16" />
            <input placeholder="Téléphone" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} required />
            <input placeholder="Adresse" value={form.adresse} onChange={e => setForm({ ...form, adresse: e.target.value })} required />
            <button type="submit">{editId ? 'Modifier' : 'Ajouter'}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditId(null); }}>Annuler</button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loader">
          <FaSpinner className="spin" size={30} />
          Chargement des ouvriers...
        </div>
      ) : (
        <>
          <table className="ouvriers-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Sexe</th>
                <th>Âge</th>
                <th>Téléphone</th>
                <th>Adresse</th>
                <th>Actions</th>
                <th>Pointage</th>
              </tr>
            </thead>
            <tbody>
              {ouvriers.map((o) => (
                <tr key={o.id}>
                  <td>{o.nom}</td>
                  <td>{o.prenom}</td>
                  <td>{o.sexe}</td>
                  <td>{o.age}</td>
                  <td>{o.telephone}</td>
                  <td>{o.adresse}</td>
                  <td>
                    <button className="icon-btn" onClick={() => handleEdit(o)}><FaEdit /></button>
                    <button className="icon-btn" onClick={() => handleDelete(o.id)}><FaTrash /></button>
                  </td>
                  <td>
                    {(() => {
                      const pointage = getPointageDuJour(o.id);
                      if (pointage) {
                        return (
                          <div className="pointage-switch" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {pointage.present ? (
                              <>
                                <FaToggleOn
                                  className="toggle-icon toggle-on"
                                  onClick={() => handleTogglePointage(pointage)}
                                  title="Marquer comme absent"
                                  style={{ cursor: 'pointer', color: 'green', fontSize: '1.5rem' }}
                                />
                                <span>Présent</span>
                              </>
                            ) : (
                              <>
                                <FaToggleOff
                                  className="toggle-icon toggle-off"
                                  onClick={() => handleTogglePointage(pointage)}
                                  title="Marquer comme présent"
                                  style={{ cursor: 'pointer', color: '#8d0512', fontSize: '1.5rem' }}
                                />
                                <span>Absent</span>
                              </>
                            )}
                          </div>
                        );
                      } else {
                        return (
                          <div className="pointage-actions">
                            <button className="btn-present" onClick={() => handlePointer(o.id, true)}>Présent</button>
                            <button className="btn-absent" onClick={() => handlePointer(o.id, false)}>Absent</button>
                          </div>
                        );
                      }
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showConfirm && pointageToEdit && (
            <div className="modal-form">
              <div className="confirm-box">
                <p>
                  Le pointage actuel est :{' '}
                  <strong style={{ color: pointageToEdit.present ? '#155724' : '#721c24' }}>
                    {pointageToEdit.present ? 'Présent' : 'Absent'}
                  </strong>
                </p>
                <p>Voulez-vous le modifier ?</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
