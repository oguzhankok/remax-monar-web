import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Cloudinary Kimlik Doğrulaması
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Depolama Ayarları
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'remax_monar_ilanlar', // Cloudinary'de açılacak klasör adı
    allowedFormats: ['jpeg', 'png', 'jpg', 'webp'],
    transformation: [{ width: 1000, height: 750, crop: 'limit' }], // Kaliteyi bozmadan boyutu küçültür
  },
});

export const upload = multer({ storage: storage });
export default cloudinary;