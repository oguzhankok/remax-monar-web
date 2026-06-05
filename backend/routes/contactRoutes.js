import express from 'express';
import nodemailer from 'nodemailer';
import Message from '../models/Message.js'; // Veritabanı modelimizi ekledik

const router = express.Router();

// 1. Tüm Mesajları Getir (Admin Paneli İçin)
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Mesajlar getirilemedi', error });
  }
});

// 2. Yeni Mesaj Gönder (Hem DB Kaydı Hem E-Posta)
router.post('/', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  try {
    // A) ÖNCE VERİTABANINA KAYDET
    const newMessage = await Message.create(req.body);

    // B) SONRA E-POSTA BİLDİRİMİ GÖNDER
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
      from: `"Remax Monar Web" <${process.env.SMTP_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: `Yeni İletişim Formu: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #0d1b3e;">Web Sitesinden Yeni Mesajınız Var!</h2>
          <p><strong>Gönderen:</strong> ${name}</p>
          <p><strong>E-Posta:</strong> ${email}</p>
          <p><strong>Telefon:</strong> ${phone || 'Belirtilmedi'}</p>
          <p><strong>Konu:</strong> ${subject}</p>
          <hr style="border: 1px solid #eee; margin: 15px 0;">
          <p><strong>Mesaj:</strong></p>
          <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    // İşlem bitince veritabanına eklenen yeni mesajı frontend'e geri yolla
    res.status(200).json({ success: true, data: newMessage });
  } catch (error) {
    console.error('İşlem Hatası:', error);
    res.status(500).json({ success: false, message: 'İşlem başarısız', error: error.message });
  }
});
// 3. Mesajı Okundu Olarak İşaretle (PUT)
router.put('/:id', async (req, res) => {
  try {
    const updatedMsg = await Message.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    res.json(updatedMsg);
  } catch (error) {
    res.status(400).json({ message: 'Mesaj güncellenemedi', error });
  }
});

// 4. Mesajı Sil (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Mesaj başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Mesaj silinemedi', error });
  }
});

export default router;