// Enhanced Product Movement History Data for GreenLedger System
// Comprehensive tracking from Farmer → Warehouse → Uzhavan Santhai Shop

export interface UzhavanSanthaiShop {
  shop_id: string;
  name: string;
  location: {
    state: string;
    district: string;
    taluk: string;
    address: string;
    coordinates: { lat: number; lng: number };
  };
  contact: {
    phone: string;
    manager: string;
  };
  specialties: string[];
  established: string;
  rating: number;
}

export interface ProductMovementEntry {
  movement_id: string;
  product: {
    name: string;
    category: string;
    variety: string;
    image: string;
    quantity: number;
    unit: string;
    batch_id: string;
    qr_code: string;
    blockchain_tx: string;
  };
  farmer: {
    name: string;
    uzhavar_pin: string;
    district: string;
    taluk: string;
    contact: string;
    verified: boolean;
  };
  warehouse: {
    id: string;
    name: string;
    location: {
      state: string;
      district: string;
      taluk: string;
    };
  };
  uzhavan_santhai_shop: UzhavanSanthaiShop;
  timeline: {
    harvested: string;
    quality_checked: string;
    dispatched_to_warehouse: string;
    arrived_at_warehouse: string;
    processed_at_warehouse: string;
    dispatched_to_shop: string;
    arrived_at_shop: string;
    available_for_sale: string;
  };
  status: 'harvested' | 'in_transit_to_warehouse' | 'in_warehouse' | 'in_transit_to_shop' | 'available_at_shop' | 'sold';
  current_location: {
    lat: number;
    lng: number;
    place_name: string;
    updated_at: string;
  };
  pricing: {
    farmer_price: number;
    warehouse_margin: number;
    final_price: number;
    community_votes: number;
  };
  certifications: string[];
  sustainability_score: number;
  carbon_footprint: number;
  created_at: string;
  updated_at: string;
}

