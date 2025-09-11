'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BRAND_CONFIG } from '../config/brand'
import ChatInterface from './ChatInterface'
import ProfileViewer from './ProfileViewer'

interface PostsFeedProps {
  onBack: () => void
  formData: {
    gender?: string
    age?: number
    interest?: string
    username?: string
    preferences?: string[]
  }
}

interface Post {
  id: string
  username: string
  age: number
  gender: 'male' | 'female'
  location: string
  content: string
  images: string[]
  likes: number
  comments: number
  dollarAmount: number
  timeAgo: string
  isOnline: boolean
  lastSeen: string
}

interface User {
  id: string
  username: string
  age: number
  gender: 'male' | 'female'
  location: string
  isOnline: boolean
  lastSeen: string
  preferences: string[]
  bodyType: string
  secretMessage: string
  bodyCount: number
  turnOns: string[]
}

export default function PostsFeed({ onBack, formData }: PostsFeedProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showChatWith, setShowChatWith] = useState<string | null>(null)
  const [showUnlockModal, setShowUnlockModal] = useState<{ postId: string, username: string, amount: number } | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState<{ postId: string, username: string, amount: number } | null>(null)
  const [showPaymentSuccess, setShowPaymentSuccess] = useState<{ username: string, amount: number } | null>(null)
  const [showPaymentRejected, setShowPaymentRejected] = useState<{ username: string, amount: number } | null>(null)
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [showCommentsFor, setShowCommentsFor] = useState<string | null>(null)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [newPost, setNewPost] = useState({ text: '', images: [] as File[] })
  const [showPremiumDetails, setShowPremiumDetails] = useState(false)
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null)
  const [comments, setComments] = useState<{[postId: string]: any[]}>({}) 
  const [commentText, setCommentText] = useState('')
  const [replyTo, setReplyTo] = useState<{postId: string, commentId: number} | null>(null)
  const [replyText, setReplyText] = useState('')

  // Mock posts data
  const mockPosts: Post[] = [
    {
      id: 'post-1',
      username: 'PriyaSexycat',
      age: 24,
      gender: 'female',
      location: 'Mumbai, Maharashtra',
      content: "Feeling so horny tonight 🔥 Anyone wants to have some wild fun with me? I'm craving for some rough action 😈",
      images: [
        'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=400&h=300&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face'
      ],
      likes: 147,
      comments: 23,
      dollarAmount: 25,
      timeAgo: '2 hours ago',
      isOnline: true,
      lastSeen: 'Now'
    },
    {
      id: 'post-2', 
      username: 'RahulWildboy',
      age: 28,
      gender: 'male',
      location: 'Delhi, Delhi',
      content: "Looking for a naughty girl who can handle my 8 inches 🍆 I promise to make you scream with pleasure all night long 💦",
      images: [],
      likes: 89,
      comments: 15,
      dollarAmount: 30,
      timeAgo: '4 hours ago',
      isOnline: false,
      lastSeen: '1 hour ago'
    },
    {
      id: 'post-3',
      username: 'KavyaHotty',
      age: 22,
      gender: 'female', 
      location: 'Bangalore, Karnataka',
      content: "Just got out of shower 💦 My body is still wet and I'm thinking about you touching every inch of me 😘",
      images: [
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=300&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=300&fit=crop&crop=face'
      ],
      likes: 234,
      comments: 67,
      dollarAmount: 40,
      timeAgo: '6 hours ago',
      isOnline: true,
      lastSeen: 'Now'
    },
    {
      id: 'post-4',
      username: 'AmitHungry',
      age: 31,
      gender: 'male',
      location: 'Pune, Maharashtra',
      content: "Who wants to see my morning wood? 🍆 I'm so hard right now and need someone to take care of it",
      images: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop&crop=face'
      ],
      likes: 76,
      comments: 12,
      dollarAmount: 20,
      timeAgo: '8 hours ago',
      isOnline: true,
      lastSeen: 'Now'
    },
    {
      id: 'post-5',
      username: 'ShreyaNaughty',
      age: 26,
      gender: 'female',
      location: 'Chennai, Tamil Nadu',
      content: "My pussy is dripping wet just thinking about all the dirty things I want to do tonight 🔥 Who's ready to get wild with me?",
      images: [
        'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=400&h=300&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=300&fit=crop&crop=face'
      ],
      likes: 189,
      comments: 45,
      dollarAmount: 35,
      timeAgo: '1 day ago',
      isOnline: false,
      lastSeen: '3 hours ago'
    }
  ]

  const handleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  const handleUsernameClick = (post: Post) => {
    const user: User = {
      id: post.username,
      username: post.username,
      age: post.age,
      gender: post.gender,
      location: post.location,
      isOnline: post.isOnline,
      lastSeen: post.lastSeen,
      preferences: ['Passionate', 'Wild', 'Kinky'],
      bodyType: post.gender === 'female' ? 'curvy' : 'athletic',
      secretMessage: "I love exploring new fantasies",
      bodyCount: Math.floor(Math.random() * 20) + 5,
      turnOns: ['Confidence', 'Humor', 'Adventure']
    }
    setSelectedUser(user)
  }

  const handleChatClick = (username: string) => {
    setShowChatWith(username)
  }

  const handleDollarClick = (postId: string, username: string, amount: number) => {
    setShowUnlockModal({ postId, username, amount })
  }

  const handleImageClick = (imageIndex: number, post: Post) => {
    if (imageIndex >= 2) {
      handleDollarClick(post.id, post.username, post.dollarAmount)
    }
  }

  const handleProceedToPayment = () => {
    if (showUnlockModal) {
      setShowPaymentModal(showUnlockModal)
      setShowUnlockModal(null)
    }
  }

  const handlePaymentComplete = () => {
    if (showPaymentModal) {
      setShowPaymentSuccess({
        username: showPaymentModal.username,
        amount: showPaymentModal.amount
      })
      setShowPaymentModal(null)
    }
  }

  const handlePaymentReject = () => {
    if (showPaymentModal) {
      setShowPaymentRejected({
        username: showPaymentModal.username,
        amount: showPaymentModal.amount
      })
      setShowPaymentModal(null)
    }
  }

  const handleCommentClick = (postId: string) => {
    setShowCommentsFor(showCommentsFor === postId ? null : postId)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages = Array.from(files)
      if (newPost.images.length + newImages.length > 2) {
        setShowPremiumDetails(true)
        return
      }
      setNewPost(prev => ({
        ...prev,
        images: [...prev.images, ...newImages].slice(0, 2)
      }))
    }
  }

  const removeImage = (index: number) => {
    setNewPost(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleCreatePost = () => {
    // Here you would normally send the post to your backend
    // Reset form
    setNewPost({ text: '', images: [] })
    setShowCreatePost(false)
  }

  const handleAddComment = (postId: string) => {
    if (!commentText.trim()) return
    
    const newComment = {
      id: Date.now(),
      username: formData.username || 'You',
      comment: commentText.trim(),
      timeAgo: 'now',
      isOwn: true,
      replies: []
    }
    
    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }))
    
    setCommentText('')
  }

  // Store static comments with replies in a separate state
  const [staticCommentReplies, setStaticCommentReplies] = useState<{[key: string]: {[commentIndex: number]: any[]}}>({})

  const handleAddReply = (postId: string, commentIndex: number, replyText: string) => {
    if (!replyText.trim()) return
    
    const newReply = {
      id: Date.now(),
      username: formData.username || 'You',
      comment: replyText.trim(),
      timeAgo: 'now',
      isOwn: true
    }
    
    // If it's one of the first 3 static comments (index 0, 1, 2)
    if (commentIndex <= 2) {
      setStaticCommentReplies(prev => ({
        ...prev,
        [postId]: {
          ...prev[postId],
          [commentIndex]: [...(prev[postId]?.[commentIndex] || []), newReply]
        }
      }))
    } else {
      // It's a dynamic comment, handle normally
      const dynamicIndex = commentIndex - 3
      setComments(prev => ({
        ...prev,
        [postId]: (prev[postId] || []).map((comment, idx) => {
          if (idx === dynamicIndex) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newReply]
            }
          }
          return comment
        })
      }))
    }
  }

  // Show ProfileViewer
  if (selectedUser) {
    return (
      <ProfileViewer
        user={selectedUser}
        onBack={() => setSelectedUser(null)}
        onStartChat={() => {
          setShowChatWith(selectedUser.username)
          setSelectedUser(null)
        }}
        showBackButton={true}
      />
    )
  }

  // Show ChatInterface
  if (showChatWith) {
    const post = mockPosts.find(p => p.username === showChatWith)
    if (post) {
      const chatUser: User = {
        id: post.username,
        username: post.username,
        age: post.age,
        gender: post.gender,
        location: post.location,
        isOnline: post.isOnline,
        lastSeen: post.lastSeen,
        preferences: ['Passionate', 'Wild'],
        bodyType: post.gender === 'female' ? 'curvy' : 'athletic',
        secretMessage: "Let's have some fun together",
        bodyCount: Math.floor(Math.random() * 20) + 5,
        turnOns: ['Adventure', 'Romance']
      }

      return (
        <AnimatePresence mode="wait">
          <motion.div
            key="chat-interface"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ChatInterface
              user={chatUser}
              onBack={() => setShowChatWith(null)}
              onToggleFavorite={() => {}}
              onViewProfile={() => {
                setSelectedUser(chatUser)
                setShowChatWith(null)
              }}
              isFavorite={false}
              formData={formData}
            />
          </motion.div>
        </AnimatePresence>
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-900/20 via-transparent to-transparent"></div>
      <div className="fixed inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(190,24,93,0.05)_50%,transparent_75%)]"></div>
      
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="sticky top-0 bg-black/50 backdrop-blur-lg border-b border-pink-500/20 p-4 pt-6">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 text-gray-400 hover:text-white transition-colors duration-300"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              <div>
                <h1 className="text-xl font-semibold text-white">Private Space</h1>
                <p className="text-sm text-gray-400">Exclusive content & connections</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-glass-medium border border-pink-500/30 rounded-xl px-3 py-2">
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
              <span className="text-pink-400 text-sm font-medium">Private</span>
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="p-4 pb-20">
          <div className="max-w-2xl mx-auto space-y-6">
            {mockPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-glass-medium backdrop-blur-lg border border-gray-700/50 rounded-2xl overflow-hidden hover:border-pink-500/30 transition-all duration-300"
              >
                {/* Post Header */}
                <div className="p-4 border-b border-gray-700/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {post.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        {post.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-black"></div>
                        )}
                      </div>
                      
                      <div>
                        <button
                          onClick={() => handleUsernameClick(post)}
                          className="font-semibold text-white hover:text-pink-300 transition-colors"
                        >
                          {post.username}
                        </button>
                        <p className="text-gray-400 text-sm">{post.age} • {post.location}</p>
                        <p className="text-gray-500 text-xs">{post.timeAgo}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleChatClick(post.username)}
                      className="p-2.5 text-pink-400 hover:text-pink-300 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 hover:border-pink-400 rounded-full transition-all duration-300 shadow-lg hover:shadow-pink-500/25"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                        <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-4">
                  <p className="text-white mb-4 leading-relaxed">{post.content}</p>

                  {/* Post Images */}
                  {post.images.length > 0 && (
                    <div className="mb-4">
                      {post.images.length === 1 && (
                        <div className="relative rounded-xl overflow-hidden">
                          <img
                            src={post.images[0]}
                            alt=""
                            onClick={() => setFullScreenImage(post.images[0])}
                            className="w-full aspect-square object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      
                      {post.images.length === 2 && (
                        <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden">
                          {post.images.map((image, idx) => (
                            <div key={idx} className="relative">
                              <img
                                src={image}
                                alt=""
                                onClick={() => setFullScreenImage(image)}
                                className="w-full aspect-square object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {post.images.length >= 3 && (
                        <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden">
                          <img
                            src={post.images[0]}
                            alt=""
                            onClick={() => setFullScreenImage(post.images[0])}
                            className="w-full aspect-square object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                          />
                          <div className="relative">
                            <img
                              src={post.images[1]}
                              alt=""
                              onClick={() => setFullScreenImage(post.images[1])}
                              className="w-full aspect-square object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                            />
                            {post.images.length > 2 && (
                              <button
                                onClick={() => handleImageClick(2, post)}
                                className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-black/60 transition-colors"
                              >
                                <div className="text-center">
                                  <svg className="w-12 h-12 text-pink-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                                  </svg>
                                  <p className="text-white font-semibold">+{post.images.length - 2} more</p>
                                  <p className="text-pink-400 text-sm">Unlock to view</p>
                                </div>
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-700/30">
                    <div className="flex items-center space-x-6">
                      {/* Like Button */}
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center space-x-2 transition-colors ${
                          likedPosts.has(post.id) 
                            ? 'text-pink-400' 
                            : 'text-gray-400 hover:text-pink-400'
                        }`}
                      >
                        <svg className="w-5 h-5" fill={likedPosts.has(post.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="text-sm font-medium">
                          {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                        </span>
                      </button>

                      {/* Comment Button */}
                      <button 
                        onClick={() => handleCommentClick(post.id)}
                        className={`flex items-center space-x-2 transition-colors ${
                          showCommentsFor === post.id 
                            ? 'text-blue-400' 
                            : 'text-gray-400 hover:text-blue-400'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="text-sm font-medium">{post.comments}</span>
                      </button>

                      {/* Share Button */}
                      <button className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                        <span className="text-sm font-medium">Share</span>
                      </button>
                    </div>

                    {/* Dollar Button */}
                    <button
                      onClick={() => handleDollarClick(post.id, post.username, post.dollarAmount)}
                      className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-amber-600/20 hover:from-yellow-500/30 hover:to-amber-600/30 border border-yellow-500/40 hover:border-yellow-400 rounded-lg px-3 py-1.5 transition-all duration-300 group"
                    >
                      <svg className="w-4 h-4 text-yellow-400 group-hover:text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-yellow-400 group-hover:text-yellow-300 text-sm font-medium">
                        ${post.dollarAmount}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                <AnimatePresence>
                  {showCommentsFor === post.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-700/30 p-4"
                    >
                      <div className="space-y-3">
                        {/* Close Comments Button */}
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-white font-medium">Comments</h3>
                          <button
                            onClick={() => setShowCommentsFor(null)}
                            className="p-1 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full transition-all duration-200"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>

                        {/* Sample Comments + User Comments */}
                        {[
                          { id: 0, username: 'SexyCat69', comment: 'OMG you look so hot! 🔥💦', timeAgo: '2h', isOwn: false, replies: staticCommentReplies[post.id]?.[0] || [] },
                          { id: 1, username: 'WildBoy23', comment: 'Would love to join you for some fun 😈', timeAgo: '1h', isOwn: false, replies: staticCommentReplies[post.id]?.[1] || [] },
                          { id: 2, username: 'NaughtyGirl', comment: 'Goals! You\'re amazing 💕', timeAgo: '30m', isOwn: false, replies: staticCommentReplies[post.id]?.[2] || [] },
                          ...(comments[post.id] || [])
                        ].map((comment, idx) => (
                          <div key={comment.id || idx} className="space-y-2">
                            <div className="flex space-x-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                comment.isOwn 
                                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                                  : 'bg-gradient-to-br from-pink-500 to-rose-600'
                              }`}>
                                <span className="text-white text-xs font-semibold">
                                  {comment.username.charAt(0)}
                                </span>
                              </div>
                              <div className="flex-1">
                                <div className="bg-gray-800/50 rounded-xl px-3 py-2">
                                  <button 
                                    onClick={() => {
                                      // Create a proper user object using same format as handleUsernameClick
                                      const user = {
                                        id: comment.username,
                                        username: comment.username,
                                        age: Math.floor(Math.random() * 30) + 18,
                                        gender: comment.username.includes('Cat') || comment.username.includes('Girl') ? 'female' : 'male',
                                        location: 'Mumbai, Maharashtra',
                                        isOnline: true,
                                        lastSeen: 'Now',
                                        preferences: ['Passionate', 'Wild', 'Kinky'],
                                        bodyType: comment.username.includes('Cat') || comment.username.includes('Girl') ? 'curvy' : 'athletic',
                                        secretMessage: "I love exploring new fantasies",
                                        bodyCount: Math.floor(Math.random() * 20) + 5,
                                        turnOns: ['Confidence', 'Humor', 'Adventure']
                                      }
                                      setSelectedUser(user as any)
                                    }}
                                    className={`text-sm font-medium hover:underline cursor-pointer ${
                                      comment.isOwn ? 'text-blue-400 hover:text-blue-300' : 'text-pink-400 hover:text-pink-300'
                                    }`}
                                  >
                                    {comment.username}
                                  </button>
                                  <p className="text-white text-sm">{comment.comment}</p>
                                </div>
                                <div className="flex items-center space-x-3 mt-1">
                                  <p className="text-gray-500 text-xs">{comment.timeAgo} ago</p>
                                  <button 
                                    onClick={() => setReplyTo({postId: post.id, commentId: idx})}
                                    className="text-gray-400 text-xs hover:text-pink-400 transition-colors"
                                  >
                                    Reply
                                  </button>
                                  {comment.replies && comment.replies.length > 0 && (
                                    <span className="text-gray-500 text-xs">
                                      {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {/* Replies */}
                            {comment.replies && comment.replies.length > 0 && (
                              <div className="ml-11 space-y-2">
                                {comment.replies.map((reply: any, replyIdx: number) => (
                                  <div key={reply.id || replyIdx} className="flex space-x-2">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                      reply.isOwn 
                                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                                        : 'bg-gradient-to-br from-pink-500 to-rose-600'
                                    }`}>
                                      <span className="text-white text-xs font-semibold">
                                        {reply.username.charAt(0)}
                                      </span>
                                    </div>
                                    <div className="flex-1">
                                      <div className="bg-gray-700/50 rounded-lg px-2 py-1.5">
                                        <button 
                                          onClick={() => {
                                            // Create a proper user object using same format as handleUsernameClick
                                            const user = {
                                              id: reply.username,
                                              username: reply.username,
                                              age: Math.floor(Math.random() * 30) + 18,
                                              gender: reply.username.includes('Cat') || reply.username.includes('Girl') ? 'female' : 'male',
                                              location: 'Delhi, Delhi',
                                              isOnline: true,
                                              lastSeen: 'Now',
                                              preferences: ['Passionate', 'Wild', 'Kinky'],
                                              bodyType: reply.username.includes('Cat') || reply.username.includes('Girl') ? 'curvy' : 'athletic',
                                              secretMessage: "I love exploring new fantasies",
                                              bodyCount: Math.floor(Math.random() * 20) + 5,
                                              turnOns: ['Confidence', 'Humor', 'Adventure']
                                            }
                                            setSelectedUser(user as any)
                                          }}
                                          className={`text-xs font-medium hover:underline cursor-pointer ${
                                            reply.isOwn ? 'text-blue-400 hover:text-blue-300' : 'text-pink-400 hover:text-pink-300'
                                          }`}
                                        >
                                          {reply.username}
                                        </button>
                                        <p className="text-white text-xs">{reply.comment}</p>
                                      </div>
                                      <p className="text-gray-500 text-xs mt-0.5">{reply.timeAgo} ago</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {/* Reply Input */}
                            {replyTo?.postId === post.id && replyTo?.commentId === idx && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="ml-11 flex space-x-2"
                              >
                                <input
                                  type="text"
                                  value={replyText}
                                  placeholder={`Reply to ${comment.username}...`}
                                  className="flex-1 bg-gray-800/50 border border-gray-600 rounded-full px-3 py-1.5 text-white placeholder-gray-400 text-xs focus:outline-none focus:ring-0"
                                  onChange={(e) => setReplyText(e.target.value)}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter' && replyText.trim()) {
                                      handleAddReply(post.id, idx, replyText.trim())
                                      setReplyText('')
                                      setReplyTo(null)
                                    }
                                  }}
                                  autoFocus
                                />
                                <button
                                  onClick={() => {
                                    if (replyText.trim()) {
                                      handleAddReply(post.id, idx, replyText.trim())
                                      setReplyText('')
                                      setReplyTo(null)
                                    }
                                  }}
                                  disabled={!replyText.trim()}
                                  className="p-1 bg-pink-500/20 hover:bg-pink-500/30 disabled:bg-gray-700/50 disabled:text-gray-500 text-pink-400 hover:text-pink-300 rounded-full transition-all duration-200 disabled:cursor-not-allowed"
                                >
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                  </svg>
                                </button>
                              </motion.div>
                            )}
                          </div>
                        ))}
                        
                        {/* Comment Input */}
                        <div className="flex space-x-3 pt-3 border-t border-gray-700/30">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-semibold">
                              {formData.username?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div className="flex-1 flex space-x-2">
                            <input
                              type="text"
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              placeholder="Write a comment..."
                              className="flex-1 bg-gray-800/50 border border-gray-600 rounded-full px-3 py-2 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-0"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddComment(post.id)
                                }
                              }}
                            />
                            <button 
                              onClick={() => handleAddComment(post.id)}
                              disabled={!commentText.trim()}
                              className="p-2 bg-pink-500/20 hover:bg-pink-500/30 disabled:bg-gray-700/50 disabled:text-gray-500 text-pink-400 hover:text-pink-300 rounded-full transition-all duration-200 disabled:cursor-not-allowed"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Unlock Modal */}
      <AnimatePresence>
        {showUnlockModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-glass-dark backdrop-blur-xl border border-pink-500/30 rounded-2xl p-6 max-w-sm w-full"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Unlock Private Content</h3>
                <p className="text-gray-300 mb-2">
                  This will unlock all private assets and exclusive content from <span className="text-pink-400 font-semibold">{showUnlockModal.username}</span>
                </p>
                <div className="flex items-center justify-center space-x-1 mb-6">
                  <span className="text-2xl font-bold text-yellow-400">${showUnlockModal.amount}</span>
                  <span className="text-gray-400">one-time</span>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowUnlockModal(null)}
                    className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProceedToPayment}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-white rounded-lg transition-all duration-300 font-semibold"
                  >
                    Proceed to Pay
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-glass-dark backdrop-blur-xl border border-pink-500/30 rounded-2xl p-6 max-w-sm w-full"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Complete Payment</h3>
                <p className="text-gray-300 mb-4">
                  Payment to <span className="text-pink-400 font-semibold">{showPaymentModal.username}</span>
                </p>
                <div className="flex items-center justify-center space-x-1 mb-6">
                  <span className="text-3xl font-bold text-yellow-400">${showPaymentModal.amount}</span>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handlePaymentReject}
                    className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-300 font-medium"
                  >
                    Reject
                  </button>
                  <button
                    onClick={handlePaymentComplete}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white rounded-lg transition-all duration-300 font-semibold"
                  >
                    Complete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payment Success Modal */}
      <AnimatePresence>
        {showPaymentSuccess && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-glass-dark backdrop-blur-xl border border-pink-500/30 rounded-2xl p-6 max-w-sm w-full"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Payment Successful!</h3>
                <p className="text-gray-300 mb-4">
                  Your payment of <span className="text-yellow-400 font-semibold">${showPaymentSuccess.amount}</span> to <span className="text-pink-400 font-semibold">{showPaymentSuccess.username}</span> was successful.
                </p>
                <p className="text-sm text-gray-400 mb-6">
                  You now have access to all exclusive content!
                </p>
                
                <button
                  onClick={() => setShowPaymentSuccess(null)}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white rounded-lg transition-all duration-300 font-semibold"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payment Rejected Modal */}
      <AnimatePresence>
        {showPaymentRejected && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-glass-dark backdrop-blur-xl border border-gray-500/30 rounded-2xl p-6 max-w-sm w-full"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Payment Cancelled</h3>
                <p className="text-gray-300 mb-4">
                  Your payment of <span className="text-yellow-400 font-semibold">${showPaymentRejected.amount}</span> to <span className="text-pink-400 font-semibold">{showPaymentRejected.username}</span> was cancelled.
                </p>
                <p className="text-sm text-gray-400 mb-6">
                  You can try again anytime to unlock the exclusive content.
                </p>
                
                <button
                  onClick={() => setShowPaymentRejected(null)}
                  className="w-full px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-300 font-medium"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Create Post Button */}
      <motion.button
        onClick={() => setShowCreatePost(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 rounded-full shadow-2xl hover:shadow-pink-500/50 flex items-center justify-center transition-all duration-300 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      </motion.button>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreatePost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreatePost(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Create Post</h3>
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Text Input */}
              <textarea
                value={newPost.text}
                onChange={(e) => setNewPost(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Share your thoughts..."
                className="w-full h-32 p-4 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 resize-none focus:outline-none focus:border-pink-500 transition-colors"
              />

              {/* Image Upload */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-300">Photos ({newPost.images.length}/2)</span>
                    {newPost.images.length >= 2 && (
                      <span className="text-xs text-orange-400 bg-orange-500/20 px-2 py-1 rounded">
                        Upgrade for unlimited!
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className={`px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-colors flex items-center space-x-1 ${
                      newPost.images.length >= 2 
                        ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed' 
                        : 'bg-pink-500/20 text-pink-400 hover:bg-pink-500/30'
                    }`}>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      <span>Add Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={newPost.images.length >= 2}
                      />
                    </label>
                    {newPost.images.length >= 2 && (
                      <button
                        onClick={() => setShowPremiumDetails(true)}
                        className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg text-sm font-medium hover:from-pink-400 hover:to-rose-500 transition-all"
                      >
                        Go Premium
                      </button>
                    )}
                  </div>
                </div>

                {newPost.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {newPost.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Premium CTA - Simple and Direct */}
              <div className="mt-4 bg-gradient-to-r from-pink-500/10 to-rose-600/10 border border-pink-500/30 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white flex items-center space-x-2 mb-1">
                      <svg className="w-4 h-4 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>Go Premium</span>
                    </h4>
                    <p className="text-gray-300 text-sm">Subscribe to premium and upload upto 100 pictures and start earning</p>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg text-sm font-medium hover:from-pink-400 hover:to-rose-500 transition-all whitespace-nowrap">
                    Upgrade - $10
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="flex-1 py-3 px-4 bg-gray-700 text-gray-300 rounded-xl font-medium hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePost}
                  disabled={!newPost.text.trim()}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-pink-400 hover:to-rose-500 transition-all"
                >
                  Post
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Image Modal */}
      <AnimatePresence>
        {fullScreenImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setFullScreenImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={fullScreenImage}
                alt="Full size image"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <button
                onClick={() => setFullScreenImage(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}