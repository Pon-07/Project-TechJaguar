import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
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
  Search
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  indiaWideFarmers, 
  indiaWideWarehouses, 
  getCropImage,
  QRCodeData 
} from '../../data/indiaWideData';
import { toast } from 'sonner@2.0.3';

interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  farmer: {
    name: string;
    state: string;
    district: string;
    rating: number;
  };
  warehouse: {
    name: string;
    state: string;
    district: string;
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
}

interface CartItem extends Product {
  quantity: number;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'placed' | 'processing' | 'in_transit' | 'delivered';
  paymentMethod: string;
  deliveryAddress: string;
  placedAt: string;
  estimatedDelivery: string;
  trackingId: string;
}

const mockProducts: Product[] = [
  {
    id: 'PROD001',
    name: 'Premium Basmati Rice',
    price: 55,
    unit: 'kg',
    farmer: {
      name: 'Sita Devi',
      state: 'Tamil Nadu',
      district: 'Thanjavur',
      rating: 4.9
    },
    warehouse: {
      name: 'Chennai Agricultural Hub',
      state: 'Tamil Nadu',
      district: 'Chennai'
    },
    quality: 'Premium',
    organic: true,
    inStock: 150,
    rating: 4.8,
    reviews: 234,
    deliveryTime: '2-3 hours',
    carbonFootprint: 0.5,
    harvestDate: '2024-12-15',
    qrCode: 'QR001_RICE_SITA_TN'
  },
  {
    id: 'PROD002',
    name: 'Organic Wheat',
    price: 30,
    unit: 'kg',
    farmer: {
      name: 'Ramesh Kumar',
      state: 'Maharashtra',
      district: 'Pune',
      rating: 4.7
    },
    warehouse: {
      name: 'Mumbai Central Warehouse',
      state: 'Maharashtra',
      district: 'Mumbai'
    },
    quality: 'Grade A',
    organic: true,
    inStock: 200,
    rating: 4.6,
    reviews: 189,
    deliveryTime: '1-2 hours',
    carbonFootprint: 0.3,
    harvestDate: '2024-12-10',
    qrCode: 'QR002_WHEAT_RAMESH_MH'
  },
  {
    id: 'PROD003',
    name: 'Fresh Groundnuts',
    price: 45,
    unit: 'kg',
    farmer: {
      name: 'Manoj Patra',
      state: 'Odisha',
      district: 'Cuttack',
      rating: 4.3
    },
    warehouse: {
      name: 'Bhubaneswar Storage Complex',
      state: 'Odisha',
      district: 'Bhubaneswar'
    },
    quality: 'Grade A',
    organic: false,
    inStock: 80,
    rating: 4.4,
    reviews: 156,
    deliveryTime: '3-4 hours',
    carbonFootprint: 0.4,
    harvestDate: '2024-12-12',
    qrCode: 'QR003_GROUNDNUT_MANOJ_OR'
  },
  {
    id: 'PROD004',
    name: 'Golden Wheat',
    price: 28,
    unit: 'kg',
    farmer: {
      name: 'Suresh Singh',
      state: 'Punjab',
      district: 'Ludhiana',
      rating: 4.8
    },
    warehouse: {
      name: 'Ludhiana Grain Terminal',
      state: 'Punjab',
      district: 'Ludhiana'
    },
    quality: 'Premium',
    organic: false,
    inStock: 300,
    rating: 4.7,
    reviews: 298,
    deliveryTime: '2-3 hours',
    carbonFootprint: 0.6,
    harvestDate: '2024-12-08',
    qrCode: 'QR004_WHEAT_SURESH_PB'
  },
  {
    id: 'PROD005',
    name: 'Arabica Coffee Beans',
    price: 180,
    unit: 'kg',
    farmer: {
      name: 'Priya Sharma',
      state: 'Karnataka',
      district: 'Bangalore',
      rating: 4.6
    },
    warehouse: {
      name: 'Bangalore Tech Warehouse',
      state: 'Karnataka',
      district: 'Bangalore'
    },
    quality: 'Premium',
    organic: true,
    inStock: 50,
    rating: 4.9,
    reviews: 167,
    deliveryTime: '4-5 hours',
    carbonFootprint: 0.2,
    harvestDate: '2024-12-05',
    qrCode: 'QR005_COFFEE_PRIYA_KA'
  }
];

