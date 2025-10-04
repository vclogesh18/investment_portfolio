import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup...');
  
  // Wait for services to be ready
  console.log('⏳ Waiting for services to start...');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Wait for backend API
  let backendReady = false;
  for (let i = 0; i < 30; i++) {
    try {
      await page.goto('http://localhost:5001/api/team');
      if (page.url().includes('localhost:5001')) {
        backendReady = true;
        console.log('✅ Backend API is ready');
        break;
      }
    } catch (error) {
      console.log(`⏳ Waiting for backend... (attempt ${i + 1}/30)`);
      await page.waitForTimeout(2000);
    }
  }
  
  if (!backendReady) {
    throw new Error('❌ Backend API failed to start');
  }
  
  // Wait for frontend
  let frontendReady = false;
  for (let i = 0; i < 30; i++) {
    try {
      await page.goto('http://localhost:5173');
      if (page.url().includes('localhost:5173')) {
        frontendReady = true;
        console.log('✅ Frontend is ready');
        break;
      }
    } catch (error) {
      console.log(`⏳ Waiting for frontend... (attempt ${i + 1}/30)`);
      await page.waitForTimeout(2000);
    }
  }
  
  if (!frontendReady) {
    throw new Error('❌ Frontend failed to start');
  }
  
  // Wait for admin panel
  let adminReady = false;
  for (let i = 0; i < 30; i++) {
    try {
      await page.goto('http://localhost:3001');
      if (page.url().includes('localhost:3001')) {
        adminReady = true;
        console.log('✅ Admin panel is ready');
        break;
      }
    } catch (error) {
      console.log(`⏳ Waiting for admin panel... (attempt ${i + 1}/30)`);
      await page.waitForTimeout(2000);
    }
  }
  
  if (!adminReady) {
    throw new Error('❌ Admin panel failed to start');
  }
  
  await browser.close();
  console.log('🎉 Global setup completed successfully!');
}

export default globalSetup;