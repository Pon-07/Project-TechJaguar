export interface TrackingCheckpoint {
  id: string;
  name: string;
  description: string;
  timestamp: string;
  location: {
    taluk: string;
    coordinates: { lat: number; lng: number };
  };
  status: 'completed' | 'active' | 'pending' | 'delayed';
  blockchain_hash?: string;
  estimated_duration?: number; // in hours
}

export interface TrackingRoute {
  tracking_id: string;
  product_name: string;
  quantity: string;
  farmer: {
    name: string;
    uzhavar_pin: string;
    taluk: string;
  };
  warehouse: {
    name: string;
    taluk: string;
    warehouse_id: string;
  };
  consumer?: {
    name: string;
    order_id: string;
    delivery_address: string;
  };
  vehicle: {
    number: string;
    type: 'truck' | 'tractor' | 'van';
    driver_name: string;
    driver_contact: string;
  };
  checkpoints: TrackingCheckpoint[];
  current_location: {
    lat: number;
    lng: number;
    place_name: string;
  };
  overall_status: 'harvested' | 'in_transit_to_warehouse' | 'in_warehouse' | 'out_for_delivery' | 'delivered' | 'delayed';
  estimated_delivery: string;
  created_at: string;
  updated_at: string;
}

export const trackingData: TrackingRoute[] = [
  {
    tracking_id: "TRK-PAD-001",
    product_name: "Organic Paddy Rice",
    quantity: "200 bags",
    farmer: {
      name: "Ramesh Kumar",
      uzhavar_pin: "UZP-MAD-2024-001",
      taluk: "Madurai"
    },
    warehouse: {
      name: "Madurai Agri Hub",
      taluk: "Madurai",
      warehouse_id: "WH-TLK-001"
    },
    vehicle: {
      number: "TN-58-2345",
      type: "truck",
      driver_name: "Selvam",
      driver_contact: "+91-9XX-XXX-X234"
    },
    checkpoints: [
      {
        id: "cp1",
        name: "Harvested",
        description: "Crop harvested and packed",
        timestamp: "2025-09-20T06:00:00+05:30",
        location: { taluk: "Madurai", coordinates: { lat: 9.9252, lng: 78.1198 } },
        status: "completed",
        blockchain_hash: "0x1a2b3c4d5e6f"
      },
      {
        id: "cp2",
        name: "Quality Check",
        description: "Quality verification complete",
        timestamp: "2025-09-20T08:30:00+05:30",
        location: { taluk: "Madurai", coordinates: { lat: 9.9252, lng: 78.1198 } },
        status: "completed",
        blockchain_hash: "0x2b3c4d5e6f7g"
      },
      {
        id: "cp3",
        name: "Loaded for Transport",
        description: "Loaded onto vehicle TN-58-2345",
        timestamp: "2025-09-20T10:00:00+05:30",
        location: { taluk: "Madurai", coordinates: { lat: 9.9252, lng: 78.1198 } },
        status: "completed",
        blockchain_hash: "0x3c4d5e6f7g8h"
      },
      {
        id: "cp4",
        name: "In Transit",
        description: "Near Melur Toll - On the way to warehouse",
        timestamp: "2025-09-20T14:00:00+05:30",
        location: { taluk: "Madurai", coordinates: { lat: 9.9800, lng: 78.1500 } },
        status: "active"
      },
      {
        id: "cp5",
        name: "Warehouse Arrival",
        description: "Arriving at Madurai Agri Hub",
        timestamp: "2025-09-20T17:00:00+05:30",
        location: { taluk: "Madurai", coordinates: { lat: 9.9500, lng: 78.1400 } },
        status: "pending",
        estimated_duration: 3
      }
    ],
    current_location: {
      lat: 9.9800,
      lng: 78.1500,
      place_name: "Near Melur Toll"
    },
    overall_status: "in_transit_to_warehouse",
    estimated_delivery: "2025-09-20T17:00:00+05:30",
    created_at: "2025-09-20T06:00:00+05:30",
    updated_at: "2025-09-20T14:30:00+05:30"
  },
  {
    tracking_id: "TRK-GND-002",
    product_name: "Premium Groundnut",
    quantity: "150 bags",
    farmer: {
      name: "Lakshmi Devi",
      uzhavar_pin: "UZP-TIR-2024-002",
      taluk: "Tirunelveli"
    },
    warehouse: {
      name: "Nellai Storage",
      taluk: "Tirunelveli",
      warehouse_id: "WH-TLK-002"
    },
    vehicle: {
      number: "TN-72-7841",
      type: "truck",
      driver_name: "Murugan",
      driver_contact: "+91-9XX-XXX-X567"
    },
    checkpoints: [
      {
        id: "cp1",
        name: "Harvested",
        description: "Groundnut harvested and dried",
        timestamp: "2025-09-19T07:00:00+05:30",
        location: { taluk: "Tirunelveli", coordinates: { lat: 8.7139, lng: 77.7567 } },
        status: "completed",
        blockchain_hash: "0x4d5e6f7g8h9i"
      },
      {
        id: "cp2",
        name: "Quality Check",
        description: "Premium grade verification",
        timestamp: "2025-09-19T09:00:00+05:30",
        location: { taluk: "Tirunelveli", coordinates: { lat: 8.7139, lng: 77.7567 } },
        status: "completed",
        blockchain_hash: "0x5e6f7g8h9i0j"
      },
      {
        id: "cp3",
        name: "Loaded for Transport",
        description: "Loaded onto vehicle TN-72-7841",
        timestamp: "2025-09-19T11:00:00+05:30",
        location: { taluk: "Tirunelveli", coordinates: { lat: 8.7139, lng: 77.7567 } },
        status: "completed",
        blockchain_hash: "0x6f7g8h9i0j1k"
      },
      {
        id: "cp4",
        name: "Kovilpatti Bypass",
        description: "Passing through Kovilpatti - On the way",
        timestamp: "2025-09-20T13:30:00+05:30",
        location: { taluk: "Kovilpatti", coordinates: { lat: 9.1700, lng: 77.8700 } },
        status: "active"
      },
      {
        id: "cp5",
        name: "Warehouse Arrival",
        description: "Arriving at Nellai Storage",
        timestamp: "2025-09-20T15:00:00+05:30",
        location: { taluk: "Tirunelveli", coordinates: { lat: 8.7300, lng: 77.7800 } },
        status: "pending",
        estimated_duration: 2
      }
    ],
    current_location: {
      lat: 9.1700,
      lng: 77.8700,
      place_name: "Kovilpatti Bypass"
    },
    overall_status: "in_transit_to_warehouse",
    estimated_delivery: "2025-09-20T15:00:00+05:30",
    created_at: "2025-09-19T07:00:00+05:30",
    updated_at: "2025-09-20T13:45:00+05:30"
  },
  {
    tracking_id: "TRK-TOM-003",
    product_name: "Organic Tomatoes",
    quantity: "5kg",
    farmer: {
      name: "Arul Mani",
      uzhavar_pin: "UZP-THA-2024-003",
      taluk: "Thanjavur"
    },
    warehouse: {
      name: "Cauvery Depot",
      taluk: "Thanjavur",
      warehouse_id: "WH-TLK-003"
    },
    consumer: {
      name: "Priya Sharma",
      order_id: "ORD-2025-0919-001",
      delivery_address: "12, Gandhi Street, T. Nagar, Chennai - 600017"
    },
    vehicle: {
      number: "TN-49-4567",
      type: "van",
      driver_name: "Ravi",
      driver_contact: "+91-9XX-XXX-X890"
    },
    checkpoints: [
      {
        id: "cp1",
        name: "Harvested",
        description: "Fresh organic tomatoes harvested",
        timestamp: "2025-09-18T05:30:00+05:30",
        location: { taluk: "Thanjavur", coordinates: { lat: 10.7870, lng: 79.1378 } },
        status: "completed",
        blockchain_hash: "0x7g8h9i0j1k2l"
      },
      {
        id: "cp2",
        name: "Organic Certification",
        description: "Organic certificate verified",
        timestamp: "2025-09-18T07:00:00+05:30",
        location: { taluk: "Thanjavur", coordinates: { lat: 10.7870, lng: 79.1378 } },
        status: "completed",
        blockchain_hash: "0x8h9i0j1k2l3m"
      },
      {
        id: "cp3",
        name: "Warehouse Storage",
        description: "Stored in Cauvery Depot",
        timestamp: "2025-09-18T09:00:00+05:30",
        location: { taluk: "Thanjavur", coordinates: { lat: 10.8000, lng: 79.1500 } },
        status: "completed",
        blockchain_hash: "0x9i0j1k2l3m4n"
      },
      {
        id: "cp4",
        name: "At Warehouse Gate",
        description: "Ready for dispatch - Stored",
        timestamp: "2025-09-19T08:00:00+05:30",
        location: { taluk: "Thanjavur", coordinates: { lat: 10.8000, lng: 79.1500 } },
        status: "completed",
        blockchain_hash: "0xa0j1k2l3m4n5"
      }
    ],
    current_location: {
      lat: 10.8000,
      lng: 79.1500,
      place_name: "At Warehouse Gate"
    },
    overall_status: "in_warehouse",
    estimated_delivery: "2025-09-19T18:00:00+05:30",
    created_at: "2025-09-18T05:30:00+05:30",
    updated_at: "2025-09-19T18:00:00+05:30"
  },
  {
    tracking_id: "TRK-TUR-004",
    product_name: "Organic Turmeric",
    quantity: "50kg",
    farmer: {
      name: "Meena Raj",
      uzhavar_pin: "UZP-MAD-2024-004",
      taluk: "Madurai"
    },
    warehouse: {
      name: "Madurai Agri Hub",
      taluk: "Madurai",
      warehouse_id: "WH-TLK-001"
    },
    consumer: {
      name: "Anand Kumar",
      order_id: "ORD-2025-0920-002",
      delivery_address: "45, Residency Road, Bangalore - 560025"
    },
    vehicle: {
      number: "TN-59-9876",
      type: "van",
      driver_name: "Senthil",
      driver_contact: "+91-9XX-XXX-X321"
    },
    checkpoints: [
      {
        id: "cp1",
        name: "Harvested",
        description: "Premium turmeric harvested",
        timestamp: "2025-09-18T06:00:00+05:30",
        location: { taluk: "Madurai", coordinates: { lat: 9.9252, lng: 78.1198 } },
        status: "completed",
        blockchain_hash: "0xb1j2k3l4m5n6"
      },
      {
        id: "cp2",
        name: "Quality Check",
        description: "Premium grade verification",
        timestamp: "2025-09-18T08:00:00+05:30",
        location: { taluk: "Madurai", coordinates: { lat: 9.9252, lng: 78.1198 } },
        status: "completed",
        blockchain_hash: "0xc2k3l4m5n6o7"
      },
      {
        id: "cp3",
        name: "Warehouse Storage",
        description: "Stored in Madurai Agri Hub",
        timestamp: "2025-09-18T10:00:00+05:30",
        location: { taluk: "Madurai", coordinates: { lat: 9.9500, lng: 78.1400 } },
        status: "completed",
        blockchain_hash: "0xd3l4m5n6o7p8"
      },
      {
        id: "cp4",
        name: "Order Packed",
        description: "Order packed for delivery",
        timestamp: "2025-09-20T08:00:00+05:30",
        location: { taluk: "Madurai", coordinates: { lat: 9.9500, lng: 78.1400 } },
        status: "completed",
        blockchain_hash: "0xe4m5n6o7p8q9"
      },
      {
        id: "cp5",
        name: "Out for Delivery",
        description: "On the way to Bangalore",
        timestamp: "2025-09-20T10:00:00+05:30",
        location: { taluk: "Madurai", coordinates: { lat: 9.9500, lng: 78.1400 } },
        status: "active"
      },
      {
        id: "cp6",
        name: "Delivered",
        description: "Delivered to customer",
        timestamp: "2025-09-20T22:00:00+05:30",
        location: { taluk: "Bangalore", coordinates: { lat: 12.9716, lng: 77.5946 } },
        status: "pending",
        estimated_duration: 12
      }
    ],
    current_location: {
      lat: 11.5000,
      lng: 78.0000,
      place_name: "Salem Highway"
    },
    overall_status: "out_for_delivery",
    estimated_delivery: "2025-09-20T22:00:00+05:30",
    created_at: "2025-09-18T06:00:00+05:30",
    updated_at: "2025-09-20T12:00:00+05:30"
  },
  {
    tracking_id: "TRK-MAN-005",
    product_name: "Fresh Mangoes",
    quantity: "25kg",
    farmer: {
      name: "Karthik Raja",
      uzhavar_pin: "UZP-TIR-2024-005",
      taluk: "Tirunelveli"
    },
    warehouse: {
      name: "Nellai Storage",
      taluk: "Tirunelveli",
      warehouse_id: "WH-TLK-002"
    },
    consumer: {
      name: "Shalini Reddy",
      order_id: "ORD-2025-0918-003",
      delivery_address: "78, Jubilee Hills, Hyderabad - 500033"
    },
    vehicle: {
      number: "TN-73-1123",
      type: "van",
      driver_name: "Prakash",
      driver_contact: "+91-9XX-XXX-X654"
    },
    checkpoints: [
      {
        id: "cp1",
        name: "Harvested",
        description: "Fresh mangoes harvested",
        timestamp: "2025-09-17T05:30:00+05:30",
        location: { taluk: "Tirunelveli", coordinates: { lat: 8.7139, lng: 77.7567 } },
        status: "completed",
        blockchain_hash: "0xf5n6o7p8q9r0"
      },
      {
        id: "cp2",
        name: "Quality Check",
        description: "Premium quality verified",
        timestamp: "2025-09-17T07:00:00+05:30",
        location: { taluk: "Tirunelveli", coordinates: { lat: 8.7139, lng: 77.7567 } },
        status: "completed",
        blockchain_hash: "0xg6o7p8q9r0s1"
      },
      {
        id: "cp3",
        name: "Warehouse Storage",
        description: "Stored in Nellai Storage",
        timestamp: "2025-09-17T09:00:00+05:30",
        location: { taluk: "Tirunelveli", coordinates: { lat: 8.7300, lng: 77.7800 } },
        status: "completed",
        blockchain_hash: "0xh7p8q9r0s1t2"
      },
      {
        id: "cp4",
        name: "Order Packed",
        description: "Order packed for delivery",
        timestamp: "2025-09-18T08:00:00+05:30",
        location: { taluk: "Tirunelveli", coordinates: { lat: 8.7300, lng: 77.7800 } },
        status: "completed",
        blockchain_hash: "0xi8q9r0s1t2u3"
      },
      {
        id: "cp5",
        name: "Out for Delivery",
        description: "En route to Hyderabad",
        timestamp: "2025-09-18T10:00:00+05:30",
        location: { taluk: "Tirunelveli", coordinates: { lat: 8.7300, lng: 77.7800 } },
        status: "completed",
        blockchain_hash: "0xj9r0s1t2u3v4"
      },
      {
        id: "cp6",
        name: "Delivered",
        description: "Successfully delivered",
        timestamp: "2025-09-18T14:00:00+05:30",
        location: { taluk: "Hyderabad", coordinates: { lat: 17.3850, lng: 78.4867 } },
        status: "completed",
        blockchain_hash: "0xk0s1t2u3v4w5"
      }
    ],
    current_location: {
      lat: 17.3850,
      lng: 78.4867,
      place_name: "Delivered"
    },
    overall_status: "delivered",
    estimated_delivery: "2025-09-18T14:00:00+05:30",
    created_at: "2025-09-17T05:30:00+05:30",
    updated_at: "2025-09-18T14:00:00+05:30"
  }
];

export const getTrackingByFarmer = (uzhavarPin: string): TrackingRoute[] => {
  return trackingData.filter(route => route.farmer.uzhavar_pin === uzhavarPin);
};

export const getTrackingByWarehouse = (warehouseId: string): TrackingRoute[] => {
  return trackingData.filter(route => route.warehouse.warehouse_id === warehouseId);
};

export const getTrackingByConsumer = (orderId: string): TrackingRoute | undefined => {
  return trackingData.find(route => route.consumer?.order_id === orderId);
};

export const getActiveTrackings = (): TrackingRoute[] => {
  return trackingData.filter(route => 
    route.overall_status !== 'delivered' && route.overall_status !== 'delayed'
  );
};