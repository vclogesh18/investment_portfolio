import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5001/api';

// Hook for fetching branding settings
export const useBranding = () => {
  const [branding, setBranding] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/branding`);
        if (!response.ok) {
          throw new Error(`Failed to fetch branding: ${response.statusText}`);
        }
        const result = await response.json();
        setBranding(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setBranding({});
      } finally {
        setLoading(false);
      }
    };

    fetchBranding();
  }, []);

  const refetch = () => {
    setLoading(true);
    setBranding({});
  };

  return { branding, loading, error, refetch };
};

// Hook for fetching footer links
export const useFooterLinks = () => {
  const [footerLinks, setFooterLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFooterLinks = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/branding/footer-links`);
        if (!response.ok) {
          throw new Error(`Failed to fetch footer links: ${response.statusText}`);
        }
        const result = await response.json();
        setFooterLinks(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setFooterLinks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterLinks();
  }, []);

  const refetch = () => {
    setLoading(true);
    setFooterLinks([]);
  };

  return { footerLinks, loading, error, refetch };
};

// Hook for managing branding settings (admin)
export const useBrandingManager = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateBrandingSetting = async (key, setting_value, media_id) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/branding/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ setting_value, media_id })
      });

      if (!response.ok) {
        throw new Error(`Failed to update branding setting: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateBrandingSetting, loading, error };
};

// Hook for managing footer links (admin)
export const useFooterLinksManager = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createFooterLink = async (footerLink) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/branding/footer-links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(footerLink)
      });

      if (!response.ok) {
        throw new Error(`Failed to create footer link: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateFooterLink = async (id, updates) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/branding/footer-links/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error(`Failed to update footer link: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteFooterLink = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/branding/footer-links/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete footer link: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createFooterLink, updateFooterLink, deleteFooterLink, loading, error };
};