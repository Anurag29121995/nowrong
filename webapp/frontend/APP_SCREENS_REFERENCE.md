# NoWrong App - Screens & Components Reference Guide

## 📱 **MAIN PAGES (Full Screens)**

### 1. **Homepage / Landing Page**
- **File**: `src/app/page.tsx`
- **Route**: `/`
- **Purpose**: First screen users see - authentication entry point
- **Features**:
  - Anonymous sign-in button ("Browse as Guest")
  - Google sign-in button ("Continue with Google")
  - App branding and welcome message
- **User Flow**:
  - New users → Choose authentication method
  - Existing users → Auto-login if session exists

### 2. **Onboarding Page**
- **File**: `src/app/onboarding/page.tsx`
- **Route**: `/onboarding`
- **Purpose**: Multi-step profile creation for new users
- **Features**:
  - Gender selection step
  - Age selection step
  - Preferences selection step
  - Username creation step
- **User Flow**: Anonymous users complete → redirect to app

### 3. **Profile Setup Page**
- **File**: `src/app/profile-setup/page.tsx`
- **Route**: `/profile-setup`
- **Purpose**: Google OAuth users complete their profile
- **Features**:
  - Similar to onboarding but for Google users
  - Pre-fills email, name, photo from Google account
  - Collects gender, age, username, preferences
- **User Flow**: New Google users → Complete profile → Enter app

---

## 🧩 **MAIN COMPONENTS (Embedded Screens)**

### 4. **Chat Lobby**
- **File**: `src/app/components/ChatLobby.tsx`
- **Purpose**: Main chat screen showing available chat rooms
- **Features**:
  - List of active chat rooms
  - Create new room button
  - Join existing rooms
  - Google sign-in option (for anonymous users)
  - Logout button
- **Access**: After authentication and profile creation

### 5. **Chat Room**
- **File**: `src/app/components/ChatRoom.tsx`
- **Purpose**: Active chat interface within a specific room
- **Features**:
  - Real-time message feed
  - Message input and send
  - User list (participants)
  - Leave room button
  - Google sign-in option (for anonymous users)
- **Access**: Click on a room in Chat Lobby

### 6. **Profile Screen**
- **File**: `src/app/components/ProfileScreen.tsx`
- **Purpose**: User's own profile view and editing
- **Features**:
  - Display user info (username, age, gender, preferences)
  - Edit profile button
  - View posted content
  - Settings and preferences
- **Access**: Profile icon/button in navigation

### 7. **Posts Feed**
- **File**: `src/app/components/PostsFeed.tsx`
- **Purpose**: Social feed showing user posts
- **Features**:
  - Create new post
  - View all posts from users
  - Like/unlike posts
  - Comment on posts
  - Delete own posts
- **Access**: Main navigation tab

### 8. **Chat Interface**
- **File**: `src/app/components/ChatInterface.tsx`
- **Purpose**: Reusable chat message display component
- **Features**:
  - Message list rendering
  - Real-time updates
  - Scroll to bottom
  - Message timestamps
- **Usage**: Used within ChatRoom component

---

## 🔲 **MODALS (Popup Dialogs)**

### 9. **Account Conflict Modal**
- **File**: `src/app/components/AccountConflictModal.tsx`
- **Purpose**: Alert when Google account already has a profile
- **Features**:
  - Shows existing username associated with email
  - "Switch to Account" button → logs into existing profile
  - "Cancel" button → returns to previous screen
- **Trigger**: Google sign-in with existing email from anonymous session

### 10. **Confirmation Modal**
- **File**: `src/app/components/ConfirmationModal.tsx`
- **Purpose**: Generic confirmation dialog for actions
- **Features**:
  - Custom title and message
  - Confirm/Cancel buttons
  - Callback on confirmation
- **Usage**: Delete posts, leave rooms, logout confirmations

---

## 🎨 **FORM COMPONENTS (Onboarding Steps)**

### 11. **Gender Selection**
- **File**: `src/app/components/GenderSelection.tsx`
- **Purpose**: Gender selection step in onboarding
- **Options**: Male, Female, Other
- **Usage**: Step 1 in onboarding flow

### 12. **Age Selection**
- **File**: `src/app/components/AgeSelection.tsx`
- **Purpose**: Age input step in onboarding
- **Features**: Number input with validation (18+)
- **Usage**: Step 2 in onboarding flow

