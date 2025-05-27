'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit3, Wallet, TrendingUp, TrendingDown, PieChart } from 'lucide-react'
import { useTopCryptos } from '@/hooks/useCrypto'
import { formatCurrency, formatPercentage, getChangeColor } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface PortfolioHolding {
  id: string
  coinId: string
  symbol: string
  name: string
  image: string
  amount: number
  avgBuyPrice: number
  currentPrice: number
  priceChange24h: number
}

export function Portfolio() {
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingHolding, setEditingHolding] = useState<PortfolioHolding | null>(null)
  
  const { data: cryptos } = useTopCryptos(1, 100)

  // Load portfolio from localStorage
  useEffect(() => {
    const savedPortfolio = localStorage.getItem('crypto-portfolio')
    if (savedPortfolio) {
      setHoldings(JSON.parse(savedPortfolio))
    }
  }, [])

  // Save portfolio to localStorage
  useEffect(() => {
    localStorage.setItem('crypto-portfolio', JSON.stringify(holdings))
  }, [holdings])

  // Update current prices
  useEffect(() => {
    if (cryptos && holdings.length > 0) {
      setHoldings(prevHoldings => 
        prevHoldings.map(holding => {
          const crypto = cryptos.find(c => c.id === holding.coinId)
          return crypto ? {
            ...holding,
            currentPrice: crypto.current_price,
            priceChange24h: crypto.price_change_percentage_24h
          } : holding
        })
      )
    }
  }, [cryptos, holdings.length])

  const calculatePortfolioValue = () => {
    return holdings.reduce((total, holding) => {
      return total + (holding.amount * holding.currentPrice)
    }, 0)
  }

  const calculateTotalGainLoss = () => {
    return holdings.reduce((total, holding) => {
      const invested = holding.amount * holding.avgBuyPrice
      const current = holding.amount * holding.currentPrice
      return total + (current - invested)
    }, 0)
  }

  const calculateTotalGainLossPercent = () => {
    const totalInvested = holdings.reduce((total, holding) => {
      return total + (holding.amount * holding.avgBuyPrice)
    }, 0)
    
    if (totalInvested === 0) return 0
    return (calculateTotalGainLoss() / totalInvested) * 100
  }

  const portfolioValue = calculatePortfolioValue()
  const totalGainLoss = calculateTotalGainLoss()
  const totalGainLossPercent = calculateTotalGainLossPercent()

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
              <Wallet className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold">My Portfolio</h2>
              <p className="text-gray-600 dark:text-dark-500">Track your crypto investments</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Holding</span>
          </button>
        </div>

        {/* Portfolio Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 dark:bg-dark-200 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-dark-500 mb-1">Total Value</p>
            <p className="text-2xl font-bold">{formatCurrency(portfolioValue)}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-dark-200 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-dark-500 mb-1">Total Gain/Loss</p>
            <div className={`text-2xl font-bold ${getChangeColor(totalGainLoss)}`}>
              {totalGainLoss >= 0 ? '+' : ''}{formatCurrency(totalGainLoss)}
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-dark-200 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-dark-500 mb-1">Total Return</p>
            <div className={`text-2xl font-bold flex items-center justify-center space-x-1 ${getChangeColor(totalGainLossPercent)}`}>
              {totalGainLossPercent > 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              <span>{formatPercentage(totalGainLossPercent)}</span>
            </div>
          </div>
        </div>

        {/* Holdings List */}
        {holdings.length === 0 ? (
          <div className="text-center py-12">
            <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-dark-900 mb-2">No holdings yet</h3>
            <p className="text-gray-600 dark:text-dark-500 mb-4">Start tracking your crypto investments</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Add Your First Holding
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {holdings.map((holding, index) => {
                const currentValue = holding.amount * holding.currentPrice
                const invested = holding.amount * holding.avgBuyPrice
                const gainLoss = currentValue - invested
                const gainLossPercent = ((currentValue - invested) / invested) * 100

                return (
                  <motion.div
                    key={holding.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-200 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <img src={holding.image} alt={holding.name} className="w-10 h-10 rounded-full" />
                      <div>
                        <div className="font-medium">{holding.name}</div>
                        <div className="text-sm text-gray-600 dark:text-dark-500">
                          {holding.amount} {holding.symbol.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(currentValue)}</div>
                      <div className={`text-sm flex items-center space-x-1 ${getChangeColor(gainLoss)}`}>
                        {gainLoss > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>{formatPercentage(gainLossPercent)}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingHolding(holding)}
                        className="p-1 text-gray-600 hover:text-primary-600 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setHoldings(prev => prev.filter(h => h.id !== holding.id))}
                        className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Add/Edit Modal would go here - simplified for brevity */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-100 p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">Add New Holding</h3>
            <p className="text-gray-600 dark:text-dark-500">Modal content would go here...</p>
            <button
              onClick={() => setShowAddModal(false)}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 