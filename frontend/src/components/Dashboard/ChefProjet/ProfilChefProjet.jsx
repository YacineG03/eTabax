import React, { useState } from 'react';

const ProfilChefProjet = ({ user }) => {
  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    telephone: user?.telephone || '',
    adresse: user?.adresse || '',
    email: user?.email || '',
    cv: user?.cv || '',
    clientsAides: user?.clientsAides || 0,
    anneesExperience: user?.anneesExperience || 0,
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique pour envoyer les données au backend (PUT /chef-de-projet/profil)
    console.log('Profil mis à jour :', formData);
  };

  return (
    <div>
      <h2>Gérer le profil</h2>
      <form onSubmit={handleSubmit}>
        <input name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom" />
        <input name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Prénom" />
        <input name="telephone" value={formData.telephone} onChange={handleChange} placeholder="Téléphone" />
        <input name="adresse" value={formData.adresse} onChange={handleChange} placeholder="Adresse" />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
        <textarea name="cv" value={formData.cv} onChange={handleChange} placeholder="CV/Résumé" />
        <input name="clientsAides" type="number" value={formData.clientsAides} onChange={handleChange} placeholder="Clients aidés" />
        <input name="anneesExperience" type="number" value={formData.anneesExperience} onChange={handleChange} placeholder="Années d'expérience" />
        <button type="submit">Sauvegarder</button>
      </form>
    </div>
  );
};

export default ProfilChefProjet;