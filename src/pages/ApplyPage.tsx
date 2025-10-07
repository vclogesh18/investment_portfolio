import { usePageContent } from '../hooks/usePageContent';
import { LoadingState, ErrorState } from '../components/LoadingComponents';
import DynamicForm from '../components/DynamicForm';

const ApplyPage = () => {
  const { loading, error, hero } = usePageContent('apply');

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

            <DynamicForm 
              slug="apply"
              onSubmitSuccess={(data) => {
                console.log('Application submitted successfully:', data);
              }}
              onSubmitError={(error) => {
                console.error('Application submission error:', error);
              }}
            />
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