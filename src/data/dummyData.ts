import { odishaDistricts, getRandomOdishaLocation } from './odishaLocationData';

// Generate more comprehensive dummy data for better testing
const generateRandomOdishaLocation = () => {
  const district = odishaDistricts[Math.floor(Math.random() * odishaDistricts.length)];
  const taluk = district.taluks[Math.floor(Math.random() * district.taluks.length)];
  return {
    district: district.district,
    taluk: taluk,
    coordinates: district.coordinates
  };
};

// Farmer Data for Odisha - Expanded with more realistic data
export const odishaFarmers = [
  {
    id: "F-001",
    name: "Rajesh Panda",
    uzhavarPin: "UZP-ANG-001", 
    phoneNumber: "+91-9437-001001",
    district: "Angul",
    taluk: "Angul",
    coordinates: { lat: 20.8422, lng: 85.1051 },
    landSize: "8.5 acres",
    crops: ["Paddy (Swarna)", "Groundnut", "Maize"],
    totalIncome: 125000,
    monthlyGrowth: 15.2,
    greenPoints: 1850,
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    qrCodes: ["QR-F001-P1", "QR-F001-G1", "QR-F001-M1"],
    certifications: ["Organic", "FairTrade"],
    rating: 4.8,
    aadharNumber: "xxxx-xxxx-1234",
    bankAccount: "SBI-xxxx-5678",
    verified: true
  },
  {
    id: "F-002", 
    name: "Santosh Kumar Nag",
    uzhavarPin: "UZP-BAL-002",
    phoneNumber: "+91-9437-002002",
    district: "Balangir",
    taluk: "Balangir",
    coordinates: { lat: 20.7096, lng: 83.4855 },
    landSize: "12.3 acres",
    crops: ["Paddy (Lalat)", "Turmeric", "Cotton"],
    totalIncome: 185000,
    monthlyGrowth: 18.7,
    greenPoints: 2350,
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    qrCodes: ["QR-F002-P1", "QR-F002-T1"],
    certifications: ["Organic", "ISO-9001"],
    rating: 4.9,
    aadharNumber: "xxxx-xxxx-2345",
    bankAccount: "SBI-xxxx-6789",
    verified: true
  },
  {
    id: "F-003",
    name: "Deepak Biswal", 
    uzhavarPin: "UZP-BLS-003",
    phoneNumber: "+91-9437-003003",
    district: "Balasore",
    taluk: "Balasore",
    coordinates: { lat: 21.4942, lng: 87.0200 },
    landSize: "6.8 acres",
    crops: ["Paddy (Pooja)", "Coconut", "Cashew"],
    totalIncome: 95000,
    monthlyGrowth: 12.3,
    greenPoints: 1450,
    profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    qrCodes: ["QR-F003-P1", "QR-F003-C1"],
    certifications: ["Organic"],
    rating: 4.6,
    aadharNumber: "xxxx-xxxx-3456",
    bankAccount: "ICICI-xxxx-7890",
    verified: true
  },
  {
    id: "F-004",
    name: "Laxmi Narayan Patel",
    uzhavarPin: "UZP-BRG-004", 
    phoneNumber: "+91-9437-004004",
    district: "Bargarh",
    taluk: "Bargarh",
    coordinates: { lat: 21.3340, lng: 83.6186 },
    landSize: "15.2 acres",
    crops: ["Paddy (Swarna Sub-1)", "Sugarcane", "Wheat"],
    totalIncome: 225000,
    monthlyGrowth: 22.1,
    greenPoints: 2850,
    profileImage: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face",
    qrCodes: ["QR-F004-P1", "QR-F004-S1"],
    certifications: ["FairTrade", "Rainforest Alliance"],
    rating: 4.7,
    aadharNumber: "xxxx-xxxx-4567",
    bankAccount: "PNB-xxxx-8901",
    verified: true
  },
  {
    id: "F-005",
    name: "Bijay Kumar Sahoo",
    uzhavarPin: "UZP-CUT-005",
    phoneNumber: "+91-9437-005005", 
    district: "Cuttack",
    taluk: "Cuttack Sadar",
    coordinates: { lat: 20.4625, lng: 85.8830 },
    landSize: "10.7 acres",
    crops: ["Paddy (Improved Lalat)", "Jute", "Vegetables"],
    totalIncome: 165000,
    monthlyGrowth: 19.5,
    greenPoints: 2100,
    profileImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
    qrCodes: ["QR-F005-P1", "QR-F005-J1", "QR-F005-V1"],
    certifications: ["Organic", "Global GAP"],
    rating: 4.8,
    aadharNumber: "xxxx-xxxx-5678",
    bankAccount: "BOI-xxxx-9012",
    verified: true
  },
  // Additional farmers for better testing
  {
    id: "F-006",
    name: "Sunita Mohanty",
    uzhavarPin: "UZP-KHO-006",
    phoneNumber: "+91-9437-006006",
    district: "Khordha",
    taluk: "Bhubaneswar",
    coordinates: { lat: 20.2961, lng: 85.8245 },
    landSize: "12.3 acres",
    crops: ["Vegetables", "Flowers", "Fruits"],
    totalIncome: 198000,
    monthlyGrowth: 21.8,
    greenPoints: 2650,
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616c351c8c2?w=150&h=150&fit=crop&crop=face",
    qrCodes: ["QR-F006-V1", "QR-F006-F1"],
    certifications: ["Organic", "Women Farmer"],
    rating: 4.9,
    aadharNumber: "xxxx-xxxx-6789",
    bankAccount: "SBI-xxxx-0123",
    verified: true
  },
  {
    id: "F-007",
    name: "Manoj Pradhan",
    uzhavarPin: "UZP-KAN-007",
    phoneNumber: "+91-9437-007007",
    district: "Kandhamal",
    taluk: "Phulbani",
    coordinates: { lat: 20.0645, lng: 84.2364 },
    landSize: "9.8 acres",
    crops: ["Turmeric", "Ginger", "Coffee"],
    totalIncome: 145000,
    monthlyGrowth: 16.7,
    greenPoints: 1980,
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    qrCodes: ["QR-F007-T1", "QR-F007-G1", "QR-F007-C1"],
    certifications: ["Organic", "Spice Board"],
    rating: 4.7,
    aadharNumber: "xxxx-xxxx-7890",
    bankAccount: "HDFC-xxxx-1234",
    verified: true
  }
];

