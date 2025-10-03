import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Seven Boson Group Ltd</h3>
            <h5 className="text-lg font-semibold mb-4">Join Us in Shaping the Future</h5>
            <p className="text-slate-300 mb-6 max-w-md">
              If you’re driven to invest in high-yield, world-class assets with transformational potential, we invite you to explore our portfolio, connect with our leadership, and discover how Seven Boson Group Ltd can help you unlock exceptional value.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-300 hover:text-white transition-colors">
                <Linkedin size={24} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-slate-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/investment-classes" className="text-slate-300 hover:text-white transition-colors">Investment Classes</Link></li>
              <li><Link to="/portfolio" className="text-slate-300 hover:text-white transition-colors">Portfolio</Link></li>
              <li><Link to="/team" className="text-slate-300 hover:text-white transition-colors">Our Team</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center text-slate-300">
                <MapPin size={18} className="mr-2" />
                4 W. 4th Street, San Mateo, California
              </li>
              <li className="flex items-center text-slate-300">
                <Mail size={18} className="mr-2" />
                chet.white@sevenbosongroup.com
              </li>
              <li className="flex items-center text-slate-300">
                <Phone size={18} className="mr-2" />
                +1 (415) 940-1476 <br/> +91 984-144-5136
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
          <p>&copy; 2025 Seven Boson Group Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;