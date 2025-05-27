'use client'

import { useGlobalData } from '@/hooks/useCrypto'
import { motion } from 'framer-motion'

export function MarketDominance() {
  const { data: globalData, isLoading } = useGlobalData()

  if (isLoading) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-dark-300 rounded mb-4"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-dark-300 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-dark-300 rounded"></div>
          <div className="h-2 bg-gray-200 dark:bg-dark-300 rounded"></div>
        </div>
      </div>
    )
  }

  const btcDominance = globalData?.data?.market_cap_percentage?.btc || 0
  const ethDominance = globalData?.data?.market_cap_percentage?.eth || 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="card card-hover p-6"
    >
      <h3 className="text-lg font-semibold mb-4">Market Dominance</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="font-medium">Bitcoin (BTC)</span>
          </div>
          <span className="font-bold">{btcDominance.toFixed(1)}%</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="font-medium">Ethereum (ETH)</span>
          </div>
          <span className="font-bold">{ethDominance.toFixed(1)}%</span>
        </div>
      </div>
      <div className="mt-4 h-2 bg-gray-200 dark:bg-dark-300 rounded-full overflow-hidden">
        <div className="h-full flex">
          <div
            className="bg-orange-500 h-full"
            style={{ width: `${btcDominance}%` }}
          ></div>
          <div
            className="bg-blue-500 h-full"
            style={{ width: `${ethDominance}%` }}
          ></div>
          <div
            className="bg-gray-400 h-full"
            style={{ width: `${100 - btcDominance - ethDominance}%` }}
          ></div>
        </div>
      </div>
    </motion.div>
  )
} 