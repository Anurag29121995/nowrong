'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import GenderSelection from '../components/GenderSelection'
import AgeSelection from '../components/AgeSelection'
import UsernameSelection from '../components/UsernameSelection'
import PreferencesSelection from '../components/PreferencesSelection'
import ChatLobby from '../components/ChatLobby'

type Step = 'gender' | 'age' | 'username' | 'preferences'

interface OnboardingFormData {
  gender?: string
  age?: number
  username?: string
  preferences?: string[]
}

const STEPS: Step[] = ['gender', 'age', 'username', 'preferences']

export default function OnboardingPage() {
  const router = useRouter()
  const { user, userProfile, updateUserProfile, createUserProfile, loading, signInAnonymously } = useAuth()
  const [currentStep, setCurrentStep] = useState<Step>('gender')
  const [formData, setFormData] = useState<OnboardingFormData>({})
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(() => {
    // For Google users with complete profiles, start with true to prevent flash
    if (!loading && user && !user.isAnonymous && userProfile) {
      // Duplicate the profile completeness check logic here
      const hasGender = userProfile.gender
      const hasAge = userProfile.age && userProfile.age !== 18
      const hasUsername = userProfile.username && !userProfile.username.startsWith('user_')
      const hasPreferences = userProfile.preferences?.length > 0
      return hasGender && hasAge && hasUsername && hasPreferences
    }
    return false
  })
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  // Redirect to home page if accessed directly without proper flow
  useEffect(() => {
    // Check if we're in browser environment first
    if (typeof window === 'undefined') return

    // Don't redirect if onboarding is complete (user should see ChatLobby)
    if (isOnboardingComplete) return

    // Only check for redirects when auth is not loading and we have definitive state
    if (!loading) {
      // Case 1: No user at all
      if (!user) {
        router.push('/')
        return
      }

      // Case 2: For anonymous users accessing onboarding directly via refresh/URL
      if (user.isAnonymous) {
        const hasProperNavigation = sessionStorage.getItem('onboardingNavigation')

        // If no navigation flag, it's direct access or refresh - redirect to home
        if (!hasProperNavigation) {
          router.push('/')
          return
        }
      }
    }
  }, [loading, user, userProfile, router, isOnboardingComplete])

  // Clear navigation flag when onboarding is complete
  useEffect(() => {
    if (typeof window !== 'undefined' && isOnboardingComplete) {
      sessionStorage.removeItem('onboardingNavigation')
    }
  }, [isOnboardingComplete])

  // Load and determine current step from profile data
  useEffect(() => {
    if (!userProfile) return

    
    setFormData({
      gender: userProfile.gender,
      age: userProfile.age,
      username: userProfile.username,
      preferences: userProfile.preferences
    })
    
    // Determine current step based on profile completion
    const currentStepIndex = determineCurrentStep(userProfile)
    
    if (currentStepIndex >= STEPS.length) {
      setIsOnboardingComplete(true)
    } else {
      setCurrentStep(STEPS[currentStepIndex])
    }
  }, [userProfile])

  const determineCurrentStep = (profile: any): number => {
    // Check each step completion in order
    if (!profile.gender) {
      return 0 // gender step
    }
    if (!profile.age || profile.age === 18) {
      return 1 // age step (18 is default, so still needs selection)
    }
    if (!profile.username || profile.username.startsWith('user_')) {
      return 2 // username step
    }
    if (!profile.preferences?.length) {
      return 3 // preferences step
    }
    return STEPS.length // complete
  }

  const handleNext = async (data: Partial<OnboardingFormData>) => {
    const newFormData = { ...formData, ...data }
    setFormData(newFormData)

    // Navigate to next step or complete onboarding
    const currentStepIndex = STEPS.indexOf(currentStep)
    const nextStepIndex = currentStepIndex + 1

    if (nextStepIndex < STEPS.length) {
      setCurrentStep(STEPS[nextStepIndex])
    } else {
      // Onboarding complete - now create the Firebase profile

      try {
        // Create the profile in Firebase with all onboarding data
        await createUserProfile({
          gender: newFormData.gender || 'other',
          age: newFormData.age || 18,
          username: newFormData.username || `user_${Date.now()}`,
          preferences: newFormData.preferences || [],
          // Include any other onboarding data
          ...Object.fromEntries(
            Object.entries(newFormData).filter(([key]) =>
              !['gender', 'age', 'username', 'preferences'].includes(key)
            )
          )
        })

        setIsOnboardingComplete(true)

        // Clear navigation flag since onboarding is complete
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('onboardingNavigation')
        }
      } catch (error) {
        // Don't set onboarding as complete if profile creation fails
        return
      }
    }
  }

  const handleBack = () => {
    const currentStepIndex = STEPS.indexOf(currentStep)
    const prevStepIndex = currentStepIndex - 1
    
    if (prevStepIndex >= 0) {
      setCurrentStep(STEPS[prevStepIndex])
    }
  }

  const handleBackFromChat = () => {
    setIsOnboardingComplete(false)
    setCurrentStep('preferences') // Go back to last step
  }

  // Show loading state
  if (loading || isAuthenticating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <img 
            src="/Kupid.png" 
            alt="Kupid" 
            className="w-10 h-10 mx-auto mb-4 animate-pulse"
          />
          <span className="text-2xl font-light text-slate-300">Kupid</span>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-500 mx-auto"></div>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            {isAuthenticating ? 'Setting up your session...' : 'Initializing...'}
          </p>
        </div>
      </div>
    )
  }

  // Show error state
  if (!loading && !user && !isAuthenticating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <img 
            src="/Kupid.png" 
            alt="Kupid" 
            className="w-10 h-10 mx-auto mb-4"
          />
          <span className="text-2xl font-light text-slate-300">Kupid</span>
          <div className="mt-4">
            <p className="text-red-400 mb-4">Authentication failed. Please try again.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show ChatLobby when onboarding is complete
  if (isOnboardingComplete) {
    return <ChatLobby formData={formData} onBack={handleBackFromChat} />
  }

  const currentStepIndex = STEPS.indexOf(currentStep)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Background Image for Gender Step */}
      {currentStep === 'gender' && (
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/Auth Screen Image.png")' }}
        >
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
      )}
      
      {/* Background Effects for Other Steps */}
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
          animate={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-3 mb-6"
            >
              <img 
                src="/Kupid.png" 
                alt="Kupid" 
                className="w-8 h-8 md:w-10 md:h-10"
              />
              <span className="text-2xl md:text-3xl font-normal text-white bg-gradient-to-r from-pink-300 via-pink-500 to-pink-700 bg-[length:200%_200%] bg-clip-text text-transparent tracking-wider animate-gradient-shift">
                Kupid
                <span className="ml-2 text-sm animate-sparkle">✦</span>
              </span>
            </motion.div>
          </div>

          {/* Step Content */}
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

      {/* Step Indicator */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex space-x-2">
          {STEPS.map((_, index) => (
            <motion.div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index <= currentStepIndex ? 'bg-pink-500' : 'bg-gray-600'
              }`}
              animate={{ scale: index === currentStepIndex ? 1.2 : 1 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}