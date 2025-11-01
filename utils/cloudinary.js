/* eslint-disable no-undef */
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET)
  throw new Error("cloudinary credentials not initilised");

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export const cloudinarConnection = async () => {
  try {
    await cloudinary.api.ping();
    console.log("✅ Cloudinary connection successful.");
    cloudinary;
  } catch (e) {
    console.error("Error connecting to Cloudinary", e.message);
    process.exit(1);
  }
};

export async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return res;
}

export default cloudinary;