// Uzhavan Santhai Shops across Indian states
export const uzhavanSanthaiShops: UzhavanSanthaiShop[] = [
  {
    shop_id: "UZS-OD-001",
    name: "Bhubaneswar Green Market",
    location: {
      state: "Odisha",
      district: "Khordha",
      taluk: "Bhubaneswar",
      address: "Unit-3, Market Building, Bhubaneswar",
      coordinates: { lat: 20.2961, lng: 85.8245 }
    },
    contact: {
      phone: "+91-6742-001001",
      manager: "Pradeep Kumar Sahoo"
    },
    specialties: ["Vegetables", "Fruits", "Organic Products"],
    established: "2023-01-15",
    rating: 4.8
  },
  {
    shop_id: "UZS-OD-002",
    name: "Cuttack Farmers Hub",
    location: {
      state: "Odisha",
      district: "Cuttack",
      taluk: "Cuttack Sadar",
      address: "Badambadi, Near Bus Stand, Cuttack",
      coordinates: { lat: 20.4625, lng: 85.8830 }
    },
    contact: {
      phone: "+91-6712-002002",
      manager: "Sudha Rani Mohanty"
    },
    specialties: ["Paddy", "Jute", "Traditional Grains"],
    established: "2023-03-20",
    rating: 4.7
  },
  {
    shop_id: "UZS-OD-003",
    name: "Balasore Coastal Organics",
    location: {
      state: "Odisha",
      district: "Balasore",
      taluk: "Balasore",
      address: "Station Road, Balasore",
      coordinates: { lat: 21.4942, lng: 87.0200 }
    },
    contact: {
      phone: "+91-6782-003003",
      manager: "Raj Kumar Das"
    },
    specialties: ["Coconut", "Cashew", "Coastal Produce"],
    established: "2023-05-10",
    rating: 4.6
  },
  {
    shop_id: "UZS-TN-001",
    name: "Chennai Organic Plaza",
    location: {
      state: "Tamil Nadu",
      district: "Chennai",
      taluk: "T.Nagar",
      address: "Pondy Bazaar, T.Nagar, Chennai",
      coordinates: { lat: 13.0827, lng: 80.2707 }
    },
    contact: {
      phone: "+91-4428-001001",
      manager: "Lakshmi Narayan"
    },
    specialties: ["Rice", "Spices", "Traditional Varieties"],
    established: "2022-11-25",
    rating: 4.9
  },
  {
    shop_id: "UZS-TN-002",
    name: "Madurai Farmers Direct",
    location: {
      state: "Tamil Nadu",
      district: "Madurai",
      taluk: "Madurai",
      address: "Meenakshi Amman Temple Street, Madurai",
      coordinates: { lat: 9.9252, lng: 78.1198 }
    },
    contact: {
      phone: "+91-4522-002002",
      manager: "Selvam Rajan"
    },
    specialties: ["Turmeric", "Rice", "Traditional Spices"],
    established: "2023-02-14",
    rating: 4.8
  },
  {
    shop_id: "UZS-KA-001",
    name: "Bangalore Premium Organics",
    location: {
      state: "Karnataka",
      district: "Bangalore Urban",
      taluk: "Bangalore North",
      address: "Commercial Street, Bangalore",
      coordinates: { lat: 12.9716, lng: 77.5946 }
    },
    contact: {
      phone: "+91-8026-001001",
      manager: "Venkatesh Rao"
    },
    specialties: ["Organic Vegetables", "Coffee", "Premium Grains"],
    established: "2022-09-30",
    rating: 4.9
  },
  {
    shop_id: "UZS-AP-001",
    name: "Hyderabad Agri Connect",
    location: {
      state: "Andhra Pradesh",
      district: "Hyderabad",
      taluk: "Secunderabad",
      address: "Paradise Circle, Secunderabad",
      coordinates: { lat: 17.3850, lng: 78.4867 }
    },
    contact: {
      phone: "+91-4027-001001",
      manager: "Ramesh Chandra"
    },
    specialties: ["Rice", "Millets", "Organic Produce"],
    established: "2023-04-18",
    rating: 4.7
  },
  {
    shop_id: "UZS-KE-001",
    name: "Kochi Spice Gateway",
    location: {
      state: "Kerala",
      district: "Ernakulam",
      taluk: "Kochi",
      address: "MG Road, Ernakulam, Kochi",
      coordinates: { lat: 9.9312, lng: 76.2673 }
    },
    contact: {
      phone: "+91-4842-001001",
      manager: "Gopinath Nair"
    },
    specialties: ["Spices", "Coconut Products", "Traditional Items"],
    established: "2023-01-08",
    rating: 4.8
  }
];

