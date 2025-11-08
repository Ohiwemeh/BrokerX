import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../api/services';

/**
 * Hook to fetch all users (admin only) with pagination
 * @param {Object} filters - Filter parameters (search, status, etc.)
 * @param {Object} pagination - Pagination parameters (page, limit)
 * @param {Object} options - Query options
 */
export const useAdminUsers = (filters = {}, pagination = { page: 1, limit: 10 }, options = {}) => {
  return useQuery({
    queryKey: ['adminUsers', filters, pagination],
    queryFn: () => adminService.getUsers({ ...filters, ...pagination }),
    staleTime: 1000 * 60 * 2, // 2 minutes (faster updates for admin)
    gcTime: 1000 * 60 * 10, // 10 minutes cache
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    ...options,
  });
};

/**
 * Hook to fetch a single user by ID (admin only)
 * @param {string} id - User ID
 * @param {Object} options - Query options
 */
export const useAdminUser = (id, options = {}) => {
  return useQuery({
    queryKey: ['adminUser', id],
    queryFn: () => adminService.getUser(id),
    enabled: !!id, // Only run if ID exists
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 20, // 20 minutes cache
    ...options,
  });
};

/**
 * Hook to fetch admin stats
 * @param {Object} options - Query options
 */
export const useAdminStats = (options = {}) => {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: () => adminService.getStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};

/**
 * Hook to fetch all transactions (admin only)
 * @param {Object} filters - Filter parameters
 * @param {Object} options - Query options
 */
export const useAdminTransactions = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ['adminTransactions', filters],
    queryFn: () => adminService.getTransactions(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
    ...options,
  });
};

/**
 * Hook to verify a user (admin only)
 */
export const useVerifyUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => adminService.verifyUser(userId),
    onSuccess: (data, userId) => {
      // Invalidate admin-specific user data
      queryClient.invalidateQueries({ queryKey: ['adminUser', userId], exact: true });
      // Invalidate user's own profile so their dashboard updates
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

/**
 * Hook to reject a user (admin only)
 */
export const useRejectUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, reason }) => adminService.rejectUser(userId, reason),
    onSuccess: (data, { userId }) => {
      // Invalidate admin-specific user data
      queryClient.invalidateQueries({ queryKey: ['adminUser', userId], exact: true });
      // Invalidate user's own profile so their dashboard updates
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

/**
 * Hook to add funds to a user's account (admin only)
 */
export const useAddFunds = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, amount, description }) => 
      adminService.addFunds(userId, amount, description),
    onSuccess: (data, { userId }) => {
      // Invalidate admin-specific user data
      queryClient.invalidateQueries({ queryKey: ['adminUser', userId], exact: true });
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      // Invalidate user's own profile and stats so their dashboard updates
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
};

/**
 * Hook to add profit to a user's account (admin only)
 */
export const useAddProfit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, amount, description }) => 
      adminService.addProfit(userId, amount, description),
    onSuccess: (data, { userId }) => {
      // Invalidate admin-specific user data
      queryClient.invalidateQueries({ queryKey: ['adminUser', userId], exact: true });
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      // Invalidate user's own profile and stats so their dashboard updates
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
};

/**
 * Hook to edit user balance directly (admin only)
 */
export const useEditBalance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, balance }) => 
      adminService.editBalance(userId, balance),
    onSuccess: (data, { userId }) => {
      // Invalidate admin-specific user data
      queryClient.invalidateQueries({ queryKey: ['adminUser', userId], exact: true });
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      // Invalidate user's own profile and stats so their dashboard updates
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
};

/**
 * Hook to send email to a user (admin only)
 */
export const useSendEmail = () => {
  return useMutation({
    mutationFn: ({ userId, subject, message }) => 
      adminService.sendEmail(userId, subject, message),
  });
};

/**
 * Hook to delete a user (admin only)
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => adminService.deleteUser(userId),
    onSuccess: (data, userId) => {
      // Remove from cache and invalidate list
      queryClient.removeQueries({ queryKey: ['adminUser', userId] });
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });
};

/**
 * Hook to update transaction status (admin only)
 */
export const useUpdateTransactionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ transactionId, status }) => 
      adminService.updateTransactionStatus(transactionId, status),
    onSuccess: (data, { transactionId }) => {
      // Invalidate specific transaction
      queryClient.invalidateQueries({ queryKey: ['transaction', transactionId], exact: true });
      // Invalidate user's transaction list and stats so their dashboard updates
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      // Invalidate admin user queries to refresh user details in admin panel
      queryClient.invalidateQueries({ queryKey: ['adminUser'] });
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });
};
