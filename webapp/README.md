# NoWrong Webapp - Real-time Anonymous Chat Platform

## Overview
A fast, efficient, and optimized real-time chat application that matches users based on interests for anonymous intimate conversations.

## Core User Flow

### 1. User Onboarding
```
Landing → Registration → Profile Setup → Category Selection → Chat
```

**Registration Flow:**
1. **Gender Selection** - Male/Female/Non-binary/Prefer not to say
2. **Username Creation** - Unique anonymous handle
3. **Age Verification** - 18+ confirmation
4. **Preferences Setup** - Sexual orientation, relationship status
5. **Interest Categories** - Select from predefined categories
6. **Location (Optional)** - For location-based matching

### 2. Main Application Flow
```
Dashboard → Categories → Online Users → Chat Room → Private Chat
```

**App Flow:**
1. **Dashboard** - Show available categories with online user counts
2. **Category Selection** - Enter specific interest-based chat categories
3. **User Matching** - See online users in selected category
4. **Chat Initiation** - Start conversation with matched users
5. **Real-time Chat** - Instant messaging with typing indicators

## Technical Requirements

### Core Features
- [x] **User Authentication** - Anonymous but secure
- [x] **Real-time Messaging** - WebSocket-based chat
- [x] **Interest-based Matching** - Category and preference matching
- [x] **Online Presence** - Live status indicators
- [x] **Privacy Controls** - Block, report, and disconnect options
- [x] **Mobile Responsive** - PWA capabilities

### Advanced Features  
- [x] **Media Sharing** - Image sharing with automatic moderation
- [x] **Typing Indicators** - Real-time typing status
- [x] **Message Reactions** - Emoji reactions to messages
- [x] **Chat History** - Temporary session-based history
- [x] **Push Notifications** - For new messages and matches

## System Architecture

### Frontend Architecture
```
Next.js 14 (TypeScript)
├── components/
│   ├── auth/           # Authentication components
│   ├── chat/           # Chat interface components  
│   ├── matching/       # User matching components
│   ├── ui/             # Reusable UI components
│   └── layout/         # Layout components
├── pages/
│   ├── auth/           # Login/signup pages
│   ├── dashboard/      # Main dashboard
│   ├── categories/     # Category selection
│   └── chat/           # Chat rooms
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── styles/             # Global styles (matching landing page)
```

### Backend Architecture  
```
Node.js + Express/Fastify
├── routes/
│   ├── auth.js         # Authentication endpoints
│   ├── users.js        # User management
│   ├── matching.js     # Matching algorithm
│   ├── categories.js   # Category management
│   └── chat.js         # Chat-related endpoints
├── controllers/        # Business logic
├── middleware/         # Authentication, validation, etc.
├── models/             # Database schemas
├── services/           # External services (Redis, Socket.io)
├── utils/              # Utility functions
└── config/             # Configuration files
```

### Database Schema

**MongoDB Collections:**

```javascript
// Users Collection
{
  _id: ObjectId,
  username: String (unique),
  gender: String,
  age: Number,
  preferences: {
    orientation: String,
    relationshipStatus: String,
    interests: [String]
  },
  location: {
    country: String,
    region: String // optional
  },
  isOnline: Boolean,
  lastSeen: Date,
  createdAt: Date
}

// Categories Collection  
{
  _id: ObjectId,
  name: String,
  description: String,
  tags: [String],
  onlineCount: Number,
  isActive: Boolean
}

// ChatSessions Collection
{
  _id: ObjectId,
  participants: [ObjectId],
  category: ObjectId,
  startedAt: Date,
  endedAt: Date,
  status: String // active, ended, reported
}

// Messages Collection (Temporary - Auto-delete after 24h)
{
  _id: ObjectId,
  sessionId: ObjectId,
  senderId: ObjectId,
  content: String,
  messageType: String, // text, image, emoji
  timestamp: Date,
  expiresAt: Date // TTL index
}
```

**Redis Data Structures:**
```javascript
// Online users by category
"category:{categoryId}:online" -> Set of user IDs

// User presence
"user:{userId}:status" -> { online: true, category: "categoryId" }

// Active chat sessions
"session:{sessionId}" -> { participants: [], startedAt: timestamp }

// Typing indicators
"typing:{sessionId}" -> Set of user IDs currently typing
```

## Infrastructure Recommendations

### Development Setup (Easy Start)
```
Local Development:
├── Frontend: Next.js dev server (localhost:3000)
├── Backend: Node.js + Nodemon (localhost:5000)  
├── Database: MongoDB Community (local) + Redis (Docker)
├── Real-time: Socket.io integration
└── Tools: Docker Compose for services
```

### Production Infrastructure (Scalable)

#### Option 1: Serverless (Recommended for MVP)
```
Vercel (Frontend) + Railway (Backend) + MongoDB Atlas
├── Frontend: Vercel (Auto-deploy from Git)
├── Backend: Railway (Node.js deployment)
├── Database: MongoDB Atlas (Free tier)
├── Cache: Railway Redis (Built-in)
├── CDN: Vercel Edge Network
├── Monitoring: Railway Analytics + Vercel Analytics
└── Cost: ~$20-50/month for moderate traffic
```

#### Option 2: Cloud Infrastructure (High Scale)
```
AWS/Google Cloud Architecture
├── Frontend: CloudFront + S3 (Static hosting)
├── Backend: ECS/Cloud Run (Containerized API)
├── Database: MongoDB Atlas + ElastiCache (Redis)
├── Load Balancer: ALB/Cloud Load Balancer
├── WebSockets: Socket.io with Redis Adapter
├── CDN: CloudFront/Cloud CDN
├── Monitoring: CloudWatch/Cloud Monitoring
└── Cost: ~$100-500/month based on usage
```

#### Option 3: Hybrid (Best Performance)
```
Multi-Provider Setup
├── Frontend: Vercel (Best DX for Next.js)
├── Backend: Railway/Render (Easy Node.js deployment)
├── Database: MongoDB Atlas (Global clusters)
├── Cache: Upstash Redis (Serverless Redis)
├── WebSockets: Socket.io with Upstash Redis Adapter
├── CDN: Vercel + Cloudflare (Double CDN)
├── Monitoring: Better Stack + Vercel Analytics
└── Cost: ~$30-100/month for high traffic
```

## Technology Stack

### Frontend Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS (matching landing page design)
- **State Management**: Zustand or React Context
- **Real-time**: Socket.io-client
- **UI Components**: Headless UI + Custom components
- **Forms**: React Hook Form + Zod validation
- **PWA**: Next-PWA for mobile app experience

### Backend Stack  
- **Runtime**: Node.js 20+
- **Framework**: Express.js or Fastify (for performance)
- **Language**: TypeScript  
- **Authentication**: JWT + bcrypt
- **Real-time**: Socket.io
- **Database**: MongoDB + Mongoose ODM
- **Cache**: Redis + ioredis
- **Validation**: Joi or Zod
- **File Upload**: Multer + Sharp (image processing)
- **Rate Limiting**: express-rate-limit + Redis

### DevOps & Tools
- **Version Control**: Git + GitHub
- **Package Manager**: pnpm (faster than npm/yarn)
- **Build Tool**: Turbo (monorepo if needed)
- **Code Quality**: ESLint + Prettier + Husky
- **Testing**: Jest + React Testing Library + Supertest
- **Documentation**: Storybook (UI) + Swagger (API)
- **Deployment**: Docker + GitHub Actions
- **Monitoring**: Winston (logging) + Sentry (error tracking)

## Development Phases

### Phase 1: MVP (2-3 weeks)
- [ ] User authentication and profile setup
- [ ] Basic category system (5-10 predefined categories)
- [ ] Real-time chat functionality
- [ ] Online presence indicators
- [ ] Basic matching algorithm
- [ ] Mobile-responsive UI

### Phase 2: Enhanced Features (2-3 weeks)  
- [ ] Advanced matching based on multiple criteria
- [ ] Image sharing with moderation
- [ ] Typing indicators and message reactions
- [ ] Push notifications
- [ ] Admin panel for category/user management
- [ ] Analytics and usage tracking

### Phase 3: Scale & Optimization (2-4 weeks)
- [ ] Performance optimization
- [ ] Advanced caching strategies  
- [ ] Load testing and capacity planning
- [ ] Security audit and penetration testing
- [ ] PWA features for mobile app experience
- [ ] Advanced analytics and user insights

## Security Considerations

### Privacy & Security
- **Data Encryption**: All messages encrypted in transit and at rest
- **Anonymous IDs**: No personal information stored
- **Auto-deletion**: Messages auto-delete after 24-48 hours
- **Content Moderation**: AI-powered content filtering
- **Rate Limiting**: Prevent spam and abuse
- **IP-based Controls**: Block malicious actors
- **Report System**: User reporting with quick response
- **Age Verification**: Strict 18+ verification

### Compliance
- **GDPR**: European data protection compliance
- **COPPA**: Children's privacy protection (18+ only)
- **Content Policy**: Clear guidelines for appropriate content
- **Terms of Service**: Legal protection and user agreements

## Getting Started

### Prerequisites
```bash
Node.js 20+
MongoDB 7+
Redis 7+
Docker (optional but recommended)
```

### Quick Setup
```bash
# Clone and setup
cd webapp
npm run setup

# Start development
npm run dev

# Run tests
npm run test

# Build for production  
npm run build
```

Ready to start development with a production-ready architecture that scales from MVP to millions of users! 🚀