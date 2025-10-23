import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../api/services';

/**
 * Hook to fetch all users (admin only)
 * @param {Object} filters - Filter parameters (search, status, etc.)
 * @param {Object} options - Query options
 */
export const useAdminUsers = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ['adminUsers', filters],
    queryFn: () => adminService.getUsers(filters),
    staleTime: 1000 * 60 * 3, // 3 minutes
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
    staleTime: 1000 * 60 * 2, // 2 minutes
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
      // Invalidate user queries to reflect verification
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['adminUser', userId] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
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
      // Invalidate user queries to reflect rejection
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['adminUser', userId] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
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
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['adminUser', userId] });
      queryClient.invalidateQueries({ queryKey: ['adminTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
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
    onSuccess: () => {
      // Invalidate user list and stats
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
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
      // Invalidate transaction queries
      queryClient.invalidateQueries({ queryKey: ['adminTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['transaction', transactionId] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
  });
};
