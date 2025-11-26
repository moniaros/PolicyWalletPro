import { Shield, Heart, Car, Home, Stethoscope, AlertCircle, Dog, Globe, Briefcase } from "lucide-react";

export const policies = [
  {
    id: 1,
    type: "Health",
    provider: "NN Hellas",
    policyNumber: "NN-ORANGE-992",
    coverage: "Unlimited / 100%",
    expiry: "2025-12-31",
    premium: "€145/mo",
    icon: Heart,
    color: "text-orange-500 bg-orange-50",
    status: "Active",
    details: {
      pendingPayments: 0,
      lastPayment: "2025-11-01",
      nextPaymentDue: "2025-12-01",
      beneficiaries: ["Sophia (Spouse)", "Dimitris (Son)"],
      claims: [
        { id: "CLM-NN-001", date: "2025-09-10", reason: "Annual Executive Checkup", amount: "€450", status: "Paid" },
      ],
      coverageLimits: {
        "Annual Limit": "Unlimited",
        "Room & Board": "100% (Private Room)",
        "ICU": "100% Coverage",
        "Surgeons & Physicians": "100% of Reasonable & Customary",
        "Prescribed Drugs": "100% Coverage",
        "Diagnostic Tests": "100% Coverage",
        "Ambulance Service": "100% Coverage",
        "Maternity": "€3,000 per delivery",
        "Dental (Emergency)": "€500 per year",
        "Optical": "€200 per 2 years",
        "Physiotherapy": "15 sessions/year",
        "International Cover": "100% (USA/Canada included)"
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
    provider: "Generali",
    policyNumber: "GEN-SPEED-882",
    coverage: "Full Kasko + Green Card",
    expiry: "2025-06-15",
    premium: "€320/6mo",
    icon: Car,
    color: "text-red-600 bg-red-50",
    status: "Active",
    details: {
      pendingPayments: 0,
      lastPayment: "2025-06-15",
      nextPaymentDue: "2025-12-15",
      beneficiaries: ["Self"],
      claims: [],
      coverageLimits: {
        "Bodily Injury Liability": "€1,220,000 per victim",
        "Material Damage Liability": "€1,220,000 per accident",
        "Own Damage (Kasko)": "Full Replacement Value",
        "Fire & Theft": "Included",
        "Natural Phenomena": "Included (Hail, Flood)",
        "Glass Breakage": "Unlimited",
        "Driver Accident": "€15,000",
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
    provider: "Ergo",
    policyNumber: "ERG-HOME-112",
    coverage: "Building + Content + Civil",
    expiry: "2025-09-01",
    premium: "€180/yr",
    icon: Home,
    color: "text-red-700 bg-red-50",
    status: "Active",
    details: {
      pendingPayments: 0,
      lastPayment: "2024-09-01",
      nextPaymentDue: "2025-09-01",
      beneficiaries: ["Sophia (Spouse)"],
      claims: [],
      coverageLimits: {
        "Building (Reconstruction)": "€350,000",
        "Contents (Replacement)": "€80,000",
        "Family Civil Liability": "€1,000,000",
        "Earthquake": "Included (First Loss)",
        "Fire & Explosion": "Included",
        "Pipe Bursting": "Included",
        "Theft/Burglary": "€15,000 limit",
        "Short Circuit": "€3,000",
        "Loss of Rent": "Up to 12 months",
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
    provider: "Ethniki Asfalistiki",
    policyNumber: "ETH-FULL-445",
    coverage: "€500k Life + Pension",
    expiry: "2040-01-01",
    premium: "€200/mo",
    icon: Briefcase,
    color: "text-blue-600 bg-blue-50",
    status: "Active",
    details: {
      pendingPayments: 0,
      lastPayment: "2025-11-01",
      nextPaymentDue: "2025-12-01",
      beneficiaries: ["Sophia (Spouse)", "Dimitris (Son)"],
      claims: [],
      coverageLimits: {
        "Life Cover (Death)": "€500,000",
        "Accidental Death": "Double Indemnity (€1M)",
        "Permanent Disability": "€500,000",
        "Critical Illness": "€100,000 (Lump Sum)",
        "Hospital Cash Benefit": "€100/day",
        "Premium Waiver": "Included (if disabled)",
        "Pension Pot Value": "€45,200 (Accumulated)",
        "Guaranteed Interest": "2.5%"
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
    provider: "Ergo",
    policyNumber: "ERG-PET-991",
    coverage: "Vet & Surgery",
    expiry: "2025-10-10",
    premium: "€25/mo",
    icon: Dog,
    color: "text-amber-600 bg-amber-50",
    status: "Review Needed",
    details: {
      pendingPayments: 25,
      lastPayment: "2025-10-10",
      nextPaymentDue: "2025-11-10",
      beneficiaries: ["Max (Golden Retriever)"],
      claims: [
        { id: "CLM-PET-004", date: "2025-08-01", reason: "Paw Surgery", amount: "€800", status: "Paid" }
      ],
      coverageLimits: {
        "Annual Limit": "€2,000",
        "Vet Visits": "Unlimited (Network)",
        "Surgery": "100% Covered",
        "Medication": "Included",
        "Third Party Liability": "€50,000",
        "Boarding Fees": "€500 (If owner hospitalized)",
        "Lost Pet Advertising": "€100",
        "Euthanasia/Burial": "€200"
      },
      gapAnalysis: {
        score: 70,
        gaps: ["Vaccines not fully covered"],
        proposals: ["Upgrade to Premium Pet for €5/mo extra to cover annual vaccines."]
      }
    }
  }
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

export const analysisData = [
  { category: "Health", coverage: 98, risk: 40, gap: 2 },
  { category: "Auto", coverage: 95, risk: 70, gap: 5 },
  { category: "Home", coverage: 92, risk: 30, gap: 8 },
  { category: "Life", coverage: 88, risk: 50, gap: 12 },
  { category: "Liability", coverage: 100, risk: 60, gap: 0 },
];

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
