Répartition des tâches Backend (4 Développeurs, sans E-commerce)

🎯 Développeur 1 : Authentification & Gestion des Utilisateurs

Responsabilités :

Authentification JWT (login / signup / logout).

Gestion des rôles : Athlète, Coach, Gym, Admin.

Middleware sécurité (routes protégées par rôle).

Gestion du profil utilisateur (CRUD).

Sécurité (hash mots de passe, validation des données).

Livrables :

API Auth (/auth/register, /auth/login, /auth/logout).

API Users (/users/:id → CRUD).

Middleware d’autorisation.

🎯 Développeur 2 : Gestion des Gyms & Coachs

Responsabilités :

CRUD gyms (profil complet : localisation, horaires, équipements, tarifs).

Association Coachs ↔ Gyms (un coach peut être attaché à une salle).

Gestion des coachs (profil, spécialités, certifications).

Recherche & filtres (par localisation, équipements, tarifs).

Endpoints pour que l’athlète consulte la liste des gyms & coachs.

Livrables :

API Gyms (/gyms) → CRUD.

API Coachs (/coaches) → CRUD + rattachement gym.

Endpoints recherche / filtrage.

🎯 Développeur 3 : Programmes sportifs & Relation Athlète ↔ Coach

Responsabilités :

CRUD programmes sportifs (créés par coachs).

Consultation et achat de programmes (par athlètes).

Historique programmes achetés.

(Extension future) suivi personnalisé : feedback, progression.

Livrables :

API Programmes (/programs) → CRUD.

API Achat Programmes (/athletes/:id/programs).

Endpoints historiques programmes.

🎯 Développeur 4 : Administration & Supervision

Responsabilités :

Dashboard Admin.

Gestion des utilisateurs (activer / désactiver comptes).

Validation des coachs et gyms avant publication.

Supervision des programmes (contenus validés).

Supervision des transactions (achats programmes).

Livrables :

API Admin (/admin/users, /admin/gyms, /admin/coaches, /admin/programs).

Endpoints pour modération / validation.

Gestion logs & monitoring basique.

🔄 Organisation de travail (sans E-commerce)

Phase 1 – MVP :

Dév 1 → Auth & Users.

Dév 2 → Gyms & Coachs.

Dév 3 → Programmes (CRUD).

Dév 4 → Admin (validation users, gyms, coachs).

Phase 2 – Paiements & rattachements :

Dév 3 → gestion achat programmes.

Dév 4 → supervision des transactions.

Phase 3 – Extensions futures :

Suivi personnalisé entre athlète et coach (Dév 3).

Abonnements récurrents (Dév 4 + Dév 1).

Réseau social interne (Dév 2 + Dév 1).
