import { useState, useEffect } from 'react';
import { Branding, FooterLink } from '../types';

const API_BASE_URL = 'http://localhost:5001/api';

// Hook for fetching branding settings (frontend)
export const useBranding = () => {
  const [branding, setBranding] = useState<Branding>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return { branding, loading, error };
};

// Hook for fetching footer links (frontend)
export const useFooterLinks = () => {
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return { footerLinks, loading, error };
};