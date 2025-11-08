export const warehousesData = {
  "warehouses": [
    {
      "warehouse_id": "WH-TLK-001",
      "taluk": "Maduravoyal",
      "district": "Chennai",
      "state": "Tamil Nadu",
      "address": "Sector 4 Agricultural Park, Maduravoyal Taluk",
      "manager": {"name": "R. Kumar", "contact": "+91-9XX-XXXXXXX", "uzhavar_pin": "UZP-00001"},
      "capacity_tonnes": 1200,
      "current_occupancy_tonnes": 842,
      "inventory": [
        {
          "item_id": "IT-MAD-001",
          "name": "Raw Rice (Samba)",
          "variety": "Samba Masuri",
          "farmer_count": 54,
          "total_quantity_kg": 120000,
          "unit_price_per_kg": 28.5,
          "community_price_per_kg": 30.0,
          "blockchain_contract_id": "0xA1b2C3MAD001",
          "batch_id": "BATCH-MAD-R1-2025-07",
          "expiry_date": "2026-01-10",
          "organic_cert": "Yes",
          "carbon_saved_kg": 3200,
          "ar_model": "samba_rice.glb"
        },
        {
          "item_id": "IT-MAD-002",
          "name": "Tomato (Fresh)",
          "variety": "Roma",
          "farmer_count": 28,
          "total_quantity_kg": 18500,
          "unit_price_per_kg": 22.0,
          "community_price_per_kg": 22.0,
          "blockchain_contract_id": "0xA1b2C3MAD002",
          "batch_id": "BATCH-MAD-T1-2025-08",
          "expiry_date": "2025-10-10",
          "organic_cert": "No",
          "carbon_saved_kg": 420,
          "ar_model": "tomato_roma.glb"
        },
        {
          "item_id": "IT-MAD-003",
          "name": "Red Chillies (Dried)",
          "variety": "Guntur",
          "farmer_count": 14,
          "total_quantity_kg": 4800,
          "unit_price_per_kg": 145.0,
          "community_price_per_kg": 150.0,
          "blockchain_contract_id": "0xA1b2C3MAD003",
          "batch_id": "BATCH-MAD-C1-2025-06",
          "expiry_date": "2027-02-01",
          "organic_cert": "Yes",
          "carbon_saved_kg": 180,
          "ar_model": "red_chilli.glb"
        }
      ],
      "analytics": {
        "monthly_inflow_tonnes": 210,
        "monthly_outflow_tonnes": 176,
        "avg_price_index": 1.04,
        "turnover_last_3_months_inr": 12500000
      },
      "rating": 4.6,
      "last_inspection_date": "2025-08-14",
      "zomato_partner_enabled": true,
      "delivery_partners": ["Zomato", "LocalFleet-Express"],
      "images": ["maduravoyal_wh_front.jpg", "maduravoyal_interior_3d.png"],
      "warehouse_3d_asset": "wh_maduravoyal_3d.glb",
      "qr_code_id": "QR-WH-TLK-001",
      "notes": "Cold-room for tomatoes. Priority for local market delivery.",
      "community_price_votes": [
        {"crop":"Raw Rice","votes":420,"final_price_per_kg":30.0},
        {"crop":"Tomato","votes":310,"final_price_per_kg":22.0}
      ],
      "last_updated": "2025-09-18T09:35:00+05:30"
    },
    {
      "warehouse_id": "WH-TLK-002",
      "taluk": "Sairam",
      "district": "Tiruvallur",
      "state": "Tamil Nadu",
      "address": "Sairam Taluk Agro Hub, Main Rd",
      "manager": {"name": "Meena R.", "contact": "+91-9XX-XXXXXXX", "uzhavar_pin": "UZP-00002"},
      "capacity_tonnes": 950,
      "current_occupancy_tonnes": 603,
      "inventory": [
        {
          "item_id": "IT-SAI-001",
          "name": "Millet (Ragi)",
          "variety": "Finger Millet",
          "farmer_count": 36,
          "total_quantity_kg": 75000,
          "unit_price_per_kg": 35.0,
          "community_price_per_kg": 36.0,
          "blockchain_contract_id": "0xSaI2C3SAI001",
          "batch_id": "BATCH-SAI-R1-2025-05",
          "expiry_date": "2027-03-12",
          "organic_cert": "Yes",
          "carbon_saved_kg": 1100,
          "ar_model": "ragi_finger.glb"
        },
        {
          "item_id": "IT-SAI-002",
          "name": "Coconut (Dried Copra)",
          "variety": "Tall",
          "farmer_count": 12,
          "total_quantity_kg": 9200,
          "unit_price_per_kg": 55.0,
          "community_price_per_kg": 57.0,
          "blockchain_contract_id": "0xSaI2C3SAI002",
          "batch_id": "BATCH-SAI-C1-2025-04",
          "expiry_date": "2026-09-30",
          "organic_cert": "No",
          "carbon_saved_kg": 320,
          "ar_model": "coconut_copra.glb"
        }
      ],
      "analytics": {
        "monthly_inflow_tonnes": 140,
        "monthly_outflow_tonnes": 123,
        "avg_price_index": 0.98,
        "turnover_last_3_months_inr": 4600000
      },
      "rating": 4.3,
      "last_inspection_date": "2025-09-01",
      "zomato_partner_enabled": false,
      "delivery_partners": ["LocalFleet-Express"],
      "images": ["sairam_wh_front.jpg"],
      "warehouse_3d_asset": "wh_sairam_3d.glb",
      "qr_code_id": "QR-WH-TLK-002",
      "notes": "Good storage for dry goods; add more ventilation for copra.",
      "community_price_votes": [
        {"crop":"Ragi","votes":210,"final_price_per_kg":36.0}
      ],
      "last_updated": "2025-09-19T07:20:00+05:30"
    },
    {
      "warehouse_id": "WH-TLK-003",
      "taluk": "Kanchipuram North",
      "district": "Kanchipuram",
      "state": "Tamil Nadu",
      "address": "Kanchipuram North Warehouse Complex",
      "manager": {"name": "S. Latha", "contact": "+91-9XX-XXXXXXX", "uzhavar_pin": "UZP-00003"},
      "capacity_tonnes": 1500,
      "current_occupancy_tonnes": 1498,
      "inventory": [
        {
          "item_id": "IT-KAN-001",
          "name": "Organic Turmeric (Powder)",
          "variety": "Madurai",
          "farmer_count": 22,
          "total_quantity_kg": 21200,
          "unit_price_per_kg": 180.0,
          "community_price_per_kg": 185.0,
          "blockchain_contract_id": "0xKAN3C3KAN001",
          "batch_id": "BATCH-KAN-T1-2025-03",
          "expiry_date": "2027-12-31",
          "organic_cert": "Yes",
          "carbon_saved_kg": 600,
          "ar_model": "turmeric_powder.glb"
        },
        {
          "item_id": "IT-KAN-002",
          "name": "Banana (Cavendish)",
          "variety": "Cavendish",
          "farmer_count": 40,
          "total_quantity_kg": 60000,
          "unit_price_per_kg": 22.0,
          "community_price_per_kg": 23.5,
          "blockchain_contract_id": "0xKAN3C3KAN002",
          "batch_id": "BATCH-KAN-B1-2025-08",
          "expiry_date": "2025-11-10",
          "organic_cert": "No",
          "carbon_saved_kg": 900,
          "ar_model": "banana_cavendish.glb"
        }
      ],
      "analytics": {
        "monthly_inflow_tonnes": 320,
        "monthly_outflow_tonnes": 315,
        "avg_price_index": 1.12,
        "turnover_last_3_months_inr": 28600000
      },
      "rating": 4.8,
      "last_inspection_date": "2025-09-10",
      "zomato_partner_enabled": true,
      "delivery_partners": ["Zomato", "GreenDrops"],
      "images": ["kanchipuram_wh_outside.jpg"],
      "warehouse_3d_asset": "wh_kanchipuram_3d.glb",
      "qr_code_id": "QR-WH-TLK-003",
      "notes": "High demand for organic turmeric; maintain temp control.",
      "community_price_votes": [
        {"crop":"Turmeric","votes":520,"final_price_per_kg":185.0},
        {"crop":"Banana","votes":410,"final_price_per_kg":23.5}
      ],
      "last_updated": "2025-09-19T20:05:00+05:30"
    },
    {
      "warehouse_id": "WH-TLK-004",
      "taluk": "Coimbatore North",
      "district": "Coimbatore",
      "state": "Tamil Nadu",
      "address": "Coimbatore Agro Hub, NH Bypass",
      "manager": {"name": "Arjun M.", "contact": "+91-9XX-XXXXXXX", "uzhavar_pin": "UZP-00004"},
      "capacity_tonnes": 2000,
      "current_occupancy_tonnes": 1375,
      "inventory": [
        {
          "item_id": "IT-COI-001",
          "name": "Coffee Beans (Robusta)",
          "variety": "Robusta",
          "farmer_count": 48,
          "total_quantity_kg": 42000,
          "unit_price_per_kg": 220.0,
          "community_price_per_kg": 225.0,
          "blockchain_contract_id": "0xCOI4C3COI001",
          "batch_id": "BATCH-COI-CB1-2025-06",
          "expiry_date": "2027-06-10",
          "organic_cert": "Partial",
          "carbon_saved_kg": 1500,
          "ar_model": "coffee_robusta.glb"
        },
        {
          "item_id": "IT-COI-002",
          "name": "Cocoa (Raw)",
          "variety": "Criollo",
          "farmer_count": 10,
          "total_quantity_kg": 7200,
          "unit_price_per_kg": 320.0,
          "community_price_per_kg": 330.0,
          "blockchain_contract_id": "0xCOI4C3COI002",
          "batch_id": "BATCH-COI-CO1-2025-05",
          "expiry_date": "2026-12-01",
          "organic_cert": "No",
          "carbon_saved_kg": 760,
          "ar_model": "cocoa_raw.glb"
        }
      ],
      "analytics": {
        "monthly_inflow_tonnes": 420,
        "monthly_outflow_tonnes": 395,
        "avg_price_index": 1.18,
        "turnover_last_3_months_inr": 35200000
      },
      "rating": 4.5,
      "last_inspection_date": "2025-09-05",
      "zomato_partner_enabled": false,
      "delivery_partners": ["GreenDrops", "LocalFleet-Express"],
      "images": ["coimbatore_wh_internal.jpg"],
      "warehouse_3d_asset": "wh_coimbatore_3d.glb",
      "qr_code_id": "QR-WH-TLK-004",
      "notes": "Coffee roast partner nearby; arrange cold storage for cocoa.",
      "community_price_votes": [
        {"crop":"Coffee","votes":380,"final_price_per_kg":225.0}
      ],
      "last_updated": "2025-09-18T12:10:00+05:30"
    },
    {
      "warehouse_id": "WH-TLK-005",
      "taluk": "Salem Central",
      "district": "Salem",
      "state": "Tamil Nadu",
      "address": "Salem Central Warehouse, Industrial Road",
      "manager": {"name": "Dilip P.", "contact": "+91-9XX-XXXXXXX", "uzhavar_pin": "UZP-00005"},
      "capacity_tonnes": 1100,
      "current_occupancy_tonnes": 310,
      "inventory": [
        {
          "item_id": "IT-SLM-001",
          "name": "Black Gram (Urad)",
          "variety": "Urad Local",
          "farmer_count": 30,
          "total_quantity_kg": 25500,
          "unit_price_per_kg": 95.0,
          "community_price_per_kg": 98.0,
          "blockchain_contract_id": "0xSLM5C3SLM001",
          "batch_id": "BATCH-SLM-U1-2025-07",
          "expiry_date": "2026-07-01",
          "organic_cert": "No",
          "carbon_saved_kg": 480,
          "ar_model": "urad_blackgram.glb"
        }
      ],
      "analytics": {
        "monthly_inflow_tonnes": 95,
        "monthly_outflow_tonnes": 82,
        "avg_price_index": 1.00,
        "turnover_last_3_months_inr": 8200000
      },
      "rating": 4.0,
      "last_inspection_date": "2025-08-30",
      "zomato_partner_enabled": false,
      "delivery_partners": ["LocalFleet-Express"],
      "images": ["salem_wh_front.jpg"],
      "warehouse_3d_asset": "wh_salem_3d.glb",
      "qr_code_id": "QR-WH-TLK-005",
      "notes": "Expandable racking available, recommended for pulses.",
      "community_price_votes": [
        {"crop":"Black Gram","votes":140,"final_price_per_kg":98.0}
      ],
      "last_updated": "2025-09-17T08:50:00+05:30"
    },
    {
      "warehouse_id": "WH-TLK-006",
      "taluk": "Erode East",
      "district": "Erode",
      "state": "Tamil Nadu",
      "address": "Erode East Farmer Warehouse, Canal Road",
      "manager": {"name": "V. Anand", "contact": "+91-9XX-XXXXXXX", "uzhavar_pin": "UZP-00006"},
      "capacity_tonnes": 800,
      "current_occupancy_tonnes": 520,
      "inventory": [
        {
          "item_id": "IT-ERD-001",
          "name": "Groundnut (Shelled)",
          "variety": "Spanish",
          "farmer_count": 20,
          "total_quantity_kg": 42000,
          "unit_price_per_kg": 120.0,
          "community_price_per_kg": 122.0,
          "blockchain_contract_id": "0xERD6C3ERD001",
          "batch_id": "BATCH-ERD-G1-2025-07",
          "expiry_date": "2026-05-01",
          "organic_cert": "Partial",
          "carbon_saved_kg": 720,
          "ar_model": "groundnut_shelled.glb"
        }
      ],
      "analytics": {
        "monthly_inflow_tonnes": 65,
        "monthly_outflow_tonnes": 58,
        "avg_price_index": 0.97,
        "turnover_last_3_months_inr": 7200000
      },
      "rating": 4.2,
      "last_inspection_date": "2025-09-07",
      "zomato_partner_enabled": false,
      "delivery_partners": ["LocalFleet-Express"],
      "images": ["erode_wh_inside.jpg"],
      "warehouse_3d_asset": "wh_erode_3d.glb",
      "qr_code_id": "QR-WH-TLK-006",
      "notes": "Secure dry storage; plan inventory push for groundnut oil producers.",
      "community_price_votes": [
        {"crop":"Groundnut","votes":260,"final_price_per_kg":122.0}
      ],
      "last_updated": "2025-09-15T14:44:00+05:30"
    },
    {
      "warehouse_id": "WH-TLK-007",
      "taluk": "Tiruppur West",
      "district": "Tiruppur",
      "state": "Tamil Nadu",
      "address": "Tiruppur West Agro Storage",
      "manager": {"name": "Hema S.", "contact": "+91-9XX-XXXXXXX", "uzhavar_pin": "UZP-00007"},
      "capacity_tonnes": 700,
      "current_occupancy_tonnes": 375,
      "inventory": [
        {
          "item_id": "IT-TIR-001",
          "name": "Onion (Red)",
          "variety": "Red Sambar",
          "farmer_count": 34,
          "total_quantity_kg": 31500,
          "unit_price_per_kg": 16.0,
          "community_price_per_kg": 16.5,
          "blockchain_contract_id": "0xTIR7C3TIR001",
          "batch_id": "BATCH-TIR-O1-2025-08",
          "expiry_date": "2026-02-01",
          "organic_cert": "No",
          "carbon_saved_kg": 520,
          "ar_model": "onion_red.glb"
        }
      ],
      "analytics": {
        "monthly_inflow_tonnes": 105,
        "monthly_outflow_tonnes": 98,
        "avg_price_index": 0.92,
        "turnover_last_3_months_inr": 4900000
      },
      "rating": 4.1,
      "last_inspection_date": "2025-09-12",
      "zomato_partner_enabled": true,
      "delivery_partners": ["Zomato", "GreenDrops"],
      "images": ["tiruppur_wh_exterior.jpg"],
      "warehouse_3d_asset": "wh_tiruppur_3d.glb",
      "qr_code_id": "QR-WH-TLK-007",
      "notes": "High turnover; maintain humidity control during monsoon.",
      "community_price_votes": [
        {"crop":"Onion","votes":300,"final_price_per_kg":16.5}
      ],
      "last_updated": "2025-09-18T18:03:00+05:30"
    },
    {
      "warehouse_id": "WH-TLK-008",
      "taluk": "Vellore South",
      "district": "Vellore",
      "state": "Tamil Nadu",
      "address": "Vellore South Agro Centre",
      "manager": {"name": "Lakshmi R.", "contact": "+91-9XX-XXXXXXX", "uzhavar_pin": "UZP-00008"},
      "capacity_tonnes": 500,
      "current_occupancy_tonnes": 212,
      "inventory": [
        {
          "item_id": "IT-VEL-001",
          "name": "Mango (Alphonso - Processed)",
          "variety": "Alphonso",
          "farmer_count": 15,
          "total_quantity_kg": 12000,
          "unit_price_per_kg": 250.0,
          "community_price_per_kg": 255.0,
          "blockchain_contract_id": "0xVEL8C3VEL001",
          "batch_id": "BATCH-VEL-M1-2025-06",
          "expiry_date": "2026-03-15",
          "organic_cert": "No",
          "carbon_saved_kg": 340,
          "ar_model": "mango_alphonso.glb"
        }
      ],
      "analytics": {
        "monthly_inflow_tonnes": 40,
        "monthly_outflow_tonnes": 36,
        "avg_price_index": 1.06,
        "turnover_last_3_months_inr": 9000000
      },
      "rating": 4.4,
      "last_inspection_date": "2025-09-03",
      "zomato_partner_enabled": true,
      "delivery_partners": ["Zomato", "LocalFleet-Express"],
      "images": ["vellore_wh_store.jpg"],
      "warehouse_3d_asset": "wh_vellore_3d.glb",
      "qr_code_id": "QR-WH-TLK-008",
      "notes": "Good for processed fruit; plan cross-promo with regional sweet makers.",
      "community_price_votes": [
        {"crop":"Mango","votes":180,"final_price_per_kg":255.0}
      ],
      "last_updated": "2025-09-16T09:05:00+05:30"
    }
  ]
};

export type Warehouse = typeof warehousesData.warehouses[0];
export type InventoryItem = Warehouse['inventory'][0];
export type CommunityVote = Warehouse['community_price_votes'][0];