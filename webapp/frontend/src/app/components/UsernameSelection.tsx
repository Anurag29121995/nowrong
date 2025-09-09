'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { USERNAME_SUGGESTIONS } from '../config/brand'

interface UsernameSelectionProps {
  onNext: (data: { username: string }) => void
  onBack: () => void
  canGoBack: boolean
  formData: { username?: string; gender?: string }
}

export default function UsernameSelection({ onNext, onBack, canGoBack, formData }: UsernameSelectionProps) {
  const [username, setUsername] = useState(formData.username || '')
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])

  const getGenderSuggestions = () => {
    const gender = formData.gender?.toLowerCase() as 'male' | 'female' | 'other'
    return USERNAME_SUGGESTIONS[gender] || USERNAME_SUGGESTIONS.other
  }

  const generateSuggestions = (baseWord = '') => {
    const { prefixes, suffixes, adjectives } = getGenderSuggestions()
    const suggestions = []
    const maxLength = 12 // Keep usernames under 12 characters
    
    if (baseWord && baseWord.length >= 2) {
      // Clean base word - take first 6 chars max
      const cleanBase = baseWord.substring(0, 6)
      
      // Generate suggestions based on user input
      for (let i = 0; i < 6; i++) {
        if (i < 2) {
          // Base + number (shortest)
          const number = Math.floor(Math.random() * 999) + 1
          suggestions.push(`${cleanBase}${number}`)
        } else if (i < 4) {
          // Base + suffix
          const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
          if ((cleanBase + suffix).length <= maxLength) {
            suggestions.push(`${cleanBase}${suffix}`)
          } else {
            // Fallback to number if too long
            const number = Math.floor(Math.random() * 99) + 1
            suggestions.push(`${cleanBase}${number}`)
          }
        } else {
          // Prefix + shortened base
          const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
          const shortBase = cleanBase.substring(0, 4)
          if ((prefix + shortBase).length <= maxLength) {
            suggestions.push(`${prefix}${shortBase}`)
          } else {
            // Fallback to adjective + number
            const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
            const number = Math.floor(Math.random() * 99) + 1
            suggestions.push(`${adj}${number}`)
          }
        }
      }
    } else {
      // Default suggestions when no input - short and logical
      const patterns = [
        // Prefix + number
        () => {
          const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
          const number = Math.floor(Math.random() * 999) + 1
          return `${prefix}${number}`
        },
        // Adjective + suffix
        () => {
          const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
          const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
          return `${adj}${suffix}`
        },
        // Single word + number
        () => {
          const words = [...prefixes, ...adjectives]
          const word = words[Math.floor(Math.random() * words.length)]
          const number = Math.floor(Math.random() * 99) + 1
          return `${word}${number}`
        }
      ]
      
      for (let i = 0; i < 6; i++) {
        const pattern = patterns[i % patterns.length]
        const suggestion = pattern()
        if (suggestion.length <= maxLength) {
          suggestions.push(suggestion)
        }
      }
    }
    
    // Remove duplicates and ensure all suggestions are within length limit
    const uniqueSuggestions = Array.from(new Set(suggestions))
      .filter(s => s.length >= 3 && s.length <= maxLength)
      .slice(0, 6)
    
    setSuggestions(uniqueSuggestions)
  }

  useEffect(() => {
    generateSuggestions(username)
  }, [])

  const checkAvailability = async (value: string) => {
    if (value.length < 3) {
      setIsAvailable(null)
      return
    }

    setIsChecking(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Simple availability logic - some names are "taken"
    const takenNames = ['admin', 'test', 'user', 'guest', 'root', 'anonymous']
    const available = !takenNames.includes(value.toLowerCase()) && Math.random() > 0.3
    
    setIsAvailable(available)
    setIsChecking(false)
  }

  useEffect(() => {
    if (username) {
      const debounce = setTimeout(() => {
        checkAvailability(username)
        // Also regenerate suggestions based on current input
        if (username.length >= 2) {
          generateSuggestions(username)
        }
      }, 500)
      return () => clearTimeout(debounce)
    } else {
      setIsAvailable(null)
      generateSuggestions('') // Generate default suggestions when input is empty
    }
  }, [username])

  const handleNext = () => {
    if (username && isAvailable) {
      onNext({ username })
    }
  }

  const selectSuggestion = (suggestion: string) => {
    setUsername(suggestion)
  }

  return (
    <div className="w-full px-4 md:px-0">
      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl md:text-4xl font-light mb-3 md:mb-4 bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
          Choose Your Username
        </h1>
        <p className="text-gray-300 text-sm md:text-base px-2">
          Your anonymous identity for intimate conversations
        </p>
      </div>

      {/* Username Input */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username..."
            className="w-full p-4 bg-glass-medium backdrop-blur-lg border-2 border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none transition-all duration-300"
            maxLength={12}
            minLength={3}
          />
          
          {/* Validation Indicator */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {isChecking && (
              <div className="w-5 h-5 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
            )}
            {isAvailable === true && (
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            {isAvailable === false && (
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Status Messages */}
        <div className="mt-2 min-h-[20px]">
          {username.length > 0 && username.length < 3 && (
            <p className="text-yellow-400 text-sm">Username must be at least 3 characters</p>
          )}
          {isChecking && (
            <p className="text-gray-400 text-sm">Checking availability...</p>
          )}
          {isAvailable === true && (
            <p className="text-green-400 text-sm">✓ Username is available!</p>
          )}
          {isAvailable === false && (
            <p className="text-red-400 text-sm">✗ Username is already taken</p>
          )}
        </div>
      </div>

      {/* Suggestions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">
            {username && username.length >= 2 ? `Based on "${username}"` : 'Suggested Usernames'}
          </h3>
          <button
            onClick={() => generateSuggestions(username)}
            className="text-primary-400 hover:text-primary-300 text-sm transition-colors duration-300"
          >
            Refresh
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={`${suggestion}-${index}`}
              onClick={() => selectSuggestion(suggestion)}
              className="p-3 bg-glass-light border border-gray-600 rounded-xl text-gray-300 hover:text-white hover:border-primary-400 hover:bg-glass-medium transition-all duration-300 text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {suggestion}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        {canGoBack ? (
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white transition-colors duration-300 px-4 py-2"
          >
            ← Back
          </button>
        ) : (
          <div />
        )}

        <motion.button
          onClick={handleNext}
          disabled={!username || !isAvailable}
          className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
            username && isAvailable
              ? 'bg-gradient-to-r from-primary-500 to-primary-700 text-white hover:shadow-glow hover:scale-105'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
          whileHover={username && isAvailable ? { scale: 1.05 } : {}}
          whileTap={username && isAvailable ? { scale: 0.95 } : {}}
        >
          Continue
        </motion.button>
      </div>
    </div>
  )
}