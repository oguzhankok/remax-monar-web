import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import {
  Shield,
  Award,
  Users,
  TrendingUp,
  Headphones,
  Globe,
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Güvenilir & Şeffaf',
    description:
      'Her işlemde tam şeffaflık. Hukuki danışmanlık ve noter süreçlerinde sizi güvenle yönlendiriyoruz.',
    color: 'bg-blue-50 text-blue-600',
    border: 'border-blue-100',
  },
  {
    icon: Award,
    title: 'Uluslararası Marka',
    description:
      'Dünya genelinde 140.000+ danışman ve 100+ ülkede faaliyet gösteren Remax güvencesiyle.',
    color: 'bg-red-50 text-red-600',
    border: 'border-red-100',
  },
  {
    icon: Users,
    title: 'Uzman Danışman Kadrosu',
    description:
      'Sertifikalı ve deneyimli gayrimenkul danışmanlarımız, size en iyi çözümü sunmak için çalışıyor.',
    color: 'bg-green-50 text-green-600',
    border: 'border-green-100',
  },
  {
    icon: TrendingUp,
    title: 'Piyasa Analizi',
    description:
      'Güncel piyasa verileri ve bölge analizleriyle doğru fiyat tespiti ve değerleme hizmeti.',
    color: 'bg-purple-50 text-purple-600',
    border: 'border-purple-100',
  },
  {
    icon: Headphones,
    title: '7/24 Destek',
    description:
      'Satın alma, satma veya kiralama sürecinizin her adımında yanınızdayız. 7/24 ulaşabilirsiniz.',
    color: 'bg-orange-50 text-orange-600',
    border: 'border-orange-100',
  },
  {
    icon: Globe,
    title: 'Geniş Portföy',
    description:
      'Konut, ticari ve arsa dahil 1.200+ aktif ilan. Her bütçeye ve ihtiyaca uygun seçenekler.',
    color: 'bg-teal-50 text-teal-600',
    border: 'border-teal-100',
  },
];

const WhyRemax: React.FC = () => {
  const { settings } = useSettings();
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-red-600 font-semibold text-sm uppercase tracking-wider">
            Neden Bizi Seçmelisiniz
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0d1b3e] mt-3 mb-4">
            Neden Remax Monar?
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Gayrimenkul yolculuğunuzda size en iyi deneyimi sunmak için buradayız.
            İşte sizi diğerlerinden ayıran farkımız:
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-6 rounded-2xl border ${feature.border} hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group`}
            >
              <div
                className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-[#0d1b3e] text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* About Section */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/images/about-team.jpg"
                alt="Remax Monar Ekibi"
                className="w-full h-80 object-cover"
              />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-5 shadow-xl border border-gray-100 max-w-xs">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex -space-x-2">
                  {['AY', 'ZK', 'MD'].map((initials, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-xs font-bold border-2 border-white"
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-900">+15 Danışman</span>
              </div>
              <p className="text-xs text-gray-500">Profesyonel ekibimiz hizmetinizde</p>
            </div>
          </div>

          <div>
            <span className="text-red-600 font-semibold text-sm uppercase tracking-wider">
              Hakkımızda
            </span>
            <h2 className="text-3xl font-black text-[#0d1b3e] mt-3 mb-6 leading-tight">
              10 Yılı Aşkın Deneyimle
              <br />
              <span className="text-red-600">Yanınızdayız</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {settings.companyAbout} 
              {/* Not: settings içindeki değişkenin tam adı neyse onu yazmalısın */}
            </p>
            <div className="grid grid-cols-3 gap-6 mb-8">
              {[
                { value: '500+', label: 'Müşteri' },
                { value: '1200+', label: 'İlan' },
                { value: '10+', label: 'Yıl' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl font-black text-red-600">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#0d1b3e] hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Bizimle İletişime Geç
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyRemax;
