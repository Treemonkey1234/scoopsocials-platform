import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Welcome back, {user?.firstName}!
            </h1>
            
            {/* Trust Score Card */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white mb-6">
              <h2 className="text-xl font-semibold mb-2">Your Trust Score</h2>
              <div className="text-3xl font-bold">
                {Math.round(user?.trustScore?.current || 0)}/100
              </div>
              <p className="mt-2 opacity-90">
                {user?.trustScore?.current >= 80 ? 'Excellent' :
                 user?.trustScore?.current >= 60 ? 'Good' :
                 user?.trustScore?.current >= 40 ? 'Fair' : 'Building Trust'}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900">Connected Accounts</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {user?.socialAccounts?.length || 0}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900">Trust Level</h3>
                <p className="text-2xl font-bold text-green-600">
                  {user?.trustScore?.current >= 80 ? 'High' :
                   user?.trustScore?.current >= 60 ? 'Good' :
                   user?.trustScore?.current >= 40 ? 'Fair' : 'Building'}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900">Account Status</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {user?.isVerified ? 'Verified' : 'Unverified'}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
                  <div className="text-blue-600 mb-2">🔗</div>
                  <div className="text-sm font-medium">Add Account</div>
                </button>
                
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
                  <div className="text-green-600 mb-2">📅</div>
                  <div className="text-sm font-medium">Create Event</div>
                </button>
                
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
                  <div className="text-purple-600 mb-2">👥</div>
                  <div className="text-sm font-medium">Find Friends</div>
                </button>
                
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
                  <div className="text-orange-600 mb-2">🗺️</div>
                  <div className="text-sm font-medium">Explore Map</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;