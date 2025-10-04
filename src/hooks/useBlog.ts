import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5001/api';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string;
  meta_description: string;
  meta_keywords: string;
  author: string;
  author_email: string;
  reading_time_minutes: number;
  view_count: number;
  featured: boolean;
  published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  categories: BlogCategory[];
}

interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  color: string;
  description?: string;
  post_count?: number;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Hook for fetching blog posts (public)
export const useBlog = (params: Record<string, string> = {}) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          published: 'true',
          limit: '12',
          ...params
        });
        
        const response = await fetch(`${API_BASE_URL}/blog?${queryParams}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.statusText}`);
        }

        const result = await response.json();
        setPosts(result.data || []);
        setPagination(result.pagination || null);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setPosts([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [JSON.stringify(params)]);

  return { posts, pagination, loading, error };
};

// Hook for fetching a single blog post by slug (public)
export const useBlogPost = (slug: string | undefined) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setPost(null);
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/blog/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Blog post not found');
          }
          throw new Error(`Failed to fetch post: ${response.statusText}`);
        }

        const result = await response.json();
        setPost(result.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  return { post, loading, error };
};

// Hook for fetching blog categories (public)
export const useBlogCategories = () => {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/blog/categories`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.statusText}`);
        }

        const result = await response.json();
        setCategories(result.data || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

// Hook for featured blog posts (public)
export const useFeaturedPosts = (limit = 3) => {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          published: 'true',
          featured: 'true',
          limit: limit.toString(),
          sort: 'published_at',
          order: 'DESC'
        });
        
        const response = await fetch(`${API_BASE_URL}/blog?${queryParams}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch featured posts: ${response.statusText}`);
        }

        const result = await response.json();
        setFeaturedPosts(result.data || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setFeaturedPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPosts();
  }, [limit]);

  return { featuredPosts, loading, error };
};