// Centralized QR Code History Management for GreenLedger
import { QRProduct } from './qrProducts';

export interface QRHistoryEntry {
  id: string;
  qrCodeId: string;
  productId: string;
  productName: string;
  cropType: string;
  farmerName: string;
  farmerId: string;
  warehouseId: string;
  warehouseName: string;
  taluk: string;
  district: string;
  blockchainHash: string;
  dateGenerated: string;
  dateScanned?: string;
  qrCodeUrl: string;
  module: 'farmer' | 'warehouse' | 'consumer';
  action: 'generated' | 'scanned' | 'verified';
  quantity: string;
  unit: string;
  price: number;
  qualityGrade: string;
  organicCertified: boolean;
  harvestDate: string;
  storageConditions: string;
  carbonFootprint: number;
  predictiveAnalytics: {
    expectedSale: number;
    profitMargin: number;
    demandForecast: string;
    stockLevel: string;
    lossRisk: number;
  };
  cropImage: string;
}

// Helper function to get crop-specific realistic images
export const getCropImageUrl = (cropName: string): string => {
  const name = cropName.toLowerCase();
  
  if (name.includes('paddy') || (name.includes('rice') && !name.includes('basmati'))) {
    return "https://images.unsplash.com/photo-1591807105152-594ed605cc58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWRkeSUyMHJpY2UlMjBjcm9wcyUyMGZpZWxkfGVufDF8fHx8MTc1ODQzNjY5OXww&ixlib=rb-4.1.0&q=80&w=1080";
  }
  if (name.includes('basmati')) {
    return "https://images.unsplash.com/photo-1705147289789-6df2593f1b1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNtYXRpJTIwcmljZSUyMGdyYWlucyUyMHdoaXRlfGVufDF8fHx8MTc1ODQzNTkxN3ww&ixlib=rb-4.1.0&q=80&w=1080";
  }
  if (name.includes('groundnut') || name.includes('peanut')) {
    return "https://images.unsplash.com/photo-1730822578580-999d591a1147?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm91bmRudXQlMjBwZWFudXQlMjBjcm9wc3xlbnwxfHx8fDE3NTg0MzY3MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080";
  }
  if (name.includes('maize') || name.includes('corn')) {
    return "https://images.unsplash.com/photo-1651667343378-4c5131206c5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWl6ZSUyMGNvcm4lMjBjcm9wc3xlbnwxfHx8fDE3NTg0MzY3MDV8MA&ixlib=rb-4.1.0&q=80&w=1080";
  }
  if (name.includes('turmeric')) {
    return "https://images.unsplash.com/photo-1615485500834-bc10199bc727?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dXJtZXJpYyUyMHNwaWNlJTIwcG93ZGVyJTIweWVsbG93fGVufDF8fHx8MTc1ODQzNzIyNXww&ixlib=rb-4.1.0&q=80&w=1080";
  }
  if (name.includes('coconut')) {
    return "https://images.unsplash.com/photo-1757332050856-edeb5bf846be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGNvY29udXQlMjBmcnVpdCUyMHRyb3BpY2FsfGVufDF8fHx8MTc1ODQzNzIyMnww&ixlib=rb-4.1.0&q=80&w=1080";
  }
  if (name.includes('vegetable') || name.includes('tomato') || name.includes('onion')) {
    return "https://images.unsplash.com/photo-1580206134556-88e026cc9a7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGVzJTIwdG9tYXRvJTIwY3JvcHN8ZW58MXx8fHwxNzU4NDM2NzEzfDA&ixlib=rb-4.1.0&q=80&w=1080";
  }
  if (name.includes('mango')) {
    return "https://images.unsplash.com/photo-1553279204-f8040ba9fa30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMGZydWl0JTIwZnJlc2h8ZW58MXx8fHwxNzU4NDM3MjUwfDA&ixlib=rb-4.1.0&q=80&w=1080";
  }
  
  // Default to paddy image
  return "https://images.unsplash.com/photo-1591807105152-594ed605cc58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWRkeSUyMHJpY2UlMjBjcm9wcyUyMGZpZWxkfGVufDF8fHx8MTc1ODQzNjY5OXww&ixlib=rb-4.1.0&q=80&w=1080";
};

