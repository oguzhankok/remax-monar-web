import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  experience: { type: String, required: true },
  coverLetter: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['new', 'reviewed', 'contacted', 'rejected'], 
    default: 'new' 
  } // Admin panelindeki durum takibi için
}, { timestamps: true });

export default mongoose.model('Application', applicationSchema);