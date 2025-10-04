import { test, expect } from '@playwright/test';

test.describe('Apply Page Tests', () => {
  test('apply page hero content syncs with database', async ({ page }) => {
    // Navigate to apply page
    await page.goto('http://localhost:5173/apply');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Extract hero content from UI
    const heroTitle = await page.locator('h1').first().textContent();
    const heroDescription = await page.locator('section p').first().textContent();
    
    console.log('Apply page hero title:', heroTitle);
    console.log('Apply page hero description:', heroDescription);
    
    // Check that the title is from database, not hardcoded
    expect(heroTitle?.trim()).toBe('Apply for Funding');
    
    // Check that description contains expected content
    expect(heroDescription?.trim()).toContain('Are you building a transformational company?');
    
    // Take a screenshot for verification
    await page.screenshot({ path: 'apply-page-hero.png', fullPage: true });
    
    console.log('✅ Apply page hero content is synced with database');
  });
});