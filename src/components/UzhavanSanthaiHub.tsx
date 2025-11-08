import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Store,
  Package,
  ShoppingCart,
  Plus,
  Minus,
  Edit,
  Trash2,
  QrCode,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Eye,
  Users,
  MapPin,
  Clock,
  Leaf,
  Star,
  Download,
  Printer,
  Share2,
  Settings,
  Bell,
  Filter,
  Search,
  RefreshCw,
  Zap,
  Globe,
  Building,
  User,
  CreditCard,
  Smartphone,
  Wallet,
  IndianRupee,
  Navigation,
  Truck,
  ShoppingBag,
  Receipt,
  AlertCircle,
  FileText,
  Languages,
  Cpu,
  Activity,
  PieChart,
  BarChart,
  LineChart
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Types and Interfaces
interface Product {
  id: string;
  name: string;
  nameHi: string;
  nameTa: string;
  nameOr: string;
  category: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  farmer: {
    name: string;
    state: string;
    district: string;
    phone: string;
    rating: number;
  };
  warehouse: {
    name: string;
    state: string;
    district: string;
    phone: string;
  };
  image: string;
  qrCode: string;
  txHash: string;
  status: 'available' | 'low_stock' | 'spoiled' | 'sold_out';
  expiryDate: string;
  harvestDate: string;
  organic: boolean;
  position: {
    aisle: number;
    shelf: number;
    x: number;
    y: number;
  };
  demandLevel: 'low' | 'medium' | 'high';
  carbonFootprint: number;
}

interface Customer {
  id: string;
  name: string;
  position: { x: number; y: number };
  cart: CartItem[];
  currentAisle: number;
  isActive: boolean;
}

interface CartItem {
  productId: string;
  quantity: number;
  pickedAt: string;
}

interface Purchase {
  id: string;
  customerId: string;
  customerName: string;
  items: PurchaseItem[];
  totalAmount: number;
  paymentMethod: string;
  timestamp: string;
  txHash: string;
  receiptQR: string;
}

interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  farmer: string;
  image: string;
  qrCode: string;
}

interface Analytics {
  totalSales: number;
  totalProducts: number;
  activeCustomers: number;
  topProducts: string[];
  stateWiseSales: { [key: string]: number };
  predictions: {
    demandForecast: { [key: string]: number };
    expiryAlerts: string[];
    restockSuggestions: string[];
  };
}

// Indian States and Districts Data
const indianStatesData = {
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Thanjavur', 'Tiruchirappalli', 'Salem'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur'],
  'Punjab': ['Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala', 'Mohali', 'Bathinda'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Berhampur', 'Rourkela', 'Sambalpur', 'Puri'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Allahabad', 'Meerut'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Malda'],
  'Andhra Pradesh': ['Hyderabad', 'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool']
};

// Generate QR Code
const generateQRCode = (data: string): string => {
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="120" height="120" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="120" fill="white"/>
      <rect x="10" y="10" width="15" height="15" fill="black"/>
      <rect x="35" y="10" width="15" height="15" fill="black"/>
      <rect x="60" y="10" width="15" height="15" fill="black"/>
      <rect x="85" y="10" width="15" height="15" fill="black"/>
      <rect x="10" y="35" width="15" height="15" fill="black"/>
      <rect x="60" y="35" width="15" height="15" fill="black"/>
      <rect x="10" y="60" width="15" height="15" fill="black"/>
      <rect x="35" y="60" width="15" height="15" fill="black"/>
      <rect x="85" y="60" width="15" height="15" fill="black"/>
      <rect x="10" y="85" width="15" height="15" fill="black"/>
      <rect x="35" y="85" width="15" height="15" fill="black"/>
      <rect x="60" y="85" width="15" height="15" fill="black"/>
      <rect x="85" y="85" width="15" height="15" fill="black"/>
      <text x="60" y="110" text-anchor="middle" font-size="10" fill="black">${data}</text>
    </svg>
  `)}`;
};

