import React, { useState, useEffect } from 'react';
import { walletService } from '../api/services';
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
  <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-400/30 rounded-xl">
    <div className="flex items-center gap-4">
      <div className="bg-blue-500/20 p-3 rounded-full">
        <FaBullhorn className="text-blue-400 text-xl" />
      </div>
      <div>
        <h3 className="font-bold text-white">Get rewarded for Inviting Friends!</h3>
        <p className="text-sm text-slate-300">
          Invite a friend to trade & get $50 cash bonus for each successful referral.
        </p>
      </div>
    </div>
    <div className="flex items-center gap-4">
       <button className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition hidden md:block">
        Invite a friend
      </button>
      <button onClick={onDismiss} className="text-slate-400 hover:text-white">
        <FaTimes className="text-xl" />
      </button>
    </div>
  </div>
);

const WalletCard = ({ walletId, balance }) => (
  <div>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-white">Your wallet</h2>
      <a href="#" className="flex items-center gap-2 text-sm text-blue-400 hover:underline">
        <FaHistory />
        Transaction history
      </a>
    </div>
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
      <div>
        <p className="text-sm text-slate-400">Wallet balance</p>
        <p className="text-4xl font-semibold text-white">${balance.toLocaleString()}</p>
        <p className="text-xs text-slate-500 font-mono mt-1">{walletId}</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 bg-slate-700/80 px-4 py-2 rounded-lg hover:bg-slate-600 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled>
          <FaArrowCircleDown /> Withdraw
        </button>
        <button className="flex items-center gap-2 bg-slate-700/80 px-4 py-2 rounded-lg hover:bg-slate-600 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled>
          <FaRandom /> Transfer
        </button>
        <button className="flex items-center gap-2 bg-blue-600 px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
          <FaArrowCircleUp /> Fund
        </button>
      </div>
    </div>
  </div>
);

const TradingAccountCard = ({ accountId, status, balance, margin, leverage, isActivated }) => (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-white font-mono">{accountId}</h3>
                    {!isActivated && (
                         <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400">
                           Not Activated
                        </span>
                    )}
                </div>
                <span className="text-xs text-slate-400">MT5 Hedging</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
                <div>
                    <span className="text-slate-400">Balance:</span>
                    <span className="text-white font-semibold ml-2">${balance.toLocaleString()}</span>
                </div>
                 <div>
                    <span className="text-slate-400">Free Margin:</span>
                    <span className="text-white font-semibold ml-2">${margin.toLocaleString()}</span>
                </div>
                 <div>
                    <span className="text-slate-400">Leverage:</span>
                    <span className="text-white font-semibold ml-2">{leverage}</span>
                </div>
            </div>
            <div className="flex items-center gap-3">
                 <button className="flex items-center gap-2 bg-slate-700/80 px-4 py-2 rounded-lg hover:bg-slate-600 transition">
                    <FaArrowCircleUp /> Fund
                </button>
                <button className="flex items-center gap-2 bg-blue-600 px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                    <FaTradeFederation/> Trade
                </button>
            </div>
        </div>
        {!isActivated && (
            <div className="p-3 bg-yellow-500/10 border border-yellow-400/30 rounded-lg flex items-center gap-3 text-sm">
                <FaExclamationTriangle className="text-yellow-400 text-xl flex-shrink-0" />
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
    <div className="p-4 md:p-8 space-y-8">
      {isBannerVisible && <PromoBanner onDismiss={() => setIsBannerVisible(false)} />}
      
      <WalletCard 
        walletId={walletData?.walletId || 'N/A'} 
        balance={walletData?.balance || 0} 
      />

      <div>
        <div className="flex justify-between items-center mb-4">
            <div className="flex border-b border-slate-700">
                <button 
                    onClick={() => setActiveTab('real')}
                    className={`px-4 py-2 text-sm font-semibold transition ${activeTab === 'real' ? 'text-white border-b-2 border-blue-500' : 'text-slate-400 hover:text-white'}`}
                >
                    Real accounts
                </button>
                <button 
                    onClick={() => setActiveTab('demo')}
                    className={`px-4 py-2 text-sm font-semibold transition ${activeTab === 'demo' ? 'text-white border-b-2 border-blue-500' : 'text-slate-400 hover:text-white'}`}
                >
                    Demo accounts
                </button>
            </div>
            <a href="#" className="flex items-center gap-2 text-sm text-blue-400 hover:underline">
                <FaPlus />
                Create Account
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