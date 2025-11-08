import { User } from '../types/user';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  type: 'message' | 'function_call';
  content?: string;
  action?: string;
  params?: any;
  confidence?: number;
}

export interface FunctionResult {
  success: boolean;
  message: string;
  data?: any;
}

// Enhanced role-specific capabilities with more context
const roleCapabilities = {
  farmer: {
    functions: [
      'create_payment', 'send_notification', 'update_ledger', 'fetch_crop_advice', 'generate_qr',
      'get_weather_forecast', 'check_market_prices', 'track_shipment', 'find_warehouse',
      'check_subsidy_eligibility', 'get_farmer_info', 'schedule_delivery', 'report_issue'
    ],
    context: 'farming, agriculture, crops, weather, soil, government schemes, subsidies, payments, ledger, harvest, irrigation, pest control',
    knowledgeBase: [
      'Rice cultivation requires 120-150 days',
      'Wheat is best planted in October-November',
      'Government provides MSP (Minimum Support Price) for major crops',
      'PM-KISAN scheme provides ₹6000 per year to farmers',
      'Soil testing should be done before planting',
      'Crop rotation improves soil fertility'
    ]
  },
  consumer: {
    functions: [
      'create_payment', 'send_notification', 'track_order', 'search_products',
      'get_order_status', 'find_farmer', 'check_carbon_footprint', 'get_product_info',
      'schedule_delivery', 'cancel_order', 'get_receipt'
    ],
    context: 'shopping, products, orders, delivery, tracking, carbon footprint, payments, organic food, local produce',
    knowledgeBase: [
      'Organic products have lower carbon footprint',
      'Local produce is fresher and supports farmers',
      'QR codes help track product origin',
      'Seasonal vegetables are more nutritious'
    ]
  },
  warehouse: {
    functions: [
      'send_notification', 'update_ledger', 'check_inventory', 'get_warehouse_stats',
      'track_product_movement', 'schedule_pickup', 'update_storage_conditions',
      'generate_report', 'find_farmer', 'get_product_info'
    ],
    context: 'inventory, storage, product movement, logistics, warehouse operations, temperature control, quality check',
    knowledgeBase: [
      'Optimal storage temperature for grains: 15-20°C',
      'Humidity should be below 60% for most crops',
      'FIFO (First In First Out) ensures freshness',
      'Regular inventory audits prevent losses'
    ]
  },
  admin: {
    functions: [
      'create_payment', 'send_notification', 'update_ledger', 'fetch_crop_advice', 'generate_qr',
      'get_analytics', 'get_user_stats', 'view_transactions', 'manage_users',
      'generate_report', 'system_health_check', 'view_logs'
    ],
    context: 'system administration, user management, analytics, monitoring, reports, transactions, security',
    knowledgeBase: [
      'System monitoring helps prevent issues',
      'User analytics provide insights',
      'Regular backups are essential',
      'Security audits should be monthly'
    ]
  }
};

