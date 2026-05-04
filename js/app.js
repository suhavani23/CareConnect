/* app.js - CareConnect Hospital Booking System Core Logic */

// =============================================
// DATA CONSTANTS
// =============================================

const DEPARTMENTS = [
  { id: 'cardiology', name: 'Cardiology', icon: '🫀', description: 'Heart & cardiovascular care specialists', color: '#FF6B6B' },
  { id: 'orthopedics', name: 'Orthopedics', icon: '🦴', description: 'Bone, joint & muscle treatment', color: '#4ECDC4' },
  { id: 'neurology', name: 'Neurology', icon: '🧠', description: 'Brain & nervous system disorders', color: '#45B7D1' },
  { id: 'dermatology', name: 'Dermatology', icon: '🔬', description: 'Skin, hair & nail conditions', color: '#96CEB4' },
  { id: 'pediatrics', name: 'Pediatrics', icon: '👶', description: 'Specialized children healthcare', color: '#FECA57' },
  { id: 'general', name: 'General Medicine', icon: '🩺', description: 'Primary care & general health', color: '#A29BFE' },
  { id: 'dental', name: 'Dental & Oral', icon: '🦷', description: 'Oral health & dental procedures', color: '#FD9644' },
  { id: 'ophthalmology', name: 'Ophthalmology', icon: '👁️', description: 'Eye care & vision specialists', color: '#26DE81' },
];

const DOCTORS_SEED = [
  { id: 'd1', name: 'Dr. Priya Sharma', department: 'cardiology', speciality: 'Interventional Cardiology', experience: 15, rating: 4.9, available: true, emoji: '👩‍⚕️' },
  { id: 'd2', name: 'Dr. Rahul Mehta', department: 'cardiology', speciality: 'Cardiac Electrophysiology', experience: 12, rating: 4.7, available: true, emoji: '👨‍⚕️' },
  { id: 'd3', name: 'Dr. Anil Kumar', department: 'orthopedics', speciality: 'Joint Replacement Surgery', experience: 18, rating: 4.8, available: true, emoji: '👨‍⚕️' },
  { id: 'd4', name: 'Dr. Sneha Patel', department: 'orthopedics', speciality: 'Sports Medicine', experience: 10, rating: 4.6, available: true, emoji: '👩‍⚕️' },
  { id: 'd5', name: 'Dr. Vikram Nair', department: 'neurology', speciality: 'Stroke & Epilepsy', experience: 20, rating: 4.9, available: true, emoji: '👨‍⚕️' },
  { id: 'd6', name: 'Dr. Meera Reddy', department: 'neurology', speciality: 'Headache & Migraine', experience: 8, rating: 4.5, available: true, emoji: '👩‍⚕️' },
  { id: 'd7', name: 'Dr. Kavya Singh', department: 'dermatology', speciality: 'Cosmetic Dermatology', experience: 9, rating: 4.7, available: true, emoji: '👩‍⚕️' },
  { id: 'd8', name: 'Dr. Arjun Gupta', department: 'dermatology', speciality: 'Pediatric Dermatology', experience: 11, rating: 4.6, available: true, emoji: '👨‍⚕️' },
  { id: 'd9', name: 'Dr. Lakshmi Rao', department: 'pediatrics', speciality: 'Neonatal & Infant Care', experience: 14, rating: 4.8, available: true, emoji: '👩‍⚕️' },
  { id: 'd10', name: 'Dr. Suresh Krishnan', department: 'pediatrics', speciality: 'Pediatric Cardiology', experience: 16, rating: 4.9, available: true, emoji: '👨‍⚕️' },
  { id: 'd11', name: 'Dr. Anjali Desai', department: 'general', speciality: 'Internal Medicine', experience: 7, rating: 4.5, available: true, emoji: '👩‍⚕️' },
  { id: 'd12', name: 'Dr. Rajesh Iyer', department: 'general', speciality: 'Family Medicine', experience: 12, rating: 4.6, available: true, emoji: '👨‍⚕️' },
  { id: 'd13', name: 'Dr. Pooja Verma', department: 'dental', speciality: 'Orthodontics', experience: 8, rating: 4.7, available: true, emoji: '👩‍⚕️' },
  { id: 'd14', name: 'Dr. Kiran Shah', department: 'dental', speciality: 'Oral & Maxillofacial Surgery', experience: 13, rating: 4.8, available: true, emoji: '👨‍⚕️' },
  { id: 'd15', name: 'Dr. Nidhi Joshi', department: 'ophthalmology', speciality: 'Retina & Vitreous', experience: 11, rating: 4.8, available: true, emoji: '👩‍⚕️' },
  { id: 'd16', name: 'Dr. Sameer Bhat', department: 'ophthalmology', speciality: 'Cornea & Cataract Surgery', experience: 9, rating: 4.6, available: true, emoji: '👨‍⚕️' },
];

