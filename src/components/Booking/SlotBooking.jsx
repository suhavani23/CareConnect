import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import DoctorProfileHeader from './DoctorProfileHeader';
import { getBookedAppointments, addBookedAppointment } from '../../services/mockDatabase';

const SlotBooking = ({ doctor, matchType, reasoning, urgencyScore, symptoms }) => {
  const navigate = useNavigate();
  const [isBookedSuccess, setIsBookedSuccess] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [globalBookings, setGlobalBookings] = useState([]);

  React.useEffect(() => {
    const fetchBookings = async () => {
      const data = await getBookedAppointments();
      setGlobalBookings(data);
    };
    fetchBookings();
  }, []);

  const allSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM"];
  
  const isHighUrgency = urgencyScore >= 7;
  const isSuggested = matchType === 'suggested' || matchType === 'emergency';

  const handleBookSlot = async (slot) => {
    try {
      await addBookedAppointment({
        doctor,
        slotTime: slot,
        urgencyScore,
        reasoning,
        symptoms: symptoms || []
      });

      setSelectedSlot(slot);
      setIsBookedSuccess(true);
    } catch (error) {
      alert("Failed to confirm your booking. Please try again.");
    }
  };

  if (isBookedSuccess) {
    return (
      <div className="bg-white p-10 rounded-xl border shadow-sm max-w-2xl mx-auto text-center space-y-6">
        <CheckCircle size={64} className="mx-auto text-emerald-500" />
        <h2 className="text-3xl font-bold text-slate-900">Session Confirmed!</h2>
        <p className="text-slate-600">
          Your appointment with <strong>{doctor.name}</strong> is scheduled for <strong>{selectedSlot}</strong>.
        </p>
        <p className="text-sm text-slate-500">
          Your clinical brief and symptoms have been securely sent to the doctor.
        </p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm max-w-2xl mx-auto">
      
      {isHighUrgency && matchType === 'emergency' && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start space-x-3">
          <div className="mt-0.5">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div>
            <div className="font-bold">Urgent Care Recommended</div>
            <p className="text-sm mt-1">{reasoning}</p>
          </div>
        </div>
      )}

      {isSuggested && matchType !== 'emergency' && (
        <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg flex items-start space-x-3">
          <div className="mt-0.5">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          </div>
          <div>
            <div className="font-bold">Matchmaker Suggestion</div>
            <p className="text-sm mt-1">{reasoning}</p>
          </div>
        </div>
      )}

      <DoctorProfileHeader doctor={doctor} isSuggested={isSuggested} />

      <h4 className="font-semibold text-slate-700 mb-4">Available Time Slots</h4>
      <div className="grid grid-cols-3 gap-3">
        {allSlots.map((slot) => {
          // A slot is available if it's in the doctor's availableSlots OR if it's IMMEDIATE
          const isAvailable = doctor.availableSlots.includes(slot) || (doctor.availableSlots.includes('IMMEDIATE') && slot === '10:00 AM');
          
          // Cross-reference with bookedAppointments to see if someone else took it (mocking real-time sync)
          const isTakenGlobally = globalBookings.some(appt => appt.doctor.id === doctor.id && appt.slotTime === slot);
          
          const isBooked = !isAvailable || isTakenGlobally;
          
          return (
            <button
              key={slot}
              disabled={isBooked}
              onClick={() => handleBookSlot(slot)}
              className={`py-3 px-2 rounded-lg text-sm font-medium border transition-all ${
                isBooked 
                ? 'bg-red-50 border-red-200 text-red-500 cursor-not-allowed opacity-80' 
                : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-600 hover:text-white cursor-pointer'
              }`}
            >
              {isBooked ? 'Booked' : slot}
            </button>
          );
        })}
        {doctor.availableSlots.includes('IMMEDIATE') && (
           <button 
             onClick={() => handleBookSlot('IMMEDIATE')}
             className="col-span-3 py-3 px-2 rounded-lg text-sm font-bold border transition-all bg-red-100 border-red-300 text-red-700 hover:bg-red-600 hover:text-white"
           >
             REQUEST IMMEDIATE ATTENTION
           </button>
        )}
      </div>
    </div>
  );
};

export default SlotBooking;
