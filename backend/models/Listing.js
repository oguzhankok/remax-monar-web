import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['sale', 'rent'], required: true }, // Satılık veya Kiralık
  category: { type: String, enum: ['residential', 'land', 'commercial'], required: true }, // Konut, Arsa, Ticari
  price: { type: Number, required: true },
  currency: { type: String, default: 'TRY' },
  city: { type: String, required: true },
  district: { type: String, required: true },
  address: { type: String, required: true },
  area: { type: Number, required: true }, // Metrekare
  rooms: { type: String },
  floor: { type: Number },
  totalFloors: { type: Number },
  buildingAge: { type: Number },
  bathrooms: { type: Number },
  parking: { type: Boolean, default: false },
  elevator: { type: Boolean, default: false },
  balcony: { type: Boolean, default: false },
  furnished: { type: Boolean, default: false },
  heatingType: { type: String },
  images: [{ type: String }], // Resimlerin URL linklerini dizi içinde tutacağız
  isFeatured: { type: Boolean, default: false }, // Ana sayfada öne çıkarılacak mı?
  isActive: { type: Boolean, default: true }, // İlan yayında mı?
  agentName: { type: String },
  agentPhone: { type: String },
  agentEmail: { type: String },
  views: { type: Number, default: 0 } // Tıklanma sayısı
}, { 
  timestamps: true // Bu, MongoDB'nin "createdAt" ve "updatedAt" tarihlerini otomatik atmasını sağlar
});

export default mongoose.model('Listing', listingSchema);