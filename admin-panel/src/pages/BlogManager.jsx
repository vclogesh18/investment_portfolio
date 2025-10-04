import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Star,
  StarBorder,
  Category,
  Article,
  Publish,
  UnpublishedSharp
} from '@mui/icons-material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useBlog, useBlogCategories, useBlogManager, useBlogCategoryManager } from '../hooks/useBlog';
import MediaSelector from '../components/MediaSelector';

// Tab panel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`blog-tabpanel-${index}`}
      aria-labelledby={`blog-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const BlogManager = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [postDialogOpen, setPostDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Post form state
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    cover_image: '',
    meta_description: '',
    meta_keywords: '',
    author: '',
    author_email: '',
    featured: false,
    published: false,
    category_ids: []
  });

  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    color: '#1976d2'
  });

  // Hooks
  const { posts, loading: postsLoading, refetch: refetchPosts } = useBlog();
  const { categories, loading: categoriesLoading, refetch: refetchCategories } = useBlogCategories();
  const { createPost, updatePost, deletePost, loading: postActionLoading } = useBlogManager();
  const { createCategory, updateCategory, deleteCategory, loading: categoryActionLoading } = useBlogCategoryManager();

  // Quill editor configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'blockquote', 'code-block',
    'link', 'image'
  ];

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Post management functions
  const openPostDialog = (post = null) => {
    if (post) {
      setEditingPost(post);
      setPostForm({
        title: post.title || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        cover_image: post.cover_image || '',
        meta_description: post.meta_description || '',
        meta_keywords: post.meta_keywords || '',
        author: post.author || '',
        author_email: post.author_email || '',
        featured: post.featured || false,
        published: post.published || false,
        category_ids: post.categories ? post.categories.map(cat => cat.id) : []
      });
    } else {
      setEditingPost(null);
      setPostForm({
        title: '',
        content: '',
        excerpt: '',
        cover_image: '',
        meta_description: '',
        meta_keywords: '',
        author: 'Seven Boson Team',
        author_email: 'team@sevenbosongroup.com',
        featured: false,
        published: false,
        category_ids: []
      });
    }
    setPostDialogOpen(true);
  };

  const closePostDialog = () => {
    setPostDialogOpen(false);
    setEditingPost(null);
  };

  const handlePostSubmit = async () => {
    try {
      if (editingPost) {
        await updatePost(editingPost.id, postForm);
        setSnackbarMessage('Post updated successfully');
      } else {
        await createPost(postForm);
        setSnackbarMessage('Post created successfully');
      }
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      closePostDialog();
      refetchPosts();
    } catch (error) {
      setSnackbarMessage(`Error: ${error.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleDeletePost = async (post) => {
    setDeleteTarget({ type: 'post', item: post });
    setDeleteConfirmOpen(true);
  };

  // Category management functions
  const openCategoryDialog = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name || '',
        description: category.description || '',
        color: category.color || '#1976d2'
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({
        name: '',
        description: '',
        color: '#1976d2'
      });
    }
    setCategoryDialogOpen(true);
  };

  const closeCategoryDialog = () => {
    setCategoryDialogOpen(false);
    setEditingCategory(null);
  };

  const handleCategorySubmit = async () => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryForm);
        setSnackbarMessage('Category updated successfully');
      } else {
        await createCategory(categoryForm);
        setSnackbarMessage('Category created successfully');
      }
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      closeCategoryDialog();
      refetchCategories();
    } catch (error) {
      setSnackbarMessage(`Error: ${error.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleDeleteCategory = async (category) => {
    setDeleteTarget({ type: 'category', item: category });
    setDeleteConfirmOpen(true);
  };

  // Common delete handler
  const confirmDelete = async () => {
    try {
      if (deleteTarget.type === 'post') {
        await deletePost(deleteTarget.item.id);
        setSnackbarMessage('Post deleted successfully');
        refetchPosts();
      } else if (deleteTarget.type === 'category') {
        await deleteCategory(deleteTarget.item.id);
        setSnackbarMessage('Category deleted successfully');
        refetchCategories();
      }
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage(`Error: ${error.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  // Media selection handler
  const handleMediaSelect = (media) => {
    if (media) {
      const imageUrl = `http://localhost:5001${media.file_path.startsWith('/') ? media.file_path : '/uploads/' + media.file_path}`;
      setPostForm(prev => ({ ...prev, cover_image: imageUrl }));
    }
    setMediaDialogOpen(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (postsLoading || categoriesLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Blog Management
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab 
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <Article />
                Posts ({posts.length})
              </Box>
            } 
          />
          <Tab 
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <Category />
                Categories ({categories.length})
              </Box>
            } 
          />
        </Tabs>
      </Box>

      {/* Posts Tab */}
      <TabPanel value={currentTab} index={0}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Blog Posts</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => openPostDialog()}
          >
            Add New Post
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Categories</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Views</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" display="flex" alignItems="center" gap={1}>
                        {post.featured && <Star color="warning" fontSize="small" />}
                        {post.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        /{post.slug}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {post.categories.map((category) => (
                        <Chip
                          key={category.id}
                          label={category.name}
                          size="small"
                          style={{ backgroundColor: category.color, color: 'white' }}
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={post.published ? 'Published' : 'Draft'}
                      color={post.published ? 'success' : 'default'}
                      size="small"
                      icon={post.published ? <Publish /> : <UnpublishedSharp />}
                    />
                  </TableCell>
                  <TableCell>
                    <Badge badgeContent={post.view_count} color="primary">
                      <Visibility fontSize="small" />
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(post.created_at)}</TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => openPostDialog(post)}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => handleDeletePost(post)} color="error">
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Categories Tab */}
      <TabPanel value={currentTab} index={1}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Blog Categories</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => openCategoryDialog()}
          >
            Add New Category
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Color</TableCell>
                <TableCell>Posts</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <Chip
                      label={category.name}
                      style={{ backgroundColor: category.color, color: 'white' }}
                    />
                  </TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        width: 40,
                        height: 20,
                        backgroundColor: category.color,
                        borderRadius: 1,
                        border: '1px solid #ccc'
                      }}
                    />
                  </TableCell>
                  <TableCell>{category.post_count} posts</TableCell>
                  <TableCell>{formatDate(category.created_at)}</TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => openCategoryDialog(category)}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteCategory(category)} 
                          color="error"
                          disabled={parseInt(category.post_count) > 0}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Post Dialog */}
      <Dialog open={postDialogOpen} onClose={closePostDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} sx={{ pt: 2 }}>
            <TextField
              label="Title"
              value={postForm.title}
              onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
              fullWidth
              required
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>Content</Typography>
              <ReactQuill
                value={postForm.content}
                onChange={(content) => setPostForm({ ...postForm, content })}
                modules={quillModules}
                formats={quillFormats}
                style={{ minHeight: '200px' }}
              />
            </Box>

            <TextField
              label="Excerpt"
              value={postForm.excerpt}
              onChange={(e) => setPostForm({ ...postForm, excerpt: e.target.value })}
              fullWidth
              multiline
              rows={3}
              helperText="Short description for listing pages"
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>Cover Image</Typography>
              <Box display="flex" gap={2} alignItems="center">
                <TextField
                  value={postForm.cover_image}
                  onChange={(e) => setPostForm({ ...postForm, cover_image: e.target.value })}
                  placeholder="Image URL"
                  fullWidth
                />
                <Button
                  variant="outlined"
                  onClick={() => setMediaDialogOpen(true)}
                >
                  Browse
                </Button>
              </Box>
              {postForm.cover_image && (
                <Box mt={2}>
                  <img
                    src={postForm.cover_image}
                    alt="Cover preview"
                    style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'cover' }}
                  />
                </Box>
              )}
            </Box>

            <FormControl fullWidth>
              <InputLabel>Categories</InputLabel>
              <Select
                multiple
                value={postForm.category_ids}
                onChange={(e) => setPostForm({ ...postForm, category_ids: e.target.value })}
                input={<OutlinedInput label="Categories" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((categoryId) => {
                      const category = categories.find(cat => cat.id === categoryId);
                      return category ? (
                        <Chip 
                          key={categoryId} 
                          label={category.name} 
                          size="small"
                          style={{ backgroundColor: category.color, color: 'white' }}
                        />
                      ) : null;
                    })}
                  </Box>
                )}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    <Checkbox checked={postForm.category_ids.indexOf(category.id) > -1} />
                    <ListItemText primary={category.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box display="flex" gap={2}>
              <TextField
                label="Author"
                value={postForm.author}
                onChange={(e) => setPostForm({ ...postForm, author: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Author Email"
                value={postForm.author_email}
                onChange={(e) => setPostForm({ ...postForm, author_email: e.target.value })}
                fullWidth
                type="email"
              />
            </Box>

            <TextField
              label="Meta Description"
              value={postForm.meta_description}
              onChange={(e) => setPostForm({ ...postForm, meta_description: e.target.value })}
              fullWidth
              multiline
              rows={2}
              helperText="SEO description (recommended: 150-160 characters)"
            />

            <TextField
              label="Meta Keywords"
              value={postForm.meta_keywords}
              onChange={(e) => setPostForm({ ...postForm, meta_keywords: e.target.value })}
              fullWidth
              helperText="Comma-separated keywords for SEO"
            />

            <Box display="flex" gap={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={postForm.featured}
                    onChange={(e) => setPostForm({ ...postForm, featured: e.target.checked })}
                  />
                }
                label="Featured Post"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={postForm.published}
                    onChange={(e) => setPostForm({ ...postForm, published: e.target.checked })}
                  />
                }
                label="Published"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePostDialog}>Cancel</Button>
          <Button 
            onClick={handlePostSubmit} 
            variant="contained"
            disabled={postActionLoading || !postForm.title || !postForm.content || !postForm.author}
          >
            {postActionLoading ? <CircularProgress size={20} /> : (editingPost ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={categoryDialogOpen} onClose={closeCategoryDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCategory ? 'Edit Category' : 'Create New Category'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} sx={{ pt: 2 }}>
            <TextField
              label="Name"
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              fullWidth
              required
            />
            
            <TextField
              label="Description"
              value={categoryForm.description}
              onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>Color</Typography>
              <Box display="flex" gap={2} alignItems="center">
                <input
                  type="color"
                  value={categoryForm.color}
                  onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                  style={{ width: '50px', height: '40px', border: 'none', borderRadius: '4px' }}
                />
                <TextField
                  value={categoryForm.color}
                  onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                  placeholder="#1976d2"
                  size="small"
                />
                <Chip
                  label="Preview"
                  style={{ backgroundColor: categoryForm.color, color: 'white' }}
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCategoryDialog}>Cancel</Button>
          <Button 
            onClick={handleCategorySubmit} 
            variant="contained"
            disabled={categoryActionLoading || !categoryForm.name}
          >
            {categoryActionLoading ? <CircularProgress size={20} /> : (editingCategory ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this {deleteTarget?.type}? This action cannot be undone.
          </Typography>
          {deleteTarget?.item && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {deleteTarget.type === 'post' ? deleteTarget.item.title : deleteTarget.item.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Media Selector */}
      <MediaSelector
        open={mediaDialogOpen}
        onClose={() => setMediaDialogOpen(false)}
        onSelect={handleMediaSelect}
        category=""
        title="Select Cover Image"
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BlogManager;