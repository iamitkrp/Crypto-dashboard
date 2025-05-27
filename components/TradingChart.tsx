'use client'

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react'
import { useChartData } from '@/hooks/useCrypto'
import { formatCurrency, formatDate } from '@/lib/utils'
import { motion } from 'framer-motion'

interface TradingChartProps {
  coinId: string
  coinName: string
  currentPrice: number
  priceChange24h: number
}

export function TradingChart({ coinId, coinName, currentPrice, priceChange24h }: TradingChartProps) {
  const [timeframe, setTimeframe] = useState(7)
  const [chartType, setChartType] = useState<'area' | 'line'>('area')
  
  const { data: chartData, isLoading } = useChartData(coinId, timeframe)

  const timeframes = [
    { label: '1D', value: 1 },
    { label: '7D', value: 7 },
    { label: '1M', value: 30 },
    { label: '3M', value: 90 },
    { label: '1Y', value: 365 },
  ]

  const formatChartData = (data: [number, number][]) => {
    return data?.map(([timestamp, price]) => ({
      time: timestamp,
      price: price,
      formattedTime: formatDate(new Date(timestamp), timeframe <= 1 ? 'HH:mm' : 'MMM dd'),
    })) || []
  }

  const chartDataFormatted = formatChartData(chartData?.prices || [])
  const isPositive = priceChange24h > 0

  if (isLoading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-dark-300 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 dark:bg-dark-300 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold">{coinName} Price Chart</h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-2xl font-bold">{formatCurrency(currentPrice)}</span>
            <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="font-medium">
                {isPositive ? '+' : ''}{priceChange24h.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        
        {/* Chart Type Toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setChartType('area')}
            className={`p-2 rounded-lg transition-colors ${
              chartType === 'area' 
                ? 'bg-primary-500 text-white' 
                : 'bg-gray-100 dark:bg-dark-200 hover:bg-gray-200 dark:hover:bg-dark-300'
            }`}
          >
            <Activity className="w-4 h-4" />
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`p-2 rounded-lg transition-colors ${
              chartType === 'line' 
                ? 'bg-primary-500 text-white' 
                : 'bg-gray-100 dark:bg-dark-200 hover:bg-gray-200 dark:hover:bg-dark-300'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex items-center space-x-2 mb-6">
        {timeframes.map((tf) => (
          <button
            key={tf.value}
            onClick={() => setTimeframe(tf.value)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              timeframe === tf.value
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-dark-200 hover:bg-gray-200 dark:hover:bg-dark-300'
            }`}
          >
            {tf.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-64"
      >
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={chartDataFormatted}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? "#10B981" : "#EF4444"} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={isPositive ? "#10B981" : "#EF4444"} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="formattedTime" 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={['dataMin', 'dataMax']} 
                className="text-xs"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-dark-100 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-dark-200">
                        <p className="text-sm font-medium">{label}</p>
                        <p className="text-sm">
                          <span className="font-medium">Price: </span>
                          {formatCurrency(payload[0].value as number)}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={isPositive ? "#10B981" : "#EF4444"}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          ) : (
            <LineChart data={chartDataFormatted}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="formattedTime" 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={['dataMin', 'dataMax']} 
                className="text-xs"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-dark-100 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-dark-200">
                        <p className="text-sm font-medium">{label}</p>
                        <p className="text-sm">
                          <span className="font-medium">Price: </span>
                          {formatCurrency(payload[0].value as number)}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={isPositive ? "#10B981" : "#EF4444"}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </motion.div>

      {/* Chart Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-dark-200">
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-dark-400">24h High</p>
          <p className="font-semibold text-sm">
            {chartDataFormatted.length > 0 
              ? formatCurrency(Math.max(...chartDataFormatted.map(d => d.price)))
              : '-'
            }
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-dark-400">24h Low</p>
          <p className="font-semibold text-sm">
            {chartDataFormatted.length > 0 
              ? formatCurrency(Math.min(...chartDataFormatted.map(d => d.price)))
              : '-'
            }
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-dark-400">Volume</p>
          <p className="font-semibold text-sm">
            {chartData?.total_volumes?.[chartData.total_volumes.length - 1]?.[1]
              ? `$${(chartData.total_volumes[chartData.total_volumes.length - 1][1] / 1e9).toFixed(2)}B`
              : '-'
            }
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-dark-400">Market Cap</p>
          <p className="font-semibold text-sm">
            {chartData?.market_caps?.[chartData.market_caps.length - 1]?.[1]
              ? `$${(chartData.market_caps[chartData.market_caps.length - 1][1] / 1e9).toFixed(2)}B`
              : '-'
            }
          </p>
        </div>
      </div>
    </div>
  )
} 