#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Testing ScoopSocials Electron Setup...\n');

// Check if required files exist
const requiredFiles = [
  'electron/src/main.js',
  'electron/src/preload.js',
  'web/package.json',
  'web/pages/index.tsx'
];

console.log('📁 Checking required files...');
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    process.exit(1);
  }
}

// Check if node_modules exist
console.log('\n📦 Checking dependencies...');
if (fs.existsSync('node_modules')) {
  console.log('✅ Root node_modules');
} else {
  console.log('❌ Root node_modules - run: npm install');
}

if (fs.existsSync('web/node_modules')) {
  console.log('✅ Web node_modules');
} else {
  console.log('❌ Web node_modules - run: cd web && npm install');
}

// Check if we can build the web app
console.log('\n🔨 Testing web build...');
const buildProcess = spawn('npm', ['run', 'build'], { stdio: 'inherit' });

buildProcess.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Web build successful!');
    console.log('\n🎉 Electron setup complete!');
    console.log('\nTo run the Electron app:');
    console.log('  npm run electron-dev  (for development)');
    console.log('  npm run electron      (for production)');
  } else {
    console.log('\n❌ Web build failed');
    process.exit(1);
  }
});

buildProcess.on('error', (err) => {
  console.error('\n❌ Error testing build:', err.message);
  process.exit(1);
});