const FACILITIES = [
  { icon: '🏥', title: '24/7 Emergency Care', desc: 'Round-the-clock emergency services with dedicated trauma team.' },
  { icon: '🔬', title: 'Advanced Diagnostics', desc: 'State-of-the-art lab & imaging including MRI, CT scan, and PET scan.' },
  { icon: '💊', title: 'Pharmacy On-site', desc: 'Full-service pharmacy stocked with all prescription and OTC medications.' },
  { icon: '🛏️', title: 'Private & ICU Rooms', desc: '200+ private rooms and 40 ICU beds with continuous monitoring.' },
  { icon: '🚑', title: 'Ambulance Service', desc: 'GPS-tracked ambulances with paramedic support, available 24/7.' },
  { icon: '🧬', title: 'Genetic Counseling', desc: 'Hereditary risk assessment and personalized genetic health planning.' },
  { icon: '🧘', title: 'Rehabilitation Center', desc: 'Comprehensive physiotherapy and mental wellness programs.' },
  { icon: '📱', title: 'Teleconsultation', desc: 'Secure video consultations with specialists from your home.' },
];

// =============================================
// SLOT GENERATION
// =============================================

function generateSlots(doctorId) {
  const slots = [];
  const today = new Date();
  const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];

  for (let day = 0; day < 14; day++) {
    const date = new Date(today);
    date.setDate(today.getDate() + day);
    if (date.getDay() === 0) continue; // Skip Sundays

    times.forEach(time => {
      const isBooked = Math.random() < 0.3; // 30% pre-booked for demo
      slots.push({
        id: `${doctorId}_${date.toISOString().split('T')[0]}_${time.replace(':','')}`,
        doctorId,
        date: date.toISOString().split('T')[0],
        time,
        booked: isBooked,
        patientId: isBooked ? 'demo_patient' : null
      });
    });
  }
  return slots;
}

// =============================================
// INITIALIZATION
// =============================================

function initializeData() {
  if (localStorage.getItem('hb_v2_initialized')) return;
  localStorage.setItem('hb_doctors', JSON.stringify(DOCTORS_SEED));
  localStorage.setItem('hb_departments', JSON.stringify(DEPARTMENTS));
  localStorage.setItem('hb_patients', JSON.stringify([]));
  localStorage.setItem('hb_appointments', JSON.stringify([]));
  localStorage.setItem('hb_prescriptions', JSON.stringify([]));

  // Generate slots for all doctors
  const allSlots = [];
  DOCTORS_SEED.forEach(doc => allSlots.push(...generateSlots(doc.id)));
  localStorage.setItem('hb_slots', JSON.stringify(allSlots));
  localStorage.setItem('hb_v2_initialized', 'true');
}

// =============================================
// AUTH
// =============================================

