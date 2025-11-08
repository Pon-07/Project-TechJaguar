import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  QrCode, 
  Package, 
  Shield, 
  Eye, 
  Download, 
  Printer, 
  Plus,
  MapPin,
  Calendar,
  Leaf,
  TrendingUp,
  History,
  Zap,
  Star
} from 'lucide-react';
import { EnhancedQRGenerator } from '../qr/EnhancedQRGenerator';
import { QRHistoryViewer } from '../qr/QRHistoryViewer';
import { qrProducts, getProductsByFarmer, QRProduct } from '../../data/qrProducts';
import { QRHistoryEntry, qrHistoryManager, getCropImageUrl } from '../../data/qrHistory';
import { toast } from 'sonner@2.0.3';
import { notificationManager } from '../NotificationSystem';
import { useLanguage } from '../../contexts/LanguageContext';

interface FarmerQRHubProps {
  user: any;
}

export function FarmerQRHub({ user }: FarmerQRHubProps) {
  const [selectedProduct, setSelectedProduct] = useState<QRProduct | null>(null);
  const [selectedQREntry, setSelectedQREntry] = useState<Partial<QRHistoryEntry> | null>(null);
  const [activeTab, setActiveTab] = useState<'my-products' | 'generate' | 'history'>('my-products');
  const { t } = useLanguage();

  // Get farmer's products - for demo, we'll match by similar names or show all
  const farmerProducts = getProductsByFarmer(user.name) || qrProducts.slice(0, 3);
  
  // Get farmer's QR history
  const farmerQRHistory = qrHistoryManager.getHistoryByFarmer(user.name);

  const handleProductSelect = (product: QRProduct) => {
    setSelectedProduct(product);
    
    // Convert QRProduct to QRHistoryEntry format
    const qrEntry: Partial<QRHistoryEntry> = {
      productName: product.cropType,
      cropType: product.cropType,
      farmerName: user.name,
      farmerId: user.uzhavarPin,
      warehouseId: `WH-${user.district?.substring(0, 3).toUpperCase() || 'GEN'}-001`,
      warehouseName: `${user.district || 'General'} Central Warehouse`,
      taluk: user.taluk || product.taluk,
      district: user.district || 'Odisha',
      quantity: product.quantity,
      unit: product.unit,
      price: product.pricePerUnit,
      qualityGrade: product.qualityGrade,
      organicCertified: product.organicCertified,
      harvestDate: product.harvestDate,
      storageConditions: `${product.storageTemp}, Moisture: ${product.moistureContent}`,
      carbonFootprint: product.carbonFootprint,
      cropImage: getCropImageUrl(product.cropType),
      predictiveAnalytics: {
        expectedSale: product.totalValue,
        profitMargin: product.profitMargin,
        demandForecast: product.lossRisk < 10 ? 'High' : product.lossRisk < 20 ? 'Medium' : 'Low',
        stockLevel: 'Optimal',
        lossRisk: product.lossRisk
      }
    };
    
    setSelectedQREntry(qrEntry);
    setActiveTab('generate');
  };

  const handleQRGenerated = (qrEntry: QRHistoryEntry) => {
    // Show enhanced notification when QR is generated
    notificationManager.showQRGenerated({
      productName: qrEntry.productName,
      farmerName: qrEntry.farmerName,
      qrCodeUrl: qrEntry.qrCodeUrl,
      qrCode: qrEntry.qrCodeId
    });

    toast.success(
      <div className="flex items-center space-x-3">
        <img 
          src={qrEntry.cropImage} 
          alt={qrEntry.productName}
          className="w-8 h-8 object-cover rounded"
        />
        <div>
          <p className="font-medium">QR Code Generated!</p>
          <p className="text-sm text-muted-foreground">ID: {qrEntry.qrCodeId}</p>
        </div>
      </div>,
      { duration: 5000 }
    );
  };

  const handleQRScan = (qrData: string) => {
    try {
      const parsedData = JSON.parse(qrData);
      const product = qrProducts.find(p => p.qrCodeId === parsedData.qrCodeId);
      if (product) {
        setSelectedProduct(product);
        toast.success(`QR Code verified for ${product.cropType}`);
      } else {
        toast.error('Invalid QR Code');
      }
    } catch (error) {
      toast.error('Failed to process QR Code');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <QrCode className="w-6 h-6" />
              Uzhavar QR Code Hub
            </h2>
            <p className="text-green-100 mt-1">
              Generate unique QR codes for every product with blockchain verification
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{farmerQRHistory.length}</div>
            <div className="text-sm text-green-100">QR Codes Generated</div>
            <div className="text-xs text-green-100 mt-1">
              {farmerQRHistory.filter(h => h.dateScanned).length} Scanned
            </div>
          </div>
        </div>
      </motion.div>

      {/* QR Hub Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="my-products" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                My Products
              </TabsTrigger>
              <TabsTrigger value="generate" className="flex items-center gap-2">
                <QrCode className="w-4 h-4" />
                Generate QR
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="w-4 h-4" />
                QR History
              </TabsTrigger>
            </TabsList>

            {/* My Products Tab */}
            <TabsContent value="my-products" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {farmerProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-amber-50 hover:shadow-lg transition-all cursor-pointer"
                          onClick={() => handleProductSelect(product)}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-green-700 flex items-center gap-2">
                            <Leaf className="w-5 h-5" />
                            {product.cropType}
                          </CardTitle>
                          <Badge variant="outline" className="bg-white/80">
                            {product.qrCodeId}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Product Info */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-blue-600" />
                              <span>{product.quantity} {product.unit}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-orange-600" />
                              <span>{new Date(product.harvestDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-red-600" />
                              <span>{product.taluk}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-green-600" />
                              <span>₹{product.totalValue.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Predictive Analytics Preview */}
                        <div className="bg-blue-50 rounded-lg p-2 mt-3">
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div>
                              <span className="text-blue-600 font-medium">Profit:</span>
                              <p className="font-bold">{product.profitMargin}%</p>
                            </div>
                            <div>
                              <span className="text-blue-600 font-medium">Risk:</span>
                              <p className="font-bold">{product.lossRisk}%</p>
                            </div>
                            <div>
                              <span className="text-blue-600 font-medium">Carbon:</span>
                              <p className="font-bold">{product.carbonFootprint}kg</p>
                            </div>
                          </div>
                        </div>

                        {/* Status Badges */}
                        <div className="flex gap-2 flex-wrap">
                          <Badge 
                            variant={product.qualityGrade === 'A+' ? 'default' : 'secondary'}
                            className={product.qualityGrade === 'A+' ? 'bg-green-600' : ''}
                          >
                            Grade {product.qualityGrade}
                          </Badge>
                          {product.organicCertified && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              🌱 Organic
                            </Badge>
                          )}
                          {product.verified && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                              <Shield className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>

                        {/* Quick Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProductSelect(product);
                            }}
                          >
                            <Zap className="w-4 h-4 mr-2" />
                            Generate QR
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-green-600 text-green-700 hover:bg-green-50"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* No Products Message */}
              {farmerProducts.length === 0 && (
                <Card className="text-center py-12">
                  <CardContent>
                    <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Products Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Add your first crop to generate Uzhavar QR codes
                    </p>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Generate QR Tab */}
            <TabsContent value="generate" className="mt-6">
              {selectedQREntry ? (
                <EnhancedQRGenerator 
                  entry={selectedQREntry}
                  module="farmer"
                  onGenerated={handleQRGenerated}
                />
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <QrCode className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Select a Product</h3>
                    <p className="text-muted-foreground mb-4">
                      Choose a product from "My Products" to generate its blockchain-verified QR code
                    </p>
                    <Button 
                      onClick={() => setActiveTab('my-products')}
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      View My Products
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* QR History Tab */}
            <TabsContent value="history" className="mt-6">
              <QRHistoryViewer 
                module="farmer"
                farmerName={user.name}
                showFilters={true}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}