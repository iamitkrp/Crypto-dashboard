'use client'

import { useState } from 'react'
import Image from 'next/image'
import { TrendingUp, TrendingDown, Star } from 'lucide-react'
import { useTopCryptos } from '@/hooks/useCrypto'
import { CryptoCurrency } from '@/lib/api'
import { formatCurrency, formatPercentage, formatMarketCap, getChangeColor } from '@/lib/utils'
import { motion } from 'framer-motion'

export function CryptoTable() {
  const [displayCount, setDisplayCount] = useState(12)
  const [favorites, setFavorites] = useState<string[]>([])
  const MAX_DISPLAY = 100
  const INCREMENT = 12

  const { data: cryptos, isLoading, error } = useTopCryptos(1, MAX_DISPLAY)

  const toggleFavorite = (coinId: string) => {
    setFavorites(prev => 
      prev.includes(coinId) 
        ? prev.filter(id => id !== coinId)
        : [...prev, coinId]
    )
  }

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 dark:bg-dark-300 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-dark-300 rounded w-96 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="flex items-center justify-between mb-3">
                <div className="w-6 h-6 bg-gray-200 dark:bg-dark-300 rounded-full"></div>
                <div className="w-4 h-4 bg-gray-200 dark:bg-dark-300 rounded"></div>
              </div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-dark-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-dark-300 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 dark:bg-dark-300 rounded w-16"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 dark:bg-dark-300 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-dark-300 rounded w-20"></div>
                <div className="h-4 bg-gray-200 dark:bg-dark-300 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-8 text-center">
        <div className="text-red-500 mb-2">⚠️ Error loading cryptocurrency data</div>
        <div className="text-gray-600 dark:text-dark-500">Please try again later.</div>
      </div>
    )
  }

  const MiniChart = ({ prices }: { prices?: number[] }) => {
    if (!prices || prices.length === 0) return null

    const max = Math.max(...prices)
    const min = Math.min(...prices)
    const range = max - min

    return (
      <div className="w-full h-8 flex items-end space-x-0.5">
        {prices.slice(-15).map((price, index) => {
          const height = range > 0 ? ((price - min) / range) * 100 : 50
          const isPositive = prices[prices.length - 1] >= prices[0]
          return (
            <div
              key={index}
              className={`flex-1 ${isPositive ? 'bg-green-500' : 'bg-red-500'} opacity-60 rounded-sm`}
              style={{ height: `${Math.max(height, 8)}%` }}
            />
          )
        })}
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-900 mb-2">Top Cryptocurrencies</h2>
        <p className="text-gray-600 dark:text-dark-500">
          Real-time cryptocurrency prices and market data • Showing {Math.min(displayCount, cryptos?.length || 0)} of {cryptos?.length || 0} coins
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 mb-8">
        {cryptos?.slice(0, displayCount).map((crypto: CryptoCurrency, index) => (
          <motion.div
            key={crypto.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.01 }}
            className="card p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
          >
            {/* Header with rank and favorite */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-gray-500 dark:text-dark-400 bg-gray-100 dark:bg-dark-200 px-2 py-1 rounded">
                  #{crypto.market_cap_rank}
                </span>
              </div>
              <button
                onClick={() => toggleFavorite(crypto.id)}
                className="text-gray-400 hover:text-yellow-500 transition-colors"
              >
                <Star
                  className={`w-4 h-4 ${
                    favorites.includes(crypto.id) ? 'fill-yellow-500 text-yellow-500' : ''
                  }`}
                />
              </button>
            </div>

            {/* Coin info */}
            <div className="flex items-center space-x-3 mb-4">
              <Image
                src={crypto.image}
                alt={crypto.name}
                width={40}
                height={40}
                className="rounded-full flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-gray-900 dark:text-dark-900 truncate">
                  {crypto.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-dark-400 uppercase font-medium">
                  {crypto.symbol}
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="mb-3">
              <div className="text-lg font-bold text-gray-900 dark:text-dark-900">
                {formatCurrency(crypto.current_price)}
              </div>
              <div className={`text-sm font-medium flex items-center space-x-1 ${getChangeColor(crypto.price_change_percentage_24h)}`}>
                {crypto.price_change_percentage_24h > 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{formatPercentage(crypto.price_change_percentage_24h)}</span>
              </div>
            </div>

            {/* Additional metrics */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-dark-400">Market Cap</span>
                <span className="font-medium">{formatMarketCap(crypto.market_cap)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-dark-400">Volume (24h)</span>
                <span className="font-medium">{formatMarketCap(crypto.total_volume)}</span>
              </div>
              {crypto.price_change_percentage_7d_in_currency && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-dark-400">7d Change</span>
                  <span className={`font-medium ${getChangeColor(crypto.price_change_percentage_7d_in_currency)}`}>
                    {formatPercentage(crypto.price_change_percentage_7d_in_currency)}
                  </span>
                </div>
              )}
            </div>

            {/* Mini chart */}
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-dark-200">
              <MiniChart prices={crypto.sparkline_in_7d?.price} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Expand More Button */}
      {displayCount < (cryptos?.length || 0) && displayCount < MAX_DISPLAY && (
        <div className="flex justify-center">
          <motion.button
            onClick={() => setDisplayCount(prev => Math.min(prev + INCREMENT, MAX_DISPLAY))}
            className="flex items-center space-x-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Expand More</span>
            <TrendingDown className="w-4 h-4 rotate-180" />
          </motion.button>
        </div>
      )}
      
      {/* Display info */}
      {displayCount >= (cryptos?.length || 0) || displayCount >= MAX_DISPLAY ? (
        <div className="text-center text-sm text-gray-600 dark:text-dark-500 mt-4">
          {displayCount >= MAX_DISPLAY ? 
            `Showing maximum ${MAX_DISPLAY} cryptocurrencies` : 
            'All cryptocurrencies displayed'
          }
        </div>
      ) : null}
    </div>
  )
} 