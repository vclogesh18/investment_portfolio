// Common type definitions for the Seven Boson Group project

export interface Media {
  id: number;
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  alt_text?: string;
  category?: string;
  created_at: string;
}

export interface BrandingValue {
  value: string;
  media_path?: string;
}

export interface Branding {
  company_name?: BrandingValue;
  logo_alt_text?: BrandingValue & { media_path: string };
  footer_tagline?: BrandingValue;
  footer_description?: BrandingValue;
  footer_copyright?: BrandingValue;
  contact_address?: BrandingValue;
  contact_email?: BrandingValue;
  contact_phone?: BrandingValue;
  [key: string]: BrandingValue | undefined;
}

export interface TeamMember {
  id: number;
  name: string;
  title: string;
  experience: string;
  education: string;
  linkedin_url?: string;
  email?: string;
  image_id?: number;
  position: number;
  is_active: boolean;
  created_at: string;
  media?: Media;
}

export interface PortfolioCompany {
  id: number;
  name: string;
  description: string;
  website?: string;
  sector?: string;
  logo_id?: number;
  position: number;
  is_active: boolean;
  created_at: string;
  media?: Media;
}

export interface InvestmentArea {
  id: number;
  title: string;
  description: string;
  icon?: string;
  category: 'pillar' | 'sector';
  position: number;
  is_active: boolean;
  created_at: string;
}

export interface OfficeLocation {
  id: number;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  logo?: string;
  sector?: string;
  position: number;
  is_active: boolean;
  created_at: string;
}

export interface ContentBlock {
  id: number;
  page_id: number;
  block_type: string;
  title?: string;
  content: Record<string, unknown>;
  position: number;
  is_active: boolean;
  created_at: string;
}

export interface Page {
  id: number;
  slug: string;
  title: string;
  meta_description?: string;
  hero_title?: string;
  hero_description?: string;
  hero_background_image?: string;
  status: string;
  page_type: string;
  created_at: string;
  updated_at: string;
}

export interface HeroSection {
  title: string;
  description: string;
  background_image?: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface Section {
  title: string;
  content: string;
  image?: string;
}

export interface FooterLink {
  id: number;
  label: string;
  url: string;
  is_external: boolean;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  status: 'draft' | 'published';
  featured_image_id?: number;
  author: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  media?: Media;
}

export interface FormData {
  [key: string]: string | number | boolean;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}