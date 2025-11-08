import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Progress } from './ui/progress';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Star, 
  MapPin, 
  User, 
  CreditCard, 
  Wallet, 
  Smartphone,
  Building,
  CheckCircle,
  Truck,
  Receipt,
  Download,
  QrCode,
  Clock,
  Leaf,
  Award,
  ArrowRight,
  Filter,
  Search,
  Bell,
  Printer,
  Share2,
  Package,
  Eye,
  TrendingUp,
  BarChart3,
  IndianRupee,
  Navigation,
  Home,
  Heart,
  Phone,
  AlertCircle,
  X,
  Scan,
  Camera,
  Sparkles,
  Zap,
  Shield,
  Globe,
  Route,
  Factory
} from 'lucide-react';
import { EnhancedIcon, getThemeColor } from './EnhancedIcon';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AmazonStyleLiveTrackingEnhanced } from './consumer/AmazonStyleLiveTrackingEnhanced';

// Enhanced interfaces
interface Product {
  id: string;
  name: string;
  price: number;
  mspPrice: number;
  unit: string;
  farmer: {
    name: string;
    state: string;
    district: string;
    rating: number;
    phone: string;
    uzhavarPin: string;
    cropType: string;
    farmSize: string;
  };
  warehouse: {
    name: string;
    state: string;
    district: string;
    phone: string;
    id: string;
  };
  quality: 'Premium' | 'Grade A' | 'Grade B';
  organic: boolean;
  inStock: number;
  rating: number;
  reviews: number;
  deliveryTime: string;
  carbonFootprint: number;
  harvestDate: string;
  qrCode: string;
  image: string;
  description: string;
  category: string;
  blockchainTx: string;
  certifications: string[];
  nutritionalInfo: Record<string, string>;
}

interface CartItem extends Product {
  quantity: number;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  farmer: string;
  location: string;
  qrCode: string;
  image: string;
  blockchainTx: string;
}

interface Order {
  id: string;
  customer: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  deliveryAddress: string;
  orderDate: string;
  estimatedDelivery: string;
  status: 'ordered' | 'packed' | 'dispatched' | 'out_for_delivery' | 'delivered';
  trackingId: string;
  blockchainTx: string;
  receiptQR: string;
  carbonSaved: number;
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
    timestamp: string;
  };
  route: {
    warehouse: { lat: number; lng: number; name: string };
    uzhavanSanthai: { lat: number; lng: number; name: string };
    customer: { lat: number; lng: number; address: string };
  };
}

interface QRProductInfo {
  qrCode: string;
  product: Product;
  journey: {
    farm: { date: string; location: string; status: string };
    warehouse: { date: string; location: string; status: string };
    uzhavanSanthai: { date: string; location: string; status: string };
    delivery: { date: string; location: string; status: string };
  };
}

