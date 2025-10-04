import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5001/api';

// Universal hook for all page content (admin panel version)
export const usePageContent = (pageSlug) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log(`🔄 usePageContent: Loading content for ${pageSlug}`);
        
        const url = `${API_BASE_URL}/content/${pageSlug}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
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
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
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

// Admin hooks for content management
export const useContentAdmin = (pageSlug, authToken) => {
  const { data, loading, error, refresh } = usePageContent(pageSlug);

  // Get fresh token for each request
  const getAuthToken = () => {
    return authToken || localStorage.getItem('adminToken');
  };

  const updateHero = async (heroData) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      console.log('🔄 Updating hero with token:', token?.substring(0, 20) + '...');
      
      const response = await fetch(`${API_BASE_URL}/content/${pageSlug}/hero`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(heroData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update hero section');
      }

      const result = await response.json();
      await refresh(); // Refresh the data
      return result;
    } catch (err) {
      console.error('❌ Hero update error:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to update hero');
    }
  };

  const addSection = async (sectionData) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`${API_BASE_URL}/content/${pageSlug}/sections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(sectionData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add section');
      }

      const result = await response.json();
      await refresh(); // Refresh the data
      return result;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add section');
    }
  };

  const updateSection = async (sectionId, sectionData) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`${API_BASE_URL}/content/${pageSlug}/sections/${sectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(sectionData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update section');
      }

      const result = await response.json();
      await refresh(); // Refresh the data
      return result;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update section');
    }
  };

  const deleteSection = async (sectionId) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`${API_BASE_URL}/content/${pageSlug}/sections/${sectionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete section');
      }

      await refresh(); // Refresh the data
      return true;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete section');
    }
  };

  const reorderSections = async (sections) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`${API_BASE_URL}/content/${pageSlug}/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ sections })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reorder sections');
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