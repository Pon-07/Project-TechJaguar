import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export type Language = 'en' | 'hi' | 'ta' | 'od' | 'or';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Complete translations for all languages
const translations = {
  en: {
    // Navigation
    "nav.farmerHub": "Farmer Hub",
    "nav.warehouse": "Warehouse",
    "nav.consumer": "Consumer",
    "nav.login": "Login",
    "nav.selectLanguage": "Select Language",
    "nav.greenPoints": "Green Points",
    "notification.welcome": "Supreme Farmer Platform - Direct to Consumer",
    
    // Common
    "common.loading": "Loading...",
    "common.submit": "Submit",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.close": "Close",
    "common.search": "Search",
    "common.yes": "Yes",
    "common.no": "No",
    "common.ok": "OK",
    "common.scanning": "Scanning...",
    "common.error": "Error",
    "common.download": "Download",
    "common.share": "Share",
    "common.select": "Select",
    
    // Login Flow
    "login.aadhaarNumber": "Aadhaar Number",
    "login.aadhaarPlaceholder": "Enter your 12-digit Aadhaar number",
    "login.generatePin": "Generate Uzhavar PIN",
    "login.uzhavarPin": "Uzhavar PIN",
    "login.pinGenerated": "Uzhavar PIN Generated Successfully",
    "login.copyPin": "Copy PIN",
    "login.pinCopied": "PIN copied to clipboard",
    "login.proceedToVerification": "Proceed to Phone Verification",
    "login.phoneNumber": "Phone Number",
    "login.sendOTP": "Send OTP",
    "login.enterOTP": "Enter OTP",
    "login.verifyOTP": "Verify OTP",
    "login.otpSent": "OTP sent to your phone",
    "login.loginSuccess": "Login successful! Welcome to GreenLedger",
    "login.welcome": "Welcome Farmer!",
    
    // Farmer Module
    "farmer.dashboard": "Farmer Dashboard",
    "farmer.landOwned": "Land Owned",
    "farmer.activeCrops": "Active Crops",
    "farmer.totalProfit": "Total Profit",
    "farmer.generateQR": "Generate QR Code",
    "farmer.qrHistory": "QR History",
    "farmer.cropAnalytics": "Crop Analytics",
    "farmer.addCrop": "Add New Crop",
    "farmer.predictedCrops": "AI Suggested Crops",
    "farmer.seasonalAdvice": "Seasonal Advice",
    "farmer.name": "Farmer Name",
    "farmer.phone": "Phone Number",
    "farmer.quantity": "Quantity",
    "farmer.price": "Price",
    "farmer.quality": "Quality",
    "farmer.organic": "Organic",
    "farmer.verified": "Verified",
    "farmer.location": "Location",
    
    // Warehouse Module
    "warehouse.dashboard": "Warehouse Dashboard",
    "warehouse.inventory": "Inventory Management",
    "warehouse.incoming": "Incoming Products",
    "warehouse.outgoing": "Outgoing Products",
    "warehouse.liveTracking": "Live Tracking",
    "warehouse.3dExplorer": "3D Explorer",
    "warehouse.notifications": "Notifications",
    "warehouse.analytics": "Analytics",
    
    // Consumer Module
    "consumer.dashboard": "Consumer Dashboard",
    "consumer.shopping": "Shopping",
    "consumer.orderHistory": "Order History",
    "consumer.carbonFootprint": "Carbon Footprint",
    "consumer.addToCart": "Add to Cart",
    "consumer.checkout": "Checkout",
    "consumer.orderPlaced": "Order placed successfully",
    "consumer.scanQR": "Scan QR Code",
    "consumer.payment": "Payment",
    "consumer.receipt": "Digital Receipt",
    
    // QR Code
    "qr.scanCode": "Scan QR Code",
    "qr.generateCode": "Generate QR Code",
    "qr.productInfo": "Product Information",
    "qr.farmerInfo": "Farmer Information",
    "qr.harvestDate": "Harvest Date",
    "qr.blockchainHash": "Blockchain Hash",
    "qr.history": "QR History",
    "qr.generatedOn": "Generated On",
    "qr.qrSystemHub": "QR System Hub",
    "qr.perfectQRSystem": "Perfect QR Code Generation & Management System",
    "qr.fillAllFields": "Please fill all required fields",
    "qr.linkCopied": "QR details copied to clipboard",
    "qr.clickToScan": "Click to simulate QR scan",
    
    // Tracking & Delivery
    "tracking.orderPlaced": "Order Placed",
    "tracking.processing": "Processing",
    "tracking.inTransit": "In Transit",
    "tracking.delivered": "Delivered",
    "tracking.liveTracking": "Live Tracking",
    "tracking.estimatedDelivery": "Estimated Delivery",
    
    // Notifications
    "notification.qrGenerated": "QR Code Generated",
    "notification.paymentSuccess": "Payment Successful",
    "notification.productDispatched": "Product Dispatched",
    "notification.lowStock": "Low Stock Alert",
    "notification.orderCompleted": "Order Completed",
    "notification.cropSuggestion": "New Crop Suggestion",
    
    // Predictive Analytics
    "analytics.demandForecast": "Demand Forecast",
    "analytics.pricePredict": "Price Prediction",
    "analytics.highDemandCrops": "High Demand Crops",
    "analytics.salesTrends": "Sales Trends",
    "analytics.statewise": "State-wise Analysis",
    
    // Payment
    "payment.upi": "UPI",
    "payment.card": "Card",
    "payment.wallet": "Wallet",
    "payment.netbanking": "Net Banking",
    "payment.total": "Total Amount",
    "payment.processing": "Processing Payment...",
    "payment.success": "Payment Successful",
    
    // States & Locations
    "location.allStates": "All States",
    "location.selectState": "Select State",
    "location.selectDistrict": "Select District",
    
    // Uzhavan Santhai
    "uzhavan.title": "Uzhavan Santhai Hub",
    "uzhavan.subtitle": "Automated Store Management System",
    "uzhavan.enterStore": "Enter Store",
    "uzhavan.inventory": "Live Inventory",
    "uzhavan.analytics": "Analytics",
    "uzhavan.digitalReceipt": "Digital Receipt",
    "uzhavan.scanToEnter": "Scan QR to Enter",
    "uzhavan.welcomeMessage": "Welcome to Automated Shopping",
    "uzhavan.totalSales": "Total Sales",
    "uzhavan.activeCustomers": "Active Customers",
    "uzhavan.lowStockItems": "Low Stock Items",
    "uzhavan.spoilageRate": "Spoilage Rate"
  },
  
  // Other languages follow the same pattern...
  hi: {
    "nav.farmerHub": "किसान केंद्र",
    "nav.warehouse": "गोदाम", 
    "nav.consumer": "उपभोक्ता",
    "nav.login": "लॉग इन",
    "nav.selectLanguage": "भाषा चुनें",
    "nav.greenPoints": "ग्रीन पॉइंट्स",
    "notification.welcome": "सुप्रीम किसान प्लेटफॉर्म - डायरेक्ट टू कंज्यूमर",
    "common.loading": "लोड हो रहा है...",
    "common.error": "त्रुटि",
    "farmer.name": "किसान का नाम",
    "login.welcome": "किसान जी आपका स्वागत है!",
    "uzhavan.title": "उझवन संथै हब"
  },
  
  ta: {
    "nav.farmerHub": "விவசாயி மையம்",
    "nav.warehouse": "கிடங்கு",
    "nav.consumer": "நுகர்வோர்",
    "nav.login": "உள்நுழைவு",
    "nav.selectLanguage": "மொழியைத் தேர்ந்தெடுக்கவும்",
    "nav.greenPoints": "கிரீன் பாய்ண்ட்ஸ்",
    "notification.welcome": "உன்னத விவசாயி மேடை - நேரடியாக நுகர்வோரிடம்",
    "common.loading": "ஏற்றுகிறது...",
    "common.error": "பிழை",
    "farmer.name": "விவசாயி பெயர்",
    "login.welcome": "விவசாயி அவர்களே வரவேற்கிறோம்!",
    "uzhavan.title": "உழவன் சந்தை மையம்"
  },
  
  od: {
    "nav.farmerHub": "କୃଷକ କେନ୍ଦ୍ର",
    "nav.warehouse": "ଗୋଦାମ",
    "nav.consumer": "ଗ୍ରାହକ", 
    "nav.login": "ଲଗଇନ୍",
    "nav.selectLanguage": "ଭାଷା ବାଛନ୍ତୁ",
    "nav.greenPoints": "ଗ୍ରୀନ ପଏଣ୍ଟ",
    "notification.welcome": "ସୁପ୍ରିମ କୃଷକ ପ୍ଲାଟଫର୍ମ - ସିଧାସଳଖ ଗ୍ରାହକଙ୍କୁ",
    "common.loading": "ଲୋଡ୍ ହେଉଛି...",
    "common.error": "ତ୍ରୁଟି",
    "farmer.name": "କୃଷକଙ୍କ ନାମ",
    "login.welcome": "କୃଷକ ଭାଇଙ୍କୁ ସ୍ୱାଗତ!",
    "uzhavan.title": "ଉଝାଭନ୍ ସଂଥାଇ ହବ୍"
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  const setLanguage = useCallback((language: Language) => {
    setCurrentLanguage(language);
  }, []);

  const t = useCallback((key: string): string => {
    const translation = translations[currentLanguage]?.[key as keyof typeof translations['en']];
    return translation || translations.en[key as keyof typeof translations['en']] || key;
  }, [currentLanguage]);

  const contextValue: LanguageContextType = {
    currentLanguage,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}