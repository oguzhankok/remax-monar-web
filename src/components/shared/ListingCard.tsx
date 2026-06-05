import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Maximize2, Bed, Bath, Star, Eye, ArrowRight } from 'lucide-react';
import { Listing } from '../../types';

interface ListingCardProps {
  listing: Listing;
  featured?: boolean;
}

const formatPrice = (price: number, currency: string, type: string) => {
  const formatted = new Intl.NumberFormat('tr-TR').format(price);
  const symbol = currency === 'TRY' ? '₺' : currency === 'USD' ? '$' : '€';
  const suffix = type === 'rent' ? '/ay' : '';
  return `${symbol}${formatted}${suffix}`;
};

const categoryLabel: Record<string, string> = {
  residential: 'Konut',
  land: 'Arsa',
  commercial: 'Ticari',
};

const typeLabel: Record<string, string> = {
  sale: 'Satılık',
  rent: 'Kiralık',
};

const ListingCard: React.FC<ListingCardProps> = ({ listing, featured = false }) => {
  return (
    <Link
      to={`/listings/${listing._id}`}
      className={`group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-100 hover:-translate-y-1 ${
        featured ? 'h-full' : ''
      }`}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-56">
        <img
          src={listing.images[0] || '/images/property1.jpg'}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/property1.jpg';
          }}
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${
              listing.type === 'sale' ? 'bg-red-600' : 'bg-[#0d1b3e]'
            }`}
          >
            {typeLabel[listing.type]}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-gray-700 shadow-sm">
            {categoryLabel[listing.category]}
          </span>
        </div>
        {listing.isFeatured && (
          <div className="absolute top-3 right-3">
            <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
              <Star className="w-3 h-3 fill-current" />
              Öne Çıkan
            </div>
          </div>
        )}
        {/* Views */}
        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <Eye className="w-3 h-3" />
          {listing.views}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Location */}
        <div className="flex items-center text-gray-500 text-xs mb-2">
          <MapPin className="w-3.5 h-3.5 mr-1 text-red-500" />
          {listing.district}, {listing.city}
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 text-base leading-snug mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
          {listing.title}
        </h3>

        {/* Features */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-1">
            <Maximize2 className="w-3.5 h-3.5 text-gray-400" />
            <span>{listing.area} m²</span>
          </div>
          {listing.rooms && (
            <div className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5 text-gray-400" />
              <span>{listing.rooms}</span>
            </div>
          )}
          {listing.bathrooms && (
            <div className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5 text-gray-400" />
              <span>{listing.bathrooms}</span>
            </div>
          )}
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">
              {listing.type === 'sale' ? 'Satış Fiyatı' : 'Aylık Kira'}
            </p>
            <p className="text-xl font-black text-[#0d1b3e]">
              {formatPrice(listing.price, listing.currency, listing.type)}
            </p>
          </div>
          <div className="w-9 h-9 bg-red-50 group-hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors">
            <ArrowRight className="w-4 h-4 text-red-600 group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
