import React from 'react';
import { Linkedin, Mail, Award } from 'lucide-react';
import { useTeamMembers, usePageContent } from '../hooks/useApi';
import { useTeamMedia } from '../hooks/useMedia';
import { LoadingState, ErrorState } from '../components/LoadingComponents';

// Fallback image imports (for when media system is not available)
import ChetWhite from '../images/teams/Chet-White.png';
import Benoy from '../images/teams/Benoy-Varghese.png';
import Chris from '../images/teams/Chris-Jarrous.png';
import Amaran from '../images/teams/Jay-Amaran.png';
import Cooleen from '../images/teams/John-Cooleen.png';
import Ramesh from '../images/teams/Ramesh-Santhanam.jpeg';
import AniruddhRamesh from '../images/teams/Aniruddh-Ramesh.jpg';

const TeamPage = () => {
  const { data: teamMembers, loading, error } = useTeamMembers();
  const { data: pageContent, loading: pageLoading, error: pageError } = usePageContent('team');
  const { teamImageMap, loading: mediaLoading } = useTeamMedia();

  // Fallback image mapping when media system is not available
  const fallbackImageMap: { [key: string]: string } = {
    'Chet White': ChetWhite,
    'Ramesh Santhanam': Ramesh,
    'Chris Jarrous': Chris,
    'Jay Amaran': Amaran,
    'Benoy Varghese': Benoy,
    'John Cooleen': Cooleen,
    'Aniruddh Ramesh (Ph.D.)': AniruddhRamesh,
  };

  // Combine dynamic media with fallback images
  const imageMap = { ...fallbackImageMap, ...teamImageMap };

  const handleClick = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  // Loading state - wait for both team data and page content
  if (loading || pageLoading) {
    return (
      <div className="pt-20">
        <LoadingState>Loading team page...</LoadingState>
      </div>
    );
  }

  if (error || pageError) {
    return (
      <div className="pt-20">
        <ErrorState error={error || pageError || 'Unknown error'} />
      </div>
    );
  }

  // Sort team members by position
  const sortedTeamMembers = [...teamMembers].sort((a, b) => a.position - b.position);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section 
        className="py-20 bg-gradient-to-br from-slate-800 to-slate-900 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(30, 41, 59, 0.9), rgba(30, 41, 59, 0.9)), url('${pageContent?.hero?.background_image_url || 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1920'}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {pageContent?.hero?.title || pageContent?.page?.hero_title || 'Our Team'}
          </h1>
          <div className="flex items-center justify-center mb-6">
            <Award className="text-amber-500 mr-3" size={32} />
            <p className="text-2xl text-amber-400 font-semibold">
              Over a Century of Collective Investment & Technology Leadership Experience
            </p>
          </div>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto" data-testid="hero-description">
            {pageContent?.hero?.description || 'Our Managing Team have been shaped at the world\'s most prestigious investment firms, global corporations, and frontier technology ventures. We combine deep sector knowledge with an operator-investor mindset — not just identifying opportunities, but designing, building, and scaling them into enduring enterprises.'}
          </p>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {sortedTeamMembers.map((member) => {
              // Use the direct image path from team API first, then fallback to imageMap
              const imageUrl = member.image ? `http://localhost:5001${member.image}` : 
                              imageMap[member.name] || '/placeholder-avatar.png';
              
              return (
              <div key={member.id} data-testid="team-member" className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                                <div className="relative h-80 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-amber-300 text-sm font-medium" data-testid="member-title">{member.title?.split(',')[0]}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {member.linkedin_url && (
                      <button
                        onClick={() => handleClick(member.linkedin_url!)}
                        className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors"
                      >
                        <Linkedin size={16} />
                      </button>
                    )}
                    {member.email && (
                      <button
                        onClick={() => handleClick(`mailto:${member.email}`)}
                        className="w-8 h-8 bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center justify-center transition-colors"
                      >
                        <Mail size={16} />
                      </button>
                    )}
                  </div>
                  
                  <div className="text-sm text-slate-600 mb-3">
                    <strong>Position:</strong> {member.title}
                  </div>
                  
                  {member.experience && (
                    <div className="text-sm text-slate-600 mb-3">
                      <strong>Experience:</strong>
                      <p className="mt-1 line-clamp-3" data-testid="member-experience">{member.experience}</p>
                    </div>
                  )}
                  
                  {member.education && (
                    <div className="text-sm text-slate-600">
                      <strong>Education:</strong>
                      <p className="mt-1" data-testid="member-education">{member.education}</p>
                    </div>
                  )}
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeamPage;