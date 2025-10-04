# Seven Boson Group Investment Portfolio - AI Coding Instructions

## Project Overview
A React/TypeScript static website for Seven Boson Group Ltd, a private equity holding company. The site showcases investment focus areas, portfolio companies, team members, and provides application/contact functionality. Uses Vite for build tooling, Tailwind CSS for styling, and React Router for navigation.

## Architecture & Structure

### Core Layout Pattern
- **Header/Footer wrapper**: All pages wrapped in `<Header />` and `<Footer />` components
- **Fixed header**: Uses `pt-20` class on main content to account for fixed positioning
- **Page-based routing**: Simple React Router setup in `App.tsx` with 7 main routes
- **Component hierarchy**: Pages > Components (Header/Footer only) - no complex component nesting

### Styling System
- **Tailwind-first approach**: All styling via Tailwind utility classes, no custom CSS beyond base imports
- **Color scheme**: Consistent slate grays + amber accent (`amber-500`, `amber-600`) throughout
- **Responsive patterns**: Mobile-first with `md:`, `lg:`, `xl:` breakpoints
- **Hover effects**: Consistent `hover:shadow-2xl`, `group-hover:scale-110`, and `transition-all duration-300` patterns
- **Hero sections**: Common pattern with background images using inline styles and gradient overlays

### Component Patterns

#### Static Data Structure
All page content is defined as static arrays/objects within components:
```tsx
const pillars = [
  { icon: Building2, title: 'Title', description: 'Description' },
  // ...
];
```

#### Icon Usage
- **Lucide React icons**: Consistent icon library throughout (`import { IconName } from 'lucide-react'`)
- **Size standardization**: Common sizes are 24, 32, 48 for different contexts
- **Color integration**: Icons use same color tokens as text (`text-amber-500`, `text-slate-600`)

#### Image Handling
- **Local imports**: All images imported as ES modules (`import imageName from '../images/...'`)
- **Background images**: Hero sections use CSS `backgroundImage` with inline styles
- **Portfolio logos**: Company logos stored in `src/images/` and organized by category

## Development Workflow

### Build Commands
- `npm run dev` - Start Vite dev server
- `npm run build` - Production build
- `npm run lint` - ESLint checking
- `npm run preview` - Preview production build locally

### File Organization
```
src/
├── pages/           # Route components (HomePage, AboutPage, etc.)
├── components/      # Shared components (Header, Footer only)
├── images/          # Static assets with subcategories
│   ├── teams/       # Team member photos
│   └── investment-classes/  # Category images
└── App.tsx         # Router setup
```

### State Management
- **No global state**: Each page manages its own local state with `useState`
- **Form handling**: Contact/Apply pages use controlled components with `handleInputChange` pattern
- **UI state**: Simple boolean states for mobile menus, hover effects, form visibility

## Key Conventions

### Navigation Structure
Seven main routes defined in `Header.tsx` navigation array:
- `/` (Home), `/about`, `/investment-classes`, `/portfolio`, `/team`, `/apply`, `/contact`

### Team Data Pattern
Team members in `TeamPage.tsx` follow this structure:
```tsx
{
  name: 'Full Name',
  title: 'Position, Company',
  experience: 'Background description',
  education: 'Education details',
  image: ImportedImage,
  Linkedin_url: 'https://...',
  emailID: 'email@domain.com'
}
```

### Typography Hierarchy
- **Page titles**: `text-4xl md:text-5xl font-bold`
- **Section headings**: `text-3xl md:text-4xl font-bold`
- **Subsections**: `text-xl font-semibold`
- **Body text**: `text-lg text-slate-600 leading-relaxed`

