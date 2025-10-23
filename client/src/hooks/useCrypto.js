import { useQuery } from '@tanstack/react-query';

/**
 * Fetch real crypto prices from CoinGecko API
 */
const fetchCryptoPrices = async () => {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,binancecoin,solana,ripple&vs_currencies=usd&include_24hr_change=true'
    );
    const data = await response.json();
    return {
      bitcoin: { usd: data.bitcoin?.usd || 0, usd_24h_change: data.bitcoin?.usd_24h_change || 0 },
      ethereum: { usd: data.ethereum?.usd || 0, usd_24h_change: data.ethereum?.usd_24h_change || 0 },
      tether: { usd: data.tether?.usd || 0, usd_24h_change: data.tether?.usd_24h_change || 0 },
      binancecoin: { usd: data.binancecoin?.usd || 0, usd_24h_change: data.binancecoin?.usd_24h_change || 0 },
      solana: { usd: data.solana?.usd || 0, usd_24h_change: data.solana?.usd_24h_change || 0 },
      ripple: { usd: data.ripple?.usd || 0, usd_24h_change: data.ripple?.usd_24h_change || 0 }
    };
  } catch (error) {
    console.error('Failed to fetch crypto prices:', error);
    // Return mock data as fallback
    return {
      bitcoin: { usd: 67234.50, usd_24h_change: 2.45 },
      ethereum: { usd: 3456.78, usd_24h_change: -1.23 },
      tether: { usd: 1.00, usd_24h_change: 0.01 },
      binancecoin: { usd: 589.23, usd_24h_change: 1.89 },
      solana: { usd: 145.67, usd_24h_change: 3.21 },
      ripple: { usd: 0.52, usd_24h_change: -0.87 }
    };
  }
};

/**
 * Hook to fetch cryptocurrency prices
 * @param {Object} options - Query options
 */
export const useCryptoPrices = (options = {}) => {
  return useQuery({
    queryKey: ['cryptoPrices'],
    queryFn: fetchCryptoPrices,
    staleTime: 1000 * 60, // 1 minute - crypto prices change frequently
    refetchInterval: 1000 * 60, // Auto-refetch every 1 minute
    ...options,
  });
};
