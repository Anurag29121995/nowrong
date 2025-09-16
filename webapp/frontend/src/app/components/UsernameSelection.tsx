'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { getFirebaseFirestore } from '@/lib/firebase'
import { USERNAME_SUGGESTIONS } from '../config/brand'

interface UsernameSelectionProps {
  onNext: (data: { username: string }) => void
  onBack: () => void
  canGoBack: boolean
  formData: { username?: string; gender?: string }
}

export default function UsernameSelection({ onNext, onBack, canGoBack, formData }: UsernameSelectionProps) {
  const [username, setUsername] = useState('') // Don't prefill
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [availableSuggestions, setAvailableSuggestions] = useState<string[]>([])

  const getGenderSuggestions = () => {
    const gender = formData.gender?.toLowerCase() as 'male' | 'female' | 'other'
    return USERNAME_SUGGESTIONS[gender] || USERNAME_SUGGESTIONS.other
  }

  const checkUsernameAvailability = async (usernameToCheck: string): Promise<boolean> => {
    try {
      const db = getFirebaseFirestore()
      const usersRef = collection(db, 'users')
      const q = query(usersRef, where('username', '==', usernameToCheck))
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.empty // Returns true if no documents found (available)
    } catch (error) {
      return false // Assume unavailable on error
    }
  }

  const generateSuggestions = async (baseWord = '') => {
    const { prefixes, suffixes, adjectives } = getGenderSuggestions()
    const suggestions = []
    const maxLength = 12
    
    if (baseWord && baseWord.length >= 2) {
      const cleanBase = baseWord.substring(0, 6)
      
      for (let i = 0; i < 8; i++) {
        if (i < 3) {
          const number = Math.floor(Math.random() * 999) + 1
          suggestions.push(`${cleanBase}${number}`)
        } else if (i < 6) {
          const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
          if ((cleanBase + suffix).length <= maxLength) {
            suggestions.push(`${cleanBase}${suffix}`)
          } else {
            const number = Math.floor(Math.random() * 99) + 1
            suggestions.push(`${cleanBase}${number}`)
          }
        } else {
          const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
          const shortBase = cleanBase.substring(0, 4)
          if ((prefix + shortBase).length <= maxLength) {
            suggestions.push(`${prefix}${shortBase}`)
          } else {
            const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
            const number = Math.floor(Math.random() * 99) + 1
            suggestions.push(`${adj}${number}`)
          }
        }
      }
    } else {
      const patterns = [
        () => {
          const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
          const number = Math.floor(Math.random() * 999) + 1
          return `${prefix}${number}`
        },
        () => {
          const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
          const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
          return `${adj}${suffix}`
        },
        () => {
          const words = [...prefixes, ...adjectives]
          const word = words[Math.floor(Math.random() * words.length)]
          const number = Math.floor(Math.random() * 99) + 1
          return `${word}${number}`
        }
      ]
      
      for (let i = 0; i < 8; i++) {
        const pattern = patterns[i % patterns.length]
        const suggestion = pattern()
        if (suggestion.length <= maxLength) {
          suggestions.push(suggestion)
        }
      }
    }
    
    const uniqueSuggestions = Array.from(new Set(suggestions))
      .filter(s => s.length >= 3 && s.length <= maxLength)
      .slice(0, 8)
    
    setSuggestions(uniqueSuggestions)
    
    // Check availability for all suggestions
    const availabilityPromises = uniqueSuggestions.map(async (suggestion) => {
      const available = await checkUsernameAvailability(suggestion)
      return available ? suggestion : null
    })
    
    const results = await Promise.all(availabilityPromises)
    const available = results.filter(Boolean) as string[]
    setAvailableSuggestions(available.slice(0, 6)) // Show only 6 available suggestions
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
    const available = await checkUsernameAvailability(value)
    setIsAvailable(available)
    setIsChecking(false)
  }

  useEffect(() => {
    if (username) {
      const debounce = setTimeout(() => {
        checkAvailability(username)
        if (username.length >= 2) {
          generateSuggestions(username)
        }
      }, 500)
      return () => clearTimeout(debounce)
    } else {
      setIsAvailable(null)
      generateSuggestions('')
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

      {/* Available Suggestions Only */}
      {availableSuggestions.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">
              {username && username.length >= 2 ? `Available options for "${username}"` : 'Available Usernames'}
            </h3>
            <button
              onClick={() => generateSuggestions(username)}
              className="text-primary-400 hover:text-primary-300 text-sm transition-colors duration-300"
            >
              Refresh
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {availableSuggestions.map((suggestion, index) => (
              <motion.button
                key={`${suggestion}-${index}`}
                onClick={() => selectSuggestion(suggestion)}
                className="p-3 bg-glass-light border border-green-500/30 rounded-xl text-gray-300 hover:text-white hover:border-primary-400 hover:bg-glass-medium transition-all duration-300 text-sm relative"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="absolute top-1 right-2 text-green-400 text-xs">✓</span>
                {suggestion}
              </motion.button>
            ))}
          </div>
        </div>
      )}

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