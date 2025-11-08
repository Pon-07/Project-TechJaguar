// Comprehensive Odisha location data with coordinates for maps and tracking
export interface OdishaLocation {
  district: string;
  taluks: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  majorTowns: string[];
  agriculturalSpecialities: string[];
  warehouses: string[];
}

export const odishaDistricts: OdishaLocation[] = [
  {
    district: "Angul",
    taluks: ["Angul", "Talcher", "Banarpal", "Khamar", "Pallahara", "Chhendipada", "Kishorenagar", "Athmallik"],
    coordinates: { lat: 20.8422, lng: 85.1051 },
    majorTowns: ["Angul", "Talcher", "Banarpal"],
    agriculturalSpecialities: ["Paddy", "Maize", "Groundnut", "Black Gram"],
    warehouses: ["WH-ANG-001", "WH-ANG-002"]
  },
  {
    district: "Balangir",
    taluks: ["Balangir", "Titlagarh", "Patnagarh", "Loisinga", "Belpada", "Bangomunda", "Turekela", "Sindhekela", "Agalpur", "Khaprakhol", "Deogaon", "Muribahal", "Saintala", "Kantabanji"],
    coordinates: { lat: 20.7096, lng: 83.4855 },
    majorTowns: ["Balangir", "Titlagarh", "Patnagarh"],
    agriculturalSpecialities: ["Paddy", "Turmeric", "Cotton", "Sugarcane"],
    warehouses: ["WH-BAL-001", "WH-BAL-002"]
  },
  {
    district: "Balasore",
    taluks: ["Balasore", "Bhogarai", "Jaleswar", "Bhograi", "Baliapal", "Basta", "Remuna", "Nilagiri", "Oupada", "Khaira", "Simulia"],
    coordinates: { lat: 21.4942, lng: 87.0200 },
    majorTowns: ["Balasore", "Jaleswar", "Nilagiri"],
    agriculturalSpecialities: ["Paddy", "Coconut", "Cashew", "Vegetables"],
    warehouses: ["WH-BLS-001", "WH-BLS-002"]
  },
  {
    district: "Bargarh",
    taluks: ["Bargarh", "Bhatli", "Bijepur", "Jharbandh", "Padampur", "Paikmal", "Sohela", "Attabira", "Barpali", "Ambabhona", "Bheden", "Gaisilet"],
    coordinates: { lat: 21.3340, lng: 83.6186 },
    majorTowns: ["Bargarh", "Padampur", "Bijepur"],
    agriculturalSpecialities: ["Paddy", "Sugarcane", "Wheat", "Gram"],
    warehouses: ["WH-BRG-001", "WH-BRG-002"]
  },
  {
    district: "Bhadrak",
    taluks: ["Bhadrak", "Bonth", "Chandbali", "Dhamnagar", "Basudevpur", "Tihidi", "Bhandaripokhari"],
    coordinates: { lat: 21.0542, lng: 86.5158 },
    majorTowns: ["Bhadrak", "Chandbali", "Dhamnagar"],
    agriculturalSpecialities: ["Paddy", "Sesame", "Mustard", "Jute"],
    warehouses: ["WH-BHD-001", "WH-BHD-002"]
  },
  {
    district: "Cuttack",
    taluks: ["Cuttack Sadar", "Athagarh", "Baranga", "Banki", "Dampara", "Kantapada", "Kissannagar", "Mahanga", "Narasinghpur", "Niali", "Salepur", "Tangi-Choudwar", "Tigiria"],
    coordinates: { lat: 20.4625, lng: 85.8830 },
    majorTowns: ["Cuttack", "Athagarh", "Banki"],
    agriculturalSpecialities: ["Paddy", "Jute", "Sugarcane", "Vegetables"],
    warehouses: ["WH-CUT-001", "WH-CUT-002", "WH-CUT-003"]
  },
  {
    district: "Deogarh",
    taluks: ["Deogarh", "Barkote", "Reamal"],
    coordinates: { lat: 21.5424, lng: 84.7317 },
    majorTowns: ["Deogarh", "Barkote"],
    agriculturalSpecialities: ["Paddy", "Millets", "Pulses", "Oilseeds"],
    warehouses: ["WH-DEO-001"]
  },
  {
    district: "Dhenkanal",
    taluks: ["Dhenkanal", "Hindol", "Kamakhyanagar", "Parjang", "Kankadahad", "Odapada", "Gondia"],
    coordinates: { lat: 20.6593, lng: 85.5955 },
    majorTowns: ["Dhenkanal", "Hindol", "Kamakhyanagar"],
    agriculturalSpecialities: ["Paddy", "Vegetables", "Fruits", "Spices"],
    warehouses: ["WH-DHE-001", "WH-DHE-002"]
  },
  {
    district: "Gajapati",
    taluks: ["Paralakhemundi", "Kashinagar", "Rayagada", "Mohana", "Gumma", "Nuagada"],
    coordinates: { lat: 18.7858, lng: 84.1314 },
    majorTowns: ["Paralakhemundi", "Kashinagar"],
    agriculturalSpecialities: ["Paddy", "Cashew", "Coffee", "Spices"],
    warehouses: ["WH-GAJ-001"]
  },
  {
    district: "Ganjam",
    taluks: ["Berhampur", "Chhatrapur", "Gopalpur", "Hinjilicut", "Khallikote", "Patrapur", "Polasara", "Purusottampur", "Rangeilunda", "Sanakhemundi", "Sheragada", "Aska", "Belguntha", "Bhanjanagar", "Buguda", "Chikiti", "Dharakote", "Digapahandi", "Kabisuryanagar", "Kukudakhandi", "Surada"],
    coordinates: { lat: 19.3149, lng: 84.7941 },
    majorTowns: ["Berhampur", "Chhatrapur", "Aska"],
    agriculturalSpecialities: ["Paddy", "Cashew", "Coconut", "Turmeric"],
    warehouses: ["WH-GAN-001", "WH-GAN-002", "WH-GAN-003"]
  },
  {
    district: "Jagatsinghpur",
    taluks: ["Jagatsinghpur", "Balikuda", "Erasama", "Kujang", "Raghunathpur", "Tirtol", "Biridi"],
    coordinates: { lat: 20.2517, lng: 86.1739 },
    majorTowns: ["Jagatsinghpur", "Kujang", "Tirtol"],
    agriculturalSpecialities: ["Paddy", "Aquaculture", "Salt", "Vegetables"],
    warehouses: ["WH-JAG-001", "WH-JAG-002"]
  },
  {
    district: "Jajpur",
    taluks: ["Jajpur", "Bari", "Binjharpur", "Dasarathpur", "Dharmasala", "Korei", "Sukinda", "Vyasanagar", "Danagadi", "Rasulpur"],
    coordinates: { lat: 20.8442, lng: 86.3281 },
    majorTowns: ["Jajpur", "Vyasanagar", "Sukinda"],
    agriculturalSpecialities: ["Paddy", "Vegetables", "Industrial Crops", "Pulses"],
    warehouses: ["WH-JAJ-001", "WH-JAJ-002"]
  },
  {
    district: "Jharsuguda",
    taluks: ["Jharsuguda", "Brajrajnagar", "Belpahar", "Laikera", "Lakhanpur"],
    coordinates: { lat: 21.8535, lng: 84.0070 },
    majorTowns: ["Jharsuguda", "Brajrajnagar", "Belpahar"],
    agriculturalSpecialities: ["Paddy", "Maize", "Vegetables", "Pulses"],
    warehouses: ["WH-JHA-001"]
  },
  {
    district: "Kalahandi",
    taluks: ["Bhawanipatna", "Dharmagarh", "Jaipatna", "Kegaon", "Kesinga", "Kokasara", "Lanjigarh", "Madanpur", "Narla", "Thuamulrampur", "Kalampur", "Karlamunda", "Golamunda"],
    coordinates: { lat: 19.9073, lng: 83.1464 },
    majorTowns: ["Bhawanipatna", "Dharmagarh", "Kesinga"],
    agriculturalSpecialities: ["Paddy", "Maize", "Millets", "Pulses"],
    warehouses: ["WH-KAL-001", "WH-KAL-002"]
  },
  {
    district: "Kandhamal",
    taluks: ["Phulbani", "Balliguda", "Chakapada", "Daringbadi", "G.Udayagiri", "Khandagiri", "Kotagarh", "Phiringia", "Raikia", "Tikabali", "Tumudibandha", "Khajuripada"],
    coordinates: { lat: 20.0645, lng: 84.2364 },
    majorTowns: ["Phulbani", "Balliguda", "Daringbadi"],
    agriculturalSpecialities: ["Turmeric", "Ginger", "Coffee", "Spices"],
    warehouses: ["WH-KAN-001", "WH-KAN-002"]
  },
  {
    district: "Kendrapara",
    taluks: ["Kendrapara", "Aul", "Derabish", "Garadapur", "Mahakalapara", "Marshaghai", "Pattamundai", "Rajkanika", "Rajnagar"],
    coordinates: { lat: 20.5021, lng: 86.4222 },
    majorTowns: ["Kendrapara", "Pattamundai", "Aul"],
    agriculturalSpecialities: ["Paddy", "Aquaculture", "Coconut", "Betel Vine"],
    warehouses: ["WH-KEN-001", "WH-KEN-002"]
  },
  {
    district: "Keonjhar",
    taluks: ["Keonjhar", "Anandapur", "Banspal", "Barbil", "Champua", "Ghatagaon", "Harichandanpur", "Hatadihi", "Jhumpura", "Karanjia", "Patna", "Saharpada", "Telkoi"],
    coordinates: { lat: 21.6297, lng: 85.5815 },
    majorTowns: ["Keonjhar", "Barbil", "Anandapur"],
    agriculturalSpecialities: ["Paddy", "Millets", "Pulses", "Vegetables"],
    warehouses: ["WH-KEO-001", "WH-KEO-002"]
  },
  {
    district: "Khordha",
    taluks: ["Bhubaneswar", "Balianta", "Begunia", "Bolagarh", "Chilika", "Jatni", "Khordha", "Tangi", "Balipatna"],
    coordinates: { lat: 20.2961, lng: 85.8245 },
    majorTowns: ["Bhubaneswar", "Khordha", "Jatni"],
    agriculturalSpecialities: ["Paddy", "Vegetables", "Flowers", "Fruits"],
    warehouses: ["WH-KHO-001", "WH-KHO-002", "WH-KHO-003"]
  },
  {
    district: "Koraput",
    taluks: ["Koraput", "Borrigumma", "Dasmantpur", "Jeypore", "Kotpad", "Lamtaput", "Laxmipur", "Nabarangpur", "Nandapur", "Pottangi", "Semiliguda", "Boipariguda", "Kundra", "Machkund"],
    coordinates: { lat: 18.8130, lng: 82.7108 },
    majorTowns: ["Koraput", "Jeypore", "Nabarangpur"],
    agriculturalSpecialities: ["Coffee", "Cashew", "Turmeric", "Black Pepper"],
    warehouses: ["WH-KOR-001", "WH-KOR-002"]
  },
  {
    district: "Malkangiri",
    taluks: ["Malkangiri", "Kalimela", "Chitrakonda", "Podia", "Korkunda", "Mathili", "Khairput"],
    coordinates: { lat: 18.3479, lng: 81.8929 },
    majorTowns: ["Malkangiri", "Kalimela", "Chitrakonda"],
    agriculturalSpecialities: ["Paddy", "Minor Millets", "Pulses", "Oilseeds"],
    warehouses: ["WH-MAL-001"]
  },
  {
    district: "Mayurbhanj",
    taluks: ["Baripada", "Bangriposi", "Betanoti", "Bhaluka", "Bijatala", "Bisoi", "Jashipur", "Karanjia", "Kaptipada", "Khunta", "Kuliana", "Kusumi", "Morada", "Rairangpur", "Rashgovindpur", "Samakhunta", "Saraskana", "Sukruli", "Thakurmunda", "Tiring", "Udala"],
    coordinates: { lat: 21.9353, lng: 86.7365 },
    majorTowns: ["Baripada", "Rairangpur", "Karanjia"],
    agriculturalSpecialities: ["Paddy", "Cashew", "Tamarind", "Sal Seeds"],
    warehouses: ["WH-MAY-001", "WH-MAY-002"]
  },
  {
    district: "Nabarangpur",
    taluks: ["Nabarangpur", "Dabugam", "Jharigam", "Kodinga", "Kosagumuda", "Nandahandi", "Papadahandi", "Raighar", "Tentulikhunti", "Umerkote"],
    coordinates: { lat: 19.2307, lng: 82.5463 },
    majorTowns: ["Nabarangpur", "Umerkote", "Papadahandi"],
    agriculturalSpecialities: ["Paddy", "Maize", "Ragi", "Cotton"],
    warehouses: ["WH-NAB-001"]
  },
  {
    district: "Nayagarh",
    taluks: ["Nayagarh", "Daspalla", "Gania", "Khandapada", "Nuagaon", "Odagaon", "Ranpur", "Sarankul"],
    coordinates: { lat: 20.1286, lng: 85.0963 },
    majorTowns: ["Nayagarh", "Daspalla", "Ranpur"],
    agriculturalSpecialities: ["Paddy", "Sugarcane", "Turmeric", "Vegetables"],
    warehouses: ["WH-NAY-001"]
  },
  {
    district: "Nuapada",
    taluks: ["Nuapada", "Boden", "Khariar", "Komna", "Sinapali"],
    coordinates: { lat: 20.8024, lng: 82.5463 },
    majorTowns: ["Nuapada", "Khariar", "Komna"],
    agriculturalSpecialities: ["Paddy", "Maize", "Groundnut", "Gram"],
    warehouses: ["WH-NUA-001"]
  },
  {
    district: "Puri",
    taluks: ["Puri", "Bramhagiri", "Delanga", "Gop", "Kakatpur", "Kanas", "Krushnaprasad", "Nimapara", "Pipili", "Satyabadi"],
    coordinates: { lat: 19.8135, lng: 85.8312 },
    majorTowns: ["Puri", "Pipili", "Nimapara"],
    agriculturalSpecialities: ["Paddy", "Coconut", "Betel Vine", "Vegetables"],
    warehouses: ["WH-PUR-001", "WH-PUR-002"]
  },
  {
    district: "Rayagada",
    taluks: ["Rayagada", "Ambadola", "Bissam Cuttack", "Chandrapur", "Gunupur", "Kalyansinghpur", "Kashipur", "Kolnara", "Muniguda", "Padmapur", "Ramanaguda"],
    coordinates: { lat: 19.1664, lng: 83.4126 },
    majorTowns: ["Rayagada", "Gunupur", "Muniguda"],
    agriculturalSpecialities: ["Paddy", "Cashew", "Coffee", "Turmeric"],
    warehouses: ["WH-RAY-001", "WH-RAY-002"]
  },
  {
    district: "Sambalpur",
    taluks: ["Sambalpur", "Bamra", "Dhankauda", "Jujomura", "Kuchinda", "Maneswar", "Naktideul", "Rairakhol", "Rengali", "Redhakhol"],
    coordinates: { lat: 21.4669, lng: 83.9812 },
    majorTowns: ["Sambalpur", "Rairakhol", "Kuchinda"],
    agriculturalSpecialities: ["Paddy", "Millets", "Sugarcane", "Vegetables"],
    warehouses: ["WH-SAM-001", "WH-SAM-002"]
  },
  {
    district: "Subarnapur (Sonepur)",
    taluks: ["Sonepur", "Binka", "Dunguripali", "Tarva", "Ullunda"],
    coordinates: { lat: 20.8327, lng: 83.9127 },
    majorTowns: ["Sonepur", "Binka", "Tarva"],
    agriculturalSpecialities: ["Paddy", "Sugarcane", "Turmeric", "Cotton"],
    warehouses: ["WH-SON-001"]
  },
  {
    district: "Sundargarh",
    taluks: ["Sundargarh", "Balisankara", "Bargaon", "Bisra", "Bonai", "Brahmani Tarang", "Gurundia", "Hemgir", "Koida", "Kuanrmunda", "Kutra", "Lahunipara", "Leftripada", "Lephripara", "Nuagaon", "Rajgangpur", "Raghunathpali", "Rourkela", "Subdega", "Tangarpali"],
    coordinates: { lat: 22.1178, lng: 84.0167 },
    majorTowns: ["Rourkela", "Sundargarh", "Rajgangpur"],
    agriculturalSpecialities: ["Paddy", "Mahua", "Tendu Leaves", "Minor Forest Produce"],
    warehouses: ["WH-SUN-001", "WH-SUN-002"]
  }
];

