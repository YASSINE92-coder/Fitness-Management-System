**Répartition des tâches Backend – Fitness Platform (4 Développeurs, sans E-commerce)**
🎯 Développeur 1 : Authentification & Gestion des Utilisateurs

Responsabilités :

Mise en place de l’authentification JWT (login / signup / logout).

Gestion des rôles : Athlète, Coach, Gym, Admin.

Middleware sécurité (routes protégées par rôle).

Gestion du profil utilisateur (CRUD).

Sécurité : hashage mots de passe (bcrypt), validation des données (express-validator/Joi).

Livrables :

API Auth :

POST /auth/register

POST /auth/login

POST /auth/logout

API Users :

GET /users/:id

PATCH /users/:id

DELETE /users/:id

Middleware d’autorisation (role-based).

🎯 Développeur 2 : Gestion des Gyms & Coachs

Responsabilités :

CRUD Gyms (profil complet : localisation, horaires, équipements, tarifs).

CRUD Coachs (profil, spécialités, certifications).

Association Coach ↔ Gym (un coach peut être attaché à une salle ou freelance).

Recherche & filtres (par localisation, équipements, tarifs).

Endpoints pour que l’athlète consulte la liste des gyms & coachs.

Livrables :

API Gyms :

POST /gyms

GET /gyms (avec filtres)

GET /gyms/:id

PATCH /gyms/:id

DELETE /gyms/:id

API Coachs :

POST /coaches

GET /coaches (filtrage spécialités/gym)

GET /coaches/:id

PATCH /coaches/:id

DELETE /coaches/:id

Endpoint rattachement coach → gym :

PATCH /coaches/:id/gym.

🎯 Développeur 3 : Programmes sportifs & Relation Athlète ↔ Coach

Responsabilités :

CRUD Programmes sportifs (créés par les coachs).

Consultation et achat de programmes (par athlètes).

Historique des programmes achetés.

(Extension future) suivi personnalisé entre coach et athlète (progression, feedback).

Livrables :

API Programmes :

POST /programs

GET /programs

GET /programs/:id

PATCH /programs/:id

DELETE /programs/:id

API Achat programmes :

POST /athletes/:id/programs/:programId/purchase

Historique programmes achetés :

GET /athletes/:id/programs.

🎯 Développeur 4 : Administration & Supervision

Responsabilités :

Mise en place du Dashboard Admin (backend only).

Gestion des utilisateurs (activer / désactiver comptes).

Validation des coachs et gyms avant publication.

Supervision des programmes (contenu validé par admin).

Supervision des transactions (achats programmes).

Logs & monitoring basique.

Livrables :

API Admin :

GET /admin/users

PATCH /admin/users/:id/status (activer/désactiver)

PATCH /admin/coaches/:id/status (valider/rejeter)

PATCH /admin/gyms/:id/status (valider/rejeter)

PATCH /admin/programs/:id/status (valider/rejeter)

API supervision des transactions :

GET /admin/transactions.

🔄 Organisation du travail (sans E-commerce)
Phase 1 – MVP

Dév 1 → Auth & Users.

Dév 2 → Gyms & Coachs (CRUD + association).

Dév 3 → Programmes (CRUD).

Dév 4 → Admin (validation users, gyms, coachs).

Phase 2 – Paiements & rattachements

Dév 3 → Gestion achat programmes.

Dév 4 → Supervision des transactions.

Phase 3 – Extensions futures

Suivi personnalisé entre athlète et coach (Dév 3).

Abonnements récurrents (Dév 4 + Dév 1).

Réseau social interne (Dév 2 + Dév 1).

## Seeding the database

A small seeder is provided at `seeds/seed.js` to create sample documents for development.

Requirements:
- A running MongoDB instance and `DATABASE_URL` set in your `.env` (for example: `mongodb://localhost:27017/fitness-dev`).

Run the seeder with:

```
npm run seed
```

The script clears certain collections and inserts sample users (coach + user), programs, a post, a gym and equipments.
