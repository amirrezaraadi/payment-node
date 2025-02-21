const { log } = require("console");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

function createUploadPath() {
    let data = new Date();
    let year = data.getFullYear();
    let month = data.getMonth();
    let day = data.getDate();
    let uploadPath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "public",
      "upload",
      "images"
    );
    fs.mkdirSync(uploadPath, { recursive: true });
    let createPath = path.join("public", "upload", "images");
    return createPath;
  }
// // تنظیمات Multer
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
    callback(null, createUploadPath());
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `profile_image-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // محدودیت حجم فایل 5MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb(new Error("Only image files are allowed!"), false);
    }
  },
});

module.exports = upload;
