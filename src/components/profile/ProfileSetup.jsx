import React, { useState } from 'react';
import { User } from '@/api/entities';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X, ArrowRight, Briefcase, Users, CheckCircle, Zap, GraduationCap, Code } from 'lucide-react';
import { motion } from 'framer-motion';

const SKILL_OPTIONS = [
  'React', 'JavaScript', 'Python', 'Node.js', 'TypeScript', 'Java', 'Go', 'Swift',
  'Kotlin', 'Flutter', 'React Native', 'Vue.js', 'Angular', 'Docker', 'Kubernetes',
  'AWS', 'GCP', 'Azure', 'MongoDB', 'PostgreSQL', 'Redis', 'GraphQL', 'REST APIs'
];

const BOOTCAMPS = {
  global: [
    'Le Wagon', 'DeepLearning.AI', 'AI Core', 'General Assembly', 'Lambda School',
    'Flatiron School', 'App Academy', 'Hack Reactor', 'The Odin Project', 'freeCodeCamp'
  ],
  uk: [
    'Makers Academy', 'Northcoders', 'School of Code', 'Code First Girls', 'Founders and Coders',
    'Tech Returners', 'Boolean UK', 'Sparta Global', 'Just IT Training', 'QA Ltd'
  ],
  cis: [
    'Yandex Practicum', 'GeekBrains', 'SkillFactory', 'Netology', 'OTUS',
    'Hexlet', 'Rolling Scopes School', 'IT Academy', 'Beetroot Academy', 'Elbrus Bootcamp'
  ]
};

const BOOTCAMP_TRACKS = [
  'Artificial Intelligence',
  'Data Science', 
  'Application Development',
  'UX/UI Design',
  'QA Automation',
  'Product Analytics',
  'LLM Engineering',
  'DevOps',
  'Other'
];

const DEGREE_TYPES = [
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'PhD',
  'Associate Degree',
  'Diploma',
  'Certificate'
];

const highlights = [
  "Work in AI, Data, Analytics, LLMs, & AppDev",
  "Hyper-personalized job suggestions", 
  "Real-time, location-based matching",
  "Verified employers and real candidates",
  "Built-in interview tools & smart filtering"
];

export default function ProfileSetup({ onComplete }) {
  const [step, setStep] = useState(0);
  const [profileData, setProfileData] = useState({
    user_type: '',
    company: '',
    job_title: '',
    bio: '',
    location: '',
    skills: [],
    experience_level: '',
    salary_range: '',
    remote_preference: '',
    setup_completed: true,
    education_type: [],
    bootcamp_info: {
      name: '',
      track: '',
      completion_year: ''
    },
    university_info: {
      name: '',
      degree: '',
      major: '',
      graduation_year: ''
    }
  });
  const [newSkill, setNewSkill] = useState('');
  const [customTrack, setCustomTrack] = useState('');

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const addSkill = (skill) => {
    if (skill && !profileData.skills.includes(skill)) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleEducationTypeChange = (educationType, checked) => {
    setProfileData(prev => ({
      ...prev,
      education_type: checked 
        ? [...prev.education_type, educationType]
        : prev.education_type.filter(type => type !== educationType)
    }));
  };

  const handleSubmit = async () => {
    try {
      await User.updateMyUserData(profileData);
      onComplete();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return true;
      case 1:
        return profileData.user_type;
      case 2:
        return profileData.job_title && profileData.location;
      case 3:
        return profileData.skills.length > 0 && profileData.experience_level;
      case 4:
        // Education is optional, so always allow proceeding
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="swipe-card border-none shadow-2xl">
          <CardContent className="p-8 space-y-6">
            {/* Progress Bar */}
            {step > 0 && (
              <div className="flex items-center justify-between mb-6">
                <div className="flex space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        i <= step ? 'bg-purple-500' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">Step {step} of 4</span>
              </div>
            )}

            {/* Step 0: Welcome Screen */}
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6 text-center"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
                  className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-fuchsia-600 rounded-2xl flex items-center justify-center"
                >
                  <Zap className="w-8 h-8 text-white" />
                </motion.div>
                
                <motion.h1 
                  className="text-3xl font-bold text-gray-900"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Find Your Dream Job with AI-Powered Precision.
                </motion.h1>
                
                <motion.p 
                  className="text-gray-600"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  SwipeMatch uses the power of Artificial Intelligence to match you with the right tech job — faster, smarter, and in your local area.
                </motion.p>
                
                <div className="space-y-3 pt-4 text-left">
                  {highlights.map((highlight, index) => (
                    <motion.div
                      key={highlight}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.15 }}
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{highlight}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 1: User Type */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Swipe Match</h1>
                  <p className="text-gray-600">Are you looking to hire or get hired?</p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => setProfileData(prev => ({ ...prev, user_type: 'candidate' }))}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      profileData.user_type === 'candidate'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-6 h-6 text-purple-500" />
                      <div className="text-left">
                        <h3 className="font-semibold">I'm looking for a job</h3>
                        <p className="text-sm text-gray-600">Find amazing opportunities</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setProfileData(prev => ({ ...prev, user_type: 'employer' }))}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      profileData.user_type === 'employer'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Users className="w-6 h-6 text-purple-500" />
                      <div className="text-left">
                        <h3 className="font-semibold">I'm hiring talent</h3>
                        <p className="text-sm text-gray-600">Find the perfect candidates</p>
                      </div>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Basic Info */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Tell us about yourself</h2>
                </div>

                {profileData.user_type === 'employer' && (
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      value={profileData.company}
                      onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Your company name"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="job_title">
                    {profileData.user_type === 'candidate' ? 'Job Title' : 'Your Role'}
                  </Label>
                  <Input
                    id="job_title"
                    value={profileData.job_title}
                    onChange={(e) => setProfileData(prev => ({ ...prev, job_title: e.target.value }))}
                    placeholder={profileData.user_type === 'candidate' ? 'e.g. Senior Developer' : 'e.g. Engineering Manager'}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>
              </motion.div>
            )}

            {/* Step 3: Skills & Preferences */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Skills & Preferences</h2>
                </div>

                <div className="space-y-2">
                  <Label>Skills</Label>
                  <div className="flex gap-2">
                    <Select onValueChange={addSkill}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Add a skill" />
                      </SelectTrigger>
                      <SelectContent>
                        {SKILL_OPTIONS.filter(skill => !profileData.skills.includes(skill)).map((skill) => (
                          <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profileData.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="bg-purple-100 text-purple-800">
                        {skill}
                        <button onClick={() => removeSkill(skill)} className="ml-1">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Experience Level</Label>
                    <Select onValueChange={(value) => setProfileData(prev => ({ ...prev, experience_level: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Entry Level</SelectItem>
                        <SelectItem value="mid">Mid Level</SelectItem>
                        <SelectItem value="senior">Senior</SelectItem>
                        <SelectItem value="lead">Lead</SelectItem>
                        <SelectItem value="executive">Executive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Work Style</Label>
                    <Select onValueChange={(value) => setProfileData(prev => ({ ...prev, remote_preference: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="onsite">On-site</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Salary Range</Label>
                  <Input
                    value={profileData.salary_range}
                    onChange={(e) => setProfileData(prev => ({ ...prev, salary_range: e.target.value }))}
                    placeholder="e.g. $80k - $120k"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 4: Education (Only for Candidates) */}
            {step === 4 && profileData.user_type === 'candidate' && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Education Background</h2>
                  <p className="text-sm text-gray-600 mt-1">Optional - helps with AI matching</p>
                </div>

                {/* Education Type Selection */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="university"
                      checked={profileData.education_type.includes('university')}
                      onCheckedChange={(checked) => handleEducationTypeChange('university', checked)}
                    />
                    <Label htmlFor="university" className="flex items-center gap-2 cursor-pointer">
                      <GraduationCap className="w-4 h-4" />
                      University Degree
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="bootcamp"
                      checked={profileData.education_type.includes('bootcamp')}
                      onCheckedChange={(checked) => handleEducationTypeChange('bootcamp', checked)}
                    />
                    <Label htmlFor="bootcamp" className="flex items-center gap-2 cursor-pointer">
                      <Code className="w-4 h-4" />
                      Bootcamp Graduate
                    </Label>
                  </div>
                </div>

                {/* University Section */}
                {profileData.education_type.includes('university') && (
                  <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      University Education
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>University Name</Label>
                        <Input
                          value={profileData.university_info.name}
                          onChange={(e) => setProfileData(prev => ({
                            ...prev,
                            university_info: { ...prev.university_info, name: e.target.value }
                          }))}
                          placeholder="e.g. Stanford University"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Degree Type</Label>
                        <Select onValueChange={(value) => setProfileData(prev => ({
                          ...prev,
                          university_info: { ...prev.university_info, degree: value }
                        }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select degree" />
                          </SelectTrigger>
                          <SelectContent>
                            {DEGREE_TYPES.map((degree) => (
                              <SelectItem key={degree} value={degree}>{degree}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Major/Specialization</Label>
                        <Input
                          value={profileData.university_info.major}
                          onChange={(e) => setProfileData(prev => ({
                            ...prev,
                            university_info: { ...prev.university_info, major: e.target.value }
                          }))}
                          placeholder="e.g. Computer Science"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Graduation Year</Label>
                        <Input
                          value={profileData.university_info.graduation_year}
                          onChange={(e) => setProfileData(prev => ({
                            ...prev,
                            university_info: { ...prev.university_info, graduation_year: e.target.value }
                          }))}
                          placeholder="e.g. 2022"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Bootcamp Section */}
                {profileData.education_type.includes('bootcamp') && (
                  <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      Bootcamp Education
                    </h3>
                    
                    <div className="space-y-2">
                      <Label>Bootcamp Name</Label>
                      <Select onValueChange={(value) => setProfileData(prev => ({
                        ...prev,
                        bootcamp_info: { ...prev.bootcamp_info, name: value }
                      }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select bootcamp" />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-50">Global</div>
                          {BOOTCAMPS.global.map((bootcamp) => (
                            <SelectItem key={bootcamp} value={bootcamp}>{bootcamp}</SelectItem>
                          ))}
                          <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-50">UK</div>
                          {BOOTCAMPS.uk.map((bootcamp) => (
                            <SelectItem key={bootcamp} value={bootcamp}>{bootcamp}</SelectItem>
                          ))}
                          <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-50">CIS Region</div>
                          {BOOTCAMPS.cis.map((bootcamp) => (
                            <SelectItem key={bootcamp} value={bootcamp}>{bootcamp}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Track/Focus Area</Label>
                        <Select onValueChange={(value) => {
                          if (value === 'Other') {
                            setCustomTrack('');
                          } else {
                            setProfileData(prev => ({
                              ...prev,
                              bootcamp_info: { ...prev.bootcamp_info, track: value }
                            }));
                          }
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select track" />
                          </SelectTrigger>
                          <SelectContent>
                            {BOOTCAMP_TRACKS.map((track) => (
                              <SelectItem key={track} value={track}>{track}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        {profileData.bootcamp_info.track === 'Other' && (
                          <Input
                            value={customTrack}
                            onChange={(e) => {
                              setCustomTrack(e.target.value);
                              setProfileData(prev => ({
                                ...prev,
                                bootcamp_info: { ...prev.bootcamp_info, track: e.target.value }
                              }));
                            }}
                            placeholder="Enter custom track"
                            className="mt-2"
                          />
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Completion Year</Label>
                        <Input
                          value={profileData.bootcamp_info.completion_year}
                          onChange={(e) => setProfileData(prev => ({
                            ...prev,
                            bootcamp_info: { ...prev.bootcamp_info, completion_year: e.target.value }
                          }))}
                          placeholder="e.g. 2023"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {profileData.education_type.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>Select your education background above, or skip to continue</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              {step > 1 && (
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
              )}
              <div className="ml-auto">
                {step === 0 && (
                   <Button 
                    onClick={handleNext} 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Get Started <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
                {step > 0 && step < (profileData.user_type === 'candidate' ? 4 : 3) && (
                  <Button 
                    onClick={handleNext} 
                    disabled={!canProceed()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Next <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
                {(step === 4 && profileData.user_type === 'candidate') || (step === 3 && profileData.user_type === 'employer') && (
                  <Button 
                    onClick={handleSubmit}
                    disabled={!canProceed()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Complete Setup
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}