// Consumer Data for Odisha
export const odishaConsumers = [
  {
    id: "C-001",
    name: "Priya Mohapatra",
    phoneNumber: "+91-9437-101001", 
    email: "priya.mohapatra@email.com",
    district: "Khordha",
    taluk: "Bhubaneswar",
    address: "Plot 123, Patia, Bhubaneswar",
    coordinates: { lat: 20.2961, lng: 85.8245 },
    preferences: ["Organic", "Local Produce", "Fresh Vegetables"],
    totalOrders: 45,
    totalSpent: 25000,
    carbonSaved: 85.5,
    favoriteProducts: ["Paddy", "Vegetables", "Turmeric"],
    rating: 4.9
  },
  {
    id: "C-002", 
    name: "Ramesh Chandra Gouda",
    phoneNumber: "+91-9437-102002",
    email: "ramesh.gouda@email.com", 
    district: "Ganjam",
    taluk: "Berhampur",
    address: "MG Road, Berhampur",
    coordinates: { lat: 19.3149, lng: 84.7941 },
    preferences: ["Premium Quality", "Cashew", "Organic"],
    totalOrders: 32,
    totalSpent: 18500,
    carbonSaved: 62.3,
    favoriteProducts: ["Cashew", "Paddy", "Coconut"],
    rating: 4.7
  },
  {
    id: "C-003",
    name: "Hirakud Prasad Panda", 
    phoneNumber: "+91-9437-103003",
    email: "hirakud.panda@email.com",
    district: "Sambalpur", 
    taluk: "Sambalpur",
    address: "Near Hirakud Dam, Sambalpur",
    coordinates: { lat: 21.4669, lng: 83.9812 },
    preferences: ["Bulk Purchase", "Millets", "Traditional Varieties"],
    totalOrders: 28,
    totalSpent: 15600,
    carbonSaved: 45.2,
    favoriteProducts: ["Finger Millet", "Paddy", "Mahua"],
    rating: 4.6
  }
];

