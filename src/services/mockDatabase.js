export const hospitalStaff = [
  {
    id: "dr-sharma",
    name: "Dr. Priya Sharma",
    specialization: "General Physician",
    experience: 12,
    availableSlots: ["09:00 AM", "11:00 AM"]
  },
  {
    id: "dr-desai",
    name: "Dr. Rahul Desai",
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
    id: "dr-singh",
    name: "Dr. Vikram Singh",
    specialization: "Cardiologist",
    experience: 15,
    availableSlots: ["09:00 AM", "12:00 PM"]
  },
  {
    id: "dr-gupta",
    name: "Dr. Neha Gupta",
    specialization: "General Physician",
    experience: 5,
    availableSlots: [] // Fully booked
  },
  {
    id: "dr-emergency",
    name: "Dr. Amit Kumar (Emergency On-call)",
    specialization: "Emergency Medicine",
    experience: 18,
    availableSlots: ["10:00 AM", "02:00 PM", "03:00 PM", "IMMEDIATE"]
  }
];

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
};
