import React, { useState, useEffect } from 'react';
import { adminService } from '../api/services';
import { useSocket } from '../context/SocketContext';
import { useNotificationSound } from '../hooks/useNotificationSound';
import { 
  FaCheck, 
  FaTimes, 
  FaFilter,
  FaEllipsisV,
  FaMoneyBillWave,
  FaArrowDown,
  FaArrowUp
} from 'react-icons/fa';

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: 'Pending', type: 'all' });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);

  const { socket } = useSocket();
  const { playSound } = useNotificationSound();

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await adminService.getTransactions(filter);
      setTransactions(data.transactions);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  // Listen for real-time transaction requests
  useEffect(() => {
    if (!socket) return;

    socket.on('new-deposit-request', (data) => {
      console.log('🔔 New deposit request:', data);
      playSound();
      fetchTransactions();
    });

    socket.on('new-withdrawal-request', (data) => {
      console.log('🔔 New withdrawal request:', data);
      playSound();
      fetchTransactions();
    });

    return () => {
      socket.off('new-deposit-request');
      socket.off('new-withdrawal-request');
    };
  }, [socket, playSound]);

  // Update transaction status
  const handleUpdateStatus = async (transactionId, status) => {
    try {
      await adminService.updateTransactionStatus(transactionId, status);
      fetchTransactions();
      setShowActionMenu(null);
      alert(`Transaction ${status.toLowerCase()} successfully!`);
    } catch (error) {
      console.error('Failed to update transaction:', error);
      console.error('Error details:', error.response?.data);
      alert(`Failed to update transaction: ${error.response?.data?.error || error.message}`);
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      Pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      Completed: 'bg-green-500/20 text-green-400 border-green-500/30',
      Failed: 'bg-red-500/20 text-red-400 border-red-500/30',
      Processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    };
    return colors[status] || colors.Pending;
  };

  // Get type icon and color
  const getTypeStyle = (type) => {
    if (type === 'Deposit') {
      return {
        icon: <FaArrowDown className="text-green-400" />,
        color: 'text-green-400'
      };
    }
    return {
      icon: <FaArrowUp className="text-red-400" />,
      color: 'text-red-400'
    };
  };

  return (
    <div className="p-4 sm:p-6 bg-slate-900 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Transactions</h1>
        <p className="text-slate-400">Manage user deposits and withdrawals</p>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-lg p-4 mb-6 border border-slate-700">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-400 mb-2">
              <FaFilter className="inline mr-2" />
              Status
            </label>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
              <option value="Processing">Processing</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-400 mb-2">
              <FaMoneyBillWave className="inline mr-2" />
              Type
            </label>
            <select
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="Deposit">Deposit</option>
              <option value="Withdrawal">Withdrawal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <FaMoneyBillWave className="text-5xl mx-auto mb-4 opacity-50" />
            <p>No transactions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="text-left p-4 text-slate-300 font-semibold">Date</th>
                  <th className="text-left p-4 text-slate-300 font-semibold">Transaction ID</th>
                  <th className="text-left p-4 text-slate-300 font-semibold">Type</th>
                  <th className="text-left p-4 text-slate-300 font-semibold">Name</th>
                  <th className="text-left p-4 text-slate-300 font-semibold">Value</th>
                  <th className="text-left p-4 text-slate-300 font-semibold">Status</th>
                  <th className="text-left p-4 text-slate-300 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const typeStyle = getTypeStyle(tx.type);
                  return (
                    <tr key={tx._id} className="border-t border-slate-700 hover:bg-slate-700/30 transition">
                      <td className="p-4 text-slate-300">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-slate-300 font-mono text-sm">
                        {tx.transactionId}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {typeStyle.icon}
                          <span className={typeStyle.color}>{tx.type}</span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-300">
                        {tx.userId?.name || 'Unknown'}
                      </td>
                      <td className="p-4 text-white font-semibold">
                        USD {tx.amount.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(tx.status)}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="p-4 relative">
                        {tx.status === 'Pending' ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateStatus(tx._id, 'Completed')}
                              className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                              title="Approve"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(tx._id, 'Failed')}
                              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                              title="Reject"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowActionMenu(showActionMenu === tx._id ? null : tx._id)}
                            className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
                          >
                            <FaEllipsisV />
                          </button>
                        )}

                        {/* Action Menu */}
                        {showActionMenu === tx._id && (
                          <div className="absolute right-0 mt-2 w-48 bg-slate-700 border border-slate-600 rounded-lg shadow-lg z-10">
                            <button
                              onClick={() => handleUpdateStatus(tx._id, 'Pending')}
                              className="w-full text-left px-4 py-2 hover:bg-slate-600 text-white"
                            >
                              Set to Pending
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(tx._id, 'Processing')}
                              className="w-full text-left px-4 py-2 hover:bg-slate-600 text-white"
                            >
                              Set to Processing
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(tx._id, 'Completed')}
                              className="w-full text-left px-4 py-2 hover:bg-slate-600 text-white"
                            >
                              Set to Completed
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(tx._id, 'Failed')}
                              className="w-full text-left px-4 py-2 hover:bg-slate-600 text-white border-t border-slate-600"
                            >
                              Set to Failed
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTransactions;
