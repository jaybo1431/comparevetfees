export interface Practice {
  slug: string;
  name: string;
  address: string;
  town: string;
  county: string;
  postcode: string;
  phone: string;
  website: string;
  rating: number;
  reviewCount: number;
  isIndependent: boolean;
  parentGroup?: string;
  openingSince: number;
  lat: number;
  lng: number;
  prices: PriceList;
  features: string[];
}

export interface PriceList {
  consultation: number;
  consultationNotes?: string;
  vaccination: number;
  vaccinationNotes?: string;
  catNeutering: number;
  dogNeuteringMale: number;
  dogSpayFemale: number;
  dentalCheckClean: number;
  microchip: number;
  prescription: number;
  emergencyConsultation: number;
  xray?: number;
  bloodTest?: number;
}

export const PROCEDURE_LABELS: Record<keyof PriceList, string> = {
  consultation: "Standard Consultation",
  consultationNotes: "",
  vaccination: "Primary Vaccination Course",
  vaccinationNotes: "",
  catNeutering: "Cat Neutering",
  dogNeuteringMale: "Dog Neutering (Male)",
  dogSpayFemale: "Dog Spay (Female)",
  dentalCheckClean: "Dental Check & Clean",
  microchip: "Microchip",
  prescription: "Written Prescription",
  emergencyConsultation: "Emergency / OOH Consultation",
  xray: "X-Ray",
  bloodTest: "Blood Test",
};

export const PRICE_KEYS = [
  "consultation",
  "vaccination",
  "catNeutering",
  "dogNeuteringMale",
  "dogSpayFemale",
  "dentalCheckClean",
  "microchip",
  "prescription",
  "emergencyConsultation",
  "xray",
  "bloodTest",
] as const;

export type PriceKey = (typeof PRICE_KEYS)[number];

