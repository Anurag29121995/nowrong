import React, { ReactNode } from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import * as firebaseAuth from 'firebase/auth'
import * as firebaseFirestore from 'firebase/firestore'

// Mock Firebase modules
jest.mock('../lib/firebase', () => ({
  auth: {},
  db: {},
  googleProvider: {},
  isAuthError: jest.fn(() => true),
  isFirestoreError: jest.fn(() => true),
}))

const mockUser = {
  uid: 'test-uid',
  isAnonymous: true,
  email: null,
  displayName: null,
  photoURL: null,
}

const mockGoogleUser = {
  uid: 'google-uid',
  isAnonymous: false,
  email: 'test@google.com',
  displayName: 'Test User',
  photoURL: 'https://example.com/photo.jpg',
}

const mockUserProfile = {
  uid: 'test-uid',
  gender: 'male',
  age: 25,
  username: 'testuser',
  preferences: ['movies', 'music'],
  isAnonymous: true,
  createdAt: new Date(),
  lastActive: new Date(),
}

// Test component that uses AuthContext
const TestComponent = () => {
  const { user, userProfile, loading, signInAnonymously, signInWithGoogle, updateUserProfile, signOut } = useAuth()

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div data-testid="user">{user ? user.uid : 'No user'}</div>
      <div data-testid="profile">{userProfile ? userProfile.username : 'No profile'}</div>
      <button onClick={signInAnonymously} data-testid="signin-anonymous">
        Sign In Anonymously
      </button>
      <button onClick={signInWithGoogle} data-testid="signin-google">
        Sign In with Google
      </button>
      <button onClick={() => updateUserProfile({ username: 'updated' })} data-testid="update-profile">
        Update Profile
      </button>
      <button onClick={signOut} data-testid="signout">
        Sign Out
      </button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should render loading state initially', () => {
      // Mock onAuthStateChanged to not call the callback immediately
      const mockOnAuthStateChanged = jest.fn()
      ;(firebaseAuth.onAuthStateChanged as jest.Mock).mockImplementation(mockOnAuthStateChanged)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('should initialize with no user when auth state is null', async () => {
      // Mock onAuthStateChanged to call callback with null user
      const mockOnAuthStateChanged = jest.fn((auth, callback) => {
        setTimeout(() => callback(null), 0)
        return jest.fn() // unsubscribe function
      })
      ;(firebaseAuth.onAuthStateChanged as jest.Mock).mockImplementation(mockOnAuthStateChanged)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('No user')
        expect(screen.getByTestId('profile')).toHaveTextContent('No profile')
      })
    })
  })

  describe('Anonymous Authentication', () => {
    it('should successfully sign in anonymously and create user profile', async () => {
      const mockSignInAnonymously = jest.fn().mockResolvedValue({
        user: mockUser,
      })
      const mockSetDoc = jest.fn().mockResolvedValue(undefined)
      const mockTimestampNow = jest.fn().mockReturnValue({ toDate: () => new Date() })
      
      ;(firebaseAuth.signInAnonymously as jest.Mock).mockImplementation(mockSignInAnonymously)
      ;(firebaseFirestore.setDoc as jest.Mock).mockImplementation(mockSetDoc)
      ;(firebaseFirestore.Timestamp.now as jest.Mock).mockImplementation(mockTimestampNow)

      // Mock onAuthStateChanged to simulate user sign-in
      const mockOnAuthStateChanged = jest.fn((auth, callback) => {
        setTimeout(() => callback(null), 0) // Initially no user
        return jest.fn() // unsubscribe function
      })
      ;(firebaseAuth.onAuthStateChanged as jest.Mock).mockImplementation(mockOnAuthStateChanged)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      // Wait for initial render
      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('No user')
      })

      // Click sign in anonymously
      act(() => {
        screen.getByTestId('signin-anonymous').click()
      })

      await waitFor(() => {
        expect(mockSignInAnonymously).toHaveBeenCalledWith({})
        expect(mockSetDoc).toHaveBeenCalled()
      })
    })

    it('should handle anonymous sign-in errors', async () => {
      const mockError = new Error('Auth failed')
      const mockSignInAnonymously = jest.fn().mockRejectedValue(mockError)
      
      ;(firebaseAuth.signInAnonymously as jest.Mock).mockImplementation(mockSignInAnonymously)

      // Mock console.error to avoid error output in tests
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      const mockOnAuthStateChanged = jest.fn((auth, callback) => {
        setTimeout(() => callback(null), 0)
        return jest.fn()
      })
      ;(firebaseAuth.onAuthStateChanged as jest.Mock).mockImplementation(mockOnAuthStateChanged)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('No user')
      })

      // Try to sign in anonymously
      await act(async () => {
        try {
          screen.getByTestId('signin-anonymous').click()
        } catch (error) {
          // Expected to throw
        }
      })

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Anonymous sign-in failed:', mockError)
      })

      consoleSpy.mockRestore()
    })
  })

  describe('Google Authentication', () => {
    it('should successfully sign in with Google for new user', async () => {
      const mockSignInWithPopup = jest.fn().mockResolvedValue({
        user: mockGoogleUser,
      })
      const mockGetDoc = jest.fn().mockResolvedValue({
        exists: () => false,
      })
      const mockSetDoc = jest.fn().mockResolvedValue(undefined)
      
      ;(firebaseAuth.signInWithPopup as jest.Mock).mockImplementation(mockSignInWithPopup)
      ;(firebaseFirestore.getDoc as jest.Mock).mockImplementation(mockGetDoc)
      ;(firebaseFirestore.setDoc as jest.Mock).mockImplementation(mockSetDoc)

      const mockOnAuthStateChanged = jest.fn((auth, callback) => {
        setTimeout(() => callback(null), 0)
        return jest.fn()
      })
      ;(firebaseAuth.onAuthStateChanged as jest.Mock).mockImplementation(mockOnAuthStateChanged)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('No user')
      })

      act(() => {
        screen.getByTestId('signin-google').click()
      })

      await waitFor(() => {
        expect(mockSignInWithPopup).toHaveBeenCalled()
        expect(mockGetDoc).toHaveBeenCalled()
        expect(mockSetDoc).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            uid: 'google-uid',
            email: 'test@google.com',
            displayName: 'Test User',
            isAnonymous: false,
          })
        )
      })
    })

    it('should migrate anonymous user data to Google account', async () => {
      // Mock an existing anonymous user
      const mockOnAuthStateChanged = jest.fn((auth, callback) => {
        setTimeout(() => callback(mockUser), 0) // Start with anonymous user
        return jest.fn()
      })
      ;(firebaseAuth.onAuthStateChanged as jest.Mock).mockImplementation(mockOnAuthStateChanged)

      const mockGetDoc = jest.fn().mockResolvedValue({
        exists: () => true,
        data: () => mockUserProfile,
      })
      const mockSignInWithPopup = jest.fn().mockResolvedValue({
        user: mockGoogleUser,
      })
      const mockSetDoc = jest.fn().mockResolvedValue(undefined)
      const mockDeleteDoc = jest.fn().mockResolvedValue(undefined)
      const mockWriteBatch = jest.fn(() => ({
        delete: jest.fn(),
        commit: jest.fn().mockResolvedValue(undefined),
      }))

      ;(firebaseFirestore.getDoc as jest.Mock).mockImplementation(mockGetDoc)
      ;(firebaseAuth.signInWithPopup as jest.Mock).mockImplementation(mockSignInWithPopup)
      ;(firebaseFirestore.setDoc as jest.Mock).mockImplementation(mockSetDoc)
      ;(firebaseFirestore.writeBatch as jest.Mock).mockImplementation(mockWriteBatch)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      // Wait for anonymous user to be loaded
      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('test-uid')
      })

      // Sign in with Google to upgrade account
      act(() => {
        screen.getByTestId('signin-google').click()
      })

      await waitFor(() => {
        expect(mockSignInWithPopup).toHaveBeenCalled()
        expect(mockSetDoc).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            uid: 'google-uid',
            username: 'testuser', // Should preserve anonymous data
            preferences: ['movies', 'music'],
            isAnonymous: false,
          })
        )
      })
    })
  })

  describe('Profile Management', () => {
    it('should successfully update user profile', async () => {
      // Mock authenticated user
      const mockOnAuthStateChanged = jest.fn((auth, callback) => {
        setTimeout(() => callback(mockUser), 0)
        return jest.fn()
      })
      ;(firebaseAuth.onAuthStateChanged as jest.Mock).mockImplementation(mockOnAuthStateChanged)

      const mockGetDoc = jest.fn().mockResolvedValue({
        exists: () => true,
        data: () => mockUserProfile,
      })
      const mockSetDoc = jest.fn().mockResolvedValue(undefined)

      ;(firebaseFirestore.getDoc as jest.Mock).mockImplementation(mockGetDoc)
      ;(firebaseFirestore.setDoc as jest.Mock).mockImplementation(mockSetDoc)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      // Wait for user and profile to be loaded
      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('test-uid')
        expect(screen.getByTestId('profile')).toHaveTextContent('testuser')
      })

      // Update profile
      act(() => {
        screen.getByTestId('update-profile').click()
      })

      await waitFor(() => {
        expect(mockSetDoc).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            username: 'updated',
          }),
          { merge: true }
        )
      })
    })

    it('should handle profile update errors', async () => {
      const mockError = new Error('Update failed')
      
      // Mock authenticated user
      const mockOnAuthStateChanged = jest.fn((auth, callback) => {
        setTimeout(() => callback(mockUser), 0)
        return jest.fn()
      })
      ;(firebaseAuth.onAuthStateChanged as jest.Mock).mockImplementation(mockOnAuthStateChanged)

      const mockGetDoc = jest.fn().mockResolvedValue({
        exists: () => true,
        data: () => mockUserProfile,
      })
      const mockSetDoc = jest.fn().mockRejectedValue(mockError)

      ;(firebaseFirestore.getDoc as jest.Mock).mockImplementation(mockGetDoc)
      ;(firebaseFirestore.setDoc as jest.Mock).mockImplementation(mockSetDoc)

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('profile')).toHaveTextContent('testuser')
      })

      // Try to update profile
      await act(async () => {
        try {
          screen.getByTestId('update-profile').click()
        } catch (error) {
          // Expected to throw
        }
      })

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to update profile:', mockError)
      })

      consoleSpy.mockRestore()
    })
  })

  describe('Sign Out', () => {
    it('should successfully sign out and clean up anonymous data', async () => {
      // Mock anonymous user
      const mockOnAuthStateChanged = jest.fn((auth, callback) => {
        setTimeout(() => callback(mockUser), 0)
        return jest.fn()
      })
      ;(firebaseAuth.onAuthStateChanged as jest.Mock).mockImplementation(mockOnAuthStateChanged)

      const mockSignOut = jest.fn().mockResolvedValue(undefined)
      const mockWriteBatch = jest.fn(() => ({
        delete: jest.fn(),
        commit: jest.fn().mockResolvedValue(undefined),
      }))

      ;(firebaseAuth.signOut as jest.Mock).mockImplementation(mockSignOut)
      ;(firebaseFirestore.writeBatch as jest.Mock).mockImplementation(mockWriteBatch)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('test-uid')
      })

      act(() => {
        screen.getByTestId('signout').click()
      })

      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalled()
        // Anonymous data cleanup should be called
        expect(mockWriteBatch).toHaveBeenCalled()
      })
    })

    it('should handle sign out errors', async () => {
      const mockError = new Error('Sign out failed')
      
      const mockOnAuthStateChanged = jest.fn((auth, callback) => {
        setTimeout(() => callback(mockUser), 0)
        return jest.fn()
      })
      ;(firebaseAuth.onAuthStateChanged as jest.Mock).mockImplementation(mockOnAuthStateChanged)

      const mockSignOut = jest.fn().mockRejectedValue(mockError)
      ;(firebaseAuth.signOut as jest.Mock).mockImplementation(mockSignOut)

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('test-uid')
      })

      await act(async () => {
        try {
          screen.getByTestId('signout').click()
        } catch (error) {
          // Expected to throw
        }
      })

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Sign out failed:', mockError)
      })

      consoleSpy.mockRestore()
    })
  })

  describe('Error Handling', () => {
    it('should throw error when useAuth is used outside AuthProvider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      expect(() => {
        render(<TestComponent />)
      }).toThrow('useAuth must be used within an AuthProvider')

      consoleSpy.mockRestore()
    })
  })
})