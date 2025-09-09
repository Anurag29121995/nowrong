'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface LetsChatProps {
  onNext: (data: any) => void
  onBack: () => void
  canGoBack: boolean
  formData: any
}

export default function LetsChat({ onNext, onBack, canGoBack, formData }: LetsChatProps) {
  const [isStarting, setIsStarting] = useState(false)

  const handleStartChat = async () => {
    setIsStarting(true)
    // Simulate loading/matching process
    await new Promise(resolve => setTimeout(resolve, 2000))
    // In a real app, this would navigate to the chat interface
    alert('Chat feature coming soon! 🚀')
    setIsStarting(false)
  }

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case 'male': return '♂️'
      case 'female': return '♀️'
      default: return '⚧️'
    }
  }

  const getLanguageFlag = (language: string) => {
    const flags: { [key: string]: string } = {
      'en': '🇺🇸', 'es': '🇪🇸', 'fr': '🇫🇷', 'de': '🇩🇪', 'it': '🇮🇹',
      'pt': '🇧🇷', 'ru': '🇷🇺', 'ja': '🇯🇵', 'ko': '🇰🇷', 'zh': '🇨🇳',
      'ar': '🇸🇦', 'hi': '🇮🇳'
    }
    return flags[language] || '🌐'
  }

  const categories = [
    { id: 'romantic', name: 'Romantic', icon: '💕' },
    { id: 'passionate', name: 'Passionate', icon: '🔥' },
    { id: 'adventurous', name: 'Adventurous', icon: '🌟' },
    { id: 'playful', name: 'Playful', icon: '😈' },
    { id: 'intimate', name: 'Intimate', icon: '🌙' },
    { id: 'fantasy', name: 'Fantasy', icon: '✨' },
    { id: 'sensual', name: 'Sensual', icon: '🌹' },
    { id: 'dominant', name: 'Dominant', icon: '👑' },
    { id: 'submissive', name: 'Submissive', icon: '🎭' },
    { id: 'fetish', name: 'Fetish', icon: '🔗' },
    { id: 'taboo', name: 'Taboo', icon: '🚫' },
    { id: 'vanilla', name: 'Vanilla', icon: '🍦' },
  ]

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-light mb-4 bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
          You're All Set!
        </h1>
        <p className="text-secondary-300 text-base md:text-lg">
          Ready to start your anonymous intimate journey?
        </p>
      </motion.div>

      {/* Profile Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-glass-medium backdrop-blur-lg border border-gray-600 rounded-3xl p-6 mb-8"
      >
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-glow">
            {getGenderIcon(formData.gender)}
          </div>
          <h2 className="text-2xl font-medium text-primary-300 mb-1">{formData.username}</h2>
          <div className="flex items-center justify-center space-x-4 text-gray-400">
            <span>{formData.age} years</span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <span>{getLanguageFlag(formData.language)}</span>
            </span>
          </div>
        </div>

        {/* Preferences */}
        {formData.preferences && formData.preferences.length > 0 && (
          <div>
            <h3 className="text-primary-400 font-medium mb-3 text-center">Your Interests</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {formData.preferences.map((prefId: string) => {
                const category = categories.find(c => c.id === prefId)
                return (
                  <span
                    key={prefId}
                    className="inline-flex items-center space-x-1 bg-primary-500/20 border border-primary-500/40 rounded-lg px-3 py-1"
                  >
                    <span>{category?.icon}</span>
                    <span className="text-primary-200 text-sm">{category?.name}</span>
                  </span>
                )
              })}
            </div>
          </div>
        )}
      </motion.div>

      {/* Features Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-3 gap-4 mb-8"
      >
        <div className="text-center p-4 bg-glass-light rounded-2xl border border-gray-700">
          <div className="text-2xl mb-2">🔒</div>
          <div className="text-xs text-gray-400">100% Anonymous</div>
        </div>
        <div className="text-center p-4 bg-glass-light rounded-2xl border border-gray-700">
          <div className="text-2xl mb-2">⚡</div>
          <div className="text-xs text-gray-400">Instant Match</div>
        </div>
        <div className="text-center p-4 bg-glass-light rounded-2xl border border-gray-700">
          <div className="text-2xl mb-2">💬</div>
          <div className="text-xs text-gray-400">Real-time Chat</div>
        </div>
      </motion.div>

      {/* Start Chat Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-8"
      >
        <motion.button
          onClick={handleStartChat}
          disabled={isStarting}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
            isStarting
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary-500 to-primary-700 text-white hover:shadow-glow hover:scale-105'
          }`}
          whileHover={!isStarting ? { scale: 1.05 } : {}}
          whileTap={!isStarting ? { scale: 0.95 } : {}}
        >
          {isStarting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              <span>Finding Your Match...</span>
            </div>
          ) : (
            "Let's Chat! 💫"
          )}
        </motion.button>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-center">
        {canGoBack && (
          <button
            onClick={onBack}
            disabled={isStarting}
            className="text-gray-400 hover:text-white transition-colors duration-300 px-4 py-2 disabled:opacity-50"
          >
            ← Edit Profile
          </button>
        )}
      </div>

      {/* Floating hearts animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-primary-400 opacity-20"
            initial={{
              x: Math.random() * 400,
              y: window.innerHeight + 50,
              scale: 0.5 + Math.random() * 0.5,
            }}
            animate={{
              y: -50,
              x: Math.random() * 400,
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 2,
              ease: "linear",
            }}
          >
            💕
          </motion.div>
        ))}
      </div>
    </div>
  )
}