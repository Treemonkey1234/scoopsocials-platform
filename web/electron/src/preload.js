const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Platform information
  platform: process.platform,
  
  // App information
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
  
  // Window controls
  minimize: () => ipcRenderer.invoke('window:minimize'),
  maximize: () => ipcRenderer.invoke('window:maximize'),
  close: () => ipcRenderer.invoke('window:close'),
  
  // Notifications
  showNotification: (title, body) => ipcRenderer.invoke('notification:show', { title, body }),
  
  // External links
  openExternal: (url) => ipcRenderer.invoke('shell:openExternal', url),
  
  // Development helpers
  isDev: process.env.NODE_ENV === 'development'
});

// Log when preload script loads
console.log('ScoopSocials Electron preload script loaded');