// Enhanced function handlers with better simulation
const functionHandlers: Record<string, (params: any, user: User, role: string) => Promise<FunctionResult>> = {
  create_payment: async (params, user, role) => {
    // Validate required parameters
    if (!params.amount_inr || params.amount_inr <= 0) {
      return {
        success: false,
        message: 'Please specify a valid amount for the payment.'
      };
    }

    // Simulate payment processing with realistic delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const timestamp = new Date().toISOString();
    
    // Store transaction in localStorage for demo
    try {
      const transactions = JSON.parse(localStorage.getItem('greenledger-transactions') || '[]');
      transactions.push({
        id: transactionId,
        userId: user.id,
        uzhavar_id: params.uzhavar_id || user.id,
        amount: params.amount_inr,
        purpose: params.purpose,
        status: 'completed',
        timestamp,
        user: user.name
      });
      localStorage.setItem('greenledger-transactions', JSON.stringify(transactions));
    } catch (e) {
      console.warn('Failed to save transaction:', e);
    }

    return {
      success: true,
      message: `✅ Payment of ₹${params.amount_inr.toLocaleString()} for ${params.purpose || 'general payment'} has been processed successfully.\n\nTransaction ID: ${transactionId}\nTime: ${new Date(timestamp).toLocaleString()}\n\nYour payment has been recorded in the ledger.`,
      data: { 
        transactionId, 
        amount: params.amount_inr, 
        purpose: params.purpose,
        timestamp,
        status: 'completed'
      }
    };
  },

  send_notification: async (params, user, role) => {
    if (!params.message || params.message.trim().length === 0) {
      return {
        success: false,
        message: 'Please provide a message to send.'
      };
    }

    await new Promise(resolve => setTimeout(resolve, 800));
    
    const notificationId = `NOTIF${Date.now()}`;
    
    // Store notification
    try {
      const notifications = JSON.parse(localStorage.getItem('greenledger-notifications') || '[]');
      notifications.push({
        id: notificationId,
        userId: params.uzhavar_id || user.id,
        message: params.message,
        timestamp: new Date().toISOString(),
        read: false
      });
      localStorage.setItem('greenledger-notifications', JSON.stringify(notifications));
    } catch (e) {
      console.warn('Failed to save notification:', e);
    }

    return {
      success: true,
      message: `✅ Notification sent successfully to ${params.uzhavar_id || user.name || 'user'}.\n\nMessage: "${params.message}"\n\nNotification ID: ${notificationId}`,
      data: { notificationId, message: params.message }
    };
  },

  update_ledger: async (params, user, role) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate realistic blockchain hash
    const ledgerHash = `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const blockNumber = Math.floor(Math.random() * 1000000) + 1000000;
    
    // Store ledger entry
    try {
      const ledgerEntries = JSON.parse(localStorage.getItem('greenledger-ledger') || '[]');
      ledgerEntries.push({
        hash: ledgerHash,
        userId: user.id,
        uzhavar_id: params.uzhavar_id || user.id,
        type: params.type || 'transaction',
        data: params.data,
        blockNumber,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('greenledger-ledger', JSON.stringify(ledgerEntries));
    } catch (e) {
      console.warn('Failed to save ledger entry:', e);
    }

    return {
      success: true,
      message: `✅ Ledger updated successfully!\n\nBlock Hash: ${ledgerHash}\nBlock Number: ${blockNumber}\nType: ${params.type || 'transaction'}\n\nThis entry has been permanently recorded on the blockchain.`,
      data: { hash: ledgerHash, blockNumber, type: params.type }
    };
  },

  fetch_crop_advice: async (params, user, role) => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const location = params.location || user.state || user.district || 'your region';
    const season = params.season || getCurrentSeason();
    
    // Generate contextual crop advice based on season and location
    const seasonAdvice: Record<string, string> = {
      summer: 'Focus on heat-tolerant crops like okra, brinjal, and gourds. Ensure adequate irrigation.',
      monsoon: 'Perfect for rice, maize, and pulses. Monitor for waterlogging and pests.',
      autumn: 'Ideal for wheat, mustard, and vegetables. Prepare soil with organic matter.',
      winter: 'Best for wheat, barley, and winter vegetables. Protect from frost.'
    };

    const cropsBySeason: Record<string, string[]> = {
      summer: ['Rice', 'Maize', 'Cotton', 'Sugarcane', 'Vegetables'],
      monsoon: ['Rice', 'Pulses', 'Oilseeds', 'Cotton'],
      autumn: ['Wheat', 'Mustard', 'Potato', 'Onion', 'Vegetables'],
      winter: ['Wheat', 'Barley', 'Peas', 'Carrots', 'Cauliflower']
    };

    const recommendedCrops = cropsBySeason[season] || ['Rice', 'Wheat', 'Vegetables'];
    
    const advice = `🌾 **Crop Advice for ${location}** (${season} season)

**Recommended Crops:**
${recommendedCrops.map(crop => `• ${crop}`).join('\n')}

**Seasonal Guidance:**
${seasonAdvice[season] || 'Plan your crops based on local weather patterns and soil conditions.'}

**Optimal Planting Window:** Next 2-3 weeks
**Expected Weather:** ${getWeatherForecast(season)}
**Soil Condition:** Good for cultivation (recommend soil test for specific nutrients)

**Additional Tips:**
• Ensure proper irrigation before planting
• Use certified seeds for better yield
• Apply organic fertilizers for sustainable farming
• Monitor for pests and diseases regularly

Would you like detailed advice for any specific crop?`;

    return {
      success: true,
      message: advice,
      data: { 
        location, 
        season, 
        recommendedCrops,
        plantingWindow: 'Next 2-3 weeks'
      }
    };
  },

  generate_qr: async (params, user, role) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const qrCode = `${user.uzhavarPin || user.id || 'USER'}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const dataType = params.data_type || 'farmer_identity';
    
    // Store QR code
    try {
      const qrCodes = JSON.parse(localStorage.getItem('greenledger-qrcodes') || '[]');
      qrCodes.push({
        code: qrCode,
        userId: user.id,
        uzhavar_id: user.id,
        dataType,
        timestamp: new Date().toISOString(),
        user: user.name
      });
      localStorage.setItem('greenledger-qrcodes', JSON.stringify(qrCodes));
    } catch (e) {
      console.warn('Failed to save QR code:', e);
    }

    return {
      success: true,
      message: `✅ QR Code generated successfully!\n\n**QR Code:** ${qrCode}\n**Type:** ${dataType}\n**User:** ${user.name}\n\nThis QR code can be used for digital identity verification and product tracking.`,
      data: { qrCode, dataType, userId: user.id }
    };
  },

  // New functions for farmers
  get_weather_forecast: async (params, user, role) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const location = params.location || user.state || user.district || 'your region';
    const season = getCurrentSeason();
    
    return {
      success: true,
      message: `🌤️ **Weather Forecast for ${location}**\n\n**Today:**\n• Temperature: ${getTemperatureRange(season)}\n• Condition: ${getWeatherForecast(season)}\n• Rainfall: ${getRainfallInfo(season)}\n• Humidity: 65-75%\n\n**Next 3 Days:**\n• Day 1: Moderate temperature, light showers expected\n• Day 2: Clear skies, ideal for farming activities\n• Day 3: Cloudy with chance of rain\n\n**Farming Recommendations:**\n${getSeasonalFarmingTips(season)}\n\nWould you like detailed crop advice based on this forecast?`,
      data: { location, season, forecast: getWeatherForecast(season) }
    };
  },

  check_market_prices: async (params, user, role) => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    const crop = params.crop || 'Rice';
    
    const prices: Record<string, { msp: number; market: number }> = {
      'rice': { msp: 2040, market: 2200 },
      'wheat': { msp: 2015, market: 2150 },
      'maize': { msp: 1870, market: 1950 },
      'cotton': { msp: 6080, market: 6200 },
      'sugarcane': { msp: 2900, market: 3100 }
    };
    
    const cropKey = crop.toLowerCase();
    const priceData = prices[cropKey] || prices['rice'];
    
    return {
      success: true,
      message: `💰 **Market Prices for ${crop}**\n\n**MSP (Minimum Support Price):** ₹${priceData.msp}/quintal\n**Current Market Price:** ₹${priceData.market}/quintal\n**Price Difference:** ₹${priceData.market - priceData.msp}/quintal (${((priceData.market - priceData.msp) / priceData.msp * 100).toFixed(1)}% above MSP)\n\n**Market Status:** ${priceData.market > priceData.msp ? 'Good - Above MSP' : 'Below MSP - Consider selling to government'}\n\n**Recommendation:** ${priceData.market > priceData.msp ? 'You can sell in open market for better price' : 'Consider selling to government at MSP for guaranteed price'}`,
      data: { crop, msp: priceData.msp, marketPrice: priceData.market }
    };
  },

  track_shipment: async (params, user, role) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const trackingId = params.tracking_id || `TRK${Date.now()}`;
    
    return {
      success: true,
      message: `📦 **Shipment Tracking**\n\n**Tracking ID:** ${trackingId}\n**Status:** In Transit\n**Current Location:** Warehouse Hub, ${user.district || 'District'}\n**Estimated Delivery:** ${new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}\n\n**Timeline:**\n• ✅ Picked up from farm - ${new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString()}\n• 🚚 In transit to warehouse - ${new Date().toLocaleDateString()}\n• ⏳ Arriving at warehouse - Tomorrow\n• 📍 Out for delivery - ${new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}\n\nYour shipment is on track! Would you like live location updates?`,
      data: { trackingId, status: 'in_transit', estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() }
    };
  },

  find_warehouse: async (params, user, role) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const location = params.location || user.district || user.state || 'your area';
    
    return {
      success: true,
      message: `🏭 **Warehouses Near ${location}**\n\n**Available Warehouses:**\n\n1. **GreenLedger Warehouse Hub - ${user.district || 'District'}**\n   • Capacity: 5000 tons\n   • Occupancy: 75%\n   • Distance: 15 km\n   • Contact: +91-99999-00002\n\n2. **Regional Storage Center**\n   • Capacity: 3000 tons\n   • Occupancy: 60%\n   • Distance: 25 km\n   • Contact: +91-99999-00003\n\n3. **Local Collection Point**\n   • Capacity: 1000 tons\n   • Occupancy: 40%\n   • Distance: 8 km\n   • Contact: +91-99999-00004\n\n**Recommendation:** GreenLedger Warehouse Hub is closest and has good capacity.\n\nWould you like to schedule a delivery?`,
      data: { location, warehouses: 3 }
    };
  },

  check_subsidy_eligibility: async (params, user, role) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: `🏛️ **Subsidy Eligibility Check**\n\n**Your Eligibility Status:** ✅ Eligible\n\n**Available Schemes:**\n\n1. **PM-KISAN**\n   • Status: ✅ Eligible\n   • Amount: ₹6000/year\n   • Next Installment: Next month\n   • Application: Already registered\n\n2. **Crop Insurance (Pradhan Mantri Fasal Bima Yojana)**\n   • Status: ✅ Eligible\n   • Coverage: Up to ₹50,000\n   • Premium: Subsidized\n\n3. **Soil Health Card Scheme**\n   • Status: ✅ Eligible\n   • Benefit: Free soil testing\n   • Next Test: Available anytime\n\n4. **Kisan Credit Card**\n   • Status: ✅ Eligible\n   • Credit Limit: Up to ₹3,00,000\n   • Interest: 4% per annum\n\n**Total Annual Benefits:** ₹6,000 + Insurance + Credit facilities\n\nWould you like to apply for any scheme?`,
      data: { eligible: true, schemes: ['PM-KISAN', 'Crop Insurance', 'Soil Testing', 'KCC'] }
    };
  },

  get_farmer_info: async (params, user, role) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      success: true,
      message: `👤 **Farmer Profile**\n\n**Name:** ${user.name}\n**Uzhavar PIN:** ${user.uzhavarPin || 'Not assigned'}\n**Location:** ${user.district || 'N/A'}, ${user.state || 'N/A'}\n**Farm Size:** ${user.landSize || 'N/A'}\n**Crops:** ${(user.crops || ['Rice', 'Wheat']).join(', ')}\n**Status:** ${user.verified ? '✅ Verified' : '⏳ Pending Verification'}\n**Join Date:** ${user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}\n\n**Statistics:**\n• Total Income: ₹${(user.totalIncome || 0).toLocaleString()}\n• Monthly Growth: ${user.monthlyGrowth || 0}%\n• Green Points: ${user.greenPoints || 0}\n\nWould you like to update any information?`,
      data: { farmer: user }
    };
  },

  schedule_delivery: async (params, user, role) => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    const date = params.date || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString();
    const deliveryId = `DEL${Date.now()}`;
    
    return {
      success: true,
      message: `📅 **Delivery Scheduled**\n\n**Delivery ID:** ${deliveryId}\n**Scheduled Date:** ${date}\n**Pickup Location:** Your farm, ${user.district || 'District'}\n**Destination:** Nearest warehouse\n**Status:** Confirmed\n\n**Next Steps:**\n1. Prepare your produce for pickup\n2. Ensure proper packaging\n3. Our team will contact you 1 day before pickup\n4. Track your delivery using ID: ${deliveryId}\n\nYou'll receive a notification reminder 24 hours before pickup.`,
      data: { deliveryId, date, status: 'scheduled' }
    };
  },

  report_issue: async (params, user, role) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const issueId = `ISSUE${Date.now()}`;
    const issueType = params.issue_type || 'general';
    
    return {
      success: true,
      message: `📝 **Issue Reported**\n\n**Issue ID:** ${issueId}\n**Type:** ${issueType}\n**Status:** Under Review\n**Priority:** ${params.priority || 'Medium'}\n\n**Description:** ${params.description || 'Issue reported'}\n\n**Expected Resolution:** Within 24-48 hours\n**Contact:** Support team will reach out to you at ${user.phone || 'your registered number'}\n\nYou'll receive updates via SMS and in-app notifications. Thank you for reporting!`,
      data: { issueId, type: issueType, status: 'under_review' }
    };
  },

  // New functions for consumers
  track_order: async (params, user, role) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const orderId = params.order_id || `ORD${Date.now()}`;
    
    return {
      success: true,
      message: `📦 **Order Tracking**\n\n**Order ID:** ${orderId}\n**Status:** Out for Delivery\n**Current Location:** ${user.district || 'District'} Distribution Center\n**Estimated Delivery:** Today by 6 PM\n\n**Timeline:**\n• ✅ Order Placed - ${new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}\n• ✅ Confirmed - ${new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString()}\n• 🚚 Shipped - ${new Date(Date.now() - 12 * 60 * 60 * 1000).toLocaleString()}\n• 🚛 Out for Delivery - ${new Date().toLocaleString()}\n• ⏳ Expected Delivery - Today, 6 PM\n\n**Delivery Address:** ${user.address || 'Your registered address'}\n\nTrack live location?`,
      data: { orderId, status: 'out_for_delivery', estimatedDelivery: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString() }
    };
  },

  search_products: async (params, user, role) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const query = params.query || 'organic vegetables';
    
    return {
      success: true,
      message: `🛒 **Product Search Results**\n\n**Search:** "${query}"\n**Found:** 15 products\n\n**Top Results:**\n\n1. **Organic Tomatoes**\n   • Farmer: Ramesh Kumar\n   • Price: ₹40/kg\n   • Rating: ⭐ 4.8\n   • Location: ${user.district || 'Nearby'}\n\n2. **Fresh Rice**\n   • Farmer: Suresh Patel\n   • Price: ₹45/kg\n   • Rating: ⭐ 4.9\n   • Location: ${user.district || 'Nearby'}\n\n3. **Organic Wheat**\n   • Farmer: Priya Sharma\n   • Price: ₹50/kg\n   • Rating: ⭐ 4.7\n   • Location: ${user.district || 'Nearby'}\n\n**Filters Available:**\n• Price range\n• Distance\n• Organic certification\n• Farmer rating\n\nWould you like to see more products or filter results?`,
      data: { query, results: 15 }
    };
  },

  get_order_status: async (params, user, role) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const orderId = params.order_id || 'latest';
    
    return {
      success: true,
      message: `📋 **Order Status**\n\n**Order ID:** ${orderId}\n**Status:** ✅ Delivered\n**Delivery Date:** ${new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString()}\n\n**Order Details:**\n• Items: 3 products\n• Total Amount: ₹1,250\n• Payment: ✅ Paid\n• Delivery: ✅ Completed\n\n**Items Delivered:**\n1. Organic Rice - 5kg\n2. Fresh Vegetables - 2kg\n3. Organic Wheat - 3kg\n\n**Rating:** Please rate your order experience!\n\nWould you like to view receipt or reorder?`,
      data: { orderId, status: 'delivered', total: 1250 }
    };
  },

  find_farmer: async (params, user, role) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const location = params.location || user.district || 'your area';
    
    return {
      success: true,
      message: `👨‍🌾 **Farmers Near ${location}**\n\n**Found:** 12 verified farmers\n\n**Top Farmers:**\n\n1. **Ramesh Kumar**\n   • Crops: Rice, Vegetables\n   • Rating: ⭐ 4.9\n   • Distance: 5 km\n   • Uzhavar PIN: UZP-123456\n\n2. **Suresh Patel**\n   • Crops: Wheat, Pulses\n   • Rating: ⭐ 4.8\n   • Distance: 8 km\n   • Uzhavar PIN: UZP-234567\n\n3. **Priya Sharma**\n   • Crops: Organic Vegetables\n   • Rating: ⭐ 4.9\n   • Distance: 12 km\n   • Uzhavar PIN: UZP-345678\n\n**Filter Options:**\n• By crop type\n• By distance\n• By rating\n• By certification\n\nWould you like to see products from any specific farmer?`,
      data: { location, farmers: 12 }
    };
  },

  check_carbon_footprint: async (params, user, role) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      message: `🌱 **Carbon Footprint Analysis**\n\n**Your Total Carbon Footprint:** 2.3 kg CO2\n**Industry Average:** 5.1 kg CO2\n**Savings:** 55% lower than average! 🌟\n\n**Breakdown:**\n• Local sourcing: -1.2 kg CO2\n• Organic products: -0.8 kg CO2\n• Minimal packaging: -0.3 kg CO2\n\n**Impact:**\n• Trees saved: Equivalent to 12 trees\n• Environmental score: ⭐⭐⭐⭐⭐\n\n**Tips to reduce further:**\n• Buy more seasonal products\n• Choose local farmers\n• Use reusable bags\n\nKeep up the great work! You're making a positive impact!`,
      data: { footprint: 2.3, average: 5.1, savings: 55 }
    };
  },

  get_product_info: async (params, user, role) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const product = params.product || 'Organic Rice';
    
    return {
      success: true,
      message: `📦 **Product Information: ${product}**\n\n**Details:**\n• Type: Organic\n• Origin: ${user.district || 'Local'} farms\n• Certification: Organic certified\n• Shelf Life: 12 months\n• Storage: Cool, dry place\n\n**Nutritional Info:**\n• Rich in fiber\n• High in vitamins\n• No pesticides\n• GMO-free\n\n**Farmer Info:**\n• Verified farmer\n• Uzhavar PIN: UZP-123456\n• Farm location: ${user.district || 'Nearby'}\n• Rating: ⭐ 4.9\n\n**Price:** ₹45/kg\n**Availability:** In stock\n\nWould you like to add this to cart?`,
      data: { product, price: 45, available: true }
    };
  },

  cancel_order: async (params, user, role) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const orderId = params.order_id || 'latest';
    
    return {
      success: true,
      message: `❌ **Order Cancelled**\n\n**Order ID:** ${orderId}\n**Status:** Cancelled\n**Refund Status:** Processing\n**Refund Amount:** ₹1,250\n**Refund Method:** Original payment method\n\n**Timeline:**\n• Refund initiated: ${new Date().toLocaleString()}\n• Expected credit: 3-5 business days\n\n**Note:** You'll receive a confirmation SMS once refund is processed.\n\nIs there anything else I can help you with?`,
      data: { orderId, status: 'cancelled', refundAmount: 1250 }
    };
  },

  get_receipt: async (params, user, role) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const orderId = params.order_id || 'latest';
    
    return {
      success: true,
      message: `🧾 **Order Receipt**\n\n**Receipt ID:** RCP${Date.now()}\n**Order ID:** ${orderId}\n**Date:** ${new Date().toLocaleDateString()}\n\n**Items:**\n1. Organic Rice - 5kg × ₹45 = ₹225\n2. Fresh Vegetables - 2kg × ₹40 = ₹80\n3. Organic Wheat - 3kg × ₹50 = ₹150\n\n**Subtotal:** ₹455\n**Delivery:** ₹50\n**Tax:** ₹45.50\n**Total:** ₹550.50\n\n**Payment:** ✅ Paid via UPI\n**Transaction ID:** TXN${Date.now()}\n\n**Download:** You can download this receipt from your order history.\n\nNeed a printed copy?`,
      data: { receiptId: `RCP${Date.now()}`, orderId, total: 550.50 }
    };
  },

  // New functions for warehouse
  check_inventory: async (params, user, role) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: `📊 **Inventory Status**\n\n**Total Capacity:** 5,000 tons\n**Current Stock:** 3,750 tons (75%)\n**Available Space:** 1,250 tons\n\n**By Category:**\n• Rice: 1,500 tons (60% capacity)\n• Wheat: 1,200 tons (80% capacity)\n• Vegetables: 800 tons (70% capacity)\n• Pulses: 250 tons (50% capacity)\n\n**Storage Conditions:**\n• Temperature: 18°C ✅ Optimal\n• Humidity: 55% ✅ Good\n• Quality: Excellent ✅\n\n**Alerts:**\n• Wheat storage at 80% - Consider distribution\n• Pulses low stock - Schedule pickup\n\n**Recommendations:**\n• Plan distribution for high-occupancy items\n• Schedule new pickups for low-stock items`,
      data: { totalCapacity: 5000, currentStock: 3750, occupancy: 75 }
    };
  },

  get_warehouse_stats: async (params, user, role) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      message: `📈 **Warehouse Statistics**\n\n**Overview:**\n• Total Capacity: 5,000 tons\n• Current Occupancy: 75%\n• Monthly Turnover: 2,500 tons\n• Active Products: 45 types\n\n**Performance Metrics:**\n• Efficiency: 92% ⭐⭐⭐⭐⭐\n• Quality Score: 4.8/5.0\n• On-time Delivery: 96%\n• Customer Satisfaction: 4.7/5.0\n\n**This Month:**\n• Products Received: 1,200 tons\n• Products Shipped: 1,150 tons\n• Growth: +12% from last month\n\n**Top Products:**\n1. Rice - 1,500 tons\n2. Wheat - 1,200 tons\n3. Vegetables - 800 tons\n\n**Revenue:** ₹12,50,000 this month\n\nWould you like detailed analytics?`,
      data: { occupancy: 75, efficiency: 92, revenue: 1250000 }
    };
  },

  track_product_movement: async (params, user, role) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const productId = params.product_id || `PROD${Date.now()}`;
    
    return {
      success: true,
      message: `🚚 **Product Movement Tracking**\n\n**Product ID:** ${productId}\n**Status:** In Warehouse\n**Location:** Storage Bay A-12\n\n**Movement History:**\n• 📍 Received from Farm - ${new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString()}\n• ✅ Quality Check Passed - ${new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleString()}\n• 📦 Stored in Bay A-12 - ${new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleString()}\n• ⏳ Scheduled for Shipment - Tomorrow\n\n**Storage Details:**\n• Temperature: 18°C ✅\n• Humidity: 55% ✅\n• Quality: Excellent ✅\n\n**Next Action:** Ready for shipment tomorrow`,
      data: { productId, status: 'in_warehouse', location: 'Bay A-12' }
    };
  },

  schedule_pickup: async (params, user, role) => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    const pickupId = `PICK${Date.now()}`;
    const date = params.date || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString();
    
    return {
      success: true,
      message: `📅 **Pickup Scheduled**\n\n**Pickup ID:** ${pickupId}\n**Scheduled Date:** ${date}\n**Location:** ${params.location || 'Farm location'}\n**Status:** Confirmed\n\n**Details:**\n• Pickup Time: 10:00 AM - 2:00 PM\n• Vehicle: Medium truck\n• Driver: Will be assigned\n• Contact: +91-99999-00002\n\n**Next Steps:**\n1. Prepare products for pickup\n2. Ensure proper packaging\n3. Our team will contact you 1 day before\n4. Track pickup using ID: ${pickupId}\n\nYou'll receive a notification 24 hours before pickup.`,
      data: { pickupId, date, status: 'scheduled' }
    };
  },

  update_storage_conditions: async (params, user, role) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      message: `🌡️ **Storage Conditions Updated**\n\n**Current Conditions:**\n• Temperature: ${params.temperature || 18}°C ✅\n• Humidity: ${params.humidity || 55}% ✅\n• Air Quality: Good ✅\n• Ventilation: Optimal ✅\n\n**Status:** All conditions within optimal range\n**Last Updated:** ${new Date().toLocaleString()}\n\n**Alerts:** None - All systems operating normally\n\n**Recommendations:**\n• Continue monitoring every 6 hours\n• Maintain current temperature settings\n• Check humidity levels daily\n\nStorage conditions are optimal for product quality!`,
      data: { temperature: params.temperature || 18, humidity: params.humidity || 55, status: 'optimal' }
    };
  },

  generate_report: async (params, user, role) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const reportId = `RPT${Date.now()}`;
    const reportType = params.report_type || 'inventory';
    
    return {
      success: true,
      message: `📄 **Report Generated**\n\n**Report ID:** ${reportId}\n**Type:** ${reportType}\n**Date Range:** Last 30 days\n**Generated:** ${new Date().toLocaleString()}\n\n**Report Contents:**\n• Inventory summary\n• Product movements\n• Storage conditions\n• Performance metrics\n• Recommendations\n\n**Download:** Report is ready for download\n**Format:** PDF & Excel available\n\n**Key Highlights:**\n• Total products: 3,750 tons\n• Monthly turnover: 2,500 tons\n• Efficiency: 92%\n• Quality score: 4.8/5\n\nWould you like to download the report?`,
      data: { reportId, type: reportType, generated: new Date().toISOString() }
    };
  },

  // New functions for admin
  get_analytics: async (params, user, role) => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    return {
      success: true,
      message: `📊 **System Analytics**\n\n**Overview (Last 30 Days):**\n\n**Users:**\n• Total Users: 1,250\n• Active Users: 890 (71%)\n• New Users: 45 this month\n• Growth: +12% from last month\n\n**Transactions:**\n• Total Transactions: 3,450\n• Total Revenue: ₹12,50,000\n• Average Transaction: ₹362\n• Success Rate: 98.5%\n\n**Products:**\n• Total Products: 2,340\n• Active Listings: 1,890\n• Orders: 1,560\n• Conversion Rate: 66.7%\n\n**Performance:**\n• System Uptime: 99.8%\n• Response Time: 120ms avg\n• Error Rate: 0.2%\n\n**Top Metrics:**\n• Most Active: Farmers (45%)\n• Peak Hours: 10 AM - 2 PM\n• Popular Feature: Product Search\n\nWould you like detailed breakdown?`,
      data: { users: 1250, transactions: 3450, revenue: 1250000 }
    };
  },

  get_user_stats: async (params, user, role) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: `👥 **User Statistics**\n\n**Total Users:** 1,250\n\n**By Role:**\n• Farmers: 560 (45%)\n• Consumers: 450 (36%)\n• Warehouse: 180 (14%)\n• Admin: 60 (5%)\n\n**Activity:**\n• Active Today: 320 users\n• Active This Week: 890 users\n• Active This Month: 1,100 users\n\n**Engagement:**\n• Average Session: 12 minutes\n• Daily Active Users: 320\n• Weekly Active Users: 890\n• Monthly Active Users: 1,100\n\n**Growth:**\n• New Users (Today): 5\n• New Users (This Week): 35\n• New Users (This Month): 45\n• Growth Rate: +12% month-over-month\n\n**Verification:**\n• Verified Users: 1,180 (94%)\n• Pending: 70 (6%)\n\nWould you like user details?`,
      data: { total: 1250, active: 890, growth: 12 }
    };
  },

  view_transactions: async (params, user, role) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: `💳 **Transaction Overview**\n\n**Last 24 Hours:**\n• Total Transactions: 145\n• Total Amount: ₹52,500\n• Success Rate: 98.6%\n• Failed: 2 transactions\n\n**Last 7 Days:**\n• Total Transactions: 980\n• Total Amount: ₹3,45,000\n• Average: ₹352 per transaction\n• Peak Day: ${new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}\n\n**Last 30 Days:**\n• Total Transactions: 3,450\n• Total Amount: ₹12,50,000\n• Growth: +15% from last month\n\n**Top Transaction Types:**\n1. Product Purchase: 65%\n2. Service Payment: 25%\n3. Subscription: 10%\n\n**Payment Methods:**\n• UPI: 60%\n• Card: 25%\n• Wallet: 15%\n\nWould you like detailed transaction list?`,
      data: { today: 145, week: 980, month: 3450, totalAmount: 1250000 }
    };
  },

  manage_users: async (params, user, role) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const action = params.action || 'view';
    
    return {
      success: true,
      message: `👤 **User Management**\n\n**Action:** ${action}\n**Status:** ✅ Completed\n\n**User Management Options:**\n\n**Available Actions:**\n• View user details\n• Edit user information\n• Activate/Deactivate users\n• Change user roles\n• View user activity\n• Reset passwords\n• Export user data\n\n**Quick Stats:**\n• Total Users: 1,250\n• Active: 1,180\n• Inactive: 70\n• Pending Verification: 50\n\n**Recent Activity:**\n• 5 new users today\n• 12 users verified today\n• 3 users deactivated (inactive)\n\nWhat would you like to manage?`,
      data: { action, totalUsers: 1250, active: 1180 }
    };
  },

  system_health_check: async (params, user, role) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      message: `🏥 **System Health Check**\n\n**Overall Status:** ✅ Healthy\n**Uptime:** 99.8%\n**Last Check:** ${new Date().toLocaleString()}\n\n**System Components:**\n\n**✅ Database:**\n• Status: Operational\n• Response Time: 45ms\n• Connections: 125/200\n\n**✅ API Server:**\n• Status: Operational\n• Response Time: 120ms avg\n• CPU Usage: 45%\n• Memory: 2.1GB/4GB\n\n**✅ Storage:**\n• Status: Operational\n• Usage: 450GB/1TB (45%)\n• I/O Performance: Excellent\n\n**✅ Cache:**\n• Status: Operational\n• Hit Rate: 92%\n• Memory: 512MB\n\n**Alerts:**\n• None - All systems normal\n\n**Recommendations:**\n• System running optimally\n• No action required\n• Next check: 1 hour\n\nAll systems are healthy! 🎉`,
      data: { status: 'healthy', uptime: 99.8, cpu: 45, memory: 52.5 }
    };
  },

  view_logs: async (params, user, role) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const logType = params.log_type || 'system';
    
    return {
      success: true,
      message: `📋 **System Logs**\n\n**Log Type:** ${logType}\n**Time Range:** Last 24 hours\n\n**Summary:**\n• Total Logs: 12,450\n• Errors: 5 (0.04%)\n• Warnings: 23 (0.18%)\n• Info: 12,422 (99.78%)\n\n**Recent Logs:**\n\n[${new Date().toLocaleTimeString()}] INFO: User login successful\n[${new Date(Date.now() - 5 * 60 * 1000).toLocaleTimeString()}] INFO: Payment processed\n[${new Date(Date.now() - 10 * 60 * 1000).toLocaleTimeString()}] INFO: Order shipped\n[${new Date(Date.now() - 15 * 60 * 1000).toLocaleTimeString()}] WARNING: High API response time\n[${new Date(Date.now() - 20 * 60 * 1000).toLocaleTimeString()}] INFO: Inventory updated\n\n**Error Logs:**\n• 2 failed payment attempts (handled)\n• 1 connection timeout (recovered)\n• 2 validation errors (resolved)\n\n**Status:** All critical issues resolved\n\nWould you like to filter or export logs?`,
      data: { logType, total: 12450, errors: 5, warnings: 23 }
    };
  }
};

