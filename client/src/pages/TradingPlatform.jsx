import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { createChart, ColorType } from 'lightweight-charts';
import { 
  FaBitcoin, 
  FaEthereum,
  FaChartLine,
  FaChartBar,
  FaExpand,
  FaBell,
  FaStar,
  FaRegStar,
  FaPlay,
  FaPause,
  FaSearch,
  FaClock,
  FaExchangeAlt,
  FaArrowUp,
  FaArrowDown,
  FaTimes
} from 'react-icons/fa';
import { getCryptoPrices, formatPrice, formatPercentage } from '../api/cryptoService';
import { formatCurrency } from '../utils/currency';
import { useStorageCleanup } from '../hooks/useStorageCleanup';

// Crypto icon mapping
const cryptoIcons = {
  'bitcoin': { icon: <FaBitcoin className="text-orange-500" />, color: '#f7931a', symbol: 'BTC' },
  'ethereum': { icon: <FaEthereum className="text-sky-400" />, color: '#627eea', symbol: 'ETH' },
  'tether': { icon: <div className="text-green-500 font-bold text-xl">₮</div>, color: '#26a17b', symbol: 'USDT' },
  'binancecoin': { icon: <div className="text-yellow-500 font-bold text-xl">⬡</div>, color: '#f3ba2f', symbol: 'BNB' },
  'solana': { icon: <div className="text-purple-500 font-bold text-xl">◎</div>, color: '#9945ff', symbol: 'SOL' },
  'ripple': { icon: <div className="text-blue-400 font-bold text-xl">✕</div>, color: '#23292f', symbol: 'XRP' }
};

