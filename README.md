# CareConnect 🏥

CareConnect is a high-fidelity, AI-driven medical clinical management system designed to bridge the gap between patient intake and professional clinical treatment. It intelligently routes patients through a triage engine and provides doctors with a live "Clinical Pipeline" to manage sessions, prescriptions, and session lifecycles.

## 🚀 Key Features

### 🩺 Full Clinical Lifecycle Management
- **Intelligent Doctor Portal:** Profile-based authentication for medical staff using a secure passkey system.
- **Session Pipeline:** Live tracking of patient states: **WAITING → IN_PROGRESS → COMPLETED**.
- **Clinical Prescriptions:** Doctors can generate structured digital prescriptions (Diagnosis, Medications, Advice) that sync instantly with the patient's dashboard.
- **Hybrid Sync Engine:** Advanced data architecture combining **Supabase** for persistence with a **LocalStorage Fallback Layer** for schema resilience and offline-mode simulation.

### 🤖 Smart AI Triage & Severity ($S$) Score
- **Multi-Step Intake:** Precise anatomical targeting and symptom mapping using a professional medical UI.
- **Clinical Severity ($S$):** AI calculates a hidden severity score from 1-100.
  - **$S \ge 70$**: Marked as **Urgent** in the clinical pipeline.
  - **$S \ge 80$**: Triggers **Emergency Forced Override**, redirecting patients to immediate care.
- **Silent Priority:** Ensures high-risk patients are prioritized in the doctor's queue without causing patient anxiety through raw numbers.

### 📅 Advanced Open Booking
- **Multi-Day Scheduling:** Choose between Today, Tomorrow, and the Day After with uniquely keyed slot availability.
- **Staff Directory:** Browse the entire hospital board with specialization filters and AI-match badges for recommended doctors.
- **Optimistic UI:** Instant visual feedback for session starts and bookings, ensuring a snappy, premium application feel.

### 🏢 Expanded Medical Board
- **7+ Specialized Departments:** Including Cardiology, Neurology, Orthopedics, Pediatrics, Dermatology, and General Medicine.
- **Facility Grid:** Highlights 24/7 Emergency Care, AI Triage, Telehealth Support, and Advanced Diagnostics.

## 💻 Tech Stack

- **Frontend:** React + Vite
- **Database:** Supabase (PostgreSQL)
- **State Management:** React Context API (Auth & Clinical Profile)
- **Styling:** Tailwind CSS + Vanilla CSS (Premium "Trust Blue" Aesthetic)
- **Animations:** Framer Motion (Optimistic transitions and smooth "Booking Corridor" flow)
- **Icons:** Lucide React

## 🛠️ Database Setup

To enable the full clinical upgrade, run the following SQL in your Supabase Editor:

```sql
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'WAITING',
ADD COLUMN IF NOT EXISTS severity_score INT8,
ADD COLUMN IF NOT EXISTS ai_triage_summary TEXT,
ADD COLUMN IF NOT EXISTS priority_level TEXT DEFAULT 'Routine',
ADD COLUMN IF NOT EXISTS affected_area TEXT;

ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
```

---
*Developed as a state-of-the-art clinical management demonstration, emulating professional platforms like Practo and Apollo Health.*
