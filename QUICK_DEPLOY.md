# 🚀 Quick Deploy - ScoopSocials Platform

## Step 1: Push to GitHub (5 minutes)

Open PowerShell in your project folder and run:
```powershell
# Right-click in the folder → "Open in Terminal" or "Open PowerShell window here"
.\push-to-github.ps1
```

Or manually:
```bash
git init
git add .
git commit -m "Initial ScoopSocials platform commit"
git remote add origin https://github.com/Treemonkey1234/scoopsocials-platform.git
git branch -M main
git push -u origin main
```

## Step 2: MongoDB Atlas Database (10 minutes)

1. **Sign up**: https://cloud.mongodb.com/
2. **Create cluster**: Choose FREE M0 (512MB)
3. **Database user**: Username: `scoopsocials`, generate password
4. **Network access**: Add `0.0.0.0/0` (allow all IPs)
5. **Get connection string**: 
   ```
   mongodb+srv://scoopsocials:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/scoopsocials
   ```

## Step 3: Railway Backend (5 minutes)

1. **Sign up**: https://railway.app/ (with GitHub)
2. **New Project** → **Deploy from GitHub repo**
3. **Select**: `Treemonkey1234/scoopsocials-platform`
4. **Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://scoopsocials:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/scoopsocials
   JWT_SECRET=super_secure_production_jwt_secret_key_2024_scoopsocials
   NODE_ENV=production
   PORT=5000
   CORS_ORIGIN=https://scoopsocials.online
   ```
5. **Copy Railway URL**: `https://your-app-xxxxx.railway.app`

## Step 4: Vercel Frontend (10 minutes)

1. **Sign up**: https://vercel.com/ (with GitHub)
2. **New Project** → Import `scoopsocials-platform`
3. **Configure**:
   - Framework: React
   - Root Directory: `web`
   - Build Command: `npm run build`
   - Output Directory: `build`
4. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-railway-app.railway.app/api
   REACT_APP_ENVIRONMENT=production
   ```
5. **Add Domain**: `scoopsocials.online`

## Step 5: DNS Configuration (5 minutes)

**In Domain.com for scoopsocials.online:**
```
Type: A, Name: @, Value: 76.76.19.61
Type: CNAME, Name: www, Value: cname.vercel-dns.com
```

## Step 6: Test! (2 minutes)

Visit: https://scoopsocials.online

---

## 🎉 Total Time: ~37 minutes
## 💰 Total Cost: $0 (free tiers)

Your anti-catfishing social verification platform will be LIVE!

### Platform Features Ready:
- ✅ User registration and authentication
- ✅ 11-factor trust score algorithm
- ✅ Social media account linking
- ✅ Community validation system
- ✅ Event creation and discovery
- ✅ Real-time trust score updates
- ✅ Anti-gaming security measures

### Business Model Ready:
- ✅ Phase 1: Standalone verification platform
- ✅ Phase 2: "Scoop Verified" badges for dating apps
- ✅ Phase 3: Enterprise bot mitigation services

**Need help?** Check `DEPLOYMENT_GUIDE.md` for detailed instructions!