import React, { useState } from 'react';
import { Globe, Target, TrendingUp, Users, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const investments = [
    { icon: Zap, title: 'Disruptive Innovation Funds', description: 'Investing in cutting-edge tech (AI, MedTech, Quantum) through hedge and venture funds.' },
    { icon: Users, title: 'Distressed Private Equity (LBO)', description: 'Control positions in undervalued companies with 2–5x leverage for turnaround and growth.' },
    { icon: Globe, title: 'Strategic Assets', description: 'High-yield, fully-levered strategic assets (8–10x) with strong cash flow and appreciation potential.' },
    { icon: TrendingUp, title: 'High-Yield Structured Portfolio', description: 'Targeting 8–15% yield or 35–50% ROI via preferred equity, convertible or high-yield debt.' },
    { icon: Shield, title: 'Active Management Support', description: 'Hands-on growth support to accelerate revenue and profits through corporate venture strategies.' },
    { icon: Target, title: 'Distressed GARP (LBO)', description: 'Opportunistic LBOs with strong fundamentals at deep discounts for high upside, low risk.' }
  ];
  const [hoveredCompany, setHoveredCompany] = useState(null);

  const companies = [
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
    },
    {
      id: 5,
      name: 'Australia',
      logo: 'AU',
      sector: 'AI/ML',
      description: 'Brain-computer interfaces and neural processing technologies',
      stage: 'Seed'
    },
    {
      id: 6,
      name: 'Cayman Islands Headquarter',
      logo: 'KY',
      sector: 'Aerospace',
      description: 'Commercial space manufacturing and orbital logistics',
      stage: 'Series A'
    }
  ];

   const getSectorColor = (sector) => {
    const colors = {
      'Quantum Computing': 'bg-purple-500',
      'MedTech': 'bg-red-500',
      'Clean Energy': 'bg-green-500',
      'Robotics': 'bg-blue-500',
      'AI/ML': 'bg-indigo-500',
      'Aerospace': 'bg-gray-500',
      'Cybersecurity': 'bg-orange-500',
      'Biotechnology': 'bg-pink-500',
      'AgTech': 'bg-lime-500',
      'Data Analytics': 'bg-cyan-500',
      'Materials Science': 'bg-amber-500',
      'Digital Health': 'bg-teal-500'
    };
    return colors[sector] || 'bg-slate-500';
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section 
        className="py-20 bg-gradient-to-br from-slate-800 to-slate-900 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(30, 41, 59, 0.9), rgba(30, 41, 59, 0.9)), url('https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Seven Boson Group
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              Seven Boson Group Ltd delivers superior, high-yield, risk-adjusted returns by targeting the 
              transformative growth of tomorrow’s most disruptive sectors — including AI-as-a-Service, 
              Robotics, Quantum Computing, Next-Gen Energy, MedTech, and Core Enabling Technologies. Our portfolio is engineered to capture outsized returns by backing category-defining innovation at the inflection point of global adoption.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                Disciplined. Diversified. Data-Driven
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                We apply a disciplined GARP strategy across real estate, private equity, and alternatives—amplified by structured high-yield instruments and active management to unlock asymmetric, risk-adjusted returns.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Seven Boson Group Ltd – A Private Equity Holding Company Global Footprint
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

      {/* Mission Statement */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-8">
            Our Mission
          </h2>
          <blockquote className="text-2xl md:text-3xl font-medium text-slate-700 italic mb-8">
            "Our Mission is to become the leading global private equity holding company delivering consistent high yield returns 
            capturing the growth of tomorrow’s most innovative sectors – AI as a Service, Robotics, Quantum Compute, Next Gen Energy, MedTech"
          </blockquote>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto"></div>
        </div>
      </section>

      {/* Global Reach */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Global Reach
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our investment footprint spans across major financial centers and emerging markets worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {companies.map((company) => (
              <div
                key={company.id}
                className="group relative bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-amber-200 cursor-pointer"
                onMouseEnter={() => setHoveredCompany(company.id)}
                onMouseLeave={() => setHoveredCompany(null)}
              >
                {/* Logo */}
                <div className={`w-16 h-16 rounded-lg ${getSectorColor(company.sector)} flex items-center justify-center text-white font-bold text-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {company.logo}
                </div>
                
                {/* Company Info */}
                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-amber-600 transition-colors">
                  {company.name}
                </h3>
                {/* <p className="text-sm text-amber-600 font-medium mb-2">{company.sector}</p>
                <p className="text-xs text-slate-500 mb-4">{company.stage}</p> */}
                
                {/* Hover Description */}
                {/* <div className={`transition-all duration-300 ${
                  hoveredCompany === company.id 
                    ? 'opacity-100 max-h-20' 
                    : 'opacity-0 max-h-0 overflow-hidden'
                }`}>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {company.description}
                  </p>
                </div> */}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Invest In */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What We Invest In
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Seven Boson Group Ltd Drives Superior Yield and Total Return with Minimized Risk
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {investments.map((investment, index) => (
              <div 
                key={index}
                className="group bg-slate-800 p-6 rounded-lg hover:bg-slate-700 transition-all duration-300 border border-slate-700 hover:border-amber-500"
              >
                <div className="text-amber-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <investment.icon size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">{investment.title}</h3>
                <p className="text-slate-300">{investment.description}</p>
              </div>
            ))}
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