const TradingPlatform = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  
  const [cryptoData, setCryptoData] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState(symbol || 'bitcoin');
  const [timeframe, setTimeframe] = useState('1D');
  const [chartType, setChartType] = useState('area'); // Changed to 'area' as default to avoid candlestick API issues
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orderType, setOrderType] = useState('buy');
  const [orderAmount, setOrderAmount] = useState('');
  const [orderPrice, setOrderPrice] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Enable storage cleanup
  useStorageCleanup();
  
  // Market data for the watchlist
  const [marketData, setMarketData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Generate realistic candlestick data
  const generateCandlestickData = (basePrice, days = 365) => {
    const data = [];
    let currentPrice = basePrice;
    const now = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const open = currentPrice;
      const volatility = basePrice * 0.02; // 2% volatility
      const change = (Math.random() - 0.5) * volatility;
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * volatility * 0.5;
      const low = Math.min(open, close) - Math.random() * volatility * 0.5;
      
      data.push({
        time: date.getTime() / 1000,
        open,
        high,
        low,
        close
      });
      
      currentPrice = close;
    }
    
    return data;
  };

  // Fetch crypto prices with caching
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check cache first
        const cachedData = sessionStorage.getItem('trading_crypto_data');
        const cacheTime = sessionStorage.getItem('trading_cache_time');
        const now = Date.now();
        
        if (cachedData && cacheTime && (now - parseInt(cacheTime)) < 30000) {
          const cached = JSON.parse(cachedData);
          setMarketData(cached.marketData);
          setCryptoData(cached.prices[selectedCrypto]);
          setLoading(false);
          return;
        }

        setLoading(true);
        const prices = await getCryptoPrices([
          'bitcoin', 
          'ethereum', 
          'tether', 
          'binancecoin', 
          'solana', 
          'ripple'
        ]);
        
        const market = Object.keys(prices).map(key => ({
          id: key,
          name: key.charAt(0).toUpperCase() + key.slice(1),
          symbol: cryptoIcons[key]?.symbol || key.toUpperCase(),
          price: prices[key].usd,
          change: prices[key].usd_24h_change,
          volume: prices[key].usd_24h_vol,
          icon: cryptoIcons[key]?.icon
        }));
        
        setMarketData(market);
        setCryptoData(prices[selectedCrypto]);
        
        // Cache the data
        sessionStorage.setItem('trading_crypto_data', JSON.stringify({ marketData: market, prices }));
        sessionStorage.setItem('trading_cache_time', now.toString());
      } catch (err) {
        console.error('Failed to load crypto data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [selectedCrypto]);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current || !cryptoData) return;

    try {
      // Clear previous chart
      if (chartRef.current) {
        chartRef.current.remove();
      }

      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: '#1e293b' },
          textColor: '#94a3b8',
        },
        grid: {
          vertLines: { color: '#334155' },
          horzLines: { color: '#334155' },
        },
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
          borderColor: '#334155',
        },
        rightPriceScale: {
          borderColor: '#334155',
        },
        crosshair: {
          mode: 1,
        },
      });

      // Verify chart methods are available
      console.log('Chart methods:', {
        hasAddCandlestickSeries: typeof chart.addCandlestickSeries === 'function',
        hasAddLineSeries: typeof chart.addLineSeries === 'function',
        hasAddAreaSeries: typeof chart.addAreaSeries === 'function',
        chartType: chartType
      });

      let series;
      const candleData = generateCandlestickData(cryptoData.usd);
      const areaColor = cryptoIcons[selectedCrypto]?.color || '#3b82f6';

      // Create appropriate series based on chart type
      if (chartType === 'candlestick') {
        if (typeof chart.addCandlestickSeries !== 'function') {
          console.error('addCandlestickSeries is not available, falling back to area chart');
          series = chart.addAreaSeries({
            topColor: areaColor + '80',
            bottomColor: areaColor + '10',
            lineColor: areaColor,
            lineWidth: 2,
          });
          series.setData(candleData.map(d => ({ time: d.time, value: d.close })));
        } else {
          series = chart.addCandlestickSeries({
            upColor: '#22c55e',
            downColor: '#ef4444',
            borderUpColor: '#22c55e',
            borderDownColor: '#ef4444',
            wickUpColor: '#22c55e',
            wickDownColor: '#ef4444',
          });
          series.setData(candleData);
        }
      } else if (chartType === 'line') {
        series = chart.addLineSeries({
          color: areaColor,
          lineWidth: 2,
        });
        series.setData(candleData.map(d => ({ time: d.time, value: d.close })));
      } else {
        // Default to area chart
        series = chart.addAreaSeries({
          topColor: areaColor + '80',
          bottomColor: areaColor + '10',
          lineColor: areaColor,
          lineWidth: 2,
        });
        series.setData(candleData.map(d => ({ time: d.time, value: d.close })));
      }

      chart.timeScale().fitContent();

      chartRef.current = chart;
      seriesRef.current = series;

      // Handle resize
      const handleResize = () => {
        if (chartContainerRef.current && chartRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (chartRef.current) {
          chartRef.current.remove();
        }
      };
    } catch (error) {
      console.error('Error creating chart:', error);
      console.error('Chart type:', chartType);
      console.error('Crypto data:', cryptoData);
      setLoading(false);
    }
  }, [cryptoData, chartType, selectedCrypto]);

  const handleCryptoChange = useCallback((cryptoId) => {
    setSelectedCrypto(cryptoId);
    navigate(`/trade/${cryptoId}`);
  }, [navigate]);

  const handlePlaceOrder = useCallback(() => {
    setShowOrderModal(true);
  }, []);

  const confirmOrder = useCallback(() => {
    // Handle order placement logic here
    console.log('Order placed:', { orderType, orderAmount, orderPrice });
    setShowOrderModal(false);
    setOrderAmount('');
    setOrderPrice('');
  }, [orderType, orderAmount, orderPrice]);

  const filteredMarketData = useMemo(() => 
    marketData.filter(crypto =>
      crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [marketData, searchQuery]
  );

  if (loading && !cryptoData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading trading platform...</p>
        </div>
      </div>
    );
  }

  const currentCrypto = marketData.find(c => c.id === selectedCrypto);
  const isPositive = currentCrypto?.change >= 0;

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Top Navigation Bar */}
      <div className="bg-slate-800 border-b border-slate-700 px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-6 min-w-0">
            {/* Logo */}
            <h1 className="text-lg sm:text-xl font-bold text-blue-500">pinnacletradefx</h1>
            
            {/* Current Asset Info */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="text-xl sm:text-2xl flex-shrink-0">{currentCrypto?.icon}</div>
              <div className="min-w-0">
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="font-semibold text-sm sm:text-lg">{currentCrypto?.symbol}</span>
                  <span className="text-slate-400 text-xs sm:text-sm hidden sm:inline">/ USD</span>
                  <button onClick={() => setIsFavorite(!isFavorite)} className="text-yellow-500 text-sm sm:text-base">
                    {isFavorite ? <FaStar /> : <FaRegStar />}
                  </button>
                </div>
                <div className="flex items-center gap-1 sm:gap-3">
                  <span className="text-base sm:text-2xl font-bold">${formatPrice(currentCrypto?.price)}</span>
                  <span className={`flex items-center gap-1 text-xs sm:text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? <FaArrowUp /> : <FaArrowDown />}
                    {formatPercentage(currentCrypto?.change)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <button className="p-1.5 sm:p-2 hover:bg-slate-700 rounded-lg transition">
              <FaBell className="text-slate-400 text-sm sm:text-base" />
            </button>
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 sm:p-2 hover:bg-slate-700 rounded-lg transition hidden sm:block"
            >
              <FaExpand className="text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden flex-col md:flex-row">
        {/* Left Sidebar - Watchlist (Hidden on mobile) */}
        <div className="hidden md:flex md:w-64 bg-slate-800 border-r border-slate-700 flex-col">
          <div className="p-4 border-b border-slate-700">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search markets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase px-2 mb-2">Markets</h3>
              {filteredMarketData.map((crypto) => (
                <button
                  key={crypto.id}
                  onClick={() => handleCryptoChange(crypto.id)}
                  className={`w-full p-3 rounded-lg mb-1 transition ${
                    selectedCrypto === crypto.id 
                      ? 'bg-slate-700 border border-blue-500' 
                      : 'hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="text-xl">{crypto.icon}</div>
                      <div className="text-left">
                        <div className="font-semibold text-sm">{crypto.symbol}</div>
                        <div className="text-xs text-slate-400">{crypto.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">${formatPrice(crypto.price)}</div>
                      <div className={`text-xs ${crypto.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatPercentage(crypto.change)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center - Chart Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Chart Controls */}
          <div className="bg-slate-800 border-b border-slate-700 px-2 sm:px-4 py-2 flex items-center justify-between overflow-x-auto">
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Timeframe Selector */}
              {['1m', '5m', '15m', '1H', '4H', '1D', '1W', '1M'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                    timeframe === tf 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 sm:gap-2 ml-2 flex-shrink-0">
              {/* Chart Type Selector */}
              <button
                onClick={() => setChartType('candlestick')}
                className={`p-1.5 sm:p-2 rounded transition ${
                  chartType === 'candlestick' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-400 hover:bg-slate-700'
                }`}
                title="Candlestick"
              >
                <FaChartBar className="text-sm sm:text-base" />
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`p-1.5 sm:p-2 rounded transition ${
                  chartType === 'line' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-400 hover:bg-slate-700'
                }`}
                title="Line"
              >
                <FaChartLine className="text-sm sm:text-base" />
              </button>
              <button
                onClick={() => setChartType('area')}
                className={`p-1.5 sm:p-2 rounded transition ${
                  chartType === 'area' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-400 hover:bg-slate-700'
                }`}
                title="Area"
              >
                <FaChartLine className="text-sm sm:text-base" />
              </button>
            </div>
          </div>

          {/* Chart */}
          <div className="flex-1 bg-slate-900 relative">
            <div ref={chartContainerRef} className="absolute inset-0" />
          </div>

          {/* Market Stats Bar */}
          <div className="bg-slate-800 border-t border-slate-700 px-2 sm:px-4 py-2 sm:py-3 overflow-x-auto">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4 text-xs sm:text-sm min-w-max sm:min-w-0">
              <div>
                <div className="text-slate-400 text-xs mb-1">24h Volume</div>
                <div className="font-semibold">${currentCrypto?.volume ? (currentCrypto.volume / 1e9).toFixed(2) + 'B' : 'N/A'}</div>
              </div>
              <div>
                <div className="text-slate-400 text-xs mb-1">24h High</div>
                <div className="font-semibold text-green-400">${formatPrice(currentCrypto?.price * 1.05)}</div>
              </div>
              <div>
                <div className="text-slate-400 text-xs mb-1">24h Low</div>
                <div className="font-semibold text-red-400">${formatPrice(currentCrypto?.price * 0.95)}</div>
              </div>
              <div className="hidden sm:block">
                <div className="text-slate-400 text-xs mb-1">Market Cap</div>
                <div className="font-semibold">${currentCrypto?.volume ? (currentCrypto.volume * 50 / 1e9).toFixed(2) + 'B' : 'N/A'}</div>
              </div>
              <div className="hidden sm:block">
                <div className="text-slate-400 text-xs mb-1">Trading Volume (24h)</div>
                <div className="font-semibold">{currentCrypto?.volume ? (currentCrypto.volume / currentCrypto.price / 1e6).toFixed(2) + 'M' : 'N/A'} {currentCrypto?.symbol}</div>
              </div>
              <div className="hidden sm:block">
                <div className="text-slate-400 text-xs mb-1">Average Volume (24h)</div>
                <div className="font-semibold">{currentCrypto?.volume ? (currentCrypto.volume / 1e9 * 0.8).toFixed(2) + 'B' : 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Order Panel (Hidden on mobile, shown as bottom sheet) */}
        <div className="hidden lg:flex lg:w-80 bg-slate-800 border-l border-slate-700 flex-col">
          {/* Order Type Tabs */}
          <div className="flex border-b border-slate-700">
            <button
              onClick={() => setOrderType('buy')}
              className={`flex-1 py-3 font-semibold transition ${
                orderType === 'buy' 
                  ? 'bg-green-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-700'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setOrderType('sell')}
              className={`flex-1 py-3 font-semibold transition ${
                orderType === 'sell' 
                  ? 'bg-red-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-700'
              }`}
            >
              Sell
            </button>
          </div>

          {/* Order Form */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {/* Available Balance */}
              <div className="bg-slate-700 p-3 rounded-lg">
                <div className="text-xs text-slate-400 mb-1">Available Balance</div>
                <div className="text-lg font-bold">$10,000.00</div>
              </div>

              {/* Price Input */}
              <div>
                <label className="block text-sm font-semibold mb-2">Price (USD)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={orderPrice || currentCrypto?.price}
                    onChange={(e) => setOrderPrice(e.target.value)}
                    placeholder={`${currentCrypto?.price}`}
                    className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm">
                    USD
                  </span>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-semibold mb-2">Amount ({currentCrypto?.symbol})</label>
                <div className="relative">
                  <input
                    type="number"
                    value={orderAmount}
                    onChange={(e) => setOrderAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm">
                    {currentCrypto?.symbol}
                  </span>
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {['25%', '50%', '75%', '100%'].map((percent) => (
                  <button
                    key={percent}
                    onClick={() => {
                      const balance = 10000;
                      const price = orderPrice || currentCrypto?.price;
                      const amount = (balance * parseFloat(percent) / 100) / price;
                      setOrderAmount(amount.toFixed(6));
                    }}
                    className="bg-slate-700 hover:bg-slate-600 py-2 rounded text-sm font-semibold transition"
                  >
                    {percent}
                  </button>
                ))}
              </div>

              {/* Total */}
              <div className="bg-slate-700 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Total</span>
                  <span className="text-lg font-bold">
                    ${((orderAmount || 0) * (orderPrice || currentCrypto?.price || 0)).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                className={`w-full py-3 rounded-lg font-bold text-white transition ${
                  orderType === 'buy' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {orderType === 'buy' ? 'Buy' : 'Sell'} {currentCrypto?.symbol}
              </button>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="border-t border-slate-700 p-4">
            <h3 className="text-sm font-semibold mb-3">Recent Orders</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 bg-slate-700 rounded">
                <div>
                  <div className="font-semibold text-green-400">BUY</div>
                  <div className="text-slate-400">0.5 BTC</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">$25,000</div>
                  <div className="text-slate-400">Completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4 border border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Confirm Order</h3>
              <button onClick={() => setShowOrderModal(false)} className="text-slate-400 hover:text-white">
                <FaTimes />
              </button>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-400">Type</span>
                <span className={`font-semibold ${orderType === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                  {orderType.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Asset</span>
                <span className="font-semibold">{currentCrypto?.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount</span>
                <span className="font-semibold">{orderAmount} {currentCrypto?.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Price</span>
                <span className="font-semibold">${formatPrice(orderPrice || currentCrypto?.price)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-700">
                <span className="text-slate-400">Total</span>
                <span className="font-bold text-lg">
                  ${((orderAmount || 0) * (orderPrice || currentCrypto?.price || 0)).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowOrderModal(false)}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmOrder}
                className={`flex-1 py-3 rounded-lg font-semibold text-white transition ${
                  orderType === 'buy' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Floating Action Buttons */}
      <div className="lg:hidden fixed bottom-4 right-4 flex gap-2">
        <button
          onClick={() => { setOrderType('sell'); setShowOrderModal(true); }}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition"
        >
          Sell
        </button>
        <button
          onClick={() => { setOrderType('buy'); setShowOrderModal(true); }}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition"
        >
          Buy
        </button>
      </div>
    </div>
  );
};

export default TradingPlatform;
