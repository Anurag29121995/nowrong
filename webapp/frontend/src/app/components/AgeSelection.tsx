'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'

interface AgeSelectionProps {
  onNext: (data: { age: number }) => void
  onBack: () => void
  canGoBack: boolean
  formData: { age?: number }
}

export default function AgeSelection({ onNext, onBack, canGoBack, formData }: AgeSelectionProps) {
  const [selectedAge, setSelectedAge] = useState(formData.age || null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Generate ages from 18 to 65
  const ages = Array.from({ length: 48 }, (_, i) => i + 18)

  const handleSelect = (age: number) => {
    setSelectedAge(age)
  }

  const handleNext = () => {
    if (selectedAge) {
      onNext({ age: selectedAge })
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
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-light mb-4 bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
          Select Your Age
        </h1>
        <p className="text-gray-300 text-sm md:text-base">
          You must be 18+ to use NoWrong
        </p>
      </div>

      {/* Age Selection Container */}
      <div className="mb-8">
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
                className={`flex-shrink-0 w-16 h-16 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group ${
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

      {/* Selected Age Display */}
      {selectedAge && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center space-x-2 bg-black/50 border border-pink-500/30 rounded-xl px-4 py-2">
            <span className="text-gray-300">Selected age:</span>
            <span className="text-pink-300 font-semibold text-lg">{selectedAge}</span>
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
          disabled={!selectedAge}
          className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
            selectedAge
              ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:shadow-lg hover:scale-105'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
          whileHover={selectedAge ? { scale: 1.05 } : {}}
          whileTap={selectedAge ? { scale: 0.95 } : {}}
        >
          Continue
        </motion.button>
      </div>
    </div>
  )
}