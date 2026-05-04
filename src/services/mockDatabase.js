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
};
