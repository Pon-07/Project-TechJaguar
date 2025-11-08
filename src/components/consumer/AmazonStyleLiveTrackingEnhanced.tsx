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

// Comprehensive dummy data generation with enhanced predictive analytics
const generateEnhancedIndianDeliveryData = (): LiveOrder[] => {
  const customers = [
    { name: 'Rahul Verma', phone: '+91-98765-12345', address: 'Block B, Sector 15, Noida, UP', lat: 28.5925, lng: 77.4143 },
    { name: 'Priya Singh', phone: '+91-98765-12346', address: 'Koramangala, Bangalore, KA', lat: 12.9352, lng: 77.6245 },
    { name: 'Amit Patel', phone: '+91-98765-12347', address: 'Satellite, Ahmedabad, GJ', lat: 23.0258, lng: 72.5873 },
    { name: 'Sunita Rai', phone: '+91-98765-12348', address: 'Banjara Hills, Hyderabad, TS', lat: 17.4126, lng: 78.4484 },
    { name: 'Vikash Kumar', phone: '+91-98765-12349', address: 'Boring Road, Patna, BR', lat: 25.6093, lng: 85.1376 },
    { name: 'Meera Sharma', phone: '+91-98765-12350', address: 'Civil Lines, Jaipur, RJ', lat: 26.9124, lng: 75.7873 },
    { name: 'Ravi Nair', phone: '+91-98765-12351', address: 'Fort Kochi, Kochi, KL', lat: 9.9312, lng: 76.2673 },
    { name: 'Anjali Das', phone: '+91-98765-12352', address: 'Park Street, Kolkata, WB', lat: 22.5726, lng: 88.3639 }
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
    },
    { 
      name: 'Kochi Agri Terminal', 
      lat: 9.9312, 
      lng: 76.2673, 
      state: 'KL', 
      district: 'Ernakulam',
      address: 'Marine Drive, Kochi, KL - 682031',
      phone: '+91-98765-54327',
      manager: 'Thomas Mathew',
      operatingHours: '5:30 AM - 10:30 PM'
    },
    { 
      name: 'Kolkata Fresh Hub', 
      lat: 22.5726, 
      lng: 88.3639, 
      state: 'WB', 
      district: 'Kolkata',
      address: 'Salt Lake City, Kolkata, WB - 700064',
      phone: '+91-98765-54328',
      manager: 'Subrata Bose',
      operatingHours: '5:00 AM - 10:00 PM'
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
      uzhavarPin: 'UZH001PB',
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
    },
    { 
      name: 'Ramesh Kumar Patel', 
      state: 'Uttar Pradesh', 
      district: 'Aligarh', 
      phone: '+91-98765-43211', 
      uzhavarPin: 'UZH002UP',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    { 
      name: 'Priya Das', 
      state: 'Maharashtra', 
      district: 'Pune', 
      phone: '+91-98765-43212', 
      uzhavarPin: 'UZH003MH',
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
    },
    { 
      name: 'Jagannath Pradhan', 
      state: 'Odisha', 
      district: 'Cuttack', 
      phone: '+91-98765-43213', 
      uzhavarPin: 'UZH004OR',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    }
  ];

  const paymentMethods = ['Cash', 'UPI', 'Card', 'Wallet'] as const;

  return customers.slice(0, 8).map((customer, index) => {
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
    const warehouseLat = santhai.lat + (Math.random() - 0.5) * 0.5;
    const warehouseLng = santhai.lng + (Math.random() - 0.5) * 0.5;

    // Enhanced route with more realistic tracking points
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
        id: `transit2_${index}`,
        lat: santhai.lat + (customer.lat - santhai.lat) * 0.7,
        lng: santhai.lng + (customer.lng - santhai.lng) * 0.7,
        name: 'City Entry Point',
        type: 'transit_point',
        timestamp: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        status: index < 1 ? 'completed' : index < 3 ? 'current' : 'pending',
        estimatedTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
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
    
    // Generate enhanced QR code
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
      status: index === 0 ? 'delivered' : index < 3 ? 'out_for_delivery' : index < 5 ? 'dispatched' : 'packed',
      currentLocation: currentPoint,
      route,
      vehicle: {
        id: `VEH${String(index + 1).padStart(3, '0')}`,
        type: index % 3 === 0 ? 'truck' : index % 3 === 1 ? 'van' : 'bike',
        driver: {
          name: ['Ravi Kumar', 'Suresh Singh', 'Amit Sharma', 'Vijay Nair', 'Deepak Yadav', 'Manoj Gupta', 'Sanjay Prasad', 'Krishna Murthy'][index],
          phone: `+91-98765-${String(12340 + index).padStart(5, '0')}`,
          rating: 4.2 + Math.random() * 0.8,
          vehicleNumber: `${['UP', 'KA', 'GJ', 'TS', 'BR', 'RJ', 'KL', 'WB'][index]} ${String(index + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 9000) + 1000)}`,
          profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
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

interface AmazonStyleLiveTrackingEnhancedProps {
  orders?: LiveOrder[];
  selectedOrderId?: string;
  onOrderSelect?: (orderId: string) => void;
}

export function AmazonStyleLiveTrackingEnhanced({ 
  orders: propOrders, 
  selectedOrderId, 
  onOrderSelect 
}: AmazonStyleLiveTrackingEnhancedProps) {
  const { t, currentLanguage } = useLanguage();
  const [orders, setOrders] = useState<LiveOrder[]>(propOrders || generateEnhancedIndianDeliveryData());
  const [selectedOrder, setSelectedOrder] = useState<LiveOrder | null>(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mapView, setMapView] = useState<'satellite' | 'roadmap'>('roadmap');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

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
    
    // Simulate real-time updates with enhanced predictive data
    setOrders(prevOrders => 
      prevOrders.map(order => {
        // Random chance to update status
        if (Math.random() < 0.3 && order.status !== 'delivered') {
          const statusProgression = ['ordered', 'packed', 'dispatched', 'out_for_delivery', 'delivered'];
          const currentIndex = statusProgression.indexOf(order.status);
          if (currentIndex < statusProgression.length - 1) {
            const newStatus = statusProgression[currentIndex + 1] as any;
            
            // Update current location to next point in route
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
                })),
                predictiveData: {
                  ...order.predictiveData,
                  confidenceScore: Math.max(70, order.predictiveData.confidenceScore + (Math.random() - 0.5) * 10),
                  predictedDelay: Math.max(0, order.predictiveData.predictedDelay + (Math.random() - 0.5) * 5),
                  routeRisk: Math.max(0, order.predictiveData.routeRisk + (Math.random() - 0.5) * 10)
                }
              };
            }
          }
        }
        
        // Update vehicle location with small random movement
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
          },
          predictiveData: {
            ...order.predictiveData,
            confidenceScore: Math.min(100, Math.max(70, order.predictiveData.confidenceScore + (Math.random() - 0.5) * 2))
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
              .header h1 { margin: 0; font-size: 32px; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); }
              .header p { margin: 5px 0; color: #666; }
              .section { margin: 25px 0; padding: 20px; border: 2px solid #e5e7eb; border-radius: 12px; background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); }
              .section h3 { color: #22c55e; margin-top: 0; border-bottom: 2px solid #22c55e; padding-bottom: 10px; }
              .details { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px; background: white; border-radius: 6px; }
              .details strong { color: #333; }
              .total { font-weight: bold; font-size: 24px; color: #22c55e; text-align: center; margin: 25px 0; padding: 20px; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px; border: 2px solid #22c55e; }
              .qr-section { text-align: center; margin: 25px 0; padding: 20px; background: white; border-radius: 12px; border: 2px dashed #22c55e; }
              .blockchain-section { font-family: monospace; font-size: 10px; word-break: break-all; background: #1f2937; color: #10b981; padding: 15px; border-radius: 8px; margin: 15px 0; }
              .footer { margin-top: 40px; text-align: center; color: #666; border-top: 2px solid #e5e7eb; padding-top: 25px; }
              .badge { display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; margin: 3px; font-weight: bold; }
              .multilingual { text-align: center; margin: 15px 0; padding: 10px; background: #fef3c7; border-radius: 8px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🌾 GreenLedger Enhanced Digital Receipt</h1>
              <p>Direct Farm-to-Consumer Platform • Blockchain Secured • Zero Middlemen • Multilingual Support</p>
              <div class="qr-section">
                <img src="${receipt.qrCode}" alt="Receipt QR Code" style="width: 120px; height: 120px;">
                <p style="font-size: 14px; margin-top: 10px; font-weight: bold;">Scan for instant verification</p>
              </div>
            </div>
            
            <div class="multilingual">
              <p><strong>🌍 Available in 4 Languages:</strong> English | हिंदी | தமிழ் | ଓଡିଆ</p>
            </div>
            
            <div class="section">
              <h3>📋 Receipt Information</h3>
              <div class="details"><span>Receipt ID:</span> <strong>${receipt.id}</strong></div>
              <div class="details"><span>Customer:</span> <strong>${receipt.customerName}</strong></div>
              <div class="details"><span>Phone:</span> <strong>${receipt.customerPhone}</strong></div>
              <div class="details"><span>Date & Time:</span> <strong>${new Date(receipt.timestamp).toLocaleString()}</strong></div>
              <div class="details"><span>Payment Method:</span> <strong>${receipt.paymentMethod}</strong></div>
              <div class="details"><span>Transaction ID:</span> <strong>${receipt.transactionId}</strong></div>
            </div>

            <div class="section">
              <h3>🛒 Order Items</h3>
              ${receipt.items.map((item: any) => `
                <div class="details">
                  <span>${item.name} (Qty: ${item.quantity})</span>
                  <strong>₹${item.total.toLocaleString()}</strong>
                </div>
              `).join('')}
            </div>

            <div class="section">
              <h3>💰 Payment Breakdown</h3>
              <div class="details"><span>Subtotal:</span> <strong>₹${receipt.subtotal.toLocaleString()}</strong></div>
              <div class="details"><span>Tax (5%):</span> <strong>₹${receipt.tax.toLocaleString()}</strong></div>
              <div class="details"><span>Delivery Fee:</span> <strong>₹${receipt.deliveryFee.toLocaleString()}</strong></div>
            </div>

            <div class="total">
              <div>🎯 TOTAL AMOUNT</div>
              <div style="font-size: 32px; margin-top: 10px;">₹${receipt.total.toLocaleString()}</div>
            </div>

            <div class="section">
              <h3>🔐 Blockchain Verification</h3>
              <div class="blockchain-section">
                BLOCKCHAIN_TX_HASH: 0x${Math.random().toString(16).substr(2, 64).toUpperCase()}
                <br>VERIFICATION_STATUS: ✅ VERIFIED
                <br>TIMESTAMP: ${new Date().toISOString()}
                <br>NETWORK: GreenLedger_MainNet
              </div>
            </div>

            <div class="section">
              <h3>🏷️ Certifications & Features</h3>
              <div style="text-align: center;">
                <span class="badge">🌾 Farm Direct</span>
                <span class="badge">🔗 Blockchain Verified</span>
                <span class="badge">📱 QR Trackable</span>
                <span class="badge">🌍 Multilingual</span>
                <span class="badge">♻️ Eco-Friendly</span>
                <span class="badge">⚡ Real-time Tracking</span>
              </div>
            </div>

            <div class="footer">
              <p><strong>🙏 Thank you for choosing GreenLedger!</strong></p>
              <p>Supporting farmers, empowering consumers, protecting environment</p>
              <p style="font-size: 12px; margin-top: 15px;">
                For support: support@greenledger.in | 📞 1800-GREEN-LEDGER<br>
                Visit: www.greenledger.in | Download our app for real-time tracking
              </p>
            </div>
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

  const getLanguageText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      'Live Order Tracking': {
        'en': 'Live Order Tracking',
        'hi': 'लाइव ऑर्डर ट्रैकिंग',
        'ta': 'நேரடி ஆர்டர் கண்காணிப்பு',
        'or': 'ଜୀବନ୍ତ ଅର୍ଡର ଟ୍ରାକିଂ'
      },
      'Real-time delivery updates': {
        'en': 'Real-time delivery updates from Uzhavan Santhai to your doorstep',
        'hi': 'उझवन संथाई से आपके दरवाजे तक रियल-टाइम डिलीवरी अपडेट',
        'ta': 'உழவன் சந்தையிலிருந்து உங்கள் வீட்டு வாசல் வரை நிகழ்நேர டெலிவரி புதுப்பிப்புகள்',
        'or': 'ଉଝାଭାନ୍ ସନ୍ଥାଇରୁ ଆପଣଙ୍କ ଦ୍ୱାର ପର୍ଯ୍ୟନ୍ତ ରିଅଲ୍-ଟାଇମ୍ ଡେଲିଭରୀ ଅପଡେଟ୍'
      }
    };
    return translations[key]?.[currentLanguage] || key;
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header with multilingual support */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-green-800 flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-green-600" />
            {getLanguageText('Live Order Tracking')} 🚚
          </h2>
          <p className="text-gray-600">{getLanguageText('Real-time delivery updates')}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLanguageSelector(!showLanguageSelector)}
          >
            <Languages className="w-4 h-4 mr-2" />
            {currentLanguage.toUpperCase()}
          </Button>
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
                        <span className="text-sm">{order.trackingId}</span>
                      </div>
                      <Badge variant="secondary" className={`${getStatusColor(order.status)} text-white text-xs`}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm">{order.customer}</p>
                      <p className="text-xs text-gray-600">{order.items[0].name} × {order.items[0].quantity}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        {order.currentLocation.name}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        ETA: {order.vehicle.eta}
                      </div>
                      <div className="flex items-center text-xs">
                        <IndianRupee className="w-3 h-3 mr-1 text-green-600" />
                        <span className="text-green-600">₹{order.totalAmount.toLocaleString()}</span>
                        <Badge variant="outline" className={`ml-2 text-xs ${getStockStatusColor(order.predictiveData.stockStatus)}`}>
                          Stock: {order.predictiveData.stockStatus}
                        </Badge>
                      </div>
                    </div>

                    {/* Enhanced Live tracking indicator */}
                    {order.status === 'out_for_delivery' && (
                      <div className="flex items-center justify-between mt-2 text-xs">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                          <span className="text-green-600">Live Tracking Active</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {order.predictiveData.confidenceScore}% confidence
                        </Badge>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex space-x-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReceiptView(order);
                        }}
                      >
                        <Receipt className="w-3 h-3 mr-1" />
                        Receipt
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductClick(order.items[0]);
                        }}
                      >
                        <QrCode className="w-3 h-3 mr-1" />
                        QR Scan
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Map and Details */}
        <div className="lg:col-span-2 space-y-4">
          {selectedOrder ? (
            <>
              {/* Enhanced Live Map Visualization */}
              <Card className="border-2 border-blue-200">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Navigation className="w-5 h-5 mr-2 text-blue-600" />
                      Live Route Tracking - {selectedOrder.trackingId}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={getTrafficColor(selectedOrder.predictiveData.trafficCondition)}>
                        Traffic: {selectedOrder.predictiveData.trafficCondition}
                      </Badge>
                      <Badge variant="outline">
                        Confidence: {selectedOrder.predictiveData.confidenceScore}%
                      </Badge>
                      <Badge variant="outline" className={getStockStatusColor(selectedOrder.predictiveData.stockStatus)}>
                        Stock: {selectedOrder.predictiveData.stockStatus}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Enhanced Map Container */}
                  <div className={`w-full h-80 rounded-lg border-2 relative overflow-hidden ${
                    mapView === 'satellite' 
                      ? 'bg-gradient-to-br from-green-900 to-green-800' 
                      : 'bg-gradient-to-br from-gray-100 to-gray-200'
                  }`}>
                    {/* Enhanced Route Line Animation */}
                    <svg className="absolute inset-0 w-full h-full">
                      <defs>
                        <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#22c55e" stopOpacity="1" />
                          <stop offset="30%" stopColor="#3b82f6" stopOpacity="1" />
                          <stop offset="70%" stopColor="#8b5cf6" stopOpacity="1" />
                          <stop offset="100%" stopColor="#f59e0b" stopOpacity="1" />
                        </linearGradient>
                        <filter id="glowEffect">
                          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                          <feMerge> 
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                        <filter id="pulseEffect">
                          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                          <feMerge> 
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>
                      
                      {/* Enhanced Animated Route Path */}
                      <motion.path
                        d={`M 50 280 Q 150 220 250 180 Q 350 120 450 90 Q 550 60 650 40`}
                        stroke="url(#routeGradient)"
                        strokeWidth="6"
                        fill="none"
                        filter="url(#glowEffect)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 3, ease: "easeInOut" }}
                      />
                      
                      {/* Enhanced Moving Vehicle Animation */}
                      <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                      >
                        <motion.circle
                          r="10"
                          fill="#3b82f6"
                          stroke="white"
                          strokeWidth="3"
                          filter="url(#pulseEffect)"
                          initial={{ offsetDistance: "0%" }}
                          animate={{ offsetDistance: "65%" }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        >
                          <animateMotion
                            dur="12s"
                            repeatCount="indefinite"
                            path="M 50 280 Q 150 220 250 180 Q 350 120 450 90 Q 550 60 650 40"
                          />
                        </motion.circle>
                        <motion.text
                          x="0"
                          y="5"
                          textAnchor="middle"
                          fontSize="12"
                          fill="white"
                          initial={{ offsetDistance: "0%" }}
                          animate={{ offsetDistance: "65%" }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        >
                          🚚
                          <animateMotion
                            dur="12s"
                            repeatCount="indefinite"
                            path="M 50 280 Q 150 220 250 180 Q 350 120 450 90 Q 550 60 650 40"
                          />
                        </motion.text>
                      </motion.g>
                    </svg>

                    {/* Enhanced Location Markers with Interactive Popups */}
                    <div className="absolute inset-0">
                      {selectedOrder.route.map((point, index) => {
                        const x = 50 + (index * 150);
                        const y = 280 - (index * 60);
                        
                        return (
                          <Dialog key={point.id}>
                            <DialogTrigger asChild>
                              <motion.div
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                                style={{ left: `${x}px`, top: `${y}px` }}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.3 }}
                                whileHover={{ scale: 1.2 }}
                              >
                                <div className={`relative p-2 rounded-full border-2 border-white shadow-lg ${
                                  point.status === 'completed' ? 'bg-green-500 text-white' : 
                                  point.status === 'current' ? 'bg-blue-500 text-white animate-pulse' : 'bg-gray-400 text-white'
                                }`}>
                                  {point.type === 'warehouse' && <Factory className="w-6 h-6" />}
                                  {point.type === 'uzhavan_santhai' && <Building className="w-6 h-6" />}
                                  {point.type === 'customer' && <Home className="w-6 h-6" />}
                                  {point.type === 'transit_point' && <MapPin className="w-6 h-6" />}
                                  
                                  {point.status === 'current' && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
                                  )}
                                </div>
                                
                                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-3 py-1 rounded-lg text-xs whitespace-nowrap">
                                  {point.name}
                                </div>
                              </motion.div>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center">
                                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                                  Location Details - {point.name}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                {point.type === 'uzhavan_santhai' && selectedOrder.items[0].uzhavanSanthai && (
                                  <Card className="border border-green-200">
                                    <CardContent className="p-4">
                                      <h4 className="flex items-center mb-3">
                                        <Building className="w-4 h-4 mr-2 text-green-600" />
                                        Uzhavan Santhai Information
                                      </h4>
                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div><strong>Name:</strong> {selectedOrder.items[0].uzhavanSanthai.name}</div>
                                        <div><strong>Manager:</strong> {selectedOrder.items[0].uzhavanSanthai.manager}</div>
                                        <div><strong>Phone:</strong> {selectedOrder.items[0].uzhavanSanthai.phone}</div>
                                        <div><strong>Hours:</strong> {selectedOrder.items[0].uzhavanSanthai.operatingHours}</div>
                                        <div className="col-span-2"><strong>Address:</strong> {selectedOrder.items[0].uzhavanSanthai.address}</div>
                                      </div>
                                    </Card>
                                  </div>
                                )}
                                
                                <Card className="border border-blue-200">
                                  <CardContent className="p-4">
                                    <h4 className="flex items-center mb-3">
                                      <Package className="w-4 h-4 mr-2 text-blue-600" />
                                      Product Information
                                    </h4>
                                    <div className="flex items-center space-x-4">
                                      <ImageWithFallback
                                        src={selectedOrder.items[0].image}
                                        alt={selectedOrder.items[0].name}
                                        className="w-16 h-16 rounded-lg object-cover"
                                      />
                                      <div className="flex-1">
                                        <p className="font-medium">{selectedOrder.items[0].name}</p>
                                        <p className="text-sm text-gray-600">Quantity: {selectedOrder.items[0].quantity}</p>
                                        <p className="text-sm text-green-600">₹{selectedOrder.items[0].price.toLocaleString()}</p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card className="border border-amber-200">
                                  <CardContent className="p-4">
                                    <h4 className="flex items-center mb-3">
                                      <User className="w-4 h-4 mr-2 text-amber-600" />
                                      Farmer Details
                                    </h4>
                                    <div className="flex items-center space-x-4">
                                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white">
                                        👨‍🌾
                                      </div>
                                      <div className="flex-1">
                                        <p className="font-medium">{selectedOrder.items[0].farmer.name}</p>
                                        <p className="text-sm text-gray-600">{selectedOrder.items[0].farmer.district}, {selectedOrder.items[0].farmer.state}</p>
                                        <p className="text-sm">📞 {selectedOrder.items[0].farmer.phone}</p>
                                        <p className="text-sm">🏷️ Pin: {selectedOrder.items[0].farmer.uzhavarPin}</p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card className="border border-purple-200">
                                  <CardContent className="p-4">
                                    <h4 className="flex items-center mb-3">
                                      <QrCode className="w-4 h-4 mr-2 text-purple-600" />
                                      QR Code & Blockchain
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm"><strong>QR Code:</strong></p>
                                        <p className="text-xs font-mono bg-gray-100 p-2 rounded">{selectedOrder.items[0].qrCode}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm"><strong>Blockchain TX:</strong></p>
                                        <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">{selectedOrder.items[0].blockchainTx.slice(0, 20)}...</p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>

                                <div className="flex space-x-2">
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleProductClick(selectedOrder.items[0])}
                                    className="flex-1"
                                  >
                                    <Scan className="w-4 h-4 mr-2" />
                                    Scan QR Code
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => {
                                      navigator.clipboard.writeText(selectedOrder.items[0].blockchainTx);
                                      toast.success('Blockchain TX copied to clipboard!');
                                    }}
                                  >
                                    <Shield className="w-4 h-4 mr-2" />
                                    Copy TX
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        );
                      })}
                    </div>

                    {/* Enhanced Weather and Traffic Overlay */}
                    <div className="absolute top-4 right-4 bg-white bg-opacity-95 rounded-lg p-4 shadow-xl border">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="text-center">
                          <div className="text-3xl mb-1">
                            {selectedOrder.predictiveData.weatherCondition === 'clear' ? '☀️' : 
                             selectedOrder.predictiveData.weatherCondition === 'cloudy' ? '☁️' : '🌧️'}
                          </div>
                          <div className="text-xs text-gray-600 font-medium">Weather</div>
                        </div>
                        <Separator orientation="vertical" className="h-12" />
                        <div className="text-center">
                          <div className={`font-bold text-lg ${getTrafficColor(selectedOrder.predictiveData.trafficCondition)}`}>
                            {selectedOrder.predictiveData.trafficCondition.toUpperCase()}
                          </div>
                          <div className="text-xs text-gray-600">Traffic</div>
                        </div>
                        <Separator orientation="vertical" className="h-12" />
                        <div className="text-center">
                          <div className="font-bold text-lg text-blue-600">
                            {selectedOrder.predictiveData.routeRisk}%
                          </div>
                          <div className="text-xs text-gray-600">Risk</div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Predictive Analytics Overlay */}
                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-80 text-white rounded-lg p-3 shadow-xl">
                      <div className="flex items-center space-x-4 text-xs">
                        <div className="flex items-center">
                          <BarChart3 className="w-3 h-3 mr-1 text-green-400" />
                          Demand: {selectedOrder.predictiveData.demandLevel}
                        </div>
                        <div className="flex items-center">
                          <Timer className="w-3 h-3 mr-1 text-amber-400" />
                          Delay: {selectedOrder.predictiveData.predictedDelay}min
                        </div>
                        <div className="flex items-center">
                          <Route className="w-3 h-3 mr-1 text-blue-400" />
                          Alt Routes: {selectedOrder.predictiveData.alternativeRoutes}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Route Timeline */}
                  <div className="mt-6 space-y-3">
                    <h4 className="flex items-center">
                      <Route className="w-4 h-4 mr-2 text-blue-600" />
                      Delivery Timeline
                    </h4>
                    {selectedOrder.route.map((point, index) => (
                      <div key={point.id} className="flex items-center space-x-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          point.status === 'completed' ? 'bg-green-500 border-green-500 text-white' :
                          point.status === 'current' ? 'bg-blue-500 border-blue-500 text-white animate-pulse' :
                          'bg-gray-200 border-gray-300 text-gray-500'
                        }`}>
                          {point.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                          {point.status === 'current' && <Timer className="w-3 h-3" />}
                          {point.status === 'pending' && <Clock className="w-3 h-3" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className={`${point.status === 'completed' ? 'text-green-600' : point.status === 'current' ? 'text-blue-600' : 'text-gray-500'}`}>
                              {point.name}
                            </span>
                            <div className="flex items-center space-x-2">
                              {point.actualTime && (
                                <Badge variant="outline" className="text-xs text-green-600">
                                  ✅ {new Date(point.actualTime).toLocaleTimeString()}
                                </Badge>
                              )}
                              {point.estimatedTime && !point.actualTime && (
                                <Badge variant="outline" className="text-xs text-blue-600">
                                  ⏱️ ETA: {new Date(point.estimatedTime).toLocaleTimeString()}
                                </Badge>
                              )}
                            </div>
                          </div>
                          {point.delay && point.delay > 0 && (
                            <div className="text-xs text-red-600 mt-1">
                              ⚠️ Delayed by {point.delay} minutes
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Delivery Vehicle Info */}
              <Card className="border-2 border-amber-200">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
                  <CardTitle className="flex items-center">
                    <Truck className="w-5 h-5 mr-2 text-amber-600" />
                    Delivery Vehicle & Driver
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white">
                          👨‍💼
                        </div>
                        <div>
                          <p className="font-medium">{selectedOrder.vehicle.driver.name}</p>
                          <div className="flex items-center text-sm text-gray-600">
                            <Star className="w-3 h-3 mr-1 text-yellow-500" />
                            {selectedOrder.vehicle.driver.rating.toFixed(1)} rating
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <Phone className="w-3 h-3 mr-2 text-gray-400" />
                          {selectedOrder.vehicle.driver.phone}
                        </div>
                        <div className="flex items-center">
                          <Truck className="w-3 h-3 mr-2 text-gray-400" />
                          {selectedOrder.vehicle.driver.vehicleNumber}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">Vehicle Type:</span>
                          <p className="font-medium capitalize">{selectedOrder.vehicle.type}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Capacity:</span>
                          <p className="font-medium">{selectedOrder.vehicle.capacity}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Current Speed:</span>
                          <p className="font-medium">{selectedOrder.vehicle.currentLocation.speed} km/h</p>
                        </div>
                        <div>
                          <span className="text-gray-600">ETA:</span>
                          <p className="font-medium text-green-600">{selectedOrder.vehicle.eta}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center text-gray-500">
                  <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg mb-2">Select an Order</h3>
                  <p>Click on any order from the list to view detailed live tracking information</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Enhanced Product Details Modal */}
      <Dialog open={showProductDetails} onOpenChange={setShowProductDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
              Enhanced Product Details & QR Information
            </DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ImageWithFallback
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-48 rounded-lg object-cover border-2 border-green-200"
                  />
                  <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
                    <h4 className="flex items-center mb-2">
                      <QrCode className="w-4 h-4 mr-2 text-purple-600" />
                      QR Code Information
                    </h4>
                    <p className="font-mono text-sm bg-white p-2 rounded border">{selectedProduct.qrCode}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl">{selectedProduct.name}</h3>
                    <p className="text-2xl text-green-600">₹{selectedProduct.price?.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Quantity: {selectedProduct.quantity}</p>
                  </div>
                  
                  <Card className="border border-green-200">
                    <CardContent className="p-4">
                      <h4 className="flex items-center mb-3">
                        <User className="w-4 h-4 mr-2 text-green-600" />
                        Farmer Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Name:</span>
                          <span className="font-medium">{selectedProduct.farmer.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Location:</span>
                          <span>{selectedProduct.farmer.district}, {selectedProduct.farmer.state}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Phone:</span>
                          <span>{selectedProduct.farmer.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Uzhavor Pin:</span>
                          <Badge variant="outline">{selectedProduct.farmer.uzhavarPin}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-blue-200">
                    <CardContent className="p-4">
                      <h4 className="flex items-center mb-3">
                        <Building className="w-4 h-4 mr-2 text-blue-600" />
                        Uzhavan Santhai Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Shop:</span>
                          <span className="font-medium">{selectedProduct.uzhavanSanthai?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Manager:</span>
                          <span>{selectedProduct.uzhavanSanthai?.manager}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Phone:</span>
                          <span>{selectedProduct.uzhavanSanthai?.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Hours:</span>
                          <span className="text-green-600">{selectedProduct.uzhavanSanthai?.operatingHours}</span>
                        </div>
                        <div className="pt-2">
                          <span className="text-xs text-gray-600">Address:</span>
                          <p className="text-sm">{selectedProduct.uzhavanSanthai?.address}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Card className="border border-purple-200">
                <CardContent className="p-4">
                  <h4 className="flex items-center mb-3">
                    <Shield className="w-4 h-4 mr-2 text-purple-600" />
                    Blockchain Verification
                  </h4>
                  <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-xs">
                    <div>BLOCKCHAIN_TX_HASH: {selectedProduct.blockchainTx}</div>
                    <div>VERIFICATION_STATUS: ✅ VERIFIED</div>
                    <div>NETWORK: GreenLedger_MainNet</div>
                    <div>CONFIRMATIONS: 156</div>
                    <div>TIMESTAMP: {new Date().toISOString()}</div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex space-x-3">
                <Button className="flex-1" onClick={() => {
                  navigator.clipboard.writeText(selectedProduct.qrCode);
                  toast.success('QR Code copied to clipboard!');
                }}>
                  <QrCode className="w-4 h-4 mr-2" />
                  Copy QR Code
                </Button>
                <Button variant="outline" onClick={() => {
                  navigator.clipboard.writeText(selectedProduct.blockchainTx);
                  toast.success('Blockchain TX copied!');
                }}>
                  <Shield className="w-4 h-4 mr-2" />
                  Copy TX Hash
                </Button>
                <Button variant="outline" onClick={() => {
                  toast.success('Product details shared!');
                }}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Enhanced Receipt Modal */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Receipt className="w-5 h-5 mr-2 text-green-600" />
              Blockchain-Verified Digital Receipt
            </DialogTitle>
          </DialogHeader>
          {selectedReceipt && (
            <div className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
                <h3 className="text-lg text-green-800">🌾 GreenLedger Receipt</h3>
                <p className="text-sm text-gray-600">Blockchain Verified • Farm Direct • Zero Middlemen</p>
                <div className="flex justify-center mt-3">
                  <div className="w-24 h-24 bg-white rounded-lg border p-2">
                    <img src={selectedReceipt.qrCode} alt="Receipt QR" className="w-full h-full" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="flex items-center mb-2">
                      <User className="w-4 h-4 mr-2 text-blue-600" />
                      Customer Details
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div>Name: {selectedReceipt.customerName}</div>
                      <div>Phone: {selectedReceipt.customerPhone}</div>
                      <div>Receipt ID: {selectedReceipt.id}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="flex items-center mb-2">
                      <CreditCard className="w-4 h-4 mr-2 text-purple-600" />
                      Payment Details
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div>Method: {selectedReceipt.paymentMethod}</div>
                      <div>TXN ID: {selectedReceipt.transactionId}</div>
                      <div>Date: {new Date(selectedReceipt.timestamp).toLocaleDateString()}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="p-4">
                  <h4 className="flex items-center mb-3">
                    <Package className="w-4 h-4 mr-2 text-green-600" />
                    Order Items
                  </h4>
                  {selectedReceipt.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-gray-600 ml-2">(Qty: {item.quantity})</span>
                      </div>
                      <span className="font-medium">₹{item.total.toLocaleString()}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200">
                <CardContent className="p-4">
                  <h4 className="flex items-center mb-3">
                    <IndianRupee className="w-4 h-4 mr-2 text-green-600" />
                    Payment Summary
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>₹{selectedReceipt.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax (5%):</span>
                      <span>₹{selectedReceipt.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Delivery Fee:</span>
                      <span>₹{selectedReceipt.deliveryFee.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold text-green-600">
                      <span>Total:</span>
                      <span>₹{selectedReceipt.total.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex space-x-3">
                <Button 
                  className="flex-1" 
                  onClick={() => downloadReceipt(selectedReceipt)}
                  disabled={!selectedReceipt.downloadable}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Receipt
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => printReceipt(selectedReceipt)}
                  disabled={!selectedReceipt.printable}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print Receipt
                </Button>
                <Button variant="outline" onClick={() => {
                  navigator.clipboard.writeText(selectedReceipt.transactionId);
                  toast.success('Transaction ID copied!');
                }}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}