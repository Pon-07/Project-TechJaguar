// Uzhavar QR Code Product Data
export interface QRProduct {
  id: string;
  qrCodeId: string;
  blockchainId: string;
  farmerName: string;
  farmerPhoto: string;
  taluk: string;
  cropType: string;
  variety?: string;
  quantity: string;
  unit: string;
  harvestDate: string;
  estimatedDelivery: string;
  farmLocation: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  pricePerUnit: number;
  totalValue: number;
  profitMargin: number;
  lossRisk: number;
  qualityGrade: 'A+' | 'A' | 'B+' | 'B';
  organicCertified: boolean;
  soilHealth: string;
  waterSource: string;
  fertilizers: string[];
  pesticides: string[];
  storageTemp: string;
  moistureContent: string;
  deliveryRoute: string[];
  carbonFootprint: number;
  verified: boolean;
  createdAt: string;
}

export const qrProducts: QRProduct[] = [
  {
    id: "prod-001",
    qrCodeId: "UZ-2025-001",
    blockchainId: "BCX-2025-001",
    farmerName: "Ramesh Kumar",
    farmerPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    taluk: "Madurai",
    cropType: "Organic Paddy",
    variety: "Basmati",
    quantity: "200",
    unit: "bags",
    harvestDate: "2025-01-15",
    estimatedDelivery: "2025-01-25",
    farmLocation: {
      address: "Village: Keeladi, Madurai District, Tamil Nadu",
      coordinates: { lat: 9.9252, lng: 78.1198 }
    },
    pricePerUnit: 2500,
    totalValue: 500000,
    profitMargin: 25,
    lossRisk: 5,
    qualityGrade: 'A+',
    organicCertified: true,
    soilHealth: "Excellent - pH 6.5",
    waterSource: "Borewell + Rainwater Harvesting",
    fertilizers: ["Organic Compost", "Vermicompost", "Green Manure"],
    pesticides: ["Neem Oil", "Organic Pesticides Only"],
    storageTemp: "25-30°C",
    moistureContent: "14%",
    deliveryRoute: ["Madurai Hub", "Chennai Warehouse", "Consumer"],
    carbonFootprint: 1.2,
    verified: true,
    createdAt: "2025-01-16"
  },
  {
    id: "prod-002",
    qrCodeId: "UZ-2025-002",
    blockchainId: "BCX-2025-002",
    farmerName: "Lakshmi Devi",
    farmerPhoto: "https://images.unsplash.com/photo-1494790108755-2616c6d9c3eb?w=150&h=150&fit=crop&crop=face",
    taluk: "Tirunelveli",
    cropType: "Groundnut",
    variety: "TMV-2",
    quantity: "150",
    unit: "bags",
    harvestDate: "2025-01-12",
    estimatedDelivery: "2025-01-22",
    farmLocation: {
      address: "Village: Palayamkottai, Tirunelveli District, Tamil Nadu",
      coordinates: { lat: 8.7139, lng: 77.7567 }
    },
    pricePerUnit: 3200,
    totalValue: 480000,
    profitMargin: 30,
    lossRisk: 8,
    qualityGrade: 'A',
    organicCertified: false,
    soilHealth: "Good - pH 6.8",
    waterSource: "Canal Irrigation",
    fertilizers: ["NPK 20:20:0", "Urea", "Organic Compost"],
    pesticides: ["Standard Pesticides", "Fungicides"],
    storageTemp: "20-25°C",
    moistureContent: "8%",
    deliveryRoute: ["Tirunelveli Hub", "Madurai Warehouse", "Consumer"],
    carbonFootprint: 1.8,
    verified: true,
    createdAt: "2025-01-13"
  },
  {
    id: "prod-003",
    qrCodeId: "UZ-2025-003",
    blockchainId: "BCX-2025-003",
    farmerName: "Arul Mani",
    farmerPhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    taluk: "Thanjavur",
    cropType: "Tomatoes",
    variety: "Hybrid",
    quantity: "500",
    unit: "kg",
    harvestDate: "2025-01-18",
    estimatedDelivery: "2025-01-20",
    farmLocation: {
      address: "Village: Kumbakonam, Thanjavur District, Tamil Nadu",
      coordinates: { lat: 10.9601, lng: 79.3771 }
    },
    pricePerUnit: 45,
    totalValue: 22500,
    profitMargin: 40,
    lossRisk: 15,
    qualityGrade: 'A+',
    organicCertified: true,
    soilHealth: "Very Good - pH 6.2",
    waterSource: "Drip Irrigation",
    fertilizers: ["Organic Compost", "Biofertilizers"],
    pesticides: ["Organic Pesticides", "Neem-based Solutions"],
    storageTemp: "15-18°C",
    moistureContent: "92%",
    deliveryRoute: ["Thanjavur Hub", "Trichy Warehouse", "Consumer"],
    carbonFootprint: 0.8,
    verified: true,
    createdAt: "2025-01-19"
  },
  {
    id: "prod-004",
    qrCodeId: "UZ-2025-004",
    blockchainId: "BCX-2025-004",
    farmerName: "Meena Raj",
    farmerPhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    taluk: "Madurai",
    cropType: "Turmeric",
    variety: "Salem",
    quantity: "300",
    unit: "kg",
    harvestDate: "2025-01-10",
    estimatedDelivery: "2025-01-28",
    farmLocation: {
      address: "Village: Usilampatti, Madurai District, Tamil Nadu",
      coordinates: { lat: 9.9705, lng: 77.7885 }
    },
    pricePerUnit: 180,
    totalValue: 54000,
    profitMargin: 35,
    lossRisk: 10,
    qualityGrade: 'A+',
    organicCertified: true,
    soilHealth: "Excellent - pH 6.0",
    waterSource: "Borewell",
    fertilizers: ["Organic Compost", "Cow Dung Manure"],
    pesticides: ["Organic Only"],
    storageTemp: "Ambient",
    moistureContent: "10%",
    deliveryRoute: ["Madurai Hub", "Salem Processing", "Consumer"],
    carbonFootprint: 1.5,
    verified: true,
    createdAt: "2025-01-11"
  },
  {
    id: "prod-005",
    qrCodeId: "UZ-2025-005",
    blockchainId: "BCX-2025-005",
    farmerName: "Karthik Raja",
    farmerPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    taluk: "Tirunelveli",
    cropType: "Mangoes",
    variety: "Alphonso",
    quantity: "200",
    unit: "kg",
    harvestDate: "2025-01-20",
    estimatedDelivery: "2025-01-23",
    farmLocation: {
      address: "Village: Nanguneri, Tirunelveli District, Tamil Nadu",
      coordinates: { lat: 8.4838, lng: 77.8624 }
    },
    pricePerUnit: 250,
    totalValue: 50000,
    profitMargin: 50,
    lossRisk: 20,
    qualityGrade: 'A+',
    organicCertified: true,
    soilHealth: "Good - pH 6.5",
    waterSource: "Drip + Rainwater",
    fertilizers: ["Organic Compost", "Biofertilizers", "Rock Phosphate"],
    pesticides: ["Organic Pesticides", "Pheromone Traps"],
    storageTemp: "12-15°C",
    moistureContent: "85%",
    deliveryRoute: ["Tirunelveli Hub", "Express Cold Chain", "Consumer"],
    carbonFootprint: 2.1,
    verified: true,
    createdAt: "2025-01-21"
  }
];

// Helper function to get product by QR Code ID
export const getProductByQRCode = (qrCodeId: string): QRProduct | undefined => {
  return qrProducts.find(product => product.qrCodeId === qrCodeId);
};

// Helper function to get products by farmer
export const getProductsByFarmer = (farmerName: string): QRProduct[] => {
  return qrProducts.filter(product => product.farmerName === farmerName);
};

// Helper function to get products by taluk
export const getProductsByTaluk = (taluk: string): QRProduct[] => {
  return qrProducts.filter(product => product.taluk === taluk);
};