// Comprehensive Product Movement History Data
export const productMovementHistory: ProductMovementEntry[] = [
  {
    movement_id: "MOV-001",
    product: {
      name: "Organic Swarna Paddy",
      category: "Grains",
      variety: "Swarna",
      image: "https://images.unsplash.com/photo-1730771678553-b699eeb6f6ee?w=300&h=200&fit=crop",
      quantity: 500,
      unit: "kg",
      batch_id: "BATCH-SWR-001-2025",
      qr_code: "QR-SWR-001-2025",
      blockchain_tx: "0x1a2b3c4d5e6f7890"
    },
    farmer: {
      name: "Rajesh Panda",
      uzhavar_pin: "UZP-ANG-001",
      district: "Angul",
      taluk: "Angul",
      contact: "+91-9437-001001",
      verified: true
    },
    warehouse: {
      id: "WH-OD-ANG-001",
      name: "Angul Agricultural Hub",
      location: {
        state: "Odisha",
        district: "Angul",
        taluk: "Angul"
      }
    },
    uzhavan_santhai_shop: uzhavanSanthaiShops[0], // Bhubaneswar Green Market
    timeline: {
      harvested: "2025-09-12T06:00:00+05:30",
      quality_checked: "2025-09-12T08:30:00+05:30",
      dispatched_to_warehouse: "2025-09-12T10:00:00+05:30",
      arrived_at_warehouse: "2025-09-12T14:30:00+05:30",
      processed_at_warehouse: "2025-09-13T09:00:00+05:30",
      dispatched_to_shop: "2025-09-13T15:00:00+05:30",
      arrived_at_shop: "2025-09-14T11:00:00+05:30",
      available_for_sale: "2025-09-14T12:00:00+05:30"
    },
    status: "available_at_shop",
    current_location: {
      lat: 20.2961,
      lng: 85.8245,
      place_name: "Bhubaneswar Green Market",
      updated_at: "2025-09-14T12:00:00+05:30"
    },
    pricing: {
      farmer_price: 32.0,
      warehouse_margin: 2.5,
      final_price: 34.5,
      community_votes: 456
    },
    certifications: ["Organic", "Fair Trade"],
    sustainability_score: 9.2,
    carbon_footprint: 2.8,
    created_at: "2025-09-12T06:00:00+05:30",
    updated_at: "2025-09-14T12:00:00+05:30"
  },
  {
    movement_id: "MOV-002",
    product: {
      name: "Premium Turmeric",
      category: "Spices",
      variety: "Local Variety",
      image: "https://images.unsplash.com/photo-1634114627043-9a2abf455494?w=300&h=200&fit=crop",
      quantity: 200,
      unit: "kg",
      batch_id: "BATCH-TUR-002-2025",
      qr_code: "QR-TUR-002-2025",
      blockchain_tx: "0x2b3c4d5e6f789012"
    },
    farmer: {
      name: "Santosh Kumar Nag",
      uzhavar_pin: "UZP-BAL-002",
      district: "Balangir",
      taluk: "Balangir",
      contact: "+91-9437-002002",
      verified: true
    },
    warehouse: {
      id: "WH-OD-BAL-001",
      name: "Balangir Processing Center",
      location: {
        state: "Odisha",
        district: "Balangir",
        taluk: "Balangir"
      }
    },
    uzhavan_santhai_shop: uzhavanSanthaiShops[3], // Chennai Organic Plaza
    timeline: {
      harvested: "2025-09-10T05:30:00+05:30",
      quality_checked: "2025-09-10T07:45:00+05:30",
      dispatched_to_warehouse: "2025-09-10T09:30:00+05:30",
      arrived_at_warehouse: "2025-09-10T13:15:00+05:30",
      processed_at_warehouse: "2025-09-11T10:00:00+05:30",
      dispatched_to_shop: "2025-09-11T16:30:00+05:30",
      arrived_at_shop: "2025-09-13T09:45:00+05:30",
      available_for_sale: "2025-09-13T11:00:00+05:30"
    },
    status: "available_at_shop",
    current_location: {
      lat: 13.0827,
      lng: 80.2707,
      place_name: "Chennai Organic Plaza",
      updated_at: "2025-09-13T11:00:00+05:30"
    },
    pricing: {
      farmer_price: 165.0,
      warehouse_margin: 7.0,
      final_price: 172.0,
      community_votes: 234
    },
    certifications: ["Organic", "GI Tag"],
    sustainability_score: 8.9,
    carbon_footprint: 1.5,
    created_at: "2025-09-10T05:30:00+05:30",
    updated_at: "2025-09-13T11:00:00+05:30"
  },
  {
    movement_id: "MOV-003",
    product: {
      name: "Fresh Coconut",
      category: "Fruits",
      variety: "East Coast Tall",
      image: "https://images.unsplash.com/photo-1706059924843-e6225a3db8b8?w=300&h=200&fit=crop",
      quantity: 300,
      unit: "pieces",
      batch_id: "BATCH-COC-003-2025",
      qr_code: "QR-COC-003-2025",
      blockchain_tx: "0x3c4d5e6f78901234"
    },
    farmer: {
      name: "Deepak Biswal",
      uzhavar_pin: "UZP-BLS-003",
      district: "Balasore",
      taluk: "Balasore",
      contact: "+91-9437-003003",
      verified: true
    },
    warehouse: {
      id: "WH-OD-BLS-001",
      name: "Balasore Coastal Storage",
      location: {
        state: "Odisha",
        district: "Balasore",
        taluk: "Balasore"
      }
    },
    uzhavan_santhai_shop: uzhavanSanthaiShops[2], // Balasore Coastal Organics
    timeline: {
      harvested: "2025-09-15T06:15:00+05:30",
      quality_checked: "2025-09-15T08:00:00+05:30",
      dispatched_to_warehouse: "2025-09-15T09:45:00+05:30",
      arrived_at_warehouse: "2025-09-15T12:30:00+05:30",
      processed_at_warehouse: "2025-09-15T15:00:00+05:30",
      dispatched_to_shop: "2025-09-15T17:00:00+05:30",
      arrived_at_shop: "2025-09-15T18:30:00+05:30",
      available_for_sale: "2025-09-15T19:00:00+05:30"
    },
    status: "available_at_shop",
    current_location: {
      lat: 21.4942,
      lng: 87.0200,
      place_name: "Balasore Coastal Organics",
      updated_at: "2025-09-15T19:00:00+05:30"
    },
    pricing: {
      farmer_price: 58.0,
      warehouse_margin: 4.5,
      final_price: 62.5,
      community_votes: 189
    },
    certifications: ["Organic"],
    sustainability_score: 9.5,
    carbon_footprint: 0.8,
    created_at: "2025-09-15T06:15:00+05:30",
    updated_at: "2025-09-15T19:00:00+05:30"
  },
  {
    movement_id: "MOV-004",
    product: {
      name: "Cashew Kernels",
      category: "Nuts",
      variety: "Bhaskara",
      image: "https://images.unsplash.com/photo-1649103990014-73d045082df1?w=300&h=200&fit=crop",
      quantity: 100,
      unit: "kg",
      batch_id: "BATCH-CSH-004-2025",
      qr_code: "QR-CSH-004-2025",
      blockchain_tx: "0x4d5e6f7890123456"
    },
    farmer: {
      name: "Laxmi Narayan Patel",
      uzhavar_pin: "UZP-BRG-004",
      district: "Bargarh",
      taluk: "Bargarh",
      contact: "+91-9437-004004",
      verified: true
    },
    warehouse: {
      id: "WH-OD-BRG-001",
      name: "Bargarh Processing Hub",
      location: {
        state: "Odisha",
        district: "Bargarh",
        taluk: "Bargarh"
      }
    },
    uzhavan_santhai_shop: uzhavanSanthaiShops[5], // Bangalore Premium Organics
    timeline: {
      harvested: "2025-09-08T05:45:00+05:30",
      quality_checked: "2025-09-08T07:30:00+05:30",
      dispatched_to_warehouse: "2025-09-08T09:00:00+05:30",
      arrived_at_warehouse: "2025-09-08T15:30:00+05:30",
      processed_at_warehouse: "2025-09-09T11:00:00+05:30",
      dispatched_to_shop: "2025-09-10T08:00:00+05:30",
      arrived_at_shop: "2025-09-12T14:20:00+05:30",
      available_for_sale: "2025-09-12T15:30:00+05:30"
    },
    status: "available_at_shop",
    current_location: {
      lat: 12.9716,
      lng: 77.5946,
      place_name: "Bangalore Premium Organics",
      updated_at: "2025-09-12T15:30:00+05:30"
    },
    pricing: {
      farmer_price: 485.0,
      warehouse_margin: 27.0,
      final_price: 512.0,
      community_votes: 341
    },
    certifications: ["GI Tag", "Export Quality"],
    sustainability_score: 8.7,
    carbon_footprint: 1.2,
    created_at: "2025-09-08T05:45:00+05:30",
    updated_at: "2025-09-12T15:30:00+05:30"
  },
  {
    movement_id: "MOV-005",
    product: {
      name: "Organic Vegetables Mix",
      category: "Vegetables",
      variety: "Seasonal Mix",
      image: "https://images.unsplash.com/photo-1700150618387-3f46b6d2cf8e?w=300&h=200&fit=crop",
      quantity: 150,
      unit: "kg",
      batch_id: "BATCH-VEG-005-2025",
      qr_code: "QR-VEG-005-2025",
      blockchain_tx: "0x5e6f789012345678"
    },
    farmer: {
      name: "Sunita Mohanty",
      uzhavar_pin: "UZP-KHO-006",
      district: "Khordha",
      taluk: "Bhubaneswar",
      contact: "+91-9437-006006",
      verified: true
    },
    warehouse: {
      id: "WH-OD-KHO-001",
      name: "Khordha Fresh Storage",
      location: {
        state: "Odisha",
        district: "Khordha",
        taluk: "Bhubaneswar"
      }
    },
    uzhavan_santhai_shop: uzhavanSanthaiShops[0], // Bhubaneswar Green Market
    timeline: {
      harvested: "2025-09-18T05:00:00+05:30",
      quality_checked: "2025-09-18T06:30:00+05:30",
      dispatched_to_warehouse: "2025-09-18T08:00:00+05:30",
      arrived_at_warehouse: "2025-09-18T10:30:00+05:30",
      processed_at_warehouse: "2025-09-18T12:00:00+05:30",
      dispatched_to_shop: "2025-09-18T14:00:00+05:30",
      arrived_at_shop: "2025-09-18T15:30:00+05:30",
      available_for_sale: "2025-09-18T16:00:00+05:30"
    },
    status: "available_at_shop",
    current_location: {
      lat: 20.2961,
      lng: 85.8245,
      place_name: "Bhubaneswar Green Market",
      updated_at: "2025-09-18T16:00:00+05:30"
    },
    pricing: {
      farmer_price: 42.0,
      warehouse_margin: 6.5,
      final_price: 48.5,
      community_votes: 298
    },
    certifications: ["Organic", "Women Farmer"],
    sustainability_score: 9.3,
    carbon_footprint: 0.5,
    created_at: "2025-09-18T05:00:00+05:30",
    updated_at: "2025-09-18T16:00:00+05:30"
  },
  {
    movement_id: "MOV-006",
    product: {
      name: "Ginger Premium",
      category: "Spices",
      variety: "Local Variety",
      image: "https://images.unsplash.com/photo-1634612828694-8988aa4254df?w=300&h=200&fit=crop",
      quantity: 80,
      unit: "kg",
      batch_id: "BATCH-GNG-006-2025",
      qr_code: "QR-GNG-006-2025",
      blockchain_tx: "0x6f78901234567890"
    },
    farmer: {
      name: "Manoj Pradhan",
      uzhavar_pin: "UZP-KAN-007",
      district: "Kandhamal",
      taluk: "Phulbani",
      contact: "+91-9437-007007",
      verified: true
    },
    warehouse: {
      id: "WH-OD-KAN-001",
      name: "Kandhamal Spice Center",
      location: {
        state: "Odisha",
        district: "Kandhamal",
        taluk: "Phulbani"
      }
    },
    uzhavan_santhai_shop: uzhavanSanthaiShops[7], // Kochi Spice Gateway
    timeline: {
      harvested: "2025-09-11T06:30:00+05:30",
      quality_checked: "2025-09-11T08:15:00+05:30",
      dispatched_to_warehouse: "2025-09-11T10:00:00+05:30",
      arrived_at_warehouse: "2025-09-11T16:45:00+05:30",
      processed_at_warehouse: "2025-09-12T09:30:00+05:30",
      dispatched_to_shop: "2025-09-12T15:00:00+05:30",
      arrived_at_shop: "2025-09-14T12:30:00+05:30",
      available_for_sale: "2025-09-14T14:00:00+05:30"
    },
    status: "available_at_shop",
    current_location: {
      lat: 9.9312,
      lng: 76.2673,
      place_name: "Kochi Spice Gateway",
      updated_at: "2025-09-14T14:00:00+05:30"
    },
    pricing: {
      farmer_price: 145.0,
      warehouse_margin: 15.0,
      final_price: 160.0,
      community_votes: 167
    },
    certifications: ["Organic", "Spice Board"],
    sustainability_score: 8.8,
    carbon_footprint: 1.8,
    created_at: "2025-09-11T06:30:00+05:30",
    updated_at: "2025-09-14T14:00:00+05:30"
  },
  {
    movement_id: "MOV-007",
    product: {
      name: "Mango Alphonso",
      category: "Fruits",
      variety: "Alphonso",
      image: "https://images.unsplash.com/photo-1724120996945-88eb4637bfc8?w=300&h=200&fit=crop",
      quantity: 120,
      unit: "kg",
      batch_id: "BATCH-MNG-007-2025",
      qr_code: "QR-MNG-007-2025",
      blockchain_tx: "0x789012345678901a"
    },
    farmer: {
      name: "Bijay Kumar Sahoo",
      uzhavar_pin: "UZP-CUT-005",
      district: "Cuttack",
      taluk: "Cuttack Sadar",
      contact: "+91-9437-005005",
      verified: true
    },
    warehouse: {
      id: "WH-OD-CUT-001",
      name: "Cuttack Fresh Hub",
      location: {
        state: "Odisha",
        district: "Cuttack",
        taluk: "Cuttack Sadar"
      }
    },
    uzhavan_santhai_shop: uzhavanSanthaiShops[6], // Hyderabad Agri Connect
    timeline: {
      harvested: "2025-09-16T05:15:00+05:30",
      quality_checked: "2025-09-16T07:00:00+05:30",
      dispatched_to_warehouse: "2025-09-16T08:30:00+05:30",
      arrived_at_warehouse: "2025-09-16T11:15:00+05:30",
      processed_at_warehouse: "2025-09-16T13:30:00+05:30",
      dispatched_to_shop: "2025-09-16T16:00:00+05:30",
      arrived_at_shop: "2025-09-18T10:45:00+05:30",
      available_for_sale: "2025-09-18T12:00:00+05:30"
    },
    status: "available_at_shop",
    current_location: {
      lat: 17.3850,
      lng: 78.4867,
      place_name: "Hyderabad Agri Connect",
      updated_at: "2025-09-18T12:00:00+05:30"
    },
    pricing: {
      farmer_price: 385.0,
      warehouse_margin: 35.0,
      final_price: 420.0,
      community_votes: 412
    },
    certifications: ["Organic", "GI Tag"],
    sustainability_score: 9.0,
    carbon_footprint: 1.1,
    created_at: "2025-09-16T05:15:00+05:30",
    updated_at: "2025-09-18T12:00:00+05:30"
  },
  {
    movement_id: "MOV-008",
    product: {
      name: "Coffee Beans Arabica",
      category: "Beverages",
      variety: "Arabica",
      image: "https://images.unsplash.com/photo-1655966505468-586e2eb12ad1?w=300&h=200&fit=crop",
      quantity: 50,
      unit: "kg",
      batch_id: "BATCH-COF-008-2025",
      qr_code: "QR-COF-008-2025",
      blockchain_tx: "0x90123456789012bc"
    },
    farmer: {
      name: "Manoj Pradhan",
      uzhavar_pin: "UZP-KAN-007",
      district: "Kandhamal",
      taluk: "Phulbani",
      contact: "+91-9437-007007",
      verified: true
    },
    warehouse: {
      id: "WH-OD-KAN-002",
      name: "Kandhamal Coffee Processing Center",
      location: {
        state: "Odisha",
        district: "Kandhamal",
        taluk: "Phulbani"
      }
    },
    uzhavan_santhai_shop: uzhavanSanthaiShops[5], // Bangalore Premium Organics
    timeline: {
      harvested: "2025-09-09T06:00:00+05:30",
      quality_checked: "2025-09-09T08:30:00+05:30",
      dispatched_to_warehouse: "2025-09-09T10:15:00+05:30",
      arrived_at_warehouse: "2025-09-09T17:00:00+05:30",
      processed_at_warehouse: "2025-09-10T10:30:00+05:30",
      dispatched_to_shop: "2025-09-10T14:45:00+05:30",
      arrived_at_shop: "2025-09-12T09:15:00+05:30",
      available_for_sale: "2025-09-12T10:30:00+05:30"
    },
    status: "available_at_shop",
    current_location: {
      lat: 12.9716,
      lng: 77.5946,
      place_name: "Bangalore Premium Organics",
      updated_at: "2025-09-12T10:30:00+05:30"
    },
    pricing: {
      farmer_price: 620.0,
      warehouse_margin: 55.0,
      final_price: 675.0,
      community_votes: 278
    },
    certifications: ["Organic", "Fair Trade", "Rainforest Alliance"],
    sustainability_score: 9.4,
    carbon_footprint: 2.2,
    created_at: "2025-09-09T06:00:00+05:30",
    updated_at: "2025-09-12T10:30:00+05:30"
  },
  {
    movement_id: "MOV-009",
    product: {
      name: "Organic Jute Fiber",
      category: "Industrial Crops",
      variety: "Golden Jute",
      image: "https://images.unsplash.com/photo-1748169207012-6ed2f64aedf6?w=300&h=200&fit=crop",
      quantity: 75,
      unit: "kg",
      batch_id: "BATCH-JUT-009-2025",
      qr_code: "QR-JUT-009-2025",
      blockchain_tx: "0xa01234567890123d"
    },
    farmer: {
      name: "Bijay Kumar Sahoo",
      uzhavar_pin: "UZP-CUT-005",
      district: "Cuttack",
      taluk: "Cuttack Sadar",
      contact: "+91-9437-005005",
      verified: true
    },
    warehouse: {
      id: "WH-OD-CUT-002",
      name: "Cuttack Industrial Processing Hub",
      location: {
        state: "Odisha",
        district: "Cuttack",
        taluk: "Cuttack Sadar"
      }
    },
    uzhavan_santhai_shop: uzhavanSanthaiShops[1], // Cuttack Farmers Hub
    timeline: {
      harvested: "2025-09-14T05:30:00+05:30",
      quality_checked: "2025-09-14T07:15:00+05:30",
      dispatched_to_warehouse: "2025-09-14T09:00:00+05:30",
      arrived_at_warehouse: "2025-09-14T12:30:00+05:30",
      processed_at_warehouse: "2025-09-14T15:00:00+05:30",
      dispatched_to_shop: "2025-09-14T17:30:00+05:30",
      arrived_at_shop: "2025-09-14T19:00:00+05:30",
      available_for_sale: "2025-09-14T19:30:00+05:30"
    },
    status: "available_at_shop",
    current_location: {
      lat: 20.4625,
      lng: 85.8830,
      place_name: "Cuttack Farmers Hub",
      updated_at: "2025-09-14T19:30:00+05:30"
    },
    pricing: {
      farmer_price: 85.0,
      warehouse_margin: 10.0,
      final_price: 95.0,
      community_votes: 156
    },
    certifications: ["Organic", "Global GAP"],
    sustainability_score: 9.1,
    carbon_footprint: 1.3,
    created_at: "2025-09-14T05:30:00+05:30",
    updated_at: "2025-09-14T19:30:00+05:30"
  },
  {
    movement_id: "MOV-010",
    product: {
      name: "Fresh Mint Leaves",
      category: "Herbs",
      variety: "Spearmint",
      image: "https://images.unsplash.com/photo-1679061583335-c8be1c6209f6?w=300&h=200&fit=crop",
      quantity: 25,
      unit: "kg",
      batch_id: "BATCH-MNT-010-2025",
      qr_code: "QR-MNT-010-2025",
      blockchain_tx: "0xb0123456789012e"
    },
    farmer: {
      name: "Sunita Mohanty",
      uzhavar_pin: "UZP-KHO-006",
      district: "Khordha",
      taluk: "Bhubaneswar",
      contact: "+91-9437-006006",
      verified: true
    },
    warehouse: {
      id: "WH-OD-KHO-002",
      name: "Khordha Organic Herbs Center",
      location: {
        state: "Odisha",
        district: "Khordha",
        taluk: "Bhubaneswar"
      }
    },
    uzhavan_santhai_shop: uzhavanSanthaiShops[0], // Bhubaneswar Green Market
    timeline: {
      harvested: "2025-09-17T06:00:00+05:30",
      quality_checked: "2025-09-17T07:00:00+05:30",
      dispatched_to_warehouse: "2025-09-17T08:30:00+05:30",
      arrived_at_warehouse: "2025-09-17T10:00:00+05:30",
      processed_at_warehouse: "2025-09-17T11:30:00+05:30",
      dispatched_to_shop: "2025-09-18T08:00:00+05:30",
      arrived_at_shop: "2025-09-18T09:30:00+05:30",
      available_for_sale: "2025-09-18T10:00:00+05:30"
    },
    status: "sold",
    current_location: {
      lat: 20.2961,
      lng: 85.8245,
      place_name: "Bhubaneswar Green Market - SOLD",
      updated_at: "2025-09-19T14:30:00+05:30"
    },
    pricing: {
      farmer_price: 125.0,
      warehouse_margin: 15.0,
      final_price: 140.0,
      community_votes: 89
    },
    certifications: ["Organic", "Women Farmer", "Fresh Produce"],
    sustainability_score: 9.7,
    carbon_footprint: 0.3,
    created_at: "2025-09-17T06:00:00+05:30",
    updated_at: "2025-09-19T14:30:00+05:30"
  }
];

