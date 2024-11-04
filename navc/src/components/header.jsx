import React, { useState, useEffect } from 'react';
import { Menu, X, User, BrainCircuit } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

 

  const menuItems = [
    { label: user ? 'Profile' : 'Home', path: '/' },
    { label: 'Practice', path: '/practice' },
    { label: 'AI Sessions', path: '/aisessions' },
    { label: 'Profile', path: '/profile' },
    { label: user ? 'Dashboard' : 'Sign In', path: user ? '/dashboard' : '/signin' },
  ];

  return (
    <div className="relative">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <BrainCircuit className="h-8 w-8 text-white" />
              <span className="text-xl font-bold text-white">
                Prepify
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {menuItems.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  className="text-gray-100 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white p-2 rounded-md hover:bg-white/10 transition-colors duration-200"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`
          md:hidden 
          absolute 
          top-16 
          inset-x-0 
          bg-indigo-600/95 
          backdrop-blur-lg 
          transform 
          transition-all 
          duration-300 
          ease-in-out
          ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}
        `}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 shadow-lg">
          {menuItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10 transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      {/* User indicator */}
      {user && (
        <div className="absolute top-2 right-20 md:right-4">
          <div className="flex items-center space-x-2 text-white">
            <User className="h-5 w-5" />
            <span className="text-sm font-medium truncate max-w-[100px]">
              {user.email?.split('@')[0]}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;