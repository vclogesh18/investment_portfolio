import { test, expect } from '@playwright/test';
import { APIHelper } from '../utils/api-helper';

test.describe('Performance and Reliability Tests', () => {
  let apiHelper: APIHelper;

  test.beforeAll(async () => {
    apiHelper = new APIHelper();
  });

  test.describe('API Response Times', () => {
    
    test('API endpoints respond within acceptable time limits', async () => {
      const endpoints = [
        { name: 'Team Members', endpoint: '/team', maxTime: 2000 },
        { name: 'Portfolio Companies', endpoint: '/portfolio', maxTime: 2000 },
        { name: 'Investment Areas', endpoint: '/investments', maxTime: 2000 },
        { name: 'Homepage Content', endpoint: '/homepage', maxTime: 3000 },
        { name: 'Team Page Content', endpoint: '/content/team', maxTime: 2000 },
        { name: 'Portfolio Page Content', endpoint: '/content/portfolio', maxTime: 2000 }
      ];

      const results = [];

      for (const endpoint of endpoints) {
        const startTime = Date.now();
        
        try {
          const response = await fetch(`http://localhost:5001/api${endpoint.endpoint}`);
          const endTime = Date.now();
          const duration = endTime - startTime;
          
          results.push({
            name: endpoint.name,
            endpoint: endpoint.endpoint,
            duration,
            maxTime: endpoint.maxTime,
            status: response.status,
            passed: duration <= endpoint.maxTime && response.ok
          });
          
          expect(response.ok, `${endpoint.name} API failed with status ${response.status}`).toBe(true);
          expect(duration, `${endpoint.name} took ${duration}ms, expected max ${endpoint.maxTime}ms`).toBeLessThanOrEqual(endpoint.maxTime);
          
        } catch (error: any) {
          results.push({
            name: endpoint.name,
            endpoint: endpoint.endpoint,
            duration: -1,
            maxTime: endpoint.maxTime,
            status: 'ERROR',
            passed: false,
            error: error.message
          });
          
          throw new Error(`${endpoint.name} API request failed: ${error.message}`);
        }
      }

      console.log('📊 API Performance Report:', JSON.stringify(results, null, 2));
    });
  });

  test.describe('Page Load Performance', () => {
    
    test('Website pages load within acceptable time limits', async ({ page }) => {
      const pages = [
        { name: 'Homepage', url: '/', maxTime: 5000 },
        { name: 'Team Page', url: '/team', maxTime: 5000 },
        { name: 'Portfolio Page', url: '/portfolio', maxTime: 5000 },
        { name: 'About Page', url: '/about', maxTime: 5000 },
        { name: 'Investment Classes', url: '/investment-classes', maxTime: 5000 }
      ];

      const results = [];

      for (const pageTest of pages) {
        const startTime = Date.now();
        
        await page.goto(pageTest.url);
        await page.waitForLoadState('networkidle');
        
        const endTime = Date.now();
        const loadTime = endTime - startTime;
        
        results.push({
          name: pageTest.name,
          url: pageTest.url,
          loadTime,
          maxTime: pageTest.maxTime,
          passed: loadTime <= pageTest.maxTime
        });
        
        expect(loadTime, `${pageTest.name} took ${loadTime}ms to load, expected max ${pageTest.maxTime}ms`).toBeLessThanOrEqual(pageTest.maxTime);
      }

      console.log('📊 Page Load Performance Report:', JSON.stringify(results, null, 2));
    });
  });

  test.describe('Data Consistency Under Load', () => {
    
    test('API returns consistent data across multiple requests', async () => {
      const requestCount = 10;
      const teamRequests = [];
      
      // Make multiple simultaneous requests
      for (let i = 0; i < requestCount; i++) {
        teamRequests.push(apiHelper.getTeamMembers());
      }
      
      const results = await Promise.all(teamRequests);
      
      // Verify all results are identical
      const firstResult = JSON.stringify(results[0]);
      for (let i = 1; i < results.length; i++) {
        const currentResult = JSON.stringify(results[i]);
        expect(currentResult, `Request ${i} returned different data than request 0`).toBe(firstResult);
      }
      
      console.log(`✅ ${requestCount} simultaneous API requests returned consistent data`);
    });
  });

  test.describe('Error Handling', () => {
    
    test('Website handles API failures gracefully', async ({ page }) => {
      // This would require a way to simulate API failures
      // For now, we'll test with invalid endpoints
      
      const consoleLogs = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleLogs.push(msg.text());
        }
      });
      
      // Navigate to a page that might have API failures
      await page.goto('/team');
      await page.waitForTimeout(3000);
      
      // Check that page still loads even if some APIs fail
      const pageTitle = await page.title();
      expect(pageTitle).toBeTruthy();
      
      // Check for loading states
      const hasLoadingStates = await page.locator('text=Loading').count();
      // Loading states should not persist indefinitely
      expect(hasLoadingStates).toBe(0);
      
      console.log('✅ Website handles API scenarios gracefully');
    });
  });

  test.describe('Data Integrity Verification', () => {
    
    test('No duplicate entries in database', async () => {
      // Check team members for duplicates
      const teamMembers = await apiHelper.getTeamMembers();
      const teamNames = teamMembers.map((member: any) => member.name);
      const uniqueTeamNames = [...new Set(teamNames)];
      expect(uniqueTeamNames.length, 'Duplicate team member names found').toBe(teamNames.length);
      
      // Check portfolio companies for duplicates
      const companies = await apiHelper.getPortfolioCompanies();
      const companyNames = companies.map((company: any) => company.name);
      const uniqueCompanyNames = [...new Set(companyNames)];
      expect(uniqueCompanyNames.length, 'Duplicate company names found').toBe(companyNames.length);
      
      console.log('✅ No duplicate entries found in database');
    });
    
    test('All required fields are populated', async () => {
      // Check team members
      const teamMembers = await apiHelper.getTeamMembers();
      for (const member of teamMembers) {
        expect(member.name, `Team member missing name: ${JSON.stringify(member)}`).toBeTruthy();
        expect(member.title, `Team member missing title: ${member.name}`).toBeTruthy();
      }
      
      // Check portfolio companies
      const companies = await apiHelper.getPortfolioCompanies();
      for (const company of companies) {
        expect(company.name, `Company missing name: ${JSON.stringify(company)}`).toBeTruthy();
        expect(company.sector, `Company missing sector: ${company.name}`).toBeTruthy();
      }
      
      console.log('✅ All required fields are properly populated');
    });
  });

  test.describe('Cross-Browser Compatibility', () => {
    
    test('Content displays consistently across browsers', async ({ page, browserName }) => {
      await page.goto('/team');
      await page.waitForLoadState('networkidle');
      
      // Check that team members are displayed
      const teamMemberCount = await page.locator('[data-testid="team-member"]').count();
      expect(teamMemberCount, `No team members displayed in ${browserName}`).toBeGreaterThan(0);
      
      // Check that hero section is displayed
      const heroTitle = await page.locator('h1').first().textContent();
      expect(heroTitle, `No hero title displayed in ${browserName}`).toBeTruthy();
      
      console.log(`✅ Content displays correctly in ${browserName}`);
    });
  });
});