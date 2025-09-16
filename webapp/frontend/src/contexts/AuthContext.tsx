'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  User,
  onAuthStateChanged,
  signInAnonymously as firebaseSignInAnonymously,
  signInWithPopup,
  signOut as firebaseSignOut
} from 'firebase/auth'
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  collection,
  query,
  where,
  writeBatch,
  Timestamp
} from 'firebase/firestore'
import {
  getFirebaseAuth,
  getFirebaseFirestore,
  getGoogleAuthProvider,
  isAuthError,
  isFirestoreError
} from '@/lib/firebase'
import { UserProfile, AuthContextType } from '@/types/firebase'

// Auth Context
const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Helper function to convert Firebase timestamp to Date
const timestampToDate = (timestamp: any): Date => {
  if (timestamp?.toDate) return timestamp.toDate()
  if (timestamp instanceof Date) return timestamp
  return new Date()
}

// Enhanced AuthProvider with clean flows
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Auth state change listener
  useEffect(() => {
    const auth = getFirebaseAuth()

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        await loadUserProfile(firebaseUser.uid)
      } else {
        setUserProfile(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Anonymous user cleanup on page unload and inactive sessions
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (user?.isAnonymous && userProfile) {
        // Queue cleanup - use navigator.sendBeacon for reliable cleanup
        const cleanupData = JSON.stringify({ uid: user.uid })
        const blob = new Blob([cleanupData], { type: 'application/json' })
        navigator.sendBeacon('/api/cleanup-anonymous', blob)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [user, userProfile])

  // Periodic cleanup of old anonymous sessions - DISABLED for now due to Firestore index requirements
  // TODO: Enable after creating composite index or use Cloud Functions for cleanup
  useEffect(() => {
    // Currently disabled to prevent index errors during development
    // Anonymous profile cleanup is disabled - enable after creating Firestore indexes

    return () => {
      // No cleanup needed
    }
  }, [])

  // Load user profile from Firebase
  const loadUserProfile = async (uid: string): Promise<void> => {
    try {
      const db = getFirebaseFirestore()
      const profileDoc = await getDoc(doc(db, 'users', uid))

      if (profileDoc.exists()) {
        const data = profileDoc.data()
        const profile: UserProfile = {
          ...data,
          createdAt: timestampToDate(data.createdAt),
          lastActive: timestampToDate(data.lastActive)
        } as UserProfile

        setUserProfile(profile)
        await updateLastActive(uid)
      } else {
        setUserProfile(null)
      }
    } catch (error) {
      // Failed to load user profile
      setUserProfile(null)
    }
  }

  // Update last active timestamp
  const updateLastActive = async (uid: string): Promise<void> => {
    try {
      const db = getFirebaseFirestore()
      await setDoc(doc(db, 'users', uid), {
        lastActive: Timestamp.now()
      }, { merge: true })
    } catch (error) {
      // Failed to update last active
    }
  }

  // Anonymous sign in (for "Create New Profile" flow)
  const signInAnonymously = async (): Promise<void> => {
    try {
      setLoading(true)
      const auth = getFirebaseAuth()
      await firebaseSignInAnonymously(auth)
      // Profile will be created after onboarding completion
      setLoading(false)
    } catch (error) {
      // Anonymous sign-in failed
      setLoading(false)
      throw error
    }
  }

  // Google sign in (for "Continue with Google" flow from homepage)
  const signInWithGoogle = async (): Promise<void> => {
    try {
      setLoading(true)
      const auth = getFirebaseAuth()
      const googleProvider = getGoogleAuthProvider()

      const result = await signInWithPopup(auth, googleProvider)

      if (result.user.email) {
        // Check if user profile already exists
        const db = getFirebaseFirestore()

        const existingProfileQuery = query(
          collection(db, 'users'),
          where('email', '==', result.user.email)
        )
        const existingProfiles = await getDocs(existingProfileQuery)

        if (!existingProfiles.empty) {
          // User exists - profile will be loaded by auth state change
          const existingProfileId = existingProfiles.docs[0].id
          await setDoc(doc(db, 'users', existingProfileId), {
            lastActive: Timestamp.now()
          }, { merge: true })
        } else {
          // New Google user - store temp data for profile creation
          const tempUserData = {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
            isGoogleUser: true
          }

          if (typeof window !== 'undefined') {
            sessionStorage.setItem('pendingGoogleUser', JSON.stringify(tempUserData))
          }
        }
      } else {
        throw new Error('Google account does not have an email address')
      }

      setLoading(false)
    } catch (error) {
      // Google sign-in failed
      setLoading(false)

      // Provide user-friendly error messages
      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as { code: string }
        if (firebaseError.code === 'auth/popup-closed-by-user') {
          throw new Error('Google sign-in was cancelled')
        } else if (firebaseError.code === 'auth/network-request-failed') {
          throw new Error('Network error. Please check your internet connection and try again')
        }
      }

      throw error
    }
  }

  // Create user profile (called after onboarding/profile-setup completion)
  const createUserProfile = async (profileData: {
    gender: string
    age: number
    username: string
    preferences: string[]
    [key: string]: any
  }): Promise<void> => {
    if (!user) {
      throw new Error('No authenticated user found')
    }

    try {
      const db = getFirebaseFirestore()
      const now = Timestamp.now()

      // Get Google user data if available
      let googleUserData = null
      if (typeof window !== 'undefined') {
        const pendingData = sessionStorage.getItem('pendingGoogleUser')
        if (pendingData) {
          googleUserData = JSON.parse(pendingData)
          sessionStorage.removeItem('pendingGoogleUser')
        }
      }

      // Create complete profile (filter out undefined values for Firestore)
      const baseProfile = {
        uid: user.uid,
        username: profileData.username,
        age: profileData.age,
        gender: profileData.gender as 'male' | 'female' | 'other',
        preferences: profileData.preferences,
        isAnonymous: user.isAnonymous,
        createdAt: now,
        lastActive: now
      }

      // Add Google user data only if available (avoid undefined values)
      const googleFields: Partial<UserProfile> = {}
      if (googleUserData?.email) googleFields.email = googleUserData.email
      if (googleUserData?.displayName) googleFields.displayName = googleUserData.displayName
      if (googleUserData?.photoURL) googleFields.photoURL = googleUserData.photoURL

      // Add additional profile data (use null instead of undefined)
      const additionalFields = {
        location: profileData.location || null,
        bodyCount: profileData.bodyCount || null,
        bodyType: profileData.bodyType || null,
        bodyTypePreference: profileData.bodyTypePreference || null,
        secret: profileData.secret || null,
        showSecret: profileData.showSecret || false,
        avatar: profileData.avatar || null,
        moments: profileData.moments || []
      }

      const profile: UserProfile = {
        ...baseProfile,
        ...googleFields,
        ...additionalFields
      }

      await setDoc(doc(db, 'users', user.uid), profile)

      setUserProfile({
        ...profile,
        createdAt: timestampToDate(now),
        lastActive: timestampToDate(now)
      })
    } catch (error) {
      // Failed to create profile
      throw error
    }
  }

  // Update user profile (for profile edits)
  const updateUserProfile = async (updates: Partial<UserProfile>): Promise<void> => {
    if (!user || !userProfile) {
      throw new Error('No authenticated user or profile found')
    }

    try {
      const db = getFirebaseFirestore()
      const updateData = {
        ...updates,
        lastActive: Timestamp.now()
      }

      await setDoc(doc(db, 'users', user.uid), updateData, { merge: true })

      // Update local state
      const updatedProfile = {
        ...userProfile,
        ...updates,
        lastActive: new Date()
      }

      setUserProfile(updatedProfile)
    } catch (error) {
      // Failed to update profile
      throw error
    }
  }

  // Upgrade anonymous user to Google user
  const upgradeToGoogleUser = async (profileData: { [key: string]: any } = {}): Promise<{ conflictData?: { username: string }, isNewUser?: boolean }> => {
    if (!user?.isAnonymous || !userProfile) {
      throw new Error('Can only upgrade anonymous users')
    }

    try {
      const auth = getFirebaseAuth()
      const googleProvider = getGoogleAuthProvider()
      const db = getFirebaseFirestore()

      const result = await signInWithPopup(auth, googleProvider)

      if (result.user.email) {
        // Check if this Google account already has a profile
        const existingProfileQuery = query(
          collection(db, 'users'),
          where('email', '==', result.user.email)
        )
        const existingProfiles = await getDocs(existingProfileQuery)

        if (!existingProfiles.empty && existingProfiles.docs[0].id !== user.uid) {
          // Google account already exists with different profile
          const existingProfile = existingProfiles.docs[0].data() as UserProfile

          // Return conflict data for UI to handle
          return {
            conflictData: {
              username: existingProfile.username || 'Unknown User'
            }
          }
        }

        // New Google user - store temp data for profile creation
        const tempUserData = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          isGoogleUser: true
        }

        if (typeof window !== 'undefined') {
          sessionStorage.setItem('pendingGoogleUser', JSON.stringify(tempUserData))
        }

        // Delete the anonymous profile since we're switching to Google profile creation
        await deleteDoc(doc(db, 'users', user.uid))

        return { isNewUser: true }
      }

      throw new Error('Google account does not have an email address')
    } catch (error) {
      throw error
    }
  }

  // Sign out (with cleanup for anonymous users)
  const signOut = async (): Promise<void> => {
    try {
      const auth = getFirebaseAuth()

      // Clean up anonymous user profile before signing out (but don't fail if it errors)
      if (user?.isAnonymous && userProfile) {
        try {
          const db = getFirebaseFirestore()
          await deleteDoc(doc(db, 'users', user.uid))
        } catch (deleteError) {
          // Failed to delete anonymous user profile, but continuing with logout
          // Don't throw - we still want to complete the logout
        }
      }

      // Always attempt to sign out from Firebase Auth
      await firebaseSignOut(auth)

      // Clear any session data
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('pendingGoogleUser')
        sessionStorage.removeItem('onboardingNavigation')
      }

      // Reset local state
      setUser(null)
      setUserProfile(null)

    } catch (error) {
      // Sign out failed

      // Provide more specific error handling
      if (isAuthError(error)) {
        // Firebase Auth error during logout
      }

      // Even if Firebase signOut fails, clear local state to prevent stuck auth state
      try {
        setUser(null)
        setUserProfile(null)
        if (typeof window !== 'undefined') {
          sessionStorage.clear()
        }
      } catch (localError) {
        // Failed to clear local auth state
      }

      throw new Error('Logout failed. Your session has been cleared locally.')
    }
  }

  // Helper functions for UI logic
  const isGoogleUser = (): boolean => {
    if (!user || user.isAnonymous) {
      return false
    }

    // Check if user has email (Google users always have email)
    if (user.email) {
      return true
    }

    // Fallback: check if userProfile has email (for existing users)
    const hasProfileEmail = !!(userProfile?.email)
    return hasProfileEmail
  }

  const isAnonymousUser = (): boolean => {
    return !!(user?.isAnonymous)
  }

  const shouldShowGoogleLogin = (): boolean => {
    return isAnonymousUser() && !!userProfile
  }

  // Handle existing Google account conflict (switch to existing profile)
  const switchToExistingGoogleAccount = async (email: string): Promise<void> => {
    try {
      const db = getFirebaseFirestore()

      // Find the existing profile
      const existingProfileQuery = query(
        collection(db, 'users'),
        where('email', '==', email)
      )
      const existingProfiles = await getDocs(existingProfileQuery)

      if (!existingProfiles.empty) {
        // Delete current anonymous profile if it exists
        if (user?.uid && userProfile) {
          await deleteDoc(doc(db, 'users', user.uid))
        }

        // Update the existing profile's lastActive
        const existingProfileId = existingProfiles.docs[0].id
        await setDoc(doc(db, 'users', existingProfileId), {
          lastActive: Timestamp.now()
        }, { merge: true })

        // Load the existing profile
        await loadUserProfile(existingProfileId)
      }
    } catch (error) {
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signInAnonymously,
    signInWithGoogle,
    createUserProfile,
    updateUserProfile,
    upgradeToGoogleUser,
    switchToExistingGoogleAccount,
    signOut,
    isGoogleUser,
    isAnonymousUser,
    shouldShowGoogleLogin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}