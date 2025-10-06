import axios from 'axios';

const BASE_URL = 'http://localhost:5000';
const API_URL = `${BASE_URL}/api`;

// Test data for different roles
const testData = {
  athletes: [
    {
      name: 'Alice Johnson',
      email: 'alice.athlete@test.com',
      password: 'AthletePass123!',
      role: 'athlete',
      gender: 'female',
      height: 165,
      weight: 60,
      fitness_level: 'beginner',
      goals: 'weight_loss',
      activity_frequency: 'moderate'
    },
    {
      name: 'Bob Smith',
      email: 'bob.athlete@test.com',
      password: 'AthletePass123!',
      role: 'athlete',
      gender: 'male',
      height: 180,
      weight: 80,
      fitness_level: 'advanced',
      goals: 'muscle_gain',
      activity_frequency: 'active'
    },
    {
      name: 'Carol Davis',
      email: 'carol.athlete@test.com',
      password: 'AthletePass123!',
      role: 'athlete',
      gender: 'female',
      height: 170,
      weight: 65,
      fitness_level: 'intermediate',
      goals: 'endurance',
      activity_frequency: 'active'
    }
  ],
  coaches: [
    {
      name: 'David Wilson',
      email: 'david.coach@test.com',
      password: 'CoachPass123!',
      role: 'coach',
      gender: 'male',
      cin: '12345678',
      years_of_experience: 8,
      certificats: [
        {
          name: 'Personal Trainer Certification',
          issuer: 'ACSM',
          date: '2020-01-15'
        }
      ]
    },
    {
      name: 'Emma Brown',
      email: 'emma.coach@test.com',
      password: 'CoachPass123!',
      role: 'coach',
      gender: 'female',
      cin: '87654321',
      years_of_experience: 5,
      certificats: [
        {
          name: 'Nutrition Specialist',
          issuer: 'NASM',
          date: '2021-03-20'
        }
      ]
    },
    {
      name: 'Frank Miller',
      email: 'frank.coach@test.com',
      password: 'CoachPass123!',
      role: 'coach',
      gender: 'male',
      cin: '11223344',
      years_of_experience: 12,
      certificats: [
        {
          name: 'Strength & Conditioning',
          issuer: 'NSCA',
          date: '2019-06-10'
        }
      ]
    }
  ],
  gyms: [
    {
      name: 'FitLife Gym',
      email: 'fitlife.gym@test.com',
      password: 'GymPass123!',
      role: 'gym',
      gender: 'male',
      profile: {
        address: '123 Fitness Street',
        city: 'Fitness City',
        phone: '+1234567890',
        capacity: 200
      }
    },
    {
      name: 'PowerHouse Fitness',
      email: 'powerhouse.gym@test.com',
      password: 'GymPass123!',
      role: 'gym',
      gender: 'female',
      profile: {
        address: '456 Muscle Avenue',
        city: 'Strength Town',
        phone: '+0987654321',
        capacity: 150
      }
    },
    {
      name: 'Elite Training Center',
      email: 'elite.gym@test.com',
      password: 'GymPass123!',
      role: 'gym',
      gender: 'male',
      profile: {
        address: '789 Champion Road',
        city: 'Victory City',
        phone: '+1122334455',
        capacity: 300
      }
    }
  ],
  admins: [
    {
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'AdminPass123!',
      role: 'admin',
      gender: 'male'
    }
  ]
};

