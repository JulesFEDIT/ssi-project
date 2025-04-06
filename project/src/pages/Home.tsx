import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, FileKey, UserCheck } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  console.log("USER =>", user);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Secure Your Digital World
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Advanced cybersecurity solutions to protect your sensitive data and ensure your peace of mind.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <Lock className="h-12 w-12 text-cyan-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">End-to-End Encryption</h3>
          <p className="text-slate-400">Your data is protected with strong encryption at every step.</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <FileKey className="h-12 w-12 text-cyan-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Secure File Transfer</h3>
          <p className="text-slate-400">Upload and share files with confidence using our secure infrastructure.</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <UserCheck className="h-12 w-12 text-cyan-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Advanced Authentication</h3>
          <p className="text-slate-400">Multi-factor authentication (MFA) and secure login protocols.</p>
        </div>
      </div>

      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070"
          alt="Cybersecurity"
          className="rounded-xl object-cover h-96 w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-transparent rounded-xl flex items-center">
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-4">Enterprise-Grade Security</h2>
            <p className="text-slate-300 max-w-xl">
              Trust in our proven security infrastructure, trusted by leading organizations worldwide.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;