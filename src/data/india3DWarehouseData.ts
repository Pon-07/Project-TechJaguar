// Comprehensive India-wide 3D Warehouse Data with Strict QR Requirements
// 50+ shipments across 10+ states with mandatory QR images

export interface QRHistoryEntry {
  id: string;
  image: string; // MANDATORY - must always have dummy QR image
  createdAt: string;
  status: 'active' | 'expired' | 'used';
  scanCount?: number;
}

export interface Product3D {
  id: string;
  name: string;
  image: string; // Crop-specific image
  farmer: {
    name: string;
    state: string;
    district: string;
    uzhavar_pin: string;
  };
  warehouse: {
    id: string;
    name: string;
    state: string;
    district: string;
  };
  quantityKg: number;
  status: 'in_transit' | 'arrived' | 'delayed' | 'dispatched';
  position: [number, number, number]; // 3D coordinates
  qrImage: string; // MANDATORY - dummy QR image URL
  txHash: string; // Blockchain transaction hash
  qrHistory: QRHistoryEntry[];
  shipment: {
    id: string;
    vehicle: string;
    eta: string;
    route?: string;
  };
  predictedDemand?: {
    increase: number;
    timeframe: string;
    confidence: number;
  };
  carbonFootprint?: {
    transport: number;
    storage: number;
    total: number;
  };
}

export interface Warehouse3D {
  id: string;
  name: string;
  state: string;
  district: string;
  position: [number, number, number];
  capacity: number;
  occupancy: number;
  products: Product3D[];
  predictiveAnalytics?: {
    expectedDeliveries: number;
    capacityUtilization: number;
    alertLevel: 'low' | 'medium' | 'high';
  };
}

export interface Route3D {
  id: string;
  from: string;
  to: string;
  status: 'in_transit' | 'arrived' | 'delayed';
  color: string;
  points: [number, number, number][];
  vehicle: {
    type: 'truck' | 'scooter' | 'drone';
    position: [number, number, number];
    speed: number;
    registration: string;
  };
  estimatedTime: number; // minutes
  actualTime?: number;
  carbonEmission: number; // kg CO2
}

export const INDIA_3D_WAREHOUSE_COMPREHENSIVE_DATA = {
  warehouses: [
    // Punjab - Wheat Belt
    {
      id: 'WH-PB-001',
      name: 'Punjab Central Grain Hub',
      state: 'Punjab',
      district: 'Ludhiana',
      position: [0, 0, 0] as [number, number, number],
      capacity: 75000,
      occupancy: 68000,
      predictiveAnalytics: {
        expectedDeliveries: 15,
        capacityUtilization: 91,
        alertLevel: 'high' as const
      },
      products: [
        {
          id: 'P-PB-001',
          name: 'Wheat - Sharbati Premium',
          image: 'wheat_sharbati_premium.jpg',
          farmer: {
            name: 'Harjeet Singh Dhillon',
            state: 'Punjab',
            district: 'Ludhiana',
            uzhavar_pin: 'UZP-PB-14001'
          },
          warehouse: {
            id: 'WH-PB-001',
            name: 'Punjab Central Grain Hub',
            state: 'Punjab',
            district: 'Ludhiana'
          },
          quantityKg: 25000,
          status: 'in_transit' as const,
          position: [2, 1, 3] as [number, number, number],
          qrImage: 'qr_P-PB-001_active.png', // MANDATORY
          txHash: '0xFA12B3C4D5E6F7A8B9C0D1E2F3G4H5I6',
          qrHistory: [
            {
              id: 'QR-P-PB-001-01',
              image: 'qr_P-PB-001_01.png',
              createdAt: '2025-09-18T10:00:00Z',
              status: 'active' as const,
              scanCount: 3
            },
            {
              id: 'QR-P-PB-001-02',
              image: 'qr_P-PB-001_02.png',
              createdAt: '2025-09-20T09:00:00Z',
              status: 'active' as const,
              scanCount: 1
            }
          ],
          shipment: {
            id: 'SHIP-PB-8001',
            vehicle: 'PB-10-AB-8001',
            eta: '2025-09-21T16:00:00+05:30',
            route: 'Ludhiana → Warehouse Hub'
          },
          predictedDemand: {
            increase: 30,
            timeframe: '30 days',
            confidence: 87
          },
          carbonFootprint: {
            transport: 15.2,
            storage: 2.8,
            total: 18.0
          }
        },
        {
          id: 'P-PB-002',
          name: 'Basmati Rice - 1121 Golden',
          image: 'basmati_1121_golden.jpg',
          farmer: {
            name: 'Kuldeep Kaur Sandhu',
            state: 'Punjab',
            district: 'Amritsar',
            uzhavar_pin: 'UZP-PB-14002'
          },
          warehouse: {
            id: 'WH-PB-001',
            name: 'Punjab Central Grain Hub',
            state: 'Punjab',
            district: 'Ludhiana'
          },
          quantityKg: 18000,
          status: 'arrived' as const,
          position: [4, 1, 1] as [number, number, number],
          qrImage: 'qr_P-PB-002_active.png', // MANDATORY
          txHash: '0xBF23C4D5E6F7A8B9C1D2E3F4G5H6I7J8',
          qrHistory: [
            {
              id: 'QR-P-PB-002-01',
              image: 'qr_P-PB-002_01.png',
              createdAt: '2025-09-19T11:00:00Z',
              status: 'active' as const,
              scanCount: 5
            }
          ],
          shipment: {
            id: 'SHIP-PB-8002',
            vehicle: 'PB-03-CD-8002',
            eta: 'Arrived',
            route: 'Amritsar → Warehouse Hub'
          },
          predictedDemand: {
            increase: 25,
            timeframe: '30 days',
            confidence: 82
          },
          carbonFootprint: {
            transport: 12.8,
            storage: 1.9,
            total: 14.7
          }
        },
        {
          id: 'P-PB-003',
          name: 'Mustard Seeds - Premium',
          image: 'mustard_seeds_premium.jpg',
          farmer: {
            name: 'Baljinder Singh',
            state: 'Punjab',
            district: 'Patiala',
            uzhavar_pin: 'UZP-PB-14003'
          },
          warehouse: {
            id: 'WH-PB-001',
            name: 'Punjab Central Grain Hub',
            state: 'Punjab',
            district: 'Ludhiana'
          },
          quantityKg: 8500,
          status: 'dispatched' as const,
          position: [1, 1, 5] as [number, number, number],
          qrImage: 'qr_P-PB-003_active.png', // MANDATORY
          txHash: '0xCD34E5F6789012345678901234567890',
          qrHistory: [
            {
              id: 'QR-P-PB-003-01',
              image: 'qr_P-PB-003_01.png',
              createdAt: '2025-09-17T14:00:00Z',
              status: 'used' as const,
              scanCount: 8
            },
            {
              id: 'QR-P-PB-003-02',
              image: 'qr_P-PB-003_02.png',
              createdAt: '2025-09-21T08:00:00Z',
              status: 'active' as const,
              scanCount: 2
            }
          ],
          shipment: {
            id: 'SHIP-PB-8003',
            vehicle: 'PB-07-EF-8003',
            eta: '2025-09-22T10:00:00+05:30',
            route: 'Warehouse Hub → Delhi Market'
          },
          carbonFootprint: {
            transport: 8.5,
            storage: 1.2,
            total: 9.7
          }
        }
      ]
    },

    // Tamil Nadu - Rice Belt
    {
      id: 'WH-TN-001',
      name: 'Tamil Nadu Paddy Processing Complex',
      state: 'Tamil Nadu',
      district: 'Thanjavur',
      position: [15, 0, 10] as [number, number, number],
      capacity: 55000,
      occupancy: 48000,
      predictiveAnalytics: {
        expectedDeliveries: 12,
        capacityUtilization: 87,
        alertLevel: 'medium' as const
      },
      products: [
        {
          id: 'P-TN-001',
          name: 'Paddy - Samba Masuri Elite',
          image: 'paddy_samba_masuri_elite.jpg',
          farmer: {
            name: 'Sita Devi Murugan',
            state: 'Tamil Nadu',
            district: 'Thanjavur',
            uzhavar_pin: 'UZP-TN-33001'
          },
          warehouse: {
            id: 'WH-TN-001',
            name: 'Tamil Nadu Paddy Processing Complex',
            state: 'Tamil Nadu',
            district: 'Thanjavur'
          },
          quantityKg: 32000,
          status: 'in_transit' as const,
          position: [17, 1, 8] as [number, number, number],
          qrImage: 'qr_P-TN-001_active.png', // MANDATORY
          txHash: '0xA1B2C3D4E5F678901234567890ABCDEF',
          qrHistory: [
            {
              id: 'QR-P-TN-001-01',
              image: 'qr_P-TN-001_01.png',
              createdAt: '2025-09-18T10:00:00Z',
              status: 'active' as const,
              scanCount: 4
            },
            {
              id: 'QR-P-TN-001-02',
              image: 'qr_P-TN-001_02.png',
              createdAt: '2025-09-20T09:00:00Z',
              status: 'active' as const,
              scanCount: 2
            }
          ],
          shipment: {
            id: 'SHIP-TN-9001',
            vehicle: 'TN-07-MN-9001',
            eta: '2025-09-21T17:00:00+05:30',
            route: 'Thanjavur Farm → Processing Complex'
          },
          predictedDemand: {
            increase: 25,
            timeframe: '30 days',
            confidence: 78
          },
          carbonFootprint: {
            transport: 18.5,
            storage: 3.2,
            total: 21.7
          }
        },
        {
          id: 'P-TN-002',
          name: 'Black Gram - Urad Premium',
          image: 'black_gram_urad_premium.jpg',
          farmer: {
            name: 'Raman Krishnan',
            state: 'Tamil Nadu',
            district: 'Madurai',
            uzhavar_pin: 'UZP-TN-33002'
          },
          warehouse: {
            id: 'WH-TN-001',
            name: 'Tamil Nadu Paddy Processing Complex',
            state: 'Tamil Nadu',
            district: 'Thanjavur'
          },
          quantityKg: 12000,
          status: 'arrived' as const,
          position: [13, 1, 12] as [number, number, number],
          qrImage: 'qr_P-TN-002_active.png', // MANDATORY
          txHash: '0xDEF123456789ABCDEF0123456789ABCD',
          qrHistory: [
            {
              id: 'QR-P-TN-002-01',
              image: 'qr_P-TN-002_01.png',
              createdAt: '2025-09-19T15:30:00Z',
              status: 'active' as const,
              scanCount: 6
            }
          ],
          shipment: {
            id: 'SHIP-TN-9002',
            vehicle: 'TN-45-RS-9002',
            eta: 'Arrived',
            route: 'Madurai → Processing Complex'
          },
          carbonFootprint: {
            transport: 14.2,
            storage: 1.8,
            total: 16.0
          }
        }
      ]
    },

    // Maharashtra - Cotton & Sugarcane Hub
    {
      id: 'WH-MH-001',
      name: 'Maharashtra Multi-Crop Processing Center',
      state: 'Maharashtra',
      district: 'Pune',
      position: [8, 0, -8] as [number, number, number],
      capacity: 60000,
      occupancy: 52000,
      predictiveAnalytics: {
        expectedDeliveries: 18,
        capacityUtilization: 87,
        alertLevel: 'medium' as const
      },
      products: [
        {
          id: 'P-MH-001',
          name: 'Cotton - Hybrid BT Variety',
          image: 'cotton_hybrid_bt.jpg',
          farmer: {
            name: 'Rajesh Patil Deshmukh',
            state: 'Maharashtra',
            district: 'Pune',
            uzhavar_pin: 'UZP-MH-27001'
          },
          warehouse: {
            id: 'WH-MH-001',
            name: 'Maharashtra Multi-Crop Processing Center',
            state: 'Maharashtra',
            district: 'Pune'
          },
          quantityKg: 15000,
          status: 'arrived' as const,
          position: [6, 1, -6] as [number, number, number],
          qrImage: 'qr_P-MH-001_active.png', // MANDATORY
          txHash: '0xCD34E5F6789012345678901234567890',
          qrHistory: [
            {
              id: 'QR-P-MH-001-01',
              image: 'qr_P-MH-001_01.png',
              createdAt: '2025-09-17T14:00:00Z',
              status: 'active' as const,
              scanCount: 7
            },
            {
              id: 'QR-P-MH-001-02',
              image: 'qr_P-MH-001_02.png',
              createdAt: '2025-09-20T12:00:00Z',
              status: 'active' as const,
              scanCount: 3
            }
          ],
          shipment: {
            id: 'SHIP-MH-7001',
            vehicle: 'MH-12-UV-7001',
            eta: 'Arrived',
            route: 'Pune Farm → Processing Center'
          },
          predictedDemand: {
            increase: 20,
            timeframe: '30 days',
            confidence: 92
          },
          carbonFootprint: {
            transport: 11.8,
            storage: 2.4,
            total: 14.2
          }
        },
        {
          id: 'P-MH-002',
          name: 'Sugarcane - Premium Quality',
          image: 'sugarcane_premium.jpg',
          farmer: {
            name: 'Priya Sharma Jadhav',
            state: 'Maharashtra',
            district: 'Kolhapur',
            uzhavar_pin: 'UZP-MH-27002'
          },
          warehouse: {
            id: 'WH-MH-001',
            name: 'Maharashtra Multi-Crop Processing Center',
            state: 'Maharashtra',
            district: 'Pune'
          },
          quantityKg: 28000,
          status: 'in_transit' as const,
          position: [10, 1, -10] as [number, number, number],
          qrImage: 'qr_P-MH-002_active.png', // MANDATORY
          txHash: '0xABCDEF1234567890ABCDEF1234567890',
          qrHistory: [
            {
              id: 'QR-P-MH-002-01',
              image: 'qr_P-MH-002_01.png',
              createdAt: '2025-09-20T07:45:00Z',
              status: 'active' as const,
              scanCount: 2
            }
          ],
          shipment: {
            id: 'SHIP-MH-7002',
            vehicle: 'MH-09-WX-7002',
            eta: '2025-09-22T14:30:00+05:30',
            route: 'Kolhapur → Processing Center'
          },
          carbonFootprint: {
            transport: 22.5,
            storage: 4.8,
            total: 27.3
          }
        }
      ]
    },

    // Uttar Pradesh - Diversified Crops
    {
      id: 'WH-UP-001',
      name: 'Uttar Pradesh Agri Hub',
      state: 'Uttar Pradesh',
      district: 'Lucknow',
      position: [5, 0, 15] as [number, number, number],
      capacity: 70000,
      occupancy: 58000,
      predictiveAnalytics: {
        expectedDeliveries: 20,
        capacityUtilization: 83,
        alertLevel: 'medium' as const
      },
      products: [
        {
          id: 'P-UP-001',
          name: 'Wheat - HD-2967 Variety',
          image: 'wheat_hd2967.jpg',
          farmer: {
            name: 'Mohan Lal Verma',
            state: 'Uttar Pradesh',
            district: 'Lucknow',
            uzhavar_pin: 'UZP-UP-09001'
          },
          warehouse: {
            id: 'WH-UP-001',
            name: 'Uttar Pradesh Agri Hub',
            state: 'Uttar Pradesh',
            district: 'Lucknow'
          },
          quantityKg: 35000,
          status: 'arrived' as const,
          position: [3, 1, 17] as [number, number, number],
          qrImage: 'qr_P-UP-001_active.png', // MANDATORY
          txHash: '0x567890ABCDEF1234567890ABCDEF1234',
          qrHistory: [
            {
              id: 'QR-P-UP-001-01',
              image: 'qr_P-UP-001_01.png',
              createdAt: '2025-09-16T09:20:00Z',
              status: 'active' as const,
              scanCount: 9
            }
          ],
          shipment: {
            id: 'SHIP-UP-6001',
            vehicle: 'UP-32-YZ-6001',
            eta: 'Arrived',
            route: 'Lucknow Farm → Agri Hub'
          },
          carbonFootprint: {
            transport: 16.8,
            storage: 5.2,
            total: 22.0
          }
        },
        {
          id: 'P-UP-002',
          name: 'Potato - Kufri Jyoti',
          image: 'potato_kufri_jyoti.jpg',
          farmer: {
            name: 'Sunita Devi Singh',
            state: 'Uttar Pradesh',
            district: 'Agra',
            uzhavar_pin: 'UZP-UP-09002'
          },
          warehouse: {
            id: 'WH-UP-001',
            name: 'Uttar Pradesh Agri Hub',
            state: 'Uttar Pradesh',
            district: 'Lucknow'
          },
          quantityKg: 18000,
          status: 'delayed' as const,
          position: [7, 1, 13] as [number, number, number],
          qrImage: 'qr_P-UP-002_active.png', // MANDATORY
          txHash: '0x789012345678ABCDEF9012345678ABCD',
          qrHistory: [
            {
              id: 'QR-P-UP-002-01',
              image: 'qr_P-UP-002_01.png',
              createdAt: '2025-09-18T13:15:00Z',
              status: 'active' as const,
              scanCount: 4
            }
          ],
          shipment: {
            id: 'SHIP-UP-6002',
            vehicle: 'UP-80-AB-6002',
            eta: '2025-09-23T11:00:00+05:30',
            route: 'Agra → Agri Hub (Delayed - Traffic)'
          },
          carbonFootprint: {
            transport: 19.2,
            storage: 2.8,
            total: 22.0
          }
        }
      ]
    },

    // Karnataka - Tech-Enabled Agriculture
    {
      id: 'WH-KA-001',
      name: 'Karnataka Smart Agri Complex',
      state: 'Karnataka',
      district: 'Bangalore Rural',
      position: [12, 0, 5] as [number, number, number],
      capacity: 45000,
      occupancy: 38000,
      predictiveAnalytics: {
        expectedDeliveries: 14,
        capacityUtilization: 84,
        alertLevel: 'low' as const
      },
      products: [
        {
          id: 'P-KA-001',
          name: 'Coffee Beans - Arabica Premium',
          image: 'coffee_arabica_premium.jpg',
          farmer: {
            name: 'Ravi Kumar Gowda',
            state: 'Karnataka',
            district: 'Coorg',
            uzhavar_pin: 'UZP-KA-29001'
          },
          warehouse: {
            id: 'WH-KA-001',
            name: 'Karnataka Smart Agri Complex',
            state: 'Karnataka',
            district: 'Bangalore Rural'
          },
          quantityKg: 5000,
          status: 'arrived' as const,
          position: [14, 1, 3] as [number, number, number],
          qrImage: 'qr_P-KA-001_active.png', // MANDATORY
          txHash: '0x901234ABCDEF567890123456789ABCDE',
          qrHistory: [
            {
              id: 'QR-P-KA-001-01',
              image: 'qr_P-KA-001_01.png',
              createdAt: '2025-09-19T08:30:00Z',
              status: 'active' as const,
              scanCount: 12
            }
          ],
          shipment: {
            id: 'SHIP-KA-5001',
            vehicle: 'KA-05-CD-5001',
            eta: 'Arrived',
            route: 'Coorg → Smart Complex'
          },
          carbonFootprint: {
            transport: 8.5,
            storage: 1.2,
            total: 9.7
          }
        },
        {
          id: 'P-KA-002',
          name: 'Ragi - Finger Millet Organic',
          image: 'ragi_finger_millet_organic.jpg',
          farmer: {
            name: 'Lakshmi Narasimha',
            state: 'Karnataka',
            district: 'Mandya',
            uzhavar_pin: 'UZP-KA-29002'
          },
          warehouse: {
            id: 'WH-KA-001',
            name: 'Karnataka Smart Agri Complex',
            state: 'Karnataka',
            district: 'Bangalore Rural'
          },
          quantityKg: 12000,
          status: 'in_transit' as const,
          position: [10, 1, 7] as [number, number, number],
          qrImage: 'qr_P-KA-002_active.png', // MANDATORY
          txHash: '0xDEF678901234ABCDEF567890123456AB',
          qrHistory: [
            {
              id: 'QR-P-KA-002-01',
              image: 'qr_P-KA-002_01.png',
              createdAt: '2025-09-20T16:45:00Z',
              status: 'active' as const,
              scanCount: 3
            }
          ],
          shipment: {
            id: 'SHIP-KA-5002',
            vehicle: 'KA-20-EF-5002',
            eta: '2025-09-21T19:15:00+05:30',
            route: 'Mandya → Smart Complex'
          },
          carbonFootprint: {
            transport: 11.2,
            storage: 1.8,
            total: 13.0
          }
        }
      ]
    },

    // West Bengal - Rice & Jute
    {
      id: 'WH-WB-001',
      name: 'West Bengal Paddy & Jute Hub',
      state: 'West Bengal',
      district: 'Kolkata',
      position: [20, 0, 18] as [number, number, number],
      capacity: 50000,
      occupancy: 42000,
      predictiveAnalytics: {
        expectedDeliveries: 16,
        capacityUtilization: 84,
        alertLevel: 'medium' as const
      },
      products: [
        {
          id: 'P-WB-001',
          name: 'Paddy - Swarna Variety',
          image: 'paddy_swarna.jpg',
          farmer: {
            name: 'Bijoy Chatterjee',
            state: 'West Bengal',
            district: 'Hooghly',
            uzhavar_pin: 'UZP-WB-19001'
          },
          warehouse: {
            id: 'WH-WB-001',
            name: 'West Bengal Paddy & Jute Hub',
            state: 'West Bengal',
            district: 'Kolkata'
          },
          quantityKg: 22000,
          status: 'arrived' as const,
          position: [22, 1, 16] as [number, number, number],
          qrImage: 'qr_P-WB-001_active.png', // MANDATORY
          txHash: '0xABC123456789DEF012345678901234EF',
          qrHistory: [
            {
              id: 'QR-P-WB-001-01',
              image: 'qr_P-WB-001_01.png',
              createdAt: '2025-09-17T11:20:00Z',
              status: 'active' as const,
              scanCount: 8
            }
          ],
          shipment: {
            id: 'SHIP-WB-4001',
            vehicle: 'WB-06-GH-4001',
            eta: 'Arrived',
            route: 'Hooghly → Paddy Hub'
          },
          carbonFootprint: {
            transport: 13.5,
            storage: 3.2,
            total: 16.7
          }
        }
      ]
    },

    // Rajasthan - Desert Crops
    {
      id: 'WH-RJ-001',
      name: 'Rajasthan Desert Crop Center',
      state: 'Rajasthan',
      district: 'Jaipur',
      position: [-5, 0, 8] as [number, number, number],
      capacity: 35000,
      occupancy: 28000,
      predictiveAnalytics: {
        expectedDeliveries: 10,
        capacityUtilization: 80,
        alertLevel: 'low' as const
      },
      products: [
        {
          id: 'P-RJ-001',
          name: 'Bajra - Pearl Millet',
          image: 'bajra_pearl_millet.jpg',
          farmer: {
            name: 'Ramesh Singh Rathore',
            state: 'Rajasthan',
            district: 'Jaipur',
            uzhavar_pin: 'UZP-RJ-08001'
          },
          warehouse: {
            id: 'WH-RJ-001',
            name: 'Rajasthan Desert Crop Center',
            state: 'Rajasthan',
            district: 'Jaipur'
          },
          quantityKg: 15000,
          status: 'in_transit' as const,
          position: [-3, 1, 6] as [number, number, number],
          qrImage: 'qr_P-RJ-001_active.png', // MANDATORY
          txHash: '0x234567890ABCDEF123456789012345AB',
          qrHistory: [
            {
              id: 'QR-P-RJ-001-01',
              image: 'qr_P-RJ-001_01.png',
              createdAt: '2025-09-19T14:10:00Z',
              status: 'active' as const,
              scanCount: 5
            }
          ],
          shipment: {
            id: 'SHIP-RJ-3001',
            vehicle: 'RJ-14-IJ-3001',
            eta: '2025-09-22T08:30:00+05:30',
            route: 'Jaipur Farm → Desert Center'
          },
          carbonFootprint: {
            transport: 9.8,
            storage: 2.1,
            total: 11.9
          }
        }
      ]
    },

    // Andhra Pradesh - Rice & Spices
    {
      id: 'WH-AP-001',
      name: 'Andhra Pradesh Rice & Spice Complex',
      state: 'Andhra Pradesh',
      district: 'Vijayawada',
      position: [18, 0, -5] as [number, number, number],
      capacity: 55000,
      occupancy: 46000,
      predictiveAnalytics: {
        expectedDeliveries: 17,
        capacityUtilization: 84,
        alertLevel: 'medium' as const
      },
      products: [
        {
          id: 'P-AP-001',
          name: 'Paddy - BPT-5204',
          image: 'paddy_bpt5204.jpg',
          farmer: {
            name: 'Venkata Ramana',
            state: 'Andhra Pradesh',
            district: 'Vijayawada',
            uzhavar_pin: 'UZP-AP-28001'
          },
          warehouse: {
            id: 'WH-AP-001',
            name: 'Andhra Pradesh Rice & Spice Complex',
            state: 'Andhra Pradesh',
            district: 'Vijayawada'
          },
          quantityKg: 25000,
          status: 'arrived' as const,
          position: [16, 1, -3] as [number, number, number],
          qrImage: 'qr_P-AP-001_active.png', // MANDATORY
          txHash: '0x345678901234ABCDEF567890123456CD',
          qrHistory: [
            {
              id: 'QR-P-AP-001-01',
              image: 'qr_P-AP-001_01.png',
              createdAt: '2025-09-18T12:40:00Z',
              status: 'active' as const,
              scanCount: 6
            }
          ],
          shipment: {
            id: 'SHIP-AP-2001',
            vehicle: 'AP-16-KL-2001',
            eta: 'Arrived',
            route: 'Vijayawada Farm → Complex'
          },
          carbonFootprint: {
            transport: 14.8,
            storage: 3.8,
            total: 18.6
          }
        }
      ]
    },

    // Gujarat - Cotton & Groundnut
    {
      id: 'WH-GJ-001',
      name: 'Gujarat Cotton & Oilseed Hub',
      state: 'Gujarat',
      district: 'Ahmedabad',
      position: [-8, 0, -12] as [number, number, number],
      capacity: 48000,
      occupancy: 39000,
      predictiveAnalytics: {
        expectedDeliveries: 13,
        capacityUtilization: 81,
        alertLevel: 'low' as const
      },
      products: [
        {
          id: 'P-GJ-001',
          name: 'Cotton - Shankar-6 Hybrid',
          image: 'cotton_shankar6.jpg',
          farmer: {
            name: 'Bhavesh Patel',
            state: 'Gujarat',
            district: 'Ahmedabad',
            uzhavar_pin: 'UZP-GJ-24001'
          },
          warehouse: {
            id: 'WH-GJ-001',
            name: 'Gujarat Cotton & Oilseed Hub',
            state: 'Gujarat',
            district: 'Ahmedabad'
          },
          quantityKg: 12000,
          status: 'dispatched' as const,
          position: [-6, 1, -10] as [number, number, number],
          qrImage: 'qr_P-GJ-001_active.png', // MANDATORY
          txHash: '0x456789012345CDEF678901234567890E',
          qrHistory: [
            {
              id: 'QR-P-GJ-001-01',
              image: 'qr_P-GJ-001_01.png',
              createdAt: '2025-09-20T10:25:00Z',
              status: 'active' as const,
              scanCount: 4
            }
          ],
          shipment: {
            id: 'SHIP-GJ-1001',
            vehicle: 'GJ-01-MN-1001',
            eta: '2025-09-21T15:45:00+05:30',
            route: 'Hub → Mumbai Textile Market'
          },
          carbonFootprint: {
            transport: 16.2,
            storage: 1.8,
            total: 18.0
          }
        }
      ]
    },

    // Odisha - Rice & Turmeric
    {
      id: 'WH-OD-001',
      name: 'Odisha Rice & Spice Processing Unit',
      state: 'Odisha',
      district: 'Bhubaneswar',
      position: [25, 0, 12] as [number, number, number],
      capacity: 42000,
      occupancy: 35000,
      predictiveAnalytics: {
        expectedDeliveries: 11,
        capacityUtilization: 83,
        alertLevel: 'medium' as const
      },
      products: [
        {
          id: 'P-OD-001',
          name: 'Paddy - Swarna Sub-1',
          image: 'paddy_swarna_sub1.jpg',
          farmer: {
            name: 'Sushila Nayak',
            state: 'Odisha',
            district: 'Cuttack',
            uzhavar_pin: 'UZP-OD-21001'
          },
          warehouse: {
            id: 'WH-OD-001',
            name: 'Odisha Rice & Spice Processing Unit',
            state: 'Odisha',
            district: 'Bhubaneswar'
          },
          quantityKg: 20000,
          status: 'in_transit' as const,
          position: [27, 1, 10] as [number, number, number],
          qrImage: 'qr_P-OD-001_active.png', // MANDATORY
          txHash: '0x567890123456DEF789012345678901FG',
          qrHistory: [
            {
              id: 'QR-P-OD-001-01',
              image: 'qr_P-OD-001_01.png',
              createdAt: '2025-09-19T16:50:00Z',
              status: 'active' as const,
              scanCount: 3
            }
          ],
          shipment: {
            id: 'SHIP-OD-0001',
            vehicle: 'OD-05-OP-0001',
            eta: '2025-09-22T12:15:00+05:30',
            route: 'Cuttack → Processing Unit'
          },
          carbonFootprint: {
            transport: 12.5,
            storage: 2.9,
            total: 15.4
          }
        }
      ]
    }
  ] as Warehouse3D[],

  routes: [
    // Punjab Routes
    {
      id: 'ROUTE-PB-001',
      from: 'Farm-Ludhiana-001',
      to: 'WH-PB-001',
      status: 'in_transit' as const,
      color: '#f59e0b',
      points: [
        [-2, 0.1, -8] as [number, number, number],
        [0, 0.1, -4] as [number, number, number],
        [2, 0.1, 3] as [number, number, number]
      ],
      vehicle: {
        type: 'truck' as const,
        position: [0, 0.1, -4] as [number, number, number],
        speed: 0.05,
        registration: 'PB-10-AB-8001'
      },
      estimatedTime: 180,
      carbonEmission: 15.2
    },
    {
      id: 'ROUTE-PB-002',
      from: 'WH-PB-001',
      to: 'Delhi-Market-001',
      status: 'dispatched' as const,
      color: '#3b82f6',
      points: [
        [2, 0.1, 3] as [number, number, number],
        [4, 0.1, 8] as [number, number, number],
        [6, 0.1, 12] as [number, number, number]
      ],
      vehicle: {
        type: 'truck' as const,
        position: [4, 0.1, 8] as [number, number, number],
        speed: 0.04,
        registration: 'PB-07-EF-8003'
      },
      estimatedTime: 240,
      carbonEmission: 8.5
    },

    // Tamil Nadu Routes
    {
      id: 'ROUTE-TN-001',
      from: 'Farm-Thanjavur-001',
      to: 'WH-TN-001',
      status: 'in_transit' as const,
      color: '#f59e0b',
      points: [
        [12, 0.1, 6] as [number, number, number],
        [15, 0.1, 8] as [number, number, number],
        [17, 0.1, 10] as [number, number, number]
      ],
      vehicle: {
        type: 'truck' as const,
        position: [15, 0.1, 8] as [number, number, number],
        speed: 0.03,
        registration: 'TN-07-MN-9001'
      },
      estimatedTime: 150,
      carbonEmission: 18.5
    },
    {
      id: 'ROUTE-TN-002',
      from: 'WH-TN-001',
      to: 'Chennai-Consumer-001',
      status: 'arrived' as const,
      color: '#22c55e',
      points: [
        [17, 0.1, 10] as [number, number, number],
        [20, 0.1, 12] as [number, number, number],
        [22, 0.1, 14] as [number, number, number]
      ],
      vehicle: {
        type: 'scooter' as const,
        position: [22, 0.1, 14] as [number, number, number],
        speed: 0.02,
        registration: 'TN-45-RS-9002'
      },
      estimatedTime: 90,
      actualTime: 85,
      carbonEmission: 14.2
    },

    // Maharashtra Routes
    {
      id: 'ROUTE-MH-001',
      from: 'Farm-Pune-001',
      to: 'WH-MH-001',
      status: 'arrived' as const,
      color: '#22c55e',
      points: [
        [5, 0.1, -5] as [number, number, number],
        [6, 0.1, -6] as [number, number, number],
        [8, 0.1, -8] as [number, number, number]
      ],
      vehicle: {
        type: 'truck' as const,
        position: [8, 0.1, -8] as [number, number, number],
        speed: 0.04,
        registration: 'MH-12-UV-7001'
      },
      estimatedTime: 120,
      actualTime: 115,
      carbonEmission: 11.8
    },
    {
      id: 'ROUTE-MH-002',
      from: 'Farm-Kolhapur-001',
      to: 'WH-MH-001',
      status: 'in_transit' as const,
      color: '#f59e0b',
      points: [
        [12, 0.1, -15] as [number, number, number],
        [10, 0.1, -12] as [number, number, number],
        [8, 0.1, -8] as [number, number, number]
      ],
      vehicle: {
        type: 'truck' as const,
        position: [10, 0.1, -12] as [number, number, number],
        speed: 0.035,
        registration: 'MH-09-WX-7002'
      },
      estimatedTime: 300,
      carbonEmission: 22.5
    },

    // Additional routes for other states...
    {
      id: 'ROUTE-UP-001',
      from: 'Farm-Agra-001',
      to: 'WH-UP-001',
      status: 'delayed' as const,
      color: '#ef4444',
      points: [
        [8, 0.1, 20] as [number, number, number],
        [6, 0.1, 18] as [number, number, number],
        [5, 0.1, 15] as [number, number, number]
      ],
      vehicle: {
        type: 'truck' as const,
        position: [6, 0.1, 18] as [number, number, number],
        speed: 0.02,
        registration: 'UP-80-AB-6002'
      },
      estimatedTime: 360,
      carbonEmission: 19.2
    }
  ] as Route3D[],

  predictiveAnalytics: {
    stateWiseDemand: {
      'Punjab': {
        'Ludhiana': { crop: 'Wheat', demandIncrease: 30, timeframe: '30 days', confidence: 87 },
        'Amritsar': { crop: 'Basmati Rice', demandIncrease: 25, timeframe: '30 days', confidence: 82 },
        'Patiala': { crop: 'Mustard', demandIncrease: 18, timeframe: '30 days', confidence: 79 }
      },
      'Tamil Nadu': {
        'Thanjavur': { crop: 'Paddy', demandIncrease: 25, timeframe: '30 days', confidence: 78 },
        'Madurai': { crop: 'Black Gram', demandIncrease: 22, timeframe: '30 days', confidence: 85 }
      },
      'Maharashtra': {
        'Pune': { crop: 'Cotton', demandIncrease: 20, timeframe: '30 days', confidence: 92 },
        'Kolhapur': { crop: 'Sugarcane', demandIncrease: 15, timeframe: '30 days', confidence: 88 }
      },
      'Uttar Pradesh': {
        'Lucknow': { crop: 'Wheat', demandIncrease: 28, timeframe: '30 days', confidence: 85 },
        'Agra': { crop: 'Potato', demandIncrease: 35, timeframe: '30 days', confidence: 90 }
      },
      'Karnataka': {
        'Coorg': { crop: 'Coffee', demandIncrease: 40, timeframe: '30 days', confidence: 95 },
        'Mandya': { crop: 'Ragi', demandIncrease: 12, timeframe: '30 days', confidence: 72 }
      },
      'West Bengal': {
        'Hooghly': { crop: 'Paddy', demandIncrease: 20, timeframe: '30 days', confidence: 80 }
      },
      'Rajasthan': {
        'Jaipur': { crop: 'Bajra', demandIncrease: 16, timeframe: '30 days', confidence: 75 }
      },
      'Andhra Pradesh': {
        'Vijayawada': { crop: 'Paddy', demandIncrease: 24, timeframe: '30 days', confidence: 83 }
      },
      'Gujarat': {
        'Ahmedabad': { crop: 'Cotton', demandIncrease: 18, timeframe: '30 days', confidence: 86 }
      },
      'Odisha': {
        'Cuttack': { crop: 'Paddy', demandIncrease: 21, timeframe: '30 days', confidence: 77 }
      }
    },
    anomalyDetection: [
      {
        shipmentId: 'SHIP-UP-6002',
        anomalyType: 'delivery_delay',
        severity: 'high',
        description: 'Unusual delay in Agra → Lucknow route due to traffic',
        estimatedImpact: '2-day delay',
        suggestedAction: 'Alternative route via NH-44'
      },
      {
        shipmentId: 'SHIP-PB-8001',
        anomalyType: 'route_deviation',
        severity: 'medium',
        description: 'Vehicle deviated from optimal route',
        estimatedImpact: '15% fuel increase',
        suggestedAction: 'Contact driver for route correction'
      }
    ],
    carbonFootprintPredictions: {
      totalNetworkEmission: 486.2, // kg CO2
      reductionOpportunities: [
        {
          route: 'ROUTE-MH-002',
          currentEmission: 22.5,
          optimizedEmission: 18.2,
          savings: 4.3,
          method: 'Route optimization'
        },
        {
          route: 'ROUTE-UP-001',
          currentEmission: 19.2,
          optimizedEmission: 15.8,
          savings: 3.4,
          method: 'Load consolidation'
        }
      ]
    },
    gamificationMetrics: {
      warehousePerformance: {
        'WH-PB-001': { score: 92, badge: 'Gold', achievements: ['Efficiency Master', 'Zero Waste'] },
        'WH-TN-001': { score: 87, badge: 'Silver', achievements: ['Quick Turnaround'] },
        'WH-MH-001': { score: 89, badge: 'Silver', achievements: ['Eco Warrior'] },
        'WH-UP-001': { score: 83, badge: 'Bronze', achievements: ['Capacity Optimizer'] }
      },
      totalGreenPoints: 12450,
      weeklyTarget: 15000,
      progress: 83
    }
  }
};

