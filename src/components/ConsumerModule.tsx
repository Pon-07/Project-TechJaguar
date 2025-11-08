import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ShoppingCart, 
  Heart, 
  TrendingUp, 
  TrendingDown,
  Leaf,
  MapPin,
  Clock,
  Star,
  Truck,
  CreditCard,
  Navigation,
  Package,
  QrCode,
  Phone,
  Bell,
  Search,
  BarChart3,
  Receipt
} from 'lucide-react';
import { ShoppingCart as CartComponent } from './consumer/ShoppingCart';
import { CarbonFootprintTracker } from './consumer/CarbonFootprintTracker';
import { PriceFluctuationTracker } from './consumer/PriceFluctuationTracker';
import { OrderHistory } from './consumer/OrderHistory';
import { TrackingMap3D } from './tracking/TrackingMap3D';
import { TrackingOverview } from './tracking/TrackingOverview';
import { TrackingTimeline } from './tracking/TrackingTimeline';
import { LiveTrackingMap } from './tracking/LiveTrackingMap';
import { FarmerFriendlyOverview } from './tracking/FarmerFriendlyOverview';
import { AmazonStyleTimeline } from './tracking/AmazonStyleTimeline';
import { CallButton } from './CallButton';
import { QRCodeScanner } from './consumer/QRCodeScanner';
import { FarmerQRScanner } from './consumer/FarmerQRScanner';
import { ProductCatalog } from './consumer/ProductCatalog';
import { PaymentSystem } from './consumer/PaymentSystem';
import { PredictiveAnalytics } from './consumer/PredictiveAnalytics';
import { ProductDetailsModal } from './consumer/ProductDetailsModal';
import { NotificationCenter } from './consumer/NotificationCenter';
import { ZomatoStyleOrdering } from './consumer/ZomatoStyleOrdering';
import { QRSystemHub } from './qr/QRSystemHub';
import { PredictiveAnalyticsHub } from './analytics/PredictiveAnalyticsHub';
import { useLanguage } from '../contexts/LanguageContext';
import { trackingData } from '../data/tracking';
import { odishaConsumerProducts, OdishaProduct, odishaConsumerSupport, odishaDummyOrders } from '../data/odishaConsumerData';
import { toast } from 'sonner';
import { notificationManager } from './NotificationSystem';

// Import the crop image function
import { odishaConsumerProducts } from '../data/odishaConsumerData';

// Get realistic Odisha-specific crop images
const getCropImage = (cropName: string): string => {
  const name = cropName.toLowerCase();
  
  if (name.includes('basmati')) {
    return "https://images.unsplash.com/photo-1705147289789-6df2593f1b1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNtYXRpJTIwcmljZSUyMGdyYWlucyUyMHdoaXRlfGVufDF8fHx8MTc1ODQzNTkxN3ww&ixlib=rb-4.1.0&q=80&w=1080";
  }
  if (name.includes('tomato') || name.includes('vegetable')) {
    return "https://images.unsplash.com/photo-1580206134556-88e026cc9a7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGVzJTIwdG9tYXRvJTIwY3JvcHN8ZW58MXx8fHwxNzU4NDM2NzEzfDA&ixlib=rb-4.1.0&q=80&w=1080";
  }
  if (name.includes('coconut')) {
    return "https://images.unsplash.com/photo-1757332050856-edeb5bf846be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGNvY29udXQlMjBmcnVpdCUyMHRyb3BpY2FsfGVufDF8fHx8MTc1ODQzNzIyMnww&ixlib=rb-4.1.0&q=80&w=1080";
  }
  
  return "https://images.unsplash.com/photo-1591807105152-594ed605cc58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWRkeSUyMHJpY2UlMjBjcm9wcyUyMGZpZWxkfGVufDF8fHx8MTc1ODQzNjY5OXww&ixlib=rb-4.1.0&q=80&w=1080";
};

const featuredProducts = [
  {
    id: 1,
    name: 'Premium Basmati Rice',
    farmer: 'Bhuban Mohan Sahoo',
    location: 'Khordha, Odisha',
    price: 85,
    originalPrice: 95,
    rating: 4.8,
    image: getCropImage('Premium Basmati Rice'),
    carbonReduction: 2.3,
    communityVotes: 847,
    priceChange: -5,
    deliveryTime: '2-3 days'
  },
  {
    id: 2,
    name: 'Organic Mixed Vegetables',
    farmer: 'Priya Das',
    location: 'Cuttack, Odisha',
    price: 45,
    originalPrice: 52,
    rating: 4.6,
    image: getCropImage('Organic Mixed Vegetables'),
    carbonReduction: 1.8,
    communityVotes: 623,
    priceChange: -8,
    deliveryTime: '1-2 days'
  },
  {
    id: 3,
    name: 'Fresh Coconut',
    farmer: 'Jagannath Pradhan',
    location: 'Puri, Odisha',
    price: 120,
    originalPrice: 135,
    rating: 4.9,
    image: getCropImage('Fresh Coconut'),
    carbonReduction: 3.1,
    communityVotes: 954,
    priceChange: 2,
    deliveryTime: '1 day'
  }
];