### 13. **Preferences Selection**
- **File**: `src/app/components/PreferencesSelection.tsx`
- **Purpose**: Interest/preference selection
- **Features**: Multi-select checkboxes for interests
- **Usage**: Step 3 in onboarding flow

### 14. **Username Selection**
- **File**: `src/app/components/UsernameSelection.tsx`
- **Purpose**: Username creation step
- **Features**:
  - Text input for username
  - Real-time validation
  - Uniqueness check
- **Usage**: Step 4 (final) in onboarding flow

---

## 🖼️ **UTILITY COMPONENTS**

### 15. **Avatar Component**
- **File**: `src/app/components/Avatar.tsx`
- **Purpose**: User avatar/profile picture display
- **Features**:
  - Shows Google photo if available
  - Default avatar for anonymous users
  - Size variants (small, medium, large)
- **Usage**: Throughout app (chat, profiles, posts)

### 16. **Profile Viewer**
- **File**: `src/app/components/ProfileViewer.tsx`
- **Purpose**: View other users' profiles
- **Features**:
  - Display user details
  - View user posts
  - Interaction buttons (like, message, etc.)
- **Access**: Click on username in chat/posts

### 17. **Profile Creation**
- **File**: `src/app/components/ProfileCreation.tsx`
- **Purpose**: Wrapper component for profile setup flow
- **Features**: Manages multi-step profile creation
- **Usage**: Used in onboarding and profile-setup pages

### 18. **Google Sign-In Button**
- **File**: `src/app/components/GoogleSignInButton.tsx`
- **Purpose**: Reusable Google OAuth button
- **Features**:
  - Google branding
  - Loading states
  - Error handling
- **Usage**: Homepage, ChatLobby, ChatRoom

---

## 📊 **SCREEN FLOW DIAGRAM**

```
Homepage (/)
├─ Browse as Guest → Onboarding (/onboarding) → Chat Lobby
└─ Continue with Google → Profile Setup (/profile-setup) → Chat Lobby

Chat Lobby
├─ Join Room → Chat Room
├─ View Profile → Profile Screen
├─ View Feed → Posts Feed
└─ Logout → Homepage

Chat Room
├─ Send Messages
├─ View Profile → Profile Viewer
└─ Leave Room → Chat Lobby
```

---

## 🎯 **QUICK REFERENCE BY USER ACTION**

| **User Wants To...** | **Component/Page** | **Route/File** |
|----------------------|-------------------|----------------|
| Start using app | Homepage | `/` |
| Sign up anonymously | Onboarding Page | `/onboarding` |
| Sign up with Google | Profile Setup Page | `/profile-setup` |
| Chat with others | Chat Lobby → Chat Room | `ChatLobby.tsx` → `ChatRoom.tsx` |
| Post updates | Posts Feed | `PostsFeed.tsx` |
| View their profile | Profile Screen | `ProfileScreen.tsx` |
| View others' profile | Profile Viewer | `ProfileViewer.tsx` |
| Upgrade anonymous account | Account Conflict Modal | `AccountConflictModal.tsx` |
| Confirm an action | Confirmation Modal | `ConfirmationModal.tsx` |

---

## 📝 **GOOGLE OAUTH DATA FETCHED**

### Currently Fetched from Google Account:
✅ **Email** - User's Google email
✅ **Display Name** - Full name from Google
✅ **Photo URL** - Google profile picture
✅ **Phone Number** - If available on Google account (optional)

### NOT Automatically Fetched (User Must Provide):
❌ **Age/Birthday** - Requires separate Google People API call
❌ **Gender** - Requires separate Google People API call
❌ **Preferences** - App-specific data
❌ **Username** - App-specific identifier

**Note**: Firebase Auth provides limited Google data. For age/gender, users must:
1. Manually input during profile setup, OR
2. Implement Google People API separately (requires additional OAuth scopes and API setup)

**Current Implementation**: Google users provide age, gender, username, and preferences during profile setup step (`/profile-setup`).

---

## 🔄 **AUTHENTICATION STATES**

| State | Screen Shown | Actions Available |
|-------|--------------|-------------------|
| Not Logged In | Homepage (`/`) | Sign in anonymously or with Google |
| Anonymous (No Profile) | Onboarding (`/onboarding`) | Complete profile creation |
| Google (No Profile) | Profile Setup (`/profile-setup`) | Complete profile creation |
| Authenticated + Profile | Chat Lobby | Access all features |

---

**Last Updated**: 2025-10-08
**App Version**: Production-Ready
**Total Components**: 18 screens/components + 2 modals
