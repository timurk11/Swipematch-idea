
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit3, Save, X, Plus, LogOut, MapPin, Briefcase, Clock, GraduationCap, Code } from 'lucide-react';
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
  'Artificial Intelligence', 'Data Science', 'Application Development', 'UX/UI Design',
  'QA Automation', 'Product Analytics', 'LLM Engineering', 'DevOps', 'Other'
];

const DEGREE_TYPES = [
  'Bachelor\'s Degree', 'Master\'s Degree', 'PhD', 'Associate Degree', 'Diploma', 'Certificate'
];

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      setEditData({
        ...userData,
        education_type: userData.education_type || [],
        bootcamp_info: userData.bootcamp_info || { name: '', track: '', completion_year: '' },
        university_info: userData.university_info || { name: '', degree: '', major: '', graduation_year: '' }
      });
    } catch (error) {
      console.error('Error loading user:', error);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await User.updateMyUserData(editData);
      setUser(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
    setIsSaving(false);
  };

  const handleCancel = () => {
    setEditData({
      ...user,
      education_type: user.education_type || [],
      bootcamp_info: user.bootcamp_info || { name: '', track: '', completion_year: '' },
      university_info: user.university_info || { name: '', degree: '', major: '', graduation_year: '' }
    });
    setIsEditing(false);
  };

  const addSkill = (skill) => {
    if (skill && !editData.skills?.includes(skill)) {
      setEditData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), skill]
      }));
    }
  };

  const removeSkill = (skillToRemove) => {
    setEditData(prev => ({
      ...prev,
      skills: prev.skills?.filter(skill => skill !== skillToRemove) || []
    }));
  };

  const handleEducationTypeChange = (educationType, checked) => {
    setEditData(prev => ({
      ...prev,
      education_type: checked
        ? [...(prev.education_type || []), educationType]
        : (prev.education_type || []).filter(type => type !== educationType)
    }));
  };

  const handleLogout = async () => {
    try {
      await User.logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="relative inline-block mb-4">
            {user?.profile_image ? (
              <img
                src={user.profile_image}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-fuchsia-600 flex items-center justify-center border-4 border-white shadow-lg">
                <span className="text-4xl font-bold text-white">
                  {user?.full_name?.[0] || 'U'}
                </span>
              </div>
            )}

            {/* Status Indicator */}
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-fuchsia-500 rounded-full border-2 border-white"></div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">{user?.full_name}</h1>
          <p className="text-white/80 text-lg">{user?.job_title}</p>
          {user?.company && (
            <p className="text-white/60">at {user.company}</p>
          )}
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="swipe-card border-none shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Profile Information</CardTitle>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      className="gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-fuchsia-600 hover:bg-fuchsia-700 gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-600">
                    {user?.email}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>User Type</Label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <Badge variant={user?.user_type === 'candidate' ? 'default' : 'secondary'}>
                      {user?.user_type === 'candidate' ? 'Job Seeker' : 'Employer'}
                    </Badge>
                  </div>
                </div>
              </div>

              {isEditing && user?.user_type === 'employer' && (
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={editData.company || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Company name"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor={isEditing ? "job_title" : undefined}>Job Title</Label>
                {isEditing ? (
                  <Input
                    id="job_title"
                    value={editData.job_title || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, job_title: e.target.value }))}
                    placeholder="Your job title"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Briefcase className="w-4 h-4" />
                    {user?.job_title || 'Not specified'}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={isEditing ? "location" : undefined}>Location</Label>
                {isEditing ? (
                  <Input
                    id="location"
                    value={editData.location || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Your location"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4" />
                    {user?.location || 'Not specified'}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={isEditing ? "bio" : undefined}>Bio</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={editData.bio || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {user?.bio || 'No bio provided'}
                  </p>
                )}
              </div>

              <Separator />

              {/* Education Section (Candidates Only) */}
              {user?.user_type === 'candidate' && (
                <>
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Education</Label>

                    {isEditing ? (
                      <div className="space-y-4">
                        {/* Education Type Selection */}
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="university-edit"
                              checked={editData.education_type?.includes('university')}
                              onCheckedChange={(checked) => handleEducationTypeChange('university', checked)}
                            />
                            <Label htmlFor="university-edit" className="flex items-center gap-2 cursor-pointer">
                              <GraduationCap className="w-4 h-4" />
                              University Degree
                            </Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="bootcamp-edit"
                              checked={editData.education_type?.includes('bootcamp')}
                              onCheckedChange={(checked) => handleEducationTypeChange('bootcamp', checked)}
                            />
                            <Label htmlFor="bootcamp-edit" className="flex items-center gap-2 cursor-pointer">
                              <Code className="w-4 h-4" />
                              Bootcamp Graduate
                            </Label>
                          </div>
                        </div>

                        {/* University Section */}
                        {editData.education_type?.includes('university') && (
                          <div className="p-4 border border-gray-200 rounded-lg space-y-3">
                            <h4 className="font-medium flex items-center gap-2">
                              <GraduationCap className="w-4 h-4" />
                              University Education
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs">University</Label>
                                <Input
                                  value={editData.university_info?.name || ''}
                                  onChange={(e) => setEditData(prev => ({
                                    ...prev,
                                    university_info: { ...prev.university_info, name: e.target.value }
                                  }))}
                                  placeholder="University name"
                                  className="text-sm"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Degree</Label>
                                <Select
                                  value={editData.university_info?.degree || ''}
                                  onValueChange={(value) => setEditData(prev => ({
                                    ...prev,
                                    university_info: { ...prev.university_info, degree: value }
                                  }))}
                                >
                                  <SelectTrigger className="text-sm">
                                    <SelectValue placeholder="Select degree" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {DEGREE_TYPES.map((degree) => (
                                      <SelectItem key={degree} value={degree}>{degree}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="text-xs">Major</Label>
                                <Input
                                  value={editData.university_info?.major || ''}
                                  onChange={(e) => setEditData(prev => ({
                                    ...prev,
                                    university_info: { ...prev.university_info, major: e.target.value }
                                  }))}
                                  placeholder="Major/Specialization"
                                  className="text-sm"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Year</Label>
                                <Input
                                  value={editData.university_info?.graduation_year || ''}
                                  onChange={(e) => setEditData(prev => ({
                                    ...prev,
                                    university_info: { ...prev.university_info, graduation_year: e.target.value }
                                  }))}
                                  placeholder="Graduation year"
                                  className="text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Bootcamp Section */}
                        {editData.education_type?.includes('bootcamp') && (
                          <div className="p-4 border border-gray-200 rounded-lg space-y-3">
                            <h4 className="font-medium flex items-center gap-2">
                              <Code className="w-4 h-4" />
                              Bootcamp Education
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs">Bootcamp</Label>
                                <Select
                                  value={editData.bootcamp_info?.name || ''}
                                  onValueChange={(value) => setEditData(prev => ({
                                    ...prev,
                                    bootcamp_info: { ...prev.bootcamp_info, name: value }
                                  }))}
                                >
                                  <SelectTrigger className="text-sm">
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
                                    <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-50">CIS</div>
                                    {BOOTCAMPS.cis.map((bootcamp) => (
                                      <SelectItem key={bootcamp} value={bootcamp}>{bootcamp}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="text-xs">Track</Label>
                                <Select
                                  value={editData.bootcamp_info?.track || ''}
                                  onValueChange={(value) => setEditData(prev => ({
                                    ...prev,
                                    bootcamp_info: { ...prev.bootcamp_info, track: value }
                                  }))}
                                >
                                  <SelectTrigger className="text-sm">
                                    <SelectValue placeholder="Select track" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {BOOTCAMP_TRACKS.map((track) => (
                                      <SelectItem key={track} value={track}>{track}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="col-span-2">
                                <Label className="text-xs">Completion Year</Label>
                                <Input
                                  value={editData.bootcamp_info?.completion_year || ''}
                                  onChange={(e) => setEditData(prev => ({
                                    ...prev,
                                    bootcamp_info: { ...prev.bootcamp_info, completion_year: e.target.value }
                                  }))}
                                  placeholder="Completion year"
                                  className="text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {user?.education_type?.includes('university') && user?.university_info?.name && (
                          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <GraduationCap className="w-5 h-5 text-gray-600 mt-0.5" />
                            <div>
                              <p className="font-medium">{user.university_info.name}</p>
                              <p className="text-sm text-gray-600">
                                {user.university_info.degree} in {user.university_info.major}
                              </p>
                              <p className="text-xs text-gray-500">Graduated {user.university_info.graduation_year}</p>
                            </div>
                          </div>
                        )}

                        {user?.education_type?.includes('bootcamp') && user?.bootcamp_info?.name && (
                          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <Code className="w-5 h-5 text-gray-600 mt-0.5" />
                            <div>
                              <p className="font-medium">{user.bootcamp_info.name}</p>
                              <p className="text-sm text-gray-600">{user.bootcamp_info.track}</p>
                              <p className="text-xs text-gray-500">Completed {user.bootcamp_info.completion_year}</p>
                            </div>
                          </div>
                        )}

                        {(!user?.education_type || user.education_type.length === 0 || (!user.university_info?.name && !user.bootcamp_info?.name)) && (
                          <p className="text-gray-500 text-sm">No education information provided</p>
                        )}
                      </div>
                    )}
                  </div>

                  <Separator />
                </>
              )}

              {/* Skills */}
              <div className="space-y-3">
                <Label>Skills</Label>
                {isEditing ? (
                  <div className="space-y-3">
                    <Select onValueChange={addSkill}>
                      <SelectTrigger>
                        <SelectValue placeholder="Add a skill" />
                      </SelectTrigger>
                      <SelectContent>
                        {SKILL_OPTIONS.filter(skill => !editData.skills?.includes(skill)).map((skill) => (
                          <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2">
                      {editData.skills?.map((skill) => (
                        <Badge key={skill} variant="secondary" className="bg-purple-100 text-purple-800">
                          {skill}
                          <button onClick={() => removeSkill(skill)} className="ml-1">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {user?.skills?.length > 0 ? (
                      user.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="bg-purple-100 text-purple-800">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-500">No skills added</p>
                    )}
                  </div>
                )}
              </div>

              <Separator />

              {/* Preferences */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Experience Level</Label>
                  {isEditing ? (
                    <Select
                      value={editData.experience_level || ''}
                      onValueChange={(value) => setEditData(prev => ({ ...prev, experience_level: value }))}
                    >
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
                  ) : (
                    <p className="text-gray-700 capitalize">
                      {user?.experience_level?.replace('_', ' ') || 'Not specified'}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Work Preference</Label>
                  {isEditing ? (
                    <Select
                      value={editData.remote_preference || ''}
                      onValueChange={(value) => setEditData(prev => ({ ...prev, remote_preference: value }))}
                    >
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
                  ) : (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-4 h-4" />
                      <span className="capitalize">
                        {user?.remote_preference || 'Not specified'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Salary Range</Label>
                {isEditing ? (
                  <Input
                    value={editData.salary_range || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, salary_range: e.target.value }))}
                    placeholder="e.g. $80k - $120k"
                  />
                ) : (
                  <p className="text-gray-700">
                    {user?.salary_range || 'Not specified'}
                  </p>
                )}
              </div>

              <Separator />

              {/* Logout Button */}
              <div className="pt-4">
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full gap-2 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