export function ZomatoStyleOrdering() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rating');
  const [showCheckout, setShowCheckout] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [deliveryAddress, setDeliveryAddress] = useState('');

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
    
    toast.success(t('consumer.addToCart'), {
      description: `${product.name} added to cart`
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

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.farmer.state.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
                           (selectedCategory === 'organic' && product.organic) ||
                           (selectedCategory === 'premium' && product.quality === 'Premium');
    
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

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    if (!deliveryAddress) {
      toast.error('Please enter delivery address');
      return;
    }

    const order: Order = {
      id: `ORD${Date.now()}`,
      items: cart,
      total: getTotalAmount(),
      status: 'placed',
      paymentMethod,
      deliveryAddress,
      placedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
      trackingId: `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    };

    setTimeout(() => {
      setCurrentOrder(order);
      setCart([]);
      setShowCheckout(false);
      setShowOrderSuccess(true);
      
      toast.success(t('notification.paymentSuccess'), {
        description: `Order ${order.id} placed successfully`
      });

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setShowOrderSuccess(false);
      }, 5000);
    }, 2000);
  };

  const generateDigitalReceipt = () => {
    if (!currentOrder) return;

    const receipt = {
      orderId: currentOrder.id,
      items: currentOrder.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
        farmer: item.farmer.name,
        location: `${item.farmer.district}, ${item.farmer.state}`,
        qrCode: item.qrCode
      })),
      total: currentOrder.total,
      paymentMethod: currentOrder.paymentMethod,
      deliveryAddress: currentOrder.deliveryAddress,
      timestamp: currentOrder.placedAt,
      trackingId: currentOrder.trackingId
    };

    const dataStr = JSON.stringify(receipt, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `Receipt_${currentOrder.id}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Digital receipt downloaded');
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <ShoppingCart className="w-6 h-6" />
            Farm-to-Table Marketplace
            {cart.length > 0 && (
              <Badge className="bg-green-100 text-green-800 ml-2">
                {getTotalItems()} items in cart
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search for crops, farmers, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="organic">Organic Only</SelectItem>
                <SelectItem value="premium">Premium Quality</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Best Rated</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="delivery">Fastest Delivery</SelectItem>
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
              <Card className="hover:shadow-lg transition-all hover:scale-105">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={getCropImage(product.name.split(' ')[product.name.split(' ').length - 1])}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 left-2 flex gap-2">
                      {product.organic && (
                        <Badge className="bg-green-100 text-green-800 border-green-300">
                          <Leaf className="w-3 h-3 mr-1" />
                          Organic
                        </Badge>
                      )}
                      {product.quality === 'Premium' && (
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                          <Award className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-white/90 text-gray-800">
                        <Star className="w-3 h-3 mr-1 fill-current text-yellow-500" />
                        {product.rating}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-2xl font-bold text-green-600">
                        ₹{product.price}/{product.unit}
                      </div>
                      <div className="text-sm text-gray-600">
                        {product.inStock} {product.unit} available
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
                        <Clock className="w-3 h-3" />
                        <span>Delivery in {product.deliveryTime}</span>
                      </div>
                    </div>

                    <Separator className="mb-4" />

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Carbon footprint: {product.carbonFootprint}kg CO₂
                      </div>
                      <Button
                        onClick={() => addToCart(product)}
                        className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                        disabled={product.inStock === 0}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Floating Cart */}
      <AnimatePresence>
        {cart.length > 0 && !showCheckout && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-4 left-4 right-4 z-50"
          >
            <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{getTotalItems()} items in cart</h3>
                    <p className="text-sm text-white/80">Total: ₹{getTotalAmount().toLocaleString()}</p>
                  </div>
                  <Button
                    onClick={() => setShowCheckout(true)}
                    className="bg-white text-green-600 hover:bg-gray-100"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    View Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <Card className="border-0">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-6 h-6" />
                      Checkout
                    </div>
                    <Button variant="ghost" onClick={() => setShowCheckout(false)}>
                      ×
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Cart Items */}
                  <div>
                    <h3 className="font-semibold mb-3">Order Summary</h3>
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <img
                              src={getCropImage(item.name.split(' ')[item.name.split(' ').length - 1])}
                              alt={item.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-gray-600">{item.farmer.name} • {item.farmer.district}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeFromCart(item.id)}
                                className="w-8 h-8 p-0"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addToCart(item)}
                                className="w-8 h-8 p-0"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</div>
                              <div className="text-sm text-gray-600">₹{item.price}/{item.unit}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Delivery Address */}
                  <div>
                    <Label htmlFor="address">Delivery Address *</Label>
                    <Input
                      id="address"
                      placeholder="Enter your complete delivery address"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <Label>Payment Method</Label>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="upi" id="upi" />
                        <Label htmlFor="upi" className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4" />
                          UPI (GPay, PhonePe, Paytm)
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
                        <RadioGroupItem value="netbanking" id="netbanking" />
                        <Label htmlFor="netbanking" className="flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          Net Banking
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total Amount</span>
                      <span className="text-2xl font-bold text-green-600">₹{getTotalAmount().toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Including all taxes • Free delivery</p>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 h-12"
                    disabled={!deliveryAddress}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay ₹{getTotalAmount().toLocaleString()}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Success Modal */}
      <AnimatePresence>
        {showOrderSuccess && currentOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg w-full max-w-md"
            >
              <Card className="border-0">
                <CardContent className="p-6 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </motion.div>

                  <h2 className="text-xl font-semibold mb-2">🎉 Order Placed Successfully!</h2>
                  <p className="text-gray-600 mb-4">Your order #{currentOrder.id} has been confirmed</p>

                  <div className="bg-gray-50 p-4 rounded-lg mb-4 text-left">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Order ID:</span>
                        <span className="font-mono">{currentOrder.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tracking ID:</span>
                        <span className="font-mono">{currentOrder.trackingId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Amount:</span>
                        <span className="font-semibold">₹{currentOrder.total.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Payment:</span>
                        <span className="capitalize">{currentOrder.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Est. Delivery:</span>
                        <span>{new Date(currentOrder.estimatedDelivery).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={generateDigitalReceipt}
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Receipt
                    </Button>
                    <Button
                      onClick={() => setShowOrderSuccess(false)}
                      className="flex-1 bg-gradient-to-r from-green-500 to-blue-600"
                    >
                      <Truck className="w-4 h-4 mr-2" />
                      Track Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}