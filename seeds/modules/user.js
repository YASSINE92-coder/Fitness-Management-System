import User from '../../models/User.js';

export default async function seedUser() {
  const user = await User.create({
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user',
    gender: 'female',
    height: 165,
    weight: 60,
    fitness_level: 'beginner',
    alergies: ['peanuts'],
    activity_frequency: 'moderate',
    profile: { avatar: 'https://example.com/avatar.jpg', bio: 'Love fitness!' },
    goals: 'general',
    bought_programs: [],
  });
  return user;
}