// Helper function to make API calls
const apiCall = async (method, endpoint, data = null) => {
  try {
    const config = {
      method,
      url: `${API_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
      }
    };

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

// Function to create users of a specific role
const createUsersByRole = async (role, users) => {
  console.log(`👥 Creating ${users.length} ${role} users...`);
  const results = [];
  
  for (const user of users) {
    const result = await apiCall('POST', '/auth/signup', user);
    if (result.success) {
      console.log(`   ✅ Created ${role}: ${user.name} (${user.email})`);
      results.push({
        ...user,
        id: result.data.user.id,
        accessToken: result.data.accessToken
      });
    } else {
      console.log(`   ❌ Failed to create ${role}: ${user.name} - ${result.error.message}`);
    }
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
};

// Function to approve coaches and gyms
const approveUsers = async (adminToken, users) => {
  console.log(`✅ Approving ${users.length} users...`);
  
  for (const user of users) {
    if (['coach', 'gym'].includes(user.role)) {
      const result = await apiCall('PUT', `/users/${user.id}/approve`, 
        { approved: true }, adminToken);
      
      if (result.success) {
        console.log(`   ✅ Approved ${user.role}: ${user.name}`);
      } else {
        console.log(`   ❌ Failed to approve ${user.role}: ${user.name}`);
      }
    }
  }
};

// Function to create test programs
const createTestPrograms = async (coachToken) => {
  console.log('📋 Creating test programs...');
  
  const programs = [
    {
      title: 'Beginner Strength Training',
      description: 'A comprehensive program for beginners to build strength',
      duration: 12,
      difficulty: 'beginner',
      price: 99.99,
      category: 'strength'
    },
    {
      title: 'Advanced Cardio Blast',
      description: 'High-intensity cardio program for advanced athletes',
      duration: 8,
      difficulty: 'advanced',
      price: 149.99,
      category: 'cardio'
    },
    {
      title: 'Weight Loss Journey',
      description: 'Complete weight loss program with nutrition guidance',
      duration: 16,
      difficulty: 'intermediate',
      price: 199.99,
      category: 'weight_loss'
    }
  ];
  
  // Note: This would require a programs endpoint to be implemented
  console.log('ℹ️ Program creation requires programs API endpoints');
  return programs;
};

// Function to create test events
const createTestEvents = async (gymToken) => {
  console.log('📅 Creating test events...');
  
  const events = [
    {
      title: 'Morning Yoga Class',
      description: 'Relaxing yoga session for all levels',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      duration: 60,
      maxParticipants: 20
    },
    {
      title: 'HIIT Workout Challenge',
      description: 'High-intensity interval training session',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
      duration: 45,
      maxParticipants: 15
    }
  ];
  
  // Note: This would require an events endpoint to be implemented
  console.log('ℹ️ Event creation requires events API endpoints');
  return events;
};

// Main setup function
const setupTestData = async () => {
  console.log('🚀 Setting up test data for Fitness Management System\n');
  
  // Check server health
  const healthCheck = await apiCall('GET', '/');
  if (!healthCheck.success) {
    console.log('❌ Server is not running. Please start the server first.');
    return;
  }
  
  console.log('✅ Server is running\n');
  
  // Create users by role
  const createdUsers = {};
  
  for (const [role, users] of Object.entries(testData)) {
    const results = await createUsersByRole(role, users);
    createdUsers[role] = results;
    console.log('');
  }
  
  // Get admin token for approval
  const adminUser = createdUsers.admins[0];
  if (adminUser) {
    console.log('🔐 Using admin token for approvals...\n');
    
    // Approve coaches and gyms
    await approveUsers(adminUser.accessToken, [
      ...createdUsers.coaches,
      ...createdUsers.gyms
    ]);
    
    console.log('\n📊 Test data summary:');
    console.log(`   Athletes: ${createdUsers.athletes.length}`);
    console.log(`   Coaches: ${createdUsers.coaches.length}`);
    console.log(`   Gyms: ${createdUsers.gyms.length}`);
    console.log(`   Admins: ${createdUsers.admins.length}`);
    
    // Save user data for testing
    const fs = await import('fs');
    const testDataFile = {
      users: createdUsers,
      adminToken: adminUser.accessToken,
      createdAt: new Date().toISOString()
    };
    
    fs.writeFileSync('test/test-data.json', JSON.stringify(testDataFile, null, 2));
    console.log('\n💾 Test data saved to test/test-data.json');
    
    console.log('\n🎯 Test data setup completed!');
    console.log('You can now use the test data for API testing.');
    
  } else {
    console.log('❌ No admin user created. Cannot approve other users.');
  }
};

// Function to clean up test data
const cleanupTestData = async () => {
  console.log('🧹 Cleaning up test data...');
  
  try {
    const fs = await import('fs');
    const testData = JSON.parse(fs.readFileSync('test/test-data.json', 'utf8'));
    
    // This would require implementing delete endpoints
    console.log('ℹ️ Cleanup requires delete endpoints to be implemented');
    console.log('Manual cleanup recommended for now');
    
  } catch (error) {
    console.log('ℹ️ No test data file found to clean up');
  }
};

// Export functions
export {
  setupTestData,
  cleanupTestData,
  createUsersByRole,
  approveUsers,
  createTestPrograms,
  createTestEvents
};

// Run setup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupTestData().catch(console.error);
}

