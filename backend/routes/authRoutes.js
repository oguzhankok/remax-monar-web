import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Admin Girişi (POST /api/auth/login)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Kullanıcıyı veritabanında bul
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Kullanıcı bulunamadı' });

    // 2. Şifreyi kontrol et
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Hatalı şifre' });

    // 3. Başarılıysa güvenli JWT Token oluştur
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d' // Token 1 gün geçerli
    });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Giriş hatası', error });
  }
});

export default router;