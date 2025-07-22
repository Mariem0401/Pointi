const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// === Configuration Cloudinary ===
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dkwwvoes5",
  api_key: process.env.CLOUDINARY_API_KEY || "178799684769726",
  api_secret: process.env.CLOUDINARY_API_SECRET || "GQVy6h_YLTuCiu8V2NmItS18PwI",
});

// === Stockage Cloudinary (images + PDF) ===
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    return {
      folder: "Pointi",
      resource_type: "auto", // Important: pour accepter image + pdf
      allowed_formats: ["jpg", "png", "jpeg", "gif", "webp", "pdf"], // Ajout de pdf ici
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});

// === Accepter PDF + Images ===
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf"
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Seules les images ou fichiers PDF sont autorisés"), false);
  }
};

// === Configuration Multer ===
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB max
    files: 1,
  },
});

// === Supprimer un fichier de Cloudinary ===
const deleteFromCloudinary = async (fileUrl) => {
  try {
    const publicId = extractPublicId(fileUrl);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId, { resource_type: "auto" });
      console.log(`Fichier supprimé: ${publicId}`);
    }
  } catch (err) {
    console.error("Erreur suppression Cloudinary:", err);
  }
};

// === Extraire le publicId depuis une URL Cloudinary ===
const extractPublicId = (url) => {
  if (!url) return null;
  const matches = url.match(/Pointi\/([^/.]+)/);
  return matches ? `Pointi/${matches[1]}` : null;
};

module.exports = {
  cloudinary,
  upload,
  deleteFromCloudinary,
  extractPublicId,
};
