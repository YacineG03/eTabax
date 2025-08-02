# E-TABAX Backend

Backend Node.js avec Firebase pour l'authentification E-TABAX.

## 🚀 Fonctionnalités

- ✅ **Inscription** avec validation des données
- ✅ **Connexion** avec vérification des identifiants
- ✅ **Authentification JWT** pour les routes protégées
- ✅ **Intégration Firebase** (Auth + Firestore)
- ✅ **Validation des données** avec express-validator
- ✅ **Hachage des mots de passe** avec bcrypt
- ✅ **Gestion d'erreurs** complète
- ✅ **CORS** configuré pour le frontend

## 📋 Prérequis

- Node.js (version 14 ou supérieure)
- npm ou yarn
- Projet Firebase configuré

## 🔧 Installation

1. **Cloner le projet**
```bash
cd backend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer Firebase**
   - Créez un projet Firebase sur [Firebase Console](https://console.firebase.google.com/)
   - Activez Authentication et Firestore
   - Téléchargez la clé de service (Service Account Key)
   - Copiez le fichier `env.example` vers `.env`

4. **Configurer les variables d'environnement**
```bash
cp env.example .env
```

5. **Remplir le fichier `.env`**
```env
# Firebase Configuration
FIREBASE_PROJECT_ID=votre-project-id
FIREBASE_PRIVATE_KEY_ID=votre-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nVotre Clé Privée Ici\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@votre-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=votre-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40votre-project.iam.gserviceaccount.com

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=votre-super-secret-jwt-key-ici
```

## 🏃‍♂️ Démarrage

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm start
```

Le serveur sera accessible sur : `http://localhost:5000`

## 📚 API Endpoints

### 🔐 Authentification

#### POST `/api/auth/register`
**Inscription d'un nouvel utilisateur**

**Body:**
```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "telephone": "0123456789",
  "adresse": "123 Rue de la Paix, 75001 Paris",
  "email": "jean.dupont@email.com",
  "motDePasse": "MotDePasse123",
  "confirmerMotDePasse": "MotDePasse123"
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Utilisateur créé avec succès",
  "data": {
    "uid": "firebase-uid",
    "email": "jean.dupont@email.com",
    "nom": "Dupont",
    "prenom": "Jean",
    "token": "jwt-token-here"
  }
}
```

#### POST `/api/auth/login`
**Connexion d'un utilisateur**

**Body:**
```json
{
  "email": "jean.dupont@email.com",
  "motDePasse": "MotDePasse123"
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "uid": "firebase-uid",
    "email": "jean.dupont@email.com",
    "nom": "Dupont",
    "prenom": "Jean",
    "token": "jwt-token-here"
  }
}
```

#### GET `/api/auth/profile`
**Récupérer le profil utilisateur** (Token requis)

**Headers:**
```
Authorization: Bearer jwt-token-here
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "nom": "Dupont",
    "prenom": "Jean",
    "telephone": "0123456789",
    "adresse": "123 Rue de la Paix, 75001 Paris",
    "email": "jean.dupont@email.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST `/api/auth/logout`
**Déconnexion** (Token requis)

**Headers:**
```
Authorization: Bearer jwt-token-here
```

**Réponse:**
```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

### 🏥 Santé du serveur

#### GET `/api/health`
**Vérifier l'état du serveur**

**Réponse:**
```json
{
  "success": true,
  "message": "E-TABAX Backend is running!",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

## 🔒 Validation des données

### Inscription
- **Nom/Prénom** : 2-50 caractères
- **Téléphone** : Format français (+33 ou 0)
- **Adresse** : 5-200 caractères
- **Email** : Format email valide
- **Mot de passe** : Min 6 caractères, 1 minuscule, 1 majuscule, 1 chiffre
- **Confirmation** : Doit correspondre au mot de passe

### Connexion
- **Email** : Format email valide
- **Mot de passe** : Requis

## 🛠️ Structure du projet

```
backend/
├── config/
│   └── firebase.js          # Configuration Firebase
├── controllers/
│   └── authController.js    # Contrôleurs d'authentification
├── middleware/
│   └── auth.js              # Middleware d'authentification
├── routes/
│   └── auth.js              # Routes d'authentification
├── .env                     # Variables d'environnement
├── env.example              # Exemple de variables d'environnement
├── package.json             # Dépendances et scripts
├── server.js                # Serveur principal
└── README.md                # Documentation
```

## 🔧 Configuration Firebase

1. **Créer un projet Firebase**
2. **Activer Authentication** (Email/Password)
3. **Activer Firestore Database**
4. **Créer une clé de service**
   - Project Settings > Service Accounts
   - Generate New Private Key
   - Télécharger le fichier JSON
5. **Copier les valeurs dans `.env`**

## 🚀 Déploiement

### Variables d'environnement de production
```env
NODE_ENV=production
PORT=5000
JWT_SECRET=votre-super-secret-jwt-key-production
# ... autres variables Firebase
```

### Scripts de déploiement
```bash
# Build
npm run build

# Start production
npm start
```

## 🐛 Dépannage

### Erreurs courantes

1. **Firebase non configuré**
   - Vérifiez le fichier `.env`
   - Vérifiez les clés Firebase

2. **CORS errors**
   - Vérifiez l'origine dans `server.js`
   - Ajoutez votre domaine frontend

3. **Validation errors**
   - Vérifiez le format des données envoyées
   - Consultez les messages d'erreur

## 📞 Support

Pour toute question ou problème, n'hésitez pas à ouvrir une issue sur le repository. 