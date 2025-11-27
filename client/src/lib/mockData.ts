import { Shield, Heart, Car, Home, Stethoscope, AlertCircle, Dog, Globe, Briefcase, FileText, FileCheck, FileBarChart } from "lucide-react";

export const policies = [
  {
    id: 1,
    type: "Health",
    lob: "HLT", // ACORD Line of Business Code
    provider: "NN Hellas",
    carrierId: "NN-GR-001",
    policyNumber: "NN-ORANGE-992",
    coverage: "Unlimited / 100%",
    effectiveDate: "2025-01-01",
    expiry: "2025-12-31",
    premium: "€145.00",
    paymentFrequency: "Monthly",
    icon: Heart,
    color: "text-orange-500 bg-orange-50",
    status: "Active",
    quickViewMetadata: {
      insuredPerson: "Σοφία Νικολάιδης",
      hospitalClass: "A-Class (Μονόκλινο)",
      network: "Συμβεβλημένα",
      deductible: "€1,500",
      annualLimit: "€1,000,000",
      preAuthNumber: "+30 210 6849000",
      annualCheckup: "Περιλαμβάνεται - Αιματολογικές εξετάσεις",
      excludedProviders: ["Metropolitan Hospital", "Some Private Clinic"]
    },
    details: {
      pendingPayments: 0,
      lastPayment: "2025-11-01",
      nextPaymentDue: "2025-12-01",
      beneficiaries: [
        { 
          name: "Sophia (Spouse)", 
          relation: "SP", // Spouse
          dob: "1985-05-12", 
          allocation: "50%", 
          primary: true 
        },
        { 
          name: "Dimitris (Son)", 
          relation: "CH", // Child
          dob: "2015-08-20", 
          allocation: "50%", 
          primary: true 
        }
      ],
      claims: [
        { 
          id: "CLM-NN-001", 
          incidentDate: "2025-09-01",
          reportedDate: "2025-09-10",
          type: "Medical",
          reason: "Annual Executive Checkup", 
          amount: "€450.00", 
          reserveAmount: "€0.00",
          paidAmount: "€450.00",
          status: "Paid", 
          adjuster: "Dr. A. Makris",
          step: 4, 
          steps: ["FNOL", "Coverage", "Appraisal", "Payment"] // First Notice of Loss
        },
      ],
      coverageLimits: {
        "Annual Aggregate Limit": "Unlimited",
        "Room & Board (Daily)": "100% (Private Room)",
        "ICU (Daily)": "100% Coverage",
        "Surgical Schedule": "100% R&C (Reasonable & Customary)",
        "Anesthesia": "100% Coverage",
        "Prescribed Drugs (Inpatient)": "100% Coverage",
        "Diagnostic X-Ray/Lab": "100% Coverage",
        "Emergency Ambulance": "100% Coverage",
        "Maternity Benefit": "€3,000 per delivery",
        "Dental (Accident/Emergency)": "€500 per year",
        "Optical Hardware": "€200 per 24 months",
        "Physiotherapy": "15 sessions{ t('time.perYear') }",
        "Geographic Scope": "Worldwide (USA/Canada included)"
      },
      gapAnalysis: {
        score: 98,
        gaps: [],
        proposals: ["Did you know? You have a free nutrition plan included."]
      }
    }
  },
  {
    id: 2,
    type: "Auto",
    lob: "AUT",
    provider: "Generali",
    carrierId: "GEN-IT-GR",
    policyNumber: "GEN-SPEED-882",
    coverage: "Full Kasko + Green Card",
    effectiveDate: "2025-06-15",
    expiry: "2025-12-15",
    premium: "€320.00",
    paymentFrequency: "Semi-Annual",
    icon: Car,
    color: "text-red-600 bg-red-50",
    status: "Active",
    quickViewMetadata: {
      licensePlate: "YZA-1234",
      carModel: "Toyota Yaris",
      coverageTier: "Πλήρες Kasko",
      greenCardStatus: "Valid",
      accidentCarePhone: "+30 18118",
      roadsidePhone: "+30 18180",
      roadsideAssistance: "24/7 Ευρώπη-Βαλκάνια",
      namedDrivers: ["Αλέξανδρος Νικολάιδης", "Μαρία Νικολάιδης"]
    },
    details: {
      pendingPayments: 0,
      lastPayment: "2025-06-15",
      nextPaymentDue: "2025-12-15",
      beneficiaries: [
        { 
          name: "Alex (Insured)", 
          relation: "IN", // Insured
          dob: "1982-03-15", 
          allocation: "100%", 
          primary: true 
        }
      ],
      claims: [
         { 
           id: "CLM-GEN-002", 
           incidentDate: "2025-11-19",
           reportedDate: "2025-11-20",
           type: "Property Damage",
           reason: "Windshield Crack", 
           amount: "€350.00", 
           reserveAmount: "€350.00",
           paidAmount: "€0.00",
           status: "In Review", 
           adjuster: "K. Georgiou",
           step: 2, 
           steps: ["FNOL", "Inspection", "Approval", "Settlement"] 
         }
      ],
      coverageLimits: {
        "Bodily Injury (Per Person)": "€1,220,000",
        "Bodily Injury (Per Accident)": "€1,220,000",
        "Property Damage (Per Accident)": "€1,220,000",
        "Own Damage (Collision)": "ACV (Actual Cash Value)",
        "Deductible (Collision)": "€300.00",
        "Fire & Theft": "Included (No Deductible)",
        "Natural Phenomena": "Included (Hail, Flood)",
        "Glass Breakage": "Unlimited (Zero Deductible)",
        "Driver Accident PA": "€15,000",
        "Legal Protection": "€3,000",
        "Roadside Assistance": "Express Service (Europe-wide)",
        "Green Card": "Active (EU + Balkans)"
      },
      gapAnalysis: {
        score: 95,
        gaps: [],
        proposals: ["Upgrade to 'Generali Drive' app for 10% discount on renewal."]
      }
    }
  },
  {
    id: 3,
    type: "Home & Liability",
    lob: "HOM",
    provider: "Ergo",
    carrierId: "ERG-DE-GR",
    policyNumber: "ERG-HOME-112",
    coverage: "Building + Content + Civil",
    effectiveDate: "2024-09-01",
    expiry: "2025-09-01",
    premium: "€180.00",
    paymentFrequency: "Annual",
    icon: Home,
    color: "text-red-700 bg-red-50",
    status: "Active",
    quickViewMetadata: {
      propertyAddress: "Ακαδημίας 10, Κολωνάκι, Αθήνα",
      sumInsured: "€465,000",
      enfiaBadge: "✓ Έκπτωση Φόρου Ενισχυμένη",
      catastropheCover: { seismos: true, pirkagia: true, plimmira: true },
      deductible: "€500",
      mortgagee: "Alpha Bank",
      emergencyServices: "+30 214 2000214"
    },
    details: {
      pendingPayments: 0,
      lastPayment: "2024-09-01",
      nextPaymentDue: "2025-09-01",
      beneficiaries: [
        { 
          name: "Sophia (Spouse)", 
          relation: "SP", 
          dob: "1985-05-12", 
          allocation: "100%", 
          primary: true 
        }
      ],
      claims: [],
      coverageLimits: {
        "Dwelling Amount (Coverage A)": "€350,000",
        "Other Structures (Coverage B)": "€35,000",
        "Personal Property (Coverage C)": "€80,000",
        "Loss of Use (Coverage D)": "12 Months / €20,000",
        "Personal Liability (Coverage E)": "€1,000,000",
        "Medical Payments (Coverage F)": "€5,000 per person",
        "Earthquake Deductible": "2% of Limit",
        "Fire & Explosion": "Included",
        "Water Damage / Pipe Burst": "Included",
        "Theft/Burglary Limit": "€15,000",
        "Short Circuit Damage": "€3,000",
        "Emergency Home Assist": "24/7 Included"
      },
      gapAnalysis: {
        score: 92,
        gaps: ["Cyber protection is basic"],
        proposals: ["Add 'Cyber Shield' for online banking protection (€15/yr)"]
      }
    }
  },
  {
    id: 4,
    type: "Investment Life",
    lob: "LIF",
    provider: "Ethniki Asfalistiki",
    carrierId: "ETH-GR",
    policyNumber: "ETH-FULL-445",
    coverage: "€500k Life + Pension",
    effectiveDate: "2015-01-01",
    expiry: "2040-01-01",
    premium: "€200.00",
    paymentFrequency: "Monthly",
    icon: Briefcase,
    color: "text-blue-600 bg-blue-50",
    status: "Active",
    quickViewMetadata: {
      fundValue: "€45,200",
      ytdGrowth: "+5.2%",
      surrenderValue: "€44,800",
      fundAllocation: { equity: "60%", bonds: "30%", cash: "10%" },
      lastPremiumDate: "2025-11-01",
      lastPremiumAmount: "€200.00",
      taxStatus: "Απαλλαγή Φόρου σε Ωρίμανση",
      guaranteedVsLinked: { guaranteed: "€35,000", linked: "€10,200" }
    },
    details: {
      pendingPayments: 0,
      lastPayment: "2025-11-01",
      nextPaymentDue: "2025-12-01",
      beneficiaries: [
        { 
          name: "Sophia (Spouse)", 
          relation: "SP", 
          dob: "1985-05-12", 
          allocation: "50%", 
          primary: true 
        },
        { 
          name: "Dimitris (Son)", 
          relation: "CH", 
          dob: "2015-08-20", 
          allocation: "50%", 
          primary: true 
        }
      ],
      claims: [],
      coverageLimits: {
        "Death Benefit": "€500,000",
        "Accidental Death Rider": "€500,000 (Double Indemnity)",
        "Permanent Total Disability": "€500,000",
        "Critical Illness (Accelerated)": "€100,000",
        "Hospital Cash Benefit": "€100/day",
        "Waiver of Premium": "Included",
        "Cash Surrender Value": "€45,200",
        "Guaranteed Interest Rate": "2.5%"
      },
      gapAnalysis: {
        score: 88,
        gaps: [],
        proposals: ["Inflation is rising. Consider indexing premium by 3%."]
      }
    }
  },
  {
    id: 5,
    type: "Pet Insurance",
    lob: "PET",
    provider: "Ergo",
    carrierId: "ERG-DE-GR",
    policyNumber: "ERG-PET-991",
    coverage: "Vet & Surgery",
    effectiveDate: "2024-10-10",
    expiry: "2025-10-10",
    premium: "€25.00",
    paymentFrequency: "Monthly",
    icon: Dog,
    color: "text-amber-600 bg-amber-50",
    status: "Review Needed",
    quickViewMetadata: {
      petName: "Μάξιμος",
      petType: "Golden Retriever",
      limitTotal: "€1,000",
      limitUsed: "€400",
      limitUsedPercent: "40%",
      microchipNumber: "GR-0241234567",
      coPay: "20%",
      waitingPeriods: { kalazar: "Κάλυψη", λευκωματα: "Καλυμμένη" },
      greekDiseases: "Leishmania (Κάλαζαρ) - Κάλυψη",
      vetNetwork: "Direct Payment σε Συμβεβλημένα Ιατρεία"
    },
    details: {
      pendingPayments: 25,
      lastPayment: "2025-10-10",
      nextPaymentDue: "2025-11-10",
      beneficiaries: [
        { 
          name: "Max (Golden Retriever)", 
          relation: "PET", 
          dob: "2022-04-01", 
          allocation: "N/A", 
          primary: true 
        }
      ],
      claims: [
        { 
          id: "CLM-PET-004", 
          incidentDate: "2025-07-30",
          reportedDate: "2025-08-01",
          type: "Medical",
          reason: "Paw Surgery", 
          amount: "€800.00", 
          reserveAmount: "€0.00",
          paidAmount: "€800.00",
          status: "Paid", 
          adjuster: "Auto-Adjudicated",
          step: 4, 
          steps: ["FNOL", "Review", "Approved", "Paid"] 
        }
      ],
      coverageLimits: {
        "Annual Aggregate Limit": "€2,000",
        "Routine Care/Wellness": "Excluded",
        "Vet Visits (Illness/Injury)": "Unlimited (Network)",
        "Surgery": "100% Covered",
        "Medications": "Included",
        "Third Party Liability": "€50,000",
        "Emergency Boarding": "€500",
        "Deductible": "€50.00 per incident"
      },
      gapAnalysis: {
        score: 70,
        gaps: ["Vaccines not fully covered"],
        proposals: ["Upgrade to Premium Pet for €5/mo extra to cover annual vaccines."]
      }
    }
  }
];