### Grid Layouts
Common responsive grid pattern:
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
```

## External Dependencies
- **@supabase/supabase-js**: Included but not actively used in current implementation
- **react-router-dom**: v7.9.2 for routing
- **lucide-react**: Icon library
- **tailwindcss**: Utility-first CSS framework

## Backend Integration Notes
Terminal context suggests backend API exists at `localhost:5001/api/pages` - consider this for dynamic content management in future iterations. Current implementation is fully static.

## CMS Backend & Admin Panel Architecture Plan

### Technology Stack
- **Backend**: Node.js + Express + PostgreSQL + JWT Authentication
- **Admin Panel**: React + Material UI + React Router + Axios
- **File Upload**: Multer + AWS S3 (or local storage for development)
- **Database**: PostgreSQL with structured schema
- **API**: RESTful endpoints with role-based access control

### Database Schema Design

#### Core Tables
```sql
-- Pages table (main content containers)
CREATE TABLE pages (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  meta_description TEXT,
  hero_title TEXT,
  hero_description TEXT,
  hero_background_image VARCHAR(255),
  status VARCHAR(20) DEFAULT 'published',
  page_type VARCHAR(50) NOT NULL, -- 'home', 'about', 'portfolio', etc.
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Content blocks (reusable components)
CREATE TABLE content_blocks (
  id SERIAL PRIMARY KEY,
  page_id INTEGER REFERENCES pages(id) ON DELETE CASCADE,
  block_type VARCHAR(50) NOT NULL, -- 'hero', 'text', 'grid', 'image-text'
  title VARCHAR(255),
  content JSONB, -- Flexible content storage
  position INTEGER DEFAULT 0, -- Block ordering
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Media library
CREATE TABLE media (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255),
  file_path VARCHAR(255) NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  alt_text VARCHAR(255),
  category VARCHAR(50), -- 'team', 'portfolio', 'investment-classes'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Team members
CREATE TABLE team_members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  experience TEXT,
  education TEXT,
  linkedin_url VARCHAR(255),
  email VARCHAR(255),
  image_id INTEGER REFERENCES media(id),
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Portfolio companies
CREATE TABLE portfolio_companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  website VARCHAR(255),
  sector VARCHAR(100),
  logo_id INTEGER REFERENCES media(id),
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Investment pillars/sectors
CREATE TABLE investment_areas (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50), -- Lucide icon name
  category VARCHAR(50), -- 'pillar' or 'sector'
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Office locations
CREATE TABLE office_locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  logo VARCHAR(10), -- Short code like 'SF', 'SG'
  sector VARCHAR(100),
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Form configurations
CREATE TABLE form_configs (
  id SERIAL PRIMARY KEY,
  form_name VARCHAR(100) NOT NULL, -- 'apply', 'contact'
  field_name VARCHAR(100) NOT NULL,
  field_type VARCHAR(50), -- 'text', 'select', 'textarea'
  options JSONB, -- For select fields
  is_required BOOLEAN DEFAULT false,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Admin users
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints Structure

#### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/verify` - Verify JWT token

#### Pages Management
- `GET /api/pages` - List all pages
- `GET /api/pages/:slug` - Get page by slug (public)
- `POST /api/pages` - Create new page (admin)
- `PUT /api/pages/:id` - Update page (admin)
- `DELETE /api/pages/:id` - Delete page (admin)

#### Content Blocks
- `GET /api/pages/:id/blocks` - Get blocks for page
- `POST /api/pages/:id/blocks` - Add block to page (admin)
- `PUT /api/blocks/:id` - Update block (admin)
- `DELETE /api/blocks/:id` - Delete block (admin)
- `PUT /api/blocks/:id/position` - Reorder blocks (admin)

#### Media Management
- `GET /api/media` - List media with pagination/filters
- `POST /api/media/upload` - Upload file (admin)
- `PUT /api/media/:id` - Update media metadata (admin)
- `DELETE /api/media/:id` - Delete media (admin)

#### Team Members
- `GET /api/team` - List team members (public)
- `POST /api/team` - Add team member (admin)
- `PUT /api/team/:id` - Update team member (admin)
- `DELETE /api/team/:id` - Delete team member (admin)

#### Portfolio Companies
- `GET /api/portfolio` - List companies (public)
- `POST /api/portfolio` - Add company (admin)
- `PUT /api/portfolio/:id` - Update company (admin)
- `DELETE /api/portfolio/:id` - Delete company (admin)

#### Investment Areas
- `GET /api/investments` - List investment areas (public)
- `POST /api/investments` - Add investment area (admin)
- `PUT /api/investments/:id` - Update investment area (admin)
- `DELETE /api/investments/:id` - Delete investment area (admin)

#### Office Locations
- `GET /api/offices` - List offices (public)
- `POST /api/offices` - Add office (admin)
- `PUT /api/offices/:id` - Update office (admin)
- `DELETE /api/offices/:id` - Delete office (admin)

### Admin Panel Features

#### Dashboard
- Content overview statistics
- Recent changes log
- Quick actions menu

#### Pages Manager
- WYSIWYG editor for page content
- Drag-and-drop content blocks
- SEO metadata editor
- Page preview functionality

#### Media Library
- Upload interface with drag-and-drop
- Image preview and metadata editing
- Category-based organization
- Search and filter capabilities

#### Content Managers
- **Team Members**: Add/edit profiles with image upload
- **Portfolio**: Company management with logo upload
- **Investment Areas**: Manage pillars and sectors
- **Offices**: Global presence management
- **Forms**: Dynamic form configuration

#### User Management
- Admin user creation and role management
- Activity logging and audit trail

### Frontend Integration Strategy

#### Custom Hooks for Data Fetching
```typescript
// Replace static data with API calls
const useTeamMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/team')
      .then(res => res.json())
      .then(data => {
        setMembers(data);
        setLoading(false);
      });
  }, []);
  
  return { members, loading };
};
```

#### Gradual Migration Path
1. **Phase 1**: Implement backend API with existing data structure
2. **Phase 2**: Build admin panel for content management
3. **Phase 3**: Replace static imports with API calls
4. **Phase 4**: Add advanced features (SEO, analytics, etc.)

### Development Priorities

#### MVP Features (Phase 1)
1. Basic CRUD for all 11 identified content types
2. JWT-based admin authentication
3. File upload for images
4. Simple admin panel interface

#### Enhanced Features (Phase 2)
1. WYSIWYG content editor
2. Drag-and-drop content blocks
3. Advanced media management
4. SEO optimization tools

#### Advanced Features (Phase 3)
1. Content versioning and rollback
2. Multi-language support
3. Performance analytics
4. Automated backups

### Security Considerations
- JWT token expiration and refresh
- Role-based access control (RBAC)
- Input validation and sanitization
- File upload restrictions and virus scanning
- Rate limiting on API endpoints
- HTTPS enforcement in production

### Performance Optimizations
- Database indexing on frequently queried fields
- Image optimization and CDN integration
- API response caching
- Pagination for large datasets
- Lazy loading for admin panel

This architecture provides a solid foundation for converting the static website into a fully dynamic, manageable CMS while maintaining the existing design and user experience.

### CRUD Components Identified

#### 1. Pages & Content Blocks (All Pages)
**Current Data Structure:**
```tsx
// Static page titles, hero sections, and content blocks
<h1 className="text-4xl md:text-5xl font-bold mb-6">
  About Seven Boson Group
</h1>
<p className="text-xl text-slate-300 leading-relaxed">
  Seven Boson Group Ltd delivers superior, high-yield...
</p>
```
**CRUD Operations Needed:**
- Create: Add new pages with custom slugs and layouts
- Read: Display page content, titles, meta descriptions
- Update: Edit page content, SEO metadata, hero sections
- Delete: Remove pages and associated content blocks

#### 2. Content Blocks (Reusable Components)
**Current Data Structure:**
```tsx
// Hero sections, text blocks, image-text combinations
<section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-4">
    <h2>Section Title</h2>
    <p>Section content...</p>
  </div>
</section>
```
**CRUD Operations Needed:**
- Create: Add new content block types (hero, text, image-text, grid)
- Read: Display content blocks in proper order
- Update: Edit block content, styling, and positioning
- Delete: Remove content blocks from pages

#### 3. Images & Media Library
**Current Data Structure:**
```tsx
// Static image imports and background images
import ChetWhite from '../images/teams/Chet-White.png';
style={{
  backgroundImage: `url('https://images.pexels.com/photos/...')`,
}}
```
**CRUD Operations Needed:**
- Create: Upload new images with alt text and categories
- Read: Display image gallery, search and filter media
- Update: Edit image metadata, alt text, captions
- Delete: Remove unused images with dependency checking

#### 4. Team Members (`TeamPage.tsx`)
**Current Data Structure:**
```tsx
const mgpTeamMembers = [
  {
    name: 'Full Name',
    title: 'Position, Company', 
    experience: 'Background description',
    education: 'Education details',
    image: ImportedImage,
    Linkedin_url: 'https://...',
    emailID: 'email@domain.com'
  }
];
```
**CRUD Operations Needed:**
- Create: Add new team members
- Read: Display team member profiles
- Update: Edit member information, roles, photos
- Delete: Remove former team members

#### 4. Team Members (`TeamPage.tsx`)
**Current Data Structure:**
```tsx
const mgpTeamMembers = [
  {
    name: 'Full Name',
    title: 'Position, Company', 
    experience: 'Background description',
    education: 'Education details',
    image: ImportedImage,
    Linkedin_url: 'https://...',
    emailID: 'email@domain.com'
  }
];
```
**CRUD Operations Needed:**
- Create: Add new team members
- Read: Display team member profiles
- Update: Edit member information, roles, photos
- Delete: Remove former team members

#### 5. Portfolio Companies (`PortfolioPage.tsx`)
**Current Data Structure:**
```tsx
// Portfolio company logos displayed as images
<img src={RedbackNetworks} alt="Company logo"/>
```
**CRUD Operations Needed:**
- Create: Add new portfolio companies
- Read: Display company logos and information
- Update: Update company details, logos, descriptions
- Delete: Remove companies from portfolio

#### 5. Portfolio Companies (`PortfolioPage.tsx`)
**Current Data Structure:**
```tsx
// Portfolio company logos displayed as images
<img src={RedbackNetworks} alt="Company logo"/>
```
**CRUD Operations Needed:**
- Create: Add new portfolio companies
- Read: Display company logos and information
- Update: Update company details, logos, descriptions
- Delete: Remove companies from portfolio

#### 6. Investment Focus Areas (`HomePage.tsx`)
**Current Data Structure:**
```tsx
const pillars = [
  {
    icon: Building2,
    title: 'Private Equity',
    description: 'Strategic investments...'
  }
];

const sectors = [
  { icon: Cpu, name: 'AI as a Service', description: 'Next-gen platforms' }
];
```
**CRUD Operations Needed:**
- Create: Add new investment pillars/sectors
- Read: Display investment focus areas
- Update: Edit descriptions, strategies, icons
- Delete: Remove outdated investment categories

#### 6. Investment Focus Areas (`HomePage.tsx`)
**Current Data Structure:**
```tsx
const pillars = [
  {
    icon: Building2,
    title: 'Private Equity',
    description: 'Strategic investments...'
  }
];

const sectors = [
  { icon: Cpu, name: 'AI as a Service', description: 'Next-gen platforms' }
];
```
**CRUD Operations Needed:**
- Create: Add new investment pillars/sectors
- Read: Display investment focus areas
- Update: Edit descriptions, strategies, icons
- Delete: Remove outdated investment categories

#### 7. Investment Types (`AboutPage.tsx`)
**Current Data Structure:**
```tsx
const investments = [
  { 
    icon: Zap, 
    title: 'Disruptive Innovation Funds', 
    description: 'Investing in cutting-edge tech...' 
  }
];
```
**CRUD Operations Needed:**
- Create: Add new investment strategies
- Read: Display investment approaches
- Update: Modify investment descriptions and strategies
- Delete: Remove outdated investment types

#### 7. Investment Types (`AboutPage.tsx`)
**Current Data Structure:**
```tsx
const investments = [
  { 
    icon: Zap, 
    title: 'Disruptive Innovation Funds', 
    description: 'Investing in cutting-edge tech...' 
  }
];
```
**CRUD Operations Needed:**
- Create: Add new investment strategies
- Read: Display investment approaches
- Update: Modify investment descriptions and strategies
- Delete: Remove outdated investment types

#### 8. Global Offices/Locations (`AboutPage.tsx`)
**Current Data Structure:**
```tsx
const companies = [
  {
    id: 1,
    name: 'San Francisco',
    logo: 'SF',
    sector: 'Quantum Computing',
    description: 'Leading quantum computing...',
    stage: 'Series B'
  }
];
```
**CRUD Operations Needed:**
- Create: Add new office locations
- Read: Display global presence
- Update: Update office information, sectors
- Delete: Remove closed offices

#### 8. Global Offices/Locations (`AboutPage.tsx`)
**Current Data Structure:**
```tsx
const companies = [
  {
    id: 1,
    name: 'San Francisco',
    logo: 'SF',
    sector: 'Quantum Computing',
    description: 'Leading quantum computing...',
    stage: 'Series B'
  }
];
```
**CRUD Operations Needed:**
- Create: Add new office locations
- Read: Display global presence
- Update: Update office information, sectors
- Delete: Remove closed offices

#### 9. Investment Class Details (`InvestmentClassesPage.tsx`)
**Current Data Structure:**
```tsx
// Static content sections with images and descriptions
// AI, Green Tech, MedTech sections with hardcoded content
```
**CRUD Operations Needed:**
- Create: Add new investment class categories
- Read: Display detailed investment class information
- Update: Edit class descriptions, images, performance data
- Delete: Remove discontinued investment classes

#### 9. Investment Class Details (`InvestmentClassesPage.tsx`)
**Current Data Structure:**
```tsx
// Static content sections with images and descriptions
// AI, Green Tech, MedTech sections with hardcoded content
```
**CRUD Operations Needed:**
- Create: Add new investment class categories
- Read: Display detailed investment class information
- Update: Edit class descriptions, images, performance data
- Delete: Remove discontinued investment classes

#### 10. Contact Information (`ContactPage.tsx` & `Footer.tsx`)
**Current Data Structure:**
```tsx
// Hardcoded contact details, office locations, phone numbers
const officeLocations = [
  {
    city: 'New York',
    address: '350 Fifth Avenue...',
    phone: '+1 (212) 555-0123',
    email: 'ny@sevenboson.com'
  }
];
```
**CRUD Operations Needed:**
- Create: Add new contact methods/offices
- Read: Display contact information
- Update: Update addresses, phone numbers, emails
- Delete: Remove old contact information

#### 10. Contact Information (`ContactPage.tsx` & `Footer.tsx`)
**Current Data Structure:**
```tsx
// Hardcoded contact details, office locations, phone numbers
const officeLocations = [
  {
    city: 'New York',
    address: '350 Fifth Avenue...',
    phone: '+1 (212) 555-0123',
    email: 'ny@sevenboson.com'
  }
];
```
**CRUD Operations Needed:**
- Create: Add new contact methods/offices
- Read: Display contact information
- Update: Update addresses, phone numbers, emails
- Delete: Remove old contact information

#### 11. Form Configurations (`ApplyPage.tsx`, `ContactPage.tsx`)
**Current Data Structure:**
```tsx
// Static form options and fields
<option value="pre-seed">Pre-Seed</option>
<option value="investment-inquiry">Investment Inquiry</option>
```
**CRUD Operations Needed:**
- Create: Add new form options and fields
- Read: Display form configurations
- Update: Modify dropdown options, validation rules
- Delete: Remove outdated form options

### Migration Strategy for Dynamic Content
When transitioning from static to dynamic content:

1. **Data Layer Abstraction**
   - Create custom hooks like `useTeamMembers()`, `usePortfolioCompanies()`, `useInvestmentPillars()`
   - Wrap existing static data in these hooks initially for seamless transition
   - Example: `const teamMembers = useTeamMembers()` instead of hardcoded array

2. **API Integration Points**
   - Team member profiles with full CRUD capabilities
   - Portfolio companies with logo management
   - Investment focus areas and strategies
   - Global office locations and contact information
   - Dynamic form configurations

3. **Content Management Considerations**
   - Maintain existing data structure format for backward compatibility
   - Image handling will need CDN/asset management for uploaded content
   - Form submissions already structured for API integration
   - Consider content versioning for investment disclosures and compliance
   - Role-based access control for different content types

4. **Performance Patterns**
   - Implement loading states with existing skeleton patterns
   - Cache strategy for relatively static content (team, portfolio)
   - Consider SSG/ISR for SEO-critical pages while maintaining current Vite setup
   - Real-time updates for frequently changing data (portfolio performance)

## Common Pitfalls
- **Image imports**: Always use ES module imports, not public folder references
- **Responsive breakpoints**: Follow mobile-first approach, don't skip `md:` breakpoint
- **Color consistency**: Stick to established slate + amber color scheme
- **Fixed header spacing**: Remember `pt-20` on page content for fixed header offset