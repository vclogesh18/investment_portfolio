import { test, expect, Page } from '@playwright/test';
import { APIHelper, ContentComparator } from '../utils/api-helper';

test.describe('Content Consistency Tests - Website vs Admin Panel', () => {
  let apiHelper: APIHelper;

  test.beforeAll(async () => {
    apiHelper = new APIHelper();
  });

  test.describe('Team Page Content Consistency', () => {
    
    test('Team page hero content matches database', async ({ page }) => {
      // Get data from API
      const pageContent = await apiHelper.getPageContent('team');
      
      // Navigate to team page
      await page.goto('/team');
      await page.waitForLoadState('networkidle');
      
      // Extract hero content from UI
      const heroTitle = await page.locator('h1').first().textContent();
      const heroDescription = await page.locator('[data-testid="hero-description"]').textContent();
      const backgroundImage = await page.locator('section').first().getAttribute('style');
      
      // Compare content
      const comparison = ContentComparator.comparePageHero(pageContent, {
        title: heroTitle?.trim(),
        description: heroDescription?.trim(),
        backgroundImage: backgroundImage || ''
      });
      
      // Assertions
      expect(comparison.title, `Title mismatch: API="${pageContent?.page?.hero_title || pageContent?.hero?.title}" vs UI="${heroTitle}"`).toBe(true);
      expect(comparison.description, `Description mismatch`).toBe(true);
      
      console.log('✅ Team page hero content verification passed');
    });

    test('Team members data consistency', async ({ page }) => {
      // Get team members from API
      const apiTeamMembers = await apiHelper.getTeamMembers();
      
      // Navigate to team page
      await page.goto('/team');
      await page.waitForLoadState('networkidle');
      
      // Wait for team members to load
      await page.waitForSelector('[data-testid="team-member"]', { timeout: 10000 });
      
      // Extract team member data from UI
      const uiTeamMembers = await page.$$eval('[data-testid="team-member"]', (elements) => {
        return elements.map(el => ({
          name: el.querySelector('h3')?.textContent?.trim(),
          title: el.querySelector('[data-testid="member-title"]')?.textContent?.trim(),
          experience: el.querySelector('[data-testid="member-experience"]')?.textContent?.trim(),
          education: el.querySelector('[data-testid="member-education"]')?.textContent?.trim()
        }));
      });
      
      // Compare data
      const comparisons = [];
      for (let i = 0; i < Math.min(apiTeamMembers.length, uiTeamMembers.length); i++) {
        const apiMember = apiTeamMembers[i];
        const uiMember = uiTeamMembers[i];
        
        const comparison = ContentComparator.compareTeamMember(apiMember, uiMember);
        comparisons.push({
          member: apiMember.name,
          passed: Object.values(comparison).every(Boolean),
          details: comparison
        });
      }
      
      // Generate report
      const report = ContentComparator.generateReport(comparisons, 'Team Members Data Consistency');
      console.log('📊 Team Members Report:', JSON.stringify(report, null, 2));
      
      // Assertions
      expect(apiTeamMembers.length).toBeGreaterThan(0);
      expect(uiTeamMembers.length).toBeGreaterThan(0);
      expect(apiTeamMembers.length).toBe(uiTeamMembers.length);
      
      const failedComparisons = comparisons.filter(c => !c.passed);
      expect(failedComparisons.length, `${failedComparisons.length} team members have data mismatches`).toBe(0);
    });
  });

  test.describe('Portfolio Page Content Consistency', () => {
    
    test('Portfolio page hero content matches database', async ({ page }) => {
      // Get data from API
      const pageContent = await apiHelper.getPageContent('portfolio');
      
      // Navigate to portfolio page
      await page.goto('/portfolio');
      await page.waitForLoadState('networkidle');
      
      // Extract hero content from UI
      const heroTitle = await page.locator('h1').first().textContent();
      const heroDescription = await page.locator('section p').first().textContent();
      
      // Compare content
      const comparison = ContentComparator.comparePageHero(pageContent, {
        title: heroTitle?.trim(),
        description: heroDescription?.trim()
      });
      
      // Assertions
      expect(comparison.title, `Portfolio title mismatch`).toBe(true);
      expect(comparison.description, `Portfolio description mismatch`).toBe(true);
      
      console.log('✅ Portfolio page hero content verification passed');
    });

    test('Portfolio companies data consistency', async ({ page }) => {
      // Get portfolio companies from API
      const apiCompanies = await apiHelper.getPortfolioCompanies();
      
      // Navigate to portfolio page
      await page.goto('/portfolio');
      await page.waitForLoadState('networkidle');
      
      // Wait for portfolio companies to load
      await page.waitForSelector('[data-testid="portfolio-company"]', { timeout: 10000 });
      
      // Extract company data from UI
      const uiCompanies = await page.$$eval('[data-testid="portfolio-company"]', (elements) => {
        return elements.map(el => ({
          name: el.querySelector('h3')?.textContent?.trim(),
          description: el.querySelector('[data-testid="company-description"]')?.textContent?.trim(),
          sector: el.querySelector('[data-testid="company-sector"]')?.textContent?.trim(),
          website: el.querySelector('a')?.getAttribute('href')
        }));
      });
      
      // Compare data
      const comparisons = [];
      for (let i = 0; i < Math.min(apiCompanies.length, uiCompanies.length); i++) {
        const apiCompany = apiCompanies[i];
        const uiCompany = uiCompanies[i];
        
        const comparison = ContentComparator.comparePortfolioCompany(apiCompany, uiCompany);
        comparisons.push({
          company: apiCompany.name,
          passed: Object.values(comparison).every(Boolean),
          details: comparison
        });
      }
      
      // Generate report
      const report = ContentComparator.generateReport(comparisons, 'Portfolio Companies Data Consistency');
      console.log('📊 Portfolio Companies Report:', JSON.stringify(report, null, 2));
      
      // Assertions
      expect(apiCompanies.length).toBeGreaterThan(0);
      expect(uiCompanies.length).toBeGreaterThan(0);
      expect(apiCompanies.length).toBe(uiCompanies.length);
      
      const failedComparisons = comparisons.filter(c => !c.passed);
      expect(failedComparisons.length, `${failedComparisons.length} companies have data mismatches`).toBe(0);
    });
  });

  test.describe('Homepage Content Consistency', () => {
    
    test('Homepage investment pillars match database', async ({ page }) => {
      // Get homepage content from API
      const homepageContent = await apiHelper.getHomepageContent();
      
      // Navigate to homepage
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Wait for investment pillars to load with a more flexible approach
      try {
        await page.waitForSelector('[data-testid="investment-pillar"]', { timeout: 15000 });
      } catch (error) {
        // If pillars don't load, check if there are any errors on the page
        const pageContent = await page.content();
        console.log('🔍 Homepage content sample:', pageContent.substring(0, 500));
        
        // Try waiting for any pillar content
        await page.waitForSelector('h3', { timeout: 5000 });
      }
      
      // Extract pillars from UI
      const uiPillars = await page.$$eval('[data-testid="investment-pillar"]', (elements) => {
        return elements.map(el => ({
          title: el.querySelector('h3')?.textContent?.trim(),
          description: el.querySelector('p')?.textContent?.trim()
        }));
      });
      
      // Compare with API data
      const apiPillars = homepageContent?.pillars || [];
      
      expect(uiPillars.length).toBe(apiPillars.length);
      
      for (let i = 0; i < apiPillars.length; i++) {
        expect(uiPillars[i].title).toBe(apiPillars[i].title);
        expect(uiPillars[i].description).toBe(apiPillars[i].description);
      }
      
      console.log('✅ Homepage investment pillars verification passed');
    });
  });

  test.describe('Admin Panel Data Integrity', () => {
    
    test('Admin panel displays same team data as website', async ({ page, context }) => {
      // Authenticate and get token
      const token = await apiHelper.authenticate();
      
      // Navigate to admin panel and inject the token into localStorage
      await page.goto('http://localhost:3001/login');
      
      // Add token to localStorage
      await page.addInitScript(token => {
        localStorage.setItem('adminToken', token);
      }, token);
      
      // Navigate to admin panel team management - should be authenticated now
      await page.goto('http://localhost:3001/team');
      await page.waitForLoadState('networkidle');
      
      // Wait for loading to complete - look for the actual data, not just the loading state
      await page.waitForFunction(() => {
        const loadingElement = document.querySelector('[role="progressbar"], .loading');
        const tableRows = document.querySelectorAll('table tbody tr');
        return !loadingElement && tableRows.length > 0;
      }, { timeout: 15000 });
      
      // Additional wait for Material-UI table to fully render
      await page.waitForTimeout(1000);
      
      // Extract team data from admin panel - use more robust selectors
      const adminTeamData = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('table tbody tr'));
        return rows.map(row => {
          const cells = row.querySelectorAll('td');
          if (cells.length >= 2) {
            const nameText = cells[0]?.textContent?.trim() || '';
            const titleText = cells[1]?.textContent?.trim() || '';
            
            // Clean up potential duplicate text (e.g., "CChet White" -> "Chet White")
            const cleanName = nameText.replace(/^(.)\1+/, '$1');
            const cleanTitle = titleText.replace(/^(.)\1+/, '$1');
            
            return {
              name: cleanName,
              title: cleanTitle
            };
          }
          return null;
        }).filter(item => item !== null && item.name !== '');
      });
      
      console.log('Admin panel team data extracted:', adminTeamData);
      
      // Get team data from API
      const apiTeamMembers = await apiHelper.getTeamMembers();
      console.log('API team members count:', apiTeamMembers.length);
      
      // Ensure we have data from both sources
      expect(adminTeamData.length).toBeGreaterThan(0);
      expect(apiTeamMembers.length).toBeGreaterThan(0);
      
      // Compare counts
      expect(adminTeamData.length).toBe(apiTeamMembers.length);
      
      // Compare data integrity
      for (let i = 0; i < adminTeamData.length; i++) {
        const adminMember = adminTeamData[i];
        if (!adminMember) continue;
        
        const apiMember = apiTeamMembers.find((member: any) => member.name === adminMember.name);
        
        expect(apiMember, `Team member "${adminMember.name}" not found in API`).toBeDefined();
        expect(adminMember.name).toBe(apiMember.name);
      }
      
      console.log('✅ Admin panel team data integrity verification passed');
    });
  });
});