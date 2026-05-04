# 🏥 MedCare — Hospital Appointment Booking System

A fully client-side, AI-powered hospital booking website built with vanilla HTML, CSS, and JavaScript. No backend or paid services required.

---

## 📁 File Structure

```
hospital-booking/
├── index.html           ← Homepage (departments, staff, facilities)
├── login.html           ← Login & Patient Registration (3-step wizard)
├── dashboard.html       ← Patient Dashboard + Booking Wizard
├── doctor-dashboard.html← Doctor's view (appointments, patient details, triage)
├── medications.html     ← Patient prescription history
├── css/
│   └── styles.css       ← All styles (light green & white theme)
└── js/
    ├── app.js           ← Data layer, auth, localStorage, utilities
    └── ai.js            ← Hugging Face AI integration (urgency, dept routing)
```

---

## 🚀 Getting Started

### Option 1 — Open directly in browser
Just open `index.html` in any modern browser. No server needed.

### Option 2 — Use a local server (recommended for best experience)
```bash
# Python 3
python -m http.server 3000

# Node.js (npx)
npx serve .
```
Then visit `http://localhost:3000`

---

## 🤖 AI Setup (Hugging Face — Free)

The AI features (urgency scoring & department routing) use the **Mistral-7B** model via Hugging Face's free Inference API.

