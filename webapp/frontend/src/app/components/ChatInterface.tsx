'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ChatInterfaceProps {
  user: {
    id: string
    username: string
    age: number
    gender: 'male' | 'female'
    location: string
    isOnline: boolean
    lastSeen: string
  }
  onBack: () => void
  onToggleFavorite: (userId: string) => void
  onViewProfile: (user: any) => void
  isFavorite: boolean
  formData: {
    username?: string
  }
}

interface Message {
  id: string
  senderId: string
  text?: string
  image?: string
  audio?: string
  timestamp: Date
  type: 'text' | 'image' | 'audio'
}

export default function ChatInterface({ user, onBack, onToggleFavorite, onViewProfile, isFavorite, formData }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [showMediaDrawer, setShowMediaDrawer] = useState(false)
  const [showFavPopup, setShowFavPopup] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: formData.username || 'You',
        text: inputText.trim(),
        timestamp: new Date(),
        type: 'text'
      }
      setMessages(prev => [...prev, newMessage])
      setInputText('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleMediaSelect = (type: 'camera' | 'gallery') => {
    if (type === 'camera') {
      cameraInputRef.current?.click()
    } else {
      fileInputRef.current?.click()
    }
    setShowMediaDrawer(false)
  }

  const handleToggleFavoriteWithPopup = (userId: string) => {
    const wasAlreadyFavorite = isFavorite
    onToggleFavorite(userId)
    
    if (!wasAlreadyFavorite) {
      setShowFavPopup(true)
      setTimeout(() => setShowFavPopup(false), 3000)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'camera' | 'gallery') => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file)
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: formData.username || 'You',
        image: imageUrl,
        timestamp: new Date(),
        type: 'image'
      }
      setMessages(prev => [...prev, newMessage])
    }
  }

  const startRecording = () => {
    setIsRecording(true)
    // TODO: Implement actual audio recording
    setTimeout(() => {
      setIsRecording(false)
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: formData.username || 'You',
        audio: 'audio-placeholder',
        timestamp: new Date(),
        type: 'audio'
      }
      setMessages(prev => [...prev, newMessage])
    }, 2000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col">
      {/* Background Effects - Consistent with your design */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-900/20 via-transparent to-transparent"></div>
      <div className="fixed inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(190,24,93,0.05)_50%,transparent_75%)]"></div>
      
      {/* Chat Header - Your brand style */}
      <div className="sticky top-0 bg-black/70 backdrop-blur-lg border-b border-pink-500/20 p-4 z-20">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-400 hover:text-white transition-colors duration-300 rounded-full hover:bg-pink-500/10"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* User Avatar */}
            <div className="relative">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg ${
                user.gender === 'female' 
                  ? 'bg-gradient-to-br from-pink-500 to-rose-600' 
                  : 'bg-gradient-to-br from-blue-500 to-indigo-600'
              }`}>
                {user.username.charAt(0).toUpperCase()}
              </div>
              {user.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-pink-400 border-2 border-black rounded-full animate-pulse"></div>
              )}
            </div>

            {/* User Info */}
            <div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => onViewProfile(user)}
                  className="text-lg font-semibold text-white hover:text-pink-400 transition-colors cursor-pointer"
                >
                  {user.username}
                </button>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  user.gender === 'female'
                    ? 'bg-pink-500/20 text-pink-300'
                    : 'bg-blue-500/20 text-blue-300'
                }`}>
                  {user.gender === 'female' ? '♀' : '♂'} {user.age}
                </span>
              </div>
              <div className="text-sm text-gray-400">
                {user.isOnline ? (
                  <span>Online now</span>
                ) : (
                  `Last seen ${user.lastSeen}`
                )}
              </div>
            </div>
          </div>

          {/* Prominent Heart Button with + Icon */}
          <button 
            onClick={() => handleToggleFavoriteWithPopup(user.id)}
            className={`relative p-3 rounded-full transition-all duration-300 group ${
              isFavorite 
                ? 'bg-pink-500 text-white shadow-glow scale-110' 
                : 'bg-glass-medium border border-pink-500/30 text-pink-400 hover:bg-pink-500/20 hover:scale-105 focus:bg-pink-500/20 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-500/50'
            }`}
          >
            <svg className="w-6 h-6" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            
            {/* + Icon Overlay for non-favorite state */}
            {!isFavorite && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center shadow-md group-hover:bg-pink-400 group-focus:bg-pink-400 transition-all duration-300 group-hover:scale-110 group-focus:scale-110">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Messages Area - WhatsApp Style with your branding */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-4">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto ${
                  user.gender === 'female' 
                    ? 'bg-gradient-to-br from-pink-500 to-rose-600' 
                    : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                }`}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Start your conversation with {user.username}</h3>
              <p className="text-gray-400 mb-4">Say hello and break the ice! 🔥</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Hey there! 😉', '👋 Hi!', 'What\'s up? 💕'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInputText(suggestion)}
                    className="px-4 py-2 bg-glass-medium border border-pink-500/30 rounded-xl text-pink-400 hover:text-pink-300 hover:border-pink-400 hover:bg-glass-dark transition-all duration-300 text-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((message) => {
                const isOwn = message.senderId === formData.username;
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
                  >
                    <div className={`relative max-w-xs md:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                      isOwn
                        ? 'bg-gradient-to-r from-primary-500 to-primary-700 text-white'
                        : 'bg-glass-medium border border-gray-600 text-white'
                    }`}>
                      {/* WhatsApp-like message tail */}
                      <div className={`absolute top-2 w-0 h-0 ${
                        isOwn 
                          ? '-right-2 border-l-8 border-l-primary-600 border-t-8 border-t-transparent'
                          : '-left-2 border-r-8 border-r-glass-medium border-t-8 border-t-transparent'
                      }`}></div>
                      
                      {message.type === 'text' && (
                        <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                      )}
                      {message.type === 'image' && (
                        <div className="-mx-4 -my-3">
                          <img 
                            src={message.image} 
                            alt="Shared image" 
                            className="rounded-2xl max-w-full h-auto"
                          />
                        </div>
                      )}
                      {message.type === 'audio' && (
                        <div className="flex items-center space-x-2 py-1">
                          <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <div className="flex-1 h-8 bg-white/20 rounded-full flex items-center px-2">
                            <div className="text-xs">🎵 Voice message</div>
                          </div>
                        </div>
                      )}
                      <div className="text-xs opacity-70 mt-1 text-right">
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Perfect WhatsApp-like alignment */}
      <div className="sticky bottom-0 bg-black/70 backdrop-blur-lg border-t border-pink-500/20 p-4 z-20">
        <div className="max-w-4xl mx-auto">
          {/* WhatsApp-style Input Row with perfect alignment */}
          <div className="flex items-center space-x-3">
            {/* Media Button */}
            <button
              onClick={() => setShowMediaDrawer(true)}
              className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-glass-medium border border-gray-600 text-gray-400 hover:text-pink-400 hover:border-pink-400 transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Text Input - Perfectly aligned */}
            <div className="flex-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full h-12 bg-glass-medium backdrop-blur-lg border border-gray-600/50 rounded-full px-4 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-0 focus:outline-none transition-colors duration-300 text-sm"
              />
            </div>

            {/* Send/Audio Button - Same size as media button */}
            {inputText.trim() ? (
              <button
                onClick={handleSendMessage}
                className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:shadow-glow hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            ) : (
              <button
                onMouseDown={startRecording}
                onMouseUp={() => setIsRecording(false)}
                onTouchStart={startRecording}
                onTouchEnd={() => setIsRecording(false)}
                className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 text-white ${
                  isRecording
                    ? 'bg-red-500 scale-110 shadow-lg animate-pulse'
                    : 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 hover:scale-105 shadow-md'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>

          {isRecording && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-center"
            >
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <p className="text-red-400 text-sm">Recording... Release to send</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(e, 'gallery')}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => handleFileUpload(e, 'camera')}
          className="hidden"
        />
      </div>

      {/* Media Drawer - Slides up from bottom */}
      <AnimatePresence>
        {showMediaDrawer && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMediaDrawer(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-pink-500/30 rounded-t-3xl z-50"
            >
              <div className="p-6">
                {/* Drawer Handle */}
                <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-6"></div>
                
                <h3 className="text-xl font-semibold text-white mb-6 text-center">Share Media</h3>
                
                {/* Media Options */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <button
                    onClick={() => handleMediaSelect('camera')}
                    className="flex flex-col items-center justify-center p-6 bg-glass-medium border border-pink-500/30 rounded-2xl text-white hover:bg-pink-500/20 hover:border-pink-400 transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 1H8.828a2 2 0 00-1.414.586L6.293 2.707A1 1 0 015.586 3H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium">Camera</span>
                    <span className="text-sm text-gray-400 mt-1">Take photo</span>
                  </button>
                  
                  <button
                    onClick={() => handleMediaSelect('gallery')}
                    className="flex flex-col items-center justify-center p-6 bg-glass-medium border border-pink-500/30 rounded-2xl text-white hover:bg-pink-500/20 hover:border-pink-400 transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium">Gallery</span>
                    <span className="text-sm text-gray-400 mt-1">Choose photo</span>
                  </button>
                </div>
                
                {/* Cancel Button */}
                <button
                  onClick={() => setShowMediaDrawer(false)}
                  className="w-full py-3 mt-2 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-600/50 hover:text-white transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Favorites Confirmation Popup */}
      <AnimatePresence>
        {showFavPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ 
              duration: 0.3,
              ease: "easeOut"
            }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
          >
            <div className="bg-black/90 backdrop-blur-xl border border-pink-500/20 rounded-2xl px-8 py-6 shadow-2xl max-w-xs w-full mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-white font-semibold text-lg mb-2">Added to favourites</p>
                <p className="text-gray-400 text-sm">Never miss their messages</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}