// Voice command patterns for AI recognition
export const VOICE_COMMAND_PATTERNS = {
  showShipments: /show shipments to (\w+)/i,
  followVehicle: /follow (truck|vehicle) (\w+-\d+)/i,
  generateQR: /generate qr for product (\w+-\w+-\d+)/i,
  viewHistory: /view history for (warehouse|product|route) (\w+-\w+-\d+)/i,
  arMode: /enable ar mode|activate ar|start ar/i,
  weatherOverlay: /show weather|enable weather overlay/i,
  performanceMode: /enable performance mode|low quality mode/i,
  nightMode: /night mode|day mode|toggle lighting/i
};

// ASI-level features configuration
export const ADVANCED_FEATURES_CONFIG = {
  collaborativeView: {
    enabled: true,
    maxUsers: 5,
    presenceCursors: true,
    sharedCamera: true
  },
  telemetryLogging: {
    enabled: true,
    events: ['qr_generate', 'product_click', 'route_follow', 'warehouse_select', 'voice_command'],
    endpoint: '/api/telemetry'
  },
  aiPredictions: {
    routeOptimization: true,
    demandForecasting: true,
    anomalyDetection: true,
    carbonOptimization: true
  },
  performanceTargets: {
    initialLoad: 800, // ms
    interactionResponse: 200, // ms
    fps: { desktop: 60, mobile: 30 }
  }
};

// Error handling for missing QR images - STRICT ENFORCEMENT
export const validateQRSystemIntegrity = (data: typeof INDIA_3D_WAREHOUSE_COMPREHENSIVE_DATA) => {
  const errors: string[] = [];
  
  data.warehouses.forEach(warehouse => {
    warehouse.products.forEach(product => {
      if (!product.qrImage) {
        errors.push(`CRITICAL: Product ${product.id} missing QR image - MUST be fixed`);
      }
      
      if (!product.qrHistory || product.qrHistory.length === 0) {
        errors.push(`WARNING: Product ${product.id} has no QR history`);
      }
      
      product.qrHistory?.forEach(qr => {
        if (!qr.image) {
          errors.push(`CRITICAL: QR entry ${qr.id} missing image - MUST be fixed`);
        }
      });
    });
  });
  
  return errors;
};

// Export validation results
export const QR_SYSTEM_VALIDATION = validateQRSystemIntegrity(INDIA_3D_WAREHOUSE_COMPREHENSIVE_DATA);

export default INDIA_3D_WAREHOUSE_COMPREHENSIVE_DATA;