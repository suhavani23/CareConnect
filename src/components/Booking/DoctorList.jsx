import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { hospitalStaff } from '../../services/mockDatabase';

const DoctorList = ({ requiredSpecialization, onSelectDoctor, onGoBack }) => {
  // Filter doctors by specialization (or just show all if none specified)
  const doctors = requiredSpecialization 
    ? hospitalStaff.filter(d => d.specialization === requiredSpecialization && d.id !== 'dr-emergency')
    : hospitalStaff.filter(d => d.id !== 'dr-emergency');

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-slate-100">
      <div className="flex items-center mb-6 border-b pb-4">
        <button onClick={onGoBack} className="p-2 mr-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Available Doctors</h2>
          {requiredSpecialization && (
             <p className="text-sm text-slate-500">Filtered for: {requiredSpecialization}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {doctors.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No doctors found for this specialization.</p>
        ) : (
          doctors.map((doctor) => (
            <div key={doctor.id} className="p-4 border border-slate-200 rounded-xl hover:border-blue-300 transition flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex-shrink-0 overflow-hidden">
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=2d6aee&color=fff`} alt={doctor.name} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{doctor.name}</h3>
                  <p className="text-sm text-blue-600">{doctor.specialization}</p>
                  <p className="text-xs text-slate-500">{doctor.experience} years exp • {doctor.availableSlots.length} slots today</p>
                </div>
              </div>
              <button 
                onClick={() => onSelectDoctor(doctor)}
                className="px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition"
              >
                Select
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorList;
