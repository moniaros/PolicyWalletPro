// Top Greek Insurance Companies with logos and supported types
// Data based on Greek insurance market 2024

export interface Insurer {
  id: string;
  name: string;
  nameEn: string;
  logo: string; // SVG icon or placeholder
  website: string;
  phone: string;
  supportedTypes: InsuranceType[];
  marketShare?: number;
  founded?: number;
}

export type InsuranceType = 
  | "health" 
  | "auto" 
  | "home" 
  | "life" 
  | "travel" 
  | "pet" 
  | "business" 
  | "marine"
  | "liability"
  | "cyber";

export const insuranceTypeLabels: Record<InsuranceType, { el: string; en: string; icon: string }> = {
  health: { el: "Υγεία", en: "Health", icon: "Heart" },
  auto: { el: "Αυτοκίνητο", en: "Auto", icon: "Car" },
  home: { el: "Κατοικία", en: "Home", icon: "Home" },
  life: { el: "Ζωή", en: "Life", icon: "Users" },
  travel: { el: "Ταξίδι", en: "Travel", icon: "Plane" },
  pet: { el: "Κατοικίδιο", en: "Pet", icon: "PawPrint" },
  business: { el: "Επιχείρηση", en: "Business", icon: "Building2" },
  marine: { el: "Σκάφος", en: "Marine", icon: "Anchor" },
  liability: { el: "Αστική Ευθύνη", en: "Liability", icon: "Shield" },
  cyber: { el: "Κυβερνοασφάλεια", en: "Cyber", icon: "Lock" },
};

