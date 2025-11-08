import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { 
  QrCode, 
  Package, 
  User, 
  MapPin, 
  Calendar,
  Shield,
  Star,
  Leaf,
  TrendingUp,
  Eye,
  Hash,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { qrHistoryManager, QRHistoryEntry, generateQRCodeUrl, createQRData, getCropImageUrl } from '../../data/qrHistory';
import { toast } from 'sonner@2.0.3';

interface ProductItem {
  id: string;
  name: string;
  variety: string;
  type: string;
  quantity: number;
  unit: string;
  price: number;
  farmer: string;
  farmerId: string;
  warehouseId: string;
  warehouseName: string;
  taluk: string;
  district: string;
  qualityGrade: string;
  organic: boolean;
  harvestDate: string;
}

interface WarehouseProductGridProps {
  searchQuery?: string;
  sortBy?: string;
  filterBy?: string[];
}

export function WarehouseProductGrid({ 
  searchQuery = '', 
  sortBy = 'name',
  filterBy = []
}: WarehouseProductGridProps) {
  const { t } = useLanguage();
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrEntry, setQREntry] = useState<QRHistoryEntry | null>(null);
  const [hoveredQR, setHoveredQR] = useState<string | null>(null);

  // Generate dummy product data from QR history
  const products = useMemo(() => {
    const history = qrHistoryManager.getHistory();
    
    return history.slice(0, 30).map((entry, index) => ({
      id: entry.productId,
      name: entry.productName,
      variety: entry.cropType,
      type: entry.cropType,
      quantity: parseInt(entry.quantity),
      unit: entry.unit,
      price: entry.price,
      farmer: entry.farmerName,
      farmerId: entry.farmerId,
      warehouseId: entry.warehouseId,
      warehouseName: entry.warehouseName,
      taluk: entry.taluk,
      district: entry.district,
      qualityGrade: entry.qualityGrade,
      organic: entry.organicCertified,
      harvestDate: entry.harvestDate,
      qrEntry: entry
    }));
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          product.name.toLowerCase().includes(query) ||
          product.farmer.toLowerCase().includes(query) ||
          product.district.toLowerCase().includes(query) ||
          product.type.toLowerCase().includes(query)
        );
      }
      return true;
    });

    // Apply filters
    if (filterBy.includes('organic')) {
      filtered = filtered.filter(p => p.organic);
    }
    if (filterBy.includes('high-grade')) {
      filtered = filtered.filter(p => p.qualityGrade === 'A+');
    }

    // Sort products
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.price - a.price;
        case 'quantity':
          return b.quantity - a.quantity;
        case 'recent':
          return new Date(b.harvestDate).getTime() - new Date(a.harvestDate).getTime();
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [products, searchQuery, sortBy, filterBy]);

  const handleQRClick = (product: any) => {
    const qrData = createQRData({
      qrCodeId: `QR-${product.warehouseId.split('-')[1]}-${product.id.slice(-3)}`,
      productId: product.id,
      productName: product.name,
      farmerName: product.farmer,
      warehouseId: product.warehouseId,
      blockchainHash: `0x${Math.random().toString(16).substring(2, 42)}`,
      module: 'warehouse'
    });

    const entry: QRHistoryEntry = {
      id: `entry-${Date.now()}`,
      qrCodeId: `QR-${product.warehouseId.split('-')[1]}-${product.id.slice(-3)}`,
      productId: product.id,
      productName: product.name,
      cropType: product.type,
      farmerName: product.farmer,
      farmerId: product.farmerId,
      warehouseId: product.warehouseId,
      warehouseName: product.warehouseName,
      taluk: product.taluk,
      district: product.district,
      blockchainHash: `0x${Math.random().toString(16).substring(2, 42)}`,
      dateGenerated: new Date().toISOString(),
      qrCodeUrl: generateQRCodeUrl(qrData),
      module: 'warehouse',
      action: 'generated',
      quantity: product.quantity.toString(),
      unit: product.unit,
      price: product.price,
      qualityGrade: product.qualityGrade,
      organicCertified: product.organic,
      harvestDate: product.harvestDate,
      storageConditions: '15-25°C, Humidity: 60-70%',
      carbonFootprint: Math.round((Math.random() * 3 + 0.5) * 100) / 100,
      predictiveAnalytics: {
        expectedSale: Math.floor(Math.random() * 500000) + 100000,
        profitMargin: Math.floor(Math.random() * 40) + 15,
        demandForecast: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
        stockLevel: ['Optimal', 'Low', 'High'][Math.floor(Math.random() * 3)],
        lossRisk: Math.floor(Math.random() * 20) + 5
      },
      cropImage: getCropImageUrl(product.name)
    };

    setQREntry(entry);
    setShowQRModal(true);
    toast.success(`Generated QR code for ${product.name}`);
  };

  const handleViewDetails = (product: any) => {
    setSelectedProduct(product);
  };

  return (
    <div className="space-y-6">
      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-green-50/30 border-green-100">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-sm font-semibold text-green-800 mb-1">
                      {product.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">{product.variety}</p>
                  </div>
                  
                  {/* QR Code Button with Glow Effect */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={() => setHoveredQR(product.id)}
                    onMouseLeave={() => setHoveredQR(null)}
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQRClick(product)}
                      className={`h-8 w-8 p-0 relative overflow-hidden border-green-200 hover:border-green-400 transition-all duration-300 ${
                        hoveredQR === product.id ? 'shadow-lg shadow-green-400/50' : ''
                      }`}
                    >
                      {/* Animated glow background */}
                      {hoveredQR === product.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 opacity-20 animate-pulse"
                        />
                      )}
                      
                      <QrCode className={`w-4 h-4 relative z-10 transition-colors duration-300 ${
                        hoveredQR === product.id ? 'text-green-600' : 'text-green-500'
                      }`} />
                      
                      {/* Sparkle effects on hover */}
                      {hoveredQR === product.id && (
                        <>
                          <motion.div
                            className="absolute -top-1 -right-1 text-yellow-400"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Sparkles className="w-2 h-2" />
                          </motion.div>
                          <motion.div
                            className="absolute -bottom-1 -left-1 text-blue-400"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            <Sparkles className="w-1.5 h-1.5" />
                          </motion.div>
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>

                {/* Product Image */}
                <div className="mt-3 relative overflow-hidden rounded-lg">
                  <img
                    src={getCropImageUrl(product.name)}
                    alt={product.name}
                    className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge 
                      variant={product.qualityGrade === 'A+' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      <Star className="w-3 h-3 mr-1" />
                      {product.qualityGrade}
                    </Badge>
                  </div>
                  {product.organic && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                        <Leaf className="w-3 h-3 mr-1" />
                        Organic
                      </Badge>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-3">
                {/* Price and Quantity */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-bold text-green-700">₹{product.price.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">per {product.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{product.quantity.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{product.unit} available</p>
                  </div>
                </div>

                {/* Farmer Info */}
                <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg">
                  <User className="w-4 h-4 text-amber-600" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-amber-800">{product.farmer}</p>
                    <p className="text-xs text-amber-600">{product.district}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{product.taluk}, {product.district}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewDetails(product)}
                    className="flex-1 h-8 text-xs"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 h-8 text-xs bg-green-600 hover:bg-green-700"
                  >
                    <Package className="w-3 h-3 mr-1" />
                    Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* QR Code Modal */}
      {showQRModal && qrEntry && (
        <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-700">
                <QrCode className="w-5 h-5" />
                Warehouse QR Code
                <Badge variant="secondary" className="bg-green-100 text-green-700 ml-2">
                  <Shield className="w-3 h-3 mr-1" />
                  Blockchain Verified
                </Badge>
              </DialogTitle>
            </DialogHeader>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* QR Code Display */}
              <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-amber-50">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-6">
                    <motion.div 
                      className="bg-white p-4 rounded-xl shadow-lg border-2 border-green-200 relative overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 opacity-20 animate-pulse"></div>
                      <div className="absolute inset-[2px] bg-white rounded-lg"></div>
                      
                      <img 
                        src={qrEntry.qrCodeUrl} 
                        alt={`QR Code for ${qrEntry.productName}`}
                        className="w-48 h-48 relative z-10"
                      />
                      
                      <motion.div
                        className="absolute top-2 right-2 text-yellow-400"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-4 h-4" />
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Product Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-green-100">
                        <Hash className="w-4 h-4 text-green-600" />
                        <span className="font-medium">Product ID:</span>
                        <Badge variant="outline" className="text-xs font-mono">{qrEntry.productId}</Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-green-100">
                        <Package className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Product:</span>
                        <span className="text-blue-700 font-semibold">{qrEntry.productName}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-green-100">
                        <User className="w-4 h-4 text-orange-600" />
                        <span className="font-medium">Farmer:</span>
                        <span className="text-orange-700 font-semibold">{qrEntry.farmerName}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-green-100">
                        <MapPin className="w-4 h-4 text-red-600" />
                        <span className="font-medium">Location:</span>
                        <span className="text-red-700">{qrEntry.district}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-green-100">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                        <span className="font-medium">Expected Sale:</span>
                        <span className="text-purple-700">₹{qrEntry.predictiveAnalytics.expectedSale.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-green-100">
                        <Shield className="w-4 h-4 text-green-600" />
                        <span className="font-medium">Quality:</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          {qrEntry.qualityGrade}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Predictive Analytics */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Predictive Analytics
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <p className="font-semibold text-blue-700">{qrEntry.predictiveAnalytics.demandForecast}</p>
                        <p className="text-xs text-muted-foreground">Demand</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-green-700">{qrEntry.predictiveAnalytics.profitMargin}%</p>
                        <p className="text-xs text-muted-foreground">Profit Margin</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-purple-700">{qrEntry.predictiveAnalytics.stockLevel}</p>
                        <p className="text-xs text-muted-foreground">Stock Level</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-red-700">{qrEntry.predictiveAnalytics.lossRisk}%</p>
                        <p className="text-xs text-muted-foreground">Loss Risk</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-green-700">{selectedProduct.name} - Details</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src={getCropImageUrl(selectedProduct.name)}
                  alt={selectedProduct.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedProduct.name}</h3>
                  <p className="text-muted-foreground">{selectedProduct.variety}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Price</p>
                    <p className="text-green-700 font-semibold">₹{selectedProduct.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-medium">Quantity</p>
                    <p className="font-semibold">{selectedProduct.quantity} {selectedProduct.unit}</p>
                  </div>
                  <div>
                    <p className="font-medium">Quality</p>
                    <p className="font-semibold">{selectedProduct.qualityGrade}</p>
                  </div>
                  <div>
                    <p className="font-medium">Organic</p>
                    <p className="font-semibold">{selectedProduct.organic ? 'Yes' : 'No'}</p>
                  </div>
                </div>
                
                <div>
                  <p className="font-medium">Farmer</p>
                  <p className="text-amber-700 font-semibold">{selectedProduct.farmer}</p>
                  <p className="text-sm text-muted-foreground">{selectedProduct.district}</p>
                </div>
                
                <div>
                  <p className="font-medium">Harvest Date</p>
                  <p className="text-sm">{new Date(selectedProduct.harvestDate).toLocaleDateString()}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleQRClick(selectedProduct)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Generate QR
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Package className="w-4 h-4 mr-2" />
                    Place Order
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}