# MarketPlace - Mini LeBonCoin

Une marketplace de services complète construite avec Next.js 14 et Express.js.

## Stack Technique

### Frontend
- **Next.js 14** avec App Router
- **TypeScript**
- **Tailwind CSS**
- **Socket.io Client** pour le chat en temps réel

### Backend
- **Express.js** avec TypeScript
- **MongoDB Atlas** avec Mongoose
- **JWT** pour l'authentification
- **Cloudinary** pour le stockage d'images
- **Socket.io** pour le temps réel

## Fonctionnalités

- Authentification (inscription, connexion, JWT)
- Gestion des services (CRUD complet)
- Système de favoris
- Messagerie en temps réel
- Système de reviews/avis
- Gestion des tâches/missions
- Panel d'administration
- Upload d'images via Cloudinary

## Installation

### Backend
```bash
cd Back
npm install
cp .env.example .env  # Configurer les variables d'environnement
npm run dev
```

### Frontend
```bash
cd Front/servibe-nextjs
npm install
cp .env.example .env.local  # Configurer les variables d'environnement
npm run dev
```

## Variables d'Environnement

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## Structure du Projet

```
├── Back/                   # API Express.js
│   ├── src/
│   │   ├── controllers/    # Logique métier
│   │   ├── models/         # Modèles Mongoose
│   │   ├── routes/         # Routes API
│   │   ├── middlewares/    # Auth, upload, etc.
│   │   └── config/         # Configuration
│   └── package.json
│
└── Front/                  # Application Next.js
    └── servibe-nextjs/
        ├── src/
        │   ├── app/        # Routes App Router
        │   ├── components/ # Composants React
        │   ├── lib/        # Utilitaires
        │   └── types/      # Types TypeScript
        └── package.json
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur

### Services
- `GET /api/services` - Liste des services
- `POST /api/services` - Créer un service
- `GET /api/services/:id` - Détail d'un service
- `PUT /api/services/:id` - Modifier un service
- `DELETE /api/services/:id` - Supprimer un service

### Favoris
- `GET /api/favorites` - Mes favoris
- `POST /api/favorites` - Ajouter aux favoris
- `DELETE /api/favorites/:id` - Retirer des favoris

### Messages
- `GET /api/conversations` - Mes conversations
- `POST /api/messages` - Envoyer un message

### Reviews
- `GET /api/reviews/service/:id` - Avis d'un service
- `POST /api/reviews` - Créer un avis

## Licence

MIT