// Helper functions for location-based operations
export const getDistrictByName = (name: string): OdishaLocation | undefined => {
  return odishaDistricts.find(district => 
    district.district.toLowerCase() === name.toLowerCase()
  );
};

export const getTaluksByDistrict = (districtName: string): string[] => {
  const district = getDistrictByName(districtName);
  return district ? district.taluks : [];
};

export const getCoordinatesByLocation = (district: string, taluk?: string): { lat: number; lng: number } | null => {
  const districtData = getDistrictByName(district);
  if (!districtData) return null;
  
  // For now, return district coordinates
  // In a real app, you'd have taluk-specific coordinates
  return districtData.coordinates;
};

export const getRandomOdishaLocation = (): { district: string; taluk: string; coordinates: { lat: number; lng: number } } => {
  const randomDistrict = odishaDistricts[Math.floor(Math.random() * odishaDistricts.length)];
  const randomTaluk = randomDistrict.taluks[Math.floor(Math.random() * randomDistrict.taluks.length)];
  
  return {
    district: randomDistrict.district,
    taluk: randomTaluk,
    coordinates: randomDistrict.coordinates
  };
};

export const validateOdishaLocation = (district: string, taluk?: string): boolean => {
  const districtData = getDistrictByName(district);
  if (!districtData) return false;
  
  if (taluk) {
    return districtData.taluks.some(t => t.toLowerCase() === taluk.toLowerCase());
  }
  
  return true;
};

