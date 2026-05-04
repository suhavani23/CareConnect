/* ai.js - Hugging Face AI Integration for MedCare */

const HF_MODEL_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3';

// =============================================
// CORE API CALL
// =============================================

async function callHuggingFace(prompt, maxTokens = 256) {
  const apiKey = getHFKey();
  if (!apiKey) throw new Error('NO_KEY');

  const response = await fetch(HF_MODEL_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: maxTokens,
        temperature: 0.2,
        return_full_text: false,
        do_sample: false
      }
    })
  });

  if (response.status === 503) {
    // Model loading, wait and retry
    await new Promise(r => setTimeout(r, 3000));
    return callHuggingFace(prompt, maxTokens);
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `API error ${response.status}`);
  }

  const data = await response.json();
  const text = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text;
  return text || '';
}

function extractJSON(text) {
  try {
    // Try direct parse
    return JSON.parse(text.trim());
  } catch {
    // Find JSON in text
    const match = text.match(/\{[\s\S]*?\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch {}
    }
    return null;
  }
}

// =============================================
// URGENCY SCORING
// =============================================

async function getUrgencyScore(symptomsData) {
  const { symptoms, affectedArea, painLocation, painRating, description } = symptomsData;

  const prompt = `<s>[INST] You are a medical triage AI. Analyze these patient symptoms and provide a JSON urgency assessment.

Patient Information:
- Symptoms: ${symptoms.join(', ')}
- Affected Area: ${affectedArea}
- Pain Location: ${painLocation || 'Not specified'}
- Pain Rating: ${painRating}/10
- Additional Details: ${description || 'None'}

Respond with ONLY valid JSON (no other text):
{"score": <number 1-10>, "level": "<Low|Medium|High|Critical>", "reason": "<brief clinical reason>", "recommendImmediate": <true|false>}
[/INST]`;

  try {
    const raw = await callHuggingFace(prompt, 150);
    const parsed = extractJSON(raw);
    if (parsed && parsed.score) return parsed;
  } catch (e) {
    console.warn('HF urgency failed, using fallback:', e.message);
  }

  // Intelligent fallback
  return getFallbackUrgency(symptomsData);
}

function getFallbackUrgency({ symptoms, painRating, description }) {
  const criticalWords = ['chest pain', 'can\'t breathe', 'unconscious', 'seizure', 'stroke', 'severe bleeding', 'paralysis'];
  const highWords = ['shortness of breath', 'high fever', 'vomiting blood', 'fainting', 'crushing', 'severe pain'];
  const medWords = ['fever', 'persistent headache', 'nausea', 'vomiting', 'moderate pain', 'swelling'];

  const text = [...symptoms, description || ''].join(' ').toLowerCase();
  const hasCritical = criticalWords.some(w => text.includes(w));
  const hasHigh = highWords.some(w => text.includes(w));
  const hasMed = medWords.some(w => text.includes(w));
  const pr = parseInt(painRating) || 0;

  if (hasCritical || pr >= 9) return { score: 10, level: 'Critical', reason: 'Potentially life-threatening symptoms detected.', recommendImmediate: true };
  if (hasHigh || pr >= 7) return { score: 7, level: 'High', reason: 'Significant symptoms requiring prompt attention.', recommendImmediate: false };
  if (hasMed || pr >= 4) return { score: 5, level: 'Medium', reason: 'Moderate symptoms, timely consultation recommended.', recommendImmediate: false };
  return { score: 2, level: 'Low', reason: 'Mild symptoms, routine appointment appropriate.', recommendImmediate: false };
}

// =============================================
// DEPARTMENT ASSIGNMENT
// =============================================

async function assignDepartment(symptomsData) {
  const { symptoms, affectedArea, painLocation, description } = symptomsData;

  const prompt = `<s>[INST] You are a medical routing AI for a hospital. Based on patient symptoms, determine the appropriate department.

Available departments and their IDs:
- cardiology: heart, chest, blood pressure, cardiac
- orthopedics: bones, joints, muscles, fractures, spine
- neurology: brain, nerves, headache, migraine, seizures, numbness
- dermatology: skin, rashes, hair, nails, acne, psoriasis
- pediatrics: children under 12, infant, baby, child health
- general: general illness, fever, cough, cold, routine checkup
- dental: teeth, gums, mouth, jaw, oral
- ophthalmology: eyes, vision, sight, blindness, cataracts

Patient Symptoms: ${symptoms.join(', ')}
Affected Area: ${affectedArea}
Location: ${painLocation || 'Not specified'}
Details: ${description || 'None'}

Respond with ONLY valid JSON:
{"department": "<department_id>", "reason": "<brief reason>", "confidence": <0.0-1.0>}
[/INST]`;

  try {
    const raw = await callHuggingFace(prompt, 120);
    const parsed = extractJSON(raw);
    if (parsed && parsed.department) {
      // Validate department ID
      const validDepts = ['cardiology','orthopedics','neurology','dermatology','pediatrics','general','dental','ophthalmology'];
      if (validDepts.includes(parsed.department)) return parsed;
    }
  } catch (e) {
    console.warn('HF dept assignment failed, using fallback:', e.message);
  }

  return getFallbackDepartment(symptomsData);
}

function getFallbackDepartment({ symptoms, affectedArea, description }) {
  const text = [...symptoms, affectedArea, description || ''].join(' ').toLowerCase();

  if (/heart|chest pain|palpitation|cardiac|blood pressure|arrhythmia/.test(text))
    return { department: 'cardiology', reason: 'Cardiac symptoms detected.', confidence: 0.85 };
  if (/bone|joint|fracture|muscle|sprain|ligament|spine|back pain|knee|shoulder/.test(text))
    return { department: 'orthopedics', reason: 'Musculoskeletal symptoms detected.', confidence: 0.85 };
  if (/brain|headache|migraine|seizure|nerve|numbness|dizziness|vertigo|memory/.test(text))
    return { department: 'neurology', reason: 'Neurological symptoms detected.', confidence: 0.85 };
  if (/skin|rash|itch|acne|eczema|psoriasis|hair loss|nail|mole/.test(text))
    return { department: 'dermatology', reason: 'Dermatological symptoms detected.', confidence: 0.85 };
  if (/tooth|teeth|gum|dental|jaw|mouth|oral|cavity/.test(text))
    return { department: 'dental', reason: 'Dental symptoms detected.', confidence: 0.85 };
  if (/eye|vision|sight|blur|cataract|glaucoma|retina/.test(text))
    return { department: 'ophthalmology', reason: 'Ophthalmic symptoms detected.', confidence: 0.85 };
  if (/child|infant|baby|toddler|pediatric/.test(text))
    return { department: 'pediatrics', reason: 'Pediatric care recommended.', confidence: 0.80 };

  return { department: 'general', reason: 'General medical consultation recommended.', confidence: 0.70 };
}

// =============================================
// DOCTOR SELECTION BY AI
// =============================================

function selectBestDoctor(departmentId, availableDocIds) {
  const doctors = getDoctors().filter(d => availableDocIds.includes(d.id));
  if (doctors.length === 0) return null;
  // Sort by rating DESC, experience DESC
  const sorted = [...doctors].sort((a, b) => (b.rating - a.rating) || (b.experience - a.experience));
  return sorted[0];
}
