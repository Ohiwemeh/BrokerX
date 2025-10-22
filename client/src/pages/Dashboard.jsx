import React, { useState, useEffect, memo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { 
  FaBitcoin, 
  FaEthereum, 
  FaStar, 
  FaArrowCircleUp, 
  FaArrowCircleDown, 
  FaChartLine,
  FaEllipsisH,
  FaUser,
  FaCertificate,
  FaExclamationCircle,
  FaTimesCircle,
  FaWallet,
  FaExchangeAlt,
  FaHistory,
  FaSync
} from 'react-icons/fa';

// Utility functions
const formatPrice = (price) => {
  if (!price) return '0.00';
  if (price >= 1000) return price.toLocaleString('en-US', { maximumFractionDigits: 2 });
  if (price >= 1) return price.toFixed(2);
  return price.toFixed(6);
};

const formatPercentage = (value) => {
  if (!value) return '+0.00%';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Fetch real crypto prices from CoinGecko API
const fetchCryptoPrices = async () => {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,binancecoin,solana,ripple&vs_currencies=usd&include_24hr_change=true'
    );
    const data = await response.json();
    return {
      bitcoin: { usd: data.bitcoin?.usd || 0, usd_24h_change: data.bitcoin?.usd_24h_change || 0 },
      ethereum: { usd: data.ethereum?.usd || 0, usd_24h_change: data.ethereum?.usd_24h_change || 0 },
      tether: { usd: data.tether?.usd || 0, usd_24h_change: data.tether?.usd_24h_change || 0 },
      binancecoin: { usd: data.binancecoin?.usd || 0, usd_24h_change: data.binancecoin?.usd_24h_change || 0 },
      solana: { usd: data.solana?.usd || 0, usd_24h_change: data.solana?.usd_24h_change || 0 },
      ripple: { usd: data.ripple?.usd || 0, usd_24h_change: data.ripple?.usd_24h_change || 0 }
    };
  } catch (error) {
    console.error('Failed to fetch crypto prices:', error);
    // Return mock data as fallback
    return {
      bitcoin: { usd: 67234.50, usd_24h_change: 2.45 },
      ethereum: { usd: 3456.78, usd_24h_change: -1.23 },
      tether: { usd: 1.00, usd_24h_change: 0.01 },
      binancecoin: { usd: 589.23, usd_24h_change: 1.89 },
      solana: { usd: 145.67, usd_24h_change: 3.21 },
      ripple: { usd: 0.52, usd_24h_change: -0.87 }
    };
  }
};

// Mock user data
const getMockUserData = () => ({
  user: {
    name: 'John Trader',
    email: 'john@example.com',
    profileImageUrl: null,
    accountStatus: 'Verified',
    currency: 'USD'
  },
  stats: {
    totalDeposit: 25000,
    profit: 3750,
    totalWithdrawal: 5000,
    accountStatus: 'Verified'
  },
  transactions: [
    { date: '2025-10-20', id: 'TXN001', type: 'Deposit', name: 'Bank Transfer', value: '$5,000', status: 'Completed' },
    { date: '2025-10-19', id: 'TXN002', type: 'Trade', name: 'BTC/USD', value: '$1,200', status: 'Completed' },
    { date: '2025-10-18', id: 'TXN003', type: 'Withdrawal', name: 'Bank Transfer', value: '$2,000', status: 'Pending' }
  ]
});

