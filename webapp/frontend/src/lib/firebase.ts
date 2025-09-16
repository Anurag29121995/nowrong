import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app'
import { 
  getAuth, 
  Auth,
  GoogleAuthProvider,
  connectAuthEmulator,
  AuthError
} from 'firebase/auth'
import { 
  getFirestore, 
  Firestore,
  connectFirestoreEmulator,
  FirestoreError
} from 'firebase/firestore'
import { getStorage, FirebaseStorage, connectStorageEmulator } from 'firebase/storage'
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics'

// Firebase configuration interface
interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId?: string
}

// Get Firebase configuration from environment variables
const getFirebaseConfig = (): FirebaseConfig => {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  }

  // Validate required fields
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId']
  for (const field of requiredFields) {
    if (!config[field as keyof FirebaseConfig]) {
      throw new Error(`Missing required Firebase configuration: ${field}`)
    }
  }

  return config
}

// Initialize Firebase app
let firebaseApp: FirebaseApp | null = null

const initializeFirebaseApp = (): FirebaseApp => {
  if (firebaseApp) return firebaseApp

  try {
    const config = getFirebaseConfig()
    firebaseApp = getApps().length === 0 ? initializeApp(config) : getApp()
    return firebaseApp
  } catch (error) {
    // Failed to initialize Firebase - rethrowing error
    throw error
  }
}

// Initialize Firebase services
let auth: Auth | null = null
let firestore: Firestore | null = null
let storage: FirebaseStorage | null = null
let analytics: Analytics | null = null
let googleProvider: GoogleAuthProvider | null = null

// Initialize Auth service
export const initAuth = (): Auth => {
  if (auth) return auth

  try {
    const app = initializeFirebaseApp()
    auth = getAuth(app)

    // Setup Google provider
    googleProvider = new GoogleAuthProvider()
    googleProvider.addScope('email')
    googleProvider.addScope('profile')
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    })

    // Connect to emulator in development
    if (typeof window !== 'undefined' && 
        process.env.NODE_ENV === 'development' && 
        process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true') {
      try {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
      } catch (error) {
        // Emulator connection failed - continue without emulator
      }
    }

    return auth
  } catch (error) {
    throw error
  }
}

// Initialize Firestore service
export const initFirestore = (): Firestore => {
  if (firestore) return firestore

  try {
    const app = initializeFirebaseApp()
    firestore = getFirestore(app)

    // Connect to emulator in development
    if (typeof window !== 'undefined' && 
        process.env.NODE_ENV === 'development' && 
        process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true') {
      try {
        connectFirestoreEmulator(firestore, 'localhost', 8080)
      } catch (error) {
        // Emulator connection failed - continue without emulator
      }
    }

    return firestore
  } catch (error) {
    throw error
  }
}

// Initialize Storage service
export const initStorage = (): FirebaseStorage => {
  if (storage) return storage

  try {
    const app = initializeFirebaseApp()
    storage = getStorage(app)

    // Connect to emulator in development
    if (typeof window !== 'undefined' && 
        process.env.NODE_ENV === 'development' && 
        process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true') {
      try {
        connectStorageEmulator(storage, 'localhost', 9199)
      } catch (error) {
        // Emulator connection failed - continue without emulator
      }
    }

    return storage
  } catch (error) {
    throw error
  }
}

// Initialize Analytics service (browser only)
export const initAnalytics = async (): Promise<Analytics | null> => {
  if (analytics) return analytics

  try {
    if (typeof window === 'undefined') return null

    const supported = await isSupported()
    if (!supported) return null

    const app = initializeFirebaseApp()
    analytics = getAnalytics(app)
    
    return analytics
  } catch (error) {
    return null
  }
}

// Getter functions
export const getFirebaseAuth = (): Auth => {
  return initAuth()
}

export const getFirebaseFirestore = (): Firestore => {
  return initFirestore()
}

export const getFirebaseStorage = (): FirebaseStorage => {
  return initStorage()
}

export const getGoogleAuthProvider = (): GoogleAuthProvider => {
  if (!googleProvider) {
    initAuth() // This will initialize the provider
  }
  return googleProvider!
}

export const getFirebaseApp = (): FirebaseApp => {
  return initializeFirebaseApp()
}

export const getFirebaseAnalytics = (): Analytics | null => {
  return analytics
}

// Error type guards
export const isAuthError = (error: any): error is AuthError => {
  return error?.code && error.code.startsWith('auth/')
}

export const isFirestoreError = (error: any): error is FirestoreError => {
  return error?.code && (
    error.code.startsWith('firestore/') || 
    error.code.startsWith('permission-denied') ||
    error.code.startsWith('not-found') ||
    error.code.startsWith('unauthenticated')
  )
}


// Initialize services on client side
if (typeof window !== 'undefined') {
  initAuth()
  initFirestore()
  initStorage()
  initAnalytics()
}

export default getFirebaseApp()