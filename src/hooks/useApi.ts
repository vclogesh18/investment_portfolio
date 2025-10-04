import { useState, useEffect, useMemo } from 'react';
import { apiCache } from '../utils/apiCache';

const API_BASE_URL = 'http://localhost:5001/api';

// Generic hook for fetching data
export const useApi = <T>(endpoint: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = `${API_BASE_URL}${endpoint}`;
        const result = await apiCache.fetch<T[]>(url);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
};

// Type definitions for our data structures
export interface TeamMember {
  id: number;
  name: string;
  title: string;
  experience: string;
  education: string;
  linkedin_url?: string;
  email?: string;
  image_url?: string;
  image?: string; // Added this field for backend image path
  image_id?: number;
  image_alt?: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InvestmentArea {
  id: number;
  title: string;
  description: string;
  icon: string;
  category: 'pillar' | 'sector';
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PortfolioCompany {
  id: number;
  name: string;
  description: string;
  website?: string;
  sector: string;
  logo?: string;
  logo_alt?: string;
  position?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Specific hooks for each data type
export const useTeamMembers = () => {
  return useApi<TeamMember>('/team');
};

export const useInvestmentAreas = () => {
  return useApi<InvestmentArea>('/investments');
};

export const usePortfolioCompanies = () => {
  return useApi<PortfolioCompany>('/portfolio');
};

// Hook for homepage content (returns object, not array)
export const useHomepageContent = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('🏠 useHomepageContent: Starting API call');
        
        const url = `${API_BASE_URL}/homepage`;
        const result = await apiCache.fetch<any>(url);
        
        if (!cancelled) {
          setData(result);
          setError(null);
          console.log('✅ useHomepageContent: Data loaded successfully');
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'An error occurred');
          setData(null);
          console.error('❌ useHomepageContent: Error loading data', err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
      console.log('🧹 useHomepageContent: Cleanup called');
    };
  }, []);

  return { data, loading, error };
};

// Helper functions to filter investment areas
export const useInvestmentPillars = () => {
  const { data, loading, error } = useInvestmentAreas();
  
  const pillars = data
    .filter(item => item.category === 'pillar')
    .sort((a, b) => a.position - b.position);
    
  return { data: pillars, loading, error };
};

export const useInvestmentSectors = () => {
  const { data, loading, error } = useInvestmentAreas();
  
  const sectors = data
    .filter(item => item.category === 'sector')
    .sort((a, b) => a.position - b.position);
    
  return { data: sectors, loading, error };
};

// Combined hook to fetch both pillars and sectors with a single API call
export const useInvestmentAreasComplete = () => {
  const [data, setData] = useState<InvestmentArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('🚀 useInvestmentAreasComplete: Starting API call');
        
        const url = `${API_BASE_URL}/investments`;
        const result = await apiCache.fetch<InvestmentArea[]>(url);
        
        // Only update state if the effect hasn't been cancelled
        if (!cancelled) {
          setData(result);
          setError(null);
          console.log('✅ useInvestmentAreasComplete: Data loaded successfully');
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'An error occurred');
          setData([]);
          console.error('❌ useInvestmentAreasComplete: Error loading data', err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      cancelled = true;
      console.log('🧹 useInvestmentAreasComplete: Cleanup called');
    };
  }, []); // Empty dependency array since we only want to fetch once

  // Use useMemo to prevent re-filtering on every render
  const pillars = useMemo(() => 
    data
      .filter(item => item.category === 'pillar')
      .sort((a, b) => a.position - b.position),
    [data]
  );
    
  const sectors = useMemo(() => 
    data
      .filter(item => item.category === 'sector')
      .sort((a, b) => a.position - b.position),
    [data]
  );
    
  return { 
    pillars, 
    sectors, 
    loading, 
    error,
    data // original data if needed
  };
};

// Hook for page content (returns object, not array)
export const usePageContent = (pageName: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log(`📄 usePageContent: Fetching ${pageName} page content`);
        
        const url = `${API_BASE_URL}/content/${pageName}`;
        const result = await apiCache.fetch<any>(url);
        
        if (!cancelled) {
          setData(result);
          setError(null);
          console.log(`✅ usePageContent: ${pageName} page content loaded successfully`);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'An error occurred');
          setData(null);
          console.error(`❌ usePageContent: Error loading ${pageName} page content`, err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
      console.log(`🧹 usePageContent: Cleanup called for ${pageName}`);
    };
  }, [pageName]);

  return { data, loading, error };
};