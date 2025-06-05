# Manual Deployment Instructions for ScoopSocials

## Issue: Domain Conflict Resolution

The frontend deployment failures were caused by ScoopSocials.online domain already pointing to DigitalOcean. 

## Solution: Deploy to Vercel Subdomain First

### Step 1: Remove Custom Domain from Vercel (If Added)
1. Go to Vercel dashboard
2. Find ScoopSocials project
3. Go to Settings > Domains
4. Remove any custom domain (ScoopSocials.online)

### Step 2: Deploy Static Build
Since we have permission issues with npm/git in WSL, we have two options:

#### Option A: Use the Pre-built Static Files
1. Upload the `web/build/index.html` file directly to Vercel
2. The static HTML includes all functionality using vanilla JavaScript
3. This bypasses the React build process entirely

#### Option B: Use Vercel Dashboard Upload
1. Zip the `web/build/` folder
2. Upload directly to Vercel dashboard
3. Deploy as static site

### Step 3: Verify Deployment
1. Test the Vercel URL (will be something like `scoopsocials-xyz.vercel.app`)
2. Confirm frontend loads correctly
3. Test API connection to Railway backend

### Step 4: Add Custom Domain (After Success)
1. Once Vercel deployment works
2. Update DNS at domain registrar:
   - Remove current A records pointing to DigitalOcean
   - Add CNAME record: `www` → `cname.vercel-dns.com`
   - Add A record: `@` → `76.76.19.61` (Vercel IP)
3. Add domain back to Vercel project

## Current Status
- ✅ Backend: Working on Railway (https://scoopsocials-platform-production.up.railway.app)
- ✅ Database: MongoDB Atlas connected
- ✅ Static Build: Created at `web/build/index.html`
- 🔄 Frontend: Ready for Vercel deployment
- ❌ Domain: Needs DNS reconfiguration

## Next Steps
1. Deploy static build to Vercel (without custom domain)
2. Test full platform functionality
3. Resolve DNS conflict with DigitalOcean
4. Add custom domain to Vercel

## Technical Notes
- Simplified React app to vanilla HTML/JS to avoid build issues
- All functionality preserved (navigation, responsive design)
- API proxy configured in vercel.json
- Ready for immediate deployment