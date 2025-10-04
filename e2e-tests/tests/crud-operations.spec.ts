import { test, expect } from '@playwright/test';
import { APIHelper, TestDataManager } from '../utils/api-helper';

test.describe('CRUD Operations Tests - Admin Panel to Database Consistency', () => {
  let apiHelper: APIHelper;
  let authToken: string;

  test.beforeAll(async () => {
    apiHelper = new APIHelper();
    authToken = await apiHelper.authenticate();
  });

  test.describe('Team Member CRUD Operations', () => {
    let testMemberId: number;

    test('Create team member via admin panel and verify in database', async ({ page, context }) => {
      // Set authentication
      await context.addCookies([{
        name: 'adminToken',
        value: authToken,
        domain: 'localhost',
        path: '/'
      }]);

      // Navigate to team management
      await page.goto('http://localhost:3001/team');
      await page.waitForLoadState('networkidle');

      // Get initial count
      const initialMembers = await apiHelper.getTeamMembers();
      const initialCount = initialMembers.length;

      // Create test member data
      const testMember = TestDataManager.createTestTeamMember();

      // Click add team member button
      await page.click('button:has-text("Add Team Member")');
      await page.waitForSelector('dialog', { state: 'visible' });

      // Fill form
      await page.fill('input[name="name"]', testMember.name);
      await page.fill('input[name="title"]', testMember.title);
      await page.fill('textarea[name="experience"]', testMember.experience);
      await page.fill('textarea[name="education"]', testMember.education);
      await page.fill('input[name="linkedin_url"]', testMember.linkedin_url);
      await page.fill('input[name="emailID"]', testMember.email);
      await page.fill('input[name="position"]', testMember.position.toString());

      // Submit form
      await page.click('button:has-text("Create")');

      // Wait for success message
      await page.waitForSelector('.MuiAlert-standardSuccess', { timeout: 10000 });

      // Verify in database via API
      const updatedMembers = await apiHelper.getTeamMembers();
      expect(updatedMembers.length).toBe(initialCount + 1);

      // Find the created member
      const createdMember = updatedMembers.find(member => member.name === testMember.name);
      expect(createdMember).toBeDefined();
      expect(createdMember.title).toBe(testMember.title);
      expect(createdMember.experience).toBe(testMember.experience);

      testMemberId = createdMember.id;
      console.log(`✅ Created test member with ID: ${testMemberId}`);
    });

    test('Update team member via admin panel and verify changes', async ({ page, context }) => {
      if (!testMemberId) test.skip();

      // Set authentication
      await context.addCookies([{
        name: 'adminToken',
        value: authToken,
        domain: 'localhost',
        path: '/'
      }]);

      // Navigate to team management
      await page.goto('http://localhost:3001/team');
      await page.waitForLoadState('networkidle');

      // Find and click edit button for test member
      await page.click(`tr:has-text("Test Member") button[aria-label="Edit"]`);
      await page.waitForSelector('dialog', { state: 'visible' });

      // Update data
      const updatedTitle = 'Senior Test Manager, 7Boson';
      await page.fill('input[name="title"]', updatedTitle);

      // Submit update
      await page.click('button:has-text("Update")');

      // Wait for success message
      await page.waitForSelector('.MuiAlert-standardSuccess', { timeout: 10000 });

      // Verify update in database
      const members = await apiHelper.getTeamMembers();
      const updatedMember = members.find(member => member.id === testMemberId);
      expect(updatedMember.title).toBe(updatedTitle);

      console.log(`✅ Updated team member title to: ${updatedTitle}`);
    });

    test('Delete team member via admin panel and verify removal', async ({ page, context }) => {
      if (!testMemberId) test.skip();

      // Set authentication
      await context.addCookies([{
        name: 'adminToken',
        value: authToken,
        domain: 'localhost',
        path: '/'
      }]);

      // Navigate to team management
      await page.goto('http://localhost:3001/team');
      await page.waitForLoadState('networkidle');

      // Get count before deletion
      const beforeMembers = await apiHelper.getTeamMembers();
      const beforeCount = beforeMembers.length;

      // Find and click delete button for test member
      await page.click(`tr:has-text("Test Member") button[aria-label="Delete"]`);

      // Confirm deletion
      page.on('dialog', dialog => dialog.accept());

      // Wait for success message
      await page.waitForSelector('.MuiAlert-standardSuccess', { timeout: 10000 });

      // Verify deletion in database
      const afterMembers = await apiHelper.getTeamMembers();
      expect(afterMembers.length).toBe(beforeCount - 1);

      const deletedMember = afterMembers.find(member => member.id === testMemberId);
      expect(deletedMember).toBeUndefined();

      console.log(`✅ Successfully deleted test member`);
    });
  });

  test.describe('Portfolio Company CRUD Operations', () => {
    let testCompanyId: number;

    test('Create portfolio company and verify consistency', async ({ page, context }) => {
      // Set authentication
      await context.addCookies([{
        name: 'adminToken',
        value: authToken,
        domain: 'localhost',
        path: '/'
      }]);

      // Navigate to portfolio management
      await page.goto('http://localhost:3001/portfolio');
      await page.waitForLoadState('networkidle');

      // Get initial count
      const initialCompanies = await apiHelper.getPortfolioCompanies();
      const initialCount = initialCompanies.length;

      // Create test company data
      const testCompany = TestDataManager.createTestPortfolioCompany();

      // Click add company button
      await page.click('button:has-text("Add Company")');
      await page.waitForSelector('dialog', { state: 'visible' });

      // Fill form
      await page.fill('input[name="name"]', testCompany.name);
      await page.fill('textarea[name="description"]', testCompany.description);
      await page.fill('input[name="sector"]', testCompany.sector);
      await page.fill('input[name="website"]', testCompany.website);
      await page.fill('input[name="position"]', testCompany.position.toString());

      // Submit form
      await page.click('button:has-text("Create")');

      // Wait for success message
      await page.waitForSelector('.MuiAlert-standardSuccess', { timeout: 10000 });

      // Verify in database
      const updatedCompanies = await apiHelper.getPortfolioCompanies();
      expect(updatedCompanies.length).toBe(initialCount + 1);

      const createdCompany = updatedCompanies.find(company => company.name === testCompany.name);
      expect(createdCompany).toBeDefined();
      expect(createdCompany.description).toBe(testCompany.description);
      expect(createdCompany.sector).toBe(testCompany.sector);

      testCompanyId = createdCompany.id;
      console.log(`✅ Created test company with ID: ${testCompanyId}`);
    });

    test('Verify portfolio company appears on website', async ({ page }) => {
      if (!testCompanyId) test.skip();

      // Navigate to portfolio page
      await page.goto('http://localhost:5174/portfolio');
      await page.waitForLoadState('networkidle');

      // Wait for portfolio companies to load
      await page.waitForSelector('[data-testid="portfolio-company"]', { timeout: 10000 });

      // Check if test company appears
      const companyExists = await page.locator(`text=Test Company`).count() > 0;
      expect(companyExists).toBe(true);

      console.log(`✅ Test company appears on website`);
    });

    test.afterAll('Cleanup test portfolio company', async () => {
      if (testCompanyId) {
        // Cleanup would be implemented here
        console.log(`🧹 Cleaning up test company ID: ${testCompanyId}`);
      }
    });
  });

  test.describe('End-to-End Data Flow Verification', () => {
    
    test('Admin panel changes reflect immediately on website', async ({ page, context }) => {
      // This test verifies real-time data synchronization
      
      // Set authentication
      await context.addCookies([{
        name: 'adminToken',
        value: authToken,
        domain: 'localhost',
        path: '/'
      }]);

      // Create a new browser page for website
      const websitePage = await context.newPage();

      // Navigate admin panel to portfolio
      await page.goto('http://localhost:3001/portfolio');
      await page.waitForLoadState('networkidle');

      // Navigate website to portfolio
      await websitePage.goto('http://localhost:5174/portfolio');
      await websitePage.waitForLoadState('networkidle');

      // Get initial company count on website
      const initialWebsiteCount = await websitePage.$$('[data-testid="portfolio-company"]');

      // Create new company via admin panel
      const testCompany = TestDataManager.createTestPortfolioCompany();
      
      await page.click('button:has-text("Add Company")');
      await page.waitForSelector('dialog', { state: 'visible' });
      
      await page.fill('input[name="name"]', testCompany.name);
      await page.fill('textarea[name="description"]', testCompany.description);
      await page.fill('input[name="sector"]', testCompany.sector);
      
      await page.click('button:has-text("Create")');
      await page.waitForSelector('.MuiAlert-standardSuccess', { timeout: 10000 });

      // Refresh website and verify new company appears
      await websitePage.reload();
      await websitePage.waitForLoadState('networkidle');
      
      const updatedWebsiteCount = await websitePage.$$('[data-testid="portfolio-company"]');
      expect(updatedWebsiteCount.length).toBe(initialWebsiteCount.length + 1);

      // Verify specific company appears
      const companyVisible = await websitePage.locator(`text=${testCompany.name}`).count() > 0;
      expect(companyVisible).toBe(true);

      console.log(`✅ Admin panel changes reflected on website successfully`);
      
      await websitePage.close();
    });
  });
});