# 🛡️ ScoopSocials Platform

## 🌟 Your Trusted Social Identity Platform

ScoopSocials aggregates your social media accounts into one verified profile, building trust and combating catfishing through community-driven validation.

### ✨ Key Features

- **🏆 Trust Score Algorithm** - 11-factor scoring system for user credibility
- **🔗 Social Media Aggregation** - Link Twitter, Instagram, LinkedIn, and more
- **🗺️ Event Management** - Create and discover community events with map integration
- **👥 Community Validation** - Agree/disagree voting system on posts
- **📱 Cross-Platform** - React web app + React Native mobile app
- **🔒 Anti-Catfishing** - Verify real people through social presence

### 🚀 Live Demo

**Website**: [ScoopSocials.online](https://scoopsocials.online)

### 🏗️ Tech Stack

#### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Redux Toolkit** for state management
- **React Query** for API calls
- **Framer Motion** for animations

#### Mobile
- **React Native** for iOS/Android
- **React Navigation** for routing
- **Redux Persist** for offline state

#### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** authentication
- **bcrypt** for password hashing
- **Comprehensive middleware** for security

### 📱 Platform Components

#### Trust Score System
11-factor algorithm including:
- Social media account verification (20%)
- Community friend network (20%) 
- Recent platform activity (15%)
- Content posting quality (15%)
- Platform time investment (10%)
- Comment engagement (10%)
- Community participation (10%)
- Event attendance (5%)
- Content moderation accuracy
- Post validation scores
- Cone profile contributions

#### Social Media Integration
- Twitter/X verification
- Instagram account linking
- LinkedIn professional profiles
- Facebook social presence
- TikTok content verification
- YouTube channel validation
- Snapchat account confirmation
- Custom platform support

#### Event Management
- Public/private event creation
- Map-based event discovery
- Trust score requirements for events
- RSVP and attendance tracking
- Real-time event updates
- Community event validation

### 🌍 Business Model

1. **Phase 1**: Standalone social verification platform
2. **Phase 2**: "Scoop Verified" badges for dating apps
3. **Phase 3**: Enterprise bot mitigation services

### 📋 API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/me` - Current user profile
- `PUT /api/auth/profile` - Update user profile

#### Trust Score
- `GET /api/trust-score` - Get detailed trust score
- `POST /api/trust-score/calculate` - Recalculate score

#### Social Accounts
- `GET /api/social-accounts` - List connected accounts
- `POST /api/social-accounts` - Add social account
- `DELETE /api/social-accounts/:id` - Remove account

#### Events
- `GET /api/events` - List public events
- `POST /api/events` - Create new event
- `GET /api/events/nearby` - Find events by location

### 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting on all endpoints
- CORS protection
- Input validation and sanitization
- Trust score anti-gaming measures
- Community-driven moderation

### 📊 Database Schema

#### User Model
- Personal information and authentication
- Trust score factors and calculation history
- Social media account array
- Activity statistics and preferences
- Friend connections and network

#### Post Model
- Content with community reactions
- Agree/disagree validation system
- Flagging and moderation workflow
- Trust score impact tracking

#### Event Model
- Location-based event data
- Attendance and participation tracking
- Trust score requirements
- Community validation

### 🎯 Target Market

#### Primary: Online Dating
- Combat catfishing with verified profiles
- Build trust through social media aggregation
- Community validation of user authenticity

#### Secondary: General Social Platforms
- Identity verification services
- Bot detection and mitigation
- Trust scoring for any platform

### 📈 Key Metrics

- **Trust Score Accuracy**: Community validation success rate
- **Social Verification**: Platform connection and verification rates  
- **User Engagement**: Event participation and community activity
- **Platform Growth**: User acquisition and retention
- **Revenue Streams**: Verification badge licensing and premium features

### 🔧 Development

#### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- React Native CLI (for mobile)

#### Quick Start
```bash
# Install dependencies
npm run install-all

# Start development
npm run dev        # Backend API
npm run web        # Frontend
npm run mobile     # React Native
```

### 🚀 Deployment

#### Production Stack
- **Frontend**: Vercel (free tier)
- **Backend**: Railway (free $5 credit)
- **Database**: MongoDB Atlas (free 512MB)
- **Domain**: Custom domain support

#### Environment Variables
```bash
# Backend
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
NODE_ENV=production

# Frontend  
REACT_APP_API_URL=https://your-api.railway.app
```

### 📞 Contact

**Website**: [ScoopSocials.online](https://scoopsocials.online)

### 📄 License

This project is proprietary software developed for ScoopSocials LLC.

---

**Building trust in digital connections** 🛡️