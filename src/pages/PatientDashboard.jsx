import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarPlus, Pill, Clock, ChevronRight, Activity, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getBookedAppointments, removeBookedAppointment } from '../services/mockDatabase';

const PatientDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    setBookings(getBookedAppointments());
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCancelAppointment = (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      removeBookedAppointment(id);
      setBookings(getBookedAppointments());
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 md:p-12 relative">
      <header className="max-w-4xl mx-auto mb-10 flex items-center justify-between">
         <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
               <span className="text-white font-bold text-xl leading-none">+</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">CareConnect Patient</h1>
         </div>
         <button onClick={handleLogout} className="text-slate-500 hover:text-slate-800 text-sm font-medium transition">
           Sign Out
         </button>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
          <p className="text-slate-500 mt-1">Manage your appointments and medical history.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Book Session Action */}
          <Link to="/portal/intake" className="bg-white border-2 border-transparent hover:border-blue-500 hover:shadow-xl transition rounded-2xl p-8 flex flex-col items-start shadow-sm group">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <CalendarPlus size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Book Session</h3>
            <p className="text-slate-500 mb-6">Use our AI triage system to find the best doctor for your symptoms and book an immediate slot.</p>
            <div className="mt-auto flex items-center text-blue-600 font-bold">
               Start Assessment <ChevronRight size={20} className="ml-1" />
            </div>
          </Link>

          {/* Medications Action */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-start shadow-sm">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
              <Pill size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Medications</h3>
            <p className="text-slate-500 mb-6">View your active prescriptions and request refills from your primary care physician.</p>
            
            <div className="mt-auto w-full space-y-3">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800">Lisinopril 10mg</p>
                  <p className="text-xs text-slate-500">1 tablet daily</p>
                </div>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-md">Active</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex justify-between items-center opacity-60">
                <div>
                  <p className="font-bold text-slate-800">Amoxicillin 500mg</p>
                  <p className="text-xs text-slate-500">Finished on Mar 12</p>
                </div>
                <span className="px-2 py-1 bg-slate-200 text-slate-600 text-xs font-bold rounded-md">Past</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-4">Recent Activity</h3>
          {bookings.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
               <Clock size={32} className="mx-auto text-slate-300 mb-3" />
               <p className="text-slate-500">No recent appointments.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {bookings.map((appt) => (
                 <div key={appt.id} className="bg-white border border-slate-200 rounded-xl p-5 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                   <div className="flex items-center">
                     <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4">
                       <Activity size={20} />
                     </div>
                     <div>
                       <h4 className="font-bold text-slate-800">Session with {appt.doctor.name}</h4>
                       <p className="text-sm text-slate-500">{appt.doctor.specialization}</p>
                     </div>
                   </div>
                   <div className="flex items-center space-x-6">
                     <div className="text-right">
                       <p className="font-bold text-blue-600">{appt.slotTime}</p>
                       <p className="text-xs text-slate-500">Upcoming</p>
                     </div>
                     <button 
                       onClick={() => handleCancelAppointment(appt.id)}
                       className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors group"
                       title="Cancel Appointment"
                     >
                       <X size={20} />
                     </button>
                   </div>
                 </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
