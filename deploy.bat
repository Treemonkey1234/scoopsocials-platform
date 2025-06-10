@echo off
echo.
echo ===============================================
echo   ScoopSocials Platform Deployment Script
echo ===============================================
echo.

REM Navigate to project directory
cd /d "%~dp0"

echo [1/5] Initializing Git repository...
git init
if %errorlevel% neq 0 (
    echo Error: Git initialization failed
    pause
    exit /b 1
)

echo [2/5] Setting up main branch...
git branch -M main

echo [3/5] Adding all files to git...
git add .

echo [4/5] Creating initial commit...
git commit -m "Initial ScoopSocials platform commit

🛡️ Complete social verification platform with:
- 11-factor trust score algorithm  
- Social media aggregation system
- Community validation features
- React web + React Native mobile apps
- Node.js API with MongoDB

🚀 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

echo.
echo [5/5] Git repository ready!
echo.
echo ===============================================
echo   NEXT STEPS:
echo ===============================================
echo 1. Create GitHub repository at: https://github.com/new
echo    - Repository name: scoopsocials-platform
echo    - Make it Private
echo    - Don't initialize with README
echo.
echo 2. Connect to GitHub:
echo    git remote add origin https://github.com/Treemonkey1234/scoopsocials-platform.git
echo    git push -u origin main
echo.
echo 3. Follow DEPLOYMENT_GUIDE.md for full deployment
echo.
echo ===============================================
echo   Free Deployment Stack:
echo =============================================== 
echo • MongoDB Atlas (Free 512MB)
echo • Railway Backend (Free $5 credit)
echo • Vercel Frontend (Free tier)
echo • Custom domain: ScoopSocials.online
echo.
pause