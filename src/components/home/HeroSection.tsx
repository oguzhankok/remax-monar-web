import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home, TrendingUp, Building2 } from 'lucide-react';
import { useListings } from '../../context/ListingsContext';
import { useSettings } from '../../context/SettingsContext';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { setFilter } = useListings();
  const { settings } = useSettings();

  const [searchType, setSearchType] = useState<'sale' | 'rent'>('sale');
  const [searchCategory, setSearchCategory] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    setFilter({
      type: searchType,
      category: searchCategory || undefined,
      city: searchCity || undefined,
      search: searchQuery || undefined,
    });
    navigate('/listings');
  };

  const stats = [
    { icon: Home, value: '500+', label: 'Mutlu Müşteri' },
    { icon: Building2, value: '1200+', label: 'Toplam İlan' },
    { icon: TrendingUp, value: '10+', label: 'Yıllık Deneyim' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-bg.jpg"
          alt="Hero Background"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1b3e]/90 via-[#0d1b3e]/70 to-[#0d1b3e]/40"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-blue-400/10 rounded-full blur-2xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-white/90 text-sm font-medium">
              Türkiye'nin Lider Gayrimenkul Markası
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            {settings.heroTitle.split(' ').slice(0, -2).join(' ')}{' '}
            <span className="text-red-400">
              {settings.heroTitle.split(' ').slice(-2).join(' ')}
            </span>
          </h1>

          <p className="text-lg text-white/80 mb-10 max-w-xl leading-relaxed">
            {settings.heroSubtitle}
          </p>

          {/* Search Box */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-2 shadow-2xl">
            {/* Type Tabs */}
            <div className="flex gap-1 mb-3 px-2 pt-2">
              <button
                onClick={() => setSearchType('sale')}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                  searchType === 'sale'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Satılık
              </button>
              <button
                onClick={() => setSearchType('rent')}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                  searchType === 'rent'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Kiralık
              </button>
            </div>

            {/* Search Fields */}
            <div className="flex flex-col sm:flex-row gap-2 p-2">
              {/* Category */}
              <div className="flex-1 bg-white/90 rounded-xl px-4 py-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="w-full bg-transparent text-gray-700 text-sm focus:outline-none"
                >
                  <option value="">Tüm Tipler</option>
                  <option value="residential">Konut</option>
                  <option value="commercial">Ticari</option>
                  <option value="land">Arsa</option>
                </select>
              </div>

              {/* City */}
              <div className="flex-1 bg-white/90 rounded-xl px-4 py-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <select
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full bg-transparent text-gray-700 text-sm focus:outline-none"
                >
                  <option value="">Tüm Şehirler</option>
                  <option value="İstanbul">İstanbul</option>
                  <option value="Ankara">Ankara</option>
                  <option value="İzmir">İzmir</option>
                  <option value="Bursa">Bursa</option>
                  <option value="Antalya">Antalya</option>
                </select>
              </div>

              {/* Keyword */}
              <div className="flex-1 bg-white/90 rounded-xl px-4 py-3 flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Anahtar kelime..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full bg-transparent text-gray-700 text-sm placeholder-gray-400 focus:outline-none"
                />
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-red-500/30 flex items-center gap-2 justify-center whitespace-nowrap"
              >
                <Search className="w-4 h-4" />
                Ara
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-10">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <stat.icon className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-white font-black text-xl leading-none">{stat.value}</p>
                  <p className="text-white/60 text-xs mt-0.5">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 animate-bounce">
        <span className="text-xs">Aşağı Kaydır</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
