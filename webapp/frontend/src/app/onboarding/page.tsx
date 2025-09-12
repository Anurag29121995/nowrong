'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GenderSelection from '../components/GenderSelection'
import AgeSelection from '../components/AgeSelection'
import UsernameSelection from '../components/UsernameSelection'
import PreferencesSelection from '../components/PreferencesSelection'
import ChatLobby from '../components/ChatLobby'

type Step = 'gender' | 'age' | 'username' | 'preferences'

interface OnboardingFormData {
  gender?: string
  age?: number
  interest?: string
  username?: string
  preferences?: string[]
  avatar?: string
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<Step>('gender')
  const [formData, setFormData] = useState<OnboardingFormData>({})
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false)

  const steps: Step[] = ['gender', 'age', 'username', 'preferences']
  const currentStepIndex = steps.indexOf(currentStep)

  const handleNext = (data: Partial<OnboardingFormData>) => {
    const newFormData = { ...formData, ...data }
    setFormData(newFormData)

    const nextStepIndex = currentStepIndex + 1
    if (nextStepIndex < steps.length) {
      setCurrentStep(steps[nextStepIndex])
    } else {
      // Complete onboarding - show chat lobby
      setIsOnboardingComplete(true)
    }
  }

  const handleBack = () => {
    const prevStepIndex = currentStepIndex - 1
    if (prevStepIndex >= 0) {
      setCurrentStep(steps[prevStepIndex])
    }
  }

  const handleBackFromChat = () => {
    setIsOnboardingComplete(false)
    setCurrentStep('preferences') // Go back to the last step
  }

  const canGoBack = currentStepIndex > 0

  const stepComponents = {
    gender: (
      <GenderSelection
        onNext={handleNext}
        onBack={handleBack}
        canGoBack={canGoBack}
        formData={formData}
      />
    ),
    age: (
      <AgeSelection
        onNext={handleNext}
        onBack={handleBack}
        canGoBack={canGoBack}
        formData={formData}
      />
    ),
    username: (
      <UsernameSelection
        onNext={handleNext}
        onBack={handleBack}
        canGoBack={canGoBack}
        formData={formData}
      />
    ),
    preferences: (
      <PreferencesSelection
        onNext={handleNext}
        onBack={handleBack}
        canGoBack={canGoBack}
        formData={formData}
      />
    )
  }

  // Show ChatLobby when onboarding is complete
  if (isOnboardingComplete) {
    return <ChatLobby formData={formData} onBack={handleBackFromChat} />
  }

  // Show onboarding steps
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Auth Screen Background Image - Only for gender selection */}
      {currentStep === 'gender' && (
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/Auth Screen Image.png")' }}
        >
          {/* Translucent overlay to reduce transparency */}
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
      )}
      
      {/* Background Effects for other steps */}
      {currentStep !== 'gender' && (
        <>
          <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-900/20 via-transparent to-transparent"></div>
          <div className="fixed inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(190,24,93,0.05)_50%,transparent_75%)]"></div>
        </>
      )}
      
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-black/50 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-pink-500 to-rose-600"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => window.location.href = 'http://localhost:8080/'}
              className="inline-flex items-center space-x-3 mb-6 hover:opacity-80 transition-opacity cursor-pointer bg-transparent border-none"
            >
              <img 
                src="/nowrong-icon.png" 
                alt="NoWrong" 
                className="w-8 h-8 md:w-10 md:h-10"
              />
              <span className="text-2xl md:text-3xl font-normal text-white bg-gradient-to-r from-pink-300 via-pink-500 to-pink-700 bg-[length:200%_200%] bg-clip-text text-transparent tracking-wider animate-gradient-shift">
                NoWrong
                <span className="ml-2 text-sm animate-sparkle">✦</span>
              </span>
            </motion.button>
          </div>

          {/* Step Content with Smooth Transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {stepComponents[currentStep]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Step Indicator Dots */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex space-x-2">
          {steps.map((step, index) => (
            <motion.div
              key={step}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index <= currentStepIndex
                  ? 'bg-pink-500'
                  : 'bg-gray-600'
              }`}
              animate={{
                scale: index === currentStepIndex ? 1.2 : 1
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}