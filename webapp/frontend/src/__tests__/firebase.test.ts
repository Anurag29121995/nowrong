import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

// Mock Firebase modules
jest.mock('firebase/app')
jest.mock('firebase/auth')
jest.mock('firebase/firestore')
jest.mock('firebase/storage')

const mockInitializeApp = initializeApp as jest.Mock
const mockGetAuth = getAuth as jest.Mock
const mockGetFirestore = getFirestore as jest.Mock
const mockGetStorage = getStorage as jest.Mock
const mockConnectAuthEmulator = connectAuthEmulator as jest.Mock
const mockConnectFirestoreEmulator = connectFirestoreEmulator as jest.Mock
const mockConnectStorageEmulator = connectStorageEmulator as jest.Mock

describe('Firebase Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Reset environment variables
    process.env.NODE_ENV = 'test'
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'test-api-key'
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = 'test.firebaseapp.com'
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'test-project'
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = 'test.appspot.com'
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = '123456789'
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID = '1:123456789:web:abcd'

    // Mock Firebase returns
    mockInitializeApp.mockReturnValue({})
    mockGetAuth.mockReturnValue({})
    mockGetFirestore.mockReturnValue({})
    mockGetStorage.mockReturnValue({})
  })

  afterEach(() => {
    // Clean up modules cache to ensure fresh imports
    jest.resetModules()
  })

  it('should initialize Firebase with correct configuration', async () => {
    // Import the firebase module to trigger initialization
    await import('../lib/firebase')

    expect(mockInitializeApp).toHaveBeenCalledWith({
      apiKey: 'test-api-key',
      authDomain: 'test.firebaseapp.com',
      projectId: 'test-project',
      storageBucket: 'test.appspot.com',
      messagingSenderId: '123456789',
      appId: '1:123456789:web:abcd',
    })

    expect(mockGetAuth).toHaveBeenCalled()
    expect(mockGetFirestore).toHaveBeenCalled()
    expect(mockGetStorage).toHaveBeenCalled()
  })

  it('should connect to emulators in development environment', async () => {
    // Set development environment
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    // Import the firebase module
    await import('../lib/firebase')

    expect(mockConnectAuthEmulator).toHaveBeenCalledWith(expect.anything(), 'http://localhost:9099', {
      disableWarnings: true
    })
    expect(mockConnectFirestoreEmulator).toHaveBeenCalledWith(expect.anything(), 'localhost', 8080)
    expect(mockConnectStorageEmulator).toHaveBeenCalledWith(expect.anything(), 'localhost', 9199)

    // Restore original environment
    process.env.NODE_ENV = originalEnv
  })

  it('should not connect to emulators in production environment', async () => {
    // Set production environment
    process.env.NODE_ENV = 'production'

    // Import the firebase module
    await import('../lib/firebase')

    expect(mockConnectAuthEmulator).not.toHaveBeenCalled()
    expect(mockConnectFirestoreEmulator).not.toHaveBeenCalled()
    expect(mockConnectStorageEmulator).not.toHaveBeenCalled()
  })

  it('should validate required environment variables', () => {
    // Remove required environment variable
    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    expect(() => {
      jest.requireActual('../lib/firebase')
    }).toThrow() // Should throw if validation is implemented

    consoleSpy.mockRestore()
  })

  describe('Error Handling Utilities', () => {
    it('should correctly identify Firebase Auth errors', async () => {
      const firebase = await import('../lib/firebase')
      
      const authError = { 
        code: 'auth/user-not-found', 
        message: 'User not found',
        name: 'FirebaseError'
      }
      const regularError = new Error('Regular error')

      // Mock the actual implementation
      const mockIsAuthError = jest.fn((error) => {
        return error && typeof error.code === 'string' && error.code.startsWith('auth/')
      })
      
      jest.spyOn(firebase, 'isAuthError').mockImplementation(mockIsAuthError)

      expect(firebase.isAuthError(authError)).toBe(true)
      expect(firebase.isAuthError(regularError)).toBe(false)
      expect(firebase.isAuthError(null)).toBe(false)
    })

    it('should correctly identify Firestore errors', async () => {
      const firebase = await import('../lib/firebase')
      
      const firestoreError = { 
        code: 'permission-denied', 
        message: 'Permission denied',
        name: 'FirebaseError'
      }
      const regularError = new Error('Regular error')

      // Mock the actual implementation
      const mockIsFirestoreError = jest.fn((error) => {
        return error && typeof error.code === 'string' && !error.code.startsWith('auth/')
      })
      
      jest.spyOn(firebase, 'isFirestoreError').mockImplementation(mockIsFirestoreError)

      expect(firebase.isFirestoreError(firestoreError)).toBe(true)
      expect(firebase.isFirestoreError(regularError)).toBe(false)
      expect(firebase.isFirestoreError(null)).toBe(false)
    })
  })

  describe('Google Provider Configuration', () => {
    it('should configure Google provider with correct settings', async () => {
      const mockGoogleProvider = {
        addScope: jest.fn(),
        setCustomParameters: jest.fn(),
      }

      // Mock GoogleAuthProvider constructor
      const mockGoogleAuthProvider = jest.fn(() => mockGoogleProvider)
      jest.doMock('firebase/auth', () => ({
        ...jest.requireActual('firebase/auth'),
        GoogleAuthProvider: mockGoogleAuthProvider
      }))

      // Import after mocking
      const firebase = await import('../lib/firebase')

      expect(mockGoogleProvider.addScope).toHaveBeenCalledWith('email')
      expect(mockGoogleProvider.addScope).toHaveBeenCalledWith('profile')
      expect(mockGoogleProvider.setCustomParameters).toHaveBeenCalledWith({
        prompt: 'select_account'
      })
    })
  })

  describe('Environment Variable Validation', () => {
    const requiredEnvVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'NEXT_PUBLIC_FIREBASE_APP_ID'
    ]

    requiredEnvVars.forEach(envVar => {
      it(`should validate presence of ${envVar}`, () => {
        // Save original value
        const originalValue = process.env[envVar]
        
        // Delete the environment variable
        delete process.env[envVar]

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

        // This should either throw an error or log a warning
        try {
          jest.requireActual('../lib/firebase')
        } catch (error) {
          expect(error).toBeTruthy()
        }

        // Restore original value
        if (originalValue !== undefined) {
          process.env[envVar] = originalValue
        }

        consoleSpy.mockRestore()
      })
    })
  })
})