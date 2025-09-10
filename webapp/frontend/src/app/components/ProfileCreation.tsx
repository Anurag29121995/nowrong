'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ProfileCreationProps {
  onComplete: (profileData: any) => void
  onBack: () => void
  existingData?: {
    username?: string
    age?: number
    gender?: string
    interest?: string
    preferences?: string[]
  }
}

export default function ProfileCreation({ onComplete, onBack, existingData = {} }: ProfileCreationProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [profileData, setProfileData] = useState({
    username: existingData.username || '',
    age: existingData.age || null,
    gender: existingData.gender || '',
    interest: existingData.interest || '',
    preferences: existingData.preferences || [],
    bodyCount: null as number | null,
    secret: '',
    showSecret: false,
    bodyTypePreference: '' as string, // Single selection for body type
    location: '',
    moments: [] as File[]
  })

  const steps = [
    'Basic Info',
    'Body Count',
    'Secret',
    'Body Type',
    'Location',
    'Moments'
  ]

  // Preference-based body type options
  const getBodyTypesForPreference = (interest: string) => {
    if (interest === 'women') {
      // Male preference options - what males are attracted to in females
      return [
        {
          id: 'petite',
          name: 'Petite & Slim',
          description: 'Small, skinny, tight body',
          icon: (
            <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
              <defs><linearGradient id="petiteGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ec4899"/><stop offset="100%" stopColor="#be185d"/></linearGradient></defs>
              <ellipse cx="50" cy="18" rx="6" ry="8" fill="url(#petiteGrad)"/>
              <ellipse cx="50" cy="35" rx="8" ry="12" fill="url(#petiteGrad)"/>
              <ellipse cx="45" cy="32" rx="3" ry="4" fill="url(#petiteGrad)"/>
              <ellipse cx="55" cy="32" rx="3" ry="4" fill="url(#petiteGrad)"/>
              <ellipse cx="50" cy="50" rx="6" ry="8" fill="url(#petiteGrad)"/>
              <ellipse cx="50" cy="68" rx="9" ry="15" fill="url(#petiteGrad)"/>
              <ellipse cx="42" cy="85" rx="4" ry="12" fill="url(#petiteGrad)"/>
              <ellipse cx="58" cy="85" rx="4" ry="12" fill="url(#petiteGrad)"/>
            </svg>
          )
        },
        {
          id: 'curvy',
          name: 'Thick & Curvy',
          description: 'Voluptuous, hourglass, sexy curves',
          icon: (
            <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
              <defs><linearGradient id="curvyGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f43f5e"/><stop offset="100%" stopColor="#be185d"/></linearGradient></defs>
              <ellipse cx="50" cy="18" rx="7" ry="9" fill="url(#curvyGrad)"/>
              <ellipse cx="50" cy="38" rx="14" ry="16" fill="url(#curvyGrad)"/>
              <ellipse cx="42" cy="35" rx="6" ry="7" fill="url(#curvyGrad)"/>
              <ellipse cx="58" cy="35" rx="6" ry="7" fill="url(#curvyGrad)"/>
              <ellipse cx="50" cy="55" rx="8" ry="10" fill="url(#curvyGrad)"/>
              <ellipse cx="50" cy="75" rx="16" ry="18" fill="url(#curvyGrad)"/>
              <ellipse cx="40" cy="88" rx="6" ry="10" fill="url(#curvyGrad)"/>
              <ellipse cx="60" cy="88" rx="6" ry="10" fill="url(#curvyGrad)"/>
            </svg>
          )
        },
        {
          id: 'bbw',
          name: 'BBW Goddess',
          description: 'Big, beautiful, soft curves',
          icon: (
            <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
              <defs><linearGradient id="bbwGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f97316"/><stop offset="100%" stopColor="#be185d"/></linearGradient></defs>
              <ellipse cx="50" cy="18" rx="8" ry="10" fill="url(#bbwGrad)"/>
              <ellipse cx="50" cy="42" rx="18" ry="20" fill="url(#bbwGrad)"/>
              <ellipse cx="38" cy="38" rx="8" ry="9" fill="url(#bbwGrad)"/>
              <ellipse cx="62" cy="38" rx="8" ry="9" fill="url(#bbwGrad)"/>
              <ellipse cx="50" cy="65" rx="12" ry="14" fill="url(#bbwGrad)"/>
              <ellipse cx="50" cy="85" rx="20" ry="15" fill="url(#bbwGrad)"/>
              <ellipse cx="38" cy="90" rx="8" ry="8" fill="url(#bbwGrad)"/>
              <ellipse cx="62" cy="90" rx="8" ry="8" fill="url(#bbwGrad)"/>
            </svg>
          )
        },
        {
          id: 'athletic',
          name: 'Fit & Toned',
          description: 'Athletic, strong, defined muscles',
          icon: (
            <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
              <defs><linearGradient id="athleticGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#10b981"/><stop offset="100%" stopColor="#be185d"/></linearGradient></defs>
              <ellipse cx="50" cy="18" rx="6" ry="8" fill="url(#athleticGrad)"/>
              <ellipse cx="50" cy="36" rx="11" ry="14" fill="url(#athleticGrad)"/>
              <ellipse cx="44" cy="33" rx="4" ry="5" fill="url(#athleticGrad)"/>
              <ellipse cx="56" cy="33" rx="4" ry="5" fill="url(#athleticGrad)"/>
              <ellipse cx="50" cy="52" rx="7" ry="9" fill="url(#athleticGrad)"/>
              <ellipse cx="50" cy="72" rx="12" ry="16" fill="url(#athleticGrad)"/>
              <ellipse cx="43" cy="86" rx="5" ry="11" fill="url(#athleticGrad)"/>
              <ellipse cx="57" cy="86" rx="5" ry="11" fill="url(#athleticGrad)"/>
            </svg>
          )
        },
        {
          id: 'milf',
          name: 'MILF Appeal',
          description: 'Mature, experienced, seductive',
          icon: (
            <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
              <defs><linearGradient id="milfGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#8b5cf6"/><stop offset="100%" stopColor="#be185d"/></linearGradient></defs>
              <ellipse cx="50" cy="18" rx="7" ry="9" fill="url(#milfGrad)"/>
              <ellipse cx="50" cy="40" rx="13" ry="15" fill="url(#milfGrad)"/>
              <ellipse cx="43" cy="37" rx="5" ry="6" fill="url(#milfGrad)"/>
              <ellipse cx="57" cy="37" rx="5" ry="6" fill="url(#milfGrad)"/>
              <ellipse cx="50" cy="58" rx="9" ry="11" fill="url(#milfGrad)"/>
              <ellipse cx="50" cy="78" rx="14" ry="17" fill="url(#milfGrad)"/>
              <ellipse cx="42" cy="88" rx="6" ry="9" fill="url(#milfGrad)"/>
              <ellipse cx="58" cy="88" rx="6" ry="9" fill="url(#milfGrad)"/>
            </svg>
          )
        },
        {
          id: 'busty',
          name: 'Big Boobs',
          description: 'Large breasts, sexy figure',
          icon: (
            <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
              <defs><linearGradient id="bustyGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ef4444"/><stop offset="100%" stopColor="#be185d"/></linearGradient></defs>
              <ellipse cx="50" cy="18" rx="7" ry="9" fill="url(#bustyGrad)"/>
              <ellipse cx="50" cy="42" rx="12" ry="14" fill="url(#bustyGrad)"/>
              <ellipse cx="40" cy="38" rx="7" ry="8" fill="url(#bustyGrad)"/>
              <ellipse cx="60" cy="38" rx="7" ry="8" fill="url(#bustyGrad)"/>
              <ellipse cx="50" cy="58" rx="8" ry="10" fill="url(#bustyGrad)"/>
              <ellipse cx="50" cy="78" rx="13" ry="16" fill="url(#bustyGrad)"/>
              <ellipse cx="43" cy="88" rx="5" ry="10" fill="url(#bustyGrad)"/>
              <ellipse cx="57" cy="88" rx="5" ry="10" fill="url(#bustyGrad)"/>
            </svg>
          )
        }
      ]
    } else if (interest === 'men') {
      // Male body type options - for those attracted to men
      return [
        {
          id: 'muscular',
          name: 'Muscular & Ripped',
          description: 'Strong, defined, athletic build',
          icon: (
            <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
              <defs><linearGradient id="muscularGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#10b981"/><stop offset="100%" stopColor="#be185d"/></linearGradient></defs>
              <ellipse cx="50" cy="18" rx="7" ry="9" fill="url(#muscularGrad)"/>
              <rect x="40" y="28" width="20" height="18" rx="3" fill="url(#muscularGrad)"/>
              <ellipse cx="42" y="32" rx="6" ry="4" fill="url(#muscularGrad)"/>
              <ellipse cx="58" y="32" rx="6" ry="4" fill="url(#muscularGrad)"/>
              <rect x="44" y="50" width="12" height="16" rx="2" fill="url(#muscularGrad)"/>
              <rect x="40" y="70" width="20" height="20" rx="3" fill="url(#muscularGrad)"/>
              <rect x="42" y="85" width="6" height="12" rx="2" fill="url(#muscularGrad)"/>
              <rect x="52" y="85" width="6" height="12" rx="2" fill="url(#muscularGrad)"/>
            </svg>
          )
        },
        {
          id: 'tall_lean',
          name: 'Tall & Lean',
          description: 'Height, slim, elegant build',
          icon: (
            <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
              <defs><linearGradient id="tallGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3b82f6"/><stop offset="100%" stopColor="#be185d"/></linearGradient></defs>
              <ellipse cx="50" cy="15" rx="6" ry="8" fill="url(#tallGrad)"/>
              <rect x="44" y="25" width="12" height="20" rx="2" fill="url(#tallGrad)"/>
              <rect x="46" y="48" width="8" height="18" rx="1" fill="url(#tallGrad)"/>
              <rect x="44" y="70" width="12" height="22" rx="2" fill="url(#tallGrad)"/>
              <rect x="46" y="88" width="3" height="10" rx="1" fill="url(#tallGrad)"/>
              <rect x="51" y="88" width="3" height="10" rx="1" fill="url(#tallGrad)"/>
            </svg>
          )
        },
        {
          id: 'dad_bod',
          name: 'Dad Bod',
          description: 'Soft, comfortable, mature',
          icon: (
            <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
              <defs><linearGradient id="dadGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f97316"/><stop offset="100%" stopColor="#be185d"/></linearGradient></defs>
              <ellipse cx="50" cy="18" rx="7" ry="9" fill="url(#dadGrad)"/>
              <ellipse cx="50" cy="40" rx="14" ry="16" fill="url(#dadGrad)"/>
              <ellipse cx="50" cy="62" rx="12" ry="14" fill="url(#dadGrad)"/>
              <ellipse cx="50" cy="82" rx="15" ry="16" fill="url(#dadGrad)"/>
              <ellipse cx="42" cy="90" rx="5" ry="8" fill="url(#dadGrad)"/>
              <ellipse cx="58" cy="90" rx="5" ry="8" fill="url(#dadGrad)"/>
            </svg>
          )
        },
        {
          id: 'bearded',
          name: 'Bearded & Rugged',
          description: 'Masculine, facial hair, strong',
          icon: (
            <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
              <defs><linearGradient id="beardGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#7c2d12"/><stop offset="100%" stopColor="#be185d"/></linearGradient></defs>
              <ellipse cx="50" cy="18" rx="8" ry="10" fill="url(#beardGrad)"/>
              <ellipse cx="50" cy="24" rx="10" ry="6" fill="#4a1a0a"/>
              <rect x="42" y="32" width="16" height="16" rx="3" fill="url(#beardGrad)"/>
              <rect x="46" y="52" width="8" height="16" rx="2" fill="url(#beardGrad)"/>
              <rect x="42" y="72" width="16" height="20" rx="3" fill="url(#beardGrad)"/>
              <rect x="44" y="88" width="5" height="10" rx="2" fill="url(#beardGrad)"/>
              <rect x="51" y="88" width="5" height="10" rx="2" fill="url(#beardGrad)"/>
            </svg>
          )
        },
        {
          id: 'young_fit',
          name: 'Young & Fit',
          description: 'Youthful, energetic, toned',
          icon: (
            <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
              <defs><linearGradient id="youngGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#06d6a0"/><stop offset="100%" stopColor="#be185d"/></linearGradient></defs>
              <ellipse cx="50" cy="16" rx="6" ry="8" fill="url(#youngGrad)"/>
              <rect x="43" y="28" width="14" height="16" rx="2" fill="url(#youngGrad)"/>
              <rect x="46" y="48" width="8" height="16" rx="2" fill="url(#youngGrad)"/>
              <rect x="43" y="68" width="14" height="20" rx="2" fill="url(#youngGrad)"/>
              <rect x="45" y="85" width="4" height="12" rx="1" fill="url(#youngGrad)"/>
              <rect x="51" y="85" width="4" height="12" rx="1" fill="url(#youngGrad)"/>
            </svg>
          )
        },
        {
          id: 'big_package',
          name: 'Well Endowed',
          description: 'Big size, impressive package',
          icon: (
            <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
              <defs><linearGradient id="packageGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#dc2626"/><stop offset="100%" stopColor="#be185d"/></linearGradient></defs>
              <ellipse cx="50" cy="18" rx="7" ry="9" fill="url(#packageGrad)"/>
              <rect x="42" y="30" width="16" height="18" rx="3" fill="url(#packageGrad)"/>
              <rect x="46" y="52" width="8" height="14" rx="2" fill="url(#packageGrad)"/>
              <ellipse cx="50" cy="68" rx="8" ry="6" fill="url(#packageGrad)"/>
              <rect x="42" y="78" width="16" height="18" rx="3" fill="url(#packageGrad)"/>
              <rect x="44" y="90" width="5" height="8" rx="2" fill="url(#packageGrad)"/>
              <rect x="51" y="90" width="5" height="8" rx="2" fill="url(#packageGrad)"/>
            </svg>
          )
        }
      ]
    } else {
      // Both/other - show all options categorized
      const femaleTypes = getBodyTypesForPreference('women')
      const maleTypes = getBodyTypesForPreference('men')
      return [...femaleTypes, ...maleTypes]
    }
  }

  const bodyTypes = getBodyTypesForPreference(profileData.interest)

  const countries = [
    'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
    'Germany', 'France', 'Japan', 'Brazil', 'Mexico', 'Other'
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete(profileData)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      onBack()
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0: return profileData.username && profileData.age && profileData.gender && profileData.interest
      case 1: return profileData.bodyCount !== null
      case 2: return true // Secret is optional
      case 3: return profileData.bodyTypePreference.length > 0
      case 4: return true // Location is optional
      case 5: return true // Moments are optional
      default: return false
    }
  }

  // Auto-proceed functionality
  const handleBodyCountSelect = (count: number) => {
    setProfileData({...profileData, bodyCount: count})
    // Auto-proceed after selecting body count
    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      }
    }, 300)
  }

  const handleBodyTypeToggle = (typeId: string) => {
    const current = profileData.bodyTypePreference
    
    if (current === typeId) {
      // Deselect if already selected
      setProfileData({...profileData, bodyTypePreference: ''})
    } else {
      // Select the new type
      setProfileData({...profileData, bodyTypePreference: typeId})
      
      // Auto-proceed after selection
      setTimeout(() => {
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1)
        }
      }, 500)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-light mb-3 bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
                Basic Information
              </h2>
              <p className="text-gray-400">Let's review and complete your details</p>
            </div>

            {/* Username */}
            <div>
              <label className="block text-white font-medium mb-2">Username</label>
              <input
                type="text"
                value={profileData.username}
                onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                className="w-full p-3 bg-glass-medium border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none"
                placeholder="Enter your username"
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-white font-medium mb-2">Age</label>
              <input
                type="number"
                min="18"
                max="65"
                value={profileData.age || ''}
                onChange={(e) => setProfileData({...profileData, age: parseInt(e.target.value)})}
                className="w-full p-3 bg-glass-medium border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none"
                placeholder="Your age"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-white font-medium mb-2">Gender</label>
              <div className="grid grid-cols-2 gap-3">
                {['male', 'female'].map((gender) => (
                  <button
                    key={gender}
                    onClick={() => setProfileData({...profileData, gender})}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      profileData.gender === gender
                        ? 'border-pink-500 bg-pink-500/10'
                        : 'border-gray-600 bg-glass-medium hover:border-pink-400'
                    }`}
                  >
                    <span className="text-white capitalize">{gender}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Interest */}
            <div>
              <label className="block text-white font-medium mb-2">Interested In</label>
              <div className="grid grid-cols-3 gap-3">
                {['women', 'men', 'both'].map((interest) => (
                  <button
                    key={interest}
                    onClick={() => setProfileData({...profileData, interest})}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      profileData.interest === interest
                        ? 'border-pink-500 bg-pink-500/10'
                        : 'border-gray-600 bg-glass-medium hover:border-pink-400'
                    }`}
                  >
                    <span className="text-white capitalize">{interest}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-light mb-3 bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
                Body Count
              </h2>
              <p className="text-gray-400">How many people have you been with?</p>
            </div>

            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
              {Array.from({length: 20}, (_, i) => i).map((count) => (
                <motion.button
                  key={count}
                  onClick={() => handleBodyCountSelect(count)}
                  className={`aspect-square rounded-xl border-2 transition-all ${
                    profileData.bodyCount === count
                      ? 'border-pink-500 bg-pink-500/20'
                      : 'border-gray-600 bg-glass-medium hover:border-pink-400'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-white font-semibold">{count}</span>
                </motion.button>
              ))}
            </div>

            <button
              onClick={() => handleBodyCountSelect(20)}
              className={`w-full p-3 rounded-xl border-2 transition-all ${
                profileData.bodyCount === 20
                  ? 'border-pink-500 bg-pink-500/20'
                  : 'border-gray-600 bg-glass-medium hover:border-pink-400'
              }`}
            >
              <span className="text-white">20+</span>
            </button>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-light mb-3 bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
                Your Secret
              </h2>
              <p className="text-gray-400">Something you can't tell anyone (optional)</p>
            </div>

            <div>
              <textarea
                value={profileData.secret}
                onChange={(e) => setProfileData({...profileData, secret: e.target.value.slice(0, 100)})}
                className="w-full p-3 bg-glass-medium border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none resize-none h-32"
                placeholder="Your deepest secret (max 100 characters)"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">{profileData.secret.length}/100</span>
              </div>
            </div>

            {profileData.secret && (
              <div className="bg-glass-medium border border-gray-600 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Privacy Setting</span>
                  <button
                    onClick={() => setProfileData({...profileData, showSecret: !profileData.showSecret})}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                      profileData.showSecret ? 'bg-pink-500' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                        profileData.showSecret ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-gray-400">
                  🔒 This is not shared with anyone without your permission
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Toggle to {profileData.showSecret ? 'hide' : 'show'} in your profile
                </p>
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="px-6 space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-light bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
                What turns you on?
              </h2>
              <p className="text-gray-400 mt-2">
                {profileData.interest === 'women' && 'Choose the female body type that attracts you most'}
                {profileData.interest === 'men' && 'Choose the male body type that attracts you most'}
                {profileData.interest === 'both' && 'Choose what attracts you most from both categories'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {bodyTypes.map((type) => {
                const isSelected = profileData.bodyTypePreference === type.id
                
                return (
                  <motion.button
                    key={type.id}
                    onClick={() => handleBodyTypeToggle(type.id)}
                    className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-pink-500 bg-pink-500/10 shadow-lg shadow-pink-500/25'
                        : 'border-gray-600 bg-glass-medium hover:border-pink-400'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-4">
                      {/* Emoji Icon */}
                      <div className="text-4xl">
                        {type.icon}
                      </div>
                      
                      {/* Text Content */}
                      <div className="flex-1">
                        <div className="text-white font-bold text-lg mb-1">{type.name}</div>
                        <div className="text-gray-300 text-sm">{type.description}</div>
                      </div>
                    </div>
                    
                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-4 right-4 flex items-center space-x-2">
                        <div className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          ✓
                        </div>
                      </div>
                    )}
                  </motion.button>
                )
              })}
            </div>

            {profileData.bodyTypePreference && (
              <div className="text-center mt-8">
                <p className="text-gray-400 text-sm">
                  Selected • Auto-proceeding...
                </p>
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-light mb-3 bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
                Location
              </h2>
              <p className="text-gray-400">Help others find you nearby (optional)</p>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Country</label>
              <select
                value={profileData.location}
                onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                className="w-full p-3 bg-glass-medium border border-gray-600 rounded-xl text-white focus:border-pink-500 focus:outline-none"
              >
                <option value="">Select country (optional)</option>
                {countries.map((country) => (
                  <option key={country} value={country} className="bg-gray-800">
                    {country}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-2">
                📍 This helps find people closer to you
              </p>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-light mb-3 bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
                Moments
              </h2>
              <p className="text-gray-400">Share up to 3 photos (optional)</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="aspect-square rounded-xl border-2 border-dashed border-gray-600 bg-glass-medium hover:border-pink-400 transition-all cursor-pointer relative overflow-hidden"
                  onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = 'image/*'
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0]
                      if (file) {
                        const newMoments = [...profileData.moments]
                        newMoments[index] = file
                        setProfileData({...profileData, moments: newMoments})
                      }
                    }
                    input.click()
                  }}
                >
                  {profileData.moments[index] ? (
                    <img
                      src={URL.createObjectURL(profileData.moments[index])}
                      alt={`Moment ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span className="text-xs">Add Photo</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-900/20 via-transparent to-transparent"></div>
      <div className="fixed inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(190,24,93,0.05)_50%,transparent_75%)]"></div>
      
      <div className="relative z-10 min-h-screen p-6 pt-8">
        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-pink-400 font-medium">
              {steps[currentStep]}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-pink-500 to-rose-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation - Hide continue button on body count page (step 1) */}
        {currentStep !== 1 && (
          <div className="max-w-2xl mx-auto mt-12">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                className="px-6 py-3 text-gray-400 hover:text-white transition-colors font-medium"
              >
                {currentStep === 0 ? 'Cancel' : 'Back'}
              </button>

              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                  canProceed()
                    ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:shadow-lg hover:scale-105'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {currentStep === steps.length - 1 ? 'Complete Profile' : 'Continue'}
              </button>
            </div>
          </div>
        )}
        
        {/* Show only back button on body count page */}
        {currentStep === 1 && (
          <div className="max-w-2xl mx-auto mt-12">
            <div className="flex items-center justify-center">
              <button
                onClick={handleBack}
                className="px-6 py-3 text-gray-400 hover:text-white transition-colors font-medium"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}