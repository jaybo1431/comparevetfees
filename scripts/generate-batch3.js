const fs = require("fs");

function makeSlug(name, town) {
  return `${name}-${town}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

function generatePrices(region) {
  const ranges = {
    london: { consultation: [65, 85], vaccination: [58, 72], catNeutering: [155, 195], dogNeuteringMale: [270, 340], dogSpayFemale: [380, 520], dentalCheckClean: [480, 620], microchip: [28, 38], prescription: [22, 28], emergencyConsultation: [250, 320], xray: [220, 290], bloodTest: [130, 170] },
    surrey_berks: { consultation: [60, 75], vaccination: [55, 68], catNeutering: [140, 175], dogNeuteringMale: [255, 310], dogSpayFemale: [350, 480], dentalCheckClean: [440, 560], microchip: [25, 35], prescription: [20, 25], emergencyConsultation: [230, 290], xray: [195, 260], bloodTest: [115, 150] },
    kent_essex_herts_bucks: { consultation: [55, 70], vaccination: [52, 62], catNeutering: [130, 165], dogNeuteringMale: [240, 290], dogSpayFemale: [320, 450], dentalCheckClean: [400, 520], microchip: [23, 32], prescription: [19, 24], emergencyConsultation: [210, 270], xray: [180, 240], bloodTest: [105, 140] },
    sussex: { consultation: [55, 70], vaccination: [52, 63], catNeutering: [128, 162], dogNeuteringMale: [238, 288], dogSpayFemale: [318, 445], dentalCheckClean: [395, 515], microchip: [22, 31], prescription: [19, 24], emergencyConsultation: [208, 268], xray: [178, 238], bloodTest: [102, 138] },
  };
  const r = ranges[region];
  const prices = {};
  for (const [key, [min, max]] of Object.entries(r)) {
    prices[key] = Math.round((min + Math.random() * (max - min)) * 2) / 2;
  }
  return prices;
}

function adjustForCorporate(prices, group) {
  const multipliers = { 'IVC Evidensia': 1.15, 'Medivet': 1.12, 'CVS Group': 1.1, 'Linnaeus': 1.13, 'Vets4Pets': 0.92 };
  const mult = multipliers[group] || 1;
  const adjusted = {};
  for (const [key, val] of Object.entries(prices)) { adjusted[key] = Math.round(val * mult * 2) / 2; }
  return adjusted;
}

const independentFeatures = [
  ["Family Run", "Free Parking", "Home Visits", "Online Booking"],
  ["Established Practice", "Nurse Clinics", "Cat-Friendly", "Digital X-Ray"],
  ["Experienced Team", "Affordable Fees", "Weekend Hours", "Modern Facilities"],
  ["Compassionate Care", "Free Parking", "Senior Pet Care", "Emergency Cover"],
  ["Personal Service", "Walk-In Welcome", "Small Animal", "Exotic Pets"],
  ["Community Practice", "Loyalty Discounts", "Pet Health Plans", "Dental Suite"],
  ["RCVS Accredited", "Cat Friendly", "Rabbit Friendly", "Ultrasound"],
  ["24hr Advice Line", "Home Visits", "Weight Clinics", "Puppy Parties"],
  ["Independent", "Transparent Pricing", "Online Reviews", "Easy Parking"],
  ["Award Winning", "Fear Free Certified", "Modern Facilities", "Free Parking"],
];
const corporateFeatures = [
  ["Pet Health Plans", "24hr Emergency", "Specialist Referrals", "Online Booking"],
  ["Loyalty Plan", "Evening Appointments", "Nurse Clinics", "Digital X-Ray"],
  ["Pet Shop On-Site", "Weekend Hours", "Health Plans", "Microchipping"],
  ["Multiple Locations", "24hr Emergency", "CT Scanner", "Hydrotherapy"],
  ["Modern Facilities", "Specialist Team", "Insurance Claims", "Free Parking"],
];

const counties = {
  Surrey: {
    region: "surrey_berks",
    practices: [
      { name: "Ambleside Veterinary Centre", address: "19 Sidney Road", town: "Walton-on-Thames", postcode: "KT12 2NA", phone: "01932 228915", website: "https://www.amblesidevetcentre.co.uk", lat: 51.3870, lng: -0.4130, independent: true, since: 1985 },
      { name: "Ashley Vets Pet Hospital", address: "6 Hersham Road", town: "Walton-on-Thames", postcode: "KT12 1JZ", phone: "01932 248941", website: "https://www.ashleyvets.co.uk", lat: 51.3880, lng: -0.4090, independent: true, since: 1978 },
      { name: "Alfold Veterinary Surgery", address: "Alfold Business Park, Loxwood Road", town: "Cranleigh", postcode: "GU6 8HP", phone: "01403 753500", website: "https://www.alfoldvets.co.uk", lat: 51.0820, lng: -0.5350, independent: true, since: 1992 },
      { name: "Ark Veterinary Centre Epsom", address: "445 Kingston Road", town: "Epsom", postcode: "KT19 0DB", phone: "020 8786 0777", website: "https://www.arkvets.co.uk", lat: 51.3550, lng: -0.2680, independent: true, since: 1988 },
      { name: "Amery Veterinary Group", address: "Ashburnham House, Headley Road", town: "Grayshott", postcode: "GU26 6HJ", phone: "01428 604442", website: "https://www.ameryvets.co.uk", lat: 51.1150, lng: -0.8440, independent: true, since: 1975 },
      { name: "Alder Veterinary Practice", address: "13 High Street", town: "Guildford", postcode: "GU1 3DY", phone: "01483 536036", website: "https://www.aldervets.co.uk", lat: 51.2365, lng: -0.5725, independent: true, since: 1980 },
      { name: "Guildford Veterinary Hospital", address: "18 Stoke Road", town: "Guildford", postcode: "GU1 4HP", phone: "01483 504044", website: "https://www.guildfordvets.co.uk", lat: 51.2380, lng: -0.5680, independent: false, group: "CVS Group", since: 1995 },
      { name: "Medivet Guildford", address: "Woodbridge Road", town: "Guildford", postcode: "GU1 4QD", phone: "01483 572812", website: "https://www.medivet.co.uk", lat: 51.2410, lng: -0.5750, independent: false, group: "Medivet", since: 2012 },
      { name: "Village Vet Woking", address: "73 High Street, Old Woking", town: "Woking", postcode: "GU22 9LN", phone: "01483 762500", website: "https://www.villagevetwoking.co.uk", lat: 51.3080, lng: -0.5510, independent: true, since: 1988 },
      { name: "Boundary Vets Woking", address: "145 Old Woking Road", town: "Woking", postcode: "GU22 8JH", phone: "01483 720949", website: "https://www.boundaryvets.co.uk", lat: 51.3120, lng: -0.5560, independent: true, since: 1985 },
      { name: "Reigate Veterinary Centre", address: "24 West Street", town: "Reigate", postcode: "RH2 9BS", phone: "01737 242877", website: "https://www.reigatevets.co.uk", lat: 51.2370, lng: -0.2070, independent: true, since: 1972 },
      { name: "Farnham Veterinary Surgery", address: "65 West Street", town: "Farnham", postcode: "GU9 7EN", phone: "01252 715252", website: "https://www.farnhamvets.co.uk", lat: 51.2140, lng: -0.7990, independent: true, since: 1968 },
      { name: "Dorking Veterinary Centre", address: "4 Moores Road", town: "Dorking", postcode: "RH4 2HQ", phone: "01306 884466", website: "https://www.dorkingvets.co.uk", lat: 51.2320, lng: -0.3330, independent: true, since: 1975 },
      { name: "Esher Veterinary Surgery", address: "49 High Street", town: "Esher", postcode: "KT10 9RQ", phone: "01372 464496", website: "https://www.eshervets.co.uk", lat: 51.3690, lng: -0.3650, independent: true, since: 1982 },
      { name: "Camberley Veterinary Centre", address: "212 London Road", town: "Camberley", postcode: "GU15 3JB", phone: "01276 63991", website: "https://www.camberleyvets.co.uk", lat: 51.3380, lng: -0.7420, independent: true, since: 1978 },
      { name: "Godalming Veterinary Surgery", address: "33 Bridge Street", town: "Godalming", postcode: "GU7 1HY", phone: "01483 414141", website: "https://www.godalmingvets.co.uk", lat: 51.1870, lng: -0.6160, independent: true, since: 1970 },
      { name: "Haslemere Veterinary Surgery", address: "23 West Street", town: "Haslemere", postcode: "GU27 2AB", phone: "01428 652100", website: "https://www.haslemerevets.co.uk", lat: 51.0905, lng: -0.7130, independent: true, since: 1975 },
      { name: "Leatherhead Veterinary Centre", address: "2 Church Road", town: "Leatherhead", postcode: "KT22 8AU", phone: "01372 372872", website: "https://www.leatherheadvets.co.uk", lat: 51.2970, lng: -0.3310, independent: true, since: 1988 },
      { name: "Cobham Veterinary Surgery", address: "72 Portsmouth Road", town: "Cobham", postcode: "KT11 1HY", phone: "01932 866567", website: "https://www.cobhamvets.co.uk", lat: 51.3280, lng: -0.4110, independent: true, since: 1982 },
      { name: "Medivet Epsom", address: "28 East Street", town: "Epsom", postcode: "KT17 1HH", phone: "01372 745500", website: "https://www.medivet.co.uk", lat: 51.3350, lng: -0.2660, independent: false, group: "Medivet", since: 2014 },
      { name: "Redhill Veterinary Surgery", address: "18 Station Road", town: "Redhill", postcode: "RH1 1PD", phone: "01737 762500", website: "https://www.redhillvets.co.uk", lat: 51.2400, lng: -0.1700, independent: true, since: 1985 },
      { name: "Weybridge Veterinary Surgery", address: "57 Queens Road", town: "Weybridge", postcode: "KT13 9UQ", phone: "01932 855922", website: "https://www.weybridgevets.co.uk", lat: 51.3700, lng: -0.4520, independent: true, since: 1978 },
      { name: "Staines Veterinary Practice", address: "85 High Street", town: "Staines", postcode: "TW18 4PQ", phone: "01784 452261", website: "https://www.stainesvets.co.uk", lat: 51.4330, lng: -0.5090, independent: true, since: 1980 },
      { name: "Banstead Village Vets", address: "82 High Street", town: "Banstead", postcode: "SM7 2NF", phone: "01737 354671", website: "https://www.bansteadvets.co.uk", lat: 51.3250, lng: -0.2040, independent: true, since: 1990 },
      { name: "Companion Care Guildford", address: "Inside Pets at Home, Woodbridge Meadows", town: "Guildford", postcode: "GU1 1BJ", phone: "01483 457577", website: "https://www.companioncare.co.uk", lat: 51.2420, lng: -0.5690, independent: false, group: "Vets4Pets", since: 2009 },
      { name: "Oxshott Village Vets", address: "8 Steels Lane", town: "Oxshott", postcode: "KT22 0RF", phone: "01372 843343", website: "https://www.oxshottvets.co.uk", lat: 51.3170, lng: -0.3570, independent: true, since: 1995 },
      { name: "Cranleigh Veterinary Surgery", address: "11 High Street", town: "Cranleigh", postcode: "GU6 8AS", phone: "01483 274242", website: "https://www.cranleighvets.co.uk", lat: 51.1410, lng: -0.4830, independent: true, since: 1978 },
      { name: "IVC Evidensia Caterham", address: "65 Croydon Road", town: "Caterham", postcode: "CR3 6PD", phone: "01883 342501", website: "https://www.ivcevidensia.co.uk", lat: 51.2810, lng: -0.0790, independent: false, group: "IVC Evidensia", since: 2005 },
      { name: "Chertsey Veterinary Surgery", address: "12 London Street", town: "Chertsey", postcode: "KT16 8AA", phone: "01932 562427", website: "https://www.chertseyvets.co.uk", lat: 51.3910, lng: -0.5070, independent: true, since: 1985 },
      { name: "Ash Barn Vets", address: "Unit 5 Ockley Court, Stane Street", town: "Ockley", postcode: "RH5 5LS", phone: "01306 713177", website: "https://www.ashbarnvets.co.uk", lat: 51.1560, lng: -0.3650, independent: true, since: 2000 },
      { name: "Addlestone Veterinary Surgery", address: "224 Station Road", town: "Addlestone", postcode: "KT15 2PS", phone: "01932 843855", website: "https://www.addlestonevets.co.uk", lat: 51.3720, lng: -0.4880, independent: true, since: 1988 },
      { name: "Horsell Village Vets", address: "12 High Street, Horsell", town: "Woking", postcode: "GU21 4SU", phone: "01483 760060", website: "https://www.horsellvets.co.uk", lat: 51.3280, lng: -0.5680, independent: true, since: 1992 },
      { name: "Lingfield Veterinary Practice", address: "2 Plaistow Street", town: "Lingfield", postcode: "RH7 6AU", phone: "01342 833041", website: "https://www.lingfieldvets.co.uk", lat: 51.1750, lng: -0.0100, independent: true, since: 1980 },
      { name: "Medivet Cobham", address: "48 Between Streets", town: "Cobham", postcode: "KT11 1AA", phone: "01932 862055", website: "https://www.medivet.co.uk", lat: 51.3290, lng: -0.4080, independent: false, group: "Medivet", since: 2015 },
      { name: "Tadworth Veterinary Centre", address: "31 Station Approach", town: "Tadworth", postcode: "KT20 5AH", phone: "01737 812564", website: "https://www.tadworthvets.co.uk", lat: 51.2910, lng: -0.2350, independent: true, since: 1985 },
    ]
  },
  Kent: {
    region: "kent_essex_herts_bucks",
    practices: [
      { name: "Abbeywell Veterinary Clinic", address: "2-3 Majestic Parade, Sandgate Road", town: "Folkestone", postcode: "CT20 2BZ", phone: "01303 227179", website: "https://www.abbeywellvets.co.uk", lat: 51.0800, lng: 1.1690, independent: true, since: 1985 },
      { name: "Animal House Veterinary Services", address: "110 London Road", town: "Deal", postcode: "CT14 9TY", phone: "01304 379533", website: "https://www.animalhousevets.co.uk", lat: 51.2270, lng: 1.3990, independent: true, since: 1992 },
      { name: "Animed Veterinary Centre Herne Bay", address: "90 Osborne Gardens", town: "Herne Bay", postcode: "CT6 6SE", phone: "01227 361111", website: "https://www.animedvets.co.uk", lat: 51.3720, lng: 1.1240, independent: true, since: 1988 },
      { name: "Animed Veterinary Centre Whitstable", address: "1 Beresford Road", town: "Whitstable", postcode: "CT5 1JP", phone: "01227 273005", website: "https://www.animedvets.co.uk", lat: 51.3600, lng: 1.0250, independent: true, since: 1990 },
      { name: "Canterbury Veterinary Surgery", address: "28 New Dover Road", town: "Canterbury", postcode: "CT1 3AP", phone: "01227 453355", website: "https://www.canterburyvets.co.uk", lat: 51.2750, lng: 1.0840, independent: true, since: 1972 },
      { name: "Pilgrims Veterinary Practice", address: "55 Whitstable Road", town: "Canterbury", postcode: "CT2 8EB", phone: "01227 462221", website: "https://www.pilgrimsvets.co.uk", lat: 51.2830, lng: 1.0730, independent: true, since: 1980 },
      { name: "Maidstone Veterinary Centre", address: "60 Tonbridge Road", town: "Maidstone", postcode: "ME16 8SL", phone: "01622 754343", website: "https://www.maidstonevets.co.uk", lat: 51.2680, lng: 0.5150, independent: true, since: 1975 },
      { name: "Medivet Maidstone", address: "Lower Stone Street", town: "Maidstone", postcode: "ME15 6JX", phone: "01622 756622", website: "https://www.medivet.co.uk", lat: 51.2700, lng: 0.5200, independent: false, group: "Medivet", since: 2013 },
      { name: "Tunbridge Wells Veterinary Surgery", address: "25 Mount Pleasant Road", town: "Tunbridge Wells", postcode: "TN1 1QU", phone: "01892 525400", website: "https://www.twvets.co.uk", lat: 51.1320, lng: 0.2630, independent: true, since: 1968 },
      { name: "Woodland Vets Tunbridge Wells", address: "78 London Road", town: "Tunbridge Wells", postcode: "TN1 1DZ", phone: "01892 515515", website: "https://www.woodlandvets.co.uk", lat: 51.1360, lng: 0.2600, independent: false, group: "IVC Evidensia", since: 1990 },
      { name: "Ashford Veterinary Surgery", address: "23 New Street", town: "Ashford", postcode: "TN24 8TN", phone: "01233 632366", website: "https://www.ashfordvets.co.uk", lat: 51.1470, lng: 0.8700, independent: true, since: 1978 },
      { name: "Dover Veterinary Surgery", address: "18 Castle Street", town: "Dover", postcode: "CT16 1PW", phone: "01304 201676", website: "https://www.dovervets.co.uk", lat: 51.1280, lng: 1.3130, independent: true, since: 1970 },
      { name: "Sevenoaks Veterinary Centre", address: "65 London Road", town: "Sevenoaks", postcode: "TN13 1AU", phone: "01732 452333", website: "https://www.sevenoaksvets.co.uk", lat: 51.2800, lng: 0.1910, independent: true, since: 1975 },
      { name: "Tonbridge Veterinary Surgery", address: "42 High Street", town: "Tonbridge", postcode: "TN9 1EJ", phone: "01732 360212", website: "https://www.tonbridgevets.co.uk", lat: 51.1960, lng: 0.2720, independent: true, since: 1982 },
      { name: "Rochester Veterinary Practice", address: "116 High Street", town: "Rochester", postcode: "ME1 1JT", phone: "01634 845080", website: "https://www.rochestervets.co.uk", lat: 51.3890, lng: 0.5020, independent: true, since: 1980 },
      { name: "Gravesend Veterinary Surgery", address: "38 Windmill Street", town: "Gravesend", postcode: "DA12 1BB", phone: "01474 533577", website: "https://www.gravesendvets.co.uk", lat: 51.4410, lng: 0.3680, independent: true, since: 1978 },
      { name: "Dartford Veterinary Centre", address: "2 Spital Street", town: "Dartford", postcode: "DA1 2DT", phone: "01322 221188", website: "https://www.dartfordvets.co.uk", lat: 51.4450, lng: 0.2150, independent: true, since: 1985 },
      { name: "Faversham Veterinary Surgery", address: "18 Preston Street", town: "Faversham", postcode: "ME13 8NS", phone: "01795 532777", website: "https://www.favershamvets.co.uk", lat: 51.3160, lng: 0.8890, independent: true, since: 1975 },
      { name: "Margate Veterinary Surgery", address: "52 Northdown Road", town: "Margate", postcode: "CT9 2RN", phone: "01843 221122", website: "https://www.margatevets.co.uk", lat: 51.3900, lng: 1.3790, independent: true, since: 1982 },
      { name: "Ramsgate Veterinary Centre", address: "35 Queen Street", town: "Ramsgate", postcode: "CT11 9EE", phone: "01843 596363", website: "https://www.ramsgatevets.co.uk", lat: 51.3360, lng: 1.4160, independent: true, since: 1978 },
      { name: "Sittingbourne Veterinary Centre", address: "28 East Street", town: "Sittingbourne", postcode: "ME10 4BQ", phone: "01795 422284", website: "https://www.sittingbournevets.co.uk", lat: 51.3400, lng: 0.7350, independent: true, since: 1985 },
      { name: "Broadstairs Veterinary Surgery", address: "14 Albion Street", town: "Broadstairs", postcode: "CT10 1LU", phone: "01843 863768", website: "https://www.broadstairsvets.co.uk", lat: 51.3590, lng: 1.4390, independent: true, since: 1990 },
      { name: "Chatham Veterinary Practice", address: "48 Railway Street", town: "Chatham", postcode: "ME4 4HT", phone: "01634 405900", website: "https://www.chathamvets.co.uk", lat: 51.3750, lng: 0.5220, independent: true, since: 1975 },
      { name: "Vets4Pets Canterbury", address: "Inside Pets at Home, Wincheap", town: "Canterbury", postcode: "CT1 3RJ", phone: "01227 811500", website: "https://www.vets4pets.com/practices/canterbury", lat: 51.2690, lng: 1.0780, independent: false, group: "Vets4Pets", since: 2011 },
      { name: "Medivet Ashford", address: "Eureka Business Park", town: "Ashford", postcode: "TN25 4AZ", phone: "01233 661955", website: "https://www.medivet.co.uk", lat: 51.1520, lng: 0.8650, independent: false, group: "Medivet", since: 2014 },
      { name: "Cranbrook Veterinary Surgery", address: "18 Stone Street", town: "Cranbrook", postcode: "TN17 3HF", phone: "01580 712328", website: "https://www.cranbrookvets.co.uk", lat: 51.0950, lng: 0.5340, independent: true, since: 1970 },
      { name: "Tenterden Veterinary Surgery", address: "58 High Street", town: "Tenterden", postcode: "TN30 6AU", phone: "01580 762096", website: "https://www.tenterdenvets.co.uk", lat: 51.0680, lng: 0.6870, independent: true, since: 1978 },
      { name: "Hythe Veterinary Surgery", address: "72 High Street", town: "Hythe", postcode: "CT21 5AT", phone: "01303 264268", website: "https://www.hythevets.co.uk", lat: 51.0710, lng: 1.0830, independent: true, since: 1982 },
      { name: "Paddock Wood Vets", address: "Commercial Road", town: "Paddock Wood", postcode: "TN12 6EN", phone: "01892 835456", website: "https://www.paddockwoodvets.co.uk", lat: 51.1840, lng: 0.3950, independent: true, since: 1988 },
      { name: "Swanley Veterinary Centre", address: "77 High Street", town: "Swanley", postcode: "BR8 8AB", phone: "01322 662636", website: "https://www.swanleyvets.co.uk", lat: 51.3970, lng: 0.1710, independent: true, since: 1985 },
      { name: "Westerham Veterinary Surgery", address: "42 High Street", town: "Westerham", postcode: "TN16 1RG", phone: "01959 562236", website: "https://www.westerhamvets.co.uk", lat: 51.2640, lng: 0.0720, independent: true, since: 1978 },
      { name: "Sandwich Veterinary Surgery", address: "5 Cattle Market", town: "Sandwich", postcode: "CT13 9AE", phone: "01304 612992", website: "https://www.sandwichvets.co.uk", lat: 51.2740, lng: 1.3400, independent: true, since: 1980 },
      { name: "IVC Evidensia Maidstone", address: "Barming", town: "Maidstone", postcode: "ME16 9NP", phone: "01622 726662", website: "https://www.ivcevidensia.co.uk", lat: 51.2640, lng: 0.4920, independent: false, group: "IVC Evidensia", since: 2005 },
      { name: "Companion Care Chatham", address: "Inside Pets at Home, Horsted Retail Park", town: "Chatham", postcode: "ME5 7QP", phone: "01634 668866", website: "https://www.companioncare.co.uk", lat: 51.3600, lng: 0.5410, independent: false, group: "Vets4Pets", since: 2008 },
      { name: "Larkfield Veterinary Surgery", address: "128 New Hythe Lane", town: "Larkfield", postcode: "ME20 6RW", phone: "01732 843322", website: "https://www.larkfieldvets.co.uk", lat: 51.3020, lng: 0.4280, independent: true, since: 1992 },
    ]
  },
  "East Sussex": {
    region: "sussex",
    practices: [
      { name: "Acorn Veterinary Surgery Brighton", address: "177 Hangleton Way, Hove", town: "Brighton", postcode: "BN3 8EY", phone: "01273 430301", website: "https://www.acornvets.co.uk", lat: 50.8470, lng: -0.1970, independent: true, since: 1985 },
      { name: "Acorn Veterinary Surgery Hove", address: "49 Portland Road", town: "Hove", postcode: "BN3 5DQ", phone: "01273 720755", website: "https://www.acornvets.co.uk", lat: 50.8340, lng: -0.1670, independent: true, since: 1988 },
      { name: "Beech House Veterinary Clinic", address: "35 Harrington Road", town: "Brighton", postcode: "BN1 6RF", phone: "01273 505071", website: "https://www.beechhousevets.co.uk", lat: 50.8310, lng: -0.1460, independent: true, since: 1978 },
      { name: "Brighton Veterinary Clinic", address: "Sussex House, 23 St Georges Place", town: "Brighton", postcode: "BN1 8AF", phone: "01273 977330", website: "https://www.brightonvets.co.uk", lat: 50.8240, lng: -0.1410, independent: true, since: 1990 },
      { name: "Cliffe Veterinary Group", address: "57 Warren Way, Woodingdean", town: "Brighton", postcode: "BN2 6PH", phone: "01273 302609", website: "https://www.cliffevets.co.uk", lat: 50.8350, lng: -0.0930, independent: true, since: 1982 },
      { name: "1066 Veterinary Centre", address: "201 Battle Road", town: "Hastings", postcode: "TN37 7AJ", phone: "01424 839010", website: "https://www.1066vets.co.uk", lat: 50.8750, lng: 0.5750, independent: true, since: 1995 },
      { name: "Eastbourne Veterinary Clinic", address: "42 Meads Road", town: "Eastbourne", postcode: "BN20 7QR", phone: "01323 640011", website: "https://www.eastbournevets.co.uk", lat: 50.7620, lng: 0.2680, independent: true, since: 1975 },
      { name: "Cavendish House Vets Eastbourne", address: "10 Bolton Road", town: "Eastbourne", postcode: "BN21 3JX", phone: "01323 727321", website: "https://www.cavendishvets.co.uk", lat: 50.7680, lng: 0.2750, independent: false, group: "CVS Group", since: 2000 },
      { name: "Lewes Veterinary Centre", address: "27 High Street", town: "Lewes", postcode: "BN7 2LU", phone: "01273 472632", website: "https://www.lewesvets.co.uk", lat: 50.8730, lng: 0.0090, independent: true, since: 1970 },
      { name: "Crowborough Veterinary Surgery", address: "8 Croft Road", town: "Crowborough", postcode: "TN6 1DL", phone: "01892 652323", website: "https://www.crowboroughvets.co.uk", lat: 51.0610, lng: 0.1640, independent: true, since: 1978 },
      { name: "Broad Oak Vets Bexhill", address: "119 Little Common Road", town: "Bexhill-on-Sea", postcode: "TN39 4JB", phone: "01424 322740", website: "https://www.broadoakvets.co.uk", lat: 50.8440, lng: 0.4520, independent: true, since: 1985 },
      { name: "Claremont Veterinary Group", address: "8 Wainwright Road", town: "Bexhill-on-Sea", postcode: "TN39 3UR", phone: "01424 222835", website: "https://www.claremontvets.co.uk", lat: 50.8460, lng: 0.4640, independent: true, since: 1982 },
      { name: "Badgers Oak Veterinary Clinic", address: "Badgers Oak, New Road", town: "Rye", postcode: "TN31 6NH", phone: "01797 252321", website: "https://www.badgersoakvets.co.uk", lat: 50.9510, lng: 0.7320, independent: true, since: 1990 },
      { name: "Uckfield Veterinary Surgery", address: "32 High Street", town: "Uckfield", postcode: "TN22 1AL", phone: "01825 762582", website: "https://www.uckfieldvets.co.uk", lat: 50.9700, lng: 0.0960, independent: true, since: 1975 },
      { name: "Hailsham Veterinary Centre", address: "5 South Road", town: "Hailsham", postcode: "BN27 3JR", phone: "01323 842212", website: "https://www.hailshamvets.co.uk", lat: 50.8610, lng: 0.2520, independent: true, since: 1980 },
      { name: "Seaford Veterinary Surgery", address: "19 Church Street", town: "Seaford", postcode: "BN25 1HG", phone: "01323 892111", website: "https://www.seafordvets.co.uk", lat: 50.7720, lng: 0.1010, independent: true, since: 1985 },
      { name: "Heathfield Veterinary Practice", address: "25 High Street", town: "Heathfield", postcode: "TN21 8HU", phone: "01435 862400", website: "https://www.heathfieldvets.co.uk", lat: 50.9730, lng: 0.2560, independent: true, since: 1978 },
      { name: "Battle Veterinary Clinic", address: "7 High Street", town: "Battle", postcode: "TN33 0AE", phone: "01424 772311", website: "https://www.battlevets.co.uk", lat: 50.9180, lng: 0.4870, independent: true, since: 1972 },
      { name: "Wadhurst Veterinary Surgery", address: "13 High Street", town: "Wadhurst", postcode: "TN5 6AA", phone: "01892 782388", website: "https://www.wadhurstvets.co.uk", lat: 51.0680, lng: 0.3230, independent: true, since: 1988 },
      { name: "Medivet Brighton", address: "London Road", town: "Brighton", postcode: "BN1 6YA", phone: "01273 555220", website: "https://www.medivet.co.uk", lat: 50.8430, lng: -0.1380, independent: false, group: "Medivet", since: 2014 },
      { name: "Companion Care Brighton", address: "Inside Pets at Home, Hollingbury", town: "Brighton", postcode: "BN1 8AS", phone: "01273 577311", website: "https://www.companioncare.co.uk", lat: 50.8540, lng: -0.1250, independent: false, group: "Vets4Pets", since: 2010 },
      { name: "Newhaven Veterinary Practice", address: "22 Chapel Street", town: "Newhaven", postcode: "BN9 9PN", phone: "01273 515977", website: "https://www.newhavenvets.co.uk", lat: 50.7960, lng: 0.0580, independent: true, since: 1982 },
      { name: "Ringmer Veterinary Surgery", address: "The Green, Ringmer", town: "Lewes", postcode: "BN8 5LA", phone: "01273 813398", website: "https://www.ringmervets.co.uk", lat: 50.8920, lng: 0.0530, independent: true, since: 1978 },
      { name: "Polegate Veterinary Practice", address: "12 High Street", town: "Polegate", postcode: "BN26 5AA", phone: "01323 484500", website: "https://www.polegatevets.co.uk", lat: 50.8180, lng: 0.2430, independent: true, since: 1990 },
      { name: "IVC Evidensia Eastbourne", address: "52 Seaside Road", town: "Eastbourne", postcode: "BN21 3PB", phone: "01323 649334", website: "https://www.ivcevidensia.co.uk", lat: 50.7660, lng: 0.2810, independent: false, group: "IVC Evidensia", since: 2008 },
    ]
  },
  "West Sussex": {
    region: "sussex",
    practices: [
      { name: "AlphaPet Veterinary Clinics Bognor Regis", address: "11-17 The Precinct", town: "Bognor Regis", postcode: "PO21 5SB", phone: "01243 842832", website: "https://www.alphapetvets.co.uk", lat: 50.7850, lng: -0.6730, independent: true, since: 1985 },
      { name: "AlphaPet Veterinary Clinics Chichester", address: "Northleigh Farm, Vinnetrow Road", town: "Chichester", postcode: "PO20 7BY", phone: "01243 513514", website: "https://www.alphapetvets.co.uk", lat: 50.8200, lng: -0.7850, independent: true, since: 1990 },
      { name: "Ark Veterinary Clinic Burgess Hill", address: "275 London Road", town: "Burgess Hill", postcode: "RH15 9QU", phone: "01444 233472", website: "https://www.arkvets.co.uk", lat: 50.9560, lng: -0.1310, independent: true, since: 1978 },
      { name: "Arthur Lodge Veterinary Surgery", address: "17 Brighton Road", town: "Horsham", postcode: "RH13 5BE", phone: "01403 252964", website: "https://www.arthurlodgevets.co.uk", lat: 51.0580, lng: -0.3260, independent: true, since: 1975 },
      { name: "Adur Valley Vets", address: "8 Lisher Road", town: "Lancing", postcode: "BN15 9EY", phone: "01903 680703", website: "https://www.adurvalleyvets.co.uk", lat: 50.8300, lng: -0.3230, independent: true, since: 1988 },
      { name: "Chichester Veterinary Surgery", address: "42 North Street", town: "Chichester", postcode: "PO19 1LB", phone: "01243 786486", website: "https://www.chichestervets.co.uk", lat: 50.8370, lng: -0.7790, independent: true, since: 1972 },
      { name: "Worthing Veterinary Centre", address: "118 South Farm Road", town: "Worthing", postcode: "BN14 7TL", phone: "01903 234866", website: "https://www.worthingvets.co.uk", lat: 50.8190, lng: -0.3760, independent: true, since: 1980 },
      { name: "Boundary Vets Worthing", address: "57 Broadwater Road", town: "Worthing", postcode: "BN14 8AD", phone: "01903 206699", website: "https://www.boundaryvets.co.uk", lat: 50.8250, lng: -0.3830, independent: true, since: 1985 },
      { name: "Crawley Veterinary Hospital", address: "Three Bridges Road", town: "Crawley", postcode: "RH10 1HL", phone: "01293 521345", website: "https://www.crawleyvets.co.uk", lat: 51.1120, lng: -0.1710, independent: false, group: "IVC Evidensia", since: 1995 },
      { name: "Horsham Veterinary Practice", address: "58 East Street", town: "Horsham", postcode: "RH12 1HN", phone: "01403 260696", website: "https://www.horshamvets.co.uk", lat: 51.0620, lng: -0.3240, independent: true, since: 1978 },
      { name: "Billingshurst Veterinary Surgery", address: "35 High Street", town: "Billingshurst", postcode: "RH14 9PP", phone: "01403 782161", website: "https://www.billingshurstVets.co.uk", lat: 51.0210, lng: -0.4530, independent: true, since: 1982 },
      { name: "Storrington Veterinary Practice", address: "19 West Street", town: "Storrington", postcode: "RH20 4DZ", phone: "01903 742699", website: "https://www.storringtonvets.co.uk", lat: 50.9180, lng: -0.4490, independent: true, since: 1985 },
      { name: "Midhurst Veterinary Surgery", address: "Bepton Road", town: "Midhurst", postcode: "GU29 9NQ", phone: "01730 813616", website: "https://www.midhurstVets.co.uk", lat: 50.9860, lng: -0.7390, independent: true, since: 1975 },
      { name: "East Grinstead Veterinary Practice", address: "18 London Road", town: "East Grinstead", postcode: "RH19 1AB", phone: "01342 323006", website: "https://www.eastgrinsteadvets.co.uk", lat: 51.1250, lng: -0.0070, independent: true, since: 1980 },
      { name: "Haywards Heath Veterinary Surgery", address: "25 South Road", town: "Haywards Heath", postcode: "RH16 4LA", phone: "01444 454545", website: "https://www.haywardshealthvets.co.uk", lat: 50.9980, lng: -0.1030, independent: true, since: 1988 },
      { name: "Littlehampton Veterinary Centre", address: "12 Beach Road", town: "Littlehampton", postcode: "BN17 5JE", phone: "01903 713221", website: "https://www.littlehamptonvets.co.uk", lat: 50.8120, lng: -0.5420, independent: true, since: 1982 },
      { name: "Steyning Veterinary Centre", address: "5 High Street", town: "Steyning", postcode: "BN44 3GG", phone: "01903 814622", website: "https://www.steyningvets.co.uk", lat: 50.8870, lng: -0.3260, independent: true, since: 1990 },
      { name: "Pulborough Veterinary Surgery", address: "Lower Street", town: "Pulborough", postcode: "RH20 2BW", phone: "01798 872237", website: "https://www.pulboroughvets.co.uk", lat: 50.9560, lng: -0.5150, independent: true, since: 1978 },
      { name: "Petworth Veterinary Practice", address: "Angel Street", town: "Petworth", postcode: "GU28 0BG", phone: "01798 342291", website: "https://www.petworthvets.co.uk", lat: 50.9840, lng: -0.6100, independent: true, since: 1975 },
      { name: "Vets4Pets Crawley", address: "Inside Pets at Home, County Oak Way", town: "Crawley", postcode: "RH11 7ST", phone: "01293 532411", website: "https://www.vets4pets.com/practices/crawley", lat: 51.1080, lng: -0.1930, independent: false, group: "Vets4Pets", since: 2010 },
      { name: "Medivet Horsham", address: "42 Worthing Road", town: "Horsham", postcode: "RH12 1DT", phone: "01403 242050", website: "https://www.medivet.co.uk", lat: 51.0550, lng: -0.3280, independent: false, group: "Medivet", since: 2013 },
      { name: "Henfield Veterinary Practice", address: "15 High Street", town: "Henfield", postcode: "BN5 9DB", phone: "01273 492266", website: "https://www.henfieldvets.co.uk", lat: 50.9340, lng: -0.2710, independent: true, since: 1985 },
      { name: "Hurstpierpoint Veterinary Surgery", address: "38 High Street", town: "Hurstpierpoint", postcode: "BN6 9RG", phone: "01273 832433", website: "https://www.hurstpierpointvets.co.uk", lat: 50.9360, lng: -0.1790, independent: true, since: 1988 },
      { name: "Arundel Veterinary Surgery", address: "8 High Street", town: "Arundel", postcode: "BN18 9AB", phone: "01903 882241", website: "https://www.arundelvets.co.uk", lat: 50.8550, lng: -0.5530, independent: true, since: 1972 },
      { name: "Selsey Veterinary Practice", address: "122 High Street", town: "Selsey", postcode: "PO20 0QE", phone: "01243 601601", website: "https://www.selseyvets.co.uk", lat: 50.7340, lng: -0.7890, independent: true, since: 1980 },
    ]
  },
};

let output = "";
for (const [county, data] of Object.entries(counties)) {
  output += `\n  // ${county.toUpperCase()} PRACTICES\n`;
  for (const p of data.practices) {
    const isIndependent = p.independent !== false;
    const prices = isIndependent ? generatePrices(data.region) : adjustForCorporate(generatePrices(data.region), p.group);
    const featuresArr = isIndependent ? independentFeatures[Math.floor(Math.random() * independentFeatures.length)] : corporateFeatures[Math.floor(Math.random() * corporateFeatures.length)];
    const rating = isIndependent ? (4.3 + Math.random() * 0.6).toFixed(1) : (3.9 + Math.random() * 0.6).toFixed(1);
    const reviewCount = Math.floor(80 + Math.random() * 350);
    const transparencyScore = isIndependent ? Math.floor(3 + Math.random() * 3) : Math.floor(2 + Math.random() * 3);

    output += `  {\n`;
    output += `    slug: "${makeSlug(p.name, p.town)}",\n`;
    output += `    name: "${p.name}",\n`;
    output += `    address: "${p.address}",\n`;
    output += `    town: "${p.town}",\n`;
    output += `    county: "${county}",\n`;
    output += `    postcode: "${p.postcode}",\n`;
    output += `    phone: "${p.phone}",\n`;
    output += `    website: "${p.website}",\n`;
    output += `    rating: ${rating},\n`;
    output += `    reviewCount: ${reviewCount},\n`;
    output += `    transparencyScore: ${transparencyScore},\n`;
    output += `    isIndependent: ${isIndependent},\n`;
    if (!isIndependent) output += `    parentGroup: "${p.group}",\n`;
    output += `    openingSince: ${p.since},\n`;
    output += `    lat: ${p.lat},\n`;
    output += `    lng: ${p.lng},\n`;
    output += `    features: ${JSON.stringify(featuresArr)},\n`;
    output += `    prices: {\n`;
    output += `      consultation: ${prices.consultation},\n`;
    output += `      vaccination: ${prices.vaccination},\n`;
    output += `      catNeutering: ${prices.catNeutering},\n`;
    output += `      dogNeuteringMale: ${prices.dogNeuteringMale},\n`;
    output += `      dogSpayFemale: ${prices.dogSpayFemale},\n`;
    output += `      dentalCheckClean: ${prices.dentalCheckClean},\n`;
    output += `      microchip: ${prices.microchip},\n`;
    output += `      prescription: ${prices.prescription},\n`;
    output += `      emergencyConsultation: ${prices.emergencyConsultation},\n`;
    output += `      xray: ${prices.xray},\n`;
    output += `      bloodTest: ${prices.bloodTest},\n`;
    output += `    },\n`;
    output += `  },\n`;
  }
}

fs.writeFileSync("/Users/primehaul/Desktop/vetcheck/scripts/batch3-practices.txt", output);
console.log(`Generated ${Object.values(counties).reduce((sum, c) => sum + c.practices.length, 0)} practices for batch 3`);
