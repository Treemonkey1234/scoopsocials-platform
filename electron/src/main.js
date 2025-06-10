const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

class ScoopSocialsElectron {
  constructor() {
    this.mainWindow = null;
    this.init();
  }

  init() {
    app.whenReady().then(() => {
      this.createWindow();
      this.createMenu();
      
      app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createWindow();
        }
      });
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });
  }

  createWindow() {
    this.mainWindow = new BrowserWindow({
      width: 450,
      height: 800,
      minWidth: 400,
      minHeight: 700,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        webSecurity: true
      },
      titleBarStyle: 'default',
      icon: this.getIconPath(),
      show: false,
      backgroundColor: '#00BCD4'
    });

    // Load the appropriate URL
    const startUrl = isDev 
      ? 'http://localhost:3000' 
      : `file://${path.join(__dirname, '../../web/out/index.html')}`;
    
    this.mainWindow.loadURL(startUrl);

    // Show window when ready to prevent visual flash
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow.show();
      
      // Open DevTools in development
      if (isDev) {
        this.mainWindow.webContents.openDevTools();
      }
    });

    // Handle external links
    this.mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url);
      return { action: 'deny' };
    });

    // Handle window closed
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });
  }

  createMenu() {
    const template = [
      {
        label: 'ScoopSocials',
        submenu: [
          {
            label: 'About ScoopSocials',
            click: () => {
              this.showAboutDialog();
            }
          },
          { type: 'separator' },
          {
            label: 'Refresh',
            accelerator: 'CmdOrCtrl+R',
            click: () => {
              if (this.mainWindow) {
                this.mainWindow.reload();
              }
            }
          },
          {
            label: 'Developer Tools',
            accelerator: 'F12',
            click: () => {
              if (this.mainWindow) {
                this.mainWindow.webContents.toggleDevTools();
              }
            }
          },
          { type: 'separator' },
          {
            label: 'Quit',
            accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
            click: () => {
              app.quit();
            }
          }
        ]
      },
      {
        label: 'View',
        submenu: [
          {
            label: 'Zoom In',
            accelerator: 'CmdOrCtrl+Plus',
            click: () => {
              if (this.mainWindow) {
                const currentZoom = this.mainWindow.webContents.getZoomLevel();
                this.mainWindow.webContents.setZoomLevel(currentZoom + 0.5);
              }
            }
          },
          {
            label: 'Zoom Out',
            accelerator: 'CmdOrCtrl+-',
            click: () => {
              if (this.mainWindow) {
                const currentZoom = this.mainWindow.webContents.getZoomLevel();
                this.mainWindow.webContents.setZoomLevel(currentZoom - 0.5);
              }
            }
          },
          {
            label: 'Reset Zoom',
            accelerator: 'CmdOrCtrl+0',
            click: () => {
              if (this.mainWindow) {
                this.mainWindow.webContents.setZoomLevel(0);
              }
            }
          },
          { type: 'separator' },
          {
            label: 'Toggle Fullscreen',
            accelerator: 'F11',
            click: () => {
              if (this.mainWindow) {
                this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
              }
            }
          }
        ]
      },
      {
        label: 'Window',
        submenu: [
          {
            label: 'Minimize',
            accelerator: 'CmdOrCtrl+M',
            click: () => {
              if (this.mainWindow) {
                this.mainWindow.minimize();
              }
            }
          },
          {
            label: 'Close',
            accelerator: 'CmdOrCtrl+W',
            click: () => {
              if (this.mainWindow) {
                this.mainWindow.close();
              }
            }
          }
        ]
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'Learn More',
            click: () => {
              shell.openExternal('https://scoopsocials.online');
            }
          },
          {
            label: 'GitHub Repository',
            click: () => {
              shell.openExternal('https://github.com/Treemonkey1234/scoopsocials-platform');
            }
          }
        ]
      }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  showAboutDialog() {
    const { dialog } = require('electron');
    dialog.showMessageBox(this.mainWindow, {
      type: 'info',
      title: 'About ScoopSocials',
      message: 'ScoopSocials Platform',
      detail: 'Social verification platform with community-driven trust scoring.\n\nVersion: 1.0.0\nBuilt with Electron and Next.js',
      buttons: ['OK']
    });
  }

  getIconPath() {
    // Return icon path based on platform
    const iconName = process.platform === 'win32' ? 'icon.ico' : 
                    process.platform === 'darwin' ? 'icon.icns' : 'icon.png';
    
    return path.join(__dirname, '../assets', iconName);
  }
}

// Initialize the application
new ScoopSocialsElectron();