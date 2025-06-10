# ScoopSocials Platform - GitHub Push Script
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "   ScoopSocials Platform - GitHub Push" -ForegroundColor Cyan  
Write-Host "===============================================" -ForegroundColor Cyan

# Navigate to project directory
Set-Location $PSScriptRoot

Write-Host "`n[1/6] Checking Git installation..." -ForegroundColor Yellow
try {
    git --version
    Write-Host "✓ Git is installed" -ForegroundColor Green
} catch {
    Write-Host "✗ Git not found. Please install Git first." -ForegroundColor Red
    exit 1
}

Write-Host "`n[2/6] Initializing Git repository..." -ForegroundColor Yellow
git init
git branch -M main

Write-Host "`n[3/6] Adding all files..." -ForegroundColor Yellow
git add .

Write-Host "`n[4/6] Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial ScoopSocials platform commit

🛡️ Complete social verification platform with:
- 11-factor trust score algorithm
- Social media aggregation system  
- Community validation features
- React web + React Native mobile apps
- Node.js API with MongoDB

🚀 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

Write-Host "`n[5/6] Connecting to GitHub repository..." -ForegroundColor Yellow
git remote add origin https://github.com/Treemonkey1234/scoopsocials-platform.git

Write-Host "`n[6/6] Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

Write-Host "`n===============================================" -ForegroundColor Green
Write-Host "   ✓ SUCCESS! Code pushed to GitHub!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green

Write-Host "`nRepository URL: https://github.com/Treemonkey1234/scoopsocials-platform" -ForegroundColor Cyan

Write-Host "`n===============================================" -ForegroundColor Yellow
Write-Host "   NEXT STEPS - FREE DEPLOYMENT:" -ForegroundColor Yellow  
Write-Host "===============================================" -ForegroundColor Yellow
Write-Host "1. MongoDB Atlas (Database):" -ForegroundColor White
Write-Host "   → Go to: https://cloud.mongodb.com/" -ForegroundColor Gray
Write-Host "   → Create free 512MB cluster" -ForegroundColor Gray

Write-Host "`n2. Railway (Backend API):" -ForegroundColor White
Write-Host "   → Go to: https://railway.app/" -ForegroundColor Gray
Write-Host "   → Deploy from GitHub repo" -ForegroundColor Gray
Write-Host "   → Free `$5 monthly credit" -ForegroundColor Gray

Write-Host "`n3. Vercel (Frontend):" -ForegroundColor White
Write-Host "   → Go to: https://vercel.com/" -ForegroundColor Gray
Write-Host "   → Import from GitHub" -ForegroundColor Gray
Write-Host "   → Connect ScoopSocials.online domain" -ForegroundColor Gray

Write-Host "`n4. Follow DEPLOYMENT_GUIDE.md for detailed steps" -ForegroundColor White

Write-Host "`n===============================================" -ForegroundColor Magenta
Write-Host "   🎉 ScoopSocials Platform Ready!" -ForegroundColor Magenta
Write-Host "===============================================" -ForegroundColor Magenta

Read-Host "`nPress Enter to continue..."