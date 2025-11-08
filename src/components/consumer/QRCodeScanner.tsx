import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { QrCode, Search, MapPin, User, Package, CheckCircle, ShoppingCart, Leaf, History } from 'lucide-react';
import { odishaQRResults } from '../../data/odishaConsumerData';
import { QRHistoryViewer } from '../qr/QRHistoryViewer';
import { qrHistoryManager } from '../../data/qrHistory';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'sonner';

interface QRCodeScannerProps {
  onAddToCart: (product: any) => void;
}

// Get crop-specific realistic images
const getCropImage = (cropName: string): string => {
  const name = cropName.toLowerCase();
  
  if (name.includes('paddy') || (name.includes('rice') && !name.includes('basmati'))) {
    return "https://images.unsplash.com/photo-1591807105152-594ed605cc58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWRkeSUyMHJpY2UlMjBjcm9wcyUyMGZpZWxkfGVufDF8fHx8MTc1ODQzNjY5OXww&ixlib=rb-4.1.0&q=80&w=1080";
  }
  if (name.includes('basmati')) {
    return "https://images.unsplash.com/photo-1705147289789-6df2593f1b1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNtYXRpJTIwcmljZSUyMGdyYWlucyUyMHdoaXRlfGVufDF8fHx8MTc1ODQzNTkxN3ww&ixlib=rb-4.1.0&q=80&w=1080";
  }
  if (name.includes('turmeric')) {
    return "https://images.unsplash.com/photo-1615485500834-bc10199bc727?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dXJtZXJpYyUyMHNwaWNlJTIwcG93ZGVyJTIweWVsbG93fGVufDF8fHx8MTc1ODQzNzIyNXww&ixlib=rb-4.1.0&q=80&w=1080";
  }
  
  // Default image
  return "https://images.unsplash.com/photo-1591807105152-594ed605cc58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWRkeSUyMHJpY2UlMjBjcm9wcyUyMGZpZWxkfGVufDF8fHx8MTc1ODQzNjY5OXww&ixlib=rb-4.1.0&q=80&w=1080";
};

