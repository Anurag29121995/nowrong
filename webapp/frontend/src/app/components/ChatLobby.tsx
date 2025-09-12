'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BRAND_CONFIG, formatOnlineCount, ANIMATIONS } from '../config/brand'
import ChatRoom from './ChatRoom'
import PostsFeed from './PostsFeed'
import ProfileScreen from './ProfileScreen'

interface ChatLobbyProps {
  onBack?: () => void
  formData: {
    gender?: string
    age?: number
    interest?: string
    username?: string
    preferences?: string[]
    avatar?: string
  }
  onUpdateFormData?: (updatedData: any) => void
}

export default function ChatLobby({ onBack, formData, onUpdateFormData }: ChatLobbyProps) {
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<{ id: string; name: string; icon: React.ReactNode; onlineCount: number } | null>(null)
  const [showPostsFeed, setShowPostsFeed] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  // All available categories (complete list from PreferencesSelection - 21 total)
  const allCategories = [
    { 
      id: 'rough', 
      name: 'Rough Sex', 
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 4c-1.5 0-3 1-3 2.5v3c0 1.5 1.5 2.5 3 2.5s3-1 3-2.5v-3c0-1.5-1.5-2.5-3-2.5z"/>
          <path d="M8 8l-2 2v6l2 2h8l2-2v-6l-2-2"/>
          <path d="M6 12h12M6 14h12M6 16h12"/>
          <circle cx="8" cy="6" r="1"/>
          <circle cx="16" cy="6" r="1"/>
        </svg>
      ), 
      description: 'Pound me rough',
      onlineCount: Math.floor(Math.random() * 50) + 10
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
      description: 'Tie me up',
      onlineCount: Math.floor(Math.random() * 40) + 15
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
      description: 'Fuck my ass',
      onlineCount: Math.floor(Math.random() * 60) + 20
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
      description: 'Suck it deep',
      onlineCount: Math.floor(Math.random() * 70) + 25
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
      description: 'Three way wild',
      onlineCount: Math.floor(Math.random() * 35) + 12
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
      description: 'Group fuck me',
      onlineCount: Math.floor(Math.random() * 28) + 8
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
      description: 'Horny mommy sluts',
      onlineCount: Math.floor(Math.random() * 45) + 18
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
      description: 'Young tight sluts',
      onlineCount: Math.floor(Math.random() * 55) + 22
    },
    { 
      id: 'incest', 
      name: 'Family Taboo', 
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM20 22v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 7h-2.08A1.5 1.5 0 0 0 15.04 8.37L12.5 16H15v6h5zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm1.5 16v-6H9.5l-2.54-7.63A1.5 1.5 0 0 0 5.54 7H3.46A1.5 1.5 0 0 0 2.04 8.37L-.5 16H2v6h5z"/>
        </svg>
      ), 
      description: 'Forbidden family fun',
      onlineCount: Math.floor(Math.random() * 25) + 5
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
      description: 'Cum inside me',
      onlineCount: Math.floor(Math.random() * 42) + 16
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
      description: 'Make me gush',
      onlineCount: Math.floor(Math.random() * 38) + 14
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
      description: 'Cum on face',
      onlineCount: Math.floor(Math.random() * 33) + 11
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
      description: 'Gag me hard',
      onlineCount: Math.floor(Math.random() * 29) + 9
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
      description: 'Worship my feet',
      onlineCount: Math.floor(Math.random() * 22) + 6
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
      description: 'Breed me wild',
      onlineCount: Math.floor(Math.random() * 18) + 4
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
      description: 'Milk my tits',
      onlineCount: Math.floor(Math.random() * 15) + 3
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
      description: 'Tie me tight',
      onlineCount: Math.floor(Math.random() * 31) + 12
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
      description: 'Spank me raw',
      onlineCount: Math.floor(Math.random() * 26) + 8
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
      description: 'Watch me play',
      onlineCount: Math.floor(Math.random() * 34) + 13
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
      description: 'Love to watch',
      onlineCount: Math.floor(Math.random() * 27) + 7
    }
  ]

  // Get user's selected preferences
  const userPreferences = formData.preferences || []
  const selectedCategories = allCategories.filter(cat => userPreferences.includes(cat.id))
  
  // Get other categories (not selected by user)
  const otherCategories = allCategories.filter(cat => !userPreferences.includes(cat.id))
  
  // Categories to show in "More for you" section
  const moreForYouCategories = showAllCategories ? otherCategories : otherCategories.slice(0, 6)

  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    const category = allCategories.find(cat => cat.id === categoryId)
    if (category) {
      setSelectedRoom({
        id: category.id,
        name: category.name,
        icon: category.icon,
        onlineCount: category.onlineCount
      })
    }
  }

  const handleBackFromRoom = () => {
    setSelectedRoom(null)
  }

  const handleBackFromPostsFeed = () => {
    setShowPostsFeed(false)
  }

  const handleBackFromProfile = () => {
    setShowProfile(false)
  }

  const handleProfileSave = (updatedData: any) => {
    if (onUpdateFormData) {
      onUpdateFormData(updatedData)
    }
    // Don't redirect - stay on profile screen after save
  }

  // Show ProfileScreen if selected
  if (showProfile) {
    return (
      <ProfileScreen
        onBack={handleBackFromProfile}
        formData={formData}
        onSave={handleProfileSave}
      />
    )
  }

  // Show PostsFeed if selected
  if (showPostsFeed) {
    return (
      <PostsFeed
        onBack={handleBackFromPostsFeed}
        formData={formData}
      />
    )
  }

  // Show ChatRoom if a room is selected
  if (selectedRoom) {
    return (
      <ChatRoom
        roomName={selectedRoom.name}
        roomIcon={selectedRoom.icon}
        onlineCount={selectedRoom.onlineCount}
        onBack={handleBackFromRoom}
        formData={formData}
        onUpdateFormData={onUpdateFormData}
      />
    )
  }

  // Show ChatLobby by default
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-900/20 via-transparent to-transparent"></div>
      <div className="fixed inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(190,24,93,0.05)_50%,transparent_75%)]"></div>
      
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="sticky top-0 bg-black/50 backdrop-blur-lg border-b border-pink-500/20 p-4 pt-6">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button 
            onClick={() => window.location.href = 'http://localhost:8080/'}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <img 
              src="/nowrong-icon.png" 
              alt="NoWrong" 
              className="w-9 h-9"
            />
            <div>
              <h1 className={`${BRAND_CONFIG.typography.brand.fontSize.md} ${BRAND_CONFIG.typography.brand.fontWeight} ${BRAND_CONFIG.typography.brand.background} ${BRAND_CONFIG.typography.brand.backgroundClip}`}>
                {BRAND_CONFIG.name}
              </h1>
              <p className="text-gray-400 text-sm">Welcome, {formData.username}</p>
            </div>
          </button>
          
          <button
            onClick={() => setShowPostsFeed(true)}
            className="group relative flex items-center space-x-2 bg-gradient-to-r from-pink-500/20 to-rose-600/20 hover:from-pink-500/30 hover:to-rose-600/30 border border-pink-500/40 hover:border-pink-400 rounded-xl px-4 py-2.5 transition-all duration-300 shadow-lg hover:shadow-pink-500/25"
          >
            <div className="flex items-center justify-center">
              <svg className="w-4 h-4 text-pink-400 group-hover:text-pink-300 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <span className="text-pink-400 group-hover:text-pink-300 text-sm font-medium transition-colors">
              Private Space
            </span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full animate-pulse shadow-lg"></div>
          </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 pb-20">
          <div className="max-w-4xl mx-auto space-y-10">
          
          {/* We bet you will get wet Section */}
          {selectedCategories.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-light mb-2 bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">
                  We bet you will get wet 💦
                </h2>
                <p className="text-gray-400 mb-4">Your selected desires await</p>
                
                {/* Profile Button */}
                <motion.button
                  onClick={() => setShowProfile(true)}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500/20 to-rose-600/20 hover:from-pink-500/30 hover:to-rose-600/30 border border-pink-500/40 hover:border-pink-400 rounded-xl px-6 py-3 transition-all duration-300 shadow-lg hover:shadow-pink-500/25 group"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center w-5 h-5">
                    <svg className="w-5 h-5 text-pink-400 group-hover:text-pink-300 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-pink-400 group-hover:text-pink-300 text-sm font-medium transition-colors">
                    Profile
                  </span>
                </motion.button>
              </div>

              {/* First row: 2 items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {selectedCategories.slice(0, 2).map((category, index) => (
                  <motion.button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id, category.name)}
                    className="relative group p-4 bg-glass-medium backdrop-blur-lg border border-pink-500/30 rounded-xl hover:border-pink-400 hover:bg-glass-dark transition-all duration-300 text-left overflow-hidden"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-rose-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 bg-pink-500/20 rounded-lg text-pink-400 group-hover:text-pink-300 transition-colors">
                          {category.icon}
                        </div>
                        <div className="flex items-center space-x-1 bg-green-500/20 rounded-full px-2 py-1">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-green-400 text-xs font-medium">{formatOnlineCount(category.onlineCount)}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-pink-300 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">{category.description}</p>
                      
                      <div className="flex items-center text-pink-400 text-sm font-medium">
                        <span>Enter Room</span>
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Second row: 3 items */}
              {selectedCategories.length > 2 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {selectedCategories.slice(2, 5).map((category, index) => (
                    <motion.button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id, category.name)}
                      className="relative group p-4 bg-glass-medium backdrop-blur-lg border border-pink-500/30 rounded-xl hover:border-pink-400 hover:bg-glass-dark transition-all duration-300 text-left overflow-hidden"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (index + 2) * 0.1 }}
                    >
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-rose-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-2.5 bg-pink-500/20 rounded-lg text-pink-400 group-hover:text-pink-300 transition-colors">
                            {category.icon}
                          </div>
                          <div className="flex items-center space-x-1 bg-green-500/20 rounded-full px-2 py-1">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-green-400 text-xs font-medium">{formatOnlineCount(category.onlineCount)}</span>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-pink-300 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">{category.description}</p>
                        
                        <div className="flex items-center text-pink-400 text-sm font-medium">
                          <span>Enter Room</span>
                          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.section>
          )}

          {/* More for you Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-light mb-2 bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">
                More for you
              </h2>
              <p className="text-gray-400">Explore other desires</p>
            </div>

            {/* First row: 3 items */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {moreForYouCategories.slice(0, 3).map((category, index) => (
                <motion.button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id, category.name)}
                  className="relative group p-5 bg-glass-light backdrop-blur-lg border border-gray-600 rounded-2xl hover:border-pink-400 hover:bg-glass-medium transition-all duration-300 text-left overflow-hidden"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-rose-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2.5 bg-gray-600/30 rounded-lg text-gray-400 group-hover:text-pink-400 group-hover:bg-pink-500/20 transition-all">
                        {category.icon}
                      </div>
                      <div className="flex items-center space-x-1 bg-green-500/20 rounded-full px-2 py-1">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-xs font-medium">{formatOnlineCount(category.onlineCount)}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-pink-300 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">{category.description}</p>
                    
                    <div className="flex items-center text-gray-400 group-hover:text-pink-400 text-sm font-medium transition-colors">
                      <span>Explore</span>
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Second row: 3 items */}
            {moreForYouCategories.length > 3 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {moreForYouCategories.slice(3, 6).map((category, index) => (
                  <motion.button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id, category.name)}
                    className="relative group p-5 bg-glass-light backdrop-blur-lg border border-gray-600 rounded-2xl hover:border-pink-400 hover:bg-glass-medium transition-all duration-300 text-left overflow-hidden"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (index + 3) * 0.05 }}
                  >
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-rose-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2.5 bg-gray-600/30 rounded-lg text-gray-400 group-hover:text-pink-400 group-hover:bg-pink-500/20 transition-all">
                          {category.icon}
                        </div>
                        <div className="flex items-center space-x-1 bg-green-500/20 rounded-full px-2 py-1">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-green-400 text-xs font-medium">{formatOnlineCount(category.onlineCount)}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-white font-semibold mb-2 group-hover:text-pink-100 transition-colors">{category.name}</h3>
                        <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors line-clamp-2">{category.description}</p>
                      </div>
                    </div>
                    
                    {/* Arrow indicator */}
                    <div className="absolute bottom-4 right-4 text-gray-500 group-hover:text-pink-400 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Additional rows for all categories when expanded */}
            {showAllCategories && moreForYouCategories.length > 6 && (
              <div>
                {Array.from({ length: Math.ceil((moreForYouCategories.length - 6) / 3) }, (_, rowIndex) => (
                  <motion.div 
                    key={`additional-row-${rowIndex}`}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + rowIndex * 0.1 }}
                  >
                    {moreForYouCategories.slice(6 + rowIndex * 3, 6 + (rowIndex + 1) * 3).map((category, index) => (
                      <motion.button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id, category.name)}
                        className="relative group p-5 bg-glass-light backdrop-blur-lg border border-gray-600 rounded-2xl hover:border-pink-400 hover:bg-glass-medium transition-all duration-300 text-left overflow-hidden"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (6 + rowIndex * 3 + index) * 0.05 }}
                      >
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-rose-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-3">
                            <div className="p-2.5 bg-gray-600/30 rounded-lg text-gray-400 group-hover:text-pink-400 group-hover:bg-pink-500/20 transition-all">
                              {category.icon}
                            </div>
                            <div className="flex items-center space-x-1 bg-green-500/20 rounded-full px-2 py-1">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                              <span className="text-green-400 text-xs font-medium">{formatOnlineCount(category.onlineCount)}</span>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-white font-semibold mb-2 group-hover:text-pink-100 transition-colors">{category.name}</h3>
                            <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors line-clamp-2">{category.description}</p>
                          </div>
                        </div>
                        
                        {/* Arrow indicator */}
                        <div className="absolute bottom-4 right-4 text-gray-500 group-hover:text-pink-400 transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                ))}
              </div>
            )}

            {/* See All / Collapse Button */}
            {otherCategories.length > 6 && (
              <motion.div 
                className="text-center mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <button
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-glass-medium border border-pink-500/30 rounded-xl text-pink-400 hover:text-pink-300 hover:border-pink-400 hover:bg-glass-dark transition-all duration-300 font-medium"
                >
                  <span>{showAllCategories ? 'Show Less' : 'See All Categories'}</span>
                  <motion.svg 
                    className="w-5 h-5" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    animate={{ rotate: showAllCategories ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </motion.svg>
                </button>
              </motion.div>
            )}
          </motion.section>
          </div>
        </div>
      </div>
    </div>
  )
}