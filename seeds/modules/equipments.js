import Equipment from '../../models/Equipment.js';

export default async function seedEquipments() {
  const docs = await Equipment.insertMany([
    {
      title: 'Treadmill',
      picture: 'https://example.com/treadmill.jpg',
      details: 'High-end running treadmill',
      type: 'cardio',
    },
    {
      title: 'Dumbbells Set',
      picture: 'https://example.com/dumbbells.jpg',
      details: 'Adjustable dumbbells 5-40lbs',
      type: 'strength',
    },
  ]);
  return docs;
}
