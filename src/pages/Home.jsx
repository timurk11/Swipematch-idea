
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { JobPost } from '@/api/entities';
import { Match } from '@/api/entities';
import { InvokeLLM } from '@/api/integrations';
import SwipeCard from '../components/swipe/SwipeCard';
import ProfileSetup from '../components/profile/ProfileSetup';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Home() {
  const [currentUser, setCurrentUser] = useState(null);
  const [swipeItems, setSwipeItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    loadUserAndItems();
  }, []);

  const loadUserAndItems = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      if (!user.setup_completed) {
        setNeedsSetup(true);
        setIsLoading(false);
        return;
      }

      await loadSwipeItems(user);
    } catch (error) {
      console.error('Error loading user:', error);
    }
    setIsLoading(false);
  };

  const loadSwipeItems = async (user) => {
    try {
      let items = [];
      
      if (user.user_type === 'candidate') {
        // Load job posts for candidates
        items = await JobPost.list('-created_date', 50);
      } else {
        // Load candidates for employers
        const candidates = await User.filter({ user_type: 'candidate' }, '-created_date', 50);
        items = candidates.filter(candidate => candidate.setup_completed);
      }

      // Calculate compatibility scores using AI
      const itemsWithScores = await Promise.all(
        items.slice(0, 10).map(async (item) => {
          try {
            const compatibility = await calculateCompatibility(user, item);
            return { ...item, compatibility_score: compatibility };
          } catch (error) {
            return { ...item, compatibility_score: Math.floor(Math.random() * 30) + 60 };
          }
        })
      );

      // Sort by compatibility score
      setSwipeItems(itemsWithScores.sort((a, b) => b.compatibility_score - a.compatibility_score));
    } catch (error) {
      console.error('Error loading swipe items:', error);
    }
  };

  const calculateCompatibility = async (user, item) => {
    try {
      const prompt = `Calculate compatibility score (0-100) between:
        
        User Profile:
        - Type: ${user.user_type}
        - Skills: ${user.skills?.join(', ')}
        - Experience: ${user.experience_level}
        - Location: ${user.location}
        - Remote Preference: ${user.remote_preference}
        
        ${user.user_type === 'candidate' ? 'Job Post' : 'Candidate'} Profile:
        - ${user.user_type === 'candidate' ? 'Required Skills' : 'Skills'}: ${(user.user_type === 'candidate' ? item.required_skills : item.skills)?.join(', ')}
        - Experience Level: ${item.experience_level}
        - Location: ${item.location}
        - ${user.user_type === 'candidate' ? 'Remote Type' : 'Remote Preference'}: ${user.user_type === 'candidate' ? item.remote_type : item.remote_preference}
        
        Consider skill match, location compatibility, experience alignment, and work style preferences.`;

      const result = await InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            score: { type: "number" },
            reasoning: { type: "string" }
          }
        }
      });

      return Math.min(100, Math.max(0, result.score || 75));
    } catch (error) {
      return Math.floor(Math.random() * 30) + 60;
    }
  };

  const handleSwipe = async (direction) => {
    if (currentIndex >= swipeItems.length) return;

    const currentItem = swipeItems[currentIndex];
    
    if (direction === 'right') {
      // Create match entry
      try {
        const matchData = {
          candidate_id: currentUser.user_type === 'candidate' ? currentUser.id : currentItem.id,
          employer_id: currentUser.user_type === 'employer' ? currentUser.id : currentItem.employer_id || currentItem.id,
          job_post_id: currentUser.user_type === 'candidate' ? currentItem.id : 'placeholder',
          compatibility_score: currentItem.compatibility_score,
          status: 'pending',
          candidate_swiped_right: currentUser.user_type === 'candidate',
          employer_swiped_right: currentUser.user_type === 'employer'
        };
        
        await Match.create(matchData);
      } catch (error) {
        console.error('Error creating match:', error);
      }
    }

    setCurrentIndex(prev => prev + 1);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    setCurrentIndex(0);
    await loadSwipeItems(currentUser);
    setIsLoading(false);
  };

  const handleSetupComplete = () => {
    setNeedsSetup(false);
    loadUserAndItems();
  };

  if (needsSetup) {
    return <ProfileSetup onComplete={handleSetupComplete} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-lg">Finding perfect matches...</p>
        </div>
      </div>
    );
  }

  const currentItem = swipeItems[currentIndex];
  const hasMoreItems = currentIndex < swipeItems.length;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 text-white">
        <div>
          <h1 className="text-2xl font-bold">Swipe Match</h1>
          <p className="text-white/60">
            {currentUser?.user_type === 'candidate' ? 'Find your dream job' : 'Find amazing talent'}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          className="text-white hover:bg-white/10"
        >
          <RefreshCw className="w-5 h-5" />
        </Button>
      </div>

      {/* Swipe Area */}
      <div className="flex-1 relative px-4 pb-8">
        {hasMoreItems ? (
          <div className="relative h-full max-w-sm mx-auto">
            {/* Background Cards */}
            {swipeItems.slice(currentIndex + 1, currentIndex + 3).map((item, index) => (
              <motion.div
                key={`${currentIndex + index + 1}`}
                className="swipe-card absolute inset-4 rounded-3xl"
                style={{
                  scale: 1 - (index + 1) * 0.05,
                  y: (index + 1) * 10,
                  zIndex: 10 - index
                }}
                initial={{ scale: 1 - (index + 2) * 0.05, y: (index + 2) * 10 }}
                animate={{ scale: 1 - (index + 1) * 0.05, y: (index + 1) * 10 }}
                transition={{ duration: 0.3 }}
              />
            ))}

            {/* Current Card */}
            <AnimatePresence mode="wait">
              {currentItem && (
                <SwipeCard
                  key={currentIndex}
                  item={currentItem}
                  onSwipe={handleSwipe}
                  isCandidate={currentUser?.user_type === 'employer'}
                />
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-white">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 max-w-sm">
              <h2 className="text-2xl font-bold mb-4">That's all for now!</h2>
              <p className="text-white/80 mb-6">
                You've seen all available {currentUser?.user_type === 'candidate' ? 'jobs' : 'candidates'}. 
                Check back later for more matches.
              </p>
              <Button
                onClick={handleRefresh}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