// Enhanced AI response generator with better context understanding
export const chatbotService = {
  async sendMessage(
    message: string,
    user: User,
    role: 'farmer' | 'consumer' | 'warehouse' | 'admin',
    conversationHistory: ChatMessage[]
  ): Promise<ChatResponse> {
    const capabilities = roleCapabilities[role];
    const lowerMessage = message.toLowerCase().trim();
    
    // Enhanced function detection with confidence scoring
    const functionMatch = detectFunctionCall(lowerMessage, capabilities.functions, conversationHistory);
    
    if (functionMatch) {
      const params = extractParams(message, functionMatch.function, user, conversationHistory);
      return {
        type: 'function_call',
        action: functionMatch.function,
        params,
        confidence: functionMatch.confidence
      };
    }

    // Generate intelligent response with context
    const response = await generateAIResponse(
      message, 
      role, 
      capabilities, 
      conversationHistory,
      user
    );
    
    return {
      type: 'message',
      content: response,
      confidence: 0.9
    };
  },

  async executeFunction(
    action: string,
    params: any,
    user: User,
    role: string
  ): Promise<FunctionResult> {
    const handler = functionHandlers[action];
    if (!handler) {
      return {
        success: false,
        message: `Function ${action} is not available for your role.`
      };
    }

    try {
      // Validate and enrich parameters
      if (!params.uzhavar_id && user.id) {
        params.uzhavar_id = user.id;
      }
      
      // Add user context
      params.userContext = {
        name: user.name,
        role: user.role,
        location: user.state || user.district
      };
      
      return await handler(params, user, role);
    } catch (error: any) {
      console.error('Function execution error:', error);
      return {
        success: false,
        message: `I encountered an error while executing ${action}. Please try again or contact support if the issue persists.`
      };
    }
  }
};

