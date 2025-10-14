import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaChartLine, 
  FaArrowUp, 
  FaArrowDown,
  FaExchangeAlt,
  FaCoins
} from 'react-icons/fa';
import { getCryptoMarketData, getForexRates, formatPrice, formatPercentage } from '../api/cryptoService';

// Crypto Card Component
const CryptoCard = ({ crypto }) => {
  const isPositive = crypto.price_change_percentage_24h >= 0;
  
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 sm:p-4 hover:bg-slate-700/50 transition-all cursor-pointer">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <img src={crypto.image} alt={crypto.name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0" />
          <div className="min-w-0">
            <h3 className="font-bold text-white text-sm sm:text-base truncate">{crypto.name}</h3>
            <p className="text-xs sm:text-sm text-slate-400">{crypto.symbol.toUpperCase()}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-full text-xs sm:text-sm font-semibold flex-shrink-0 ${
          isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
        }`}>
          {isPositive ? <FaArrowUp className="text-xs" /> : <FaArrowDown className="text-xs" />}
          <span className="hidden sm:inline">{formatPercentage(crypto.price_change_percentage_24h)}</span>
        </div>
      </div>
      
      <div className="space-y-1.5 sm:space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-xs sm:text-sm">Price</span>
          <span className="text-white font-semibold text-xs sm:text-base">${formatPrice(crypto.current_price)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-xs sm:text-sm">Market Cap</span>
          <span className="text-slate-300 text-xs sm:text-sm">${(crypto.market_cap / 1e9).toFixed(2)}B</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-xs sm:text-sm">24h Volume</span>
          <span className="text-slate-300 text-xs sm:text-sm">${(crypto.total_volume / 1e9).toFixed(2)}B</span>
        </div>
      </div>
    </div>
  );
};

// Forex Pair Component
const ForexPair = ({ base, quote, rate }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 sm:p-4 hover:bg-slate-700/50 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <FaExchangeAlt className="text-blue-400 text-sm sm:text-base" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-white text-sm sm:text-base">{base}/{quote}</h3>
            <p className="text-xs sm:text-sm text-slate-400">Forex Pair</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-base sm:text-xl font-bold text-white">{rate.toFixed(4)}</p>
          <p className="text-xs text-slate-400 hidden sm:block">Exchange Rate</p>
        </div>
      </div>
    </div>
  );
};

const Markets = () => {
  const [activeTab, setActiveTab] = useState('crypto'); // 'crypto' or 'forex'
  const [cryptoData, setCryptoData] = useState([]);
  const [forexRates, setForexRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMarketData();
    
    // Refresh data every 60 seconds
    const interval = setInterval(fetchMarketData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchMarketData = async () => {
    setLoading(true);
    try {
      const [crypto, forex] = await Promise.all([
        getCryptoMarketData(50),
        getForexRates()
      ]);
      setCryptoData(crypto);
      setForexRates(forex);
    } catch (err) {
      console.error('Failed to load market data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCrypto = cryptoData.filter(crypto =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const majorForexPairs = forexRates ? [
    { base: 'USD', quote: 'EUR', rate: forexRates.EUR },
    { base: 'USD', quote: 'GBP', rate: forexRates.GBP },
    { base: 'USD', quote: 'JPY', rate: forexRates.JPY },
    { base: 'USD', quote: 'CHF', rate: forexRates.CHF },
    { base: 'USD', quote: 'CAD', rate: forexRates.CAD },
    { base: 'USD', quote: 'AUD', rate: forexRates.AUD },
    { base: 'USD', quote: 'NZD', rate: forexRates.NZD },
    { base: 'USD', quote: 'CNY', rate: forexRates.CNY },
  ] : [];

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6 md:space-y-8 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Markets</h1>
          <p className="text-slate-400 mt-1 text-sm sm:text-base">Real-time cryptocurrency and forex prices</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-80 lg:w-96">
          <input
            type="text"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700 overflow-x-auto">
        <button
          onClick={() => setActiveTab('crypto')}
          className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'crypto'
              ? 'text-white border-b-2 border-blue-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FaCoins />
          <span className="hidden sm:inline">Cryptocurrencies</span>
          <span className="sm:hidden">Crypto</span>
        </button>
        <button
          onClick={() => setActiveTab('forex')}
          className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'forex'
              ? 'text-white border-b-2 border-blue-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FaExchangeAlt />
          <span>Forex</span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading market data...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Crypto Tab */}
          {activeTab === 'crypto' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {filteredCrypto.length > 0 ? (
                filteredCrypto.map((crypto) => (
                  <CryptoCard key={crypto.id} crypto={crypto} />
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <FaSearch className="text-6xl text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No cryptocurrencies found</p>
                </div>
              )}
            </div>
          )}

          {/* Forex Tab */}
          {activeTab === 'forex' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {majorForexPairs.map((pair, index) => (
                <ForexPair key={index} {...pair} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Market Stats */}
      {!loading && activeTab === 'crypto' && cryptoData.length > 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
            <FaChartLine className="text-blue-400" />
            Market Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <p className="text-slate-400 text-xs sm:text-sm mb-1">Total Market Cap</p>
              <p className="text-xl sm:text-2xl font-bold text-white">
                ${(cryptoData.reduce((sum, c) => sum + c.market_cap, 0) / 1e12).toFixed(2)}T
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-xs sm:text-sm mb-1">24h Volume</p>
              <p className="text-xl sm:text-2xl font-bold text-white">
                ${(cryptoData.reduce((sum, c) => sum + c.total_volume, 0) / 1e9).toFixed(2)}B
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-xs sm:text-sm mb-1">Bitcoin Dominance</p>
              <p className="text-xl sm:text-2xl font-bold text-white">
                {((cryptoData[0]?.market_cap / cryptoData.reduce((sum, c) => sum + c.market_cap, 0)) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Markets;
