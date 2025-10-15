import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { 
  FaBitcoin, 
  FaEthereum, 
 
  FaStar, 
   
  FaArrowCircleUp, 
  FaArrowCircleDown, 
  FaChartLine,
  FaEllipsisH,
  FaPlus,
  FaUser,
  FaCertificate,
  FaExclamationCircle,
  FaTimesCircle
} from 'react-icons/fa';
import {Link} from 'react-router';
import { transactionService, profileService } from '../api/services';
import { getCryptoPrices, formatPrice, formatPercentage } from '../api/cryptoService';
import { formatCurrency } from '../utils/currency';

// --- Reusable Sub-Components ---

// Verification Badge Component
const VerificationBadge = ({ status }) => {
  const statusConfig = {
    'Verified': {
      icon: FaCertificate,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      label: 'Verified'
    },
    'Pending': {
      icon: FaExclamationCircle,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      label: 'Pending Verification'
    },
    'Rejected': {
      icon: FaTimesCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      label: 'Verification Rejected'
    }
  };

  const config = statusConfig[status] || statusConfig['Pending'];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.bgColor} ${config.borderColor}`}>
      <Icon className={`text-sm ${config.color}`} />
      <span className={`text-xs font-semibold ${config.color}`}>{config.label}</span>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, title, value, color = 'text-white' }) => (
  <div className="bg-slate-800 p-4 sm:p-5 rounded-xl border border-slate-700 flex items-start justify-between">
    <div className="min-w-0">
      <p className="text-xs sm:text-sm text-slate-400 mb-1">{title}</p>
      <p className={`text-lg sm:text-xl md:text-2xl font-semibold ${color} truncate`}>{value}</p>
    </div>
    <div className="text-xl sm:text-2xl text-slate-500 flex-shrink-0 ml-2">{icon}</div>
  </div>
);

// Account Status Card with Badge
const AccountStatusCard = ({ status }) => {
  const statusConfig = {
    'Verified': {
      icon: FaCertificate,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/50',
      label: 'Verified',
      starColor: 'text-green-500'
    },
    'Pending': {
      icon: FaExclamationCircle,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/50',
      label: 'Pending',
      starColor: 'text-amber-500'
    },
    'Rejected': {
      icon: FaTimesCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/50',
      label: 'Rejected',
      starColor: 'text-red-500'
    }
  };

  const config = statusConfig[status] || statusConfig['Pending'];
  const Icon = config.icon;

  return (
    <div className={`p-4 sm:p-5 rounded-xl border ${config.bgColor} ${config.borderColor} flex items-start justify-between`}>
      <div className="min-w-0">
        <p className="text-xs sm:text-sm text-slate-400 mb-2">Account Status</p>
        <div className="flex items-center gap-2">
          <Icon className={`text-lg sm:text-xl ${config.color} flex-shrink-0`} />
          <p className={`text-lg sm:text-xl md:text-2xl font-bold ${config.color} truncate`}>{config.label}</p>
        </div>
      </div>
      <FaStar className={`text-xl sm:text-2xl ${config.starColor} flex-shrink-0 ml-2`} />
    </div>
  );
};

// Crypto Asset Row Component
const CryptoAssetRow = ({ icon, name, ticker, price, change, isPositive, loading }) => (
  <div className="bg-slate-800 p-3 sm:p-4 rounded-xl flex justify-between items-center border border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer">
    <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
      <div className="text-2xl sm:text-3xl md:text-4xl flex-shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="font-semibold text-white text-sm sm:text-base truncate">
          {name} <span className="text-slate-400 text-xs sm:text-sm">{ticker}</span>
        </p>
        {loading ? (
          <div className="h-4 sm:h-5 w-20 sm:w-24 bg-slate-700 animate-pulse rounded"></div>
        ) : (
          <p className="text-xs sm:text-sm text-slate-400">${formatPrice(price)}</p>
        )}
      </div>
    </div>
    {loading ? (
      <div className="h-6 sm:h-8 w-12 sm:w-16 bg-slate-700 animate-pulse rounded flex-shrink-0"></div>
    ) : (
      <div className={`text-right flex-shrink-0 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        <p className="font-semibold text-xs sm:text-sm md:text-base">{formatPercentage(change)}</p>
      </div>
    )}
  </div>
);

