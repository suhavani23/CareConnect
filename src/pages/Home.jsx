import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Heart, Brain, Baby, Bone, User } from 'lucide-react';
import { hospitalStaff } from '../services/mockDatabase';

const Home = () => {
  const specialties = [
    { name: "General Physician", icon: Activity, desc: "Primary care & routine checkups" },
    { name: "Cardiologist", icon: Heart, desc: "Expert heart care" },
    { name: "Neurologist", icon: Brain, desc: "Advanced brain treatments" },
    { name: "Emergency Medicine", icon: Activity, desc: "24/7 Urgent Care" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 md:px-12 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-2xl leading-none">+</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">CareConnect</h1>
        </div>
        <div className="flex space-x-4 items-center">
          <Link to="/doctor" className="px-5 py-2 text-slate-500 font-semibold hover:bg-slate-100 rounded-lg transition text-sm">
            Doctor Portal
          </Link>
          <Link to="/login" className="px-5 py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition">
            Login
          </Link>
          <Link to="/register" className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition">
            Register
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <Activity size={64} className="text-blue-500 mb-6" />
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 max-w-2xl">
          Your Health, Managed Intelligently.
        </h2>
        <p className="text-lg text-slate-600 mb-10 max-w-xl">
          CareConnect uses AI to understand your symptoms and instantly route you to the best available specialist in our hospital.
        </p>

<<<<<<< HEAD
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center mb-16">
          <Link to="/login" className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-1 text-center">
            Patient Login
          </Link>
          <Link to="/register" className="flex-1 py-4 bg-white text-blue-600 border border-slate-200 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition transform hover:-translate-y-1 text-center">
            Create Account
          </Link>
=======
        {/* Facilities Section */}
        <div className="w-full max-w-4xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
                <Activity size={24} />
              </div>
              <h4 className="font-bold text-slate-800 mb-2">24/7 Emergency Care</h4>
              <p className="text-sm text-slate-500 text-center">Round-the-clock immediate medical attention for critical situations.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-4">
                <Brain size={24} />
              </div>
              <h4 className="font-bold text-slate-800 mb-2">Advanced Labs & Diagnostics</h4>
              <p className="text-sm text-slate-500 text-center">State-of-the-art diagnostic imaging and rapid pathology services.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-4">
                <Heart size={24} />
              </div>
              <h4 className="font-bold text-slate-800 mb-2">Modern ICUs</h4>
              <p className="text-sm text-slate-500 text-center">Fully equipped intensive care units with specialized monitoring.</p>
            </div>
          </div>
>>>>>>> 03fe6592c0a4c645a0d9d48c63f935a3d59bdd59
        </div>

        {/* Specialties Grid */}
        <div className="w-full max-w-5xl mx-auto">
          <h3 className="text-xl font-bold text-slate-800 mb-6 text-left pl-2">Our Departments & Top Specialists</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialties.map((spec) => {
              const specDoctors = hospitalStaff.filter(doc => doc.specialization === spec.name);
              return (
                <div key={spec.name} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center hover:shadow-md transition text-center">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                    <spec.icon size={24} />
                  </div>
                  <h4 className="font-bold text-slate-800 mb-1">{spec.name}</h4>
                  <p className="text-sm text-slate-500 mb-4">{spec.desc}</p>
                  
                  {specDoctors.length > 0 && (
                    <div className="w-full mt-auto pt-4 border-t border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Available Specialists</p>
                      <div className="space-y-2">
                        {specDoctors.map(doc => (
                          <div key={doc.id} className="text-left bg-slate-50 p-2 rounded-lg text-sm border border-slate-100">
                            <p className="font-semibold text-slate-700 flex items-center">
                               <User size={14} className="mr-1 text-blue-500" /> {doc.name}
                            </p>
                            <p className="text-xs text-slate-500 ml-5">{doc.experience} yrs experience</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