// Enhanced function detection with confidence scoring
function detectFunctionCall(
  message: string,
  availableFunctions: string[],
  history: ChatMessage[]
): { function: string; confidence: number } | null {
  // Enhanced trigger patterns with weights
  const functionPatterns: Record<string, { triggers: string[]; weights: number[] }> = {
    create_payment: {
      triggers: [
        'pay', 'payment', 'send money', 'transfer', 'purchase', 'buy', 
        'make payment', 'process payment', 'rupees', 'rs', '₹', 'inr',
        'pay for', 'buy', 'purchase', 'transaction'
      ],
      weights: [0.9, 0.9, 0.95, 0.85, 0.8, 0.8, 0.9, 0.9, 0.7, 0.7, 0.7, 0.7, 0.85, 0.8, 0.8, 0.75]
    },
    send_notification: {
      triggers: [
        'notify', 'send message', 'alert', 'remind', 'notification',
        'send alert', 'notify me', 'send notification', 'reminder'
      ],
      weights: [0.9, 0.95, 0.9, 0.85, 0.9, 0.9, 0.85, 0.9, 0.85]
    },
    update_ledger: {
      triggers: [
        'update ledger', 'record', 'log', 'save to ledger', 'ledger entry',
        'blockchain', 'record transaction', 'save transaction'
      ],
      weights: [0.95, 0.7, 0.7, 0.9, 0.9, 0.85, 0.9, 0.9]
    },
    fetch_crop_advice: {
      triggers: [
        'crop advice', 'what to plant', 'farming advice', 'weather', 'soil',
        'crop recommendation', 'planting advice', 'which crop', 'harvest',
        'irrigation', 'fertilizer advice', 'pest control'
      ],
      weights: [0.95, 0.9, 0.9, 0.7, 0.7, 0.9, 0.9, 0.85, 0.8, 0.75, 0.8, 0.75]
    },
    generate_qr: {
      triggers: [
        'generate qr', 'create qr', 'qr code', 'digital identity',
        'make qr', 'new qr', 'qr for', 'identity qr'
      ],
      weights: [0.95, 0.95, 0.9, 0.85, 0.9, 0.85, 0.9, 0.85]
    },
    // New function patterns
    get_weather_forecast: {
      triggers: [
        'weather', 'forecast', 'rain', 'temperature', 'climate',
        'weather forecast', 'weather update', 'rain forecast', 'temperature forecast'
      ],
      weights: [0.9, 0.95, 0.85, 0.85, 0.8, 0.95, 0.9, 0.9, 0.85]
    },
    check_market_prices: {
      triggers: [
        'market price', 'price', 'msp', 'crop price', 'selling price',
        'market rate', 'current price', 'price of', 'how much for'
      ],
      weights: [0.95, 0.8, 0.9, 0.9, 0.85, 0.9, 0.85, 0.8, 0.8]
    },
    track_shipment: {
      triggers: [
        'track shipment', 'track delivery', 'where is my', 'shipment status',
        'delivery status', 'track my', 'shipment tracking', 'delivery tracking'
      ],
      weights: [0.95, 0.95, 0.85, 0.9, 0.9, 0.85, 0.95, 0.95]
    },
    find_warehouse: {
      triggers: [
        'find warehouse', 'nearby warehouse', 'warehouse near', 'storage',
        'warehouse location', 'nearest warehouse', 'warehouse address'
      ],
      weights: [0.95, 0.9, 0.9, 0.7, 0.85, 0.9, 0.85]
    },
    check_subsidy_eligibility: {
      triggers: [
        'subsidy', 'eligibility', 'government scheme', 'pm kisan',
        'subsidy check', 'scheme eligibility', 'government benefit', 'subsidy status'
      ],
      weights: [0.9, 0.85, 0.95, 0.9, 0.9, 0.95, 0.9, 0.9]
    },
    get_farmer_info: {
      triggers: [
        'my profile', 'farmer info', 'my information', 'profile',
        'farmer details', 'my account', 'user info', 'my data'
      ],
      weights: [0.9, 0.95, 0.85, 0.8, 0.9, 0.85, 0.85, 0.8]
    },
    schedule_delivery: {
      triggers: [
        'schedule delivery', 'book delivery', 'arrange pickup', 'delivery date',
        'pickup schedule', 'schedule pickup', 'delivery time', 'when to deliver'
      ],
      weights: [0.95, 0.9, 0.9, 0.85, 0.9, 0.95, 0.85, 0.85]
    },
    report_issue: {
      triggers: [
        'report issue', 'problem', 'complaint', 'issue', 'bug',
        'report problem', 'file complaint', 'help issue', 'something wrong'
      ],
      weights: [0.95, 0.8, 0.85, 0.8, 0.75, 0.9, 0.9, 0.8, 0.75]
    },
    track_order: {
      triggers: [
        'track order', 'order status', 'where is order', 'order tracking',
        'my order', 'order location', 'track my order', 'order delivery'
      ],
      weights: [0.95, 0.95, 0.85, 0.95, 0.8, 0.85, 0.95, 0.9]
    },
    search_products: {
      triggers: [
        'search', 'find product', 'products', 'buy', 'shop',
        'search for', 'find', 'looking for', 'need', 'want to buy'
      ],
      weights: [0.8, 0.9, 0.7, 0.7, 0.7, 0.85, 0.8, 0.75, 0.7, 0.75]
    },
    get_order_status: {
      triggers: [
        'order status', 'my order', 'order info', 'order details',
        'check order', 'order history', 'recent order', 'last order'
      ],
      weights: [0.95, 0.85, 0.9, 0.9, 0.9, 0.85, 0.85, 0.85]
    },
    find_farmer: {
      triggers: [
        'find farmer', 'nearby farmer', 'local farmer', 'farmer near',
        'farmers', 'farmer location', 'nearest farmer', 'find local'
      ],
      weights: [0.95, 0.9, 0.9, 0.9, 0.7, 0.85, 0.9, 0.85]
    },
    check_carbon_footprint: {
      triggers: [
        'carbon footprint', 'carbon', 'environmental impact', 'eco friendly',
        'carbon emissions', 'environment', 'green', 'sustainability'
      ],
      weights: [0.95, 0.8, 0.9, 0.8, 0.9, 0.75, 0.7, 0.8]
    },
    get_product_info: {
      triggers: [
        'product info', 'product details', 'about product', 'product information',
        'tell me about', 'what is', 'product description', 'product specs'
      ],
      weights: [0.95, 0.95, 0.85, 0.95, 0.8, 0.75, 0.9, 0.85]
    },
    cancel_order: {
      triggers: [
        'cancel order', 'cancel', 'refund', 'return order',
        'cancel my order', 'want to cancel', 'order cancellation'
      ],
      weights: [0.95, 0.85, 0.8, 0.85, 0.9, 0.85, 0.9]
    },
    get_receipt: {
      triggers: [
        'receipt', 'invoice', 'bill', 'order receipt',
        'download receipt', 'get receipt', 'show receipt', 'receipt copy'
      ],
      weights: [0.9, 0.85, 0.8, 0.9, 0.9, 0.9, 0.85, 0.85]
    },
    check_inventory: {
      triggers: [
        'inventory', 'stock', 'check stock', 'inventory status',
        'stock level', 'available stock', 'inventory check', 'warehouse stock'
      ],
      weights: [0.9, 0.85, 0.9, 0.95, 0.9, 0.9, 0.95, 0.9]
    },
    get_warehouse_stats: {
      triggers: [
        'warehouse stats', 'warehouse statistics', 'warehouse report',
        'warehouse data', 'warehouse metrics', 'warehouse performance', 'stats'
      ],
      weights: [0.95, 0.95, 0.9, 0.85, 0.9, 0.9, 0.8]
    },
    track_product_movement: {
      triggers: [
        'track product', 'product movement', 'product location', 'where is product',
        'product tracking', 'product status', 'movement history', 'product history'
      ],
      weights: [0.9, 0.95, 0.9, 0.85, 0.95, 0.9, 0.9, 0.85]
    },
    schedule_pickup: {
      triggers: [
        'schedule pickup', 'book pickup', 'arrange pickup', 'pickup date',
        'pickup time', 'when pickup', 'pickup schedule', 'collect from'
      ],
      weights: [0.95, 0.9, 0.9, 0.85, 0.85, 0.85, 0.95, 0.85]
    },
    update_storage_conditions: {
      triggers: [
        'storage conditions', 'temperature', 'humidity', 'update conditions',
        'storage temp', 'warehouse conditions', 'storage environment', 'climate control'
      ],
      weights: [0.95, 0.85, 0.85, 0.9, 0.9, 0.9, 0.9, 0.85]
    },
    generate_report: {
      triggers: [
        'generate report', 'create report', 'report', 'download report',
        'export report', 'get report', 'warehouse report', 'inventory report'
      ],
      weights: [0.95, 0.95, 0.8, 0.9, 0.9, 0.9, 0.85, 0.85]
    },
    get_analytics: {
      triggers: [
        'analytics', 'statistics', 'data', 'insights', 'metrics',
        'system analytics', 'platform stats', 'analytics report', 'dashboard data'
      ],
      weights: [0.9, 0.85, 0.7, 0.8, 0.8, 0.95, 0.9, 0.9, 0.85]
    },
    get_user_stats: {
      triggers: [
        'user stats', 'user statistics', 'user data', 'user count',
        'how many users', 'user analytics', 'user report', 'users'
      ],
      weights: [0.95, 0.95, 0.85, 0.9, 0.85, 0.9, 0.9, 0.7]
    },
    view_transactions: {
      triggers: [
        'transactions', 'transaction list', 'payment history', 'all transactions',
        'view transactions', 'transaction report', 'payment data', 'transaction data'
      ],
      weights: [0.9, 0.95, 0.85, 0.9, 0.95, 0.9, 0.85, 0.85]
    },
    manage_users: {
      triggers: [
        'manage users', 'user management', 'users', 'user list',
        'edit user', 'user admin', 'user control', 'user settings'
      ],
      weights: [0.95, 0.95, 0.7, 0.85, 0.9, 0.9, 0.85, 0.85]
    },
    system_health_check: {
      triggers: [
        'system health', 'health check', 'system status', 'server status',
        'system monitoring', 'health', 'system check', 'server health'
      ],
      weights: [0.95, 0.95, 0.9, 0.9, 0.95, 0.8, 0.9, 0.9]
    },
    view_logs: {
      triggers: [
        'logs', 'system logs', 'error logs', 'view logs',
        'log file', 'activity logs', 'server logs', 'application logs'
      ],
      weights: [0.85, 0.95, 0.9, 0.95, 0.9, 0.9, 0.9, 0.9]
    }
  };

  let bestMatch: { function: string; confidence: number } | null = null;
  let maxConfidence = 0.5; // Minimum confidence threshold

  for (const funcName of availableFunctions) {
    const patterns = functionPatterns[funcName];
    if (!patterns) continue;

    for (let i = 0; i < patterns.triggers.length; i++) {
      const trigger = patterns.triggers[i];
      const weight = patterns.weights[i] || 0.8;
      
      if (message.includes(trigger)) {
        const confidence = weight * (message.includes(trigger) ? 1 : 0.8);
        if (confidence > maxConfidence) {
          maxConfidence = confidence;
          bestMatch = { function: funcName, confidence };
        }
      }
    }
  }

  return bestMatch;
}

