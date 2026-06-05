import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
import HeroSection from '../components/home/HeroSection';
import FeaturedListings from '../components/home/FeaturedListings';
import WhyRemax from '../components/home/WhyRemax';
import TestimonialsSection from '../components/home/TestimonialsSection';
import { useSettings } from '../context/SettingsContext';

const CTABanner: React.FC = () => {
  const { settings } = useSettings();
  return (
    <section className="py-16 bg-gradient-to-r from-red-600 to-red-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
          Hayalinizdeki Mülkü Arıyor musunuz?
        </h2>
        <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
          Uzman danışmanlarımız sizi dinlemeye hazır. Hemen iletişime geçin,
          size özel çözümler suналım.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/listings"
            className="inline-flex items-center justify-center gap-2 bg-white text-red-600 hover:bg-red-50 font-bold px-8 py-4 rounded-xl transition-colors text-lg"
          >
            İlanları İncele
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href={`tel:${settings.phone}`}
            className="inline-flex items-center justify-center gap-2 border-2 border-white text-white hover:bg-white/10 font-bold px-8 py-4 rounded-xl transition-colors text-lg"
          >
            <Phone className="w-5 h-5" />
            Hemen Ara
          </a>
        </div>
      </div>
    </section>
  );
};

const HomePage: React.FC = () => {
  return (
    <main>
      <HeroSection />
      <FeaturedListings />
      <WhyRemax />
      <TestimonialsSection />
      <CTABanner />
    </main>
  );
};

export default HomePage;
