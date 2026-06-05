import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'; // API istekleri için axios'u ekledik
import {
  Save,
  ArrowLeft,
  Trash2,
  Image as ImageIcon,
  AlertCircle,
} from 'lucide-react';
import { useListings } from '../../context/ListingsContext';
import { Listing } from '../../types';


type FormData = Omit<Listing, '_id' | 'views' | 'createdAt' | 'updatedAt'>;

const emptyForm: FormData = {
  title: '',
  description: '',
  type: 'sale',
  category: 'residential',
  price: 0,
  currency: 'TRY',
  city: 'İstanbul',
  district: '',
  address: '',
  area: 0,
  rooms: '',
  floor: undefined,
  totalFloors: undefined,
  buildingAge: undefined,
  bathrooms: undefined,
  parking: false,
  elevator: false,
  balcony: false,
  furnished: false,
  heatingType: '',
  images: [],
  isFeatured: false,
  isActive: true,
  agentName: '',
  agentPhone: '',
  agentEmail: '',
};

const AdminListingForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getListing, addListing, updateListing } = useListings();
  const isEdit = !!id;

  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  
  // Cloudinary yükleme durumunu takip etmek için yeni state eklendi
  const [uploadingImages, setUploadingImages] = useState(false);
  // YENİ EKLENECEK KISIM (API State'leri)
  const [apiCities, setApiCities] = useState<any[]>([]);
  const [apiDistricts, setApiDistricts] = useState<any[]>([]);

  useEffect(() => {
    if (isEdit && id) {
      const listing = getListing(id);
      if (listing) {
        const { _id, views, createdAt, updatedAt, ...rest } = listing;
        setFormData(rest);
      }
    }
  }, [id, isEdit, getListing]);
  // 1. Sayfa ilk açıldığında Türkiye'deki 81 ili çek
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get('https://turkiyeapi.dev/api/v1/provinces');
        const sorted = res.data.data.sort((a: any, b: any) => a.name.localeCompare(b.name, 'tr'));
        setApiCities(sorted);
      } catch (error) {
        console.error('İller yüklenemedi:', error);
      }
    };
    fetchCities();
  }, []);

  // 2. İl değiştiğinde VEYA ilan düzenleme sayfası açıldığında o ilin ilçelerini bul
  useEffect(() => {
    if (formData.city && apiCities.length > 0) {
      const cityObj = apiCities.find((c) => c.name === formData.city);
      if (cityObj) {
        const sortedDistricts = cityObj.districts.sort((a: any, b: any) =>
          a.name.localeCompare(b.name, 'tr')
        );
        setApiDistricts(sortedDistricts);
      }
    } else {
      setApiDistricts([]);
    }
  }, [formData.city, apiCities]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!formData.title.trim()) e.title = 'Başlık gerekli';
    if (!formData.description.trim()) e.description = 'Açıklama gerekli';
    if (!formData.price || formData.price <= 0) e.price = 'Geçerli fiyat girin';
    if (!formData.area || formData.area <= 0) e.area = 'Geçerli alan girin';
    if (!formData.district) e.district = 'İlçe gerekli';
    if (!formData.address.trim()) e.address = 'Adres gerekli';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    if (isEdit && id) {
      await updateListing(id, formData);
    } else {
      await addListing(formData);
    }

    setIsLoading(false);
    setSaved(true);
    setTimeout(() => navigate('/admin/listings'), 1500);
  };

  const set = (field: keyof FormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as string]) setErrors((prev) => ({ ...prev, [field as string]: '' }));
  };

  const removeImage = (i: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== i),
    }));
  };

  // Gerçek Cloudinary Resim Yükleme Fonksiyonu
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    const data = new FormData();
    files.forEach((file) => data.append('images', file));

    try {
      setUploadingImages(true);
      const res = await axios.post('/api/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...res.data],
      }));
    } catch (error) {
      console.error('Resim yükleme hatası:', error);
      alert('Resimler yüklenirken bir hata oluştu.');
    } finally {
      setUploadingImages(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-[#0d1b3e]">
            {isEdit ? 'İlanı Düzenle' : 'Yeni İlan Ekle'}
          </h1>
          <p className="text-gray-500 text-sm">
            {isEdit ? 'İlan bilgilerini güncelleyin' : 'Yeni gayrimenkul ilanı oluşturun'}
          </p>
        </div>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          İlan başarıyla {isEdit ? 'güncellendi' : 'eklendi'}! Yönlendiriliyorsunuz...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            {/* Temel Bilgiler */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h2 className="font-bold text-[#0d1b3e] mb-4">Temel Bilgiler</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">İlan Başlığı *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => set('title', e.target.value)}
                    placeholder="Örn: Beşiktaş'ta Boğaz Manzaralı Lüks Daire"
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none ${errors.title ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-red-500'}`}
                  />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Açıklama *</label>
                  <textarea
                    rows={5}
                    value={formData.description}
                    onChange={(e) => set('description', e.target.value)}
                    placeholder="Gayrimenkulü detaylı olarak açıklayın..."
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none ${errors.description ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-red-500'}`}
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">İlan Tipi</label>
                    <select value={formData.type} onChange={(e) => set('type', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-red-500">
                      <option value="sale">Satılık</option>
                      <option value="rent">Kiralık</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Kategori</label>
                    <select value={formData.category} onChange={(e) => set('category', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-red-500">
                      <option value="residential">Konut</option>
                      <option value="commercial">Ticari</option>
                      <option value="land">Arsa</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Konum Bilgileri */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h2 className="font-bold text-[#0d1b3e] mb-4">Konum Bilgileri</h2>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {/* DİNAMİK İL SEÇİMİ */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Şehir *</label>
                  <select 
                    value={formData.city} 
                    onChange={(e) => {
                      set('city', e.target.value);
                      set('district', ''); // İl değişince eski ilçeyi sıfırla
                    }} 
                    className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-red-500"
                  >
                    <option value="">İl Seçiniz</option>
                    {apiCities.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                
                {/* DİNAMİK İLÇE SEÇİMİ */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">İlçe *</label>
                  <select 
                    value={formData.district} 
                    onChange={(e) => set('district', e.target.value)} 
                    disabled={!formData.city} // İl seçilmeden ilçe seçilemesin
                    className={`w-full border rounded-xl px-3 py-3 text-sm focus:outline-none disabled:opacity-50 ${errors.district ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-red-500'}`}
                  >
                    <option value="">İlçe Seçiniz</option>
                    {apiDistricts.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                  {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Açık Adres *</label>
                <input type="text" value={formData.address} onChange={(e) => set('address', e.target.value)} placeholder="Mahalle, cadde, no..." className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none ${errors.address ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-red-500'}`} />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>
            </div>

            {/* Gayrimenkul Detayları */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h2 className="font-bold text-[#0d1b3e] mb-4">Gayrimenkul Detayları</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Alan (m²) *', key: 'area', placeholder: '100', type: 'number', error: errors.area },
                  { label: 'Oda Sayısı', key: 'rooms', placeholder: '3+1', type: 'text' },
                  { label: 'Banyo', key: 'bathrooms', placeholder: '2', type: 'number' },
                  { label: 'Kat', key: 'floor', placeholder: '5', type: 'number' },
                  { label: 'Toplam Kat', key: 'totalFloors', placeholder: '10', type: 'number' },
                  { label: 'Bina Yaşı', key: 'buildingAge', placeholder: '5', type: 'number' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">{field.label}</label>
                    <input
                      type={field.type}
                      value={(formData as Record<string, unknown>)[field.key] as string || ''}
                      onChange={(e) => set(field.key as keyof FormData, field.type === 'number' ? (e.target.value ? Number(e.target.value) : undefined) : e.target.value)}
                      placeholder={field.placeholder}
                      className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none ${field.error ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-red-500'}`}
                    />
                    {field.error && <p className="text-red-500 text-xs mt-1">{field.error}</p>}
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Isıtma Tipi</label>
                <select value={formData.heatingType || ''} onChange={(e) => set('heatingType', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-500">
                  <option value="">Seçin</option>
                  <option>Kombi</option>
                  <option>Merkezi Sistem</option>
                  <option>Yerden Isıtma</option>
                  <option>Doğalgaz Kombili</option>
                  <option>Klima</option>
                  <option>Soba</option>
                </select>
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { key: 'parking', label: 'Otopark' },
                  { key: 'elevator', label: 'Asansör' },
                  { key: 'balcony', label: 'Balkon' },
                  { key: 'furnished', label: 'Eşyalı' },
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-2 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="checkbox" checked={(formData as Record<string, unknown>)[item.key] as boolean} onChange={(e) => set(item.key as keyof FormData, e.target.checked)} className="w-4 h-4 text-red-600 rounded" />
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* YENİ FOTOĞRAFLAR ALANI (Cloudinary Entegreli) */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="w-5 h-5 text-[#0d1b3e]" />
                <h2 className="font-bold text-[#0d1b3e]">İlan Görselleri</h2>
              </div>
              
              <div className="space-y-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImages}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#0d1b3e] file:text-white hover:file:bg-[#162347] transition-all cursor-pointer disabled:opacity-50"
                />
                
                {uploadingImages && (
                  <div className="text-sm text-red-600 flex items-center gap-2 font-medium">
                    <div className="w-4 h-4 border-2 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                    Resimler Cloudinary'ye yükleniyor, lütfen bekleyin...
                  </div>
                )}

                {/* Yüklenen Resimlerin Önizlemesi */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    {formData.images.map((url, i) => (
                      <div key={i} className="relative group rounded-xl overflow-hidden aspect-video border border-gray-200">
                        <img
                          src={url}
                          alt={`Yüklenen ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-2 right-2 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {i === 0 && (
                          <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md font-semibold">
                            Kapak Resmi
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sağ Sidebar */}
          <div className="space-y-5">
            {/* Fiyatlandırma */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h2 className="font-bold text-[#0d1b3e] mb-4">Fiyatlandırma</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Fiyat *</label>
                  <input type="number" value={formData.price || ''} onChange={(e) => set('price', Number(e.target.value))} placeholder="0" className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none ${errors.price ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-red-500'}`} />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Para Birimi</label>
                  <select value={formData.currency} onChange={(e) => set('currency', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-red-500">
                    <option value="TRY">₺ TL</option>
                    <option value="USD">$ USD</option>
                    <option value="EUR">€ EUR</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Yayın Durumu */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h2 className="font-bold text-[#0d1b3e] mb-4">Yayın Durumu</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <input type="checkbox" checked={formData.isActive} onChange={(e) => set('isActive', e.target.checked)} className="w-4 h-4 text-red-600 rounded" />
                  <div>
                    <span className="text-sm font-semibold text-gray-900">Aktif</span>
                    <p className="text-xs text-gray-400">İlan sitede görünür</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <input type="checkbox" checked={formData.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} className="w-4 h-4 text-red-600 rounded" />
                  <div>
                    <span className="text-sm font-semibold text-gray-900">Öne Çıkar</span>
                    <p className="text-xs text-gray-400">Ana sayfada göster</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Danışman Bilgileri */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h2 className="font-bold text-[#0d1b3e] mb-4">Danışman Bilgileri</h2>
              <div className="space-y-3">
                {[
                  { key: 'agentName', label: 'Ad Soyad', placeholder: 'Ahmet Yılmaz', type: 'text' },
                  { key: 'agentPhone', label: 'Telefon', placeholder: '+90 5XX...', type: 'tel' },
                  { key: 'agentEmail', label: 'E-posta', placeholder: 'agent@remax.com', type: 'email' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">{field.label}</label>
                    <input type={field.type} value={(formData as Record<string, unknown>)[field.key] as string || ''} onChange={(e) => set(field.key as keyof FormData, e.target.value)} placeholder={field.placeholder} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-500" />
                  </div>
                ))}
              </div>
            </div>

            {/* Kaydet Butonu */}
            <button
              type="submit"
              disabled={isLoading || uploadingImages}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              {isLoading || uploadingImages ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {uploadingImages ? 'Resim Bekleniyor...' : (isEdit ? 'Güncelleniyor...' : 'Ekleniyor...')}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEdit ? 'Değişiklikleri Kaydet' : 'İlanı Yayınla'}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminListingForm;