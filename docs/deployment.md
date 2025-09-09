# NoWrong Deployment Guide

## Quick Start Deployment (15 minutes)

### Prerequisites
- GitHub account
- Vercel account (free)
- Railway account (free) 
- MongoDB Atlas account (free)
- Upstash account (free)

### Step 1: Database Setup

#### MongoDB Atlas Setup
```bash
1. Go to https://cloud.mongodb.com
2. Create free M0 cluster
3. Create database user
4. Whitelist IP (0.0.0.0/0 for development)
5. Get connection string: mongodb+srv://...
```

#### Redis Setup (Upstash)
```bash
1. Go to https://upstash.com
2. Create Redis database
3. Get Redis URL: redis://...
4. Note password for environment variables
```

### Step 2: Environment Variables

#### Backend Environment (.env)
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nowrong
REDIS_URL=redis://default:password@redis-url:6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here

# App Configuration
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://your-frontend-domain.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload (if using AWS S3)
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_S3_BUCKET=nowrong-uploads
AWS_REGION=us-east-1
```

#### Frontend Environment (.env.local)
```env
# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-domain.railway.app
NEXT_PUBLIC_SOCKET_URL=https://your-backend-domain.railway.app

# App Configuration
NEXT_PUBLIC_APP_NAME=NoWrong
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# Analytics (optional)
NEXT_PUBLIC_VERCEL_ANALYTICS=true
```

### Step 3: Backend Deployment (Railway)

#### Deploy to Railway
```bash
1. Connect GitHub repository to Railway
2. Select webapp/backend folder
3. Add environment variables
4. Deploy automatically
```

#### Manual Railway Deployment
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
cd webapp/backend
railway up
```

### Step 4: Frontend Deployment (Vercel)

#### Deploy to Vercel
```bash
1. Connect GitHub repository to Vercel  
2. Set root directory to: webapp/frontend
3. Add environment variables
4. Deploy automatically
```

#### Manual Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd webapp/frontend
vercel
```

## Production Deployment

### Infrastructure Setup

#### 1. Domain Configuration
```bash
# Purchase domain from Namecheap, GoDaddy, etc.
# Configure DNS:
A Record: @ → Vercel IP
CNAME: www → your-app.vercel.app
CNAME: api → your-backend.railway.app
```

#### 2. SSL Certificates
```bash
# Automatic via Vercel and Railway
# Custom domain SSL is automatic
# No manual configuration needed
```

#### 3. CDN Configuration
```bash
# Vercel Edge Network (included)
# Optional: Add Cloudflare for additional layer
# Configure caching rules for static assets
```

### Advanced Deployment Options

#### Option 1: Docker Deployment
```dockerfile
# webapp/backend/Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

```dockerfile  
# webapp/frontend/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

#### Option 2: AWS/GCP Deployment
```yaml
# docker-compose.yml for cloud deployment
version: '3.8'
services:
  frontend:
    build: ./webapp/frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:5000
      
  backend:
    build: ./webapp/backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - REDIS_URL=${REDIS_URL}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - redis
      
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

## Environment-Specific Configurations

### Development Environment
```bash
# Local development setup
cd webapp

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Start development servers
npm run dev
```

### Staging Environment
```bash
# Staging-specific configurations
NODE_ENV=staging
DATABASE_NAME=nowrong-staging
REDIS_DB=1

# Deploy staging branch
git checkout staging
railway up --environment staging
vercel --env staging
```

### Production Environment
```bash
# Production-specific configurations
NODE_ENV=production
DATABASE_NAME=nowrong-production
REDIS_DB=0

# Deploy main branch
git checkout main
railway up --environment production
vercel --prod
```

## Database Migration & Seeding

### Initial Database Setup
```javascript
// scripts/setup-database.js
const { MongoClient } = require('mongodb');

async function setupDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  
  const db = client.db('nowrong');
  
  // Create indexes
  await db.collection('users').createIndex({ username: 1 }, { unique: true });
  await db.collection('users').createIndex({ preferences: 1 });
  await db.collection('messages').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  await db.collection('chatSessions').createIndex({ participants: 1 });
  
  // Seed initial categories
  await db.collection('categories').insertMany([
    { name: 'General Chat', description: 'Open conversations', tags: ['general'] },
    { name: 'Dating', description: 'Find your match', tags: ['dating', 'romance'] },
    { name: 'Casual', description: 'Casual encounters', tags: ['casual', 'fun'] },
    { name: 'Deep Talk', description: 'Meaningful conversations', tags: ['deep', 'meaningful'] },
  ]);
  
  await client.close();
  console.log('Database setup complete!');
}

setupDatabase().catch(console.error);
```

### Run Database Setup
```bash
cd webapp/backend
node scripts/setup-database.js
```

## Monitoring & Health Checks

### Health Check Endpoints
```javascript
// Health check routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/health/db', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({ status: 'DB Connected' });
  } catch (error) {
    res.status(500).json({ status: 'DB Disconnected', error: error.message });
  }
});
```

### Monitoring Setup
```bash
# Add monitoring URLs to Better Stack
Frontend Health: https://your-app.vercel.app/api/health
Backend Health: https://your-api.railway.app/health
Database Health: https://your-api.railway.app/health/db
```

## Security Configuration

### Production Security Checklist
- [ ] Environment variables secured (no hardcoded secrets)
- [ ] HTTPS enforced (automatic with Vercel/Railway)
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (using Mongoose)
- [ ] XSS protection headers
- [ ] Content Security Policy configured
- [ ] Authentication tokens secured (httpOnly cookies)
- [ ] File upload restrictions (if applicable)

### Security Headers Configuration
```javascript
// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", process.env.FRONTEND_URL]
    }
  }
}));
```

## Backup & Recovery

### Database Backups
```bash
# MongoDB Atlas automatic backups (enabled by default)
# Manual backup
mongodump --uri="mongodb+srv://..." --out=backup/$(date +%Y%m%d)

# Restore from backup  
mongorestore --uri="mongodb+srv://..." backup/20231201
```

### Code Backups
```bash
# Git-based backups (GitHub)
# Automated via GitHub Actions
# Tagged releases for rollback
```

## Scaling Considerations

### Horizontal Scaling
```bash
# Railway auto-scaling (Pro plan)
# Multiple backend instances
# Load balancing (automatic)
# Database connection pooling
```

### Vertical Scaling  
```bash
# Database scaling (MongoDB Atlas)
# Upgrade to M10, M20, M30+ tiers
# Redis memory scaling (Upstash Pro)
# CDN scaling (Vercel Pro)
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Issues
```bash
# Check connection string format
# Verify IP whitelist settings
# Confirm user permissions
# Test connection locally
```

#### 2. CORS Issues
```bash
# Verify CORS_ORIGIN environment variable
# Check frontend URL configuration
# Ensure protocol (https/http) matches
```

#### 3. WebSocket Connection Issues
```bash
# Check Socket.io configuration
# Verify SOCKET_URL in frontend
# Test WebSocket endpoint directly
# Check firewall/proxy settings
```

#### 4. Environment Variable Issues
```bash
# Verify all required variables are set
# Check for typos in variable names
# Ensure proper escaping of special characters
# Restart applications after changes
```

### Debugging Commands
```bash
# Check application logs
railway logs
vercel logs

# Test API endpoints
curl https://your-api.railway.app/health

# Check database connection
mongo "mongodb+srv://..." --eval "db.stats()"

# Test Redis connection  
redis-cli -u redis://...
```

Ready for production deployment with monitoring, security, and scalability built-in! 🚀