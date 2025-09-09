'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface GenderSelectionProps {
  onNext: (data: { gender: string }) => void
  onBack: () => void
  canGoBack: boolean
  formData: { gender?: string }
}

export default function GenderSelection({ onNext, onBack, canGoBack, formData }: GenderSelectionProps) {
  const [selectedGender, setSelectedGender] = useState(formData.gender || '')

  const genders = [
    {
      id: 'male',
      label: 'Male',
      icon: (
        <svg className="w-16 h-16 md:w-20 md:h-20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 9c0-3.86 3.14-7 7-7s7 3.14 7 7-3.14 7 7 7-7-3.14-7-7zM16 2c-3.86 0-7 3.14-7 7s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm0 2c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5z"/>
          <path d="m22 2-6 6 1.41 1.41L20 6.83V10h2V2h-8v2h3.17l-2.58 2.58L16 8l6-6z"/>
        </svg>
      ),
      color: 'text-primary-400'
    },
    {
      id: 'female',
      label: 'Female', 
      icon: (
        <svg className="w-16 h-16 md:w-20 md:h-20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.14 2 5 5.14 5 9s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
          <path d="M11 18v3H9v2h6v-2h-2v-3h-2z"/>
        </svg>
      ),
      color: 'text-primary-500'
    },
    {
      id: 'other',
      label: 'Other',
      icon: (
        <svg className="w-16 h-16 md:w-20 md:h-20" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="9" r="7"/>
          <path d="M13.5 7.5h-3v3h3v-3z"/>
          <path d="M11 14v3H9v2h6v-2h-2v-3h-2z"/>
          <path d="m18 2-3 3 1.41 1.41L18 4.83V7h2V2h-5v2h2.59l-1.3 1.3L18 7l3-3z"/>
        </svg>
      ),
      color: 'text-primary-600'
    }
  ]

  const handleSelect = (gender: string) => {
    setSelectedGender(gender)
  }

  // Auto-proceed after selection with a small delay (only if not coming back from previous selection)
  useEffect(() => {
    if (selectedGender && selectedGender !== formData.gender) {
      const timer = setTimeout(() => {
        onNext({ gender: selectedGender })
      }, 800) // 800ms delay for user to see selection
      
      return () => clearTimeout(timer)
    }
  }, [selectedGender, onNext])

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-6 md:mb-10">
        <h1 className="text-2xl md:text-4xl font-light mb-3 md:mb-4 bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
          Select Your Gender
        </h1>
        <p className="text-gray-300 text-sm md:text-base px-2">
          This helps us connect you with the right people
        </p>
      </div>

      {/* Gender Options */}
      <div className="space-y-4 md:space-y-6 mb-6 md:mb-8 px-4 md:px-0">
        {genders.map((gender) => (
          <motion.button
            key={gender.id}
            onClick={() => handleSelect(gender.id)}
            className={`w-full p-4 md:p-6 rounded-2xl md:rounded-3xl border-2 transition-all duration-300 relative overflow-hidden group ${
              selectedGender === gender.id
                ? 'border-primary-500 bg-glass-medium shadow-glow scale-110 shadow-primary-500/30'
                : 'border-gray-600 bg-glass-light hover:border-primary-400 hover:bg-glass-medium hover:scale-102'
            }`}
            whileHover={{ scale: selectedGender === gender.id ? 1.05 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Gradient overlay for selected state */}
            {selectedGender === gender.id && (
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-primary-700/10 rounded-3xl" />
            )}
            
            <div className="flex flex-col items-center justify-center space-y-3 md:space-y-4 relative z-10">
              <div className={`transition-all duration-300 flex items-center justify-center ${gender.color} ${
                selectedGender === gender.id 
                  ? 'drop-shadow-lg' 
                  : 'opacity-70 group-hover:opacity-100'
              }`}>
                {gender.icon}
              </div>
              <span className={`text-lg md:text-xl font-semibold transition-colors duration-300 ${
                selectedGender === gender.id 
                  ? 'text-white' 
                  : 'text-gray-300 group-hover:text-white'
              }`}>
                {gender.label}
              </span>
            </div>

            {/* Selection indicator with animation */}
            {selectedGender === gender.id && (
              <motion.div
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="absolute top-3 right-3 md:top-6 md:right-6 w-6 h-6 md:w-8 md:h-8 bg-primary-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <svg className="w-3 h-3 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </motion.div>
            )}

            {/* Loading indicator after selection */}
            {selectedGender === gender.id && selectedGender !== formData.gender && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-3 md:bottom-6 left-1/2 transform -translate-x-1/2"
              >
                <div className="flex items-center space-x-2 text-primary-300">
                  <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Back button only (no continue since it's auto) */}
      <div className="flex justify-center">
        {canGoBack && (
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white transition-colors duration-300 px-4 py-2"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  )
}