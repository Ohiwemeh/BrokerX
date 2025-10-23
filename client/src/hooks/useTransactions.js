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
    staleTime: 1000 * 60 * 2, // 2 minutes
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
    staleTime: 1000 * 60 * 2, // 2 minutes - refresh more frequently for dashboard
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
      // Invalidate transactions and wallet to reflect new deposit
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
};

/**
 * Hook to create a withdrawal transaction
 */
export const useCreateWithdrawal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ amount, method, currency = 'USD' }) => 
      transactionService.createWithdrawal(amount, method, currency),
    onSuccess: () => {
      // Invalidate transactions and wallet to reflect new withdrawal
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
};
