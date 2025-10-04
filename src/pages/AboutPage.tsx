import { useState } from 'react';
import { Globe, Target, TrendingUp, Users, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageContent } from '../hooks/usePageContent';
import { LoadingState, ErrorState } from '../components/LoadingComponents';

const AboutPage = () => {
  const { loading, error, hero, sections, features } = usePageContent('about');
  const [hoveredCompany, setHoveredCompany] = useState<number | null>(null);

  // Icon mapping for dynamic rendering
  const getIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Globe,
      Target,
      TrendingUp,
      Users,
      Zap,
      Shield,
    };
    return icons[iconName] || Zap;
  };

  if (loading) {
    return (
      <div className="pt-20">
        <LoadingState>Loading about page...</LoadingState>
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

  const investmentStrategies = features?.find((feature: any) => feature.section_name === 'investment_types');
  const investments = investmentStrategies?.items || [];
  const philosophySection = sections?.find((section: any) => section.section_name === 'philosophy');
  const globalOfficesSection = features?.find((feature: any) => feature.section_name === 'global_offices');

  // Fallback investment data if API doesn't have data yet
  const fallbackInvestments = [
    {
      icon: 'Zap',
      title: 'Disruptive Innovation Funds',
      description: 'Investing in cutting-edge technologies that have the potential to transform entire industries.'
    },
    {
      icon: 'Shield',
      title: 'Structured High-Yield Instruments',
      description: 'Carefully designed financial instruments that provide consistent returns with managed risk exposure.'
    },
    {
      icon: 'TrendingUp',
      title: 'Alternative Investment Strategies',
      description: 'Non-traditional investment approaches that capitalize on market inefficiencies and emerging opportunities.'
    }
  ];

  const finalInvestments = investments.length > 0 ? investments : fallbackInvestments;

  // Fallback global offices data if API doesn't have data yet
  const fallbackOffices = [
    {
      id: 1,
      name: 'San Francisco',
      logo: 'SF',
      sector: 'Quantum Computing',
      description: 'Leading quantum computing infrastructure for enterprise applications',
      stage: 'Series B'
    },
    {
      id: 2,
      name: 'Singapore',
      logo: 'SG',
      sector: 'MedTech',
      description: 'AI-powered diagnostic imaging and automated healthcare solutions',
      stage: 'Series A'
    },
    {
      id: 3,
      name: 'Chennai',
      logo: 'CHE',
      sector: 'Clean Energy',
      description: 'Next-generation battery storage and renewable energy systems',
      stage: 'Growth'
    },
    {
      id: 4,
      name: 'Qatar',
      logo: 'QA',
      sector: 'Robotics',
      description: 'Autonomous warehouse and supply chain automation solutions',
      stage: 'Series C'
    }
  ];

  const globalOffices = globalOfficesSection?.items || fallbackOffices;

  const getSectorColor = (sector: string): string => {
    const colors: { [key: string]: string } = {
      'Quantum Computing': 'bg-purple-500',
      'MedTech': 'bg-red-500',
      'Clean Energy': 'bg-green-500',
      'Robotics': 'bg-blue-500'
    };
    return colors[sector] || 'bg-slate-500';
  };

  return (
    <div className="pt-20">
      <section 
        className="py-20 bg-gradient-to-br from-slate-800 to-slate-900 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url('${hero?.background_image_url || 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920'}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {hero?.title || 'About Seven Boson Group'}
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed max-w-4xl mx-auto">
              {hero?.description || 'Seven Boson Group Ltd delivers superior, high-yield, risk-adjusted returns by targeting the transformative growth of tomorrow\'s most disruptive sectors.'}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                {philosophySection?.title || 'Disciplined. Diversified. Data-Driven'}
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                {philosophySection?.description || 'We apply a disciplined GARP strategy across real estate, private equity, and alternatives—amplified by structured high-yield instruments and active management to unlock asymmetric, risk-adjusted returns.'}
              </p>
            </div>
            <div 
              className="h-96 bg-gray-200 rounded-lg"
              style={{
                backgroundImage: `url('https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            ></div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Global Presence
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {globalOffices.map((office: any) => (
              <div 
                key={office.id}
                className="group relative bg-white rounded-lg border border-slate-200 hover:border-amber-500 p-6 transition-all duration-300 hover:shadow-xl cursor-pointer"
                onMouseEnter={() => setHoveredCompany(office.id)}
                onMouseLeave={() => setHoveredCompany(null)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-full ${getSectorColor(office.sector)} flex items-center justify-center text-white font-bold text-sm`}>
                    {office.logo}
                  </div>
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                    {office.stage}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{office.name}</h3>
                <p className="text-sm text-amber-600 font-medium mb-2">{office.sector}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{office.description}</p>
                
                {hoveredCompany === office.id && (
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/90 to-orange-500/90 rounded-lg flex items-center justify-center text-white p-6 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-2">{office.logo}</div>
                      <div className="text-sm font-medium">{office.name}</div>
                      <div className="text-xs opacity-90">{office.sector}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {investmentStrategies?.title || 'Investment Strategies'}
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              {investmentStrategies?.description || 'Our diversified approach across multiple asset classes and strategies'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {finalInvestments.map((investment: any, index: number) => {
              const IconComponent = getIcon(investment.icon);
              return (
                <div 
                  key={index}
                  className="group bg-slate-800 p-6 rounded-lg hover:bg-slate-700 transition-all duration-300 border border-slate-700 hover:border-amber-500"
                >
                  <div className="text-amber-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{investment.title}</h3>
                  <p className="text-slate-300">{investment.description}</p>
                </div>
              );
            })}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/investment-classes">
              <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300">
                Learn About Our Investment Classes
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
