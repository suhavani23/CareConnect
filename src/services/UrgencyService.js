// Simulated Urgency Scorer mimicking Claude API
// Uses Anthropic API logic format for easy future replacement

export const assessUrgency = async ({ bodyRegions, symptoms, painLevel, painDuration, notes }) => {
  // --- SIMULATED SCORING LOGIC ---
  return new Promise((resolve) => {
    setTimeout(() => {
      let score = parseInt(painLevel);
      let isCritical = false;
      let reason = "Standard pain and symptoms reported.";

      const criticalRegions = ["Chest", "Head", "Abdomen", "Neck"];
      const criticalKeywords = ["breathing", "unconscious", "bleeding", "heart", "chest pain", "fainting", "numbness", "stroke"];
      
      const combinedText = `${symptoms} ${notes}`.toLowerCase();
      
      // Check for critical regions
      const hasCriticalRegion = bodyRegions.some(r => criticalRegions.includes(r));
      if (hasCriticalRegion) {
        score += 1;
        reason = "Symptoms in critical areas (chest, head, or abdomen).";
      }

      // Check for critical keywords
      const hasCriticalKeyword = criticalKeywords.some(kw => combinedText.includes(kw));
      if (hasCriticalKeyword) {
        score += 2;
        isCritical = true;
        reason = "Reported symptoms suggest potentially life-threatening conditions.";
      }

      // Duration factor
      if (painDuration === "Less than 1 hour" && score >= 7) {
         score += 1; // Sudden severe onset
         reason = "Sudden onset of severe symptoms requires immediate attention.";
      }

      // Cap at 10
      score = Math.min(score, 10);

      // Final adjustments
      if (score >= 8) {
        if (!isCritical && !hasCriticalRegion && score === 8) {
          reason = "High pain level reported.";
        }
      }

      resolve({ score, reason });
    }, 1000); // Simulate network latency
  });
};