export function ConsumerModule() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<OdishaProduct | null>(null);
  const [totalCarbonSaved, setTotalCarbonSaved] = useState(12.7);
  const [selectedTracking, setSelectedTracking] = useState<string>();
  const [activeTab, setActiveTab] = useState('dashboard');
  const { t } = useLanguage();

  // Get consumer-relevant tracking data (orders with consumers)
  const consumerTrackingData = trackingData.filter(route => route.consumer);

  const addToCart = (product: any) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, carbonSaved: product.carbonReduction || product.carbon_saved_per_kg || Math.random() * 2 + 1 }];
    });
    
    // Enhanced notification with details
    toast.success(
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <ShoppingCart className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <p className="font-medium">{product.name} added to cart!</p>
          <p className="text-sm text-muted-foreground">₹{product.price || product.price_per_kg}/kg</p>
        </div>
      </div>
    );
    
    // Update notification system
    notificationManager?.showLocationUpdate?.({
      currentLocation: 'Cart Updated',
      farmerName: `${product.name} added successfully`
    });
  };

  const handleProductView = (product: OdishaProduct) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleProductClick = (productId: string) => {
    const product = odishaConsumerProducts.products.find(p => p.id === productId);
    if (product) {
      handleProductView(product);
    }
  };

  const handleNotificationAction = (notificationId: string, action: string) => {
    switch (action) {
      case 'Track Order':
      case 'Track Live':
        setActiveTab('tracking');
        break;
      case 'View Receipt':
        toast.info('Receipt viewer would open here');
        break;
      case 'View Product':
      case 'Shop Now':
        setActiveTab('catalog');
        break;
      case 'Add to Cart':
        setActiveTab('catalog');
        break;
      case 'Call Driver':
        toast.info(`Calling delivery driver...`);
        break;
      default:
        toast.info(`Action: ${action}`);
    }
  };

  const handlePaymentSuccess = (receipt: any) => {
    // Clear cart after successful payment
    setCartItems([]);
    setShowPayment(false);
    
    // Update carbon saved
    setTotalCarbonSaved(prev => prev + (receipt.carbon_saved || 0));
    
    // Enhanced success notifications
    toast.success(
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <Receipt className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <p className="font-medium">Payment Successful!</p>
          <p className="text-sm text-muted-foreground">Receipt generated for ₹{receipt.total_amount?.toFixed(2)}</p>
          <p className="text-xs text-green-600">Order ID: {receipt.order_id}</p>
        </div>
      </div>,
      { duration: 5000 }
    );

    // Show notification via notification manager
    setTimeout(() => {
      notificationManager?.showLocationUpdate?.({
        currentLocation: 'Order Confirmed',
        farmerName: `Receipt ready for download`
      });
    }, 1000);

    // Additional notification for delivery
    setTimeout(() => {
      toast.info(
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Truck className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium">Preparing for delivery</p>
            <p className="text-sm text-muted-foreground">Expected delivery: 24 hours</p>
          </div>
        </div>,
        { duration: 4000 }
      );
    }, 2000);
    
    // Switch to tracking tab
    setActiveTab('tracking');
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('consumer.dashboard')}</h1>
            <p className="text-blue-100">
              Community-fixed prices • Blockchain secured • Zero middlemen
            </p>
            <div className="flex items-center mt-2 space-x-4">
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Leaf className="w-3 h-3 mr-1" />
                {totalCarbonSaved} kg {t('consumer.carbonSaved')}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Star className="w-3 h-3 mr-1" />
                Verified Farmers Only
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => setShowCart(true)}
                className="bg-white/20 hover:bg-white/30 text-white relative"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {t('consumer.shopping')} ({cartCount})
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Button>
            </motion.div>
            {cartTotal > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm mt-1 bg-white/20 rounded px-2 py-1"
              >
                ₹{cartTotal.toLocaleString()}
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Leaf className="w-24 h-24" />
          </motion.div>
        </div>
      </motion.div>

      {/* Consumer Support Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-orange-600" />
              Customer Support & Information
            </CardTitle>
            <p className="text-muted-foreground">
              Get help with orders, delivery tracking, and farmer information
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CallButton
                phoneNumber={odishaConsumerSupport.customer_support}
                label="Customer Support"
                description="General help and order assistance"
                module="consumer"
                size="md"
              />
              <CallButton
                phoneNumber={odishaConsumerSupport.warehouse_support}
                label="Warehouse Support"
                description="Product availability and warehouse info"
                module="consumer"
                size="md"
              />
              <CallButton
                phoneNumber={odishaConsumerSupport.farmer_helpdesk}
                label="Farmer Helpdesk"
                description="Connect directly with farmers"
                module="consumer"
                size="md"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Deals', value: '23', icon: TrendingDown, color: 'text-green-600' },
          { label: t('consumer.priceTracker'), value: '18%', icon: TrendingUp, color: 'text-blue-600' },
          { label: 'Delivery Time', value: '2 hrs', icon: Truck, color: 'text-purple-600' },
          { label: t('nav.greenPoints'), value: '1,250', icon: Leaf, color: 'text-green-600' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="ordering" className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Shop Now
          </TabsTrigger>
          <TabsTrigger value="qr" className="flex items-center gap-2">
            <QrCode className="w-4 h-4" />
            QR System
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            AI Analytics
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="tracking" className="flex items-center gap-2">
            <Navigation className="w-4 h-4" />
            Live Tracking
          </TabsTrigger>
        </TabsList>

        {/* Zomato-Style Ordering Tab */}
        <TabsContent value="ordering" className="space-y-6">
          <ZomatoStyleOrdering />
        </TabsContent>

        {/* QR System Tab */}
        <TabsContent value="qr">
          <div className="space-y-6">
            {/* Farmer QR Scanner - Primary Feature */}
            <FarmerQRScanner />
            
            {/* General QR System */}
            <QRSystemHub userType="consumer" />
          </div>
        </TabsContent>

        {/* Predictive Analytics Tab */}
        <TabsContent value="analytics">
          <PredictiveAnalyticsHub viewMode="consumer" />
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <NotificationCenter onNotificationAction={handleNotificationAction} />
        </TabsContent>

        {/* Tracking Tab */}
        <TabsContent value="tracking">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-blue-600" />
                  {t('consumer.orderTracking')} - Amazon Style
                </CardTitle>
                <p className="text-muted-foreground">
                  Watch your farm-fresh products journey from harvest to your doorstep
                </p>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      {t('consumer.orderHistory')}
                    </TabsTrigger>
                    <TabsTrigger value="map3d" className="flex items-center gap-2">
                      <Navigation className="w-4 h-4" />
                      {t('tracking.liveTracking')}
                    </TabsTrigger>
                    <TabsTrigger value="timeline" className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Timeline
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="mt-6">
                    <FarmerFriendlyOverview 
                      trackingData={consumerTrackingData}
                      selectedTracking={selectedTracking}
                      onTrackingSelect={setSelectedTracking}
                      viewMode="consumer"
                    />
                  </TabsContent>
                  
                  <TabsContent value="map3d" className="mt-6">
                    <LiveTrackingMap 
                      trackingData={consumerTrackingData}
                      selectedTracking={selectedTracking}
                      onTrackingSelect={setSelectedTracking}
                      viewMode="consumer"
                    />
                  </TabsContent>
                  
                  <TabsContent value="timeline" className="mt-6">
                    {selectedTracking ? (
                      <AmazonStyleTimeline 
                        trackingRoute={consumerTrackingData.find(route => route.tracking_id === selectedTracking)!}
                        viewMode="consumer"
                      />
                    ) : (
                      <Card className="text-center py-12">
                        <CardContent>
                          <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Select an Order</h3>
                          <p className="text-muted-foreground">
                            Choose an order from your orders list to view detailed tracking
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Features Grid - Only show on dashboard */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CarbonFootprintTracker totalSaved={totalCarbonSaved} />
          <PriceFluctuationTracker />
        </div>
      )}

      {activeTab === 'dashboard' && <OrderHistory />}

      {/* Shopping Cart */}
      {showCart && (
        <CartComponent
          items={cartItems}
          onClose={() => setShowCart(false)}
          onUpdateQuantity={(id, quantity) => {
            if (quantity === 0) {
              setCartItems(prev => prev.filter(item => item.id !== id));
            } else {
              setCartItems(prev =>
                prev.map(item =>
                  item.id === id ? { ...item, quantity } : item
                )
              );
            }
          }}
          onCheckout={() => {
            setShowCart(false);
            setShowPayment(true);
          }}
        />
      )}

      {/* Payment System */}
      {showPayment && (
        <PaymentSystem
          cartItems={cartItems}
          totalAmount={cartTotal}
          onPaymentSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
        />
      )}

      {/* Product Details Modal */}
      {showProductModal && selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => {
            setShowProductModal(false);
            setSelectedProduct(null);
          }}
          onAddToCart={addToCart}
        />
      )}
    </div>
  );
}