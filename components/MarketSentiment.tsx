'use client'

import { motion } from 'framer-motion'

export function MarketSentiment() {
  console.log('MarketSentiment component rendering...')
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card card-hover p-6"
    >
      <h3 className="text-lg font-semibold mb-4">Market Sentiment</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm">Bullish</span>
          <div className="flex-1 mx-3 bg-gray-200 dark:bg-dark-300 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <span className="text-sm font-medium">65%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Bearish</span>
          <div className="flex-1 mx-3 bg-gray-200 dark:bg-dark-300 rounded-full h-2">
            <div className="bg-red-500 h-2 rounded-full" style={{ width: '35%' }}></div>
          </div>
          <span className="text-sm font-medium">35%</span>
        </div>
      </div>
    </motion.div>
  )
} 