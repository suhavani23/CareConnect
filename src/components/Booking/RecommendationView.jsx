import React from 'react';
import { Sparkles, Award, Clock } from 'lucide-react';

const RecommendationView = ({ suggestedDoc, onAccept, onDecline, onGoBack }) => {
  // Find the first available slot, ignoring 'IMMEDIATE' for the "Next slot" display if we want to show a time
  const nextSlot = suggestedDoc.availableSlots.find(s => s !== 'IMMEDIATE') || 'As soon as possible';

  return (
    <div className="max-w-lg mx-auto bg-white border-2 border-blue-500 rounded-2xl p-8 shadow-xl">
      <div className="text-center mb-6">
        <div className="bg-blue-100 text-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">AI Recommendation</h2>
        <p className="text-slate-500 mt-2">
          Based on your symptoms and urgency level, we suggest:
        </p>
      </div>

      <div className="bg-slate-50 rounded-xl p-5 mb-8 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900">{suggestedDoc.name}</h3>
        <p className="text-blue-600 font-semibold">{suggestedDoc.specialization}</p>
        <div className="flex gap-4 mt-3 text-sm text-slate-600">
          <span className="flex items-center"><Award size={16} className="mr-1"/> {suggestedDoc.experience} yrs exp</span>
          <span className="flex items-center"><Clock size={16} className="mr-1"/> Next slot: {nextSlot}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <button 
          onClick={onAccept}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          Book with {suggestedDoc.name}
        </button>
        <button 
          onClick={onDecline}
          className="w-full bg-white text-slate-600 py-3 rounded-xl font-medium border border-slate-200 hover:bg-slate-50"
        >
          No, I want to choose someone else
        </button>
        <button 
          onClick={onGoBack}
          className="text-slate-400 text-sm hover:underline mt-2 text-center"
        >
          Go back to edit symptoms
        </button>
      </div>
    </div>
  );
};

export default RecommendationView;
