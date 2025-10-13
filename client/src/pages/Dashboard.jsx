import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { 
  FaBitcoin, 
  FaEthereum, 
 
  FaStar, 
   
  FaArrowCircleUp, 
  FaArrowCircleDown, 
  FaChartLine,
  FaEllipsisH,
  FaPlus
} from 'react-icons/fa';
import {Link} from 'react-router'


// --- Reusable Sub-Components ---




// Stat Card Component
const StatCard = ({ icon, title, value, color = 'text-white' }) => (
  <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex items-start justify-between">
    <div>
      <p className="text-sm text-slate-400 mb-1">{title}</p>
      <p className={`text-2xl font-semibold ${color}`}>{value}</p>
    </div>
    <div className="text-2xl text-slate-500">{icon}</div>
  </div>
);

// Crypto Asset Row Component
const CryptoAssetRow = ({ icon, name, ticker, price, change, isPositive }) => (
  <div className="bg-slate-800 p-4 rounded-xl flex justify-between items-center border border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer">
    <div className="flex items-center gap-4">
      <div className="text-4xl">{icon}</div>
      <div>
        <p className="font-semibold text-white">{name} <span className="text-slate-400">{ticker}</span></p>
        <p className="text-slate-200">${price.toLocaleString()}</p>
      </div>
    </div>
    <div className={`px-3 py-1 text-sm font-medium rounded-full ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
      {isPositive ? '+' : ''}{change}%
    </div>
  </div>
);

// Empty State Component
const EmptyState = ({ title, message, buttonText }) => (
    <div className="text-center py-10">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-slate-400 mt-1">{message}</p>
       <Link 
  to="/depositpage" 
  className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
>
  <FaPlus/> {buttonText}
</Link>
    </div>
);


// --- Main Dashboard Component ---

const Dashboard = ({
  chartData = [],
  bitcoinPrice = 45000.00, // Example data
  ethereumPrice = 3200.00, // Example data
  profit = 1250.75, // Example data
  deposit = 5000.00, // Example data
  withdrawal = 1200.00, // Example data
  transactions = [] // Start with empty transactions
}) => {
  const hasTransactions = transactions.length > 0;
  const hasChartData = chartData.length > 0;

  return (
    <div className="min-h-screen flex bg-slate-900 text-white font-sans">
      

      <main className="flex-1 p-4 md:p-8 space-y-8 overflow-y-auto">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<FaStar />} title="Account Status" value="Active" color="text-blue-400" />
          <StatCard icon={<FaArrowCircleUp />} title="Deposit" value={`₱${deposit.toLocaleString()}`} />
          <StatCard icon={<FaChartLine />} title="Profit" value={`₱${profit.toLocaleString()}`} color="text-green-400" />
          <StatCard icon={<FaArrowCircleDown />} title="Total Withdrawal" value={`₱${withdrawal.toLocaleString()}`} color="text-red-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                 {/* Market Activity Chart */}
                <div className="bg-slate-800 rounded-xl p-4 md:p-6 border border-slate-700 h-80 flex flex-col">
                    <h2 className="text-lg font-semibold mb-4 text-white">Market Activity</h2>
                    {hasChartData ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
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
                <div className="bg-slate-800 p-4 md:p-6 rounded-xl border border-slate-700">
                  <h2 className="text-xl font-semibold mb-4 text-white">Transactions</h2>
                  {hasTransactions ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="text-slate-400 border-b border-slate-700">
                            <tr>
                                <th className="py-3 px-2">Date</th>
                                <th className="py-3 px-2">Transaction ID</th>
                                <th className="py-3 px-2">Type</th>
                                <th className="py-3 px-2">Name</th>
                                <th className="py-3 px-2">Value</th>
                                <th className="py-3 px-2">Status</th>
                                <th className="py-3 px-2 text-right">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {transactions.map((tx, index) => (
                                <tr key={index} className="border-b border-slate-800 hover:bg-slate-700/50">
                                <td className="py-4 px-2">{tx.date}</td>
                                <td className="font-mono text-slate-400 px-2">{tx.id}</td>
                                <td className="px-2">{tx.type}</td>
                                <td className="px-2">{tx.name}</td>
                                <td className="px-2">{tx.value}</td>
                                <td className="px-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
                        <div className="flex justify-center mt-6">
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
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
            <div className="lg:col-span-1 space-y-6">
                <CryptoAssetRow icon={<FaBitcoin className="text-orange-500" />} name="Bitcoin" ticker="BTC" price={bitcoinPrice} change={0.56} isPositive={true} />
                <CryptoAssetRow icon={<FaEthereum className="text-sky-400" />} name="Ethereum" ticker="ETH" price={ethereumPrice} change={-0.53} isPositive={false} />
                {/* You can easily add more assets here */}
            </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;