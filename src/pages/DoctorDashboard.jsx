import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, Activity, AlertTriangle, FileText, ChevronLeft, 
  Trash2, User, Users, ClipboardCheck, Play, CheckCircle2, 
  Stethoscope, Pill, X, Save, TrendingUp, Info, LogIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getBookedAppointments, 
  removeBookedAppointment, 
  hospitalStaff, 
  updateAppointmentStatus,
  savePrescription,
  getPrescriptions
} from '../services/mockDatabase';
import { useAuth } from '../context/AuthContext';

const PrescriptionModal = ({ appointment, onClose, onSave }) => {
  const [prescription, setPrescription] = useState({
    medications: [{ name: '', dosage: '', timing: 'After Food' }],
    diagnosis: '',
    advice: ''
  });

  const addMedication = () => {
    setPrescription({
      ...prescription,
      medications: [...prescription.medications, { name: '', dosage: '', timing: 'After Food' }]
    });
  };

  const updateMedication = (index, field, value) => {
    const newMeds = [...prescription.medications];
    newMeds[index][field] = value;
    setPrescription({ ...prescription, medications: newMeds });
  };

  const removeMedication = (index) => {
    const newMeds = prescription.medications.filter((_, i) => i !== index);
    setPrescription({ ...prescription, medications: newMeds });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(appointment.id, prescription);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        <div className="bg-slate-800 p-6 text-white flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Clinical Prescription</h3>
            <p className="text-slate-400 text-sm">Patient: {appointment.symptoms?.join(', ') || 'General Checkup'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Final Diagnosis</label>
            <input 
              type="text" 
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Acute Viral Infection"
              required
              value={prescription.diagnosis}
              onChange={(e) => setPrescription({...prescription, diagnosis: e.target.value})}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-bold text-slate-700">Medications</label>
              <button 
                type="button" 
                onClick={addMedication}
                className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100 transition"
              >
                + Add Medicine
              </button>
            </div>
            
            {prescription.medications.map((med, idx) => (
              <div key={idx} className="flex gap-3 items-end p-4 bg-slate-50 rounded-xl border border-slate-100 relative">
                <div className="flex-1 space-y-3">
                  <input 
                    placeholder="Medicine Name" 
                    className="w-full p-2 text-sm border rounded-lg"
                    value={med.name}
                    onChange={(e) => updateMedication(idx, 'name', e.target.value)}
                    required
                  />
                  <div className="flex gap-2">
                    <input 
                      placeholder="Dosage (e.g. 500mg)" 
                      className="flex-1 p-2 text-sm border rounded-lg"
                      value={med.dosage}
                      onChange={(e) => updateMedication(idx, 'dosage', e.target.value)}
                      required
                    />
                    <select 
                      className="flex-1 p-2 text-sm border rounded-lg bg-white"
                      value={med.timing}
                      onChange={(e) => updateMedication(idx, 'timing', e.target.value)}
                    >
                      <option>After Food</option>
                      <option>Before Food</option>
                      <option>With Milk</option>
                    </select>
                  </div>
                </div>
                {prescription.medications.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeMedication(idx)}
                    className="p-2 text-slate-400 hover:text-red-500 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Clinical Advice</label>
            <textarea 
              className="w-full p-3 border rounded-xl h-24 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Bed rest, stay hydrated, etc..."
              value={prescription.advice}
              onChange={(e) => setPrescription({...prescription, advice: e.target.value})}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition flex items-center justify-center gap-2"
            >
              <Save size={18} /> Complete & Save
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const DoctorDashboard = () => {
  const { doctorProfile, doctorLogin, doctorLogout, isDoctorAuthenticated } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [password, setPassword] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedApptForPrescription, setSelectedApptForPrescription] = useState(null);

  const fetchAndSort = async () => {
    setIsLoading(true);
    const bookings = await getBookedAppointments();
    // Filter by the logged in doctor
    const myBookings = bookings.filter(b => b.doctor.id === doctorProfile.id);
    const sorted = [...myBookings].sort((a, b) => (b.severity_score || 0) - (a.severity_score || 0));
    setAppointments(sorted);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isDoctorAuthenticated) {
      fetchAndSort();
      const handleStorage = (e) => {
        if (e.key === 'careconnect_bookings') fetchAndSort();
      };
      window.addEventListener('storage', handleStorage);
      return () => window.removeEventListener('storage', handleStorage);
    }
  }, [isDoctorAuthenticated, doctorProfile?.id]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!selectedDoctorId) {
      alert('Please select a doctor profile');
      return;
    }
    if (password === 'admin') {
      const profile = hospitalStaff.find(d => d.id === selectedDoctorId);
      doctorLogin(profile);
    } else {
      alert('Incorrect passkey');
    }
  };

  const handleUpdateStatus = async (apptId, newStatus) => {
    try {
      await updateAppointmentStatus(apptId, newStatus);
      await fetchAndSort();
    } catch (err) {
      console.error('Update status error:', err);
      alert('Failed to update status. Please ensure the "status" column exists in your Supabase table.');
    }
  };

  const handleSavePrescription = async (apptId, data) => {
    savePrescription(apptId, data);
    await handleUpdateStatus(apptId, 'COMPLETED');
    setSelectedApptForPrescription(null);
  };

  const stats = {
    total: appointments.length,
    urgent: appointments.filter(a => (a.severity_score || 0) >= 70).length,
    inProgress: appointments.filter(a => a.status === 'IN_PROGRESS').length,
    completed: appointments.filter(a => a.status === 'COMPLETED').length
  };

  if (!isDoctorAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-md w-full text-center border border-slate-100 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-100">
            <Stethoscope size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Clinical Portal</h2>
          <p className="text-slate-500 mb-10 text-sm font-medium">Select your profile to access the dashboard</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                >
                  <option value="">Select Doctor Profile...</option>
                  {hospitalStaff.map(doc => (
                    <option key={doc.id} value={doc.id}>{doc.name} ({doc.specialization})</option>
                  ))}
                </select>
                <Users className="absolute left-4 top-4 text-slate-400" size={20} />
                <div className="absolute right-4 top-5 pointer-events-none text-slate-400">
                  <ChevronLeft size={16} className="-rotate-90" />
                </div>
              </div>

              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Passkey (admin)"
                  className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all text-center font-bold tracking-widest"
                />
                <Clock className="absolute left-4 top-4 text-slate-400" size={20} />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-black transition transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-slate-200 flex items-center justify-center gap-3"
            >
              <LogIn size={20} /> Access Portal
            </button>
          </form>

          <div className="mt-8 p-4 bg-blue-50 rounded-2xl text-left border border-blue-100">
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Demo Access</p>
            <p className="text-xs text-blue-700 font-medium leading-relaxed">
              Use passkey <span className="font-black">admin</span> for any selected profile.
            </p>
          </div>

          <Link to="/" className="block mt-8 text-sm font-bold text-slate-400 hover:text-slate-600 transition">
            ← Exit to Public Site
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative">
      {/* Personalized Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
              <span className="text-white font-bold text-2xl">{doctorProfile.name.charAt(4)}</span>
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">{doctorProfile.name}</h1>
              <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                <Activity size={14} className="text-blue-500" /> 
                {doctorProfile.specialization} • {doctorProfile.experience} Years Exp.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
               <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Status</span>
               <span className="text-emerald-600 text-sm font-bold flex items-center gap-1.5">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Active Duty
               </span>
            </div>
            <button 
              onClick={doctorLogout}
              className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-10 space-y-10">
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Assigned Patients', value: stats.total, icon: Users, color: 'blue' },
            { label: 'Urgent Cases', value: stats.urgent, icon: AlertTriangle, color: 'orange', alert: stats.urgent > 0 },
            { label: 'In Progress', value: stats.inProgress, icon: TrendingUp, color: 'indigo' },
            { label: 'Completed', value: stats.completed, icon: ClipboardCheck, color: 'emerald' }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 relative overflow-hidden group"
            >
              <div className={`w-12 h-12 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              </div>
              {stat.alert && (
                <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Schedule Section */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Clinical Pipeline</h2>
              <p className="text-sm text-slate-500 mt-1">Manage your active patient list and triage reports.</p>
            </div>
          </div>

          {isLoading ? (
             <div className="py-20 text-center space-y-4">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-slate-400 font-bold animate-pulse">Syncing Medical Records...</p>
             </div>
          ) : appointments.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
              <Clock size={48} className="mx-auto text-slate-200 mb-4" />
              <h3 className="text-xl font-bold text-slate-700">No Patients Assigned</h3>
              <p className="text-slate-500 mt-2">New bookings matching your specialization will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {appointments.map((appt) => (
                <motion.div 
                  layout
                  key={appt.id} 
                  className={`bg-white border-2 rounded-3xl overflow-hidden transition-all duration-500 shadow-sm ${
                    appt.status === 'IN_PROGRESS' ? 'border-blue-500 shadow-xl shadow-blue-50' : 'border-slate-100'
                  }`}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Urgency Ribbon */}
                    <div className={`md:w-3 ${
                      (appt.severity_score || 0) >= 80 ? 'bg-red-500' : 
                      (appt.severity_score || 0) >= 70 ? 'bg-orange-500' : 'bg-slate-200'
                    }`} />

                    {/* Content */}
                    <div className="flex-1 p-8">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                          <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                            appt.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' :
                            appt.status === 'IN_PROGRESS' ? 'bg-blue-600 text-white animate-pulse' :
                            'bg-slate-100 text-slate-500'
                          }`}>
                            {appt.status || 'WAITING'}
                          </div>
                          <div className="flex items-center text-slate-400 text-sm font-bold">
                            <Clock size={16} className="mr-1.5" /> {appt.slotTime}
                          </div>
                        </div>

                        <div className="flex gap-2">
                           {appt.status === 'WAITING' && (
                             <button 
                               onClick={() => handleUpdateStatus(appt.id, 'IN_PROGRESS')}
                               className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-100"
                             >
                               <Play size={16} fill="currentColor" /> Start Session
                             </button>
                           )}
                           {appt.status === 'IN_PROGRESS' && (
                             <button 
                               onClick={() => setSelectedApptForPrescription(appt)}
                               className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition flex items-center gap-2 shadow-lg shadow-emerald-100"
                             >
                               <Pill size={16} /> Prescribe & Complete
                             </button>
                           )}
                           {appt.status === 'COMPLETED' && (
                             <div className="flex items-center text-emerald-600 gap-1.5 font-bold px-4 py-2 bg-emerald-50 rounded-xl">
                               <CheckCircle2 size={18} /> Session Finalized
                             </div>
                           )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold text-xl">
                              {appt.symptoms?.[0]?.charAt(0) || 'P'}
                            </div>
                            <div>
                              <h4 className="font-black text-xl text-slate-900">{appt.symptoms?.join(', ') || 'General Consultation'}</h4>
                              <p className="text-slate-500 font-medium">Chief Complaint • {appt.affectedArea || 'General'}</p>
                            </div>
                          </div>

                          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 flex gap-4">
                            <div className="mt-1">
                              <Info size={18} className="text-blue-500" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Clinical AI Brief</p>
                              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                {appt.ai_triage_summary || appt.reasoning}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                          <div className="flex justify-between items-center">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pain Matrix</p>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              (appt.severity_score || 0) >= 80 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                              S: {appt.severity_score || 0}
                            </span>
                          </div>
                          
                          <div className="relative pt-2">
                             <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${appt.severity_score || 0}%` }}
                                 className={`h-full ${
                                   (appt.severity_score || 0) >= 80 ? 'bg-red-500' : 
                                   (appt.severity_score || 0) >= 70 ? 'bg-orange-500' : 'bg-blue-500'
                                 }`}
                               />
                             </div>
                             <div className="flex justify-between mt-2">
                               <span className="text-[10px] font-bold text-slate-400">Routine</span>
                               <span className="text-[10px] font-bold text-slate-400">Emergency</span>
                             </div>
                          </div>

                          <div className="pt-4 space-y-2">
                             <div className="flex justify-between text-xs">
                               <span className="text-slate-500">Reported Intensity</span>
                               <span className="font-bold text-slate-800">{appt.urgencyScore}/10</span>
                             </div>
                             <div className="flex justify-between text-xs">
                               <span className="text-slate-500">Duration</span>
                               <span className="font-bold text-slate-800">{appt.painDuration || 'New Onset'}</span>
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>

      <AnimatePresence>
        {selectedApptForPrescription && (
          <PrescriptionModal 
            appointment={selectedApptForPrescription}
            onClose={() => setSelectedApptForPrescription(null)}
            onSave={handleSavePrescription}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoctorDashboard;
