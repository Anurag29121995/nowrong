import { Timestamp } from 'firebase/firestore'
import { User as FirebaseUser } from 'firebase/auth'

// Base types
export type FirestoreTimestamp = Timestamp | Date

// User Profile Types
export interface UserProfile {
  uid: string
  gender: 'male' | 'female' | 'other'
  age: number
  username: string
  preferences: string[]
  isAnonymous: boolean
  email?: string
  displayName?: string
  photoURL?: string
  createdAt: FirestoreTimestamp
  lastActive: FirestoreTimestamp
  // Additional profile fields
  location?: string
  bodyCount?: number
  bodyType?: string
  bodyTypePreference?: string
  secret?: string
  showSecret?: boolean
  avatar?: string
  moments?: string[] // URLs to uploaded photos
}

export interface OnboardingFormData {
  gender?: string
  age?: number
  interest?: string
  username?: string
  preferences?: string[]
  avatar?: string
}

// Extended User Profile (for detailed profile viewing)
export interface ExtendedUserProfile extends UserProfile {
  location?: string
  bodyCount?: number
  bodyType?: string
  secretMessage?: string
  moments?: string[] // URLs to uploaded photos
  turnOns?: string[]
  isOnline?: boolean
  lastSeen?: FirestoreTimestamp
}

// Chat & Message Types
export interface ChatMessage {
  id: string
  userId: string
  username: string
  message: string
  timestamp: FirestoreTimestamp
  type: 'text' | 'emoji' | 'system' | 'image' | 'video'
  editedAt?: FirestoreTimestamp
}

export interface ChatRoom {
  id: string
  name: string
  createdBy: string
  createdAt: FirestoreTimestamp
  updatedAt?: FirestoreTimestamp
  isActive: boolean
  participantCount?: number
  lastMessage?: ChatMessage
  lastMessageAt?: FirestoreTimestamp
}

// Private Message Types
export interface PrivateConversation {
  id: string
  participants: string[] // Array of user IDs
  createdAt: FirestoreTimestamp
  lastMessageAt: FirestoreTimestamp
  lastMessage?: string
  lastMessageBy?: string
  unreadCount?: { [userId: string]: number }
}

export interface PrivateMessage {
  id: string
  conversationId: string
  userId: string
  username: string
  message: string
  timestamp: FirestoreTimestamp
  readBy?: string[] // Array of user IDs who have read the message
  type: 'text' | 'image' | 'video' | 'audio'
  metadata?: {
    fileURL?: string
    fileName?: string
    fileSize?: number
    contentType?: string
  }
}

// Social Feed Types
export interface Post {
  id: string
  userId: string
  username: string
  content: string
  timestamp: FirestoreTimestamp
  likes: number
  likedBy?: string[] // Array of user IDs who liked the post
  commentCount?: number
  editedAt?: FirestoreTimestamp
  attachments?: PostAttachment[]
}

export interface PostAttachment {
  id: string
  type: 'image' | 'video'
  url: string
  thumbnailURL?: string
}

export interface Comment {
  id: string
  postId: string
  userId: string
  username: string
  content: string
  timestamp: FirestoreTimestamp
  likes: number
  likedBy?: string[]
  replyCount?: number
  editedAt?: FirestoreTimestamp
  parentCommentId?: string // For nested replies
}

// User Interaction Types
export type InteractionType = 'like' | 'match' | 'chat_request' | 'block' | 'report'

export interface UserInteraction {
  id: string
  fromUserId: string
  toUserId: string
  type: InteractionType
  timestamp: FirestoreTimestamp
  status?: 'pending' | 'accepted' | 'declined' | 'active'
  updatedAt?: FirestoreTimestamp
  metadata?: {
    reason?: string // For blocks/reports
    message?: string // For chat requests
  }
}

// File Upload Types
export interface FileMetadata {
  uploadedBy: string
  uploadedAt: FirestoreTimestamp
  fileName: string
  fileSize: number
  contentType: string
  downloadURL: string
  thumbnailURL?: string
}

export interface UserMoment {
  id: string
  userId: string
  fileMetadata: FileMetadata
  caption?: string
  isPublic: boolean
  createdAt: FirestoreTimestamp
}

// Authentication Context Types
export interface AuthContextType {
  user: FirebaseUser | null
  userProfile: UserProfile | null
  loading: boolean
  signInAnonymously: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  createUserProfile: (profileData: { gender: string; age: number; username: string; preferences: string[]; [key: string]: any }) => Promise<void>
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>
  upgradeToGoogleUser: (profileData?: { [key: string]: any }) => Promise<{ conflictData?: { username: string }, isNewUser?: boolean }>
  switchToExistingGoogleAccount: (email: string) => Promise<void>
  signOut: () => Promise<void>
  isGoogleUser: () => boolean
  isAnonymousUser: () => boolean
  shouldShowGoogleLogin: () => boolean
}

// API Response Types
export interface FirebaseError {
  code: string
  message: string
  name: string
  stack?: string
}

export interface AuthResult {
  success: boolean
  user?: FirebaseUser
  profile?: UserProfile
  error?: FirebaseError
}

export interface ProfileUpdateResult {
  success: boolean
  profile?: UserProfile
  error?: FirebaseError
}

// Real-time Update Types
export interface UserPresence {
  userId: string
  isOnline: boolean
  lastSeen: FirestoreTimestamp
}

export interface TypingIndicator {
  userId: string
  username: string
  isTyping: boolean
  timestamp: FirestoreTimestamp
}

// Search and Filter Types
export interface UserSearchFilters {
  gender?: 'male' | 'female' | 'other'
  ageMin?: number
  ageMax?: number
  preferences?: string[]
  location?: string
  isOnline?: boolean
  excludeBlocked?: boolean
}

export interface MessageSearchResult {
  messageId: string
  conversationId: string
  userId: string
  username: string
  content: string
  timestamp: FirestoreTimestamp
  snippet: string
}

// Analytics & Metrics Types
export interface UserAnalytics {
  userId: string
  profileViews: number
  messagesReceived: number
  messagesSent: number
  likesReceived: number
  likesGiven: number
  matchesCount: number
  lastUpdated: FirestoreTimestamp
}

// Cleanup & Maintenance Types
export interface CleanupTask {
  id: string
  type: 'anonymous_cleanup' | 'inactive_user_cleanup' | 'old_message_cleanup'
  targetUserId?: string
  scheduledFor: FirestoreTimestamp
  status: 'pending' | 'running' | 'completed' | 'failed'
  createdAt: FirestoreTimestamp
  completedAt?: FirestoreTimestamp
  error?: string
}

// Validation Types
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings?: string[]
}

// Utility Types
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// Export all types as a namespace for easier importing
export namespace Firebase {
  export type User = UserProfile
  export type ExtendedUser = ExtendedUserProfile  
  export type Message = ChatMessage
  export type Room = ChatRoom
  export type Conversation = PrivateConversation
  export type PrivateMsg = PrivateMessage
  export type SocialPost = Post
  export type PostComment = Comment
  export type Interaction = UserInteraction
  export type Moment = UserMoment
  export type AuthContext = AuthContextType
  export type Error = FirebaseError
  export type Presence = UserPresence
  export type Analytics = UserAnalytics
}