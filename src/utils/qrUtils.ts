// Utility functions for QR code generation and management

export interface FarmerQRData {
  type: 'farmer';
  id: string;
  name: string;
  uzhavarPin: string;
  aadhaarNumber: string;
  state: string;
  district: string;
  crops: string[];
  landSize: string;
  warehouseId: string;
  blockchainTxHash: string;
  phoneNumber: string;
  verified: boolean;
  generatedAt: string;
}

export interface ProductQRData {
  type: 'product';
  id: string;
  productName: string;
  farmerName: string;
  uzhavarPin: string;
  price: number;
  unit: string;
  harvestDate: string;
  quality: string;
  batchId: string;
  blockchainTxHash: string;
  generatedAt: string;
}

// Generate unique QR ID
export const generateQRId = (type: 'farmer' | 'product', suffix?: string): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  const prefix = type === 'farmer' ? 'FARM' : 'PROD';
  return `${prefix}-${timestamp}-${random}${suffix ? `-${suffix}` : ''}`;
};

// Generate blockchain transaction hash
export const generateBlockchainHash = (): string => {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 40; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
};

// Create farmer QR data
export const createFarmerQRData = (farmerData: {
  name: string;
  uzhavarPin: string;
  aadhaarNumber?: string;
  state?: string;
  district?: string;
  crops?: string[];
  landSize?: string;
  phoneNumber?: string;
  verified?: boolean;
}): FarmerQRData => {
  return {
    type: 'farmer',
    id: generateQRId('farmer', farmerData.uzhavarPin?.slice(-6)),
    name: farmerData.name,
    uzhavarPin: farmerData.uzhavarPin,
    aadhaarNumber: farmerData.aadhaarNumber || '****-****-0000',
    state: farmerData.state || 'Odisha',
    district: farmerData.district || 'Khordha',
    crops: farmerData.crops || ['Paddy', 'Vegetables'],
    landSize: farmerData.landSize || '5.0 acres',
    warehouseId: `WH-${farmerData.district?.slice(0, 3).toUpperCase() || 'KHO'}-${Math.floor(Math.random() * 100)}`,
    blockchainTxHash: generateBlockchainHash(),
    phoneNumber: farmerData.phoneNumber || '+91-9999999999',
    verified: farmerData.verified !== false,
    generatedAt: new Date().toISOString()
  };
};

// Create product QR data
export const createProductQRData = (productData: {
  productName: string;
  farmerName: string;
  uzhavarPin: string;
  price: number;
  unit?: string;
  harvestDate?: string;
  quality?: string;
  batchId?: string;
}): ProductQRData => {
  return {
    type: 'product',
    id: generateQRId('product', productData.uzhavarPin?.slice(-4)),
    productName: productData.productName,
    farmerName: productData.farmerName,
    uzhavarPin: productData.uzhavarPin,
    price: productData.price,
    unit: productData.unit || 'kg',
    harvestDate: productData.harvestDate || new Date().toISOString().split('T')[0],
    quality: productData.quality || 'Standard',
    batchId: productData.batchId || `B${Date.now().toString(36).toUpperCase()}`,
    blockchainTxHash: generateBlockchainHash(),
    generatedAt: new Date().toISOString()
  };
};

// Parse QR data from string
export const parseQRData = (qrString: string): FarmerQRData | ProductQRData | null => {
  try {
    // Try to parse as JSON first
    if (qrString.startsWith('{')) {
      const data = JSON.parse(qrString);
      if (data.type === 'farmer' || data.type === 'product') {
        return data;
      }
    }
    
    // If it's a simple Uzhavar PIN, create farmer data
    if (qrString.includes('UZP-') || qrString.match(/^[A-Z]{3}-[A-Z]{3}-\d+$/)) {
      return createFarmerQRData({
        name: 'Manual Entry Farmer',
        uzhavarPin: qrString,
        district: 'Khordha',
        crops: ['Paddy', 'Vegetables']
      });
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing QR data:', error);
    return null;
  }
};

// Generate dummy QR image SVG
export const generateQRImageSVG = (data: FarmerQRData | ProductQRData): string => {
  const qrContent = JSON.stringify(data);
  const hash = qrContent.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  // Generate pattern based on hash
  const pattern = [];
  for (let i = 0; i < 64; i++) {
    pattern.push((hash + i) % 2 === 0);
  }
  
  let svg = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<rect width="200" height="200" fill="#ffffff"/>`;
  
  // Generate QR pattern
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const index = row * 8 + col;
      if (pattern[index]) {
        svg += `<rect x="${20 + col * 20}" y="${20 + row * 20}" width="18" height="18" fill="#000000"/>`;
      }
    }
  }
  
  // Add identifier text
  const identifier = data.type === 'farmer' ? data.uzhavarPin : data.batchId;
  svg += `<text x="100" y="190" text-anchor="middle" font-size="8" fill="#666">${identifier}</text>`;
  svg += `</svg>`;
  
  return svg;
};

// Convert SVG to blob URL
export const svgToBlobUrl = (svgString: string): string => {
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  return URL.createObjectURL(blob);
};

// Save QR to history
export const saveQRToHistory = (qrData: FarmerQRData | ProductQRData, imageUrl: string): void => {
  try {
    const storageKey = qrData.type === 'farmer' ? 'farmer-qr-history' : 'product-qr-history';
    const history = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    const historyEntry = {
      ...qrData,
      imageUrl,
      downloadCount: 0,
      printCount: 0,
      scanCount: 0
    };
    
    history.unshift(historyEntry);
    
    // Keep only last 100 entries
    localStorage.setItem(storageKey, JSON.stringify(history.slice(0, 100)));
  } catch (error) {
    console.warn('Error saving QR to history:', error);
  }
};

// Get QR history
export const getQRHistory = (type: 'farmer' | 'product'): any[] => {
  try {
    const storageKey = type === 'farmer' ? 'farmer-qr-history' : 'product-qr-history';
    return JSON.parse(localStorage.getItem(storageKey) || '[]');
  } catch (error) {
    console.warn('Error loading QR history:', error);
    return [];
  }
};