// Mock Products Data
const mockProducts: Product[] = [
  {
    id: 'PROD001',
    name: 'Premium Basmati Rice',
    nameHi: 'प्रीमियम बासमती चावल',
    nameTa: 'பிரீமியம் பாஸ்மதி அரிசி',
    nameOr: 'ପ୍ରିମିୟମ୍ ବାସମତୀ ଚାଉଳ',
    category: 'grains',
    quantity: 150,
    unit: 'kg',
    pricePerUnit: 85,
    farmer: {
      name: 'Sita Devi Sharma',
      state: 'Punjab',
      district: 'Amritsar',
      phone: '+91-98765-43210',
      rating: 4.9
    },
    warehouse: {
      name: 'Amritsar Central Hub',
      state: 'Punjab',
      district: 'Amritsar',
      phone: '+91-98765-54321'
    },
    image: 'https://images.unsplash.com/photo-1505216980056-a7b7b1c6e000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwZ3JhaW5zJTIwd2hpdGUlMjBiYXNtYXRpfGVufDF8fHx8MTc1ODYzNDkwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    qrCode: 'QR_RICE_001_SITA_PB',
    txHash: '0xA1B2C3D4E5F6',
    status: 'available',
    expiryDate: '2025-03-15',
    harvestDate: '2024-12-15',
    organic: true,
    position: { aisle: 1, shelf: 2, x: 100, y: 150 },
    demandLevel: 'high',
    carbonFootprint: 0.5
  },
  {
    id: 'PROD002',
    name: 'Golden Wheat',
    nameHi: 'सुनहरा गेहूं',
    nameTa: 'தங்க கோதுமை',
    nameOr: 'ସୁବର୍ଣ୍ଣ ଗହମ',
    category: 'grains',
    quantity: 200,
    unit: 'kg',
    pricePerUnit: 45,
    farmer: {
      name: 'Ramesh Kumar Patel',
      state: 'Uttar Pradesh',
      district: 'Aligarh',
      phone: '+91-98765-43211',
      rating: 4.7
    },
    warehouse: {
      name: 'Delhi NCR Grain Terminal',
      state: 'Delhi',
      district: 'South Delhi',
      phone: '+91-98765-54322'
    },
    image: 'https://images.unsplash.com/photo-1657308506536-61fc10484fa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGVhdCUyMGdvbGRlbiUyMGdyYWlucyUyMGhhcnZlc3R8ZW58MXx8fHwxNzU4NjM0OTA3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    qrCode: 'QR_WHEAT_002_RAMESH_UP',
    txHash: '0xB2C3D4E5F6A1',
    status: 'available',
    expiryDate: '2025-06-20',
    harvestDate: '2024-12-10',
    organic: true,
    position: { aisle: 1, shelf: 3, x: 150, y: 150 },
    demandLevel: 'high',
    carbonFootprint: 0.3
  },
  {
    id: 'PROD003',
    name: 'Organic Turmeric Powder',
    nameHi: 'जैविक हल्दी पाउडर',
    nameTa: 'இயற்கை மஞ்சள் தூள்',
    nameOr: 'ଜୈବିକ ହଳଦୀ ପାଉଡର',
    category: 'spices',
    quantity: 50,
    unit: 'kg',
    pricePerUnit: 180,
    farmer: {
      name: 'Priya Menon',
      state: 'Tamil Nadu',
      district: 'Erode',
      phone: '+91-98765-43212',
      rating: 4.8
    },
    warehouse: {
      name: 'Chennai Spice Hub',
      state: 'Tamil Nadu',
      district: 'Chennai',
      phone: '+91-98765-54323'
    },
    image: 'https://images.unsplash.com/photo-1615485500834-bc10199bc727?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dXJtZXJpYyUyMHBvd2RlciUyMHllbGxvdyUyMHNwaWNlfGVufDF8fHx8MTc1ODYzNDkxMXww&ixlib=rb-4.1.0&q=80&w=1080',
    qrCode: 'QR_TURMERIC_003_PRIYA_TN',
    txHash: '0xC3D4E5F6A1B2',
    status: 'available',
    expiryDate: '2025-08-30',
    harvestDate: '2024-11-20',
    organic: true,
    position: { aisle: 2, shelf: 1, x: 200, y: 100 },
    demandLevel: 'medium',
    carbonFootprint: 0.2
  },
  {
    id: 'PROD004',
    name: 'Premium Cotton',
    nameHi: 'प्रीमियम कपास',
    nameTa: 'பிரீமியம் பருத்தி',
    nameOr: 'ପ୍ରିମିୟମ୍ କପାସ',
    category: 'cash_crops',
    quantity: 25,
    unit: 'quintal',
    pricePerUnit: 5500,
    farmer: {
      name: 'Manoj Kumar Singh',
      state: 'Gujarat',
      district: 'Surat',
      phone: '+91-98765-43213',
      rating: 4.6
    },
    warehouse: {
      name: 'Surat Cotton Exchange',
      state: 'Gujarat',
      district: 'Surat',
      phone: '+91-98765-54324'
    },
    image: 'https://images.unsplash.com/photo-1726013452210-d9ccae841fc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3R0b24lMjBjcm9wJTIwd2hpdGUlMjBmbHVmZnklMjBib2xsc3xlbnwxfHx8fDE3NTg2MzQ5MTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    qrCode: 'QR_COTTON_004_MANOJ_GJ',
    txHash: '0xD4E5F6A1B2C3',
    status: 'available',
    expiryDate: '2025-12-31',
    harvestDate: '2024-12-05',
    organic: false,
    position: { aisle: 3, shelf: 1, x: 300, y: 100 },
    demandLevel: 'low',
    carbonFootprint: 2.1
  },
  {
    id: 'PROD005',
    name: 'Red Chili Peppers',
    nameHi: 'लाल मिर्च',
    nameTa: 'சிவப்பு மிளகாய்',
    nameOr: 'ଲାଲ ଲଙ୍କା',
    category: 'spices',
    quantity: 30,
    unit: 'kg',
    pricePerUnit: 220,
    farmer: {
      name: 'Anita Rani',
      state: 'Karnataka',
      district: 'Bangalore',
      phone: '+91-98765-43214',
      rating: 4.4
    },
    warehouse: {
      name: 'Bangalore Spice Market',
      state: 'Karnataka',
      district: 'Bangalore',
      phone: '+91-98765-54325'
    },
    image: 'https://images.unsplash.com/photo-1737816151071-f81bcd71e7a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBjaGlsaSUyMHBlcHBlcnMlMjBzcGljZXxlbnwxfHx8fDE3NTg2MzQ5MTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    qrCode: 'QR_CHILI_005_ANITA_KA',
    txHash: '0xE5F6A1B2C3D4',
    status: 'low_stock',
    expiryDate: '2025-04-15',
    harvestDate: '2024-11-30',
    organic: true,
    position: { aisle: 2, shelf: 2, x: 250, y: 100 },
    demandLevel: 'high',
    carbonFootprint: 0.4
  },
  {
    id: 'PROD006',
    name: 'Black Pepper',
    nameHi: 'काली मिर्च',
    nameTa: 'கருப்பு மிளகு',
    nameOr: 'କଳା ଗୋଲମରିଚ',
    category: 'spices',
    quantity: 0,
    unit: 'kg',
    pricePerUnit: 450,
    farmer: {
      name: 'Rajesh Nair',
      state: 'Kerala',
      district: 'Kochi',
      phone: '+91-98765-43215',
      rating: 4.7
    },
    warehouse: {
      name: 'Kerala Spice Garden',
      state: 'Kerala',
      district: 'Kochi',
      phone: '+91-98765-54326'
    },
    image: 'https://images.unsplash.com/photo-1543831113-c823c4a606b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHBlcHBlciUyMHNwaWNlJTIwZ3JhaW5zfGVufDF8fHx8MTc1ODYzNDkyMXww&ixlib=rb-4.1.0&q=80&w=1080',
    qrCode: 'QR_PEPPER_006_RAJESH_KL',
    txHash: '0xF6A1B2C3D4E5',
    status: 'sold_out',
    expiryDate: '2025-09-10',
    harvestDate: '2024-10-15',
    organic: true,
    position: { aisle: 2, shelf: 3, x: 300, y: 100 },
    demandLevel: 'medium',
    carbonFootprint: 0.3
  }
];

// Mock Customers Data
const mockCustomers: Customer[] = [
  {
    id: 'CUST001',
    name: 'Amit Sharma',
    position: { x: 120, y: 180 },
    cart: [{ productId: 'PROD001', quantity: 2, pickedAt: new Date().toISOString() }],
    currentAisle: 1,
    isActive: true
  },
  {
    id: 'CUST002', 
    name: 'Priya Patel',
    position: { x: 280, y: 120 },
    cart: [
      { productId: 'PROD003', quantity: 1, pickedAt: new Date().toISOString() },
      { productId: 'PROD005', quantity: 3, pickedAt: new Date().toISOString() }
    ],
    currentAisle: 2,
    isActive: true
  },
  {
    id: 'CUST003',
    name: 'Ravi Kumar',
    position: { x: 200, y: 250 },
    cart: [],
    currentAisle: 3,
    isActive: true
  }
];

