import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Helper function to generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim('-'); // Remove leading/trailing hyphens
};

// Helper function to estimate reading time
const estimateReadingTime = (content) => {
  const wordsPerMinute = 200;
  const textContent = content.replace(/<[^>]*>/g, ''); // Strip HTML tags
  const wordCount = textContent.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// GET /api/blog - Get all blog posts with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      featured,
      published = 'true',
      search,
      author,
      sort = 'created_at',
      order = 'DESC'
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Build WHERE conditions
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    // Only show published posts for public API (unless specifically requested)
    if (published !== 'all') {
      whereConditions.push(`bp.published = $${paramIndex++}`);
      queryParams.push(published === 'true');
    }

    // Filter by category
    if (category) {
      whereConditions.push(`EXISTS (
        SELECT 1 FROM blog_post_categories bpc 
        JOIN blog_categories bc ON bpc.category_id = bc.id 
        WHERE bpc.blog_id = bp.id AND bc.slug = $${paramIndex++}
      )`);
      queryParams.push(category);
    }

    // Filter by featured status
    if (featured) {
      whereConditions.push(`bp.featured = $${paramIndex++}`);
      queryParams.push(featured === 'true');
    }

    // Filter by author
    if (author) {
      whereConditions.push(`bp.author ILIKE $${paramIndex++}`);
      queryParams.push(`%${author}%`);
    }

    // Search in title, content, and excerpt
    if (search) {
      whereConditions.push(`(
        bp.title ILIKE $${paramIndex++} OR 
        bp.content ILIKE $${paramIndex} OR 
        bp.excerpt ILIKE $${paramIndex}
      )`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    // Validate sort field to prevent SQL injection
    const validSortFields = ['created_at', 'updated_at', 'title', 'author', 'view_count', 'published_at'];
    const sortField = validSortFields.includes(sort) ? sort : 'created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(DISTINCT bp.id) as total
      FROM blog_posts bp
      ${whereClause}
    `;
    
    const countResult = await pool.query(countQuery, queryParams);
    const totalPosts = parseInt(countResult.rows[0].total);

    // Get posts with categories
    const postsQuery = `
      SELECT 
        bp.id,
        bp.title,
        bp.slug,
        bp.excerpt,
        bp.cover_image,
        bp.author,
        bp.author_email,
        bp.reading_time_minutes,
        bp.view_count,
        bp.featured,
        bp.published,
        bp.published_at,
        bp.created_at,
        bp.updated_at,
        COALESCE(
          ARRAY_AGG(
            JSON_BUILD_OBJECT(
              'id', bc.id,
              'name', bc.name,
              'slug', bc.slug,
              'color', bc.color
            ) ORDER BY bc.name
          ) FILTER (WHERE bc.id IS NOT NULL),
          ARRAY[]::json[]
        ) as categories
      FROM blog_posts bp
      LEFT JOIN blog_post_categories bpc ON bp.id = bpc.blog_id
      LEFT JOIN blog_categories bc ON bpc.category_id = bc.id AND bc.is_active = true
      ${whereClause}
      GROUP BY bp.id, bp.title, bp.slug, bp.excerpt, bp.cover_image, bp.author, 
               bp.author_email, bp.reading_time_minutes, bp.view_count, bp.featured, 
               bp.published, bp.published_at, bp.created_at, bp.updated_at
      ORDER BY bp.${sortField} ${sortOrder}
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    queryParams.push(parseInt(limit), offset);
    const result = await pool.query(postsQuery, queryParams);

    const totalPages = Math.ceil(totalPosts / parseInt(limit));

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalPosts,
        limit: parseInt(limit),
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch blog posts',
      details: error.message 
    });
  }
});

// GET /api/blog/categories - Get all blog categories
router.get('/categories', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        bc.*,
        COUNT(bpc.blog_id) as post_count
      FROM blog_categories bc
      LEFT JOIN blog_post_categories bpc ON bc.id = bpc.category_id
      LEFT JOIN blog_posts bp ON bpc.blog_id = bp.id AND bp.published = true
      WHERE bc.is_active = true
      GROUP BY bc.id, bc.name, bc.slug, bc.description, bc.color, bc.is_active, bc.created_at, bc.updated_at
      ORDER BY bc.name
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch blog categories',
      details: error.message 
    });
  }
});

