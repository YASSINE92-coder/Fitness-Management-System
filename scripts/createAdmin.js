import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const args = process.argv.slice(2);
const parseCliArgs = () => {
  const parsed = {};
  for (let i = 0; i < args.length; i += 1) {
    const token = args[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = args[i + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = true;
      continue;
    }
    parsed[key] = next;
    i += 1;
  }
  return parsed;
};

const cli = parseCliArgs();

const adminName = cli.name || process.env.ADMIN_NAME || "Administrator";
const adminEmail = cli.email || process.env.ADMIN_EMAIL;
const adminPassword = cli.password || process.env.ADMIN_PASSWORD;

if (!adminEmail || !adminPassword) {
  console.error(
    "\nMissing admin credentials.\nProvide --email and --password CLI args or set ADMIN_EMAIL / ADMIN_PASSWORD in .env.\n"
  );
  process.exit(1);
}

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

async function ensureAdmin() {
  await connectDB();

  const hashedPassword = await bcrypt.hash(adminPassword, SALT_ROUNDS);

  let admin = await User.findOne({ email: adminEmail });

  const uniqueCin = `ADMIN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  if (admin) {
    admin.name = adminName;
    admin.password = hashedPassword;
    admin.role = "admin";
    admin.isVerified = true;
    admin.isActive = true;
    admin.refreshTokens = [];
    admin.cin = admin.cin && admin.cin !== "null" ? admin.cin : uniqueCin;
  } else {
    admin = new User({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      isVerified: true,
      isActive: true,
      allergies: [],
      bought_programs: [],
      refreshTokens: [],
      cin: uniqueCin,
    });
  }

  await admin.save();
  console.log(`\n✅ Admin account ready for ${adminEmail}\n`);
}

ensureAdmin()
  .catch((err) => {
    console.error("\n❌ Failed to create admin account\n", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
    process.exit();
  });
