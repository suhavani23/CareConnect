import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PatientIntake from '../components/IntakeForm/PatientIntake';
import SlotBooking from '../components/Booking/SlotBooking';
import RecommendationView from '../components/Booking/RecommendationView';
import DoctorList from '../components/Booking/DoctorList';
import EmergencyAlert from '../components/IntakeForm/EmergencyAlert';
import { simulateCareConnectMatchmaker } from '../services/aiService';
import { assessUrgency } from '../services/UrgencyService';

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 800 : -800,
    opacity: 0,
    position: 'absolute',
    width: '100%',
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    position: 'relative',
    width: '100%',
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 800 : -800,
    opacity: 0,
    position: 'absolute',
    width: '100%',
  })
};

const PortalFlow = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [view, setView] = useState('intake'); 
  const [direction, setDirection] = useState(1);
  const [matchResult, setMatchResult] = useState(null);
  const [urgencyScore, setUrgencyScore] = useState(0);

  const navigateTo = (newView, dir) => {
    setDirection(dir);
    setView(newView);
  };

  const handleIntakeComplete = async (formData) => {
    navigateTo('loading', 1);
    
    const urgency = await assessUrgency(formData);
    setUrgencyScore(urgency.score);

    if (urgency.score >= 8) {
      navigateTo('emergency', 1);
      
      const result = simulateCareConnectMatchmaker({
        patientSymptoms: formData.symptomsArray,
        bodyRegions: formData.bodyRegions,
        urgencyScore: urgency.score,
        preferredDoctorID: formData.preferredDoctorID
      });
      
      const matchData = {
        ...result,
        symptoms: formData.symptomsArray,
        urgencyScore: urgency.score
      };
      setMatchResult(matchData);
    } else {
      setTimeout(() => {
        const result = simulateCareConnectMatchmaker({
          patientSymptoms: formData.symptomsArray,
          bodyRegions: formData.bodyRegions,
          urgencyScore: urgency.score,
          preferredDoctorID: formData.preferredDoctorID
        });
        
        const matchData = {
          ...result,
          symptoms: formData.symptomsArray,
          urgencyScore: urgency.score
        };
        
        setMatchResult(matchData);
        
        if (result.matchType === 'preferred') {
          navigateTo('booking', 1);
        } else {
          navigateTo('recommendation', 1);
        }
      }, 2000);
    }
  };

  const handleGoBack = () => {
    if (view === 'booking') {
      if (matchResult.isManualSelection) {
        navigateTo('doctor_list', -1);
      } else if (matchResult.matchType === 'preferred') {
        navigateTo('intake', -1);
      } else {
        navigateTo('recommendation', -1);
      }
    } else if (view === 'doctor_list') {
      navigateTo('recommendation', -1);
    } else if (view === 'recommendation') {
      navigateTo('intake', -1);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 md:p-12 overflow-x-hidden relative">
      <header className="max-w-2xl mx-auto mb-10 flex items-center justify-between relative z-10">
         <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
               <span className="text-white font-bold text-xl leading-none">+</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">CareConnect Portal</h1>
         </div>
         <button onClick={handleLogout} className="text-slate-500 hover:text-slate-800 text-sm font-medium transition">
           Sign Out
         </button>
      </header>

      <div className="relative max-w-4xl mx-auto">
        <AnimatePresence custom={direction} mode="popLayout">
          {view === 'intake' && (
            <motion.div
              key="intake"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            >
              <PatientIntake onComplete={handleIntakeComplete} />
            </motion.div>
          )}
          
          {view === 'loading' && (
            <motion.div
              key="loading"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            >
              <div className="max-w-2xl mx-auto p-12 bg-white rounded-xl shadow-lg border border-slate-100 flex flex-col items-center justify-center space-y-6">
                <div className="relative flex items-center justify-center w-24 h-24">
                  <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                  <div className="relative bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                     <span className="text-white font-bold">+</span>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold text-slate-800 animate-pulse">Analyzing profile & availability...</h3>
                  <p className="text-slate-500 text-sm">Our AI Matchmaker is finding the best doctor for your symptoms.</p>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'emergency' && (
            <motion.div
              key="emergency"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            >
              <EmergencyAlert onContinueToBooking={() => {
                if (matchResult && matchResult.matchType === 'preferred') {
                  navigateTo('booking', 1);
                } else {
                  navigateTo('recommendation', 1);
                }
              }} />
            </motion.div>
          )}

          {view === 'recommendation' && matchResult && (
            <motion.div
              key="recommendation"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            >
              <RecommendationView 
                suggestedDoc={matchResult.doctorProfile}
                onAccept={() => navigateTo('booking', 1)}
                onDecline={() => navigateTo('doctor_list', 1)}
                onGoBack={handleGoBack}
              />
            </motion.div>
          )}

          {view === 'doctor_list' && matchResult && (
             <motion.div
              key="doctor_list"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            >
              <DoctorList 
                requiredSpecialization={matchResult.requiredSpecialization}
                onGoBack={handleGoBack}
                onSelectDoctor={(doctor) => {
                  setMatchResult({
                    ...matchResult,
                    doctorProfile: doctor,
                    matchType: 'preferred', // User manually picked them
                    isManualSelection: true
                  });
                  navigateTo('booking', 1);
                }}
              />
            </motion.div>
          )}

          {view === 'booking' && matchResult && (
            <motion.div
              key="booking"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            >
              <div className="space-y-6">
                 <div className="max-w-2xl mx-auto text-center flex items-center justify-between">
                   <button onClick={handleGoBack} className="text-slate-400 hover:text-slate-600 transition">
                     ← Back
                   </button>
                   <div>
                     <h2 className="text-2xl font-bold text-slate-800 mb-1">Doctor Match Found</h2>
                     <p className="text-slate-600 text-sm">Please select an available time slot below.</p>
                   </div>
                   <div className="w-12"></div> {/* Spacer for centering */}
                 </div>
                 <SlotBooking 
                   doctor={matchResult.doctorProfile} 
                   matchType={matchResult.matchType}
                   reasoning={matchResult.reasoning}
                   urgencyScore={urgencyScore}
                   symptoms={matchResult.symptoms}
                 />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default PortalFlow;
