import React, { useState, useEffect } from 'react';
import { transactionService } from '../api/services';
import { useProfile } from '../hooks';
import { formatCurrency } from '../utils/currency';
import { 
  FaChevronLeft, 
  FaCalendarAlt, 
  FaAngleDown, 
  FaSearch,
  FaArrowLeft, // For the back button
  FaFileInvoiceDollar // Icon for empty state
} from 'react-icons/fa';

// --- Reusable Sub-Components ---

const SelectDropdown = ({ label, options, selected, onChange }) => (
  <div className="relative">
    <select
      className="block w-full bg-slate-700 border border-slate-600 text-white py-2 px-4 pr-8 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
      value={selected}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="All">{label}: All</option>
      {options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
      <FaAngleDown className="text-sm" />
    </div>
  </div>
);

const PaginationControls = ({ itemsPerPage, totalItems, currentPage, onPageChange, onItemsPerPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex items-center justify-between text-sm text-slate-400">
      <div className="flex items-center gap-2">
        <span>Items per page:</span>
        <select
          className="bg-slate-700 border border-slate-600 rounded-lg py-1 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        >
          {[5, 10, 20, 50].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-4">
        <span>{totalItems === 0 ? '0' : (currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            &laquo;
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            &lsaquo;
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalItems === 0}
            className="p-2 rounded-lg hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            &rsaquo;
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages || totalItems === 0}
            className="p-2 rounded-lg hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            &raquo;
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Main Transactions Page Component ---

const TransactionsPage = () => {
  const { data: profile } = useProfile();
  const userCurrency = profile?.currency || 'USD';

  // State for filters
  const [selectedDateRange, setSelectedDateRange] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedMethod, setSelectedMethod] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // State for pagination
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data for dropdowns (replace with real data from API if available)
  const typeOptions = ['Deposit', 'Withdrawal', 'Trade', 'Transfer'];
  const methodOptions = ['Credit/Debit Card', 'Bank Transfer', 'USDT'];
  const statusOptions = ['Completed', 'Pending', 'Failed'];

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const totalTransactions = transactions.length;

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const filters = {
        type: selectedType,
        method: selectedMethod,
        status: selectedStatus,
        page: currentPage,
        limit: itemsPerPage
      };
      const data = await transactionService.getTransactions(filters);
      setTransactions(data.transactions || []);
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchTransactions();
  };

  useEffect(() => {
    if (!loading) {
      fetchTransactions();
    }
  }, [currentPage, itemsPerPage]);

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8 text-white">
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => window.history.back()} className="text-slate-400 hover:text-white transition-colors">
          <FaArrowLeft className="text-xl" />
        </button>
        <h1 className="text-3xl font-bold">Transactions History</h1>
      </div>

      {/* Main Content Card */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 items-end">
          {/* Date Picker (simple input for now) */}
          <div className="relative">
            <label htmlFor="date-range" className="sr-only">Select Dates</label>
            <input
              type="text" // Or type="date" if you want native picker
              id="date-range"
              placeholder="Select dates"
              className="w-full bg-slate-700 border border-slate-600 text-white py-2 px-4 pr-10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              onFocus={(e) => e.target.type = 'date'} // Change to date picker on focus
              onBlur={(e) => e.target.type = e.target.value ? 'date' : 'text'} // Revert if empty
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 pointer-events-none">
              <FaCalendarAlt />
            </div>
          </div>

          <SelectDropdown label="Type" options={typeOptions} selected={selectedType} onChange={setSelectedType} />
          <SelectDropdown label="Method" options={methodOptions} selected={selectedMethod} onChange={setSelectedMethod} />
          <SelectDropdown label="Status" options={statusOptions} selected={selectedStatus} onChange={setSelectedStatus} />
          
          <button
            onClick={handleApplyFilters}
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition w-full"
          >
            Apply
          </button>
        </div>

        {/* Transactions Table/Empty State */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-400">Loading transactions...</p>
            </div>
          </div>
        ) : totalTransactions > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm mt-8">
              <thead className="text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="py-3 px-2">Date</th>
                  <th className="py-3 px-2">ID</th>
                  <th className="py-3 px-2">Type</th>
                  <th className="py-3 px-2">Method</th>
                  <th className="py-3 px-2">Value</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => (
                  <tr key={index} className="border-b border-slate-800 hover:bg-slate-700/50">
                    <td className="py-4 px-2">{new Date(tx.createdAt).toLocaleDateString()}</td>
                    <td className="font-mono text-slate-400 px-2">{tx.transactionId}</td>
                    <td className="px-2">{tx.type}</td>
                    <td className="px-2">{tx.method}</td>
                    <td className="px-2">{formatCurrency(tx.amount, userCurrency)}</td>
                    <td className="px-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        tx.status === "Completed" ? "bg-green-500/20 text-green-400"
                        : tx.status === "Failed" ? "bg-red-500/20 text-red-400"
                        : "bg-orange-500/20 text-orange-400"
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="text-right px-2">
                      <button className="text-slate-400 hover:text-white text-lg"><FaSearch /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <FaFileInvoiceDollar className="text-6xl mb-4 text-slate-600" />
            <p className="text-xl font-semibold mb-2">No Transactions Found</p>
            <p className="text-sm">Adjust your filters or make some trades to see your history.</p>
            <button 
              onClick={() => { /* Logic to clear filters or navigate to trade page */ }}
              className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Start Trading Now
            </button>
          </div>
        )}

        {/* Pagination Section */}
        <div className="border-t border-slate-700 pt-6 mt-8">
          <PaginationControls
            itemsPerPage={itemsPerPage}
            totalItems={totalTransactions}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;