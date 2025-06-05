import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">ScoopSocials</h1>
            </div>
            <nav className="flex space-x-8">
              <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
              <a href="/feed" className="text-gray-600 hover:text-gray-900">Feed</a>
              <a href="/events" className="text-gray-600 hover:text-gray-900">Events</a>
              <a href="/profile" className="text-gray-600 hover:text-gray-900">Profile</a>
            </nav>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;