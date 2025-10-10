import React, { useState } from 'react';
import { 
  FaCreditCard, 
  FaUniversity, 
  FaShieldAlt, 
  FaAngleDown 
} from 'react-icons/fa';
import { SiTether } from "react-icons/si";

// NOTE: For real brand logos (Visa, Mastercard), you'd typically use SVG icons.
// We'll use react-icons for this example.

// --- Reusable Sub-Component ---

const PaymentMethodItem = ({ method, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(method.id)}
      className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'border-blue-500 bg-slate-700/50 shadow-lg'
          : 'border-slate-700 bg-slate-800 hover:border-slate-500'
      }`}
    >
      <div className="flex flex-col">
        <span className="font-semibold text-white">{method.name}</span>
        <span className="text-xs text-slate-400">{method.description}</span>
      </div>
      <div className="flex items-center gap-2 text-2xl text-slate-400">
        {method.icons.map((Icon, index) => <Icon key={index} />)}
      </div>
    </div>
  );
};

// --- Main Deposit Page Component ---

const DepositPage = () => {
  // Mock data for payment methods
  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', description: "Instant deposit", icons: [FaCreditCard] },
    { id: 'bank', name: 'Local Bank Transfer', description: "Takes a few minutes", icons: [FaUniversity] },
    { id: 'usdt', name: 'USDT', description: "Crypto Transfer", icons: [SiTether] },
  ];

  const [selectedMethod, setSelectedMethod] = useState('card');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('PHP, ₱');
  
  // A mock exchange rate
  const NGN_TO_USD_RATE = 0.97;
  const amountInUSD = (parseFloat(amount) * NGN_TO_USD_RATE).toFixed(2);

  return (
    // Assuming this component is rendered within our main layout with the sidebar
    <div className="p-4 md:p-8 space-y-8 text-white">
      <h1 className="text-3xl font-bold">Deposit</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Payment Methods */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold text-slate-300">Select Payment Method</h2>
          {paymentMethods.map(method => (
            <PaymentMethodItem
              key={method.id}
              method={method}
              isSelected={selectedMethod === method.id}
              onSelect={setSelectedMethod}
            />
          ))}
        </div>

        {/* Right Column: Deposit Details */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-2 text-sm text-green-400">
              <FaShieldAlt />
              <span>The connection is secured</span>
            </div>

            <div>
              <label htmlFor="deposit-amount" className="block text-sm font-medium text-slate-400 mb-2">
                Deposit Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="deposit-amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 pl-4 pr-24 text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <button className="flex items-center gap-2 px-4 text-white font-semibold">
                    {currency}
                    <FaAngleDown className="text-slate-400" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">Limits: 5,000 - 10,000,000 {currency}</p>
            </div>
            
            <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg">
                <span className="text-slate-400">Will be deposited</span>
                <span className="font-semibold text-lg text-white">
                  ₱{!isNaN(amountInUSD) ? amountInUSD : '0.00'} PHP
                </span>
            </div>

            {/* Instructional Text - Could be dynamic based on selectedMethod */}
            <div>
              <h3 className="font-semibold text-white mb-2">How to make a deposit using bank transfer</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                On the next page you will see the credentials of our partner's bank account. Open your internet banking and proceed with a transfer to the given credentials. The money will be automatically credited to your BrokerX wallet within several minutes.
              </p>
            </div>
            
            <div className="border-t border-slate-700 pt-6">
              <button
                disabled={!amount || parseFloat(amount) <= 0}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Fund
              </button>
              <p className="text-center text-sm text-slate-500 mt-3">
                Commission fee 3%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositPage;