const request = require('supertest');
const app = require('../../server'); // Ajuste le chemin selon ta structure
const { db } = require('../../config/firebase');

// Augmente le timeout pour beforeAll
beforeAll(async () => {
  jest.setTimeout(15000); // Augmente à 15 secondes
  // Nettoie et initialise les données avant tous les tests
  const collections = ['ouvriers', 'pointages', 'stock'];
  const deletePromises = [];
  for (const collection of collections) {
    const snapshot = await db.collection(collection).get();
    deletePromises.push(...snapshot.docs.map(doc => doc.ref.delete()));
  }
  await Promise.all(deletePromises);

  // Initialise un ouvrier pour les tests de pointage
  let ouvrierRes;
  try {
    ouvrierRes = await request(app)
      .post('/api/chantier/ouvriers')
      .send({
        nom: 'Test',
        prenom: 'Pointage',
        sexe: 'M',
        age: 25,
        telephone: '771234568',
        adresse: 'Dakar',
      })
      .set('Content-Type', 'application/json; charset=utf-8');
    global.ouvrierId = ouvrierRes.body.id;
  } catch (error) {
    console.error('Erreur initialisation ouvrier:', error);
    throw new Error('Échec de l\'initialisation de l\'ouvrier');
  }

  // Initialise un stock pour les tests
  let stockRes;
  try {
    stockRes = await request(app)
      .put('/api/chantier/stock/test_stock')
      .send({
        quantite: 10,
        seuil: 20,
      })
      .set('Content-Type', 'application/json; charset=utf-8');
    global.stockId = 'test_stock';
  } catch (error) {
    console.error('Erreur initialisation stock:', error);
    throw new Error('Échec de l\'initialisation du stock');
  }
}, 15000); // Timeout explicite pour beforeAll

afterAll(async () => {
  await db.terminate(); // Ferme la connexion Firestore
  await new Promise(resolve => setTimeout(resolve, 2000)); // Attend 2 secondes
});

describe('API Chef de Chantier', () => {
  // Test CRUD Ouvriers
  describe('Ouvriers', () => {
    it('devrait créer un ouvrier', async () => {
      const res = await request(app)
        .post('/api/chantier/ouvriers')
        .send({
          nom: 'Diouf',
          prenom: 'Moussa',
          sexe: 'M',
          age: 30,
          telephone: '771234567',
          adresse: 'Dakar, Senegal',
        })
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json; charset=utf-8');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('id');
    });

    it('devrait récupérer la liste des ouvriers', async () => {
      const res = await request(app)
        .get('/api/chantier/ouvriers')
        .set('Accept', 'application/json');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('ouvriers');
      expect(Array.isArray(res.body.ouvriers)).toBe(true);
    });
  });

  // Test Pointage
  describe('Pointage', () => {
    it('devrait enregistrer un pointage', async () => {
      const res = await request(app)
        .post('/api/chantier/pointage')
        .send({
          ouvrierId: global.ouvrierId,
          present: true,
        })
        .set('Content-Type', 'application/json; charset=utf-8');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
    });
  });

  // Test Météo
  describe('Météo', () => {
    it('devrait récupérer les données météo', async () => {
      const res = await request(app)
        .get('/api/chantier/meteo?ville=Dakar')
        .set('Accept', 'application/json');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('weather');
    });
  });

  // Test Stock
  describe('Stock', () => {
    it('devrait mettre à jour un stock', async () => {
      const res = await request(app)
        .put(`/api/chantier/stock/${global.stockId}`)
        .send({
          quantite: 5,
          seuil: 20,
        })
        .set('Content-Type', 'application/json; charset=utf-8');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
    });

    it('devrait détecter une alerte de stock', async () => {
      const res = await request(app)
        .get('/api/chantier/stock/alertes')
        .set('Accept', 'application/json');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('alertes');
      expect(Array.isArray(res.body.alertes)).toBe(true);
    });
  });

  // Test Rapport Journalier
  describe('Rapport Journalier', () => {
    it('devrait générer un rapport', async () => {
      jest.setTimeout(20000); // Augmente le timeout à 20 secondes pour ce test
      const res = await request(app)
        .get('/api/chantier/rapport/journalier')
        .set('Accept', 'application/json');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.report).toHaveProperty('ouvriers');
      expect(res.body.report).toHaveProperty('taches');
      expect(res.body.report).toHaveProperty('stock');
    }, 20000); // Timeout explicite pour ce test

    it('devrait envoyer un rapport par email', async () => {
      const res = await request(app)
        .post('/api/chantier/rapport/journalier/send')
        .send({
          method: 'email',
          recipient: 'yacinegueye2@esp.sn',
        })
        .set('Content-Type', 'application/json; charset=utf-8');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
    });
  });
});