// Product Data
export const odishaProducts = [
  {
    id: "P-001",
    name: "Swarna Paddy",
    category: "Grains",
    variety: "Swarna",
    farmer: odishaFarmers[0],
    warehouse: "WH-ANG-001",
    quantity: 850,
    unit: "kg",
    pricePerKg: 34.5,
    originalPrice: 32.0,
    communityVotes: 456,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop",
    description: "Premium quality Swarna variety paddy from Angul district",
    harvestDate: "2025-08-15",
    expiryDate: "2026-02-15",
    organic: true,
    certifications: ["Organic", "Fair Trade"],
    carbonFootprint: 2.8,
    nutritionFacts: {
      protein: "7.5g per 100g",
      carbs: "78g per 100g", 
      fiber: "1.4g per 100g"
    },
    qrCode: "QR-P001-SW001",
    blockchainTx: "0xANG1A2B3C4D5E6F",
    rating: 4.8,
    reviews: 125
  },
  {
    id: "P-002",
    name: "Lalat Paddy",
    category: "Grains", 
    variety: "Lalat",
    farmer: odishaFarmers[1],
    warehouse: "WH-BAL-001",
    quantity: 1120,
    unit: "kg",
    pricePerKg: 33.8,
    originalPrice: 31.5,
    communityVotes: 623,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=200&fit=crop",
    description: "High-yield Lalat variety paddy from Balangir region",
    harvestDate: "2025-08-10",
    expiryDate: "2026-03-10", 
    organic: true,
    certifications: ["Organic", "ISO-9001"],
    carbonFootprint: 3.2,
    nutritionFacts: {
      protein: "8.2g per 100g",
      carbs: "75g per 100g",
      fiber: "1.6g per 100g"
    },
    qrCode: "QR-P002-LA001",
    blockchainTx: "0xBAL1E5F6G7H8I9J",
    rating: 4.9,
    reviews: 89
  },
  {
    id: "P-003",
    name: "Local Turmeric",
    category: "Spices",
    variety: "Local Variety",
    farmer: odishaFarmers[1],
    warehouse: "WH-BAL-001", 
    quantity: 185,
    unit: "kg",
    pricePerKg: 172.0,
    originalPrice: 165.0,
    communityVotes: 145,
    image: "https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?w=300&h=200&fit=crop",
    description: "Aromatic turmeric from Balangir hills, rich in curcumin",
    harvestDate: "2025-05-20",
    expiryDate: "2027-08-30",
    organic: true,
    certifications: ["Organic", "GI Tag"],
    carbonFootprint: 1.5,
    nutritionFacts: {
      curcumin: "3-5%",
      volatileOil: "5-6%",
      fiber: "6.7g per 100g"
    },
    qrCode: "QR-P003-TU001",
    blockchainTx: "0xBAL2F6G7H8I9J0K",
    rating: 4.7,
    reviews: 67
  },
  {
    id: "P-004",
    name: "East Coast Coconut",
    category: "Fruits",
    variety: "East Coast Tall",
    farmer: odishaFarmers[2],
    warehouse: "WH-BLS-001",
    quantity: 250,
    unit: "kg", 
    pricePerKg: 62.5,
    originalPrice: 58.0,
    communityVotes: 234,
    image: "https://images.unsplash.com/photo-1549440242-b2c2b5f23d2c?w=300&h=200&fit=crop",
    description: "Fresh coconuts from coastal Balasore farms",
    harvestDate: "2025-07-25",
    expiryDate: "2026-09-10",
    organic: true,
    certifications: ["Organic"],
    carbonFootprint: 0.8,
    nutritionFacts: {
      protein: "3.3g per 100g",
      fat: "33.5g per 100g",
      fiber: "9.0g per 100g"
    },
    qrCode: "QR-P004-CO001",
    blockchainTx: "0xBLS2H8I9J0K1L2M",
    rating: 4.6,
    reviews: 43
  },
  {
    id: "P-005",
    name: "Bhaskara Cashew",
    category: "Nuts",
    variety: "Bhaskara",
    farmer: odishaFarmers[2],
    warehouse: "WH-GAN-001",
    quantity: 265,
    unit: "kg",
    pricePerKg: 512.0,
    originalPrice: 485.0,
    communityVotes: 456,
    image: "https://images.unsplash.com/photo-1585016495481-91613a3ab1bc?w=300&h=200&fit=crop",
    description: "Premium Bhaskara variety cashews from Ganjam",
    harvestDate: "2025-07-10",
    expiryDate: "2026-12-31",
    organic: false,
    certifications: ["GI Tag", "Export Quality"],
    carbonFootprint: 1.2,
    nutritionFacts: {
      protein: "18g per 100g",
      fat: "44g per 100g", 
      carbs: "30g per 100g"
    },
    qrCode: "QR-P005-CA001",
    blockchainTx: "0xGAN2T0U1V2W3X4Y",
    rating: 4.8,
    reviews: 156
  }
];

