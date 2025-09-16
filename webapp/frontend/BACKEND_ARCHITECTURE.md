# NoWrong Webapp - Backend Architecture Documentation

## 🚀 System Overview

NoWrong is a modern chat application built with **Next.js 15.5.3**, **React 19.0.0**, and **Firebase** backend services. The application implements a sophisticated anonymous-first authentication flow where users can start chatting immediately and optionally upgrade to persistent Google accounts.

## 🏗️ Architecture Flow

### User Journey & Authentication States

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Homepage      │───▶│   Onboarding     │───▶│   Chat Lobby    │
│   (Start Chat)  │    │   (Anonymous)    │    │   (Anonymous)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │   Chat Rooms     │◀───│  Google Login   │
                       │   (Persistent)   │    │   (Optional)    │
                       └──────────────────┘    └─────────────────┘
```

## 🔥 Firebase Backend Services

### 1. Authentication System (`src/lib/firebase.ts`)

**Anonymous Authentication**
- Users automatically get anonymous Firebase auth on app start
- No registration required - immediate access to chat features
- Anonymous profile creation with generated username

**Google Authentication (Upgrade Path)**
- Optional Google sign-in for persistent accounts
- Profile migration from anonymous to authenticated
- Anonymous data cleanup on successful upgrade

**Key Features:**
- Lazy initialization with defensive configuration
- Environment variable validation
- Development emulator support
- Proxy-based backward compatibility

### 2. Firestore Database Structure

#### Collections & Security Rules

**`users` Collection:**
```typescript
interface UserProfile {
  uid: string
  email?: string | null
  displayName?: string | null  
  photoURL?: string | null
  username: string
  gender: 'male' | 'female' | 'other'
  age: number
  preferences: string[]
  isAnonymous: boolean
  createdAt: Timestamp
  lastActive: Timestamp
}
```

**Security Rules:**
- Users can only read/write their own profile data
- Age validation (18-100 years)
- Username format validation (3-20 characters, alphanumeric + underscore)
- Anonymous users have full profile access

**`chatRooms` Collection:**
```typescript
interface ChatRoom {
  id: string
  participants: string[]
  createdAt: Timestamp
  lastMessage?: string
  lastMessageAt?: Timestamp
}
```

**`messages` Collection:**
```typescript
interface Message {
  id: string
  chatRoomId: string
  senderId: string
  content: string
  createdAt: Timestamp
  type: 'text' | 'image' | 'file'
}
```

**`privateConversations` Collection:**
- Similar structure to chatRooms but for 1-on-1 conversations
- Enhanced privacy controls
- Message encryption support

### 3. Cloud Storage Rules

**User Profile Images:**
- Path: `users/{userId}/profile/{filename}`
- Size limit: 5MB
- Allowed formats: JPEG, PNG, GIF
- Only authenticated users can upload

**Chat Media:**
- Path: `chatRooms/{roomId}/media/{filename}` 
- Path: `privateChats/{chatId}/media/{filename}`
- Size limits: 10MB for images, 50MB for files
- Automatic cleanup for anonymous user uploads

## 🔄 Data Flow & State Management

### AuthContext (`src/contexts/AuthContext.tsx`)

**Core Responsibilities:**
- Firebase authentication state management
- User profile creation and updates  
- Anonymous to Google account migration
- Error handling and loading states

**Key Methods:**
```typescript
signInAnonymously() // Creates anonymous Firebase user + profile
signInWithGoogle()  // Upgrades to Google account with profile migration
updateUserProfile() // Updates user data in Firestore
deleteAnonymousData() // Cleanup on account upgrade
```

### Onboarding Flow (`src/app/onboarding/page.tsx`)

**Step-by-Step Process:**
1. **Anonymous Authentication** - Automatic on app start
2. **Gender Selection** - Required for chat matching
3. **Age Selection** - 18+ validation
4. **Username Selection** - Generated or custom
5. **Preferences Selection** - Interest-based matching
6. **Chat Lobby Access** - Full app features unlocked

**Profile Creation Logic:**
- Each onboarding step saves data to Firebase immediately
- Partial profiles are preserved across browser sessions
- Smart step detection based on existing profile data
- Form validation with TypeScript type safety

## 🎯 UI/UX Authentication States

### Header Components
**Anonymous State:**
- Shows "Login with Google" button
- Anonymous user indicator
- Profile access with limited features

**Authenticated State:**
- Hides login prompts
- Full profile features
- Persistent data across sessions

### Chat Features
**Anonymous Users:**
- Full chat functionality
- Profile viewing and creation
- Temporary data (deleted on browser close)

**Google Users:**
- All anonymous features +
- Persistent chat history
- Cross-device sync
- Enhanced profile features

## 🧪 Testing Strategy

### Unit Tests (`src/__tests__/`)

**AuthContext Tests:**
- Anonymous authentication flow
- Google login with profile migration
- Error handling scenarios
- Profile update operations

**Firebase Configuration Tests:**
- Environment variable handling
- Service initialization
- Connection validation
- Error recovery

**Onboarding Flow Tests:**
- Step navigation and validation
- Profile data persistence
- Form error handling
- Authentication state changes

**Component Tests:**
- UI state changes based on auth status
- Profile creation and editing
- Chat functionality
- Error boundary testing

## 🔧 Development Environment

### Firebase Emulators
```bash
# Authentication Emulator: localhost:9099  
# Firestore Emulator: localhost:8080
# Storage Emulator: localhost:9199
```

**Environment Variables:**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id  
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true # for development
```

## 🚦 Error Handling & Security

### Defensive Programming
- Graceful environment variable fallbacks
- Connection retry logic
- User-friendly error messages
- Comprehensive logging with emoji indicators

### Security Measures
- Firestore security rules validation
- File upload size and type restrictions
- User input sanitization
- Anonymous data cleanup protocols

### Performance Optimizations
- Lazy Firebase service initialization
- Proxy-based service access
- Code splitting for auth components
- Optimized bundle size with tree shaking

## 📱 Production Deployment

### Build Process
```bash
npm run build    # Production build with optimizations
npm run start    # Production server
npm run lint     # Code quality checks
npm run test     # Full test suite
```

### Firebase Project Setup
1. Create Firebase project with Authentication, Firestore, and Storage
2. Configure security rules for all services
3. Set up environment variables in production
4. Deploy Firestore indexes and rules

## 🔮 Future Enhancements

### Planned Features
- Real-time messaging with WebRTC
- Push notifications
- Advanced chat moderation
- Multi-language support
- AI-powered chat suggestions

### Technical Improvements
- Server-side rendering optimization
- Progressive Web App features
- Offline functionality
- Enhanced analytics integration

---

## 📊 Key Metrics & Monitoring

### Performance Targets
- First Contentful Paint: < 1.5s
- Time to Interactive: < 2.5s  
- Anonymous login: < 500ms
- Google authentication: < 2s
- Profile creation: < 1s

### Monitoring Stack
- Firebase Analytics for user behavior
- Firebase Performance for app metrics
- Console logging for development debugging
- Error boundary reporting for production issues

---

*This architecture supports seamless user onboarding while maintaining data security and optimal performance across all user states.*