### Steps to get your free API key:
1. Go to [huggingface.co](https://huggingface.co) and create a free account
2. Visit **Settings → Access Tokens**
3. Create a new token with **Read** permissions
4. Copy the token (starts with `hf_...`)

### Enter your key in the app:
1. Log in as a patient
2. On the dashboard, click the **"Set up AI"** banner or go to **AI Settings**
3. Paste your `hf_` token and click **Save**

> **Note:** If no API key is provided, the app falls back to keyword-based urgency scoring and department routing automatically. The booking flow still works completely.

---

## 👤 Test Accounts

### Patient — Register a new account
- Go to `login.html` → Click **New Patient**
- Complete the 3-step registration wizard
- Use any email/password you like

### Doctors — Pre-seeded accounts
All 16 doctors are pre-loaded. Use any of:

| Email | Password | Doctor |
|-------|----------|--------|
| `d1@hospital.com`  | `doctor123` | Dr. Sarah Chen (Cardiology) |
| `d2@hospital.com`  | `doctor123` | Dr. James Wilson (Cardiology) |
| `d3@hospital.com`  | `doctor123` | Dr. Priya Sharma (Orthopedics) |
| `d4@hospital.com`  | `doctor123` | Dr. Michael Torres (Orthopedics) |
| `d5@hospital.com`  | `doctor123` | Dr. Amelia Foster (Neurology) |
| `d6@hospital.com`  | `doctor123` | Dr. Raj Patel (Neurology) |
| `d7@hospital.com`  | `doctor123` | Dr. Lisa Kim (Dermatology) |
| `d8@hospital.com`  | `doctor123` | Dr. David Osei (Dermatology) |
| `d9@hospital.com`  | `doctor123` | Dr. Meera Nair (Pediatrics) |
| `d10@hospital.com` | `doctor123` | Dr. Tom Bradley (Pediatrics) |
| `d11@hospital.com` | `doctor123` | Dr. Anna Schmidt (General) |
| `d12@hospital.com` | `doctor123` | Dr. Kevin Okafor (General) |
| `d13@hospital.com` | `doctor123` | Dr. Sofia Mendez (Dental) |
| `d14@hospital.com` | `doctor123` | Dr. Arjun Verma (Dental) |
| `d15@hospital.com` | `doctor123` | Dr. Nina Johansson (Ophthalmology) |
| `d16@hospital.com` | `doctor123` | Dr. Omar Khalil (Ophthalmology) |

---

## 🔄 Full Booking Flow

```
Patient logs in
      ↓
Dashboard → "Book Appointment"
      ↓
Step 1: Symptom Questionnaire
  - Select symptoms (checkboxes)
  - Affected body area
  - Pain location & rating (0–10)
  - Additional description
      ↓
Step 2: AI Analysis (hidden from patient)
  - Urgency score (1–10) calculated
  - Urgency level: Low / Medium / High / Critical
  - Department assigned by AI
      ↓
Step 3: Doctor Preference
  - Option A: "Yes, I have a doctor in mind" → pick from full list
  - Option B: "Suggest one for me" → AI assigns best doctor by dept + availability
      ↓
Step 4: Slot Selection
  - 7-day calendar view
  - 🟢 Green = available (clickable)
  - 🔴 Red = already booked (blocked)
      ↓
Step 5: Booking Confirmed
  - Date, time, doctor details shown
  - Slot marked booked in all data stores
      ↓
Doctor's Dashboard updates in real-time
  - New appointment appears in list
  - Patient details & symptoms report visible
  - Urgency score shown to doctor (not patient)
  - Their slot grid blocks the booked time
```

---

## 💾 Data Storage

All data is stored in `localStorage` (no server, no database):

| Key | Contents |
|-----|----------|
| `hb_v2_initialized` | Seed flag |
| `hb_doctors` | 16 doctor profiles |
| `hb_departments` | 8 departments |
| `hb_patients` | Registered patients |
| `hb_appointments` | All bookings |
| `hb_slots` | All time slots (14 days per doctor) |
| `hb_prescriptions` | Prescription records |
| `hb_current_user` | Active session |
| `hb_hf_key` | Your Hugging Face API key |

To **reset all data**, run in browser console:
```javascript
Object.keys(localStorage).filter(k => k.startsWith('hb_')).forEach(k => localStorage.removeItem(k));
location.reload();
```

---

## 🏥 Departments

| # | Department | Specialties |
|---|------------|-------------|
| 1 | Cardiology | Heart, Blood Pressure, ECG |
| 2 | Orthopedics | Bones, Joints, Sports Injuries |
| 3 | Neurology | Brain, Spine, Migraines |
| 4 | Dermatology | Skin, Hair, Nails |
| 5 | Pediatrics | Children (0–18 years) |
| 6 | General Medicine | Primary Care, Fever, Common Illnesses |
| 7 | Dental | Teeth, Gums, Oral Care |
| 8 | Ophthalmology | Eyes, Vision, Glasses |

---

## 🤖 AI Features

### 1. Urgency Scoring (hidden from patients)
- Score: 1–10
- Levels: Low (1-3) · Medium (4-6) · High (7-8) · Critical (9-10)
- Drives appointment priority in doctor's view
- Falls back to keyword matching if no API key

### 2. Department Routing
- AI reads symptoms and assigns the most appropriate department
- Falls back to symptom keyword mapping

### 3. Doctor Assignment
- Picks the best available doctor in the assigned department
- Sorted by rating, then experience

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JS (ES6+) |
| Fonts | Plus Jakarta Sans + Fraunces (Google Fonts) |
| AI | Hugging Face Inference API (Mistral-7B-Instruct) |
| Storage | Browser localStorage |
| Backend | None — fully client-side |
| Cost | **$0** |

---

## 🛠 Customisation

### Change hospital name/logo
Edit the `nav-logo` elements in each `.html` file.

### Add more doctors
Edit the `DOCTORS_SEED` array in `js/app.js`.

### Change colour theme
Edit CSS variables at the top of `css/styles.css`:
```css
:root {
  --primary: #16A34A;
  --primary-light: #DCFCE7;
  --bg: #F0FDF4;
  /* ... */
}
```

### Change AI model
Edit `AI_MODEL` constant in `js/ai.js` (any free HF Inference model).

---

## 📞 Support

Emergency: **1800-123-4567**  
Email: **care@medcare.hospital**

---

*Built with ❤️ for MedCare Hospital*
