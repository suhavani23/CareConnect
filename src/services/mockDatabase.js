import { supabase } from './supabaseClient';

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

export const getDoctorByName = (name) => {
  return hospitalStaff.find(
    doc => doc.name.toLowerCase().includes(name.toLowerCase())
  ) || null;
};

// --- Supabase-backed appointment functions ---

/**
 * SQL FIX FOR MISSING COLUMNS:
 * Run this in your Supabase SQL Editor if you see errors:
 * 
 * ALTER TABLE bookings 
 * ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'WAITING',
 * ADD COLUMN IF NOT EXISTS severity_score INT8,
 * ADD COLUMN IF NOT EXISTS ai_triage_summary TEXT,
 * ADD COLUMN IF NOT EXISTS priority_level TEXT DEFAULT 'Routine',
 * ADD COLUMN IF NOT EXISTS affected_area TEXT;
 */

export const getBookedAppointments = async () => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Schema mismatch in bookings table. Some features may be disabled.', error.message);
      // If the fetch fails entirely, return empty array
      return [];
    }

    return (data || []).map(row => ({
      id: row.id,
      slotTime: row.slot_time,
      urgencyScore: row.urgency_score,
      severity_score: row.severity_score || 0,
      ai_triage_summary: row.ai_triage_summary || '',
      priority_level: row.priority_level || 'Routine',
      reasoning: row.reasoning,
      symptoms: row.symptoms || [],
      affectedArea: row.affected_area || '',
      status: row.status || 'WAITING',
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
  const baseData = {
    doctor_id: appt.doctor.id,
    doctor_name: appt.doctor.name,
    doctor_specialization: appt.doctor.specialization,
    slot_time: appt.slotTime,
    urgency_score: appt.urgencyScore,
    reasoning: appt.reasoning,
    symptoms: appt.symptoms || []
  };

  const extendedData = {
    ...baseData,
    severity_score: appt.severity_score || null,
    ai_triage_summary: appt.ai_triage_summary || null,
    priority_level: appt.priority_level || 'Routine',
    affected_area: appt.affectedArea || null,
    status: 'WAITING'
  };

  try {
    // Try inserting with all fields first
    const { data, error } = await supabase
      .from('bookings')
      .insert([extendedData])
      .select();

    if (error) {
      // If the error is a missing column (PGRST204 or similar), try falling back to base fields
      if (error.message.includes('column') || error.code === 'PGRST204') {
        console.warn('Fallback: Inserting without extended clinical fields due to missing columns.');
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('bookings')
          .insert([baseData])
          .select();
        
        if (fallbackError) throw fallbackError;
        return fallbackData[0];
      }
      throw error;
    }
    return data[0];
  } catch (error) {
    console.error('Booking Error:', error);
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

export const updateAppointmentStatus = async (apptId, status) => {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', apptId);

    if (error) {
       // If column missing, we can't update status, but we can log it
       if (error.message.includes('column')) {
         console.error('STATUS UPDATE FAILED: "status" column missing in DB.');
         return; 
       }
       throw error;
    }
  } catch (error) {
    console.error('Error updating appointment status:', error);
    throw error;
  }
};

// --- Prescription helpers ---

export const getPrescriptions = () => {
  const data = localStorage.getItem('careconnect_prescriptions');
  return data ? JSON.parse(data) : {};
};

export const savePrescription = (apptId, prescriptionData) => {
  const prescriptions = getPrescriptions();
  prescriptions[apptId] = { ...prescriptionData, savedAt: new Date().toISOString() };
  localStorage.setItem('careconnect_prescriptions', JSON.stringify(prescriptions));
};
