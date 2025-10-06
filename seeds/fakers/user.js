import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

export const createFakeUser = (role = "user") => {
  const gender = faker.helpers.arrayElement(["male", "female"]);
  const password = "123456789";

  const baseUser = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: password,
    role: role,
    gender: gender,
    height: faker.number.int({ min: 150, max: 200 }), // height in cm
    weight: faker.number.float({ min: 45, max: 120, precision: 0.1 }), // weight in kg
    fitness_level: faker.helpers.arrayElement([
      "beginner",
      "intermediate",
      "advanced",
    ]),
    alergies: Array.from(
      { length: faker.number.int({ min: 0, max: 3 }) },
      () => faker.science.chemicalElement().name
    ),
    activity_frequency: faker.helpers.arrayElement([
      "active",
      "moderate",
      "sedentary",
    ]),
    goals: faker.helpers.arrayElement([
      "weight_loss",
      "muscle_gain",
      "endurance",
      "general",
    ]),
    bought_programs: [], // Will be populated later if needed
    profile: {
      bio: faker.person.bio(),
      avatar: faker.image.avatar(),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      social_media: {
        facebook: faker.internet.url(),
        instagram: faker.internet.url(),
        twitter: faker.internet.url(),
      },
    },
  };

  // Add coach-specific fields if role is coach
  if (role === "coach") {
    return {
      ...baseUser,
      cin: faker.string.alphanumeric(8).toUpperCase(),
      years_of_experience: faker.number.int({ min: 1, max: 20 }),
      is_approved: faker.datatype.boolean(),
      certificats: Array.from(
        { length: faker.number.int({ min: 1, max: 4 }) },
        () => ({
          title: faker.person.jobTitle(),
          assigned_by: faker.company.name(),
          issued_at: faker.date.past(),
        })
      ),
      programs: [], // Will be populated later if needed
    };
  }

  return baseUser;
};

export const createFakeUsers = (count = 1, role = "user") => {
  return Array.from({ length: count }, () => createFakeUser(role));
};
