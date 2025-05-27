import { useQuery } from 'react-query'
import { cryptoAPI, CryptoCurrency, GlobalMarketData, TrendingCoin, ChartData } from '@/lib/api'

export function useTopCryptos(page: number = 1, perPage: number = 100) {
  return useQuery<CryptoCurrency[]>(
    ['topCryptos', page, perPage],
    () => cryptoAPI.getTopCryptos(page, perPage),
    {
      staleTime: 30 * 1000, // 30 seconds
      refetchInterval: 60 * 1000, // 1 minute
    }
  )
}

export function useGlobalData() {
  return useQuery<GlobalMarketData>(
    'globalData',
    cryptoAPI.getGlobalData,
    {
      staleTime: 60 * 1000, // 1 minute
      refetchInterval: 2 * 60 * 1000, // 2 minutes
    }
  )
}

export function useTrendingCoins() {
  return useQuery<{ coins: { item: TrendingCoin }[] }>(
    'trendingCoins',
    cryptoAPI.getTrending,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchInterval: 10 * 60 * 1000, // 10 minutes
    }
  )
}

export function useCoinData(coinId: string, enabled: boolean = true) {
  return useQuery(
    ['coinData', coinId],
    () => cryptoAPI.getCoinData(coinId),
    {
      enabled,
      staleTime: 60 * 1000, // 1 minute
      refetchInterval: 2 * 60 * 1000, // 2 minutes
    }
  )
}

export function useChartData(coinId: string, days: number = 7, enabled: boolean = true) {
  return useQuery<ChartData>(
    ['chartData', coinId, days],
    () => cryptoAPI.getChartData(coinId, days),
    {
      enabled,
      staleTime: 60 * 1000, // 1 minute
      refetchInterval: days <= 1 ? 60 * 1000 : 5 * 60 * 1000, // 1 min for daily, 5 min for longer
    }
  )
}

export function useFearGreedIndex() {
  return useQuery(
    'fearGreedIndex',
    cryptoAPI.getFearGreedIndex,
    {
      staleTime: 60 * 60 * 1000, // 1 hour
      refetchInterval: 60 * 60 * 1000, // 1 hour
    }
  )
}

export function useSearchCoins(query: string, enabled: boolean = true) {
  return useQuery(
    ['searchCoins', query],
    () => cryptoAPI.searchCoins(query),
    {
      enabled: enabled && query.length > 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )
} 