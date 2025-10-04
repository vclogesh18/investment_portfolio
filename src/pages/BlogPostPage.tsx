import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, User, Calendar, Eye, Share2 } from 'lucide-react';
import { useBlogPost, useBlog } from '../hooks/useBlog';
import { LoadingSpinner } from '../components/LoadingComponents';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading, error } = useBlogPost(slug);
  
  // Fetch related posts from the same categories
  const { posts: relatedPosts } = useBlog({
    limit: '3',
    category: post?.categories[0]?.slug || '',
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const sharePost = () => {
    if (navigator.share && post) {
      navigator.share({
        title: post.title,
        text: post.excerpt || post.meta_description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('URL copied to clipboard!');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !post) {
    return (
      <div className="min-h-screen pt-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">
              {error === 'Blog post not found' ? 'Post Not Found' : 'Error Loading Post'}
            </h1>
            <p className="text-slate-600 mb-6">{error}</p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter out current post from related posts
  const filteredRelatedPosts = relatedPosts.filter(relatedPost => relatedPost.id !== post.id).slice(0, 3);

  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Header */}
      <div className="bg-slate-50 py-8 border-b">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium mb-6"
          >
            <ArrowLeft size={20} />
            Back to Blog
          </Link>
          
          {/* Categories */}
          {post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/blog?category=${category.slug}`}
                  className="px-3 py-1 text-sm font-medium text-white rounded-full hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: category.color }}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-slate-600">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{formatDate(post.published_at || post.created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{post.reading_time_minutes} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye size={16} />
              <span>{post.view_count} views</span>
            </div>
            <button
              onClick={sharePost}
              className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors"
            >
              <Share2 size={16} />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {post.cover_image && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="aspect-video overflow-hidden rounded-lg">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Excerpt */}
        {post.excerpt && (
          <div className="text-xl text-slate-600 mb-8 p-6 bg-slate-50 rounded-lg border-l-4 border-amber-500">
            {post.excerpt}
          </div>
        )}

        {/* Article Content */}
        <div 
          className="prose prose-lg max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-blockquote:border-amber-500 prose-blockquote:bg-slate-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-lg prose-code:bg-slate-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-ul:text-slate-700 prose-ol:text-slate-700"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Author Info */}
        <div className="mt-12 p-6 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">About the Author</h3>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
              <User className="text-white" size={20} />
            </div>
            <div>
              <p className="font-medium text-slate-900">{post.author}</p>
              {post.author_email && (
                <a
                  href={`mailto:${post.author_email}`}
                  className="text-amber-600 hover:text-amber-700 transition-colors"
                >
                  {post.author_email}
                </a>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {filteredRelatedPosts.length > 0 && (
        <section className="bg-slate-50 py-16 mt-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
              Related Articles
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredRelatedPosts.map((relatedPost) => (
                <article
                  key={relatedPost.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
                >
                  {/* Cover Image */}
                  {relatedPost.cover_image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={relatedPost.cover_image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    {/* Categories */}
                    {relatedPost.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {relatedPost.categories.slice(0, 1).map((category) => (
                          <span
                            key={category.id}
                            className="px-2 py-1 text-xs font-medium text-white rounded-full"
                            style={{ backgroundColor: category.color }}
                          >
                            {category.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">
                      <Link to={`/blog/${relatedPost.slug}`}>
                        {relatedPost.title}
                      </Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                      {relatedPost.excerpt || relatedPost.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...'}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{relatedPost.author}</span>
                      <span>{formatDate(relatedPost.published_at || relatedPost.created_at)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors"
              >
                View All Articles
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* SEO Meta Tags */}
      <div style={{ display: 'none' }}>
        <meta name="description" content={post.meta_description || post.excerpt} />
        {post.meta_keywords && <meta name="keywords" content={post.meta_keywords} />}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.meta_description || post.excerpt} />
        {post.cover_image && <meta property="og:image" content={post.cover_image} />}
        <meta property="og:type" content="article" />
        <meta property="article:author" content={post.author} />
        <meta property="article:published_time" content={post.published_at || post.created_at} />
        {post.categories.map((category) => (
          <meta key={category.id} property="article:tag" content={category.name} />
        ))}
      </div>
    </div>
  );
};

export default BlogPostPage;