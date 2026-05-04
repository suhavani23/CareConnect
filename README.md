# CareConnect 🏥

CareConnect is a modern, AI-driven medical booking portal designed to streamline patient intake and intelligently route patients to appropriate specialists based on symptoms and urgency. Built with a focus on trust, aesthetic design, and an intuitive user experience, CareConnect seamlessly bridges the gap between patients and healthcare professionals.

## 🚀 Features

### 🔐 Secure Patient Portal
- **Authentication:** Dedicated Login and Registration flows mimicking a secure hospital portal.
- **Patient Dashboard:** Personalized post-login dashboard showcasing recent activity and quick actions for "Book Session" and "Medications".
- **State Protection:** Fully protected routing architecture ensuring unauthorized users cannot access the medical shell.

### 🤖 Smart AI Matchmaker & Triage
- **Interactive Intake Shell:** A multi-step symptom assessment form featuring sliding pain scales and specific anatomical targeting.
- **Silent Priority System:** AI dynamically calculates a hidden "Urgency Score" (1-10) based on symptom severity. High scores ($\ge 7$) trigger an immediate Emergency Override without causing patient panic by showing raw numbers.
- **Specialist Routing:** Analyzes symptoms and intelligently matches patients to relevant departments (e.g., Cardiology, Neurology) and specific specialists based on availability and years of experience.

### 📅 Advanced Booking Dashboard
- **Real-Time Slot Management:** Intuitive booking interface with "Available" (Green) and "Booked" (Red) slot states.
- **Immediate Attention Override:** Emergency patients are provided a unique "REQUEST IMMEDIATE ATTENTION" booking slot.
- **Patient Agency:** Users can accept the AI's recommendation or explicitly choose their preferred doctor.

### 🩺 Dedicated Doctor View
- **Mock Real-Time Sync:** Leveraging `localStorage` to simulate real-time database synchronization. When a patient books a slot, it instantly appears on the doctor's dashboard.
- **Clinical Briefs:** Doctors receive pre-checkup reports containing the patient's age, gender, raw symptoms, and the AI's calculated Urgency Report.

## 💻 Tech Stack

- **Frontend Framework:** [React](https://reactjs.org/)
- **Routing:** [React Router v6](https://reactrouter.com/) (Client-side routing with `ProtectedRoute` implementation)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (Utility-first styling tailored with a professional "Trust Blue" `#2d6aee` aesthetic)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) (Smooth "booking corridor" slide transitions)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)

## 🛠️ Running Locally

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the portal at `http://localhost:5173/`

---
*Designed to emulate professional medical portals like Practo, built with state-of-the-art frontend technologies.*