export const documents = [
  { id: 1, name: "NN Health Policy Schedule 2025", type: "Policy", date: "2025-01-01", size: "1.2 MB", icon: FileText },
  { id: 2, name: "NN Tax Certificate 2024", type: "Tax", date: "2025-02-15", size: "0.8 MB", icon: FileBarChart },
  { id: 3, name: "Generali Green Card (EU)", type: "ID Card", date: "2025-06-15", size: "0.5 MB", icon: Globe },
  { id: 4, name: "Generali Auto Contract", type: "Policy", date: "2025-06-15", size: "2.4 MB", icon: FileText },
  { id: 5, name: "Ergo Home Insurance Schedule", type: "Policy", date: "2024-09-01", size: "1.5 MB", icon: FileText },
  { id: 6, name: "Claim Report #CLM-NN-001", type: "Claim", date: "2025-09-12", size: "3.1 MB", icon: FileCheck },
];

export const appointments = [
  {
    id: 1,
    doctor: "Dr. Papadopoulos",
    specialty: "Cardiologist",
    date: "2025-11-28",
    time: "10:00 AM",
    location: "Hygeia Hospital",
    type: "Annual Checkup (NN)"
  },
  {
    id: 2,
    doctor: "Vet Clinic 'Happy Paws'",
    specialty: "Veterinarian",
    date: "2025-12-05",
    time: "5:30 PM",
    location: "Kifisia Vet Center",
    type: "Vaccination (Max)"
  }
];

