import { useState, useEffect } from 'react';
import { apiCache } from '../utils/apiCache';

const API_BASE_URL = 'http://localhost:5001/api';

// Universal hook for all page content
export const usePageContent = (pageSlug: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log(`🔄 usePageContent: Loading content for ${pageSlug}`);
        
        const url = `${API_BASE_URL}/content/${pageSlug}`;
        const result = await apiCache.fetch<any>(url);
        
        if (!cancelled) {
          setData(result);
          setError(null);
          console.log(`✅ usePageContent: Content loaded for ${pageSlug}`);
        }
      } catch (err) {
        if (!cancelled) {
          const errorMessage = err instanceof Error ? err.message : 'An error occurred';
          setError(errorMessage);
          setData(null);
          console.error(`❌ usePageContent: Error loading ${pageSlug}`, err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (pageSlug) {
      fetchData();
    }

    return () => {
      cancelled = true;
      console.log(`🧹 usePageContent: Cleanup for ${pageSlug}`);
    };
  }, [pageSlug]);

  // Refresh function for admin operations
  const refresh = async () => {
    try {
      setLoading(true);
      const url = `${API_BASE_URL}/content/${pageSlug}`;
      apiCache.clearUrl(url); // Clear cache
      const result = await apiCache.fetch<any>(url);
      setData(result);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { 
    data, 
    loading, 
    error, 
    refresh,
    // Convenience accessors
    page: data?.page || null,
    hero: data?.hero || null,
    sections: data?.sections || [],
    features: data?.features || [],
    contactInfo: data?.contact_info || [],
    formConfig: data?.form_config || []
  };
};

// Backward compatibility hooks - use the unified approach
export const useHomepageContent = () => {
  const result = usePageContent('home');
  
  return {
    data: result.data,
    loading: result.loading,
    error: result.error,
    refresh: result.refresh
  };
};

export const useAboutContent = () => {
  return usePageContent('about');
};

export const useContactContent = () => {
  return usePageContent('contact');
};

export const usePortfolioContent = () => {
  return usePageContent('portfolio');
};

export const useApplyContent = () => {
  return usePageContent('apply');
};

export const useInvestmentClassesContent = () => {
  return usePageContent('investment-classes');
};

export const useTeamContent = () => {
  return usePageContent('team');
};

// Admin hooks for content management
export const useContentAdmin = (pageSlug: string, authToken?: string) => {
  const { data, loading, error, refresh } = usePageContent(pageSlug);

  const updateHero = async (heroData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/content/${pageSlug}/hero`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(heroData)
      });

      if (!response.ok) {
        throw new Error('Failed to update hero section');
      }

      const result = await response.json();
      await refresh(); // Refresh the data
      return result;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update hero');
    }
  };

  const addSection = async (sectionData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/content/${pageSlug}/sections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(sectionData)
      });

      if (!response.ok) {
        throw new Error('Failed to add section');
      }

      const result = await response.json();
      await refresh(); // Refresh the data
      return result;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add section');
    }
  };

  const updateSection = async (sectionId: number, sectionData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/content/${pageSlug}/sections/${sectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(sectionData)
      });

      if (!response.ok) {
        throw new Error('Failed to update section');
      }

      const result = await response.json();
      await refresh(); // Refresh the data
      return result;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update section');
    }
  };

  const deleteSection = async (sectionId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/content/${pageSlug}/sections/${sectionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete section');
      }

      await refresh(); // Refresh the data
      return true;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete section');
    }
  };

  const reorderSections = async (sections: Array<{id: number, position: number}>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/content/${pageSlug}/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ sections })
      });

      if (!response.ok) {
        throw new Error('Failed to reorder sections');
      }

      await refresh(); // Refresh the data
      return true;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to reorder sections');
    }
  };

  return {
    // Data access
    data,
    loading,
    error,
    refresh,
    page: data?.page || null,
    hero: data?.hero || null,
    sections: data?.sections || [],
    features: data?.features || [],
    contactInfo: data?.contact_info || [],
    formConfig: data?.form_config || [],

    // Admin operations
    updateHero,
    addSection,
    updateSection,
    deleteSection,
    reorderSections
  };
};