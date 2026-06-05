import mongoose from 'mongoose';

// strict: false diyerek, admin panelindeki formdan (sosyal medya, iletişim vb.) 
// ne gelirse gelsin kısıtlama yapmadan veritabanına kaydetmesini sağlıyoruz.
const settingsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export default mongoose.model('Settings', settingsSchema);