// Empty State Component
const EmptyState = ({ title, message, buttonText }) => (
    <div className="text-center py-8 sm:py-10 px-4">
        <h3 className="text-base sm:text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm sm:text-base text-slate-400 mt-1">{message}</p>
        <button className="mt-4 bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-700 transition w-full sm:w-auto">
            {buttonText}
        </button>
    </div>
);


// --- Main Dashboard Component ---

const Dashboard = ({
  chartData = [],
}) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [cryptoPrices, setCryptoPrices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cryptoLoading, setCryptoLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashData, profile] = await Promise.all([
          transactionService.getDashboardStats(),
          profileService.getProfile()
        ]);
        setDashboardData(dashData);
        setUserProfile(profile);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchCryptoPrices = async () => {
      try {
        const prices = await getCryptoPrices([
          'bitcoin', 
          'ethereum', 
          'tether', 
          'binancecoin', 
          'solana', 
          'ripple'
        ]);
        setCryptoPrices(prices);
      } catch (err) {
        console.error('Failed to load crypto prices:', err);
      } finally {
        setCryptoLoading(false);
      }
    };

    fetchCryptoPrices();
    
    // Refresh prices every 30 seconds
    const interval = setInterval(fetchCryptoPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const transactions = dashboardData?.transactions || [];
  const profit = dashboardData?.profit || 0;
  const deposit = dashboardData?.totalDeposit || 0;
  const withdrawal = dashboardData?.totalWithdrawal || 0;
  const accountStatus = dashboardData?.accountStatus || 'Active';
  const userCurrency = userProfile?.currency || 'USD';
  
  const hasTransactions = transactions.length > 0;
  const hasChartData = chartData.length > 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-900 text-white font-sans">
      

      <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6 md:space-y-8 overflow-y-auto">
        {/* User Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            {userProfile?.profileImageUrl ? (
              <img 
                src={userProfile.profileImageUrl} 
                alt={userProfile.name} 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-blue-500 flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-600 flex-shrink-0">
                <FaUser className="text-slate-400 text-lg sm:text-xl" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-white truncate">Welcome back, {userProfile?.name || 'User'}!</h2>
                {userProfile?.accountStatus && (
                  <VerificationBadge status={userProfile.accountStatus} />
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-400 truncate">{userProfile?.email}</p>
            </div>
          </div>
          <Link 
            to="/markets" 
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition text-center text-sm sm:text-base"
          >
            View Markets
          </Link>
        </div>

        {/* Header Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          <AccountStatusCard status={accountStatus} />
          <StatCard icon={<FaArrowCircleUp />} title="Deposit" value={formatCurrency(deposit, userCurrency)} />
          <StatCard icon={<FaChartLine />} title="Profit" value={formatCurrency(profit, userCurrency)} color="text-green-400" />
          <StatCard icon={<FaArrowCircleDown />} title="Total Withdrawal" value={formatCurrency(withdrawal, userCurrency)} color="text-red-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
                 {/* Market Activity Chart */}
                <div className="bg-slate-800 rounded-xl p-3 sm:p-4 md:p-6 border border-slate-700 h-64 sm:h-72 md:h-80 flex flex-col">
                    <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4 text-white">Market Activity</h2>
                    {hasChartData ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                                <YAxis stroke="#64748b" fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#cbd5e1' }} />
                                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex-grow flex items-center justify-center">
                            <EmptyState title="No Activity Yet" message="Your portfolio performance will appear here." buttonText="Make a Deposit" />
                        </div>
                    )}
                </div>

                {/* Transactions Table */}
                <div className="bg-slate-800 p-3 sm:p-4 md:p-6 rounded-xl border border-slate-700">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 text-white">Transactions</h2>
                  {hasTransactions ? (
                      <div className="overflow-x-auto -mx-3 sm:mx-0">
                        <table className="w-full text-left text-xs sm:text-sm min-w-[600px]">
                            <thead className="text-slate-400 border-b border-slate-700">
                            <tr>
                                <th className="py-2 sm:py-3 px-2">Date</th>
                                <th className="py-2 sm:py-3 px-2">Transaction ID</th>
                                <th className="py-2 sm:py-3 px-2">Type</th>
                                <th className="py-2 sm:py-3 px-2">Name</th>
                                <th className="py-2 sm:py-3 px-2">Value</th>
                                <th className="py-2 sm:py-3 px-2">Status</th>
                                <th className="py-2 sm:py-3 px-2 text-right">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {transactions.map((tx, index) => (
                                <tr key={index} className="border-b border-slate-800 hover:bg-slate-700/50">
                                <td className="py-3 sm:py-4 px-2 whitespace-nowrap">{tx.date}</td>
                                <td className="font-mono text-slate-400 px-2 whitespace-nowrap">{tx.id}</td>
                                <td className="px-2 whitespace-nowrap">{tx.type}</td>
                                <td className="px-2 whitespace-nowrap">{tx.name}</td>
                                <td className="px-2 whitespace-nowrap">{tx.value}</td>
                                <td className="px-2">
                                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                                        tx.status === "Completed" ? "bg-green-500/20 text-green-400"
                                        : tx.status === "Failed" ? "bg-red-500/20 text-red-400"
                                        : "bg-purple-500/20 text-purple-400"
                                    }`}>
                                    {tx.status}
                                    </span>
                                </td>
                                <td className="text-right px-2">
                                    <FaEllipsisH className="text-slate-400 cursor-pointer hover:text-white inline-block" />
                                </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <div className="flex justify-center mt-4 sm:mt-6">
                            <button className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-700 transition w-full sm:w-auto">
                                View More
                            </button>
                        </div>
                      </div>
                  ) : (
                    <EmptyState title="No Transactions" message="Your recent transactions will be displayed here." buttonText="Start Trading" />
                  )}
                </div>
            </div>
          
            {/* Side Column for Crypto Prices */}
            <div className="lg:col-span-1 space-y-3 sm:space-y-4">
                <CryptoAssetRow 
                  icon={<FaBitcoin className="text-orange-500" />} 
                  name="Bitcoin" 
                  ticker="BTC" 
                  price={cryptoPrices?.bitcoin?.usd || 0} 
                  change={cryptoPrices?.bitcoin?.usd_24h_change || 0} 
                  isPositive={cryptoPrices?.bitcoin?.usd_24h_change >= 0}
                  loading={cryptoLoading}
                />
                <CryptoAssetRow 
                  icon={<FaEthereum className="text-sky-400" />} 
                  name="Ethereum" 
                  ticker="ETH" 
                  price={cryptoPrices?.ethereum?.usd || 0} 
                  change={cryptoPrices?.ethereum?.usd_24h_change || 0} 
                  isPositive={cryptoPrices?.ethereum?.usd_24h_change >= 0}
                  loading={cryptoLoading}
                />
                <CryptoAssetRow 
                  icon={<div className="text-green-500 font-bold text-2xl">₮</div>} 
                  name="Tether" 
                  ticker="USDT" 
                  price={cryptoPrices?.tether?.usd || 0} 
                  change={cryptoPrices?.tether?.usd_24h_change || 0} 
                  isPositive={cryptoPrices?.tether?.usd_24h_change >= 0}
                  loading={cryptoLoading}
                />
                <CryptoAssetRow 
                  icon={<div className="text-yellow-500 font-bold text-2xl">⬡</div>} 
                  name="BNB" 
                  ticker="BNB" 
                  price={cryptoPrices?.binancecoin?.usd || 0} 
                  change={cryptoPrices?.binancecoin?.usd_24h_change || 0} 
                  isPositive={cryptoPrices?.binancecoin?.usd_24h_change >= 0}
                  loading={cryptoLoading}
                />
                <CryptoAssetRow 
                  icon={<div className="text-purple-500 font-bold text-2xl">◎</div>} 
                  name="Solana" 
                  ticker="SOL" 
                  price={cryptoPrices?.solana?.usd || 0} 
                  change={cryptoPrices?.solana?.usd_24h_change || 0} 
                  isPositive={cryptoPrices?.solana?.usd_24h_change >= 0}
                  loading={cryptoLoading}
                />
                <CryptoAssetRow 
                  icon={<div className="text-blue-400 font-bold text-2xl">✕</div>} 
                  name="XRP" 
                  ticker="XRP" 
                  price={cryptoPrices?.ripple?.usd || 0} 
                  change={cryptoPrices?.ripple?.usd_24h_change || 0} 
                  isPositive={cryptoPrices?.ripple?.usd_24h_change >= 0}
                  loading={cryptoLoading}
                />
            </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;