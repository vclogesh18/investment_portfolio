import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RedbackNetworks from '../images/Redback_Networks.svg';
import Procera from '../images/Procera.png';
import QuantAI from '../images/QuantAI-Digitial-logo.png';
import gopebble from '../images/gopebble.png';
import Biotricity from '../images/Biotricity.png';
import Telaverge from '../images/Telaverge.jpeg';
import aquathermindia from '../images/aquathermindia.jpeg';
import zerocode from '../images/zerocode.jpeg';

const PortfolioPage = () => {

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section 
        className="py-20 bg-gradient-to-br from-slate-800 to-slate-900 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(30, 41, 59, 0.9), rgba(30, 41, 59, 0.9)), url('https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1920')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Our Portfolio
          </h1>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto">
            A diverse collection of transformational companies across the most innovative 
            sectors, representing the future of technology and business.
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
            <div className="group relative bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-amber-200 cursor-pointer">
            <div><img src={RedbackNetworks} alt="BigCo Inc. logo"/></div>
            </div>
            <div className="group relative bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-amber-200 cursor-pointer">
            <div><img src={Procera} alt="BigCo Inc. logo"/></div>
            </div>
            <div className="group relative bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-amber-200 cursor-pointer">
            <div><img src={QuantAI} alt="BigCo Inc. logo"/></div>
            </div>
            <div className="group relative bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-amber-200 cursor-pointer">
            <div><img src={gopebble} alt="BigCo Inc. logo"/></div>
            </div>
            <div className="group relative bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-amber-200 cursor-pointer">
            <div><img src={Biotricity} alt="BigCo Inc. logo"/></div>
            </div>
            <div className="group relative bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-amber-200 cursor-pointer">
            <div><img src={Telaverge} alt="BigCo Inc. logo"/></div>
            </div>
            <div className="group relative bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-amber-200 cursor-pointer">
            <div><img src={aquathermindia} alt="BigCo Inc. logo"/></div>
            </div>
            <div className="group relative bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-amber-200 cursor-pointer">
            <div><img src={zerocode} alt="BigCo Inc. logo"/></div>
            </div>
           
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