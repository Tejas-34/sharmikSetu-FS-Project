// --- CONSTANTS ---

// Estimated Minimum Daily Wages (General/Unskilled) - for prototype validation
export const MINIMUM_WAGES = {
  'Andhra Pradesh': 350,
  'Bihar': 366,
  'Delhi': 612,
  'Gujarat': 390,
  'Haryana': 400,
  'Karnataka': 485,
  'Kerala': 700,
  'Madhya Pradesh': 350,
  'Maharashtra': 450,
  'Punjab': 400,
  'Rajasthan': 380,
  'Tamil Nadu': 470,
  'Telangana': 430,
  'Uttar Pradesh': 380,
  'West Bengal': 360,
  'Other': 350
};

// --- LEGAL TEXT CONSTANTS ---
export const WORKER_RIGHTS = [
  { title: "Minimum Wage", desc: "You are entitled to the state-mandated minimum wage under the Minimum Wages Act, 1948." },
  { title: "Safety Equipment", desc: "Employers must provide helmets, boots, and necessary safety gear (BOCW Act, 1996)." },
  { title: "Overtime Pay", desc: "Work beyond 9 hours/day or 48 hours/week usually entitles you to double wages." },
  { title: "Accident Compensation", desc: "You have the right to compensation for work-related injuries (Employees Compensation Act)." }
];

export const EMPLOYER_LAWS = [
  { title: "Fair Wages", desc: "Ensure payments meet the Minimum Wages Act, 1948 for your zone/category." },
  { title: "Site Safety", desc: "You are liable for accidents if safety protocols (BOCW Act) are ignored." },
  { title: "Child Labour", desc: "Employing children under 14 is a strictly punishable criminal offense." },
  { title: "Timely Payment", desc: "Wages must be settled daily, weekly, or monthly as per the Payment of Wages Act, 1936." }
];

// --- INITIAL DATA ---
export const INITIAL_USERS = [
  { id: 'admin1', name: 'Site Admin', role: 'admin', email: 'admin@site.com', password: '123', phone: '9876543210', pincode: '400001' },
  { id: 'emp1', name: 'BuildCorp Ltd', role: 'employer', company: 'BuildCorp', email: 'boss@build.com', password: '123', phone: '9988776655', pincode: '400050' },
  { id: 'work1', name: 'John Mason', role: 'worker', skill: 'Masonry', email: 'john@work.com', password: '123', phone: '8877665544', pincode: '400010' },
  { id: 'work2', name: 'Sarah Spark', role: 'worker', skill: 'Electrician', email: 'sarah@work.com', password: '123', phone: '7766554433', pincode: '400020' },
];

export const INITIAL_JOBS = [
  {
    id: 'job1',
    employerId: 'emp1',
    employerName: 'BuildCorp Ltd',
    title: 'Site Mason',
    location: 'Downtown Metro Site',
    pincode: '400012',
    state: 'Maharashtra',
    wage: 460,
    duration: '3 Months',
    requiredWorkers: 2,
    appliedWorkers: ['work1'],
    status: 'OPEN',
    postedAt: new Date().toISOString(),
  },
  {
    id: 'job2',
    employerId: 'emp1',
    employerName: 'BuildCorp Ltd',
    title: 'General Laborer',
    location: 'Westside Mall',
    pincode: '400099',
    state: 'Maharashtra',
    wage: 450,
    duration: '15 Days',
    requiredWorkers: 5,
    appliedWorkers: [],
    status: 'OPEN',
    postedAt: new Date().toISOString(),
  }
];
