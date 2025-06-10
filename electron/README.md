# ScoopSocials Electron App

This directory contains the Electron wrapper for the ScoopSocials mobile platform visualization.

## Features

- **Mobile-First Design**: Optimized window size (450x800) to simulate mobile experience
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Security**: Context isolation and disabled node integration for security
- **Development Tools**: Hot reload support and DevTools integration
- **Responsive**: Zoom controls and fullscreen support

## Development

```bash
# Install dependencies
npm run install-all

# Start development server (web + electron)
npm run electron-dev

# Run electron with production build
npm run electron

# Build distributable
npm run electron-build
```

## Window Features

- **Size**: 450x800 pixels (mobile-like aspect ratio)
- **Minimum Size**: 400x700 pixels
- **Background**: Cyan (#00BCD4) matching app theme
- **Menu**: Full application menu with shortcuts
- **Zoom**: Support for zoom in/out/reset
- **Security**: Context isolation enabled

## File Structure

```
electron/
├── src/
│   ├── main.js      # Main Electron process
│   └── preload.js   # Preload script for security
├── assets/          # Icons and assets
└── README.md        # This file
```

## Menu Options

- **ScoopSocials Menu**: About, Refresh, Developer Tools, Quit
- **View Menu**: Zoom controls, Toggle Fullscreen
- **Window Menu**: Minimize, Close
- **Help Menu**: Learn More, GitHub Repository

## Building

The app builds the Next.js web application first, then packages it with Electron using electron-builder.

Icons should be placed in `electron/assets/`:
- `icon.ico` for Windows
- `icon.icns` for macOS
- `icon.png` for Linux