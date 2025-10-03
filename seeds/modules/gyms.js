import Gym from '../../models/Gym.js';

export default async function seedGyms(equipmentIds, coachId) {
  const gym = await Gym.create({
    location: 'Downtown, City',
    equipements: equipmentIds,
    coach: [coachId],
    schedule: '6:00 - 22:00',
    mix: true,
    avtivities: ['yoga', 'crossfit'],
  });
  return gym;
}
