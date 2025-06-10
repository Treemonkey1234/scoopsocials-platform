# ScoopSocials Electron Desktop App

This Electron application provides a desktop visualization of your ScoopSocials mobile platform with a native mobile-like interface.

## Features

✅ **Mobile-First Interface**: 450x800 window size simulating mobile app experience  
✅ **Cross-Platform**: Runs on Windows, macOS, and Linux  
✅ **Live Mobile Screens**: Login, Profile, Groups, and Navigation  
✅ **Cyan Branding**: Consistent #00BCD4 color scheme  
✅ **Interactive Elements**: Buttons, forms, social links, and navigation  
✅ **Security**: Context isolation and sandboxed environment  
✅ **Development Tools**: Hot reload and DevTools support  

## Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm 8.x or higher

### Installation
```bash
# Install all dependencies
npm run install-all
```

### Running the Application

#### Development Mode (Recommended)
```bash
# Start both web server and Electron (hot reload enabled)
npm run electron-dev
```

#### Production Mode
```bash
# Build web app and run Electron
npm run electron
```

#### Web Development Only
```bash
# Just the web interface in browser
npm run web
```

## Application Structure

### Window Configuration
- **Size**: 450x800 pixels (mobile aspect ratio)
- **Background**: Cyan (#00BCD4) theme matching mobile app
- **Minimum Size**: 400x700 pixels
- **Security**: Context isolation enabled, node integration disabled

### Mobile Screens Included
1. **Login Screen**: Cyan gradient with Scoop logo
2. **Login Form**: Email/password with social login options  
3. **Profile Screen**: User profile with verification badges
4. **Groups Screen**: Event management and discovery
5. **Bottom Navigation**: Home, Groups, Search, Inbox, Profile

### Menu Features
- **ScoopSocials Menu**: About, Refresh, Developer Tools, Quit
- **View Menu**: Zoom controls (In/Out/Reset), Toggle Fullscreen
- **Window Menu**: Minimize, Close
- **Help Menu**: Learn More, GitHub Repository

## Development

### File Structure
```
electron/
├── src/
│   ├── main.js      # Main Electron process
│   └── preload.js   # Security preload script
├── assets/          # App icons (place .ico, .icns, .png here)
└── README.md

web/
├── pages/
│   └── index.tsx    # Main mobile app implementation
├── styles/
│   └── globals.css  # Tailwind CSS styles
└── out/             # Built static files (after npm run build)
```

### Building for Distribution
```bash
# Build distributable packages
npm run electron-build
```

This creates platform-specific installers in the `dist/` directory.

### Keyboard Shortcuts
- `Ctrl/Cmd + R`: Refresh application
- `F12`: Toggle Developer Tools
- `Ctrl/Cmd + Plus/Minus`: Zoom In/Out
- `Ctrl/Cmd + 0`: Reset Zoom
- `F11`: Toggle Fullscreen
- `Ctrl/Cmd + M`: Minimize
- `Ctrl/Cmd + W`: Close Window
- `Ctrl/Cmd + Q`: Quit Application

## Customization

### Icons
Place platform-specific icons in `electron/assets/`:
- `icon.ico` for Windows
- `icon.icns` for macOS  
- `icon.png` for Linux

### App Information
Update package.json build configuration:
```json
{
  "build": {
    "appId": "com.scoopsocials.platform",
    "productName": "ScoopSocials Platform"
  }
}
```

## Troubleshooting

### Port Issues
If port 3000 is in use, the electron-dev command will fail. Stop other servers or change the port in `web/package.json`.

### Build Errors
If you encounter build errors:
1. Clear node_modules: `rm -rf node_modules web/node_modules`
2. Reinstall: `npm run install-all`
3. Try building web separately: `cd web && npm run build`

### Missing Dependencies
Ensure all required dependencies are installed:
```bash
npm install
cd web && npm install
```

## Platform-Specific Notes

### Windows
- Requires Windows 10 or later
- May need Visual Studio Build Tools for some dependencies

### macOS
- Requires macOS 10.15 or later
- May need to allow app in Security & Privacy settings

### Linux
- Tested on Ubuntu 20.04+
- May need to install additional system dependencies

## Support

For issues or questions:
- Check the main README.md
- Review the deployment documentation
- Open an issue in the GitHub repository

---

Built with ❤️ using Electron + Next.js + Tailwind CSS