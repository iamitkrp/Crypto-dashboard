export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-dark-900 mb-4">404</h1>
        <p className="text-gray-600 dark:text-dark-600 mb-8">Page not found</p>
        <a 
          href="/" 
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  )
} 