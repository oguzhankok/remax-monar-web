import express from 'express';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Çoklu resim yükleme kapısı (tek seferde en fazla 10 resim)
router.post('/', upload.array('images', 10), (req, res) => {
  try {
    // Cloudinary'nin resimleri optimize edip bize verdiği güvenli URL'leri alıyoruz
    const imageUrls = req.files.map((file) => file.path);
    res.status(200).json(imageUrls);
  } catch (error) {
    res.status(500).json({ message: 'Resimler yüklenirken hata oluştu', error });
  }
});

export default router;