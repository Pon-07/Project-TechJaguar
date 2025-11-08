export const odishaWarehousesData = {
  "warehouses": [
    // ANGUL DISTRICT
    {
      "warehouse_id": "WH-ANG-001",
      "taluk": "Angul",
      "district": "Angul",
      "state": "Odisha",
      "address": "Angul Industrial Area, Talcher Road",
      "manager": {"name": "Rajesh Panda", "contact": "+91-9437-123001", "uzhavar_pin": "UZP-ANG-001"},
      "capacity_tonnes": 1500,
      "current_occupancy_tonnes": 1203,
      "inventory": [
        {
          "item_id": "IT-ANG-001",
          "name": "Paddy (Swarna)",
          "variety": "Swarna",
          "farmer_count": 67,
          "total_quantity_kg": 85000,
          "unit_price_per_kg": 32.0,
          "community_price_per_kg": 34.5,
          "blockchain_contract_id": "0xANG1A2B3C4D5E6F",
          "batch_id": "BATCH-ANG-P1-2025-07",
          "expiry_date": "2026-02-15",
          "organic_cert": "Yes",
          "carbon_saved_kg": 2800,
          "ar_model": "swarna_paddy.glb"
        },
        {
          "item_id": "IT-ANG-002",
          "name": "Groundnut",
          "variety": "Spanish Bold",
          "farmer_count": 34,
          "total_quantity_kg": 42000,
          "unit_price_per_kg": 118.0,
          "community_price_per_kg": 122.0,
          "blockchain_contract_id": "0xANG2B3C4D5E6F7G",
          "batch_id": "BATCH-ANG-G1-2025-08",
          "expiry_date": "2026-06-20",
          "organic_cert": "Partial",
          "carbon_saved_kg": 1560,
          "ar_model": "groundnut_spanish.glb"
        }
      ],
      "analytics": {
        "monthly_inflow_tonnes": 185,
        "monthly_outflow_tonnes": 162,
        "avg_price_index": 1.08,
        "turnover_last_3_months_inr": 15200000
      },
      "rating": 4.5,
      "last_inspection_date": "2025-09-12",
      "zomato_partner_enabled": true,
      "delivery_partners": ["Zomato", "LocalFleet-Express"],
      "images": ["angul_wh_front.jpg"],
      "warehouse_3d_asset": "wh_angul_3d.glb",
      "qr_code_id": "QR-WH-ANG-001",
      "notes": "Coal belt region, good connectivity via railway",
      "community_price_votes": [
        {"crop":"Paddy","votes":456,"final_price_per_kg":34.5},
        {"crop":"Groundnut","votes":287,"final_price_per_kg":122.0}
      ],
      "last_updated": "2025-09-20T10:15:00+05:30"
    },
    {
      "warehouse_id": "WH-ANG-002",
      "taluk": "Talcher",
      "district": "Angul",
      "state": "Odisha",
      "address": "Talcher Thermal Power Station Road",
      "manager": {"name": "Priya Mohapatra", "contact": "+91-9437-123002", "uzhavar_pin": "UZP-ANG-002"},
      "capacity_tonnes": 1200,
      "current_occupancy_tonnes": 890,
      "inventory": [
        {
          "item_id": "IT-ANG-003",
          "name": "Maize",
          "variety": "Hybrid Yellow",
          "farmer_count": 45,
          "total_quantity_kg": 67000,
          "unit_price_per_kg": 28.5,
          "community_price_per_kg": 31.0,
          "blockchain_contract_id": "0xANG3C4D5E6F7G8H",
          "batch_id": "BATCH-ANG-M1-2025-07",
          "expiry_date": "2026-01-30",
          "organic_cert": "No",
          "carbon_saved_kg": 1890,
          "ar_model": "maize_hybrid.glb"
        },
        {
          "item_id": "IT-ANG-004",
          "name": "Black Gram (Urad)",
          "variety": "Local",
          "farmer_count": 28,
          "total_quantity_kg": 23000,
          "unit_price_per_kg": 95.0,
          "community_price_per_kg": 98.5,
          "blockchain_contract_id": "0xANG4D5E6F7G8H9I",
          "batch_id": "BATCH-ANG-U1-2025-06",
          "expiry_date": "2026-04-15",
          "organic_cert": "Yes",
          "carbon_saved_kg": 740,
          "ar_model": "urad_blackgram.glb"
        }
      ],
      "analytics": {
        "monthly_inflow_tonnes": 142,
        "monthly_outflow_tonnes": 128,
        "avg_price_index": 1.12,
        "turnover_last_3_months_inr": 11800000
      },
      "rating": 4.3,
      "last_inspection_date": "2025-09-08",
      "zomato_partner_enabled": false,
      "delivery_partners": ["LocalFleet-Express"],
      "images": ["talcher_wh_side.jpg"],
      "warehouse_3d_asset": "wh_talcher_3d.glb",
      "qr_code_id": "QR-WH-ANG-002",
      "notes": "Near thermal power plant, industrial connectivity",
      "community_price_votes": [
        {"crop":"Maize","votes":312,"final_price_per_kg":31.0},
        {"crop":"Black Gram","votes":198,"final_price_per_kg":98.5}
      ],
      "last_updated": "2025-09-19T14:22:00+05:30"
    },
    
    // BALANGIR DISTRICT
    {
      "warehouse_id": "WH-BAL-001",
      "taluk": "Balangir",
      "district": "Balangir",
      "state": "Odisha",
      "address": "Balangir Agricultural Market Complex",
      "manager": {"name": "Santosh Kumar Nag", "contact": "+91-9437-124001", "uzhavar_pin": "UZP-BAL-001"},
      "capacity_tonnes": 1800,
      "current_occupancy_tonnes": 1456,
      "inventory": [
        {
          "item_id": "IT-BAL-001",
          "name": "Paddy (Lalat)",
          "variety": "Lalat",
          "farmer_count": 89,
          "total_quantity_kg": 112000,
          "unit_price_per_kg": 31.5,
          "community_price_per_kg": 33.8,
          "blockchain_contract_id": "0xBAL1E5F6G7H8I9J",
          "batch_id": "BATCH-BAL-P1-2025-08",
          "expiry_date": "2026-03-10",
          "organic_cert": "Yes",
          "carbon_saved_kg": 3680,
          "ar_model": "lalat_paddy.glb"
        },
        {
          "item_id": "IT-BAL-002",
          "name": "Turmeric",
          "variety": "Local Variety",
          "farmer_count": 23,
          "total_quantity_kg": 18500,
          "unit_price_per_kg": 165.0,
          "community_price_per_kg": 172.0,
          "blockchain_contract_id": "0xBAL2F6G7H8I9J0K",
          "batch_id": "BATCH-BAL-T1-2025-05",
          "expiry_date": "2027-08-30",
          "organic_cert": "Yes",
          "carbon_saved_kg": 520,
          "ar_model": "turmeric_local.glb"
        }
      ],
      "analytics": {
        "monthly_inflow_tonnes": 225,
        "monthly_outflow_tonnes": 198,
        "avg_price_index": 1.15,
        "turnover_last_3_months_inr": 18500000
      },
      "rating": 4.7,
      "last_inspection_date": "2025-09-15",
      "zomato_partner_enabled": true,
      "delivery_partners": ["Zomato", "GreenDrops"],
      "images": ["balangir_wh_main.jpg"],
      "warehouse_3d_asset": "wh_balangir_3d.glb",
      "qr_code_id": "QR-WH-BAL-001",
      "notes": "Major agricultural hub, excellent farmer connectivity",
      "community_price_votes": [
        {"crop":"Paddy","votes":623,"final_price_per_kg":33.8},
        {"crop":"Turmeric","votes":145,"final_price_per_kg":172.0}
      ],
      "last_updated": "2025-09-20T09:45:00+05:30"
    },
    
    // BALASORE DISTRICT
    {
      "warehouse_id": "WH-BLS-001",
      "taluk": "Balasore",
      "district": "Balasore",
      "state": "Odisha",
      "address": "Balasore Coastal Agricultural Zone",
      "manager": {"name": "Deepak Biswal", "contact": "+91-9437-125001", "uzhavar_pin": "UZP-BLS-001"},
      "capacity_tonnes": 1600,
      "current_occupancy_tonnes": 1234,
      "inventory": [
        {
          "item_id": "IT-BLS-001",
          "name": "Paddy (Pooja)",
          "variety": "Pooja",
          "farmer_count": 76,
          "total_quantity_kg": 98000,
          "unit_price_per_kg": 33.0,
          "community_price_per_kg": 35.2,
          "blockchain_contract_id": "0xBLS1G7H8I9J0K1L",
          "batch_id": "BATCH-BLS-P1-2025-08",
          "expiry_date": "2026-02-25",
          "organic_cert": "Partial",
          "carbon_saved_kg": 3240,
          "ar_model": "pooja_paddy.glb"
        },
        {
          "item_id": "IT-BLS-002",
          "name": "Coconut (Dried)",
          "variety": "East Coast Tall",
          "farmer_count": 34,
          "total_quantity_kg": 25000,
          "unit_price_per_kg": 58.0,
          "community_price_per_kg": 62.5,
          "blockchain_contract_id": "0xBLS2H8I9J0K1L2M",
          "batch_id": "BATCH-BLS-C1-2025-07",
          "expiry_date": "2026-09-10",
          "organic_cert": "Yes",
          "carbon_saved_kg": 890,
          "ar_model": "coconut_dried.glb"
        }
      ],
      "analytics": {
        "monthly_inflow_tonnes": 198,
        "monthly_outflow_tonnes": 175,
        "avg_price_index": 1.09,
        "turnover_last_3_months_inr": 16200000
      },
      "rating": 4.4,
      "last_inspection_date": "2025-09-11",
      "zomato_partner_enabled": true,
      "delivery_partners": ["Zomato", "LocalFleet-Express"],
      "images": ["balasore_wh_coastal.jpg"],
      "warehouse_3d_asset": "wh_balasore_3d.glb",
      "qr_code_id": "QR-WH-BLS-001",
      "notes": "Coastal region, good for coconut and paddy storage",
      "community_price_votes": [
        {"crop":"Paddy","votes":512,"final_price_per_kg":35.2},
        {"crop":"Coconut","votes":234,"final_price_per_kg":62.5}
      ],
      "last_updated": "2025-09-19T16:30:00+05:30"
    },
    
    // BARGARH DISTRICT
    {
      "warehouse_id": "WH-BRG-001",
      "taluk": "Bargarh",
      "district": "Bargarh",
      "state": "Odisha",
      "address": "Bargarh Rice Bowl Area, NH 6",
      "manager": {"name": "Laxmi Narayan Patel", "contact": "+91-9437-126001", "uzhavar_pin": "UZP-BRG-001"},
      "capacity_tonnes": 2200,
      "current_occupancy_tonnes": 1876,
      "inventory": [
        {
          "item_id": "IT-BRG-001",
          "name": "Paddy (Swarna Sub-1)",
          "variety": "Swarna Sub-1",
          "farmer_count": 123,
          "total_quantity_kg": 145000,
          "unit_price_per_kg": 32.5,
          "community_price_per_kg": 34.8,
          "blockchain_contract_id": "0xBRG1I9J0K1L2M3N",
          "batch_id": "BATCH-BRG-P1-2025-08",
          "expiry_date": "2026-03-15",
          "organic_cert": "Yes",
          "carbon_saved_kg": 4785,
          "ar_model": "swarna_sub1_paddy.glb"
        },
        {
          "item_id": "IT-BRG-002",
          "name": "Sugarcane (Jaggery)",
          "variety": "Co-86032",
          "farmer_count": 45,
          "total_quantity_kg": 42500,
          "unit_price_per_kg": 45.0,
          "community_price_per_kg": 48.5,
          "blockchain_contract_id": "0xBRG2J0K1L2M3N4O",
          "batch_id": "BATCH-BRG-S1-2025-06",
          "expiry_date": "2025-12-20",
          "organic_cert": "No",
          "carbon_saved_kg": 1485,
          "ar_model": "sugarcane_jaggery.glb"
        }
      ],
      "analytics": {
        "monthly_inflow_tonnes": 267,
        "monthly_outflow_tonnes": 238,
        "avg_price_index": 1.18,
        "turnover_last_3_months_inr": 22400000
      },
      "rating": 4.8,
      "last_inspection_date": "2025-09-16",
      "zomato_partner_enabled": true,
      "delivery_partners": ["Zomato", "GreenDrops", "LocalFleet-Express"],
      "images": ["bargarh_wh_ricebowl.jpg"],
      "warehouse_3d_asset": "wh_bargarh_3d.glb",
      "qr_code_id": "QR-WH-BRG-001",
      "notes": "Rice bowl of Odisha, largest paddy storage facility",
      "community_price_votes": [
        {"crop":"Paddy","votes":789,"final_price_per_kg":34.8},
        {"crop":"Sugarcane","votes":298,"final_price_per_kg":48.5}
      ],
      "last_updated": "2025-09-20T11:20:00+05:30"
    },
    
    // BHADRAK DISTRICT
    {
      "warehouse_id": "WH-BHD-001",
      "taluk": "Bhadrak",
      "district": "Bhadrak",
      "state": "Odisha",
      "address": "Bhadrak Industrial Estate, Dhamra Road",
      "manager": {"name": "Subash Chandra Das", "contact": "+91-9437-127001", "uzhavar_pin": "UZP-BHD-001"},
      "capacity_tonnes": 1400,
      "current_occupancy_tonnes": 1089,
      "inventory": [
        {
          "item_id": "IT-BHD-001",
          "name": "Paddy (MTU-1010)",
          "variety": "MTU-1010",
          "farmer_count": 68,
          "total_quantity_kg": 87000,
          "unit_price_per_kg": 31.8,
          "community_price_per_kg": 33.9,
          "blockchain_contract_id": "0xBHD1K1L2M3N4O5P",
          "batch_id": "BATCH-BHD-P1-2025-07",
          "expiry_date": "2026-02-10",
          "organic_cert": "Partial",
          "carbon_saved_kg": 2871,
          "ar_model": "mtu1010_paddy.glb"
        },
        {
          "item_id": "IT-BHD-002",
          "name": "Sesame",
          "variety": "Prachi",
          "farmer_count": 31,
          "total_quantity_kg": 22000,
          "unit_price_per_kg": 142.0,
          "community_price_per_kg": 148.5,
          "blockchain_contract_id": "0xBHD2L2M3N4O5P6Q",
          "batch_id": "BATCH-BHD-S1-2025-06",
          "expiry_date": "2026-08-25",
          "organic_cert": "Yes",
          "carbon_saved_kg": 770,
          "ar_model": "sesame_prachi.glb"
        }
      ],
      "analytics": {
        "monthly_inflow_tonnes": 167,
        "monthly_outflow_tonnes": 149,
        "avg_price_index": 1.11,
        "turnover_last_3_months_inr": 13900000
      },
      "rating": 4.2,
      "last_inspection_date": "2025-09-09",
      "zomato_partner_enabled": false,
      "delivery_partners": ["LocalFleet-Express"],
      "images": ["bhadrak_wh_industrial.jpg"],
      "warehouse_3d_asset": "wh_bhadrak_3d.glb",
      "qr_code_id": "QR-WH-BHD-001",
      "notes": "Industrial connectivity, port access via Dhamra",
      "community_price_votes": [
        {"crop":"Paddy","votes":445,"final_price_per_kg":33.9},
        {"crop":"Sesame","votes":187,"final_price_per_kg":148.5}
      ],
      "last_updated": "2025-09-18T13:15:00+05:30"
    },
    
    // CUTTACK DISTRICT
    {
      "warehouse_id": "WH-CUT-001",
      "taluk": "Cuttack Sadar",
      "district": "Cuttack",
      "state": "Odisha",
      "address": "Cuttack Commercial District, Mahanadi Road",
      "manager": {"name": "Bijay Kumar Sahoo", "contact": "+91-9437-128001", "uzhavar_pin": "UZP-CUT-001"},
      "capacity_tonnes": 2500,
      "current_occupancy_tonnes": 2145,
      "inventory": [
        {
          "item_id": "IT-CUT-001",
          "name": "Paddy (Improved Lalat)",
          "variety": "Improved Lalat",
          "farmer_count": 145,
          "total_quantity_kg": 178000,
          "unit_price_per_kg": 33.2,
          "community_price_per_kg": 35.5,
          "blockchain_contract_id": "0xCUT1M3N4O5P6Q7R",
          "batch_id": "BATCH-CUT-P1-2025-08",
          "expiry_date": "2026-03-20",
          "organic_cert": "Yes",
          "carbon_saved_kg": 5874,
          "ar_model": "improved_lalat_paddy.glb"
        },
        {
          "item_id": "IT-CUT-002",
          "name": "Jute",
          "variety": "JRO-524",
          "farmer_count": 67,
          "total_quantity_kg": 36500,
          "unit_price_per_kg": 52.0,
          "community_price_per_kg": 55.8,
          "blockchain_contract_id": "0xCUT2N4O5P6Q7R8S",
          "batch_id": "BATCH-CUT-J1-2025-07",
          "expiry_date": "2027-01-15",
          "organic_cert": "No",
          "carbon_saved_kg": 1277,
          "ar_model": "jute_jro524.glb"
        }
      ],
      "analytics": {
        "monthly_inflow_tonnes": 312,
        "monthly_outflow_tonnes": 287,
        "avg_price_index": 1.22,
        "turnover_last_3_months_inr": 28700000
      },
      "rating": 4.9,
      "last_inspection_date": "2025-09-17",
      "zomato_partner_enabled": true,
      "delivery_partners": ["Zomato", "GreenDrops", "LocalFleet-Express"],
      "images": ["cuttack_wh_commercial.jpg"],
      "warehouse_3d_asset": "wh_cuttack_3d.glb",
      "qr_code_id": "QR-WH-CUT-001",
      "notes": "Commercial capital, excellent transport connectivity",
      "community_price_votes": [
        {"crop":"Paddy","votes":923,"final_price_per_kg":35.5},
        {"crop":"Jute","votes":412,"final_price_per_kg":55.8}
      ],
      "last_updated": "2025-09-20T15:45:00+05:30"
    },
    
    // KHORDHA DISTRICT (including Bhubaneswar)
    {
      "warehouse_id": "WH-KHO-001",
      "taluk": "Bhubaneswar",
      "district": "Khordha",
      "state": "Odisha",
      "address": "Bhubaneswar Technology Park, Patia",
      "manager": {"name": "Dr. Ashok Kumar Mohanty", "contact": "+91-9437-129001", "uzhavar_pin": "UZP-KHO-001"},
      "capacity_tonnes": 2800,
      "current_occupancy_tonnes": 2456,
      "inventory": [
        {
          "item_id": "IT-KHO-001",
          "name": "Paddy (Naveen)",
          "variety": "Naveen",
          "farmer_count": 167,
          "total_quantity_kg": 195000,
          "unit_price_per_kg": 34.0,
          "community_price_per_kg": 36.5,
          "blockchain_contract_id": "0xKHO1O5P6Q7R8S9T",
          "batch_id": "BATCH-KHO-P1-2025-08",
          "expiry_date": "2026-03-25",
          "organic_cert": "Yes",
          "carbon_saved_kg": 6435,
          "ar_model": "naveen_paddy.glb"
        },
        {
          "item_id": "IT-KHO-002",
          "name": "Vegetables (Mixed)",
          "variety": "Seasonal Mix",
          "farmer_count": 89,
          "total_quantity_kg": 50500,
          "unit_price_per_kg": 25.0,
          "community_price_per_kg": 27.8,
          "blockchain_contract_id": "0xKHO2P6Q7R8S9T0U",
          "batch_id": "BATCH-KHO-V1-2025-09",
          "expiry_date": "2025-10-15",
          "organic_cert": "Partial",
          "carbon_saved_kg": 1767,
          "ar_model": "mixed_vegetables.glb"
        }
      ],
      "analytics": {
        "monthly_inflow_tonnes": 378,
        "monthly_outflow_tonnes": 342,
        "avg_price_index": 1.28,
        "turnover_last_3_months_inr": 35600000
      },
      "rating": 4.9,
      "last_inspection_date": "2025-09-18",
      "zomato_partner_enabled": true,
      "delivery_partners": ["Zomato", "GreenDrops", "LocalFleet-Express", "Swiggy"],
      "images": ["bhubaneswar_wh_tech.jpg"],
      "warehouse_3d_asset": "wh_bhubaneswar_3d.glb",
      "qr_code_id": "QR-WH-KHO-001",
      "notes": "Capital city, tech-enabled smart warehouse",
      "community_price_votes": [
        {"crop":"Paddy","votes":1124,"final_price_per_kg":36.5},
        {"crop":"Vegetables","votes":623,"final_price_per_kg":27.8}
      ],
      "last_updated": "2025-09-20T17:30:00+05:30"
    },
    
    // PURI DISTRICT
    {
      "warehouse_id": "WH-PUR-001",
      "taluk": "Puri",
      "district": "Puri",
      "state": "Odisha",
      "address": "Puri Temple Town Agricultural Zone",
      "manager": {"name": "Jagannath Pradhan", "contact": "+91-9437-130001", "uzhavar_pin": "UZP-PUR-001"},
      "capacity_tonnes": 1700,
      "current_occupancy_tonnes": 1389,
      "inventory": [
        {
          "item_id": "IT-PUR-001",
          "name": "Paddy (Jagannath)",
          "variety": "Jagannath",
          "farmer_count": 98,
          "total_quantity_kg": 115000,
          "unit_price_per_kg": 35.0,
          "community_price_per_kg": 37.5,
          "blockchain_contract_id": "0xPUR1Q7R8S9T0U1V",
          "batch_id": "BATCH-PUR-P1-2025-08",
          "expiry_date": "2026-04-10",
          "organic_cert": "Yes",
          "carbon_saved_kg": 3795,
          "ar_model": "jagannath_paddy.glb"
        },
        {
          "item_id": "IT-PUR-002",
          "name": "Coconut (Fresh)",
          "variety": "Puri Local",
          "farmer_count": 54,
          "total_quantity_kg": 24000,
          "unit_price_per_kg": 12.5,
          "community_price_per_kg": 14.8,
          "blockchain_contract_id": "0xPUR2R8S9T0U1V2W",
          "batch_id": "BATCH-PUR-C1-2025-09",
          "expiry_date": "2025-11-30",
          "organic_cert": "Yes",
          "carbon_saved_kg": 840,
          "ar_model": "coconut_fresh.glb"
        }
      ],
      "analytics": {
        "monthly_inflow_tonnes": 212,
        "monthly_outflow_tonnes": 189,
        "avg_price_index": 1.16,
        "turnover_last_3_months_inr": 19800000
      },
      "rating": 4.6,
      "last_inspection_date": "2025-09-14",
      "zomato_partner_enabled": true,
      "delivery_partners": ["Zomato", "LocalFleet-Express"],
      "images": ["puri_wh_temple.jpg"],
      "warehouse_3d_asset": "wh_puri_3d.glb",
      "qr_code_id": "QR-WH-PUR-001",
      "notes": "Temple town, high-quality organic paddy for prasadam",
      "community_price_votes": [
        {"crop":"Paddy","votes":678,"final_price_per_kg":37.5},
        {"crop":"Coconut","votes":389,"final_price_per_kg":14.8}
      ],
      "last_updated": "2025-09-19T12:45:00+05:30"
    },

    // GANJAM DISTRICT
    {
      "warehouse_id": "WH-GAN-001",
      "taluk": "Berhampur",
      "district": "Ganjam",
      "state": "Odisha",
      "address": "Berhampur Silk City Agricultural Hub",
      "manager": {"name": "Ramesh Chandra Gouda", "contact": "+91-9437-131001", "uzhavar_pin": "UZP-GAN-001"},
      "capacity_tonnes": 2100,
      "current_occupancy_tonnes": 1823,
      "inventory": [
        {
          "item_id": "IT-GAN-001",
          "name": "Paddy (Sarala)",
          "variety": "Sarala",
          "farmer_count": 134,
          "total_quantity_kg": 156000,
          "unit_price_per_kg": 32.8,
          "community_price_per_kg": 35.2,
          "blockchain_contract_id": "0xGAN1S9T0U1V2W3X",
          "batch_id": "BATCH-GAN-P1-2025-08",
          "expiry_date": "2026-03-18",
          "organic_cert": "Yes",
          "carbon_saved_kg": 5148,
          "ar_model": "sarala_paddy.glb"
        },
        {
          "item_id": "IT-GAN-002",
          "name": "Cashew",
          "variety": "Bhaskara",
          "farmer_count": 67,
          "total_quantity_kg": 26500,
          "unit_price_per_kg": 485.0,
          "community_price_per_kg": 512.0,
          "blockchain_contract_id": "0xGAN2T0U1V2W3X4Y",
          "batch_id": "BATCH-GAN-C1-2025-07",
          "expiry_date": "2026-12-31",
          "organic_cert": "Partial",
          "carbon_saved_kg": 927,
          "ar_model": "cashew_bhaskara.glb"
        }
      ],
      "analytics": {
        "monthly_inflow_tonnes": 267,
        "monthly_outflow_tonnes": 243,
        "avg_price_index": 1.21,
        "turnover_last_3_months_inr": 25400000
      },
      "rating": 4.7,
      "last_inspection_date": "2025-09-13",
      "zomato_partner_enabled": true,
      "delivery_partners": ["Zomato", "GreenDrops"],
      "images": ["berhampur_wh_silk.jpg"],
      "warehouse_3d_asset": "wh_berhampur_3d.glb",
      "qr_code_id": "QR-WH-GAN-001",
      "notes": "Silk city, premium cashew processing hub",
      "community_price_votes": [
        {"crop":"Paddy","votes":834,"final_price_per_kg":35.2},
        {"crop":"Cashew","votes":456,"final_price_per_kg":512.0}
      ],
      "last_updated": "2025-09-20T08:30:00+05:30"
    },

    // SAMBALPUR DISTRICT
    {
      "warehouse_id": "WH-SAM-001",
      "taluk": "Sambalpur",
      "district": "Sambalpur",
      "state": "Odisha",
      "address": "Sambalpur Hirakud Dam Area",
      "manager": {"name": "Hirakud Prasad Panda", "contact": "+91-9437-132001", "uzhavar_pin": "UZP-SAM-001"},
      "capacity_tonnes": 1900,
      "current_occupancy_tonnes": 1567,
      "inventory": [
        {
          "item_id": "IT-SAM-001",
          "name": "Paddy (Khandagiri)",
          "variety": "Khandagiri",
          "farmer_count": 112,
          "total_quantity_kg": 134000,
          "unit_price_per_kg": 33.5,
          "community_price_per_kg": 35.8,
          "blockchain_contract_id": "0xSAM1U1V2W3X4Y5Z",
          "batch_id": "BATCH-SAM-P1-2025-08",
          "expiry_date": "2026-03-12",
          "organic_cert": "Yes",
          "carbon_saved_kg": 4422,
          "ar_model": "khandagiri_paddy.glb"
        },
        {
          "item_id": "IT-SAM-002",
          "name": "Millets (Finger)",
          "variety": "Ragi Local",
          "farmer_count": 78,
          "total_quantity_kg": 22500,
          "unit_price_per_kg": 38.0,
          "community_price_per_kg": 41.5,
          "blockchain_contract_id": "0xSAM2V2W3X4Y5Z6A",
          "batch_id": "BATCH-SAM-M1-2025-07",
          "expiry_date": "2027-05-20",
          "organic_cert": "Yes",
          "carbon_saved_kg": 787,
          "ar_model": "finger_millet.glb"
        }
      ],
      "analytics": {
        "monthly_inflow_tonnes": 234,
        "monthly_outflow_tonnes": 209,
        "avg_price_index": 1.14,
        "turnover_last_3_months_inr": 21200000
      },
      "rating": 4.5,
      "last_inspection_date": "2025-09-10",
      "zomato_partner_enabled": false,
      "delivery_partners": ["LocalFleet-Express"],
      "images": ["sambalpur_wh_hirakud.jpg"],
      "warehouse_3d_asset": "wh_sambalpur_3d.glb",
      "qr_code_id": "QR-WH-SAM-001",
      "notes": "Near Hirakud Dam, irrigation-dependent agriculture",
      "community_price_votes": [
        {"crop":"Paddy","votes":756,"final_price_per_kg":35.8},
        {"crop":"Millets","votes":342,"final_price_per_kg":41.5}
      ],
      "last_updated": "2025-09-19T11:15:00+05:30"
    },

    // SUNDARGARH DISTRICT
    {
      "warehouse_id": "WH-SUN-001",
      "taluk": "Rourkela",
      "district": "Sundargarh",
      "state": "Odisha",
      "address": "Rourkela Steel Plant Agricultural Zone",
      "manager": {"name": "Sanjay Kumar Tiwari", "contact": "+91-9437-133001", "uzhavar_pin": "UZP-SUN-001"},
      "capacity_tonnes": 1800,
      "current_occupancy_tonnes": 1445,
      "inventory": [
        {
          "item_id": "IT-SUN-001",
          "name": "Paddy (Sahbhagi Dhan)",
          "variety": "Sahbhagi Dhan",
          "farmer_count": 89,
          "total_quantity_kg": 118000,
          "unit_price_per_kg": 35.2,
          "community_price_per_kg": 37.8,
          "blockchain_contract_id": "0xSUN1W3X4Y5Z6A7B",
          "batch_id": "BATCH-SUN-P1-2025-08",
          "expiry_date": "2026-04-05",
          "organic_cert": "Yes",
          "carbon_saved_kg": 3894,
          "ar_model": "sahbhagi_dhan.glb"
        },
        {
          "item_id": "IT-SUN-002",
          "name": "Mahua Flowers",
          "variety": "Tribal Variety",
          "farmer_count": 156,
          "total_quantity_kg": 26500,
          "unit_price_per_kg": 85.0,
          "community_price_per_kg": 92.5,
          "blockchain_contract_id": "0xSUN2X4Y5Z6A7B8C",
          "batch_id": "BATCH-SUN-M1-2025-06",
          "expiry_date": "2026-10-15",
          "organic_cert": "Yes",
          "carbon_saved_kg": 927,
          "ar_model": "mahua_flowers.glb"
        }
      ],
      "analytics": {
        "monthly_inflow_tonnes": 223,
        "monthly_outflow_tonnes": 198,
        "avg_price_index": 1.17,
        "turnover_last_3_months_inr": 19600000
      },
      "rating": 4.4,
      "last_inspection_date": "2025-09-07",
      "zomato_partner_enabled": false,
      "delivery_partners": ["LocalFleet-Express"],
      "images": ["rourkela_wh_steel.jpg"],
      "warehouse_3d_asset": "wh_rourkela_3d.glb",
      "qr_code_id": "QR-WH-SUN-001",
      "notes": "Industrial town with tribal agricultural produce",
      "community_price_votes": [
        {"crop":"Paddy","votes":567,"final_price_per_kg":37.8},
        {"crop":"Mahua","votes":723,"final_price_per_kg":92.5}
      ],
      "last_updated": "2025-09-18T14:20:00+05:30"
    },

    // MAYURBHANJ DISTRICT
    {
      "warehouse_id": "WH-MAY-001",
      "taluk": "Baripada",
      "district": "Mayurbhanj",
      "state": "Odisha",
      "address": "Baripada Tribal Development Zone",
      "manager": {"name": "Tribhuvan Mahanta", "contact": "+91-9437-134001", "uzhavar_pin": "UZP-MAY-001"},
      "capacity_tonnes": 1600,
      "current_occupancy_tonnes": 1267,
      "inventory": [
        {
          "item_id": "IT-MAY-001",
          "name": "Paddy (Konark)",
          "variety": "Konark",
          "farmer_count": 98,
          "total_quantity_kg": 102000,
          "unit_price_per_kg": 32.0,
          "community_price_per_kg": 34.5,
          "blockchain_contract_id": "0xMAY1Y5Z6A7B8C9D",
          "batch_id": "BATCH-MAY-P1-2025-08",
          "expiry_date": "2026-02-28",
          "organic_cert": "Yes",
          "carbon_saved_kg": 3366,
          "ar_model": "konark_paddy.glb"
        },
        {
          "item_id": "IT-MAY-002",
          "name": "Sal Seeds",
          "variety": "Forest Variety",
          "farmer_count": 234,
          "total_quantity_kg": 24500,
          "unit_price_per_kg": 75.0,
          "community_price_per_kg": 82.0,
          "blockchain_contract_id": "0xMAY2Z6A7B8C9D0E",
          "batch_id": "BATCH-MAY-S1-2025-07",
          "expiry_date": "2026-11-30",
          "organic_cert": "Yes",
          "carbon_saved_kg": 857,
          "ar_model": "sal_seeds.glb"
        }
      ],
      "analytics": {
        "monthly_inflow_tonnes": 189,
        "monthly_outflow_tonnes": 165,
        "avg_price_index": 1.13,
        "turnover_last_3_months_inr": 16700000
      },
      "rating": 4.3,
      "last_inspection_date": "2025-09-06",
      "zomato_partner_enabled": false,
      "delivery_partners": ["LocalFleet-Express"],
      "images": ["baripada_wh_tribal.jpg"],
      "warehouse_3d_asset": "wh_baripada_3d.glb",
      "qr_code_id": "QR-WH-MAY-001",
      "notes": "Tribal area, forest produce collection center",
      "community_price_votes": [
        {"crop":"Paddy","votes":623,"final_price_per_kg":34.5},
        {"crop":"Sal Seeds","votes":892,"final_price_per_kg":82.0}
      ],
      "last_updated": "2025-09-17T09:30:00+05:30"
    },

    // KENDRAPARA DISTRICT
    {
      "warehouse_id": "WH-KEN-001",
      "taluk": "Kendrapara",
      "district": "Kendrapara",
      "state": "Odisha",
      "address": "Kendrapara Coastal Agricultural Area",
      "manager": {"name": "Bhakta Charan Sahoo", "contact": "+91-9437-135001", "uzhavar_pin": "UZP-KEN-001"},
      "capacity_tonnes": 1500,
      "current_occupancy_tonnes": 1178,
      "inventory": [
        {
          "item_id": "IT-KEN-001",
          "name": "Paddy (Pratikshya)",
          "variety": "Pratikshya",
          "farmer_count": 87,
          "total_quantity_kg": 96000,
          "unit_price_per_kg": 33.8,
          "community_price_per_kg": 36.0,
          "blockchain_contract_id": "0xKEN1A7B8C9D0E1F",
          "batch_id": "BATCH-KEN-P1-2025-08",
          "expiry_date": "2026-03-22",
          "organic_cert": "Partial",
          "carbon_saved_kg": 3168,
          "ar_model": "pratikshya_paddy.glb"
        },
        {
          "item_id": "IT-KEN-002",
          "name": "Prawns (Dried)",
          "variety": "Bagda",
          "farmer_count": 45,
          "total_quantity_kg": 21500,
          "unit_price_per_kg": 725.0,
          "community_price_per_kg": 785.0,
          "blockchain_contract_id": "0xKEN2B8C9D0E1F2G",
          "batch_id": "BATCH-KEN-PR1-2025-09",
          "expiry_date": "2026-01-15",
          "organic_cert": "No",
          "carbon_saved_kg": 752,
          "ar_model": "prawns_bagda.glb"
        }
      ],
      "analytics": {
        "monthly_inflow_tonnes": 167,
        "monthly_outflow_tonnes": 148,
        "avg_price_index": 1.19,
        "turnover_last_3_months_inr": 18900000
      },
      "rating": 4.1,
      "last_inspection_date": "2025-09-05",
      "zomato_partner_enabled": true,
      "delivery_partners": ["Zomato", "LocalFleet-Express"],
      "images": ["kendrapara_wh_coastal.jpg"],
      "warehouse_3d_asset": "wh_kendrapara_3d.glb",
      "qr_code_id": "QR-WH-KEN-001",
      "notes": "Coastal area, aquaculture and paddy specialization",
      "community_price_votes": [
        {"crop":"Paddy","votes":534,"final_price_per_kg":36.0},
        {"crop":"Prawns","votes":287,"final_price_per_kg":785.0}
      ],
      "last_updated": "2025-09-19T16:45:00+05:30"
    },
    
    // Add more districts following the same pattern...
    // For brevity, I'll add a few more key districts

    // KORAPUT DISTRICT
    {
      "warehouse_id": "WH-KOR-001",
      "taluk": "Koraput",
      "district": "Koraput",
      "state": "Odisha",
      "address": "Koraput Hill Station Agricultural Center",
      "manager": {"name": "Ramakanta Nayak", "contact": "+91-9437-136001", "uzhavar_pin": "UZP-KOR-001"},
      "capacity_tonnes": 1400,
      "current_occupancy_tonnes": 1089,
      "inventory": [
        {
          "item_id": "IT-KOR-001",
          "name": "Coffee Beans",
          "variety": "Arabica",
          "farmer_count": 67,
          "total_quantity_kg": 18500,
          "unit_price_per_kg": 385.0,
          "community_price_per_kg": 412.0,
          "blockchain_contract_id": "0xKOR1C9D0E1F2G3H",
          "batch_id": "BATCH-KOR-C1-2025-07",
          "expiry_date": "2027-03-15",
          "organic_cert": "Yes",
          "carbon_saved_kg": 647,
          "ar_model": "coffee_arabica.glb"
        },
        {
          "item_id": "IT-KOR-002",
          "name": "Black Pepper",
          "variety": "Panniyur-1",
          "farmer_count": 89,
          "total_quantity_kg": 12500,
          "unit_price_per_kg": 425.0,
          "community_price_per_kg": 458.0,
          "blockchain_contract_id": "0xKOR2D0E1F2G3H4I",
          "batch_id": "BATCH-KOR-BP1-2025-06",
          "expiry_date": "2027-12-31",
          "organic_cert": "Yes",
          "carbon_saved_kg": 437,
          "ar_model": "black_pepper.glb"
        }
      ],
      "analytics": {
        "monthly_inflow_tonnes": 145,
        "monthly_outflow_tonnes": 128,
        "avg_price_index": 1.25,
        "turnover_last_3_months_inr": 14500000
      },
      "rating": 4.6,
      "last_inspection_date": "2025-09-04",
      "zomato_partner_enabled": false,
      "delivery_partners": ["LocalFleet-Express"],
      "images": ["koraput_wh_hills.jpg"],
      "warehouse_3d_asset": "wh_koraput_3d.glb",
      "qr_code_id": "QR-WH-KOR-001",
      "notes": "Hill station, premium coffee and spice cultivation",
      "community_price_votes": [
        {"crop":"Coffee","votes":445,"final_price_per_kg":412.0},
        {"crop":"Black Pepper","votes":623,"final_price_per_kg":458.0}
      ],
      "last_updated": "2025-09-18T12:00:00+05:30"
    },

    // JAGATSINGHPUR DISTRICT
    {
      "warehouse_id": "WH-JAG-001",
      "taluk": "Jagatsinghpur",
      "district": "Jagatsinghpur",
      "state": "Odisha",
      "address": "Jagatsinghpur Industrial Corridor",
      "manager": {"name": "Jogesh Kumar Jena", "contact": "+91-9437-137001", "uzhavar_pin": "UZP-JAG-001"},
      "capacity_tonnes": 1700,
      "current_occupancy_tonnes": 1356,
      "inventory": [
        {
          "item_id": "IT-JAG-001",
          "name": "Paddy (Radha-4)",
          "variety": "Radha-4",
          "farmer_count": 112,
          "total_quantity_kg": 125000,
          "unit_price_per_kg": 34.2,
          "community_price_per_kg": 36.8,
          "blockchain_contract_id": "0xJAG1E1F2G3H4I5J",
          "batch_id": "BATCH-JAG-P1-2025-08",
          "expiry_date": "2026-03-28",
          "organic_cert": "Yes",
          "carbon_saved_kg": 4125,
          "ar_model": "radha4_paddy.glb"
        },
        {
          "item_id": "IT-JAG-002",
          "name": "Betel Leaves",
          "variety": "Desawari",
          "farmer_count": 67,
          "total_quantity_kg": 10500,
          "unit_price_per_kg": 125.0,
          "community_price_per_kg": 135.0,
          "blockchain_contract_id": "0xJAG2F2G3H4I5J6K",
          "batch_id": "BATCH-JAG-B1-2025-09",
          "expiry_date": "2025-10-30",
          "organic_cert": "Yes",
          "carbon_saved_kg": 367,
          "ar_model": "betel_leaves.glb"
        }
      ],
      "analytics": {
        "monthly_inflow_tonnes": 198,
        "monthly_outflow_tonnes": 176,
        "avg_price_index": 1.15,
        "turnover_last_3_months_inr": 17800000
      },
      "rating": 4.4,
      "last_inspection_date": "2025-09-08",
      "zomato_partner_enabled": true,
      "delivery_partners": ["Zomato", "LocalFleet-Express"],
      "images": ["jagatsinghpur_wh_industrial.jpg"],
      "warehouse_3d_asset": "wh_jagatsinghpur_3d.glb",
      "qr_code_id": "QR-WH-JAG-001",
      "notes": "Industrial corridor, betel leaf specialty",
      "community_price_votes": [
        {"crop":"Paddy","votes":678,"final_price_per_kg":36.8},
        {"crop":"Betel Leaves","votes":445,"final_price_per_kg":135.0}
      ],
      "last_updated": "2025-09-20T14:15:00+05:30"
    }
  ]
};

