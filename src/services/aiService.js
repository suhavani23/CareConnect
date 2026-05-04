import { hospitalStaff } from './mockDatabase';

export const simulateCareConnectMatchmaker = ({ patientSymptoms, bodyRegions = [], urgencyScore, preferredDoctorID }) => {
  // Task Logic 1: Check Preference
  if (preferredDoctorID && preferredDoctorID !== "none") {
    const preferredDoctor = hospitalStaff.find(doc => doc.id === preferredDoctorID);
    if (preferredDoctor && preferredDoctor.availableSlots.length > 0) {
      return {
        matchType: "preferred",
        reasoning: "Your preferred doctor is available.",
        doctorProfile: preferredDoctor,
        requiredSpecialization: preferredDoctor.specialization
      };
    }
  }

  // Task Logic 2: Handle Unavailability/No Preference
  
  // High Urgency Override
  if (urgencyScore >= 7) {
    // Attempt to find a senior doctor (10+ yrs exp) with slots, or default to Emergency Generalist
    const emergencyDoc = hospitalStaff.find(doc => doc.id === "dr-emergency");
    return {
      matchType: "emergency",
      reasoning: `Based on your symptoms, we have prioritized your booking with an available emergency physician or senior specialist.`,
      doctorProfile: emergencyDoc,
      requiredSpecialization: emergencyDoc.specialization
    };
  }

  // Analyze symptoms to determine specialization (Simulated)
  let requiredSpecialization = "General Physician";
  const symptomsStr = patientSymptoms.join(" ").toLowerCase();
  
  const regionsObj = new Set(bodyRegions);
  
  if (symptomsStr.includes("headache") || symptomsStr.includes("migraine") || symptomsStr.includes("dizzy") || regionsObj.has("Head")) {
    requiredSpecialization = "Neurologist";
  } else if (symptomsStr.includes("chest") || symptomsStr.includes("heart") || symptomsStr.includes("palpitation") || regionsObj.has("Chest")) {
    requiredSpecialization = "Cardiologist";
  }

  // Search matching specialization with available slots
  let candidates = hospitalStaff.filter(doc => 
    doc.specialization === requiredSpecialization && doc.availableSlots.length > 0
  );

  // Fallback to General Physician if no specialists available
  if (candidates.length === 0) {
    candidates = hospitalStaff.filter(doc => 
      doc.specialization === "General Physician" && doc.availableSlots.length > 0
    );
  }

  // Selection Criteria: Prioritize by experience
  if (candidates.length > 0) {
    candidates.sort((a, b) => b.experience - a.experience);
    const selectedDoctor = candidates[0];

    const isDifferentFromPreferred = preferredDoctorID && preferredDoctorID !== "none";
    const reason = isDifferentFromPreferred 
      ? `Your preferred doctor is fully booked. We recommend ${selectedDoctor.name} based on their ${selectedDoctor.experience} years of experience in treating similar symptoms.`
      : `We recommend ${selectedDoctor.name} based on their ${selectedDoctor.experience} years of experience in treating similar symptoms.`;

    return {
      matchType: "suggested",
      reasoning: reason,
      doctorProfile: selectedDoctor,
      requiredSpecialization: requiredSpecialization
    };
  }

  // Absolute fallback
  return {
    matchType: "emergency",
    reasoning: "No standard slots available. Redirecting to Emergency Care.",
    doctorProfile: hospitalStaff.find(doc => doc.id === "dr-emergency"),
    requiredSpecialization: "Emergency Medicine"
  };
};
