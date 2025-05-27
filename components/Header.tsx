'use client'

import { useState } from 'react'
import { Search, Moon, Sun, TrendingUp, Wallet, Settings } from 'lucide-react'
import { useTheme } from '@/app/theme-provider'
import { useSearchCoins } from '@/hooks/useCrypto'
import { debounce } from '@/lib/utils'

export function Header() {
  const { theme, setTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  const { data: searchResults, isLoading: searchLoading } = useSearchCoins(
    searchQuery,
    searchQuery.length > 2
  )

  const debouncedSearch = debounce((query: string) => {
    setSearchQuery(query)
  }, 300)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    debouncedSearch(value)
    setShowSearch(value.length > 0)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-dark-100/80 backdrop-blur-lg border-b border-gray-200 dark:border-dark-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold gradient-text">CryptoDash</h1>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-8 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search cryptocurrencies..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-dark-200 border border-gray-200 dark:border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                onChange={handleSearchChange}
              />
            </div>

            {/* Search Results */}
            {showSearch && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-dark-100 rounded-lg shadow-xl border border-gray-200 dark:border-dark-200 max-h-96 overflow-y-auto z-50">
                {searchLoading ? (
                  <div className="p-4 text-center text-gray-500">Searching...</div>
                ) : searchResults?.coins?.length > 0 ? (
                  <div className="py-2">
                    {searchResults.coins.slice(0, 5).map((coin: any) => (
                      <div
                        key={coin.id}
                        className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-dark-200 cursor-pointer transition-colors"
                        onClick={() => setShowSearch(false)}
                      >
                        <img
                          src={coin.thumb}
                          alt={coin.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <div>
                          <div className="font-medium text-sm">{coin.name}</div>
                          <div className="text-xs text-gray-500 uppercase">{coin.symbol}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">No results found</div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors">
              <Wallet className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
} 