export const inNetworkServices = {
  Health: [
    { id: "hs1", name: "Cardiology", provider: "Dr. Papadopoulos", location: "Hygeia Hospital", phone: "+30 210 6849000" },
    { id: "hs2", name: "Dental Care", provider: "Dr. Nikolaidis Clinic", location: "Syntagma, Athens", phone: "+30 210 3224567" },
    { id: "hs3", name: "Ophthalmology", provider: "Eye Center Athens", location: "Maroussi", phone: "+30 210 6134444" },
    { id: "hs4", name: "General Checkup", provider: "Metro Medical Center", location: "Kifisia", phone: "+30 210 6296200" },
    { id: "hs5", name: "Physiotherapy", provider: "Athens Physio Clinic", location: "Glyfada", phone: "+30 210 8940123" },
    { id: "hs6", name: "Mental Health", provider: "Psych Wellness Center", location: "Kolonaki", phone: "+30 210 7225566" }
  ],
  Auto: [
    { id: "as1", name: "Generali Approved Garage", provider: "Speed Auto Repair", location: "Acharnes", phone: "+30 213 0033800" },
    { id: "as2", name: "Auto Glass Replacement", provider: "Glass Pro", location: "Chalandri", phone: "+30 210 6847123" },
    { id: "as3", name: "Tire Service", provider: "Michelin Service Center", location: "Maroussi", phone: "+30 210 6199999" },
    { id: "as4", name: "Roadside Assistance", provider: "Generali Express", location: "24/7 Mobile", phone: "+30 18118" }
  ],
  Home: [
    { id: "ho1", name: "Emergency Plumbing", provider: "HomeServe Greece", location: "24/7 Mobile", phone: "+30 214 2000214" },
    { id: "ho2", name: "Electrical Repairs", provider: "ElectroTech", location: "Glyfada", phone: "+30 210 8943333" },
    { id: "ho3", name: "Locksmith Service", provider: "24/7 Locks", location: "24/7 Mobile", phone: "+30 211 4101234" },
    { id: "ho4", name: "Glass Replacement", provider: "Window Experts", location: "Marousi", phone: "+30 210 6189999" }
  ],
  Pet: [
    { id: "ps1", name: "Veterinary Clinic", provider: "Happy Paws Vet", location: "Kifisia Vet Center", phone: "+30 210 6234567" },
    { id: "ps2", name: "Pet Surgery", provider: "Veterinary Hospital Athens", location: "Maroussi", phone: "+30 210 6109000" },
    { id: "ps3", name: "Pet Grooming", provider: "Pet Beauty", location: "Glyfada", phone: "+30 210 8946666" },
    { id: "ps4", name: "Emergency Vet", provider: "24h Pet Emergency", location: "Chalandri", phone: "+30 210 6742111" }
  ]
};

