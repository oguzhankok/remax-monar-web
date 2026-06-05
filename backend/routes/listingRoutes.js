import express from 'express';
import Listing from '../models/Listing.js';

const router = express.Router();

// 1. Tüm ilanları getir (GET /api/listings)
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 }); // En yeniler en üstte
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'İlanlar getirilirken hata oluştu', error });
  }
});

// 2. Tek bir ilan getir (GET /api/listings/:id)
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'İlan bulunamadı' });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: 'İlan getirilirken hata', error });
  }
});

// 3. Yeni ilan ekle (POST /api/listings)
router.post('/', async (req, res) => {
  try {
    const newListing = await Listing.create(req.body);
    res.status(201).json(newListing);
  } catch (error) {
    res.status(400).json({ message: 'İlan eklenemedi', error });
  }
});

// 4. İlanı güncelle (PUT /api/listings/:id)
router.put('/:id', async (req, res) => {
  try {
    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedListing);
  } catch (error) {
    res.status(400).json({ message: 'İlan güncellenemedi', error });
  }
});

// 5. İlanı sil (DELETE /api/listings/:id)
router.delete('/:id', async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: 'İlan başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: 'İlan silinemedi', error });
  }
});

export default router;