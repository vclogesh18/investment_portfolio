import React, { useState } from 'react';
import { Upload, Send } from 'lucide-react';
import { usePageContent } from '../hooks/usePageContent';
import { LoadingState, ErrorState } from '../components/LoadingComponents';

const ApplyPage = () => {
  const { loading, error, hero, features } = usePageContent('apply');
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    country: '',
    investmentStage: '',
    fundingAmount: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="pt-20">
        <LoadingState>Loading application form...</LoadingState>
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

  // Get form configuration from API
  const countriesSection = features?.find((feature: any) => feature.section_name === 'apply_countries');
  const stagesSection = features?.find((feature: any) => feature.section_name === 'apply_stages');
  const fundingSection = features?.find((feature: any) => feature.section_name === 'apply_funding');

  // Fallback form options if API doesn't have data yet
  const fallbackCountries = [
    { value: "US", label: "United States" },
    { value: "CA", label: "Canada" },
    { value: "UK", label: "United Kingdom" },
    { value: "DE", label: "Germany" },
    { value: "FR", label: "France" },
    { value: "JP", label: "Japan" },
    { value: "AU", label: "Australia" },
    { value: "SG", label: "Singapore" },
    { value: "other", label: "Other" }
  ];

  const fallbackStages = [
    { value: "pre-seed", label: "Pre-Seed" },
    { value: "seed", label: "Seed" },
    { value: "series-a", label: "Series A" },
    { value: "series-b", label: "Series B" },
    { value: "series-c", label: "Series C" },
    { value: "growth", label: "Growth" },
    { value: "pre-ipo", label: "Pre-IPO" }
  ];

  const fallbackFunding = [
    { value: "under-1m", label: "Under $1M" },
    { value: "1m-5m", label: "$1M - $5M" },
    { value: "5m-10m", label: "$5M - $10M" },
    { value: "10m-25m", label: "$10M - $25M" },
    { value: "25m-50m", label: "$25M - $50M" },
    { value: "50m-100m", label: "$50M - $100M" },
    { value: "100m-plus", label: "$100M+" }
  ];

  const countries = countriesSection?.items || fallbackCountries;
  const stages = stagesSection?.items || fallbackStages;
  const fundingRanges = fundingSection?.items || fallbackFunding;

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section 
        className="py-20 bg-gradient-to-br from-slate-800 to-slate-900 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(30, 41, 59, 0.9), rgba(30, 41, 59, 0.9)), url('${hero?.background_image_url || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920'}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {hero?.title || 'Apply for Funding'}
          </h1>
          <p className="text-xl text-slate-300">
            {hero?.description || 'Are you building a transformational company? We\'re looking for exceptional entrepreneurs with innovative solutions that have the potential to reshape industries.'}
          </p>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                Investment Application
              </h2>
              <p className="text-lg text-slate-600">
                Tell us about your company and funding needs. We typically respond within 48 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="Enter your company name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-slate-700 mb-2">
                    Country *
                  </label>
                  <select
                    id="country"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select your country</option>
                    {countries.map((country: any) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="investmentStage" className="block text-sm font-medium text-slate-700 mb-2">
                    Investment Stage *
                  </label>
                  <select
                    id="investmentStage"
                    name="investmentStage"
                    required
                    value={formData.investmentStage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select investment stage</option>
                    {stages.map((stage: any) => (
                      <option key={stage.value} value={stage.value}>
                        {stage.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="fundingAmount" className="block text-sm font-medium text-slate-700 mb-2">
                    Funding Amount Sought *
                  </label>
                  <select
                    id="fundingAmount"
                    name="fundingAmount"
                    required
                    value={formData.fundingAmount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select funding range</option>
                    {fundingRanges.map((range: any) => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* <div>
                <label htmlFor="pitchDeck" className="block text-sm font-medium text-slate-700 mb-2">
                  Pitch Deck Upload
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-amber-400 transition-colors">
                  <Upload className="mx-auto text-slate-400 mb-4" size={48} />
                  <p className="text-slate-600 mb-2">Drop your pitch deck here or click to browse</p>
                  <p className="text-sm text-slate-500">PDF, PowerPoint files up to 10MB</p>
                  <input type="file" className="hidden" accept=".pdf,.ppt,.pptx" />
                  <button
                    type="button"
                    className="mt-4 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2 rounded-lg transition-colors"
                  >
                    Choose File
                  </button>
                </div>
              </div> */}

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
                  placeholder="Tell us about your company, the problem you're solving, your traction, and why you're seeking investment..."
                ></textarea>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-white px-12 py-4 rounded-lg font-semibold transition-all duration-300 inline-flex items-center group"
                >
                  Submit Your Pitch
                  <Send className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* What Happens Next */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              What Happens Next?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Initial Review</h3>
              <p className="text-slate-600">
                Our team reviews your application within 48 hours and provides initial feedback.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Deep Dive</h3>
              <p className="text-slate-600">
                Qualifying companies proceed to detailed due diligence and management presentations.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Partnership</h3>
              <p className="text-slate-600">
                Successful candidates receive term sheets and join our portfolio of transformational companies.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ApplyPage;