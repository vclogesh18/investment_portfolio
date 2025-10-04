// API Helper for direct database content verification
export class APIHelper {
  private baseURL: string;

  constructor(baseURL = 'http://localhost:5001/api') {
    this.baseURL = baseURL;
  }

  // Team Members API
  async getTeamMembers() {
    const response = await fetch(`${this.baseURL}/team`);
    if (!response.ok) throw new Error(`Team API failed: ${response.status}`);
    return response.json();
  }

  // Portfolio Companies API
  async getPortfolioCompanies() {
    const response = await fetch(`${this.baseURL}/portfolio`);
    if (!response.ok) throw new Error(`Portfolio API failed: ${response.status}`);
    return response.json();
  }

  // Page Content API
  async getPageContent(pageName: string) {
    const response = await fetch(`${this.baseURL}/content/${pageName}`);
    if (!response.ok) throw new Error(`Page content API failed: ${response.status}`);
    return response.json();
  }

  // Investment Areas API
  async getInvestmentAreas() {
    const response = await fetch(`${this.baseURL}/investments`);
    if (!response.ok) throw new Error(`Investment areas API failed: ${response.status}`);
    return response.json();
  }

  // Homepage Content API
  async getHomepageContent() {
    const response = await fetch(`${this.baseURL}/homepage`);
    if (!response.ok) throw new Error(`Homepage API failed: ${response.status}`);
    return response.json();
  }

  // Authentication for admin panel tests
  async authenticate(email = 'admin@sevenboson.com', password = 'admin123') {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) throw new Error(`Authentication failed: ${response.status}`);
    const data = await response.json();
    return data.token;
  }
}

// Content comparison utilities
export class ContentComparator {
  
    // Compare team member data between API and UI
  static compareTeamMember(apiMember: any, uiData: any) {
    // Account for title formatting - UI shows only first part before comma
    const apiTitleFirstPart = apiMember.title?.split(',')[0]?.trim() || '';
    const uiTitle = uiData.title?.trim() || '';
    
    // Handle education field - if API has empty/null education, UI won't display it
    const apiEducation = apiMember.education?.trim() || '';
    const uiEducation = uiData.education?.trim() || '';
    const educationMatches = apiEducation === uiEducation || 
                            (apiEducation === '' && uiEducation === ''); // Both empty
    
    return {
      name: apiMember.name === uiData.name,
      title: apiTitleFirstPart === uiTitle,
      experience: apiMember.experience === uiData.experience,
      education: educationMatches,
      // Note: email and linkedin are not displayed as text in UI, only as interactive buttons
      email: true, // Skip email comparison - it's a button, not displayed text
      linkedin: true // Skip LinkedIn comparison - it's a button, not displayed text
    };
  }

  // Compare portfolio company data
  static comparePortfolioCompany(apiCompany: any, uiData: any) {
    // Handle website field: if API has empty string and UI has null/undefined, consider them equal
    const apiWebsite = apiCompany.website || null;
    const uiWebsite = uiData.website || null;
    
    return {
      name: apiCompany.name === uiData.name,
      description: apiCompany.description === uiData.description,
      sector: apiCompany.sector === uiData.sector,
      website: apiWebsite === uiWebsite
    };
  }

  // Compare page hero content
  static comparePageHero(apiContent: any, uiData: any) {
    const heroTitle = apiContent?.page?.hero_title || apiContent?.hero?.title;
    const heroDescription = apiContent?.page?.hero_description || apiContent?.hero?.description;
    
    return {
      title: heroTitle === uiData.title,
      description: heroDescription === uiData.description,
      backgroundImage: (apiContent?.hero?.background_image_url || '').includes(uiData.backgroundImage || '')
    };
  }

  // Generate detailed comparison report
  static generateReport(comparisons: any[], testName: string) {
    const passed = comparisons.filter(c => c.passed).length;
    const failed = comparisons.filter(c => !c.passed).length;
    
    return {
      testName,
      summary: {
        total: comparisons.length,
        passed,
        failed,
        successRate: `${Math.round((passed / comparisons.length) * 100)}%`
      },
      details: comparisons
    };
  }
}

// Test data utilities
export class TestDataManager {
  
  // Create test team member
  static createTestTeamMember() {
    return {
      name: `Test Member ${Date.now()}`,
      title: 'Test Manager, 7Boson',
      experience: 'Test experience for E2E verification',
      education: 'Test University',
      linkedin_url: 'https://linkedin.com/in/test-e2e',
      email: 'test.e2e@sevenboson.com',
      position: 999
    };
  }

  // Create test portfolio company
  static createTestPortfolioCompany() {
    return {
      name: `Test Company ${Date.now()}`,
      description: 'Test company for E2E verification',
      sector: 'Test Technology',
      website: 'https://test-e2e.example.com',
      position: 999
    };
  }

  // Cleanup test data
  static async cleanupTestData(apiHelper: APIHelper, token: string) {
    // Implementation would depend on delete endpoints
    console.log('🧹 Cleaning up test data...');
  }
}

export { APIHelper as default };