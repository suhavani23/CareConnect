import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, MapPin, Search, CheckCircle } from 'lucide-react';
import { hospitalStaff } from '../../services/mockDatabase';
<<<<<<< HEAD
import BodyMap from './BodyMap';
=======
>>>>>>> 03fe6592c0a4c645a0d9d48c63f935a3d59bdd59

const PatientIntake = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [hasPreferredDoctor, setHasPreferredDoctor] = useState(false);
  const [formData, setFormData] = useState({
    symptoms: '',
<<<<<<< HEAD
    bodyRegions: new Set(),
    painDuration: 'Less than 1 hour',
=======
    affectedArea: 'Head/Neck',
>>>>>>> 03fe6592c0a4c645a0d9d48c63f935a3d59bdd59
    painLevel: 5,
    description: '',
    preferredDoctorID: 'none'
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

<<<<<<< HEAD
  const handleToggleRegion = (regionId) => {
    setFormData(prev => {
      const newRegions = new Set(prev.bodyRegions);
      if (newRegions.has(regionId)) {
        newRegions.delete(regionId);
      } else {
        newRegions.add(regionId);
      }
      return { ...prev, bodyRegions: newRegions };
    });
  };

  const handleSubmit = () => {
    onComplete({
      ...formData,
      bodyRegions: Array.from(formData.bodyRegions),
=======
  const handleSubmit = () => {
    onComplete({
      ...formData,
>>>>>>> 03fe6592c0a4c645a0d9d48c63f935a3d59bdd59
      // Convert symptoms string to an array of words for the mock AI
      symptomsArray: formData.symptoms.split(' ').map(s => s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()).filter(Boolean)
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-slate-100">
      <div className="mb-8">
        <div className="flex justify-between mb-2">
<<<<<<< HEAD
          {[1, 2, 3, 4, 5].map((s) => (
=======
          {[1, 2, 3, 4].map((s) => (
>>>>>>> 03fe6592c0a4c645a0d9d48c63f935a3d59bdd59
            <div key={s} className={`h-2 flex-1 mx-1 rounded-full ${step >= s ? 'bg-blue-600' : 'bg-slate-200'}`} />
          ))}
        </div>
        <h2 className="text-xl font-bold text-slate-800">
<<<<<<< HEAD
          {step === 5 ? "Final Step" : `Step ${step}: Patient Assessment`}
=======
          {step === 4 ? "Final Step" : `Step ${step}: Patient Assessment`}
>>>>>>> 03fe6592c0a4c645a0d9d48c63f935a3d59bdd59
        </h2>
      </div>

      {step === 1 && (
        <div className="space-y-6 animate-in fade-in duration-500">
<<<<<<< HEAD
          <BodyMap 
            selectedRegions={formData.bodyRegions} 
            onToggleRegion={handleToggleRegion} 
          />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in fade-in duration-500">
=======
>>>>>>> 03fe6592c0a4c645a0d9d48c63f935a3d59bdd59
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">What symptoms are you experiencing?</label>
            <input 
              type="text" 
              placeholder="e.g. Fever, Cough, Headache"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
              value={formData.symptoms}
            />
<<<<<<< HEAD
            <label className="block text-sm font-medium text-slate-700">How long have you had these symptoms?</label>
            <select 
              className="w-full p-3 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500" 
              onChange={(e) => setFormData({...formData, painDuration: e.target.value})}
              value={formData.painDuration}
            >
              <option>Less than 1 hour</option>
              <option>1-12 hours</option>
              <option>1-3 days</option>
              <option>More than 3 days</option>
=======
            <label className="block text-sm font-medium text-slate-700">Affected Area</label>
            <select 
              className="w-full p-3 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500" 
              onChange={(e) => setFormData({...formData, affectedArea: e.target.value})}
              value={formData.affectedArea}
            >
              <option>Head/Neck</option>
              <option>Chest/Abdomen</option>
              <option>Limbs</option>
              <option>General/Whole Body</option>
>>>>>>> 03fe6592c0a4c645a0d9d48c63f935a3d59bdd59
            </select>
          </div>
        </div>
      )}

<<<<<<< HEAD
      {step === 3 && (
=======
      {step === 2 && (
>>>>>>> 03fe6592c0a4c645a0d9d48c63f935a3d59bdd59
        <div className="space-y-4 animate-in fade-in duration-500">
          <label className="block text-sm font-medium text-slate-700">Rate your pain level: {formData.painLevel}</label>
          <input 
            type="range" min="1" max="10" 
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            value={formData.painLevel}
            onChange={(e) => setFormData({...formData, painLevel: parseInt(e.target.value)})}
          />
<<<<<<< HEAD
          <div className="flex justify-between text-xs text-slate-500 px-2 mb-4">
=======
          <div className="flex justify-between text-xs text-slate-500 px-2">
>>>>>>> 03fe6592c0a4c645a0d9d48c63f935a3d59bdd59
            <span>Mild</span>
            <span>Moderate</span>
            <span>Severe</span>
          </div>
<<<<<<< HEAD
          <label className="block text-sm font-medium text-slate-700">Additional Notes</label>
=======
>>>>>>> 03fe6592c0a4c645a0d9d48c63f935a3d59bdd59
          <textarea 
            placeholder="Describe your condition in detail..."
            className="w-full p-3 border rounded-lg h-32 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            value={formData.description}
          />
        </div>
      )}

<<<<<<< HEAD
      {step === 4 && (
=======
      {step === 3 && (
>>>>>>> 03fe6592c0a4c645a0d9d48c63f935a3d59bdd59
        <div className="space-y-4 animate-in fade-in duration-500">
           <h3 className="text-lg font-semibold text-slate-700 mb-2">Review your information</h3>
           <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-3">
             <div>
               <span className="text-sm text-slate-500 block">Symptoms</span>
               <span className="font-medium text-slate-800">{formData.symptoms || 'Not specified'}</span>
             </div>
             <div>
<<<<<<< HEAD
               <span className="text-sm text-slate-500 block">Affected Areas</span>
               <span className="font-medium text-slate-800">
                 {formData.bodyRegions.size > 0 ? Array.from(formData.bodyRegions).join(', ') : 'None selected'}
               </span>
             </div>
             <div>
               <span className="text-sm text-slate-500 block">Duration</span>
               <span className="font-medium text-slate-800">{formData.painDuration}</span>
=======
               <span className="text-sm text-slate-500 block">Affected Area</span>
               <span className="font-medium text-slate-800">{formData.affectedArea}</span>
>>>>>>> 03fe6592c0a4c645a0d9d48c63f935a3d59bdd59
             </div>
             <div>
               <span className="text-sm text-slate-500 block">Pain Level</span>
               <span className="font-medium text-slate-800">{formData.painLevel}/10</span>
             </div>
           </div>
        </div>
      )}

<<<<<<< HEAD
      {step === 5 && (
=======
      {step === 4 && (
>>>>>>> 03fe6592c0a4c645a0d9d48c63f935a3d59bdd59
         <div className="space-y-6 animate-in fade-in duration-500">
           <div className="text-center mb-6">
             <CheckCircle size={48} className="text-emerald-500 mx-auto mb-4" />
             <h3 className="text-2xl font-bold text-slate-800">Thank You</h3>
             <p className="text-slate-500 mt-2">Before we analyze your symptoms, let us know your preference.</p>
           </div>
           
           <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-4">
             <label className="block text-sm font-bold text-slate-800">Do you have a doctor in mind?</label>
             <div className="flex flex-col gap-3 mt-3">
                <label className="flex items-center space-x-3 cursor-pointer bg-white p-3 border rounded-lg hover:border-blue-300 transition">
                   <input type="radio" name="pref" checked={!hasPreferredDoctor} onChange={() => { setHasPreferredDoctor(false); setFormData({...formData, preferredDoctorID: 'none'}); }} className="accent-blue-600 w-5 h-5" />
                   <span className="text-slate-700 font-medium">No, find me the best match</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer bg-white p-3 border rounded-lg hover:border-blue-300 transition">
                   <input type="radio" name="pref" checked={hasPreferredDoctor} onChange={() => setHasPreferredDoctor(true)} className="accent-blue-600 w-5 h-5" />
                   <span className="text-slate-700 font-medium">Yes, I have a preferred doctor</span>
                </label>
             </div>

             {hasPreferredDoctor && (
                <div className="animate-in fade-in duration-300 relative mt-4">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={16} className="text-slate-400" />
                   </div>
                   <select 
                      className="w-full p-3 pl-10 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500" 
                      onChange={(e) => setFormData({...formData, preferredDoctorID: e.target.value})}
                      value={formData.preferredDoctorID}
                    >
                      <option value="none">Select a doctor...</option>
                      {hospitalStaff.filter(doc => doc.id !== 'dr-emergency').map(doc => (
                        <option key={doc.id} value={doc.id}>{doc.name} - {doc.specialization}</option>
                      ))}
                    </select>
                </div>
             )}
           </div>
         </div>
      )}

      <div className="mt-8 flex justify-between">
        {step > 1 ? (
          <button onClick={prevStep} className="flex items-center px-6 py-2 text-slate-600 font-medium border rounded-lg hover:bg-slate-50 transition">
            <ChevronLeft size={18} className="mr-1" /> Back
          </button>
        ) : <div></div>}
        <button 
<<<<<<< HEAD
          onClick={step === 5 ? handleSubmit : nextStep}
          className="ml-auto flex items-center px-8 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md transition"
        >
          {step === 5 ? "Analyze Symptoms" : "Continue"} <ChevronRight size={18} className="ml-1" />
=======
          onClick={step === 4 ? handleSubmit : nextStep}
          className="ml-auto flex items-center px-8 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md transition"
        >
          {step === 4 ? "Analyze Symptoms" : "Continue"} <ChevronRight size={18} className="ml-1" />
>>>>>>> 03fe6592c0a4c645a0d9d48c63f935a3d59bdd59
        </button>
      </div>
    </div>
  );
};

export default PatientIntake;
