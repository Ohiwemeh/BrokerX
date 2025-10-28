import React, { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router';
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
import { useProfile, useDashboardStats, useTransactions, useCryptoPrices } from '../hooks';

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

// Format transaction for display
const formatTransaction = (tx) => ({
  date: new Date(tx.createdAt).toLocaleDateString(),
  id: tx._id,
  type: tx.type.charAt(0).toUpperCase() + tx.type.slice(1),
  name: tx.method || tx.type,
  value: `$${tx.amount.toLocaleString()}`,
  status: tx.status.charAt(0).toUpperCase() + tx.status.slice(1)
});

// Verification Badge Component
const VerificationBadge = ({ status }) => {
  const config = {
    'Verified': { icon: FaCertificate, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20', label: 'Verified' },
    'Pending': { icon: FaExclamationCircle, color: 'text-amber-400', bgColor: 'bg-amber-500/20', label: 'Pending' },
    'Rejected': { icon: FaTimesCircle, color: 'text-red-400', bgColor: 'bg-red-500/20', label: 'Rejected' }
  }[status] || { icon: FaExclamationCircle, color: 'text-amber-400', bgColor: 'bg-amber-500/20', label: 'Pending' };
  
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${config.bgColor} border border-${config.color.replace('text-', '')}/20`}>
      <Icon className={`text-[10px] ${config.color}`} />
      <span className={`text-[10px] font-bold ${config.color} tracking-wide`}>{config.label}</span>
    </div>
  );
};

// Enhanced Stat Card with animation
const StatCard = ({ icon, title, value, color = 'text-white', trend }) => (
  <div className="bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-900/80 p-4 rounded-2xl border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 group backdrop-blur-sm">
    <div className="flex items-start justify-between mb-3">
      <div className="p-2.5 bg-slate-700/40 rounded-xl group-hover:bg-slate-700/60 transition-all duration-300 group-hover:scale-110">
        <div className="text-lg text-slate-400 group-hover:text-blue-400 transition-colors">{icon}</div>
      </div>
      {trend && (
        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${trend >= 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
          {trend >= 0 ? '↗' : '↘'} {Math.abs(trend)}%
        </span>
      )}
    </div>
    <p className="text-[10px] text-slate-500 mb-1.5 uppercase tracking-widest font-semibold">{title}</p>
    <p className={`text-xl sm:text-2xl font-bold ${color} truncate`}>{value}</p>
  </div>
);

// Crypto Asset Row Component with loading state
const CryptoAssetRow = memo(({ icon, name, ticker, price, change, isPositive, onClick, isSelected, loading }) => (
  <button 
    onClick={onClick}
    disabled={loading}
    className={`w-full bg-gradient-to-br from-slate-800/70 via-slate-800/50 to-slate-900/70 p-4 rounded-xl flex justify-between items-center border transition-all duration-300 hover:shadow-lg backdrop-blur-sm active:scale-[0.98] ${
      isSelected 
        ? 'border-blue-500/60 bg-slate-700/60 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/20' 
        : 'border-slate-700/30 hover:border-slate-600/50'
    } ${loading ? 'opacity-50 cursor-wait' : ''}`}
  >
    <div className="flex items-center gap-3 min-w-0">
      <div className="text-2xl sm:text-3xl flex-shrink-0">{icon}</div>
      <div className="min-w-0 text-left">
        <p className="font-bold text-white text-sm sm:text-base">
          {name} <span className="text-slate-500 text-xs ml-1 font-medium">{ticker}</span>
        </p>
        {loading ? (
          <div className="h-3 w-20 bg-slate-700/50 animate-pulse rounded mt-1"></div>
        ) : (
          <p className="text-xs text-slate-400 mt-0.5 font-medium">${formatPrice(price)}</p>
        )}
      </div>
    </div>
    {loading ? (
      <div className="h-8 w-16 bg-slate-700/50 animate-pulse rounded-lg"></div>
    ) : (
      <div className={`text-right flex-shrink-0 px-3 py-1.5 rounded-lg font-bold ${isPositive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
        <p className="text-xs sm:text-sm">{formatPercentage(change)}</p>
      </div>
    )}
  </button>
));

