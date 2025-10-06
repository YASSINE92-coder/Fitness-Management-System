import axios from 'axios';
import { ROLES } from '../utils/roles.js';

// Configuration
const BASE_URL = 'http://localhost:5000';
const API_URL = `${BASE_URL}/api`;

// Test data
const testUsers = {
  athlete: {
    name: 'Test Athlete',
    email: 'athlete@test.com',
    password: 'AthletePass123!',
    role: 'athlete',
    gender: 'male',
    height: 180,
    weight: 75,
    fitness_level: 'intermediate',
    goals: 'muscle_gain'
  },
  coach: {
    name: 'Test Coach',
    email: 'coach@test.com',
    password: 'CoachPass123!',
    role: 'coach',
    gender: 'male',
    cin: '12345678',
    years_of_experience: 5
  },
  gym: {
    name: 'Test Gym',
    email: 'gym@test.com',
    password: 'GymPass123!',
    role: 'gym',
    gender: 'male'
  },
  admin: {
    name: 'Test Admin',
    email: 'admin@test.com',
    password: 'AdminPass123!',
    role: 'admin',
    gender: 'male'
  }
};

// Global variables to store tokens and user IDs
let tokens = {};
let userIds = {};

// Helper function to make API calls
const apiCall = async (method, endpoint, data = null, token = null) => {
  try {
    const config = {
      method,
      url: `${API_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message, 
      status: error.response?.status || 500 
    };
  }
};

// Test functions
const testServerHealth = async () => {
  console.log('🏥 Testing server health...');
  const result = await apiCall('GET', '/');
  if (result.success) {
    console.log('✅ Server is running');
    return true;
  } else {
    console.log('❌ Server is not responding');
    return false;
  }
};

const testRoleEndpoints = async () => {
  console.log('🎭 Testing role endpoints...');
  
  // Test get all roles
  const rolesResult = await apiCall('GET', '/roles');
  if (rolesResult.success) {
    console.log('✅ Get all roles successful');
    console.log(`   Found ${rolesResult.data.roles.length} roles`);
  } else {
    console.log('❌ Get all roles failed');
  }

  // Test get role permissions for each role
  for (const role of Object.values(ROLES)) {
    const result = await apiCall('GET', `/roles/${role}/permissions`);
    if (result.success) {
      console.log(`✅ Get ${role} permissions successful`);
    } else {
      console.log(`❌ Get ${role} permissions failed`);
    }
  }
};

const testUserRegistration = async () => {
  console.log('👤 Testing user registration...');
  
  for (const [role, userData] of Object.entries(testUsers)) {
    const result = await apiCall('POST', '/auth/signup', userData);
    if (result.success) {
      console.log(`✅ ${role} registration successful`);
      userIds[role] = result.data.user.id;
    } else {
      console.log(`❌ ${role} registration failed:`, result.error.message);
    }
  }
};

const testUserLogin = async () => {
  console.log('🔐 Testing user login...');
  
  for (const [role, userData] of Object.entries(testUsers)) {
    const loginData = {
      email: userData.email,
      password: userData.password
    };
    
    const result = await apiCall('POST', '/auth/login', loginData);
    if (result.success) {
      console.log(`✅ ${role} login successful`);
      tokens[role] = result.data.accessToken;
    } else {
      console.log(`❌ ${role} login failed:`, result.error.message);
    }
  }
};

const testRoleBasedRoutes = async () => {
  console.log('🛡️ Testing role-based routes...');
  
  const roleRoutes = {
    athlete: ['/athlete/profile', '/athlete/programs', '/athlete/progress'],
    coach: ['/coach/athletes', '/coach/programs'],
    gym: ['/gym/events', '/gym/members', '/gym/equipment'],
    admin: ['/admin/dashboard']
  };

  for (const [role, routes] of Object.entries(roleRoutes)) {
    console.log(`   Testing ${role} routes...`);
    for (const route of routes) {
      const result = await apiCall('GET', route, null, tokens[role]);
      if (result.success) {
        console.log(`   ✅ ${role} ${route} - Success`);
      } else {
        console.log(`   ❌ ${role} ${route} - Failed: ${result.error.message}`);
      }
    }
  }
};

const testPermissionBasedRoutes = async () => {
  console.log('🔑 Testing permission-based routes...');
  
  // Test workouts route (requires view_own_workouts permission)
  const workoutsResult = await apiCall('GET', '/workouts', null, tokens.athlete);
  if (workoutsResult.success) {
    console.log('✅ Workouts route (athlete) - Success');
  } else {
    console.log('❌ Workouts route (athlete) - Failed:', workoutsResult.error.message);
  }

  // Test statistics route (requires gym role or higher)
  const statsResult = await apiCall('GET', '/statistics', null, tokens.gym);
  if (statsResult.success) {
    console.log('✅ Statistics route (gym) - Success');
  } else {
    console.log('❌ Statistics route (gym) - Failed:', statsResult.error.message);
  }
};

const testUnauthorizedAccess = async () => {
  console.log('🚫 Testing unauthorized access...');
  
  // Try to access admin route with athlete token
  const result = await apiCall('GET', '/admin/dashboard', null, tokens.athlete);
  if (!result.success && result.status === 403) {
    console.log('✅ Unauthorized access properly blocked');
  } else {
    console.log('❌ Unauthorized access not properly blocked');
  }
};

const testUserManagement = async () => {
  console.log('👥 Testing user management...');
  
  // Test create user
  const createResult = await apiCall('POST', '/users', {
    name: 'Test User',
    email: 'testuser@test.com',
    password: 'TestPass123!',
    gender: 'female'
  });
  
  if (createResult.success) {
    console.log('✅ Create user successful');
    const userId = createResult.data.user.id;
    
    // Test get user by ID
    const getResult = await apiCall('GET', `/users/${userId}`, null, tokens.admin);
    if (getResult.success) {
      console.log('✅ Get user by ID successful');
    } else {
      console.log('❌ Get user by ID failed:', getResult.error.message);
    }
  } else {
    console.log('❌ Create user failed:', createResult.error.message);
  }
};

const testRoleManagement = async () => {
  console.log('🎭 Testing role management (admin only)...');
  
  if (!tokens.admin) {
    console.log('❌ Admin token not available for role management tests');
    return;
  }

  // Test get users by role
  const athletesResult = await apiCall('GET', '/roles/athlete/users', null, tokens.admin);
  if (athletesResult.success) {
    console.log('✅ Get users by role (athlete) successful');
  } else {
    console.log('❌ Get users by role (athlete) failed:', athletesResult.error.message);
  }

  // Test get role statistics
  const statsResult = await apiCall('GET', '/roles/statistics', null, tokens.admin);
  if (statsResult.success) {
    console.log('✅ Get role statistics successful');
  } else {
    console.log('❌ Get role statistics failed:', statsResult.error.message);
  }
};

const testTokenRefresh = async () => {
  console.log('🔄 Testing token refresh...');
  
  // This would require implementing cookie handling in axios
  // For now, we'll just test the endpoint structure
  console.log('ℹ️ Token refresh test requires cookie handling - manual testing recommended');
};

const testLogout = async () => {
  console.log('🚪 Testing logout...');
  
  const result = await apiCall('POST', '/auth/logout', {}, tokens.athlete);
  if (result.success) {
    console.log('✅ Logout successful');
  } else {
    console.log('❌ Logout failed:', result.error.message);
  }
};

// Main test runner
const runAllTests = async () => {
  console.log('🚀 Starting Fitness Management System API Tests\n');
  
  // Check if server is running
  const serverRunning = await testServerHealth();
  if (!serverRunning) {
    console.log('❌ Cannot proceed with tests - server is not running');
    return;
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Run all tests
  await testRoleEndpoints();
  console.log('\n' + '-'.repeat(30) + '\n');
  
  await testUserRegistration();
  console.log('\n' + '-'.repeat(30) + '\n');
  
  await testUserLogin();
  console.log('\n' + '-'.repeat(30) + '\n');
  
  await testRoleBasedRoutes();
  console.log('\n' + '-'.repeat(30) + '\n');
  
  await testPermissionBasedRoutes();
  console.log('\n' + '-'.repeat(30) + '\n');
  
  await testUnauthorizedAccess();
  console.log('\n' + '-'.repeat(30) + '\n');
  
  await testUserManagement();
  console.log('\n' + '-'.repeat(30) + '\n');
  
  await testRoleManagement();
  console.log('\n' + '-'.repeat(30) + '\n');
  
  await testTokenRefresh();
  console.log('\n' + '-'.repeat(30) + '\n');
  
  await testLogout();
  
  console.log('\n' + '='.repeat(50));
  console.log('🏁 All tests completed!');
  console.log('='.repeat(50));
};

// Export for use in other files
export {
  runAllTests,
  testServerHealth,
  testRoleEndpoints,
  testUserRegistration,
  testUserLogin,
  testRoleBasedRoutes,
  testPermissionBasedRoutes,
  testUnauthorizedAccess,
  testUserManagement,
  testRoleManagement,
  testTokenRefresh,
  testLogout
};

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(console.error);
}