// Helper functions for filtering and querying data
export const getMovementsByFarmer = (uzhavarPin: string): ProductMovementEntry[] => {
  return productMovementHistory.filter(entry => entry.farmer.uzhavar_pin === uzhavarPin);
};

export const getMovementsByWarehouse = (warehouseId: string): ProductMovementEntry[] => {
  return productMovementHistory.filter(entry => entry.warehouse.id === warehouseId);
};

export const getMovementsByShop = (shopId: string): ProductMovementEntry[] => {
  return productMovementHistory.filter(entry => entry.uzhavan_santhai_shop.shop_id === shopId);
};

export const getMovementsByStatus = (status: ProductMovementEntry['status']): ProductMovementEntry[] => {
  return productMovementHistory.filter(entry => entry.status === status);
};

export const getMovementsByDistrict = (district: string): ProductMovementEntry[] => {
  return productMovementHistory.filter(entry => 
    entry.farmer.district === district || 
    entry.warehouse.location.district === district ||
    entry.uzhavan_santhai_shop.location.district === district
  );
};

export const getMovementsByState = (state: string): ProductMovementEntry[] => {
  return productMovementHistory.filter(entry => 
    entry.warehouse.location.state === state ||
    entry.uzhavan_santhai_shop.location.state === state
  );
};