// Transaction Row Component for mobile
const TransactionRow = ({ tx }) => (
  <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/40 to-slate-900/60 p-4 rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-all backdrop-blur-sm hover:shadow-lg hover:shadow-slate-900/20">
    <div className="flex justify-between items-start mb-2.5">
      <div className="min-w-0 flex-1">
        <p className="font-bold text-white text-sm truncate">{tx.name}</p>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">{tx.type}</p>
      </div>
      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ml-2 flex-shrink-0 ${
        tx.status === "Completed" ? "bg-emerald-500/15 text-emerald-400"
        : tx.status === "Failed" ? "bg-red-500/15 text-red-400"
        : "bg-amber-500/15 text-amber-400"
      }`}>
        {tx.status}
      </span>
    </div>
    <div className="flex justify-between items-center pt-2 border-t border-slate-700/30">
      <span className="text-xs text-slate-500 font-medium">{tx.date}</span>
      <span className="text-sm font-bold text-white">{tx.value}</span>
    </div>
  </div>
);

// Main Dashboard Component
const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [cryptoChartData, setCryptoChartData] = useState([]);

  // TanStack Query hooks
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: dashboardStats, isLoading: statsLoading } = useDashboardStats();
  const { data: transactionsData, isLoading: transactionsLoading } = useTransactions({ limit: 3 });
  const { data: cryptoPrices, isLoading: cryptoLoading, dataUpdatedAt, refetch } = useCryptoPrices();

  // Extract data with fallbacks
  const user = profile || { name: 'User', firstName: 'User', email: '', accountStatus: 'Pending', balance: 0 };
  const displayName = user.firstName || user.name?.split(' ')[0] || 'User';
  const stats = dashboardStats?.stats || { totalDeposit: 0, profit: 0, totalWithdrawal: 0 };
  const transactions = transactionsData?.transactions?.slice(0, 3).map(formatTransaction) || [];

  // Manual refresh function
  const handleRefresh = () => {
    refetch();
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
    if (!dataUpdatedAt) return 'Updating...';
    const seconds = Math.floor((new Date() - dataUpdatedAt) / 1000);
    if (seconds < 60) return `Updated ${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `Updated ${minutes}m ago`;
  };

  // Show loading state
  if (profileLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-t-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pb-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900/70 via-slate-800/50 to-slate-900/70 border-b border-slate-800/50 backdrop-blur-md sticky top-0 z-10 shadow-xl shadow-black/20">
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {user.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt={user.firstName} 
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-blue-500/60 shadow-lg shadow-blue-500/30 flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
                  <FaUser className="text-white text-lg sm:text-xl" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 mb-1">
                  <h2 className="text-base sm:text-lg font-bold text-white truncate">Hi, {displayName}! 👋</h2>
                  <VerificationBadge status={user.accountStatus} />
                </div>
                <p className="text-xs text-slate-500 truncate font-medium">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions - Mobile Optimized */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <button 
              onClick={() => navigate('/depositpage')}
              className="flex flex-col items-center gap-2 p-3 sm:p-4 bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/25 active:scale-95 border border-blue-500/20"
            >
              <FaWallet className="text-lg sm:text-xl" />
              <span className="text-xs sm:text-sm font-bold">Deposit</span>
            </button>
            <button 
              onClick={() => navigate('/markets')}
              className="flex flex-col items-center gap-2 p-3 sm:p-4 bg-gradient-to-br from-emerald-600 via-emerald-600 to-emerald-700 rounded-xl hover:from-emerald-500 hover:to-emerald-600 transition-all shadow-lg shadow-emerald-500/25 active:scale-95 border border-emerald-500/20"
            >
              <FaExchangeAlt className="text-lg sm:text-xl" />
              <span className="text-xs sm:text-sm font-bold">Trade</span>
            </button>
            <button 
              onClick={() => navigate('/withdraw')}
              className="flex flex-col items-center gap-2 p-3 sm:p-4 bg-gradient-to-br from-purple-600 via-purple-600 to-purple-700 rounded-xl hover:from-purple-500 hover:to-purple-600 transition-all shadow-lg shadow-purple-500/25 active:scale-95 border border-purple-500/20"
            >
              <FaArrowCircleDown className="text-lg sm:text-xl" />
              <span className="text-xs sm:text-sm font-bold">Withdraw</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Portfolio Stats */}
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Portfolio Overview</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard 
              icon={<FaWallet />} 
              title="Total Deposit" 
              value={formatCurrency(stats.totalDeposit || 0, user.currency || 'USD')} 
            />
            <StatCard 
              icon={<FaChartLine />} 
              title="Total Profit" 
              value={formatCurrency(stats.profit || 0, user.currency || 'USD')} 
              color="text-emerald-400"
            />
            <StatCard 
              icon={<FaArrowCircleDown />} 
              title="Withdrawals" 
              value={formatCurrency(stats.totalWithdrawal || 0, user.currency || 'USD')} 
              color="text-blue-400"
            />
            <StatCard 
              icon={<FaStar />} 
              title="Account Status" 
              value={user.accountStatus || 'Pending'}
              color="text-emerald-400"
            />
          </div>
        </div>

        {/* Market Activity Chart */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest">Market Activity</h3>
            <button 
              onClick={handleRefresh}
              disabled={cryptoLoading}
              className="flex items-center gap-2 text-xs text-slate-500 hover:text-blue-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-800/50"
            >
              <FaSync className={`${cryptoLoading ? 'animate-spin' : ''} text-xs`} />
              <span className="hidden sm:inline font-medium">{getLastUpdateText()}</span>
            </button>
          </div>
          <div className="bg-gradient-to-br from-slate-800/70 via-slate-800/50 to-slate-900/70 rounded-2xl p-4 sm:p-6 border border-slate-700/30 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white capitalize">{selectedCrypto}</h2>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Last 24 hours</p>
              </div>
              {cryptoPrices && cryptoPrices[selectedCrypto] && (
                <div className={`px-3 py-2 rounded-xl font-bold text-sm ${
                  cryptoPrices[selectedCrypto]?.usd_24h_change >= 0 
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-red-500/15 text-red-400 border border-red-500/20'
                }`}>
                  {formatPercentage(cryptoPrices[selectedCrypto]?.usd_24h_change || 0)}
                </div>
              )}
            </div>
            <div className="h-64 sm:h-80">
              {cryptoLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-blue-500 mx-auto mb-3"></div>
                    <p className="text-sm text-slate-400 font-medium">Loading chart...</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cryptoChartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickMargin={8} />
                    <YAxis stroke="#64748b" fontSize={10} tickMargin={8} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #475569', 
                        borderRadius: '12px',
                        color: '#cbd5e1',
                        padding: '10px 14px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                      }}
                      formatter={(value) => [`$${formatPrice(value)}`, 'Price']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3b82f6" 
                      strokeWidth={2.5} 
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest">Top Cryptocurrencies</h3>
              <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                Live
              </span>
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
                icon={<div className="text-emerald-500 font-bold text-2xl sm:text-3xl">₮</div>} 
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
                icon={<div className="text-yellow-500 font-bold text-2xl sm:text-3xl">⬡</div>} 
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
                icon={<div className="text-purple-500 font-bold text-2xl sm:text-3xl">◎</div>} 
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
                icon={<div className="text-blue-400 font-bold text-2xl sm:text-3xl">✕</div>} 
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
            <h3 className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <FaHistory className="text-sm" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {transactionsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-t-2 border-blue-500 mx-auto"></div>
                </div>
              ) : transactions.length > 0 ? (
                transactions.map((tx, index) => (
                  <TransactionRow key={tx.id || index} tx={tx} />
                ))
              ) : (
                <div className="text-center py-12 text-slate-500 text-sm bg-slate-800/30 rounded-xl border border-slate-700/30">
                  No recent transactions
                </div>
              )}
            </div>
            <button 
              onClick={() => navigate('/transactions')}
              className="w-full mt-4 bg-gradient-to-br from-slate-800/70 to-slate-800/50 hover:from-slate-700/70 hover:to-slate-700/50 text-white py-3.5 rounded-xl font-bold transition-all border border-slate-700/30 hover:border-slate-600/50 active:scale-[0.98] backdrop-blur-sm"
            >
              View All Transactions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;