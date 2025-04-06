import React, { useState } from 'react';
import { Shield, Mail, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    try {
      const response = await fetch("http://localhost/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString()
      });

      const result = await response.json();

      if (result.status === "success") {
        localStorage.setItem("user", JSON.stringify(result.user));
        navigate("/");
      } else {
        setError("Nom d'utilisateur ou mot de passe incorrect.");
      }
    } catch (error) {
      console.error("Erreur de connexion au serveur :", error);
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <Shield className="h-12 w-12 text-cyan-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="text-slate-400 mt-2">Sign in to access your secure dashboard</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Enter your password"
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
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-slate-400">Don't have an account? </span>
          <Link to="/signup" className="text-cyan-500 hover:text-cyan-400 font-medium">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
