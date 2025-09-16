export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600">
      <div className="text-center">
        <h2 className="text-6xl font-bold text-white mb-4">404</h2>
        <p className="text-xl text-white mb-8">Could not find the requested page.</p>
        <a 
          href="/" 
          className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Return Home
        </a>
      </div>
    </div>
  )
}