// Enhanced parameter extraction with better NLP
function extractParams(
  message: string,
  functionName: string,
  user: User,
  history: ChatMessage[]
): any {
  const params: any = {};
  const lowerMessage = message.toLowerCase();

  switch (functionName) {
    case 'create_payment':
      // Enhanced amount extraction
      const amountPatterns = [
        /(\d+)\s*(rupees?|rs|₹|inr|rupee)/i,
        /(rupees?|rs|₹|inr)\s*(\d+)/i,
        /pay\s*(\d+)/i,
        /(\d+)\s*for/i,
        /₹\s*(\d+)/i
      ];
      
      for (const pattern of amountPatterns) {
        const match = message.match(pattern);
        if (match) {
          params.amount_inr = parseInt(match[1] || match[2] || match[0]);
          break;
        }
      }

      // Enhanced purpose extraction
      const purposeMap: Record<string, string> = {
        'seed': 'seed_purchase',
        'fertilizer': 'fertilizer_purchase',
        'pesticide': 'pesticide_purchase',
        'equipment': 'equipment_purchase',
        'vendor': 'vendor_payment',
        'purchase': 'general_purchase',
        'buy': 'general_purchase',
        'payment': 'general_payment'
      };

      for (const [key, value] of Object.entries(purposeMap)) {
        if (lowerMessage.includes(key)) {
          params.purpose = value;
          break;
        }
      }
      params.purpose = params.purpose || 'general_payment';

      // Extract recipient if mentioned
      if (lowerMessage.includes('to ') || lowerMessage.includes('for ')) {
        const recipientMatch = message.match(/(?:to|for)\s+([a-z\s]+?)(?:\s|$|,|\.)/i);
        if (recipientMatch) {
          params.recipient = recipientMatch[1].trim();
        }
      }
      break;

    case 'send_notification':
      // Extract the actual message content
      const messagePatterns = [
        /(?:send|notify|alert|remind).*?["']([^"']+)["']/i,
        /(?:send|notify|alert|remind).*?:\s*(.+)/i,
        /(?:message|content|text).*?["']([^"']+)["']/i,
        /(?:message|content|text).*?:\s*(.+)/i
      ];

      for (const pattern of messagePatterns) {
        const match = message.match(pattern);
        if (match) {
          params.message = match[1].trim();
          break;
        }
      }
      
      // If no specific message found, use the full message
      if (!params.message) {
        params.message = message.replace(/(?:send|notify|alert|remind|message)/gi, '').trim();
      }
      break;

    case 'update_ledger':
      params.data = { 
        message,
        user: user.name,
        timestamp: new Date().toISOString()
      };
      params.type = lowerMessage.includes('transaction') ? 'transaction' : 
                    lowerMessage.includes('payment') ? 'payment' : 
                    'general';
      break;

    case 'fetch_crop_advice':
      // Extract location
      const locationPatterns = [
        /(?:in|at|for)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
        /location[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i
      ];
      
      for (const pattern of locationPatterns) {
        const match = message.match(pattern);
        if (match) {
          params.location = match[1];
          break;
        }
      }
      params.location = params.location || user.state || user.district || 'your region';
      
      // Extract season if mentioned
      const seasonMatch = lowerMessage.match(/(summer|monsoon|autumn|winter|rainy|dry)/);
      if (seasonMatch) {
        params.season = seasonMatch[1];
      } else {
        params.season = getCurrentSeason();
      }
      break;

    case 'generate_qr':
      const typeMatch = lowerMessage.match(/(?:for|type|kind)\s+([a-z\s]+)/);
      if (typeMatch) {
        params.data_type = typeMatch[1].trim().replace(/\s+/g, '_');
      } else {
        params.data_type = 'farmer_identity';
      }
      break;
    
    // New function parameter extraction
    case 'get_weather_forecast':
      const locationMatch = lowerMessage.match(/(?:for|in|at|location)\s+([a-z\s]+)/i);
      if (locationMatch) {
        params.location = locationMatch[1].trim();
      }
      break;
    
    case 'check_market_prices':
      const cropMatch = lowerMessage.match(/(?:price|msp|rate)\s+(?:of|for)?\s*([a-z]+)/i);
      if (cropMatch) {
        params.crop = cropMatch[1].trim();
      }
      break;
    
    case 'track_shipment':
      const trackingMatch = lowerMessage.match(/(?:tracking|id|number)\s+(?:is|:)?\s*([a-z0-9]+)/i);
      if (trackingMatch) {
        params.tracking_id = trackingMatch[1].trim();
      }
      break;
    
    case 'find_warehouse':
      const warehouseLocationMatch = lowerMessage.match(/(?:near|in|at|location)\s+([a-z\s]+)/i);
      if (warehouseLocationMatch) {
        params.location = warehouseLocationMatch[1].trim();
      }
      break;
    
    case 'schedule_delivery':
      const dateMatch = lowerMessage.match(/(?:on|date|when|schedule)\s+(?:for)?\s*([a-z0-9\s,]+)/i);
      if (dateMatch) {
        params.date = dateMatch[1].trim();
      }
      break;
    
    case 'report_issue':
      const issueTypeMatch = lowerMessage.match(/(?:issue|problem|type)\s+(?:is|:)?\s*([a-z\s]+)/i);
      if (issueTypeMatch) {
        params.issue_type = issueTypeMatch[1].trim();
      }
      const descMatch = lowerMessage.match(/(?:description|details|about|is)\s+(.+)/i);
      if (descMatch) {
        params.description = descMatch[1].trim();
      }
      const priorityMatch = lowerMessage.match(/(?:priority|urgent|important)/i);
      if (priorityMatch) {
        params.priority = lowerMessage.includes('urgent') || lowerMessage.includes('high') ? 'High' : 'Medium';
      }
      break;
    
    case 'track_order':
      const orderIdMatch = lowerMessage.match(/(?:order|id|number)\s+(?:is|:)?\s*([a-z0-9]+)/i);
      if (orderIdMatch) {
        params.order_id = orderIdMatch[1].trim();
      }
      break;
    
    case 'search_products':
      const queryMatch = lowerMessage.match(/(?:search|find|looking for|need|want)\s+(?:for)?\s*(.+)/i);
      if (queryMatch) {
        params.query = queryMatch[1].trim();
      }
      break;
    
    case 'get_order_status':
      const statusOrderMatch = lowerMessage.match(/(?:order|id)\s+(?:is|:)?\s*([a-z0-9]+)/i);
      if (statusOrderMatch) {
        params.order_id = statusOrderMatch[1].trim();
      }
      break;
    
    case 'find_farmer':
      const farmerLocationMatch = lowerMessage.match(/(?:near|in|at|location)\s+([a-z\s]+)/i);
      if (farmerLocationMatch) {
        params.location = farmerLocationMatch[1].trim();
      }
      break;
    
    case 'get_product_info':
      const productMatch = lowerMessage.match(/(?:about|info|details|product)\s+(?:is|:)?\s*([a-z\s]+)/i);
      if (productMatch) {
        params.product = productMatch[1].trim();
      }
      break;
    
    case 'cancel_order':
      const cancelOrderMatch = lowerMessage.match(/(?:order|id)\s+(?:is|:)?\s*([a-z0-9]+)/i);
      if (cancelOrderMatch) {
        params.order_id = cancelOrderMatch[1].trim();
      }
      break;
    
    case 'get_receipt':
      const receiptOrderMatch = lowerMessage.match(/(?:order|id|receipt)\s+(?:is|:)?\s*([a-z0-9]+)/i);
      if (receiptOrderMatch) {
        params.order_id = receiptOrderMatch[1].trim();
      }
      break;
    
    case 'track_product_movement':
      const productIdMatch = lowerMessage.match(/(?:product|id)\s+(?:is|:)?\s*([a-z0-9]+)/i);
      if (productIdMatch) {
        params.product_id = productIdMatch[1].trim();
      }
      break;
    
    case 'schedule_pickup':
      const pickupDateMatch = lowerMessage.match(/(?:on|date|when|schedule)\s+(?:for)?\s*([a-z0-9\s,]+)/i);
      if (pickupDateMatch) {
        params.date = pickupDateMatch[1].trim();
      }
      const pickupLocationMatch = lowerMessage.match(/(?:from|location|at)\s+([a-z\s]+)/i);
      if (pickupLocationMatch) {
        params.location = pickupLocationMatch[1].trim();
      }
      break;
    
    case 'update_storage_conditions':
      const tempMatch = lowerMessage.match(/(?:temperature|temp)\s+(?:is|:)?\s*(\d+)/i);
      if (tempMatch) {
        params.temperature = parseInt(tempMatch[1]);
      }
      const humidityMatch = lowerMessage.match(/(?:humidity)\s+(?:is|:)?\s*(\d+)/i);
      if (humidityMatch) {
        params.humidity = parseInt(humidityMatch[1]);
      }
      break;
    
    case 'generate_report':
      const reportTypeMatch = lowerMessage.match(/(?:report|type)\s+(?:is|:)?\s*([a-z\s]+)/i);
      if (reportTypeMatch) {
        params.report_type = reportTypeMatch[1].trim();
      }
      break;
    
    case 'view_logs':
      const logTypeMatch = lowerMessage.match(/(?:log|type)\s+(?:is|:)?\s*([a-z\s]+)/i);
      if (logTypeMatch) {
        params.log_type = logTypeMatch[1].trim();
      }
      break;
    
    case 'manage_users':
      const actionMatch = lowerMessage.match(/(?:action|do|want to)\s+(?:is|:)?\s*([a-z\s]+)/i);
      if (actionMatch) {
        params.action = actionMatch[1].trim();
      }
      break;
  }

  return params;
}

// Enhanced AI response generation with context awareness
async function generateAIResponse(
  message: string,
  role: string,
  capabilities: typeof roleCapabilities.farmer,
  history: ChatMessage[],
  user: User
): Promise<string> {
  const lowerMessage = message.toLowerCase();
  const recentContext = history.slice(-3).map(m => m.content).join(' ').toLowerCase();
  
  // Role-specific intelligent responses
  if (role === 'farmer') {
    // Weather queries
    if (lowerMessage.includes('weather') || lowerMessage.includes('rain') || lowerMessage.includes('temperature')) {
      const season = getCurrentSeason();
      return `🌤️ **Weather Information for ${user.state || user.district || 'your region'}**

**Current Season:** ${season.charAt(0).toUpperCase() + season.slice(1)}
**Expected Conditions:** ${getWeatherForecast(season)}
**Temperature Range:** ${getTemperatureRange(season)}
**Rainfall:** ${getRainfallInfo(season)}

**Farming Recommendations:**
${getSeasonalFarmingTips(season)}

Would you like me to fetch detailed crop advice based on this weather?`;
    }

    // Crop queries
    if (lowerMessage.includes('crop') || lowerMessage.includes('plant') || lowerMessage.includes('harvest')) {
      const crops = user.crops || ['Rice', 'Wheat', 'Vegetables'];
      return `🌾 **Crop Information**

Based on your profile, you're growing: ${crops.join(', ')}

**Current Recommendations:**
• **Planting:** Optimal time is now for ${getCurrentSeason()} season crops
• **Irrigation:** Ensure adequate water supply, especially during ${getCurrentSeason()}
• **Fertilizer:** Apply organic fertilizers for better yield
• **Pest Control:** Monitor regularly and use eco-friendly pesticides

**Government Schemes Available:**
• PM-KISAN: ₹6000/year direct benefit
• Crop Insurance: Protection against crop loss
• MSP Support: Minimum price guarantee for major crops

Would you like specific advice for any crop or help with government schemes?`;
    }

    // Scheme/Subsidy queries
    if (lowerMessage.includes('scheme') || lowerMessage.includes('subsidy') || lowerMessage.includes('government')) {
      return `🏛️ **Government Schemes & Subsidies**

**Available Schemes:**
1. **PM-KISAN** - ₹6000 per year in 3 installments
2. **Pradhan Mantri Fasal Bima Yojana** - Crop insurance
3. **Kisan Credit Card** - Easy loans for farmers
4. **Soil Health Card** - Free soil testing
5. **MSP (Minimum Support Price)** - Guaranteed prices for crops

**Eligibility:** Most schemes are available to all farmers
**Application:** Can be done online or at local agriculture office

Would you like detailed information about any specific scheme or help with application?`;
    }

    // General farming help
    if (lowerMessage.includes('help') || lowerMessage.includes('how') || lowerMessage.includes('what')) {
      return `👋 **How can I help you?**

I can assist you with:
• 🌾 Crop advice and recommendations
• 💰 Payment processing
• 📱 Sending notifications
• 📝 Updating ledger records
• 🔲 Generating QR codes
• 🌤️ Weather information
• 🏛️ Government schemes

Just ask me anything about farming, or tell me what you'd like to do!`;
    }
  }

  if (role === 'consumer') {
    if (lowerMessage.includes('order') || lowerMessage.includes('track') || lowerMessage.includes('delivery')) {
      return `📦 **Order Tracking**

I can help you track your orders and deliveries. 

**Available Actions:**
• Track current orders
• Check delivery status
• View order history
• Get delivery updates

Would you like me to show your recent orders or track a specific order?`;
    }

    if (lowerMessage.includes('product') || lowerMessage.includes('buy') || lowerMessage.includes('shop')) {
      return `🛒 **Shopping Assistance**

I can help you find and purchase products from local farmers!

**Features:**
• Browse organic products
• Find local farmers
• Check product quality via QR codes
• Track carbon footprint
• Secure payments

What are you looking for today?`;
    }
  }

  if (role === 'warehouse') {
    if (lowerMessage.includes('inventory') || lowerMessage.includes('stock') || lowerMessage.includes('storage')) {
      return `📊 **Inventory Management**

I can help you manage warehouse inventory and operations.

**Available Features:**
• Check stock levels
• Track product movements
• Monitor storage conditions
• Generate reports
• Update ledger records

What would you like to know about your inventory?`;
    }
  }

  if (role === 'admin') {
    if (lowerMessage.includes('user') || lowerMessage.includes('system') || lowerMessage.includes('report')) {
      return `⚙️ **Admin Dashboard**

I can help you with system administration and management.

**Available Actions:**
• User management
• System monitoring
• Generate reports
• View analytics
• Transaction oversight

What would you like to manage or check?`;
    }
  }

  // Context-aware default response
  const lastMessage = history[history.length - 1]?.content || '';
  if (lastMessage.toLowerCase().includes('help') || lastMessage.toLowerCase().includes('what can')) {
    return `I'm here to help with ${capabilities.context}. You can ask me questions or request actions like payments, notifications, or information. What would you like to know or do?`;
  }

  // Intelligent fallback with suggestions
  return `I understand you're asking about "${message}". 

I can help you with ${capabilities.context}. 

**You can:**
• Ask questions about ${role === 'farmer' ? 'farming, crops, weather, or government schemes' : role === 'consumer' ? 'products, orders, or delivery' : role === 'warehouse' ? 'inventory, storage, or logistics' : 'system management and analytics'}
• Request actions like payments or notifications
• Get specific information or advice

Could you provide more details or try rephrasing your question?`;
}

// Helper functions
function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'summer';
  if (month >= 6 && month <= 8) return 'monsoon';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

function getWeatherForecast(season: string): string {
  const forecasts: Record<string, string> = {
    summer: 'Hot and dry with occasional thunderstorms',
    monsoon: 'Heavy rainfall expected, high humidity',
    autumn: 'Moderate temperature, occasional showers',
    winter: 'Cool and dry, possible fog in mornings'
  };
  return forecasts[season] || 'Moderate weather conditions';
}

function getTemperatureRange(season: string): string {
  const ranges: Record<string, string> = {
    summer: '30-40°C',
    monsoon: '25-35°C',
    autumn: '20-30°C',
    winter: '15-25°C'
  };
  return ranges[season] || '20-30°C';
}

function getRainfallInfo(season: string): string {
  const rainfall: Record<string, string> = {
    summer: 'Low to moderate',
    monsoon: 'Heavy rainfall expected',
    autumn: 'Moderate rainfall',
    winter: 'Minimal rainfall'
  };
  return rainfall[season] || 'Moderate';
}

function getSeasonalFarmingTips(season: string): string {
  const tips: Record<string, string> = {
    summer: '• Ensure adequate irrigation\n• Use mulch to retain moisture\n• Plant heat-tolerant varieties',
    monsoon: '• Monitor for waterlogging\n• Protect from pests\n• Ensure proper drainage',
    autumn: '• Prepare soil with organic matter\n• Plant winter crops\n• Monitor temperature changes',
    winter: '• Protect crops from frost\n• Use greenhouses if needed\n• Plant cold-tolerant varieties'
  };
  return tips[season] || '• Follow best farming practices\n• Monitor weather regularly\n• Maintain soil health';
}
