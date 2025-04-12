import React, { useState } from 'react';

const UserProfileWireframe = () => {
  const [profileData, setProfileData] = useState({
    name: 'J. Smith',
    username: 'jsmith_writer',
    email: 'jsmith@example.com',
    bio: 'Fantasy and sci-fi author working on my debut novel. I love creating complex characters and intricate worlds.',
    website: 'jsmithwriter.com',
    twitterHandle: '@jsmith_writes',
    profileImage: null,
    genres: ['Fantasy', 'Science Fiction'],
    writingFrequency: 'several-times-week',
    writingGoal: 'complete-novel',
    writingStyle: 'descriptive',
    assistanceLevel: 'Moderate'
  });
  
  const [activeTab, setActiveTab] = useState('profile');
  
  // Mock stats data
  const stats = {
    totalProjects: 3,
    totalWords: 45780,
    averageWordsPerDay: 650,
    longestStreak: 14,
    currentStreak: 3,
    wordsThisWeek: 4250,
    wordsLastWeek: 3800,
    sessionsThisWeek: 5,
    averageSessionLength: 45 // minutes
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Profile saved!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-primary-700">User Profile</h1>
        
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex flex-col md:flex-row items-center">
          <div className="relative mb-4 md:mb-0 md:mr-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 overflow-hidden">
              {profileData.profileImage ? (
                <img 
                  src={profileData.profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <span className="text-4xl">👤</span>
              )}
            </div>
            <button 
              className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
              aria-label="Upload profile picture"
            >
              +
            </button>
          </div>
          <div className="text-center md:text-left flex-grow">
            <h2 className="text-2xl font-bold text-gray-800">{profileData.name}</h2>
            <p className="text-gray-600">@{profileData.username}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
              {profileData.genres.map(genre => (
                <span key={genre} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                  {genre}
                </span>
              ))}
            </div>
          </div>
          <div>
            <button className="btn-primary">Edit Profile</button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b overflow-x-auto">
            <button 
              className={`px-6 py-3 font-medium ${activeTab === 'profile' ? 'border-b-2 border-primary-600 text-primary-700' : 'text-gray-600'}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button 
              className={`px-6 py-3 font-medium ${activeTab === 'stats' ? 'border-b-2 border-primary-600 text-primary-700' : 'text-gray-600'}`}
              onClick={() => setActiveTab('stats')}
            >
              Writing Stats
            </button>
            <button 
              className={`px-6 py-3 font-medium ${activeTab === 'preferences' ? 'border-b-2 border-primary-600 text-primary-700' : 'text-gray-600'}`}
              onClick={() => setActiveTab('preferences')}
            >
              Preferences
            </button>
            <button 
              className={`px-6 py-3 font-medium ${activeTab === 'account' ? 'border-b-2 border-primary-600 text-primary-700' : 'text-gray-600'}`}
              onClick={() => setActiveTab('account')}
            >
              Account
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Profile Information Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={profileData.username}
                      onChange={handleInputChange}
                      className="input-field w-full"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows="4"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    placeholder="Tell us about yourself and your writing"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                      Website (Optional)
                    </label>
                    <input
                      type="text"
                      id="website"
                      name="website"
                      value={profileData.website}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      placeholder="www.example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="twitterHandle" className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter Handle (Optional)
                  </label>
                  <input
                    type="text"
                    id="twitterHandle"
                    name="twitterHandle"
                    value={profileData.twitterHandle}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    placeholder="@username"
                  />
                </div>
                
                <div className="pt-4 flex justify-end">
                  <button type="submit" className="btn-primary">
                    Save Profile
                  </button>
                </div>
              </div>
            </form>
          )}
          
          {/* Writing Stats Tab */}
          {activeTab === 'stats' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Writing Statistics</h2>
              
              {/* Writing Activity Chart - Placeholder */}
              <div className="bg-gray-100 rounded-lg p-4 mb-6 h-48 flex items-center justify-center text-gray-500">
                Writing Activity Chart (Last 30 Days)
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary-600">{stats.totalProjects}</div>
                  <div className="text-sm text-gray-600">Active Projects</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary-600">{stats.totalWords.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Words</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary-600">{stats.averageWordsPerDay}</div>
                  <div className="text-sm text-gray-600">Avg. Words/Day</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary-600">{stats.currentStreak}</div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </div>
              </div>
              
              {/* Additional Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-3">Weekly Progress</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Words this week:</span>
                      <span className="font-medium">{stats.wordsThisWeek.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Words last week:</span>
                      <span className="font-medium">{stats.wordsLastWeek.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Writing sessions this week:</span>
                      <span className="font-medium">{stats.sessionsThisWeek}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Average session length:</span>
                      <span className="font-medium">{stats.averageSessionLength} minutes</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-3">Writing Achievements</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3">🏆</div>
                      <div>
                        <div className="font-medium">Consistent Writer</div>
                        <div className="text-xs text-gray-500">Wrote at least 500 words for 7 consecutive days</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3">🏆</div>
                      <div>
                        <div className="font-medium">Word Master</div>
                        <div className="text-xs text-gray-500">Reached 10,000 words in a single project</div>
                      </div>
                    </div>
                    <div className="flex items-center opacity-50">
                      <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mr-3">🔒</div>
                      <div>
                        <div className="font-medium">Chapter Completer</div>
                        <div className="text-xs text-gray-500">Finish 10 chapters in a novel</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">User Preferences</h2>
              
              {/* Application Preferences */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Application Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Dark Mode</div>
                      <div className="text-sm text-gray-600">Switch between light and dark themes</div>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                      <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow"></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Autosave</div>
                      <div className="text-sm text-gray-600">Save changes automatically</div>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-primary-500">
                      <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white shadow"></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Show Word Count</div>
                      <div className="text-sm text-gray-600">Display word count while writing</div>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-primary-500">
                      <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white shadow"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Notification Settings */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Daily Reminders</div>
                      <div className="text-sm text-gray-600">Receive daily writing reminders</div>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-primary-500">
                      <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white shadow"></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Weekly Progress Reports</div>
                      <div className="text-sm text-gray-600">Weekly summary of your writing activity</div>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-primary-500">
                      <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white shadow"></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Email Notifications</div>
                      <div className="text-sm text-gray-600">Receive important updates via email</div>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                      <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <button className="btn-primary">
                  Save Preferences
                </button>
              </div>
            </div>
          )}
          
          {/* Account Tab */}
          {activeTab === 'account' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
              
              {/* Email & Password */}
              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="flex">
                    <input 
                      type="email" 
                      value={profileData.email} 
                      disabled 
                      className="input-field flex-grow bg-gray-50" 
                    />
                    <button className="btn-secondary ml-2">
                      Change
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="flex">
                    <input 
                      type="password" 
                      value="••••••••" 
                      disabled 
                      className="input-field flex-grow bg-gray-50" 
                    />
                    <button className="btn-secondary ml-2">
                      Change
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Subscription & Billing */}
              <div className="bg-gray-50 p-4 rounded-lg mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Current Plan</h3>
                  <span className="bg-primary-100 text-primary-700 text-xs font-medium px-2 py-1 rounded-full">
                    Premium
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  Your subscription renews on <strong>May 15, 2025</strong>
                </div>
                <div className="flex space-x-4">
                  <button className="btn-secondary text-sm">
                    Manage Subscription
                  </button>
                  <button className="btn-outline text-sm">
                    View Billing History
                  </button>
                </div>
              </div>
              
              {/* Danger Zone */}
              <div className="border border-red-200 rounded-lg p-4">
                <h3 className="font-medium text-red-600 mb-2">Danger Zone</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Actions here are permanent and cannot be undone.
                </p>
                <div className="space-y-3">
                  <div>
                    <button className="text-red-600 text-sm hover:text-red-800">
                      Export All Data
                    </button>
                  </div>
                  <div>
                    <button className="text-red-600 text-sm hover:text-red-800">
                      Deactivate Account
                    </button>
                  </div>
                  <div>
                    <button className="text-red-600 text-sm hover:text-red-800">
                      Delete Account Permanently
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileWireframe;
