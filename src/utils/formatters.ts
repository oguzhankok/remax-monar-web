/**
 * Format price with currency symbol
 */
export const formatPrice = (price: number, currency: string = 'TRY', type?: string): string => {
  const formatted = new Intl.NumberFormat('tr-TR').format(price);
  const symbol = currency === 'TRY' ? '₺' : currency === 'USD' ? '$' : '€';
  const suffix = type === 'rent' ? '/ay' : '';
  return `${symbol}${formatted}${suffix}`;
};

/**
 * Format date to Turkish locale
 */
export const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Format date-time to Turkish locale
 */
export const formatDateTime = (dateStr: string): string => {
  return new Date(dateStr).toLocaleString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Truncate text to given length
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Category labels in Turkish
 */
export const categoryLabel: Record<string, string> = {
  residential: 'Konut',
  land: 'Arsa',
  commercial: 'Ticari',
};

/**
 * Type labels in Turkish
 */
export const typeLabel: Record<string, string> = {
  sale: 'Satılık',
  rent: 'Kiralık',
};

/**
 * Experience labels in Turkish
 */
export const experienceLabel: Record<string, string> = {
  none: 'Deneyimsiz',
  '1-3': '1-3 Yıl',
  '3-5': '3-5 Yıl',
  '5+': '5 Yıl ve Üzeri',
};

/**
 * Application status labels in Turkish
 */
export const applicationStatusLabel: Record<string, string> = {
  new: 'Yeni',
  reviewed: 'İncelendi',
  contacted: 'İletişime Geçildi',
  rejected: 'Reddedildi',
};