export type OdishaWarehouse = typeof odishaWarehousesData.warehouses[0];
export type OdishaInventoryItem = OdishaWarehouse['inventory'][0];
export type OdishaCommunityVote = OdishaWarehouse['community_price_votes'][0];

// Predictive Analytics Data for Odisha Warehouses
export const odishaPredictiveData = {
  "predictions": [
    {
      "warehouse_id": "WH-ANG-001",
      "high_demand_crops": [
        {"crop": "Paddy", "predicted_demand_kg": 4500, "confidence": 87, "price_trend": "increasing"},
        {"crop": "Groundnut", "predicted_demand_kg": 2200, "confidence": 82, "price_trend": "stable"}
      ],
      "stock_alerts": [
        {"crop": "Paddy", "days_until_stockout": 18, "urgency": "medium"},
        {"crop": "Groundnut", "days_until_stockout": 25, "urgency": "low"}
      ],
      "suggested_prices": {
        "Paddy": 34.5,
        "Groundnut": 122.0
      }
    },
    {
      "warehouse_id": "WH-BAL-001",
      "high_demand_crops": [
        {"crop": "Paddy", "predicted_demand_kg": 5800, "confidence": 91, "price_trend": "increasing"},
        {"crop": "Turmeric", "predicted_demand_kg": 1200, "confidence": 78, "price_trend": "increasing"}
      ],
      "stock_alerts": [
        {"crop": "Paddy", "days_until_stockout": 22, "urgency": "medium"},
        {"crop": "Turmeric", "days_until_stockout": 45, "urgency": "low"}
      ],
      "suggested_prices": {
        "Paddy": 33.8,
        "Turmeric": 172.0
      }
    },
    {
      "warehouse_id": "WH-CUT-001",
      "high_demand_crops": [
        {"crop": "Paddy", "predicted_demand_kg": 8900, "confidence": 94, "price_trend": "increasing"},
        {"crop": "Jute", "predicted_demand_kg": 2800, "confidence": 85, "price_trend": "stable"}
      ],
      "stock_alerts": [
        {"crop": "Paddy", "days_until_stockout": 28, "urgency": "medium"},
        {"crop": "Jute", "days_until_stockout": 35, "urgency": "low"}
      ],
      "suggested_prices": {
        "Paddy": 35.5,
        "Jute": 55.8
      }
    },
    {
      "warehouse_id": "WH-KHO-001",
      "high_demand_crops": [
        {"crop": "Paddy", "predicted_demand_kg": 12500, "confidence": 96, "price_trend": "increasing"},
        {"crop": "Vegetables", "predicted_demand_kg": 8900, "confidence": 88, "price_trend": "stable"}
      ],
      "stock_alerts": [
        {"crop": "Paddy", "days_until_stockout": 32, "urgency": "low"},
        {"crop": "Vegetables", "days_until_stockout": 8, "urgency": "high"}
      ],
      "suggested_prices": {
        "Paddy": 36.5,
        "Vegetables": 27.8
      }
    }
  ]
};

// Call Support Numbers for Odisha
export const odishaCallSupport = {
  "warehouse_support": "+91-9437-100-000",
  "farmer_helpline": "+91-9437-100-001", 
  "consumer_support": "+91-9437-100-002",
  "emergency_hotline": "+91-9437-100-911",
  "quality_assurance": "+91-9437-100-003",
  "logistics_coordination": "+91-9437-100-004"
};