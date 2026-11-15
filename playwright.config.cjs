const {defineConfig} = require('@playwright/test');
const fs = require('node:fs');
const candidates = [process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/usr/bin/chromium', '/usr/bin/chromium-browser'].filter(Boolean);
const executablePath = candidates.find((candidate) => fs.existsSync(candidate));
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  use: {baseURL: 'http://127.0.0.1:4173', viewport: {width: 1440, height: 1050}, launchOptions: executablePath ? {executablePath} : {}, headless: true, reducedMotion: 'reduce'},
  webServer: {command: 'node server.cjs', url: 'http://127.0.0.1:4173', reuseExistingServer: true},
  reporter: 'list'
});
