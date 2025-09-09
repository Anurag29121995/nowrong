'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'

interface AgeSelectionProps {
  onNext: (data: { age: number; interest: string }) => void
  onBack: () => void
  canGoBack: boolean
  formData: { age?: number; interest?: string }
}

export default function AgeSelection({ onNext, onBack, canGoBack, formData }: AgeSelectionProps) {
  const [selectedAge, setSelectedAge] = useState(formData.age || null)
  const [selectedInterest, setSelectedInterest] = useState(formData.interest || '')
  const scrollRef = useRef<HTMLDivElement>(null)

  // Generate ages from 18 to 65
  const ages = Array.from({ length: 48 }, (_, i) => i + 18)

  const interests = [
    {
      id: 'women',
      label: 'Women',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.14 2 5 5.14 5 9s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
          <path d="M11 18v3H9v2h6v-2h-2v-3h-2z"/>
        </svg>
      )
    },
    {
      id: 'men',
      label: 'Men',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 9c0-3.86 3.14-7 7-7s7 3.14 7 7-3.14 7-7 7-7-3.14-7-7zM16 2c-3.86 0-7 3.14-7 7s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm0 2c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5z"/>
          <path d="m22 2-6 6 1.41 1.41L20 6.83V10h2V2h-8v2h3.17l-2.58 2.58L16 8l6-6z"/>
        </svg>
      )
    },
    {
      id: 'both',
      label: 'Both',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.14 2 5 5.14 5 9s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
          <path d="M11 18v3H9v2h6v-2h-2v-3h-2z"/>
          <path d="m18 2-3 3 1.41 1.41L18 4.83V7h2V2h-5v2h2.59l-1.3 1.3L18 7l3-3z"/>
        </svg>
      )
    }
  ]

  const handleSelect = (age: number) => {
    setSelectedAge(age)
  }

  const handleInterestSelect = (interest: string) => {
    setSelectedInterest(interest)
  }

  const handleNext = () => {
    if (selectedAge && selectedInterest) {
      onNext({ age: selectedAge, interest: selectedInterest })
    }
  }

  const scrollLeft = () => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.7 // Scroll 70% of visible width
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.7 // Scroll 70% of visible width
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <div className="w-full px-4 md:px-0">
      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl md:text-4xl font-light mb-3 md:mb-4 bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
          Age & Interest
        </h1>
        <p className="text-gray-300 text-sm md:text-base px-2">
          You must be 18+ and select your interest
        </p>
      </div>

      {/* Age Selection Container */}
      <div className="mb-6 md:mb-8">
        {/* Navigation Arrows - Outside the scroll area */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={scrollLeft}
            className="w-10 h-10 bg-black/50 backdrop-blur-lg border border-gray-600 rounded-full flex items-center justify-center text-gray-300 hover:text-pink-400 hover:border-pink-400 transition-all duration-300 hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>

          <span className="text-gray-400 text-sm">Scroll to see more ages</span>

          <button
            onClick={scrollRight}
            className="w-10 h-10 bg-black/50 backdrop-blur-lg border border-gray-600 rounded-full flex items-center justify-center text-gray-300 hover:text-pink-400 hover:border-pink-400 transition-all duration-300 hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Age Scroll Container */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-3 px-4 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {ages.map((age) => (
              <motion.button
                key={age}
                onClick={() => handleSelect(age)}
                className={`flex-shrink-0 w-16 h-16 rounded-2xl border-2 transition-all duration-300 relative group ${
                  selectedAge === age
                    ? 'border-pink-500 bg-black/50 shadow-lg shadow-pink-500/30'
                    : 'border-gray-600 bg-black/20 hover:border-pink-400 hover:bg-black/40'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Gradient overlay for selected state */}
                {selectedAge === age && (
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-rose-600/20 rounded-2xl" />
                )}
                
                <div className="flex items-center justify-center h-full relative z-10">
                  <span className={`text-lg font-medium transition-colors duration-300 ${
                    selectedAge === age 
                      ? 'text-pink-300' 
                      : 'text-gray-300 group-hover:text-pink-300'
                  }`}>
                    {age}
                  </span>
                </div>

                {/* Selection indicator */}
                {selectedAge === age && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Subtle fade overlays on the sides */}
          <div className="absolute left-0 top-0 w-4 h-full bg-gradient-to-r from-black to-transparent pointer-events-none z-20" />
          <div className="absolute right-0 top-0 w-4 h-full bg-gradient-to-l from-black to-transparent pointer-events-none z-20" />
        </div>
      </div>

      {/* Interest Selection */}
      <div className="mb-8">
        <h3 className="text-xl font-medium text-white mb-4 text-center">Interested in</h3>
        <div className="flex justify-center gap-4">
          {interests.map((interest) => (
            <motion.button
              key={interest.id}
              onClick={() => handleInterestSelect(interest.id)}
              className={`relative flex flex-col items-center space-y-2 p-4 rounded-2xl border-2 transition-all duration-300 min-w-[80px] ${
                selectedInterest === interest.id
                  ? 'border-pink-500 bg-glass-medium shadow-glow shadow-pink-500/30'
                  : 'border-gray-600 bg-glass-light hover:border-pink-400 hover:bg-glass-medium'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`transition-colors duration-300 ${
                selectedInterest === interest.id 
                  ? 'text-pink-400' 
                  : 'text-gray-400 hover:text-pink-300'
              }`}>
                {interest.icon}
              </div>
              <span className={`text-sm font-medium transition-colors duration-300 ${
                selectedInterest === interest.id 
                  ? 'text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}>
                {interest.label}
              </span>
              
              {selectedInterest === interest.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center"
                >
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Selected Items Display */}
      {(selectedAge || selectedInterest) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center space-x-4 bg-black/50 border border-pink-500/30 rounded-xl px-4 py-2">
            {selectedAge && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-300">Age:</span>
                <span className="text-pink-300 font-semibold">{selectedAge}</span>
              </div>
            )}
            {selectedAge && selectedInterest && (
              <div className="w-px h-4 bg-gray-600"></div>
            )}
            {selectedInterest && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-300">Interest:</span>
                <span className="text-pink-300 font-semibold">
                  {interests.find(i => i.id === selectedInterest)?.label}
                </span>
              </div>
            )}
          </div>
        </motion.div>
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
          disabled={!selectedAge || !selectedInterest}
          className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
            selectedAge && selectedInterest
              ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:shadow-lg hover:scale-105'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
          whileHover={selectedAge && selectedInterest ? { scale: 1.05 } : {}}
          whileTap={selectedAge && selectedInterest ? { scale: 0.95 } : {}}
        >
          Continue
        </motion.button>
      </div>
    </div>
  )
}