# Unified CMS Implementation Plan

## Current State Analysis
You have 3 different approaches running simultaneously:
1. **Static content** - hardcoded in React components
2. **Specific API endpoints** - /api/homepage, /api/team, etc.
3. **Generic page system** - /api/pages/:slug with page_content table

## Recommended Unified Solution

### 1. Database Schema (Use Existing page_content table)
```sql
-- Already exists - consolidate all page content here
page_content (
  id, page_slug, content_type, section_name, 
  title, subtitle, description, content (JSONB),
  background_image_url, layout_type, position, is_active
)
```

### 2. Backend API Strategy
**Consolidate to single endpoint pattern:**
- `GET /api/pages/:slug` - Get all content for a page
- `PUT /api/pages/:slug/content` - Update page content
- `POST /api/pages/:slug/sections` - Add new content section
- `DELETE /api/pages/:slug/sections/:id` - Remove content section

### 3. Frontend Hook Strategy
**Single universal hook:**
```typescript
export const usePageContent = (pageSlug: string) => {
  // Returns: { hero, sections, loading, error, refresh }
}
```

### 4. Admin Panel Strategy
**Unified page manager with:**
- Visual section editor
- Drag-and-drop content blocks
- Live preview
- Content type templates (hero, text, grid, etc.)

## Migration Steps

### Phase 1: Consolidate Backend
1. Enhance `/api/pages/:slug` endpoint to return structured content
2. Migrate homepage-specific data to generic page_content table
3. Create content type templates for different section types

### Phase 2: Update Frontend
1. Replace specific hooks (useHomepageContent) with usePageContent
2. Update all page components to use unified data structure
3. Implement loading/error states consistently

### Phase 3: Enhanced Admin Panel
1. Build visual content editor in PagesManager
2. Add content block templates (hero, text, grid, image-text)
3. Implement drag-and-drop section reordering

### Phase 4: Advanced Features
1. Content versioning
2. Preview mode
3. SEO optimization tools
4. Media library integration

## Content Structure Examples

### Homepage Content Structure
```json
{
  "hero": {
    "title": "Global Investing in Transformational Businesses",
    "description": "Seven Boson Group Ltd — a premier global...",
    "background_image_url": "...",
    "primary_cta_text": "Explore Our Portfolio",
    "secondary_cta_text": "Apply for Value"
  },
  "sections": [
    {
      "type": "content",
      "title": "Investment Focus Areas",
      "description": "We specialize in three core investment pillars...",
      "layout": "grid"
    },
    {
      "type": "content", 
      "title": "Innovation Sectors",
      "description": "Targeting the most promising sectors...",
      "layout": "grid"
    }
  ]
}
```

### Benefits of Unified Approach
1. **Consistency** - All pages managed the same way
2. **Flexibility** - JSONB content allows any structure
3. **Maintainability** - Single codebase for all page management
4. **Scalability** - Easy to add new pages and content types
5. **Admin Experience** - Unified interface for all content

## Implementation Priority
1. **High Priority**: Consolidate existing homepage/about/contact content
2. **Medium Priority**: Implement visual content editor
3. **Low Priority**: Advanced features like versioning

This unified approach will eliminate the current confusion and provide a solid foundation for long-term content management.