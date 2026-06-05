import express from 'express';
import Settings from '../models/Settings.js';

const router = express.Router();

// 1. Mevcut Ayarları Getir (GET)
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    // Eğer veritabanı boşsa, boş bir ayar dokümanı oluştur
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Ayarlar getirilemedi', error });
  }
});

// 2. Ayarları Güncelle (PUT)
router.put('/', async (req, res) => {
  try {
    // findOneAndUpdate ile ilk bulduğu ayar kaydını günceller
    let settings = await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: 'Ayarlar güncellenemedi', error });
  }
});

export default router;