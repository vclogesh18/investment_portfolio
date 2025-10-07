import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { usePageContent } from '../hooks/usePageContent';
import { LoadingState, ErrorState } from '../components/LoadingComponents';
import DynamicForm from '../components/DynamicForm';

const ContactPage = () => {
  const { loading, error, hero, features } = usePageContent('contact');

  // Loading state
  if (loading) {
    return (
      <div className="pt-20">
        <LoadingState>Loading contact page...</LoadingState>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="pt-20">
        <ErrorState error={error} />
      </div>
    );
  }

  // Get contact info from API
  const officeLocationsSection = features?.find((feature: any) => feature.section_name === 'office_locations');

  // Fallback office locations if API doesn't have data yet
  const fallbackOfficeLocations = [
    {
      city: 'New York',
      address: '350 Fifth Avenue, Suite 7810, New York, NY 10118',
      phone: '+1 (212) 555-0123',
      email: 'ny@sevenboson.com'
    },
    {
      city: 'London',
      address: '25 Old Broad Street, London EC2N 1HQ, United Kingdom',
      phone: '+44 20 7555 0123',
      email: 'london@sevenboson.com'
    },
    {
      city: 'Singapore',
      address: '1 Raffles Quay, #26-10, Singapore 048583',
      phone: '+65 6555 0123',
      email: 'singapore@sevenboson.com'
    }
  ];

  const officeLocations = officeLocationsSection?.items || fallbackOfficeLocations;

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section 
        className="py-20 bg-gradient-to-br from-slate-800 to-slate-900 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(30, 41, 59, 0.9), rgba(30, 41, 59, 0.9)), url('${hero?.background_image_url || 'https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=1920'}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {hero?.title || 'Get in Touch With Us'}
          </h1>
          <p className="text-xl text-slate-300">
            {hero?.description || 'Ready to explore investment opportunities or discuss partnership possibilities? Our team is here to help you navigate your next strategic move.'}
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-slate-800 mb-6">
                  Send Us a Message
                </h2>
                
                <DynamicForm 
                  slug="contact"
                  onSubmitSuccess={(data) => {
                    console.log('Contact form submitted successfully:', data);
                  }}
                  onSubmitError={(error) => {
                    console.error('Contact form submission error:', error);
                  }}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-6">
                  Contact Information
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="text-amber-500 mr-4 mt-1 flex-shrink-0" size={24} />
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">Global Headquarters</h3>
                      <p className="text-slate-600">
                        4 W. 4th Street, San Mateo, <br />
                        California
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="text-amber-500 mr-4 mt-1 flex-shrink-0" size={24} />
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">Phone</h3>
                      <p className="text-slate-600">+1 (415) 940-1476</p>
                      <p className="text-slate-600">+91 984-144-5136</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Mail className="text-amber-500 mr-4 mt-1 flex-shrink-0" size={24} />
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">Email</h3>
                      <p className="text-slate-600">chet.white@sevenbosongroup.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="text-amber-500 mr-4 mt-1 flex-shrink-0" size={24} />
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">Business Hours</h3>
                      <p className="text-slate-600">
                        Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                        Weekend: By appointment only
                      </p>
                    </div>
                  </div>

                  {/* <div className="flex items-start">
                    <Linkedin className="text-amber-500 mr-4 mt-1 flex-shrink-0" size={24} />
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">LinkedIn</h3>
                      <a href="#" className="text-amber-600 hover:text-amber-700 transition-colors">
                        LinkedIn
                      </a>
                    </div>
                  </div> */}
                </div>
              </div>

              {/* Response Time */}
              <div className="bg-slate-50 rounded-lg p-6">
                <h3 className="font-semibold text-slate-800 mb-3">Response Time</h3>
                <p className="text-slate-600 text-sm">
                  We typically respond to all inquiries within 24 hours during business days. 
                  For urgent investment matters, please call our direct line.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Global Offices
            </h2>
            <p className="text-xl text-slate-600">
              We have offices in major financial centers worldwide to serve our global clientele.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {officeLocations.map((office: any, index: number) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-slate-800 mb-4">{office.city}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <MapPin className="text-amber-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
                    <p className="text-slate-600">{office.address}</p>
                  </div>
                  <div className="flex items-center">
                    <Phone className="text-amber-500 mr-2 flex-shrink-0" size={16} />
                    <p className="text-slate-600">{office.phone}</p>
                  </div>
                  <div className="flex items-center">
                    <Mail className="text-amber-500 mr-2 flex-shrink-0" size={16} />
                    <p className="text-slate-600">{office.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;