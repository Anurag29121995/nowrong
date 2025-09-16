'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { User } from 'firebase/auth'

interface GoogleSignInButtonProps {
  onSignIn?: (user: User) => void
  onError?: (error: string) => void
}

export default function GoogleSignInButton({ onSignIn, onError }: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false)
  const { signInWithGoogle, user } = useAuth()

  const handleSignIn = async () => {
    setLoading(true)
    
    try {
      await signInWithGoogle()
      
      // The user will be available from the AuthContext after successful sign-in
      if (onSignIn && user) {
        onSignIn(user)
      }
    } catch (error: any) {
      
      let errorMessage = 'Failed to sign in with Google'
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in was cancelled'
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection'
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Pop-up was blocked. Please allow pop-ups and try again'
      }
      
      if (onError) {
        onError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.button
      onClick={handleSignIn}
      disabled={loading}
      className="group relative flex items-center space-x-3 bg-white hover:bg-gray-50 disabled:bg-gray-100 text-gray-900 border border-gray-300 rounded-xl px-6 py-3 transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
      whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -1 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          <span className="font-medium">Signing in...</span>
        </>
      ) : (
        <>
          {/* Google Icon */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          
          <span className="font-medium">Sign in with Google</span>
          
          {/* Subtle accent */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full opacity-75 group-hover:opacity-100 transition-opacity"></div>
        </>
      )}
    </motion.button>
  )
}