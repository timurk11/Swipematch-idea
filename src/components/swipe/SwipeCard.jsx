
import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { MapPin, Clock, DollarSign, Star, X, Heart, GraduationCap, Code } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

export default function SwipeCard({ 
  item, 
  onSwipe, 
  isCandidate = false 
}) {
  const [exitX, setExitX] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-25, 0, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  const scale = useTransform(x, [-100, 0, 100], [0.95, 1, 0.95]);
  
  const cardRef = useRef(null);

  const handleDragEnd = (event, info) => {
    const threshold = 150;
    
    if (info.offset.x > threshold) {
      setExitX(300);
      onSwipe('right');
    } else if (info.offset.x < -threshold) {
      setExitX(-300);
      onSwipe('left');
    }
  };

  const handleButtonSwipe = (direction) => {
    setExitX(direction === 'right' ? 300 : -300);
    onSwipe(direction);
  };

  return (
    <motion.div
      ref={cardRef}
      className="swipe-card absolute inset-4 rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing"
      style={{ x, rotate, opacity, scale }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={exitX !== 0 ? { x: exitX, opacity: 0 } : {}}
      transition={{ duration: 0.3 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Swipe Indicators */}
      <motion.div 
        className="absolute top-8 left-8 bg-red-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg z-10"
        style={{ opacity: useTransform(x, [0, -100], [0, 1]) }}
      >
        <X className="w-6 h-6" />
      </motion.div>
      
      <motion.div 
        className="absolute top-8 right-8 bg-green-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg z-10"
        style={{ opacity: useTransform(x, [0, 100], [0, 1]) }}
      >
        <Heart className="w-6 h-6" />
      </motion.div>

      {/* Card Content */}
      <div className="h-full flex flex-col">
        {/* Header Image/Avatar */}
        <div className="relative h-48 bg-gradient-to-br from-purple-400 to-fuchsia-600 flex items-center justify-center">
          {item.profile_image || item.company_logo ? (
            <img 
              src={item.profile_image || item.company_logo} 
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {isCandidate ? item.full_name?.[0] : item.company?.[0]}
              </span>
            </div>
          )}
          
          {/* Compatibility Score */}
          <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
            <div className="flex items-center gap-1 text-white">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-bold">{Math.floor(Math.random() * 30) + 70}%</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isCandidate ? item.full_name : item.title}
            </h2>
            <p className="text-lg text-gray-600">
              {isCandidate ? item.job_title : item.company}
            </p>
          </div>

          <p className="text-gray-700 line-clamp-3">
            {isCandidate ? item.bio : item.description}
          </p>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{item.location}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm">{item.salary_range}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm capitalize">{item.remote_preference || item.remote_type}</span>
            </div>
          </div>

          {/* Education (for candidates only) */}
          {isCandidate && item.education_type && item.education_type.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Education</h3>
              <div className="space-y-2">
                {item.education_type.includes('university') && item.university_info?.name && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <GraduationCap className="w-4 h-4" />
                    <span>{item.university_info.degree} in {item.university_info.major} - {item.university_info.name}</span>
                  </div>
                )}
                {item.education_type.includes('bootcamp') && item.bootcamp_info?.name && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Code className="w-4 h-4" />
                    <span>{item.bootcamp_info.name} - {item.bootcamp_info.track}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Skills */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              {isCandidate ? 'Skills' : 'Required Skills'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {(isCandidate ? item.skills : item.required_skills)?.slice(0, 6).map((skill) => (
                <Badge key={skill} variant="secondary" className="bg-purple-100 text-purple-800">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 pt-0 flex justify-center gap-6">
          <motion.button
            className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg transition-colors"
            whileTap={{ scale: 0.9 }}
            onClick={() => handleButtonSwipe('left')}
          >
            <X className="w-8 h-8" />
          </motion.button>
          
          <motion.button
            className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white shadow-lg transition-colors"
            whileTap={{ scale: 0.9 }}
            onClick={() => handleButtonSwipe('right')}
          >
            <Heart className="w-8 h-8" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
