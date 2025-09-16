import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OnboardingPage from '../app/onboarding/page'
import { AuthProvider } from '../contexts/AuthContext'
import * as firebaseAuth from 'firebase/auth'
import * as firebaseFirestore from 'firebase/firestore'

// Mock Firebase
jest.mock('../lib/firebase', () => ({
  auth: {},
  db: {},
  googleProvider: {},
  isAuthError: jest.fn(() => true),
  isFirestoreError: jest.fn(() => true),
}))

// Mock components that are tested separately
jest.mock('../app/components/GenderSelection', () => {
  return function MockGenderSelection({ onNext, onBack, canGoBack, formData }: any) {
    return (
      <div data-testid="gender-selection">
        <p>Current gender: {formData?.gender || 'none'}</p>
        <button onClick={() => onNext({ gender: 'female' })} data-testid="select-female">
          Select Female
        </button>
        {canGoBack && (
          <button onClick={onBack} data-testid="back-button">
            Back
          </button>
        )}
      </div>
    )
  }
})

jest.mock('../app/components/AgeSelection', () => {
  return function MockAgeSelection({ onNext, onBack, canGoBack, formData }: any) {
    return (
      <div data-testid="age-selection">
        <p>Current age: {formData?.age || 'none'}</p>
        <button onClick={() => onNext({ age: 25 })} data-testid="select-age">
          Select Age 25
        </button>
        {canGoBack && (
          <button onClick={onBack} data-testid="back-button">
            Back
          </button>
        )}
      </div>
    )
  }
})

jest.mock('../app/components/UsernameSelection', () => {
  return function MockUsernameSelection({ onNext, onBack, canGoBack, formData }: any) {
    return (
      <div data-testid="username-selection">
        <p>Current username: {formData?.username || 'none'}</p>
        <button onClick={() => onNext({ username: 'testuser' })} data-testid="select-username">
          Select Username
        </button>
        {canGoBack && (
          <button onClick={onBack} data-testid="back-button">
            Back
          </button>
        )}
      </div>
    )
  }
})

jest.mock('../app/components/PreferencesSelection', () => {
  return function MockPreferencesSelection({ onNext, onBack, canGoBack, formData }: any) {
    return (
      <div data-testid="preferences-selection">
        <p>Current preferences: {formData?.preferences?.join(', ') || 'none'}</p>
        <button onClick={() => onNext({ preferences: ['movies', 'music'] })} data-testid="select-preferences">
          Select Preferences
        </button>
        {canGoBack && (
          <button onClick={onBack} data-testid="back-button">
            Back
          </button>
        )}
      </div>
    )
  }
})

jest.mock('../app/components/ChatLobby', () => {
  return function MockChatLobby({ formData, onBack }: any) {
    return (
      <div data-testid="chat-lobby">
        <h1>Chat Lobby</h1>
        <p>User: {formData?.username}</p>
        <button onClick={onBack} data-testid="back-to-onboarding">
          Back to Onboarding
        </button>
      </div>
    )
  }
})

const mockUser = {
  uid: 'test-uid',
  isAnonymous: true,
  email: null,
  displayName: null,
  photoURL: null,
}

const mockUserProfile = {
  uid: 'test-uid',
  gender: 'male',
  age: 18,
  username: 'user_123',
  preferences: [],
  isAnonymous: true,
  createdAt: new Date(),
  lastActive: new Date(),
}

const mockCompleteProfile = {
  uid: 'test-uid',
  gender: 'female',
  age: 25,
  username: 'testuser',
  preferences: ['movies', 'music'],
  isAnonymous: true,
  createdAt: new Date(),
  lastActive: new Date(),
}

