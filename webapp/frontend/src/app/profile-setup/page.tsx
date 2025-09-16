'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import ProfileCreation from '../components/ProfileCreation'

export default function ProfileSetupPage() {
  const { user, userProfile, loading, createUserProfile } = useAuth()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Redirect if user is anonymous or not authenticated
  useEffect(() => {
    if (!loading && (!user || user.isAnonymous)) {
      router.push('/onboarding')
      return
    }
  }, [user, loading, router])

  const handleComplete = async (profileData: any) => {
    try {
      setIsRedirecting(true)

      // Create the Firebase profile with all profile data
      await createUserProfile({
        username: profileData.username,
        age: profileData.age,
        gender: profileData.gender,
        preferences: profileData.preferences,
        // New fields from profile setup
        bodyCount: profileData.bodyCount,
        secret: profileData.secret,
        showSecret: profileData.showSecret,
        avatar: profileData.avatar,
        bodyTypePreference: profileData.bodyTypePreference,
        location: profileData.location,
        // Note: moments (files) would need separate handling for file upload
        ...(profileData.moments?.length > 0 && { moments: profileData.moments })
      })


      // Redirect to chat lobby
      router.push('/onboarding') // This will go to ChatLobby since profile is complete
    } catch (error) {
      setIsRedirecting(false)
      alert('Failed to save profile. Please try again.')
    }
  }

  const handleBack = () => {
    // For Google users, going back means signing out
    router.push('/')
  }

  // Show loading state
  if (loading || !user || user.isAnonymous || isRedirecting) {
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
            {isRedirecting ? 'Completing setup...' : 'Initializing profile setup...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-900/20 via-transparent to-transparent"></div>
      <div className="fixed inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(190,24,93,0.05)_50%,transparent_75%)]"></div>
      
      {/* Main Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 mb-6">
              <img 
                src="/Kupid.png" 
                alt="Kupid" 
                className="w-8 h-8 md:w-10 md:h-10"
              />
              <span className="text-2xl md:text-3xl font-normal text-white bg-gradient-to-r from-pink-300 via-pink-500 to-pink-700 bg-[length:200%_200%] bg-clip-text text-transparent tracking-wider animate-gradient-shift">
                Kupid
                <span className="ml-2 text-sm animate-sparkle">✦</span>
              </span>
            </div>
          </div>

          {/* ProfileCreation Component */}
          <ProfileCreation
            onComplete={handleComplete}
            onBack={handleBack}
            existingData={{
              username: userProfile?.username || user.displayName || '',
              gender: userProfile?.gender,
              age: userProfile?.age,
              preferences: userProfile?.preferences || [],
              // Don't pass sexual preferences as interest - let user select gender preference
              interest: ''
            }}
          />
        </div>
      </div>
    </div>
  )
}