// Order Data
export const dummyOrders = [
  {
    id: "ORD-001",
    consumer: odishaConsumers[0],
    items: [
      { product: odishaProducts[0], quantity: 5, price: 34.5 },
      { product: odishaProducts[2], quantity: 2, price: 172.0 }
    ],
    total: 516.5,
    status: "delivered",
    orderDate: "2025-09-15T10:30:00+05:30",
    deliveryDate: "2025-09-17T14:20:00+05:30",
    paymentMethod: "UPI",
    deliveryAddress: "Plot 123, Patia, Bhubaneswar",
    trackingId: "TRK-001",
    carbonSaved: 12.5,
    rating: 5
  },
  {
    id: "ORD-002", 
    consumer: odishaConsumers[1],
    items: [
      { product: odishaProducts[4], quantity: 1, price: 512.0 },
      { product: odishaProducts[3], quantity: 3, price: 62.5 }
    ],
    total: 699.5,
    status: "in_transit",
    orderDate: "2025-09-18T15:45:00+05:30",
    deliveryDate: "2025-09-21T16:00:00+05:30",
    paymentMethod: "Credit Card",
    deliveryAddress: "MG Road, Berhampur",
    trackingId: "TRK-002",
    carbonSaved: 8.3,
    rating: null
  },
  {
    id: "ORD-003",
    consumer: odishaConsumers[2], 
    items: [
      { product: odishaProducts[1], quantity: 10, price: 33.8 }
    ],
    total: 338.0,
    status: "processing",
    orderDate: "2025-09-20T09:15:00+05:30", 
    deliveryDate: "2025-09-23T12:00:00+05:30",
    paymentMethod: "Cash on Delivery",
    deliveryAddress: "Near Hirakud Dam, Sambalpur",
    trackingId: "TRK-003",
    carbonSaved: 15.2,
    rating: null
  }
];

// QR Code Data
export const dummyQRCodes = [
  {
    id: "QR-001",
    productId: "P-001",
    farmerId: "F-001",
    warehouseId: "WH-ANG-001",
    qrCodeUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE0Ij5RUi1QMDAxPC90ZXh0Pgo8L3N2Zz4=",
    batchId: "BATCH-ANG-P1-2025-07",
    generatedDate: "2025-09-15T08:30:00+05:30",
    scannedCount: 45,
    data: {
      productName: "Swarna Paddy",
      farmerName: "Rajesh Panda",
      district: "Angul",
      harvestDate: "2025-08-15",
      certifications: ["Organic", "Fair Trade"],
      blockchainTx: "0xANG1A2B3C4D5E6F"
    }
  },
  {
    id: "QR-002",
    productId: "P-002", 
    farmerId: "F-002",
    warehouseId: "WH-BAL-001",
    qrCodeUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE0Ij5RUi1QMDAyPC90ZXh0Pgo8L3N2Zz4=",
    batchId: "BATCH-BAL-P1-2025-08",
    generatedDate: "2025-09-16T10:15:00+05:30",
    scannedCount: 32,
    data: {
      productName: "Lalat Paddy",
      farmerName: "Santosh Kumar Nag", 
      district: "Balangir",
      harvestDate: "2025-08-10",
      certifications: ["Organic", "ISO-9001"],
      blockchainTx: "0xBAL1E5F6G7H8I9J"
    }
  }
];

