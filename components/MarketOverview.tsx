'use client'

import { TrendingUp, TrendingDown, DollarSign, Activity, BarChart3 } from 'lucide-react'
import { useGlobalData, useFearGreedIndex } from '@/hooks/useCrypto'
import { formatMarketCap, formatPercentage, getChangeColor } from '@/lib/utils'
import { motion } from 'framer-motion'

export function MarketOverview() {
  const { data: globalData, isLoading: globalLoading } = useGlobalData()
  const { data: fearGreedData, isLoading: fearGreedLoading } = useFearGreedIndex()

  if (globalLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-dark-300 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 dark:bg-dark-300 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  const marketCap = globalData?.data?.total_market_cap?.usd || 0
  const volume = globalData?.data?.total_volume?.usd || 0
  const marketCapChange = globalData?.data?.market_cap_change_percentage_24h_usd || 0
  const activeCryptos = globalData?.data?.active_cryptocurrencies || 0

  const fearGreedValue = parseInt(fearGreedData?.data?.[0]?.value || '50')
  const fearGreedClassification = fearGreedData?.data?.[0]?.value_classification || 'Neutral'

  const getFearGreedColor = (value: number) => {
    if (value <= 25) return 'text-red-500'
    if (value <= 50) return 'text-orange-500'
    if (value <= 75) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getFearGreedBg = (value: number) => {
    if (value <= 25) return 'bg-red-100 dark:bg-red-900/20'
    if (value <= 50) return 'bg-orange-100 dark:bg-orange-900/20'
    if (value <= 75) return 'bg-yellow-100 dark:bg-yellow-900/20'
    return 'bg-green-100 dark:bg-green-900/20'
  }

  const cards = [
    {
      title: 'Total Market Cap',
      value: formatMarketCap(marketCap),
      change: marketCapChange,
      icon: DollarSign,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: '24h Volume',
      value: formatMarketCap(volume),
      change: null,
      icon: BarChart3,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: 'Active Cryptocurrencies',
      value: activeCryptos.toLocaleString(),
      change: null,
      icon: Activity,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Fear & Greed Index',
      value: fearGreedLoading ? 'Loading...' : `${fearGreedValue}`,
      subtitle: fearGreedClassification,
      change: null,
      icon: TrendingUp,
      color: getFearGreedColor(fearGreedValue),
      bgColor: getFearGreedBg(fearGreedValue),
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="card card-hover p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${card.bgColor}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            {card.change !== null && (
              <div className={`flex items-center space-x-1 ${getChangeColor(card.change)}`}>
                {card.change > 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {formatPercentage(card.change)}
                </span>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-dark-500 mb-1">
              {card.title}
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-dark-900">
              {card.value}
            </p>
            {card.subtitle && (
              <p className="text-sm text-gray-500 dark:text-dark-400 mt-1">
                {card.subtitle}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}