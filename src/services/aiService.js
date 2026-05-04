import { hospitalStaff } from './mockDatabase';

export const simulateCareConnectMatchmaker = ({ patientSymptoms, bodyRegions = [], urgencyScore, preferredDoctorID }) => {
  // --- Severity & Triage Calculation Engine ---
  // The Severity Score (S) is calculated from 1 to 100 based on symptoms, regions, and pain level.
  let severityScore = urgencyScore * 10; // Base score from pain level (1-10 -> 10-100)
  
  const symptomsStr = patientSymptoms.join(" ").toLowerCase();
  const regionsSet = new Set(bodyRegions);

  // Critical Overrides (Emergency Thresholds)
  if (symptomsStr.includes("chest pain") || symptomsStr.includes("breathless") || symptomsStr.includes("unconscious")) {
    severityScore = Math.max(severityScore, 90);
  }
  if (regionsSet.has("Chest") && urgencyScore >= 8) {
    severityScore = Math.max(severityScore, 95);
  }
  if (regionsSet.has("Head") && urgencyScore >= 9) {
    severityScore = Math.max(severityScore, 85);
  }

  // Triage Summary Logic
  let aiSummary = `Patient reports ${patientSymptoms.join(', ') || 'discomfort'} in the ${Array.from(regionsSet).join('/') || 'General'} area. Pain level is ${urgencyScore}/10.`;
  if (severityScore >= 80) {
    aiSummary += " EMERGENCY: Immediate intervention required. High risk of clinical deterioration.";
  } else if (severityScore >= 70) {
    aiSummary += " URGENT: Requires prioritization in clinical pipeline. Monitor vitals.";
  } else {
    aiSummary += " ROUTINE: Standard consultation sufficient.";
  }

  const priorityLevel = severityScore >= 80 ? 'Emergency' : (severityScore >= 70 ? 'Urgent' : 'Routine');

  // --- Matching Logic ---

  // Task Logic 1: Check Preference
  if (preferredDoctorID && preferredDoctorID !== "none") {
    const preferredDoctor = hospitalStaff.find(doc => doc.id === preferredDoctorID);
    if (preferredDoctor && preferredDoctor.availableSlots.length > 0) {
      return {
        matchType: "preferred",
        reasoning: "Your preferred doctor is available.",
        doctorProfile: preferredDoctor,
        requiredSpecialization: preferredDoctor.specialization,
        severity_score: severityScore,
        ai_triage_summary: aiSummary,
        priority_level: priorityLevel
      };
    }
  }

  // Task Logic 2: Handle Unavailability/No Preference
  
  // High Urgency Override (Force to Emergency if S >= 80)
  if (severityScore >= 80) {
    const emergencyDoc = hospitalStaff.find(doc => doc.id === "dr-emergency");
    return {
      matchType: "emergency",
      reasoning: `Based on your critical symptoms (S:${severityScore}), we have prioritized your booking with an available emergency physician.`,
      doctorProfile: emergencyDoc,
      requiredSpecialization: emergencyDoc.specialization,
      severity_score: severityScore,
      ai_triage_summary: aiSummary,
      priority_level: 'Emergency'
    };
  }

  // Analyze symptoms to determine specialization
  let requiredSpecialization = "General Physician";
  
  if (symptomsStr.includes("headache") || symptomsStr.includes("migraine") || symptomsStr.includes("dizzy") || regionsSet.has("Head")) {
    requiredSpecialization = "Neurologist";
  } else if (symptomsStr.includes("chest") || symptomsStr.includes("heart") || symptomsStr.includes("palpitation") || regionsSet.has("Chest")) {
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
      requiredSpecialization: requiredSpecialization,
      severity_score: severityScore,
      ai_triage_summary: aiSummary,
      priority_level: priorityLevel
    };
  }

  // Absolute fallback
  const fallbackDoc = hospitalStaff.find(doc => doc.id === "dr-emergency");
  return {
    matchType: "emergency",
    reasoning: "No standard slots available. Redirecting to Emergency Care.",
    doctorProfile: fallbackDoc,
    requiredSpecialization: fallbackDoc.specialization,
    severity_score: severityScore,
    ai_triage_summary: aiSummary,
    priority_level: 'Emergency'
  };
};
