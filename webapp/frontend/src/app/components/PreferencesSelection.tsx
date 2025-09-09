'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface PreferencesSelectionProps {
  onNext: (data: { preferences: string[] }) => void
  onBack: () => void
  canGoBack: boolean
  formData: { preferences?: string[] }
}

export default function PreferencesSelection({ onNext, onBack, canGoBack, formData }: PreferencesSelectionProps) {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(formData.preferences || [])

  const categories = [
    { 
      id: 'rough', 
      name: 'Rough Sex', 
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 4c-1.5 0-3 1-3 2.5v3c0 1.5 1.5 2.5 3 2.5s3-1 3-2.5v-3c0-1.5-1.5-2.5-3-2.5z"/>
          <path d="M8 8l-2 2v6l2 2h8l2-2v-6l-2-2"/>
          <path d="M6 12h12M6 14h12M6 16h12"/>
          <circle cx="8" cy="6" r="1"/>
          <circle cx="16" cy="6" r="1"/>
        </svg>
      ), 
      description: 'Pound me rough' 
    },
    { 
      id: 'bdsm', 
      name: 'BDSM', 
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 6c-1 0-2 1-2 2v8c0 1 1 2 2 2h8c1 0 2-1 2-2V8c0-1-1-2-2-2"/>
          <path d="M6 8h12v8H6z" fillOpacity="0.3"/>
          <circle cx="10" cy="10" r="1.5"/>
          <circle cx="14" cy="14" r="1.5"/>
          <path d="M8 12c0-2 2-2 4 0s4 2 4 0"/>
          <path d="M7 7l10 10M17 7l-10 10" strokeWidth="1.5" stroke="currentColor" fill="none"/>
        </svg>
      ), 
      description: 'Tie me up' 
    },
    { 
      id: 'anal', 
      name: 'Anal Sex', 
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <ellipse cx="12" cy="12" rx="8" ry="10"/>
          <ellipse cx="12" cy="12" rx="4" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="12" r="2"/>
          <path d="M12 7v10M8 9v6M16 9v6" stroke="currentColor" strokeWidth="1" fill="none"/>
        </svg>
      ), 
      description: 'Fuck my ass' 
    },
    { 
      id: 'oral', 
      name: 'Oral Sex', 
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <ellipse cx="12" cy="10" rx="6" ry="3"/>
          <path d="M12 13c-3 0-6 1-6 3v2c0 1 1 2 2 2h8c1 0 2-1 2-2v-2c0-2-3-3-6-3z"/>
          <circle cx="10" cy="10" r="1"/>
          <circle cx="14" cy="10" r="1"/>
          <path d="M12 12v4M9 15h6" stroke="currentColor" strokeWidth="1" fill="none"/>
        </svg>
      ), 
      description: 'Suck it deep' 
    },
    { 
      id: 'threesome', 
      name: 'Threesome', 
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <ellipse cx="8" cy="12" rx="3" ry="4"/>
          <ellipse cx="16" cy="12" rx="3" ry="4"/>
          <ellipse cx="12" cy="8" rx="2" ry="3"/>
          <path d="M12 11c-2 0-4 1-4 2s2 2 4 2 4-1 4-2-2-2-4-2z"/>
          <circle cx="8" cy="10" r="0.5"/>
          <circle cx="16" cy="10" r="0.5"/>
          <circle cx="12" cy="6" r="0.5"/>
        </svg>
      ), 
      description: 'Three way wild' 
    },
    { 
      id: 'gangbang', 
      name: 'Gangbang', 
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <ellipse cx="6" cy="12" rx="2" ry="3"/>
          <ellipse cx="12" cy="12" rx="2" ry="3"/>
          <ellipse cx="18" cy="12" rx="2" ry="3"/>
          <ellipse cx="12" cy="8" rx="1.5" ry="2"/>
          <ellipse cx="12" cy="16" rx="1.5" ry="2"/>
          <path d="M12 10c-4 0-8 1-8 3s4 3 8 3 8-1 8-3-4-3-8-3z" fillOpacity="0.6"/>
        </svg>
      ), 
      description: 'Group fuck me' 
    },
    { 
      id: 'milf', 
      name: 'MILF', 
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 8c0-2 2-4 4-4s4 2 4 4c0 3-4 6-4 6s-4-3-4-6z"/>
          <ellipse cx="12" cy="14" rx="6" ry="4"/>
          <ellipse cx="12" cy="14" rx="3" ry="2" fill="none" stroke="currentColor" strokeWidth="1"/>
          <circle cx="16" cy="6" r="1"/>
          <path d="M8 12c0 2 2 4 4 4s4-2 4-4"/>
        </svg>
      ), 
      description: 'Horny mommy sluts' 
    },
    { 
      id: 'teen', 
      name: 'Teen', 
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <ellipse cx="12" cy="8" rx="3" ry="4"/>
          <ellipse cx="12" cy="16" rx="4" ry="3"/>
          <circle cx="10" cy="7" r="0.5"/>
          <circle cx="14" cy="7" r="0.5"/>
          <path d="M12 10c-2 0-3 1-3 2s1 2 3 2 3-1 3-2-1-2-3-2z"/>
          <path d="M18 4c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2z" fillOpacity="0.8"/>
        </svg>
      ), 
      description: 'Young tight sluts' 
    },
    { 
      id: 'incest', 
      name: 'Family Taboo', 
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM20 22v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 7h-2.08A1.5 1.5 0 0 0 15.04 8.37L12.5 16H15v6h5zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm1.5 16v-6H9.5l-2.54-7.63A1.5 1.5 0 0 0 5.54 7H3.46A1.5 1.5 0 0 0 2.04 8.37L-.5 16H2v6h5z"/>
        </svg>
      ), 
      description: 'Forbidden family fun' 
    },
    { 
      id: 'creampie', 
      name: 'Creampie', 
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <ellipse cx="12" cy="12" rx="6" ry="8"/>
          <ellipse cx="12" cy="12" rx="3" ry="4" fill="none" stroke="currentColor" strokeWidth="2"/>
          <path d="M9 14c0 2 1 4 3 4s3-2 3-4" fill="white" fillOpacity="0.8"/>
          <circle cx="12" cy="16" r="1" fill="white"/>
          <path d="M8 10l8 0M8 12l8 0" stroke="currentColor" strokeWidth="1" fill="none"/>
        </svg>
      ), 
      description: 'Cum inside me' 
    },
    { 
      id: 'squirting', 
      name: 'Squirting', 
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <ellipse cx="12" cy="10" rx="4" ry="6"/>
          <path d="M12 16c-2 2-4 4-6 6M12 16c2 2 4 4 6 6M12 16c0 2 0 4 0 6" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M12 16c-1 1-3 2-5 3M12 16c1 1 3 2 5 3" stroke="currentColor" strokeWidth="1" fill="none"/>
          <circle cx="12" cy="8" r="1"/>
        </svg>
      ), 
      description: 'Make me gush' 
    },
    { 
      id: 'facials', 
      name: 'Facials', 
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <ellipse cx="12" cy="12" rx="8" ry="10"/>
          <circle cx="8" cy="10" r="1"/>
          <circle cx="16" cy="10" r="1"/>
          <ellipse cx="12" cy="14" rx="4" ry="2" fill="white" fillOpacity="0.9"/>
          <path d="M12 8c-3 3-6 6-8 8M12 8c3 3 6 6 8 8" stroke="white" strokeWidth="2" fill="none" opacity="0.7"/>
          <path d="M9 13h6" stroke="currentColor" strokeWidth="1" fill="none"/>
        </svg>
      ), 
      description: 'Cum on face' 
    },
    { 
      id: 'deepthroat', 
      name: 'Deepthroat', 
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <ellipse cx="6" cy="12" rx="4" ry="8"/>
          <path d="M10 12h10c1 0 2-1 2-2s-1-2-2-2H10"/>
          <path d="M10 8c0-1 1-2 2-2h8c1 0 2 1 2 2"/>
          <circle cx="6" cy="10" r="1"/>
          <path d="M18 10c1 0 2 1 2 2s-1 2-2 2"/>
          <path d="M12 14v4M16 14v4M20 14v4" stroke="currentColor" strokeWidth="1" fill="none"/>
        </svg>
      ), 
      description: 'Gag me hard' 
    },
    { 
      id: 'footfetish', 
      name: 'Foot Fetish', 
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 15v4c0 .55-.45 1-1 1s-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1zM14 15v4c0 .55-.45 1-1 1s-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1zM12 13v6c0 .55-.45 1-1 1s-1-.45-1-1v-6c0-.55.45-1 1-1s1 .45 1 1zM8 11v8c0 .55-.45 1-1 1s-1-.45-1-1v-8c0-.55.45-1 1-1s1 .45 1 1z"/>
          <ellipse cx="11" cy="6" rx="5" ry="4"/>
        </svg>
      ), 
      description: 'Worship my feet' 
    },
    { 
      id: 'pregnant', 
      name: 'Pregnant', 
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 11H7v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9h-2a4 4 0 0 1-6 0z"/>
          <circle cx="12" cy="4" r="2"/>
          <path d="M12 6.5c-2.33 0-4.32 1.45-5.12 3.5h1.67c.69-1.19 1.97-2 3.45-2s2.76.81 3.45 2h1.67c-.8-2.05-2.79-3.5-5.12-3.5z"/>
        </svg>
      ), 
      description: 'Breed me wild' 
    },
    { 
      id: 'lactation', 
      name: 'Lactation', 
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="10" cy="9" r="3"/>
          <circle cx="14" cy="9" r="3"/>
          <path d="M8 12c0 2 2 4 4 4s4-2 4-4"/>
          <path d="M10 15v3"/>
          <path d="M14 15v3"/>
        </svg>
      ), 
      description: 'Milk my tits' 
    },
    { 
      id: 'bondage', 
      name: 'Bondage', 
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <rect x="8" y="4" width="8" height="16" rx="4" ry="4" fill="none" stroke="currentColor" strokeWidth="2"/>
          <path d="M6 8h4"/>
          <path d="M14 8h4"/>
          <path d="M6 16h4"/>
          <path d="M14 16h4"/>
        </svg>
      ), 
      description: 'Tie me tight' 
    },
    { 
      id: 'spanking', 
      name: 'Spanking', 
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 12l10 10 10-10L12 2zm0 15l-5-5 5-5 5 5-5 5z"/>
          <path d="M8 12l4-4 4 4-4 4z"/>
        </svg>
      ), 
      description: 'Spank me raw' 
    },
    { 
      id: 'exhibitionism', 
      name: 'Exhibitionism', 
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 2v2"/>
          <path d="M12 20v2"/>
          <path d="M4.93 4.93l1.41 1.41"/>
          <path d="M17.66 17.66l1.41 1.41"/>
          <path d="M2 12h2"/>
          <path d="M20 12h2"/>
        </svg>
      ), 
      description: 'Watch me strip' 
    },
    { 
      id: 'voyeurism', 
      name: 'Voyeurism', 
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      ), 
      description: 'Love to watch' 
    }
  ]

  const handleToggle = (categoryId: string) => {
    setSelectedPreferences(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId)
      } else if (prev.length < 5) {
        return [...prev, categoryId]
      }
      return prev
    })
  }

  const handleNext = () => {
    if (selectedPreferences.length > 0) {
      onNext({ preferences: selectedPreferences })
    }
  }

  return (
    <div className="w-full px-4 md:px-0">
      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl md:text-4xl font-light mb-3 md:mb-4 bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
          Your Preferences
        </h1>
        <p className="text-gray-300 text-sm md:text-base mb-2 px-2">
          Select what interests you most (max 5)
        </p>
        <div className="text-xs text-gray-400">
          {selectedPreferences.length}/5 selected
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-3 mb-6 md:mb-8 max-h-[360px] overflow-y-auto">
        {categories.map((category, index) => {
          const isSelected = selectedPreferences.includes(category.id)
          const isDisabled = !isSelected && selectedPreferences.length >= 5

          return (
            <motion.button
              key={category.id}
              onClick={() => handleToggle(category.id)}
              disabled={isDisabled}
              className={`p-2 md:p-3 rounded-xl md:rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group ${
                isSelected
                  ? 'border-primary-500 bg-glass-medium shadow-glow'
                  : isDisabled
                  ? 'border-gray-700 bg-glass-light opacity-50 cursor-not-allowed'
                  : 'border-gray-600 bg-glass-light hover:border-primary-400 hover:bg-glass-medium'
              }`}
              whileHover={!isDisabled ? { scale: 1.02 } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Gradient overlay for selected state */}
              {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-primary-700/20 rounded-2xl" />
              )}
              
              <div className="text-center relative z-10">
                <div className="flex justify-center mb-1 text-primary-400 [&>svg]:w-4 [&>svg]:h-4 md:[&>svg]:w-5 md:[&>svg]:h-5">{category.icon}</div>
                <div className={`font-medium text-xs md:text-sm transition-colors duration-300 ${
                  isSelected 
                    ? 'text-primary-300' 
                    : isDisabled
                    ? 'text-gray-500'
                    : 'text-gray-300 group-hover:text-primary-300'
                }`}>
                  {category.name}
                </div>
                <div className={`text-xs transition-colors duration-300 ${
                  isSelected 
                    ? 'text-primary-400' 
                    : isDisabled
                    ? 'text-gray-600'
                    : 'text-gray-400 group-hover:text-primary-400'
                }`}>
                  {category.description}
                </div>
              </div>


              {/* Selection counter */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 left-3 w-6 h-6 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center font-bold"
                >
                  {selectedPreferences.indexOf(category.id) + 1}
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Selected Preferences Summary */}
      {selectedPreferences.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-glass-medium border border-primary-500/30 rounded-xl p-4">
            <h3 className="text-primary-300 font-medium mb-2">Your Selection:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedPreferences.map((prefId) => {
                const category = categories.find(c => c.id === prefId)
                return (
                  <span
                    key={prefId}
                    className="inline-flex items-center space-x-2 bg-primary-500/20 border border-primary-500/40 rounded-lg px-2 py-1 text-sm"
                  >
                    <span className="text-primary-400 flex-shrink-0 [&>svg]:w-4 [&>svg]:h-4">
                      {category?.icon}
                    </span>
                    <span className="text-primary-200">{category?.name}</span>
                  </span>
                )
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center mb-6">
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
          disabled={selectedPreferences.length === 0}
          className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
            selectedPreferences.length > 0
              ? 'bg-gradient-to-r from-primary-500 to-primary-700 text-white hover:shadow-glow hover:scale-105'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
          whileHover={selectedPreferences.length > 0 ? { scale: 1.05 } : {}}
          whileTap={selectedPreferences.length > 0 ? { scale: 0.95 } : {}}
        >
          Let's chat
        </motion.button>
      </div>
    </div>
  )
}