// Currency symbols mapping
export const currencySymbols = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  INR: '₹',
  AUD: 'A$',
  CAD: 'C$',
  CHF: 'CHF',
  NZD: 'NZ$',
  ZAR: 'R',
  BRL: 'R$',
  RUB: '₽',
  KRW: '₩',
  MXN: '$',
  SGD: 'S$',
  HKD: 'HK$',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
  PLN: 'zł',
  TRY: '₺',
  AED: 'د.إ',
  SAR: '﷼',
  THB: '฿',
  MYR: 'RM',
  IDR: 'Rp',
  PHP: '₱',
  VND: '₫',
  EGP: 'E£',
  NGN: '₦',
  PKR: '₨',
  BDT: '৳',
  // Add more as needed, default will be the currency code itself
};

/**
 * Get currency symbol for a given currency code
 * @param {string} currencyCode - ISO currency code (e.g., 'USD', 'EUR')
 * @returns {string} Currency symbol or code
 */
export const getCurrencySymbol = (currencyCode) => {
  if (!currencyCode) return '$'; // Default to USD
  return currencySymbols[currencyCode.toUpperCase()] || currencyCode;
};

/**
 * Format amount with currency symbol
 * @param {number} amount - Amount to format
 * @param {string} currencyCode - ISO currency code
 * @returns {string} Formatted amount with currency symbol
 */
export const formatCurrency = (amount, currencyCode = 'USD') => {
  const symbol = getCurrencySymbol(currencyCode);
  const formattedAmount = amount.toLocaleString();
  
  // For some currencies, symbol goes after the amount
  const symbolAfter = ['SEK', 'NOK', 'DKK', 'PLN'];
  
  if (symbolAfter.includes(currencyCode?.toUpperCase())) {
    return `${formattedAmount} ${symbol}`;
  }
  
  return `${symbol}${formattedAmount}`;
};
