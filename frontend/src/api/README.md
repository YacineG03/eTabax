# API Frontend - E-TABAX

Architecture API pour l'intégration avec le backend Node.js + Firebase.

## 📁 Structure

```
src/api/
├── config.js          # Configuration de base et utilitaires
├── auth.js            # API d'authentification
├── index.js           # Export centralisé
└── README.md          # Documentation
```

## 🔧 Configuration

### `config.js`
- **URL de base** : `http://localhost:5000/api` (développement)
- **Headers automatiques** : Content-Type, Authorization (JWT)
- **Gestion d'erreurs** : Centralisée avec messages d'erreur
- **Méthodes HTTP** : GET, POST, PUT, DELETE

### Variables d'environnement
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🔐 Authentification

### `auth.js`
Service complet d'authentification avec :

#### Fonctions principales
- `register(userData)` - Inscription
- `login(credentials)` - Connexion
- `getProfile()` - Récupérer le profil
- `logout()` - Déconnexion

#### Fonctions utilitaires
- `isAuthenticated()` - Vérifier si connecté
- `getCurrentUser()` - Récupérer l'utilisateur actuel
- `updateUserData(data)` - Mettre à jour les données
- `clearAuth()` - Nettoyer l'authentification

#### Gestion du localStorage
- **Token JWT** : `authToken`
- **Données utilisateur** : `user`

## 📝 Utilisation

### Import
```javascript
import api from '../api';
// ou
import authAPI from '../api/auth';
```

### Exemples d'utilisation

#### Inscription
```javascript
const userData = {
  nom: 'Dupont',
  prenom: 'Jean',
  telephone: '0123456789',
  adresse: '123 Rue de la Paix',
  email: 'jean@email.com',
  motDePasse: 'MotDePasse123',
  confirmerMotDePasse: 'MotDePasse123'
};

try {
  const response = await authAPI.register(userData);
  if (response.success) {
    // Redirection vers la page d'accueil
    onNavigate('home');
  }
} catch (error) {
  setError(error.message);
}
```

#### Connexion
```javascript
const credentials = {
  email: 'jean@email.com',
  motDePasse: 'MotDePasse123'
};

try {
  const response = await authAPI.login(credentials);
  if (response.success) {
    // Redirection vers la page d'accueil
    onNavigate('home');
  }
} catch (error) {
  setError(error.message);
}
```

#### Vérifier l'authentification
```javascript
if (authAPI.isAuthenticated()) {
  const user = authAPI.getCurrentUser();
  console.log('Utilisateur connecté:', user);
}
```

#### Déconnexion
```javascript
try {
  await authAPI.logout();
  // Redirection vers la page de connexion
  onNavigate('login');
} catch (error) {
  // Forcer la déconnexion
  authAPI.clearAuth();
  onNavigate('login');
}
```

## 🔄 Intégration avec les composants

### Login.jsx
```javascript
import authAPI from '../../api/auth';

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const response = await authAPI.login(formData);
    if (response.success) {
      onNavigate('home');
    }
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

### Register.jsx
```javascript
import authAPI from '../../api/auth';

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const response = await authAPI.register(formData);
    if (response.success) {
      onNavigate('home');
    }
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

### App.js
```javascript
import authAPI from './api/auth';

useEffect(() => {
  if (authAPI.isAuthenticated()) {
    const user = authAPI.getCurrentUser();
    setUser(user);
    setCurrentPage('home');
  }
  setLoading(false);
}, []);
```

## 🛡️ Sécurité

### Gestion des tokens
- **Stockage** : localStorage (pour la simplicité)
- **Expiration** : 24h côté serveur
- **Nettoyage** : Automatique lors de la déconnexion

### Validation
- **Côté client** : Validation des formulaires
- **Côté serveur** : Validation complète avec express-validator

### Gestion d'erreurs
- **Messages d'erreur** : Affichage utilisateur
- **Logs** : Console pour le débogage
- **Fallback** : Gestion des erreurs réseau

## 🚀 Extension

### Ajouter une nouvelle API
1. Créer un nouveau fichier (ex: `user.js`)
2. Importer `config.js`
3. Exporter les fonctions
4. Ajouter dans `index.js`

```javascript
// user.js
import api from './config';

const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  // ...
};

export default userAPI;

// index.js
import userAPI from './user';

const api = {
  auth: authAPI,
  user: userAPI,
  // ...
};
```

## 🔍 Débogage

### Console
```javascript
// Vérifier l'état de l'authentification
console.log('Authentifié:', authAPI.isAuthenticated());
console.log('Utilisateur:', authAPI.getCurrentUser());

// Vérifier le token
console.log('Token:', localStorage.getItem('authToken'));
```

### Network (DevTools)
- Vérifier les requêtes vers `/api/auth/*`
- Contrôler les headers Authorization
- Vérifier les réponses du serveur

## 📋 Checklist

- [x] Configuration API de base
- [x] Service d'authentification
- [x] Gestion des tokens JWT
- [x] Intégration avec les composants
- [x] Gestion d'erreurs
- [x] Messages d'erreur utilisateur
- [x] États de chargement
- [x] Validation côté client
- [x] Documentation 