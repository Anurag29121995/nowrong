'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface LanguageSelectionProps {
  onNext: (data: { language: string }) => void
  onBack: () => void
  canGoBack: boolean
  formData: any
}

export default function LanguageSelection({ onNext, onBack, canGoBack, formData }: LanguageSelectionProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(formData.language || '')

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  ]

  const handleSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode)
  }

  const handleNext = () => {
    if (selectedLanguage) {
      onNext({ language: selectedLanguage })
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-light mb-4 bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
          Select Language
        </h1>
        <p className="text-secondary-300 text-sm md:text-base">
          Choose your preferred language for conversations
        </p>
      </div>

      {/* Language Grid */}
      <div className="grid grid-cols-2 gap-3 mb-8 max-h-80 overflow-y-auto">
        {languages.map((language, index) => (
          <motion.button
            key={language.code}
            onClick={() => handleSelect(language.code)}
            className={`p-4 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group ${
              selectedLanguage === language.code
                ? 'border-primary-500 bg-glass-medium shadow-glow'
                : 'border-gray-600 bg-glass-light hover:border-primary-400 hover:bg-glass-medium'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {/* Gradient overlay for selected state */}
            {selectedLanguage === language.code && (
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-primary-700/20 rounded-2xl" />
            )}
            
            <div className="flex items-center space-x-3 relative z-10">
              <span className="text-2xl">{language.flag}</span>
              <div className="text-left">
                <div className={`font-medium transition-colors duration-300 ${
                  selectedLanguage === language.code 
                    ? 'text-primary-300' 
                    : 'text-gray-300 group-hover:text-primary-300'
                }`}>
                  {language.name}
                </div>
              </div>
            </div>

            {/* Selection indicator */}
            {selectedLanguage === language.code && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center"
              >
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Selected Language Display */}
      {selectedLanguage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center space-x-2 bg-glass-medium border border-primary-500/30 rounded-xl px-4 py-2">
            <span className="text-2xl">{languages.find(l => l.code === selectedLanguage)?.flag}</span>
            <span className="text-gray-300">Selected:</span>
            <span className="text-primary-300 font-semibold">
              {languages.find(l => l.code === selectedLanguage)?.name}
            </span>
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
          disabled={!selectedLanguage}
          className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
            selectedLanguage
              ? 'bg-gradient-to-r from-primary-500 to-primary-700 text-white hover:shadow-glow hover:scale-105'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
          whileHover={selectedLanguage ? { scale: 1.05 } : {}}
          whileTap={selectedLanguage ? { scale: 0.95 } : {}}
        >
          Continue
        </motion.button>
      </div>
    </div>
  )
}