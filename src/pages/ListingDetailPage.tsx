import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Maximize2,
  Bed,
  Bath,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  MessageSquare,
  Check,
  Eye,
  Calendar,
  Layers,
  Thermometer,
  Star,
  Share2,
  Heart,
  ArrowLeft,
} from 'lucide-react';
import { useListings } from '../context/ListingsContext';
import { useApplications } from '../context/ApplicationsContext';
import { useSettings } from '../context/SettingsContext';

const formatPrice = (price: number, currency: string, type: string) => {
  const formatted = new Intl.NumberFormat('tr-TR').format(price);
  const symbol = currency === 'TRY' ? '₺' : currency === 'USD' ? '$' : '€';
  const suffix = type === 'rent' ? '/ay' : '';
  return `${symbol}${formatted}${suffix}`;
};

const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getListing } = useListings();
  const { addMessage } = useApplications();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const listing = getListing(id!);

  const [activeImage, setActiveImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [formSent, setFormSent] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">İlan bulunamadı.</p>
          <Link
            to="/listings"
            className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm"
          >
            İlanlara Dön
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    addMessage({
      name: contactForm.name,
      email: contactForm.email,
      phone: contactForm.phone,
      subject: `İlan Hakkında: ${listing.title}`,
      message: contactForm.message,
      listingId: listing._id,
    });
    setFormSent(true);
    setFormLoading(false);
  };

  const whatsappMessage = encodeURIComponent(
    `Merhaba Remax Monar, "${listing.title}" ilanı hakkında bilgi almak istiyorum. İlan No: ${listing._id}`
  );
  const whatsappUrl = `https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}?text=${whatsappMessage}`;

  const features = [
    { icon: Maximize2, label: 'Alan', value: `${listing.area} m²` },
    ...(listing.rooms ? [{ icon: Bed, label: 'Oda', value: listing.rooms }] : []),
    ...(listing.bathrooms ? [{ icon: Bath, label: 'Banyo', value: `${listing.bathrooms}` }] : []),
    ...(listing.floor !== undefined ? [{ icon: Layers, label: 'Kat', value: `${listing.floor}/${listing.totalFloors}` }] : []),
    ...(listing.buildingAge !== undefined ? [{ icon: Calendar, label: 'Yaş', value: listing.buildingAge === 0 ? 'Sıfır' : `${listing.buildingAge} Yıl` }] : []),
    ...(listing.heatingType ? [{ icon: Thermometer, label: 'Isıtma', value: listing.heatingType }] : []),
  ];

  const extras = [
    { label: 'Otopark', value: listing.parking },
    { label: 'Asansör', value: listing.elevator },
    { label: 'Balkon', value: listing.balcony },
    { label: 'Eşyalı', value: listing.furnished },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#0d1b3e] pt-24 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Geri Dön
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                    listing.type === 'sale' ? 'bg-red-600' : 'bg-green-600'
                  }`}
                >
                  {listing.type === 'sale' ? 'Satılık' : 'Kiralık'}
                </span>
                {listing.isFeatured && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-400 text-yellow-900 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Öne Çıkan
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{listing.title}</h1>
              <div className="flex items-center text-gray-400 text-sm mt-2">
                <MapPin className="w-4 h-4 mr-1 text-red-400" />
                {listing.address}, {listing.district}, {listing.city}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors ${
                  isLiked ? 'bg-red-600 border-red-600 text-white' : 'border-white/20 text-white/70 hover:border-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              <button className="w-10 h-10 rounded-xl border border-white/20 text-white/70 hover:border-white flex items-center justify-center transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <Eye className="w-4 h-4" />
                {listing.views} görüntülenme
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="relative h-80 sm:h-96">
                <img
                  src={listing.images[activeImage] || '/images/property1.jpg'}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/property1.jpg';
                  }}
                />
                {listing.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage((a) => Math.max(0, a - 1))}
                      disabled={activeImage === 0}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-xl shadow flex items-center justify-center disabled:opacity-30"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setActiveImage((a) => Math.min(listing.images.length - 1, a + 1))}
                      disabled={activeImage === listing.images.length - 1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-xl shadow flex items-center justify-center disabled:opacity-30"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                      {activeImage + 1} / {listing.images.length}
                    </div>
                  </>
                )}
              </div>
              {/* Thumbnails */}
              {listing.images.length > 1 && (
                <div className="flex gap-3 p-4">
                  {listing.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                        i === activeImage ? 'border-red-600' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Fotoğraf ${i + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/property1.jpg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Features Grid */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-[#0d1b3e] text-lg mb-5">Gayrimenkul Özellikleri</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <f.icon className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{f.label}</p>
                      <p className="font-semibold text-gray-900 text-sm">{f.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Extra Features */}
              <div className="mt-5 pt-5 border-t border-gray-100">
                <h3 className="font-semibold text-gray-700 text-sm mb-3">Ek Özellikler</h3>
                <div className="flex flex-wrap gap-3">
                  {extras.map((e, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                        e.value
                          ? 'bg-green-50 text-green-700'
                          : 'bg-gray-100 text-gray-400 line-through'
                      }`}
                    >
                      {e.value ? <Check className="w-3 h-3" /> : null}
                      {e.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-[#0d1b3e] text-lg mb-4">Açıklama</h2>
              <p className="text-gray-600 leading-relaxed text-sm">{listing.description}</p>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-5">
            {/* Price Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-1">
                  {listing.type === 'sale' ? 'Satış Fiyatı' : 'Aylık Kira'}
                </p>
                <p className="text-3xl font-black text-[#0d1b3e]">
                  {formatPrice(listing.price, listing.currency, listing.type)}
                </p>
                <p className="text-xs text-gray-400 mt-1">KDV dahil</p>
              </div>

              <div className="space-y-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold text-sm transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp ile Yaz
                </a>
                <a
                  href={`tel:${listing.agentPhone || settings.phone}`}
                  className="flex items-center justify-center gap-2 w-full bg-[#0d1b3e] hover:bg-[#162347] text-white py-3 rounded-xl font-semibold text-sm transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Hemen Ara
                </a>
              </div>
            </div>

            {/* Agent Card */}
            {listing.agentName && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {listing.agentName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{listing.agentName}</p>
                    <p className="text-xs text-gray-500">Gayrimenkul Danışmanı</p>
                    <div className="flex gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  {listing.agentPhone && (
                    <a
                      href={`tel:${listing.agentPhone}`}
                      className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      {listing.agentPhone}
                    </a>
                  )}
                  {listing.agentEmail && (
                    <a
                      href={`mailto:${listing.agentEmail}`}
                      className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      {listing.agentEmail}
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#0d1b3e] mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-red-600" />
                Bilgi Al
              </h3>

              {formSent ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="font-semibold text-green-700 text-sm">Mesajınız İletildi!</p>
                  <p className="text-gray-500 text-xs mt-1">En kısa sürede dönüş yapacağız.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitContact} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Adınız Soyadınız *"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-500"
                  />
                  <input
                    type="email"
                    placeholder="E-posta *"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-500"
                  />
                  <input
                    type="tel"
                    placeholder="Telefon"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-500"
                  />
                  <textarea
                    placeholder="Mesajınız *"
                    required
                    rows={3}
                    value={contactForm.message}
                    onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-500 resize-none"
                  />
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
                  >
                    {formLoading ? 'Gönderiliyor...' : 'Mesaj Gönder'}
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

export default ListingDetailPage;
