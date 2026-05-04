import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CalendarPlus, Pill, Clock, ChevronRight, Activity, X, 
  FileText, ClipboardList, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  getBookedAppointments, 
  removeBookedAppointment, 
  getPrescriptions 
} from '../services/mockDatabase';

const PatientDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [prescriptions, setPrescriptions] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await getBookedAppointments();
    setBookings(data);
    setPrescriptions(getPrescriptions());
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
    // Live sync listener
    const handleStorage = (e) => {
      if (e.key === 'careconnect_bookings' || e.key === 'careconnect_prescriptions') {
        fetchData();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCancelAppointment = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await removeBookedAppointment(id);
        fetchData();
      } catch (err) {
        alert('Failed to cancel appointment. Please try again.');
      }
    }
  };

  // Flatten medications from all prescriptions
  const activeMedications = Object.values(prescriptions).flatMap(p => p.medications);

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 md:p-12 relative overflow-x-hidden">
      <header className="max-w-5xl mx-auto mb-10 flex items-center justify-between">
         <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
               <span className="text-white font-bold text-2xl leading-none">+</span>
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">CareConnect Patient</h1>
         </div>
         <button onClick={handleLogout} className="px-4 py-2 bg-white border border-slate-200 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl text-sm font-bold transition-all shadow-sm">
           Sign Out
         </button>
      </header>

      <main className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Health Hub</h2>
          <p className="text-slate-500 font-medium mt-1">Unified view of your clinical sessions and prescriptions.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Action: Book Session */}
          <Link to="/portal/intake" className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 flex flex-col items-start shadow-xl shadow-blue-200 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <CalendarPlus size={36} />
            </div>
            <h3 className="text-3xl font-black text-white mb-3">Instant Booking</h3>
            <p className="text-blue-100 mb-8 max-w-md font-medium">Use our AI-driven triage system to identify symptoms and route to the best specialist in seconds.</p>
            <div className="mt-auto flex items-center bg-white text-blue-700 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg group-hover:bg-blue-50 transition-colors">
               Start Clinical Assessment <ChevronRight size={20} className="ml-2" />
            </div>
          </Link>

          {/* Medications Sidebar */}
          <div className="bg-white border border-slate-100 rounded-3xl p-8 flex flex-col items-start shadow-sm relative">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
              <Pill size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Medications</h3>
            <p className="text-slate-500 mb-8 text-sm font-medium">Live sync with your active clinical prescriptions.</p>
            
            <div className="w-full space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              {activeMedications.length > 0 ? (
                activeMedications.map((med, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx} 
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-black text-slate-800 text-sm">{med.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{med.dosage} • {med.timing}</p>
                    </div>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  </motion.div>
                ))
              ) : (
                <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <ClipboardList size={24} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-bold text-slate-400">No active medications</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Clinical History & Upcoming */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Clinical Timeline</h3>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {isLoading ? (
             <div className="py-20 text-center">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
             </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
               <Clock size={48} className="mx-auto text-slate-200 mb-4" />
               <p className="text-slate-500 font-bold tracking-tight">You don't have any sessions scheduled.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {bookings.map((appt, idx) => (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.98 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: idx * 0.05 }}
                   key={appt.id} 
                   className={`bg-white border-2 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-center shadow-sm hover:shadow-xl transition-all duration-300 ${
                     appt.status === 'COMPLETED' ? 'border-slate-100 opacity-90' : 'border-blue-100'
                   }`}
                 >
                   <div className="flex items-center gap-5 w-full md:w-auto">
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${
                        appt.status === 'COMPLETED' ? 'bg-slate-100 text-slate-400' : 
                        appt.status === 'IN_PROGRESS' ? 'bg-blue-600 text-white animate-pulse' : 
                        'bg-blue-50 text-blue-600'
                     }`}>
                       <Activity size={28} />
                     </div>
                     <div>
                       <div className="flex items-center gap-2">
                         <h4 className="font-black text-slate-900 text-lg">Session with {appt.doctor.name}</h4>
                         {appt.status === 'COMPLETED' && <CheckCircle2 size={16} className="text-emerald-500" />}
                       </div>
                       <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{appt.doctor.specialization}</p>
                     </div>
                   </div>

                   <div className="flex flex-col md:flex-row items-center gap-6 mt-6 md:mt-0 w-full md:w-auto">
                     <div className="text-center md:text-right min-w-[120px]">
                       <p className="text-2xl font-black text-blue-600">{appt.slotTime}</p>
                       <p className={`text-[10px] font-black uppercase tracking-widest ${
                         appt.status === 'COMPLETED' ? 'text-slate-400' : 'text-blue-400'
                       }`}>
                         {appt.status || 'Upcoming'}
                       </p>
                     </div>

                     <div className="flex items-center gap-3">
                       {appt.status === 'COMPLETED' ? (
                          <button 
                            onClick={() => {
                              const p = prescriptions[appt.id];
                              if (p) alert(`Diagnosis: ${p.diagnosis}\nAdvice: ${p.advice}`);
                              else alert('Prescription details not found.');
                            }}
                            className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-colors border border-slate-100"
                            title="View Summary"
                          >
                            <FileText size={20} />
                          </button>
                       ) : (
                          <button 
                            onClick={() => handleCancelAppointment(appt.id)}
                            className="p-3 bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-2xl transition-colors group"
                            title="Cancel Appointment"
                          >
                            <X size={20} />
                          </button>
                       )}
                     </div>
                   </div>
                 </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
