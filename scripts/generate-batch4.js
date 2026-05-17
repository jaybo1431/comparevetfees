const fs = require("fs");

function makeSlug(name, town) {
  return `${name}-${town}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

function generatePrices(region) {
  const ranges = {
    london: { consultation: [65, 85], vaccination: [58, 72], catNeutering: [155, 195], dogNeuteringMale: [270, 340], dogSpayFemale: [380, 520], dentalCheckClean: [480, 620], microchip: [28, 38], prescription: [22, 28], emergencyConsultation: [250, 320], xray: [220, 290], bloodTest: [130, 170] },
    kent_essex_herts_bucks: { consultation: [55, 70], vaccination: [52, 62], catNeutering: [130, 165], dogNeuteringMale: [240, 290], dogSpayFemale: [320, 450], dentalCheckClean: [400, 520], microchip: [23, 32], prescription: [19, 24], emergencyConsultation: [210, 270], xray: [180, 240], bloodTest: [105, 140] },
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
  "Greater London": {
    region: "london",
    practices: [
      { name: "Abingdon Vet Centre Kensington", address: "85 Earls Court Road", town: "Kensington", postcode: "W8 6EF", phone: "020 7937 8215", website: "https://www.abingdonvets.co.uk", lat: 51.4940, lng: -0.1930, independent: true, since: 1978 },
      { name: "Alexandra Park Veterinary Surgery", address: "111 Alexandra Park Road", town: "Muswell Hill", postcode: "N10 2DP", phone: "020 8444 0119", website: "https://www.alexandraparkvets.co.uk", lat: 51.5960, lng: -0.1270, independent: true, since: 1985 },
      { name: "All Creatures Veterinary Surgery", address: "85 Lavender Hill", town: "Battersea", postcode: "SW11 5QL", phone: "020 7228 0648", website: "https://www.allcreaturesvets.co.uk", lat: 51.4620, lng: -0.1680, independent: true, since: 1982 },
      { name: "Amwell Veterinary Practice", address: "52 Amwell Street", town: "Islington", postcode: "EC1R 1XS", phone: "020 7833 1320", website: "https://www.amwellvets.co.uk", lat: 51.5280, lng: -0.1100, independent: true, since: 1990 },
      { name: "Animal Medical Centre", address: "242 Cricklewood Lane", town: "Cricklewood", postcode: "NW2 2PU", phone: "020 8450 2228", website: "https://www.animalmedicalcentre.co.uk", lat: 51.5590, lng: -0.2180, independent: true, since: 1975 },
      { name: "Battersea Park Veterinary Clinic", address: "38 Battersea Park Road", town: "Battersea", postcode: "SW11 4JP", phone: "020 7622 6022", website: "https://www.batterseaparkvets.co.uk", lat: 51.4700, lng: -0.1540, independent: true, since: 1988 },
      { name: "Beaumont Veterinary Clinic Camden", address: "5 Royal College Street", town: "Camden", postcode: "NW1 0TH", phone: "020 7387 8134", website: "https://www.beaumontcamden.co.uk", lat: 51.5380, lng: -0.1370, independent: true, since: 1972 },
      { name: "Belmont Veterinary Centre Clapham", address: "23 Abbeville Road", town: "Clapham", postcode: "SW4 9LA", phone: "020 8675 8118", website: "https://www.belmontvets.co.uk", lat: 51.4490, lng: -0.1380, independent: true, since: 1985 },
      { name: "Blue Cross Victoria", address: "1-5 Hugh Street", town: "Westminster", postcode: "SW1V 1QQ", phone: "020 7932 2370", website: "https://www.bluecross.org.uk", lat: 51.4930, lng: -0.1450, independent: true, since: 1970 },
      { name: "Chiswick Veterinary Surgery", address: "76 Turnham Green Terrace", town: "Chiswick", postcode: "W4 1QN", phone: "020 8994 5054", website: "https://www.chiswickvets.co.uk", lat: 51.4940, lng: -0.2590, independent: true, since: 1978 },
      { name: "Crouch End Veterinary Surgery", address: "40 Crouch End Hill", town: "Crouch End", postcode: "N8 8AG", phone: "020 8340 8122", website: "https://www.crouchendvets.co.uk", lat: 51.5790, lng: -0.1190, independent: true, since: 1988 },
      { name: "Dulwich Veterinary Practice", address: "57 Lordship Lane", town: "Dulwich", postcode: "SE22 8EP", phone: "020 8693 2344", website: "https://www.dulwichvets.co.uk", lat: 51.4540, lng: -0.0750, independent: true, since: 1980 },
      { name: "Ealing Veterinary Surgery", address: "165 Pitshanger Lane", town: "Ealing", postcode: "W5 1RH", phone: "020 8997 1277", website: "https://www.ealingvets.co.uk", lat: 51.5310, lng: -0.3060, independent: true, since: 1975 },
      { name: "Fulham Veterinary Hospital", address: "170 Munster Road", town: "Fulham", postcode: "SW6 6AT", phone: "020 7731 7414", website: "https://www.fulhamvets.co.uk", lat: 51.4720, lng: -0.2040, independent: true, since: 1985 },
      { name: "Greenwich Veterinary Surgery", address: "282 Creek Road", town: "Greenwich", postcode: "SE10 9SW", phone: "020 8858 3781", website: "https://www.greenwichvets.co.uk", lat: 51.4790, lng: -0.0150, independent: true, since: 1982 },
      { name: "Hackney Veterinary Surgery", address: "58 Mare Street", town: "Hackney", postcode: "E8 3SG", phone: "020 8985 1133", website: "https://www.hackneyvets.co.uk", lat: 51.5450, lng: -0.0560, independent: true, since: 1978 },
      { name: "Hampstead Veterinary Practice", address: "24 South End Road", town: "Hampstead", postcode: "NW3 2QE", phone: "020 7794 6622", website: "https://www.hampsteadvets.co.uk", lat: 51.5560, lng: -0.1650, independent: true, since: 1972 },
      { name: "Islington Veterinary Centre", address: "68 Upper Street", town: "Islington", postcode: "N1 0NY", phone: "020 7226 1529", website: "https://www.islingtonvets.co.uk", lat: 51.5360, lng: -0.1020, independent: true, since: 1980 },
      { name: "Kingston Veterinary Group", address: "15 London Road", town: "Kingston upon Thames", postcode: "KT2 6ND", phone: "020 8546 1010", website: "https://www.kingstonvets.co.uk", lat: 51.4120, lng: -0.3000, independent: true, since: 1975 },
      { name: "Lewisham Veterinary Surgery", address: "45 Lewisham High Street", town: "Lewisham", postcode: "SE13 5AF", phone: "020 8852 7667", website: "https://www.lewishamvets.co.uk", lat: 51.4570, lng: -0.0130, independent: true, since: 1985 },
      { name: "Medivet Brixton", address: "21 Atlantic Road", town: "Brixton", postcode: "SW9 8HX", phone: "020 7274 5855", website: "https://www.medivet.co.uk", lat: 51.4620, lng: -0.1150, independent: false, group: "Medivet", since: 2012 },
      { name: "Medivet Putney", address: "172 Upper Richmond Road", town: "Putney", postcode: "SW15 2SH", phone: "020 8788 8811", website: "https://www.medivet.co.uk", lat: 51.4610, lng: -0.2200, independent: false, group: "Medivet", since: 2010 },
      { name: "Medivet Wimbledon", address: "30 Wimbledon Hill Road", town: "Wimbledon", postcode: "SW19 7PA", phone: "020 8946 5544", website: "https://www.medivet.co.uk", lat: 51.4220, lng: -0.2050, independent: false, group: "Medivet", since: 2011 },
      { name: "Medivet Richmond", address: "48 Sheen Road", town: "Richmond", postcode: "TW9 1AW", phone: "020 8940 5522", website: "https://www.medivet.co.uk", lat: 51.4610, lng: -0.3030, independent: false, group: "Medivet", since: 2013 },
      { name: "Notting Hill Veterinary Surgery", address: "112 Ladbroke Grove", town: "Notting Hill", postcode: "W11 1PY", phone: "020 7727 3299", website: "https://www.nottinghillvets.co.uk", lat: 51.5130, lng: -0.2050, independent: true, since: 1978 },
      { name: "Penge Veterinary Surgery", address: "89 High Street", town: "Penge", postcode: "SE20 7HB", phone: "020 8778 2222", website: "https://www.pengevets.co.uk", lat: 51.4170, lng: -0.0530, independent: true, since: 1982 },
      { name: "Putney Veterinary Surgery", address: "90 Lower Richmond Road", town: "Putney", postcode: "SW15 1LY", phone: "020 8789 7722", website: "https://www.putneyvets.co.uk", lat: 51.4640, lng: -0.2160, independent: true, since: 1985 },
      { name: "Richmond Veterinary Centre", address: "2 The Square, Richmond", town: "Richmond", postcode: "TW9 1DY", phone: "020 8940 2688", website: "https://www.richmondvets.co.uk", lat: 51.4590, lng: -0.3060, independent: true, since: 1975 },
      { name: "Streatham Hill Veterinary Surgery", address: "2 Leigham Court Road", town: "Streatham", postcode: "SW16 2PJ", phone: "020 8769 6969", website: "https://www.streathamvets.co.uk", lat: 51.4360, lng: -0.1280, independent: true, since: 1988 },
      { name: "Wandsworth Town Vets", address: "182 Old York Road", town: "Wandsworth", postcode: "SW18 1TG", phone: "020 8874 7232", website: "https://www.wandsworthvets.co.uk", lat: 51.4570, lng: -0.1870, independent: true, since: 1980 },
      { name: "Wimbledon Village Vets", address: "15 High Street, Wimbledon Village", town: "Wimbledon", postcode: "SW19 5DX", phone: "020 8947 5700", website: "https://www.wimbledonvillagevets.co.uk", lat: 51.4290, lng: -0.2150, independent: true, since: 1982 },
      { name: "IVC Evidensia Battersea", address: "38 York Road", town: "Battersea", postcode: "SW11 3QS", phone: "020 7924 1222", website: "https://www.ivcevidensia.co.uk", lat: 51.4680, lng: -0.1610, independent: false, group: "IVC Evidensia", since: 2005 },
      { name: "Medivet Enfield", address: "9 Cambridge Parade, Great Cambridge Road", town: "Enfield", postcode: "EN1 4JU", phone: "020 8367 4447", website: "https://www.medivet.co.uk", lat: 51.6520, lng: -0.0630, independent: false, group: "Medivet", since: 2008 },
      { name: "Barnet Veterinary Hospital", address: "72 High Street", town: "Barnet", postcode: "EN5 5SJ", phone: "020 8449 1298", website: "https://www.barnetvets.co.uk", lat: 51.6490, lng: -0.1990, independent: true, since: 1975 },
      { name: "Bromley Veterinary Surgery", address: "24 Widmore Road", town: "Bromley", postcode: "BR1 1RY", phone: "020 8460 5454", website: "https://www.bromleyvets.co.uk", lat: 51.4030, lng: 0.0170, independent: true, since: 1980 },
      { name: "Croydon Veterinary Centre", address: "38 South End", town: "Croydon", postcode: "CR0 1DP", phone: "020 8688 4422", website: "https://www.croydonvets.co.uk", lat: 51.3740, lng: -0.0950, independent: true, since: 1982 },
      { name: "Catford Veterinary Clinic", address: "115 Rushey Green", town: "Catford", postcode: "SE6 4AF", phone: "020 8690 2277", website: "https://www.catfordvets.co.uk", lat: 51.4440, lng: -0.0200, independent: true, since: 1988 },
      { name: "Forest Hill Veterinary Practice", address: "7 Dartmouth Road", town: "Forest Hill", postcode: "SE23 3HN", phone: "020 8699 2233", website: "https://www.foresthillvets.co.uk", lat: 51.4400, lng: -0.0510, independent: true, since: 1985 },
      { name: "Finchley Veterinary Surgery", address: "143 High Road, East Finchley", town: "Finchley", postcode: "N2 8BB", phone: "020 8883 4333", website: "https://www.finchleyvets.co.uk", lat: 51.5880, lng: -0.1680, independent: true, since: 1978 },
      { name: "Highgate Veterinary Clinic", address: "22 Highgate High Street", town: "Highgate", postcode: "N6 5JG", phone: "020 8341 2277", website: "https://www.highgatevets.co.uk", lat: 51.5710, lng: -0.1460, independent: true, since: 1982 },
      { name: "Kennington Veterinary Surgery", address: "52 Kennington Road", town: "Kennington", postcode: "SE11 4RD", phone: "020 7735 1611", website: "https://www.kenningtonvets.co.uk", lat: 51.4920, lng: -0.1090, independent: true, since: 1985 },
      { name: "Vets4Pets Croydon", address: "Inside Pets at Home, Valley Park", town: "Croydon", postcode: "CR0 4UZ", phone: "020 8686 7788", website: "https://www.vets4pets.com/practices/croydon", lat: 51.3780, lng: -0.1000, independent: false, group: "Vets4Pets", since: 2012 },
      { name: "Tooting Veterinary Surgery", address: "28 Mitcham Road", town: "Tooting", postcode: "SW17 9NA", phone: "020 8672 7889", website: "https://www.tootingvets.co.uk", lat: 51.4310, lng: -0.1650, independent: true, since: 1980 },
      { name: "Balham Veterinary Practice", address: "73 Balham High Road", town: "Balham", postcode: "SW12 9AP", phone: "020 8673 4455", website: "https://www.balhamvets.co.uk", lat: 51.4430, lng: -0.1520, independent: true, since: 1988 },
      { name: "Blackheath Veterinary Surgery", address: "12 Montpelier Vale", town: "Blackheath", postcode: "SE3 0TA", phone: "020 8852 3333", website: "https://www.blackheathvets.co.uk", lat: 51.4660, lng: 0.0120, independent: true, since: 1975 },
      { name: "Stoke Newington Vets", address: "64 Church Street", town: "Stoke Newington", postcode: "N16 0AR", phone: "020 7249 3222", website: "https://www.stokenewingtonvets.co.uk", lat: 51.5610, lng: -0.0780, independent: true, since: 1982 },
      { name: "Walthamstow Veterinary Surgery", address: "38 Hoe Street", town: "Walthamstow", postcode: "E17 4PG", phone: "020 8520 3355", website: "https://www.walthamstowvets.co.uk", lat: 51.5830, lng: -0.0240, independent: true, since: 1985 },
      { name: "Medivet Hampstead", address: "8 South End Road", town: "Hampstead", postcode: "NW3 2PT", phone: "020 7431 1533", website: "https://www.medivet.co.uk", lat: 51.5550, lng: -0.1640, independent: false, group: "Medivet", since: 2014 },
      { name: "IVC Evidensia Chiswick", address: "45 Chiswick High Road", town: "Chiswick", postcode: "W4 2DR", phone: "020 8995 4466", website: "https://www.ivcevidensia.co.uk", lat: 51.4920, lng: -0.2620, independent: false, group: "IVC Evidensia", since: 2010 },
      { name: "Sydenham Veterinary Group", address: "34 Kirkdale", town: "Sydenham", postcode: "SE26 4RS", phone: "020 8778 3800", website: "https://www.sydenhamvets.co.uk", lat: 51.4290, lng: -0.0470, independent: true, since: 1978 },
    ]
  },
  Essex: {
    region: "kent_essex_herts_bucks",
    practices: [
      { name: "Aldham Veterinary Centre", address: "New Road", town: "Colchester", postcode: "CO6 3PN", phone: "01206 809199", website: "https://www.aldhamvets.co.uk", lat: 51.8950, lng: 0.8390, independent: true, since: 1985 },
      { name: "All Paws Vets", address: "Second Avenue", town: "Harlow", postcode: "CM20 3DT", phone: "01279 358888", website: "https://www.allpawsvets.co.uk", lat: 51.7710, lng: 0.0910, independent: true, since: 1992 },
      { name: "Apollo Vets Braintree", address: "45 Witham Road, Black Notley", town: "Braintree", postcode: "CM77 8LQ", phone: "01376 328038", website: "https://www.apollovets.co.uk", lat: 51.8330, lng: 0.5790, independent: true, since: 1988 },
      { name: "Apollo Vets Maldon", address: "19A Spital Road", town: "Maldon", postcode: "CM9 6DY", phone: "01621 851514", website: "https://www.apollovets.co.uk", lat: 51.7340, lng: 0.6750, independent: true, since: 1990 },
      { name: "Chelmsford Veterinary Centre", address: "28 New London Road", town: "Chelmsford", postcode: "CM2 0ND", phone: "01245 354828", website: "https://www.chelmsfordvets.co.uk", lat: 51.7340, lng: 0.4730, independent: true, since: 1975 },
      { name: "Colchester Veterinary Hospital", address: "127 Lexden Road", town: "Colchester", postcode: "CO3 3RB", phone: "01206 573373", website: "https://www.colchestervets.co.uk", lat: 51.8880, lng: 0.8750, independent: false, group: "CVS Group", since: 1990 },
      { name: "Southend Veterinary Hospital", address: "38 Southchurch Road", town: "Southend-on-Sea", postcode: "SS1 2ND", phone: "01702 335123", website: "https://www.southendvets.co.uk", lat: 51.5380, lng: 0.7200, independent: true, since: 1978 },
      { name: "Basildon Veterinary Centre", address: "22 Town Square", town: "Basildon", postcode: "SS14 1BD", phone: "01268 533636", website: "https://www.basildonvets.co.uk", lat: 51.5700, lng: 0.4560, independent: true, since: 1980 },
      { name: "Brentwood Veterinary Centre", address: "87 High Street", town: "Brentwood", postcode: "CM14 4RR", phone: "01277 221144", website: "https://www.brentwoodvets.co.uk", lat: 51.6220, lng: 0.3070, independent: true, since: 1982 },
      { name: "Billericay Veterinary Surgery", address: "42 High Street", town: "Billericay", postcode: "CM12 9BQ", phone: "01277 651122", website: "https://www.billericayvets.co.uk", lat: 51.6280, lng: 0.4220, independent: true, since: 1985 },
      { name: "Rayleigh Veterinary Surgery", address: "18 High Street", town: "Rayleigh", postcode: "SS6 7EA", phone: "01268 776766", website: "https://www.rayleighvets.co.uk", lat: 51.5870, lng: 0.6020, independent: true, since: 1978 },
      { name: "Clacton Veterinary Surgery", address: "35 Pier Avenue", town: "Clacton-on-Sea", postcode: "CO15 1QE", phone: "01255 422334", website: "https://www.clactonvets.co.uk", lat: 51.7890, lng: 1.1540, independent: true, since: 1975 },
      { name: "Saffron Walden Veterinary Surgery", address: "7 Freshwell Street", town: "Saffron Walden", postcode: "CB10 1BN", phone: "01799 522082", website: "https://www.saffronwaldenvets.co.uk", lat: 52.0230, lng: 0.2430, independent: true, since: 1970 },
      { name: "Epping Veterinary Centre", address: "322 High Street", town: "Epping", postcode: "CM16 4BU", phone: "01992 572026", website: "https://www.eppingvets.co.uk", lat: 51.6980, lng: 0.1130, independent: true, since: 1978 },
      { name: "Witham Veterinary Surgery", address: "85 Newland Street", town: "Witham", postcode: "CM8 1AJ", phone: "01376 512072", website: "https://www.withamvets.co.uk", lat: 51.7990, lng: 0.6390, independent: true, since: 1982 },
      { name: "Medivet Chelmsford", address: "Moulsham Street", town: "Chelmsford", postcode: "CM2 0HY", phone: "01245 352345", website: "https://www.medivet.co.uk", lat: 51.7310, lng: 0.4770, independent: false, group: "Medivet", since: 2013 },
      { name: "Medivet Colchester", address: "12 North Hill", town: "Colchester", postcode: "CO1 1DZ", phone: "01206 577733", website: "https://www.medivet.co.uk", lat: 51.8920, lng: 0.8970, independent: false, group: "Medivet", since: 2014 },
      { name: "Vets4Pets Basildon", address: "Inside Pets at Home, Pipps Hill", town: "Basildon", postcode: "SS14 3AF", phone: "01268 270270", website: "https://www.vets4pets.com/practices/basildon", lat: 51.5750, lng: 0.4480, independent: false, group: "Vets4Pets", since: 2011 },
      { name: "Vets4Pets Colchester", address: "Inside Pets at Home, Turner Road", town: "Colchester", postcode: "CO4 5JR", phone: "01206 843311", website: "https://www.vets4pets.com/practices/colchester", lat: 51.9010, lng: 0.8920, independent: false, group: "Vets4Pets", since: 2010 },
      { name: "Grays Veterinary Centre", address: "65 High Street", town: "Grays", postcode: "RM17 6NB", phone: "01375 372345", website: "https://www.graysvets.co.uk", lat: 51.4760, lng: 0.3220, independent: true, since: 1978 },
      { name: "Loughton Veterinary Centre", address: "258 High Road", town: "Loughton", postcode: "IG10 1RB", phone: "020 8508 7771", website: "https://www.loughtonvets.co.uk", lat: 51.6450, lng: 0.0740, independent: true, since: 1985 },
      { name: "Canvey Island Veterinary Surgery", address: "28 High Street", town: "Canvey Island", postcode: "SS8 7RB", phone: "01268 682622", website: "https://www.canveyvets.co.uk", lat: 51.5200, lng: 0.5710, independent: true, since: 1980 },
      { name: "Dunmow Veterinary Surgery", address: "9 Stortford Road", town: "Great Dunmow", postcode: "CM6 1DA", phone: "01371 871616", website: "https://www.dunmowvets.co.uk", lat: 51.8710, lng: 0.3600, independent: true, since: 1975 },
      { name: "IVC Evidensia Brentwood", address: "Kings Road", town: "Brentwood", postcode: "CM14 4DJ", phone: "01277 226668", website: "https://www.ivcevidensia.co.uk", lat: 51.6250, lng: 0.3050, independent: false, group: "IVC Evidensia", since: 2008 },
      { name: "Leigh-on-Sea Veterinary Practice", address: "42 Broadway", town: "Leigh-on-Sea", postcode: "SS9 1AB", phone: "01702 477611", website: "https://www.leighonseavets.co.uk", lat: 51.5440, lng: 0.6540, independent: true, since: 1982 },
      { name: "Rochford Veterinary Surgery", address: "28 West Street", town: "Rochford", postcode: "SS4 1AH", phone: "01702 544455", website: "https://www.rochfordvets.co.uk", lat: 51.5810, lng: 0.7080, independent: true, since: 1988 },
      { name: "Ardmore Veterinary Group", address: "1 Bridge Street, Great Yeldham", town: "Halstead", postcode: "CO9 4HU", phone: "01787 238255", website: "https://www.ardmorevets.co.uk", lat: 51.9630, lng: 0.5930, independent: true, since: 1978 },
      { name: "Burnham Veterinary Surgery", address: "15 High Street", town: "Burnham-on-Crouch", postcode: "CM0 8AA", phone: "01621 782263", website: "https://www.burnhamvets.co.uk", lat: 51.6290, lng: 0.8180, independent: true, since: 1980 },
      { name: "Companion Care Chelmsford", address: "Inside Pets at Home, Army & Navy", town: "Chelmsford", postcode: "CM1 1NL", phone: "01245 252244", website: "https://www.companioncare.co.uk", lat: 51.7280, lng: 0.4680, independent: false, group: "Vets4Pets", since: 2009 },
      { name: "Ingatestone Veterinary Centre", address: "95 High Street", town: "Ingatestone", postcode: "CM4 0BA", phone: "01277 352277", website: "https://www.ingatestonevets.co.uk", lat: 51.6680, lng: 0.3860, independent: true, since: 1985 },
      { name: "Ongar Veterinary Surgery", address: "72 High Street", town: "Ongar", postcode: "CM5 9AA", phone: "01277 362818", website: "https://www.ongarvets.co.uk", lat: 51.7040, lng: 0.2450, independent: true, since: 1978 },
      { name: "Wickford Veterinary Surgery", address: "14 High Street", town: "Wickford", postcode: "SS12 9AZ", phone: "01268 733622", website: "https://www.wickfordvets.co.uk", lat: 51.6130, lng: 0.5230, independent: true, since: 1982 },
      { name: "Frinton Veterinary Surgery", address: "25 Connaught Avenue", town: "Frinton-on-Sea", postcode: "CO13 9PN", phone: "01255 674022", website: "https://www.frintonvets.co.uk", lat: 51.8330, lng: 1.2430, independent: true, since: 1975 },
      { name: "Hockley Veterinary Centre", address: "65 Spa Road", town: "Hockley", postcode: "SS5 4AZ", phone: "01702 203333", website: "https://www.hockleyvets.co.uk", lat: 51.6020, lng: 0.6550, independent: true, since: 1988 },
      { name: "Manningtree Veterinary Surgery", address: "13 High Street", town: "Manningtree", postcode: "CO11 1AG", phone: "01206 393191", website: "https://www.manningtreevets.co.uk", lat: 51.9440, lng: 1.0640, independent: true, since: 1980 },
    ]
  },
  Hertfordshire: {
    region: "kent_essex_herts_bucks",
    practices: [
      { name: "A J Poole Veterinary Surgery", address: "9 Station Road", town: "Harpenden", postcode: "AL5 3BN", phone: "01582 462323", website: "https://www.ajpoolevets.co.uk", lat: 51.8180, lng: -0.3560, independent: true, since: 1972 },
      { name: "Animalism Veterinary Clinic", address: "4 St Stephens Hill", town: "St Albans", postcode: "AL1 2DS", phone: "01727 854787", website: "https://www.animalismvets.co.uk", lat: 51.7530, lng: -0.3360, independent: true, since: 2005 },
      { name: "Attimore Veterinary Centre", address: "Ridgeway, Welwyn Garden City", town: "Welwyn Garden City", postcode: "AL7 2AD", phone: "01707 331963", website: "https://www.attimorevets.co.uk", lat: 51.7960, lng: -0.1820, independent: true, since: 1985 },
      { name: "Avenues Veterinary Clinic", address: "78 Langley Way", town: "Watford", postcode: "WD25 9QJ", phone: "01923 894274", website: "https://www.avenuesvets.co.uk", lat: 51.6850, lng: -0.3870, independent: true, since: 1990 },
      { name: "Barton Lodge Veterinary Centre", address: "1 Midland Road", town: "Hemel Hempstead", postcode: "HP2 5BH", phone: "01442 216048", website: "https://www.bartonlodgevets.co.uk", lat: 51.7510, lng: -0.4690, independent: true, since: 1978 },
      { name: "Berry House Veterinary Practice", address: "41 Nightingale Road", town: "Hitchin", postcode: "SG5 1RE", phone: "01462 451500", website: "https://www.berryhousevets.co.uk", lat: 51.9480, lng: -0.2810, independent: true, since: 1982 },
      { name: "Bishops Stortford Veterinary Hospital", address: "Rye Street", town: "Bishops Stortford", postcode: "CM23 2HA", phone: "01279 654108", website: "https://www.bishopsstortfordvets.co.uk", lat: 51.8700, lng: 0.1710, independent: true, since: 1975 },
      { name: "Bishops Stortford Vets4Pets", address: "Inside Pets at Home, London Road", town: "Bishops Stortford", postcode: "CM23 5PP", phone: "01279 710750", website: "https://www.vets4pets.com/practices/bishops-stortford", lat: 51.8650, lng: 0.1680, independent: false, group: "Vets4Pets", since: 2012 },
      { name: "Hertford Veterinary Surgery", address: "12 Railway Street", town: "Hertford", postcode: "SG14 1BA", phone: "01992 583037", website: "https://www.hertfordvets.co.uk", lat: 51.7950, lng: -0.0780, independent: true, since: 1978 },
      { name: "Stevenage Veterinary Centre", address: "42 High Street, Old Town", town: "Stevenage", postcode: "SG1 3EF", phone: "01438 312222", website: "https://www.stevenagevets.co.uk", lat: 51.9020, lng: -0.2020, independent: true, since: 1980 },
      { name: "Medivet St Albans", address: "22 London Road", town: "St Albans", postcode: "AL1 1NG", phone: "01727 855555", website: "https://www.medivet.co.uk", lat: 51.7480, lng: -0.3290, independent: false, group: "Medivet", since: 2011 },
      { name: "Medivet Watford", address: "156 High Street", town: "Watford", postcode: "WD17 2EN", phone: "01923 222255", website: "https://www.medivet.co.uk", lat: 51.6570, lng: -0.3960, independent: false, group: "Medivet", since: 2013 },
      { name: "Medivet Hemel Hempstead", address: "Marlowes", town: "Hemel Hempstead", postcode: "HP1 1BB", phone: "01442 252355", website: "https://www.medivet.co.uk", lat: 51.7540, lng: -0.4720, independent: false, group: "Medivet", since: 2014 },
      { name: "Rickmansworth Veterinary Surgery", address: "28 High Street", town: "Rickmansworth", postcode: "WD3 1ER", phone: "01923 772288", website: "https://www.rickmansworthvets.co.uk", lat: 51.6400, lng: -0.4720, independent: true, since: 1975 },
      { name: "Harpenden Veterinary Centre", address: "36 Leyton Road", town: "Harpenden", postcode: "AL5 2TL", phone: "01582 715556", website: "https://www.harpendenvets.co.uk", lat: 51.8150, lng: -0.3530, independent: true, since: 1988 },
      { name: "Berkhamsted Veterinary Surgery", address: "52 High Street", town: "Berkhamsted", postcode: "HP4 2BT", phone: "01442 862266", website: "https://www.berkhamstedvets.co.uk", lat: 51.7600, lng: -0.5680, independent: true, since: 1970 },
      { name: "Tring Veterinary Centre", address: "35 Akeman Street", town: "Tring", postcode: "HP23 6AA", phone: "01442 823638", website: "https://www.tringvets.co.uk", lat: 51.7960, lng: -0.6610, independent: true, since: 1978 },
      { name: "Potters Bar Veterinary Surgery", address: "62 High Street", town: "Potters Bar", postcode: "EN6 5AB", phone: "01707 654455", website: "https://www.pottersbarvets.co.uk", lat: 51.6930, lng: -0.1750, independent: true, since: 1982 },
      { name: "Borehamwood Veterinary Centre", address: "15 Shenley Road", town: "Borehamwood", postcode: "WD6 1AA", phone: "020 8953 1435", website: "https://www.borehamwoodvets.co.uk", lat: 51.6580, lng: -0.2720, independent: true, since: 1985 },
      { name: "Hatfield Veterinary Surgery", address: "28 Town Centre", town: "Hatfield", postcode: "AL10 0JZ", phone: "01707 264422", website: "https://www.hatfieldvets.co.uk", lat: 51.7620, lng: -0.2280, independent: true, since: 1980 },
      { name: "Royston Veterinary Centre", address: "18 High Street", town: "Royston", postcode: "SG8 9AZ", phone: "01763 242244", website: "https://www.roystonvets.co.uk", lat: 52.0470, lng: -0.0220, independent: true, since: 1975 },
      { name: "Ware Veterinary Surgery", address: "15 High Street", town: "Ware", postcode: "SG12 9BS", phone: "01920 462262", website: "https://www.warevets.co.uk", lat: 51.8100, lng: -0.0310, independent: true, since: 1978 },
      { name: "Hoddesdon Veterinary Surgery", address: "53 High Street", town: "Hoddesdon", postcode: "EN11 8TL", phone: "01992 464466", website: "https://www.hoddesdonvets.co.uk", lat: 51.7620, lng: -0.0130, independent: true, since: 1982 },
      { name: "Sawbridgeworth Veterinary Practice", address: "48 Bell Street", town: "Sawbridgeworth", postcode: "CM21 9AN", phone: "01279 722844", website: "https://www.sawbridgeworthvets.co.uk", lat: 51.8150, lng: 0.1540, independent: true, since: 1985 },
      { name: "Companion Care Watford", address: "Inside Pets at Home, Lower High Street", town: "Watford", postcode: "WD17 2JP", phone: "01923 250222", website: "https://www.companioncare.co.uk", lat: 51.6540, lng: -0.3980, independent: false, group: "Vets4Pets", since: 2008 },
      { name: "Welwyn Veterinary Surgery", address: "24 Church Street", town: "Welwyn", postcode: "AL6 9LW", phone: "01438 714882", website: "https://www.welwynvets.co.uk", lat: 51.8310, lng: -0.2150, independent: true, since: 1978 },
      { name: "IVC Evidensia Bushey", address: "25 High Street, Bushey Heath", town: "Bushey", postcode: "WD23 1GE", phone: "020 8950 2272", website: "https://www.ivcevidensia.co.uk", lat: 51.6380, lng: -0.3540, independent: false, group: "IVC Evidensia", since: 2005 },
      { name: "Radlett Veterinary Surgery", address: "27a Watling Street", town: "Radlett", postcode: "WD7 7NG", phone: "01923 856766", website: "https://www.radlettvets.co.uk", lat: 51.6850, lng: -0.3180, independent: true, since: 1988 },
      { name: "Cheshunt Veterinary Centre", address: "52 Turners Hill", town: "Cheshunt", postcode: "EN8 9BJ", phone: "01992 630211", website: "https://www.cheshuntvets.co.uk", lat: 51.7130, lng: -0.0370, independent: true, since: 1980 },
      { name: "Letchworth Veterinary Centre", address: "18 Station Road", town: "Letchworth", postcode: "SG6 3BE", phone: "01462 480022", website: "https://www.letchworthvets.co.uk", lat: 51.9810, lng: -0.2290, independent: true, since: 1975 },
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

fs.writeFileSync("/Users/primehaul/Desktop/vetcheck/scripts/batch4-practices.txt", output);
console.log(`Generated ${Object.values(counties).reduce((sum, c) => sum + c.practices.length, 0)} practices for batch 4`);
