
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Match } from '@/api/entities';
import { JobPost } from '@/api/entities';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Star, MapPin, Clock, DollarSign } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

export default function Matches() {
  const [currentUser, setCurrentUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);

      // Get matches for current user
      const userMatches = await Match.filter({
        [user.user_type === 'candidate' ? 'candidate_id' : 'employer_id']: user.id
      }, '-created_date');

      // Enrich matches with profile data
      const enrichedMatches = await Promise.all(
        userMatches.map(async (match) => {
          try {
            let profile = null;
            let jobPost = null;

            if (user.user_type === 'candidate') {
              // Get employer profile and job post
              const employers = await User.filter({ id: match.employer_id });
              profile = employers[0];
              if (match.job_post_id !== 'placeholder') {
                const jobPosts = await JobPost.filter({ id: match.job_post_id });
                jobPost = jobPosts[0];
              }
            } else {
              // Get candidate profile
              const candidates = await User.filter({ id: match.candidate_id });
              profile = candidates[0];
            }

            return {
              ...match,
              profile,
              jobPost
            };
          } catch (error) {
            return match;
          }
        })
      );

      setMatches(enrichedMatches.filter(match => match.profile));
    } catch (error) {
      console.error('Error loading matches:', error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Skeleton className="h-8 w-48 mx-auto mb-2" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Your Matches</h1>
          <p className="text-white/60">
            {matches.length} {currentUser?.user_type === 'candidate' ? 'job opportunities' : 'talented candidates'}
          </p>
        </div>

        {/* Matches List */}
        {matches.length > 0 ? (
          <div className="space-y-4">
            {matches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="swipe-card border-none overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Profile Image */}
                      <div className="relative">
                        {match.profile?.profile_image || match.jobPost?.company_logo ? (
                          <img 
                            src={match.profile?.profile_image || match.jobPost?.company_logo} 
                            alt="Profile"
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-fuchsia-600 flex items-center justify-center">
                            <span className="text-white font-bold text-xl">
                              {currentUser?.user_type === 'candidate' 
                                ? (match.jobPost?.company?.[0] || match.profile?.company?.[0] || 'C')
                                : match.profile?.full_name?.[0]}
                            </span>
                          </div>
                        )}
                        
                        {/* Compatibility Badge */}
                        <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                          <Heart className="w-3 h-3 text-white" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {currentUser?.user_type === 'candidate' 
                              ? (match.jobPost?.title || 'Job Opportunity')
                              : match.profile?.full_name}
                          </h3>
                          <p className="text-gray-600">
                            {currentUser?.user_type === 'candidate' 
                              ? (match.jobPost?.company || match.profile?.company)
                              : match.profile?.job_title}
                          </p>
                        </div>

                        {/* Details */}
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{match.profile?.location}</span>
                          </div>
                          
                          {match.profile?.salary_range && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              <span>{match.profile?.salary_range}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span className="capitalize">
                              {match.profile?.remote_preference || match.jobPost?.remote_type}
                            </span>
                          </div>
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2">
                          {(currentUser?.user_type === 'candidate' 
                            ? match.jobPost?.required_skills 
                            : match.profile?.skills
                          )?.slice(0, 4).map((skill) => (
                            <Badge key={skill} variant="secondary" className="bg-purple-100 text-purple-800">
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        {/* Compatibility Score */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">
                              {match.compatibility_score}% Match
                            </span>
                          </div>

                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-white py-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 max-w-sm mx-auto">
              <Heart className="w-16 h-16 mx-auto mb-4 text-white/60" />
              <h2 className="text-2xl font-bold mb-4">No matches yet</h2>
              <p className="text-white/80">
                Start swiping to find your perfect {currentUser?.user_type === 'candidate' ? 'job' : 'candidate'} matches!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
