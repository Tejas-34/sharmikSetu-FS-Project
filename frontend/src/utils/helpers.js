// --- UTILS ---

export const generateId = () => Math.random().toString(36).substr(2, 9);
export const formatDate = (date) => new Date(date).toLocaleDateString();

// Helper to parse duration string (e.g., "3 Months", "15 Days") to milliseconds
export const parseDuration = (durationStr) => {
  if (!durationStr) return 0;
  const match = durationStr.match(/(\d+)\s*([a-zA-Z]+)/);
  if (!match) return 0;
  
  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  const dayMs = 86400000; // 24 * 60 * 60 * 1000

  if (unit.includes('month')) return value * 30 * dayMs;
  if (unit.includes('week')) return value * 7 * dayMs;
  if (unit.includes('day')) return value * dayMs;
  
  return 0;
};

// SIMULATED DISTANCE CALCULATOR
// Returns distance in km.
// Since we don't have real lat/long, we simulate distance based on numerical difference of pincodes
// This is purely for demonstration.
export const calculateDistance = (pin1, pin2) => {
  if (!pin1 || !pin2) return 0;
  // Seed random generator with the sum of pins to keep distance consistent for same pair
  const seed = parseInt(pin1) + parseInt(pin2);
  const x = Math.sin(seed) * 10000;
  const randomDist = (x - Math.floor(x)) * 20; // 0 to 20km
  return Math.max(1, randomDist).toFixed(1); // Min 1km
};