// Realistic mock data — South of England practices
export const practices: Practice[] = [
  {
    slug: "brighton-paws-veterinary",
    name: "Brighton Paws Veterinary Centre",
    address: "42 Western Road",
    town: "Brighton",
    county: "East Sussex",
    postcode: "BN1 2NW",
    phone: "01273 555 012",
    website: "https://brightonpaws.example.com",
    rating: 4.7,
    reviewCount: 342,
    isIndependent: true,
    openingSince: 2008,
    lat: 50.8225,
    lng: -0.1372,
    features: ["24hr Emergency", "Cat-Friendly Clinic", "Free Parking", "Online Booking"],
    prices: {
      consultation: 52,
      consultationNotes: "15 min with vet",
      vaccination: 48,
      catNeutering: 120,
      dogNeuteringMale: 195,
      dogSpayFemale: 290,
      dentalCheckClean: 320,
      microchip: 20,
      prescription: 18,
      emergencyConsultation: 180,
      xray: 150,
      bloodTest: 95,
    },
  },
  {
    slug: "southampton-pet-hospital",
    name: "Southampton Pet Hospital",
    address: "15 Shirley High Street",
    town: "Southampton",
    county: "Hampshire",
    postcode: "SO15 3NP",
    phone: "023 8044 1234",
    website: "https://southamptonpethospital.example.com",
    rating: 4.5,
    reviewCount: 218,
    isIndependent: false,
    parentGroup: "CVS Group",
    openingSince: 1995,
    lat: 50.9097,
    lng: -1.4044,
    features: ["24hr Emergency", "Specialist Referrals", "Hydrotherapy"],
    prices: {
      consultation: 68,
      consultationNotes: "20 min with vet, includes follow-up notes",
      vaccination: 62,
      catNeutering: 160,
      dogNeuteringMale: 275,
      dogSpayFemale: 420,
      dentalCheckClean: 450,
      microchip: 28,
      prescription: 21,
      emergencyConsultation: 250,
      xray: 220,
      bloodTest: 130,
    },
  },
  {
    slug: "guildford-vets-4-pets",
    name: "Guildford Vets4Pets",
    address: "Inside Pets at Home, Ladymead Retail Park",
    town: "Guildford",
    county: "Surrey",
    postcode: "GU1 1DB",
    phone: "01483 555 789",
    website: "https://guildfordvets4pets.example.com",
    rating: 4.2,
    reviewCount: 156,
    isIndependent: false,
    parentGroup: "Pets at Home / Vet Group",
    openingSince: 2012,
    lat: 51.2362,
    lng: -0.5704,
    features: ["Evening Appointments", "Pet Shop On-Site", "Loyalty Plan"],
    prices: {
      consultation: 45,
      consultationNotes: "10 min standard",
      vaccination: 55,
      catNeutering: 99,
      dogNeuteringMale: 180,
      dogSpayFemale: 310,
      dentalCheckClean: 290,
      microchip: 15,
      prescription: 19,
      emergencyConsultation: 195,
      xray: 175,
      bloodTest: 110,
    },
  },
  {
    slug: "chichester-country-vets",
    name: "Chichester Country Vets",
    address: "8 Eastgate Square",
    town: "Chichester",
    county: "West Sussex",
    postcode: "PO19 1JH",
    phone: "01243 555 456",
    website: "https://chichestercountryvets.example.com",
    rating: 4.9,
    reviewCount: 487,
    isIndependent: true,
    openingSince: 1982,
    lat: 50.8365,
    lng: -0.7792,
    features: ["Farm & Equine", "Acupuncture", "Behavioural Clinic", "Home Visits"],
    prices: {
      consultation: 58,
      consultationNotes: "20 min with senior vet",
      vaccination: 52,
      catNeutering: 135,
      dogNeuteringMale: 220,
      dogSpayFemale: 340,
      dentalCheckClean: 380,
      microchip: 22,
      prescription: 15,
      emergencyConsultation: 200,
      xray: 180,
      bloodTest: 105,
    },
  },
  {
    slug: "bournemouth-bay-vets",
    name: "Bournemouth Bay Veterinary Clinic",
    address: "91 Old Christchurch Road",
    town: "Bournemouth",
    county: "Dorset",
    postcode: "BH1 1EP",
    phone: "01202 555 321",
    website: "https://bournemouthbayvets.example.com",
    rating: 4.4,
    reviewCount: 201,
    isIndependent: false,
    parentGroup: "IVC Evidensia",
    openingSince: 2001,
    lat: 50.7192,
    lng: -1.8808,
    features: ["CT Scanner", "Dental Suite", "Puppy Classes"],
    prices: {
      consultation: 72,
      consultationNotes: "15 min with vet",
      vaccination: 65,
      catNeutering: 175,
      dogNeuteringMale: 290,
      dogSpayFemale: 480,
      dentalCheckClean: 520,
      microchip: 30,
      prescription: 21,
      emergencyConsultation: 280,
      xray: 240,
      bloodTest: 140,
    },
  },
  {
    slug: "portsmouth-harbour-vets",
    name: "Portsmouth Harbour Vets",
    address: "23 Commercial Road",
    town: "Portsmouth",
    county: "Hampshire",
    postcode: "PO1 1BQ",
    phone: "023 9287 5555",
    website: "https://portsmouthharbourvets.example.com",
    rating: 4.6,
    reviewCount: 289,
    isIndependent: true,
    openingSince: 1997,
    lat: 50.7989,
    lng: -1.0912,
    features: ["24hr Emergency", "Exotic Pets", "Online Booking", "Free Parking"],
    prices: {
      consultation: 48,
      consultationNotes: "15 min with vet",
      vaccination: 44,
      catNeutering: 110,
      dogNeuteringMale: 185,
      dogSpayFemale: 275,
      dentalCheckClean: 310,
      microchip: 18,
      prescription: 16,
      emergencyConsultation: 170,
      xray: 145,
      bloodTest: 88,
    },
  },
  {
    slug: "reading-riverside-vets",
    name: "Reading Riverside Veterinary Surgery",
    address: "7 Kings Road",
    town: "Reading",
    county: "Berkshire",
    postcode: "RG1 3AA",
    phone: "0118 955 5678",
    website: "https://readingriversidevets.example.com",
    rating: 4.3,
    reviewCount: 174,
    isIndependent: false,
    parentGroup: "Medivet",
    openingSince: 2015,
    lat: 51.4543,
    lng: -0.9781,
    features: ["Nurse Clinics", "Weight Management", "Senior Pet Health"],
    prices: {
      consultation: 65,
      consultationNotes: "15 min with vet",
      vaccination: 58,
      catNeutering: 155,
      dogNeuteringMale: 260,
      dogSpayFemale: 395,
      dentalCheckClean: 410,
      microchip: 25,
      prescription: 20,
      emergencyConsultation: 235,
      xray: 195,
      bloodTest: 120,
    },
  },
  {
    slug: "exeter-green-cross-vets",
    name: "Exeter Green Cross Veterinary Practice",
    address: "34 Sidwell Street",
    town: "Exeter",
    county: "Devon",
    postcode: "EX4 6NS",
    phone: "01392 555 890",
    website: "https://exetergreencross.example.com",
    rating: 4.8,
    reviewCount: 412,
    isIndependent: true,
    openingSince: 1976,
    lat: 50.7260,
    lng: -3.5275,
    features: ["Home Visits", "Behavioural Clinic", "Puppy & Kitten Packages", "Free Parking"],
    prices: {
      consultation: 42,
      consultationNotes: "15 min with vet, includes weight check",
      vaccination: 40,
      catNeutering: 95,
      dogNeuteringMale: 170,
      dogSpayFemale: 255,
      dentalCheckClean: 280,
      microchip: 16,
      prescription: 14,
      emergencyConsultation: 160,
      xray: 135,
      bloodTest: 82,
    },
  },
  {
    slug: "tunbridge-wells-medivet",
    name: "Tunbridge Wells Medivet",
    address: "12 Mount Pleasant Road",
    town: "Royal Tunbridge Wells",
    county: "Kent",
    postcode: "TN1 1QU",
    phone: "01892 555 234",
    website: "https://tunbridgewellsmedivet.example.com",
    rating: 4.1,
    reviewCount: 128,
    isIndependent: false,
    parentGroup: "Medivet",
    openingSince: 2018,
    lat: 51.1320,
    lng: 0.2634,
    features: ["Late Appointments", "Pet Health Plans"],
    prices: {
      consultation: 70,
      consultationNotes: "15 min standard",
      vaccination: 60,
      catNeutering: 165,
      dogNeuteringMale: 280,
      dogSpayFemale: 430,
      dentalCheckClean: 460,
      microchip: 28,
      prescription: 21,
      emergencyConsultation: 260,
      xray: 210,
      bloodTest: 135,
    },
  },
  {
    slug: "bath-crescent-vets",
    name: "Bath Crescent Veterinary Clinic",
    address: "5 Pulteney Bridge",
    town: "Bath",
    county: "Somerset",
    postcode: "BA2 4AX",
    phone: "01225 555 678",
    website: "https://bathcrescentvets.example.com",
    rating: 4.6,
    reviewCount: 267,
    isIndependent: true,
    openingSince: 1989,
    lat: 51.3811,
    lng: -2.3590,
    features: ["Cat-Friendly Clinic", "Rabbit & Small Animal", "Online Booking"],
    prices: {
      consultation: 55,
      consultationNotes: "15 min with vet",
      vaccination: 50,
      catNeutering: 125,
      dogNeuteringMale: 210,
      dogSpayFemale: 320,
      dentalCheckClean: 350,
      microchip: 20,
      prescription: 16,
      emergencyConsultation: 190,
      xray: 160,
      bloodTest: 98,
    },
  },
  {
    slug: "salisbury-plain-vets",
    name: "Salisbury Plain Veterinary Practice",
    address: "18 Castle Street",
    town: "Salisbury",
    county: "Wiltshire",
    postcode: "SP1 1DL",
    phone: "01722 555 111",
    website: "https://salisburyplainvets.example.com",
    rating: 4.5,
    reviewCount: 193,
    isIndependent: true,
    openingSince: 2003,
    lat: 51.0688,
    lng: -1.7945,
    features: ["Farm Animals", "Home Visits", "Pet Passport"],
    prices: {
      consultation: 46,
      consultationNotes: "15 min with vet",
      vaccination: 42,
      catNeutering: 105,
      dogNeuteringMale: 175,
      dogSpayFemale: 265,
      dentalCheckClean: 295,
      microchip: 18,
      prescription: 14,
      emergencyConsultation: 165,
      xray: 140,
      bloodTest: 85,
    },
  },
  {
    slug: "canterbury-cathedral-vets",
    name: "Canterbury Cathedral Veterinary Group",
    address: "29 St Peter's Street",
    town: "Canterbury",
    county: "Kent",
    postcode: "CT1 2BQ",
    phone: "01227 555 432",
    website: "https://canterburycathedralvets.example.com",
    rating: 4.4,
    reviewCount: 221,
    isIndependent: false,
    parentGroup: "Linnaeus (Mars)",
    openingSince: 2010,
    lat: 51.2802,
    lng: 1.0789,
    features: ["Specialist Referrals", "Dental Suite", "Nurse Clinics"],
    prices: {
      consultation: 66,
      consultationNotes: "15 min with vet",
      vaccination: 58,
      catNeutering: 150,
      dogNeuteringMale: 255,
      dogSpayFemale: 390,
      dentalCheckClean: 420,
      microchip: 26,
      prescription: 20,
      emergencyConsultation: 240,
      xray: 200,
      bloodTest: 125,
    },
  },
];

