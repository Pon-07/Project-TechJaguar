import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  MapPin, 
  Truck, 
  Clock, 
  Package, 
  Navigation, 
  Route, 
  QrCode, 
  User, 
  Phone, 
  Factory, 
  Home, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Zap,
  Shield,
  Leaf,
  Star,
  Eye,
  Timer,
  RefreshCw,
  Download,
  Printer,
  Receipt,
  CreditCard,
  Wallet,
  IndianRupee,
  Building,
  Share2,
  Languages,
  TrendingUp,
  Sparkles,
  Globe,
  Info,
  X,
  Scan,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useLanguage } from '../../contexts/LanguageContext';

// Enhanced interfaces for live tracking
interface LiveTrackingPoint {
  id: string;
  lat: number;
  lng: number;
  name: string;
  type: 'warehouse' | 'uzhavan_santhai' | 'customer' | 'transit_point';
  timestamp: string;
  status: 'completed' | 'current' | 'pending';
  estimatedTime?: string;
  actualTime?: string;
  delay?: number;
}

interface DeliveryVehicle {
  id: string;
  type: 'truck' | 'van' | 'bike';
  driver: {
    name: string;
    phone: string;
    rating: number;
    vehicleNumber: string;
    profileImage?: string;
  };
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
    speed: number;
    direction: number;
  };
  capacity: string;
  eta: string;
}

interface LiveOrder {
  id: string;
  customer: string;
  customerPhone: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    image: string;
    farmer: {
      name: string;
      state: string;
      district: string;
      phone: string;
      uzhavarPin: string;
      profileImage?: string;
    };
    uzhavanSanthai: {
      name: string;
      address: string;
      phone: string;
      manager: string;
      operatingHours: string;
    };
    qrCode: string;
    blockchainTx: string;
    price: number;
  }>;
  status: 'ordered' | 'packed' | 'dispatched' | 'out_for_delivery' | 'delivered';
  currentLocation: LiveTrackingPoint;
  route: LiveTrackingPoint[];
  vehicle: DeliveryVehicle;
  predictiveData: {
    trafficCondition: 'light' | 'moderate' | 'heavy';
    weatherCondition: 'clear' | 'cloudy' | 'rainy';
    predictedDelay: number;
    confidenceScore: number;
    alternativeRoutes: number;
    stockStatus: 'high' | 'medium' | 'low';
    demandLevel: 'high' | 'medium' | 'low';
    routeRisk: number;
  };
  orderDate: string;
  estimatedDelivery: string;
  totalAmount: number;
  trackingId: string;
  receiptQR: string;
  receipt: {
    id: string;
    customerName: string;
    customerPhone: string;
    timestamp: string;
    paymentMethod: 'Cash' | 'UPI' | 'Card' | 'Wallet';
    transactionId: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      total: number;
    }>;
    subtotal: number;
    tax: number;
    deliveryFee: number;
    total: number;
    qrCode: string;
    downloadable: boolean;
    printable: boolean;
  };
}

