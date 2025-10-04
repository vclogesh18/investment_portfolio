import { Link } from 'react-router-dom';
import { usePortfolioCompanies, usePageContent } from '../hooks/useApi';
import { usePortfolioMedia } from '../hooks/useMedia';
import { LoadingState, ErrorState } from '../components/LoadingComponents';

// Fallback image imports (for when media system is not available)
import RedbackNetworks from '../images/Redback_Networks.svg';
import Procera from '../images/Procera.png';
import QuantAI from '../images/QuantAI-Digitial-logo.png';
import gopebble from '../images/gopebble.png';
import Biotricity from '../images/Biotricity.png';
import Telaverge from '../images/Telaverge.jpeg';
import aquathermindia from '../images/aquathermindia.jpeg';
import zerocode from '../images/zerocode.jpeg';

const PortfolioPage = () => {
  const { data: portfolioCompanies, loading, error } = usePortfolioCompanies();
  const { data: pageContent, loading: pageLoading, error: pageError } = usePageContent('portfolio');
  const { portfolioImageMap } = usePortfolioMedia();

  // Fallback image mapping when media system is not available
  const fallbackImageMap: { [key: string]: string } = {
    'Redback Networks': RedbackNetworks,
    'Procera': Procera,
    'QuantAI Digital': QuantAI,
    'GoPebble': gopebble,
    'Biotricity': Biotricity,
    'Telaverge': Telaverge,
    'Aquatherm India': aquathermindia,
    'ZeroCode': zerocode,
  };

  // Combine dynamic media with fallback images
  const imageMap = { ...fallbackImageMap, ...portfolioImageMap };

  if (loading || pageLoading) {
    return (
      <div className="pt-20">
        <LoadingState>Loading portfolio content...</LoadingState>
      </div>
    );
  }

  if (error || pageError) {
    return (
      <div className="pt-20">
        <ErrorState error={error || pageError || 'Unknown error'} />
      </div>
    );
  }

  // Sort companies by position
  const sortedCompanies = [...portfolioCompanies].sort((a, b) => (a.position || 0) - (b.position || 0));

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section 
        className="py-20 bg-gradient-to-br from-slate-800 to-slate-900 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(30, 41, 59, 0.9), rgba(30, 41, 59, 0.9)), url('${pageContent?.hero?.background_image_url || 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1920'}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {pageContent?.page?.hero_title || pageContent?.hero?.title || 'Our Portfolio'}
          </h1>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto">
            {pageContent?.page?.hero_description || pageContent?.hero?.description || 'A diverse collection of transformational companies across the most innovative sectors, representing the future of technology and business.'}
          </p>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Portfolio Companies
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Strategic investments in companies that are reshaping industries and 
              driving the future of innovation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {sortedCompanies.map((company) => (
              <div 
                key={company.id}
                data-testid="portfolio-company"
                className="group relative bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-amber-200 cursor-pointer"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 h-24 flex items-center justify-center">
                    <img 
                      src={company.logo ? `http://localhost:5001${company.logo}` : (imageMap[company.name] || '/placeholder-logo.png')} 
                      alt={company.logo_alt || `${company.name} logo`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-amber-600 transition-colors">
                    {company.name}
                  </h3>
                  <p className="text-amber-600 font-medium text-sm mb-2" data-testid="company-sector">
                    {company.sector}
                  </p>
                  {company.description && (
                    <p className="text-slate-600 text-sm" data-testid="company-description">
                      {company.description}
                    </p>
                  )}
                  {company.website && (
                    <a 
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 text-amber-500 hover:text-amber-600 text-sm transition-colors"
                    >
                      Visit Website →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl font-bold text-amber-500 mb-2">12+</div>
              <div className="text-slate-600">Portfolio Companies</div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl font-bold text-amber-500 mb-2">8</div>
              <div className="text-slate-600">Industry Sectors</div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl font-bold text-amber-500 mb-2">$2.5B+</div>
              <div className="text-slate-600">Total Portfolio Value</div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl font-bold text-amber-500 mb-2">15+</div>
              <div className="text-slate-600">Countries</div>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Portfolio
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Are you building the next transformational company? We'd love to hear from you.
          </p>
          <Link to="/apply">
          <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300">
            Apply for Investment
          </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PortfolioPage;