export function getPracticeBySlug(slug: string): Practice | undefined {
  return practices.find((p) => p.slug === slug);
}

export function searchPractices(query: string): Practice[] {
  const q = query.toLowerCase().trim();
  if (!q) return practices;
  return practices.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.town.toLowerCase().includes(q) ||
      p.county.toLowerCase().includes(q) ||
      p.postcode.toLowerCase().replace(/\s/g, "").includes(q.replace(/\s/g, ""))
  );
}

export function getAveragePrice(key: PriceKey): number {
  const prices = practices.map((p) => p.prices[key]).filter((p): p is number => p !== undefined);
  return Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
}

export function getCheapestPractice(key: PriceKey): Practice {
  return practices.reduce((cheapest, p) => {
    const price = p.prices[key];
    const cheapestPrice = cheapest.prices[key];
    if (price === undefined) return cheapest;
    if (cheapestPrice === undefined) return p;
    return price < cheapestPrice ? p : cheapest;
  });
}

export function getMostExpensivePractice(key: PriceKey): Practice {
  return practices.reduce((expensive, p) => {
    const price = p.prices[key];
    const expensivePrice = expensive.prices[key];
    if (price === undefined) return expensive;
    if (expensivePrice === undefined) return p;
    return price > expensivePrice ? p : expensive;
  });
}
