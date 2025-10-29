import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useProfile, useCreateWithdrawal } from '../hooks';
import LoadingButton from '../components/LoadingButton';
import { formatCurrency } from '../utils/currency';
import { 
  FaArrowLeft,
  FaWallet,
  FaBitcoin,
  FaUniversity,
  FaCreditCard,
  FaPaypal,
  FaLock,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';

const WithdrawPage = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const createWithdrawalMutation = useCreateWithdrawal();

  const [step, setStep] = useState(1); // 1: Method, 2: Details, 3: Code Verification
  const [selectedMethod, setSelectedMethod] = useState('');
  const [amount, setAmount] = useState('');
  const [withdrawalDetails, setWithdrawalDetails] = useState({
    accountNumber: '',
    accountName: '',
    bankName: '',
    routingNumber: '',
    walletAddress: '',
    email: ''
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = profile || { balance: 0, currency: 'USD' };
  const availableBalance = user.balance || 0;
  const userCurrency = user.currency || 'USD';

  const withdrawalMethods = [
    { id: 'bank', name: 'Bank Transfer', icon: FaUniversity, description: 'Withdraw to your bank account' },
    { id: 'crypto', name: 'Cryptocurrency', icon: FaBitcoin, description: 'Withdraw to crypto wallet' },
    { id: 'card', name: 'Debit Card', icon: FaCreditCard, description: 'Withdraw to your card' },
    { id: 'paypal', name: 'PayPal', icon: FaPaypal, description: 'Withdraw to PayPal account' }
  ];

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
    setStep(2);
  };

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (parseFloat(amount) > availableBalance) {
      alert('Insufficient balance');
      return;
    }
    setStep(3);
  };

  const handleWithdrawalSubmit = async (e) => {
    e.preventDefault();
    
    if (!verificationCode) {
      alert('Please enter the verification code');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare withdrawal data
      const withdrawalData = {
        amount: parseFloat(amount),
        method: selectedMethod,
        details: withdrawalDetails,
        verificationCode: verificationCode
      };

      await createWithdrawalMutation.mutateAsync(withdrawalData);
      
      // Show success message
      alert('Withdrawal request submitted successfully! Your request is now pending approval.');
      navigate('/transactions');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit withdrawal request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderMethodDetails = () => {
    switch (selectedMethod) {
      case 'bank':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Account Name</label>
              <input
                type="text"
                value={withdrawalDetails.accountName}
                onChange={(e) => setWithdrawalDetails({ ...withdrawalDetails, accountName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Bank Name</label>
              <input
                type="text"
                value={withdrawalDetails.bankName}
                onChange={(e) => setWithdrawalDetails({ ...withdrawalDetails, bankName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Account Number</label>
              <input
                type="text"
                value={withdrawalDetails.accountNumber}
                onChange={(e) => setWithdrawalDetails({ ...withdrawalDetails, accountNumber: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                
                required
              />
            </div>
            {/* <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Routing Number</label>
              <input
                type="text"
                value={withdrawalDetails.routingNumber}
                onChange={(e) => setWithdrawalDetails({ ...withdrawalDetails, routingNumber: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="021000021"
                required
              />
            </div> */}
          </>
        );
      case 'crypto':
        return (
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Wallet Address</label>
            <input
              type="text"
              value={withdrawalDetails.walletAddress}
              onChange={(e) => setWithdrawalDetails({ ...withdrawalDetails, walletAddress: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
              required
            />
          </div>
        );
      case 'card':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Card Number</label>
              <input
                type="text"
                value={withdrawalDetails.accountNumber}
                onChange={(e) => setWithdrawalDetails({ ...withdrawalDetails, accountNumber: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Cardholder Name</label>
              <input
                type="text"
                value={withdrawalDetails.accountName}
                onChange={(e) => setWithdrawalDetails({ ...withdrawalDetails, accountName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                
                required
              />
            </div>
          </>
        );
      case 'paypal':
        return (
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">PayPal Email</label>
            <input
              type="email"
              value={withdrawalDetails.email}
              onChange={(e) => setWithdrawalDetails({ ...withdrawalDetails, email: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              
              required
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : navigate('/dashboard')}
            className="p-2 hover:bg-slate-800 rounded-lg transition"
          >
            <FaArrowLeft className="text-xl" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Withdraw Funds</h1>
            <p className="text-slate-400 text-sm">
              Available Balance: <span className="text-white font-semibold">{formatCurrency(availableBalance, userCurrency)}</span>
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-slate-700'}`}>
              {step > 1 ? <FaCheckCircle /> : '1'}
            </div>
            <div className={`h-1 w-16 ${step >= 2 ? 'bg-blue-600' : 'bg-slate-700'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-slate-700'}`}>
              {step > 2 ? <FaCheckCircle /> : '2'}
            </div>
            <div className={`h-1 w-16 ${step >= 3 ? 'bg-blue-600' : 'bg-slate-700'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-blue-600' : 'bg-slate-700'}`}>
              3
            </div>
          </div>
        </div>

        {/* Step 1: Select Withdrawal Method */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Select Withdrawal Method</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {withdrawalMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => handleMethodSelect(method.id)}
                    className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-blue-500 hover:bg-slate-700 transition-all text-left group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-slate-700 rounded-lg group-hover:bg-blue-600 transition">
                        <Icon className="text-2xl" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{method.name}</h3>
                        <p className="text-sm text-slate-400">{method.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Enter Details and Amount */}
        {step === 2 && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6">Enter Withdrawal Details</h2>
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Withdrawal Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{formatCurrency(0, userCurrency).charAt(0)}</span>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white py-3 pl-8 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
                   
                    required
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Maximum: {formatCurrency(availableBalance, userCurrency)}
                </p>
              </div>

              {/* Method-specific fields */}
              {renderMethodDetails()}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
              >
                Continue
              </button>
            </form>
          </div>
        )}

        {/* Step 3: Verification Code */}
        {step === 3 && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 rounded-full mb-4">
                <FaLock className="text-3xl text-blue-500" />
              </div>
              <h2 className="text-xl font-bold mb-2">Verification Required</h2>
              <p className="text-slate-400 text-sm">
                A verification code has been sent to your email. Please contact admin to receive your withdrawal code.
              </p>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-4 mb-6 flex items-start gap-3">
              <FaExclamationTriangle className="text-yellow-400 text-xl flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-300">
                <p className="font-semibold mb-1">Important:</p>
                <p>Contact your admin to generate and send you a withdrawal verification code to your email.</p>
              </div>
            </div>

            <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Verification Code</label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-900 border border-slate-700 text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl font-mono tracking-widest"
                 
                  maxLength="8"
                  required
                />
              </div>

              {/* Summary */}
              <div className="bg-slate-900 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount:</span>
                  <span className="font-semibold">{formatCurrency(parseFloat(amount || 0), userCurrency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Method:</span>
                  <span className="font-semibold capitalize">{selectedMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-yellow-400 font-semibold">Pending Approval</span>
                </div>
              </div>

              <LoadingButton
                type="submit"
                isLoading={isSubmitting}
                loadingText="Processing..."
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                <FaWallet />
                <span>Submit Withdrawal Request</span>
              </LoadingButton>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawPage;
