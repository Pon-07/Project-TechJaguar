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
  Globe
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
  delay?: number; // in minutes
}

interface DeliveryVehicle {
  id: string;
  type: 'truck' | 'van' | 'bike';
  driver: {
    name: string;
    phone: string;
    rating: number;
    vehicleNumber: string;
  };
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
    speed: number; // km/h
    direction: number; // degrees
  };
  capacity: string;
  eta: string;
}

interface LiveOrder {
  id: string;
  customer: string;
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
    };
    qrCode: string;
    blockchainTx: string;
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
  };
  orderDate: string;
  estimatedDelivery: string;
  totalAmount: number;
  trackingId: string;
  receiptQR: string;
  receipt?: {
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

// Comprehensive dummy data for Indian locations
const generateIndianDeliveryData = (): LiveOrder[] => {
  const customers = [
    { name: 'Rahul Verma', address: 'Block B, Sector 15, Noida, UP', lat: 28.5925, lng: 77.4143 },
    { name: 'Priya Singh', address: 'Koramangala, Bangalore, KA', lat: 12.9352, lng: 77.6245 },
    { name: 'Amit Patel', address: 'Satellite, Ahmedabad, GJ', lat: 23.0258, lng: 72.5873 },
    { name: 'Sunita Rai', address: 'Banjara Hills, Hyderabad, TS', lat: 17.4126, lng: 78.4484 },
    { name: 'Vikash Kumar', address: 'Boring Road, Patna, BR', lat: 25.6093, lng: 85.1376 },
    { name: 'Meera Sharma', address: 'Civil Lines, Jaipur, RJ', lat: 26.9124, lng: 75.7873 },
    { name: 'Ravi Nair', address: 'Fort Kochi, Kochi, KL', lat: 9.9312, lng: 76.2673 },
    { name: 'Anjali Das', address: 'Park Street, Kolkata, WB', lat: 22.5726, lng: 88.3639 }
  ];

  const uzhavanSanthais = [
    { name: 'Noida Uzhavan Santhai', lat: 28.5672, lng: 77.4085, state: 'UP', district: 'Gautam Buddh Nagar' },
    { name: 'Bangalore Tech Agri Hub', lat: 12.9716, lng: 77.5946, state: 'KA', district: 'Bangalore Urban' },
    { name: 'Ahmedabad Farmers Market', lat: 23.0225, lng: 72.5714, state: 'GJ', district: 'Ahmedabad' },
    { name: 'Hyderabad Agri Center', lat: 17.3850, lng: 78.4867, state: 'TS', district: 'Hyderabad' },
    { name: 'Patna Krishi Bazaar', lat: 25.5941, lng: 85.1376, state: 'BR', district: 'Patna' },
    { name: 'Jaipur Kisan Mandi', lat: 26.9124, lng: 75.7873, state: 'RJ', district: 'Jaipur' },
    { name: 'Kochi Agri Terminal', lat: 9.9312, lng: 76.2673, state: 'KL', district: 'Ernakulam' },
    { name: 'Kolkata Fresh Hub', lat: 22.5726, lng: 88.3639, state: 'WB', district: 'Kolkata' }
  ];

  const products = [
    { id: 'P001', name: 'Premium Basmati Rice', image: 'https://images.unsplash.com/photo-1705147289789-6df2593f1b1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNtYXRpJTIwcmljZSUyMGdyYWlucyUyMHdoaXRlJTIwcHJlbWl1bXxlbnwxfHx8fDE3NTg2MzQyNTd8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'P002', name: 'Organic Tomatoes', image: 'https://images.unsplash.com/photo-1613295759649-e16cdcdf22fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwdmVnZXRhYmxlcyUyMHRvbWF0b2VzJTIwZnJlc2h8ZW58MXx8fHwxNzU4NjM0MjY0fDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'P003', name: 'Golden Wheat', image: 'https://images.unsplash.com/photo-1567395401530-d99add784641?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHdoZWF0JTIwZ3JhaW5zJTIwZ29sZGVufGVufDF8fHx8MTc1ODYzNDI2MXww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'P004', name: 'Fresh Green Peas', image: 'https://images.unsplash.com/photo-1675501347570-cac3b8cbd5c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHBlYXMlMjBmcmVzaCUyMGxlZ3VtZXN8ZW58MXx8fHwxNzU4NjM0MjY4fDA&ixlib=rb-4.1.0&q=80&w=1080' }
  ];

  const farmers = [
    { name: 'Sita Devi', state: 'Punjab', district: 'Amritsar', phone: '+91-98765-43210', uzhavarPin: 'UZH001PB' },
    { name: 'Ramesh Kumar', state: 'Uttar Pradesh', district: 'Aligarh', phone: '+91-98765-43211', uzhavarPin: 'UZH002UP' },
    { name: 'Priya Das', state: 'Maharashtra', district: 'Pune', phone: '+91-98765-43212', uzhavarPin: 'UZH003MH' },
    { name: 'Jagannath Pradhan', state: 'Odisha', district: 'Cuttack', phone: '+91-98765-43213', uzhavarPin: 'UZH004OR' }
  ];

  return customers.slice(0, 6).map((customer, index) => {
    const santhai = uzhavanSanthais[index] || uzhavanSanthais[0];
    const product = products[index % products.length];
    const farmer = farmers[index % farmers.length];
    
    // Generate warehouse coordinates between farmer location and santhai
    const warehouseLat = santhai.lat + (Math.random() - 0.5) * 0.5;
    const warehouseLng = santhai.lng + (Math.random() - 0.5) * 0.5;

    // Generate route points
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
      // Transit points for realistic tracking
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
    
    return {
      id: `ORD-GL-${Date.now().toString().slice(-4) + index}`,
      customer: customer.name,
      items: [{
        id: product.id,
        name: product.name,
        quantity: Math.floor(Math.random() * 5) + 1,
        image: product.image,
        farmer,
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
        alternativeRoutes: Math.floor(Math.random() * 3) + 1
      },
      orderDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      estimatedDelivery: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
      totalAmount: Math.floor(Math.random() * 2000) + 500,
      trackingId: `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      receiptQR: `data:image/svg+xml,${encodeURIComponent(`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="white"/><g fill="black"><rect x="10" y="10" width="10" height="10"/><rect x="30" y="10" width="10" height="10"/><rect x="50" y="10" width="10" height="10"/></g><circle cx="50" cy="50" r="15" fill="white" stroke="black" stroke-width="1"/><text x="50" y="52" text-anchor="middle" font-size="6" fill="green">🌾</text></svg>`)}`
    };
  });
};

interface AmazonStyleLiveTrackingProps {
  orders?: LiveOrder[];
  selectedOrderId?: string;
  onOrderSelect?: (orderId: string) => void;
}

export function AmazonStyleLiveTracking({ 
  orders: propOrders, 
  selectedOrderId, 
  onOrderSelect 
}: AmazonStyleLiveTrackingProps) {
  const [orders, setOrders] = useState<LiveOrder[]>(propOrders || generateIndianDeliveryData());
  const [selectedOrder, setSelectedOrder] = useState<LiveOrder | null>(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
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
                }))
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
          }
        };
      })
    );

    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('📍 Tracking data updated', {
        description: 'Live locations refreshed'
      });
    }, 1000);
  }, []);

  const handleOrderClick = (order: LiveOrder) => {
    setSelectedOrder(order);
    onOrderSelect?.(order.id);
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
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

  return (
    <div className="space-y-6">
      {/* Header with refresh and controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-green-800">🚚 Live Order Tracking</h2>
          <p className="text-gray-600">Real-time delivery updates from Uzhavan Santhai to your doorstep</p>
        </div>
        <div className="flex items-center space-x-4">
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
        {/* Orders List */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2 text-green-600" />
                Active Deliveries ({orders.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {orders.map((order) => {
                const StatusIcon = getStatusIcon(order.status);
                const isSelected = selectedOrder?.id === order.id;
                
                return (
                  <motion.div
                    key={order.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                    }`}
                    onClick={() => handleOrderClick(order)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <StatusIcon className={`w-4 h-4 ${getStatusColor(order.status).replace('bg-', 'text-')}`} />
                        <span className="font-medium text-sm">{order.trackingId}</span>
                      </div>
                      <Badge variant="secondary" className={`${getStatusColor(order.status)} text-white text-xs`}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{order.customer}</p>
                      <p className="text-xs text-gray-600">{order.items[0].name} (+{order.items.length - 1} more)</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        {order.currentLocation.name}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        ETA: {order.vehicle.eta}
                      </div>
                    </div>

                    {/* Live tracking indicator */}
                    {order.status === 'out_for_delivery' && (
                      <div className="flex items-center mt-2 text-xs">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                        <span className="text-green-600 font-medium">Live Tracking Active</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Map and Details */}
        <div className="lg:col-span-2 space-y-4">
          {selectedOrder ? (
            <>
              {/* Live Map Visualization */}
              <Card>
                <CardHeader>
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
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Map Container - Simulated */}
                  <div className={`w-full h-80 rounded-lg border relative overflow-hidden ${
                    mapView === 'satellite' ? 'bg-green-900' : 'bg-gray-100'
                  }`}>
                    {/* Route Line Animation */}
                    <svg className="absolute inset-0 w-full h-full">
                      <defs>
                        <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#22c55e" stopOpacity="1" />
                          <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="1" />
                        </linearGradient>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                          <feMerge> 
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>
                      
                      {/* Animated Route Path */}
                      <motion.path
                        d={`M 50 280 Q 150 200 250 150 Q 350 100 450 80 Q 550 60 650 50`}
                        stroke="url(#routeGradient)"
                        strokeWidth="4"
                        fill="none"
                        filter="url(#glow)"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                      />
                      
                      {/* Moving Vehicle Animation */}
                      <motion.circle
                        r="8"
                        fill="#3b82f6"
                        stroke="white"
                        strokeWidth="2"
                        initial={{ offsetDistance: "0%" }}
                        animate={{ offsetDistance: "60%" }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      >
                        <animateMotion
                          dur="10s"
                          repeatCount="indefinite"
                          path="M 50 280 Q 150 200 250 150 Q 350 100 450 80 Q 550 60 650 50"
                        />
                      </motion.circle>
                    </svg>

                    {/* Location Markers */}
                    <div className="absolute inset-0">
                      {selectedOrder.route.map((point, index) => {
                        const x = 50 + (index * 150);
                        const y = 280 - (index * 60);
                        
                        return (
                          <motion.div
                            key={point.id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2"
                            style={{ left: `${x}px`, top: `${y}px` }}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.2 }}
                          >
                            <div className={`relative ${
                              point.status === 'completed' ? 'text-green-600' : 
                              point.status === 'current' ? 'text-blue-600' : 'text-gray-400'
                            }`}>
                              {point.type === 'warehouse' && <Factory className="w-6 h-6" />}
                              {point.type === 'uzhavan_santhai' && <Factory className="w-6 h-6" />}
                              {point.type === 'customer' && <Home className="w-6 h-6" />}
                              {point.type === 'transit_point' && <MapPin className="w-6 h-6" />}
                              
                              {point.status === 'current' && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                              )}
                            </div>
                            
                            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap">
                              {point.name}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Weather and Traffic Overlay */}
                    <div className="absolute top-4 right-4 bg-white rounded-lg p-3 shadow-lg">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="text-center">
                          <div className="text-2xl">
                            {selectedOrder.predictiveData.weatherCondition === 'clear' ? '☀️' : 
                             selectedOrder.predictiveData.weatherCondition === 'cloudy' ? '☁️' : '🌧️'}
                          </div>
                          <div className="text-xs text-gray-600">Weather</div>
                        </div>
                        <div className="text-center">
                          <div className={`font-medium ${getTrafficColor(selectedOrder.predictiveData.trafficCondition)}`}>
                            {selectedOrder.predictiveData.trafficCondition.toUpperCase()}
                          </div>
                          <div className="text-xs text-gray-600">Traffic</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Route Timeline */}
                  <div className="mt-4 space-y-2">
                    {selectedOrder.route.map((point, index) => (
                      <div key={point.id} className="flex items-center space-x-4">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          point.status === 'completed' ? 'bg-green-500 border-green-500' :
                          point.status === 'current' ? 'bg-blue-500 border-blue-500 animate-pulse' :
                          'bg-gray-200 border-gray-300'
                        }`}></div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{point.name}</p>
                          <p className="text-xs text-gray-600">
                            {point.actualTime ? 
                              `Completed: ${new Date(point.actualTime).toLocaleString()}` :
                              point.estimatedTime ?
                              `Estimated: ${new Date(point.estimatedTime).toLocaleString()}` :
                              'Pending'
                            }
                          </p>
                        </div>
                        {point.status === 'current' && (
                          <Badge variant="outline" className="text-blue-600 border-blue-600">
                            In Transit
                          </Badge>
                        )}
                        {index < selectedOrder.route.length - 1 && (
                          <div className="w-px h-8 bg-gray-300"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Order Details and Products */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Vehicle & Driver Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Truck className="w-5 h-5 mr-2 text-blue-600" />
                      Vehicle & Driver
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Driver:</span>
                        <div className="text-right">
                          <p className="font-medium">{selectedOrder.vehicle.driver.name}</p>
                          <div className="flex items-center text-sm text-gray-600">
                            <Star className="w-3 h-3 mr-1 text-yellow-500" />
                            {selectedOrder.vehicle.driver.rating.toFixed(1)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Vehicle:</span>
                        <div className="text-right">
                          <p className="font-medium">{selectedOrder.vehicle.driver.vehicleNumber}</p>
                          <p className="text-sm text-gray-600">{selectedOrder.vehicle.type.toUpperCase()} • {selectedOrder.vehicle.capacity}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Speed:</span>
                        <p className="font-medium">{selectedOrder.vehicle.currentLocation.speed} km/h</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">ETA:</span>
                        <p className="font-medium text-green-600">{selectedOrder.vehicle.eta}</p>
                      </div>

                      <Button variant="outline" size="sm" className="w-full">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Driver
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Products */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Package className="w-5 h-5 mr-2 text-green-600" />
                      Order Items ({selectedOrder.items.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item) => (
                        <motion.div
                          key={item.id}
                          className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleProductClick(item)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                            <p className="text-xs text-green-600">{item.farmer.name}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <QrCode className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">Select an Order to Track</h3>
                <p className="text-gray-600">Choose an order from the list to view live tracking details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Product Details Modal */}
      <AnimatePresence>
        {showProductDetails && selectedProduct && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowProductDetails(false)}
          >
            <motion.div
              className="bg-white rounded-lg max-w-md w-full p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Product Details</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowProductDetails(false)}>
                  ×
                </Button>
              </div>

              <div className="space-y-4">
                <ImageWithFallback
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-48 rounded-lg object-cover"
                />

                <div>
                  <h4 className="font-medium text-lg">{selectedProduct.name}</h4>
                  <p className="text-gray-600">Quantity: {selectedProduct.quantity}</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h5 className="font-medium">Farmer Information</h5>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>{selectedProduct.farmer.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{selectedProduct.farmer.district}, {selectedProduct.farmer.state}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{selectedProduct.farmer.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-gray-500" />
                    <span>Uzhavar PIN: {selectedProduct.farmer.uzhavarPin}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h5 className="font-medium">Blockchain Verification</h5>
                  <div className="bg-gray-100 p-2 rounded text-xs font-mono break-all">
                    {selectedProduct.blockchainTx}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button className="flex-1">
                    <QrCode className="w-4 h-4 mr-2" />
                    View QR Code
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Farmer
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}