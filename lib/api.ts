import axios from 'axios'

const BASE_URL = 'https://api.coingecko.com/api/v3'

export interface CryptoCurrency {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number
  max_supply: number
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number
  atl_change_percentage: number
  atl_date: string
  roi: any
  last_updated: string
  sparkline_in_7d?: {
    price: number[]
  }
  price_change_percentage_1h_in_currency?: number
  price_change_percentage_7d_in_currency?: number
  price_change_percentage_30d_in_currency?: number
}

export interface GlobalMarketData {
  data: {
    active_cryptocurrencies: number
    upcoming_icos: number
    ongoing_icos: number
    ended_icos: number
    markets: number
    total_market_cap: { [key: string]: number }
    total_volume: { [key: string]: number }
    market_cap_percentage: { [key: string]: number }
    market_cap_change_percentage_24h_usd: number
    updated_at: number
  }
}

export interface TrendingCoin {
  id: string
  coin_id: number
  name: string
  symbol: string
  market_cap_rank: number
  thumb: string
  small: string
  large: string
  slug: string
  price_btc: number
  score: number
}

export interface ChartData {
  prices: [number, number][]
  market_caps: [number, number][]
  total_volumes: [number, number][]
}

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

export const cryptoAPI = {
  // Get top cryptocurrencies
  getTopCryptos: async (
    page: number = 1,
    perPage: number = 100,
    vs_currency: string = 'usd'
  ): Promise<CryptoCurrency[]> => {
    const response = await api.get('/coins/markets', {
      params: {
        vs_currency,
        order: 'market_cap_desc',
        per_page: perPage,
        page,
        sparkline: true,
        price_change_percentage: '1h,24h,7d,30d',
      },
    })
    return response.data
  },

  // Get global market data
  getGlobalData: async (): Promise<GlobalMarketData> => {
    const response = await api.get('/global')
    return response.data
  },

  // Get trending coins
  getTrending: async (): Promise<{ coins: { item: TrendingCoin }[] }> => {
    const response = await api.get('/search/trending')
    return response.data
  },

  // Get specific coin data
  getCoinData: async (id: string): Promise<any> => {
    const response = await api.get(`/coins/${id}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: true,
      },
    })
    return response.data
  },

  // Get price chart data
  getChartData: async (
    coinId: string,
    days: number = 7,
    vs_currency: string = 'usd'
  ): Promise<ChartData> => {
    const response = await api.get(`/coins/${coinId}/market_chart`, {
      params: {
        vs_currency,
        days,
        interval: days <= 1 ? 'hourly' : 'daily',
      },
    })
    return response.data
  },

  // Search coins
  searchCoins: async (query: string): Promise<any> => {
    const response = await api.get('/search', {
      params: { query },
    })
    return response.data
  },

  // Get fear and greed index
  getFearGreedIndex: async (): Promise<any> => {
    try {
      const response = await axios.get('https://api.alternative.me/fng/')
      return response.data
    } catch (error) {
      // Fallback data if API is unavailable
      return {
        data: [{
          value: "50",
          value_classification: "Neutral",
          timestamp: Date.now() / 1000,
          time_until_update: "0"
        }]
      }
    }
  },
} 