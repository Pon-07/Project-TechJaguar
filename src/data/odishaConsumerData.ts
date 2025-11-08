import { odishaWarehousesData } from './odishaWarehouses';

// Comprehensive crop-specific image mapping with realistic high-quality images
const getCropSpecificImage = (cropName: string): string => {
  const name = cropName.toLowerCase();
  
  // Paddy/Rice images (field cultivation)
  if (name.includes('paddy') || (name.includes('rice') && !name.includes('basmati'))) {
    return "https://images.unsplash.com/photo-1591807105152-594ed605cc58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWRkeSUyMHJpY2UlMjBjcm9wcyUyMGZpZWxkfGVufDF8fHx8MTc1ODQzNjY5OXww&ixlib=rb-4.1.0&q=80&w=1080";
  }
  
  // Basmati rice (grains)
  if (name.includes('basmati')) {
    return "https://images.unsplash.com/photo-1705147289789-6df2593f1b1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNtYXRpJTIwcmljZSUyMGdyYWlucyUyMHdoaXRlfGVufDF8fHx8MTc1ODQzNTkxN3ww&ixlib=rb-4.1.0&q=80&w=1080";
  }
  
  // Groundnut/Peanut
  if (name.includes('groundnut') || name.includes('peanut')) {
    return "https://images.unsplash.com/photo-1730822578580-999d591a1147?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm91bmRudXQlMjBwZWFudXQlMjBjcm9wc3xlbnwxfHx8fDE3NTg0MzY3MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080";
  }
  
  // Maize/Corn
  if (name.includes('maize') || name.includes('corn')) {
    return "https://images.unsplash.com/photo-1651667343378-4c5131206c5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWl6ZSUyMGNvcm4lMjBjcm9wc3xlbnwxfHx8fDE3NTg0MzY3MDV8MA&ixlib=rb-4.1.0&q=80&w=1080";
  }
  
  // Black Gram/Urad Dal
  if (name.includes('black gram') || name.includes('urad')) {
    return "https://images.unsplash.com/photo-1601301428039-004619903865?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGdyYW0lMjB1cmFkJTIwZGFsfGVufDF8fHx8MTc1ODQzNzIzNHww&ixlib=rb-4.1.0&q=80&w=1080";
  }
  
  // General Pulses/Legumes
  if (name.includes('pulse') || name.includes('moong') || name.includes('dal') || name.includes('gram')) {
    return "https://images.unsplash.com/photo-1600728255690-edd070021d02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdWxzZXMlMjBsZWd1bWVzJTIwY3JvcHN8ZW58MXx8fHwxNzU4NDM2NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080";
  }
  
  // Wheat
  if (name.includes('wheat')) {
    return "https://images.unsplash.com/photo-1646520087270-2878326efdf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGVhdCUyMGdyYWluJTIwY3JvcHN8ZW58MXx8fHwxNzU4NDM2NzEwfDA&ixlib=rb-4.1.0&q=80&w=1080";
  }
  
  // Coconut (fresh)
  if (name.includes('coconut')) {
    return "https://images.unsplash.com/photo-1757332050856-edeb5bf846be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGNvY29udXQlMjBmcnVpdCUyMHRyb3BpY2FsfGVufDF8fHx8MTc1ODQzNzIyMnww&ixlib=rb-4.1.0&q=80&w=1080";
  }
  
  // Turmeric
  if (name.includes('turmeric')) {
    return "https://images.unsplash.com/photo-1615485500834-bc10199bc727?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dXJtZXJpYyUyMHNwaWNlJTIwcG93ZGVyJTIweWVsbG93fGVufDF8fHx8MTc1ODQzNzIyNXww&ixlib=rb-4.1.0&q=80&w=1080";
  }
  
  // Jute
  if (name.includes('jute')) {
    return "https://images.unsplash.com/photo-1756691945382-65b1c87f25bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqdXRlJTIwZmliZXIlMjBuYXR1cmFsJTIwcGxhbnR8ZW58MXx8fHwxNzU4NDM3MjI4fDA&ixlib=rb-4.1.0&q=80&w=1080";
  }
  
  // Sesame
  if (name.includes('sesame')) {
    return "https://images.unsplash.com/photo-1549530708-be1b34900690?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXNhbWUlMjBzZWVkcyUyMHdoaXRlJTIwZ3JhaW58ZW58MXx8fHwxNzU4NDM3MjMxfDA&ixlib=rb-4.1.0&q=80&w=1080";
  }
  
  // Cashew
  if (name.includes('cashew')) {
    return "https://images.unsplash.com/photo-1622326684922-e5fb0987e453?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXNoZXclMjBudXRzJTIwcmF3fGVufDF8fHx8MTc1ODQzNzIzN3ww&ixlib=rb-4.1.0&q=80&w=1080";
  }
  
  // Millets (Finger Millet/Ragi)
  if (name.includes('millet') || name.includes('ragi')) {
    return "https://images.unsplash.com/photo-1622222250466-08eeb5f9999e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5nZXIlMjBtaWxsZXQlMjByYWdpJTIwZ3JhaW58ZW58MXx8fHwxNzU4NDM3MjQxfDA&ixlib=rb-4.1.0&q=80&w=1080";
  }
  
  // Mahua Flowers
  if (name.includes('mahua')) {
    return "https://images.unsplash.com/photo-1720275816218-e7562d2b3a39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWh1YSUyMGZsb3dlcnMlMjBkcmllZCUyMHRyaWJhbHxlbnwxfHx8fDE3NTg0MzcyNDN8MA&ixlib=rb-4.1.0&q=80&w=1080";
  }
  
  // Sugarcane/Jaggery
  if (name.includes('sugarcane') || name.includes('jaggery')) {
    return "https://images.unsplash.com/photo-1677146334971-3fb697b4060e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWdhcmNhbmUlMjBqYWdnZXJ5JTIwYnJvd258ZW58MXx8fHwxNzU4NDM3MjQ3fDA&ixlib=rb-4.1.0&q=80&w=1080";
  }
  
  // Mixed Vegetables
  if (name.includes('vegetable') || name.includes('tomato') || name.includes('onion') || name.includes('potato')) {
    return "https://images.unsplash.com/photo-1580206134556-88e026cc9a7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGVzJTIwdG9tYXRvJTIwY3JvcHN8ZW58MXx8fHwxNzU4NDM2NzEzfDA&ixlib=rb-4.1.0&q=80&w=1080";
  }
  
  // Default paddy image for other crops
  return "https://images.unsplash.com/photo-1591807105152-594ed605cc58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWRkeSUyMHJpY2UlMjBjcm9wcyUyMGZpZWxkfGVufDF8fHx8MTc1ODQzNjY5OXww&ixlib=rb-4.1.0&q=80&w=1080";
};

