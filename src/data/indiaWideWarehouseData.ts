// Comprehensive India-wide warehouse data for GreenLedger platform

export interface IndiaWarehouse {
  warehouse_id: string;
  state: string;
  district: string;
  name: string;
  capacity_tonnes: number;
  current_occupancy_tonnes: number;
  occupancy_percentage: number;
  location: {
    latitude: number;
    longitude: number;
  };
  manager: {
    name: string;
    phone: string;
    email: string;
  };
  established_date: string;
  inventory: InventoryItem[];
  analytics: {
    turnover_last_3_months_inr: number;
    demand_prediction: string;
    stock_status: 'High' | 'Medium' | 'Low';
    efficiency_rating: number;
  };
  blockchain_hash: string;
  rating: number;
  zomato_partner_enabled: boolean;
  last_updated: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  variety: string;
  total_quantity_kg: number;
  price_per_kg_inr: number;
  organic_cert: 'Yes' | 'No';
  origin_farmer: {
    name: string;
    pin: string;
    location: string;
  };
  harvest_date: string;
  expiry_date: string;
  quality_grade: 'A+' | 'A' | 'B+' | 'B';
  crop_image: string;
  blockchain_tx: string;
  qr_generated: boolean;
  qr_image?: string;
  demand_trend: 'up' | 'down' | 'stable';
}

export const CROP_IMAGES = {
  'Rice': '🌾',
  'Wheat': '🌾',
  'Cotton': '☁️',
  'Sugarcane': '🎋',
  'Turmeric': '🟡',
  'Cardamom': '🟢',
  'Black Pepper': '⚫',
  'Chilli': '🌶️',
  'Tea': '🍃',
  'Coffee': '☕',
  'Coconut': '🥥',
  'Banana': '🍌',
  'Mango': '🥭',
  'Groundnut': '🥜',
  'Mustard': '🟡',
  'Soybean': '🫘',
  'Onion': '🧅',
  'Potato': '🥔',
  'Tomato': '🍅',
  'Cauliflower': '🥬'
};

