import { useState, useEffect } from 'react';
import { apiCache } from '../utils/apiCache';

const API_BASE_URL = 'http://localhost:5001/api';

// Media item interface
interface MediaItem {
  id: number;
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  alt_text: string;
  category: string;
  created_at: string;
  updated_at: string;
}

interface MediaResponse {
  media: MediaItem[];
  total: number;
  page: number;
  totalPages: number;
}

// Hook for fetching media items
export const useMedia = (category: string | null = null) => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        const url = category 
          ? `${API_BASE_URL}/media/public?category=${category}`
          : `${API_BASE_URL}/media/public`;
        
        const result = await apiCache.fetch<MediaResponse>(url);
        setMedia(result.media || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setMedia([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [category]);

  return { media, loading, error };
};

// Function to get media item by filename (useful for legacy compatibility)
export const getMediaByFilename = async (filename: string): Promise<string | null> => {
  try {
    const url = `${API_BASE_URL}/media/public`;
    const result = await apiCache.fetch<MediaResponse>(url);
    const mediaItem = result.media?.find((item: MediaItem) => 
      item.filename === filename || 
      item.original_name === filename
    );
    return mediaItem?.file_path || null;
  } catch (error) {
    console.error('Error fetching media by filename:', error);
    return null;
  }
};

// Function to get media items by category (non-hook version)
export const getMediaByCategory = async (category: string): Promise<MediaItem[]> => {
  try {
    const url = `${API_BASE_URL}/media/public?category=${category}`;
    const result = await apiCache.fetch<MediaResponse>(url);
    return result.media || [];
  } catch (error) {
    console.error('Error fetching media by category:', error);
    return [];
  }
};

// Create a media map for easy lookup
export const createMediaMap = (mediaItems: MediaItem[]): Record<string, string> => {
  const map: Record<string, string> = {};
  mediaItems.forEach((item: MediaItem) => {
    // Map by filename without extension
    const nameWithoutExt = item.filename.replace(/\.[^/.]+$/, '');
    map[nameWithoutExt] = item.file_path;
    
    // Map by full filename
    map[item.filename] = item.file_path;
    
    // Map by original name
    if (item.original_name) {
      map[item.original_name] = item.file_path;
      const originalWithoutExt = item.original_name.replace(/\.[^/.]+$/, '');
      map[originalWithoutExt] = item.file_path;
    }
  });
  return map;
};

// Hook specifically for team member images
export const useTeamMedia = () => {
  const { media, loading, error } = useMedia('team');
  
  const teamImageMap = media.reduce((map: Record<string, string>, item: MediaItem) => {
    // Create full URL for the image
    const imageUrl = `${API_BASE_URL.replace('/api', '')}${item.file_path}`;
    
    // Create multiple mapping keys for flexibility
    const name = item.alt_text?.split(' - ')[0]; // Extract name from alt text
    if (name) {
      map[name] = imageUrl;
    }
    
    // Also map by filename patterns
    const filename = item.filename.replace(/\.[^/.]+$/, ''); // Remove extension
    map[filename] = imageUrl;
    
    return map;
  }, {});

  return { teamImageMap, loading, error, teamMedia: media };
};

// Hook specifically for portfolio company logos
export const usePortfolioMedia = () => {
  const { media, loading, error } = useMedia('portfolio');
  
  const portfolioImageMap = media.reduce((map: Record<string, string>, item: MediaItem) => {
    const filename = item.filename.replace(/\.[^/.]+$/, ''); // Remove extension
    map[filename] = item.file_path;
    map[item.filename] = item.file_path;
    
    return map;
  }, {});

  return { portfolioImageMap, loading, error, portfolioMedia: media };
};

// Hook for brand assets (logos, etc.)
export const useBrandMedia = () => {
  const { media, loading, error } = useMedia('brand');
  
  const brandImageMap = media.reduce((map: Record<string, string>, item: MediaItem) => {
    const filename = item.filename.replace(/\.[^/.]+$/, ''); // Remove extension
    map[filename] = item.file_path;
    map[item.filename] = item.file_path;
    
    return map;
  }, {});

  return { brandImageMap, loading, error, brandMedia: media };
};

export default useMedia;