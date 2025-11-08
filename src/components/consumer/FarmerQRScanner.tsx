import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { 
  QrCode, 
  Scan, 
  User,
  MapPin,
  Wheat,
  Building,
  Hash,
  Shield,
  CheckCircle,
  AlertTriangle,
  Camera,
  Search,
  Package,
  Star,
  Phone,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface FarmerQRData {
  type: 'farmer';
  id: string;
  name: string;
  uzhavarPin: string;
  aadhaarNumber: string;
  state: string;
  district: string;
  crops: string[];
  landSize: string;
  warehouseId: string;
  blockchainTxHash: string;
  phoneNumber: string;
  verified: boolean;
  generatedAt: string;
}

interface CropData {
  name: string;
  price: number;
  unit: string;
  available: number;
  image: string;
  quality: 'Premium' | 'Standard' | 'Organic';
  harvestDate: string;
}

export function FarmerQRScanner() {
  const [scanMode, setScanMode] = useState<'camera' | 'manual'>('camera');
  const [qrInput, setQrInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<FarmerQRData | null>(null);
  const [showFarmerDetails, setShowFarmerDetails] = useState(false);
  const [availableCrops, setAvailableCrops] = useState<CropData[]>([]);

  // Mock crop data based on farmer's crops
  const generateCropData = (crops: string[]): CropData[] => {
    const cropDatabase: Record<string, CropData> = {
      'Paddy': {
        name: 'Premium Basmati Rice',
        price: 45,
        unit: 'kg',
        available: 500,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
        quality: 'Premium',
        harvestDate: '2024-01-15'
      },
      'Vegetables': {
        name: 'Fresh Mixed Vegetables',
        price: 25,
        unit: 'kg',
        available: 200,
        image: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400',
        quality: 'Organic',
        harvestDate: '2024-01-10'
      },
      'Turmeric': {
        name: 'Organic Turmeric Powder',
        price: 120,
        unit: 'kg',
        available: 100,
        image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400',
        quality: 'Organic',
        harvestDate: '2024-01-05'
      },
      'Wheat': {
        name: 'Golden Wheat Grain',
        price: 28,
        unit: 'kg',
        available: 800,
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
        quality: 'Standard',
        harvestDate: '2024-01-20'
      },
      'Corn': {
        name: 'Sweet Corn',
        price: 35,
        unit: 'kg',
        available: 300,
        image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400',
        quality: 'Premium',
        harvestDate: '2024-01-12'
      }
    };

    return crops.map(crop => 
      cropDatabase[crop] || {
        name: crop,
        price: Math.floor(Math.random() * 50) + 20,
        unit: 'kg',
        available: Math.floor(Math.random() * 500) + 100,
        image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400',
        quality: 'Standard' as const,
        harvestDate: '2024-01-15'
      }
    );
  };

  // Simulate camera scanning
  const handleCameraScan = async () => {
    setIsScanning(true);
    
    try {
      // Simulate camera scanning delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock farmer data
      const mockFarmerData: FarmerQRData = {
        type: 'farmer',
        id: 'FARM-123456',
        name: 'Rajesh Kumar Patel',
        uzhavarPin: 'UZP-KHO-654321',
        aadhaarNumber: '****-****-7890',
        state: 'Odisha',
        district: 'Khordha',
        crops: ['Paddy', 'Vegetables', 'Turmeric'],
        landSize: '7.5 acres',
        warehouseId: 'WH-KHO-45',
        blockchainTxHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
        phoneNumber: '+91-9876543210',
        verified: true,
        generatedAt: new Date().toISOString()
      };

      setScannedData(mockFarmerData);
      setAvailableCrops(generateCropData(mockFarmerData.crops));
      setShowFarmerDetails(true);
      
      // Success notification
      toast.success(`🎉 QR scanned successfully!`, {
        description: `Farmer: ${mockFarmerData.name}, Crops: ${mockFarmerData.crops.join(', ')}`,
        duration: 5000
      });
      
    } catch (error) {
      toast.error('Failed to scan QR code. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  // Handle manual QR input
  const handleManualScan = () => {
    if (!qrInput) {
      toast.error('Please enter QR code data');
      return;
    }

    try {
      // Try to parse QR data
      let farmerData: FarmerQRData;
      
      if (qrInput.startsWith('{')) {
        // JSON format
        farmerData = JSON.parse(qrInput);
      } else {
        // Simple format - create mock data
        farmerData = {
          type: 'farmer',
          id: `FARM-${qrInput.slice(-6)}`,
          name: 'Manual Entry Farmer',
          uzhavarPin: qrInput.includes('UZP') ? qrInput : `UZP-MAN-${qrInput}`,
          aadhaarNumber: '****-****-0000',
          state: 'Odisha',
          district: 'Khordha',
          crops: ['Paddy', 'Vegetables'],
          landSize: '5.0 acres',
          warehouseId: 'WH-MAN-01',
          blockchainTxHash: `0x${qrInput.padStart(40, '0')}`,
          phoneNumber: '+91-9999999999',
          verified: true,
          generatedAt: new Date().toISOString()
        };
      }

      if (farmerData.type !== 'farmer') {
        throw new Error('Invalid farmer QR code');
      }

      setScannedData(farmerData);
      setAvailableCrops(generateCropData(farmerData.crops));
      setShowFarmerDetails(true);
      
      // Success notification
      toast.success(`✅ QR code processed!`, {
        description: `Farmer: ${farmerData.name}, PIN: ${farmerData.uzhavarPin}`,
        duration: 5000
      });
      
    } catch (error) {
      toast.error('Invalid QR code format. Please check and try again.');
    }
  };

  // Add product to cart
  const handleAddToCart = (crop: CropData) => {
    toast.success(`Added ${crop.name} to cart!`, {
      description: `₹${crop.price}/${crop.unit} from ${scannedData?.name}`,
      duration: 3000
    });
  };

  // Call farmer
  const handleCallFarmer = () => {
    if (scannedData?.phoneNumber) {
      toast.info(`Calling ${scannedData.name}...`, {
        description: scannedData.phoneNumber,
        duration: 3000
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-blue-600" />
            Scan Farmer QR Code
          </CardTitle>
          <p className="text-muted-foreground">
            Scan or enter a farmer's QR code to view their details and available products
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Scan Mode Toggle */}
          <div className="flex gap-2">
            <Button
              variant={scanMode === 'camera' ? 'default' : 'outline'}
              onClick={() => setScanMode('camera')}
              className="flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Camera Scan
            </Button>
            <Button
              variant={scanMode === 'manual' ? 'default' : 'outline'}
              onClick={() => setScanMode('manual')}
              className="flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Manual Entry
            </Button>
          </div>

          {/* Camera Scan Mode */}
          {scanMode === 'camera' && (
            <div className="space-y-4">
              <div className="relative">
                <div className="w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  {isScanning ? (
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 mx-auto mb-4"
                      >
                        <Scan className="w-12 h-12 text-blue-600" />
                      </motion.div>
                      <p className="text-lg font-semibold text-blue-600">Scanning QR Code...</p>
                      <p className="text-sm text-muted-foreground">Please hold steady</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-semibold text-gray-600">Camera View</p>
                      <p className="text-sm text-muted-foreground">Point camera at farmer's QR code</p>
                    </div>
                  )}
                </div>

                {/* Scanning overlay */}
                {isScanning && (
                  <motion.div
                    className="absolute inset-0 border-4 border-blue-500 rounded-lg"
                    animate={{ 
                      boxShadow: [
                        "0 0 0 0px rgba(59, 130, 246, 0.7)",
                        "0 0 0 10px rgba(59, 130, 246, 0)",
                        "0 0 0 0px rgba(59, 130, 246, 0)"
                      ]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </div>

              <Button
                onClick={handleCameraScan}
                disabled={isScanning}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {isScanning ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 mr-2"
                    >
                      <Scan className="w-5 h-5" />
                    </motion.div>
                    Scanning...
                  </>
                ) : (
                  <>
                    <Scan className="w-5 h-5 mr-2" />
                    Start Scanning
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Manual Entry Mode */}
          {scanMode === 'manual' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Enter QR Code Data or Uzhavar PIN
                </label>
                <Input
                  placeholder="UZP-KHO-654321 or paste QR JSON data"
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  className="font-mono"
                />
              </div>

              <Button
                onClick={handleManualScan}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <Search className="w-5 h-5 mr-2" />
                Process QR Code
              </Button>
            </div>
          )}

          {/* Demo Instructions */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Demo Instructions</h4>
            <div className="space-y-1 text-sm text-blue-700">
              <p>• <strong>Camera Scan:</strong> Click "Start Scanning" to simulate scanning</p>
              <p>• <strong>Manual Entry:</strong> Enter any Uzhavar PIN (e.g., UZP-KHO-654321)</p>
              <p>• <strong>JSON Data:</strong> Paste complete farmer QR JSON data</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Farmer Details Dialog */}
      <Dialog open={showFarmerDetails} onOpenChange={setShowFarmerDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-green-600" />
              Farmer Details & Products
              {scannedData?.verified && (
                <Badge className="bg-green-100 text-green-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              View comprehensive farmer information, available products, and make purchases directly from the farmer.
            </DialogDescription>
          </DialogHeader>

          {scannedData && (
            <div className="space-y-6">
              {/* Farmer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Farmer Information</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCallFarmer}
                      className="flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Call Farmer
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <User className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Name</p>
                          <p className="font-semibold">{scannedData.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Uzhavar PIN</p>
                          <p className="font-semibold font-mono">{scannedData.uzhavarPin}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-red-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Location</p>
                          <p className="font-semibold">{scannedData.district}, {scannedData.state}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Wheat className="w-5 h-5 text-amber-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Land Size</p>
                          <p className="font-semibold">{scannedData.landSize}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Building className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Warehouse</p>
                          <p className="font-semibold">{scannedData.warehouseId}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Hash className="w-5 h-5 text-indigo-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Blockchain</p>
                          <p className="font-semibold font-mono text-xs">
                            {scannedData.blockchainTxHash.substring(0, 20)}...
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Available Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-green-600" />
                    Available Products ({availableCrops.length})
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Fresh products directly from {scannedData.name}'s farm
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableCrops.map((crop, index) => (
                      <motion.div
                        key={crop.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="relative h-32">
                            <ImageWithFallback
                              src={crop.image}
                              alt={crop.name}
                              className="w-full h-full object-cover"
                            />
                            <Badge 
                              className={`absolute top-2 right-2 ${
                                crop.quality === 'Organic' ? 'bg-green-100 text-green-700' :
                                crop.quality === 'Premium' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {crop.quality}
                            </Badge>
                          </div>
                          
                          <CardContent className="p-4">
                            <h4 className="font-semibold mb-2">{crop.name}</h4>
                            
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Price:</span>
                                <span className="font-semibold text-green-600">
                                  ₹{crop.price}/{crop.unit}
                                </span>
                              </div>
                              
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Available:</span>
                                <span className="font-semibold">{crop.available} {crop.unit}</span>
                              </div>
                              
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Harvest:</span>
                                <span className="text-xs">
                                  {new Date(crop.harvestDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            <Button
                              onClick={() => handleAddToCart(crop)}
                              className="w-full mt-3 bg-green-600 hover:bg-green-700"
                              size="sm"
                            >
                              Add to Cart
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Trust & Verification */}
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-green-800">Verified Farmer</h4>
                      <p className="text-sm text-green-700">
                        This farmer is verified through Aadhaar authentication and blockchain technology.
                        All products are traceable and quality assured.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}