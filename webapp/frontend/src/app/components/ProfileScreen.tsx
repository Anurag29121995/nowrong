'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Avatar from './Avatar'

interface ProfileScreenProps {
  onBack: () => void
  formData: {
    username?: string
    age?: number
    gender?: string
    interest?: string
    preferences?: string[]
    bodyCount?: number | null
    secret?: string
    showSecret?: boolean
    avatar?: string
    bodyTypePreference?: string
    location?: string
    moments?: File[]
  }
  onSave: (updatedData: any) => void
}

export default function ProfileScreen({ onBack, formData, onSave }: ProfileScreenProps) {
  const [editMode, setEditMode] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState(formData.avatar || (formData.gender === 'male' ? 'M1' : 'W1'))
  const [editData, setEditData] = useState({
    username: formData.username || '',
    age: formData.age?.toString() || '',
    gender: formData.gender || '',
    interest: formData.interest || '',
    preferences: formData.preferences || [],
    bodyCount: formData.bodyCount?.toString() || '',
    secret: formData.secret || '',
    showSecret: formData.showSecret || false,
    avatar: selectedAvatar,
    bodyTypePreference: formData.bodyTypePreference || '',
    location: formData.location || '',
    moments: formData.moments || []
  })

  const handleSave = () => {
    const updatedFormData = {
      ...formData,
      username: editData.username || undefined,
      age: editData.age ? parseInt(editData.age) : undefined,
      gender: editData.gender || undefined,
      interest: editData.interest || undefined,
      preferences: editData.preferences,
      bodyCount: editData.bodyCount ? parseInt(editData.bodyCount) : null,
      secret: editData.secret || '',
      showSecret: editData.showSecret,
      avatar: selectedAvatar,
      bodyTypePreference: editData.bodyTypePreference || '',
      location: editData.location || '',
      moments: editData.moments || []
    }
    onSave(updatedFormData)
    setEditMode(false)
    // Note: We stay on profile screen, don't redirect to chat lobby
  }

  const handleCancel = () => {
    setEditData({
      username: formData.username || '',
      age: formData.age?.toString() || '',
      gender: formData.gender || '',
      interest: formData.interest || '',
      preferences: formData.preferences || [],
      bodyCount: formData.bodyCount?.toString() || '',
      secret: formData.secret || '',
      showSecret: formData.showSecret || false,
      avatar: formData.avatar || selectedAvatar,
      bodyTypePreference: formData.bodyTypePreference || '',
      location: formData.location || '',
      moments: formData.moments || []
    })
    setSelectedAvatar(formData.avatar || (formData.gender === 'male' ? 'M1' : 'W1'))
    setEditMode(false)
  }

  const handlePreferenceToggle = (preference: string) => {
    setEditData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(preference)
        ? prev.preferences.filter(p => p !== preference)
        : [...prev.preferences, preference]
    }))
  }

  // Using the same detailed icons from PreferencesSelection.tsx
  const categories = [
    { 
      id: 'rough', 
      name: 'Rough Sex', 
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
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
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
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
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
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
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
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
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
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
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
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
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
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
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
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
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM20 22v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 7h-2.08A1.5 1.5 0 0 0 15.04 8.37L12.5 16H15v6h5zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm1.5 16v-6H9.5l-2.54-7.63A1.5 1.5 0 0 0 5.54 7H3.46A1.5 1.5 0 0 0 2.04 8.37L-.5 16H2v6h5z"/>
        </svg>
      ), 
      description: 'Forbidden family fun' 
    },
    { 
      id: 'creampie', 
      name: 'Creampie', 
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
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
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
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
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
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
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
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
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
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
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
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
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
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
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
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
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
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
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
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
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      ), 
      description: 'Love to watch' 
    }
  ]

  const countries = [
    'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
    'Germany', 'France', 'Japan', 'Brazil', 'Mexico', 'Other'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-900/20 via-transparent to-transparent"></div>
      
      <div className="relative z-10 min-h-screen p-4">
        {/* Compact Header */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={onBack}
              className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {editMode ? (
              <div className="flex space-x-2">
                <button
                  onClick={handleCancel}
                  className="px-3 py-1.5 text-sm rounded-full bg-gray-500/20 text-gray-300 hover:bg-gray-500/30 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-1.5 text-sm rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 transition-all"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-1.5 text-sm rounded-full bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/30 text-pink-300 hover:bg-gradient-to-r hover:from-pink-500/30 hover:to-rose-500/30 transition-all"
              >
                Edit
              </button>
            )}
          </div>

          {/* Compact Profile Header */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <Avatar
                avatar={selectedAvatar}
                gender={formData.gender}
                username={formData.username}
                size="lg"
                className="border-2 border-pink-500/30"
              />
              {editMode && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-pink-600 transition-colors">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-light text-white">
                {formData.username || 'Your Profile'}
              </h1>
              <p className="text-gray-400 text-sm">
                {formData.age && formData.gender ? `${formData.age} • ${formData.gender}` : 'Complete your profile'}
              </p>
            </div>
          </div>

          {/* Avatar Selection in Edit Mode */}
          {editMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
            >
              <h3 className="text-sm text-white mb-3">Choose Avatar</h3>
              <div className="flex space-x-2">
                {(formData.gender === 'male' ? ['M1', 'M2', 'M3', 'M4', 'M5'] : ['W1', 'W2', 'W3', 'W4', 'W5']).map(avatarId => (
                  <motion.button
                    key={avatarId}
                    onClick={() => setSelectedAvatar(avatarId)}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all ${
                      selectedAvatar === avatarId 
                        ? 'border-pink-400 bg-pink-500/20 text-pink-300 scale-110' 
                        : 'border-gray-600 bg-gray-800/30 text-gray-400 hover:border-pink-500/50 hover:scale-105'
                    }`}
                    whileHover={{ scale: selectedAvatar === avatarId ? 1.1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {avatarId}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Main Content Grid - Optimized for no scrolling */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Basic Info */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
              <h2 className="text-lg text-white mb-4 flex items-center">
                <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                Basic Info
              </h2>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Username</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={editData.username}
                        onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                        className="w-full px-3 py-2 text-sm bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-pink-400 focus:outline-none transition-colors"
                        placeholder="Username"
                      />
                    ) : (
                      <div className="px-3 py-2 bg-black/20 rounded-lg text-white border border-gray-700 text-sm">
                        {formData.username || 'Not set'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Age</label>
                    {editMode ? (
                      <input
                        type="number"
                        value={editData.age}
                        onChange={(e) => setEditData(prev => ({ ...prev, age: e.target.value }))}
                        className="w-full px-3 py-2 text-sm bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-pink-400 focus:outline-none transition-colors"
                        placeholder="Age"
                        min="18"
                      />
                    ) : (
                      <div className="px-3 py-2 bg-black/20 rounded-lg text-white border border-gray-700 text-sm">
                        {formData.age || 'Not set'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Gender</label>
                    {editMode ? (
                      <select
                        value={editData.gender}
                        onChange={(e) => setEditData(prev => ({ ...prev, gender: e.target.value }))}
                        className="w-full px-3 py-2 text-sm bg-black/20 border border-gray-600 rounded-lg text-white focus:border-pink-400 focus:outline-none transition-colors"
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    ) : (
                      <div className="px-3 py-2 bg-black/20 rounded-lg text-white border border-gray-700 capitalize text-sm">
                        {formData.gender || 'Not set'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Looking for</label>
                    {editMode ? (
                      <select
                        value={editData.interest}
                        onChange={(e) => setEditData(prev => ({ ...prev, interest: e.target.value }))}
                        className="w-full px-3 py-2 text-sm bg-black/20 border border-gray-600 rounded-lg text-white focus:border-pink-400 focus:outline-none transition-colors"
                      >
                        <option value="">Select</option>
                        <option value="male">Men</option>
                        <option value="female">Women</option>
                        <option value="both">Everyone</option>
                      </select>
                    ) : (
                      <div className="px-3 py-2 bg-black/20 rounded-lg text-white border border-gray-700 capitalize text-sm">
                        {formData.interest || 'Not set'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Body Count</label>
                    {editMode ? (
                      <input
                        type="number"
                        value={editData.bodyCount}
                        onChange={(e) => setEditData(prev => ({ ...prev, bodyCount: e.target.value }))}
                        className="w-full px-3 py-2 text-sm bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-pink-400 focus:outline-none transition-colors"
                        placeholder="0-20+"
                        min="0"
                      />
                    ) : (
                      <div className="px-3 py-2 bg-black/20 rounded-lg text-white border border-gray-700 text-sm">
                        {(formData.bodyCount !== null && formData.bodyCount !== undefined) ? formData.bodyCount : 'Not set'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Location</label>
                    {editMode ? (
                      <select
                        value={editData.location}
                        onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-3 py-2 text-sm bg-black/20 border border-gray-600 rounded-lg text-white focus:border-pink-400 focus:outline-none transition-colors"
                      >
                        <option value="">Select country</option>
                        {countries.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="px-3 py-2 bg-black/20 rounded-lg text-white border border-gray-700 text-sm">
                        {formData.location || 'Not set'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Secret */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
              <h2 className="text-lg text-white mb-4 flex items-center">
                <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                Your Secret
              </h2>
              
              {editMode ? (
                <div className="space-y-3">
                  <textarea
                    value={editData.secret}
                    onChange={(e) => setEditData(prev => ({ ...prev, secret: e.target.value.slice(0, 100) }))}
                    className="w-full px-3 py-2 text-sm bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-pink-400 focus:outline-none resize-none h-20"
                    placeholder="Your secret (optional, max 100 chars)"
                  />
                  <div className="text-xs text-gray-500">{editData.secret.length}/100</div>
                  
                  {editData.secret && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Show in profile</span>
                      <button
                        onClick={() => setEditData(prev => ({ ...prev, showSecret: !prev.showSecret }))}
                        className={`relative inline-flex items-center h-4 rounded-full w-8 transition-colors focus:outline-none ${
                          editData.showSecret ? 'bg-pink-500' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block w-3 h-3 transform bg-white rounded-full transition-transform ${
                            editData.showSecret ? 'translate-x-4' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {formData.secret ? (
                    <>
                      {formData.showSecret ? (
                        <div className="px-3 py-2 bg-black/20 rounded-lg text-white border border-gray-700 text-sm">
                          {formData.secret}
                        </div>
                      ) : (
                        <div className="px-3 py-2 bg-black/20 rounded-lg text-gray-400 border border-gray-700 text-sm italic">
                          Secret hidden (Edit to view)
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="px-3 py-2 bg-black/20 rounded-lg text-gray-400 border border-gray-700 text-sm">
                      No secret set
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sexual Preferences - Full Width */}
            <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
              <h2 className="text-lg text-white mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                  Sexual Interests
                </div>
                <span className="text-xs bg-pink-500/20 text-pink-300 px-2 py-1 rounded-full">
                  {(editMode ? editData.preferences : formData.preferences || []).length} selected
                </span>
              </h2>
              
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {categories.map(pref => {
                  const isSelected = editMode 
                    ? editData.preferences.includes(pref.id)
                    : (formData.preferences || []).includes(pref.id)
                  
                  return (
                    <motion.button
                      key={pref.id}
                      onClick={() => editMode && handlePreferenceToggle(pref.id)}
                      disabled={!editMode}
                      className={`p-2 rounded-lg border text-center transition-all duration-200 ${
                        isSelected
                          ? 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 border-pink-500/40 text-pink-300'
                          : 'bg-black/20 border-gray-700 text-gray-400 hover:border-gray-600'
                      } ${editMode ? 'cursor-pointer hover:scale-[1.02]' : 'cursor-default'}`}
                      whileHover={editMode ? { scale: 1.02 } : {}}
                      whileTap={editMode ? { scale: 0.98 } : {}}
                    >
                      <div className="flex flex-col items-center space-y-1">
                        <span className="text-current">{pref.icon}</span>
                        <span className="text-xs font-medium leading-tight">{pref.name}</span>
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              {(!formData.preferences || formData.preferences.length === 0) && !editMode && (
                <div className="text-center py-6 text-gray-500">
                  <p className="text-sm">No preferences selected</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}