# API de Gestion de Tâches avec WebSocket

Une API RESTful avec WebSocket pour la gestion de tâches en temps réel.

## Fonctionnalités

### 1. Authentification et Gestion des Utilisateurs
- Inscription de nouveaux utilisateurs
- Connexion des utilisateurs
- Récupération du profil utilisateur
- Protection des routes avec JWT

### 2. Gestion des Tâches (CRUD)
- Création de tâches avec :
  - Titre
  - Description
  - Statut (en_cours, termine, annule)
  - Date d'échéance
  - Assignation à un utilisateur
- Lecture des tâches (liste et détails)
- Mise à jour des tâches
- Suppression des tâches

### 3. Notifications en Temps Réel
- Notifications instantanées via WebSocket pour :
  - Création de tâches
  - Mise à jour de tâches
  - Suppression de tâches

### 4. Sécurité
- Authentification JWT
- Gestion des permissions
- Protection CORS
- Validation des données

### 5. Documentation API
- Documentation Swagger interactive
- Description détaillée des endpoints
- Tests d'API intégrés
- Exemples de requêtes et réponses

## Prérequis

- Node.js (v14 ou supérieur)
- MongoDB (local ou Atlas)
- npm ou yarn

## Installation

1. Cloner le dépôt :
```bash
git clone https://github.com/amelbenhazem/task-ws-api.git
cd task-ws-api
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer les variables d'environnement :
- Copier le fichier `.env.example` en `.env`
- Modifier les valeurs selon votre configuration :
  ```
  PORT=5000
  MONGODB_URI=votre_uri_mongodb
  JWT_SECRET=votre_secret_jwt
  ```

## Exécution du Projet

### Mode Développement
```bash
npm run dev
```
Le serveur démarrera sur `http://localhost:5000`

### Mode Production
```bash
npm start
```

## Documentation API

Accédez à la documentation Swagger à l'adresse :
```
http://localhost:5000/api-docs
```

## Endpoints API

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur

### Tâches
- `POST /api/tasks` - Créer une tâche
- `GET /api/tasks` - Lister toutes les tâches
- `GET /api/tasks/:id` - Obtenir une tâche
- `PUT /api/tasks/:id` - Mettre à jour une tâche
- `DELETE /api/tasks/:id` - Supprimer une tâche

## WebSocket Events

- `task:created` - Nouvelle tâche créée
- `task:updated` - Tâche mise à jour
- `task:deleted` - Tâche supprimée

## Exemple d'Utilisation

1. **Inscription d'un utilisateur**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

2. **Connexion**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

3. **Création d'une tâche**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <votre_token>" \
  -d '{"title":"Ma première tâche","description":"Description","status":"en_cours"}'
```

## Structure du Projet

```
src/
├── config/         # Configuration (Swagger, etc.)
├── controllers/    # Contrôleurs pour la logique métier
├── middleware/     # Middleware (auth, etc.)
├── models/         # Modèles Mongoose
├── routes/         # Routes API
├── sockets/        # Configuration WebSocket
└── server.js       # Point d'entrée de l'application
```

## Tests

Pour exécuter les tests :
```bash
npm test
```

## Licence

ISC