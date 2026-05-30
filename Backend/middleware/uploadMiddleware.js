const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const uploadDir = path.join(__dirname, "..", "uploads");
const hasCloudinaryConfig =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const localStorage = multer.diskStorage({

  destination: function (
    req,
    file,
    cb
  ) {
    cb(null, uploadDir);
  },

  filename: function (
    req,
    file,
    cb
  ) {

    const uniqueName =
      Date.now() +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "yufa",
    resource_type: file.mimetype?.startsWith("video/") ? "video" : "image",
    public_id: `${Date.now()}-${path.parse(file.originalname).name}`.replace(/[^a-zA-Z0-9-_]/g, "-"),
  }),
});

const upload = multer({
  storage: hasCloudinaryConfig ? cloudinaryStorage : localStorage,
});

module.exports = upload;