// Generate products from Odisha warehouses
export const odishaConsumerProducts = {
  "products": odishaWarehousesData.warehouses.flatMap(warehouse => 
    warehouse.inventory.map(item => ({
      "id": `PROD-${warehouse.warehouse_id}-${item.item_id}`,
      "name": item.name,
      "variety": item.variety,
      "farmer_name": `Farmer-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      "farmer_contact": `+91-9437-${Math.floor(Math.random() * 900000) + 100000}`,
      "warehouse_id": warehouse.warehouse_id,
      "warehouse_location": `${warehouse.taluk}, ${warehouse.district}`,
      "price_per_kg": item.community_price_per_kg,
      "original_price_per_kg": item.unit_price_per_kg,
      "available_quantity_kg": item.total_quantity_kg,
      "minimum_order_kg": Math.max(1, Math.floor(item.total_quantity_kg / 100)),
      "maximum_order_kg": Math.floor(item.total_quantity_kg / 10),
      "rating": warehouse.rating,
      "organic_certified": item.organic_cert === "Yes",
      "harvest_date": new Date(2025, 7, Math.floor(Math.random() * 30) + 1).toISOString(),
      "expiry_date": item.expiry_date,
      "batch_id": item.batch_id,
      "blockchain_contract_id": item.blockchain_contract_id,
      "carbon_saved_per_kg": item.carbon_saved_kg / item.total_quantity_kg,
      "delivery_time_hours": Math.floor(Math.random() * 48) + 6,
      "community_votes": warehouse.community_price_votes.find(v => v.crop.toLowerCase().includes(item.name.split(' ')[0].toLowerCase()))?.votes || 0,
      "ar_model": item.ar_model,
      "qr_code": `QR-${warehouse.warehouse_id}-${item.item_id}`,
      "farm_location": {
        "district": warehouse.district,
        "taluk": warehouse.taluk,
        "village": `${warehouse.taluk} Rural`,
        "land_size_acres": Math.floor(Math.random() * 10) + 2,
        "gps_coordinates": `${20 + Math.random() * 2}°N, ${85 + Math.random() * 2}°E`
      },
      "quality_certifications": [
        ...(item.organic_cert === "Yes" ? ["Organic India Certified"] : []),
        "FSSAI Approved",
        "Quality Assured"
      ],
      "nutritional_info": {
        "calories_per_100g": Math.floor(Math.random() * 200) + 100,
        "protein_g": Math.floor(Math.random() * 15) + 5,
        "carbs_g": Math.floor(Math.random() * 50) + 20,
        "fiber_g": Math.floor(Math.random() * 8) + 2
      },
      "storage_temp": `${Math.floor(Math.random() * 10) + 15}°C - ${Math.floor(Math.random() * 10) + 25}°C`,
      "delivery_partners": warehouse.delivery_partners,
      "discount_percentage": Math.floor(((item.unit_price_per_kg - item.community_price_per_kg) / item.unit_price_per_kg) * 100),
      "image_url": getCropSpecificImage(item.name),
      "trending": Math.random() > 0.7,
      "new_arrival": Math.random() > 0.8,
      "bestseller": Math.random() > 0.75
    }))
  ).slice(0, 50) // Limit to 50 products for demo
};

export type OdishaProduct = typeof odishaConsumerProducts.products[0];

// Customer profiles for dummy data
export const odishaCustomerProfiles = {
  "customers": [
    {
      "customer_id": "CUST-OD-001",
      "name": "Priya Das",
      "phone": "+91-9437-555001",
      "email": "priya.das@email.com",
      "location": {
        "city": "Bhubaneswar",
        "district": "Khordha",
        "state": "Odisha",
        "pincode": "751001",
        "address": "Unit-IV, Saheed Nagar, Bhubaneswar"
      },
      "preferred_languages": ["od", "en", "hi"],
      "green_points": 2340,
      "total_orders": 47,
      "total_spent": 15640,
      "carbon_saved_kg": 89.4,
      "favorite_crops": ["Paddy", "Vegetables", "Fruits"],
      "favorite_farmers": ["Ramesh Kumar", "Sita Rani", "Jagannath Pradhan"],
      "payment_methods": [
        {"type": "upi", "id": "priya@paytm", "is_default": true},
        {"type": "card", "id": "**** **** **** 1234", "is_default": false},
        {"type": "wallet", "id": "GreenWallet", "is_default": false}
      ],
      "delivery_addresses": [
        {
          "id": "ADDR-001",
          "label": "Home",
          "address": "Unit-IV, Saheed Nagar, Bhubaneswar, 751001",
          "is_default": true,
          "landmark": "Near AG Square"
        },
        {
          "id": "ADDR-002", 
          "label": "Office",
          "address": "Patia, Bhubaneswar, 751024",
          "is_default": false,
          "landmark": "IT Park"
        }
      ]
    }
  ]
};

export type OdishaCustomer = typeof odishaCustomerProfiles.customers[0];

// Predictive Analytics for Consumers
export const odishaConsumerAnalytics = {
  "trending_crops": [
    {
      "crop": "Paddy",
      "trend_percentage": 23.5,
      "predicted_price_change": -8.2,
      "demand_forecast": "High",
      "recommended_purchase_time": "Next 3 days",
      "available_warehouses": 12,
      "total_stock_kg": 890000
    },
    {
      "crop": "Groundnut", 
      "trend_percentage": 18.7,
      "predicted_price_change": 5.4,
      "demand_forecast": "Medium",
      "recommended_purchase_time": "This week",
      "available_warehouses": 8,
      "total_stock_kg": 156000
    },
    {
      "crop": "Coconut",
      "trend_percentage": 15.2,
      "predicted_price_change": -2.1,
      "demand_forecast": "Stable", 
      "recommended_purchase_time": "Anytime",
      "available_warehouses": 5,
      "total_stock_kg": 49000
    },
    {
      "crop": "Turmeric",
      "trend_percentage": 12.8,
      "predicted_price_change": 12.3,
      "demand_forecast": "Rising",
      "recommended_purchase_time": "Buy now",
      "available_warehouses": 3,
      "total_stock_kg": 18500
    }
  ],
  "weekly_deals": [
    {
      "product_id": "PROD-WH-KHO-001-IT-KHO-001",
      "discount_percentage": 15,
      "deal_price": 31.02,
      "original_price": 36.5,
      "deal_ends": "2025-09-28T23:59:59+05:30",
      "stock_left": 45000
    },
    {
      "product_id": "PROD-WH-BAL-001-IT-BAL-002",
      "discount_percentage": 12,
      "deal_price": 151.36,
      "original_price": 172.0,
      "deal_ends": "2025-09-25T23:59:59+05:30", 
      "stock_left": 8500
    }
  ],
  "personalized_recommendations": [
    {
      "reason": "Based on your recent purchases",
      "products": ["PROD-WH-CUT-001-IT-CUT-001", "PROD-WH-PUR-001-IT-PUR-001"]
    },
    {
      "reason": "Popular in your area",
      "products": ["PROD-WH-KHO-001-IT-KHO-002", "PROD-WH-BLS-001-IT-BLS-001"]
    },
    {
      "reason": "Price drop alert",
      "products": ["PROD-WH-GAN-001-IT-GAN-001", "PROD-WH-SAM-001-IT-SAM-001"]
    }
  ]
};

// QR Code scanning results
export const odishaQRResults = {
  "qr_database": [
    {
      "qr_code": "QR-WH-KHO-001-IT-KHO-001",
      "product_info": {
        "product_name": "Paddy (Naveen)",
        "variety": "Naveen",
        "batch_id": "BATCH-KHO-P1-2025-08"
      },
      "farmer_info": {
        "farmer_name": "Bhuban Mohan Sahoo",
        "farmer_id": "UZP-KHO-12045",
        "phone": "+91-9437-345123",
        "farm_location": "Jatni Village, Khordha District",
        "land_size_acres": 4.5,
        "farming_experience_years": 15,
        "organic_certified": true,
        "total_crops_this_season": 3
      },
      "warehouse_info": {
        "warehouse_id": "WH-KHO-001",
        "warehouse_name": "Bhubaneswar Technology Park Warehouse",
        "location": "Bhubaneswar, Khordha District",
        "manager": "Dr. Ashok Kumar Mohanty",
        "manager_contact": "+91-9437-129001",
        "storage_date": "2025-08-15T09:30:00+05:30",
        "quality_check_date": "2025-08-15T14:20:00+05:30",
        "quality_grade": "A+",
        "storage_conditions": "Temperature controlled, humidity maintained"
      },
      "blockchain_info": {
        "contract_id": "0xKHO1O5P6Q7R8S9T",
        "transaction_hash": "0xd4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9",
        "smart_contract_verified": true,
        "timestamp": "2025-08-15T09:30:00+05:30",
        "gas_fee": "0.0021 ETH",
        "network": "Ethereum Mainnet"
      },
      "crop_journey": [
        {
          "stage": "Planting",
          "date": "2025-06-01T06:00:00+05:30",
          "location": "Jatni Village Farm",
          "details": "Naveen variety seeds planted with organic fertilizers"
        },
        {
          "stage": "Growing",
          "date": "2025-07-15T08:00:00+05:30", 
          "location": "Farm Field",
          "details": "Crop monitored, natural pest control applied"
        },
        {
          "stage": "Harvesting",
          "date": "2025-08-10T05:30:00+05:30",
          "location": "Jatni Village Farm",
          "details": "Manually harvested at optimal maturity"
        },
        {
          "stage": "Processing",
          "date": "2025-08-12T10:00:00+05:30",
          "location": "Local Processing Unit",
          "details": "Cleaned, sorted, and packaged"
        },
        {
          "stage": "Warehouse Storage",
          "date": "2025-08-15T09:30:00+05:30",
          "location": "WH-KHO-001",
          "details": "Quality checked and stored in controlled conditions"
        }
      ]
    },
    {
      "qr_code": "QR-WH-CUT-001-IT-CUT-001",
      "product_info": {
        "product_name": "Paddy (Improved Lalat)",
        "variety": "Improved Lalat",
        "batch_id": "BATCH-CUT-P1-2025-08"
      },
      "farmer_info": {
        "farmer_name": "Ravi Shankar Patel",
        "farmer_id": "UZP-CUT-23067",
        "phone": "+91-9437-298765",
        "farm_location": "Tangi Village, Cuttack District",
        "land_size_acres": 8.2,
        "farming_experience_years": 22,
        "organic_certified": true,
        "total_crops_this_season": 2
      },
      "warehouse_info": {
        "warehouse_id": "WH-CUT-001",
        "warehouse_name": "Cuttack Commercial District Warehouse",
        "location": "Cuttack, Cuttack District",
        "manager": "Bijay Kumar Sahoo",
        "manager_contact": "+91-9437-128001",
        "storage_date": "2025-08-20T11:15:00+05:30",
        "quality_check_date": "2025-08-20T15:45:00+05:30",
        "quality_grade": "A",
        "storage_conditions": "Standard warehouse conditions"
      },
      "blockchain_info": {
        "contract_id": "0xCUT1M3N4O5P6Q7R",
        "transaction_hash": "0xe6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5",
        "smart_contract_verified": true,
        "timestamp": "2025-08-20T11:15:00+05:30",
        "gas_fee": "0.0018 ETH",
        "network": "Ethereum Mainnet"
      },
      "crop_journey": [
        {
          "stage": "Planting",
          "date": "2025-05-20T05:45:00+05:30",
          "location": "Tangi Village Farm",
          "details": "Improved Lalat variety planted with bio-fertilizers"
        },
        {
          "stage": "Growing",
          "date": "2025-07-10T07:30:00+05:30",
          "location": "Farm Field",
          "details": "Regular monitoring, organic growth supplements used"
        },
        {
          "stage": "Harvesting",
          "date": "2025-08-15T06:00:00+05:30",
          "location": "Tangi Village Farm", 
          "details": "Traditional harvesting methods, optimal grain moisture"
        },
        {
          "stage": "Processing",
          "date": "2025-08-18T09:00:00+05:30",
          "location": "Cuttack Processing Center",
          "details": "Modern processing with quality preservation"
        },
        {
          "stage": "Warehouse Storage",
          "date": "2025-08-20T11:15:00+05:30",
          "location": "WH-CUT-001",
          "details": "Grade A quality, stored in optimal conditions"
        }
      ]
    }
  ]
};

// Payment & Receipt System
export const odishaPaymentData = {
  "payment_methods": [
    {
      "id": "UPI-001",
      "type": "UPI",
      "name": "PhonePe",
      "identifier": "priya@phonepe",
      "is_default": true,
      "fees": 0,
      "max_amount": 100000
    },
    {
      "id": "UPI-002", 
      "type": "UPI",
      "name": "Google Pay",
      "identifier": "priya@okaxis",
      "is_default": false,
      "fees": 0,
      "max_amount": 100000
    },
    {
      "id": "CARD-001",
      "type": "Debit Card",
      "name": "State Bank of India",
      "identifier": "**** **** **** 5678",
      "is_default": false,
      "fees": 5,
      "max_amount": 50000
    },
    {
      "id": "WALLET-001",
      "type": "Digital Wallet",
      "name": "GreenLedger Wallet",
      "identifier": "Green Points Balance",
      "is_default": false,
      "fees": 0,
      "max_amount": 25000
    }
  ],
  "receipt_template": {
    "merchant_name": "GreenLedger - Direct from Farmer",
    "merchant_address": "Technology Park, Bhubaneswar, Odisha",
    "gstin": "21AABCT1234L1Z5",
    "customer_support": "+91-9437-100-002"
  }
};

// Notifications for customers
export const odishaConsumerNotifications = {
  "notifications": [
    {
      "id": "NOTIF-001",
      "type": "order_confirmation",
      "title": "Order Confirmed!",
      "message": "Your order #ORD-2025-001 has been confirmed and will be delivered within 24 hours.",
      "timestamp": "2025-09-21T10:15:00+05:30",
      "is_read": false,
      "action_buttons": ["Track Order", "View Receipt"]
    },
    {
      "id": "NOTIF-002",
      "type": "price_drop",
      "title": "Price Drop Alert! 📉",
      "message": "Organic Paddy price dropped by 8.2%. Great time to buy!",
      "timestamp": "2025-09-21T09:45:00+05:30",
      "is_read": false,
      "action_buttons": ["View Product", "Add to Cart"]
    },
    {
      "id": "NOTIF-003",
      "type": "new_arrival",
      "title": "Fresh Coconuts Available! 🥥",
      "message": "Fresh coconuts from Puri coastal farms just arrived at nearby warehouse.",
      "timestamp": "2025-09-21T08:30:00+05:30",
      "is_read": true,
      "action_buttons": ["Shop Now"]
    },
    {
      "id": "NOTIF-004",
      "type": "delivery_update",
      "title": "Out for Delivery 🚛",
      "message": "Your order #ORD-2025-001 is out for delivery. Estimated arrival: 2:30 PM",
      "timestamp": "2025-09-21T12:45:00+05:30",
      "is_read": false,
      "action_buttons": ["Track Live", "Call Driver"]
    }
  ]
};

// Support contact numbers for consumers
export const odishaConsumerSupport = {
  "customer_support": "+91-9437-100-002",
  "warehouse_support": "+91-9437-100-000",
  "farmer_helpdesk": "+91-9437-100-001",
  "delivery_support": "+91-9437-100-004",
  "technical_support": "+91-9437-100-005",
  "emergency_helpline": "+91-9437-100-911"
};

// Dummy order data for testing
export const odishaDummyOrders = {
  "orders": [
    {
      "order_id": "ORD-2025-001",
      "customer_id": "CUST-OD-001",
      "order_date": "2025-09-20T14:30:00+05:30",
      "status": "in_transit",
      "items": [
        {
          "product_id": "PROD-WH-KHO-001-IT-KHO-001",
          "name": "Paddy (Naveen)",
          "quantity_kg": 5,
          "price_per_kg": 36.5,
          "total_price": 182.5
        },
        {
          "product_id": "PROD-WH-CUT-001-IT-CUT-002", 
          "name": "Jute",
          "quantity_kg": 2,
          "price_per_kg": 55.8,
          "total_price": 111.6
        }
      ],
      "subtotal": 294.1,
      "delivery_charge": 25,
      "taxes": 15.95,
      "total_amount": 335.05,
      "payment_method": "UPI (PhonePe)",
      "payment_status": "completed",
      "delivery_address": "Unit-IV, Saheed Nagar, Bhubaneswar, 751001",
      "estimated_delivery": "2025-09-21T15:30:00+05:30",
      "tracking_id": "TRK-Consumer-001"
    }
  ]
};