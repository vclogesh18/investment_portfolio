import { TrendingUp, Leaf, Activity } from 'lucide-react';
import { usePageContent } from '../hooks/usePageContent';
import { LoadingState, ErrorState } from '../components/LoadingComponents';

const InvestmentClassesPage = () => {
  const { loading, error, hero, sections, features } = usePageContent('investment-classes');

  if (loading) {
    return (
      <div className="pt-20">
        <LoadingState>Loading investment classes...</LoadingState>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20">
        <ErrorState error={error} />
      </div>
    );
  }

  // Get investment classes from API - check both features and sections
  // The API returns sections with type="features" that contain investment classes
  const investmentClassesData = sections?.filter((section: any) => 
    section.section_name === 'investment_classes' && section.type === 'features'
  ) || features?.filter((feature: any) => 
    feature.section_name === 'investment_classes'
  ) || [];

  // Get the most recent investment classes data (last in array)
  const latestInvestmentClasses = investmentClassesData[investmentClassesData.length - 1];
  const investmentClasses = latestInvestmentClasses?.content?.items || [];

  console.log('Investment Classes Debug:', {
    sections: sections?.length,
    features: features?.length,
    investmentClassesData: investmentClassesData?.length,
    latestInvestmentClasses,
    investmentClasses: investmentClasses?.length
  });

  // Icon mapping for dynamic rendering
  const getIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      TrendingUp,
      Leaf,
      Activity,
    };
    return icons[iconName] || Activity;
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section 
        className="py-20 bg-gradient-to-br from-slate-800 to-slate-900 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(30, 41, 59, 0.9), rgba(30, 41, 59, 0.9)), url('${hero?.background_image_url || 'https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=1920'}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {hero?.title || (
              <>
                High-Growth Investment Classes
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500"> Across Global Markets</span>
              </>
            )}
          </h1>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto">
            {hero?.description || 'Diversified portfolio spanning strategic assets, private equity, and alternative investments in the world\'s most innovative sectors.'}
          </p>
        </div>
      </section>

      {/* Private Equity & Alternatives */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="text-amber-500 mr-3" size={32} />
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
                Private Equity & Alternative Funds
              </h2>
            </div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Innovative technology fund investments targeting disruptive companies 
              with exceptional growth potential.
            </p>
          </div>
        </div>
      </section>

      {/* Dynamic Investment Classes */}
      {investmentClasses.length > 0 ? (
        investmentClasses.map((investmentClass: any) => {
          const IconComponent = getIcon(investmentClass.icon);
          const isImageLeft = investmentClass.image_position === 'left';
          
          return (
            <section key={investmentClass.id} className={`py-20 ${investmentClass.background_color}`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Image */}
                  <div 
                    className={`h-96 bg-gray-200 rounded-lg ${isImageLeft ? 'order-2 lg:order-1' : ''}`}
                    style={{
                      backgroundImage: `url('${investmentClass.image_url}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  ></div>
                  
                  {/* Content */}
                  <div className={isImageLeft ? 'order-1 lg:order-2' : ''}>
                    <div className="flex items-center mb-6">
                      <IconComponent className={`${investmentClass.icon_color} mr-3`} size={32} />
                      <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
                        {investmentClass.title}
                      </h2>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-4">{investmentClass.subtitle}</h3>
                    <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                      {investmentClass.description}
                    </p>
                    {investmentClass.secondary_subtitle && (
                      <>
                        <h3 className="text-xl font-semibold text-slate-800 mb-4">{investmentClass.secondary_subtitle}</h3>
                        <p className="text-lg text-slate-600 leading-relaxed">
                          {investmentClass.secondary_description}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </section>
          );
        })
      ) : (
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Investment Classes Loading...</h2>
            <p className="text-slate-600">Content is being loaded from the database.</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default InvestmentClassesPage;