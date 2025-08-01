import React, { useState } from 'react';

const CommandeChefProjet = ({ user }) => {
  const [formData, setFormData] = useState({ clientId: '', produits: [], total: 0 });
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique pour envoyer les données au backend (POST /chef-de-projet/magasin/commande)
    console.log('Commande créée :', formData);
  };

  return (
    <div>
      <h2>Passer une commande</h2>
      <form onSubmit={handleSubmit}>
        <input name="clientId" value={formData.clientId} onChange={(e) => setFormData({ ...formData, clientId: e.target.value })} placeholder="ID du client" />
        {/* Ajouter logique pour sélectionner produits et calculer total */}
        <button type="submit">Soumettre</button>
      </form>
    </div>
  );
};

export default CommandeChefProjet;