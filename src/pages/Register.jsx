import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft } from 'lucide-react';

const Register = () => {
  const [isSecuring, setIsSecuring] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setIsSecuring(true);
    
    // Simulate auth & 1-second "Securing Portal..." UX
    setTimeout(() => {
      login();
      navigate('/dashboard');
    }, 1000);
  };

  if (isSecuring) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-10 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center max-w-sm w-full space-y-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full animate-ping opacity-75"></div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Creating Account...</h2>
            <p className="text-sm text-slate-500 mb-4">Securing your portal access.</p>
            <div className="h-2 w-32 bg-slate-200 rounded-full mx-auto overflow-hidden">
               <div className="h-full bg-blue-600 animate-pulse w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center justify-center p-6 relative">
      <Link to="/" className="absolute top-8 left-8 text-slate-500 hover:text-slate-800 flex items-center transition">
        <ChevronLeft size={20} className="mr-1" /> Back to Home
      </Link>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <div className="flex items-center justify-center mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
            <span className="text-white font-bold text-2xl leading-none">+</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">CareConnect</h1>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">Create Patient Account</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input 
              type="text" 
              required
              placeholder="John Doe"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
              <input 
                type="number" 
                required
                placeholder="Years"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
              <select className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-600">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="you@example.com"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Basic Medical Data / History</label>
            <textarea 
              rows="2"
              placeholder="Any prior conditions, allergies, or chronic illnesses..."
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            ></textarea>
          </div>
          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Create Account
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
