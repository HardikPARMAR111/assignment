// src/components/Header.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="relative">
              <div className="absolute inset-0"></div>
              <span className="relative text-2xl">📊</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-bold text-lg text-blue-500 bg-clip-text ">
                Polling
              </span>
              <span className="text-xs text-gray-500 -mt-1">App</span>
            </div>
          </div>

          {/* Navigation */}
          {location.pathname !== '/create' && (
            <button
              onClick={() => navigate('/create')}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-white border border-blue-600 text-blue-600"
            >
              <FiPlus size={18} className="stroke-2" />
              <span className="hidden sm:inline">Create Poll</span>
              <span className="sm:hidden text-sm">Create</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};