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

## Common Pitfalls
- **Image imports**: Always use ES module imports, not public folder references
- **Responsive breakpoints**: Follow mobile-first approach, don't skip `md:` breakpoint
- **Color consistency**: Stick to established slate + amber color scheme
- **Fixed header spacing**: Remember `pt-20` on page content for fixed header offset