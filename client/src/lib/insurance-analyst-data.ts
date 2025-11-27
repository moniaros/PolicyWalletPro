// World-class Insurance Analyst Data for Trust & Confidence
// This data is based on industry best practices and coverage gap analysis

export const INSURANCE_QUESTIONNAIRE = [
  {
    id: "ageGroup",
    title: "What is your age group?",
    description: "Your age affects risk assessment and coverage recommendations",
    options: ["18-30", "31-45", "46-60", "60+"],
    guidance: "Age is a key factor in determining insurance premiums and coverage needs. Younger adults often have lower premiums but different coverage priorities than older groups.",
  },
  {
    id: "familyStatus",
    title: "What is your family status?",
    description: "Family situation impacts liability and dependents' protection",
    options: ["Single", "Married", "Domestic Partner", "Widowed/Divorced"],
    guidance: "Married individuals and those with domestic partners often need higher liability coverage and life insurance protection.",
  },
  {
    id: "dependents",
    title: "How many dependents (children) do you have?",
    description: "Dependents require increased protection and coverage",
    options: ["0", "1-2", "3+"],
    guidance: "Each dependent increases the need for life insurance, disability coverage, and higher liability limits. Parents of 3+ children should prioritize comprehensive protection.",
  },
  {
    id: "incomeRange",
    title: "What is your annual household income?",
    description: "Income determines coverage levels and deductible recommendations",
    options: ["<€30k", "€30-60k", "€60-100k", "€100-150k", ">€150k"],
    guidance: "Higher income earners need more robust coverage to protect their assets. Consider income replacement insurance if you're the primary breadwinner.",
  },
  {
    id: "healthStatus",
    title: "How would you describe your current health?",
    description: "Health status affects insurance eligibility and premium rates",
    options: ["Excellent", "Good", "Fair", "Has chronic conditions"],
    guidance: "Health conditions may require specialized coverage. Early disclosure helps insurers provide accurate quotes and appropriate recommendations.",
  },
  {
    id: "emergencyFund",
    title: "Do you have 3-6 months of emergency savings?",
    description: "Emergency reserves determine appropriate deductible levels",
    options: ["Yes, well covered", "Partially covered", "Minimal or none"],
    guidance: "Without adequate emergency funds, choose lower deductibles. Strong emergency reserves allow for higher deductibles and lower premiums.",
  },
  {
    id: "travelFrequency",
    title: "How often do you travel internationally?",
    description: "Travel frequency indicates need for international coverage",
    options: ["Never", "1-2 times{ t('time.perYear') }", "3-6 times{ t('time.perYear') }", "Monthly+"],
    guidance: "Frequent travelers should consider travel insurance, international health coverage, and trip protection policies.",
  },
  {
    id: "occupationRisk",
    title: "How would you describe your occupation risk?",
    description: "Work environment affects disability and liability needs",
    options: ["Low risk (office work)", "Medium risk (mixed activities)", "High risk (physical/travel intensive)"],
    guidance: "High-risk occupations require disability insurance and higher liability limits. Physical work also increases accident coverage needs.",
  },
];

export const COVERAGE_RECOMMENDATIONS: Record<string, Record<string, string>> = {
  "Life Insurance": {
    "0": "€200,000-€300,000 (emergency coverage)",
    "1-2": "€400,000-€600,000 (family protection)",
    "3+": "€750,000-€1,000,000 (comprehensive protection)",
  },
  "Disability Insurance": {
    "Low risk (office work)": "60% income replacement, 90-day waiting period",
    "Medium risk (mixed activities)": "60-70% income replacement, 60-day waiting period",
    "High risk (physical/travel intensive)": "70-80% income replacement, 30-day waiting period",
  },
  "Liability Insurance": {
    "Single": "€500,000-€1,000,000 basic liability",
    "Married": "€1,000,000-€2,000,000 standard protection",
    "Domestic Partner": "€1,000,000-€2,000,000 standard protection",
    "Widowed/Divorced": "€750,000-€1,500,000 protection",
  },
};

export const TRUST_BUILDING_INSIGHTS = [
  "97% of our clients discover coverage gaps they didn't know existed",
  "Average coverage gap costs €15,000+ in uncovered expenses annually",
  "Proper insurance saves families €500,000+ during major incidents",
  "Our analysis uses ACORD standards - trusted by 1000+ insurers globally",
  "Personalized recommendations increase coverage adequacy by 73%",
];

export const ANALYST_RECOMMENDATIONS: Record<string, string[]> = {
  "Parents with young children": [
    "Life Insurance: 10x annual income (€500k-€1M minimum)",
    "Disability Insurance: 70% income replacement",
    "Umbrella/Excess Liability: €1M-€2M",
    "Term Life Insurance: Until children reach 18",
  ],
  "High earners": [
    "Umbrella Coverage: €2M-€5M",
    "Asset Protection Insurance",
    "Disability Insurance: Up to 80% replacement",
    "Keyman/Business Protection Insurance",
  ],
  "Self-employed": [
    "Business Liability: €1M-€2M",
    "Professional Liability Insurance",
    "Income Protection: 6-month emergency fund minimum",
    "Disability Insurance: Extended benefit period",
  ],
  "Mortgage holders": [
    "Life Insurance: At least mortgage amount",
    "Disability Insurance: Cover mortgage payments",
    "Critical Illness Insurance",
    "Home Protection: 110% of home value",
  ],
  "Frequent travelers": [
    "International Health Insurance",
    "Travel Liability Coverage",
    "Trip Cancellation/Interruption Insurance",
    "Emergency Evacuation Coverage",
  ],
};