// Phone numbers for support across different Odisha locations
export const odishaSupportNumbers = {
  farmer: {
    "Angul": "+91-99999-10001",
    "Balangir": "+91-99999-10002", 
    "Balasore": "+91-99999-10003",
    "Bargarh": "+91-99999-10004",
    "Bhadrak": "+91-99999-10005",
    "Cuttack": "+91-99999-10006",
    "Deogarh": "+91-99999-10007",
    "Dhenkanal": "+91-99999-10008",
    "Gajapati": "+91-99999-10009",
    "Ganjam": "+91-99999-10010",
    "Jagatsinghpur": "+91-99999-10011",
    "Jajpur": "+91-99999-10012",
    "Jharsuguda": "+91-99999-10013",
    "Kalahandi": "+91-99999-10014",
    "Kandhamal": "+91-99999-10015",
    "Kendrapara": "+91-99999-10016",
    "Keonjhar": "+91-99999-10017",
    "Khordha": "+91-99999-10018",
    "Koraput": "+91-99999-10019",
    "Malkangiri": "+91-99999-10020",
    "Mayurbhanj": "+91-99999-10021",
    "Nabarangpur": "+91-99999-10022",
    "Nayagarh": "+91-99999-10023",
    "Nuapada": "+91-99999-10024",
    "Puri": "+91-99999-10025",
    "Rayagada": "+91-99999-10026",
    "Sambalpur": "+91-99999-10027",
    "Subarnapur": "+91-99999-10028",
    "Sundargarh": "+91-99999-10029"
  },
  warehouse: {
    general: "+91-99999-20001",
    emergency: "+91-99999-20002"
  },
  consumer: {
    support: "+91-99999-30001",
    complaints: "+91-99999-30002"
  }
};

export default odishaDistricts;