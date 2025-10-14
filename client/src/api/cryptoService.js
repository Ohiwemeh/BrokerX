// Crypto and Forex Price Service
import axios from 'axios';

// Using CoinGecko API (free, no API key required)
const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// Using ExchangeRate API for forex (free tier)
const FOREX_API = 'https://api.exchangerate-api.com/v4/latest/USD';

/**
 * Fetch cryptocurrency prices
 * @param {Array} coinIds - Array of coin IDs (e.g., ['bitcoin', 'ethereum'])
 * @returns {Promise<Object>} - Price data
 */
export const getCryptoPrices = async (coinIds = ['bitcoin', 'ethereum', 'tether', 'binancecoin', 'cardano', 'solana']) => {
  try {
    const response = await axios.get(`${COINGECKO_API}/simple/price`, {
      params: {
        ids: coinIds.join(','),
        vs_currencies: 'usd',
        include_24hr_change: true,
        include_24hr_vol: true,
        include_market_cap: true
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    throw error;
  }
};

/**
 * Fetch detailed crypto market data
 * @param {number} limit - Number of coins to fetch
 * @returns {Promise<Array>} - Array of crypto data
 */
export const getCryptoMarketData = async (limit = 20) => {
  try {
    const response = await axios.get(`${COINGECKO_API}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: limit,
        page: 1,
        sparkline: true,
        price_change_percentage: '24h,7d'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching crypto market data:', error);
    throw error;
  }
};

/**
 * Fetch forex rates
 * @returns {Promise<Object>} - Forex rates
 */
export const getForexRates = async () => {
  try {
    const response = await axios.get(FOREX_API);
    return response.data.rates;
  } catch (error) {
    console.error('Error fetching forex rates:', error);
    throw error;
  }
};

/**
 * Format price with appropriate decimals
 * @param {number} price - Price to format
 * @returns {string} - Formatted price
 */
export const formatPrice = (price) => {
  if (price >= 1000) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else if (price >= 1) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  } else {
    return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 8 });
  }
};

/**
 * Format percentage change
 * @param {number} change - Percentage change
 * @returns {string} - Formatted percentage
 */
export const formatPercentage = (change) => {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
};

/**
 * Get crypto icon URL
 * @param {string} symbol - Crypto symbol
 * @returns {string} - Icon URL
 */
export const getCryptoIcon = (symbol) => {
  const icons = {
    BTC: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    ETH: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    USDT: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
    BNB: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
    ADA: 'https://cryptologos.cc/logos/cardano-ada-logo.png',
    SOL: 'https://cryptologos.cc/logos/solana-sol-logo.png',
    XRP: 'https://cryptologos.cc/logos/xrp-xrp-logo.png',
    DOT: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png',
  };
  return icons[symbol.toUpperCase()] || 'https://cryptologos.cc/logos/generic-crypto-logo.png';
};

export default {
  getCryptoPrices,
  getCryptoMarketData,
  getForexRates,
  formatPrice,
  formatPercentage,
  getCryptoIcon
};
