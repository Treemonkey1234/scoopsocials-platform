# 🚀 Quick Start Guide - View ScoopSocials in Browser

## Prerequisites
1. **Node.js** (Download from [nodejs.org](https://nodejs.org/))
2. **MongoDB** (Option A: Install locally OR Option B: Use MongoDB Atlas free tier)

## Option A: Quick Demo (No Database Required)
If you just want to see the frontend:

```bash
# Navigate to web directory
cd "C:\Users\hemin\Local Files\Desktop\Scoop\Claude Code\web"

# Install dependencies
npm install

# Start development server
npm start
```

The web app will open at **http://localhost:3000**

## Option B: Full Platform (With Backend)

### Step 1: Install MongoDB
**Option A - Local MongoDB:**
- Download MongoDB Community Server
- Install and start MongoDB service

**Option B - MongoDB Atlas (Recommended):**
- Go to [mongodb.com/atlas](https://mongodb.com/atlas)
- Create free account
- Create cluster
- Get connection string
- Update backend/.env file

### Step 2: Start Backend
```bash
# Navigate to backend directory
cd "C:\Users\hemin\Local Files\Desktop\Scoop\Claude Code\backend"

# Install dependencies
npm install

# Start backend server
npm run dev
```

Backend runs at **http://localhost:5000**

### Step 3: Start Frontend
```bash
# Navigate to web directory (new terminal)
cd "C:\Users\hemin\Local Files\Desktop\Scoop\Claude Code\web"

# Install dependencies
npm install

# Start development server
npm start
```

Frontend runs at **http://localhost:3000**

## 🌐 Connecting Your Domain

Once you want to deploy to your domain:

### Option 1: Vercel (Recommended for Frontend)
1. Push code to GitHub
2. Connect Vercel to your repository
3. Set custom domain in Vercel dashboard

### Option 2: Traditional Hosting
1. Build the project: `npm run build`
2. Upload `build` folder to your web hosting
3. Configure domain DNS to point to hosting

### Backend Deployment Options:
- **Heroku** (Easy)
- **Railway** (Modern)
- **DigitalOcean** (VPS)
- **AWS/Azure** (Enterprise)

## 🎯 What You'll See

### Landing Page (/)
- Modern hero section
- Feature showcase
- Trust score explanation
- Registration/login options

### Dashboard (/dashboard)
- Trust score display
- Connected accounts overview
- Quick actions
- Activity feed

### Core Features:
- ✅ User authentication
- ✅ Trust score calculation
- ✅ Social media account linking
- ✅ Event management
- ✅ Community validation
- ✅ Responsive design

## 🔧 Configuration

### Environment Variables
Backend `.env` file is already configured for local development.

For production, update:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Strong secret key
- `NODE_ENV=production`

### API Integration
The frontend is pre-configured to connect to `http://localhost:5000/api`

## 🎨 Design Features
- **Modern UI**: Clean, trustworthy design
- **Responsive**: Works on all devices  
- **Trust-Focused**: Visual trust score indicators
- **Social Proof**: Connected account displays
- **Smooth Animations**: Framer Motion powered

## 📱 Mobile App (Bonus)
The React Native mobile app is also ready:
```bash
cd "C:\Users\hemin\Local Files\Desktop\Scoop\Claude Code\mobile"
npm install
npx react-native run-ios  # For iOS
# or
npx react-native run-android  # For Android
```

---

**Ready to build trust in digital connections!** 🛡️

Your ScoopSocials platform combines the best of social verification, community validation, and modern web technology.