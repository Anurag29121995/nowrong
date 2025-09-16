'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'

export default function HomePage() {
  const router = useRouter()
  const {
    user,
    userProfile,
    loading,
    signInAnonymously,
    signInWithGoogle,
    isGoogleUser,
    isAnonymousUser,
    shouldShowGoogleLogin
  } = useAuth()
  const [isCreatingProfile, setIsCreatingProfile] = useState(false)
  const [isSigningInGoogle, setIsSigningInGoogle] = useState(false)

  // Handle authenticated users - redirect Google users to appropriate page
  useEffect(() => {

    if (!loading && user) {

      // Google users should go to chat lobby if profile is complete, otherwise onboarding
      if (isGoogleUser()) {

        if (userProfile) {
          const isProfileComplete = userProfile.gender && userProfile.age && userProfile.username &&
                                    !userProfile.username.startsWith('user_') && userProfile.preferences?.length

          if (isProfileComplete) {
            router.push('/onboarding') // This will go to ChatLobby since profile is complete
          } else {
            router.push('/profile-setup') // Complete profile setup
          }
        } else {

          // For new Google users, userProfile is null until they complete setup
          // Check if we have pending Google user data in sessionStorage
          if (typeof window !== 'undefined') {
            const pendingGoogleUser = sessionStorage.getItem('pendingGoogleUser')
            if (pendingGoogleUser) {
              router.push('/profile-setup')
            } else {
              // This case should not happen, but as a safeguard, we'll reload
              setTimeout(() => {
                window.location.reload()
              }, 1000)
            }
          }
        }
      } else {
      }
    } else {
    }
  }, [user, userProfile, loading, router, isGoogleUser])


  const handleGoogleSignIn = async () => {
    try {
      setIsSigningInGoogle(true)

      await signInWithGoogle()

      // Give a moment for auth state to update, then reset loading if still on page
      setTimeout(() => {
        setIsSigningInGoogle(false)
      }, 3000)

    } catch (error) {
      // Google sign-in failed
      setIsSigningInGoogle(false)

      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in with Google. Please try again.'
      alert(errorMessage)
    }
  }

  const handleCreateProfile = async () => {
    try {
      setIsCreatingProfile(true)
      await signInAnonymously()

      // Set navigation flag to indicate proper flow
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('onboardingNavigation', 'true')
      }

      router.push('/onboarding')
    } catch (error) {
      // Anonymous sign-in failed
      setIsCreatingProfile(false)
      // Show user-friendly error message
      alert('Failed to create profile. Please check your internet connection and try again.')
    }
  }


  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
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
        </div>
      </div>
    )
  }

  // Don't show welcome screen for authenticated Google users (they're handled in useEffect)
  if (isGoogleUser()) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-900/20 via-transparent to-transparent"></div>
      <div className="fixed inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(190,24,93,0.05)_50%,transparent_75%)]"></div>
      
      {/* Main Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-3 mb-6"
            >
              <img 
                src="/Kupid.png" 
                alt="Kupid" 
                className="w-12 h-12 md:w-14 md:h-14"
              />
              <span className="text-3xl md:text-4xl font-normal text-white bg-gradient-to-r from-pink-300 via-pink-500 to-pink-700 bg-[length:200%_200%] bg-clip-text text-transparent tracking-wider animate-gradient-shift">
                Kupid
                <span className="ml-2 text-sm animate-sparkle">✦</span>
              </span>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-300 text-sm md:text-base leading-relaxed"
            >
              Connect with amazing people and discover meaningful conversations
            </motion.p>
          </div>

          {/* Welcome Options */}
          <div className="space-y-4">
            {/* Create New Profile Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={handleCreateProfile}
              disabled={isCreatingProfile}
              className="group w-full p-4 bg-glass-medium backdrop-blur-lg border border-gray-600 hover:border-pink-400 rounded-xl transition-all duration-300 hover:bg-glass-dark hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  
                  <div className="text-left">
                    <h3 className="text-white font-medium text-base group-hover:text-pink-100 transition-colors">
                      Create New Profile
                    </h3>
                    <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                      {isCreatingProfile ? 'Setting up your profile...' : 'Start your journey with a fresh profile'}
                    </p>
                  </div>
                </div>
                
                {!isCreatingProfile && (
                  <div className="text-gray-500 group-hover:text-pink-400 transition-colors">
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                
                {isCreatingProfile && (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pink-500"></div>
                )}
              </div>
            </motion.button>

            {/* Continue with Google Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={handleGoogleSignIn}
              disabled={isSigningInGoogle}
              className="group w-full p-4 bg-glass-medium backdrop-blur-lg border border-gray-600 hover:border-blue-400 rounded-xl transition-all duration-300 hover:bg-glass-dark hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                  
                  <div className="text-left">
                    <h3 className="text-white font-medium text-base group-hover:text-blue-100 transition-colors">
                      Continue with Google
                    </h3>
                    <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                      {isSigningInGoogle ? 'Signing you in...' : 'Sign in with your Google account'}
                    </p>
                  </div>
                </div>
                
                {!isSigningInGoogle && (
                  <div className="text-gray-500 group-hover:text-blue-400 transition-colors">
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                
                {isSigningInGoogle && (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                )}
              </div>
            </motion.button>

          </div>

          {/* Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-8"
          >
            <p className="text-gray-500 text-xs">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}