'use client'

import Image from 'next/image'
import { Flame, TrendingUp } from 'lucide-react'
import { useTrendingCoins } from '@/hooks/useCrypto'
import { motion } from 'framer-motion'

export function TrendingCoins() {
  const { data: trendingData, isLoading } = useTrendingCoins()

  if (isLoading) {
    return (
      <div className="card p-4 h-full">
        <div className="flex items-center space-x-2 mb-3">
          <Flame className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-semibold">Trending Coins</h3>
        </div>
        <div className="space-y-1.5">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 animate-pulse p-1.5">
              <div className="w-6 h-6 bg-gray-200 dark:bg-dark-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-3.5 bg-gray-200 dark:bg-dark-300 rounded w-3/4"></div>
                <div className="h-2.5 bg-gray-200 dark:bg-dark-300 rounded w-1/2 mt-1"></div>
              </div>
              <div className="w-8 h-5 bg-gray-200 dark:bg-dark-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const trendingCoins = trendingData?.coins || []

  return (
    <div className="card p-4 h-full flex flex-col">
      <div className="flex items-center space-x-2 mb-3">
        <Flame className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-semibold">Trending Coins</h3>
        <TrendingUp className="w-4 h-4 text-green-500" />
      </div>
      
      <div className="space-y-1.5 flex-1">
        {trendingCoins.slice(0, 10).map((coin, index) => (
          <motion.div
            key={coin.item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center space-x-3 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-200 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-center w-5 h-5 text-xs font-bold text-gray-500 dark:text-dark-400">
              {index + 1}
            </div>
            <Image
              src={coin.item.small}
              alt={coin.item.name}
              width={24}
              height={24}
              className="rounded-full"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 dark:text-dark-900 truncate">
                {coin.item.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-dark-400 uppercase">
                {coin.item.symbol}
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-gray-600 dark:text-dark-500">
                #{coin.item.market_cap_rank}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-dark-200">
        <p className="text-xs text-gray-500 dark:text-dark-400 text-center">
          Based on search activity and social sentiment
        </p>
      </div>
    </div>
  )
} 