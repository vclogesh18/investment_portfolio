import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useBrandMedia } from '../hooks/useMedia';
import { useBranding } from '../hooks/useBranding';
import sblogo from '../images/SEVEN-BOSON-LOGO.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { brandImageMap } = useBrandMedia();
  const { branding } = useBranding();

  // Get logo from dynamic media or fallback to static import
  const logoSrc = branding.logo_alt_text?.media_path 
    ? `http://localhost:5001${branding.logo_alt_text.media_path}` 
    : brandImageMap['SEVEN-BOSON-LOGO'] || sblogo;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Investment Classes', href: '/investment-classes' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Team', href: '/team' },
    { name: 'Blog', href: '/blog' },
    { name: 'Apply', href: '/apply' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <Link to="/" className="flex items-center">
          <img src={logoSrc} alt="Seven Boson Group logo" style={{ width: '75px' }}/>
            <span className={`text-2xl font-bold transition-colors ${
              isScrolled ? 'text-slate-800' : location.pathname === '/' ? 'text-white' : 'text-slate-800'
            }`}>
              Seven Boson Group
            </span>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`font-medium transition-colors hover:text-amber-500 ${
                  location.pathname === item.href 
                    ? 'text-amber-500' 
                    : isScrolled 
                      ? 'text-slate-700' 
                      : location.pathname === '/' ? 'text-white' : 'text-slate-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <button
            className={`md:hidden p-2 ${
              isScrolled ? 'text-slate-800' : location.pathname === '/' ? 'text-white' : 'text-slate-800'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 py-2 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;