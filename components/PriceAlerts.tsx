'use client'

import { useState, useEffect } from 'react'
import { Bell, Plus, Trash2, TrendingUp, TrendingDown, CheckCircle, AlertCircle } from 'lucide-react'
import { useTopCryptos } from '@/hooks/useCrypto'
import { formatCurrency } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface PriceAlert {
  id: string
  coinId: string
  coinName: string
  coinSymbol: string
  coinImage: string
  targetPrice: number
  condition: 'above' | 'below'
  isActive: boolean
  triggered: boolean
  createdAt: Date
}

export function PriceAlerts() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [triggeredAlerts, setTriggeredAlerts] = useState<PriceAlert[]>([])
  
  const { data: cryptos } = useTopCryptos(1, 100)

  // Load alerts from localStorage
  useEffect(() => {
    const savedAlerts = localStorage.getItem('crypto-alerts')
    if (savedAlerts) {
      setAlerts(JSON.parse(savedAlerts))
    }
  }, [])

  // Save alerts to localStorage
  useEffect(() => {
    localStorage.setItem('crypto-alerts', JSON.stringify(alerts))
  }, [alerts])

  // Check for triggered alerts
  useEffect(() => {
    if (cryptos && alerts.length > 0) {
      const newTriggeredAlerts: PriceAlert[] = []
      
      setAlerts(prevAlerts => 
        prevAlerts.map(alert => {
          if (!alert.isActive || alert.triggered) return alert
          
          const crypto = cryptos.find(c => c.id === alert.coinId)
          if (!crypto) return alert

          const shouldTrigger = 
            (alert.condition === 'above' && crypto.current_price >= alert.targetPrice) ||
            (alert.condition === 'below' && crypto.current_price <= alert.targetPrice)

          if (shouldTrigger) {
            const triggeredAlert = { ...alert, triggered: true, isActive: false }
            newTriggeredAlerts.push(triggeredAlert)
            
            // Show browser notification if permission granted
            if (Notification.permission === 'granted') {
              new Notification(`Price Alert: ${alert.coinName}`, {
                body: `${alert.coinSymbol.toUpperCase()} has reached ${formatCurrency(crypto.current_price)}`,
                icon: alert.coinImage
              })
            }
            
            return triggeredAlert
          }
          
          return alert
        })
      )

      if (newTriggeredAlerts.length > 0) {
        setTriggeredAlerts(prev => [...prev, ...newTriggeredAlerts])
      }
    }
  }, [cryptos, alerts.length])

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  const addAlert = (coinId: string, targetPrice: number, condition: 'above' | 'below') => {
    const crypto = cryptos?.find(c => c.id === coinId)
    if (!crypto) return

    const newAlert: PriceAlert = {
      id: Date.now().toString(),
      coinId,
      coinName: crypto.name,
      coinSymbol: crypto.symbol,
      coinImage: crypto.image,
      targetPrice,
      condition,
      isActive: true,
      triggered: false,
      createdAt: new Date()
    }

    setAlerts(prev => [...prev, newAlert])
    setShowAddModal(false)
  }

  const deleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }

  const dismissTriggeredAlert = (alertId: string) => {
    setTriggeredAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }

  const activeAlerts = alerts.filter(alert => alert.isActive && !alert.triggered)
  const inactiveAlerts = alerts.filter(alert => alert.triggered)

  return (
    <div className="space-y-6">
      {/* Triggered Alerts Notifications */}
      <AnimatePresence>
        {triggeredAlerts.map(alert => (
          <motion.div
            key={`triggered-${alert.id}`}
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-4 right-4 z-50 bg-green-500 text-white p-4 rounded-lg shadow-lg max-w-sm"
          >
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium">Price Alert Triggered!</h4>
                <p className="text-sm">
                  {alert.coinName} has reached your target of {formatCurrency(alert.targetPrice)}
                </p>
              </div>
              <button
                onClick={() => dismissTriggeredAlert(alert.id)}
                className="text-white hover:text-gray-200"
              >
                ×
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main Alerts Panel */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Bell className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Price Alerts</h2>
              <p className="text-gray-600 dark:text-dark-500">Get notified when prices hit your targets</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {Notification.permission === 'default' && (
              <button
                onClick={requestNotificationPermission}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-dark-200 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-300 transition-colors"
              >
                Enable Notifications
              </button>
            )}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Alert</span>
            </button>
          </div>
        </div>

        {/* Alert Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 dark:bg-dark-200 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-dark-500">Active Alerts</p>
            <p className="text-xl font-bold text-green-600">{activeAlerts.length}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-dark-200 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-dark-500">Triggered Today</p>
            <p className="text-xl font-bold text-blue-600">{inactiveAlerts.length}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-dark-200 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-dark-500">Above Target</p>
            <p className="text-xl font-bold text-orange-600">
              {activeAlerts.filter(a => a.condition === 'above').length}
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-dark-200 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-dark-500">Below Target</p>
            <p className="text-xl font-bold text-red-600">
              {activeAlerts.filter(a => a.condition === 'below').length}
            </p>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Active Alerts</h3>
          {activeAlerts.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-dark-500">No active alerts</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-3 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Create Your First Alert
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {activeAlerts.map((alert, index) => {
                const crypto = cryptos?.find(c => c.id === alert.coinId)
                const currentPrice = crypto?.current_price || 0
                const distance = ((alert.targetPrice - currentPrice) / currentPrice) * 100
                
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <img src={alert.coinImage} alt={alert.coinName} className="w-10 h-10 rounded-full" />
                      <div>
                        <div className="font-medium">{alert.coinName}</div>
                        <div className="text-sm text-gray-600 dark:text-dark-500">
                          Current: {formatCurrency(currentPrice)} • Target: {formatCurrency(alert.targetPrice)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className={`flex items-center space-x-1 ${
                          alert.condition === 'above' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {alert.condition === 'above' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          <span className="font-medium capitalize">{alert.condition}</span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-dark-500">
                          {distance > 0 ? '+' : ''}{distance.toFixed(1)}% away
                        </div>
                      </div>
                      
                      <button
                        onClick={() => deleteAlert(alert.id)}
                        className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Alert Modal - Simplified */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-100 p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">Add Price Alert</h3>
            <p className="text-gray-600 dark:text-dark-500 mb-4">
              Select a cryptocurrency and set your target price...
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Demo: Add a Bitcoin alert
                  addAlert('bitcoin', 50000, 'above')
                }}
                className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Add Demo Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 