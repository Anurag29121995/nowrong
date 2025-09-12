'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface AvatarSelectionProps {
  onNext: (data: { avatar: string }) => void
  onBack: () => void
  canGoBack: boolean
  formData: {
    gender?: string
    age?: number
    interest?: string
    username?: string
    preferences?: string[]
    avatar?: string
  }
}

export default function AvatarSelection({ onNext, onBack, canGoBack, formData }: AvatarSelectionProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string>(formData.avatar || '')

  const maleAvatars = ['M1', 'M2', 'M3', 'M4', 'M5']
  const femaleAvatars = ['W1', 'W2', 'W3', 'W4', 'W5']
  
  const availableAvatars = formData.gender === 'male' ? maleAvatars : femaleAvatars

  const handleNext = () => {
    if (selectedAvatar) {
      onNext({ avatar: selectedAvatar })
    }
  }

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar)
  }

  const renderAvatar = (avatarId: string) => {
    const isSelected = selectedAvatar === avatarId
    
    return (
      <motion.button
        key={avatarId}
        onClick={() => handleAvatarSelect(avatarId)}
        className={`w-20 h-20 rounded-full border-2 transition-all duration-200 flex items-center justify-center font-bold text-lg ${
          isSelected 
            ? 'border-pink-400 bg-pink-500/20 text-pink-300 scale-110' 
            : 'border-gray-600 bg-glass-light text-gray-400 hover:border-gray-500 hover:bg-glass-medium'
        }`}
        whileHover={{ scale: isSelected ? 1.1 : 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: isSelected ? 1.1 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {avatarId}
      </motion.button>
    )
  }

  return (
    <div className="bg-glass-medium backdrop-blur-lg border border-pink-500/30 rounded-2xl p-6 md:p-8 w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-light mb-4 bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">
            Choose Your Avatar
          </h2>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            Select an avatar to represent you in chats and your profile
          </p>
        </motion.div>
      </div>

      {/* Avatar Grid */}
      <div className="mb-8">
        <div className="grid grid-cols-5 gap-4 justify-items-center">
          {availableAvatars.map((avatar, index) => (
            <motion.div
              key={avatar}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              {renderAvatar(avatar)}
            </motion.div>
          ))}
        </div>
        
        {selectedAvatar && (
          <motion.div 
            className="text-center mt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-pink-400 text-sm font-medium">
              Selected: {selectedAvatar}
            </p>
          </motion.div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        {canGoBack && (
          <motion.button
            onClick={onBack}
            className="flex-1 py-3 px-6 bg-glass-light border border-gray-600 rounded-xl text-gray-300 hover:text-white hover:border-gray-500 hover:bg-glass-medium transition-all duration-300 font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Back
          </motion.button>
        )}
        
        <motion.button
          onClick={handleNext}
          disabled={!selectedAvatar}
          className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
            selectedAvatar
              ? 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-lg hover:shadow-pink-500/25'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
          whileHover={selectedAvatar ? { scale: 1.02 } : {}}
          whileTap={selectedAvatar ? { scale: 0.98 } : {}}
        >
          Continue
        </motion.button>
      </div>

      {/* Helper Text */}
      <motion.div 
        className="text-center mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <p className="text-gray-500 text-xs">
          {formData.gender === 'male' ? 'Male' : 'Female'} avatars • You can change this later in your profile
        </p>
      </motion.div>
    </div>
  )
}