// Enhanced mock products with comprehensive details
const enhancedMockProducts: Product[] = [
  {
    id: 'PROD001',
    name: 'Premium Basmati Rice',
    price: 85,
    mspPrice: 90,
    unit: 'kg',
    farmer: {
      name: 'Sita Devi Sharma',
      state: 'Punjab',
      district: 'Amritsar',
      rating: 4.9,
      phone: '+91-98765-43210',
      uzhavarPin: 'UZH001PB',
      cropType: 'Aromatic Rice',
      farmSize: '5.2 acres'
    },
    warehouse: {
      name: 'Amritsar Central Hub',
      state: 'Punjab',
      district: 'Amritsar',
      phone: '+91-98765-54321',
      id: 'WH001PB'
    },
    quality: 'Premium',
    organic: true,
    inStock: 150,
    rating: 4.8,
    reviews: 234,
    deliveryTime: '2-3 hours',
    carbonFootprint: 0.5,
    harvestDate: '2024-12-15',
    qrCode: 'QR001_RICE_SITA_PB',
    image: 'https://images.unsplash.com/photo-1705147289789-6df2593f1b1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNtYXRpJTIwcmljZSUyMGdyYWlucyUyMHdoaXRlJTIwcHJlbWl1bXxlbnwxfHx8fDE3NTg2MzQyNTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Aromatic premium basmati rice from the fields of Punjab',
    category: 'grains',
    blockchainTx: '0x8F4A2B9E7C1D3F6A8B5C2E9D7F4A1B6C3E8D5F2A7B9C4E6D1F8A3B5C7E9D2F4A6B8C',
    certifications: ['Organic Certified', 'Fair Trade', 'Blockchain Verified'],
    nutritionalInfo: {
      'Calories': '365 kcal/100g',
      'Protein': '7.1g',
      'Carbs': '78g',
      'Fiber': '1.3g'
    }
  },
  {
    id: 'PROD002',
    name: 'Golden Wheat',
    price: 45,
    mspPrice: 48,
    unit: 'kg',
    farmer: {
      name: 'Ramesh Kumar Patel',
      state: 'Uttar Pradesh',
      district: 'Aligarh',
      rating: 4.7,
      phone: '+91-98765-43211',
      uzhavarPin: 'UZH002UP',
      cropType: 'Durum Wheat',
      farmSize: '8.5 acres'
    },
    warehouse: {
      name: 'Delhi NCR Grain Terminal',
      state: 'Delhi',
      district: 'South Delhi',
      phone: '+91-98765-54322',
      id: 'WH002DL'
    },
    quality: 'Grade A',
    organic: true,
    inStock: 200,
    rating: 4.6,
    reviews: 189,
    deliveryTime: '1-2 hours',
    carbonFootprint: 0.3,
    harvestDate: '2024-12-10',
    qrCode: 'QR002_WHEAT_RAMESH_UP',
    image: 'https://images.unsplash.com/photo-1567395401530-d99add784641?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHdoZWF0JTIwZ3JhaW5zJTIwZ29sZGVufGVufDF8fHx8MTc1ODYzNDI2MXww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Premium golden wheat from the fertile plains of UP',
    category: 'grains',
    blockchainTx: '0x7E3B8F2A9C4D6E1F5A8B2C9D7E4F1A6B3C8D5E2F9A7B4C6D1E8F3A5B7C9D2E4F6A8B',
    certifications: ['Organic Certified', 'Quality Grade A'],
    nutritionalInfo: {
      'Calories': '340 kcal/100g',
      'Protein': '13g',
      'Carbs': '71g',
      'Fiber': '12g'
    }
  },
  {
    id: 'PROD003',
    name: 'Organic Tomatoes',
    price: 65,
    mspPrice: 70,
    unit: 'kg',
    farmer: {
      name: 'Priya Das',
      state: 'Maharashtra',
      district: 'Pune',
      rating: 4.5,
      phone: '+91-98765-43212',
      uzhavarPin: 'UZH003MH',
      cropType: 'Cherry Tomatoes',
      farmSize: '3.2 acres'
    },
    warehouse: {
      name: 'Mumbai Fresh Produce Hub',
      state: 'Maharashtra',
      district: 'Mumbai',
      phone: '+91-98765-54323',
      id: 'WH003MH'
    },
    quality: 'Premium',
    organic: true,
    inStock: 80,
    rating: 4.4,
    reviews: 156,
    deliveryTime: '3-4 hours',
    carbonFootprint: 0.4,
    harvestDate: '2024-12-18',
    qrCode: 'QR003_TOMATO_PRIYA_MH',
    image: 'https://images.unsplash.com/photo-1613295759649-e16cdcdf22fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwdmVnZXRhYmxlcyUyMHRvbWF0b2VzJTIwZnJlc2h8ZW58MXx8fHwxNzU4NjM0MjY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Fresh organic tomatoes from Maharashtra farms',
    category: 'vegetables',
    blockchainTx: '0x6D2A8E4F7B1C9D6E3F8A2B5C7D4E1F6A9B2C5D8E1F4A7B3C6D9E2F5A8B1C4D7E6F9A',
    certifications: ['Organic Certified', 'Pesticide Free'],
    nutritionalInfo: {
      'Calories': '18 kcal/100g',
      'Vitamin C': '14mg',
      'Potassium': '237mg',
      'Lycopene': 'High'
    }
  },
  {
    id: 'PROD004',
    name: 'Green Peas',
    price: 120,
    mspPrice: 125,
    unit: 'kg',
    farmer: {
      name: 'Jagannath Pradhan',
      state: 'Odisha',
      district: 'Cuttack',
      rating: 4.3,
      phone: '+91-98765-43213',
      uzhavarPin: 'UZH004OR',
      cropType: 'Green Peas',
      farmSize: '2.8 acres'
    },
    warehouse: {
      name: 'Bhubaneswar Agri Complex',
      state: 'Odisha',
      district: 'Bhubaneswar',
      phone: '+91-98765-54324',
      id: 'WH004OR'
    },
    quality: 'Grade A',
    organic: false,
    inStock: 60,
    rating: 4.2,
    reviews: 98,
    deliveryTime: '4-5 hours',
    carbonFootprint: 0.2,
    harvestDate: '2024-12-16',
    qrCode: 'QR004_PEAS_JAGANNATH_OR',
    image: 'https://images.unsplash.com/photo-1675501347570-cac3b8cbd5c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHBlYXMlMjBmcmVzaCUyMGxlZ3VtZXN8ZW58MXx8fHwxNzU4NjM0MjY4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Fresh green peas from coastal Odisha',
    category: 'vegetables',
    blockchainTx: '0x5C1B7E3A9D6F2A8C5E1B4D7F3A6B9C2E5D8F1A4B7C3E6D9F2A5B8C1D4E7F6A9B2C5',
    certifications: ['Quality Grade A', 'Fresh Harvest'],
    nutritionalInfo: {
      'Calories': '81 kcal/100g',
      'Protein': '5.4g',
      'Fiber': '5.7g',
      'Vitamin K': '24.8μg'
    }
  },
  {
    id: 'PROD005',
    name: 'Cotton Bolls',
    price: 5500,
    mspPrice: 5800,
    unit: 'quintal',
    farmer: {
      name: 'Manoj Kumar Singh',
      state: 'Gujarat',
      district: 'Surat',
      rating: 4.6,
      phone: '+91-98765-43214',
      uzhavarPin: 'UZH005GJ',
      cropType: 'Long Staple Cotton',
      farmSize: '12.5 acres'
    },
    warehouse: {
      name: 'Surat Cotton Exchange',
      state: 'Gujarat',
      district: 'Surat',
      phone: '+91-98765-54325',
      id: 'WH005GJ'
    },
    quality: 'Premium',
    organic: false,
    inStock: 10,
    rating: 4.7,
    reviews: 45,
    deliveryTime: '1-2 days',
    carbonFootprint: 2.1,
    harvestDate: '2024-12-05',
    qrCode: 'QR005_COTTON_MANOJ_GJ',
    image: 'https://images.unsplash.com/photo-1726013452210-d9ccae841fc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3R0b24lMjBjcm9wJTIwd2hpdGUlMjBmbHVmZnl8ZW58MXx8fHwxNzU4NjM0MjcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Premium quality cotton bolls from Gujarat',
    category: 'cash_crops',
    blockchainTx: '0x4B9E6F2A8C5D1E7F4A6B9C2D5E8F1A4B7C3E6D9F2A5B8C1D4E7F6A9B2C5D8E1F4A7',
    certifications: ['Premium Quality', 'Export Grade'],
    nutritionalInfo: {
      'Fiber Length': '28-30mm',
      'Micronaire': '3.8-4.2',
      'Strength': '28-30 g/tex',
      'Grade': 'Middling'
    }
  },
  {
    id: 'PROD006',
    name: 'Yellow Corn',
    price: 25,
    mspPrice: 28,
    unit: 'kg',
    farmer: {
      name: 'Anita Rani',
      state: 'Karnataka',
      district: 'Bangalore',
      rating: 4.4,
      phone: '+91-98765-43215',
      uzhavarPin: 'UZH006KA',
      cropType: 'Sweet Corn',
      farmSize: '6.2 acres'
    },
    warehouse: {
      name: 'Bangalore Tech Agri Hub',
      state: 'Karnataka',
      district: 'Bangalore',
      phone: '+91-98765-54326',
      id: 'WH006KA'
    },
    quality: 'Grade A',
    organic: true,
    inStock: 180,
    rating: 4.3,
    reviews: 123,
    deliveryTime: '2-3 hours',
    carbonFootprint: 0.4,
    harvestDate: '2024-12-12',
    qrCode: 'QR006_CORN_ANITA_KA',
    image: 'https://images.unsplash.com/photo-1672237625225-1610e2b4fd5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3JuJTIwa2VybmVscyUyMHllbGxvdyUyMGZyZXNofGVufDF8fHx8MTc1ODYzNDI3NXww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Fresh yellow corn kernels from Karnataka farms',
    category: 'grains',
    blockchainTx: '0x3A8D5F1B7C9E2A6D4F8B1C5E9A2D6F3B7C4E8D1F5A9B2C6E3D7F4A8B1C5D9E2F6A3',
    certifications: ['Organic Certified', 'Non-GMO'],
    nutritionalInfo: {
      'Calories': '365 kcal/100g',
      'Protein': '9.4g',
      'Fiber': '7.3g',
      'Vitamin B6': '0.6mg'
    }
  }
];

// Dummy customer data
const dummyCustomer = {
  name: 'Rahul Verma',
  phone: '+91-98765-12345',
  email: 'rahul.verma@email.com',
  address: 'Block B, Sector 15, Noida, UP - 201301'
};

