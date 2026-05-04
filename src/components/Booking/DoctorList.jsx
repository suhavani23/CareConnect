import React from 'react';
import { ChevronLeft, User, Star, Clock, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { hospitalStaff } from '../../services/mockDatabase';

const DoctorList = ({ requiredSpecialization, onSelectDoctor, onGoBack }) => {
  const doctors = requiredSpecialization 
    ? hospitalStaff.filter(d => d.specialization === requiredSpecialization && d.id !== 'dr-emergency')
    : hospitalStaff.filter(d => d.id !== 'dr-emergency');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-10 bg-white rounded-[2.5rem] shadow-2xl border border-slate-50 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-2 bg-slate-900" />
      
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <button onClick={onGoBack} className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Staff Directory</h2>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-0.5">
              {requiredSpecialization ? `Recommended Specialist: ${requiredSpecialization}` : 'Hospital Medical Faculty'}
            </p>
          </div>
        </div>
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
           <Search size={20} />
        </div>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {doctors.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
             <User size={40} className="mx-auto text-slate-200 mb-3" />
             <p className="text-slate-500 font-bold">No matching specialists currently available.</p>
          </div>
        ) : (
          doctors.map((doctor, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={doctor.id} 
              className="p-6 bg-white border border-slate-100 rounded-3xl hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex-shrink-0 overflow-hidden border border-blue-100">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=2d6aee&color=fff&bold=true`} alt={doctor.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">{doctor.name}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{doctor.specialization}</p>
                  <div className="flex gap-4 text-[10px] font-black text-slate-500 uppercase">
                    <span className="flex items-center gap-1"><Star size={12} className="text-amber-400 fill-amber-400" /> {doctor.experience}yr Exp</span>
                    <span className="flex items-center gap-1"><Clock size={12} className="text-blue-400" /> {doctor.availableSlots.length} Slots</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => onSelectDoctor(doctor)}
                className="px-6 py-3 bg-slate-900 text-white font-black rounded-xl text-xs uppercase tracking-widest hover:bg-blue-600 transition-all transform group-hover:scale-105 active:scale-95 shadow-lg shadow-slate-100"
              >
                Select
              </button>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default DoctorList;
