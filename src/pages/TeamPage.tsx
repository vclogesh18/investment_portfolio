import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Linkedin, Mail, Award } from 'lucide-react';
import ChetWhite from '../images/teams/Chet-White.png';
import Benoy from '../images/teams/Benoy-Varghese.png';
import Chris from '../images/teams/Chris-Jarrous.png';
import Amaran from '../images/teams/Jay-Amaran.png';
import Cooleen from '../images/teams/John-Cooleen.png';
import Ramesh from '../images/teams/Ramesh-Santhanam.jpeg';
import AniruddhRamesh from '../images/teams/Aniruddh-Ramesh.jpg';

   const handleClick = (url) => {
    console.log("URL == ", url)
    window.open(url, '_blank');
  };
const TeamPage = () => {



  const mgpTeamMembers = [
    {
      name: 'Chet White',
      title: 'Managing General Partner, 7Boson | MGP/PM Helios Alpha | MP Carat Ventures',
      //subtitle: 'MGP B.I.G. Global, MGP/PM of Helios Alpha, MP Carat Ventures',
      experience: 'Chet White has over 35 years of investment management and financial advisory experience, focusing on emerging growth technology companies. He previously served as Managing Director of Technology Investment Banking at MCF & Co., Senior Vice President of Emerging Technology Equity Research at Wells Fargo and L.H. Friend, and Investment Executive at UBS and Morgan Stanley.',
      //background: 'MD Technology Investment Banking at MCF & Co.. –SVP of emerging technology equity research at Wells Fargo, L. H. Friend, Investment executive at UBS and Morgan Stanley.',
      education: 'Chet holds an MBA from the University of Southern California and a B.S. in Finance from the University of Maryland and is a member of the San Francisco CFA Society.',
      image: ChetWhite,
      Linkedin_url: 'https://www.linkedin.com/in/chet-white/',
      emailID: 'chet.white@sevenbosongroup.com'
    },
    {
      name: 'Ramesh Santhanam',
      title: 'Managing Partner, 7Boson',
      //subtitle: 'Former CBRE Global Investment Partners',
      experience: 'Ramesh Santhanam brings more than 30 years of global technology leadership across next-generation energy, solar, wind, battery and electric vehicles, 5G/6G communications, enterprise software, defense technology, cryogenics, and biotechnology. He has served as Chief Innovation Officer at IIT Madras, Director at Cryogenics Ltd., Chairman of ACL Chemicals, and Vice President & Head of Business Development and Projects at Ashok Leyland Ltd.',
      //background: 'Chief Innovation Officer IIT Madras, Director Cryogenics, Ltd, Chairman ACL Chemicals, V.P. Head of BD and Projects Ashok Leyland, Ltd',
      education: 'He earned a B.S. in Physics and Aeronautical Engineering from MIT and a Master’s in Manufacturing Engineering from Arizona State University, where he was a Regents Scholar and member of the U.S. Honor Society.',
      image: Ramesh,
      Linkedin_url: 'https://www.linkedin.com/in/ramesh-santhanam-33919a52/',
      emailID: 'ramesh@sevenbosongroup.com'
    },
    {
      name: 'Chris Jarrous',
      title: 'Managing Partner, 7Boson | MGP/PM Helios Alpha | CFA',
      //subtitle: 'CFA, MP B.I.G. Global, MGP/ PM Helios Alpha',
      experience: 'Chris Jarrous has 25 years of experience in investment management and financial advisory, specializing in emerging growth technology companies. He spent 10 years as Managing Partner and Portfolio Manager at Dunlap Equity Partners, was a private investor with JF Investments, and served as Senior Vice President and Co-Portfolio Manager at MicroCapital.',
      //background: '10 years MP and PM of Dunlap Equity Partners, Private Investor JF Investments., Senior VP and Co-Portfolio Manager, MicroCapital.',
      education: 'Chris earned an MBA from the University of California, Los Angeles, and a B.S. in Finance from the University of California, Berkeley. He is a CFA charterholder and member of the San Francisco CFA Society.',
      image: Chris,
      Linkedin_url: 'https://www.linkedin.com/in/chris-jarrous/',
      emailID: 'Chris.jarrous@sevenbosongroup.com'
    },
    {
      name: 'Jay Amaran',
      title: 'Director of Education and Government services, 7Boson',
      //subtitle: 'MGP B.I.G. Global',
      experience: 'Jay Amaran brings over 44 years of global experience, including 27 years with the World Bank, where his work created a footprint across more than 135 countries. His expertise covers global banking, real estate, and technology investments.',
      //background: 'Expertise in global banking, real-estate and technology',
      education: 'Jay is an alumnus of IIT Madras, IIM Ahmedabad, and MIT Cambridge.',
      image: Amaran,
      Linkedin_url: 'https://www.linkedin.com/in/jay78iit80iim96mit/',
      emailID: ''
    },
    {
      name: 'Benoy Varghese',
      title: 'Managing Partner, 7Boson Qatar',
      //subtitle: 'MP B.I.G. Global Qatar',
      experience: 'Benoy Varghese is a commerce graduate with more than 32 years of extensive experience leading finance and investment functions across major groups in India and the Middle East. His expertise spans corporate finance, strategic investments, and high-level financial management for diversified enterprises.',
      //background: '-',
      education: '-',
      image: Benoy,
      Linkedin_url: '',
      emailID: ''
    },
    {
      name: 'John Cooleen',
      title: 'Partner, 7Boson | Partner, Helios Alpha Fund',
      //subtitle: 'Partner B.I.G Global, Partner Helios Alpha Fund',
      experience: 'John Cooleen has over 25 years of capital markets investing experience with a proven record of originating, structuring, and successfully funding complex transactions for venture and growth-stage companies. He held roles in Merrill Lynch’s Private Client Group and senior positions in investment banking, institutional equities, and capital markets at First Security Bank, Wells Fargo, and B. Riley.',
      background: 'John lives in the Philadelphia area with his wife and three children. He is a U.S. Marine Corps veteran and second-generation Marine, a competitive sculler, and holds FINRA Series 63, 65, 7, 79, and 24 licenses.',
      education: '',
      image: Cooleen,
      Linkedin_url: 'https://www.linkedin.com/in/john-cooleen/',
      emailID: ''
    },
    {
      name: 'Aniruddh Ramesh (Ph.D.)',
      title: 'Director of Technology, 7Boson',
      //subtitle: 'Partner B.I.G Global, Partner Helios Alpha Fund',
      experience: 'Dr. Aniruddh Ramesh (Ph.D.), a Singapore Permanent Resident, is a sustainability- driven technology leader specializing in advanced battery systems and clean energy integration. He holds a PhD in Mechanical Engineering from the National University of Singapore with a perfect academic record and is the inventor of two global patents in next-generation sodium-ion battery materials. His work spans both breakthrough research and commercialization.',
      background: 'Aniruddh’s early career includes R&D roles at the Indian Space Research Organization and electric mobility engineering at Ashok Leyland, strengthening his end-to-end perspective from deep tech to scalable solutions. At 7Boson, he drives technology strategy and innovation across energy storage and digital infrastructure, enabling resilient, sustainable ecosystems.',
      education: 'Outside work, he is passionate about fitness, cricket, travel, photography, and giving back to the community.',
      image: AniruddhRamesh,
      Linkedin_url: 'https://www.linkedin.com/in/dr-aniruddh-ramesh-phd-19b045162/',
      emailID: 'aniruddh.ramesh@sevenbosongroup.com'
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section 
        className="py-20 bg-gradient-to-br from-slate-800 to-slate-900 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(30, 41, 59, 0.9), rgba(30, 41, 59, 0.9)), url('https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1920')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Our Team
          </h1>
          <div className="flex items-center justify-center mb-6">
            <Award className="text-amber-500 mr-3" size={32} />
            <p className="text-2xl text-amber-400 font-semibold">
              Over a Century of Collective Investment & Technology Leadership Experience
            </p>
          </div>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto">
            Our Managing Team have been shaped at the world’s most prestigious investment firms, global corporations, and frontier technology ventures. We combine deep sector knowledge with an operator-investor mindset — not just identifying opportunities, but designing, building, and scaling them into enduring enterprises.
          </p>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Managing General Partners and Portfolio Managers
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our advisory board includes industry luminaries and thought leaders who provide 
              strategic guidance and deep sector expertise.
            </p>
          </div> */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {mgpTeamMembers.map((member, index) => (
              <div 
                key={index}
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-slate-100"
              >
                <div className="md:flex">
                  <div className="md:w-48 md:flex-shrink-0">
                    <div 
                      className="h-48 md:h-full bg-gray-200"
                      style={{
                        backgroundImage: `url('${member.image}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    ></div>
                  </div>
                  <div className="p-6 md:flex-1">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-slate-800 group-hover:text-amber-600 transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-amber-600 font-medium text-sm mb-1">{member.title}</p>
                      {/* <p className="text-slate-600 text-sm mb-3">{member.subtitle}</p> */}
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <p className="text-slate-700">
                        {/* <span className="font-medium">Experience:</span>  */}
                        {member.experience}
                      </p>
                      {/* <p className="text-slate-700">
                        <span className="font-medium">Background:</span> {member.background}
                      </p> */}
                      <p className="text-slate-700">
                        {/* <span className="font-medium">Education:</span>  */}
                        {member.education}
                      </p>
                    </div>
                    
                    <div className="mt-4 flex space-x-3">
                      <button onClick={() => handleClick(member.Linkedin_url)} className="text-slate-400 hover:text-amber-500 transition-colors">
                        <Linkedin size={20} />
                      </button>
                      <a href={`mailto:${member.emailID}`} className="text-slate-400 hover:text-amber-500 transition-colors">
                        <Mail size={20} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advisory Board Section */}
      {/* <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Advisory Board
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our advisory board includes industry luminaries and thought leaders who provide 
              strategic guidance and deep sector expertise.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="w-20 h-20 bg-slate-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Dr. Robert Kim</h3>
              <p className="text-amber-600 font-medium text-sm mb-2">Former CTO, Google</p>
              <p className="text-slate-600 text-sm">AI & Machine Learning Expert</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="w-20 h-20 bg-slate-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Lisa Wang</h3>
              <p className="text-amber-600 font-medium text-sm mb-2">Former Partner, Andreessen Horowitz</p>
              <p className="text-slate-600 text-sm">Venture Capital & Growth Strategy</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="w-20 h-20 bg-slate-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Dr. Mark Johnson</h3>
              <p className="text-amber-600 font-medium text-sm mb-2">Former CEO, Pfizer Ventures</p>
              <p className="text-slate-600 text-sm">Life Sciences & Healthcare</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Connect with Our Team
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Ready to discuss your investment needs or explore partnership opportunities?
          </p>
         
          <a href={`mailto:chet.white@sevenbosongroup.com`} className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300">
            Schedule a Meeting
          </a>
        </div>
      </section>
    </div>
  );
};

export default TeamPage;