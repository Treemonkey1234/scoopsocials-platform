import React, { useState } from 'react';

// TypeScript interfaces for component props
interface ScreenProps {
  onNext: () => void;
}

interface NavigationProps {
  onNavigate: (screen: string) => void;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState('login');

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Mobile Container */}
      <div className="max-w-sm mx-auto bg-white min-h-screen shadow-xl relative">
        {/* Status Bar */}
        <div className="bg-cyan-400 text-white text-xs font-medium px-4 py-1 flex justify-between items-center">
          <span>6:12 ↗</span>
          <div className="flex items-center space-x-1">
            <span>📶</span>
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>

        {/* Screen Content */}
        {currentScreen === 'login' && <LoginScreen onNext={() => setCurrentScreen('loginForm')} />}
        {currentScreen === 'loginForm' && <LoginFormScreen onNext={() => setCurrentScreen('profile')} />}
        {currentScreen === 'profile' && <ProfileScreen onNavigate={setCurrentScreen} />}
        {currentScreen === 'groups' && <GroupsScreen onNavigate={setCurrentScreen} />}

        {/* Bottom Navigation */}
        {(currentScreen === 'profile' || currentScreen === 'groups') && (
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-sm w-full bg-white border-t border-gray-200 z-50">
            <div className="flex">
              <button 
                onClick={() => setCurrentScreen('profile')}
                className="flex-1 py-3 text-center"
              >
                <div className="text-lg mb-1">🏠</div>
                <div className={`text-xs ${currentScreen === 'profile' ? 'text-cyan-400' : 'text-gray-600'}`}>HOME</div>
              </button>
              <button 
                onClick={() => setCurrentScreen('groups')}
                className="flex-1 py-3 text-center"
              >
                <div className="text-lg mb-1">▶️</div>
                <div className={`text-xs ${currentScreen === 'groups' ? 'text-cyan-400' : 'text-gray-600'}`}>GROUPS</div>
              </button>
              <button 
                onClick={() => alert('Search feature coming soon!')}
                className="flex-1 py-3 text-center"
              >
                <div className="w-8 h-8 bg-cyan-400 rounded-full mx-auto mb-1 flex items-center justify-center">
                  <span className="text-white text-lg">🔍</span>
                </div>
                <div className="text-xs text-cyan-400">SEARCH</div>
              </button>
              <button 
                onClick={() => alert('Inbox feature coming soon!')}
                className="flex-1 py-3 text-center"
              >
                <div className="text-lg mb-1">🔔</div>
                <div className="text-xs text-gray-600">INBOX</div>
              </button>
              <button 
                onClick={() => setCurrentScreen('profile')}
                className="flex-1 py-3 text-center"
              >
                <div className="text-lg mb-1">👤</div>
                <div className={`text-xs ${currentScreen === 'profile' ? 'text-cyan-400' : 'text-gray-600'}`}>PROFILE</div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Login Screen Component
const LoginScreen: React.FC<ScreenProps> = ({ onNext }) => {
  return (
    <div className="bg-gradient-to-b from-cyan-400 to-cyan-600 h-screen flex flex-col items-center justify-center text-white relative">
      {/* Scoop Logo */}
      <div className="mb-8">
        <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="16" cy="16" r="6" fill="#00BCD4"/>
            <circle cx="32" cy="16" r="6" fill="#00BCD4"/>
            <circle cx="24" cy="32" r="6" fill="#00BCD4"/>
            <path d="M24 26 L16 22 L32 22 Z" fill="#00BCD4"/>
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-center mb-2">scoop</h1>
      </div>
      
      {/* Login Buttons */}
      <div className="w-full max-w-sm px-8 space-y-4">
        <button 
          onClick={onNext}
          className="w-full bg-white text-cyan-600 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Sign in
        </button>
        <button 
          onClick={onNext}
          className="w-full border-2 border-white text-white py-3 rounded-lg font-semibold hover:bg-white hover:text-cyan-600 transition-colors"
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

// Login Form Screen Component
const LoginFormScreen: React.FC<ScreenProps> = ({ onNext }) => {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-b from-cyan-400 to-cyan-600 h-32 flex items-center justify-center">
        <h1 className="text-3xl font-bold text-white">scoop</h1>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">USERNAME</label>
            <input 
              type="email" 
              defaultValue="nickhemingway@gmail.com" 
              className="w-full border-b border-gray-300 py-2 focus:border-cyan-400 outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-2">PASSWORD</label>
            <div className="relative">
              <input 
                type="password" 
                defaultValue="••••••••" 
                className="w-full border-b border-gray-300 py-2 focus:border-cyan-400 outline-none pr-12"
              />
              <button type="button" className="absolute right-0 top-2 text-gray-500 text-sm">SHOW</button>
            </div>
            <a href="#" className="text-sm text-gray-500 mt-1 block">Forgot Password?</a>
          </div>
          
          <button 
            onClick={onNext}
            className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold mt-6 hover:bg-gray-700 transition-colors"
          >
            Login
          </button>
          
          <div className="text-center">
            <a href="#" className="text-gray-500">Create Account</a>
          </div>
          
          <div className="text-center text-gray-500 text-sm">or</div>
          
          {/* Social Login */}
          <div className="flex justify-center space-x-4">
            <div className="w-12 h-12 bg-blue-400 rounded flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer">
              <span className="font-bold">t</span>
            </div>
            <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer">
              <span className="font-bold">f</span>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer">
              <span className="font-bold">G+</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Screen Component
const ProfileScreen: React.FC<NavigationProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-cyan-400 to-blue-400 p-6 text-center text-white">
        <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
          <div className="w-16 h-16 bg-cyan-400 rounded-full flex items-center justify-center text-white text-xl font-bold">
            👤
          </div>
        </div>
        
        <div className="flex items-center justify-center mb-2">
          <h2 className="text-xl font-bold mr-2">Nick Hemingway</h2>
          <span className="text-cyan-200 text-xl">✓</span>
        </div>
        
        <p className="opacity-90 text-sm">@nickhemingway9</p>
        
        <button className="bg-white text-cyan-600 px-4 py-1 rounded-full text-sm font-semibold mt-3 hover:bg-gray-50 transition-colors">
          Edit Profile
        </button>
      </div>

      {/* Bio Section */}
      <div className="p-4">
        <p className="text-gray-700 text-sm mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </p>
        
        {/* Trust Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">VERIFIED</span>
          <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">OUTGOING</span>
          <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs">EXTROVERTED</span>
          <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs">CARING</span>
          <span className="bg-pink-500 text-white px-2 py-1 rounded text-xs">DISCIPLINED</span>
        </div>
        
        {/* Social Links */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            {[
              { bg: 'bg-blue-500', text: 'in', label: 'LINKEDIN' },
              { bg: 'bg-blue-400', text: 't', label: 'TWITTER' },
              { bg: 'bg-blue-600', text: 'f', label: 'FACEBOOK' },
              { bg: 'bg-black', text: 'tt', label: 'TIK TOK' },
              { bg: 'bg-pink-500', text: 'ig', label: 'INSTAGRAM' },
              { bg: 'bg-red-500', text: 'yt', label: 'YOUTUBE' }
            ].map((social, index) => (
              <div key={index} className="text-center hover:scale-110 transition-transform cursor-pointer">
                <div className={`w-8 h-8 ${social.bg} rounded mx-auto mb-1 flex items-center justify-center text-white text-xs font-bold`}>
                  {social.text}
                </div>
                <span className="text-xs text-gray-500">{social.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-4">
          <div className="flex">
            <button className="flex-1 py-3 text-center text-cyan-400 border-b-2 border-cyan-400 font-semibold">PEOPLE</button>
            <button className="flex-1 py-3 text-center text-gray-500">GROUPS</button>
            <button className="flex-1 py-3 text-center text-gray-500">LIKES</button>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="border-b border-gray-100 pb-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold">CS</div>
            <div className="flex-1">
              <div className="flex items-center mb-1">
                <span className="font-semibold text-sm">Cody Snow</span>
                <span className="text-cyan-400 ml-1">✓</span>
                <span className="text-gray-500 text-xs ml-2">• 2h</span>
                <span className="ml-auto">😊</span>
              </div>
              <p className="text-sm text-gray-700 mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt Lorem ipsum dolor sit amet, consectetur adipiscing</p>
              <div className="flex items-center text-gray-500 text-sm space-x-4">
                <span className="hover:text-cyan-400 cursor-pointer">💬</span>
                <span className="hover:text-cyan-400 cursor-pointer">👍</span>
                <span className="hover:text-cyan-400 cursor-pointer">↗️</span>
                <span className="hover:text-cyan-400 cursor-pointer">⭐</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Groups Screen Component
const GroupsScreen: React.FC<NavigationProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Search Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative mb-4">
          <input 
            type="text" 
            placeholder="Search groups" 
            className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          <button className="absolute right-3 top-2 text-cyan-400 text-lg">+</button>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex space-x-4">
          <button className="bg-gray-200 px-4 py-2 rounded-full text-sm hover:bg-gray-300 transition-colors">UPCOMING</button>
          <button className="bg-gray-200 px-4 py-2 rounded-full text-sm hover:bg-gray-300 transition-colors">PAST GROUPS</button>
          <button className="bg-gray-200 px-4 py-2 rounded-full text-sm hover:bg-gray-300 transition-colors">DISCOVER</button>
        </div>
      </div>

      {/* Events List */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-4">THIS WEEK</h3>
        
        {/* Event Cards */}
        {[
          { day: '18', month: 'JAN', title: 'SUPERBOWL PARTY', host: 'Joe Smith-Peterson', location: 'Hotel Indya, Glendale Arizona' },
          { day: '19', month: 'JAN', title: 'TEAM ROWING BANQUET', host: 'Arizona State', location: '' }
        ].map((event, index) => (
          <div key={index} className="bg-gradient-to-r from-cyan-400 to-cyan-600 text-white rounded-xl p-4 mb-3 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-start">
              <div className="text-center mr-4">
                <div className="text-2xl font-bold">{event.day}</div>
                <div className="text-sm opacity-90">{event.month}</div>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg">{event.title}</h4>
                <div className="flex items-center mt-1 text-sm opacity-90">
                  <span className="mr-2">🔒</span>
                  <span>Hosted by {event.host}</span>
                </div>
                {event.location && <p className="text-sm opacity-90 mt-1">{event.location}</p>}
              </div>
            </div>
          </div>
        ))}

        <h3 className="font-bold text-gray-900 mb-4 mt-6">NEXT WEEK</h3>
        
        <div className="bg-gradient-to-r from-cyan-400 to-cyan-600 text-white rounded-xl p-4 mb-3 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-start">
            <div className="text-center mr-4">
              <div className="text-2xl font-bold">25</div>
              <div className="text-sm opacity-90">JAN</div>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg">DISK GOLF TOURNAMENT</h4>
              <div className="flex items-center mt-1 text-sm opacity-90">
                <span className="mr-2">🔒</span>
                <span>Hosted by Sun Devil</span>
              </div>
              <p className="text-sm opacity-90 mt-1">Steele Indian School Park</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;