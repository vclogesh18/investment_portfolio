import { Link } from 'react-router-dom';
import { Building2, TrendingUp, Lightbulb, ArrowRight, Globe, Cpu, Activity, Leaf } from 'lucide-react';
import { useInvestmentAreasComplete } from '../hooks/useApi';
import { usePageContent } from '../hooks/usePageContent';
import { useFeaturedPosts } from '../hooks/useBlog';
import { LoadingState, ErrorState } from '../components/LoadingComponents';

const HomePage = () => {
  const { pillars, sectors, loading: investmentLoading, error: investmentError } = useInvestmentAreasComplete();
  const { data: homepageData, loading: homepageLoading, error: homepageError, hero, sections } = usePageContent('home');
  const { featuredPosts, loading: blogLoading, error: blogError } = useFeaturedPosts();

  // Icon mapping for dynamic rendering
  const getIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Building2,
      TrendingUp,
      Lightbulb,
      Cpu,
      Activity,
      Leaf,
      Globe,
    };
    return icons[iconName] || Building2; // fallback to Building2
  };

  // Loading state - wait for both APIs to load
  if (investmentLoading || homepageLoading) {
    return (
      <div className="pt-20">
        <LoadingState>Loading content...</LoadingState>
      </div>
    );
  }

  // Error state - show error if either API fails
  if (investmentError || homepageError) {
    return (
      <div className="pt-20">
        <ErrorState error={(investmentError || homepageError) as string} />
      </div>
    );
  }

  // Get page sections for Investment Focus Areas (fallback to data structure if needed)
  const investmentFocusSection = sections?.find((section: any) => section.section_name === 'investment_focus') || 
                               homepageData?.sections?.find((section: any) => section.section_type === 'content' && section.title === 'Investment Focus Areas');
  const innovationSectorsSection = sections?.find((section: any) => section.section_name === 'innovation_sectors') ||
                                 homepageData?.sections?.find((section: any) => section.section_type === 'content' && section.title === 'Innovation Sectors');
  
  // Get the hero section data (prefer direct hero, fallback to old structure)
  const heroSection = hero || homepageData?.hero;

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url('${heroSection?.background_image_url || 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1920'}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500"> 
              {heroSection?.title || 'Global Investing in Transformational Businesses, Technologies, and Strategic Assets'}
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-slate-300 max-w-4xl mx-auto">
            {heroSection?.description || 'Seven Boson Group Ltd — a premier global private equity holding company, fusing disciplined capital with in-house capabilities and operator-deep execution to deliver resilient, compounding returns — adding techno-commercial value at every level.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/portfolio" 
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center group"
            >
              {heroSection?.primary_cta_text || 'Explore Our Portfolio'}
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <Link 
              to="/apply" 
              className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 rounded-lg font-semibold transition-all duration-300"
            >
              {heroSection?.secondary_cta_text || 'Apply for Value'}
            </Link>
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              {investmentFocusSection?.title || 'Investment Focus Areas'}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {investmentFocusSection?.description || 'We specialize in three core investment pillars, each designed to maximize risk-adjusted returns through strategic diversification.'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar) => {
              const IconComponent = getIcon(pillar.icon);
              return (
                <div 
                  key={pillar.id}
                  data-testid="investment-pillar"
                  className="group bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-amber-200"
                >
                  <div className="text-amber-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">{pillar.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{pillar.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <blockquote className="text-3xl md:text-4xl font-bold text-slate-800 mb-8">
            "{homepageData?.quotes?.[0]?.quote_text || 'Unlocking asymmetric upside through innovation and strategic investment.'}"
          </blockquote>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto"></div>
        </div>
      </section>

      {/* Innovation Sectors */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              {innovationSectorsSection?.title || 'Innovation Sectors'}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {innovationSectorsSection?.description || 'We target the most disruptive and high-growth sectors driving the future economy.'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sectors.map((sector) => {
              const IconComponent = getIcon(sector.icon);
              return (
                <div 
                  key={sector.id}
                  className="group p-6 rounded-lg bg-slate-50 hover:bg-gradient-to-br hover:from-amber-50 hover:to-orange-50 transition-all duration-300 border border-transparent hover:border-amber-200"
                >
                  <div className="text-slate-700 group-hover:text-amber-600 mb-4 transition-colors">
                    <IconComponent size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{sector.title}</h3>
                  <p className="text-sm text-slate-600">{sector.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Blog Posts Section */}
      {!blogLoading && !blogError && featuredPosts.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
                Latest Insights
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Stay informed with our latest perspectives on investment trends, market analysis, and industry insights.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden">
                  {post.cover_image && (
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <img 
                        src={post.cover_image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.categories && post.categories.map((category: any) => (
                        <span 
                          key={category.id} 
                          className="px-3 py-1 text-xs font-medium rounded-full"
                          style={{
                            backgroundColor: category.color + '20',
                            color: category.color
                          }}
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        {new Date(post.published_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <Link 
                        to={`/blog/${post.slug}`}
                        className="text-amber-600 hover:text-amber-700 font-medium text-sm flex items-center group"
                      >
                        Read More
                        <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link 
                to="/blog"
                className="inline-flex items-center bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 group"
              >
                View All Posts
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {homepageData?.cta?.[0]?.title || 'Ready to Partner With Us?'}
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            {homepageData?.cta?.[0]?.description || 'Join our portfolio of innovative companies and strategic partners.'}
          </p>
          <Link 
            to="/contact" 
            className="inline-flex items-center bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 group"
          >
            {homepageData?.cta?.[0]?.primary_button_text || 'Contact Us Today'}
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;