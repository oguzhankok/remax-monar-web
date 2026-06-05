import express from 'express';
import Application from '../models/Application.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// 1. Tüm Başvuruları Getir (Admin Paneli İçin)
router.get('/', async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Başvurular getirilemedi', error });
  }
});

// 2. Yeni Başvuru Ekle (Frontend'den Gelen Form)
router.post('/', async (req, res) => {
  try {
    // A) Veritabanına Kaydet
    const newApplication = await Application.create(req.body);

    // B) E-posta Bildirimi Gönder
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Remax Monar Kariyer" <${process.env.SMTP_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: `Yeni İş Başvurusu: ${req.body.firstName} ${req.body.lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #0d1b3e;">Yeni Bir Danışman Başvurusu Aldınız!</h2>
          <p><strong>Ad Soyad:</strong> ${req.body.firstName} ${req.body.lastName}</p>
          <p><strong>E-Posta:</strong> ${req.body.email}</p>
          <p><strong>Telefon:</strong> ${req.body.phone}</p>
          <p><strong>Tecrübe:</strong> ${req.body.experience}</p>
          <hr style="border: 1px solid #eee; margin: 15px 0;">
          <p><strong>Ön Yazı:</strong></p>
          <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">${req.body.coverLetter}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ success: true, data: newApplication });
  } catch (error) {
    console.error('Başvuru Hatası:', error);
    res.status(500).json({ success: false, message: 'Başvuru alınamadı', error: error.message });
  }
});
// 3. Başvuru Durumunu Güncelle (PUT)
router.put('/:id', async (req, res) => {
  try {
    const updatedApp = await Application.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(updatedApp);
  } catch (error) {
    res.status(400).json({ message: 'Başvuru güncellenemedi', error });
  }
});

// 4. Başvuruyu Sil (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: 'Başvuru başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Başvuru silinemedi', error });
  }
});

export default router;