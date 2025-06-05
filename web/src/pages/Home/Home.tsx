import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheckIcon, 
  UsersIcon, 
  MapPinIcon, 
  TrophyIcon,
  ArrowRightIcon 
} from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <ShieldCheckIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <span className="text-xl font-bold gradient-text">ScoopSocials</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-secondary-600 hover:text-primary-600 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn btn-primary btn-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6"
            >
              Your Trusted{' '}
              <span className="gradient-text">Social Identity</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto"
            >
              Aggregate your social media accounts into one verified profile. 
              Build trust, combat catfishing, and connect with confidence.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/register"
                className="btn btn-primary btn-lg inline-flex items-center"
              >
                Start Building Trust
                <ArrowRightIcon className="ml-2 w-5 h-5" />
              </Link>
              <button className="btn btn-outline btn-lg">
                Watch Demo
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              How ScoopSocials Works
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Build credibility through social media verification and community validation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Trust Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="card p-8 text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrophyIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-4">
                Trust Score
              </h3>
              <p className="text-secondary-600 mb-6">
                Our 11-factor algorithm evaluates your social presence, activity, and community validation to create a comprehensive trust score.
              </p>
              <div className="bg-primary-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-primary-600 mb-1">85/100</div>
                <div className="text-sm text-primary-700">Excellent Trust Level</div>
              </div>
            </motion.div>

            {/* Social Verification */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="card p-8 text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheckIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-4">
                Social Verification
              </h3>
              <p className="text-secondary-600 mb-6">
                Connect your Twitter, Instagram, LinkedIn, and other social accounts to build a comprehensive verified profile.
              </p>
              <div className="flex justify-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">T</span>
                </div>
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">I</span>
                </div>
                <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">L</span>
                </div>
                <div className="w-8 h-8 bg-secondary-300 rounded-full flex items-center justify-center">
                  <span className="text-secondary-600 text-xs">+3</span>
                </div>
              </div>
            </motion.div>

            {/* Community Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card p-8 text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPinIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-4">
                Trusted Events
              </h3>
              <p className="text-secondary-600 mb-6">
                Discover and create events with confidence. Our trust requirements ensure genuine connections and safer meetups.
              </p>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-green-700 font-medium">
                  Trust Score Required: 60+
                </div>
                <div className="text-xs text-green-600 mt-1">
                  Verified Community Event
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Build Your Trusted Profile?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are building credibility and making genuine connections.
            </p>
            <Link
              to="/register"
              className="btn bg-white text-primary-600 hover:bg-gray-50 btn-lg inline-flex items-center"
            >
              Get Started Free
              <ArrowRightIcon className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <ShieldCheckIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">ScoopSocials</span>
            </div>
            <div className="text-secondary-400">
              © 2024 ScoopSocials. Building trust in digital connections.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;