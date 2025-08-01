import React, { useState } from 'react';
import './Auth.css';
import logo from '../../assets/logo.png';
import planImage from '../../assets/plan.jpg';
import authAPI from '../../api/auth';
import { auth, GoogleAuthProvider, signInWithPopup } from '../../api/firebaseClient';

function Login({ onNavigate }) {
  const [formData, setFormData] = useState({
    email: '',
    motDePasse: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Effacer l'erreur quand l'utilisateur tape
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData);
      
      if (response.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setError(error.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

    // Connexion Google
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Appel backend pour login social (à créer côté backend)
      const response = await authAPI.loginWithSocial({
        email: user.email,
        nom: user.displayName?.split(' ').slice(-1)[0] || '',
        prenom: user.displayName?.split(' ')[0] || '',
        provider: 'google',
        uid: user.uid
      });

      if (response.success) {
        onNavigate('home');
      } else {
        setError(response.message || "Erreur lors de la connexion Google.");
      }
    } catch (error) {
      setError(error.message || "Erreur Google.");
    }
    setLoading(false);
  };

   // Connexion Apple
  const handleAppleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      // AppleAuthProvider nécessite une config Apple dans Firebase
      // import { OAuthProvider } from 'firebase/auth';
      // const provider = new OAuthProvider('apple.com');
      // const result = await signInWithPopup(auth, provider);
      // const user = result.user;
      // ... même logique que Google ...
      setError("Connexion Apple non configurée.");
    } catch (error) {
      setError(error.message || "Erreur Apple.");
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      {/* Section gauche - Formulaire */}
      <div className="form-section">
        <div className="form-content">
          {/* Logo et titre */}
          <div className="logo-section">
            <img src={logo} alt="E-TABAX Logo" className="logo" />
            <p className="tagline">TABAX SUNU REW</p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="motDePasse">Mot de passe</label>
              <input
                type="password"
                id="motDePasse"
                name="motDePasse"
                value={formData.motDePasse}
                onChange={handleInputChange}
                placeholder="••••••"
                required
              />
              <button type="button" className="forgot-password">Mot de passe oublié?</button>
            </div>

            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* Séparateur */}
          <div className="separator">
            <span>Ou</span>
          </div>

          {/* Boutons de connexion sociale */}
          <div className="social-buttons">
            <button className="social-button  google" onClick={handleGoogleLogin} type="button">              <svg className="social-icon" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Se connecter via Google
            </button>

            <button className="social-button apple" onClick={handleAppleLogin} type="button">
              <svg className="social-icon" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Se connecter via Apple
            </button>
          </div>

          {/* Lien d'inscription */}
          <div className="auth-link">
            <span>Vous n'avez pas de compte? </span>
            <button type="button" className="link" onClick={() => onNavigate('register')}>Inscrivez-vous</button>
          </div>
        </div>
      </div>

      {/* Section droite - Image */}
      <div className="image-section">
        <div className="plan-image-container">
          <img src={planImage} alt="Plan de construction" className="plan-image" />
        </div>
      </div>
    </div>
  );
}

export default Login;
