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
import { AmazonStyleLiveTrackingFixed } from './consumer/AmazonStyleLiveTrackingFixed';
import { useAuth } from '../contexts/AuthContext';

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
  }
];

// Dummy customer data
const dummyCustomer = {
  name: 'Rahul Verma',
  phone: '+91-98765-12345',
  email: 'rahul.verma@email.com',
  address: 'Block B, Sector 15, Noida, UP - 201301'
};

export function ConsumerModuleWithLiveTracking() {
  const { t, currentLanguage } = useLanguage();
  const { user } = useAuth();
  
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
  const [activeTab, setActiveTab] = useState('live-tracking');
  
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

    // Switch to live tracking tab
    setTimeout(() => {
      setActiveTab('live-tracking');
      toast.info('🚚 Live tracking is now available!', {
        description: 'Watch your order move from Uzhavan Santhai to your doorstep'
      });
    }, 3000);

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

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.farmer.state.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Sparkles className="w-8 h-8 text-green-600 mr-3" />
              <h1 className="text-xl text-green-800">🌾 GreenLedger Customer Hub</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600">
                <Globe className="w-3 h-3 mr-1" />
                {currentLanguage.toUpperCase()}
              </Badge>
              {cart.length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={() => setShowCheckout(true)}
                  className="relative"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart ({getTotalItems()})
                  <Badge className="absolute -top-2 -right-2 bg-green-600">
                    {getTotalItems()}
                  </Badge>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="live-tracking" className="flex items-center space-x-2">
              <Navigation className="w-4 h-4" />
              <span>Live Tracking</span>
            </TabsTrigger>
            <TabsTrigger value="shop" className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4" />
              <span>Shop</span>
            </TabsTrigger>
            <TabsTrigger value="qr-scanner" className="flex items-center space-x-2">
              <QrCode className="w-4 h-4" />
              <span>QR Scanner</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>My Orders</span>
            </TabsTrigger>
          </TabsList>

          {/* Live Tracking Tab - Primary Experience */}
          <TabsContent value="live-tracking">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-green-200">
              <AmazonStyleLiveTrackingFixed />
            </div>
          </TabsContent>

          {/* Shop Tab */}
          <TabsContent value="shop">
            <div className="space-y-6">
              {/* Search and Filter */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search products, farmers, or locations..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="Sort By" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rating">Rating</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Product Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border border-green-200">
                      <CardContent className="p-4">
                        <div className="relative mb-4">
                          <ImageWithFallback
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <div className="absolute top-2 right-2 space-y-1">
                            {product.organic && (
                              <Badge className="bg-green-600 text-white">
                                <Leaf className="w-3 h-3 mr-1" />
                                Organic
                              </Badge>
                            )}
                            <Badge variant="outline" className="bg-white/90">
                              {product.quality}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                            <p className="text-sm text-gray-600">{product.description}</p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg text-green-600">₹{product.price}</span>
                              <span className="text-sm text-gray-500">/{product.unit}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm">{product.rating}</span>
                              <span className="text-xs text-gray-500">({product.reviews})</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Farmer:</span>
                              <span className="font-medium">{product.farmer.name}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Location:</span>
                              <span>{product.farmer.district}, {product.farmer.state}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Stock:</span>
                              <span className={product.inStock > 10 ? 'text-green-600' : 'text-amber-600'}>
                                {product.inStock} {product.unit}
                              </span>
                            </div>
                          </div>

                          <Button
                            onClick={() => addToCart(product)}
                            className="w-full bg-green-600 hover:bg-green-700"
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
              </div>
            </div>
          </TabsContent>

          {/* QR Scanner Tab */}
          <TabsContent value="qr-scanner">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <QrCode className="w-5 h-5 mr-2 text-green-600" />
                  QR Code Product Scanner
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-4">
                  <div className="bg-gray-100 rounded-lg p-8">
                    <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Camera scanner will be implemented here</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-px bg-gray-300" />
                    <span className="text-gray-500 text-sm">or</span>
                    <div className="flex-1 h-px bg-gray-300" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Enter QR Code Manually</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter QR code..."
                        value={qrInput}
                        onChange={(e) => setQrInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleQRInput()}
                      />
                      <Button onClick={handleQRInput} disabled={!qrInput.trim()}>
                        <Scan className="w-4 h-4 mr-2" />
                        Scan
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2 text-green-600" />
                  My Orders ({orders.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p>No orders yet. Start shopping to see your orders here!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="border border-green-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-medium">Order {order.id}</h3>
                              <p className="text-sm text-gray-600">
                                {new Date(order.orderDate).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={`${
                                order.status === 'delivered' ? 'text-green-600 border-green-600' :
                                order.status === 'out_for_delivery' ? 'text-blue-600 border-blue-600' :
                                order.status === 'dispatched' ? 'text-amber-600 border-amber-600' :
                                'text-purple-600 border-purple-600'
                              }`}
                            >
                              {order.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Items:</p>
                              <p className="font-medium">{order.items.map(item => item.name).join(', ')}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Total Amount:</p>
                              <p className="font-medium text-green-600">₹{order.totalAmount.toLocaleString()}</p>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setActiveTab('live-tracking');
                                toast.info('Switched to live tracking for this order');
                              }}
                            >
                              <Navigation className="w-4 h-4 mr-2" />
                              Track Order
                            </Button>
                            <Button size="sm" variant="outline">
                              <Receipt className="w-4 h-4 mr-2" />
                              View Receipt
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
      </div>

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2 text-green-600" />
              Shopping Cart ({getTotalItems()} items)
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.farmer.name}</p>
                  <p className="font-medium text-green-600">₹{item.price} × {item.quantity}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" onClick={() => removeFromCart(item.id)}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="font-medium">{item.quantity}</span>
                  <Button size="sm" variant="outline" onClick={() => addToCart(item)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{getTotalAmount().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%):</span>
                <span>₹{Math.round(getTotalAmount() * 0.05).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span className="text-green-600">FREE</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-medium">
                <span>Total:</span>
                <span className="text-green-600">₹{(getTotalAmount() + Math.round(getTotalAmount() * 0.05)).toLocaleString()}</span>
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
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowCheckout(false)} className="flex-1">
                Continue Shopping
              </Button>
              <Button onClick={handlePayment} className="flex-1 bg-green-600 hover:bg-green-700">
                Proceed to Payment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-green-600" />
              Payment Method
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upi" id="upi" />
                <Label htmlFor="upi" className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4" />
                  <span>UPI</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Credit/Debit Card</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="wallet" id="wallet" />
                <Label htmlFor="wallet" className="flex items-center space-x-2">
                  <Wallet className="w-4 h-4" />
                  <span>Digital Wallet</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex items-center space-x-2">
                  <IndianRupee className="w-4 h-4" />
                  <span>Cash on Delivery</span>
                </Label>
              </div>
            </RadioGroup>
            
            {showOTP && (
              <div className="space-y-2">
                <Label>Enter OTP</Label>
                <Input
                  placeholder="Enter 6-digit OTP"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  maxLength={6}
                />
                <Button onClick={verifyOTP} disabled={paymentLoading} className="w-full">
                  {paymentLoading ? 'Verifying...' : 'Verify OTP'}
                </Button>
              </div>
            )}
            
            {!showOTP && (
              <Button onClick={processPayment} disabled={paymentLoading} className="w-full bg-green-600 hover:bg-green-700">
                {paymentLoading ? 'Processing...' : `Pay ₹${(getTotalAmount() + Math.round(getTotalAmount() * 0.05)).toLocaleString()}`}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}