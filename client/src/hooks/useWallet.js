import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { walletService } from '../api/services';

/**
 * Hook to fetch wallet data
 * @param {Object} options - Query options
 */
export const useWallet = (options = {}) => {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: () => walletService.getWallet(),
    staleTime: 1000 * 60 * 3, // 3 minutes
    ...options,
  });
};

/**
 * Hook to transfer funds between wallet accounts
 */
export const useWalletTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ amount, from, to }) => 
      walletService.transfer(amount, from, to),
    onSuccess: () => {
      // Invalidate wallet and transactions to reflect the transfer
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
};
