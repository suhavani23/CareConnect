// Simulated Urgency Scorer mimicking Claude API
// Uses Anthropic API logic format for easy future replacement

export const assessUrgency = async ({ bodyRegions, symptoms, painLevel, painDuration, notes }) => {
  // --- REAL CLAUDE API IMPLEMENTATION (Commented out for future use) ---
  /*
  const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (API_KEY) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          model: "claude-3-haiku-20240307",
          max_tokens: 150,
          system: "You are a medical triage assistant. Given the patient's symptoms, pain level (1-10), duration, and affected body regions, return a JSON object with two fields: 'score' (number from 1-10 indicating urgency) and 'reason' (brief 1-sentence explanation). Do not return anything else.",
          messages: [
             {
               role: "user",
               content: `Patient Data: Regions: ${bodyRegions.join(', ')}. Symptoms: ${symptoms}. Pain: ${painLevel}/10. Duration: ${painDuration}. Notes: ${notes}`
             }
          ]
        })
      });
      const data = await response.json();
      return JSON.parse(data.content[0].text);
    } catch (err) {
      console.error("Claude API failed, falling back to simulated logic", err);
    }
  }
  */

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
          // If only pain level is high, it might not be a true emergency (e.g., severe chronic back pain)
          // But for triage, we still flag it if it's new
          reason = "High pain level reported.";
        }
      }

      resolve({ score, reason });
    }, 1000); // Simulate network latency
  });
};
