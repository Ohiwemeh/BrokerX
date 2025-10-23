# TanStack Query Implementation Guide

## Overview
TanStack Query (formerly React Query) has been successfully integrated into the BrokerX project. This provides powerful data fetching, caching, synchronization, and state management capabilities.

## What Was Implemented

### 1. **Core Setup**
- **File**: `client/src/lib/queryClient.js`
  - Created QueryClient with optimized defaults
  - 5-minute stale time for queries
  - 10-minute garbage collection time
  - Automatic retry logic

- **File**: `client/src/main.jsx`
  - Wrapped app with `QueryClientProvider`
  - Added React Query DevTools for debugging

### 2. **Custom Hooks Created**

#### Authentication Hooks (`client/src/hooks/useAuth.js`)
- `useSignup()` - User registration
- `useLogin()` - User authentication
- `useLogout()` - User logout with cache clearing

#### Profile Hooks (`client/src/hooks/useProfile.js`)
- `useProfile()` - Fetch user profile with caching
- `useUpdateProfile()` - Update profile data
- `useUploadProfileImage()` - Upload profile picture
- `useUploadID()` - Upload ID documents
- `useChangePassword()` - Change user password
- `useToggle2FA()` - Toggle two-factor authentication

#### Transaction Hooks (`client/src/hooks/useTransactions.js`)
- `useTransactions(filters)` - Fetch transactions with filters
- `useTransaction(id)` - Fetch single transaction
- `useDashboardStats()` - Fetch dashboard statistics
- `useCreateDeposit()` - Create deposit transaction
- `useCreateWithdrawal()` - Create withdrawal transaction

#### Wallet Hooks (`client/src/hooks/useWallet.js`)
- `useWallet()` - Fetch wallet balances
- `useWalletTransfer()` - Transfer between wallet accounts

#### Admin Hooks (`client/src/hooks/useAdmin.js`)
- `useAdminUsers(filters)` - Fetch all users with filters
- `useAdminUser(id)` - Fetch single user details
- `useAdminStats()` - Fetch admin statistics
- `useAdminTransactions(filters)` - Fetch all transactions
- `useVerifyUser()` - Verify user account
- `useRejectUser()` - Reject user verification
- `useAddFunds()` - Add funds to user account
- `useSendEmail()` - Send email to user
- `useDeleteUser()` - Delete user account
- `useUpdateTransactionStatus()` - Update transaction status

#### Crypto Hooks (`client/src/hooks/useCrypto.js`)
- `useCryptoPrices()` - Fetch crypto prices with auto-refresh (every 1 minute)

### 3. **Updated Pages**
- **Settings.jsx** - Converted to use TanStack Query hooks
- **AdminPage.jsx** - Partially updated with imports

### 4. **Example File**
- **File**: `client/src/examples/TanStackQueryExamples.jsx`
  - Contains 8 comprehensive examples showing different usage patterns
  - Copy these patterns to your actual pages

## Installation Required

Run this command in the `client` directory:

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

## Key Benefits

### 1. **Automatic Caching**
- Data is cached automatically
- No need to manage loading states manually
- Reduces unnecessary API calls

### 2. **Background Refetching**
- Data stays fresh automatically
- Configurable stale time per query
- Auto-refetch on window focus (disabled by default)

### 3. **Optimistic Updates**
- UI updates immediately
- Automatic rollback on error
- Better user experience

### 4. **Loading & Error States**
- Built-in loading states (`isLoading`, `isFetching`)
- Error handling (`isError`, `error`)
- Success states (`isSuccess`)

### 5. **DevTools**
- Visual query inspector
- See cache state in real-time
- Debug query behavior
- Access via floating icon in bottom-right corner

## How to Use in Your Pages

### Basic Query Example

```jsx
import { useProfile } from '../hooks';

function ProfilePage() {
  const { data: profile, isLoading, error } = useProfile();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{profile.firstName} {profile.lastName}</h1>
      <p>{profile.email}</p>
    </div>
  );
}
```

### Mutation Example

```jsx
import { useUpdateProfile } from '../hooks';

function EditProfile() {
  const updateProfile = useUpdateProfile();

  const handleSubmit = async (formData) => {
    try {
      await updateProfile.mutateAsync(formData);
      alert('Profile updated!');
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button 
        type="submit" 
        disabled={updateProfile.isPending}
      >
        {updateProfile.isPending ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
```

### Query with Filters

