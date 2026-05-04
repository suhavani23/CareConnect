import React from 'react';

const DoctorProfileHeader = ({ doctor, isSuggested }) => (
  <div className={`p-4 rounded-lg border-2 mb-6 ${isSuggested ? 'border-amber-400 bg-amber-50' : 'border-blue-100 bg-white'}`}>
    {isSuggested && (
      <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-200 px-2 py-1 rounded mb-2 inline-block">
        Recommended for your symptoms
      </span>
    )}
    <div className="flex gap-4 items-center">
      <div className="w-16 h-16 bg-slate-200 rounded-full flex-shrink-0 overflow-hidden">
        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=2d6aee&color=fff`} alt={doctor.name} />
      </div>
      <div>
        <h3 className="text-xl font-bold text-slate-900">{doctor.name}</h3>
        <p className="text-blue-600 font-medium">{doctor.specialization}</p>
        <p className="text-slate-500 text-sm">{doctor.experience} years of clinical experience</p>
      </div>
    </div>
  </div>
);

export default DoctorProfileHeader;