// Top Greek Insurers sorted by market presence
export const greekInsurers: Insurer[] = [
  // Major Players
  {
    id: "ethniki",
    name: "Εθνική Ασφαλιστική",
    nameEn: "Ethniki Hellenic General Insurance",
    logo: "ethniki",
    website: "https://www.ethniki-asfalistiki.gr",
    phone: "210 904 1000",
    supportedTypes: ["health", "auto", "home", "life", "travel", "business", "marine", "liability"],
    marketShare: 14.6,
    founded: 1891
  },
  {
    id: "nn-hellas",
    name: "NN Hellas",
    nameEn: "NN Hellenic Life Insurance",
    logo: "nn",
    website: "https://www.nn.gr",
    phone: "210 950 6000",
    supportedTypes: ["health", "life", "travel"],
    marketShare: 8.5,
    founded: 2014
  },
  {
    id: "generali",
    name: "Generali Hellas",
    nameEn: "Generali Hellas",
    logo: "generali",
    website: "https://www.generali.gr",
    phone: "210 809 6100",
    supportedTypes: ["health", "auto", "home", "life", "travel", "business", "marine", "liability"],
    marketShare: 7.8,
    founded: 1886
  },
  {
    id: "interamerican",
    name: "Interamerican",
    nameEn: "Interamerican Hellenic (Achmea)",
    logo: "interamerican",
    website: "https://www.interamerican.gr",
    phone: "210 946 8000",
    supportedTypes: ["health", "auto", "home", "life", "travel", "pet", "business"],
    marketShare: 7.2,
    founded: 1969
  },
  {
    id: "allianz",
    name: "Allianz Hellas",
    nameEn: "Allianz Hellas",
    logo: "allianz",
    website: "https://www.allianz.gr",
    phone: "210 698 6000",
    supportedTypes: ["health", "auto", "home", "life", "travel", "business", "marine", "liability", "cyber"],
    marketShare: 6.5,
    founded: 1890
  },
  {
    id: "ergo",
    name: "ERGO Ασφαλιστική",
    nameEn: "ERGO Insurance",
    logo: "ergo",
    website: "https://www.ergo.gr",
    phone: "210 930 3000",
    supportedTypes: ["health", "auto", "home", "life", "travel", "business", "liability"],
    marketShare: 5.8,
    founded: 1997
  },
  {
    id: "eurolife-erb",
    name: "Eurolife ERB",
    nameEn: "Eurolife ERB Insurance",
    logo: "eurolife",
    website: "https://www.eurolife.gr",
    phone: "210 930 0800",
    supportedTypes: ["health", "life", "home", "auto"],
    marketShare: 5.2,
    founded: 2016
  },
  {
    id: "axa",
    name: "AXA Ασφαλιστική",
    nameEn: "AXA Greece",
    logo: "axa",
    website: "https://www.axa.gr",
    phone: "210 726 8000",
    supportedTypes: ["health", "auto", "home", "life", "travel", "business"],
    marketShare: 4.8,
    founded: 1816
  },
  {
    id: "metlife",
    name: "MetLife",
    nameEn: "MetLife Greece",
    logo: "metlife",
    website: "https://www.metlife.gr",
    phone: "210 888 0000",
    supportedTypes: ["health", "life"],
    marketShare: 4.2,
    founded: 1868
  },
  {
    id: "groupama",
    name: "Groupama Phoenix",
    nameEn: "Groupama Phoenix Hellenic",
    logo: "groupama",
    website: "https://www.groupama.gr",
    phone: "210 619 0200",
    supportedTypes: ["health", "auto", "home", "life", "travel", "business", "marine"],
    marketShare: 3.8,
    founded: 1965
  },
  // Secondary Players
  {
    id: "eurobank-insurance",
    name: "Eurobank Insurance",
    nameEn: "Eurobank Insurance",
    logo: "eurobank",
    website: "https://www.eurobankinsurance.gr",
    phone: "210 955 5000",
    supportedTypes: ["home", "life", "auto"],
    marketShare: 3.2
  },
  {
    id: "ydrogios",
    name: "Υδρόγειος Ασφαλιστική",
    nameEn: "Ydrogios Insurance",
    logo: "ydrogios",
    website: "https://www.ydrogios.gr",
    phone: "210 930 2100",
    supportedTypes: ["auto", "home", "travel", "marine"],
    marketShare: 2.8
  },
  {
    id: "atlantic-union",
    name: "Atlantic Union",
    nameEn: "Atlantic Union Insurance",
    logo: "atlantic",
    website: "https://www.atlanticunion.gr",
    phone: "210 728 7000",
    supportedTypes: ["auto", "home", "travel"],
    marketShare: 2.5
  },
  {
    id: "interasco",
    name: "Interasco",
    nameEn: "Interasco Insurance",
    logo: "interasco",
    website: "https://www.interasco.gr",
    phone: "210 930 9000",
    supportedTypes: ["auto", "home", "travel", "marine"],
    marketShare: 2.3
  },
  {
    id: "alpha-insurance",
    name: "Alpha Insurance",
    nameEn: "Alpha Insurance",
    logo: "alpha",
    website: "https://www.alpha-insurance.gr",
    phone: "210 326 0000",
    supportedTypes: ["home", "life"],
    marketShare: 2.1
  },
  {
    id: "european-reliance",
    name: "European Reliance",
    nameEn: "European Reliance General Insurance",
    logo: "european-reliance",
    website: "https://www.europeanreliance.gr",
    phone: "210 614 3000",
    supportedTypes: ["auto", "home", "health", "travel"],
    marketShare: 1.9
  },
  {
    id: "minetta",
    name: "Μινέττα Ασφαλιστική",
    nameEn: "Minetta Insurance",
    logo: "minetta",
    website: "https://www.minetta.gr",
    phone: "210 930 2600",
    supportedTypes: ["auto", "home", "travel"],
    marketShare: 1.7
  },
  {
    id: "prime-insurance",
    name: "Prime Insurance",
    nameEn: "Prime Insurance Company",
    logo: "prime",
    website: "https://www.primeinsurance.gr",
    phone: "210 619 0900",
    supportedTypes: ["auto", "home", "liability"],
    marketShare: 1.5
  },
  {
    id: "syneteristiki",
    name: "Συνεταιριστική Ασφαλιστική",
    nameEn: "Syneteristiki Insurance",
    logo: "syneteristiki",
    website: "https://www.syneteristiki.gr",
    phone: "210 695 3000",
    supportedTypes: ["auto", "home", "travel", "marine"],
    marketShare: 1.4
  },
  {
    id: "orien",
    name: "Orion Ασφαλιστική",
    nameEn: "Orion Insurance",
    logo: "orion",
    website: "https://www.orion-insurance.gr",
    phone: "210 679 9000",
    supportedTypes: ["auto", "home"],
    marketShare: 1.2
  },
  // Additional Insurers
  {
    id: "hellas-direct",
    name: "Hellas Direct",
    nameEn: "Hellas Direct",
    logo: "hellasdirect",
    website: "https://www.hellasdirect.gr",
    phone: "210 300 9500",
    supportedTypes: ["auto", "home", "travel"],
    marketShare: 1.1
  },
  {
    id: "anytime",
    name: "Anytime",
    nameEn: "Anytime Insurance (Interamerican)",
    logo: "anytime",
    website: "https://www.anytime.gr",
    phone: "801 11 12345",
    supportedTypes: ["auto", "home", "travel"],
    marketShare: 1.0
  },
  {
    id: "europaiki-pisti",
    name: "Ευρωπαϊκή Πίστη",
    nameEn: "Europaiki Pisti",
    logo: "europaiki",
    website: "https://www.europisti.gr",
    phone: "210 947 1111",
    supportedTypes: ["health", "auto", "home", "life", "travel", "business"],
    marketShare: 2.4
  },
  {
    id: "credit-agricole",
    name: "Credit Agricole Ασφαλιστική",
    nameEn: "Credit Agricole Insurance",
    logo: "creditagricole",
    website: "https://www.ca-assurances.gr",
    phone: "210 367 8000",
    supportedTypes: ["home", "life"],
    marketShare: 0.9
  },
  {
    id: "dynamis",
    name: "Δύναμις Ασφαλιστική",
    nameEn: "Dynamis Insurance",
    logo: "dynamis",
    website: "https://www.dynamis.gr",
    phone: "210 614 5000",
    supportedTypes: ["auto", "home", "travel"],
    marketShare: 0.8
  },
  {
    id: "personal-insurance",
    name: "Personal Insurance",
    nameEn: "Personal Insurance",
    logo: "personal",
    website: "https://www.personal-insurance.gr",
    phone: "210 930 8000",
    supportedTypes: ["auto", "travel"],
    marketShare: 0.7
  },
  {
    id: "trust-international",
    name: "Trust International",
    nameEn: "Trust International Insurance",
    logo: "trust",
    website: "https://www.trustinsurance.gr",
    phone: "210 326 8000",
    supportedTypes: ["auto", "home", "travel", "marine"],
    marketShare: 0.6
  },
  {
    id: "akmi",
    name: "Ακμή Ασφαλιστική",
    nameEn: "Akmi Insurance",
    logo: "akmi",
    website: "https://www.akmi-insurance.gr",
    phone: "210 364 8000",
    supportedTypes: ["auto", "home"],
    marketShare: 0.5
  },
  {
    id: "sagittarius",
    name: "Sagittarius",
    nameEn: "Sagittarius Insurance",
    logo: "sagittarius",
    website: "https://www.sagittarius.gr",
    phone: "210 679 1000",
    supportedTypes: ["auto", "home", "travel"],
    marketShare: 0.4
  },
  {
    id: "insurance-market",
    name: "Insurance Market",
    nameEn: "Insurance Market",
    logo: "insurancemarket",
    website: "https://www.insurancemarket.gr",
    phone: "210 363 9000",
    supportedTypes: ["auto", "home", "travel", "pet"],
    marketShare: 0.3
  },
  // International with Greek presence
  {
    id: "zurich",
    name: "Zurich Insurance",
    nameEn: "Zurich Insurance Greece",
    logo: "zurich",
    website: "https://www.zurich.gr",
    phone: "210 936 9000",
    supportedTypes: ["auto", "home", "business", "liability", "cyber"],
    marketShare: 0.5
  },
  {
    id: "chubb",
    name: "Chubb",
    nameEn: "Chubb Insurance Greece",
    logo: "chubb",
    website: "https://www.chubb.gr",
    phone: "210 699 0000",
    supportedTypes: ["home", "travel", "business", "liability", "cyber"],
    marketShare: 0.4
  },
  {
    id: "hdi-global",
    name: "HDI Global",
    nameEn: "HDI Global SE Greece",
    logo: "hdi",
    website: "https://www.hdi-global.gr",
    phone: "210 326 4000",
    supportedTypes: ["business", "marine", "liability"],
    marketShare: 0.3
  },
  {
    id: "swiss-re",
    name: "Swiss Re",
    nameEn: "Swiss Re Greece",
    logo: "swissre",
    website: "https://www.swissre.com",
    phone: "210 699 7000",
    supportedTypes: ["business", "liability"],
    marketShare: 0.2
  },
  // Specialty Insurers
  {
    id: "mapfre",
    name: "Mapfre Asistencia",
    nameEn: "Mapfre Assistance Greece",
    logo: "mapfre",
    website: "https://www.mapfre.gr",
    phone: "210 619 9000",
    supportedTypes: ["travel", "auto"],
    marketShare: 0.4
  },
  {
    id: "mondial-assistance",
    name: "Mondial Assistance",
    nameEn: "Mondial Assistance Greece",
    logo: "mondial",
    website: "https://www.mondial-assistance.gr",
    phone: "210 619 8000",
    supportedTypes: ["travel"],
    marketShare: 0.3
  },
  {
    id: "europ-assistance",
    name: "Europ Assistance",
    nameEn: "Europ Assistance Greece",
    logo: "europ",
    website: "https://www.europ-assistance.gr",
    phone: "210 323 9000",
    supportedTypes: ["travel", "auto"],
    marketShare: 0.2
  },
  {
    id: "petplan",
    name: "Petplan",
    nameEn: "Petplan Greece",
    logo: "petplan",
    website: "https://www.petplan.gr",
    phone: "210 900 0000",
    supportedTypes: ["pet"],
    marketShare: 0.1
  },
  {
    id: "agria-pet",
    name: "Agria Pet Insurance",
    nameEn: "Agria Pet Insurance",
    logo: "agria",
    website: "https://www.agriapet.gr",
    phone: "210 901 0000",
    supportedTypes: ["pet"],
    marketShare: 0.1
  },
];

// Get insurers by type
export function getInsurersByType(type: InsuranceType): Insurer[] {
  return greekInsurers.filter(insurer => insurer.supportedTypes.includes(type));
}

// Search insurers by name
export function searchInsurers(query: string): Insurer[] {
  const lowerQuery = query.toLowerCase();
  return greekInsurers.filter(
    insurer => 
      insurer.name.toLowerCase().includes(lowerQuery) ||
      insurer.nameEn.toLowerCase().includes(lowerQuery)
  );
}

// Get insurer by ID
export function getInsurerById(id: string): Insurer | undefined {
  return greekInsurers.find(insurer => insurer.id === id);
}

// Get top insurers by market share
export function getTopInsurers(count: number = 10): Insurer[] {
  return [...greekInsurers]
    .filter(i => i.marketShare !== undefined)
    .sort((a, b) => (b.marketShare || 0) - (a.marketShare || 0))
    .slice(0, count);
}