describe('Onboarding Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Mock Firebase Auth functions
    const mockSignInAnonymously = jest.fn().mockResolvedValue({ user: mockUser })
    const mockSetDoc = jest.fn().mockResolvedValue(undefined)
    const mockGetDoc = jest.fn().mockResolvedValue({
      exists: () => false,
      data: () => null,
    })
    
    ;(firebaseAuth.signInAnonymously as jest.Mock).mockImplementation(mockSignInAnonymously)
    ;(firebaseFirestore.setDoc as jest.Mock).mockImplementation(mockSetDoc)
    ;(firebaseFirestore.getDoc as jest.Mock).mockImplementation(mockGetDoc)
    ;(firebaseFirestore.Timestamp.now as jest.Mock).mockReturnValue({ toDate: () => new Date() })
  })

  describe('Anonymous Authentication Flow', () => {
    it('should automatically sign in anonymously when no user exists', async () => {
      const mockOnAuthStateChanged = jest.fn((auth, callback) => {
        // Simulate no user initially, then anonymous sign-in
        setTimeout(() => callback(null), 0)
        setTimeout(() => callback(mockUser), 50)
        return jest.fn() // unsubscribe function
      })
      ;(firebaseAuth.onAuthStateChanged as jest.Mock).mockImplementation(mockOnAuthStateChanged)

      render(
        <AuthProvider>
          <OnboardingPage />
        </AuthProvider>
      )

      // Should show loading initially
      expect(screen.getByText(/Setting up your session|Initializing/)).toBeInTheDocument()

      // Wait for anonymous sign-in to complete
      await waitFor(() => {
        expect(firebaseAuth.signInAnonymously).toHaveBeenCalled()
      }, { timeout: 3000 })
    })

    it('should handle authentication failure gracefully', async () => {
      const mockSignInAnonymously = jest.fn().mockRejectedValue(new Error('Auth failed'))
      ;(firebaseAuth.signInAnonymously as jest.Mock).mockImplementation(mockSignInAnonymously)

      const mockOnAuthStateChanged = jest.fn((auth, callback) => {
        setTimeout(() => callback(null), 0)
        return jest.fn()
      })
      ;(firebaseAuth.onAuthStateChanged as jest.Mock).mockImplementation(mockOnAuthStateChanged)

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      render(
        <AuthProvider>
          <OnboardingPage />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByText('Authentication failed. Please try again.')).toBeInTheDocument()
        expect(screen.getByText('Retry')).toBeInTheDocument()
      })

      consoleSpy.mockRestore()
    })
  })

  describe('Step Navigation', () => {
    it('should start with gender selection step', async () => {
      const mockOnAuthStateChanged = jest.fn((auth, callback) => {
        setTimeout(() => callback(mockUser), 0)
        return jest.fn()
      })
      ;(firebaseAuth.onAuthStateChanged as jest.Mock).mockImplementation(mockOnAuthStateChanged)

      render(
        <AuthProvider>
          <OnboardingPage />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('gender-selection')).toBeInTheDocument()
      })
    })

    it('should navigate through all onboarding steps', async () => {
      const user = userEvent.setup()
      
      const mockOnAuthStateChanged = jest.fn((auth, callback) => {
        setTimeout(() => callback(mockUser), 0)
        return jest.fn()
      })
      ;(firebaseAuth.onAuthStateChanged as jest.Mock).mockImplementation(mockOnAuthStateChanged)

      render(
        <AuthProvider>
          <OnboardingPage />
        </AuthProvider>
      )

      // Step 1: Gender Selection
      await waitFor(() => {
        expect(screen.getByTestId('gender-selection')).toBeInTheDocument()
      })

      await act(async () => {
        await user.click(screen.getByTestId('select-female'))
      })

      // Step 2: Age Selection
      await waitFor(() => {
        expect(screen.getByTestId('age-selection')).toBeInTheDocument()
      })

      await act(async () => {
        await user.click(screen.getByTestId('select-age'))
      })

      // Step 3: Username Selection
      await waitFor(() => {
        expect(screen.getByTestId('username-selection')).toBeInTheDocument()
      })

      await act(async () => {
        await user.click(screen.getByTestId('select-username'))
      })

      // Step 4: Preferences Selection
      await waitFor(() => {
        expect(screen.getByTestId('preferences-selection')).toBeInTheDocument()
      })

      await act(async () => {
        await user.click(screen.getByTestId('select-preferences'))
      })

      // Should navigate to Chat Lobby after completing all steps
      await waitFor(() => {
        expect(screen.getByTestId('chat-lobby')).toBeInTheDocument()
      })
    })

    it('should allow going back through steps', async () => {
      const user = userEvent.setup()
      
      const mockOnAuthStateChanged = jest.fn((auth, callback) => {
        setTimeout(() => callback(mockUser), 0)
        return jest.fn()
      })
      ;(firebaseAuth.onAuthStateChanged as jest.Mock).mockImplementation(mockOnAuthStateChanged)

      render(
        <AuthProvider>
          <OnboardingPage />
        </AuthProvider>
      )

      // Navigate to age selection
      await waitFor(() => {
        expect(screen.getByTestId('gender-selection')).toBeInTheDocument()
      })

      await act(async () => {
        await user.click(screen.getByTestId('select-female'))
      })

      await waitFor(() => {
        expect(screen.getByTestId('age-selection')).toBeInTheDocument()
      })

      // Go back to gender selection
      await act(async () => {
        await user.click(screen.getByTestId('back-button'))
      })

      await waitFor(() => {
        expect(screen.getByTestId('gender-selection')).toBeInTheDocument()
      })
    })
  })

  describe('Data Persistence', () => {
    it('should update Firebase profile after each step', async () => {
      const user = userEvent.setup()
      
      const mockOnAuthStateChanged = jest.fn((auth, callback) => {
        setTimeout(() => callback(mockUser), 0)
        return jest.fn()
      })
      ;(firebaseAuth.onAuthStateChanged as jest.Mock).mockImplementation(mockOnAuthStateChanged)

      render(
        <AuthProvider>
          <OnboardingPage />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('gender-selection')).toBeInTheDocument()
      })

      await act(async () => {
        await user.click(screen.getByTestId('select-female'))
      })

      await waitFor(() => {
        expect(firebaseFirestore.setDoc).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            gender: 'female',
          }),
          { merge: true }
        )
      })
    })

    it('should preserve form data across steps', async () => {
      const user = userEvent.setup()
      
      const mockOnAuthStateChanged = jest.fn((auth, callback) => {
        setTimeout(() => callback(mockUser), 0)
        return jest.fn()
      })
      ;(firebaseAuth.onAuthStateChanged as jest.Mock).mockImplementation(mockOnAuthStateChanged)

      render(
        <AuthProvider>
          <OnboardingPage />
        </AuthProvider>
      )

      // Select gender
      await waitFor(() => {
        expect(screen.getByTestId('gender-selection')).toBeInTheDocument()
      })

      await act(async () => {
        await user.click(screen.getByTestId('select-female'))
      })

      // Select age
      await waitFor(() => {
        expect(screen.getByTestId('age-selection')).toBeInTheDocument()
      })

      await act(async () => {
        await user.click(screen.getByTestId('select-age'))
      })

      // Go back to age selection and verify data is preserved
      await waitFor(() => {
        expect(screen.getByTestId('username-selection')).toBeInTheDocument()
      })

      await act(async () => {
        await user.click(screen.getByTestId('back-button'))
      })

      await waitFor(() => {
        expect(screen.getByTestId('age-selection')).toBeInTheDocument()
        expect(screen.getByText('Current age: 25')).toBeInTheDocument()
      })
    })
  })

  describe('Profile Loading', () => {
    it('should load existing profile and determine correct step', async () => {
      const mockOnAuthStateChanged = jest.fn((auth, callback) => {
        setTimeout(() => callback(mockUser), 0)
        return jest.fn()
      })
      ;(firebaseAuth.onAuthStateChanged as jest.Mock).mockImplementation(mockOnAuthStateChanged)

      // Mock existing profile with partial data
      const mockGetDoc = jest.fn().mockResolvedValue({
        exists: () => true,
        data: () => ({
          gender: 'female',
          age: 25,
          username: 'user_123', // Generated username indicates incomplete
          preferences: [],
        }),
      })
      ;(firebaseFirestore.getDoc as jest.Mock).mockImplementation(mockGetDoc)

      render(
        <AuthProvider>
          <OnboardingPage />
        </AuthProvider>
      )

      // Should start at username step since gender and age are complete but username is generated
      await waitFor(() => {
        expect(screen.getByTestId('username-selection')).toBeInTheDocument()
        expect(screen.getByText('Current username: user_123')).toBeInTheDocument()
      })
    })

    it('should go directly to chat lobby if profile is complete', async () => {
      const mockOnAuthStateChanged = jest.fn((auth, callback) => {
        setTimeout(() => callback(mockUser), 0)
        return jest.fn()
      })
      ;(firebaseAuth.onAuthStateChanged as jest.Mock).mockImplementation(mockOnAuthStateChanged)

      // Mock complete profile
      const mockGetDoc = jest.fn().mockResolvedValue({
        exists: () => true,
        data: () => mockCompleteProfile,
      })
      ;(firebaseFirestore.getDoc as jest.Mock).mockImplementation(mockGetDoc)

      render(
        <AuthProvider>
          <OnboardingPage />
        </AuthProvider>
      )

      // Should go directly to chat lobby
      await waitFor(() => {
        expect(screen.getByTestId('chat-lobby')).toBeInTheDocument()
        expect(screen.getByText('User: testuser')).toBeInTheDocument()
      })
    })
  })

  describe('Chat Lobby Navigation', () => {
    it('should allow going back to onboarding from chat lobby', async () => {
      const user = userEvent.setup()
      
      const mockOnAuthStateChanged = jest.fn((auth, callback) => {
        setTimeout(() => callback(mockUser), 0)
        return jest.fn()
      })
      ;(firebaseAuth.onAuthStateChanged as jest.Mock).mockImplementation(mockOnAuthStateChanged)

      // Mock complete profile
      const mockGetDoc = jest.fn().mockResolvedValue({
        exists: () => true,
        data: () => mockCompleteProfile,
      })
      ;(firebaseFirestore.getDoc as jest.Mock).mockImplementation(mockGetDoc)

      render(
        <AuthProvider>
          <OnboardingPage />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('chat-lobby')).toBeInTheDocument()
      })

      // Go back to onboarding
      await act(async () => {
        await user.click(screen.getByTestId('back-to-onboarding'))
      })

      await waitFor(() => {
        expect(screen.getByTestId('preferences-selection')).toBeInTheDocument()
      })
    })
  })

  describe('Progress Tracking', () => {
    it('should show progress indicator for current step', async () => {
      const mockOnAuthStateChanged = jest.fn((auth, callback) => {
        setTimeout(() => callback(mockUser), 0)
        return jest.fn()
      })
      ;(firebaseAuth.onAuthStateChanged as jest.Mock).mockImplementation(mockOnAuthStateChanged)

      render(
        <AuthProvider>
          <OnboardingPage />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('gender-selection')).toBeInTheDocument()
      })

      // Check for progress bar (should be at 25% for step 1 of 4)
      const progressBars = document.querySelectorAll('[class*="bg-gradient-to-r"]')
      expect(progressBars.length).toBeGreaterThan(0)
    })
  })

  describe('Error Handling', () => {
    it('should handle Firebase errors during profile updates', async () => {
      const user = userEvent.setup()
      
      const mockOnAuthStateChanged = jest.fn((auth, callback) => {
        setTimeout(() => callback(mockUser), 0)
        return jest.fn()
      })
      ;(firebaseAuth.onAuthStateChanged as jest.Mock).mockImplementation(mockOnAuthStateChanged)

      // Mock Firebase error
      const mockSetDoc = jest.fn().mockRejectedValue(new Error('Firebase error'))
      ;(firebaseFirestore.setDoc as jest.Mock).mockImplementation(mockSetDoc)

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      render(
        <AuthProvider>
          <OnboardingPage />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('gender-selection')).toBeInTheDocument()
      })

      await act(async () => {
        await user.click(screen.getByTestId('select-female'))
      })

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error updating profile:', expect.any(Error))
      })

      consoleSpy.mockRestore()
    })
  })
})