export function QRCodeScanner({ onAddToCart }: QRCodeScannerProps) {
  const [qrInput, setQrInput] = useState('');
  const [scanResult, setScanResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'scan' | 'history'>('scan');
  const { t } = useLanguage();

  const handleQRScan = async () => {
    if (!qrInput.trim()) {
      toast.error('Please enter a QR code');
      return;
    }

    setLoading(true);
    
    // Simulate scanning delay
    setTimeout(() => {
      // First try to find in our enhanced QR database
      const qrEntry = qrHistoryManager.findByQRCode(qrInput.trim());
      
      if (qrEntry) {
        // Update the entry to mark it as scanned
        qrHistoryManager.updateEntry(qrEntry.qrCodeId, {
          dateScanned: new Date().toISOString(),
          action: 'scanned'
        });
        
        setScanResult({
          ...qrEntry,
          isEnhanced: true
        });
        
        toast.success('QR Code Verified!');
      } else {
        // Fallback to legacy database
        const result = odishaQRResults.qr_database.find(item => 
          item.qr_code === qrInput.trim()
        );
        
        if (result) {
          setScanResult({
            ...result,
            isEnhanced: false
          });
          toast.success('QR Code found');
        } else {
          toast.error('QR Code not found');
          setScanResult(null);
        }
      }
      
      setLoading(false);
    }, 1500);
  };

  const handleAddToCart = () => {
    if (scanResult) {
      const product = scanResult.isEnhanced ? {
        id: scanResult.qrCodeId,
        name: scanResult.productName,
        variety: scanResult.cropType,
        farmer: scanResult.farmerName,
        location: `${scanResult.taluk}, ${scanResult.district}`,
        price: scanResult.price,
        rating: 4.5,
        organic: scanResult.organicCertified,
        batch_id: scanResult.productId,
        blockchain_hash: scanResult.blockchainHash,
        warehouse: scanResult.warehouseName,
        image: scanResult.cropImage,
        carbonSaved: scanResult.carbonFootprint,
        qualityGrade: scanResult.qualityGrade,
        quantity: scanResult.quantity,
        unit: scanResult.unit
      } : {
        id: scanResult.qr_code,
        name: scanResult.product_info.product_name,
        variety: scanResult.product_info.variety,
        farmer: scanResult.farmer_info.farmer_name,
        location: scanResult.farmer_info.farm_location,
        price: 35,
        rating: 4.5,
        organic: scanResult.farmer_info.organic_certified,
        batch_id: scanResult.product_info.batch_id,
        blockchain_hash: scanResult.blockchain_info?.transaction_hash || 'N/A',
        warehouse: scanResult.warehouse_info?.warehouse_name || 'Unknown',
        image: getCropImage(scanResult.product_info.product_name),
        carbonSaved: 1.5
      };
      
      onAddToCart(product);
      toast.success(`${product.name} added to cart!`);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="scan" className="flex items-center gap-2">
                <QrCode className="w-4 h-4" />
                QR Scanner
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="w-4 h-4" />
                Scan History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scan" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-blue-600" />
                    QR Code Scanner
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Enter or scan QR code to get complete product information
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter QR Code (e.g., QR-KHO-000001)"
                      value={qrInput}
                      onChange={(e) => setQrInput(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleQRScan}
                      disabled={loading || !qrInput.trim()}
                      className="px-6"
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Search className="w-4 h-4" />
                        </motion.div>
                      ) : (
                        <>
                          <Search className="w-4 h-4 mr-2" />
                          Scan
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm font-medium mb-2">Try these demo QR codes:</p>
                    <div className="flex flex-wrap gap-2">
                      {qrHistoryManager.getHistory().slice(0, 4).map(entry => (
                        <Button
                          key={entry.qrCodeId}
                          variant="outline"
                          size="sm"
                          onClick={() => setQrInput(entry.qrCodeId)}
                          className="text-xs"
                        >
                          {entry.qrCodeId}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {scanResult && scanResult.isEnhanced && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 mt-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-green-600" />
                        Blockchain Verified Product
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <motion.img
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            src={scanResult.cropImage}
                            alt={scanResult.productName}
                            className="w-full h-32 object-cover rounded-lg border-2 border-green-200"
                          />
                          <div className="text-center">
                            <Badge variant="outline" className={scanResult.organicCertified ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}>
                              <Leaf className="w-3 h-3 mr-1" />
                              {scanResult.organicCertified ? 'Organic Certified' : 'Farm Fresh'}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="md:col-span-2 space-y-3">
                          <div>
                            <h3 className="font-semibold text-lg">{scanResult.productName}</h3>
                            <p className="text-muted-foreground">Crop Type: {scanResult.cropType}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge>QR: {scanResult.qrCodeId}</Badge>
                              <Badge variant="outline">Grade {scanResult.qualityGrade}</Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Quantity:</span>
                              <p className="font-medium">{scanResult.quantity} {scanResult.unit}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Price:</span>
                              <p className="font-medium">₹{scanResult.price}/{scanResult.unit}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Carbon Footprint:</span>
                              <p className="font-medium">{scanResult.carbonFootprint}kg CO₂</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Harvest Date:</span>
                              <p className="font-medium">{new Date(scanResult.harvestDate).toLocaleDateString()}</p>
                            </div>
                          </div>

                          <div className="bg-blue-50 rounded-lg p-3">
                            <h4 className="font-medium text-blue-800 mb-2">Market Analytics</h4>
                            <div className="grid grid-cols-3 gap-3 text-xs">
                              <div>
                                <span className="text-blue-600">Expected Value:</span>
                                <p className="font-bold">₹{scanResult.predictiveAnalytics.expectedSale.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-blue-600">Profit Margin:</span>
                                <p className="font-bold">{scanResult.predictiveAnalytics.profitMargin}%</p>
                              </div>
                              <div>
                                <span className="text-blue-600">Demand:</span>
                                <p className="font-bold">{scanResult.predictiveAnalytics.demandForecast}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5 text-orange-600" />
                        Farmer Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div>
                            <p className="font-medium">{scanResult.farmerName}</p>
                            <p className="text-sm text-muted-foreground">ID: {scanResult.farmerId}</p>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3 mr-1" />
                            {scanResult.taluk}, {scanResult.district}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Storage Conditions:</span>
                            <p className="font-medium">{scanResult.storageConditions}</p>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Blockchain Hash:</span>
                            <p className="font-mono text-xs break-all">{scanResult.blockchainHash}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-green-800">Add this verified product to your cart</h3>
                          <p className="text-sm text-green-600">
                            Blockchain verified • Grade {scanResult.qualityGrade} • {scanResult.organicCertified ? 'Organic' : 'Traditional'}
                          </p>
                        </div>
                        <Button 
                          onClick={handleAddToCart}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {scanResult && !scanResult.isEnhanced && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 mt-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-green-600" />
                        Product Information
                        <Badge variant="outline" className="ml-auto">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <motion.img
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            src={getCropImage(scanResult.product_info.product_name)}
                            alt={scanResult.product_info.product_name}
                            className="w-full h-32 object-cover rounded-lg border-2 border-green-200"
                          />
                          <div className="text-center">
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              <Leaf className="w-3 h-3 mr-1" />
                              Farm Fresh
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="md:col-span-2 space-y-3">
                          <div>
                            <h3 className="font-semibold text-lg">{scanResult.product_info.product_name}</h3>
                            <p className="text-muted-foreground">Variety: {scanResult.product_info.variety}</p>
                            <Badge className="mt-2">
                              Batch: {scanResult.product_info.batch_id}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            {scanResult.farmer_info.organic_certified && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Organic Certified
                              </Badge>
                            )}
                            <div className="text-sm text-muted-foreground">
                              Quality Grade: <span className="font-medium text-green-600">{scanResult.warehouse_info?.quality_grade || 'A'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-green-800">Add this product to your cart</h3>
                          <p className="text-sm text-green-600">
                            Quality assured • Farm fresh • {scanResult.farmer_info.organic_certified ? 'Organic' : 'Traditional'}
                          </p>
                        </div>
                        <Button 
                          onClick={handleAddToCart}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <QRHistoryViewer 
                module="consumer"
                showFilters={true}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}