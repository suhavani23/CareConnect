import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Activity, AlertTriangle, FileText, ChevronLeft } from 'lucide-react';
import { getBookedAppointments } from '../services/mockDatabase';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Load booked appointments from our mock database
    const bookings = getBookedAppointments();
    setAppointments([...bookings].reverse()); // Newest first
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 md:p-12 relative">
      <header className="max-w-5xl mx-auto mb-10 flex items-center justify-between">
         <div className="flex items-center space-x-4">
            <Link to="/" className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-lg shadow-sm">
               <ChevronLeft size={20} />
            </Link>
            <div className="flex items-center space-x-2 border-l pl-4 border-slate-200">
              <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                 <span className="text-white font-bold text-xl leading-none">D</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Doctor Portal</h1>
            </div>
         </div>
      </header>

      <main className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Today's Schedule</h2>
            <p className="text-slate-500 mt-1">You have {appointments.length} appointments booked.</p>
          </div>
        </div>

        {appointments.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <Clock size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700">No appointments yet</h3>
            <p className="text-slate-500 mt-2">When patients book slots, they will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {appointments.map((appt, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row">
                {/* Time & Doctor block */}
                <div className="bg-slate-50 border-r border-slate-100 p-6 md:w-64 flex flex-col justify-center">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 font-bold rounded-full text-sm mb-4 w-max">
                    {appt.slotTime}
                  </span>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Assigned To</p>
                  <p className="font-bold text-slate-800">{appt.doctor.name}</p>
                  <p className="text-sm text-blue-600">{appt.doctor.specialization}</p>
                </div>

                {/* Clinical Brief */}
                <div className="p-6 flex-1">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="text-xl font-bold text-slate-900 flex items-center">
                       <FileText size={20} className="mr-2 text-slate-400"/> Clinical Brief
                     </h3>
                     {appt.urgencyScore >= 7 && (
                       <span className="flex items-center text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm font-bold border border-red-100">
                         <AlertTriangle size={16} className="mr-1" /> High Urgency
                       </span>
                     )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold mb-1">Patient Details</p>
                      <p className="text-sm font-medium text-slate-800">Age: 45 | Gender: M</p>
                      <p className="text-xs text-slate-500">History: Hypertension</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs text-slate-500 uppercase font-bold mb-1">Raw Symptoms</p>
                      <div className="flex flex-wrap gap-2">
                        {appt.symptoms.map((s, idx) => (
                          <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-sm">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-2">AI Urgency Report</p>
                    <p className="text-sm text-slate-700">
                      <strong>Pain Level: {appt.urgencyScore}/10</strong>. {appt.reasoning}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorDashboard;
