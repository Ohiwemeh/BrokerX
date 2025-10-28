import React, { useState, useEffect } from 'react';
import { walletService } from '../api/services';
import { useProfile } from '../hooks';
import { formatCurrency } from '../utils/currency';
import { 
  FaBullhorn, 
  FaTimes, 
  FaHistory, 
  FaPlus,
  FaArrowCircleUp,
  FaRandom,
  FaArrowCircleDown,
  FaExclamationTriangle,
  FaTradeFederation
} from 'react-icons/fa';

// --- Reusable Sub-Components ---

const PromoBanner = ({ onDismiss }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-blue-500/10 border border-blue-400/30 rounded-xl gap-3">
    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
      <div className="bg-blue-500/20 p-2 sm:p-3 rounded-full flex-shrink-0">
        <FaBullhorn className="text-blue-400 text-lg sm:text-xl" />
      </div>
      <div className="min-w-0">
        <h3 className="font-bold text-white text-sm sm:text-base">Get rewarded for Inviting Friends!</h3>
        <p className="text-xs sm:text-sm text-slate-300">
          Invite a friend to trade & get $50 cash bonus for each successful referral.
        </p>
      </div>
    </div>
    <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
       <button className="bg-blue-600 text-white font-semibold px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg hover:bg-blue-700 transition text-xs sm:text-sm hidden sm:block">
        Invite a friend
      </button>
      <button onClick={onDismiss} className="text-slate-400 hover:text-white">
        <FaTimes className="text-lg sm:text-xl" />
      </button>
    </div>
  </div>
);

const WalletCard = ({ walletId, balance, currency }) => (
  <div>
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-2">
      <h2 className="text-lg sm:text-xl font-bold text-white">Your wallet</h2>
      <a href="#" className="flex items-center gap-2 text-xs sm:text-sm text-blue-400 hover:underline">
        <FaHistory />
        <span className="hidden sm:inline">Transaction history</span>
        <span className="sm:hidden">History</span>
      </a>
    </div>
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="w-full md:w-auto">
        <p className="text-xs sm:text-sm text-slate-400">Wallet balance</p>
        <p className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white">{formatCurrency(balance, currency)}</p>
        <p className="text-xs text-slate-500 font-mono mt-1 truncate">{walletId}</p>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full md:w-auto">
        <button className="flex items-center justify-center gap-2 bg-slate-700/80 px-3 sm:px-4 py-2 rounded-lg hover:bg-slate-600 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm" disabled>
          <FaArrowCircleDown /> <span>Withdraw</span>
        </button>
        <button className="flex items-center justify-center gap-2 bg-slate-700/80 px-3 sm:px-4 py-2 rounded-lg hover:bg-slate-600 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm" disabled>
          <FaRandom /> <span>Transfer</span>
        </button>
        <button className="flex items-center justify-center gap-2 bg-blue-600 px-4 sm:px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-sm">
          <FaArrowCircleUp /> <span>Fund</span>
        </button>
      </div>
    </div>
  </div>
);

const TradingAccountCard = ({ accountId, status, balance, margin, leverage, isActivated, currency }) => (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6 space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
            <div className="w-full lg:w-auto">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <h3 className="text-base sm:text-lg font-bold text-white font-mono truncate">{accountId}</h3>
                    {!isActivated && (
                         <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 w-fit">
                           Not Activated
                        </span>
                    )}
                </div>
                <span className="text-xs text-slate-400">MT5 Hedging</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 text-xs sm:text-sm w-full lg:w-auto">
                <div>
                    <span className="text-slate-400">Balance:</span>
                    <span className="text-white font-semibold ml-2">{formatCurrency(balance, currency)}</span>
                </div>
                 <div>
                    <span className="text-slate-400">Free Margin:</span>
                    <span className="text-white font-semibold ml-2">{formatCurrency(margin, currency)}</span>
                </div>
                 <div>
                    <span className="text-slate-400">Leverage:</span>
                    <span className="text-white font-semibold ml-2">{leverage}</span>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">
                 <button className="flex items-center justify-center gap-2 bg-slate-700/80 px-3 sm:px-4 py-2 rounded-lg hover:bg-slate-600 transition text-sm">
                    <FaArrowCircleUp /> <span>Fund</span>
                </button>
                <button className="flex items-center justify-center gap-2 bg-blue-600 px-4 sm:px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-sm">
                    <FaTradeFederation/> <span>Trade</span>
                </button>
            </div>
        </div>
        {!isActivated && (
            <div className="p-3 bg-yellow-500/10 border border-yellow-400/30 rounded-lg flex items-start gap-3 text-xs sm:text-sm">
                <FaExclamationTriangle className="text-yellow-400 text-lg sm:text-xl flex-shrink-0 mt-0.5" />
                <p className="text-yellow-300">
                    Your account is not currently activated for trading. Please ensure you have sent the required documentation and fund this account.
                </p>
            </div>
        )}
    </div>
);


// --- Main Wallet Page Component ---

const WalletPage = () => {
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [activeTab, setActiveTab] = useState('real'); // 'real' or 'demo'
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: profile, isLoading: profileLoading } = useProfile();

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const data = await walletService.getWallet();
        setWalletData(data);
      } catch (err) {
        console.error('Failed to load wallet data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWalletData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6 md:space-y-8">
      {isBannerVisible && <PromoBanner onDismiss={() => setIsBannerVisible(false)} />}
      
      <WalletCard 
        walletId={walletData?.walletId || 'N/A'} 
        balance={walletData?.balance || 0}
        currency={profile?.currency || 'USD'} 
      />

      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-3">
            <div className="flex border-b border-slate-700 overflow-x-auto w-full sm:w-auto">
                <button 
                    onClick={() => setActiveTab('real')}
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition whitespace-nowrap ${activeTab === 'real' ? 'text-white border-b-2 border-blue-500' : 'text-slate-400 hover:text-white'}`}
                >
                    Real accounts
                </button>
                <button 
                    onClick={() => setActiveTab('demo')}
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition whitespace-nowrap ${activeTab === 'demo' ? 'text-white border-b-2 border-blue-500' : 'text-slate-400 hover:text-white'}`}
                >
                    Demo accounts
                </button>
            </div>
            <a href="#" className="flex items-center gap-2 text-xs sm:text-sm text-blue-400 hover:underline">
                <FaPlus />
                <span>Create Account</span>
            </a>
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
            {activeTab === 'real' && (
                <TradingAccountCard 
                    accountId={walletData?.tradingAccount?.accountId || 'N/A'}
                    status={walletData?.tradingAccount?.isActivated ? 'Activated' : 'Not Activated'}
                    isActivated={walletData?.tradingAccount?.isActivated || false}
                    balance={walletData?.tradingAccount?.balance || 0}
                    margin={walletData?.tradingAccount?.freeMargin || 0}
                    leverage={walletData?.tradingAccount?.leverage || '1:Unlimited'}
                    currency={profile?.currency || 'USD'}
                />
            )}
            {activeTab === 'demo' && (
                <div className="text-center py-10 bg-slate-800 rounded-xl border border-slate-700">
                    <p className="text-slate-400">You have no demo accounts.</p>
                    <button className="mt-2 text-blue-400 font-semibold hover:underline">Create a Demo Account</button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default WalletPage;