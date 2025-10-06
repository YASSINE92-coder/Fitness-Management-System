// Role Management System
// Defines roles, permissions, and role hierarchy

export const ROLES = {
  ATHLETE: 'athlete',
  COACH: 'coach', 
  GYM: 'gym',
  ADMIN: 'admin'
};

// Role hierarchy (higher number = more privileges)
export const ROLE_HIERARCHY = {
  [ROLES.ATHLETE]: 1,
  [ROLES.COACH]: 2,
  [ROLES.GYM]: 3,
  [ROLES.ADMIN]: 4
};

// Permissions for each role
export const PERMISSIONS = {
  // Athlete permissions
  [ROLES.ATHLETE]: [
    'view_own_profile',
    'update_own_profile',
    'view_own_programs',
    'buy_programs',
    'view_own_workouts',
    'create_own_workouts',
    'view_own_progress',
    'create_own_progress'
  ],
  
  // Coach permissions
  [ROLES.COACH]: [
    'view_own_profile',
    'update_own_profile',
    'view_athletes',
    'create_programs',
    'update_own_programs',
    'delete_own_programs',
    'view_athlete_progress',
    'create_workouts',
    'update_workouts',
    'delete_workouts',
    'view_own_certificates',
    'upload_certificates'
  ],
  
  // Gym permissions
  [ROLES.GYM]: [
    'view_own_profile',
    'update_own_profile',
    'view_members',
    'manage_equipment',
    'create_events',
    'update_events',
    'delete_events',
    'view_events',
    'manage_facilities',
    'view_gym_statistics'
  ],
  
  // Admin permissions (includes all permissions)
  [ROLES.ADMIN]: [
    'view_all_profiles',
    'update_all_profiles',
    'delete_users',
    'manage_roles',
    'view_all_programs',
    'manage_all_programs',
    'view_all_workouts',
    'manage_all_workouts',
    'view_system_statistics',
    'manage_system_settings',
    'approve_coaches',
    'approve_gyms',
    'view_all_events',
    'manage_all_events',
    'view_all_equipment',
    'manage_all_equipment'
  ]
};

// Check if a role has a specific permission
export const hasPermission = (role, permission) => {
  if (!role || !permission) return false;
  return PERMISSIONS[role]?.includes(permission) || false;
};

// Check if a role has higher or equal hierarchy than another
export const hasRoleOrHigher = (userRole, requiredRole) => {
  if (!userRole || !requiredRole) return false;
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

// Get all roles that have a specific permission
export const getRolesWithPermission = (permission) => {
  return Object.keys(PERMISSIONS).filter(role => 
    PERMISSIONS[role].includes(permission)
  );
};

// Role-specific validation rules
export const ROLE_VALIDATION = {
  [ROLES.ATHLETE]: {
    required: ['name', 'email', 'password', 'gender'],
    optional: ['height', 'weight', 'fitness_level', 'goals', 'activity_frequency', 'alergies']
  },
  [ROLES.COACH]: {
    required: ['name', 'email', 'password', 'gender', 'cin', 'years_of_experience'],
    optional: ['certificats', 'programs']
  },
  [ROLES.GYM]: {
    required: ['name', 'email', 'password', 'gender'],
    optional: ['profile', 'programs']
  },
  [ROLES.ADMIN]: {
    required: ['name', 'email', 'password', 'gender'],
    optional: []
  }
};

// Get role display names
export const ROLE_DISPLAY_NAMES = {
  [ROLES.ATHLETE]: 'Athlète',
  [ROLES.COACH]: 'Coach',
  [ROLES.GYM]: 'Salle de Sport',
  [ROLES.ADMIN]: 'Administrateur'
};

// Get role description
export const ROLE_DESCRIPTIONS = {
  [ROLES.ATHLETE]: 'Utilisateur qui suit des programmes d\'entraînement et suit ses progrès',
  [ROLES.COACH]: 'Professionnel qui crée des programmes et accompagne les athlètes',
  [ROLES.GYM]: 'Gestionnaire de salle de sport qui organise des événements et gère les équipements',
  [ROLES.ADMIN]: 'Administrateur système avec tous les privilèges'
};
