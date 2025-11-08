// India-wide data for GreenLedger covering all states and major districts

export interface IndianState {
  code: string;
  name: string;
  capital: string;
  districts: string[];
  majorCrops: string[];
  language: string;
  population: number;
}

export interface Farmer {
  id: string;
  name: string;
  aadhaar: string;
  phone: string;
  state: string;
  district: string;
  village: string;
  crops: string[];
  landAcres: number;
  experience: number;
  rating: number;
  profitTrend: number; // percentage
  monthlyIncome: number;
  preferredLanguage: string;
  profileImage: string;
}

export interface Warehouse {
  id: string;
  name: string;
  state: string;
  district: string;
  city: string;
  capacity: number;
  currentOccupancy: number;
  manager: {
    name: string;
    phone: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  supportedCrops: string[];
  rating: number;
  lastUpdated: string;
}

export interface CropDemand {
  crop: string;
  state: string;
  currentPrice: number;
  demandTrend: number; // percentage
  seasonalFactor: number;
  predictedDemand: string;
}

export interface QRCodeData {
  id: string;
  type: 'farmer' | 'warehouse' | 'consumer';
  productName: string;
  farmerName: string;
  farmerState: string;
  farmerDistrict: string;
  warehouseName: string;
  warehouseState: string;
  warehouseDistrict: string;
  quantity: number;
  price: number;
  harvestDate: string;
  expiryDate: string;
  blockchainHash: string;
  qrCode: string;
  generatedAt: string;
  status: 'active' | 'used' | 'expired';
}

// Indian States and Districts Data
export const indianStates: IndianState[] = [
  {
    code: 'AP',
    name: 'Andhra Pradesh',
    capital: 'Amaravati',
    districts: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry'],
    majorCrops: ['Rice', 'Cotton', 'Sugarcane', 'Groundnut', 'Maize'],
    language: 'Telugu',
    population: 53903393
  },
  {
    code: 'AR',
    name: 'Arunachal Pradesh',
    capital: 'Itanagar',
    districts: ['Itanagar', 'Tezpur', 'Pasighat', 'Along'],
    majorCrops: ['Rice', 'Maize', 'Millet', 'Wheat'],
    language: 'Hindi',
    population: 1570458
  },
  {
    code: 'AS',
    name: 'Assam',
    capital: 'Dispur',
    districts: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia'],
    majorCrops: ['Rice', 'Tea', 'Jute', 'Cotton', 'Sugarcane'],
    language: 'Assamese',
    population: 35607039
  },
  {
    code: 'BR',
    name: 'Bihar',
    capital: 'Patna',
    districts: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Purnia'],
    majorCrops: ['Rice', 'Wheat', 'Maize', 'Sugarcane', 'Potato'],
    language: 'Hindi',
    population: 124799926
  },
  {
    code: 'CG',
    name: 'Chhattisgarh',
    capital: 'Raipur',
    districts: ['Raipur', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon'],
    majorCrops: ['Rice', 'Wheat', 'Maize', 'Sugarcane', 'Soybean'],
    language: 'Hindi',
    population: 29436231
  },
  {
    code: 'GA',
    name: 'Goa',
    capital: 'Panaji',
    districts: ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa'],
    majorCrops: ['Rice', 'Coconut', 'Cashew', 'Areca Nut'],
    language: 'Konkani',
    population: 1542750
  },
  {
    code: 'GJ',
    name: 'Gujarat',
    capital: 'Gandhinagar',
    districts: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar'],
    majorCrops: ['Cotton', 'Groundnut', 'Wheat', 'Rice', 'Sugarcane'],
    language: 'Gujarati',
    population: 70448721
  },
  {
    code: 'HR',
    name: 'Haryana',
    capital: 'Chandigarh',
    districts: ['Gurgaon', 'Faridabad', 'Panipat', 'Ambala', 'Karnal', 'Hisar'],
    majorCrops: ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Mustard'],
    language: 'Hindi',
    population: 28865836
  },
  {
    code: 'HP',
    name: 'Himachal Pradesh',
    capital: 'Shimla',
    districts: ['Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Kullu'],
    majorCrops: ['Apple', 'Wheat', 'Maize', 'Rice', 'Barley'],
    language: 'Hindi',
    population: 7300000
  },
  {
    code: 'JK',
    name: 'Jammu and Kashmir',
    capital: 'Srinagar',
    districts: ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Udhampur'],
    majorCrops: ['Rice', 'Wheat', 'Maize', 'Apple', 'Walnut'],
    language: 'Urdu',
    population: 13635738
  },
  {
    code: 'JH',
    name: 'Jharkhand',
    capital: 'Ranchi',
    districts: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar'],
    majorCrops: ['Rice', 'Wheat', 'Maize', 'Pulses', 'Oilseeds'],
    language: 'Hindi',
    population: 38593948
  },
  {
    code: 'KA',
    name: 'Karnataka',
    capital: 'Bangalore',
    districts: ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga'],
    majorCrops: ['Rice', 'Cotton', 'Sugarcane', 'Coffee', 'Spices'],
    language: 'Kannada',
    population: 67562686
  },
  {
    code: 'KL',
    name: 'Kerala',
    capital: 'Thiruvananthapuram',
    districts: ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam'],
    majorCrops: ['Rice', 'Coconut', 'Spices', 'Tea', 'Coffee', 'Rubber'],
    language: 'Malayalam',
    population: 35699443
  },
  {
    code: 'MP',
    name: 'Madhya Pradesh',
    capital: 'Bhopal',
    districts: ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar'],
    majorCrops: ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Soybean'],
    language: 'Hindi',
    population: 85002417
  },
  {
    code: 'MH',
    name: 'Maharashtra',
    capital: 'Mumbai',
    districts: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur'],
    majorCrops: ['Cotton', 'Sugarcane', 'Rice', 'Wheat', 'Jowar'],
    language: 'Marathi',
    population: 123144223
  },
  {
    code: 'MN',
    name: 'Manipur',
    capital: 'Imphal',
    districts: ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur'],
    majorCrops: ['Rice', 'Maize', 'Pulses', 'Oilseeds'],
    language: 'Manipuri',
    population: 3091545
  },
  {
    code: 'ML',
    name: 'Meghalaya',
    capital: 'Shillong',
    districts: ['Shillong', 'Tura', 'Jowai'],
    majorCrops: ['Rice', 'Maize', 'Potato', 'Ginger', 'Turmeric'],
    language: 'English',
    population: 3366710
  },
  {
    code: 'MZ',
    name: 'Mizoram',
    capital: 'Aizawl',
    districts: ['Aizawl', 'Lunglei', 'Saiha'],
    majorCrops: ['Rice', 'Maize', 'Vegetables'],
    language: 'Mizo',
    population: 1239244
  },
  {
    code: 'NL',
    name: 'Nagaland',
    capital: 'Kohima',
    districts: ['Kohima', 'Dimapur', 'Mokokchung'],
    majorCrops: ['Rice', 'Maize', 'Pulses', 'Oilseeds'],
    language: 'English',
    population: 2249695
  },
  {
    code: 'OR',
    name: 'Odisha',
    capital: 'Bhubaneswar',
    districts: ['Bhubaneswar', 'Cuttack', 'Puri', 'Berhampur', 'Sambalpur', 'Rourkela'],
    majorCrops: ['Rice', 'Wheat', 'Pulses', 'Oilseeds', 'Cotton'],
    language: 'Odia',
    population: 45429399
  },
  {
    code: 'PB',
    name: 'Punjab',
    capital: 'Chandigarh',
    districts: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda'],
    majorCrops: ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Potato'],
    language: 'Punjabi',
    population: 30141373
  },
  {
    code: 'RJ',
    name: 'Rajasthan',
    capital: 'Jaipur',
    districts: ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Udaipur', 'Ajmer'],
    majorCrops: ['Wheat', 'Barley', 'Jowar', 'Bajra', 'Maize'],
    language: 'Hindi',
    population: 81032689
  },
  {
    code: 'SK',
    name: 'Sikkim',
    capital: 'Gangtok',
    districts: ['Gangtok', 'Namchi', 'Gyalshing'],
    majorCrops: ['Rice', 'Maize', 'Wheat', 'Barley', 'Cardamom'],
    language: 'Nepali',
    population: 695867
  },
  {
    code: 'TN',
    name: 'Tamil Nadu',
    capital: 'Chennai',
    districts: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli'],
    majorCrops: ['Rice', 'Cotton', 'Sugarcane', 'Groundnut', 'Millets'],
    language: 'Tamil',
    population: 77841267
  },
  {
    code: 'TG',
    name: 'Telangana',
    capital: 'Hyderabad',
    districts: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'],
    majorCrops: ['Rice', 'Cotton', 'Sugarcane', 'Maize', 'Turmeric'],
    language: 'Telugu',
    population: 39362732
  },
  {
    code: 'TR',
    name: 'Tripura',
    capital: 'Agartala',
    districts: ['Agartala', 'Dharmanagar', 'Udaipur', 'Kailasahar'],
    majorCrops: ['Rice', 'Wheat', 'Maize', 'Pulses'],
    language: 'Bengali',
    population: 4169794
  },
  {
    code: 'UP',
    name: 'Uttar Pradesh',
    capital: 'Lucknow',
    districts: ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Meerut', 'Varanasi'],
    majorCrops: ['Wheat', 'Rice', 'Sugarcane', 'Potato', 'Pulses'],
    language: 'Hindi',
    population: 237882725
  },
  {
    code: 'UT',
    name: 'Uttarakhand',
    capital: 'Dehradun',
    districts: ['Dehradun', 'Haridwar', 'Roorkee', 'Nainital', 'Almora'],
    majorCrops: ['Rice', 'Wheat', 'Sugarcane', 'Potato', 'Pulses'],
    language: 'Hindi',
    population: 11250858
  },
  {
    code: 'WB',
    name: 'West Bengal',
    capital: 'Kolkata',
    districts: ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Malda'],
    majorCrops: ['Rice', 'Wheat', 'Potato', 'Jute', 'Tea'],
    language: 'Bengali',
    population: 99609303
  }
];

// Dummy Farmers Data (India-wide)
export const indiaWideFarmers: Farmer[] = [
  {
    id: 'FARM001',
    name: 'Ramesh Kumar',
    aadhaar: '1234-5678-9012',
    phone: '+91-98765-43210',
    state: 'Maharashtra',
    district: 'Pune',
    village: 'Shirur',
    crops: ['Wheat', 'Cotton', 'Sugarcane'],
    landAcres: 5.5,
    experience: 15,
    rating: 4.7,
    profitTrend: 15,
    monthlyIncome: 45000,
    preferredLanguage: 'Marathi',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'FARM002',
    name: 'Sita Devi',
    aadhaar: '2345-6789-0123',
    phone: '+91-87654-32109',
    state: 'Tamil Nadu',
    district: 'Thanjavur',
    village: 'Kumbakonam',
    crops: ['Rice', 'Cotton', 'Groundnut'],
    landAcres: 8.2,
    experience: 20,
    rating: 4.9,
    profitTrend: 22,
    monthlyIncome: 62000,
    preferredLanguage: 'Tamil',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616c0763c3b?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'FARM003',
    name: 'Manoj Patra',
    aadhaar: '3456-7890-1234',
    phone: '+91-76543-21098',
    state: 'Odisha',
    district: 'Cuttack',
    village: 'Choudwar',
    crops: ['Rice', 'Groundnut', 'Pulses'],
    landAcres: 3.8,
    experience: 12,
    rating: 4.3,
    profitTrend: -5,
    monthlyIncome: 28000,
    preferredLanguage: 'Odia',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'FARM004',
    name: 'Suresh Singh',
    aadhaar: '4567-8901-2345',
    phone: '+91-65432-10987',
    state: 'Punjab',
    district: 'Ludhiana',
    village: 'Sahnewal',
    crops: ['Wheat', 'Rice', 'Cotton'],
    landAcres: 12.5,
    experience: 25,
    rating: 4.8,
    profitTrend: 28,
    monthlyIncome: 85000,
    preferredLanguage: 'Punjabi',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'FARM005',
    name: 'Priya Sharma',
    aadhaar: '5678-9012-3456',
    phone: '+91-54321-09876',
    state: 'Karnataka',
    district: 'Bangalore',
    village: 'Devanahalli',
    crops: ['Rice', 'Coffee', 'Spices'],
    landAcres: 6.7,
    experience: 18,
    rating: 4.6,
    profitTrend: 18,
    monthlyIncome: 52000,
    preferredLanguage: 'Kannada',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'FARM006',
    name: 'Abdul Rahman',
    aadhaar: '6789-0123-4567',
    phone: '+91-43210-98765',
    state: 'Kerala',
    district: 'Kochi',
    village: 'Aluva',
    crops: ['Rice', 'Coconut', 'Spices', 'Rubber'],
    landAcres: 4.2,
    experience: 22,
    rating: 4.7,
    profitTrend: 12,
    monthlyIncome: 38000,
    preferredLanguage: 'Malayalam',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'FARM007',
    name: 'Ravi Chandra',
    aadhaar: '7890-1234-5678',
    phone: '+91-32109-87654',
    state: 'Andhra Pradesh',
    district: 'Vijayawada',
    village: 'Machilipatnam',
    crops: ['Rice', 'Cotton', 'Sugarcane'],
    landAcres: 9.1,
    experience: 16,
    rating: 4.5,
    profitTrend: 20,
    monthlyIncome: 58000,
    preferredLanguage: 'Telugu',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'FARM008',
    name: 'Geeta Rani',
    aadhaar: '8901-2345-6789',
    phone: '+91-21098-76543',
    state: 'West Bengal',
    district: 'Kolkata',
    village: 'Barrackpore',
    crops: ['Rice', 'Potato', 'Jute'],
    landAcres: 7.3,
    experience: 14,
    rating: 4.4,
    profitTrend: 8,
    monthlyIncome: 34000,
    preferredLanguage: 'Bengali',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616c0763c3b?w=150&h=150&fit=crop&crop=face'
  }
];

// Dummy Warehouses Data (India-wide)
export const indiaWideWarehouses: Warehouse[] = [
  {
    id: 'WH001',
    name: 'Mumbai Central Warehouse',
    state: 'Maharashtra',
    district: 'Mumbai',
    city: 'Mumbai',
    capacity: 5000,
    currentOccupancy: 3800,
    manager: { name: 'Ajay Patel', phone: '+91-98765-43210' },
    coordinates: { lat: 19.0760, lng: 72.8777 },
    supportedCrops: ['Cotton', 'Sugarcane', 'Wheat', 'Rice'],
    rating: 4.8,
    lastUpdated: '2024-12-26T10:30:00Z'
  },
  {
    id: 'WH002',
    name: 'Chennai Agricultural Hub',
    state: 'Tamil Nadu',
    district: 'Chennai',
    city: 'Chennai',
    capacity: 4500,
    currentOccupancy: 4100,
    manager: { name: 'Lakshmi Iyer', phone: '+91-87654-32109' },
    coordinates: { lat: 13.0827, lng: 80.2707 },
    supportedCrops: ['Rice', 'Cotton', 'Groundnut', 'Millets'],
    rating: 4.7,
    lastUpdated: '2024-12-26T09:45:00Z'
  },
  {
    id: 'WH003',
    name: 'Bhubaneswar Storage Complex',
    state: 'Odisha',
    district: 'Bhubaneswar',
    city: 'Bhubaneswar',
    capacity: 3200,
    currentOccupancy: 2100,
    manager: { name: 'Bijay Kumar Jena', phone: '+91-76543-21098' },
    coordinates: { lat: 20.2961, lng: 85.8245 },
    supportedCrops: ['Rice', 'Groundnut', 'Pulses', 'Oilseeds'],
    rating: 4.5,
    lastUpdated: '2024-12-26T11:15:00Z'
  },
  {
    id: 'WH004',
    name: 'Ludhiana Grain Terminal',
    state: 'Punjab',
    district: 'Ludhiana',
    city: 'Ludhiana',
    capacity: 6000,
    currentOccupancy: 5200,
    manager: { name: 'Hardeep Singh', phone: '+91-65432-10987' },
    coordinates: { lat: 30.9010, lng: 75.8573 },
    supportedCrops: ['Wheat', 'Rice', 'Cotton', 'Sugarcane'],
    rating: 4.9,
    lastUpdated: '2024-12-26T08:20:00Z'
  },
  {
    id: 'WH005',
    name: 'Bangalore Tech Warehouse',
    state: 'Karnataka',
    district: 'Bangalore',
    city: 'Bangalore',
    capacity: 3800,
    currentOccupancy: 2900,
    manager: { name: 'Suresh Babu', phone: '+91-54321-09876' },
    coordinates: { lat: 12.9716, lng: 77.5946 },
    supportedCrops: ['Rice', 'Coffee', 'Spices', 'Cotton'],
    rating: 4.6,
    lastUpdated: '2024-12-26T10:00:00Z'
  },
  {
    id: 'WH006',
    name: 'Kochi Spice Exchange',
    state: 'Kerala',
    district: 'Kochi',
    city: 'Kochi',
    capacity: 2500,
    currentOccupancy: 2200,
    manager: { name: 'Mohammed Ali', phone: '+91-43210-98765' },
    coordinates: { lat: 9.9312, lng: 76.2673 },
    supportedCrops: ['Spices', 'Coconut', 'Rice', 'Rubber'],
    rating: 4.8,
    lastUpdated: '2024-12-26T09:30:00Z'
  },
  {
    id: 'WH007',
    name: 'Kolkata River Port Warehouse',
    state: 'West Bengal',
    district: 'Kolkata',
    city: 'Kolkata',
    capacity: 4200,
    currentOccupancy: 3600,
    manager: { name: 'Subir Das', phone: '+91-32109-87654' },
    coordinates: { lat: 22.5726, lng: 88.3639 },
    supportedCrops: ['Rice', 'Potato', 'Jute', 'Tea'],
    rating: 4.4,
    lastUpdated: '2024-12-26T11:45:00Z'
  },
  {
    id: 'WH008',
    name: 'Hyderabad Central Market',
    state: 'Telangana',
    district: 'Hyderabad',
    city: 'Hyderabad',
    capacity: 3600,
    currentOccupancy: 2800,
    manager: { name: 'Venkat Reddy', phone: '+91-21098-76543' },
    coordinates: { lat: 17.3850, lng: 78.4867 },
    supportedCrops: ['Rice', 'Cotton', 'Turmeric', 'Maize'],
    rating: 4.7,
    lastUpdated: '2024-12-26T10:15:00Z'
  }
];

// Crop Demand Predictions (India-wide)
export const cropDemandPredictions: CropDemand[] = [
  { crop: 'Wheat', state: 'Punjab', currentPrice: 25, demandTrend: 30, seasonalFactor: 1.2, predictedDemand: '↑ High' },
  { crop: 'Rice', state: 'West Bengal', currentPrice: 28, demandTrend: 25, seasonalFactor: 1.1, predictedDemand: '↑ High' },
  { crop: 'Cotton', state: 'Maharashtra', currentPrice: 65, demandTrend: 20, seasonalFactor: 1.0, predictedDemand: '↑ Medium' },
  { crop: 'Rice', state: 'Tamil Nadu', currentPrice: 30, demandTrend: 22, seasonalFactor: 1.1, predictedDemand: '↑ High' },
  { crop: 'Groundnut', state: 'Odisha', currentPrice: 45, demandTrend: -10, seasonalFactor: 0.9, predictedDemand: '↓ Low' },
  { crop: 'Coffee', state: 'Karnataka', currentPrice: 180, demandTrend: 15, seasonalFactor: 1.05, predictedDemand: '↑ Medium' },
  { crop: 'Spices', state: 'Kerala', currentPrice: 200, demandTrend: 18, seasonalFactor: 1.15, predictedDemand: '↑ High' },
  { crop: 'Cotton', state: 'Andhra Pradesh', currentPrice: 62, demandTrend: 12, seasonalFactor: 0.95, predictedDemand: '→ Stable' },
  { crop: 'Potato', state: 'West Bengal', currentPrice: 15, demandTrend: 8, seasonalFactor: 1.3, predictedDemand: '→ Stable' },
  { crop: 'Sugarcane', state: 'Maharashtra', currentPrice: 35, demandTrend: 14, seasonalFactor: 1.1, predictedDemand: '↑ Medium' }
];

// Dummy QR Codes Data (India-wide)
export const indiaWideQRCodes: QRCodeData[] = [
  {
    id: 'QR001',
    type: 'farmer',
    productName: 'Premium Basmati Rice',
    farmerName: 'Sita Devi',
    farmerState: 'Tamil Nadu',
    farmerDistrict: 'Thanjavur',
    warehouseName: 'Chennai Agricultural Hub',
    warehouseState: 'Tamil Nadu',
    warehouseDistrict: 'Chennai',
    quantity: 50,
    price: 55,
    harvestDate: '2024-12-15',
    expiryDate: '2025-06-15',
    blockchainHash: '0xA1B2C3D4E5F67890123456789ABCDEF',
    qrCode: 'QR001_RICE_SITA_TN',
    generatedAt: '2024-12-20T10:30:00Z',
    status: 'active'
  },
  {
    id: 'QR002',
    type: 'warehouse',
    productName: 'Organic Wheat',
    farmerName: 'Ramesh Kumar',
    farmerState: 'Maharashtra',
    farmerDistrict: 'Pune',
    warehouseName: 'Mumbai Central Warehouse',
    warehouseState: 'Maharashtra',
    warehouseDistrict: 'Mumbai',
    quantity: 75,
    price: 30,
    harvestDate: '2024-12-10',
    expiryDate: '2025-03-10',
    blockchainHash: '0xE5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0',
    qrCode: 'QR002_WHEAT_RAMESH_MH',
    generatedAt: '2024-12-18T14:15:00Z',
    status: 'active'
  },
  {
    id: 'QR003',
    type: 'consumer',
    productName: 'Fresh Groundnut',
    farmerName: 'Manoj Patra',
    farmerState: 'Odisha',
    farmerDistrict: 'Cuttack',
    warehouseName: 'Bhubaneswar Storage Complex',
    warehouseState: 'Odisha',
    warehouseDistrict: 'Bhubaneswar',
    quantity: 25,
    price: 45,
    harvestDate: '2024-12-12',
    expiryDate: '2025-02-12',
    blockchainHash: '0xI9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4',
    qrCode: 'QR003_GROUNDNUT_MANOJ_OR',
    generatedAt: '2024-12-22T09:45:00Z',
    status: 'used'
  },
  {
    id: 'QR004',
    type: 'farmer',
    productName: 'Golden Wheat',
    farmerName: 'Suresh Singh',
    farmerState: 'Punjab',
    farmerDistrict: 'Ludhiana',
    warehouseName: 'Ludhiana Grain Terminal',
    warehouseState: 'Punjab',
    warehouseDistrict: 'Ludhiana',
    quantity: 100,
    price: 28,
    harvestDate: '2024-12-08',
    expiryDate: '2025-04-08',
    blockchainHash: '0xY5Z6A7B8C9D0E1F2G3H4I5J6K7L8M9N0',
    qrCode: 'QR004_WHEAT_SURESH_PB',
    generatedAt: '2024-12-16T16:20:00Z',
    status: 'active'
  },
  {
    id: 'QR005',
    type: 'warehouse',
    productName: 'Arabica Coffee',
    farmerName: 'Priya Sharma',
    farmerState: 'Karnataka',
    farmerDistrict: 'Bangalore',
    warehouseName: 'Bangalore Tech Warehouse',
    warehouseState: 'Karnataka',
    warehouseDistrict: 'Bangalore',
    quantity: 30,
    price: 180,
    harvestDate: '2024-12-05',
    expiryDate: '2025-12-05',
    blockchainHash: '0xO1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6',
    qrCode: 'QR005_COFFEE_PRIYA_KA',
    generatedAt: '2024-12-14T11:30:00Z',
    status: 'active'
  }
];

// Crop Images Mapping
export const cropImages: Record<string, string> = {
  'Rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop',
  'Wheat': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop',
  'Cotton': 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=200&fit=crop',
  'Sugarcane': 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=300&h=200&fit=crop',
  'Groundnut': 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=300&h=200&fit=crop',
  'Maize': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=300&h=200&fit=crop',
  'Coffee': 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300&h=200&fit=crop',
  'Spices': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=200&fit=crop',
  'Coconut': 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300&h=200&fit=crop',
  'Potato': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&h=200&fit=crop',
  'Tea': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop',
  'Jute': 'https://images.unsplash.com/photo-1625946287782-5ac2c9c77cbc?w=300&h=200&fit=crop',
  'Pulses': 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=300&h=200&fit=crop',
  'Oilseeds': 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=300&h=200&fit=crop',
  'Rubber': 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=300&h=200&fit=crop',
  'Apple': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=200&fit=crop',
  'Turmeric': 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=300&h=200&fit=crop',
  'Millets': 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=300&h=200&fit=crop'
};

// Helper functions
export const getStateByCode = (code: string): IndianState | undefined => {
  return indianStates.find(state => state.code === code);
};

export const getStatesByLanguage = (language: string): IndianState[] => {
  return indianStates.filter(state => state.language === language);
};

export const getFarmersByState = (stateName: string): Farmer[] => {
  return indiaWideFarmers.filter(farmer => farmer.state === stateName);
};

export const getWarehousesByState = (stateName: string): Warehouse[] => {
  return indiaWideWarehouses.filter(warehouse => warehouse.state === stateName);
};

export const getCropDemandByState = (stateName: string): CropDemand[] => {
  return cropDemandPredictions.filter(demand => demand.state === stateName);
};

export const getQRCodesByState = (stateName: string): QRCodeData[] => {
  return indiaWideQRCodes.filter(qr => qr.farmerState === stateName || qr.warehouseState === stateName);
};

export const getCropImage = (cropName: string): string => {
  return cropImages[cropName] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&h=200&fit=crop';
};