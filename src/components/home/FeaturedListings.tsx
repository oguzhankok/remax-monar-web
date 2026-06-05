import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Star } from 'lucide-react';
import { useListings } from '../../context/ListingsContext';
import ListingCard from '../shared/ListingCard';

const FeaturedListings: React.FC = () => {
  const { featuredListings } = useListings();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const itemsPerView = () => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };

  const [perView, setPerView] = useState(itemsPerView());

  useEffect(() => {
    const handleResize = () => setPerView(itemsPerView());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, featuredListings.length - perView);

  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }, 4000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAutoPlaying, maxIndex]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  if (featuredListings.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-red-600 font-semibold text-sm uppercase tracking-wider">
                Öne Çıkan İlanlar
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0d1b3e]">
              Seçkin Portföyümüz
            </h2>
            <p className="text-gray-500 mt-2 max-w-xl">
              Uzman danışmanlarımız tarafından özenle seçilmiş en prestijli gayrimenkuller
            </p>
          </div>
          <Link
            to="/listings"
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold text-sm group shrink-0"
          >
            Tüm İlanları Gör
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(calc(-${currentIndex * (100 / perView)}% - ${currentIndex * 24 / perView}px))`,
              }}
            >
              {featuredListings.map((listing) => (
                <div
                  key={listing._id}
                  className="flex-shrink-0"
                  style={{ width: `calc(${100 / perView}% - ${(24 * (perView - 1)) / perView}px)` }}
                >
                  <ListingCard listing={listing} featured />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          {featuredListings.length > perView && (
            <>
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="absolute -left-5 top-1/2 -translate-y-1/2 w-11 h-11 bg-white hover:bg-red-600 text-gray-700 hover:text-white rounded-full shadow-lg flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                className="absolute -right-5 top-1/2 -translate-y-1/2 w-11 h-11 bg-white hover:bg-red-600 text-gray-700 hover:text-white rounded-full shadow-lg flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {featuredListings.length > perView && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentIndex(i);
                  setIsAutoPlaying(false);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'bg-red-600 w-8' : 'bg-gray-300 w-2'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedListings;
