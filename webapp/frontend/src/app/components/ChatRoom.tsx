'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatOnlineCount } from '../config/brand'
import ChatInterface from './ChatInterface'

interface ChatRoomProps {
  roomName: string
  roomIcon: React.ReactNode
  onlineCount: number
  onBack: () => void
  formData: {
    gender?: string
    age?: number
    interest?: string
    username?: string
    preferences?: string[]
  }
}

// Generate realistic placeholder users
const generateUsers = (count: number, interest?: string) => {
  const femaleNames = [
    'Priya', 'Anjali', 'Kavya', 'Shreya', 'Riya', 'Pooja', 'Neha', 'Simran', 
    'Divya', 'Aisha', 'Tanvi', 'Asha', 'Meera', 'Sonia', 'Deepika', 'Kiran',
    'Sunita', 'Rekha', 'Madhuri', 'Vidya', 'Shilpa', 'Preeti', 'Anita', 'Geeta'
  ]
  
  const maleNames = [
    'Rahul', 'Amit', 'Rohan', 'Arjun', 'Vikash', 'Suresh', 'Ajay', 'Ravi',
    'Deepak', 'Manoj', 'Sandeep', 'Ashwin', 'Kiran', 'Nikhil', 'Sanjay', 'Arun',
    'Vinod', 'Prakash', 'Ramesh', 'Mukesh', 'Vishal', 'Gaurav', 'Sachin', 'Rajesh'
  ]

  const surnames = [
    'Sexyboy', 'Cumeater', 'Wildcat', 'Hornyguy', 'Lustful', 'Passionate', 'Desire',
    'Fantasy', 'Tempting', 'Naughty', 'Playful', 'Kinky', 'Sensual', 'Intimate',
    'Steamy', 'Hotty', 'Sizzling', 'Burning', 'Craving', 'Yearning', 'Addicted',
    'Hungry', 'Thirsty', 'Wild', 'Crazy', 'Mad', 'Insane', 'Wicked', 'Dirty'
  ]

  const indianStates = [
    'Mumbai, Maharashtra', 'Delhi, Delhi', 'Bangalore, Karnataka', 'Kolkata, West Bengal',
    'Chennai, Tamil Nadu', 'Hyderabad, Telangana', 'Pune, Maharashtra', 'Ahmedabad, Gujarat',
    'Jaipur, Rajasthan', 'Surat, Gujarat', 'Lucknow, Uttar Pradesh', 'Kanpur, Uttar Pradesh',
    'Nagpur, Maharashtra', 'Indore, Madhya Pradesh', 'Thane, Maharashtra', 'Bhopal, Madhya Pradesh',
    'Visakhapatnam, Andhra Pradesh', 'Pimpri-Chinchwad, Maharashtra', 'Patna, Bihar', 'Vadodara, Gujarat',
    'Ghaziabad, Uttar Pradesh', 'Ludhiana, Punjab', 'Agra, Uttar Pradesh', 'Nashik, Maharashtra',
    'Faridabad, Haryana', 'Meerut, Uttar Pradesh', 'Rajkot, Gujarat', 'Kalyan-Dombivli, Maharashtra'
  ]

  const users = []
  
  for (let i = 0; i < count; i++) {
    let gender: 'male' | 'female'
    let names: string[]
    
    // Determine gender based on interest
    if (interest === 'women') {
      gender = 'female'
      names = femaleNames
    } else if (interest === 'men') {
      gender = 'male'  
      names = maleNames
    } else {
      // Random for 'both' or no preference
      gender = Math.random() > 0.5 ? 'female' : 'male'
      names = gender === 'female' ? femaleNames : maleNames
    }

    const firstName = names[Math.floor(Math.random() * names.length)]
    const surname = surnames[Math.floor(Math.random() * surnames.length)]
    const location = indianStates[Math.floor(Math.random() * indianStates.length)]
    const age = Math.floor(Math.random() * 47) + 18 // 18-65
    
    users.push({
      id: `user-${i}`,
      username: `${firstName}${surname}`,
      age,
      gender,
      location,
      isOnline: true,
      lastSeen: 'Now'
    })
  }
  
  return users
}