function getCurrentUser() {
  const u = localStorage.getItem('hb_current_user');
  return u ? JSON.parse(u) : null;
}
function setCurrentUser(user) {
  localStorage.setItem('hb_current_user', JSON.stringify(user));
}
function logout() {
  localStorage.removeItem('hb_current_user');
  window.location.href = 'index.html';
}
function requireAuth(role = null) {
  const user = getCurrentUser();
  if (!user) { window.location.href = 'login.html'; return null; }
  if (role && user.role !== role) { window.location.href = 'dashboard.html'; return null; }
  return user;
}

function registerPatient(data) {
  const patients = JSON.parse(localStorage.getItem('hb_patients') || '[]');
  if (patients.find(p => p.email === data.email))
    return { error: 'Email already registered. Please login.' };

  const patient = {
    id: 'p_' + Date.now(),
    role: 'patient',
    ...data,
    createdAt: new Date().toISOString()
  };
  patients.push(patient);
  localStorage.setItem('hb_patients', JSON.stringify(patients));
  return { success: true, patient };
}

function loginUser(email, password) {
  // Patient login
  const patients = JSON.parse(localStorage.getItem('hb_patients') || '[]');
  const patient = patients.find(p => p.email === email && p.password === password);
  if (patient) return { success: true, user: patient };

  // Doctor login: doctorId@hospital.com / doctor123
  const doctors = JSON.parse(localStorage.getItem('hb_doctors') || '[]');
  const doctorMatch = doctors.find(d => `${d.id}@hospital.com` === email && password === 'doctor123');
  if (doctorMatch) return { success: true, user: { ...doctorMatch, role: 'doctor', email } };

  return { error: 'Invalid email or password. Please try again.' };
}

// =============================================
// DOCTORS & DEPARTMENTS
// =============================================

function getDoctors() {
  return JSON.parse(localStorage.getItem('hb_doctors') || '[]');
}
function getDoctorById(id) {
  return getDoctors().find(d => d.id === id);
}
function getDoctorsByDept(deptId) {
  return getDoctors().filter(d => d.department === deptId);
}
function getDepartments() {
  return JSON.parse(localStorage.getItem('hb_departments') || '[]');
}
function getDeptById(id) {
  return getDepartments().find(d => d.id === id);
}

// =============================================
// SLOTS
// =============================================

function getAllSlots() {
  return JSON.parse(localStorage.getItem('hb_slots') || '[]');
}
function getDoctorSlots(doctorId, dateStr) {
  return getAllSlots().filter(s => s.doctorId === doctorId && s.date === dateStr);
}
function getDoctorAvailableDates(doctorId) {
  const slots = getAllSlots().filter(s => s.doctorId === doctorId);
  const dates = [...new Set(slots.map(s => s.date))];
  return dates.sort();
}

// =============================================
// APPOINTMENTS
// =============================================

