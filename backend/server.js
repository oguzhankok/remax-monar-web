import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import uploadRoutes from './routes/uploadRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
// Route dosyalarını içe aktar
import listingRoutes from './routes/listingRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/applications', applicationRoutes);
// API Kapılarını Sisteme Tanıt
app.use('/api/listings', listingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/', (req, res) => {
  res.send('Remax Monar API Başarıyla Çalışıyor! 🚀');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Sunucu ${PORT} portunda ayağa kalktı!`);
});