// Verification Badge Component
const VerificationBadge = ({ status }) => {
  const config = {
    'Verified': { icon: FaCertificate, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', label: 'Verified' },
    'Pending': { icon: FaExclamationCircle, color: 'text-amber-400', bgColor: 'bg-amber-500/10', label: 'Pending' },
    'Rejected': { icon: FaTimesCircle, color: 'text-red-400', bgColor: 'bg-red-500/10', label: 'Rejected' }
  }[status] || { icon: FaExclamationCircle, color: 'text-amber-400', bgColor: 'bg-amber-500/10', label: 'Pending' };
  
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bgColor}`}>
      <Icon className={`text-xs ${config.color}`} />
      <span className={`text-xs font-semibold ${config.color}`}>{config.label}</span>
    </div>
  );
};

// Enhanced Stat Card with animation
const StatCard = ({ icon, title, value, color = 'text-white', trend }) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 p-4 rounded-2xl border border-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group">
    <div className="flex items-start justify-between mb-3">
      <div className="p-2.5 bg-slate-700/50 rounded-xl group-hover:bg-slate-700 transition-colors">
        <div className="text-xl text-slate-400 group-hover:text-blue-400 transition-colors">{icon}</div>
      </div>
      {trend && (
        <span className={`text-xs font-semibold ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {trend >= 0 ? '↗' : '↘'} {Math.abs(trend)}%
        </span>
      )}
    </div>
    <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider">{title}</p>
    <p className={`text-2xl font-bold ${color} truncate`}>{value}</p>
  </div>
);

