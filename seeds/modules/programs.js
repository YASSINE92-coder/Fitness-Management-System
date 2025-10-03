import Program from '../../models/Program.js';

export default async function seedPrograms(creatorId) {
  const programs = await Program.insertMany([
    {
      title: '8-week Fat Loss',
      creator: creatorId,
      program_goals: ['weight_loss'],
      price: 49.99,
      period: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 * 8),
    },
    {
      title: '4-week Strength',
      creator: creatorId,
      program_goals: ['muscle_gain'],
      price: 39.99,
      period: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 * 4),
    },
  ]);
  return programs;
}