// Comprehensive dummy data generation
const generateEnhancedIndianDeliveryData = (): LiveOrder[] => {
  const customers = [
    { name: 'Rahul Verma', phone: '+91-98765-12345', address: 'Block B, Sector 15, Noida, UP', lat: 28.5925, lng: 77.4143 },
    { name: 'Priya Singh', phone: '+91-98765-12346', address: 'Koramangala, Bangalore, KA', lat: 12.9352, lng: 77.6245 },
    { name: 'Amit Patel', phone: '+91-98765-12347', address: 'Satellite, Ahmedabad, GJ', lat: 23.0258, lng: 72.5873 },
    { name: 'Sunita Rai', phone: '+91-98765-12348', address: 'Banjara Hills, Hyderabad, TS', lat: 17.4126, lng: 78.4484 },
    { name: 'Vikash Kumar', phone: '+91-98765-12349', address: 'Boring Road, Patna, BR', lat: 25.6093, lng: 85.1376 },
    { name: 'Meera Sharma', phone: '+91-98765-12350', address: 'Civil Lines, Jaipur, RJ', lat: 26.9124, lng: 75.7873 }
  ];

  const uzhavanSanthais = [
    { 
      name: 'Noida Uzhavan Santhai', 
      lat: 28.5672, 
      lng: 77.4085, 
      state: 'UP', 
      district: 'Gautam Buddh Nagar',
      address: 'Sector 12, Noida, UP - 201301',
      phone: '+91-98765-54321',
      manager: 'Rajesh Kumar',
      operatingHours: '6:00 AM - 10:00 PM'
    },
    { 
      name: 'Bangalore Tech Agri Hub', 
      lat: 12.9716, 
      lng: 77.5946, 
      state: 'KA', 
      district: 'Bangalore Urban',
      address: 'Electronic City, Bangalore, KA - 560100',
      phone: '+91-98765-54322',
      manager: 'Suresh Reddy',
      operatingHours: '5:30 AM - 11:00 PM'
    },
    { 
      name: 'Ahmedabad Farmers Market', 
      lat: 23.0225, 
      lng: 72.5714, 
      state: 'GJ', 
      district: 'Ahmedabad',
      address: 'Vastrapur, Ahmedabad, GJ - 380015',
      phone: '+91-98765-54323',
      manager: 'Kiran Patel',
      operatingHours: '6:00 AM - 9:00 PM'
    },
    { 
      name: 'Hyderabad Agri Center', 
      lat: 17.3850, 
      lng: 78.4867, 
      state: 'TS', 
      district: 'Hyderabad',
      address: 'HITEC City, Hyderabad, TS - 500081',
      phone: '+91-98765-54324',
      manager: 'Lakshmi Devi',
      operatingHours: '6:00 AM - 10:00 PM'
    },
    { 
      name: 'Patna Krishi Bazaar', 
      lat: 25.5941, 
      lng: 85.1376, 
      state: 'BR', 
      district: 'Patna',
      address: 'Boring Road, Patna, BR - 800001',
      phone: '+91-98765-54325',
      manager: 'Ram Prasad Singh',
      operatingHours: '5:00 AM - 9:00 PM'
    },
    { 
      name: 'Jaipur Kisan Mandi', 
      lat: 26.9124, 
      lng: 75.7873, 
      state: 'RJ', 
      district: 'Jaipur',
      address: 'Malviya Nagar, Jaipur, RJ - 302017',
      phone: '+91-98765-54326',
      manager: 'Gopal Sharma',
      operatingHours: '6:00 AM - 10:00 PM'
    }
  ];

  const products = [
    { 
      id: 'P001', 
      name: 'Premium Basmati Rice', 
      price: 850,
      image: 'https://images.unsplash.com/photo-1705147289789-6df2593f1b1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNtYXRpJTIwcmljZSUyMGdyYWlucyUyMHdoaXRlJTIwcHJlbWl1bXxlbnwxfHx8fDE3NTg2MzQyNTd8MA&ixlib=rb-4.1.0&q=80&w=1080' 
    },
    { 
      id: 'P002', 
      name: 'Organic Tomatoes', 
      price: 450,
      image: 'https://images.unsplash.com/photo-1613295759649-e16cdcdf22fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwdmVnZXRhYmxlcyUyMHRvbWF0b2VzJTIwZnJlc2h8ZW58MXx8fHwxNzU4NjM0MjY0fDA&ixlib=rb-4.1.0&q=80&w=1080' 
    },
    { 
      id: 'P003', 
      name: 'Golden Wheat', 
      price: 320,
      image: 'https://images.unsplash.com/photo-1567395401530-d99add784641?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHdoZWF0JTIwZ3JhaW5zJTIwZ29sZGVufGVufDF8fHx8MTc1ODYzNDI2MXww&ixlib=rb-4.1.0&q=80&w=1080' 
    },
    { 
      id: 'P004', 
      name: 'Fresh Green Peas', 
      price: 780,
      image: 'https://images.unsplash.com/photo-1675501347570-cac3b8cbd5c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHBlYXMlMjBmcmVzaCUyMGxlZ3VtZXN8ZW58MXx8fHwxNzU4NjM0MjY4fDA&ixlib=rb-4.1.0&q=80&w=1080' 
    }
  ];

  const farmers = [
    { 
      name: 'Sita Devi Sharma', 
      state: 'Punjab', 
      district: 'Amritsar', 
      phone: '+91-98765-43210', 
      uzhavarPin: 'UZH001PB'
    },
    { 
      name: 'Ramesh Kumar Patel', 
      state: 'Uttar Pradesh', 
      district: 'Aligarh', 
      phone: '+91-98765-43211', 
      uzhavarPin: 'UZH002UP'
    },
    { 
      name: 'Priya Das', 
      state: 'Maharashtra', 
      district: 'Pune', 
      phone: '+91-98765-43212', 
      uzhavarPin: 'UZH003MH'
    },
    { 
      name: 'Jagannath Pradhan', 
      state: 'Odisha', 
      district: 'Cuttack', 
      phone: '+91-98765-43213', 
      uzhavarPin: 'UZH004OR'
    }
  ];

  // Generate QR code
  const generateQRCode = (data: string): string => {
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <g fill="black">
          <rect x="20" y="20" width="20" height="20"/>
          <rect x="60" y="20" width="20" height="20"/>
          <rect x="100" y="20" width="20" height="20"/>
          <rect x="140" y="20" width="20" height="20"/>
          <rect x="20" y="60" width="20" height="20"/>
          <rect x="100" y="60" width="20" height="20"/>
          <rect x="160" y="60" width="20" height="20"/>
          <rect x="20" y="100" width="20" height="20"/>
          <rect x="60" y="100" width="20" height="20"/>
          <rect x="140" y="100" width="20" height="20"/>
          <rect x="20" y="140" width="20" height="20"/>
          <rect x="60" y="140" width="20" height="20"/>
          <rect x="100" y="140" width="20" height="20"/>
          <rect x="140" y="140" width="20" height="20"/>
          <rect x="160" y="140" width="20" height="20"/>
        </g>
        <circle cx="100" cy="100" r="30" fill="white" stroke="black" stroke-width="2"/>
        <text x="100" y="95" text-anchor="middle" font-size="12" fill="green" font-weight="bold">🌾</text>
        <text x="100" y="110" text-anchor="middle" font-size="8" fill="black">GL</text>
        <text x="100" y="185" text-anchor="middle" font-size="8" fill="black">${data}</text>
      </svg>
    `)}`;
  };

  const paymentMethods = ['Cash', 'UPI', 'Card', 'Wallet'] as const;

  return customers.map((customer, index) => {
    const santhai = uzhavanSanthais[index] || uzhavanSanthais[0];
    const product = products[index % products.length];
    const farmer = farmers[index % farmers.length];
    const paymentMethod = paymentMethods[index % paymentMethods.length];
    
    // Enhanced pricing calculation
    const quantity = Math.floor(Math.random() * 3) + 1;
    const subtotal = product.price * quantity;
    const tax = Math.floor(subtotal * 0.05);
    const deliveryFee = index % 2 === 0 ? 0 : 25;
    const total = subtotal + tax + deliveryFee;

    // Generate warehouse coordinates
    const warehouseLat = santhai.lat + (Math.random() - 0.5) * 0.1;
    const warehouseLng = santhai.lng + (Math.random() - 0.5) * 0.1;

    // Enhanced route with tracking points
    const route: LiveTrackingPoint[] = [
      {
        id: `warehouse_${index}`,
        lat: warehouseLat,
        lng: warehouseLng,
        name: `${santhai.state} Agri Warehouse`,
        type: 'warehouse',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
        actualTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `santhai_${index}`,
        lat: santhai.lat,
        lng: santhai.lng,
        name: santhai.name,
        type: 'uzhavan_santhai',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: index < 3 ? 'completed' : 'current',
        actualTime: index < 3 ? new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() : undefined,
        estimatedTime: index >= 3 ? new Date(Date.now() + 30 * 60 * 1000).toISOString() : undefined
      },
      {
        id: `transit1_${index}`,
        lat: santhai.lat + (customer.lat - santhai.lat) * 0.3,
        lng: santhai.lng + (customer.lng - santhai.lng) * 0.3,
        name: 'Highway Junction',
        type: 'transit_point',
        timestamp: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
        status: index < 2 ? 'completed' : index < 4 ? 'current' : 'pending',
        estimatedTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `customer_${index}`,
        lat: customer.lat,
        lng: customer.lng,
        name: customer.address,
        type: 'customer',
        timestamp: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
        status: index === 0 ? 'completed' : 'pending',
        estimatedTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString()
      }
    ];

    const currentPoint = route.find(r => r.status === 'current') || route[route.length - 1];

    return {
      id: `ORD-GL-${Date.now().toString().slice(-4)}${index}`,
      customer: customer.name,
      customerPhone: customer.phone,
      items: [{
        id: product.id,
        name: product.name,
        quantity,
        image: product.image,
        price: product.price,
        farmer,
        uzhavanSanthai: santhai,
        qrCode: `QR${String(index + 1).padStart(3, '0')}_${product.name.toUpperCase().replace(/\s+/g, '_')}_${farmer.name.toUpperCase().replace(/\s+/g, '_')}`,
        blockchainTx: `0x${Math.random().toString(16).substr(2, 64).toUpperCase()}`
      }],
      status: index === 0 ? 'delivered' : index < 2 ? 'out_for_delivery' : index < 4 ? 'dispatched' : 'packed',
      currentLocation: currentPoint,
      route,
      vehicle: {
        id: `VEH${String(index + 1).padStart(3, '0')}`,
        type: index % 3 === 0 ? 'truck' : index % 3 === 1 ? 'van' : 'bike',
        driver: {
          name: ['Ravi Kumar', 'Suresh Singh', 'Amit Sharma', 'Vijay Nair', 'Deepak Yadav', 'Manoj Gupta'][index],
          phone: `+91-98765-${String(12340 + index).padStart(5, '0')}`,
          rating: 4.2 + Math.random() * 0.8,
          vehicleNumber: `${['UP', 'KA', 'GJ', 'TS', 'BR', 'RJ'][index]} ${String(index + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 9000) + 1000)}`
        },
        currentLocation: {
          lat: currentPoint.lat + (Math.random() - 0.5) * 0.01,
          lng: currentPoint.lng + (Math.random() - 0.5) * 0.01,
          address: currentPoint.name,
          speed: Math.floor(Math.random() * 40) + 20,
          direction: Math.floor(Math.random() * 360)
        },
        capacity: index % 3 === 0 ? '2 Tonnes' : index % 3 === 1 ? '500 Kg' : '50 Kg',
        eta: new Date(Date.now() + (3 - index) * 60 * 60 * 1000).toLocaleTimeString()
      },
      predictiveData: {
        trafficCondition: ['light', 'moderate', 'heavy'][Math.floor(Math.random() * 3)] as 'light' | 'moderate' | 'heavy',
        weatherCondition: ['clear', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)] as 'clear' | 'cloudy' | 'rainy',
        predictedDelay: Math.floor(Math.random() * 30),
        confidenceScore: 85 + Math.floor(Math.random() * 15),
        alternativeRoutes: Math.floor(Math.random() * 3) + 1,
        stockStatus: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
        demandLevel: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
        routeRisk: Math.floor(Math.random() * 30)
      },
      orderDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      estimatedDelivery: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
      totalAmount: total,
      trackingId: `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      receiptQR: generateQRCode(`ORD-GL-${Date.now().toString().slice(-4)}${index}`),
      receipt: {
        id: `RCP-${Date.now().toString().slice(-6)}${index}`,
        customerName: customer.name,
        customerPhone: customer.phone,
        timestamp: new Date().toISOString(),
        paymentMethod,
        transactionId: `TXN${Math.random().toString(36).substr(2, 10).toUpperCase()}`,
        items: [{
          name: product.name,
          quantity,
          price: product.price,
          total: subtotal
        }],
        subtotal,
        tax,
        deliveryFee,
        total,
        qrCode: generateQRCode(`RCP-${Date.now().toString().slice(-6)}${index}`),
        downloadable: true,
        printable: true
      }
    };
  });
};

interface AmazonStyleLiveTrackingFixedProps {
  orders?: LiveOrder[];
  selectedOrderId?: string;
  onOrderSelect?: (orderId: string) => void;
}

export function AmazonStyleLiveTrackingFixed({ 
  orders: propOrders, 
  selectedOrderId, 
  onOrderSelect 
}: AmazonStyleLiveTrackingFixedProps) {
  const { t, currentLanguage } = useLanguage();
  const [orders, setOrders] = useState<LiveOrder[]>(propOrders || generateEnhancedIndianDeliveryData());
  const [selectedOrder, setSelectedOrder] = useState<LiveOrder | null>(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mapView, setMapView] = useState<'satellite' | 'roadmap'>('roadmap');

  // Auto-refresh tracking data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isRefreshing) {
        refreshTrackingData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isRefreshing]);

  // Select order from props
  useEffect(() => {
    if (selectedOrderId) {
      const order = orders.find(o => o.id === selectedOrderId);
      if (order) {
        setSelectedOrder(order);
      }
    }
  }, [selectedOrderId, orders]);

  const refreshTrackingData = useCallback(() => {
    setIsRefreshing(true);
    
    // Simulate real-time updates
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (Math.random() < 0.3 && order.status !== 'delivered') {
          const statusProgression = ['ordered', 'packed', 'dispatched', 'out_for_delivery', 'delivered'];
          const currentIndex = statusProgression.indexOf(order.status);
          if (currentIndex < statusProgression.length - 1) {
            const newStatus = statusProgression[currentIndex + 1] as any;
            
            const currentRouteIndex = order.route.findIndex(r => r.id === order.currentLocation.id);
            const nextPoint = order.route[currentRouteIndex + 1];
            
            if (nextPoint) {
              return {
                ...order,
                status: newStatus,
                currentLocation: {
                  ...nextPoint,
                  status: 'current' as const,
                  timestamp: new Date().toISOString()
                },
                route: order.route.map((point, index) => ({
                  ...point,
                  status: index <= currentRouteIndex + 1 ? 'completed' : 
                         index === currentRouteIndex + 2 ? 'current' : 'pending'
                }))
              };
            }
          }
        }
        
        return {
          ...order,
          vehicle: {
            ...order.vehicle,
            currentLocation: {
              ...order.vehicle.currentLocation,
              lat: order.vehicle.currentLocation.lat + (Math.random() - 0.5) * 0.001,
              lng: order.vehicle.currentLocation.lng + (Math.random() - 0.5) * 0.001,
              speed: Math.max(10, order.vehicle.currentLocation.speed + (Math.random() - 0.5) * 10)
            }
          }
        };
      })
    );

    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('📍 Live tracking updated', {
        description: 'Real-time locations and predictive data refreshed'
      });
    }, 1500);
  }, []);

  const handleOrderClick = (order: LiveOrder) => {
    setSelectedOrder(order);
    onOrderSelect?.(order.id);
    toast.success('🎯 Order selected', {
      description: `Tracking ${order.trackingId}`
    });
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
  };

  const handleReceiptView = (order: LiveOrder) => {
    setSelectedReceipt(order.receipt);
    setShowReceipt(true);
  };

  const downloadReceipt = (receipt: any) => {
    const receiptData = {
      greenLedgerReceipt: {
        version: "3.0",
        timestamp: new Date().toISOString(),
        receiptType: "BLOCKCHAIN_VERIFIED_PURCHASE_ENHANCED"
      },
      receiptDetails: receipt,
      verification: {
        blockchainVerified: true,
        qrCodeValid: true,
        digitallySigned: true
      }
    };

    const dataStr = JSON.stringify(receiptData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `GreenLedger_Receipt_${receipt.id}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('📥 Receipt downloaded!', {
      description: 'Enhanced blockchain-verified receipt saved'
    });
  };

  const printReceipt = (receipt: any) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>GreenLedger Enhanced Receipt - ${receipt.id}</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 20px; line-height: 1.6; }
              .header { text-align: center; color: #22c55e; margin-bottom: 30px; border-bottom: 3px solid #22c55e; padding-bottom: 20px; }
              .section { margin: 25px 0; padding: 20px; border: 2px solid #e5e7eb; border-radius: 12px; }
              .details { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px; background: white; border-radius: 6px; }
              .total { font-weight: bold; font-size: 24px; color: #22c55e; text-align: center; margin: 25px 0; padding: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🌾 GreenLedger Enhanced Digital Receipt</h1>
              <p>Direct Farm-to-Consumer Platform • Blockchain Secured • Multilingual Support</p>
            </div>
            <div class="section">
              <h3>📋 Receipt Information</h3>
              <div class="details"><span>Receipt ID:</span> <strong>${receipt.id}</strong></div>
              <div class="details"><span>Customer:</span> <strong>${receipt.customerName}</strong></div>
              <div class="details"><span>Phone:</span> <strong>${receipt.customerPhone}</strong></div>
            </div>
            <div class="total">Total: ₹${receipt.total.toLocaleString()}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
    
    toast.success('🖨️ Receipt sent to printer!', {
      description: 'Enhanced receipt with blockchain verification'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500';
      case 'out_for_delivery': return 'bg-blue-500';
      case 'dispatched': return 'bg-amber-500';
      case 'packed': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return CheckCircle;
      case 'out_for_delivery': return Truck;
      case 'dispatched': return Package;
      case 'packed': return Factory;
      default: return AlertCircle;
    }
  };

  const getTrafficColor = (condition: string) => {
    switch (condition) {
      case 'light': return 'text-green-600';
      case 'moderate': return 'text-amber-600';
      case 'heavy': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-amber-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-green-800 flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-green-600" />
            Live Order Tracking 🚚
          </h2>
          <p className="text-gray-600">Real-time delivery updates from Uzhavan Santhai to your doorstep</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-green-600">
            <Languages className="w-3 h-3 mr-1" />
            {currentLanguage.toUpperCase()}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMapView(mapView === 'roadmap' ? 'satellite' : 'roadmap')}
          >
            <Eye className="w-4 h-4 mr-2" />
            {mapView === 'roadmap' ? 'Satellite' : 'Road'} View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshTrackingData}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enhanced Orders List */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-2 border-green-200">
            <CardHeader className="bg-gradient-to-r from-green-50 to-amber-50">
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2 text-green-600" />
                Active Deliveries ({orders.length})
                <Badge variant="outline" className="ml-2">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {orders.map((order) => {
                const StatusIcon = getStatusIcon(order.status);
                const isSelected = selectedOrder?.id === order.id;
                
                return (
                  <motion.div
                    key={order.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? 'border-green-500 bg-gradient-to-r from-green-50 to-amber-50 shadow-lg' 
                        : 'border-gray-200 hover:border-green-300 hover:shadow-md'
                    }`}
                    onClick={() => handleOrderClick(order)}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <StatusIcon className={`w-4 h-4 ${getStatusColor(order.status).replace('bg-', 'text-')}`} />
                        <span className="text-sm font-medium capitalize">{order.status.replace('_', ' ')}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {order.trackingId}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="font-medium">{order.customer}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span>{order.currentLocation.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">₹{order.totalAmount.toLocaleString()}</span>
                        <span className="text-green-600">{order.items.length} items</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Live Map & Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedOrder ? (
            <>
              {/* Order Details Card */}
              <Card className="border-2 border-green-200">
                <CardHeader className="bg-gradient-to-r from-green-50 to-amber-50">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Truck className="w-5 h-5 text-green-600" />
                      <span>Order {selectedOrder.id}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReceiptView(selectedOrder)}
                      >
                        <Receipt className="w-4 h-4 mr-2" />
                        Receipt
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Customer Information</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span>{selectedOrder.customer}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{selectedOrder.customerPhone}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Current Status</h4>
                        <div className="flex items-center space-x-2">
                          {(() => {
                            const StatusIcon = getStatusIcon(selectedOrder.status);
                            return <StatusIcon className={`w-4 h-4 ${getStatusColor(selectedOrder.status).replace('bg-', 'text-')}`} />;
                          })()}
                          <span className="capitalize">{selectedOrder.status.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Delivery Vehicle</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center space-x-2">
                            <Truck className="w-4 h-4 text-gray-400" />
                            <span>{selectedOrder.vehicle.driver.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-600">{selectedOrder.vehicle.driver.vehicleNumber}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>{selectedOrder.vehicle.driver.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">ETA</h4>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{selectedOrder.vehicle.eta}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Route Progress */}
                  <div>
                    <h4 className="font-medium mb-4">Delivery Route Progress</h4>
                    <div className="space-y-4">
                      {selectedOrder.route.map((point, index) => (
                        <div key={point.id} className="flex items-center space-x-4">
                          <div className={`w-4 h-4 rounded-full flex-shrink-0 ${
                            point.status === 'completed' ? 'bg-green-500' :
                            point.status === 'current' ? 'bg-blue-500 animate-pulse' :
                            'bg-gray-300'
                          }`} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{point.name}</span>
                              <div className="flex items-center space-x-2">
                                {point.status === 'completed' && (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                )}
                                {point.status === 'current' && (
                                  <Navigation className="w-4 h-4 text-blue-500" />
                                )}
                                <span className="text-sm text-gray-600 capitalize">
                                  {point.status}
                                </span>
                              </div>
                            </div>
                            <div className="text-sm text-gray-600">
                              {point.actualTime 
                                ? `Completed: ${new Date(point.actualTime).toLocaleString()}`
                                : point.estimatedTime 
                                ? `ETA: ${new Date(point.estimatedTime).toLocaleString()}`
                                : 'Pending'
                              }
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Predictive Data */}
                  <div>
                    <h4 className="font-medium mb-4">Live Insights & Predictions</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className={`text-sm ${getTrafficColor(selectedOrder.predictiveData.trafficCondition)}`}>
                          Traffic: {selectedOrder.predictiveData.trafficCondition}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">
                          Weather: {selectedOrder.predictiveData.weatherCondition}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">
                          Confidence: {selectedOrder.predictiveData.confidenceScore}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">
                          Risk: {selectedOrder.predictiveData.routeRisk}%
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card className="border-2 border-green-200">
                <CardHeader className="bg-gradient-to-r from-green-50 to-amber-50">
                  <CardTitle className="flex items-center">
                    <Package className="w-5 h-5 mr-2 text-green-600" />
                    Order Items ({selectedOrder.items.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium">{item.name}</h5>
                          <p className="text-sm text-gray-600">
                            From: {item.farmer.name}, {item.farmer.district}, {item.farmer.state}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm">Qty: {item.quantity}</span>
                            <span className="text-sm">₹{item.price}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleProductClick(item)}
                            >
                              <QrCode className="w-3 h-3 mr-1" />
                              QR
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-2 border-green-200">
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select an Order to Track
                </h3>
                <p className="text-gray-600">
                  Choose an order from the list to view detailed tracking information
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Product Details Dialog */}
      <Dialog open={showProductDetails} onOpenChange={setShowProductDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <QrCode className="w-5 h-5 mr-2 text-green-600" />
              Product Details & Blockchain Info
            </DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <ImageWithFallback
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-medium">{selectedProduct.name}</h4>
                  <p className="text-sm text-gray-600">
                    Farmer: {selectedProduct.farmer.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Location: {selectedProduct.farmer.district}, {selectedProduct.farmer.state}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h5 className="font-medium mb-2">Blockchain Transaction</h5>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <code className="text-xs break-all">{selectedProduct.blockchainTx}</code>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium mb-2">QR Code</h5>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <code className="text-xs">{selectedProduct.qrCode}</code>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Receipt className="w-5 h-5 mr-2 text-green-600" />
                Digital Receipt
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => selectedReceipt && downloadReceipt(selectedReceipt)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => selectedReceipt && printReceipt(selectedReceipt)}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          {selectedReceipt && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <h3 className="text-lg font-medium text-green-800">🌾 GreenLedger Digital Receipt</h3>
                <p className="text-sm text-gray-600">Blockchain-Verified Farm-to-Consumer Purchase</p>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Receipt ID:</span>
                  <p className="font-medium">{selectedReceipt.id}</p>
                </div>
                <div>
                  <span className="text-gray-600">Transaction ID:</span>
                  <p className="font-medium">{selectedReceipt.transactionId}</p>
                </div>
                <div>
                  <span className="text-gray-600">Customer:</span>
                  <p className="font-medium">{selectedReceipt.customerName}</p>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <p className="font-medium">{selectedReceipt.customerPhone}</p>
                </div>
                <div>
                  <span className="text-gray-600">Payment Method:</span>
                  <p className="font-medium">{selectedReceipt.paymentMethod}</p>
                </div>
                <div>
                  <span className="text-gray-600">Date:</span>
                  <p className="font-medium">{new Date(selectedReceipt.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h5 className="font-medium mb-2">Items</h5>
                <div className="space-y-2">
                  {selectedReceipt.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name} x {item.quantity}</span>
                      <span>₹{item.total.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{selectedReceipt.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>₹{selectedReceipt.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span>₹{selectedReceipt.deliveryFee.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total:</span>
                  <span className="text-green-600">₹{selectedReceipt.total.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="text-center text-xs text-gray-500 mt-4">
                ✅ Blockchain Verified • 🔒 Digitally Signed • 🌱 Carbon Neutral Delivery
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}