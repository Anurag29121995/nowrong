'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GenderSelection from './components/GenderSelection'
import AgeSelection from './components/AgeSelection'

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    gender: '',
    age: null as number | null,
    username: '',
    language: '',
    preferences: [] as string[]
  })

  const steps = [
    { id: 1, title: 'Gender' },
    { id: 2, title: 'Age' },
  ]

  const nextStep = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }))
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <GenderSelection
            onNext={nextStep}
            onBack={prevStep}
            canGoBack={currentStep > 1}
            formData={formData}
          />
        )
      case 2:
        return (
          <AgeSelection
            onNext={nextStep}
            onBack={prevStep}
            canGoBack={currentStep > 1}
            formData={formData}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-6 relative z-10">
      {/* Progress Indicator */}
      <div className="w-full max-w-md mb-8">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                step.id <= currentStep
                  ? 'bg-gradient-to-r from-primary-500 to-primary-700 shadow-glow'
                  : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
        <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-700 transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}