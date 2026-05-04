import React from 'react';
import { Sparkles, Award, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const RecommendationView = ({ suggestedDoc, onAccept, onDecline, onGoBack }) => {
  const nextSlot = suggestedDoc.availableSlots.find(s => s !== 'IMMEDIATE') || 'Immediate Attention';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg mx-auto bg-white rounded-[2.5rem] p-10 shadow-2xl border border-blue-50 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
      
      <div className="text-center mb-8">
        <div className="bg-blue-50 text-blue-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-50 rotate-3">
          <Sparkles size={40} />
        </div>
        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Matchmaker Optimized</p>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Best Clinical Match</h2>
        <p className="text-slate-500 mt-2 text-sm font-medium">
          Our AI has identified the optimal specialist for your reported pathology.
        </p>
      </div>

      <div className="bg-slate-50 rounded-[2rem] p-8 mb-10 border border-slate-100 relative group overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
           <Award size={80} />
        </div>
        
        <h3 className="text-2xl font-black text-slate-900 leading-tight">{suggestedDoc.name}</h3>
        <p className="text-blue-600 font-bold uppercase tracking-widest text-xs mt-1">{suggestedDoc.specialization}</p>
        
        <div className="flex flex-col gap-3 mt-6">
          <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
            <Award size={18} className="text-indigo-500" />
            <span className="text-sm font-bold text-slate-700">{suggestedDoc.experience} Years Professional Experience</span>
          </div>
          <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
            <Clock size={18} className="text-emerald-500" />
            <span className="text-sm font-bold text-slate-700">Available: {nextSlot}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <button 
          onClick={onAccept}
          className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black shadow-xl shadow-slate-200 hover:bg-black transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
        >
          Confirm Recommendation <ChevronRight size={20} />
        </button>
        
        <button 
          onClick={onDecline}
          className="w-full bg-white text-slate-400 py-3 rounded-xl font-bold text-xs uppercase tracking-widest border border-transparent hover:text-slate-600 transition-colors"
        >
          Browse Staff Manually
        </button>

        <button 
          onClick={onGoBack}
          className="w-full text-slate-300 text-[10px] font-black uppercase tracking-widest hover:text-blue-600 transition-colors"
        >
          Edit Symptom Map
        </button>
      </div>
    </motion.div>
  );
};

export default RecommendationView;
