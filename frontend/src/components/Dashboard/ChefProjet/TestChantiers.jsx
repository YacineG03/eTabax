import React from 'react';
import Chantiers from './Chantiers';

export default function TestChantiers() {
  const user = {
    id: 'test-user',
    nom: 'Test',
    prenom: 'User',
    role: 'chef-projet'
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Interface Chantiers</h1>
      <p>Test de l'interface de gestion des chantiers pour le chef de projet</p>
      <Chantiers user={user} />
    </div>
  );
} 