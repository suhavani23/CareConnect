import { supabase } from './supabaseClient';

export const hospitalStaff = [
  {
    id: "dr-sharma",
    name: "Dr. Priya Sharma",
    specialization: "General Physician",
    experience: 12,
    availableSlots: ["09:00 AM", "11:00 AM", "01:00 PM", "04:00 PM"]
  },
  {
    id: "dr-desai",
    name: "Dr. Rahul Desai",
    specialization: "Neurologist",
    experience: 8,
    availableSlots: ["10:00 AM", "01:00 PM", "03:00 PM", "05:00 PM"]
  },
  {
    id: "dr-patel",
    name: "Dr. Anita Patel",
    specialization: "Neurologist",
    experience: 20,
    availableSlots: ["09:30 AM", "11:30 AM", "02:00 PM"]
  },
  {
    id: "dr-singh",
    name: "Dr. Vikram Singh",
    specialization: "Cardiologist",
    experience: 15,
    availableSlots: ["08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM"]
  },
  {
    id: "dr-gupta",
    name: "Dr. Neha Gupta",
    specialization: "General Physician",
    experience: 5,
    availableSlots: ["11:00 AM", "01:00 PM"]
  },
  {
    id: "dr-reddy",
    name: "Dr. Sandeep Reddy",
    specialization: "Orthopedician",
    experience: 14,
    availableSlots: ["10:00 AM", "12:00 PM", "03:00 PM"]
  },
  {
    id: "dr-khan",
    name: "Dr. Sarah Khan",
    specialization: "Pediatrician",
    experience: 10,
    availableSlots: ["09:00 AM", "01:00 PM", "04:00 PM"]
  },
  {
    id: "dr-malhotra",
    name: "Dr. Arjun Malhotra",
    specialization: "Dermatologist",
    experience: 7,
    availableSlots: ["11:00 AM", "02:00 PM", "05:00 PM"]
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

// --- Hybrid Sync Logic ---

const getLocalStatusStore = () => {
  const data = localStorage.getItem('careconnect_status_fallback');
  return data ? JSON.parse(data) : {};
};

const saveLocalStatus = (apptId, status) => {
  const store = getLocalStatusStore();
  store[apptId] = status;
  localStorage.setItem('careconnect_status_fallback', JSON.stringify(store));
  window.dispatchEvent(new Event('storage'));
};

// --- Supabase-backed appointment functions ---

export const getBookedAppointments = async () => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Schema mismatch in bookings table. Falling back to local/partial sync.', error.message);
      return [];
    }

    const localStatuses = getLocalStatusStore();

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
      status: row.status || localStatuses[row.id] || 'WAITING',
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
  const fullData = {
    doctor_id: appt.doctor.id,
    doctor_name: appt.doctor.name,
    doctor_specialization: appt.doctor.specialization,
    slot_time: appt.slotTime,
    urgency_score: appt.urgencyScore,
    severity_score: appt.severity_score || null,
    ai_triage_summary: appt.ai_triage_summary || null,
    priority_level: appt.priority_level || 'Routine',
    reasoning: appt.reasoning,
    symptoms: appt.symptoms || [],
    affected_area: appt.affectedArea || null,
    status: 'WAITING'
  };

  const baseData = {
    doctor_id: appt.doctor.id,
    doctor_name: appt.doctor.name,
    doctor_specialization: appt.doctor.specialization,
    slot_time: appt.slotTime,
    urgency_score: appt.urgencyScore,
    reasoning: appt.reasoning,
    symptoms: appt.symptoms || []
  };

  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([fullData])
      .select();

    if (error) {
      console.warn('Schema error encountered. Retrying with minimal field set...', error.message);
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('bookings')
        .insert([baseData])
        .select();
      
      if (fallbackError) throw fallbackError;
      return fallbackData[0];
    }
    return data[0];
  } catch (error) {
    console.error('Final Booking Failure:', error);
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
       console.warn('DB Status Update Failed. Syncing with LocalStorage fallback.', error.message);
       saveLocalStatus(apptId, status);
       return;
    }
  } catch (error) {
    console.error('Error updating status, falling back to local.', error);
    saveLocalStatus(apptId, status);
  }
};

export const getPrescriptions = () => {
  const data = localStorage.getItem('careconnect_prescriptions');
  return data ? JSON.parse(data) : {};
};

export const savePrescription = (apptId, prescriptionData) => {
  const prescriptions = getPrescriptions();
  prescriptions[apptId] = { ...prescriptionData, savedAt: new Date().toISOString() };
  localStorage.setItem('careconnect_prescriptions', JSON.stringify(prescriptions));
};
