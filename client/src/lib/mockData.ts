import { Shield, Heart, Car, Home, Stethoscope, AlertCircle } from "lucide-react";

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
    status: "Active"
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
    status: "Active"
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
    status: "Review Needed"
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
    status: "Active"
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