export function UzhavanSanthaiHub() {
  const { t, language } = useLanguage();
  
  // State Management
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalSales: 0,
    totalProducts: products.length,
    activeCustomers: customers.length,
    topProducts: [],
    stateWiseSales: {},
    predictions: {
      demandForecast: {},
      expiryAlerts: [],
      restockSuggestions: []
    }
  });
  
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState<Purchase | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [filterState, setFilterState] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    category: 'grains',
    quantity: 0,
    unit: 'kg',
    pricePerUnit: 0,
    farmer: {
      name: '',
      state: 'Tamil Nadu',
      district: 'Chennai',
      phone: '',
      rating: 4.0
    },
    warehouse: {
      name: '',
      state: 'Tamil Nadu',
      district: 'Chennai',
      phone: ''
    },
    organic: false,
    position: { aisle: 1, shelf: 1, x: 100, y: 100 }
  });

  // Get product name based on language
  const getProductName = (product: Product): string => {
    switch (language) {
      case 'hi': return product.nameHi || product.name;
      case 'ta': return product.nameTa || product.name;
      case 'or': return product.nameOr || product.name;
      default: return product.name;
    }
  };

  // Simulate automated stock updates
  useEffect(() => {
    const interval = setInterval(() => {
      setProducts(prev => prev.map(product => {
        const randomEvent = Math.random();
        
        // Simulate product spoilage (1% chance)
        if (randomEvent < 0.01 && product.status === 'available') {
          toast.error(`⚠️ Product spoiled - ${getProductName(product)} removed from shelf`, {
            description: `Aisle ${product.position.aisle}, Shelf ${product.position.shelf}`
          });
          return { ...product, status: 'spoiled' as const, quantity: 0 };
        }
        
        // Simulate stock depletion (2% chance)
        if (randomEvent < 0.03 && product.quantity > 0) {
          const newQuantity = Math.max(0, product.quantity - Math.floor(Math.random() * 5 + 1));
          if (newQuantity === 0) {
            toast.warning(`📦 ${getProductName(product)} is now out of stock`, {
              description: 'Automatic reorder suggested'
            });
            return { ...product, quantity: newQuantity, status: 'sold_out' as const };
          } else if (newQuantity < 10 && product.status === 'available') {
            return { ...product, quantity: newQuantity, status: 'low_stock' as const };
          }
          return { ...product, quantity: newQuantity };
        }
        
        return product;
      }));
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [getProductName]);

  // Simulate customer movement
  useEffect(() => {
    const interval = setInterval(() => {
      setCustomers(prev => prev.map(customer => {
        if (!customer.isActive) return customer;
        
        const newX = customer.position.x + (Math.random() - 0.5) * 20;
        const newY = customer.position.y + (Math.random() - 0.5) * 20;
        
        return {
          ...customer,
          position: {
            x: Math.max(50, Math.min(350, newX)),
            y: Math.max(50, Math.min(300, newY))
          }
        };
      }));
    }, 3000); // Move every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Update analytics
  useEffect(() => {
    const totalSales = purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
    const stateWiseSales: { [key: string]: number } = {};
    
    purchases.forEach(purchase => {
      purchase.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          const state = product.farmer.state;
          stateWiseSales[state] = (stateWiseSales[state] || 0) + item.total;
        }
      });
    });

    const topProducts = products
      .sort((a, b) => (b.demandLevel === 'high' ? 1 : 0) - (a.demandLevel === 'high' ? 1 : 0))
      .slice(0, 5)
      .map(p => p.name);

    const expiryAlerts = products
      .filter(p => {
        const expiryDate = new Date(p.expiryDate);
        const now = new Date();
        const daysUntilExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24);
        return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
      })
      .map(p => p.name);

    const restockSuggestions = products
      .filter(p => p.quantity < 20 || p.status === 'sold_out')
      .map(p => p.name);

    setAnalytics({
      totalSales,
      totalProducts: products.filter(p => p.status !== 'spoiled').length,
      activeCustomers: customers.filter(c => c.isActive).length,
      topProducts,
      stateWiseSales,
      predictions: {
        demandForecast: {
          'Rice': Math.floor(Math.random() * 100 + 50),
          'Wheat': Math.floor(Math.random() * 80 + 40),
          'Spices': Math.floor(Math.random() * 60 + 30)
        },
        expiryAlerts,
        restockSuggestions
      }
    });
  }, [products, purchases, customers]);

  // Product Management Functions
  const addProduct = () => {
    if (!newProduct.name || !newProduct.farmer?.name || !newProduct.warehouse?.name) {
      toast.error('Please fill all required fields');
      return;
    }

    const product: Product = {
      id: `PROD${String(products.length + 1).padStart(3, '0')}`,
      name: newProduct.name!,
      nameHi: `${newProduct.name} (हिंदी)`,
      nameTa: `${newProduct.name} (தமிழ்)`,
      nameOr: `${newProduct.name} (ଓଡ଼ିଆ)`,
      category: newProduct.category!,
      quantity: newProduct.quantity!,
      unit: newProduct.unit!,
      pricePerUnit: newProduct.pricePerUnit!,
      farmer: newProduct.farmer!,
      warehouse: newProduct.warehouse!,
      image: 'https://images.unsplash.com/photo-1505216980056-a7b7b1c6e000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwZ3JhaW5zJTIwd2hpdGUlMjBiYXNtYXRpfGVufDF8fHx8MTc1ODYzNDkwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      qrCode: `QR_${newProduct.name?.toUpperCase().replace(/\s+/g, '_')}_${String(products.length + 1).padStart(3, '0')}`,
      txHash: `0x${Math.random().toString(16).substr(2, 12).toUpperCase()}`,
      status: 'available',
      expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      harvestDate: new Date().toISOString(),
      organic: newProduct.organic!,
      position: newProduct.position!,
      demandLevel: 'medium',
      carbonFootprint: Math.random() * 2
    };

    setProducts(prev => [...prev, product]);
    setShowAddProduct(false);
    setNewProduct({
      name: '',
      category: 'grains',
      quantity: 0,
      unit: 'kg',
      pricePerUnit: 0,
      farmer: { name: '', state: 'Tamil Nadu', district: 'Chennai', phone: '', rating: 4.0 },
      warehouse: { name: '', state: 'Tamil Nadu', district: 'Chennai', phone: '' },
      organic: false,
      position: { aisle: 1, shelf: 1, x: 100, y: 100 }
    });

    toast.success(`✅ ${product.name} added to store`, {
      description: `Placed at Aisle ${product.position.aisle}, Shelf ${product.position.shelf}`
    });
  };

  const deleteProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast.success(`🗑️ ${getProductName(product)} removed from store`);
    }
  };

  // Purchase Simulation
  const simulatePurchase = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer || customer.cart.length === 0) {
      toast.error('Customer has no items in cart');
      return;
    }

    const purchaseItems: PurchaseItem[] = customer.cart.map(cartItem => {
      const product = products.find(p => p.id === cartItem.productId)!;
      return {
        productId: product.id,
        productName: getProductName(product),
        quantity: cartItem.quantity,
        price: product.pricePerUnit,
        total: product.pricePerUnit * cartItem.quantity,
        farmer: `${product.farmer.name} (${product.farmer.district}, ${product.farmer.state})`,
        image: product.image,
        qrCode: product.qrCode
      };
    });

    const totalAmount = purchaseItems.reduce((sum, item) => sum + item.total, 0);
    
    const purchase: Purchase = {
      id: `PUR${Date.now().toString().slice(-6)}`,
      customerId: customer.id,
      customerName: customer.name,
      items: purchaseItems,
      totalAmount,
      paymentMethod: ['UPI', 'Card', 'Wallet', 'Cash'][Math.floor(Math.random() * 4)],
      timestamp: new Date().toISOString(),
      txHash: `0x${Math.random().toString(16).substr(2, 12).toUpperCase()}`,
      receiptQR: generateQRCode(`PUR${Date.now().toString().slice(-6)}`)
    };

    // Update product quantities
    setProducts(prev => prev.map(product => {
      const cartItem = customer.cart.find(item => item.productId === product.id);
      if (cartItem) {
        const newQuantity = Math.max(0, product.quantity - cartItem.quantity);
        return {
          ...product,
          quantity: newQuantity,
          status: newQuantity === 0 ? 'sold_out' as const : 
                 newQuantity < 10 ? 'low_stock' as const : 'available'
        };
      }
      return product;
    }));

    // Clear customer cart
    setCustomers(prev => prev.map(c => 
      c.id === customerId ? { ...c, cart: [] } : c
    ));

    setPurchases(prev => [purchase, ...prev]);
    setCurrentReceipt(purchase);
    setShowReceiptModal(true);

    toast.success(`🎉 Purchase completed - ₹${totalAmount.toLocaleString()}`, {
      description: `${purchaseItems.length} items purchased by ${customer.name}`
    });
  };

  // Receipt Functions
  const downloadReceipt = (purchase: Purchase) => {
    const receiptData = {
      storeInfo: {
        name: 'GreenLedger Uzhavan Santhai',
        address: 'Automated Farm Store',
        phone: '+91-1800-FARMER'
      },
      purchase,
      timestamp: new Date().toISOString()
    };

    const dataStr = JSON.stringify(receiptData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `UzhavanSanthai_Receipt_${purchase.id}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('📥 Receipt downloaded successfully!');
  };

  const printReceipt = (purchase: Purchase) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Uzhavan Santhai Receipt - ${purchase.id}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; color: #22c55e; margin-bottom: 20px; }
              .details { margin: 10px 0; }
              .items { margin: 20px 0; }
              .total { font-weight: bold; font-size: 18px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🏪 GreenLedger Uzhavan Santhai</h1>
              <p>Automated Farm Store • Direct from Farmers</p>
            </div>
            
            <div class="details">
              <strong>Purchase ID:</strong> ${purchase.id}<br>
              <strong>Customer:</strong> ${purchase.customerName}<br>
              <strong>Date:</strong> ${new Date(purchase.timestamp).toLocaleString()}<br>
              <strong>Payment Method:</strong> ${purchase.paymentMethod}<br>
              <strong>Blockchain Tx:</strong> ${purchase.txHash}<br>
            </div>
            
            <div class="items">
              <h3>Items Purchased:</h3>
              ${purchase.items.map(item => `
                <div style="margin: 10px 0; padding: 10px; border: 1px solid #ddd;">
                  <strong>${item.productName}</strong> (${item.quantity} units)<br>
                  Farmer: ${item.farmer}<br>
                  Price: ₹${item.price} × ${item.quantity} = ₹${item.total}<br>
                  QR Code: ${item.qrCode}
                </div>
              `).join('')}
            </div>
            
            <div class="total">
              <p>Total Amount: ₹${purchase.totalAmount.toLocaleString()}</p>
            </div>
            
            <div style="margin-top: 30px; text-align: center; color: #666;">
              <p>Thank you for supporting local farmers! 🌱</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
    
    toast.success('🖨️ Receipt sent to printer!');
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = getProductName(product).toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.farmer.state.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = filterState === 'all' || product.farmer.state === filterState;
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    
    return matchesSearch && matchesState && matchesCategory;
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">🏪 Uzhavan Santhai Hub</h1>
            <p className="text-green-100 mt-1">
              Automated Farm Store • Amazon Go Style • AI-Powered Analytics
            </p>
            <div className="flex items-center mt-3 space-x-4">
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Store className="w-3 h-3 mr-1" />
                {analytics.totalProducts} Products
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Users className="w-3 h-3 mr-1" />
                {analytics.activeCustomers} Active Customers
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <IndianRupee className="w-3 h-3 mr-1" />
                ₹{analytics.totalSales.toLocaleString()} Sales
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Zap className="w-3 h-3 mr-1" />
                Fully Automated
              </Badge>
            </div>
          </div>
          <div className="text-right space-y-2">
            <div className="flex gap-2">
              <Button
                onClick={() => setShowTermsModal(true)}
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                Store Policies
              </Button>
              <Button
                onClick={() => setShowAddProduct(true)}
                className="bg-white/20 hover:bg-white/30 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>
        </div>
        
        {/* Floating background elements */}
        <div className="absolute right-4 top-4 opacity-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Store className="w-20 h-20" />
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { 
            label: 'Live Inventory', 
            value: `${products.filter(p => p.status === 'available').length}/${products.length}`, 
            icon: Package, 
            color: 'text-green-600',
            change: '+5 today'
          },
          { 
            label: 'Active Shoppers', 
            value: analytics.activeCustomers.toString(), 
            icon: Users, 
            color: 'text-blue-600',
            change: '+12% vs yesterday'
          },
          { 
            label: 'Sales Today', 
            value: `₹${analytics.totalSales.toLocaleString()}`, 
            icon: TrendingUp, 
            color: 'text-purple-600',
            change: '+18% growth'
          },
          { 
            label: 'AI Predictions', 
            value: `${analytics.predictions.restockSuggestions.length} alerts`, 
            icon: Cpu, 
            color: 'text-orange-600',
            change: 'Real-time'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-green-600">{stat.change}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Store className="w-4 h-4" />
            3D Store View
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Product Management
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Live Shopping
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            AI Analytics
          </TabsTrigger>
          <TabsTrigger value="qr" className="flex items-center gap-2">
            <QrCode className="w-4 h-4" />
            QR System
          </TabsTrigger>
          <TabsTrigger value="purchases" className="flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            Purchase History
          </TabsTrigger>
        </TabsList>

        {/* 3D Store Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="w-5 h-5" />
                3D Store Layout - Amazon Go Style
              </CardTitle>
              <p className="text-muted-foreground">
                Interactive store visualization with live customer tracking and product placement
              </p>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 h-96 overflow-hidden">
                {/* Store Layout */}
                <div className="absolute inset-0 p-4">
                  {/* Aisles */}
                  {[1, 2, 3].map(aisle => (
                    <div
                      key={aisle}
                      className="absolute bg-white border-2 border-gray-300 rounded-lg shadow-md"
                      style={{
                        left: `${aisle * 100 - 50}px`,
                        top: '50px',
                        width: '80px',
                        height: '200px'
                      }}
                    >
                      <div className="p-2 text-center">
                        <h4 className="text-xs font-bold">Aisle {aisle}</h4>
                        <div className="text-xs text-gray-600">
                          {aisle === 1 && 'Grains'}
                          {aisle === 2 && 'Spices'}
                          {aisle === 3 && 'Cash Crops'}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Products */}
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      className={`absolute cursor-pointer`}
                      style={{
                        left: `${product.position.x}px`,
                        top: `${product.position.y}px`,
                        width: '40px',
                        height: '40px'
                      }}
                      whileHover={{ scale: 1.2, zIndex: 10 }}
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowProductModal(true);
                      }}
                    >
                      <div className={`w-full h-full rounded-lg shadow-lg flex items-center justify-center text-white text-xs font-bold
                        ${product.status === 'available' ? 'bg-green-500' : 
                          product.status === 'low_stock' ? 'bg-yellow-500' :
                          product.status === 'sold_out' ? 'bg-red-500' : 'bg-gray-500'}`}
                      >
                        <Package className="w-4 h-4" />
                      </div>
                      
                      {/* Glowing effect for high demand products */}
                      {product.demandLevel === 'high' && (
                        <motion.div
                          className="absolute inset-0 bg-yellow-400 rounded-lg opacity-30"
                          animate={{ opacity: [0.3, 0.7, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </motion.div>
                  ))}

                  {/* Customers */}
                  {customers.map((customer) => (
                    <motion.div
                      key={customer.id}
                      className="absolute cursor-pointer"
                      style={{
                        left: `${customer.position.x}px`,
                        top: `${customer.position.y}px`,
                        width: '30px',
                        height: '30px'
                      }}
                      animate={{
                        x: [0, 5, -5, 0],
                        y: [0, -2, 2, 0]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setShowPurchaseModal(true);
                      }}
                    >
                      <div className="w-full h-full bg-blue-500 rounded-full shadow-lg flex items-center justify-center text-white text-xs">
                        <User className="w-4 h-4" />
                      </div>
                      
                      {/* Cart indicator */}
                      {customer.cart.length > 0 && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {customer.cart.length}
                        </div>
                      )}
                      
                      {/* Path indicator */}
                      <motion.div
                        className="absolute inset-0 bg-blue-300 rounded-full opacity-20"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>
                  ))}

                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg p-3 shadow-lg">
                    <h4 className="text-sm font-bold mb-2">Legend</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span>Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                        <span>Low Stock</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                        <span>Sold Out</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>Customer</span>
                      </div>
                    </div>
                  </div>

                  {/* Real-time notifications */}
                  <div className="absolute top-4 right-4 space-y-2">
                    {analytics.predictions.expiryAlerts.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-3 py-2 rounded-lg shadow-lg text-xs"
                      >
                        <AlertTriangle className="w-3 h-3 inline mr-1" />
                        {analytics.predictions.expiryAlerts.length} products expiring soon
                      </motion.div>
                    )}
                    
                    {analytics.predictions.restockSuggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-red-100 border border-red-400 text-red-800 px-3 py-2 rounded-lg shadow-lg text-xs"
                      >
                        <Package className="w-3 h-3 inline mr-1" />
                        {analytics.predictions.restockSuggestions.length} products need restocking
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Product Management Tab */}
        <TabsContent value="products" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Product Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search products, farmers, locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterState} onValueChange={setFilterState}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {Object.keys(indianStatesData).map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="grains">Grains & Cereals</SelectItem>
                    <SelectItem value="spices">Spices</SelectItem>
                    <SelectItem value="cash_crops">Cash Crops</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`hover:shadow-lg transition-all overflow-hidden
                    ${product.status === 'spoiled' ? 'opacity-50 border-red-500' : 
                      product.status === 'sold_out' ? 'border-gray-400' :
                      product.status === 'low_stock' ? 'border-yellow-400' : 'border-green-400'}`}
                  >
                    <CardContent className="p-0">
                      <div className="relative">
                        <ImageWithFallback
                          src={product.image}
                          alt={getProductName(product)}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 left-2 flex gap-2">
                          <Badge className={`${product.status === 'available' ? 'bg-green-100 text-green-800' : 
                            product.status === 'low_stock' ? 'bg-yellow-100 text-yellow-800' :
                            product.status === 'sold_out' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                            {product.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          {product.organic && (
                            <Badge className="bg-green-100 text-green-800">
                              <Leaf className="w-3 h-3 mr-1" />
                              Organic
                            </Badge>
                          )}
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-white/90 text-gray-800">
                            <Star className="w-3 h-3 mr-1 fill-current text-yellow-500" />
                            {product.farmer.rating}
                          </Badge>
                        </div>
                        <div className="absolute bottom-2 right-2">
                          <Badge className="bg-black/70 text-white">
                            <QrCode className="w-3 h-3 mr-1" />
                            {product.qrCode}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{getProductName(product)}</h3>
                        
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-2xl font-bold text-green-600">
                            ₹{product.pricePerUnit}/{product.unit}
                          </div>
                          <div className="text-right">
                            <div className={`text-sm ${product.quantity < 10 ? 'text-red-600' : 'text-gray-600'}`}>
                              {product.quantity} {product.unit} left
                            </div>
                            <Progress value={(product.quantity / 200) * 100} className="w-16 h-2 mt-1" />
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-3 h-3" />
                            <span>{product.farmer.name}</span>
                            <Star className="w-3 h-3 fill-current text-yellow-500" />
                            <span>{product.farmer.rating}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-3 h-3" />
                            <span>{product.farmer.district}, {product.farmer.state}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Building className="w-3 h-3" />
                            <span>{product.warehouse.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Store className="w-3 h-3" />
                            <span>Aisle {product.position.aisle}, Shelf {product.position.shelf}</span>
                          </div>
                        </div>

                        <Separator className="mb-4" />

                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            <div>Carbon: {product.carbonFootprint.toFixed(1)}kg CO₂</div>
                            <div>Expires: {new Date(product.expiryDate).toLocaleDateString()}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowProductModal(true);
                              }}
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteProduct(product.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>

        {/* Live Shopping Tab */}
        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Live Customer Activity
              </CardTitle>
              <p className="text-muted-foreground">
                Real-time shopping simulation with automated checkout
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customers.map((customer) => (
                  <Card key={customer.id} className="hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{customer.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Currently in Aisle {customer.currentAisle} • {customer.cart.length} items in cart
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                              <span>Position: ({customer.position.x}, {customer.position.y})</span>
                              <span>Status: {customer.isActive ? '🟢 Active' : '🔴 Inactive'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {customer.cart.length > 0 ? (
                            <div className="space-y-2">
                              <div className="text-sm text-gray-600">
                                Cart Value: ₹{customer.cart.reduce((total, item) => {
                                  const product = products.find(p => p.id === item.productId);
                                  return total + (product ? product.pricePerUnit * item.quantity : 0);
                                }, 0).toLocaleString()}
                              </div>
                              <Button
                                onClick={() => simulatePurchase(customer.id)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                size="sm"
                              >
                                <ShoppingBag className="w-3 h-3 mr-1" />
                                Simulate Checkout
                              </Button>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">No items in cart</div>
                          )}
                        </div>
                      </div>
                      
                      {customer.cart.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <h5 className="text-sm font-medium mb-2">Cart Items:</h5>
                          <div className="flex flex-wrap gap-2">
                            {customer.cart.map((item, index) => {
                              const product = products.find(p => p.id === item.productId);
                              return product ? (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {getProductName(product)} × {item.quantity}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sales Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Sales Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Total Sales</span>
                    <span className="font-bold text-green-600">₹{analytics.totalSales.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total Transactions</span>
                    <span className="font-bold">{purchases.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Average Order Value</span>
                    <span className="font-bold">₹{purchases.length > 0 ? Math.round(analytics.totalSales / purchases.length) : 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Active Products</span>
                    <span className="font-bold">{products.filter(p => p.status === 'available').length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* State-wise Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  State-wise Sales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics.stateWiseSales).slice(0, 5).map(([state, sales]) => (
                    <div key={state} className="flex items-center justify-between">
                      <span className="text-sm">{state}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={(sales / Math.max(...Object.values(analytics.stateWiseSales))) * 100} className="w-20 h-2" />
                        <span className="text-sm font-bold">₹{sales.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Predictive Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="w-5 h-5" />
                  AI Predictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Demand Forecast (Next 7 days)</h4>
                    <div className="space-y-2">
                      {Object.entries(analytics.predictions.demandForecast).map(([category, demand]) => (
                        <div key={category} className="flex items-center justify-between text-sm">
                          <span>{category}</span>
                          <span className="font-bold text-blue-600">{demand}% increase</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {analytics.predictions.expiryAlerts.length > 0 && (
                    <Alert className="border-yellow-400 bg-yellow-50">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-800">
                        <strong>Expiry Alerts:</strong> {analytics.predictions.expiryAlerts.length} products expiring within 7 days
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {analytics.predictions.restockSuggestions.length > 0 && (
                    <Alert className="border-red-400 bg-red-50">
                      <Package className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        <strong>Restock Needed:</strong> {analytics.predictions.restockSuggestions.length} products need immediate restocking
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Top Performing Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.topProducts.map((productName, index) => (
                    <div key={productName} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-green-600">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{productName}</p>
                        <p className="text-xs text-muted-foreground">High demand product</p>
                      </div>
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* QR System Tab */}
        <TabsContent value="qr" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                QR Code Management System
              </CardTitle>
              <p className="text-muted-foreground">
                Generate, manage and track QR codes for all products
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.slice(0, 6).map((product) => (
                  <Card key={product.id} className="hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <ImageWithFallback
                          src={product.image}
                          alt={getProductName(product)}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{getProductName(product)}</h4>
                          <p className="text-sm text-muted-foreground">{product.farmer.name}</p>
                        </div>
                      </div>
                      
                      <div className="text-center mb-3">
                        <img 
                          src={generateQRCode(product.qrCode)} 
                          alt="QR Code" 
                          className="w-24 h-24 mx-auto bg-white border rounded-lg"
                        />
                        <p className="text-xs text-muted-foreground mt-1">{product.qrCode}</p>
                      </div>
                      
                      <div className="space-y-1 text-xs text-gray-600 mb-3">
                        <div><strong>Tx Hash:</strong> {product.txHash}</div>
                        <div><strong>State:</strong> {product.farmer.state}</div>
                        <div><strong>District:</strong> {product.farmer.district}</div>
                        <div><strong>Warehouse:</strong> {product.warehouse.name}</div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Printer className="w-3 h-3 mr-1" />
                          Print
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Purchase History Tab */}
        <TabsContent value="purchases" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                Purchase History & Receipts
              </CardTitle>
              <p className="text-muted-foreground">
                Complete transaction history with downloadable receipts
              </p>
            </CardHeader>
            <CardContent>
              {purchases.length === 0 ? (
                <div className="text-center py-12">
                  <Receipt className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Purchases Yet</h3>
                  <p className="text-muted-foreground">
                    Purchase history will appear here after customers complete transactions
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {purchases.map((purchase) => (
                    <Card key={purchase.id} className="hover:shadow-md transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">Purchase #{purchase.id}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(purchase.timestamp).toLocaleString()} • {purchase.customerName}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-600">₹{purchase.totalAmount.toLocaleString()}</div>
                            <Badge variant="secondary">{purchase.paymentMethod}</Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex -space-x-2">
                            {purchase.items.slice(0, 3).map((item, idx) => (
                              <ImageWithFallback
                                key={idx}
                                src={item.image}
                                alt={item.productName}
                                className="w-8 h-8 rounded-full border-2 border-white object-cover"
                              />
                            ))}
                            {purchase.items.length > 3 && (
                              <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                                +{purchase.items.length - 3}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">{purchase.items.map(item => item.productName).join(', ')}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Tx: {purchase.txHash}</span>
                            <span>•</span>
                            <span>{purchase.items.length} items</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setCurrentReceipt(purchase);
                                setShowReceiptModal(true);
                              }}
                            >
                              <Receipt className="w-3 h-3 mr-1" />
                              Receipt
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadReceipt(purchase)}
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Product Details Modal */}
      <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-6 h-6" />
              Product Details
            </DialogTitle>
            <DialogDescription>
              Complete product information with farmer details and blockchain verification
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-6">
              <div className="flex gap-4">
                <ImageWithFallback
                  src={selectedProduct.image}
                  alt={getProductName(selectedProduct)}
                  className="w-32 h-32 rounded-lg object-cover"
                />
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-bold">{getProductName(selectedProduct)}</h3>
                  <div className="flex items-center gap-4">
                    <Badge className={`${selectedProduct.status === 'available' ? 'bg-green-100 text-green-800' : 
                      selectedProduct.status === 'low_stock' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'}`}>
                      {selectedProduct.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    {selectedProduct.organic && (
                      <Badge className="bg-green-100 text-green-800">
                        <Leaf className="w-3 h-3 mr-1" />
                        Organic
                      </Badge>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    ₹{selectedProduct.pricePerUnit}/{selectedProduct.unit}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedProduct.quantity} {selectedProduct.unit} available
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Farmer Information</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>Name:</strong> {selectedProduct.farmer.name}</div>
                    <div><strong>Location:</strong> {selectedProduct.farmer.district}, {selectedProduct.farmer.state}</div>
                    <div><strong>Phone:</strong> {selectedProduct.farmer.phone}</div>
                    <div><strong>Rating:</strong> ⭐ {selectedProduct.farmer.rating}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Warehouse Information</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>Name:</strong> {selectedProduct.warehouse.name}</div>
                    <div><strong>Location:</strong> {selectedProduct.warehouse.district}, {selectedProduct.warehouse.state}</div>
                    <div><strong>Phone:</strong> {selectedProduct.warehouse.phone}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Store Location</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>Aisle:</strong> {selectedProduct.position.aisle}</div>
                    <div><strong>Shelf:</strong> {selectedProduct.position.shelf}</div>
                    <div><strong>Position:</strong> ({selectedProduct.position.x}, {selectedProduct.position.y})</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Product Details</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>Harvest Date:</strong> {new Date(selectedProduct.harvestDate).toLocaleDateString()}</div>
                    <div><strong>Expiry Date:</strong> {new Date(selectedProduct.expiryDate).toLocaleDateString()}</div>
                    <div><strong>Carbon Footprint:</strong> {selectedProduct.carbonFootprint.toFixed(1)} kg CO₂</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Blockchain & QR Information</h4>
                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-1 text-sm">
                    <div><strong>QR Code:</strong> {selectedProduct.qrCode}</div>
                    <div><strong>Transaction Hash:</strong> {selectedProduct.txHash}</div>
                    <div><strong>Demand Level:</strong> {selectedProduct.demandLevel.toUpperCase()}</div>
                  </div>
                  <img 
                    src={generateQRCode(selectedProduct.qrCode)} 
                    alt="QR Code" 
                    className="w-20 h-20 bg-white border rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Product Modal */}
      <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-6 h-6" />
              Add New Product
            </DialogTitle>
            <DialogDescription>
              Add a new product to your automated store inventory
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="productName">Product Name *</Label>
                <Input
                  id="productName"
                  value={newProduct.name || ''}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Premium Basmati Rice"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={newProduct.category} 
                  onValueChange={(value) => setNewProduct(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grains">Grains & Cereals</SelectItem>
                    <SelectItem value="spices">Spices</SelectItem>
                    <SelectItem value="cash_crops">Cash Crops</SelectItem>
                    <SelectItem value="vegetables">Vegetables</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newProduct.quantity || 0}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Select 
                  value={newProduct.unit} 
                  onValueChange={(value) => setNewProduct(prev => ({ ...prev, unit: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilogram (kg)</SelectItem>
                    <SelectItem value="quintal">Quintal</SelectItem>
                    <SelectItem value="tonnes">Tonnes</SelectItem>
                    <SelectItem value="pieces">Pieces</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price">Price per Unit *</Label>
                <Input
                  id="price"
                  type="number"
                  value={newProduct.pricePerUnit || 0}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, pricePerUnit: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-3">Farmer Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="farmerName">Farmer Name *</Label>
                  <Input
                    id="farmerName"
                    value={newProduct.farmer?.name || ''}
                    onChange={(e) => setNewProduct(prev => ({ 
                      ...prev, 
                      farmer: { ...prev.farmer!, name: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="farmerPhone">Phone Number</Label>
                  <Input
                    id="farmerPhone"
                    value={newProduct.farmer?.phone || ''}
                    onChange={(e) => setNewProduct(prev => ({ 
                      ...prev, 
                      farmer: { ...prev.farmer!, phone: e.target.value }
                    }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="farmerState">State</Label>
                  <Select 
                    value={newProduct.farmer?.state} 
                    onValueChange={(value) => setNewProduct(prev => ({ 
                      ...prev, 
                      farmer: { ...prev.farmer!, state: value, district: 'Chennai' }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(indianStatesData).map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="farmerDistrict">District</Label>
                  <Select 
                    value={newProduct.farmer?.district} 
                    onValueChange={(value) => setNewProduct(prev => ({ 
                      ...prev, 
                      farmer: { ...prev.farmer!, district: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {newProduct.farmer?.state && indianStatesData[newProduct.farmer.state as keyof typeof indianStatesData]?.map(district => (
                        <SelectItem key={district} value={district}>{district}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Warehouse Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="warehouseName">Warehouse Name *</Label>
                  <Input
                    id="warehouseName"
                    value={newProduct.warehouse?.name || ''}
                    onChange={(e) => setNewProduct(prev => ({ 
                      ...prev, 
                      warehouse: { ...prev.warehouse!, name: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="warehousePhone">Phone Number</Label>
                  <Input
                    id="warehousePhone"
                    value={newProduct.warehouse?.phone || ''}
                    onChange={(e) => setNewProduct(prev => ({ 
                      ...prev, 
                      warehouse: { ...prev.warehouse!, phone: e.target.value }
                    }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="warehouseState">State</Label>
                  <Select 
                    value={newProduct.warehouse?.state} 
                    onValueChange={(value) => setNewProduct(prev => ({ 
                      ...prev, 
                      warehouse: { ...prev.warehouse!, state: value, district: 'Chennai' }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(indianStatesData).map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="warehouseDistrict">District</Label>
                  <Select 
                    value={newProduct.warehouse?.district} 
                    onValueChange={(value) => setNewProduct(prev => ({ 
                      ...prev, 
                      warehouse: { ...prev.warehouse!, district: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {newProduct.warehouse?.state && indianStatesData[newProduct.warehouse.state as keyof typeof indianStatesData]?.map(district => (
                        <SelectItem key={district} value={district}>{district}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Store Placement</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="aisle">Aisle Number</Label>
                  <Select 
                    value={newProduct.position?.aisle?.toString()} 
                    onValueChange={(value) => setNewProduct(prev => ({ 
                      ...prev, 
                      position: { ...prev.position!, aisle: parseInt(value) }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Aisle 1 (Grains)</SelectItem>
                      <SelectItem value="2">Aisle 2 (Spices)</SelectItem>
                      <SelectItem value="3">Aisle 3 (Cash Crops)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="shelf">Shelf Number</Label>
                  <Select 
                    value={newProduct.position?.shelf?.toString()} 
                    onValueChange={(value) => setNewProduct(prev => ({ 
                      ...prev, 
                      position: { ...prev.position!, shelf: parseInt(value) }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Shelf 1</SelectItem>
                      <SelectItem value="2">Shelf 2</SelectItem>
                      <SelectItem value="3">Shelf 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="organic"
                checked={newProduct.organic || false}
                onChange={(e) => setNewProduct(prev => ({ ...prev, organic: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="organic">Organic Product</Label>
            </div>

            <div className="flex gap-3">
              <Button onClick={addProduct} className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
              <Button variant="outline" onClick={() => setShowAddProduct(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receipt Modal */}
      <Dialog open={showReceiptModal} onOpenChange={setShowReceiptModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="w-6 h-6" />
              Digital Receipt
            </DialogTitle>
            <DialogDescription>
              Automated purchase receipt with blockchain verification
            </DialogDescription>
          </DialogHeader>
          
          {currentReceipt && (
            <div className="space-y-6">
              {/* Receipt Header */}
              <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-green-800 mb-2">
                  🎉 Purchase Successful!
                </h2>
                <p className="text-gray-600">
                  Automated checkout completed at Uzhavan Santhai
                </p>
              </div>

              {/* Receipt Details */}
              <div className="bg-white border rounded-lg p-6 space-y-4">
                <div className="text-center border-b pb-4">
                  <h3 className="text-lg font-bold text-green-700">🏪 GreenLedger Uzhavan Santhai</h3>
                  <p className="text-sm text-gray-600">Automated Farm Store • Direct from Farmers</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Purchase ID:</span>
                    <p className="font-mono">{currentReceipt.id}</p>
                  </div>
                  <div>
                    <span className="font-medium">Customer:</span>
                    <p>{currentReceipt.customerName}</p>
                  </div>
                  <div>
                    <span className="font-medium">Date & Time:</span>
                    <p>{new Date(currentReceipt.timestamp).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="font-medium">Payment Method:</span>
                    <p>{currentReceipt.paymentMethod}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Blockchain Tx:</span>
                    <p className="font-mono text-blue-600">{currentReceipt.txHash}</p>
                  </div>
                </div>

                <Separator />

                {/* Items */}
                <div>
                  <h4 className="font-semibold mb-3">Items Purchased:</h4>
                  <div className="space-y-3">
                    {currentReceipt.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.productName}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <h5 className="font-medium">{item.productName}</h5>
                            <p className="text-sm text-gray-600">{item.farmer}</p>
                            <p className="text-xs text-gray-500">QR: {item.qrCode}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">₹{item.total.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">₹{item.price} × {item.quantity}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Total */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Amount</span>
                    <span className="text-2xl font-bold text-green-600">₹{currentReceipt.totalAmount.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Automated checkout • No queues • Contactless payment</p>
                </div>

                {/* QR Code */}
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium mb-2">Purchase Verification QR</h5>
                  <div className="w-24 h-24 mx-auto bg-white p-2 rounded-lg">
                    <img 
                      src={currentReceipt.receiptQR} 
                      alt="Receipt QR Code" 
                      className="w-full h-full"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Scan to verify purchase details</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={() => downloadReceipt(currentReceipt)}
                  className="flex-1"
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button
                  onClick={() => printReceipt(currentReceipt)}
                  className="flex-1"
                  variant="outline"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print Receipt
                </Button>
                <Button
                  onClick={() => {
                    const shareText = `🏪 Uzhavan Santhai Purchase\nPurchase ID: ${currentReceipt.id}\nTotal: ₹${currentReceipt.totalAmount.toLocaleString()}\nItems: ${currentReceipt.items.length} products\nBlockchain: ${currentReceipt.txHash}`;
                    navigator.clipboard.writeText(shareText);
                    toast.success('Receipt details copied to clipboard!');
                  }}
                  className="flex-1"
                  variant="outline"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>

              <div className="text-center text-sm text-gray-500">
                <p>Thank you for shopping at Uzhavan Santhai! 🌱</p>
                <p>Supporting farmers • Promoting sustainability • Embracing technology</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Terms & Conditions Modal */}
      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Store Policies & Terms
            </DialogTitle>
            <DialogDescription>
              Uzhavan Santhai Hub automated store policies and conditions
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">🏪 Store Operations</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• <strong>Automated Stock Management:</strong> Our AI-powered system continuously monitors inventory levels and automatically updates product availability in real-time.</p>
                <p>• <strong>Quality Assurance:</strong> All products undergo automated quality checks. Spoiled or expired products are automatically removed from shelves.</p>
                <p>• <strong>Dynamic Pricing:</strong> Prices are set based on real-time market conditions, farmer recommendations, and community voting.</p>
                <p>• <strong>Contactless Shopping:</strong> Amazon Go-style technology enables pickup and automatic billing without human intervention.</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3">🔗 Blockchain & QR Authentication</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• <strong>QR Code Authenticity:</strong> Every product has a unique QR code linking to blockchain records for complete traceability.</p>
                <p>• <strong>Transaction Security:</strong> All purchases are recorded on blockchain with immutable transaction hashes.</p>
                <p>• <strong>Farmer Verification:</strong> Each farmer's identity and product origin is verified through blockchain technology.</p>
                <p>• <strong>Smart Contracts:</strong> Payments to farmers are automated through smart contracts upon product sale.</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3">📦 Product & Inventory Management</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• <strong>Automated Restocking:</strong> Low stock alerts trigger automatic reorder from verified farmers.</p>
                <p>• <strong>Spoilage Detection:</strong> AI monitors product freshness and automatically removes spoiled items.</p>
                <p>• <strong>Predictive Analytics:</strong> Demand forecasting optimizes inventory levels and reduces waste.</p>
                <p>• <strong>Real-time Updates:</strong> Stock levels update instantly across all customer interfaces.</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3">💳 Payment & Receipts</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• <strong>Multiple Payment Options:</strong> Support for UPI, cards, digital wallets, and cash on delivery.</p>
                <p>• <strong>Digital Receipts:</strong> All purchases generate blockchain-secured digital receipts with QR verification.</p>
                <p>• <strong>Instant Processing:</strong> Payments are processed immediately with automatic confirmation.</p>
                <p>• <strong>Receipt History:</strong> Complete purchase history is maintained for customer reference.</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3">🌍 Multilingual & Accessibility</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• <strong>Language Support:</strong> Full support for English, Hindi, Tamil, and Odia languages.</p>
                <p>• <strong>Farmer-Friendly Interface:</strong> Designed with simplicity and accessibility in mind.</p>
                <p>• <strong>Voice Commands:</strong> Voice-activated shopping assistance available.</p>
                <p>• <strong>Mobile Responsive:</strong> Optimized for all device types and screen sizes.</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3">⚠️ Important Disclaimers</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• <strong>Demo Environment:</strong> This is a demonstration system using dummy data for testing purposes.</p>
                <p>• <strong>Simulated Transactions:</strong> All purchases, payments, and blockchain records are simulated.</p>
                <p>• <strong>Educational Purpose:</strong> System designed to showcase automated farm-to-consumer technology.</p>
                <p>• <strong>Data Privacy:</strong> No real personal or financial data is collected or stored.</p>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">🌱 Our Mission</h4>
              <p className="text-sm text-green-700">
                Uzhavan Santhai Hub represents the future of agricultural commerce - connecting farmers directly with consumers 
                through cutting-edge technology while promoting sustainable farming practices and fair pricing.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}