export const analysisData = [
  { category: "Health", coverage: 98, risk: 40, gap: 2 },
  { category: "Auto", coverage: 95, risk: 70, gap: 5 },
  { category: "Home", coverage: 92, risk: 30, gap: 8 },
  { category: "Life", coverage: 88, risk: 50, gap: 12 },
  { category: "Liability", coverage: 100, risk: 60, gap: 0 },
];

// ==================== UNDERWRITING API MOCK DATA ====================
// API-Ready Format: Designed for seamless transition to real API endpoints

export const gapAnalysisResponse = {
  profileScore: 78,
  riskScore: 42,
  gaps: [
    {
      id: 'gap-life-dependents',
      type: 'critical',
      category: 'Life Insurance',
      coverage: 'Term Life Insurance',
      description: '2 dependents without life protection',
      reason: 'Family financial security at risk if breadwinner unable to work',
      riskExposure: '€500,000+',
      estimatedAnnualCost: '€300-600',
      priority: 100,
      recommendation: 'Obtain 10x annual income coverage immediately',
      actionType: 'add',
      estimatedPremium: 35,
      requiresUnderwriting: true,
      roiMonths: 12
    },
    {
      id: 'gap-umbrella',
      type: 'high',
      category: 'Liability Protection',
      coverage: 'Umbrella/Excess Liability',
      description: 'Insufficient liability coverage for family assets',
      reason: 'Standard policies inadequate for high-exposure family situation',
      riskExposure: '€1,000,000+',
      estimatedAnnualCost: '€300-500',
      priority: 85,
      recommendation: 'Minimum €2M umbrella policy recommended',
      actionType: 'add',
      estimatedPremium: 35,
      requiresUnderwriting: true,
      roiMonths: 36
    },
    {
      id: 'gap-emergency-fund',
      type: 'high',
      category: 'Financial Planning',
      coverage: 'Emergency Reserve Fund',
      description: 'No emergency savings = high deductible dependency risk',
      reason: 'Without emergency fund, even small claims create hardship',
      riskExposure: '€5,000-15,000',
      estimatedAnnualCost: '€0 (savings)',
      priority: 80,
      recommendation: 'Build 3-6 months emergency fund (€3k-€15k minimum)',
      actionType: 'optimize',
      requiresUnderwriting: false,
      roiMonths: 6
    },
    {
      id: 'gap-bundle-savings',
      type: 'low',
      category: 'Premium Optimization',
      coverage: 'Multi-policy Bundling',
      description: 'Multiple policies with different carriers',
      reason: 'Bundling typically saves 15-25% annually',
      riskExposure: 'Savings opportunity',
      estimatedAnnualCost: '-€400-600',
      priority: 40,
      recommendation: 'Consolidate policies with single carrier for bundling discount',
      actionType: 'optimize',
      estimatedPremium: -50,
      requiresUnderwriting: false,
      roiMonths: 1
    }
  ],
  summary: 'SIGNIFICANT GAPS: Coverage at 78% adequacy. Multiple high-priority recommendations available.',
  keyMetrics: {
    totalExposure: '€1,505,000',
    protectionPercentage: 78,
    criticalGaps: 1,
    estimatedMonthlyOptimization: 20
  },
  recommendations: [
    '🟡 MODERATE RISK: Schedule comprehensive gap analysis review',
    '👨‍👩‍👧 FAMILY FOCUS: Prioritize life insurance and income protection',
    '✈️ TRAVEL READY: Add international medical and travel coverage'
  ]
};