// Generate QR Code URL
export const generateQRCodeUrl = (data: string): string => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data)}`;
};

// Create QR data string
export const createQRData = (entry: Partial<QRHistoryEntry>): string => {
  return JSON.stringify({
    qrCodeId: entry.qrCodeId,
    productId: entry.productId,
    productName: entry.productName,
    farmerName: entry.farmerName,
    warehouseId: entry.warehouseId,
    blockchainHash: entry.blockchainHash,
    timestamp: new Date().toISOString(),
    module: entry.module,
    verified: true
  });
};

// QR History Manager Class
export class QRHistoryManager {
  private static instance: QRHistoryManager;
  private readonly STORAGE_KEY = 'greenledger_qr_history';

  static getInstance(): QRHistoryManager {
    if (!QRHistoryManager.instance) {
      QRHistoryManager.instance = new QRHistoryManager();
    }
    return QRHistoryManager.instance;
  }

  // Get all QR history
  getHistory(): QRHistoryEntry[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading QR history:', error);
    }
    
    // Generate dummy data if no history exists
    const dummyHistory = this.generateDummyHistory();
    this.saveHistory(dummyHistory);
    return dummyHistory;
  }

  // Save QR history
  saveHistory(history: QRHistoryEntry[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving QR history:', error);
    }
  }

  // Add new QR entry
  addEntry(entry: QRHistoryEntry): void {
    const history = this.getHistory();
    history.unshift(entry); // Add to beginning for chronological order
    this.saveHistory(history);
  }

  // Update existing QR entry (e.g., when scanned)
  updateEntry(qrCodeId: string, updates: Partial<QRHistoryEntry>): void {
    const history = this.getHistory();
    const index = history.findIndex(entry => entry.qrCodeId === qrCodeId);
    if (index !== -1) {
      history[index] = { ...history[index], ...updates };
      this.saveHistory(history);
    }
  }

  // Get history by module
  getHistoryByModule(module: 'farmer' | 'warehouse' | 'consumer'): QRHistoryEntry[] {
    return this.getHistory().filter(entry => entry.module === module);
  }

  // Get history by farmer
  getHistoryByFarmer(farmerName: string): QRHistoryEntry[] {
    return this.getHistory().filter(entry => entry.farmerName === farmerName);
  }

  // Find QR entry by ID
  findByQRCode(qrCodeId: string): QRHistoryEntry | undefined {
    return this.getHistory().find(entry => entry.qrCodeId === qrCodeId);
  }

  // Generate comprehensive dummy data
  private generateDummyHistory(): QRHistoryEntry[] {
    const crops = [
      { name: 'Organic Paddy', type: 'Paddy Rice', price: 2500, quality: 'A+' },
      { name: 'Basmati Rice', type: 'Basmati Rice', price: 3200, quality: 'A+' },
      { name: 'Fresh Groundnut', type: 'Groundnut', price: 180, quality: 'A' },
      { name: 'Yellow Maize', type: 'Maize', price: 1800, quality: 'A' },
      { name: 'Organic Turmeric', type: 'Turmeric', price: 200, quality: 'A+' },
      { name: 'Fresh Coconut', type: 'Coconut', price: 25, quality: 'A' },
      { name: 'Tomato Fresh', type: 'Vegetables', price: 45, quality: 'A' },
      { name: 'Alphonso Mango', type: 'Mangoes', price: 250, quality: 'A+' },
      { name: 'Organic Onion', type: 'Vegetables', price: 35, quality: 'A' },
      { name: 'Black Gram', type: 'Pulses', price: 4200, quality: 'A+' },
      { name: 'Green Gram', type: 'Pulses', price: 5800, quality: 'A+' },
      { name: 'Red Chilli', type: 'Spices', price: 180, quality: 'A' },
      { name: 'Mustard Seeds', type: 'Seeds', price: 6500, quality: 'A+' },
      { name: 'Sweet Potato', type: 'Vegetables', price: 28, quality: 'A' },
      { name: 'Cashew Nuts', type: 'Nuts', price: 800, quality: 'A+' }
    ];

    const farmers = [
      { name: 'Rajesh Kumar Patel', id: 'F-001-KHO', taluk: 'Bhubaneswar', district: 'Khordha', acres: '5.2' },
      { name: 'Meera Devi Sahu', id: 'F-002-CUT', taluk: 'Cuttack', district: 'Cuttack', acres: '3.8' },
      { name: 'Arjun Patnaik', id: 'F-003-BAL', taluk: 'Balasore', district: 'Balasore', acres: '7.1' },
      { name: 'Latha Rani Mohanty', id: 'F-004-PUR', taluk: 'Puri', district: 'Puri', acres: '4.5' },
      { name: 'Suresh Babu Nayak', id: 'F-005-GAN', taluk: 'Berhampur', district: 'Ganjam', acres: '6.3' },
      { name: 'Anita Mallick', id: 'F-006-ANG', taluk: 'Angul', district: 'Angul', acres: '3.2' },
      { name: 'Biswanath Das', id: 'F-007-KEN', taluk: 'Kendrapara', district: 'Kendrapara', acres: '8.7' },
      { name: 'Gita Pradhan', id: 'F-008-JAG', taluk: 'Jagatsinghpur', district: 'Jagatsinghpur', acres: '2.9' },
      { name: 'Ranjan Jena', id: 'F-009-BAR', taluk: 'Baripada', district: 'Mayurbhanj', acres: '5.8' },
      { name: 'Sunita Behera', id: 'F-010-SUN', taluk: 'Sundargarh', district: 'Sundargarh', acres: '4.1' }
    ];

    const warehouses = [
      { id: 'WH-KHO-001', name: 'Khordha Central Warehouse', capacity: '5000 MT' },
      { id: 'WH-CUT-001', name: 'Cuttack District Warehouse', capacity: '4200 MT' },
      { id: 'WH-BAL-001', name: 'Balasore Regional Hub', capacity: '3800 MT' },
      { id: 'WH-PUR-001', name: 'Puri Coastal Warehouse', capacity: '2500 MT' },
      { id: 'WH-GAN-001', name: 'Ganjam Storage Center', capacity: '3200 MT' },
      { id: 'WH-ANG-001', name: 'Angul Processing Hub', capacity: '2800 MT' },
      { id: 'WH-KEN-001', name: 'Kendrapara Storage Facility', capacity: '1800 MT' },
      { id: 'WH-JAG-001', name: 'Jagatsinghpur Warehouse', capacity: '2200 MT' },
      { id: 'WH-BAR-001', name: 'Baripada Collection Center', capacity: '1500 MT' },
      { id: 'WH-SUN-001', name: 'Sundargarh Regional Warehouse', capacity: '4000 MT' }
    ];

    const history: QRHistoryEntry[] = [];
    
    // Generate 50+ comprehensive entries for better testing
    for (let i = 0; i < 55; i++) {
      const crop = crops[i % crops.length];
      const farmer = farmers[i % farmers.length];
      const warehouse = warehouses[i % warehouses.length];
      const daysAgo = Math.floor(Math.random() * 45); // Up to 45 days ago
      const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
      
      const qrCodeId = `QR-${warehouse.id.split('-')[1]}-${String(i + 1).padStart(3, '0')}`;
      const productId = `P-${String(i + 1).padStart(4, '0')}`;
      const blockchainHash = `0x${Math.random().toString(16).substring(2, 42).padStart(40, '0')}`;
      
      const entry: QRHistoryEntry = {
        id: `entry-${String(i + 1).padStart(3, '0')}`,
        qrCodeId,
        productId,
        productName: crop.name,
        cropType: crop.type,
        farmerName: farmer.name,
        farmerId: farmer.id,
        warehouseId: warehouse.id,
        warehouseName: warehouse.name,
        taluk: farmer.taluk,
        district: farmer.district,
        blockchainHash,
        dateGenerated: date.toISOString(),
        qrCodeUrl: generateQRCodeUrl(createQRData({ 
          qrCodeId, 
          productId, 
          productName: crop.name,
          farmerName: farmer.name,
          warehouseId: warehouse.id,
          blockchainHash,
          module: 'warehouse'
        })),
        module: ['farmer', 'warehouse', 'consumer'][Math.floor(Math.random() * 3)] as any,
        action: ['generated', 'scanned', 'verified'][Math.floor(Math.random() * 3)] as any,
        quantity: String(Math.floor(Math.random() * 800) + 100),
        unit: crop.type.includes('Rice') || crop.type.includes('Paddy') ? 'bags' : 
              crop.type.includes('Vegetables') || crop.type.includes('Spices') ? 'kg' : 
              crop.type.includes('Pulses') || crop.type.includes('Seeds') ? 'quintals' : 'kg',
        price: crop.price + Math.floor(Math.random() * 200) - 100,
        qualityGrade: crop.quality,
        organicCertified: Math.random() > 0.3, // 70% organic
        harvestDate: new Date(date.getTime() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
        storageConditions: ['15-25°C, Humidity: 60-70%', '10-20°C, Humidity: 50-60%', '20-30°C, Humidity: 40-50%'][Math.floor(Math.random() * 3)],
        carbonFootprint: Math.round((Math.random() * 4 + 0.2) * 100) / 100,
        predictiveAnalytics: {
          expectedSale: Math.floor(Math.random() * 800000) + 100000,
          profitMargin: Math.floor(Math.random() * 50) + 10,
          demandForecast: ['High', 'Medium', 'Low', 'Very High'][Math.floor(Math.random() * 4)],
          stockLevel: ['Optimal', 'Low', 'High', 'Critical'][Math.floor(Math.random() * 4)],
          lossRisk: Math.floor(Math.random() * 25) + 2
        },
        cropImage: getCropImageUrl(crop.name)
      };

      // 60% of entries are scanned within a few days
      if (Math.random() > 0.4) {
        entry.dateScanned = new Date(date.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString();
      }

      history.push(entry);
    }

    return history.sort((a, b) => new Date(b.dateGenerated).getTime() - new Date(a.dateGenerated).getTime());
  }
}

// Export the singleton instance
export const qrHistoryManager = QRHistoryManager.getInstance();