// GET /api/blog/:slug - Get single blog post by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { increment_views = 'true' } = req.query;

    const query = `
      SELECT 
        bp.*,
        COALESCE(
          ARRAY_AGG(
            JSON_BUILD_OBJECT(
              'id', bc.id,
              'name', bc.name,
              'slug', bc.slug,
              'color', bc.color
            ) ORDER BY bc.name
          ) FILTER (WHERE bc.id IS NOT NULL),
          ARRAY[]::json[]
        ) as categories
      FROM blog_posts bp
      LEFT JOIN blog_post_categories bpc ON bp.id = bpc.blog_id
      LEFT JOIN blog_categories bc ON bpc.category_id = bc.id AND bc.is_active = true
      WHERE bp.slug = $1 AND bp.published = true
      GROUP BY bp.id
    `;

    const result = await pool.query(query, [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Blog post not found' 
      });
    }

    const post = result.rows[0];

    // Increment view count if requested
    if (increment_views === 'true') {
      await pool.query(
        'UPDATE blog_posts SET view_count = view_count + 1 WHERE id = $1',
        [post.id]
      );
      post.view_count = parseInt(post.view_count) + 1;
    }

    res.json({
      success: true,
      data: post
    });

  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch blog post',
      details: error.message 
    });
  }
});

