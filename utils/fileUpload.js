import multer from "multer";

const upload = multer({
  dest: "storage/programs",
});

export default upload;
