import { Shield, Heart, Car, Home, Stethoscope, AlertCircle, Umbrella, Banknote, Users, FileWarning } from "lucide-react";

export const policies = [
  {
    id: 1,
    type: "Health",
    provider: "BlueCross",
    policyNumber: "HC-8839201",
    coverage: "$500,000",
    expiry: "2025-12-31",
    premium: "$350/mo",
    icon: Heart,
    color: "text-rose-500 bg-rose-50",
    status: "Active",
    details: {
      pendingPayments: 0,
      lastPayment: "2025-11-01",
      nextPaymentDue: "2025-12-01",
      beneficiaries: ["Jane Doe (Spouse)", "Timmy Doe (Child)"],
      claims: [
        { id: "CLM-001", date: "2025-08-15", reason: "Annual Checkup", amount: "$150", status: "Paid" },
        { id: "CLM-002", date: "2025-10-02", reason: "Emergency Room", amount: "$1,200", status: "Pending" }
      ],
      coverageLimits: {
        hospitalStay: "$5,000/day",
        prescription: "$500/year",
        specialist: "$100 co-pay"
      },
      gapAnalysis: {
        score: 85,
        gaps: ["Dental coverage is minimal"],
        proposals: ["Add Dental Plus for $20/mo"]
      }
    }
  },
  {
    id: 2,
    type: "Auto",
    provider: "Geico",
    policyNumber: "AU-992811",
    coverage: "$50,000",
    expiry: "2025-06-15",
    premium: "$120/mo",
    icon: Car,
    color: "text-blue-500 bg-blue-50",
    status: "Active",
    details: {
      pendingPayments: 120,
      lastPayment: "2025-10-15",
      nextPaymentDue: "2025-11-15",
      beneficiaries: ["Self"],
      claims: [],
      coverageLimits: {
        liability: "$50,000",
        comprehensive: "$500 deductible",
        collision: "$500 deductible"
      },
      gapAnalysis: {
        score: 60,
        gaps: ["Low liability limit"],
        proposals: ["Increase liability to $100k for $10/mo"]
      }
    }
  },
  {
    id: 3,
    type: "Home",
    provider: "State Farm",
    policyNumber: "HO-112233",
    coverage: "$750,000",
    expiry: "2025-09-01",
    premium: "$180/mo",
    icon: Home,
    color: "text-amber-500 bg-amber-50",
    status: "Review Needed",
    details: {
      pendingPayments: 0,
      lastPayment: "2025-11-01",
      nextPaymentDue: "2025-12-01",
      beneficiaries: ["Jane Doe (Spouse)"],
      claims: [
         { id: "CLM-HOME-01", date: "2024-05-20", reason: "Storm Damage", amount: "$2,500", status: "Paid" }
      ],
      coverageLimits: {
        dwelling: "$750,000",
        personalProperty: "$100,000",
        liability: "$300,000"
      },
      gapAnalysis: {
        score: 90,
        gaps: [],
        proposals: []
      }
    }
  },
  {
    id: 4,
    type: "Life",
    provider: "Prudential",
    policyNumber: "LF-445566",
    coverage: "$1,000,000",
    expiry: "2030-01-01",
    premium: "$90/mo",
    icon: Shield,
    color: "text-emerald-500 bg-emerald-50",
    status: "Active",
    details: {
      pendingPayments: 0,
      lastPayment: "2025-11-01",
      nextPaymentDue: "2025-12-01",
      beneficiaries: ["Jane Doe (Spouse)", "Timmy Doe (Child)"],
      claims: [],
      coverageLimits: {
        deathBenefit: "$1,000,000"
      },
      gapAnalysis: {
        score: 75,
        gaps: ["Term expires in 5 years"],
        proposals: ["Convert to Whole Life"]
      }
    }
  }
];

export const appointments = [
  {
    id: 1,
    doctor: "Dr. Sarah Smith",
    specialty: "Cardiologist",
    date: "2025-11-28",
    time: "10:00 AM",
    location: "City Heart Center",
    type: "Checkup"
  },
  {
    id: 2,
    doctor: "Dr. James Wilson",
    specialty: "Dentist",
    date: "2025-12-05",
    time: "2:30 PM",
    location: "Bright Smiles Clinic",
    type: "Cleaning"
  }
];

export const analysisData = [
  { category: "Health", coverage: 85, risk: 40, gap: 0 },
  { category: "Auto", coverage: 60, risk: 70, gap: 10 },
  { category: "Home", coverage: 90, risk: 30, gap: 0 },
  { category: "Life", coverage: 75, risk: 50, gap: 0 },
  { category: "Disability", coverage: 20, risk: 60, gap: 40 },
];

export const notifications = [
  {
    id: 1,
    title: "Premium Due Soon",
    message: "Your Auto Insurance premium is due in 5 days.",
    type: "warning",
    date: "Today"
  },
  {
    id: 2,
    title: "Policy Updated",
    message: "Your Health Insurance coverage terms have been updated.",
    type: "info",
    date: "Yesterday"
  }
];
