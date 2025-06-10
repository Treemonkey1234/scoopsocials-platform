# 🚀 ScoopSocials Deployment Guide

## Quick Deployment Steps

### 1. GitHub Setup
```bash
# Open Terminal/Command Prompt in your project directory
cd "C:\Users\hemin\Local Files\Desktop\Scoop\Claude Code"

# Initialize Git (if not already done)
git init
git add .
git commit -m "Initial ScoopSocials platform commit

🛡️ Complete social verification platform with:
- 11-factor trust score algorithm
- Social media aggregation system
- Community validation features
- React web + React Native mobile apps
- Node.js API with MongoDB

🚀 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# Create GitHub repository (you'll need to do this manually)
# 1. Go to https://github.com/new
# 2. Repository name: "scoopsocials-platform"
# 3. Make it Private
# 4. Don't initialize with README (we have one)
# 5. Click "Create repository"

# Connect to GitHub
git remote add origin https://github.com/Treemonkey1234/scoopsocials-platform.git
git branch -M main
git push -u origin main
```

### 2. MongoDB Atlas Setup (Free Tier)
1. Go to https://cloud.mongodb.com/
2. Sign up/Login
3. Create a new project: "ScoopSocials"
4. Create cluster: Choose FREE tier (M0 Sandbox - 512MB)
5. Choose AWS, any region
6. Cluster name: "scoopsocials-cluster"
7. Create cluster (takes 3-5 minutes)
8. Go to "Database Access" → Add Database User:
   - Username: `scoopsocials`
   - Password: Generate secure password
   - Database User Privileges: Read and write to any database
9. Go to "Network Access" → Add IP Address:
   - Click "Add Current IP Address"
   - Also add `0.0.0.0/0` for Railway access
10. Go to "Clusters" → Connect → Connect your application
11. Copy the connection string (looks like):
    ```
    mongodb+srv://scoopsocials:<password>@scoopsocials-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
    ```

### 3. Railway Backend Deployment (Free $5 Credit)
1. Go to https://railway.app/
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `scoopsocials-platform` repository
5. Railway will detect the Node.js app automatically
6. Go to project settings → Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://scoopsocials:YOUR_PASSWORD@scoopsocials-cluster.xxxxx.mongodb.net/scoopsocials
   JWT_SECRET=super_secure_production_jwt_secret_key_2024_scoopsocials
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   PORT=5000
   CORS_ORIGIN=https://scoopsocials.online
   ```
7. In Settings → Domains, copy your Railway app URL (like `https://your-app-xxxxx.railway.app`)

### 4. Vercel Frontend Deployment (Free Tier)
1. Go to https://vercel.com/
2. Sign up with GitHub
3. Click "New Project"
4. Import your `scoopsocials-platform` repository
5. Framework Preset: React
6. Root Directory: `web`
7. Build Command: `npm run build`
8. Output Directory: `build`
9. Environment Variables:
   ```
   REACT_APP_API_URL=https://your-railway-app.railway.app/api
   REACT_APP_ENVIRONMENT=production
   ```
10. Deploy!

### 5. Custom Domain Setup (ScoopSocials.online)
#### Vercel Domain Configuration:
1. In Vercel project → Settings → Domains
2. Add domain: `scoopsocials.online`
3. Add domain: `www.scoopsocials.online`

#### Domain.com DNS Configuration:
1. Log into your Domain.com account
2. Go to DNS Management for scoopsocials.online
3. Add these records:
   ```
   Type: A
   Name: @
   Value: 76.76.19.61 (Vercel IP)
   TTL: 3600

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 3600
   ```
4. Save changes (DNS propagation takes 10-60 minutes)

### 6. SSL Certificate
- Vercel automatically provides SSL certificates
- Your site will be available at https://scoopsocials.online

### 7. Final Steps
1. Test your deployed application
2. Update environment variables if needed
3. Monitor Railway usage (free $5 credit)
4. Set up MongoDB Atlas alerts for storage usage

## 📱 Mobile App Deployment (iOS TestFlight)

### Prerequisites:
- Apple Developer Account ($99/year)
- macOS with Xcode
- Physical iOS device for testing

### Steps:
1. Install React Native development environment
2. Open `mobile` folder in Xcode
3. Configure bundle identifier and signing
4. Build for iOS device
5. Upload to App Store Connect
6. Create TestFlight beta testing group
7. Invite testers via email

## 🔧 Environment Variables Reference

### Backend (.env for Railway):
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/scoopsocials
JWT_SECRET=super_secure_production_jwt_secret_key_2024
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://scoopsocials.online
```

### Frontend (.env for Vercel):
```bash
REACT_APP_API_URL=https://your-backend.railway.app/api
REACT_APP_ENVIRONMENT=production
REACT_APP_MAPBOX_TOKEN=your_mapbox_token_here
```

## 💰 Cost Breakdown (Free Tier)
- **MongoDB Atlas**: Free 512MB
- **Railway**: Free $5 credit monthly
- **Vercel**: Free tier (100GB bandwidth)
- **Domain**: Already owned (scoopsocials.online)
- **Total Monthly Cost**: $0 (until Railway credit exhausted)

## 🆘 Troubleshooting

### Common Issues:
1. **CORS Errors**: Update CORS_ORIGIN in Railway env vars
2. **Database Connection**: Check MongoDB Atlas IP whitelist
3. **Build Failures**: Ensure all dependencies in package.json
4. **Domain Not Working**: Wait for DNS propagation (up to 48h)

### Support Resources:
- Railway Docs: https://docs.railway.app/
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/

---

## 🎉 You're Ready to Launch!

Once deployed, your ScoopSocials platform will be live at:
- **Website**: https://scoopsocials.online
- **API**: https://your-app.railway.app/api
- **Mobile**: iOS TestFlight beta

**Next Steps**: Marketing, user acquisition, and iterating based on user feedback!