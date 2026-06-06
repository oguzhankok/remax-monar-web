import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await User.deleteMany(); // Varsa eski kullanıcıları temizle
    
    // İlk adminimizi oluşturuyoruz
    const adminUser = new User({
      username: 'admin',
      password: 'remax2024', // Şifreyi modelimiz otomatik olarak kriptolayacak
      email: 'ouzhankk37@gmail.com',
      role: 'superadmin'
    });

    await adminUser.save();
    console.log('✅ Admin Kullanıcısı Başarıyla Veritabanına Eklendi!');
    process.exit();
  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
};

importData();