'use client'

import { motion } from 'framer-motion'

export function QuickStats() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="card card-hover p-6"
    >
      <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-dark-500">Coins with data</span>
          <span className="font-medium">13,000+</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-dark-500">Active exchanges</span>
          <span className="font-medium">500+</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-dark-500">Last updated</span>
          <span className="font-medium text-green-500">Live</span>
        </div>
      </div>
    </motion.div>
  )
} 