// India-wide state and district data
export const INDIA_STATES_DISTRICTS = {
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Thanjavur', 'Salem', 'Tiruchirappalli', 'Tirunelveli'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur'],
  'Punjab': ['Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala', 'Bathinda', 'Moga', 'Mohali'],
  'West Bengal': ['Kolkata', 'Siliguri', 'Durgapur', 'Asansol', 'Howrah', 'Malda', 'Darjeeling'],
  'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Kannur'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga', 'Shimoga'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut', 'Allahabad', 'Gorakhpur'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Junagadh', 'Gandhinagar'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Alwar'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Ratlam'],
  'Andhra Pradesh': ['Hyderabad', 'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Ramagundam', 'Khammam', 'Mahbubnagar'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore', 'Rourkela'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Bihar Sharif', 'Arrah'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh', 'Giridih'],
  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Bongaigaon'],
  'Haryana': ['Gurgaon', 'Faridabad', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar'],
  'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Una', 'Kullu', 'Hamirpur'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Kashipur', 'Rishikesh']
};

// Generate realistic inventory based on state specialties
function generateStateSpecificInventory(state: string, district: string): InventoryItem[] {
  const stateSpecialties: { [key: string]: string[] } = {
    'Tamil Nadu': ['Rice', 'Sugarcane', 'Cotton', 'Groundnut', 'Banana'],
    'Maharashtra': ['Cotton', 'Sugarcane', 'Turmeric', 'Onion', 'Soybean'],
    'Punjab': ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Mustard'],
    'West Bengal': ['Rice', 'Tea', 'Potato', 'Banana', 'Mustard'],
    'Kerala': ['Coconut', 'Cardamom', 'Black Pepper', 'Coffee', 'Tea'],
    'Karnataka': ['Coffee', 'Rice', 'Sugarcane', 'Cotton', 'Coconut'],
    'Uttar Pradesh': ['Wheat', 'Rice', 'Sugarcane', 'Potato', 'Mustard'],
    'Gujarat': ['Cotton', 'Groundnut', 'Wheat', 'Rice', 'Sugarcane'],
    'Rajasthan': ['Wheat', 'Mustard', 'Cotton', 'Groundnut', 'Chilli'],
    'Madhya Pradesh': ['Wheat', 'Rice', 'Cotton', 'Soybean', 'Sugarcane'],
    'Andhra Pradesh': ['Rice', 'Cotton', 'Sugarcane', 'Chilli', 'Turmeric'],
    'Telangana': ['Rice', 'Cotton', 'Turmeric', 'Chilli', 'Sugarcane'],
    'Odisha': ['Rice', 'Sugarcane', 'Cotton', 'Turmeric', 'Coconut'],
    'Bihar': ['Rice', 'Wheat', 'Sugarcane', 'Potato', 'Mustard'],
    'Jharkhand': ['Rice', 'Wheat', 'Sugarcane', 'Potato', 'Mustard'],
    'Assam': ['Rice', 'Tea', 'Mustard', 'Potato', 'Sugarcane'],
    'Haryana': ['Wheat', 'Rice', 'Cotton', 'Mustard', 'Sugarcane'],
    'Himachal Pradesh': ['Wheat', 'Rice', 'Potato', 'Tea', 'Cauliflower'],
    'Uttarakhand': ['Rice', 'Wheat', 'Potato', 'Tea', 'Mustard']
  };

  const crops = stateSpecialties[state] || ['Rice', 'Wheat', 'Cotton'];
  const inventory: InventoryItem[] = [];

  crops.forEach((crop, index) => {
    const baseQuantity = Math.floor(Math.random() * 50000) + 10000;
    const basePrice = Math.floor(Math.random() * 50) + 20;
    
    // Generate multiple varieties for each crop
    const varieties = ['Premium', 'Standard', 'Organic'];
    varieties.forEach((variety, vIndex) => {
      const farmerNames = ['Ramesh Kumar', 'Sita Devi', 'Harpreet Singh', 'Lakshmi Sharma', 'Rajesh Patel'];
      const randomFarmer = farmerNames[Math.floor(Math.random() * farmerNames.length)];
      
      inventory.push({
        id: `${state.replace(' ', '')}_${district}_${crop}_${variety}_${vIndex}`,
        name: crop,
        variety: variety,
        total_quantity_kg: baseQuantity + (vIndex * 5000),
        price_per_kg_inr: basePrice + (variety === 'Organic' ? 15 : variety === 'Premium' ? 10 : 0),
        organic_cert: variety === 'Organic' ? 'Yes' : 'No',
        origin_farmer: {
          name: randomFarmer,
          pin: `UZP-${district.substring(0,3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
          location: `${district}, ${state}`
        },
        harvest_date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        expiry_date: new Date(Date.now() + Math.floor(Math.random() * 180 + 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quality_grade: ['A+', 'A', 'B+', 'B'][Math.floor(Math.random() * 4)] as 'A+' | 'A' | 'B+' | 'B',
        crop_image: `🌾`, // Will be replaced by getCropDisplay function
        blockchain_tx: `0x${Math.random().toString(16).substring(2, 8).toUpperCase()}${Math.random().toString(16).substring(2, 8).toUpperCase()}`,
        qr_generated: Math.random() > 0.5,
        qr_image: Math.random() > 0.5 ? `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE0Ij5RUi0ke2Nyb3B9PC90ZXh0Pgo8L3N2Zz4=` : undefined,
        demand_trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable'
      });
    });
  });

  return inventory;
}

// Generate demand predictions by state
export const DEMAND_PREDICTIONS = {
  'Tamil Nadu': { crop: 'Rice', trend: 'up', percentage: 25 },
  'Maharashtra': { crop: 'Cotton', trend: 'up', percentage: 20 },
  'Punjab': { crop: 'Wheat', trend: 'up', percentage: 30 },
  'West Bengal': { crop: 'Rice', trend: 'up', percentage: 18 },
  'Kerala': { crop: 'Spices', trend: 'up', percentage: 18 },
  'Karnataka': { crop: 'Coffee', trend: 'up', percentage: 22 },
  'Uttar Pradesh': { crop: 'Wheat', trend: 'up', percentage: 28 },
  'Gujarat': { crop: 'Cotton', trend: 'up', percentage: 24 },
  'Rajasthan': { crop: 'Mustard', trend: 'up', percentage: 19 },
  'Madhya Pradesh': { crop: 'Soybean', trend: 'up', percentage: 21 },
  'Andhra Pradesh': { crop: 'Chilli', trend: 'up', percentage: 26 },
  'Telangana': { crop: 'Turmeric', trend: 'up', percentage: 23 },
  'Odisha': { crop: 'Rice', trend: 'up', percentage: 17 },
  'Bihar': { crop: 'Wheat', trend: 'up', percentage: 16 },
  'Jharkhand': { crop: 'Rice', trend: 'up', percentage: 15 },
  'Assam': { crop: 'Tea', trend: 'up', percentage: 20 },
  'Haryana': { crop: 'Wheat', trend: 'up', percentage: 27 },
  'Himachal Pradesh': { crop: 'Potato', trend: 'up', percentage: 14 },
  'Uttarakhand': { crop: 'Rice', trend: 'up', percentage: 13 }
};

// Generate India-wide warehouse data
export function generateIndiaWarehousesData(): { warehouses: IndiaWarehouse[], totalStats: any } {
  const warehouses: IndiaWarehouse[] = [];
  let totalCapacity = 0;
  let totalOccupancy = 0;
  let totalTurnover = 0;

  Object.entries(INDIA_STATES_DISTRICTS).forEach(([state, districts]) => {
    districts.forEach(district => {
      const capacity = Math.floor(Math.random() * 50000) + 20000;
      const occupancy = Math.floor(capacity * (0.6 + Math.random() * 0.3));
      const turnover = Math.floor(Math.random() * 50000000) + 10000000;
      
      totalCapacity += capacity;
      totalOccupancy += occupancy;
      totalTurnover += turnover;

      const warehouse: IndiaWarehouse = {
        warehouse_id: `WH-${state.replace(' ', '').substring(0, 3).toUpperCase()}-${district.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
        state,
        district,
        name: `${district} Central Warehouse`,
        capacity_tonnes: capacity,
        current_occupancy_tonnes: occupancy,
        occupancy_percentage: Math.round((occupancy / capacity) * 100),
        location: {
          latitude: 20 + Math.random() * 15,
          longitude: 68 + Math.random() * 30
        },
        manager: {
          name: ['Rajesh Kumar', 'Priya Sharma', 'Anil Gupta', 'Sunita Patel', 'Mohit Singh'][Math.floor(Math.random() * 5)],
          phone: `+91-${Math.floor(Math.random() * 10000000000)}`,
          email: `manager.${district.toLowerCase()}@greenledger.in`
        },
        established_date: `${2018 + Math.floor(Math.random() * 6)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        inventory: generateStateSpecificInventory(state, district),
        analytics: {
          turnover_last_3_months_inr: turnover,
          demand_prediction: `${DEMAND_PREDICTIONS[state]?.crop || 'Rice'} demand ↑ ${DEMAND_PREDICTIONS[state]?.percentage || 20}%`,
          stock_status: occupancy > capacity * 0.8 ? 'High' : occupancy > capacity * 0.5 ? 'Medium' : 'Low',
          efficiency_rating: Math.round((Math.random() * 2 + 8) * 10) / 10
        },
        blockchain_hash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
        rating: Math.round((Math.random() * 2 + 3.5) * 10) / 10,
        zomato_partner_enabled: Math.random() > 0.3,
        last_updated: new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)).toISOString()
      };

      warehouses.push(warehouse);
    });
  });

  const totalStats = {
    totalWarehouses: warehouses.length,
    totalStates: Object.keys(INDIA_STATES_DISTRICTS).length,
    totalDistricts: Object.values(INDIA_STATES_DISTRICTS).flat().length,
    totalCapacity,
    totalOccupancy,
    totalTurnover,
    occupancyPercentage: Math.round((totalOccupancy / totalCapacity) * 100)
  };

  return { warehouses, totalStats };
}

// Pre-generate the data
export const indiaWarehousesData = generateIndiaWarehousesData();