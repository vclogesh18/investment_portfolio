import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Linkedin } from 'lucide-react';
import { useBranding, useFooterLinks } from '../hooks/useBranding';

const Footer = () => {
  const { branding } = useBranding();
  const { footerLinks } = useFooterLinks();

  // Extract branding values with fallbacks
  const companyName = branding.company_name?.value || 'Seven Boson Group Ltd';
  const tagline = branding.footer_tagline?.value || 'Join Us in Shaping the Future';
  const description = branding.footer_description?.value || 'If you\'re driven to invest in high-yield, world-class assets with transformational potential, we invite you to explore our portfolio, connect with our leadership, and discover how Seven Boson Group Ltd can help you unlock exceptional value.';
  const copyright = branding.footer_copyright?.value || '© 2025 Seven Boson Group Ltd. All rights reserved.';
  const address = branding.contact_address?.value || '4 W. 4th Street, San Mateo, California';
  const email = branding.contact_email?.value || 'chet.white@sevenbosongroup.com';
  const phone = branding.contact_phone?.value || '+1 (415) 940-1476';
  const phoneSecondary = branding.contact_phone_secondary?.value || '+91 984-144-5136';
  const linkedinUrl = branding.linkedin_url?.value || '#';

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">{companyName}</h3>
            <h5 className="text-lg font-semibold mb-4">{tagline}</h5>
            <p className="text-slate-300 mb-6 max-w-md">
              {description}
            </p>
            <div className="flex space-x-4">
              <a href={linkedinUrl} className="text-slate-300 hover:text-white transition-colors">
                <Linkedin size={24} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.length > 0 ? (
                footerLinks.map((link: any) => (
                  <li key={link.id}>
                    {link.is_external ? (
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-slate-300 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.url} className="text-slate-300 hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))
              ) : (
                // Fallback links if no dynamic links are available
                <>
                  <li><Link to="/about" className="text-slate-300 hover:text-white transition-colors">About Us</Link></li>
                  <li><Link to="/investment-classes" className="text-slate-300 hover:text-white transition-colors">Investment Classes</Link></li>
                  <li><Link to="/portfolio" className="text-slate-300 hover:text-white transition-colors">Portfolio</Link></li>
                  <li><Link to="/team" className="text-slate-300 hover:text-white transition-colors">Our Team</Link></li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center text-slate-300">
                <MapPin size={18} className="mr-2" />
                {address}
              </li>
              <li className="flex items-center text-slate-300">
                <Mail size={18} className="mr-2" />
                {email}
              </li>
              <li className="flex items-center text-slate-300">
                <Phone size={18} className="mr-2" />
                {phone}
                {phoneSecondary && (
                  <>
                    <br />
                    {phoneSecondary}
                  </>
                )}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
          <p>{copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;