export const getMovementsByDateRange = (startDate: string, endDate: string): ProductMovementEntry[] => {
  return productMovementHistory.filter(entry => 
    entry.created_at >= startDate && entry.created_at <= endDate
  );
};

export const getRecentMovements = (limit: number = 10): ProductMovementEntry[] => {
  return productMovementHistory
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, limit);
};

// Analytics data for product movements
export const getMovementAnalytics = () => {
  const totalMovements = productMovementHistory.length;
  const averageTransitTime = productMovementHistory.reduce((sum, entry) => {
    const harvested = new Date(entry.timeline.harvested).getTime();
    const available = new Date(entry.timeline.available_for_sale).getTime();
    return sum + (available - harvested) / (1000 * 60 * 60 * 24); // days
  }, 0) / totalMovements;

  const statusCounts = productMovementHistory.reduce((acc, entry) => {
    acc[entry.status] = (acc[entry.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const averageCarbonFootprint = productMovementHistory.reduce((sum, entry) => 
    sum + entry.carbon_footprint, 0) / totalMovements;

  const averageSustainabilityScore = productMovementHistory.reduce((sum, entry) => 
    sum + entry.sustainability_score, 0) / totalMovements;

  return {
    totalMovements,
    averageTransitTime: Math.round(averageTransitTime * 10) / 10,
    statusCounts,
    averageCarbonFootprint: Math.round(averageCarbonFootprint * 10) / 10,
    averageSustainabilityScore: Math.round(averageSustainabilityScore * 10) / 10
  };
};