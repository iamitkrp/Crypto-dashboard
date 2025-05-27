'use client'

import { Header } from '@/components/Header'
import { MarketOverview } from '@/components/MarketOverview'
import { CryptoTable } from '@/components/CryptoTable'
import { TrendingCoins } from '@/components/TrendingCoins'
import { CryptoNews } from '@/components/CryptoNews'
import { MarketDominance } from '@/components/MarketDominance'
import { MarketSentiment } from '@/components/MarketSentiment'
import { QuickStats } from '@/components/QuickStats'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-50">
      <Header />
      
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Market Overview Stats - First 4 cards only */}
        <div className="max-w-7xl mx-auto mb-8">
          <MarketOverview />
        </div>

        {/* First Row: Market Dominance, Market Sentiment, Quick Stats */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <MarketDominance />
            <MarketSentiment />
            <QuickStats />
          </div>
        </div>

        {/* Second Row: Trending Coins (50%) + Crypto News (50%) */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrendingCoins />
            <CryptoNews />
          </div>
        </div>

        {/* Third Row: Top Cryptocurrencies Table */}
        <div className="max-w-[1600px] mx-auto mb-8">
          <CryptoTable />
        </div>

        {/* Footer */}
        <footer className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-200 dark:border-dark-200">
          <div className="text-center text-gray-600 dark:text-dark-500">
            <p>&copy; 2024 CryptoDash. Data provided by CoinGecko API.</p>
            <p className="text-sm mt-1">Built with Next.js, Tailwind CSS, and Framer Motion</p>
          </div>
        </footer>
      </main>
    </div>
  )
} 