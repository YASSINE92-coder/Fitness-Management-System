import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";
import path from "path";

function uploadMiddleware(folderConfig = 'uploads', limitSizeMB = 5) {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: (req, file) => {
      let folderPath;

      if (typeof folderConfig === "string") {
        folderPath = folderConfig.trim();
      } else if (typeof folderConfig === "object") {
        folderPath = folderConfig[file.fieldname]?.trim() || "default";
      } 

      const fileExtension = path.extname(file.originalname).substring(1);
      const publicId = `${file.fieldname}-${Date.now()}`;

      return {
        folder: folderPath,
        public_id: publicId,
        format: fileExtension,
      };
    },
  });

  return multer({
    storage: storage,
    limits: {
      fileSize: limitSizeMB * 1024 * 1024, // keep images size < limitSizeMB MB
    },
  });
}

export default uploadMiddleware;
