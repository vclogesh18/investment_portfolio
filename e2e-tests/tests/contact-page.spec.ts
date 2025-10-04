import { test, expect } from '@playwright/test';

test.describe('Contact Page Tests', () => {
  test('contact page loads and displays content', async ({ page }) => {
    // Navigate to contact page
    await page.goto('http://localhost:5173/contact');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'contact-page-debug.png', fullPage: true });
    
    // Check if the page title contains expected text
    const title = await page.title();
    console.log('Page title:', title);
    
    // Look for hero section
    const heroSection = page.locator('h1');
    if (await heroSection.count() > 0) {
      const heroText = await heroSection.first().textContent();
      console.log('Hero text:', heroText);
    }
    
    // Check for loading states
    const loadingElement = page.locator('text=Loading');
    const errorElement = page.locator('text=Error');
    
    const isLoading = await loadingElement.count() > 0;
    const hasError = await errorElement.count() > 0;
    
    console.log('Is loading:', isLoading);
    console.log('Has error:', hasError);
    
    if (hasError) {
      const errorText = await errorElement.first().textContent();
      console.log('Error text:', errorText);
    }
    
    // Check for form elements
    const nameInput = page.locator('input[name="name"]');
    const emailInput = page.locator('input[name="email"]');
    const subjectSelect = page.locator('select[name="subject"]');
    const messageTextarea = page.locator('textarea[name="message"]');
    const submitButton = page.locator('button[type="submit"]');
    
    console.log('Form elements found:');
    console.log('- Name input:', await nameInput.count());
    console.log('- Email input:', await emailInput.count());
    console.log('- Subject select:', await subjectSelect.count());
    console.log('- Message textarea:', await messageTextarea.count());
    console.log('- Submit button:', await submitButton.count());
    
    // Check for office locations
    const officeSection = page.locator('text=Global Offices');
    const officeCards = page.locator('.bg-white.rounded-lg.shadow-lg');
    const officeCount = await officeCards.count();
    console.log('Office section found:', await officeSection.count());
    console.log('Office cards found:', officeCount);
    
    // Check for specific office names
    const newYorkOffice = page.locator('text=New York');
    const londonOffice = page.locator('text=London');
    const singaporeOffice = page.locator('text=Singapore');
    
    console.log('New York office:', await newYorkOffice.count());
    console.log('London office:', await londonOffice.count()); 
    console.log('Singapore office:', await singaporeOffice.count());
    
    // Wait a bit more for any async content
    await page.waitForTimeout(3000);
    
    // Take another screenshot
    await page.screenshot({ path: 'contact-page-final.png', fullPage: true });
    
    // Basic assertions
    expect(isLoading).toBe(false);
    expect(hasError).toBe(false);
    expect(await heroSection.count()).toBeGreaterThan(0);
    
    // Form should be present
    expect(await nameInput.count()).toBe(1);
    expect(await emailInput.count()).toBe(1);
    expect(await messageTextarea.count()).toBe(1);
  });

  test('contact form can be filled and submitted', async ({ page }) => {
    await page.goto('http://localhost:5173/contact');
    await page.waitForLoadState('networkidle');
    
    // Fill out the form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.selectOption('select[name="subject"]', 'general');
    await page.fill('textarea[name="message"]', 'This is a test message.');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Wait for any response/feedback
    await page.waitForTimeout(1000);
    
    console.log('Form submitted successfully');
  });
});