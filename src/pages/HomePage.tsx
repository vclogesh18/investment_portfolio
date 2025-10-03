import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, TrendingUp, Lightbulb, ArrowRight, Globe, Cpu, Activity, Leaf } from 'lucide-react';

const HomePage = () => {
  const pillars = [
    {
      icon: Building2,
      title: 'Private Equity',
      description: 'Strategic investments in transformational businesses with exceptional growth potential.'
    },
    {
      icon: TrendingUp,
      title: 'Strategic Tech Mergers, Acquisitions & Takeovers',
      description: 'Specialized in structuring and executing innovative transactions, driving consolidation, control, and long-term value creation for our focus areas, across strategic assets.'
    },
    {
      icon: Lightbulb,
      title: 'Alternatives',
      description: 'Cutting-edge technology investments in AI, quantum computing, and disruptive innovations.'
    }
  ];

  const sectors = [
    { icon: Cpu, name: 'AI as a Service', description: 'Next-generation artificial intelligence platforms' },
    { icon: Activity, name: 'MedTech', description: 'Revolutionary healthcare technologies' },
    { icon: Leaf, name: 'GreenTech', description: 'Sustainable energy solutions' },
    { icon: Globe, name: 'Quantum Computing', description: 'Quantum computational technologies' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url('https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1920')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500"> 
            Global Investing
            <br />
            in Transformational Businesses, Technologies, and Strategic Assets</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-slate-300 max-w-4xl mx-auto">
            Seven Boson Group Ltd — a premier global private equity holding company, fusing disciplined capital with in-house capabilities and operator-deep execution to deliver resilient, compounding returns — adding techno-commercial value at every level.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/portfolio" 
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center group"
            >
              Explore Our Portfolio
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <Link 
              to="/apply" 
              className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 rounded-lg font-semibold transition-all duration-300"
            >
              Apply for Value
            </Link>
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Investment Focus Areas
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We specialize in three core investment pillars, each designed to maximize 
              risk-adjusted returns through strategic diversification.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => (
              <div 
                key={index}
                className="group bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-amber-200"
              >
                <div className="text-amber-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <pillar.icon size={48} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">{pillar.title}</h3>
                <p className="text-slate-600 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <blockquote className="text-3xl md:text-4xl font-bold text-slate-800 mb-8">
            "Unlocking asymmetric upside through innovation and strategic investment."
          </blockquote>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto"></div>
        </div>
      </section>

      {/* Innovation Sectors */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Innovation Sectors
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We target the most disruptive and high-growth sectors driving the future economy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sectors.map((sector, index) => (
              <div 
                key={index}
                className="group p-6 rounded-lg bg-slate-50 hover:bg-gradient-to-br hover:from-amber-50 hover:to-orange-50 transition-all duration-300 border border-transparent hover:border-amber-200"
              >
                <div className="text-slate-700 group-hover:text-amber-600 mb-4 transition-colors">
                  <sector.icon size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{sector.name}</h3>
                <p className="text-sm text-slate-600">{sector.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Partner With Us?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join our portfolio of innovative companies and strategic partners.
          </p>
          <Link 
            to="/contact" 
            className="inline-flex items-center bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 group"
          >
            Contact Us Today
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </Link>
        </div>
      </section> */}
    </div>
  );
};

export default HomePage;