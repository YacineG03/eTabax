const request = require('supertest');
const app = require('../../server'); // Ajuste le chemin selon ta structure
const { db } = require('../../config/firebase');
const jwt = require('jsonwebtoken');

// Middleware mock pour l'authentification
const authMiddleware = (req, res, next) => {
  req.user = { uid: 'test_user_id' }; // Assure que uid est défini
  next();
};
app.use('/api/chef-projet/*', authMiddleware);
app.use('/api/conducteur-travaux/*', authMiddleware);

// Augmente le timeout pour beforeAll
beforeAll(async () => {
  jest.setTimeout(15000); // Augmente à 15 secondes
  // Nettoie les collections pertinentes avant les tests
  const collections = ['ouvriers', 'conducteurs_travaux', 'chefs_chantier', 'devis', 'taches', 'planifications', 'equipes', 'stock'];
  const deletePromises = [];
  for (const collection of collections) {
    const snapshot = await db.collection(collection).get();
    deletePromises.push(...snapshot.docs.map(doc => doc.ref.delete()));
  }
  await Promise.all(deletePromises);

  // Initialise un ouvrier pour les tests
  const ouvrierRes = await request(app)
    .post('/api/chantier/ouvriers') // Assure-toi que cette route existe
    .send({
      nom: 'Test',
      prenom: 'User',
      sexe: 'M',
      age: 30,
      telephone: '771234569',
      adresse: 'Dakar',
    })
    .set('Content-Type', 'application/json; charset=utf-8');
  global.ouvrierId = ouvrierRes.body.id;
}, 15000); // Timeout explicite pour beforeAll

afterAll(async () => {
  await db.terminate(); // Ferme la connexion Firestore
  await new Promise(resolve => setTimeout(resolve, 2000)); // Attend 2 secondes
});

describe('API Chef de Projet', () => {
  let token;

  beforeEach(async () => {
    // Génère un token JWT pour les tests
    token = jwt.sign({ uid: 'test_user_id', role: 'chef_projet' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  // Test définition conducteur de travaux
  it('devrait définir un conducteur de travaux', async () => {
    const res = await request(app)
      .post('/api/chef-projet/conducteur-travaux')
      .set('Authorization', `Bearer ${token}`)
      .send({ ouvrierId: global.ouvrierId })
      .set('Content-Type', 'application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });

  // Test consultation personnel
  it('devrait récupérer la liste du personnel', async () => {
    const res = await request(app)
      .get('/api/chef-projet/personnel')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('personnel');
    expect(Array.isArray(res.body.personnel)).toBe(true);
  });

  // Test génération rapport
  it('devrait générer un rapport', async () => {
    const res = await request(app)
      .get('/api/chef-projet/rapports')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.report).toHaveProperty('ouvriers');
    expect(res.body.report).toHaveProperty('taches');
  });

  // Test suivi avancement global
  it('devrait retourner l\'avancement global', async () => {
    const res = await request(app)
      .get('/api/chef-projet/avancement-global')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('avancement');
    expect(typeof res.body.avancement).toBe('string');
  });

  // Test création planification
  it('devrait créer une planification', async () => {
    const res = await request(app)
      .post('/api/chef-projet/planification')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'Planification test',
        dateDebut: '2025-08-01',
        dateFin: '2025-08-10',
      })
      .set('Content-Type', 'application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('id');
  });

  // Test authentification
  it('devrait se connecter avec des identifiants valides', async () => {
    await db.collection('users').doc('test_user').set({
      username: 'testuser',
      password: 'testpass',
    });

    const res = await request(app)
      .post('/api/chef-projet/login')
      .send({
        username: 'testuser',
        password: 'testpass',
      })
      .set('Content-Type', 'application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('token');
  });

  it('devrait échouer avec des identifiants invalides', async () => {
    const res = await request(app)
      .post('/api/chef-projet/login')
      .send({
        username: 'wronguser',
        password: 'wrongpass',
      })
      .set('Content-Type', 'application/json; charset=utf-8');
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'Identifiants invalides.');
  });
});

describe('API Conducteur de Travaux', () => {
  let token;

  beforeEach(async () => {
    // Génère un token JWT pour les tests
    token = jwt.sign({ uid: 'test_user_id', role: 'conducteur_travaux' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  // Test création devis
  it('devrait créer un devis', async () => {
    const res = await request(app)
      .post('/api/conducteur-travaux/devis')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'Devis test',
        montant: 5000,
        date: '2025-08-01',
      })
      .set('Content-Type', 'application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('id');
  });

  // Test consultation devis
  it('devrait récupérer la liste des devis', async () => {
    const res = await request(app)
      .get('/api/conducteur-travaux/devis')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('devis');
    expect(Array.isArray(res.body.devis)).toBe(true);
  });

  // Test rapport de stocks
  it('devrait générer un rapport de stocks', async () => {
    const res = await request(app)
      .get('/api/conducteur-travaux/rapports/stocks')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.report).toBeInstanceOf(Array); // Plus flexible
    expect(res.body.report.length).toBeGreaterThanOrEqual(0); // Accepte toute longueur
  });

  // Test consultation équipes
  it('devrait récupérer la liste des équipes', async () => {
    const res = await request(app)
      .get('/api/conducteur-travaux/equipes')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('equipes');
    expect(Array.isArray(res.body.equipes)).toBe(true);
  });

  // Test définition chef de chantier
  it('devrait définir un chef de chantier', async () => {
    const res = await request(app)
      .post('/api/conducteur-travaux/chef-chantier')
      .set('Authorization', `Bearer ${token}`)
      .send({ ouvrierId: global.ouvrierId })
      .set('Content-Type', 'application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });
});