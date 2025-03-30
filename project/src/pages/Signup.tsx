import React, { useState } from 'react';
import { Shield, Mail, Lock, Eye, EyeOff, User, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  // VULNERABLE: Weak password validation
  const validatePassword = (password: string) => {
    // VULNERABLE: Only checks length, no complexity requirements
    return password.length >= 6;
  };

  // VULNERABLE: Weak email validation
  const validateEmail = (email: string) => {
    // VULNERABLE: Simple regex that can be bypassed
    return email.includes('@');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // VULNERABLE: Client-side validation only
    if (!validateEmail(email)) {
      setError('Invalid email address');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters');
      return;
    }

    // VULNERABLE: No rate limiting
    // VULNERABLE: No CSRF protection
    // VULNERABLE: No email verification
    console.log('Account created:', { email, username });
    // Handle signup logic here
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <Shield className="h-12 w-12 text-cyan-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold">Create Account</h1>
        <p className="text-slate-400 mt-2">Join our secure platform</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-3 focus:outline-none focus:border-cyan-500"
                placeholder="Choose a username"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-3 focus:outline-none focus:border-cyan-500"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-10 focus:outline-none focus:border-cyan-500"
                placeholder="Create a password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-slate-400" />
                ) : (
                  <Eye className="h-5 w-5 text-slate-400" />
                )}
              </button>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Must be at least 6 characters
            </p>
          </div>

          {error && (
            <div className="bg-red-900/50 text-red-200 rounded-lg p-4 flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 py-2 px-4 rounded-lg font-medium transition"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-slate-400">Already have an account? </span>
          <Link to="/login" className="text-cyan-500 hover:text-cyan-400 font-medium">
            Sign in
          </Link>
        </div>
      </div>

      <div className="mt-8 bg-slate-800/50 rounded-lg p-6">
        <h3 className="flex items-center text-lg font-medium mb-4">
          <Shield className="h-5 w-5 text-cyan-500 mr-2" />
          Account Security
        </h3>
        <ul className="space-y-2 text-slate-400 text-sm">
          <li>• Secure password storage with encryption</li>
          <li>• Two-factor authentication available</li>
          <li>• Regular security audits</li>
          <li>• Instant security notifications</li>
        </ul>
      </div>
    </div>
  );
};

export default Signup;