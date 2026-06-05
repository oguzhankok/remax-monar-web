import React, { useState } from 'react';
import {
  Briefcase,
  Users,
  TrendingUp,
  Award,
  CheckCircle,
  Send,
  Star,
  Globe,
} from 'lucide-react';
import { useApplications } from '../context/ApplicationsContext';

const benefits = [
  { icon: TrendingUp, title: 'Kariyer Gelişimi', desc: 'Sürekli eğitim ve gelişim fırsatları' },
  { icon: Award, title: 'Uluslararası Sertifikasyon', desc: 'Dünya standartlarında REMAX sertifikası' },
  { icon: Users, title: 'Güçlü Ağ', desc: '140.000+ danışmanla global bağlantı' },
  { icon: Globe, title: 'Esnek Çalışma', desc: 'Özgür ve esnek çalışma modeli' },
  { icon: Star, title: 'Yüksek Komisyon', desc: 'Sektörün en yüksek komisyon oranları' },
  { icon: Briefcase, title: 'Destek Sistemi', desc: 'Hukuki, pazarlama ve teknik destek' },
];

const experienceOptions = [
  { value: 'none', label: 'Deneyimim Yok' },
  { value: '1-3', label: '1-3 Yıl' },
  { value: '3-5', label: '3-5 Yıl' },
  { value: '5+', label: '5 Yıl ve Üzeri' },
];

const CareerPage: React.FC = () => {
  const { addApplication } = useApplications();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    experience: '',
    coverLetter: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Ad gerekli';
    if (!formData.lastName.trim()) newErrors.lastName = 'Soyad gerekli';
    if (!formData.phone.trim()) newErrors.phone = 'Telefon gerekli';
    if (!formData.email.trim()) newErrors.email = 'E-posta gerekli';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Geçerli e-posta girin';
    if (!formData.experience) newErrors.experience = 'Deneyim seçin';
    if (!formData.coverLetter.trim()) newErrors.coverLetter = 'Ön yazı gerekli';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    addApplication(formData);
    setSubmitted(true);
    setIsLoading(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-[#0d1b3e] pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block bg-red-600/20 text-red-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              Kariyer Fırsatı
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-5 leading-tight">
              Remax Monar Bünyesinde
              <span className="text-red-400"> Gayrimenkul Danışmanı</span> Olun!
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Dünyanın 1 numaralı gayrimenkul markasının gücünü arkınıza alarak, kendi işinizin
              patronu olun. Sınırsız kazanç potansiyeli ve uluslararası kariyer fırsatları sizi bekliyor.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Info */}
          <div>
            <h2 className="text-2xl font-black text-[#0d1b3e] mb-6">
              Neden Remax Monar'ı Seçmelisiniz?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {benefits.map((b, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <b.icon className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-bold text-[#0d1b3e] text-sm">{b.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* What we offer */}
            <div className="bg-[#0d1b3e] rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-4">Size Sunduklarımız</h3>
              <ul className="space-y-3">
                {[
                  'Sektörün en yüksek komisyon oranı (%70\'e kadar)',
                  'Ücretsiz profesyonel eğitim programları',
                  'Uluslararası REMAX sertifikası ve ağı',
                  'Güçlü marka desteği ve pazarlama materyalleri',
                  'CRM ve teknoloji altyapı desteği',
                  'Hukuki danışmanlık ve tapu süreç desteği',
                  'Esnek çalışma saatleri',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-black text-[#0d1b3e] mb-2">Başvuru Formu</h2>
              <p className="text-gray-500 text-sm mb-6">
                Bilgilerinizi doldurun, danışmanlarımız en kısa sürede sizinle iletişime geçsin.
              </p>

              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-black text-[#0d1b3e] text-xl mb-2">
                    Başvurunuz Alındı!
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Başvurunuzu inceledikten sonra en kısa sürede sizinle iletişime geçeceğiz.
                    Remax Monar ailesine hoş geldiniz!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                        Ad *
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none ${
                          errors.firstName ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-red-500'
                        }`}
                        placeholder="Adınız"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                        Soyad *
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none ${
                          errors.lastName ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-red-500'
                        }`}
                        placeholder="Soyadınız"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none ${
                        errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-red-500'
                      }`}
                      placeholder="+90 5XX XXX XX XX"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                      E-posta *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none ${
                        errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-red-500'
                      }`}
                      placeholder="ornek@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                      Sektör Deneyimi *
                    </label>
                    <select
                      value={formData.experience}
                      onChange={(e) => handleChange('experience', e.target.value)}
                      className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none ${
                        errors.experience ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-red-500'
                      }`}
                    >
                      <option value="">Deneyim Seçin</option>
                      {experienceOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {errors.experience && (
                      <p className="text-red-500 text-xs mt-1">{errors.experience}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                      Ön Yazı *
                    </label>
                    <textarea
                      rows={4}
                      value={formData.coverLetter}
                      onChange={(e) => handleChange('coverLetter', e.target.value)}
                      className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none resize-none ${
                        errors.coverLetter ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-red-500'
                      }`}
                      placeholder="Kendinizi tanıtın, neden Remax Monar ailesine katılmak istediğinizi anlatın..."
                    />
                    {errors.coverLetter && (
                      <p className="text-red-500 text-xs mt-1">{errors.coverLetter}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Gönderiliyor...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Başvurumu Gönder
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerPage;