// Enhanced Predictive Analytics Data for Odisha
export const predictiveAnalytics = {
  cropDemand: {
    thisWeek: [
      { crop: "Paddy", demand: 85, trend: "up", priceChange: 5.2, districts: ["Cuttack", "Khordha", "Balasore"], expectedPrice: 36.2 },
      { crop: "Turmeric", demand: 92, trend: "up", priceChange: 8.7, districts: ["Kandhamal", "Balangir"], expectedPrice: 187.0 },
      { crop: "Cashew", demand: 78, trend: "stable", priceChange: 1.3, districts: ["Ganjam", "Koraput"], expectedPrice: 518.7 },
      { crop: "Coconut", demand: 65, trend: "down", priceChange: -2.1, districts: ["Balasore", "Kendrapara"], expectedPrice: 61.2 },
      { crop: "Vegetables", demand: 88, trend: "up", priceChange: 6.4, districts: ["Khordha", "Cuttack"], expectedPrice: 48.5 },
      { crop: "Jute", demand: 73, trend: "up", priceChange: 4.1, districts: ["Bhadrak", "Cuttack"], expectedPrice: 42.3 },
      { crop: "Coffee", demand: 67, trend: "stable", priceChange: 0.8, districts: ["Kandhamal", "Koraput"], expectedPrice: 156.2 }
    ],
    nextMonth: [
      { crop: "Paddy", demand: 95, trend: "up", priceChange: 12.5, reason: "Festival season approaching" },
      { crop: "Millets", demand: 76, trend: "up", priceChange: 15.2, reason: "Health consciousness rising" },
      { crop: "Spices", demand: 89, trend: "up", priceChange: 10.8, reason: "Export demand increasing" },
      { crop: "Cashew", demand: 82, trend: "up", priceChange: 7.3, reason: "Processing season starts" },
      { crop: "Turmeric", demand: 94, trend: "up", priceChange: 18.5, reason: "Festive season demand" }
    ]
  },
  farmerProfitLoss: {
    monthly: [
      { month: "June", profit: 22000, loss: 4200, netGain: 17800, crops: ["Paddy", "Vegetables"] },
      { month: "July", profit: 25000, loss: 3500, netGain: 21500, crops: ["Cashew", "Coconut"] },
      { month: "August", profit: 32000, loss: 2800, netGain: 29200, crops: ["Turmeric", "Paddy"] },
      { month: "September", profit: 28500, loss: 4200, netGain: 24300, crops: ["Jute", "Vegetables"] }
    ],
    yearly: {
      totalProfit: 285000,
      totalLoss: 35000,
      netProfit: 250000,
      profitMargin: 87.7,
      topPerformingCrops: ["Turmeric", "Cashew", "Paddy"],
      improvementAreas: ["Post-harvest handling", "Quality grading"]
    }
  },
  warehouseAnalytics: {
    topPerformers: [
      { 
        warehouseId: "WH-KHO-001", 
        district: "Khordha", 
        efficiency: 94.5, 
        revenue: 3560000, 
        throughput: "850 tonnes/month",
        specialties: ["Vegetables", "Flowers"]
      },
      { 
        warehouseId: "WH-CUT-001", 
        district: "Cuttack", 
        efficiency: 92.1, 
        revenue: 2870000, 
        throughput: "720 tonnes/month",
        specialties: ["Paddy", "Jute"]
      },
      { 
        warehouseId: "WH-BRG-001", 
        district: "Bargarh", 
        efficiency: 90.8, 
        revenue: 2240000, 
        throughput: "650 tonnes/month",
        specialties: ["Paddy", "Sugarcane"]
      },
      { 
        warehouseId: "WH-GAN-001", 
        district: "Ganjam", 
        efficiency: 89.3, 
        revenue: 2180000, 
        throughput: "580 tonnes/month",
        specialties: ["Cashew", "Turmeric"]
      }
    ],
    lowStock: [
      { 
        product: "Turmeric", 
        warehouse: "WH-KAN-001", 
        district: "Kandhamal",
        currentStock: 25, 
        threshold: 50, 
        urgency: "high",
        estimatedDemand: "85 tonnes this month"
      },
      { 
        product: "Cashew", 
        warehouse: "WH-GAN-001", 
        district: "Ganjam",
        currentStock: 15, 
        threshold: 30, 
        urgency: "critical",
        estimatedDemand: "45 tonnes this month"
      },
      { 
        product: "Coconut", 
        warehouse: "WH-BLS-001", 
        district: "Balasore",
        currentStock: 22, 
        threshold: 40, 
        urgency: "medium",
        estimatedDemand: "35 tonnes this month"
      }
    ]
  },
  marketTrends: {
    priceFluctuations: [
      { 
        product: "Paddy", 
        currentPrice: 34.5, 
        predictedPrice: 37.2, 
        change: 7.8, 
        confidence: 89,
        timeframe: "next 2 weeks",
        factors: ["Festival demand", "Export orders"]
      },
      { 
        product: "Turmeric", 
        currentPrice: 172.0, 
        predictedPrice: 185.5, 
        change: 7.8, 
        confidence: 92,
        timeframe: "next 3 weeks",
        factors: ["Processing season", "Health trend"]
      },
      { 
        product: "Cashew", 
        currentPrice: 512.0, 
        predictedPrice: 545.8, 
        change: 6.6, 
        confidence: 85,
        timeframe: "next month",
        factors: ["Export demand", "Quality premium"]
      },
      { 
        product: "Coconut", 
        currentPrice: 62.5, 
        predictedPrice: 58.2, 
        change: -6.9, 
        confidence: 78,
        timeframe: "next 2 weeks",
        factors: ["Seasonal surplus", "Transportation costs"]
      }
    ],
    seasonalDemand: {
      festivalSeason: [
        { product: "Turmeric", demandIncrease: 45, festivals: ["Durga Puja", "Kali Puja"] },
        { product: "Coconut", demandIncrease: 35, festivals: ["Jagannath Rath Yatra"] },
        { product: "Paddy", demandIncrease: 25, festivals: ["Nuakhai"] },
        { product: "Jaggery", demandIncrease: 55, festivals: ["Makar Sankranti"] }
      ],
      monsoonImpact: [
        { product: "Vegetables", expectedSupply: "reduced", priceImpact: 15 },
        { product: "Paddy", expectedSupply: "normal", priceImpact: 2 }
      ]
    }
  },
  
  // AI-driven insights for better decision making
  aiInsights: {
    recommendations: [
      {
        type: "price_optimization",
        crop: "Turmeric",
        suggestion: "Increase price by 8-12% in next 2 weeks",
        reasoning: "Festival demand spike expected",
        confidence: 91
      },
      {
        type: "harvest_timing",
        crop: "Cashew",
        suggestion: "Delay harvest by 1 week for better pricing",
        reasoning: "Processing season premium starts",
        confidence: 87
      },
      {
        type: "storage_management",
        crop: "Paddy",
        suggestion: "Store additional 20% for festival season",
        reasoning: "Nuakhai celebration demand surge",
        confidence: 84
      }
    ],
    weatherAlerts: [
      {
        district: "Khordha",
        type: "rainfall",
        severity: "moderate",
        impact: "Delay vegetable harvesting by 2-3 days",
        duration: "next 48 hours"
      },
      {
        district: "Ganjam",
        type: "humidity",
        severity: "high",
        impact: "Accelerate cashew processing to prevent spoilage",
        duration: "next week"
      }
    ]
  }
};

