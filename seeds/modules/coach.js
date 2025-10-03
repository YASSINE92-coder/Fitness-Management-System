import User from '../../models/User.js';

export default async function seedCoach() {
  const coach = await User.create({
    name: 'Coach Ahmed',
    email: 'coach@example.com',
    password: 'password123',
    role: 'coach',
    gender: 'male',
    years_of_experience: 5,
    cin: 'CIN123456',
    is_approved: true,
    certificats: [
      { title: 'Certified Personal Trainer', assigned_by: 'NASM', issued_at: new Date('2019-06-01') },
    ],
    programs: [],
  });
  return coach;
}
