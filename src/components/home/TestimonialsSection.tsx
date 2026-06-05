import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { testimonials } from '../../data/mockData';

const TestimonialsSection: React.FC = () => {
  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => (a === 0 ? testimonials.length - 1 : a - 1));
  const next = () => setActive((a) => (a === testimonials.length - 1 ? 0 : a + 1));

  return (
    <section className="py-20 bg-[#0d1b3e] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-red-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72  rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-red-400 font-semibold text-sm uppercase tracking-wider">
            Müşteri Görüşleri
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 mb-4">
            Müşterilerimiz Ne Diyor?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Yüzlerce mutlu müşterimizin deneyimlerini okuyun ve neden Remax Monar'ı
            tercih ettiklerini öğrenin.
          </p>
        </div>

        {/* Testimonials Grid - Desktop */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                i === active
                  ? 'bg-red-600 border-red-500 shadow-xl shadow-red-900/30'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
              onClick={() => setActive(i)}
            >
              {/* Quote Icon */}
              <Quote
                className={`w-6 h-6 mb-4 ${i === active ? 'text-white/50' : 'text-gray-500'}`}
              />

              {/* Comment */}
              <p
                className={`text-sm leading-relaxed mb-4 line-clamp-4 ${
                  i === active ? 'text-white' : 'text-gray-400'
                }`}
              >
                "{t.comment}"
              </p>

              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star
                    key={si}
                    className={`w-3 h-3 fill-current ${
                      si < t.rating
                        ? i === active
                          ? 'text-white'
                          : 'text-yellow-400'
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 mt-auto">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    i === active
                      ? 'bg-white/20 text-white'
                      : 'bg-white/10 text-gray-300'
                  }`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p
                    className={`font-semibold text-sm ${
                      i === active ? 'text-white' : 'text-white/80'
                    }`}
                  >
                    {t.name}
                  </p>
                  <p
                    className={`text-xs ${
                      i === active ? 'text-white/70' : 'text-gray-500'
                    }`}
                  >
                    {t.role} • {t.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
            <Quote className="w-8 h-8 text-red-400 mb-4" />
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              "{testimonials[active].comment}"
            </p>
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 fill-current ${
                    i < testimonials[active].rating ? 'text-yellow-400' : 'text-gray-600'
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-sm font-bold text-white">
                {testimonials[active].avatar}
              </div>
              <div>
                <p className="font-semibold text-white">{testimonials[active].name}</p>
                <p className="text-xs text-gray-400">
                  {testimonials[active].role} • {testimonials[active].date}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Nav */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === active ? 'bg-red-500 w-6' : 'bg-white/30 w-2'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