// Blockchain Transaction Data
export const blockchainTransactions = [
  {
    txHash: "0xANG1A2B3C4D5E6F",
    productId: "P-001",
    type: "harvest_verification",
    timestamp: "2025-08-15T14:30:00+05:30",
    farmerAddress: "0x742d35Cc6634C0532925a3b8D4016A0f",
    blockNumber: 15423567,
    gasUsed: 45000,
    status: "confirmed"
  },
  {
    txHash: "0xBAL1E5F6G7H8I9J", 
    productId: "P-002",
    type: "quality_verification", 
    timestamp: "2025-08-10T16:45:00+05:30",
    farmerAddress: "0x8ba1f109551bD432803012645Hac136c",
    blockNumber: 15421234,
    gasUsed: 52000,
    status: "confirmed"
  }
];

// Support Contact Data
export const supportContacts = {
  farmer: {
    general: "+91-99999-10001",
    technical: "+91-99999-10002", 
    emergency: "+91-99999-10003"
  },
  warehouse: {
    operations: "+91-99999-20001",
    logistics: "+91-99999-20002",
    quality: "+91-99999-20003"
  },
  consumer: {
    support: "+91-99999-30001",
    complaints: "+91-99999-30002",
    delivery: "+91-99999-30003"
  }
};

// All data is already exported individually above