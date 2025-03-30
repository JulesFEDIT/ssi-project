import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Upload, LogIn, Key } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-slate-800 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-cyan-500" />
            <span className="text-xl font-bold">CyberGuard</span>
          </Link>
          <div className="flex space-x-4">
            <Link to="/upload" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-slate-700 transition">
              <Upload className="h-5 w-5" />
              <span>Upload</span>
            </Link>
            <Link to="/login" className="flex items-center space-x-1 px-3 py-2 rounded-md bg-cyan-600 hover:bg-cyan-700 transition">
              <LogIn className="h-5 w-5" />
              <span>Login</span>
            </Link>
            {/* Hidden verify button - only visible on hover */}
            <Link 
              to="/verify" 
              className="flex items-center space-x-1 px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700 transition opacity-0 hover:opacity-100"
            >
              <Key className="h-5 w-5" />
              <span>Verify</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;