// POST /api/blog - Create new blog post (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      cover_image,
      meta_description,
      meta_keywords,
      author,
      author_email,
      featured = false,
      published = false,
      category_ids = []
    } = req.body;

    // Validation
    if (!title || !content || !author) {
      return res.status(400).json({
        success: false,
        error: 'Title, content, and author are required'
      });
    }

    // Generate slug from title
    const baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 1;

    // Ensure slug is unique
    while (true) {
      const existingPost = await pool.query(
        'SELECT id FROM blog_posts WHERE slug = $1',
        [slug]
      );
      
      if (existingPost.rows.length === 0) break;
      
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Calculate reading time
    const reading_time_minutes = estimateReadingTime(content);

    // Insert blog post
    const insertQuery = `
      INSERT INTO blog_posts (
        title, slug, content, excerpt, cover_image, meta_description, 
        meta_keywords, author, author_email, reading_time_minutes, 
        featured, published, published_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const published_at = published ? new Date() : null;

    const result = await pool.query(insertQuery, [
      title, slug, content, excerpt, cover_image, meta_description,
      meta_keywords, author, author_email, reading_time_minutes,
      featured, published, published_at
    ]);

    const newPost = result.rows[0];

    // Add categories if provided
    if (category_ids && category_ids.length > 0) {
      const categoryValues = category_ids.map((_, index) => 
        `($1, $${index + 2})`
      ).join(', ');
      
      const categoryQuery = `
        INSERT INTO blog_post_categories (blog_id, category_id) 
        VALUES ${categoryValues}
      `;
      
      await pool.query(categoryQuery, [newPost.id, ...category_ids]);
    }

    // Fetch complete post with categories
    const completePost = await pool.query(`
      SELECT * FROM blog_posts_with_categories WHERE id = $1
    `, [newPost.id]);

    res.status(201).json({
      success: true,
      data: completePost.rows[0],
      message: 'Blog post created successfully'
    });

  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create blog post',
      details: error.message 
    });
  }
});

// PUT /api/blog/:id - Update blog post (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      excerpt,
      cover_image,
      meta_description,
      meta_keywords,
      author,
      author_email,
      featured,
      published,
      category_ids
    } = req.body;

    // Check if post exists
    const existingPost = await pool.query(
      'SELECT * FROM blog_posts WHERE id = $1',
      [id]
    );

    if (existingPost.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    const currentPost = existingPost.rows[0];
    
    // Generate new slug if title changed
    let slug = currentPost.slug;
    if (title && title !== currentPost.title) {
      const baseSlug = generateSlug(title);
      slug = baseSlug;
      let counter = 1;

      // Ensure new slug is unique (excluding current post)
      while (true) {
        const existingSlug = await pool.query(
          'SELECT id FROM blog_posts WHERE slug = $1 AND id != $2',
          [slug, id]
        );
        
        if (existingSlug.rows.length === 0) break;
        
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    // Calculate reading time if content changed
    const reading_time_minutes = content 
      ? estimateReadingTime(content)
      : currentPost.reading_time_minutes;

    // Handle published status change
    let published_at = currentPost.published_at;
    if (published !== undefined) {
      if (published && !currentPost.published) {
        // Publishing for the first time
        published_at = new Date();
      } else if (!published) {
        // Unpublishing
        published_at = null;
      }
    }

    // Update blog post
    const updateQuery = `
      UPDATE blog_posts SET
        title = COALESCE($1, title),
        slug = COALESCE($2, slug),
        content = COALESCE($3, content),
        excerpt = COALESCE($4, excerpt),
        cover_image = COALESCE($5, cover_image),
        meta_description = COALESCE($6, meta_description),
        meta_keywords = COALESCE($7, meta_keywords),
        author = COALESCE($8, author),
        author_email = COALESCE($9, author_email),
        reading_time_minutes = $10,
        featured = COALESCE($11, featured),
        published = COALESCE($12, published),
        published_at = $13,
        updated_at = NOW()
      WHERE id = $14
      RETURNING *
    `;

    const updateResult = await pool.query(updateQuery, [
      title, slug, content, excerpt, cover_image, meta_description,
      meta_keywords, author, author_email, reading_time_minutes,
      featured, published, published_at, id
    ]);

    // Update categories if provided
    if (category_ids !== undefined) {
      // Remove existing categories
      await pool.query(
        'DELETE FROM blog_post_categories WHERE blog_id = $1',
        [id]
      );

      // Add new categories
      if (category_ids.length > 0) {
        const categoryValues = category_ids.map((_, index) => 
          `($1, $${index + 2})`
        ).join(', ');
        
        const categoryQuery = `
          INSERT INTO blog_post_categories (blog_id, category_id) 
          VALUES ${categoryValues}
        `;
        
        await pool.query(categoryQuery, [id, ...category_ids]);
      }
    }

    // Fetch complete updated post with categories
    const completePost = await pool.query(`
      SELECT * FROM blog_posts_with_categories WHERE id = $1
    `, [id]);

    res.json({
      success: true,
      data: completePost.rows[0],
      message: 'Blog post updated successfully'
    });

  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update blog post',
      details: error.message 
    });
  }
});

// DELETE /api/blog/:id - Delete blog post (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if post exists
    const existingPost = await pool.query(
      'SELECT id, title FROM blog_posts WHERE id = $1',
      [id]
    );

    if (existingPost.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    // Delete post (categories will be deleted by CASCADE)
    await pool.query('DELETE FROM blog_posts WHERE id = $1', [id]);

    res.json({
      success: true,
      message: `Blog post "${existingPost.rows[0].title}" deleted successfully`
    });

  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete blog post',
      details: error.message 
    });
  }
});

// POST /api/blog/categories - Create new category (admin only)
router.post('/categories', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, color = '#1976d2' } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Category name is required'
      });
    }

    const slug = generateSlug(name);

    const insertQuery = `
      INSERT INTO blog_categories (name, slug, description, color)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [name, slug, description, color]);

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Category created successfully'
    });

  } catch (error) {
    console.error('Error creating category:', error);
    if (error.code === '23505') { // Unique violation
      res.status(400).json({
        success: false,
        error: 'Category name already exists'
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to create category',
        details: error.message 
      });
    }
  }
});

// PUT /api/blog/categories/:id - Update category (admin only)
router.put('/categories/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, color, is_active } = req.body;

    const updateQuery = `
      UPDATE blog_categories SET
        name = COALESCE($1, name),
        slug = CASE WHEN $1 IS NOT NULL THEN $2 ELSE slug END,
        description = COALESCE($3, description),
        color = COALESCE($4, color),
        is_active = COALESCE($5, is_active),
        updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `;

    const slug = name ? generateSlug(name) : null;
    const result = await pool.query(updateQuery, [name, slug, description, color, is_active, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Category updated successfully'
    });

  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update category',
      details: error.message 
    });
  }
});

// DELETE /api/blog/categories/:id - Delete category (admin only)
router.delete('/categories/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category has posts
    const postCount = await pool.query(
      'SELECT COUNT(*) as count FROM blog_post_categories WHERE category_id = $1',
      [id]
    );

    if (parseInt(postCount.rows[0].count) > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete category with associated blog posts'
      });
    }

    const result = await pool.query(
      'DELETE FROM blog_categories WHERE id = $1 RETURNING name',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: `Category "${result.rows[0].name}" deleted successfully`
    });

  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete category',
      details: error.message 
    });
  }
});

export default router;