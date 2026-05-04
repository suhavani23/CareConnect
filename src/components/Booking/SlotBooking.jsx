import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Clock, Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DoctorProfileHeader from './DoctorProfileHeader';
import { getBookedAppointments, addBookedAppointment } from '../../services/mockDatabase';

const SlotBooking = ({ doctor, urgencyScore, symptoms, severity_score, ai_triage_summary, affected_area }) => {
  const navigate = useNavigate();
  const [isBookedSuccess, setIsBookedSuccess] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }));
  const [globalBookings, setGlobalBookings] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate next 3 days
  const nextDays = [0, 1, 2].map(offset => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  });

  React.useEffect(() => {
    const fetchBookings = async () => {
      const data = await getBookedAppointments();
      setGlobalBookings(data);
    };
    fetchBookings();
  }, []);

  const allSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];
  
  const isHighUrgency = (urgencyScore >= 7) || (severity_score >= 70);

  const handleBookSlot = async (slot) => {
    setIsSubmitting(true);
    try {
      await addBookedAppointment({
        doctor,
        slotTime: `${selectedDate} @ ${slot}`,
        urgencyScore,
        severity_score,
        ai_triage_summary,
        affectedArea: affected_area,
        reasoning: "Patient self-selected from directory.",
        symptoms: symptoms || []
      });

      setSelectedSlot(`${selectedDate} @ ${slot}`);
      setIsBookedSuccess(true);
    } catch (error) {
      console.error('Booking error:', error);
      alert("Failed to confirm your booking. Please ensure your Supabase schema matches the clinical upgrade requirements.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isBookedSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 rounded-[2.5rem] border-2 border-emerald-100 shadow-xl max-w-2xl mx-auto text-center space-y-6 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-2">
          <CheckCircle size={48} className="text-emerald-500" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Clinical Record Created</h2>
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
           <p className="text-slate-600 font-medium">
             Your session with <span className="font-black text-slate-900">Dr. {doctor.name.split(' ').pop()}</span> is confirmed:
           </p>
           <p className="text-2xl font-black text-blue-600 mt-2">{selectedSlot}</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-200 hover:bg-black transition-all transform hover:scale-[1.02] active:scale-95"
        >
          Return to Dashboard
        </button>
      </motion.div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl max-w-2xl mx-auto relative overflow-hidden">
      {isSubmitting && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
           <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
           <p className="font-black text-slate-800 animate-pulse">Confirming clinical slot...</p>
        </div>
      )}

      <DoctorProfileHeader doctor={doctor} />

      {/* Date Picker */}
      <div className="mb-10">
         <div className="flex items-center gap-2 mb-4">
            <CalendarIcon size={16} className="text-blue-500" />
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Date</h4>
         </div>
         <div className="grid grid-cols-3 gap-3">
            {nextDays.map(date => (
               <button
                 key={date}
                 onClick={() => setSelectedDate(date)}
                 className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${
                   selectedDate === date 
                   ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' 
                   : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200'
                 }`}
               >
                 <span className="text-[10px] font-black uppercase">{date.split(',')[0]}</span>
                 <span className="text-sm font-black">{date.split(',')[1]}</span>
               </button>
            ))}
         </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs flex items-center gap-2">
          <Clock size={14} className="text-blue-500" /> Available Time Slots
        </h4>
        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-widest">
           {selectedDate.split(',')[1]}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {allSlots.map((slot) => {
          // Check availability (mock logic)
          const isInDoctorAvailability = doctor.availableSlots.includes(slot);
          
          // Cross-reference with bookedAppointments (mocking real-time sync for specific day)
          const fullSlotKey = `${selectedDate} @ ${slot}`;
          const isTakenGlobally = globalBookings.some(appt => appt.doctor.id === doctor.id && appt.slotTime === fullSlotKey);
          
          const isBooked = !isInDoctorAvailability || isTakenGlobally;
          
          return (
            <button
              key={slot}
              disabled={isBooked || isSubmitting}
              onClick={() => handleBookSlot(slot)}
              className={`py-4 px-2 rounded-2xl text-sm font-black border-2 transition-all transform hover:scale-105 active:scale-95 ${
                isBooked 
                ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed' 
                : 'bg-white border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 cursor-pointer shadow-sm hover:shadow-blue-100'
              }`}
            >
              {isBooked ? 'Filled' : slot}
            </button>
          );
        })}
        
        {doctor.availableSlots.includes('IMMEDIATE') && selectedDate === nextDays[0] && (
           <button 
             disabled={isSubmitting}
             onClick={() => handleBookSlot('IMMEDIATE')}
             className="col-span-3 py-4 px-2 rounded-2xl text-sm font-black border-2 transition-all bg-red-600 border-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-100 animate-pulse active:scale-95"
           >
             REQUEST IMMEDIATE ATTENTION
           </button>
        )}
      </div>
      
      {isHighUrgency && (
        <div className="mt-8 p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-center gap-3">
           <AlertTriangle size={20} className="text-orange-500" />
           <p className="text-[10px] font-black text-orange-700 uppercase tracking-tight">
             Urgent clinical status detected. Priority routing will be applied to this session.
           </p>
        </div>
      )}
    </div>
  );
};

export default SlotBooking;
