import multer from "multer";

const fileFilter = (req, file, cb) => {
  // Example: only allow images and pdf
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    file.fieldname === "image"
      ? cb(null, "uploads/programs/images") // folder to save images
      : cb(null, "uploads/programs/content"); // folder to save files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 999);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

export const programUpload = multer({ storage, fileFilter });
