import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, PhoneCall, ArrowRight } from 'lucide-react';

const EmergencyAlert = ({ onContinueToBooking }) => {
  return (
    <div className="fixed inset-0 z-50 bg-red-600 flex flex-col items-center justify-center p-6 text-white text-center overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="max-w-md w-full"
      >
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="mx-auto w-24 h-24 bg-red-500 rounded-full flex items-center justify-center shadow-xl mb-8 border-4 border-red-400"
        >
          <AlertTriangle size={48} className="text-white" />
        </motion.div>

        <h1 className="text-4xl font-extrabold mb-4 tracking-tight">SEEK IMMEDIATE MEDICAL ATTENTION</h1>
        
        <p className="text-lg text-red-100 mb-8 font-medium">
          Based on your symptoms, our system has detected a potential medical emergency. Please do not wait for an appointment.
        </p>

        <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/20 mb-8">
          <h2 className="text-xl font-bold mb-4">Emergency Contacts</h2>
          <div className="space-y-4">
            <a href="tel:911" className="flex items-center justify-center bg-white text-red-600 font-bold py-4 px-6 rounded-xl text-2xl shadow-lg hover:bg-red-50 transition transform hover:scale-105">
              <PhoneCall className="mr-3" size={28} /> Call 911
            </a>
            <a href="tel:1234567890" className="flex items-center justify-center bg-transparent border-2 border-white text-white font-bold py-3 px-6 rounded-xl text-lg hover:bg-white/10 transition">
              Call Hospital Emergency Desk
            </a>
          </div>
        </div>

        <button 
          onClick={onContinueToBooking}
          className="flex items-center justify-center w-full py-3 text-red-200 hover:text-white transition font-medium"
        >
          I understand, continue to booking anyway <ArrowRight size={18} className="ml-2" />
        </button>
      </motion.div>
    </div>
  );
};

export default EmergencyAlert;
