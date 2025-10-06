# Système de Gestion des Rôles

## Vue d'ensemble

Le système de gestion des rôles implémente un contrôle d'accès basé sur les rôles (RBAC) avec quatre rôles principaux :

1. **Athlète** (`athlete`) - Utilisateurs qui suivent des programmes d'entraînement
2. **Coach** (`coach`) - Professionnels qui créent des programmes et accompagnent les athlètes
3. **Salle de Sport** (`gym`) - Gestionnaires de salles qui organisent des événements
4. **Administrateur** (`admin`) - Administrateurs système avec tous les privilèges

## Hiérarchie des Rôles

```
Admin (4) > Gym (3) > Coach (2) > Athlète (1)
```

## Permissions par Rôle

### Athlète
- `view_own_profile` - Voir son propre profil
- `update_own_profile` - Modifier son propre profil
- `view_own_programs` - Voir ses programmes
- `buy_programs` - Acheter des programmes
- `view_own_workouts` - Voir ses entraînements
- `create_own_workouts` - Créer ses entraînements
- `view_own_progress` - Voir ses progrès
- `create_own_progress` - Enregistrer ses progrès

### Coach
- Toutes les permissions d'athlète +
- `view_athletes` - Voir les athlètes
- `create_programs` - Créer des programmes
- `update_own_programs` - Modifier ses programmes
- `delete_own_programs` - Supprimer ses programmes
- `view_athlete_progress` - Voir les progrès des athlètes
- `create_workouts` - Créer des entraînements
- `update_workouts` - Modifier des entraînements
- `delete_workouts` - Supprimer des entraînements
- `view_own_certificates` - Voir ses certificats
- `upload_certificates` - Télécharger des certificats

### Salle de Sport
- Toutes les permissions de coach +
- `view_members` - Voir les membres
- `manage_equipment` - Gérer l'équipement
- `create_events` - Créer des événements
- `update_events` - Modifier des événements
- `delete_events` - Supprimer des événements
- `view_events` - Voir les événements
- `manage_facilities` - Gérer les installations
- `view_gym_statistics` - Voir les statistiques de la salle

### Administrateur
- Toutes les permissions +
- `view_all_profiles` - Voir tous les profils
- `update_all_profiles` - Modifier tous les profils
- `delete_users` - Supprimer des utilisateurs
- `manage_roles` - Gérer les rôles
- `view_all_programs` - Voir tous les programmes
- `manage_all_programs` - Gérer tous les programmes
- `view_system_statistics` - Voir les statistiques système
- `manage_system_settings` - Gérer les paramètres système
- `approve_coaches` - Approuver les coachs
- `approve_gyms` - Approuver les salles
- `view_all_events` - Voir tous les événements
- `manage_all_events` - Gérer tous les événements
- `view_all_equipment` - Voir tout l'équipement
- `manage_all_equipment` - Gérer tout l'équipement

## Middleware d'Autorisation

### authRole(...roles)
Vérifie que l'utilisateur a l'un des rôles spécifiés.

```javascript
router.get("/admin/dashboard", protect, authRole("admin"), handler);
router.get("/coach/athletes", protect, authRole("coach"), handler);
```

### authPermission(permission)
Vérifie que l'utilisateur a une permission spécifique.

```javascript
router.get("/workouts", protect, authPermission("view_own_workouts"), handler);
```

### authRoleOrHigher(role)
Vérifie que l'utilisateur a le rôle spécifié ou un rôle supérieur.

```javascript
router.get("/statistics", protect, authRoleOrHigher("gym"), handler);
// Permet: gym, admin
```

### authPermissions([...permissions])
Vérifie que l'utilisateur a TOUTES les permissions spécifiées.

```javascript
router.post("/programs", protect, authPermissions(["create_programs", "update_programs"]), handler);
```

### authAnyPermission([...permissions])
Vérifie que l'utilisateur a AU MOINS UNE des permissions spécifiées.

```javascript
router.get("/data", protect, authAnyPermission(["view_own_data", "view_all_data"]), handler);
```

## API Endpoints

### Rôles (Public)
- `GET /api/roles` - Obtenir tous les rôles disponibles
- `GET /api/roles/:role/permissions` - Obtenir les permissions d'un rôle

### Rôles (Protégé)
- `POST /api/users/:userId/permissions` - Vérifier les permissions d'un utilisateur

### Rôles (Admin uniquement)
- `GET /api/roles/:role/users` - Obtenir les utilisateurs par rôle
- `GET /api/roles/statistics` - Obtenir les statistiques des rôles
- `PUT /api/users/:userId/role` - Modifier le rôle d'un utilisateur
- `PUT /api/users/:userId/approve` - Approuver/rejeter un utilisateur
- `PUT /api/users/:userId/status` - Activer/désactiver un utilisateur

## Validation des Rôles

### Champs Requis par Rôle

#### Athlète
- `name`, `email`, `password`, `gender`
- Optionnels: `height`, `weight`, `fitness_level`, `goals`, `activity_frequency`, `alergies`

#### Coach
- `name`, `email`, `password`, `gender`, `cin`, `years_of_experience`
- Optionnels: `certificats`, `programs`

#### Salle de Sport
- `name`, `email`, `password`, `gender`
- Optionnels: `profile`, `programs`

#### Administrateur
- `name`, `email`, `password`, `gender`

## Exemples d'Utilisation

### Inscription avec Validation de Rôle
```javascript
// POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "coach",
  "gender": "male",
  "cin": "12345678",
  "years_of_experience": 5
}
```

### Vérification des Permissions
```javascript
// POST /api/users/:userId/permissions
{
  "permissions": ["view_athletes", "create_programs"]
}
```

### Modification de Rôle (Admin)
```javascript
// PUT /api/users/:userId/role
{
  "newRole": "coach"
}
```

## Sécurité

- Les tokens de rafraîchissement sont stockés dans des cookies HTTP-only
- Les permissions sont vérifiées côté serveur
- La hiérarchie des rôles empêche l'escalade de privilèges
- Validation stricte des champs requis par rôle
- Logs détaillés pour le débogage des autorisations

## Gestion des Erreurs

Le système retourne des messages d'erreur détaillés :

```javascript
{
  "message": "Forbidden: insufficient role",
  "required": ["admin"],
  "current": "athlete"
}
```

```javascript
{
  "message": "Forbidden: missing required permissions",
  "missing": ["create_programs"],
  "current": "athlete"
}
```

