import bcrypt from "bcryptjs";

const DEFAULT_SALT_ROUNDS = 10;

export async function hashPassword(plainPassword, saltRounds = DEFAULT_SALT_ROUNDS) {
  if (typeof plainPassword !== "string" || plainPassword.length === 0) {
    throw new Error("plainPassword must be a non-empty string");
  }
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(plainPassword, salt);
}

export async function comparePassword(plainPassword, hashedPassword) {
  if (typeof plainPassword !== "string" || typeof hashedPassword !== "string") {
    throw new Error("Both passwords must be strings");
  }
  return bcrypt.compare(plainPassword, hashedPassword);
}


