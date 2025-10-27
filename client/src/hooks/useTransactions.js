import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '../api/services';

/**
 * Hook to fetch transactions with optional filters
 * @param {Object} filters - Filter parameters (type, status, etc.)
 * @param {Object} options - Query options
 */
export const useTransactions = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => transactionService.getTransactions(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes - reduce refetching
    gcTime: 1000 * 60 * 10, // 10 minutes cache
    ...options,
  });
};

/**
 * Hook to fetch a single transaction by ID
 * @param {string} id - Transaction ID
 * @param {Object} options - Query options
 */
export const useTransaction = (id, options = {}) => {
  return useQuery({
    queryKey: ['transaction', id],
    queryFn: () => transactionService.getTransaction(id),
    enabled: !!id, // Only run if ID exists
    ...options,
  });
};

/**
 * Hook to fetch dashboard stats
 * @param {Object} options - Query options
 */
export const useDashboardStats = (options = {}) => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => transactionService.getDashboardStats(false),
    staleTime: 1000 * 60 * 5, // 5 minutes - reduce refetching
    gcTime: 1000 * 60 * 10, // 10 minutes cache
    ...options,
  });
};

/**
 * Hook to create a deposit transaction
 */
export const useCreateDeposit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ amount, method, currency = 'USD' }) => 
      transactionService.createDeposit(amount, method, currency),
    onSuccess: () => {
      // Only invalidate necessary queries
      queryClient.invalidateQueries({ queryKey: ['transactions'], exact: true });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'], exact: true });
    },
  });
};

/**
 * Hook to create a withdrawal transaction
 */
export const useCreateWithdrawal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (withdrawalData) => 
      transactionService.createWithdrawal(withdrawalData),
    onSuccess: () => {
      // Only invalidate necessary queries
      queryClient.invalidateQueries({ queryKey: ['transactions'], exact: true });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'], exact: true });
    },
  });
};