export function ConsumerModuleEnhanced() {
  const { t } = useLanguage();
  
  // State management
  const [products] = useState<Product[]>(enhancedMockProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rating');
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [deliveryAddress, setDeliveryAddress] = useState(dummyCustomer.address);
  const [showOTP, setShowOTP] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('shop');
  
  // QR Scanner states
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [qrInput, setQrInput] = useState('');
  const [qrProduct, setQrProduct] = useState<QRProductInfo | null>(null);
  const [showQRDetails, setShowQRDetails] = useState(false);
  
  // Tracking states
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);
  const [showTrackingDetails, setShowTrackingDetails] = useState(false);

  // Generate enhanced QR code with logo
  const generateQRCode = (data: string): string => {
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <!-- QR Pattern -->
        <g fill="black">
          <rect x="20" y="20" width="20" height="20"/>
          <rect x="60" y="20" width="20" height="20"/>
          <rect x="100" y="20" width="20" height="20"/>
          <rect x="140" y="20" width="20" height="20"/>
          <rect x="20" y="60" width="20" height="20"/>
          <rect x="100" y="60" width="20" height="20"/>
          <rect x="20" y="100" width="20" height="20"/>
          <rect x="60" y="100" width="20" height="20"/>
          <rect x="140" y="100" width="20" height="20"/>
          <rect x="20" y="140" width="20" height="20"/>
          <rect x="60" y="140" width="20" height="20"/>
          <rect x="100" y="140" width="20" height="20"/>
          <rect x="140" y="140" width="20" height="20"/>
        </g>
        <!-- GreenLedger Logo in center -->
        <circle cx="100" cy="100" r="25" fill="white" stroke="black" stroke-width="2"/>
        <text x="100" y="95" text-anchor="middle" font-size="8" fill="green" font-weight="bold">🌾</text>
        <text x="100" y="108" text-anchor="middle" font-size="6" fill="black">GL</text>
        <text x="100" y="185" text-anchor="middle" font-size="10" fill="black">${data}</text>
      </svg>
    `)}`; 
  };

  // QR Scanner functions
  const handleQRScan = useCallback((qrCode: string) => {
    const product = products.find(p => p.qrCode === qrCode);
    
    if (product) {
      const qrProductInfo: QRProductInfo = {
        qrCode,
        product,
        journey: {
          farm: {
            date: product.harvestDate,
            location: `${product.farmer.district}, ${product.farmer.state}`,
            status: 'Harvested'
          },
          warehouse: {
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            location: product.warehouse.name,
            status: 'Quality Checked'
          },
          uzhavanSanthai: {
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            location: 'Noida Uzhavan Santhai',
            status: 'Available for Purchase'
          },
          delivery: {
            date: 'Pending Order',
            location: 'Customer Location',
            status: 'Awaiting Order'
          }
        }
      };
      
      setQrProduct(qrProductInfo);
      setShowQRDetails(true);
      toast.success('🎯 Product found!', {
        description: `${product.name} from ${product.farmer.name}`
      });
    } else {
      toast.error('❌ Product not found', {
        description: 'This QR code is not in our database'
      });
    }
  }, [products]);

  const handleQRInput = () => {
    if (qrInput.trim()) {
      handleQRScan(qrInput.trim());
      setQrInput('');
    }
  };

  // Cart functions
  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: Math.min(item.quantity + 1, product.inStock) }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    toast.success(`${product.name} added to cart!`, {
      description: `₹${product.price}/${product.unit} • ${product.farmer.name}`
    });
  };

  const removeFromCart = (productId: string) => {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
    } else {
      setCart(cart.filter(item => item.id !== productId));
    }
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalCarbonSaved = () => {
    return cart.reduce((total, item) => total + (item.carbonFootprint * item.quantity), 0);
  };

  // Enhanced payment simulation
  const handlePayment = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    if (!deliveryAddress) {
      toast.error('Please enter delivery address');
      return;
    }

    setShowCheckout(false);
    setShowPayment(true);
  };

  const processPayment = () => {
    setPaymentLoading(true);
    
    if (paymentMethod === 'cash') {
      setTimeout(() => {
        completeOrder('pending');
      }, 1500);
    } else {
      setShowOTP(true);
      setPaymentLoading(false);
    }
  };

  const verifyOTP = () => {
    if (otpValue.length !== 6) {
      toast.error('Please enter 6-digit OTP');
      return;
    }

    setPaymentLoading(true);
    
    setTimeout(() => {
      completeOrder('paid');
    }, 2000);
  };

  const completeOrder = (paymentStatus: 'paid' | 'pending') => {
    const orderId = `ORD-GL-${Date.now().toString().slice(-4)}`;
    const trackingId = `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const blockchainTx = `0x${Math.random().toString(16).substr(2, 64).toUpperCase()}`;
    
    // Generate realistic route coordinates
    const warehouseCoords = { lat: 28.5355, lng: 77.3910, name: 'Delhi NCR Agri Hub' };
    const uzhavanCoords = { lat: 28.5672, lng: 77.4085, name: 'Noida Uzhavan Santhai' };
    const customerCoords = { lat: 28.5925, lng: 77.4143, address: deliveryAddress };

    const order: Order = {
      id: orderId,
      customer: dummyCustomer.name,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
        farmer: `${item.farmer.name} (${item.farmer.district}, ${item.farmer.state})`,
        location: `${item.warehouse.name}`,
        qrCode: item.qrCode,
        image: item.image,
        blockchainTx: item.blockchainTx
      })),
      totalAmount: getTotalAmount(),
      paymentMethod: paymentMethod.toUpperCase(),
      paymentStatus,
      deliveryAddress,
      orderDate: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'ordered',
      trackingId,
      blockchainTx,
      receiptQR: generateQRCode(orderId),
      carbonSaved: getTotalCarbonSaved(),
      currentLocation: warehouseCoords,
      route: {
        warehouse: warehouseCoords,
        uzhavanSanthai: uzhavanCoords,
        customer: customerCoords
      }
    };

    setOrders(prev => [order, ...prev]);
    setCurrentReceipt(order);
    setCart([]);
    setShowPayment(false);
    setShowOTP(false);
    setOtpValue('');
    setPaymentLoading(false);
    setShowReceipt(true);

    // Success notifications
    toast.success('✅ Order placed successfully!', {
      description: `Receipt generated for ₹${order.totalAmount.toLocaleString()}`
    });

    setTimeout(() => {
      toast.info('📦 Order is being prepared for dispatch', {
        description: `Tracking ID: ${trackingId}`
      });
    }, 2000);

    // Simulate order progress
    setTimeout(() => {
      setOrders(prev => prev.map(o => 
        o.id === orderId 
          ? { ...o, status: 'packed', currentLocation: uzhavanCoords }
          : o
      ));
      toast.info('📦 Order packed and ready for dispatch!');
    }, 5000);
  };

  // Enhanced receipt functions
  const downloadReceipt = (order: Order) => {
    const receiptData = {
      greenLedgerReceipt: {
        version: "2.0",
        timestamp: new Date().toISOString(),
        receiptType: "BLOCKCHAIN_VERIFIED_PURCHASE"
      },
      orderDetails: {
        orderId: order.id,
        customer: {
          name: order.customer,
          phone: dummyCustomer.phone,
          email: dummyCustomer.email
        },
        orderDate: new Date(order.orderDate).toISOString(),
        trackingId: order.trackingId,
        blockchainTx: order.blockchainTx,
        qrCode: order.receiptQR
      },
      items: order.items.map(item => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.total,
        farmer: item.farmer,
        warehouseLocation: item.location,
        qrCode: item.qrCode,
        blockchainTx: item.blockchainTx
      })),
      financials: {
        subtotal: order.totalAmount,
        taxes: Math.round(order.totalAmount * 0.05),
        platformFee: 0,
        deliveryCharge: 0,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        currency: "INR"
      },
      logistics: {
        deliveryAddress: order.deliveryAddress,
        estimatedDelivery: new Date(order.estimatedDelivery).toISOString(),
        currentStatus: order.status,
        route: order.route
      },
      sustainability: {
        carbonFootprintSaved: order.carbonSaved,
        organicProducts: order.items.filter(item => 
          products.find(p => p.id === item.id)?.organic
        ).length,
        localSourcing: true,
        farmToConsumerDirect: true
      },
      certifications: {
        blockchainVerified: true,
        qualityAssured: true,
        farmSourceVerified: true
      }
    };

    const dataStr = JSON.stringify(receiptData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `GreenLedger_Receipt_${order.id}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('📥 Enhanced receipt downloaded!', {
      description: 'Includes blockchain verification and sustainability metrics'
    });
  };

  const printReceipt = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>GreenLedger Receipt - ${order.id}</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 20px; line-height: 1.6; }
              .header { text-align: center; color: #22c55e; margin-bottom: 30px; border-bottom: 2px solid #22c55e; padding-bottom: 20px; }
              .header h1 { margin: 0; font-size: 28px; }
              .header p { margin: 5px 0; color: #666; }
              .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
              .section h3 { color: #22c55e; margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 10px; }
              .details { display: flex; justify-content: space-between; margin: 8px 0; }
              .details strong { color: #333; }
              .items { margin: 20px 0; }
              .item { margin: 15px 0; padding: 15px; background: #f9f9f9; border-radius: 5px; }
              .total { font-weight: bold; font-size: 20px; color: #22c55e; text-align: center; margin: 20px 0; padding: 15px; background: #f0fdf4; border-radius: 8px; }
              .qr-section { text-align: center; margin: 20px 0; }
              .blockchain { font-family: monospace; font-size: 10px; word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 4px; }
              .footer { margin-top: 30px; text-align: center; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
              .badge { display: inline-block; background: #22c55e; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin: 2px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🌾 GreenLedger Digital Receipt</h1>
              <p>Direct Farm-to-Consumer Platform • Blockchain Secured • Zero Middlemen</p>
              <div class="qr-section">
                <img src="${order.receiptQR}" alt="Receipt QR Code" style="width: 100px; height: 100px;">
                <p style="font-size: 12px; margin-top: 10px;">Scan for verification</p>
              </div>
            </div>
            
            <div class="section">
              <h3>📋 Order Information</h3>
              <div class="details"><span>Order ID:</span> <strong>${order.id}</strong></div>
              <div class="details"><span>Customer:</span> <strong>${order.customer}</strong></div>
              <div class="details"><span>Order Date:</span> <strong>${new Date(order.orderDate).toLocaleString()}</strong></div>
              <div class="details"><span>Tracking ID:</span> <strong>${order.trackingId}</strong></div>
              <div class="details"><span>Status:</span> <strong>${order.status.toUpperCase()}</strong></div>
            </div>

            <div class="section">
              <h3>🔗 Blockchain Verification</h3>
              <div class="details"><span>Transaction Hash:</span></div>
              <div class="blockchain">${order.blockchainTx}</div>
              <div style="margin-top: 10px;">
                <span class="badge">✅ Verified</span>
                <span class="badge">🔒 Immutable</span>
                <span class="badge">🌐 Transparent</span>
              </div>
            </div>
            
            <div class="section">
              <h3>🛒 Items Ordered</h3>
              ${order.items.map(item => `
                <div class="item">
                  <div class="details"><span><strong>${item.name}</strong></span> <span>Qty: ${item.quantity}</span></div>
                  <div class="details"><span>👨‍🌾 ${item.farmer}</span></div>
                  <div class="details"><span>📍 ${item.location}</span></div>
                  <div class="details"><span>Price:</span> <strong>₹${item.price} × ${item.quantity} = ₹${item.total.toLocaleString()}</strong></div>
                  <div class="details"><span>QR Code:</span> <span style="font-family: monospace; font-size: 11px;">${item.qrCode}</span></div>
                </div>
              `).join('')}
            </div>

            <div class="section">
              <h3>💳 Payment Details</h3>
              <div class="details"><span>Payment Method:</span> <strong>${order.paymentMethod}</strong></div>
              <div class="details"><span>Payment Status:</span> <strong>${order.paymentStatus.toUpperCase()}</strong></div>
              <div class="details"><span>Amount Paid:</span> <strong>₹${order.totalAmount.toLocaleString()}</strong></div>
            </div>

            <div class="section">
              <h3>🚚 Delivery Information</h3>
              <div class="details"><span>Delivery Address:</span></div>
              <div style="margin-left: 20px; margin-top: 5px;"><strong>${order.deliveryAddress}</strong></div>
              <div class="details"><span>Estimated Delivery:</span> <strong>${new Date(order.estimatedDelivery).toLocaleDateString()} by ${new Date(order.estimatedDelivery).toLocaleTimeString()}</strong></div>
            </div>

            <div class="section">
              <h3>🌱 Sustainability Impact</h3>
              <div class="details"><span>Carbon Footprint Saved:</span> <strong>${order.carbonSaved.toFixed(2)} kg CO₂</strong></div>
              <div class="details"><span>Direct Farm Sourcing:</span> <strong>100% Verified</strong></div>
              <div class="details"><span>Middlemen Eliminated:</span> <strong>Yes</strong></div>
              <div style="margin-top: 10px;">
                <span class="badge">🌿 Eco-Friendly</span>
                <span class="badge">🚫 Zero Middlemen</span>
                <span class="badge">✨ Fair Trade</span>
              </div>
            </div>
            
            <div class="total">
              <div>Total Amount Paid: ₹${order.totalAmount.toLocaleString()}</div>
              <div style="font-size: 14px; margin-top: 5px;">Items: ${order.items.length} | Carbon Saved: ${order.carbonSaved.toFixed(2)} kg CO₂</div>
            </div>
            
            <div class="footer">
              <p><strong>Thank you for supporting sustainable farming! 🌱</strong></p>
              <p>GreenLedger - Connecting Farmers Directly to Consumers</p>
              <p style="font-size: 12px; margin-top: 10px;">
                📞 Support: +91-1800-GREENLEDGER | 🌐 www.greenledger.farm<br>
                Generated on: ${new Date().toLocaleString()} | Version: 2.0
              </p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
    
    toast.success('🖨️ Enhanced receipt sent to printer!');
  };

  const shareReceipt = (order: Order) => {
    const shareText = `🌾 GreenLedger Order Receipt

📋 Order ID: ${order.id}
💰 Total: ₹${order.totalAmount.toLocaleString()}
📦 Items: ${order.items.length} products from verified farmers
🌱 Carbon Saved: ${order.carbonSaved.toFixed(2)} kg CO₂
🔗 Blockchain: ${order.blockchainTx.slice(0, 20)}...
📍 Tracking: ${order.trackingId}

✅ 100% Farm-to-Consumer Direct
🚫 Zero Middlemen | 🌿 Sustainable Choice

#GreenLedger #SustainableFarming #DirectFromFarm #BlockchainVerified`;

    if (navigator.share) {
      navigator.share({
        title: `GreenLedger Receipt - ${order.id}`,
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('📋 Enhanced receipt details copied!', {
        description: 'Paste to share your sustainable purchase'
      });
    }
  };

  // Filter and sort products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.farmer.state.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
                           (selectedCategory === 'organic' && product.organic) ||
                           (selectedCategory === 'premium' && product.quality === 'Premium') ||
                           product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return a.price - b.price;
      case 'price_high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'delivery':
        return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
      default:
        return 0;
    }
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 via-blue-500 to-green-600 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">🛒 GreenLedger Marketplace</h1>
            <p className="text-green-100 mt-1">
              Farm-Fresh • QR Verified • Live Tracking • Blockchain Secured
            </p>
            <div className="flex items-center mt-3 space-x-4">
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Leaf className="w-3 h-3 mr-1" />
                {orders.reduce((acc, order) => acc + order.carbonSaved, 0).toFixed(1)} kg CO₂ Saved
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Star className="w-3 h-3 mr-1" />
                {orders.length} Orders Placed
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Shield className="w-3 h-3 mr-1" />
                Blockchain Verified
              </Badge>
            </div>
          </div>
          <div className="text-right space-y-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setShowCheckout(true)}
                className="bg-white/20 hover:bg-white/30 text-white relative px-6 py-3"
                disabled={cart.length === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Cart ({getTotalItems()})
                {getTotalItems() > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    {getTotalItems()}
                  </motion.span>
                )}
              </Button>
            </motion.div>
            {getTotalAmount() > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm bg-white/20 rounded px-3 py-1"
              >
                ₹{getTotalAmount().toLocaleString()}
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Floating background elements */}
        <div className="absolute right-4 top-4 opacity-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-20 h-20" />
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Action Bar */}
      <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
        <Button 
          onClick={() => setShowQRScanner(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          <QrCode className="w-4 h-4 mr-2" />
          Scan QR Code
        </Button>
        
        <div className="flex items-center gap-2 flex-1">
          <QrCode className="w-4 h-4 text-purple-600" />
          <Input
            placeholder="Enter QR code manually..."
            value={qrInput}
            onChange={(e) => setQrInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleQRInput()}
            className="flex-1"
          />
          <Button onClick={handleQRInput} variant="outline" size="sm">
            <Search className="w-4 h-4" />
          </Button>
        </div>

        <Badge variant="outline" className="bg-green-50 text-green-700">
          <Globe className="w-3 h-3 mr-1" />
          Live Prices
        </Badge>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="shop" className="flex items-center gap-2">
            <EnhancedIcon 
              icon={ShoppingCart} 
              size="sm" 
              glowColor={getThemeColor('consumer')} 
              isActive={activeTab === 'shop'}
              pulse={true}
            />
            Shop Now
          </TabsTrigger>
          <TabsTrigger value="qr" className="flex items-center gap-2">
            <EnhancedIcon 
              icon={QrCode} 
              size="sm" 
              glowColor="rgb(147, 51, 234)" 
              isActive={activeTab === 'qr'}
              pulse={true}
            />
            QR Scanner
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <EnhancedIcon 
              icon={Package} 
              size="sm" 
              glowColor={getThemeColor('consumer')} 
              isActive={activeTab === 'orders'}
              pulse={true}
            />
            Orders
          </TabsTrigger>
          <TabsTrigger value="tracking" className="flex items-center gap-2">
            <EnhancedIcon 
              icon={Navigation} 
              size="sm" 
              glowColor="rgb(34, 197, 94)" 
              isActive={activeTab === 'tracking'}
              pulse={true}
            />
            Live Tracking
          </TabsTrigger>
          <TabsTrigger value="receipts" className="flex items-center gap-2">
            <EnhancedIcon 
              icon={Receipt} 
              size="sm" 
              glowColor="rgb(251, 146, 60)" 
              isActive={activeTab === 'receipts'}
              pulse={true}
            />
            Receipts
          </TabsTrigger>
        </TabsList>

        {/* Shop Tab */}
        <TabsContent value="shop" className="space-y-6">
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products, farmers, states..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="grains">Grains</SelectItem>
                <SelectItem value="vegetables">Vegetables</SelectItem>
                <SelectItem value="cash_crops">Cash Crops</SelectItem>
                <SelectItem value="organic">Organic Only</SelectItem>
                <SelectItem value="premium">Premium Only</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="delivery">Delivery Time</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                    <div className="relative">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 left-2 flex gap-1">
                        {product.organic && (
                          <Badge className="bg-green-500 text-white">
                            <Leaf className="w-3 h-3 mr-1" />
                            Organic
                          </Badge>
                        )}
                        <Badge variant="secondary">
                          {product.quality}
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge variant="outline" className="bg-white/90">
                          ⭐ {product.rating}
                        </Badge>
                      </div>
                      <div className="absolute bottom-2 right-2">
                        <Button
                          size="sm"
                          onClick={() => handleQRScan(product.qrCode)}
                          className="bg-purple-500 hover:bg-purple-600"
                        >
                          <QrCode className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.description}</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-green-600">
                                ₹{product.price}
                              </span>
                              <span className="text-sm text-muted-foreground">/{product.unit}</span>
                            </div>
                            {product.mspPrice > product.price && (
                              <div className="text-xs text-green-600">
                                ₹{product.mspPrice - product.price} below MSP
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              <Clock className="inline w-3 h-3 mr-1" />
                              {product.deliveryTime}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {product.inStock} in stock
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-2 border-t">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="w-3 h-3" />
                            <span>{product.farmer.name}</span>
                            <MapPin className="w-3 h-3 ml-2" />
                            <span>{product.farmer.district}, {product.farmer.state}</span>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => addToCart(product)}
                          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                          disabled={product.inStock === 0}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>

        {/* QR Scanner Tab */}
        <TabsContent value="qr" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-purple-600" />
                QR Code Product Scanner
              </CardTitle>
              <p className="text-muted-foreground">
                Scan or enter QR codes to get detailed product information and farmer details
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="text-center p-8 border-2 border-dashed border-purple-300 rounded-lg bg-purple-50">
                    <Camera className="w-16 h-16 mx-auto mb-4 text-purple-600" />
                    <h3 className="font-semibold mb-2">Camera Scanner</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Use your camera to scan QR codes on products
                    </p>
                    <Button 
                      onClick={() => toast.info('Camera scanner would open here')}
                      className="bg-purple-500 hover:bg-purple-600"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Open Scanner
                    </Button>
                  </div>
                  
                  <div>
                    <Label>Manual QR Entry</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Paste QR code here..."
                        value={qrInput}
                        onChange={(e) => setQrInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleQRInput()}
                      />
                      <Button onClick={handleQRInput} variant="outline">
                        <Search className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Try Sample QR Codes</h3>
                  <div className="space-y-2">
                    {products.slice(0, 4).map((product) => (
                      <Button
                        key={product.id}
                        variant="outline"
                        onClick={() => handleQRScan(product.qrCode)}
                        className="w-full justify-start text-left"
                      >
                        <QrCode className="w-4 h-4 mr-2" />
                        <div>
                          <div className="font-medium">{product.qrCode}</div>
                          <div className="text-xs text-muted-foreground">{product.name}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-4">Start shopping to see your orders here</p>
                <Button onClick={() => setActiveTab('shop')}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">Order #{order.id}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.orderDate).toLocaleDateString()} • {order.items.length} items
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold">₹{order.totalAmount.toLocaleString()}</div>
                          <Badge 
                            className={
                              order.status === 'delivered' ? 'bg-green-500' :
                              order.status === 'out_for_delivery' ? 'bg-blue-500' :
                              order.status === 'dispatched' ? 'bg-yellow-500' :
                              'bg-gray-500'
                            }
                          >
                            {order.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Payment</div>
                          <div className="font-medium">{order.paymentMethod}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Tracking ID</div>
                          <div className="font-medium font-mono text-xs">{order.trackingId}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Carbon Saved</div>
                          <div className="font-medium text-green-600">{order.carbonSaved.toFixed(2)} kg CO₂</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Delivery</div>
                          <div className="font-medium">{new Date(order.estimatedDelivery).toLocaleDateString()}</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedOrderForTracking(order);
                            setShowTrackingDetails(true);
                          }}
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          Track Order
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setCurrentReceipt(order);
                            setShowReceipt(true);
                          }}
                        >
                          <Receipt className="w-4 h-4 mr-2" />
                          View Receipt
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => downloadReceipt(order)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Live Tracking Tab */}
        <TabsContent value="tracking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-green-600" />
                Live Order Tracking
              </CardTitle>
              <p className="text-muted-foreground">
                Real-time tracking from warehouse → Uzhavan Santhai → your doorstep
              </p>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <Route className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">No active deliveries</h3>
                  <p className="text-muted-foreground">Place an order to see live tracking</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Interactive Map Area */}
                  <div className="relative h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-green-200 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-8xl opacity-20 mb-4">🗺️</div>
                        <h3 className="text-xl font-semibold mb-2">Live Tracking Map</h3>
                        <p className="text-muted-foreground">Interactive route visualization</p>
                      </div>
                    </div>
                    
                    {/* Route Animation */}
                    {orders.slice(0, 3).map((order, index) => (
                      <div key={order.id} className="absolute inset-4">
                        {/* Route Line */}
                        <motion.div
                          className="absolute h-1 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 opacity-60 rounded-full"
                          style={{
                            left: `${10 + index * 30}%`,
                            top: `${20 + index * 25}%`,
                            width: '60%',
                            transform: 'rotate(15deg)'
                          }}
                          animate={{
                            opacity: [0.4, 0.8, 0.4],
                            scale: [1, 1.05, 1]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        
                        {/* Moving Vehicle */}
                        <motion.div
                          className="absolute z-10"
                          style={{
                            left: `${20 + index * 30}%`,
                            top: `${18 + index * 25}%`
                          }}
                          animate={{
                            x: [0, 200, 400],
                            y: [0, -10, 0]
                          }}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        >
                          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                            <Truck className="w-4 h-4 text-white" />
                          </div>
                        </motion.div>
                        
                        {/* Warehouse Marker */}
                        <div 
                          className="absolute w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg"
                          style={{
                            left: `${10 + index * 30}%`,
                            top: `${15 + index * 25}%`
                          }}
                        >
                          <Factory className="w-3 h-3 text-white" />
                        </div>
                        
                        {/* Uzhavan Santhai Marker */}
                        <div 
                          className="absolute w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                          style={{
                            left: `${40 + index * 30}%`,
                            top: `${10 + index * 25}%`
                          }}
                        >
                          <Building className="w-3 h-3 text-white" />
                        </div>
                        
                        {/* Customer Marker */}
                        <div 
                          className="absolute w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center shadow-lg"
                          style={{
                            left: `${65 + index * 30}%`,
                            top: `${20 + index * 25}%`
                          }}
                        >
                          <Home className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    ))}
                    
                    {/* Legend */}
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                      <h4 className="font-semibold text-sm mb-2">Route Legend</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <Factory className="w-3 h-3 text-blue-500" />
                          <span>Warehouse</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building className="w-3 h-3 text-green-500" />
                          <span>Uzhavan Santhai</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Home className="w-3 h-3 text-purple-500" />
                          <span>Customer</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Truck className="w-3 h-3 text-orange-500" />
                          <span>Live Vehicle</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Active Orders List */}
                  <div className="grid gap-4">
                    {orders.filter(order => order.status !== 'delivered').map((order) => (
                      <Card key={order.id} className="border-l-4 border-l-green-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-semibold">Order #{order.id}</h4>
                              <p className="text-sm text-muted-foreground">
                                Tracking: {order.trackingId}
                              </p>
                            </div>
                            <Badge 
                              className={
                                order.status === 'delivered' ? 'bg-green-500' :
                                order.status === 'out_for_delivery' ? 'bg-blue-500' :
                                order.status === 'dispatched' ? 'bg-yellow-500' :
                                'bg-gray-500'
                              }
                            >
                              {order.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-green-500" />
                              <span>Current: {order.currentLocation.address}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-blue-500" />
                              <span>Estimated delivery: {new Date(order.estimatedDelivery).toLocaleString()}</span>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progress</span>
                              <span>75%</span>
                            </div>
                            <Progress value={75} className="h-2" />
                          </div>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedOrderForTracking(order);
                              setShowTrackingDetails(true);
                            }}
                            className="mt-3"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Receipts Tab */}
        <TabsContent value="receipts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-orange-600" />
                Digital Receipts
              </CardTitle>
              <p className="text-muted-foreground">
                Download, print, or share your blockchain-verified receipts
              </p>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <Receipt className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">No receipts available</h3>
                  <p className="text-muted-foreground">Place an order to get digital receipts</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="border-l-4 border-l-orange-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">Receipt #{order.id}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.orderDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">₹{order.totalAmount.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">
                              {order.items.length} items
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Payment</div>
                            <div className="font-medium">{order.paymentMethod}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Status</div>
                            <div className="font-medium">{order.paymentStatus.toUpperCase()}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Blockchain</div>
                            <div className="font-mono text-xs">{order.blockchainTx.slice(0, 8)}...</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Carbon Saved</div>
                            <div className="font-medium text-green-600">{order.carbonSaved.toFixed(2)} kg</div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCurrentReceipt(order);
                              setShowReceipt(true);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadReceipt(order)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => printReceipt(order)}
                          >
                            <Printer className="w-4 h-4 mr-2" />
                            Print
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => shareReceipt(order)}
                          >
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </Button>
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

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Your Order</DialogTitle>
            <DialogDescription>
              Verify your items and delivery details before proceeding to payment
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {item.farmer.name} • {item.farmer.district}, {item.farmer.state}
                  </p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="font-semibold">₹{item.price}/{item.unit}</span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addToCart(item)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <span className="font-bold">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{getTotalAmount().toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="text-green-600">FREE</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{getTotalAmount().toLocaleString()}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Delivery Address</Label>
            <Input
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Enter your delivery address"
            />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowCheckout(false)} className="flex-1">
              Continue Shopping
            </Button>
            <Button onClick={handlePayment} className="flex-1">
              Proceed to Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment</DialogTitle>
            <DialogDescription>
              Choose your payment method and complete the transaction
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Amount</span>
                <span className="text-2xl font-bold text-green-600">
                  ₹{getTotalAmount().toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {getTotalItems()} items • Carbon saved: {getTotalCarbonSaved().toFixed(2)} kg CO₂
              </div>
            </div>
            
            <div>
              <Label>Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    UPI (PhonePe, GPay, Paytm)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Credit/Debit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wallet" id="wallet" />
                  <Label htmlFor="wallet" className="flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    Digital Wallet
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4" />
                    Cash on Delivery
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            {showOTP && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <Label>Enter OTP</Label>
                <Input
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                />
                <p className="text-xs text-muted-foreground">
                  OTP sent to your registered mobile number
                </p>
              </motion.div>
            )}
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowPayment(false)} className="flex-1">
                Cancel
              </Button>
              {showOTP ? (
                <Button 
                  onClick={verifyOTP} 
                  disabled={paymentLoading}
                  className="flex-1"
                >
                  {paymentLoading ? 'Verifying...' : 'Verify & Pay'}
                </Button>
              ) : (
                <Button 
                  onClick={processPayment} 
                  disabled={paymentLoading}
                  className="flex-1"
                >
                  {paymentLoading ? 'Processing...' : `Pay ₹${getTotalAmount().toLocaleString()}`}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              Order Successful!
            </DialogTitle>
            <DialogDescription>
              Your order has been placed and receipt generated
            </DialogDescription>
          </DialogHeader>
          
          {currentReceipt && (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {/* Receipt Header */}
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h2 className="text-xl font-bold text-green-600">🌾 GreenLedger Receipt</h2>
                <p className="text-sm text-muted-foreground">
                  Blockchain Verified • Farm-to-Consumer Direct
                </p>
                <div className="mt-3">
                  <img src={currentReceipt.receiptQR} alt="Receipt QR" className="w-24 h-24 mx-auto" />
                  <p className="text-xs mt-1">Scan for verification</p>
                </div>
              </div>
              
              {/* Order Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Order ID</div>
                  <div className="font-mono">{currentReceipt.id}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Date</div>
                  <div>{new Date(currentReceipt.orderDate).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Tracking ID</div>
                  <div className="font-mono text-xs">{currentReceipt.trackingId}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Payment</div>
                  <div>{currentReceipt.paymentMethod} ({currentReceipt.paymentStatus})</div>
                </div>
              </div>
              
              {/* Blockchain */}
              <div>
                <div className="text-sm text-muted-foreground mb-1">Blockchain Transaction</div>
                <div className="font-mono text-xs bg-gray-100 p-2 rounded break-all">
                  {currentReceipt.blockchainTx}
                </div>
              </div>
              
              {/* Items */}
              <div>
                <h3 className="font-semibold mb-2">Items ({currentReceipt.items.length})</h3>
                <div className="space-y-2">
                  {currentReceipt.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-muted-foreground">{item.farmer}</div>
                      </div>
                      <div className="text-right">
                        <div>₹{item.price} × {item.quantity}</div>
                        <div className="font-bold">₹{item.total.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Paid</span>
                  <span className="text-green-600">₹{currentReceipt.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Carbon Saved</span>
                  <span>{currentReceipt.carbonSaved.toFixed(2)} kg CO₂</span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadReceipt(currentReceipt)}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => printReceipt(currentReceipt)}
                >
                  <Printer className="w-4 h-4 mr-1" />
                  Print
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareReceipt(currentReceipt)}
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedOrderForTracking(currentReceipt);
                    setShowTrackingDetails(true);
                    setShowReceipt(false);
                  }}
                >
                  <Navigation className="w-4 h-4 mr-1" />
                  Track
                </Button>
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowReceipt(false)} className="flex-1">
              Close
            </Button>
            <Button onClick={() => {
              setShowReceipt(false);
              setActiveTab('shop');
            }} className="flex-1">
              Continue Shopping
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Product Details Dialog */}
      <Dialog open={showQRDetails} onOpenChange={setShowQRDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="w-6 h-6 text-purple-600" />
              Product Information
            </DialogTitle>
            <DialogDescription>
              Complete product journey from farm to your table
            </DialogDescription>
          </DialogHeader>
          
          {qrProduct && (
            <div className="space-y-6">
              {/* Product Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ImageWithFallback
                    src={qrProduct.product.image}
                    alt={qrProduct.product.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold">{qrProduct.product.name}</h3>
                    <p className="text-muted-foreground">{qrProduct.product.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Price</div>
                      <div className="text-xl font-bold text-green-600">
                        ₹{qrProduct.product.price}/{qrProduct.product.unit}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Quality</div>
                      <div className="font-semibold">{qrProduct.product.quality}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {qrProduct.product.organic && (
                      <Badge className="bg-green-500">
                        <Leaf className="w-3 h-3 mr-1" />
                        Organic
                      </Badge>
                    )}
                    <Badge variant="outline">
                      <Star className="w-3 h-3 mr-1" />
                      {qrProduct.product.rating} Rating
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Farmer Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-green-600" />
                    Farmer Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-sm text-muted-foreground">Name</div>
                        <div className="font-semibold">{qrProduct.product.farmer.name}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Location</div>
                        <div>{qrProduct.product.farmer.district}, {qrProduct.product.farmer.state}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Uzhavar PIN</div>
                        <div className="font-mono">{qrProduct.product.farmer.uzhavarPin}</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-sm text-muted-foreground">Crop Type</div>
                        <div>{qrProduct.product.farmer.cropType}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Farm Size</div>
                        <div>{qrProduct.product.farmer.farmSize}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Rating</div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          {qrProduct.product.farmer.rating}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Product Journey */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Route className="w-5 h-5 text-blue-600" />
                    Product Journey
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(qrProduct.journey).map(([stage, details], index) => (
                      <div key={stage} className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                          stage === 'farm' ? 'bg-green-500' :
                          stage === 'warehouse' ? 'bg-blue-500' :
                          stage === 'uzhavanSanthai' ? 'bg-purple-500' :
                          'bg-orange-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold capitalize">{stage.replace(/([A-Z])/g, ' $1')}</div>
                          <div className="text-sm text-muted-foreground">{details.location}</div>
                          <div className="text-xs text-muted-foreground">
                            {details.date !== 'Pending Order' ? new Date(details.date).toLocaleDateString() : details.date} • {details.status}
                          </div>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${
                          details.status.includes('Pending') ? 'bg-gray-300' : 'bg-green-500'
                        }`} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Certifications & Blockchain */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Certifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {qrProduct.product.certifications.map((cert) => (
                        <Badge key={cert} variant="outline" className="mr-1 mb-1">
                          <Shield className="w-3 h-3 mr-1" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Blockchain Verification</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">Transaction Hash</div>
                      <div className="font-mono text-xs bg-gray-100 p-2 rounded break-all">
                        {qrProduct.product.blockchainTx}
                      </div>
                      <Badge className="bg-green-500">
                        <Zap className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    addToCart(qrProduct.product);
                    setShowQRDetails(false);
                  }}
                  className="flex-1"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowQRDetails(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Tracking Details Dialog */}
      <Dialog open={showTrackingDetails} onOpenChange={setShowTrackingDetails}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Navigation className="w-6 h-6 text-green-600" />
              Live Order Tracking
            </DialogTitle>
            <DialogDescription>
              Real-time tracking from warehouse to your doorstep
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrderForTracking && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">Order ID</div>
                  <div className="font-mono">{selectedOrderForTracking.id}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Tracking ID</div>
                  <div className="font-mono text-xs">{selectedOrderForTracking.trackingId}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Status</div>
                  <Badge className="bg-blue-500">
                    {selectedOrderForTracking.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">ETA</div>
                  <div>{new Date(selectedOrderForTracking.estimatedDelivery).toLocaleString()}</div>
                </div>
              </div>
              
              {/* Interactive Route Map */}
              <Card>
                <CardHeader>
                  <CardTitle>Route Visualization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border overflow-hidden">
                    {/* Route Path */}
                    <motion.div
                      className="absolute inset-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {/* Animated Route Line */}
                      <motion.div
                        className="absolute h-2 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 rounded-full opacity-60"
                        style={{
                          left: '10%',
                          top: '50%',
                          width: '80%',
                          transform: 'translateY(-50%)'
                        }}
                        animate={{
                          opacity: [0.4, 0.8, 0.4],
                          scale: [1, 1.02, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      
                      {/* Moving Vehicle */}
                      <motion.div
                        className="absolute z-10"
                        style={{
                          left: '20%',
                          top: '47%'
                        }}
                        animate={{
                          x: [0, 100, 200, 300],
                          y: [0, -5, 0, 5]
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      >
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                          <Truck className="w-4 h-4 text-white" />
                        </div>
                      </motion.div>
                      
                      {/* Location Markers */}
                      <div className="absolute left-[10%] top-[45%] w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                        <Factory className="w-3 h-3 text-white" />
                      </div>
                      <div className="absolute left-[45%] top-[40%] w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <Building className="w-3 h-3 text-white" />
                      </div>
                      <div className="absolute left-[80%] top-[50%] w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                        <Home className="w-3 h-3 text-white" />
                      </div>
                      
                      {/* Location Labels */}
                      <div className="absolute left-[10%] top-[60%] text-xs text-center">
                        <div className="bg-white/90 px-2 py-1 rounded shadow-sm">
                          {selectedOrderForTracking.route.warehouse.name}
                        </div>
                      </div>
                      <div className="absolute left-[45%] top-[25%] text-xs text-center">
                        <div className="bg-white/90 px-2 py-1 rounded shadow-sm">
                          {selectedOrderForTracking.route.uzhavanSanthai.name}
                        </div>
                      </div>
                      <div className="absolute left-[80%] top-[35%] text-xs text-center">
                        <div className="bg-white/90 px-2 py-1 rounded shadow-sm">
                          Customer
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Current Status */}
                    <div className="absolute top-2 right-2 bg-white/90 p-2 rounded-lg text-xs">
                      <div className="flex items-center gap-1 text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Live Tracking
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items ({selectedOrderForTracking.items.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedOrderForTracking.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">{item.farmer}</div>
                          <div className="text-xs text-muted-foreground">QR: {item.qrCode}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">₹{item.total.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Progress Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { stage: 'Order Placed', status: 'completed', time: 'Today, 10:30 AM' },
                      { stage: 'Order Packed', status: 'completed', time: 'Today, 11:15 AM' },
                      { stage: 'Dispatched from Warehouse', status: 'completed', time: 'Today, 12:00 PM' },
                      { stage: 'At Uzhavan Santhai', status: 'active', time: 'Today, 2:30 PM' },
                      { stage: 'Out for Delivery', status: 'pending', time: 'Expected 4:00 PM' },
                      { stage: 'Delivered', status: 'pending', time: 'Expected 5:30 PM' }
                    ].map((step, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.status === 'completed' ? 'bg-green-500 text-white' :
                          step.status === 'active' ? 'bg-blue-500 text-white animate-pulse' :
                          'bg-gray-300 text-gray-600'
                        }`}>
                          {step.status === 'completed' ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{step.stage}</div>
                          <div className="text-sm text-muted-foreground">{step.time}</div>
                        </div>
                        {step.status === 'active' && (
                          <Badge className="bg-blue-500">Current</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <Button onClick={() => setShowTrackingDetails(false)}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}