export const riskAssessmentResponse = {
  id: 'ra-001',
  userId: 'user-001',
  riskScore: 42,
  riskLevel: 'Moderate',
  healthFactors: {
    age: 42,
    bmi: 25.5,
    conditions: ['controlled diabetes'],
    bloodPressure: '130/85',
    cholesterol: 210
  },
  recommendations: [
    'Schedule semi-annual health screening',
    'Monitor blood pressure regularly',
    'Maintain consistent exercise routine',
    'Regular glucose monitoring'
  ],
  nextCheckupDue: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
  calculatedAt: new Date().toISOString()
};

export const preventiveRecommendationsResponse = [
  {
    id: 'pr-001',
    userId: 'user-001',
    category: 'Screening',
    title: 'Annual Health Checkup',
    description: 'Schedule your yearly comprehensive health screening to monitor vital health indicators.',
    priority: 'High',
    coverageStatus: 'Covered',
    createdAt: new Date().toISOString(),
    completedAt: null
  },
  {
    id: 'pr-002',
    userId: 'user-001',
    category: 'Preventive',
    title: 'Blood Pressure Monitoring',
    description: 'Regular blood pressure checks help detect hypertension early.',
    priority: 'High',
    coverageStatus: 'Covered',
    createdAt: new Date().toISOString(),
    completedAt: null
  },
  {
    id: 'pr-003',
    userId: 'user-001',
    category: 'Lifestyle',
    title: 'Fitness & Exercise Program',
    description: 'Engage in 150 minutes of moderate aerobic activity per week.',
    priority: 'Medium',
    coverageStatus: 'Partially Covered',
    createdAt: new Date().toISOString(),
    completedAt: null
  }
];

