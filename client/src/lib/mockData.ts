import { Shield, Heart, Car, Home, Stethoscope, AlertCircle, Dog, Globe, Briefcase, FileText, FileCheck, FileBarChart } from "lucide-react";

export const policies = [
  {
    id: 1,
    type: "Health",
    productName: "NN Orange Health Premium",
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
    vehicleReg: null,
    groupRegistryNumber: null,
    groupInsuranceDate: null,
    uploadedDocs: ["Policy Schedule 2025.pdf", "Medical Network List.pdf"],
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
    productName: "Generali Full Kasko Premium",
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
    vehicleReg: "YZA-1234",
    groupRegistryNumber: null,
    groupInsuranceDate: null,
    uploadedDocs: ["Green Card 2025.pdf", "Vehicle Registration.pdf"],
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
    productName: "Ergo Home Complete Protection",
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
    vehicleReg: null,
    groupRegistryNumber: null,
    groupInsuranceDate: null,
    uploadedDocs: ["Home Insurance Schedule.pdf", "Property Valuation.pdf"],
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
    productName: "Ethniki Unit-Linked Pension Plan",
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
    vehicleReg: null,
    groupRegistryNumber: "GRP-ETH-2015-001",
    groupInsuranceDate: "2015-01-01",
    uploadedDocs: ["Life Policy Contract.pdf", "Fund Allocation Statement.pdf", "Tax Certificate 2024.pdf"],
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
    productName: "Ergo Pet Care Plus",
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
    vehicleReg: null,
    groupRegistryNumber: null,
    groupInsuranceDate: null,
    uploadedDocs: ["Pet Vaccination Record.pdf"],
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

// ==================== APPOINTMENT SERVICE TYPES ====================
// Comprehensive appointment types per policy category with required fields

export interface AppointmentServiceType {
  id: string;
  nameKey: string; // i18n translation key
  descriptionKey: string;
  urgencyLevels: ("routine" | "urgent" | "emergency")[];
  requiredFields: RequiredField[];
  documentationRequired: string[]; // i18n keys for required docs
  estimatedDuration: string; // e.g., "30min", "1-2hrs"
}

export interface RequiredField {
  id: string;
  labelKey: string; // i18n translation key
  type: "text" | "date" | "select" | "textarea" | "file" | "checkbox" | "phone";
  required: boolean;
  options?: { value: string; labelKey: string }[]; // for select type
  placeholder?: string;
  validation?: string; // regex pattern
}

export const appointmentServiceTypes: Record<string, AppointmentServiceType[]> = {
  Health: [
    {
      id: "health-preauth",
      nameKey: "appointmentTypes.health.preauth.name",
      descriptionKey: "appointmentTypes.health.preauth.description",
      urgencyLevels: ["routine", "urgent"],
      estimatedDuration: "2-3 days",
      requiredFields: [
        { id: "hospitalName", labelKey: "fields.hospitalName", type: "text", required: true },
        { id: "admissionDate", labelKey: "fields.admissionDate", type: "date", required: true },
        { id: "diagnosis", labelKey: "fields.diagnosis", type: "text", required: true },
        { id: "treatmentType", labelKey: "fields.treatmentType", type: "select", required: true, options: [
          { value: "inpatient", labelKey: "fields.options.inpatient" },
          { value: "outpatient", labelKey: "fields.options.outpatient" },
          { value: "daycase", labelKey: "fields.options.daycase" }
        ]},
        { id: "estimatedCost", labelKey: "fields.estimatedCost", type: "text", required: false },
        { id: "referringPhysician", labelKey: "fields.referringPhysician", type: "text", required: true }
      ],
      documentationRequired: ["docs.referralLetter", "docs.medicalReport"]
    },
    {
      id: "health-specialist",
      nameKey: "appointmentTypes.health.specialist.name",
      descriptionKey: "appointmentTypes.health.specialist.description",
      urgencyLevels: ["routine", "urgent"],
      estimatedDuration: "30-60min",
      requiredFields: [
        { id: "specialtyType", labelKey: "fields.specialtyType", type: "select", required: true, options: [
          { value: "cardiology", labelKey: "fields.options.cardiology" },
          { value: "orthopedics", labelKey: "fields.options.orthopedics" },
          { value: "dermatology", labelKey: "fields.options.dermatology" },
          { value: "neurology", labelKey: "fields.options.neurology" },
          { value: "gastro", labelKey: "fields.options.gastroenterology" },
          { value: "ophthalmology", labelKey: "fields.options.ophthalmology" },
          { value: "ent", labelKey: "fields.options.ent" },
          { value: "urology", labelKey: "fields.options.urology" }
        ]},
        { id: "symptoms", labelKey: "fields.symptoms", type: "textarea", required: true },
        { id: "previousTreatments", labelKey: "fields.previousTreatments", type: "textarea", required: false }
      ],
      documentationRequired: ["docs.referralLetter"]
    },
    {
      id: "health-diagnostic",
      nameKey: "appointmentTypes.health.diagnostic.name",
      descriptionKey: "appointmentTypes.health.diagnostic.description",
      urgencyLevels: ["routine", "urgent"],
      estimatedDuration: "1-3hrs",
      requiredFields: [
        { id: "testType", labelKey: "fields.testType", type: "select", required: true, options: [
          { value: "bloodwork", labelKey: "fields.options.bloodwork" },
          { value: "mri", labelKey: "fields.options.mri" },
          { value: "ctscan", labelKey: "fields.options.ctscan" },
          { value: "xray", labelKey: "fields.options.xray" },
          { value: "ultrasound", labelKey: "fields.options.ultrasound" },
          { value: "ecg", labelKey: "fields.options.ecg" }
        ]},
        { id: "fasting", labelKey: "fields.fastingRequired", type: "checkbox", required: false },
        { id: "referringDoctor", labelKey: "fields.referringPhysician", type: "text", required: true }
      ],
      documentationRequired: ["docs.doctorPrescription"]
    },
    {
      id: "health-surgery",
      nameKey: "appointmentTypes.health.surgery.name",
      descriptionKey: "appointmentTypes.health.surgery.description",
      urgencyLevels: ["routine", "urgent", "emergency"],
      estimatedDuration: "5-10 days",
      requiredFields: [
        { id: "surgeryType", labelKey: "fields.surgeryType", type: "text", required: true },
        { id: "surgeon", labelKey: "fields.surgeonName", type: "text", required: true },
        { id: "hospital", labelKey: "fields.hospitalName", type: "text", required: true },
        { id: "scheduledDate", labelKey: "fields.scheduledDate", type: "date", required: true },
        { id: "estimatedStay", labelKey: "fields.estimatedStay", type: "text", required: false }
      ],
      documentationRequired: ["docs.surgicalPlan", "docs.preOpTests", "docs.anesthesiaConsent"]
    },
    {
      id: "health-secondopinion",
      nameKey: "appointmentTypes.health.secondOpinion.name",
      descriptionKey: "appointmentTypes.health.secondOpinion.description",
      urgencyLevels: ["routine"],
      estimatedDuration: "45-60min",
      requiredFields: [
        { id: "currentDiagnosis", labelKey: "fields.currentDiagnosis", type: "text", required: true },
        { id: "currentTreatment", labelKey: "fields.currentTreatment", type: "textarea", required: true },
        { id: "concernsQuestions", labelKey: "fields.concernsQuestions", type: "textarea", required: false }
      ],
      documentationRequired: ["docs.medicalRecords", "docs.testResults", "docs.currentPrescriptions"]
    },
    {
      id: "health-reimbursement",
      nameKey: "appointmentTypes.health.reimbursement.name",
      descriptionKey: "appointmentTypes.health.reimbursement.description",
      urgencyLevels: ["routine"],
      estimatedDuration: "15-30 days",
      requiredFields: [
        { id: "treatmentDate", labelKey: "fields.treatmentDate", type: "date", required: true },
        { id: "providerName", labelKey: "fields.providerName", type: "text", required: true },
        { id: "totalAmount", labelKey: "fields.totalAmount", type: "text", required: true },
        { id: "bankAccount", labelKey: "fields.bankAccount", type: "text", required: true }
      ],
      documentationRequired: ["docs.invoices", "docs.receipts", "docs.medicalReport"]
    },
    {
      id: "health-coverage",
      nameKey: "appointmentTypes.health.coverage.name",
      descriptionKey: "appointmentTypes.health.coverage.description",
      urgencyLevels: ["routine"],
      estimatedDuration: "1-2 days",
      requiredFields: [
        { id: "treatmentDescription", labelKey: "fields.treatmentDescription", type: "textarea", required: true },
        { id: "estimatedCost", labelKey: "fields.estimatedCost", type: "text", required: false }
      ],
      documentationRequired: []
    },
    {
      id: "health-wellness",
      nameKey: "appointmentTypes.health.wellness.name",
      descriptionKey: "appointmentTypes.health.wellness.description",
      urgencyLevels: ["routine"],
      estimatedDuration: "2-4hrs",
      requiredFields: [
        { id: "checkupType", labelKey: "fields.checkupType", type: "select", required: true, options: [
          { value: "annual", labelKey: "fields.options.annualCheckup" },
          { value: "executive", labelKey: "fields.options.executiveCheckup" },
          { value: "cardiac", labelKey: "fields.options.cardiacScreening" },
          { value: "cancer", labelKey: "fields.options.cancerScreening" }
        ]},
        { id: "preferredDate", labelKey: "fields.preferredDate", type: "date", required: true }
      ],
      documentationRequired: []
    },
    {
      id: "health-mental",
      nameKey: "appointmentTypes.health.mental.name",
      descriptionKey: "appointmentTypes.health.mental.description",
      urgencyLevels: ["routine", "urgent"],
      estimatedDuration: "50min",
      requiredFields: [
        { id: "sessionType", labelKey: "fields.sessionType", type: "select", required: true, options: [
          { value: "initial", labelKey: "fields.options.initialConsult" },
          { value: "followup", labelKey: "fields.options.followUp" },
          { value: "crisis", labelKey: "fields.options.crisisIntervention" }
        ]},
        { id: "preferredGender", labelKey: "fields.preferredTherapistGender", type: "select", required: false, options: [
          { value: "any", labelKey: "fields.options.noPreference" },
          { value: "male", labelKey: "fields.options.male" },
          { value: "female", labelKey: "fields.options.female" }
        ]}
      ],
      documentationRequired: []
    },
    {
      id: "health-chronic",
      nameKey: "appointmentTypes.health.chronic.name",
      descriptionKey: "appointmentTypes.health.chronic.description",
      urgencyLevels: ["routine"],
      estimatedDuration: "30-45min",
      requiredFields: [
        { id: "condition", labelKey: "fields.chronicCondition", type: "text", required: true },
        { id: "currentMedications", labelKey: "fields.currentMedications", type: "textarea", required: true },
        { id: "lastVisitDate", labelKey: "fields.lastVisitDate", type: "date", required: false }
      ],
      documentationRequired: ["docs.medicationList", "docs.previousLabResults"]
    }
  ],
  Auto: [
    {
      id: "auto-accident",
      nameKey: "appointmentTypes.auto.accident.name",
      descriptionKey: "appointmentTypes.auto.accident.description",
      urgencyLevels: ["urgent", "emergency"],
      estimatedDuration: "1-2hrs",
      requiredFields: [
        { id: "accidentDate", labelKey: "fields.accidentDate", type: "date", required: true },
        { id: "accidentLocation", labelKey: "fields.accidentLocation", type: "text", required: true },
        { id: "accidentDescription", labelKey: "fields.accidentDescription", type: "textarea", required: true },
        { id: "thirdPartyInvolved", labelKey: "fields.thirdPartyInvolved", type: "checkbox", required: false },
        { id: "policeReportNumber", labelKey: "fields.policeReportNumber", type: "text", required: false },
        { id: "injuries", labelKey: "fields.anyInjuries", type: "checkbox", required: false }
      ],
      documentationRequired: ["docs.accidentPhotos", "docs.policeReport", "docs.accidentDeclaration"]
    },
    {
      id: "auto-glass",
      nameKey: "appointmentTypes.auto.glass.name",
      descriptionKey: "appointmentTypes.auto.glass.description",
      urgencyLevels: ["routine", "urgent"],
      estimatedDuration: "1-2hrs",
      requiredFields: [
        { id: "glassType", labelKey: "fields.glassType", type: "select", required: true, options: [
          { value: "windshield", labelKey: "fields.options.windshield" },
          { value: "rearWindow", labelKey: "fields.options.rearWindow" },
          { value: "sideWindow", labelKey: "fields.options.sideWindow" },
          { value: "mirror", labelKey: "fields.options.mirror" }
        ]},
        { id: "damageDescription", labelKey: "fields.damageDescription", type: "textarea", required: true },
        { id: "preferredWorkshop", labelKey: "fields.preferredWorkshop", type: "text", required: false }
      ],
      documentationRequired: ["docs.damagePhotos"]
    },
    {
      id: "auto-theft",
      nameKey: "appointmentTypes.auto.theft.name",
      descriptionKey: "appointmentTypes.auto.theft.description",
      urgencyLevels: ["emergency"],
      estimatedDuration: "Immediate",
      requiredFields: [
        { id: "theftDate", labelKey: "fields.theftDate", type: "date", required: true },
        { id: "theftLocation", labelKey: "fields.theftLocation", type: "text", required: true },
        { id: "policeReportNumber", labelKey: "fields.policeReportNumber", type: "text", required: true },
        { id: "lastSeenCondition", labelKey: "fields.lastSeenCondition", type: "textarea", required: true },
        { id: "vehicleKeys", labelKey: "fields.keysInPossession", type: "checkbox", required: true }
      ],
      documentationRequired: ["docs.policeReport", "docs.vehicleRegistration", "docs.vehicleKeys"]
    },
    {
      id: "auto-roadside",
      nameKey: "appointmentTypes.auto.roadside.name",
      descriptionKey: "appointmentTypes.auto.roadside.description",
      urgencyLevels: ["routine"],
      estimatedDuration: "30min",
      requiredFields: [
        { id: "incidentType", labelKey: "fields.incidentType", type: "select", required: true, options: [
          { value: "breakdown", labelKey: "fields.options.breakdown" },
          { value: "flatTire", labelKey: "fields.options.flatTire" },
          { value: "outOfFuel", labelKey: "fields.options.outOfFuel" },
          { value: "batteryDead", labelKey: "fields.options.batteryDead" },
          { value: "lockedOut", labelKey: "fields.options.lockedOut" }
        ]},
        { id: "serviceDate", labelKey: "fields.serviceDate", type: "date", required: true },
        { id: "satisfactionRating", labelKey: "fields.satisfactionRating", type: "select", required: false, options: [
          { value: "5", labelKey: "fields.options.excellent" },
          { value: "4", labelKey: "fields.options.good" },
          { value: "3", labelKey: "fields.options.average" },
          { value: "2", labelKey: "fields.options.poor" },
          { value: "1", labelKey: "fields.options.veryPoor" }
        ]}
      ],
      documentationRequired: []
    },
    {
      id: "auto-valuation",
      nameKey: "appointmentTypes.auto.valuation.name",
      descriptionKey: "appointmentTypes.auto.valuation.description",
      urgencyLevels: ["routine"],
      estimatedDuration: "1hr",
      requiredFields: [
        { id: "valuationType", labelKey: "fields.valuationType", type: "select", required: true, options: [
          { value: "preRenewal", labelKey: "fields.options.preRenewal" },
          { value: "claim", labelKey: "fields.options.claimRelated" },
          { value: "sale", labelKey: "fields.options.vehicleSale" }
        ]},
        { id: "currentMileage", labelKey: "fields.currentMileage", type: "text", required: true },
        { id: "modifications", labelKey: "fields.vehicleModifications", type: "textarea", required: false }
      ],
      documentationRequired: ["docs.vehiclePhotos", "docs.serviceHistory"]
    },
    {
      id: "auto-modification",
      nameKey: "appointmentTypes.auto.modification.name",
      descriptionKey: "appointmentTypes.auto.modification.description",
      urgencyLevels: ["routine"],
      estimatedDuration: "2-3 days",
      requiredFields: [
        { id: "modificationType", labelKey: "fields.modificationType", type: "select", required: true, options: [
          { value: "addDriver", labelKey: "fields.options.addDriver" },
          { value: "removeDriver", labelKey: "fields.options.removeDriver" },
          { value: "changeCoverage", labelKey: "fields.options.changeCoverage" },
          { value: "changeVehicle", labelKey: "fields.options.changeVehicle" }
        ]},
        { id: "effectiveDate", labelKey: "fields.effectiveDate", type: "date", required: true },
        { id: "details", labelKey: "fields.modificationDetails", type: "textarea", required: true }
      ],
      documentationRequired: ["docs.driverLicense", "docs.vehicleRegistration"]
    },
    {
      id: "auto-greencard",
      nameKey: "appointmentTypes.auto.greencard.name",
      descriptionKey: "appointmentTypes.auto.greencard.description",
      urgencyLevels: ["routine", "urgent"],
      estimatedDuration: "1-2 days",
      requiredFields: [
        { id: "travelCountries", labelKey: "fields.travelCountries", type: "text", required: true },
        { id: "travelStartDate", labelKey: "fields.travelStartDate", type: "date", required: true },
        { id: "travelEndDate", labelKey: "fields.travelEndDate", type: "date", required: true }
      ],
      documentationRequired: []
    },
    {
      id: "auto-bonusmalus",
      nameKey: "appointmentTypes.auto.bonusMalus.name",
      descriptionKey: "appointmentTypes.auto.bonusMalus.description",
      urgencyLevels: ["routine"],
      estimatedDuration: "5-10 days",
      requiredFields: [
        { id: "disputeReason", labelKey: "fields.disputeReason", type: "textarea", required: true },
        { id: "claimReference", labelKey: "fields.claimReference", type: "text", required: false },
        { id: "previousInsurer", labelKey: "fields.previousInsurer", type: "text", required: false }
      ],
      documentationRequired: ["docs.previousPolicyDocs", "docs.claimsHistory"]
    },
    {
      id: "auto-legal",
      nameKey: "appointmentTypes.auto.legal.name",
      descriptionKey: "appointmentTypes.auto.legal.description",
      urgencyLevels: ["routine", "urgent"],
      estimatedDuration: "1hr",
      requiredFields: [
        { id: "legalMatter", labelKey: "fields.legalMatter", type: "select", required: true, options: [
          { value: "liability", labelKey: "fields.options.liabilityDispute" },
          { value: "compensation", labelKey: "fields.options.compensationClaim" },
          { value: "criminal", labelKey: "fields.options.criminalDefense" }
        ]},
        { id: "incidentDescription", labelKey: "fields.incidentDescription", type: "textarea", required: true },
        { id: "courtDate", labelKey: "fields.courtDate", type: "date", required: false }
      ],
      documentationRequired: ["docs.policeReport", "docs.legalDocuments"]
    },
    {
      id: "auto-totalloss",
      nameKey: "appointmentTypes.auto.totalLoss.name",
      descriptionKey: "appointmentTypes.auto.totalLoss.description",
      urgencyLevels: ["urgent"],
      estimatedDuration: "10-20 days",
      requiredFields: [
        { id: "claimNumber", labelKey: "fields.claimNumber", type: "text", required: true },
        { id: "preferredSettlement", labelKey: "fields.preferredSettlement", type: "select", required: true, options: [
          { value: "cashPayout", labelKey: "fields.options.cashPayout" },
          { value: "replacement", labelKey: "fields.options.vehicleReplacement" }
        ]},
        { id: "vehicleLocation", labelKey: "fields.vehicleLocation", type: "text", required: true }
      ],
      documentationRequired: ["docs.vehicleRegistration", "docs.vehicleKeys", "docs.purchaseInvoice"]
    }
  ],
  Home: [
    {
      id: "home-damage",
      nameKey: "appointmentTypes.home.damage.name",
      descriptionKey: "appointmentTypes.home.damage.description",
      urgencyLevels: ["urgent", "emergency"],
      estimatedDuration: "1-2hrs",
      requiredFields: [
        { id: "damageDate", labelKey: "fields.damageDate", type: "date", required: true },
        { id: "damageType", labelKey: "fields.damageType", type: "select", required: true, options: [
          { value: "structural", labelKey: "fields.options.structural" },
          { value: "electrical", labelKey: "fields.options.electrical" },
          { value: "plumbing", labelKey: "fields.options.plumbing" },
          { value: "appliance", labelKey: "fields.options.appliance" }
        ]},
        { id: "affectedAreas", labelKey: "fields.affectedAreas", type: "textarea", required: true },
        { id: "estimatedDamage", labelKey: "fields.estimatedDamage", type: "text", required: false }
      ],
      documentationRequired: ["docs.damagePhotos", "docs.repairEstimates"]
    },
    {
      id: "home-water",
      nameKey: "appointmentTypes.home.water.name",
      descriptionKey: "appointmentTypes.home.water.description",
      urgencyLevels: ["urgent", "emergency"],
      estimatedDuration: "2-4hrs",
      requiredFields: [
        { id: "incidentDate", labelKey: "fields.incidentDate", type: "date", required: true },
        { id: "waterSource", labelKey: "fields.waterSource", type: "select", required: true, options: [
          { value: "pipe", labelKey: "fields.options.burstPipe" },
          { value: "roof", labelKey: "fields.options.roofLeak" },
          { value: "appliance", labelKey: "fields.options.applianceLeak" },
          { value: "flood", labelKey: "fields.options.flooding" },
          { value: "neighbor", labelKey: "fields.options.neighborProperty" }
        ]},
        { id: "affectedRooms", labelKey: "fields.affectedRooms", type: "textarea", required: true },
        { id: "waterStopped", labelKey: "fields.waterStopped", type: "checkbox", required: true }
      ],
      documentationRequired: ["docs.damagePhotos", "docs.damageVideos"]
    },
    {
      id: "home-fire",
      nameKey: "appointmentTypes.home.fire.name",
      descriptionKey: "appointmentTypes.home.fire.description",
      urgencyLevels: ["emergency"],
      estimatedDuration: "1-3 days",
      requiredFields: [
        { id: "incidentDate", labelKey: "fields.incidentDate", type: "date", required: true },
        { id: "fireOrigin", labelKey: "fields.fireOrigin", type: "text", required: true },
        { id: "fireDepartmentCalled", labelKey: "fields.fireDepartmentCalled", type: "checkbox", required: true },
        { id: "propertyHabitable", labelKey: "fields.propertyHabitable", type: "checkbox", required: true },
        { id: "alternativeAccommodation", labelKey: "fields.alternativeAccommodationNeeded", type: "checkbox", required: false }
      ],
      documentationRequired: ["docs.fireReport", "docs.damagePhotos", "docs.inventoryList"]
    },
    {
      id: "home-theft",
      nameKey: "appointmentTypes.home.theft.name",
      descriptionKey: "appointmentTypes.home.theft.description",
      urgencyLevels: ["urgent"],
      estimatedDuration: "2-3 days",
      requiredFields: [
        { id: "theftDate", labelKey: "fields.theftDate", type: "date", required: true },
        { id: "policeReportNumber", labelKey: "fields.policeReportNumber", type: "text", required: true },
        { id: "stolenItems", labelKey: "fields.stolenItems", type: "textarea", required: true },
        { id: "forcedEntry", labelKey: "fields.forcedEntry", type: "checkbox", required: true },
        { id: "securitySystem", labelKey: "fields.securitySystemActive", type: "checkbox", required: false }
      ],
      documentationRequired: ["docs.policeReport", "docs.itemReceipts", "docs.damagePhotos"]
    },
    {
      id: "home-natural",
      nameKey: "appointmentTypes.home.natural.name",
      descriptionKey: "appointmentTypes.home.natural.description",
      urgencyLevels: ["urgent", "emergency"],
      estimatedDuration: "3-5 days",
      requiredFields: [
        { id: "eventDate", labelKey: "fields.eventDate", type: "date", required: true },
        { id: "eventType", labelKey: "fields.eventType", type: "select", required: true, options: [
          { value: "earthquake", labelKey: "fields.options.earthquake" },
          { value: "storm", labelKey: "fields.options.storm" },
          { value: "hail", labelKey: "fields.options.hail" },
          { value: "flood", labelKey: "fields.options.flood" },
          { value: "lightning", labelKey: "fields.options.lightning" }
        ]},
        { id: "damageDescription", labelKey: "fields.damageDescription", type: "textarea", required: true },
        { id: "propertyHabitable", labelKey: "fields.propertyHabitable", type: "checkbox", required: true }
      ],
      documentationRequired: ["docs.damagePhotos", "docs.weatherReport"]
    },
    {
      id: "home-liability",
      nameKey: "appointmentTypes.home.liability.name",
      descriptionKey: "appointmentTypes.home.liability.description",
      urgencyLevels: ["routine", "urgent"],
      estimatedDuration: "1-2 days",
      requiredFields: [
        { id: "incidentDate", labelKey: "fields.incidentDate", type: "date", required: true },
        { id: "injuredParty", labelKey: "fields.injuredPartyName", type: "text", required: true },
        { id: "injuryDescription", labelKey: "fields.injuryDescription", type: "textarea", required: true },
        { id: "witnessPresent", labelKey: "fields.witnessPresent", type: "checkbox", required: false }
      ],
      documentationRequired: ["docs.incidentReport", "docs.witnessStatements"]
    },
    {
      id: "home-emergency",
      nameKey: "appointmentTypes.home.emergency.name",
      descriptionKey: "appointmentTypes.home.emergency.description",
      urgencyLevels: ["emergency"],
      estimatedDuration: "2-4hrs",
      requiredFields: [
        { id: "emergencyType", labelKey: "fields.emergencyType", type: "select", required: true, options: [
          { value: "plumbing", labelKey: "fields.options.plumbingEmergency" },
          { value: "electrical", labelKey: "fields.options.electricalEmergency" },
          { value: "lockout", labelKey: "fields.options.lockout" },
          { value: "heating", labelKey: "fields.options.heatingFailure" }
        ]},
        { id: "urgencyLevel", labelKey: "fields.urgencyLevel", type: "select", required: true, options: [
          { value: "immediate", labelKey: "fields.options.immediate" },
          { value: "today", labelKey: "fields.options.withinToday" },
          { value: "24hrs", labelKey: "fields.options.within24hrs" }
        ]}
      ],
      documentationRequired: []
    },
    {
      id: "home-valuation",
      nameKey: "appointmentTypes.home.valuation.name",
      descriptionKey: "appointmentTypes.home.valuation.description",
      urgencyLevels: ["routine"],
      estimatedDuration: "2-3hrs",
      requiredFields: [
        { id: "valuationReason", labelKey: "fields.valuationReason", type: "select", required: true, options: [
          { value: "renewal", labelKey: "fields.options.policyRenewal" },
          { value: "claim", labelKey: "fields.options.claimRelated" },
          { value: "update", labelKey: "fields.options.coverageUpdate" }
        ]},
        { id: "lastValuationDate", labelKey: "fields.lastValuationDate", type: "date", required: false },
        { id: "majorChanges", labelKey: "fields.majorChanges", type: "textarea", required: false }
      ],
      documentationRequired: ["docs.propertyDeed", "docs.renovationReceipts"]
    },
    {
      id: "home-security",
      nameKey: "appointmentTypes.home.security.name",
      descriptionKey: "appointmentTypes.home.security.description",
      urgencyLevels: ["routine"],
      estimatedDuration: "3-4hrs",
      requiredFields: [
        { id: "installationType", labelKey: "fields.installationType", type: "select", required: true, options: [
          { value: "alarm", labelKey: "fields.options.alarmSystem" },
          { value: "cctv", labelKey: "fields.options.cctvCameras" },
          { value: "smartLocks", labelKey: "fields.options.smartLocks" },
          { value: "complete", labelKey: "fields.options.completeSystem" }
        ]},
        { id: "preferredDate", labelKey: "fields.preferredDate", type: "date", required: true }
      ],
      documentationRequired: []
    },
    {
      id: "home-contents",
      nameKey: "appointmentTypes.home.contents.name",
      descriptionKey: "appointmentTypes.home.contents.description",
      urgencyLevels: ["routine"],
      estimatedDuration: "1-2hrs",
      requiredFields: [
        { id: "updateType", labelKey: "fields.updateType", type: "select", required: true, options: [
          { value: "addItems", labelKey: "fields.options.addItems" },
          { value: "removeItems", labelKey: "fields.options.removeItems" },
          { value: "fullReview", labelKey: "fields.options.fullReview" }
        ]},
        { id: "itemsDescription", labelKey: "fields.itemsDescription", type: "textarea", required: true },
        { id: "estimatedValue", labelKey: "fields.estimatedValue", type: "text", required: false }
      ],
      documentationRequired: ["docs.itemPhotos", "docs.purchaseReceipts", "docs.appraisals"]
    }
  ],
  Life: [
    {
      id: "life-beneficiary",
      nameKey: "appointmentTypes.life.beneficiary.name",
      descriptionKey: "appointmentTypes.life.beneficiary.description",
      urgencyLevels: ["routine"],
      estimatedDuration: "3-5 days",
      requiredFields: [
        { id: "changeType", labelKey: "fields.changeType", type: "select", required: true, options: [
          { value: "add", labelKey: "fields.options.addBeneficiary" },
          { value: "remove", labelKey: "fields.options.removeBeneficiary" },
          { value: "update", labelKey: "fields.options.updateAllocation" }
        ]},
        { id: "beneficiaryName", labelKey: "fields.beneficiaryName", type: "text", required: true },
        { id: "relationship", labelKey: "fields.relationship", type: "select", required: true, options: [
          { value: "spouse", labelKey: "fields.options.spouse" },
          { value: "child", labelKey: "fields.options.child" },
          { value: "parent", labelKey: "fields.options.parent" },
          { value: "sibling", labelKey: "fields.options.sibling" },
          { value: "other", labelKey: "fields.options.other" }
        ]},
        { id: "allocationPercent", labelKey: "fields.allocationPercent", type: "text", required: true }
      ],
      documentationRequired: ["docs.identityDocument", "docs.signedForm"]
    },
    {
      id: "life-loan",
      nameKey: "appointmentTypes.life.loan.name",
      descriptionKey: "appointmentTypes.life.loan.description",
      urgencyLevels: ["routine"],
      estimatedDuration: "5-7 days",
      requiredFields: [
        { id: "loanAmount", labelKey: "fields.loanAmount", type: "text", required: true },
        { id: "purpose", labelKey: "fields.loanPurpose", type: "textarea", required: false },
        { id: "bankAccount", labelKey: "fields.bankAccount", type: "text", required: true }
      ],
      documentationRequired: ["docs.identityDocument", "docs.bankStatement"]
    },
    {
      id: "life-underwriting",
      nameKey: "appointmentTypes.life.underwriting.name",
      descriptionKey: "appointmentTypes.life.underwriting.description",
      urgencyLevels: ["routine"],
      estimatedDuration: "10-15 days",
      requiredFields: [
        { id: "reviewReason", labelKey: "fields.reviewReason", type: "select", required: true, options: [
          { value: "healthChange", labelKey: "fields.options.healthChange" },
          { value: "occupation", labelKey: "fields.options.occupationChange" },
          { value: "lifestyle", labelKey: "fields.options.lifestyleChange" }
        ]},
        { id: "details", labelKey: "fields.changeDetails", type: "textarea", required: true }
      ],
      documentationRequired: ["docs.medicalReport", "docs.doctorLetter"]
    },
    {
      id: "life-payment",
      nameKey: "appointmentTypes.life.payment.name",
      descriptionKey: "appointmentTypes.life.payment.description",
      urgencyLevels: ["routine"],
      estimatedDuration: "2-3 days",
      requiredFields: [
        { id: "changeType", labelKey: "fields.changeType", type: "select", required: true, options: [
          { value: "frequency", labelKey: "fields.options.changeFrequency" },
          { value: "method", labelKey: "fields.options.changeMethod" },
          { value: "suspend", labelKey: "fields.options.suspendPayments" }
        ]},
        { id: "effectiveDate", labelKey: "fields.effectiveDate", type: "date", required: true },
        { id: "newDetails", labelKey: "fields.newPaymentDetails", type: "textarea", required: false }
      ],
      documentationRequired: ["docs.bankDetails"]
    },
    {
      id: "life-increase",
      nameKey: "appointmentTypes.life.increase.name",
      descriptionKey: "appointmentTypes.life.increase.description",
      urgencyLevels: ["routine"],
      estimatedDuration: "10-20 days",
      requiredFields: [
        { id: "currentSum", labelKey: "fields.currentSumAssured", type: "text", required: true },
        { id: "requestedSum", labelKey: "fields.requestedSumAssured", type: "text", required: true },
        { id: "reason", labelKey: "fields.increaseReason", type: "textarea", required: false }
      ],
      documentationRequired: ["docs.financialStatement", "docs.medicalQuestionnaire"]
    },
    {
      id: "life-surrender",
      nameKey: "appointmentTypes.life.surrender.name",
      descriptionKey: "appointmentTypes.life.surrender.description",
      urgencyLevels: ["routine"],
      estimatedDuration: "15-20 days",
      requiredFields: [
        { id: "surrenderReason", labelKey: "fields.surrenderReason", type: "textarea", required: true },
        { id: "bankAccount", labelKey: "fields.bankAccount", type: "text", required: true },
        { id: "confirmUnderstanding", labelKey: "fields.confirmUnderstanding", type: "checkbox", required: true }
      ],
      documentationRequired: ["docs.identityDocument", "docs.signedSurrenderForm"]
    },
    {
      id: "life-maturity",
      nameKey: "appointmentTypes.life.maturity.name",
      descriptionKey: "appointmentTypes.life.maturity.description",
      urgencyLevels: ["routine"],
      estimatedDuration: "10-15 days",
      requiredFields: [
        { id: "paymentOption", labelKey: "fields.paymentOption", type: "select", required: true, options: [
          { value: "lumpSum", labelKey: "fields.options.lumpSum" },
          { value: "annuity", labelKey: "fields.options.annuity" },
          { value: "partial", labelKey: "fields.options.partialWithdrawal" }
        ]},
        { id: "bankAccount", labelKey: "fields.bankAccount", type: "text", required: true }
      ],
      documentationRequired: ["docs.identityDocument", "docs.taxCertificate"]
    },
    {
      id: "life-death",
      nameKey: "appointmentTypes.life.death.name",
      descriptionKey: "appointmentTypes.life.death.description",
      urgencyLevels: ["urgent"],
      estimatedDuration: "20-30 days",
      requiredFields: [
        { id: "dateOfDeath", labelKey: "fields.dateOfDeath", type: "date", required: true },
        { id: "causeOfDeath", labelKey: "fields.causeOfDeath", type: "text", required: true },
        { id: "claimantName", labelKey: "fields.claimantName", type: "text", required: true },
        { id: "claimantRelation", labelKey: "fields.claimantRelation", type: "text", required: true },
        { id: "bankAccount", labelKey: "fields.bankAccount", type: "text", required: true }
      ],
      documentationRequired: ["docs.deathCertificate", "docs.claimantId", "docs.policyDocument"]
    },
    {
      id: "life-tax",
      nameKey: "appointmentTypes.life.tax.name",
      descriptionKey: "appointmentTypes.life.tax.description",
      urgencyLevels: ["routine"],
      estimatedDuration: "3-5 days",
      requiredFields: [
        { id: "taxYear", labelKey: "fields.taxYear", type: "text", required: true },
        { id: "deliveryMethod", labelKey: "fields.deliveryMethod", type: "select", required: true, options: [
          { value: "email", labelKey: "fields.options.email" },
          { value: "post", labelKey: "fields.options.postalMail" },
          { value: "download", labelKey: "fields.options.download" }
        ]}
      ],
      documentationRequired: []
    },
    {
      id: "life-assignment",
      nameKey: "appointmentTypes.life.assignment.name",
      descriptionKey: "appointmentTypes.life.assignment.description",
      urgencyLevels: ["routine"],
      estimatedDuration: "10-15 days",
      requiredFields: [
        { id: "assignmentType", labelKey: "fields.assignmentType", type: "select", required: true, options: [
          { value: "collateral", labelKey: "fields.options.collateral" },
          { value: "absolute", labelKey: "fields.options.absoluteAssignment" }
        ]},
        { id: "assigneeName", labelKey: "fields.assigneeName", type: "text", required: true },
        { id: "assigneeDetails", labelKey: "fields.assigneeDetails", type: "textarea", required: true }
      ],
      documentationRequired: ["docs.assignmentForm", "docs.assigneeId", "docs.loanAgreement"]
    }
  ],
  Travel: [
    {
      id: "travel-emergency",
      nameKey: "appointmentTypes.travel.emergency.name",
      descriptionKey: "appointmentTypes.travel.emergency.description",
      urgencyLevels: ["emergency"],
      estimatedDuration: "Immediate",
      requiredFields: [
        { id: "currentLocation", labelKey: "fields.currentLocation", type: "text", required: true },
        { id: "emergencyType", labelKey: "fields.emergencyType", type: "select", required: true, options: [
          { value: "medical", labelKey: "fields.options.medicalEmergency" },
          { value: "accident", labelKey: "fields.options.accident" },
          { value: "hospitalization", labelKey: "fields.options.hospitalization" }
        ]},
        { id: "symptoms", labelKey: "fields.symptoms", type: "textarea", required: true },
        { id: "localContact", labelKey: "fields.localContact", type: "phone", required: true }
      ],
      documentationRequired: []
    },
    {
      id: "travel-cancellation",
      nameKey: "appointmentTypes.travel.cancellation.name",
      descriptionKey: "appointmentTypes.travel.cancellation.description",
      urgencyLevels: ["routine", "urgent"],
      estimatedDuration: "10-15 days",
      requiredFields: [
        { id: "tripDates", labelKey: "fields.tripDates", type: "text", required: true },
        { id: "cancellationReason", labelKey: "fields.cancellationReason", type: "select", required: true, options: [
          { value: "illness", labelKey: "fields.options.illness" },
          { value: "family", labelKey: "fields.options.familyEmergency" },
          { value: "work", labelKey: "fields.options.workCommitment" },
          { value: "other", labelKey: "fields.options.other" }
        ]},
        { id: "totalCost", labelKey: "fields.totalTripCost", type: "text", required: true },
        { id: "refundReceived", labelKey: "fields.refundReceived", type: "text", required: false }
      ],
      documentationRequired: ["docs.bookingConfirmation", "docs.cancellationProof", "docs.medicalCertificate"]
    },
    {
      id: "travel-luggage",
      nameKey: "appointmentTypes.travel.luggage.name",
      descriptionKey: "appointmentTypes.travel.luggage.description",
      urgencyLevels: ["routine"],
      estimatedDuration: "15-20 days",
      requiredFields: [
        { id: "incidentType", labelKey: "fields.incidentType", type: "select", required: true, options: [
          { value: "lost", labelKey: "fields.options.lostLuggage" },
          { value: "delayed", labelKey: "fields.options.delayedLuggage" },
          { value: "damaged", labelKey: "fields.options.damagedLuggage" }
        ]},
        { id: "airlineReference", labelKey: "fields.airlineReference", type: "text", required: true },
        { id: "contentsDescription", labelKey: "fields.contentsDescription", type: "textarea", required: true },
        { id: "estimatedValue", labelKey: "fields.estimatedValue", type: "text", required: true }
      ],
      documentationRequired: ["docs.airlineReport", "docs.boardingPass", "docs.itemReceipts"]
    },
    {
      id: "travel-delay",
      nameKey: "appointmentTypes.travel.delay.name",
      descriptionKey: "appointmentTypes.travel.delay.description",
      urgencyLevels: ["routine"],
      estimatedDuration: "10-15 days",
      requiredFields: [
        { id: "flightNumber", labelKey: "fields.flightNumber", type: "text", required: true },
        { id: "scheduledTime", labelKey: "fields.scheduledTime", type: "text", required: true },
        { id: "actualTime", labelKey: "fields.actualTime", type: "text", required: true },
        { id: "delayHours", labelKey: "fields.delayHours", type: "text", required: true },
        { id: "expensesIncurred", labelKey: "fields.expensesIncurred", type: "text", required: false }
      ],
      documentationRequired: ["docs.flightDocumentation", "docs.expenseReceipts"]
    },
    {
      id: "travel-repatriation",
      nameKey: "appointmentTypes.travel.repatriation.name",
      descriptionKey: "appointmentTypes.travel.repatriation.description",
      urgencyLevels: ["urgent", "emergency"],
      estimatedDuration: "1-3 days",
      requiredFields: [
        { id: "currentLocation", labelKey: "fields.currentLocation", type: "text", required: true },
        { id: "medicalCondition", labelKey: "fields.medicalCondition", type: "textarea", required: true },
        { id: "hospitalName", labelKey: "fields.hospitalName", type: "text", required: false },
        { id: "attendingPhysician", labelKey: "fields.attendingPhysician", type: "text", required: false },
        { id: "transportType", labelKey: "fields.transportType", type: "select", required: true, options: [
          { value: "airAmbulance", labelKey: "fields.options.airAmbulance" },
          { value: "commercial", labelKey: "fields.options.commercialFlight" },
          { value: "ground", labelKey: "fields.options.groundTransport" }
        ]}
      ],
      documentationRequired: ["docs.medicalReport", "docs.doctorRecommendation"]
    },
    {
      id: "travel-cash",
      nameKey: "appointmentTypes.travel.cash.name",
      descriptionKey: "appointmentTypes.travel.cash.description",
      urgencyLevels: ["urgent"],
      estimatedDuration: "1-2 days",
      requiredFields: [
        { id: "currentLocation", labelKey: "fields.currentLocation", type: "text", required: true },
        { id: "amountNeeded", labelKey: "fields.amountNeeded", type: "text", required: true },
        { id: "reason", labelKey: "fields.cashAdvanceReason", type: "textarea", required: true },
        { id: "collectionMethod", labelKey: "fields.collectionMethod", type: "select", required: true, options: [
          { value: "westernUnion", labelKey: "fields.options.westernUnion" },
          { value: "bankTransfer", labelKey: "fields.options.bankTransfer" },
          { value: "embassy", labelKey: "fields.options.embassy" }
        ]}
      ],
      documentationRequired: ["docs.identityDocument"]
    },
    {
      id: "travel-legal",
      nameKey: "appointmentTypes.travel.legal.name",
      descriptionKey: "appointmentTypes.travel.legal.description",
      urgencyLevels: ["urgent"],
      estimatedDuration: "Varies",
      requiredFields: [
        { id: "currentLocation", labelKey: "fields.currentLocation", type: "text", required: true },
        { id: "legalIssue", labelKey: "fields.legalIssue", type: "textarea", required: true },
        { id: "detainedStatus", labelKey: "fields.detainedStatus", type: "checkbox", required: true },
        { id: "languageAssistance", labelKey: "fields.languageAssistance", type: "checkbox", required: false }
      ],
      documentationRequired: ["docs.passportCopy", "docs.legalDocuments"]
    },
    {
      id: "travel-document",
      nameKey: "appointmentTypes.travel.document.name",
      descriptionKey: "appointmentTypes.travel.document.description",
      urgencyLevels: ["urgent"],
      estimatedDuration: "1-5 days",
      requiredFields: [
        { id: "documentType", labelKey: "fields.documentType", type: "select", required: true, options: [
          { value: "passport", labelKey: "fields.options.passport" },
          { value: "id", labelKey: "fields.options.nationalId" },
          { value: "visa", labelKey: "fields.options.visa" }
        ]},
        { id: "currentLocation", labelKey: "fields.currentLocation", type: "text", required: true },
        { id: "policeReportNumber", labelKey: "fields.policeReportNumber", type: "text", required: false },
        { id: "urgency", labelKey: "fields.urgency", type: "select", required: true, options: [
          { value: "immediate", labelKey: "fields.options.immediate" },
          { value: "24hrs", labelKey: "fields.options.within24hrs" },
          { value: "48hrs", labelKey: "fields.options.within48hrs" }
        ]}
      ],
      documentationRequired: ["docs.policeReport", "docs.passportPhotos"]
    },
    {
      id: "travel-extension",
      nameKey: "appointmentTypes.travel.extension.name",
      descriptionKey: "appointmentTypes.travel.extension.description",
      urgencyLevels: ["routine", "urgent"],
      estimatedDuration: "1-2 days",
      requiredFields: [
        { id: "currentEndDate", labelKey: "fields.currentEndDate", type: "date", required: true },
        { id: "newEndDate", labelKey: "fields.newEndDate", type: "date", required: true },
        { id: "extensionReason", labelKey: "fields.extensionReason", type: "textarea", required: true }
      ],
      documentationRequired: []
    },
    {
      id: "travel-medical",
      nameKey: "appointmentTypes.travel.medical.name",
      descriptionKey: "appointmentTypes.travel.medical.description",
      urgencyLevels: ["routine"],
      estimatedDuration: "15-30 days",
      requiredFields: [
        { id: "treatmentDate", labelKey: "fields.treatmentDate", type: "date", required: true },
        { id: "treatmentLocation", labelKey: "fields.treatmentLocation", type: "text", required: true },
        { id: "diagnosis", labelKey: "fields.diagnosis", type: "text", required: true },
        { id: "totalExpenses", labelKey: "fields.totalExpenses", type: "text", required: true },
        { id: "bankAccount", labelKey: "fields.bankAccount", type: "text", required: true }
      ],
      documentationRequired: ["docs.medicalReport", "docs.invoices", "docs.receipts", "docs.prescriptions"]
    }
  ],
  Pet: [
    {
      id: "pet-vet",
      nameKey: "appointmentTypes.pet.vet.name",
      descriptionKey: "appointmentTypes.pet.vet.description",
      urgencyLevels: ["routine", "urgent"],
      estimatedDuration: "30-60min",
      requiredFields: [
        { id: "petName", labelKey: "fields.petName", type: "text", required: true },
        { id: "visitReason", labelKey: "fields.visitReason", type: "textarea", required: true },
        { id: "preferredClinic", labelKey: "fields.preferredClinic", type: "text", required: false }
      ],
      documentationRequired: ["docs.petVaccinationRecord"]
    },
    {
      id: "pet-surgery",
      nameKey: "appointmentTypes.pet.surgery.name",
      descriptionKey: "appointmentTypes.pet.surgery.description",
      urgencyLevels: ["routine", "urgent", "emergency"],
      estimatedDuration: "1-3 days",
      requiredFields: [
        { id: "petName", labelKey: "fields.petName", type: "text", required: true },
        { id: "surgeryType", labelKey: "fields.surgeryType", type: "text", required: true },
        { id: "veterinarian", labelKey: "fields.veterinarian", type: "text", required: true },
        { id: "estimatedCost", labelKey: "fields.estimatedCost", type: "text", required: true }
      ],
      documentationRequired: ["docs.vetDiagnosis", "docs.surgeryEstimate"]
    },
    {
      id: "pet-emergency",
      nameKey: "appointmentTypes.pet.emergency.name",
      descriptionKey: "appointmentTypes.pet.emergency.description",
      urgencyLevels: ["emergency"],
      estimatedDuration: "Immediate",
      requiredFields: [
        { id: "petName", labelKey: "fields.petName", type: "text", required: true },
        { id: "emergencyDescription", labelKey: "fields.emergencyDescription", type: "textarea", required: true },
        { id: "currentLocation", labelKey: "fields.currentLocation", type: "text", required: true }
      ],
      documentationRequired: []
    },
    {
      id: "pet-claim",
      nameKey: "appointmentTypes.pet.claim.name",
      descriptionKey: "appointmentTypes.pet.claim.description",
      urgencyLevels: ["routine"],
      estimatedDuration: "10-15 days",
      requiredFields: [
        { id: "petName", labelKey: "fields.petName", type: "text", required: true },
        { id: "treatmentDate", labelKey: "fields.treatmentDate", type: "date", required: true },
        { id: "clinicName", labelKey: "fields.clinicName", type: "text", required: true },
        { id: "totalAmount", labelKey: "fields.totalAmount", type: "text", required: true },
        { id: "bankAccount", labelKey: "fields.bankAccount", type: "text", required: true }
      ],
      documentationRequired: ["docs.vetInvoice", "docs.medicalReport", "docs.receipts"]
    }
  ]
};

// Provider network for each service type
export const inNetworkProviders: Record<string, { id: string; name: string; location: string; phone: string; specialties: string[] }[]> = {
  Health: [
    { id: "hp1", name: "Hygeia Hospital", location: "Maroussi, Athens", phone: "+30 210 6867000", specialties: ["health-preauth", "health-surgery", "health-diagnostic", "health-specialist"] },
    { id: "hp2", name: "Metropolitan Hospital", location: "Neo Faliro", phone: "+30 210 4809000", specialties: ["health-preauth", "health-surgery", "health-diagnostic", "health-specialist"] },
    { id: "hp3", name: "Athens Medical Center", location: "Marousi", phone: "+30 210 6862000", specialties: ["health-preauth", "health-surgery", "health-diagnostic"] },
    { id: "hp4", name: "Euromedica", location: "Thessaloniki", phone: "+30 2310 220000", specialties: ["health-diagnostic", "health-specialist", "health-wellness"] },
    { id: "hp5", name: "Dr. Papadopoulos Cardiology", location: "Kolonaki", phone: "+30 210 7225500", specialties: ["health-specialist"] },
    { id: "hp6", name: "Athens Eye Center", location: "Glyfada", phone: "+30 210 8940000", specialties: ["health-specialist", "health-diagnostic"] },
    { id: "hp7", name: "Psych Wellness Center", location: "Kifisia", phone: "+30 210 6234500", specialties: ["health-mental"] },
    { id: "hp8", name: "Athens Physio Clinic", location: "Syntagma", phone: "+30 210 3210000", specialties: ["health-chronic"] },
    { id: "hp9", name: "Check-Up Athens", location: "Chalandri", phone: "+30 210 6780000", specialties: ["health-wellness"] },
    { id: "hp10", name: "NN Claims Center", location: "Syntagma", phone: "+30 210 9509000", specialties: ["health-reimbursement", "health-coverage"] }
  ],
  Auto: [
    { id: "ap1", name: "Generali Approved - Speed Auto", location: "Acharnes", phone: "+30 213 0033800", specialties: ["auto-accident", "auto-valuation"] },
    { id: "ap2", name: "Autoglass Greece", location: "Chalandri", phone: "+30 210 6847123", specialties: ["auto-glass"] },
    { id: "ap3", name: "Michelin Service Center", location: "Maroussi", phone: "+30 210 6199999", specialties: ["auto-roadside"] },
    { id: "ap4", name: "Generali Roadside 24/7", location: "Mobile Service", phone: "+30 18118", specialties: ["auto-roadside"] },
    { id: "ap5", name: "Legal Partners Greece", location: "Athens Center", phone: "+30 210 3300000", specialties: ["auto-legal", "auto-bonusmalus"] },
    { id: "ap6", name: "Generali Claims Center", location: "Syntagma", phone: "+30 210 8096000", specialties: ["auto-accident", "auto-theft", "auto-totalloss", "auto-modification", "auto-greencard"] }
  ],
  Home: [
    { id: "hm1", name: "HomeServe Greece", location: "24/7 Mobile", phone: "+30 214 2000214", specialties: ["home-water", "home-emergency"] },
    { id: "hm2", name: "ElectroTech Services", location: "Glyfada", phone: "+30 210 8943333", specialties: ["home-damage", "home-emergency"] },
    { id: "hm3", name: "SecureHome Systems", location: "Kifisia", phone: "+30 210 6234567", specialties: ["home-security"] },
    { id: "hm4", name: "Property Valuers Athens", location: "Kolonaki", phone: "+30 210 7220000", specialties: ["home-valuation", "home-contents"] },
    { id: "hm5", name: "Ergo Claims Center", location: "Piraeus", phone: "+30 210 4180000", specialties: ["home-damage", "home-water", "home-fire", "home-theft", "home-natural", "home-liability"] }
  ],
  Life: [
    { id: "lp1", name: "Ethniki Life Services", location: "Syntagma", phone: "+30 210 3235000", specialties: ["life-beneficiary", "life-loan", "life-payment", "life-increase", "life-surrender", "life-maturity", "life-tax", "life-assignment"] },
    { id: "lp2", name: "Ethniki Claims Center", location: "Kallithea", phone: "+30 210 9500000", specialties: ["life-death", "life-underwriting"] }
  ],
  Travel: [
    { id: "tp1", name: "Global Assistance 24/7", location: "International", phone: "+30 210 6869000", specialties: ["travel-emergency", "travel-repatriation", "travel-cash", "travel-legal", "travel-document"] },
    { id: "tp2", name: "Travel Claims Center", location: "Athens", phone: "+30 210 3300500", specialties: ["travel-cancellation", "travel-luggage", "travel-delay", "travel-extension", "travel-medical"] }
  ],
  Pet: [
    { id: "pp1", name: "Happy Paws Veterinary", location: "Kifisia", phone: "+30 210 6234567", specialties: ["pet-vet", "pet-surgery"] },
    { id: "pp2", name: "24h Pet Emergency", location: "Chalandri", phone: "+30 210 6742111", specialties: ["pet-emergency"] },
    { id: "pp3", name: "Pet Claims Center", location: "Athens", phone: "+30 210 3300600", specialties: ["pet-claim"] }
  ]
};

// Legacy support - map old service format to new structure
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
