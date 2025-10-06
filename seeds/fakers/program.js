import { faker } from "@faker-js/faker";

export const createFakeProgram = (creatorId) => {
  if (!creatorId) {
    throw new Error("Creator ID is required to create a program");
  }

  return {
    title: faker.helpers.arrayElement([
      "Ultimate Weight Loss Program",
      "Muscle Building Mastery",
      "Core Strength and Stability",
      "High-Intensity Interval Training",
      "Yoga and Flexibility",
      "Total Body Transformation",
      "Endurance Builder",
      "Strength Training 101",
      "Fat Burning Program",
      "Athletic Performance Enhancement",
    ]),
    creator: creatorId,
    program_goals: Array.from(
      { length: faker.number.int({ min: 1, max: 3 }) },
      () =>
        faker.helpers.arrayElement([
          "Weight Loss",
          "Muscle Gain",
          "Improved Flexibility",
          "Better Endurance",
          "Core Strength",
          "Overall Fitness",
          "Athletic Performance",
          "Body Recomposition",
          "Mental Wellness",
          "Injury Recovery",
        ])
    ),
    price: faker.number.float({ min: 29.99, max: 299.99, precision: 0.01 }),
    period: faker.date.future({ years: 1 }), // Program valid for up to 1 year from now
  };
};

export const createFakePrograms = (creatorId, count = 1) => {
  return Array.from({ length: count }, () => createFakeProgram(creatorId));
};