export const userProfileResponse = {
  id: 'profile-001',
  userId: 'user-001',
  fullName: 'Αλέξανδρος Νικολάιδης',
  dateOfBirth: '1982-03-15',
  ageGroup: '31-45',
  familyStatus: 'Παντρεμένος/η',
  dependents: 2,
  incomeRange: '€60-100k',
  healthStatus: 'Καλή',
  emergencyFund: 'Μερικώς καλυμμένο',
  travelFrequency: '1-2 φορές το χρόνο',
  occupationRisk: 'Χαμηλός κίνδυνος (γραφειακή εργασία)',
  currentCoverages: ['Health', 'Auto', 'Home', 'Investment Life'],
  chronicConditions: ['controlled diabetes'],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: new Date().toISOString()
};

export const adminStatsResponse = {
  totalUsers: 2400,
  activePolicies: 1800,
  pendingClaims: 240,
  claimsApproved: '92%',
  claimsDenied: '5%',
  claimsPending: '3%',
  averagePolicyValue: '€450',
  totalPremiumCollected: '€1,080,000',
  renewalRate: '88%'
};

export const notifications = [
  {
    id: 1,
    title: "Green Card Ready",
    message: "Your Generali Green Card for European travel is ready to download.",
    type: "info",
    date: "Today"
  },
  {
    id: 2,
    title: "Pet Policy Payment",
    message: "Monthly premium for Max is due (Ergo).",
    type: "warning",
    date: "Yesterday"
  },
  {
    id: 3,
    title: "Health Perk Unused",
    message: "You haven't used your free nutritionist session from NN this year!",
    type: "info",
    date: "2 days ago"
  }
];

export const agents = [
  {
    id: 1,
    name: "Maria K.",
    specialty: "Family Protection Specialist",
    rating: 4.9,
    reviews: 142,
    experience: "12 Years",
    about: "Dedicated to helping families secure their future with comprehensive health and life planning.",
    isCurrent: true,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200"
  },
  {
    id: 2,
    name: "Nikos A.",
    specialty: "Investment & Retirement",
    rating: 4.8,
    reviews: 98,
    experience: "15 Years",
    about: "Expert in long-term wealth accumulation and pension planning strategies.",
    isCurrent: false,
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200"
  },
  {
    id: 3,
    name: "Elena P.",
    specialty: "General Insurance (Auto/Home)",
    rating: 4.7,
    reviews: 85,
    experience: "8 Years",
    about: "Fast and reliable support for all your property and vehicle insurance needs.",
    isCurrent: false,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200"
  },
  {
    id: 4,
    name: "George S.",
    specialty: "Business & Liability",
    rating: 5.0,
    reviews: 56,
    experience: "20 Years",
    about: "Specialized in complex liability and corporate risk management.",
    isCurrent: false,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200"
  }
];
