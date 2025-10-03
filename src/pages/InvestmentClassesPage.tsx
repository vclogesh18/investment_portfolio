import React from 'react';
import { TrendingUp, Leaf, Activity } from 'lucide-react';
import ai_dynamic_scaling_data_center from '../images/investment-classes/ai_dynamic_scaling_data_center.png';
import ai_img from '../images/investment-classes/Artificial-Intelligence.jpeg';
import InnovationTech from '../images/investment-classes/Innovation-inv.jpeg';

const InvestmentClassesPage = () => {
  // const realEstateProjects = [
  //   {
  //     title: 'Luxury Resort Portfolio',
  //     location: 'Caribbean & Mediterranean',
  //     image: 'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=800',
  //     description: 'Premium hospitality assets in high-demand destinations'
  //   },
  //   {
  //     title: 'Medical Centers',
  //     location: 'North America',
  //     image: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=800',
  //     description: 'State-of-the-art healthcare facilities and specialized centers'
  //   },
  //   {
  //     title: 'University Campuses',
  //     location: 'Global',
  //     image: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=800',
  //     description: 'Educational infrastructure and student housing developments'
  //   },
  //   {
  //     title: 'Commercial Centers',
  //     location: 'Major Cities',
  //     image: 'https://images.pexels.com/photos/1662159/pexels-photo-1662159.jpeg?auto=compress&cs=tinysrgb&w=800',
  //     description: 'Prime retail and mixed-use commercial properties'
  //   }
  // ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section 
        className="py-20 bg-gradient-to-br from-slate-800 to-slate-900 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(30, 41, 59, 0.9), rgba(30, 41, 59, 0.9)), url('https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=1920')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            High-Growth Investment Classes
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500"> Across Global Markets</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto">
            Diversified portfolio spanning strategic assets, private equity, 
            and alternative investments in the world's most innovative sectors.
          </p>
        </div>
      </section>

      {/* Strategic Assets */}
      {/* <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <Building className="text-amber-500 mr-3" size={32} />
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
                Strategic Assets Investments
              </h2>
            </div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Premium properties strategically selected for exceptional yield potential 
              and long-term value appreciation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {realEstateProjects.map((project, index) => (
              <div 
                key={index}
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <div 
                  className="h-48 bg-gray-200 group-hover:scale-105 transition-transform duration-300"
                  style={{
                    backgroundImage: `url('${project.image}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                ></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{project.title}</h3>
                  <p className="text-amber-600 font-medium mb-3">{project.location}</p>
                  <p className="text-slate-600">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

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

      {/* AI */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <Activity className="text-red-500 mr-3" size={32} />
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
                  Strategic AI Cloud Services and Data Centers
                </h2>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Enabling Global AI Super Intelligence</h3>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Seven Boson Group Ltd invests in a network of AI-optimized cloud and data center service providers that are purpose built to support tomorrow’s AI super intelligence needs, offering fractionalized GPU resources, flexible SLAs, and advanced efficiency across computer, energy, carbon, and water. Its hybrid terrestrial and space locations deliver up to 85% cost savings over traditional models without sacrificing performance, security and reliability.
              </p>
            </div>
            <div 
              className="h-96 bg-gray-200 rounded-lg"
              style={{
                backgroundImage: `url('${ai_dynamic_scaling_data_center}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            ></div>
          </div>
        </div>
      </section>

      {/* Green Tech */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div 
              className="h-96 bg-gray-200 rounded-lg order-2 lg:order-1"
              style={{
                backgroundImage: `url('https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg?auto=compress&cs=tinysrgb&w=800')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            ></div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center mb-6">
                <Leaf className="text-green-500 mr-3" size={32} />
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
                  Green Tech Revolution
                </h2>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Why Green Tech?</h3>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                We recognize the pressing need to address environmental challenges. Our commitment to sustainability drives us to support startups dedicated to renewable energy, sustainable agriculture, clean transportation, and eco-friendly solutions.
              </p>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Positive Impact</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                By investing in Green Tech, we aim to reduce carbon footprints, mitigate climate change, and contribute to a healthier planet for future generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MedTech */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <Activity className="text-red-500 mr-3" size={32} />
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
                  Revolutionizing Healthcare with MedTech
                </h2>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Automated Value Based Healthcare</h3>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Medical technology has the power to save lives and improve the quality of care. We are dedicated to supporting startups that are creating innovative medical devices, diagnostic tools, and healthcare solutions.
              </p>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Health and Well-being</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                Our investments in MedTech aim to make healthcare more accessible, efficient, and patient-centric, fostering a healthier global community.
              </p>
            </div>
            <div 
              className="h-96 bg-gray-200 rounded-lg"
              style={{
                backgroundImage: `url('https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=800')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            ></div>
          </div>
        </div>
      </section>

      {/* AI */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div 
              className="h-96 bg-gray-200 rounded-lg order-2 lg:order-1"
              style={{
                backgroundImage: `url('${ai_img}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            ></div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center mb-6">
                <Leaf className="text-green-500 mr-3" size={32} />
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
                  Artificial Intelligence Advancements
                </h2>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">AI’s Potential</h3>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Artificial Intelligence is reshaping industries and the way we live and work. We are on the lookout for startups that are pioneering breakthroughs in machine learning, natural language processing, computer vision, and more.
              </p>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Societal Transformation</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                Our investments in AI are geared towards enhancing productivity, healthcare, education, and automation, ultimately leading to a smarter and more efficient world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MedTech */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <Activity className="text-red-500 mr-3" size={32} />
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
                  Empowering Innovation through Enabling Tech
                </h2>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Foundation of Progress</h3>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Enabling technologies form the backbone of innovation. We invest in startups that develop cutting-edge technologies, infrastructure, and platforms to enable the growth of other industries.
              </p>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Driving Progress</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                Our commitment to Enabling Tech is driven by the belief that strong foundations are essential for the rapid advancement of society and technology.
              </p>
            </div>
            <div 
              className="h-96 bg-gray-200 rounded-lg"
              style={{
                backgroundImage: `url('${InnovationTech}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            ></div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Discover Our Sectors
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Learn more about our investment approach and portfolio companies.
          </p>
          <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 inline-flex items-center group">
            Explore Investment Opportunities
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </button>
        </div>
      </section> */}
    </div>
  );
};

export default InvestmentClassesPage;