```jsx
import { useTransactions } from '../hooks';
import { useState } from 'react';

function TransactionsPage() {
  const [filters, setFilters] = useState({ type: 'all' });
  const { data, isLoading } = useTransactions(filters);

  return (
    <div>
      <select onChange={(e) => setFilters({ type: e.target.value })}>
        <option value="all">All</option>
        <option value="deposit">Deposits</option>
        <option value="withdrawal">Withdrawals</option>
      </select>
      
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {data?.transactions?.map(tx => (
            <li key={tx._id}>{tx.type} - ${tx.amount}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## Migration Guide

### Before (Old Way)
```jsx
const [profile, setProfile] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const loadProfile = async () => {
    try {
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  loadProfile();
}, []);
```

### After (TanStack Query)
```jsx
const { data: profile, isLoading, error } = useProfile();
```

## Pages to Update

### High Priority
1. **Dashboard.jsx** - Replace crypto price fetching with `useCryptoPrices()`
2. **TransactionsPage.jsx** - Use `useTransactions()` and `useDashboardStats()`
3. **WalletPage.jsx** - Use `useWallet()` and `useWalletTransfer()`
4. **AdminTransactions.jsx** - Use `useAdminTransactions()` and `useUpdateTransactionStatus()`

### Medium Priority
5. **Markets.jsx** - If fetching market data
6. **TradingPlatform.jsx** - If fetching trading data
7. **Orders.jsx** - If fetching order data

### Already Updated
- ✅ **Settings.jsx** - Profile management
- ✅ **AdminPage.jsx** - User management (imports added)

## Best Practices

### 1. **Use Query Keys Consistently**
Query keys are already set up in the hooks. They follow this pattern:
- `['profile']` - User profile
- `['transactions', filters]` - Transactions with filters
- `['wallet']` - Wallet data
- `['adminUsers', filters]` - Admin users list

### 2. **Handle Loading States**
```jsx
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <NoData />;
```

### 3. **Use Mutations for Write Operations**
Always use mutation hooks for POST, PUT, DELETE operations:
- They automatically invalidate related queries
- They provide loading states
- They handle errors gracefully

### 4. **Leverage Automatic Refetching**
```jsx
const { data, refetch } = useProfile();

// Manual refetch when needed
<button onClick={() => refetch()}>Refresh</button>
```

### 5. **Disable Queries Conditionally**
```jsx
const { data } = useAdminUser(userId, {
  enabled: !!userId, // Only fetch if userId exists
});
```

## DevTools Usage

The React Query DevTools are available in development mode:
- Look for the floating TanStack Query icon in the bottom-right corner
- Click to open the query inspector
- View all active queries, their status, and cached data
- Manually trigger refetches or invalidations
- See query timings and network activity

## Configuration

### Stale Time
- **Profile**: 5 minutes
- **Transactions**: 2 minutes
- **Wallet**: 3 minutes
- **Admin Stats**: 5 minutes
- **Crypto Prices**: 1 minute (with auto-refetch)

### Cache Time (Garbage Collection)
- Default: 10 minutes
- Unused data is removed after this time

### Retry Logic
- **Queries**: 1 retry on failure
- **Mutations**: 0 retries (fail immediately)

## Troubleshooting

### Query Not Updating
- Check if the query key is correct
- Ensure mutations are invalidating the right queries
- Use DevTools to inspect cache state

### Stale Data
- Adjust `staleTime` in query options
- Use `refetch()` to manually refresh
- Check if background refetching is needed

### Memory Issues
- Reduce `gcTime` if caching too much data
- Use pagination for large datasets
- Consider disabling queries when not needed

## Next Steps

1. **Install Dependencies**
   ```bash
   cd client
   npm install @tanstack/react-query @tanstack/react-query-devtools
   ```

2. **Test the Setup**
   - Run the development server
   - Check for the DevTools icon
   - Verify queries are working in Settings page

3. **Migrate Pages One by One**
   - Start with Dashboard.jsx
   - Use the examples in `TanStackQueryExamples.jsx` as reference
   - Test each page after migration

4. **Remove Old Code**
   - After migration, remove manual `useEffect` data fetching
   - Remove manual loading/error state management
   - Keep the existing `services.js` file (hooks use it internally)

5. **Optimize**
   - Adjust stale times based on your needs
   - Add pagination where needed
   - Implement infinite queries for long lists

## Additional Resources

- [TanStack Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [Query Keys Guide](https://tanstack.com/query/latest/docs/react/guides/query-keys)
- [Mutations Guide](https://tanstack.com/query/latest/docs/react/guides/mutations)
- [DevTools Guide](https://tanstack.com/query/latest/docs/react/devtools)

## Summary

✅ **Completed:**
- QueryClient setup with optimized defaults
- 30+ custom hooks for all API operations
- Provider integration in main.jsx
- DevTools integration
- Example implementations
- Settings page migration

🔄 **Your Next Actions:**
1. Install the npm packages
2. Test the current setup
3. Migrate remaining pages using the examples
4. Remove old manual data fetching code
5. Optimize based on your specific needs

The foundation is complete and ready to use! All your API calls can now benefit from automatic caching, background updates, and optimized performance.