// Crypto Asset Row Component with loading state
const CryptoAssetRow = memo(({ icon, name, ticker, price, change, isPositive, onClick, isSelected, loading }) => (
  <button 
    onClick={onClick}
    disabled={loading}
    className={`w-full bg-gradient-to-br from-slate-800 to-slate-800/50 p-3.5 rounded-xl flex justify-between items-center border transition-all duration-300 hover:shadow-lg ${
      isSelected 
        ? 'border-blue-500 bg-slate-700/70 shadow-blue-500/20' 
        : 'border-slate-700/50 hover:border-slate-600'
    } ${loading ? 'opacity-50 cursor-wait' : ''}`}
  >
    <div className="flex items-center gap-3 min-w-0">
      <div className="text-3xl flex-shrink-0">{icon}</div>
      <div className="min-w-0 text-left">
        <p className="font-semibold text-white text-sm">
          {name} <span className="text-slate-500 text-xs ml-1">{ticker}</span>
        </p>
        {loading ? (
          <div className="h-4 w-20 bg-slate-700 animate-pulse rounded mt-1"></div>
        ) : (
          <p className="text-xs text-slate-400 mt-0.5">${formatPrice(price)}</p>
        )}
      </div>
    </div>
    {loading ? (
      <div className="h-8 w-16 bg-slate-700 animate-pulse rounded"></div>
    ) : (
      <div className={`text-right flex-shrink-0 px-2.5 py-1 rounded-lg ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
        <p className="font-bold text-xs">{formatPercentage(change)}</p>
      </div>
    )}
  </button>
));

// Transaction Row Component for mobile
const TransactionRow = ({ tx }) => (
  <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all">
    <div className="flex justify-between items-start mb-2">
      <div>
        <p className="font-semibold text-white text-sm">{tx.name}</p>
        <p className="text-xs text-slate-400 mt-0.5">{tx.type}</p>
      </div>
      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
        tx.status === "Completed" ? "bg-emerald-500/10 text-emerald-400"
        : tx.status === "Failed" ? "bg-red-500/10 text-red-400"
        : "bg-amber-500/10 text-amber-400"
      }`}>
        {tx.status}
      </span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-xs text-slate-500">{tx.date}</span>
      <span className="text-sm font-bold text-white">{tx.value}</span>
    </div>
  </div>
);

// Main Dashboard Component
const Dashboard = () => {
  const [mockData] = useState(getMockUserData());
  const [cryptoPrices, setCryptoPrices] = useState(null);
  const [cryptoLoading, setCryptoLoading] = useState(true);
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [cryptoChartData, setCryptoChartData] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { user, stats, transactions } = mockData;

  // Fetch crypto prices on mount and set up interval
  useEffect(() => {
    const loadPrices = async () => {
      setCryptoLoading(true);
      const prices = await fetchCryptoPrices();
      setCryptoPrices(prices);
      setCryptoLoading(false);
      setLastUpdate(new Date());
    };

    loadPrices();
    
    // Refresh prices every 60 seconds
    const interval = setInterval(loadPrices, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Manual refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true);
    const prices = await fetchCryptoPrices();
    setCryptoPrices(prices);
    setLastUpdate(new Date());
    setIsRefreshing(false);
  };

  // Generate chart data
  useEffect(() => {
    if (!cryptoPrices || !selectedCrypto) return;

    const selectedPrice = cryptoPrices[selectedCrypto]?.usd || 0;
    if (!selectedPrice) return;

    const data = [];
    const now = new Date();
    let currentPrice = selectedPrice;

    for (let i = 12; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 2 * 60 * 60 * 1000);
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      
      const variation = (Math.random() - 0.5) * (selectedPrice * 0.02);
      currentPrice = Math.max(selectedPrice * 0.95, Math.min(selectedPrice * 1.05, currentPrice + variation));
      
      data.push({
        time: `${hours}:${minutes}`,
        value: Math.round(currentPrice * 100) / 100
      });
    }

    setCryptoChartData(data);
  }, [cryptoPrices, selectedCrypto]);

  // Format last update time
  const getLastUpdateText = () => {
    const seconds = Math.floor((new Date() - lastUpdate) / 1000);
    if (seconds < 60) return `Updated ${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `Updated ${minutes}m ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/30 border-b border-slate-800/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {user.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt={user.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow-lg shadow-blue-500/20"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <FaUser className="text-white text-lg" />
                </div>
              )}
              <div className="min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-0.5">
                  <h2 className="text-lg font-bold text-white truncate">Hi, {user.name.split(' ')[0]}! 👋</h2>
                  <VerificationBadge status={user.accountStatus} />
                </div>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions - Mobile Optimized */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <button className="flex flex-col items-center gap-2 p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
              <FaWallet className="text-xl" />
              <span className="text-xs font-semibold">Deposit</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-3 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl hover:from-emerald-500 hover:to-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
              <FaExchangeAlt className="text-xl" />
              <span className="text-xs font-semibold">Trade</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-3 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl hover:from-purple-500 hover:to-purple-600 transition-all shadow-lg shadow-purple-500/20 active:scale-95">
              <FaArrowCircleDown className="text-xl" />
              <span className="text-xs font-semibold">Withdraw</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* Portfolio Stats */}
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Portfolio Overview</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard 
              icon={<FaWallet />} 
              title="Total Deposit" 
              value={formatCurrency(stats.totalDeposit, user.currency)} 
              trend={5.2}
            />
            <StatCard 
              icon={<FaChartLine />} 
              title="Total Profit" 
              value={formatCurrency(stats.profit, user.currency)} 
              color="text-emerald-400"
              trend={12.8}
            />
            <StatCard 
              icon={<FaArrowCircleDown />} 
              title="Withdrawals" 
              value={formatCurrency(stats.totalWithdrawal, user.currency)} 
              color="text-blue-400"
            />
            <StatCard 
              icon={<FaStar />} 
              title="Account Status" 
              value={stats.accountStatus}
              color="text-emerald-400"
            />
          </div>
        </div>

        {/* Market Activity Chart */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Market Activity</h3>
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 text-xs text-slate-400 hover:text-blue-400 transition-colors"
            >
              <FaSync className={`${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{getLastUpdateText()}</span>
            </button>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-2xl p-4 sm:p-6 border border-slate-700/50 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-white capitalize">{selectedCrypto}</h2>
                <p className="text-xs text-slate-400">Last 24 hours</p>
              </div>
              {cryptoPrices && cryptoPrices[selectedCrypto] && (
                <div className={`px-3 py-1.5 rounded-lg font-semibold ${
                  cryptoPrices[selectedCrypto]?.usd_24h_change >= 0 
                    ? 'bg-emerald-500/10 text-emerald-400' 
                    : 'bg-red-500/10 text-red-400'
                }`}>
                  {formatPercentage(cryptoPrices[selectedCrypto]?.usd_24h_change || 0)}
                </div>
              )}
            </div>
            <div className="h-64 sm:h-80">
              {cryptoLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-sm text-slate-400">Loading chart...</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cryptoChartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #475569', 
                        borderRadius: '12px',
                        color: '#cbd5e1',
                        padding: '8px 12px'
                      }}
                      formatter={(value) => [`$${formatPrice(value)}`, 'Price']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3b82f6" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Crypto Assets */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Top Cryptocurrencies</h3>
              <span className="text-xs text-emerald-400 animate-pulse">● Live</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CryptoAssetRow 
                icon={<FaBitcoin className="text-orange-500" />} 
                name="Bitcoin" 
                ticker="BTC" 
                price={cryptoPrices?.bitcoin?.usd || 0} 
                change={cryptoPrices?.bitcoin?.usd_24h_change || 0} 
                isPositive={(cryptoPrices?.bitcoin?.usd_24h_change || 0) >= 0}
                onClick={() => setSelectedCrypto('bitcoin')}
                isSelected={selectedCrypto === 'bitcoin'}
                loading={cryptoLoading}
              />
              <CryptoAssetRow 
                icon={<FaEthereum className="text-sky-400" />} 
                name="Ethereum" 
                ticker="ETH" 
                price={cryptoPrices?.ethereum?.usd || 0} 
                change={cryptoPrices?.ethereum?.usd_24h_change || 0} 
                isPositive={(cryptoPrices?.ethereum?.usd_24h_change || 0) >= 0}
                onClick={() => setSelectedCrypto('ethereum')}
                isSelected={selectedCrypto === 'ethereum'}
                loading={cryptoLoading}
              />
              <CryptoAssetRow 
                icon={<div className="text-emerald-500 font-bold text-3xl">₮</div>} 
                name="Tether" 
                ticker="USDT" 
                price={cryptoPrices?.tether?.usd || 0} 
                change={cryptoPrices?.tether?.usd_24h_change || 0} 
                isPositive={(cryptoPrices?.tether?.usd_24h_change || 0) >= 0}
                onClick={() => setSelectedCrypto('tether')}
                isSelected={selectedCrypto === 'tether'}
                loading={cryptoLoading}
              />
              <CryptoAssetRow 
                icon={<div className="text-yellow-500 font-bold text-3xl">⬡</div>} 
                name="BNB" 
                ticker="BNB" 
                price={cryptoPrices?.binancecoin?.usd || 0} 
                change={cryptoPrices?.binancecoin?.usd_24h_change || 0} 
                isPositive={(cryptoPrices?.binancecoin?.usd_24h_change || 0) >= 0}
                onClick={() => setSelectedCrypto('binancecoin')}
                isSelected={selectedCrypto === 'binancecoin'}
                loading={cryptoLoading}
              />
              <CryptoAssetRow 
                icon={<div className="text-purple-500 font-bold text-3xl">◎</div>} 
                name="Solana" 
                ticker="SOL" 
                price={cryptoPrices?.solana?.usd || 0} 
                change={cryptoPrices?.solana?.usd_24h_change || 0} 
                isPositive={(cryptoPrices?.solana?.usd_24h_change || 0) >= 0}
                onClick={() => setSelectedCrypto('solana')}
                isSelected={selectedCrypto === 'solana'}
                loading={cryptoLoading}
              />
              <CryptoAssetRow 
                icon={<div className="text-blue-400 font-bold text-3xl">✕</div>} 
                name="XRP" 
                ticker="XRP" 
                price={cryptoPrices?.ripple?.usd || 0} 
                change={cryptoPrices?.ripple?.usd_24h_change || 0} 
                isPositive={(cryptoPrices?.ripple?.usd_24h_change || 0) >= 0}
                onClick={() => setSelectedCrypto('ripple')}
                isSelected={selectedCrypto === 'ripple'}
                loading={cryptoLoading}
              />
            </div>
          </div>

          {/* Recent Transactions */}
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FaHistory />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {transactions.map((tx, index) => (
                <TransactionRow key={index} tx={tx} />
              ))}
            </div>
            <button className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-semibold transition-all border border-slate-700/50 hover:border-slate-600">
              View All Transactions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;