function getAppointments(filter = {}) {
  let apts = JSON.parse(localStorage.getItem('hb_appointments') || '[]');
  if (filter.patientId) apts = apts.filter(a => a.patientId === filter.patientId);
  if (filter.doctorId) apts = apts.filter(a => a.doctorId === filter.doctorId);
  return apts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function bookAppointment(data) {
  const slots = getAllSlots();
  const slotIdx = slots.findIndex(s => s.id === data.slotId);
  if (slotIdx === -1) return { error: 'Slot not found.' };
  if (slots[slotIdx].booked) return { error: 'This slot is already booked. Please choose another.' };

  slots[slotIdx].booked = true;
  slots[slotIdx].patientId = data.patientId;
  localStorage.setItem('hb_slots', JSON.stringify(slots));

  const appointments = JSON.parse(localStorage.getItem('hb_appointments') || '[]');
  const appointment = {
    id: 'apt_' + Date.now(),
    ...data,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };
  appointments.push(appointment);
  localStorage.setItem('hb_appointments', JSON.stringify(appointments));
  localStorage.setItem('hb_last_appointment', JSON.stringify(appointment));
  return { success: true, appointment };
}

// =============================================
// PRESCRIPTIONS
// =============================================

function getPrescriptions(patientId) {
  const all = JSON.parse(localStorage.getItem('hb_prescriptions') || '[]');
  return all.filter(p => p.patientId === patientId);
}

function seedDemoPrescriptions(patientId) {
  const existing = getPrescriptions(patientId);
  if (existing.length > 0) return;
  const rxs = [
    {
      id: 'rx_' + Date.now() + '_1',
      patientId,
      doctorId: 'd11',
      doctorName: 'Dr. Anjali Desai',
      department: 'General Medicine',
      date: '2026-03-15',
      type: 'past',
      diagnosis: 'Acute Pharyngitis',
      medications: [
        { name: 'Amoxicillin 500mg', dosage: '1 tablet', frequency: '3× daily', duration: '5 days', instructions: 'After food' },
        { name: 'Paracetamol 650mg', dosage: '1 tablet', frequency: 'As needed', duration: '3 days', instructions: 'For fever/pain' }
      ],
      notes: 'Rest well, stay hydrated. Avoid cold drinks. Follow up if symptoms persist beyond 7 days.'
    },
    {
      id: 'rx_' + Date.now() + '_2',
      patientId,
      doctorId: 'd1',
      doctorName: 'Dr. Priya Sharma',
      department: 'Cardiology',
      date: '2026-04-20',
      type: 'current',
      diagnosis: 'Hypertension Stage 1',
      medications: [
        { name: 'Amlodipine 5mg', dosage: '1 tablet', frequency: 'Once daily (morning)', duration: '30 days', instructions: 'Before breakfast' },
        { name: 'Aspirin 75mg', dosage: '1 tablet', frequency: 'Once daily', duration: '30 days', instructions: 'After food' }
      ],
      notes: 'Monitor BP twice daily. Restrict salt intake. Avoid caffeine. Next review in 4 weeks.'
    }
  ];
  const all = JSON.parse(localStorage.getItem('hb_prescriptions') || '[]');
  localStorage.setItem('hb_prescriptions', JSON.stringify([...all, ...rxs]));
}

// =============================================
// HF API KEY
// =============================================

function getHFKey() { return localStorage.getItem('hb_hf_key') || ''; }
function setHFKey(key) { localStorage.setItem('hb_hf_key', key); }

// =============================================
// UTILITIES
// =============================================

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}
function formatTime(timeStr) {
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
}
function getInitials(name) {
  return name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase();
}
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.cssText = `
    position:fixed;bottom:24px;right:24px;z-index:9999;
    background:${type === 'success' ? 'var(--primary-dark)' : type === 'error' ? 'var(--danger)' : '#1E293B'};
    color:#fff;padding:12px 20px;border-radius:12px;font-size:0.9rem;
    font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;
    box-shadow:0 8px 24px rgba(0,0,0,0.2);
    display:flex;align-items:center;gap:10px;
    animation:slideInToast 0.3s ease;max-width:320px;
  `;
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  toast.innerHTML = `<span>${icons[type] || '✅'}</span><span>${message}</span>`;
  document.body.appendChild(toast);

  if (!document.getElementById('toast-style')) {
    const s = document.createElement('style');
    s.id = 'toast-style';
    s.textContent = `@keyframes slideInToast{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`;
    document.head.appendChild(s);
  }
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 3000);
}

function updateNavAuth() {
  const user = getCurrentUser();
  const loginBtns = document.querySelectorAll('.nav-login-btn');
  const userMenus = document.querySelectorAll('.nav-user-menu');

  loginBtns.forEach(btn => btn.style.display = user ? 'none' : '');
  userMenus.forEach(menu => {
    if (user) {
      menu.style.display = 'flex';
      const nameEl = menu.querySelector('.nav-user-name');
      if (nameEl) nameEl.textContent = user.name?.split(' ')[0] || 'User';
    } else {
      menu.style.display = 'none';
    }
  });
}

// Run init on every page load
initializeData();
