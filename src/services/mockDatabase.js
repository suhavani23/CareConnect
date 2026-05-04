export const hospitalStaff = [
  {
<<<<<<< HEAD
    id: "dr-jenkins",
    name: "Dr. Sarah Jenkins",
=======
    id: "dr-sharma",
    name: "Dr. Priya Sharma",
>>>>>>> 03fe6592c0a4c645a0d9d48c63f935a3d59bdd59
    specialization: "General Physician",
    experience: 12,
    availableSlots: ["09:00 AM", "11:00 AM"]
  },
  {
<<<<<<< HEAD
    id: "dr-miller",
    name: "Dr. Robert Miller",
=======
    id: "dr-desai",
    name: "Dr. Rahul Desai",
>>>>>>> 03fe6592c0a4c645a0d9d48c63f935a3d59bdd59
    specialization: "Neurologist",
    experience: 8,
    availableSlots: ["10:00 AM", "01:00 PM", "03:00 PM"]
  },
  {
    id: "dr-patel",
    name: "Dr. Anita Patel",
    specialization: "Neurologist",
    experience: 20,
    availableSlots: ["02:00 PM"]
  },
  {
<<<<<<< HEAD
    id: "dr-smith",
    name: "Dr. James Smith",
=======
    id: "dr-singh",
    name: "Dr. Vikram Singh",
>>>>>>> 03fe6592c0a4c645a0d9d48c63f935a3d59bdd59
    specialization: "Cardiologist",
    experience: 15,
    availableSlots: ["09:00 AM", "12:00 PM"]
  },
  {
<<<<<<< HEAD
    id: "dr-lee",
    name: "Dr. Michelle Lee",
=======
    id: "dr-gupta",
    name: "Dr. Neha Gupta",
>>>>>>> 03fe6592c0a4c645a0d9d48c63f935a3d59bdd59
    specialization: "General Physician",
    experience: 5,
    availableSlots: [] // Fully booked
  },
  {
    id: "dr-emergency",
<<<<<<< HEAD
    name: "On-call Emergency Generalist",
=======
    name: "Dr. Amit Kumar (Emergency On-call)",
>>>>>>> 03fe6592c0a4c645a0d9d48c63f935a3d59bdd59
    specialization: "Emergency Medicine",
    experience: 18,
    availableSlots: ["10:00 AM", "02:00 PM", "03:00 PM", "IMMEDIATE"]
  }
];

<<<<<<< HEAD
// Global functions to simulate booked appointments syncing across the app
export const getBookedAppointments = () => {
  const data = localStorage.getItem('careconnect_bookings');
  return data ? JSON.parse(data) : [];
};

export const addBookedAppointment = (appt) => {
  const bookings = getBookedAppointments();
  bookings.push({
    ...appt,
    id: appt.id || Date.now().toString() + Math.random().toString(36).substr(2, 9)
  });
  localStorage.setItem('careconnect_bookings', JSON.stringify(bookings));
};

export const removeBookedAppointment = (apptId) => {
  const bookings = getBookedAppointments();
  const filtered = bookings.filter(appt => appt.id !== apptId);
  localStorage.setItem('careconnect_bookings', JSON.stringify(filtered));
=======
import { supabase } from './supabaseClient';

export const getBookedAppointments = async () => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Transform data back to match frontend structure (doctor object inside appt)
    return (data || []).map(row => ({
      id: row.id,
      slotTime: row.slot_time,
      urgencyScore: row.urgency_score,
      reasoning: row.reasoning,
      symptoms: row.symptoms,
      doctor: {
        id: row.doctor_id,
        name: row.doctor_name,
        specialization: row.doctor_specialization
      }
    }));
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
};

export const addBookedAppointment = async (appt) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          doctor_id: appt.doctor.id,
          doctor_name: appt.doctor.name,
          doctor_specialization: appt.doctor.specialization,
          slot_time: appt.slotTime,
          urgency_score: appt.urgencyScore,
          reasoning: appt.reasoning,
          symptoms: appt.symptoms || [],
        }
      ])
      .select();
      
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Full Error Object:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.error('NETWORK ERROR: The browser blocked the request or the URL is unreachable. Check for ad-blockers or firewall.');
    }
    throw error;
  }
};

export const removeBookedAppointment = async (apptId) => {
  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', apptId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing appointment:', error);
    throw error;
  }
>>>>>>> 03fe6592c0a4c645a0d9d48c63f935a3d59bdd59
};