export default function ChatRoom({ roomName, roomIcon, onlineCount, onBack, formData }: ChatRoomProps) {
  const [users] = useState(() => generateUsers(onlineCount, formData.interest))
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [favorites, setFavorites] = useState<string[]>([])

  const handleUserClick = (user: any) => {
    setSelectedUser(user)
  }

  const handleBackFromChat = () => {
    setSelectedUser(null)
  }

  const handleToggleFavorite = (userId: string) => {
    setFavorites(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  // Show ChatInterface if a user is selected
  if (selectedUser) {
    return (
      <ChatInterface
        user={selectedUser}
        onBack={handleBackFromChat}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={favorites.includes(selectedUser.id)}
        formData={formData}
      />
    )
  }

  // Separate users into favorites and others
  const favoriteUsers = users.filter(user => favorites.includes(user.id))
  const otherUsers = users.filter(user => !favorites.includes(user.id))

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-900/20 via-transparent to-transparent"></div>
      <div className="fixed inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(190,24,93,0.05)_50%,transparent_75%)]"></div>
      
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="sticky top-0 bg-black/50 backdrop-blur-lg border-b border-pink-500/20 p-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 text-gray-400 hover:text-white transition-colors duration-300"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-500/20 rounded-lg text-pink-400">
                  {roomIcon}
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">{roomName}</h1>
                  <p className="text-sm text-gray-400">{formatOnlineCount(onlineCount)} • Active now</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-glass-medium border border-pink-500/30 rounded-xl px-3 py-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">Live</span>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="p-4 pb-20">
          <div className="max-w-4xl mx-auto">
            {/* Favorites Section */}
            {favoriteUsers.length > 0 && (
              <div className="mb-8">
                <div className="mb-4">
                  <h2 className="text-lg font-medium text-pink-400 mb-2 flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>Your Favorites</span>
                    <span className="bg-pink-500/20 text-pink-300 px-2 py-1 rounded-full text-xs">{favoriteUsers.length}</span>
                  </h2>
                  <p className="text-gray-400 text-sm">Your special connections</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  <AnimatePresence>
                    {favoriteUsers.map((user, index) => (
                      <motion.button
                        key={user.id}
                        onClick={() => handleUserClick(user)}
                        className="group relative p-4 bg-gradient-to-br from-pink-500/10 to-rose-600/5 border-2 border-pink-500/30 rounded-2xl hover:border-pink-400 hover:from-pink-500/20 hover:to-rose-600/10 transition-all duration-300 text-left"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        {/* Favorite indicator */}
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                        
                        <div className="relative z-10 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {/* Avatar */}
                            <div className="relative">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg ${
                                user.gender === 'female' 
                                  ? 'bg-gradient-to-br from-pink-500 to-rose-600' 
                                  : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                              }`}>
                                {user.username.charAt(0).toUpperCase()}
                              </div>
                              {/* Online indicator */}
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-gray-900 rounded-full animate-pulse"></div>
                            </div>

                            {/* User Info */}
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="text-white font-semibold group-hover:text-pink-100 transition-colors">
                                  {user.username}
                                </h3>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  user.gender === 'female'
                                    ? 'bg-pink-500/20 text-pink-300'
                                    : 'bg-blue-500/20 text-blue-300'
                                }`}>
                                  {user.gender === 'female' ? '♀' : '♂'} {user.age}
                                </span>
                              </div>
                              <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                                📍 {user.location}
                              </p>
                            </div>
                          </div>

                          {/* Chat Arrow */}
                          <div className="text-pink-400 group-hover:text-pink-300 transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Other Users Section */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-white mb-2">People online right now</h2>
              <p className="text-gray-400 text-sm">Tap anyone to start chatting</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <AnimatePresence>
                {otherUsers.map((user, index) => (
                  <motion.button
                    key={user.id}
                    onClick={() => handleUserClick(user)}
                    className="group relative p-4 bg-glass-light backdrop-blur-lg border border-gray-600 rounded-2xl hover:border-pink-400 hover:bg-glass-medium transition-all duration-300 text-left"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-rose-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                    
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {/* Avatar */}
                        <div className="relative">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg ${
                            user.gender === 'female' 
                              ? 'bg-gradient-to-br from-pink-500 to-rose-600' 
                              : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                          }`}>
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          {/* Online indicator */}
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-gray-900 rounded-full animate-pulse"></div>
                        </div>

                        {/* User Info */}
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-white font-semibold group-hover:text-pink-100 transition-colors">
                              {user.username}
                            </h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              user.gender === 'female'
                                ? 'bg-pink-500/20 text-pink-300'
                                : 'bg-blue-500/20 text-blue-300'
                            }`}>
                              {user.gender === 'female' ? '♀' : '♂'} {user.age}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                            📍 {user.location}
                          </p>
                        </div>
                      </div>

                      {/* Chat Arrow */}
                      <div className="text-gray-500 group-hover:text-pink-400 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>

            {/* Footer message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: users.length * 0.05 + 0.5 }}
              className="text-center mt-8 p-4 bg-glass-light border border-gray-700 rounded-2xl"
            >
              <p className="text-gray-400 text-sm">
                🔒 All conversations are anonymous and encrypted
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}