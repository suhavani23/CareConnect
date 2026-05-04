import React, { useState } from 'react';
import { ChevronLeft, User, Star, Clock, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { hospitalStaff } from '../../services/mockDatabase';

const DoctorList = ({ requiredSpecialization, onSelectDoctor, onGoBack }) => {
  const [filterSpec, setFilterSpec] = useState(requiredSpecialization || 'All');
  
  const specializations = ['All', 'General Physician', 'Neurologist', 'Cardiologist', 'Emergency Medicine'];

  const filteredDoctors = filterSpec === 'All' 
    ? hospitalStaff 
    : hospitalStaff.filter(d => d.specialization === filterSpec);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto p-10 bg-white rounded-[2.5rem] shadow-2xl border border-slate-50 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-2 bg-slate-900" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div className="flex items-center gap-4">
          <button onClick={onGoBack} className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Medical Staff</h2>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-0.5">
              Browse available doctors and specialists
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Filter size={16} className="text-slate-400" />
          <select 
            value={filterSpec}
            onChange={(e) => setFilterSpec(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-blue-100"
          >
            {specializations.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
             <User size={40} className="mx-auto text-slate-200 mb-3" />
             <p className="text-slate-500 font-bold">No doctors found matching this filter.</p>
          </div>
        ) : (
          filteredDoctors.map((doctor, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={doctor.id} 
              className="p-6 bg-white border border-slate-100 rounded-3xl hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-50 transition-all group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex-shrink-0 overflow-hidden border border-blue-100">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=2d6aee&color=fff&bold=true`} alt={doctor.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">{doctor.name}</h3>
                    {requiredSpecialization === doctor.specialization && (
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded uppercase">AI Match</span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{doctor.specialization}</p>
                  <div className="flex gap-4 text-[10px] font-black text-slate-500 uppercase">
                    <span className="flex items-center gap-1"><Star size={12} className="text-amber-400 fill-amber-400" /> {doctor.experience}yr Exp</span>
                    <span className="flex items-center gap-1"><Clock size={12} className="text-blue-400" /> {doctor.availableSlots.length} Slots Today</span>
                  </div>
                </div>
              </div>
              
              <div className="w-full sm:w-auto flex flex-col items-end gap-3">
                 <div className="flex flex-wrap gap-1 justify-end max-w-[120px]">
                    {doctor.availableSlots.slice(0, 3).map(slot => (
                      <span key={slot} className="px-2 py-1 bg-slate-50 text-[9px] font-black text-slate-400 rounded-lg">{slot}</span>
                    ))}
                    {doctor.availableSlots.length > 3 && <span className="px-2 py-1 bg-slate-50 text-[9px] font-black text-slate-300 rounded-lg">...</span>}
                 </div>
                 <button 
                  onClick={() => onSelectDoctor(doctor)}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-900 text-white font-black rounded-xl text-xs uppercase tracking-widest hover:bg-blue-600 transition-all transform group-hover:scale-105 active:scale-95 shadow-lg shadow-slate-100"
                >
                  Book Session
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default DoctorList;
