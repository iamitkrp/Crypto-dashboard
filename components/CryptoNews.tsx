'use client'

import { useState, useEffect } from 'react'
import { Newspaper, ExternalLink, Clock, TrendingUp, Filter } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDate } from '@/lib/utils'

interface NewsArticle {
  id: string
  title: string
  url: string
  time_published: string
  authors: string[]
  summary: string
  source: string
  category_within_source: string
  overall_sentiment_score: number
  overall_sentiment_label: string
  ticker_sentiment?: Array<{
    ticker: string
    relevance_score: string
    ticker_sentiment_score: string
    ticker_sentiment_label: string
  }>
}

interface NewsResponse {
  feed: NewsArticle[]
  items: string
  sentiment_score_definition: string
}

export function CryptoNews() {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [error, setError] = useState<string | null>(null)

  const categories = [
    { value: 'all', label: 'All News', icon: Newspaper },
    { value: 'positive', label: 'Positive', icon: TrendingUp },
    { value: 'negative', label: 'Negative', icon: TrendingUp },
  ]

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Using Alpha Vantage News API (free tier available)
      // In a real app, you'd want to proxy this through your backend
      const API_KEY = 'demo' // Replace with your Alpha Vantage API key
      
      // For demo purposes, we'll use mock data since we don't have a real API key
      const mockNews: NewsArticle[] = [
        {
          id: '1',
          title: 'Bitcoin Reaches New All-Time High as Institutional Adoption Grows',
          url: 'https://example.com/news/1',
          time_published: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          authors: ['John Doe'],
          summary: 'Bitcoin has reached a new all-time high today as major institutions continue to adopt cryptocurrency as a store of value.',
          source: 'CoinDesk',
          category_within_source: 'Markets',
          overall_sentiment_score: 0.8,
          overall_sentiment_label: 'Bullish'
        },
        {
          id: '2',
          title: 'Ethereum 2.0 Staking Rewards Attract More Validators',
          url: 'https://example.com/news/2',
          time_published: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          authors: ['Jane Smith'],
          summary: 'The Ethereum 2.0 network continues to see growth in validator participation as staking rewards remain attractive.',
          source: 'CoinTelegraph',
          category_within_source: 'Technology',
          overall_sentiment_score: 0.6,
          overall_sentiment_label: 'Bullish'
        },
        {
          id: '3',
          title: 'Regulatory Concerns Impact Crypto Market Sentiment',
          url: 'https://example.com/news/3',
          time_published: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          authors: ['Mike Johnson'],
          summary: 'Recent regulatory announcements have created uncertainty in the cryptocurrency market, leading to increased volatility.',
          source: 'Decrypt',
          category_within_source: 'Regulation',
          overall_sentiment_score: -0.4,
          overall_sentiment_label: 'Bearish'
        },
        {
          id: '4',
          title: 'DeFi Protocol Launches New Yield Farming Program',
          url: 'https://example.com/news/4',
          time_published: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          authors: ['Sarah Wilson'],
          summary: 'A popular DeFi protocol has announced a new yield farming program offering competitive rewards for liquidity providers.',
          source: 'The Block',
          category_within_source: 'DeFi',
          overall_sentiment_score: 0.5,
          overall_sentiment_label: 'Bullish'
        },
        {
          id: '5',
          title: 'Central Bank Digital Currency Pilot Program Announced',
          url: 'https://example.com/news/5',
          time_published: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          authors: ['David Brown'],
          summary: 'A major central bank has announced a pilot program for testing their digital currency, marking a significant step in CBDC development.',
          source: 'Reuters',
          category_within_source: 'CBDC',
          overall_sentiment_score: 0.3,
          overall_sentiment_label: 'Neutral'
        }
      ]

      setNews(mockNews)
    } catch (err) {
      setError('Failed to fetch news. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const filteredNews = news.filter(article => {
    if (selectedCategory === 'all') return true
    if (selectedCategory === 'positive') return article.overall_sentiment_score > 0.2
    if (selectedCategory === 'negative') return article.overall_sentiment_score < -0.2
    return true
  })

  const getSentimentColor = (score: number) => {
    if (score > 0.2) return 'text-green-500'
    if (score < -0.2) return 'text-red-500'
    return 'text-yellow-500'
  }

  const getSentimentBg = (score: number) => {
    if (score > 0.2) return 'bg-green-100 dark:bg-green-900/20'
    if (score < -0.2) return 'bg-red-100 dark:bg-red-900/20'
    return 'bg-yellow-100 dark:bg-yellow-900/20'
  }

  if (loading) {
    return (
      <div className="card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Newspaper className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Crypto News</h2>
            <p className="text-gray-600 dark:text-dark-500">Latest cryptocurrency news and updates</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse p-4 bg-gray-50 dark:bg-dark-200 rounded-lg">
              <div className="h-5 bg-gray-200 dark:bg-dark-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-dark-300 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-dark-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-6">
        <div className="text-center py-8">
          <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-dark-900 mb-2">Failed to load news</h3>
          <p className="text-gray-600 dark:text-dark-500 mb-4">{error}</p>
          <button
            onClick={fetchNews}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Newspaper className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Crypto News</h2>
            <p className="text-gray-600 dark:text-dark-500">Latest cryptocurrency news and updates</p>
          </div>
        </div>
        
        <button
          onClick={fetchNews}
          className="px-3 py-1 text-sm bg-gray-100 dark:bg-dark-200 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-300 transition-colors"
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex items-center space-x-2 mb-6">
        <Filter className="w-4 h-4 text-gray-500" />
        <div className="flex space-x-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-dark-200 hover:bg-gray-200 dark:hover:bg-dark-300'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* News List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredNews.slice(0, 3).map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gray-50 dark:bg-dark-200 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-dark-900 mb-2 hover:text-primary-600 transition-colors">
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="flex items-start space-x-2">
                      <span>{article.title}</span>
                      <ExternalLink className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    </a>
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-dark-500 mb-3 line-clamp-2">
                    {article.summary}
                  </p>
                </div>
                
                <div className={`ml-4 px-2 py-1 rounded-full text-xs font-medium ${getSentimentBg(article.overall_sentiment_score)}`}>
                  <span className={getSentimentColor(article.overall_sentiment_score)}>
                    {article.overall_sentiment_label}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-dark-400">
                <div className="flex items-center space-x-4">
                  <span className="font-medium">{article.source}</span>
                  <span>{article.category_within_source}</span>
                  <span>By {article.authors.join(', ')}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(new Date(article.time_published), 'MMM dd, HH:mm')}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-8">
          <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-dark-900 mb-2">No news found</h3>
          <p className="text-gray-600 dark:text-dark-500">Try selecting a different category</p>
        </div>
      )}
    </div>
  )
} 