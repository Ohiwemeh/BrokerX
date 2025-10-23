/**
 * TanStack Query Usage Examples
 * 
 * This file demonstrates how to use the custom TanStack Query hooks
 * in your components. Copy these patterns to your actual pages.
 */

import React, { useState } from 'react';
import {
  useProfile,
  useUpdateProfile,
  useTransactions,
  useCreateDeposit,
  useWallet,
  useAdminUsers,
  useVerifyUser,
  useCryptoPrices,
} from '../hooks';

/**
 * Example 1: Fetching Profile Data
 */
export const ProfileExample = () => {
  const { data: profile, isLoading, error, refetch } = useProfile();
  const updateProfileMutation = useUpdateProfile();

  const handleUpdate = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+1234567890',
      });
      alert('Profile updated!');
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  if (isLoading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Profile: {profile?.firstName} {profile?.lastName}</h2>
      <button onClick={handleUpdate} disabled={updateProfileMutation.isPending}>
        {updateProfileMutation.isPending ? 'Updating...' : 'Update Profile'}
      </button>
      <button onClick={() => refetch()}>Refresh Profile</button>
    </div>
  );
};

/**
 * Example 2: Fetching Transactions with Filters
 */
export const TransactionsExample = () => {
  const [filters, setFilters] = useState({ type: 'all' });
  const { data, isLoading, error } = useTransactions(filters);

  if (isLoading) return <div>Loading transactions...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Transactions</h2>
      <select onChange={(e) => setFilters({ type: e.target.value })}>
        <option value="all">All</option>
        <option value="deposit">Deposits</option>
        <option value="withdrawal">Withdrawals</option>
      </select>
      <ul>
        {data?.transactions?.map((tx) => (
          <li key={tx._id}>
            {tx.type} - ${tx.amount} - {tx.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

/**
 * Example 3: Creating a Deposit (Mutation)
 */
export const DepositExample = () => {
  const [amount, setAmount] = useState('');
  const createDepositMutation = useCreateDeposit();

  const handleDeposit = async (e) => {
    e.preventDefault();
    try {
      await createDepositMutation.mutateAsync({
        amount: parseFloat(amount),
        method: 'bank_transfer',
        currency: 'USD',
      });
      alert('Deposit created successfully!');
      setAmount('');
    } catch (err) {
      alert('Failed to create deposit: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleDeposit}>
      <h2>Create Deposit</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        required
      />
      <button type="submit" disabled={createDepositMutation.isPending}>
        {createDepositMutation.isPending ? 'Creating...' : 'Create Deposit'}
      </button>
      {createDepositMutation.isError && (
        <p>Error: {createDepositMutation.error.message}</p>
      )}
    </form>
  );
};

/**
 * Example 4: Fetching Wallet Data
 */
export const WalletExample = () => {
  const { data: wallet, isLoading, error } = useWallet();

  if (isLoading) return <div>Loading wallet...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Wallet</h2>
      <p>Main Balance: ${wallet?.mainBalance || 0}</p>
      <p>Trading Balance: ${wallet?.tradingBalance || 0}</p>
      <p>Bonus Balance: ${wallet?.bonusBalance || 0}</p>
    </div>
  );
};

/**
 * Example 5: Admin - Fetching Users with Search
 */
export const AdminUsersExample = () => {
  const [search, setSearch] = useState('');
  const { data, isLoading, error } = useAdminUsers({ search });
  const verifyUserMutation = useVerifyUser();

  const handleVerify = async (userId) => {
    try {
      await verifyUserMutation.mutateAsync(userId);
      alert('User verified!');
    } catch (err) {
      alert('Failed to verify user');
    }
  };

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Admin - Users</h2>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search users..."
      />
      <ul>
        {data?.users?.map((user) => (
          <li key={user._id}>
            {user.name} - {user.email} - {user.accountStatus}
            {user.accountStatus === 'Pending' && (
              <button
                onClick={() => handleVerify(user._id)}
                disabled={verifyUserMutation.isPending}
              >
                Verify
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

/**
 * Example 6: Fetching Crypto Prices with Auto-Refresh
 */
export const CryptoPricesExample = () => {
  const { data: prices, isLoading, error, dataUpdatedAt } = useCryptoPrices();

  if (isLoading) return <div>Loading prices...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Crypto Prices</h2>
      <p>Last updated: {new Date(dataUpdatedAt).toLocaleTimeString()}</p>
      <ul>
        <li>Bitcoin: ${prices?.bitcoin?.usd} ({prices?.bitcoin?.usd_24h_change}%)</li>
        <li>Ethereum: ${prices?.ethereum?.usd} ({prices?.ethereum?.usd_24h_change}%)</li>
        <li>Solana: ${prices?.solana?.usd} ({prices?.solana?.usd_24h_change}%)</li>
      </ul>
      <p>Prices auto-refresh every minute</p>
    </div>
  );
};

/**
 * Example 7: Handling Loading and Error States
 */
export const LoadingErrorExample = () => {
  const { data, isLoading, isError, error, isFetching, refetch } = useProfile();

  return (
    <div>
      <h2>Profile with Loading States</h2>
      
      {/* Show loading spinner on initial load */}
      {isLoading && <div>Loading for the first time...</div>}
      
      {/* Show error message */}
      {isError && <div>Error: {error.message}</div>}
      
      {/* Show data when available */}
      {data && (
        <div>
          <p>Name: {data.firstName} {data.lastName}</p>
          {/* Show subtle indicator when refetching in background */}
          {isFetching && <span>Updating...</span>}
        </div>
      )}
      
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  );
};

/**
 * Example 8: Optimistic Updates
 */
export const OptimisticUpdateExample = () => {
  const { data: profile } = useProfile();
  const updateProfileMutation = useUpdateProfile();

  const handleQuickUpdate = async (newName) => {
    // The mutation will automatically invalidate and refetch the profile
    // You can also do optimistic updates by using onMutate callback
    await updateProfileMutation.mutateAsync({
      ...profile,
      firstName: newName,
    });
  };

  return (
    <div>
      <h2>Current Name: {profile?.firstName}</h2>
      <button onClick={() => handleQuickUpdate('Jane')}>
        Change to Jane
      </button>
    </div>
  );
};
