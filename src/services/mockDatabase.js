export const hospitalStaff = [
  {
    id: "dr-jenkins",
    name: "Dr. Sarah Jenkins",
    specialization: "General Physician",
    experience: 12,
    availableSlots: ["09:00 AM", "11:00 AM"]
  },
  {
    id: "dr-miller",
    name: "Dr. Robert Miller",
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
    id: "dr-smith",
    name: "Dr. James Smith",
    specialization: "Cardiologist",
    experience: 15,
    availableSlots: ["09:00 AM", "12:00 PM"]
  },
  {
    id: "dr-lee",
    name: "Dr. Michelle Lee",
    specialization: "General Physician",
    experience: 5,
    availableSlots: [] // Fully booked
  },
  {
    id: "dr-emergency",
    name: "On-call Emergency Generalist",
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
  bookings.push(appt);
  localStorage.setItem('careconnect_bookings', JSON.stringify(bookings));
};
